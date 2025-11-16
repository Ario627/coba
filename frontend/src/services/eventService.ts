import api from "@/lib/axios";
import { Event } from "@/types";

export const eventService = {
    getEvents: async(): Promise<Event[]> => {
        const response = await api.get('/api/events');
        return response.data;
    },

    createEvent: async(data: Omit<Event, 'id'>): Promise<Event> => {
        const response = await  api.post('/api/events', data);
        return response.data;   
    },

    deleteEvent: async(id:string): Promise<void> => {
        await api.delete(`/api/events/${id}`);
    },
};