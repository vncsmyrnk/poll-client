import { apiClient } from './axios';
import type { Poll, VotePayload, User, PollCounts } from '../types';

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>('/api/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const getPolls = async (query?: string): Promise<Poll[]> => {
  const params = query ? { q: query } : {};
  const response = await apiClient.get<Poll[]>('/api/polls', { params });
  return response.data;
};

export const getPoll = async (id: string): Promise<Poll> => {
  const response = await apiClient.get<Poll>(`/api/polls/${id}`);
  return response.data;
};

export const getPollCounts = async (id: string): Promise<PollCounts> => {
  const response = await apiClient.get<PollCounts>(`/api/polls/${id}/count`);
  return response.data;
};

export const votePoll = async (id: string, payload: VotePayload): Promise<void> => {
  await apiClient.post(`/api/polls/${id}/votes`, { option_id: payload.optionId });
};
