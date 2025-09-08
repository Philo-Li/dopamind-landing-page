const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    nickname: string;
    avatarUrl?: string;
    phoneNumber?: string;
    phoneVerified?: boolean;
    emailVerified?: boolean;
    preferredLanguage?: string;
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
    phoneNumber?: string;
    phoneVerified?: boolean;
    emailVerified?: boolean;
    preferredLanguage?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ProfileResponse {
  user: {
    id: string;
    email: string;
    nickname: string;
    avatarUrl?: string;
    phoneNumber?: string;
    phoneVerified?: boolean;
    emailVerified?: boolean;
    preferredLanguage?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PremiumStatus {
  isPremium: boolean;
  expiresAt: Date | null;
  store: string | null;
  type: string | null;
  willRenew: boolean;
  referralCreditDays?: number;
}

export interface ApiError {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`);
    console.log('Request options:', options);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

      // 获取响应文本，用于调试
      const responseText = await response.text();
      console.log('📝 Raw Response:', responseText);

      // 检查响应的内容类型
      const contentType = response.headers.get('content-type');
      console.log('📋 Content-Type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ 非JSON响应内容:', responseText);
        throw new Error(`后端服务器返回了非JSON响应。请检查后端服务是否正常运行在 ${API_BASE_URL}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ Parsed JSON:', data);
      } catch (parseError) {
        console.error('❌ JSON解析失败:', parseError);
        console.error('原始响应内容:', responseText);
        throw new Error('后端返回的不是有效的JSON格式');
      }

      if (!response.ok) {
        console.error('❌ API错误:', data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API请求失败:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`无法连接到后端服务器。请确保后端服务正在运行在 ${API_BASE_URL}`);
      }
      throw error;
    }
  }

  async login(email: string, password: string, preferredLanguage?: string): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, preferredLanguage }),
    });
  }

  async register(
    email: string,
    password: string,
    nickname: string,
    referralCode?: string,
    preferredLanguage?: string
  ): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname, referralCode, preferredLanguage }),
    });
  }

  async getProfile(token: string): Promise<ProfileResponse> {
    return this.makeRequest<ProfileResponse>('/api/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async refreshToken(token: string): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/api/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getPremiumStatus(token: string): Promise<PremiumStatus> {
    return this.makeRequest<PremiumStatus>('/api/user-premium-status/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return this.makeRequest<ForgotPasswordResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    return this.makeRequest<ResetPasswordResponse>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }
}

export const apiService = new ApiService();