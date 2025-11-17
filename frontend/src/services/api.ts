import "server-only";

import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {Redis} from "@upstash/redis";
import {createHash} from "node:crypto";
import {parseISO} from "date-fns";
import type {ErineProfile, GalleryImage, Schedule} from "@/types";

export interface MessagePayload {
    name: string;
    message: string;
}

export interface MessageRecord extends MessagePayload {
    _id: string;
    date: string;
}

export type RequestOptions = {
    cacheKey?: string;
    cacheTag?: string;
    revalidate?: number;
    signal?: AbortSignal;
    skipCache?: boolean;
};

type EventDTO = {
    _id?: string;
    id?: string;
    title: string;
    description?: string;
    date: string;
    location?: string;
    startTime?: string;
    endTime?: string;
    imageUrl?: string;
};

const DEFAULT_CACHE_TTL = 30_000;
const JSON_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
};
const CACHE_NAMESPACE = "erine:cache:";
const TAG_NAMESPACE = "erine:cache-tag:";
const TAG_REGISTRY_KEY = `${TAG_NAMESPACE}__all`;
const TAG_TTL_BUFFER_SECONDS = 5;

const sharedRedis = (() => {
    try {
        return Redis.fromEnv();
    } catch (error) {
        throw new Error(
            "Upstash Redis environment variables are missing. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
            {cause: error as Error},
        );
    }
})();

export class ErineAPI {
    private api: AxiosInstance;
    private baseURL: string;
    private redis: Redis;

    constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api", redis: Redis = sharedRedis) {
        this.baseURL = baseURL;
        this.redis = redis;
        this.api = axios.create({
            baseURL: this.baseURL,
            timeout: 12_000,
            headers: JSON_HEADERS,
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                const message = error?.response?.data?.message ?? error.message ?? "Unexpected API error";
                return Promise.reject(new Error(message));
            },
        );
    }

    withBaseURL(baseURL: string) {
        return new ErineAPI(baseURL, this.redis);
    }

    async invalidate(pattern?: string | RegExp) {
        if (!pattern) {
            await this.clearAllTags();
            return;
        }

        if (pattern instanceof RegExp) {
            await this.clearMatchingTags(pattern);
            return;
        }

        await this.clearTag(pattern);
    }

    async revalidate(tag: string) {
        await this.clearTag(tag);
    }

    async prefetch(signal?: AbortSignal) {
        await Promise.allSettled([
            this.getProfile({signal}),
            this.getSchedule({signal}),
            this.getMessages({signal}),
        ]);
    }

    async healthCheck(signal?: AbortSignal) {
        return this.request<{status: string}>({url: "/health", method: "GET"}, {signal, skipCache: true});
    }

    async getProfile(options?: RequestOptions) {
        return this.request<ErineProfile>({url: "/profiles", method: "GET"}, {
            cacheKey: "profiles:single",
            cacheTag: "profiles",
            revalidate: options?.revalidate ?? DEFAULT_CACHE_TTL,
            ...options,
        });
    }

    async getGallery(options?: RequestOptions) {
        return this.request<GalleryImage[]>({url: "/gallery", method: "GET"}, {
            cacheKey: "gallery:all",
            cacheTag: "gallery",
            revalidate: options?.revalidate ?? DEFAULT_CACHE_TTL,
            ...options,
        });
    }

    async getSchedule(options?: RequestOptions & {limit?: number}) {
        const events = await this.request<EventDTO[]>({url: "/events", method: "GET"}, {
            cacheKey: "events:list",
            cacheTag: "events",
            revalidate: options?.revalidate ?? DEFAULT_CACHE_TTL,
            ...options,
        });

        const schedules = events.map((event) => this.toSchedule(event));
        if (options?.limit) {
            return schedules.slice(0, options.limit);
        }
        return schedules;
    }

    async getMessages(options?: RequestOptions) {
        return this.request<MessageRecord[]>({url: "/messages", method: "GET"}, {
            cacheKey: "messages:list",
            cacheTag: "messages",
            revalidate: options?.revalidate ?? DEFAULT_CACHE_TTL,
            ...options,
        });
    }

    async sendMessage(payload: MessagePayload) {
        const response = await this.request<{ok: boolean; id: string}>({
            url: "/messages",
            method: "POST",
            data: payload,
        }, {skipCache: true});

        await this.revalidate("messages");
        return response;
    }

    private toSchedule(event: EventDTO): Schedule {
        const isoDate = this.safeISO(event.date);
        return {
            id: event._id ?? event.id ?? this.randomId(),
            tiitle: event.title,
            type: "event",
            date: isoDate.split("T")[0],
            startTime: event.startTime ?? "00:00",
            endTime: event.endTime ?? "23:59",
            location: event.location ?? "TBA",
            description: event.description,
            imageUrl: event.imageUrl,
        } as Schedule;
    }

    private safeISO(value: string) {
        const parsed = parseISO(value);
        if (Number.isNaN(parsed.getTime())) {
            return new Date().toISOString();
        }
        return parsed.toISOString();
    }

    private randomId() {
        const generator = globalThis.crypto?.randomUUID;
        if (generator) {
            return generator.call(globalThis.crypto);
        }
        return Math.random().toString(36).slice(2);
    }

    private async request<T>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        const derivedKey = options?.cacheKey ?? this.cacheKeyFor(config);
        const tag = options?.cacheTag ?? this.tagFromConfig(config);
        const namespacedKey = this.namespacedKey(derivedKey, tag);

        if (!options?.skipCache) {
            const cached = await this.redis.get<T>(namespacedKey);
            if (cached) {
                return cached;
            }
        }

        const response = await this.api.request<T>({...config, signal: options?.signal});
        if (!options?.skipCache) {
            const ttl = options?.revalidate ?? DEFAULT_CACHE_TTL;
            await this.redis.set(namespacedKey, response.data, {px: ttl});
            await this.trackKey(tag, namespacedKey, ttl);
        }
        return response.data;
    }

    private tagFromConfig(config: AxiosRequestConfig) {
        const url = config.url ?? "default";
        const normalized = url.replace(/^\//, "");
        return normalized.split("/")[0] || "default";
    }

    private cacheKeyFor(config: AxiosRequestConfig) {
        return JSON.stringify({url: config.url, method: config.method, params: config.params, data: config.data});
    }

    private namespacedKey(cacheKey: string, tag: string) {
        return `${CACHE_NAMESPACE}${tag}:${this.hash(cacheKey)}`;
    }

    private tagKey(tag: string) {
        return `${TAG_NAMESPACE}${tag}`;
    }

    private hash(value: string) {
        return createHash("sha1").update(value).digest("hex");
    }

    private async trackKey(tag: string, namespacedKey: string, ttl: number) {
        const tagKey = this.tagKey(tag);
        await this.redis.sadd(tagKey, namespacedKey);
        const tagTTL = Math.max(1, Math.ceil(ttl / 1000) + TAG_TTL_BUFFER_SECONDS);
        await this.redis.expire(tagKey, tagTTL);
        await this.redis.sadd(TAG_REGISTRY_KEY, tag);
    }

    private async clearTag(tag: string) {
        const tagKey = this.tagKey(tag);
        const keys = (await this.redis.smembers(tagKey)) as string[];
        if (keys?.length) {
            await this.redis.del(...keys);
        }
        await this.redis.del(tagKey);
        await this.redis.srem(TAG_REGISTRY_KEY, tag);
    }

    private async clearAllTags() {
        const tags = await this.getAllTags();
        await Promise.all(tags.map((tag) => this.clearTag(tag)));
    }

    private async clearMatchingTags(pattern: RegExp) {
        const tags = await this.getAllTags();
        await Promise.all(tags.filter((tag) => pattern.test(tag)).map((tag) => this.clearTag(tag)));
    }

    private async getAllTags() {
        return ((await this.redis.smembers(TAG_REGISTRY_KEY)) as string[]) ?? [];
    }
}

export const erineApi = new ErineAPI();
export default erineApi;
