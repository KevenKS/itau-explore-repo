export interface Repository {
    id: number;
    full_name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    html_url: string;
  }

  export interface PullRequest {
    id: number;
    title: string;
    body: string;
    state: string;
    created_at: string;
    user: {
      login: string;
      avatar_url: string;
    };
    html_url: string;
  }
