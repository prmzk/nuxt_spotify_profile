import { SpotifyAccessTokenReturn } from "~/types";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { code, state, stored_state } = getQuery(event);

  if (!state || state !== stored_state) {
    throw createError({
      statusCode: 400,
      statusMessage: "state_mismatch",
    });
  } else {
    const url = "https://accounts.spotify.com/api/token";
    const redirect_uri = config.spotifyRedirectUri;
    const CLIENT_ID = config.spotifyClientId;
    const CLIENT_SECRET = config.spotifyClientSecret;

    const urlencoded = new URLSearchParams();
    urlencoded.append("code", code as string);
    urlencoded.append("redirect_uri", redirect_uri);
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("client_id", CLIENT_ID);
    urlencoded.append("client_secret", CLIENT_SECRET);

    const data = await $fetch(url, {
      method: "POST",
      body: urlencoded,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).catch((err) => console.log(err.message));

    return data as SpotifyAccessTokenReturn;
  }
});
