export interface PollOption {
  id: string;
  text: string;
  vote_count: number;
  percentage: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  views: number;
  options: PollOption[];
}

export interface VotePayload {
  optionId: string;
}

export interface PollCount {
  VoteCount: number;
  Percentage: number;
}

export interface PollCounts {
  [optionId: string]: PollCount;
}

export interface UserVote {
  option_id: string;
}

export interface CreatePollPayload {
  title: string;
  description: string;
  options: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

declare global {
  interface Window {
    env: {
      API_BASE_URL: string;
    };
  }
}