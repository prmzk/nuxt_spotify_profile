import { SpotifyAccessTokenReturn } from "~/types";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { refresh_token } = getQuery(event);

  const url = "https://accounts.spotify.com/api/token";
  const CLIENT_ID = config.spotifyClientId;
  const CLIENT_SECRET = config.spotifyClientSecret;

  const urlencoded = new URLSearchParams();
  urlencoded.append("refresh_token", refresh_token as string);
  urlencoded.append("grant_type", "refresh_token");
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
});
