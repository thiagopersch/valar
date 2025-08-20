import createApi from '@/lib/api';
import { getSession } from 'next-auth/react';

export async function listUsers(): Promise<User[]> {
  const session = await getSession();

  if (!session?.token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const api = createApi({ token: session.token });

  const response = await api.get<{ data: User[] }>('/admin/users');

  return response.data.data;
}

export async function getUser(id: string): Promise<User> {
  const session = await getSession();

  if (!session?.token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const api = createApi({ token: session.token });

  const response = await api.get<{ data: User }>(`/admin/users/${id}`);
  return response.data.data;
}

export async function createUser(data: User): Promise<User> {
  const session = await getSession();

  if (!session?.token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const api = createApi({ token: session.token });

  const response = await api.post<User>(`/admin/users`, data);
  return response.data;
}

export async function updateUser(
  id: string,
  data: Partial<User>,
): Promise<User> {
  const session = await getSession();

  if (!session?.token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const api = createApi({ token: session.token });

  const response = await api.patch<User>(`/admin/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string): Promise<boolean> {
  const session = await getSession();

  if (!session?.token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const api = createApi({ token: session.token });

  const response = await api.delete<User>(`/admin/users/${id}`);
  return true;
}
