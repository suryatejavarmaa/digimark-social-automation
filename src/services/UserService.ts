import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

export interface UserProfile {
    // Step 1
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    role: string;
    businessName: string;
    businessType: string;
    ownerName?: string;
    websiteUrl: string;

    // Step 2
    primaryColor: string;
    accentColor: string;
    visualStyle: string;
    brandVoiceTone: number;
    businessDescription: string;

    // Step 3 (Socials - just tracking connection status for now)
    connectedSocials: string[];

    createdAt: Date;
    email?: string; // Added email to profile
}

export const UserService = {
    // 1. Sign Up: Create Auth User + Save Profile
    signUp: async (email: string, password: string, profileData: Omit<UserProfile, 'createdAt' | 'email'>) => {
        try {
            // A. Create User in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // B. Save Profile to Firestore (using Auth UID as Doc ID)
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                ...profileData,
                email: email,
                createdAt: new Date(),
            });

            console.log('User created and profile saved:', user.uid);
            return user.uid;
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    },

    // 2. Login: Sign in with Email/Password
    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user.uid;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },

    // 3. Logout
    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    },

    // 4. Get User Profile
    getUserProfile: async (userId: string) => {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as UserProfile;
            } else {
                console.log("No such profile!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            throw error;
        }
    },

    // Legacy method (modified to use setDoc if we have an ID, or addDoc if not - but we should prefer signUp)
    saveUserProfile: async (data: Omit<UserProfile, 'createdAt'>) => {
        // This might be used if we want to save data BEFORE auth (not recommended for this flow)
        // or if we want to update. For now, we'll keep it but warn.
        console.warn("Use signUp() to create new users with auth.");
        return null;
    },
};
