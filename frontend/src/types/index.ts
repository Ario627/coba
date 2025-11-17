export interface ErineProfile {
    id: string;
    name: string;
    stageName: string;
    bio: string;
    generation: string;
    birthDate: string;
    position: string;
    joinDate: string;
    imageCover: string;
    imageProfile: string;
    imagePotrait: string;
}

export interface GalleryImage {
    id: string;
    title: string;
    imageUrl: string;
    category: "photoshoot" | "performance" | "candid" | "official";
    date: string;
    description?: string;
}

export interface Schedule {
    id: string;
    tiitle: string;
    type: "performance" | "appearance" | "event" | "meeting";
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description?: string;
    imageUrl?: string;
}

export interface MessagePayload {
    name: string;
    message: string;
}

 export type RequestOptions = {
    cacheKey?: string;
    revalidate?: number;
    signal?: AbortSignal;
    skipCache?: boolean;
};

export interface MessageRecord extends MessagePayload {
    _id: string;
    date: string;
}

export type EventDTO = {
    _id?: string;
    id?: string;
    title: string;
    description?: string;
    date:  string;
    location: string;
    startTime?:  string;
    endTime?: string;
    imageUrl?: string;
}