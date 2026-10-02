import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getUserProfile, createUserProfile, adjustCredits } from '../services/db/userService';
import type { UserProfile } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: (asAdmin?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  deductCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'umarashiq700800@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            // Document does not exist yet; create it
            profile = await createUserProfile(
              user.uid,
              user.email || '',
              user.displayName || user.email?.split('@')[0] || 'Creator',
              user.photoURL || undefined
            );
          }
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Fallback in-memory profile if network is down
          setUserProfile({
            userId: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Creator',
            email: user.email || '',
            role: user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
            plan: 'free',
            credits: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        // Check for local demo session if applicable
        const demoSession = localStorage.getItem('ai_studio_demo_user');
        if (demoSession) {
          try {
            const parsed = JSON.parse(demoSession);
            setUserProfile(parsed);
          } catch (e) {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signupWithEmail = async (email: string, password: string, name: string) => {
    localStorage.removeItem('ai_studio_demo_user');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (name) {
      await updateProfile(user, { displayName: name });
    }
    const profile = await createUserProfile(user.uid, email, name);
    setUserProfile(profile);
  };

  const loginWithEmail = async (email: string, password: string) => {
    localStorage.removeItem('ai_studio_demo_user');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    localStorage.removeItem('ai_studio_demo_user');
    await signInWithPopup(auth, googleProvider);
  };

  const loginAsDemoUser = async (asAdmin: boolean = false) => {
    const demoProfile: UserProfile = {
      userId: asAdmin ? 'demo-admin-id' : 'demo-user-id',
      name: asAdmin ? 'Lead Admin (Demo)' : 'Alex Vance (Creator)',
      email: asAdmin ? ADMIN_EMAIL : 'creator.demo@aistudio.io',
      role: asAdmin ? 'admin' : 'user',
      plan: asAdmin ? 'business' : 'pro',
      credits: asAdmin ? 9999 : 350,
      photoURL: asAdmin
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('ai_studio_demo_user', JSON.stringify(demoProfile));
    setUserProfile(demoProfile);
  };

  const logout = async () => {
    localStorage.removeItem('ai_studio_demo_user');
    setUserProfile(null);
    if (auth.currentUser) {
      await fbSignOut(auth);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshProfile = async () => {
    if (currentUser) {
      const p = await getUserProfile(currentUser.uid);
      if (p) setUserProfile(p);
    }
  };

  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!userProfile) return false;
    if (userProfile.credits < amount) return false;

    if (currentUser) {
      try {
        const newCredits = await adjustCredits(currentUser.uid, -amount);
        setUserProfile((prev) => (prev ? { ...prev, credits: newCredits } : null));
        return true;
      } catch (e) {
        console.error('Failed to deduct credits in database:', e);
      }
    }

    // Local / Demo update
    const updated = { ...userProfile, credits: Math.max(0, userProfile.credits - amount) };
    setUserProfile(updated);
    if (localStorage.getItem('ai_studio_demo_user')) {
      localStorage.setItem('ai_studio_demo_user', JSON.stringify(updated));
    }
    return true;
  };

  const addCredits = async (amount: number) => {
    if (!userProfile) return;
    if (currentUser) {
      try {
        const newCredits = await adjustCredits(currentUser.uid, amount);
        setUserProfile((prev) => (prev ? { ...prev, credits: newCredits } : null));
        return;
      } catch (e) {
        console.error('Failed to add credits in database:', e);
      }
    }

    // Local / Demo update
    const updated = { ...userProfile, credits: userProfile.credits + amount };
    setUserProfile(updated);
    if (localStorage.getItem('ai_studio_demo_user')) {
      localStorage.setItem('ai_studio_demo_user', JSON.stringify(updated));
    }
  };

  const isAdmin =
    userProfile?.role === 'admin' ||
    userProfile?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        signupWithEmail,
        loginWithEmail,
        loginWithGoogle,
        loginAsDemoUser,
        logout,
        resetPassword,
        refreshProfile,
        deductCredits,
        addCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
