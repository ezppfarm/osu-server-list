import { betterFetch } from "@better-fetch/fetch";
import type { UserResponse, UsersResponse } from "./types";
import type { IServerApiHandler } from "./iserverapihandler";

type BpyUsersResponse = {
  status: string;
  counts: {
    online: number;
    total: number;
  };
};

type BpyUserInfoResponse = {
  status: string;
  player: {
    info: {
      id: number;
      name: string;
    }
  }
};

export class BanchoPyApiHandler implements IServerApiHandler {
  constructor(
    private baseUrl: string,
    private useOldApiFormat: boolean = false
  ) { }

  private async makeRequest<T>(endpoint: string, params?: any): Promise<T | null> {
    const apiUrl = this.baseUrl.replace("https://", "https://api.");

    // who knows, maybe someone still uses this /shrug
    let oldApiFormat = "/v1";
    if (this.useOldApiFormat) {
      oldApiFormat = "";
    }

    const url = `${apiUrl}${oldApiFormat}${endpoint}`;
    const response = await betterFetch<T>(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      query: params
    });

    if (response.error) {
      if (response.error.status === 404) {
        return null;
      }

      throw new Error(
        `Request to ${url} resulted in status code ${response.error.status} - ${response.error.statusText}`
      );
    }

    return response.data;
  }

  public async fetchUserCounts(): Promise<UsersResponse> {
    const data = await this.makeRequest<BpyUsersResponse>("/get_player_count");

    if (!data) {
      throw new Error("Failed to fetch user counts");
    }

    return {
      onlineCount: data.counts.online,
      totalCount: data.counts.total,
    };
  }

  public async fetchUserInfo(username: string): Promise<UserResponse | null> {
    const data = await this.makeRequest<BpyUserInfoResponse>(`/get_player_info`, {
      scope: "info",
      name: username
    });

    if (!data) {
      return null;
    }

    return {
      id: data.player.info.id,
      username: data.player.info.name
    };
  }
}
