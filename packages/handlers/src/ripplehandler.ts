import { betterFetch } from "@better-fetch/fetch";
import type { UserResponse, UsersResponse } from "./types";
import type { IServerApiHandler } from "./iserverapihandler";

type RippleOnlineUsersResponse = {
  message: string;
  result: number;
  status: number;
};

type RippleDeltaClientsResponse = {
  connected_users: number;
};

type RippleUserInfoResponse = {
  id: number;
  username: string;
};

export class RippleApiHandler implements IServerApiHandler {
  constructor(private baseUrl: string) {}

  private async makeRequest<T>(url: string, params?: any): Promise<T | null> {
    try {
      const response = await betterFetch<T>(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        query: params,
        throw: false,
      });

      if (response.error) {
        if (response.error.status === 404) {
          return null;
        }

        throw new Error(
          `Request to ${url} resulted in status code ${response.error.status} - ${response.error.statusText}`,
        );
      }

      return response.data;
    } catch {
      return null;
    }
  }

  private async makeBanchoRequest<T>(
    endpoint: string,
    params?: any,
  ): Promise<T | null> {
    const apiUrl = this.baseUrl.replace("https://", "https://c.");
    const url = `${apiUrl}${endpoint}`;
    return this.makeRequest<T>(url, params);
  }

  private async makeApiRequest<T>(
    endpoint: string,
    params?: any,
  ): Promise<T | null> {
    // fun
    const url = `${this.baseUrl}${endpoint}`;
    return this.makeRequest<T>(url, params);
  }

  public async fetchUserCounts(): Promise<UsersResponse> {
    let data: RippleOnlineUsersResponse | RippleDeltaClientsResponse | null =
      await this.makeBanchoRequest<RippleOnlineUsersResponse>(
        "/api/v1/onlineUsers",
      );

    if (!data) {
      data =
        await this.makeBanchoRequest<RippleDeltaClientsResponse>(
          "/api/v2/clients",
        );

      if (!data) {
        /* throw new Error("Failed to fetch user counts"); */
        return { onlineCount: -1, totalCount: -1 };
      }
    }

    return {
      // what the hell
      onlineCount: "result" in data ? data.result : data.connected_users,
      totalCount: -1, // Ripple does not provide total user count
    };
  }

  public async fetchUserInfo(username: string): Promise<UserResponse | null> {
    const data = await this.makeApiRequest<RippleUserInfoResponse>(
      `/api/v1/users/full`,
      {
        name: username,
      },
    );

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      username: data.username,
    };
  }
}
