
export const SocialService = {
    isConnected: (platform: string): boolean => {
        const key = `social_connected_${platform.toLowerCase()}`;
        return localStorage.getItem(key) === 'true';
    },

    connect: (platform: string): void => {
        const key = `social_connected_${platform.toLowerCase()}`;
        localStorage.setItem(key, 'true');
    },

    disconnect: (platform: string): void => {
        const key = `social_connected_${platform.toLowerCase()}`;
        localStorage.removeItem(key);
    },

    disconnectAll: (): void => {
        ['linkedin', 'instagram', 'facebook', 'twitter', 'youtube'].forEach(p => {
            localStorage.removeItem(`social_connected_${p}`);
        });
        localStorage.removeItem('twitter_username');
        localStorage.removeItem('facebook_username');
    },

    // Mock method to simulate checking status from backend if needed
    checkConnectionStatus: async (userId: string): Promise<Record<string, boolean>> => {
        // In a real app, fetch from Firestore
        return {
            linkedin: localStorage.getItem('social_connected_linkedin') === 'true',
            instagram: localStorage.getItem('social_connected_instagram') === 'true',
            facebook: localStorage.getItem('social_connected_facebook') === 'true',
            twitter: localStorage.getItem('social_connected_twitter') === 'true',
        };
    }
};
