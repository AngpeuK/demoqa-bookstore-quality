import { APIRequestContext, APIResponse } from '@playwright/test';

interface TokenResponse {
  token: string;
  expires: string;
  status: string;
  result: string;
}

export class AccountClient {
  public constructor(private readonly request: APIRequestContext) {}

  public async createUser(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/Account/v1/User', { data: { userName: username, password } });
  }

  public async generateToken(username: string, password: string): Promise<TokenResponse> {
    const response = await this.request.post('/Account/v1/GenerateToken', {
      data: { userName: username, password },
    });
    return (await response.json()) as TokenResponse;
  }

  public async getUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.get(`/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  public async deleteUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
