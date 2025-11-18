import 'server-only';

import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import { Redis } from '@upstash/redis'; 
import { createHash } from 'node:crypto';
import { parseISO } from 'date-fns';
import type { ErineProfile, GalleryImage, Schedule } from '@/types';
import { a, pattern } from 'framer-motion/client';
import { Regex } from 'lucide-react';
import { skip } from 'node:test';

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
}

type EventDTO = {
    _id?: string;
    id?: string;
    title: string;
    description?: string;
    date: string;
    loccation?: string;
    startTime?: string;
    endTime?: string;
    imageUrl?: string;
}

const DEFAULT_CACHE_TTL = 30_000;
const JSON_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
const CACHE_NAMESPACE = 'erine:cache:';
const  TAG_NAMESPACE = 'erine:cache-tag';
const TAG_REGISTRY_KEY  = `${TAG_NAMESPACE}__all`;
const TAG_TTL_BUFFER_SECONDS = 5;

const sharedRedis =(() => {
    try {
        return Redis.fromEnv();
    } catch(error) {
        throw new Error(
            "Upstash Radis environment variables are missing. Please set UPTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
            {cause:  error as Error}
        );
    }
})();

export class ErineAPI {
    private api: AxiosInstance;
    private baseURL: string;
    private redis: Redis;

    constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api", redis: Redis = sharedRedis) {
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

    withuBaseURL(baseURL: string) {
        return new ErineAPI(baseURL, this.redis);
    }
    
    async invaliDate(pattern: string | RegExp) {
        if(!pattern) {
            await this.clearAllTags();
            return;
        }

        if(pattern){
            await this.clearMatchingTags(pattern);
            return;
        }
        await this.clearTag(pattern);
    }
    async revalidate(tag: string) {
        await this.clearTag(tag);
    }

    private async clearAllTags() {
        const allTags = await this.redis.smembers(TAG_REGISTRY_KEY);
        await Promise.all(allTags.map((tag) => this.clearTag(tag)));   
    }
    private async clearMatchingTags(pattern: string | RegExp) {
        const tags = await this.redis.smembers(TAG_REGISTRY_KEY);
        const regex =
            typeof pattern === 'string' 
                ? new RegExp(pattern)
                : pattern;
        await Promise.all(
            tags.filter((tag) => regex.test(tag)).map((tag) => this.clearTag(tag))
        );
    }
    private async clearTag(tag: string) {
        const tagKey = `${TAG_NAMESPACE}:${tag}`;
        const cacheKeys = await this.redis.smembers(tagKey);
        if(cacheKeys.length) {
            await Promise.all(cacheKeys.map((key) => this.redis.del(key)));
        }

        await this.redis.del(tagKey);
        await this.redis.srem(TAG_REGISTRY_KEY, tag);
    }

    async prefetch(signal?: AbortSignal) {
        await Promise.allSettled([
            this.getProfile({signal}),
            this.getSchedule({signal}),
            this.getMessages({signal}),
        ]);
    }

    async helathCheck(signal?: AbortSignal) {
        return this.request<{status: string}>({url: '/health', method: 'GET'}, { signal, skipCache: true});
    }

    
}