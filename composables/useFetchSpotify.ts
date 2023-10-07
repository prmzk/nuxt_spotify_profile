import { UseFetchOptions } from "nuxt/app";

export async function useFetchSpotify<DataT>(
  url: string,
  options?: UseFetchOptions<DataT>
) {
  const spotifyAuthToken = useCookie("spotify_auth_token");
  const spotifyRefreshToken = useCookie("spotify_refresh_token");
  const { data, error, refresh, ...rest } = await useAsyncData<DataT, any>(
    url,
    () => {
      return $fetch(`https://api.spotify.com/v1${url}`, {
        headers: {
          Authorization: "Bearer " + spotifyAuthToken.value,
        },
        ...{ options },
      });
    }
  );

  if (error?.value?.statusCode) {
    if (
      error?.value?.data?.error?.message === "The access token expired" ||
      error?.value?.data?.error?.message === "Invalid access token"
    ) {
      // If refresh token not found, log out completely
      if (!spotifyRefreshToken.value) {
        spotifyAuthToken.value = null;
        return { data: null, error, refresh, ...rest };
      }

      // Get auth token
      const dataAccessToken = await $fetch(
        `/api/refresh?refresh_token=${spotifyRefreshToken.value || ""}`
      );

      // Set cookies
      if (dataAccessToken.access_token) {
        spotifyAuthToken.value = dataAccessToken.access_token;
      }

      await refresh();
    } else {
      return { data: null, error, refresh, ...rest };
    }
  }

  return { data, error: null, refresh, ...rest };
}
