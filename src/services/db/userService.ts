import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase/config';
import type { UserProfile, UserPlan } from '../../types';

const ADMIN_EMAIL = 'umarashiq700800@gmail.com';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createUserProfile(
  userId: string,
  email: string,
  name: string,
  photoURL?: string
): Promise<UserProfile> {
  const path = `users/${userId}`;
  const now = new Date().toISOString();
  const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const newProfile: UserProfile = {
    userId,
    name: name || email.split('@')[0],
    email,
    photoURL: photoURL || '',
    role: isAdmin ? 'admin' : 'user',
    plan: 'free',
    credits: 100, // Default 100 credits per requirements
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'users', userId), newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'name' | 'photoURL'>>
): Promise<void> {
  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function adjustCredits(userId: string, amount: number): Promise<number> {
  const path = `users/${userId}`;
  try {
    const profile = await getUserProfile(userId);
    if (!profile) throw new Error('User not found');
    const newCredits = Math.max(0, profile.credits + amount);
    await updateDoc(doc(db, 'users', userId), {
      credits: newCredits,
      updatedAt: new Date().toISOString(),
    });
    return newCredits;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function adminGetAllUsers(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const q = query(collection(db, 'users'), limit(100));
    const querySnapshot = await getDocs(q);
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminUpdateUser(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
