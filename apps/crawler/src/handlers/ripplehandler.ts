import { betterFetch } from "@better-fetch/fetch";
import type { UsersResponse } from "../types";
import type { IServerApiHandler } from "./iserverapihandler";

type RippleOnlineUsersResponse = {
  message: string;
  result: number;
  status: number;
};

export class RippleApiHandler implements IServerApiHandler {
  constructor(private baseUrl: string) { }

  private async makeRequest<T>(url: string): Promise<T | null> {
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

  private async makeBanchoRequest<T>(endpoint: string): Promise<T | null> {
    const apiUrl = this.baseUrl.replace("https://", "https://c.");
    const url = `${apiUrl}${endpoint}`;
    return this.makeRequest<T>(url);
  }

  private async makeApiRequest<T>(endpoint: string): Promise<T | null> {
    // fun
    const url = `${this.baseUrl}${endpoint}`;
    return this.makeRequest<T>(url);
  }

  public async fetchUserCounts(): Promise<UsersResponse> {
    const data = await this.makeBanchoRequest<RippleOnlineUsersResponse>("/api/v1/onlineUsers");

    if (!data) {
      throw new Error("Failed to fetch user counts");
    }

    return {
      onlineCount: data.result,
      totalCount: -1, // Ripple does not provide total user count
    };
  }
}
