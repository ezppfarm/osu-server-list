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
    return { success: false, message: "No code provided" };
  }

  const urlData = new URLSearchParams({
    client_id: opts.oauthClientId,
    client_secret: opts.oauthClientSecret,
    grant_type: "authorization_code",
    code: code.toString(),
    redirect_uri: opts.redirectUrl,
  });

  //TODO: do discord oauth flow
};
