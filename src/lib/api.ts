const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    nickname: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    nickname: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiError {
  message: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    email: string,
    password: string,
    nickname: string,
    referralCode?: string
  ): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname, referralCode }),
    });
  }

  async getProfile(token: string) {
    return this.makeRequest('/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async refreshToken(token: string): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();