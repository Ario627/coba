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

