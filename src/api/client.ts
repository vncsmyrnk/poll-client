import axios from 'axios';
import type { Poll, VotePayload, User } from '../types';

const API_BASE_URL = window.env?.API_BASE_URL || 'https://poll-api.vncsmyrnk.dev/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>('/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const getPolls = async (query?: string): Promise<Poll[]> => {
  const params = query ? { q: query } : {};
  const response = await apiClient.get<Poll[]>('/polls', { params });
  return response.data;
};

export const getPoll = async (id: string): Promise<Poll> => {
  const response = await apiClient.get<Poll>(`/polls/${id}`);
  return response.data;
};

export const votePoll = async (id: string, payload: VotePayload): Promise<void> => {
  await apiClient.post(`/polls/${id}/votes`, { option_id: payload.optionId });
};


