import api from "@/lib/axios";
import { Message } from "@/types";

export const messageService = {
    getMessages: async(): Promise<Message[]> => {
        const response = await api.get('/api/messages');
        return response.data;
    },

    sendMessage: async(data: Omit<Message, 'id' | 'createdAt'>): Promise<Message> => {
        const response =await api.post('/api/messages', data);
        return response.data;
    }
}