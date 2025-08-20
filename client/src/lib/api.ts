import axios from 'axios';
import { signOut } from 'next-auth/react';

const createApi = (session: { token: string }) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    timeout: 10000,
    withCredentials: true,
  });

  api.interceptors.request.use(async (config) => {
    if (config.method !== 'get') {
      const csrfBaseURL =
        process.env.API_URL?.replace('/api', '') + '/sanctum/csrf-cookie';
      await axios.get(csrfBaseURL, { withCredentials: true });
    }
    const params = config.params || {};
    config.params = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== '' && value !== undefined && value !== null,
      ),
    );
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (
        error.response?.status === 401 &&
        error.response?.data?.message === 'Unauthorized'
      ) {
        await signOut({
          callbackUrl: '/login',
          redirect: true,
        });
        return Promise.reject(
          new Error('Sessão expirada. Faça login novamente.'),
        );
      }
      return Promise.reject(
        new Error(
          error.response?.data?.message ||
            'Erro na requisição. Tente novamente.',
        ),
      );
    },
  );

  return api;
};

export default createApi;
