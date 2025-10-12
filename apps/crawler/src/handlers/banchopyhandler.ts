import { betterFetch } from "@better-fetch/fetch";
import type { UsersResponse } from "../types";
import type { IServerApiHandler } from "./iserverapihandler";

type BpyUsersResponse = {
  status: string;
  counts: {
    online: number;
    total: number;
  };
};

export class BanchoPyApiHandler implements IServerApiHandler {
  constructor(private baseUrl: string, private useOldApiFormat: boolean = false) { }

  private async makeRequest<T>(endpoint: string): Promise<T | null> {
    const apiUrl = this.baseUrl.replace("https://", "https://api.");

    // who knows, maybe someone still uses this /shrug
    let oldApiFormat = "";
    if (this.useOldApiFormat) {
      oldApiFormat = "/v1";
    }

    const url = `${apiUrl}${oldApiFormat}${endpoint}`;
    const response = await betterFetch<T>(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (response.error) {
      console.error(`Request to ${url} resulted in status code ${response.error.status} - ${response.error.statusText}`);
      return null;
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
}
