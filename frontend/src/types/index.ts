export interface Profile {
    id: string;
    name: string;
    bio: string;
    image: string;
    joinDate?: string;
    position?: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location?: string;
    image?: string;
}

export interface Message {
    id: string;
    name: string;
    email: string;
    content: string;
    createdAt: string;
}