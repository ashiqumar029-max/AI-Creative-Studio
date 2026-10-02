import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase/config';
import type { PortfolioItem, PortfolioCategory } from '../../types';

export async function getPortfolioItems(
  category?: PortfolioCategory
): Promise<PortfolioItem[]> {
  const path = 'portfolio';
  try {
    const q = query(collection(db, 'portfolio'), limit(50));
    const querySnapshot = await getDocs(q);
    const items: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      const item = doc.data() as PortfolioItem;
      if (!category || category === 'all' || item.category === category) {
        items.push(item);
      }
    });
    return items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createPortfolioItem(
  data: Omit<PortfolioItem, 'id' | 'createdAt'>
): Promise<PortfolioItem> {
  const path = 'portfolio';
  const id = 'port_' + Math.random().toString(36).substring(2, 10);
  const now = new Date().toISOString();

  const item: PortfolioItem = {
    ...data,
    id,
    createdAt: now,
  };

  try {
    await setDoc(doc(db, 'portfolio', id), item);
    return item;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }
}

export async function updatePortfolioItem(
  id: string,
  updates: Partial<Omit<PortfolioItem, 'id' | 'createdAt'>>
): Promise<void> {
  const path = `portfolio/${id}`;
  try {
    await updateDoc(doc(db, 'portfolio', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const path = `portfolio/${id}`;
  try {
    await deleteDoc(doc(db, 'portfolio', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
