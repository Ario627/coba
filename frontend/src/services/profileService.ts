import api from "@/lib/axios";
import { Profile } from "@/types";

export const profileService = {
    getProfile: async(): Promise<Profile> => {
        const response = await api.get('/api/profiles');
        return response.data;
    },

    updateProfile: async(data: Partial<Profile>): Promise<Profile> => {
        const response = await api.put('/api/profiles', data);
        return response.data;
    }
}