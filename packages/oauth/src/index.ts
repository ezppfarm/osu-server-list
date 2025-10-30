import { betterFetch } from "@better-fetch/fetch";
import z from "zod";
import type {
  RESTPostOAuth2AccessTokenResult,
  APIUser,
} from "discord-api-types/v10";

const oauthObjectValidation = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
});

export const getDiscordSessionFromURLRequest = async (
  url: URL,
  opts: {
    redirectUrl: string;
    oauthClientId: string;
    oauthClientSecret: string;
  },
) => {
  const code = url.searchParams.get("code");
  if (!code) {
    console.log("no code");
    return null;
  }

  const urlData = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: opts.redirectUrl,
  });

  try {
    const oauthRequest = await betterFetch<RESTPostOAuth2AccessTokenResult>(
      "https://discord.com/api/v10/oauth2/token",
      {
        body: urlData,
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${opts.oauthClientId}:${opts.oauthClientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        throw: false,
      },
    );
    if (oauthRequest.error) {
      console.log(oauthRequest.error);
      return null;
    }
    if (!oauthObjectValidation.safeParse(oauthRequest.data).success) {
      console.log("object validation failed");
      return null;
    }

    return oauthRequest.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getDiscordSessionFromRefreshToken = async (
  refreshToken: string,
  opts: {
    oauthClientId: string;
    oauthClientSecret: string;
  },
) => {
  const urlData = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  try {
    const oauthRequest = await betterFetch<RESTPostOAuth2AccessTokenResult>(
      "https://discord.com/api/v10/oauth2/token",
      {
        body: urlData,
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${opts.oauthClientId}:${opts.oauthClientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        throw: false,
      },
    );
    if (oauthRequest.error) return null;
    if (!oauthObjectValidation.safeParse(oauthRequest.data).success)
      return null;
    return oauthRequest.data;
  } catch {
    return null;
  }
};

export const getDiscordUserFromTokenObject = async (
  tokenObject: RESTPostOAuth2AccessTokenResult,
) => {
  try {
    const userRequest = await betterFetch<APIUser>(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokenObject.access_token}`,
        },
      },
    );
    if (userRequest.error) return null;
    return userRequest.data;
  } catch {
    return null;
  }
};

export const invalidateDiscordToken = async (
  tokenObject: RESTPostOAuth2AccessTokenResult,
  opts: {
    oauthClientId: string;
    oauthClientSecret: string;
  },
) => {
  try {
    const urlData = new URLSearchParams({
      token_type_hint: "access_token",
      token: tokenObject.access_token,
    });
    await betterFetch("https://discord.com/api/v10/oauth/token/revoke", {
      body: urlData,
      headers: {
        Authorization: `Basic ${Buffer.from(`${opts.oauthClientId}:${opts.oauthClientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch {}
};
