import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase/config';
import type { Generation, ToolType } from '../../types';

export async function saveGeneration(data: {
  userId: string;
  projectId?: string;
  toolType: ToolType;
  prompt: string;
  settings: Record<string, any>;
  result: Record<string, any>;
  status?: 'generating' | 'completed' | 'failed';
}): Promise<Generation> {
  const path = 'generations';
  const genId = 'gen_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
  const now = new Date().toISOString();

  const record: Generation = {
    id: genId,
    userId: data.userId,
    projectId: data.projectId,
    toolType: data.toolType,
    prompt: data.prompt,
    settings: data.settings,
    result: data.result,
    status: data.status || 'completed',
    createdAt: now,
  };

  try {
    await setDoc(doc(db, 'generations', genId), record);
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${genId}`);
  }
}

export async function getUserGenerations(
  userId: string,
  filterType?: ToolType | 'all'
): Promise<Generation[]> {
  const path = 'generations';
  try {
    let q = query(
      collection(db, 'generations'),
      where('userId', '==', userId),
      limit(100)
    );
    const querySnapshot = await getDocs(q);
    const list: Generation[] = [];
    querySnapshot.forEach((doc) => {
      const item = doc.data() as Generation;
      if (!filterType || filterType === 'all' || item.toolType === filterType) {
        list.push(item);
      }
    });
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteGeneration(id: string): Promise<void> {
  const path = `generations/${id}`;
  try {
    await deleteDoc(doc(db, 'generations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function adminGetAllGenerations(): Promise<Generation[]> {
  const path = 'generations';
  try {
    const q = query(collection(db, 'generations'), limit(150));
    const querySnapshot = await getDocs(q);
    const list: Generation[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Generation);
    });
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
