<script setup lang="ts">
import { useFetchSpotify } from "~/composables/useFetchSpotify";
import { getFlagIcon } from "../utils/getFlagIcon";
import { MeReturn } from "../types";
const route = useRoute();
const router = useRouter();
const spotifyAuthToken = useCookie("spotify_auth_token");
const spotifyRefreshToken = useCookie("spotify_refresh_token");
const spotifyAuthState = useCookie("spotify_auth_state");

// Get profile data
const meData = ref<MeReturn | null>();
if (spotifyAuthToken.value) {
  const { data } = await useFetchSpotify<MeReturn>("/me");
  meData.value = data?.value;
}

// Logged out state
// Log in btn
async function onClickLogIn() {
  const data = await $fetch("/api/login");

  // Set auth state cookie
  spotifyAuthState.value = data.state;

  // Redirect to spotify login
  navigateTo(data.navigate_to, { external: true });
}

// If callback from spotify auth page
onMounted(async () => {
  if (route.query.callback) {
    // Get auth token
    const data = await $fetch(
      `/api/callback?code=${route.query.code || ""}&state=${
        route.query.state || ""
      }&stored_state=${spotifyAuthState.value}`
    );

    // Set cookies
    if (data.access_token) {
      spotifyAuthState.value = null;
      spotifyAuthToken.value = data.access_token;
      spotifyRefreshToken.value = data.refresh_token;
    }

    // Clear query params
    router.replace("/");

    meData.value = await $fetch<MeReturn>("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + spotifyAuthToken.value,
      },
    });
  }
});

// Log out btn
function onClickLogOut() {
  spotifyAuthToken.value = null;
  spotifyRefreshToken.value = null;
  meData.value = undefined;
}

useHead({
  title: "MyTastify - Seek your taste!",
  meta: [
    {
      name: "description",
      content: "Seek your music taste based on your spotify profile!",
    },
  ],
});
</script>

<template>
  <section>
    <div>
      <header class="shadow-md bg-blacker">
        <nav class="container mx-auto p-4 flex justify-between">
          <div class="flex gap-4">
            <div class="h-[36px]">
              <img src="/logo.webp" alt="my-tastify" class="h-full" />
            </div>
            <NuxtLink
              to="/"
              class="text-yellow font-bold font-space tracking-tight text-3xl"
              >MyTastify.</NuxtLink
            >
          </div>

          <!-- Logged out -->
          <div v-if="!spotifyAuthToken">
            <button class="btn text-sm" @click="onClickLogIn">
              LOG IN TO SPOTIFY
            </button>
          </div>

          <!-- Logged In -->
          <div v-if="spotifyAuthToken">
            <button class="btn text-sm" @click="onClickLogOut">LOG OUT</button>
          </div>
        </nav>
      </header>
      <div
        class="container mx-auto p-4 bg-white bg-opacity-70 backdrop-filter border border-white border-t-0"
      >
        <div>
          <div class="w-full flex items-end gap-6" v-if="meData">
            <img
              :src="meData.images[1].url"
              :alt="meData.display_name"
              class="rounded-full object-cover w-[160px] h-[160px]"
            />
            <div class="w-full">
              <p class="font-bold capitalize text-4xl">
                {{ meData.display_name }}
              </p>
              <p class="text-xl">
                {{ meData.email }}
              </p>
              <div class="flex mt-2 items-center gap-3">
                <img
                  :src="getFlagIcon(meData.country)"
                  :alt="meData.country"
                  class="object-cover w-[16px] h-[12px] rounded-sm shadow-sm"
                />

                <div
                  class="rounded-full border border-yellow px-2 bg-yellow bg-opacity-20 text-yellow text-sm capitalize"
                  v-if="meData.product === 'premium'"
                >
                  <p>🌟 Premium User</p>
                </div>
                <p class="text-sm capitalize">
                  🙆‍♂️ {{ meData.followers.total }} Followers
                </p>
                <a
                  :href="meData.external_urls.spotify"
                  class="text-sm capitalize underline group"
                >
                  Visit profile
                  <Icon
                    name="iconoir:arrow-tr"
                    class="relative group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <slot />
      </div>
    </div>
  </section>
</template>
