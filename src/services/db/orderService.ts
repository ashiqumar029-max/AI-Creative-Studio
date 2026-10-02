import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase/config';
import type { Order } from '../../types';

export async function createOrder(data: {
  userId: string;
  userEmail?: string;
  plan: string;
  amount: number;
  credits: number;
  paymentMethod: string;
}): Promise<Order> {
  const path = 'orders';
  const id = 'ord_' + Math.random().toString(36).substring(2, 10);
  const now = new Date().toISOString();

  const order: Order = {
    id,
    userId: data.userId,
    userEmail: data.userEmail || '',
    plan: data.plan,
    amount: data.amount,
    credits: data.credits,
    status: 'completed',
    paymentMethod: data.paymentMethod,
    createdAt: now,
  };

  try {
    await setDoc(doc(db, 'orders', id), order);
    return order;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push(doc.data() as Order);
    });
    return orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminGetAllOrders(): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, 'orders'), limit(100));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push(doc.data() as Order);
    });
    return orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
