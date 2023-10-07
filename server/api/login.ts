import { generateRandomString } from "~/utils/generateRandomString";
import qs from "querystring";

export default defineEventHandler(() => {
  const config = useRuntimeConfig();

  const url = "https://accounts.spotify.com/authorize?";
  const redirect_uri = config.spotifyRedirectUri;
  const CLIENT_ID = config.spotifyClientId;
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email";

  const navigate_to =
    url +
    qs.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope,
      redirect_uri,
      state,
    });

  return {
    navigate_to,
    state,
  };
});
