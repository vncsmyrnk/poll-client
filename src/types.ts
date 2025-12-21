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

declare global {
  interface Window {
    env: {
      API_BASE_URL: string;
    };
  }
}


