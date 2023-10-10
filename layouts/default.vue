<script setup lang="ts">
import { useFetchSpotify } from "~/composables/useFetchSpotify";
import { MeReturn } from "../types";
import { getFlagIcon } from "../utils/getFlagIcon";
const route = useRoute();
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
    navigateTo("/profile");

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
  navigateTo("/");
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
    <div class="main-section flex flex-col">
      <header class="shadow-md bg-blacker">
        <nav class="container mx-auto p-4 flex justify-between flex-wrap gap-2">
          <div class="flex md:gap-4 gap-2 items-center">
            <div class="md:h-[36px] h-[24px] flex-shrink-0">
              <img src="/logo.webp" alt="my-tastify" class="h-full" />
            </div>
            <NuxtLink
              to="/"
              class="text-yellow font-bold font-space tracking-tight md:text-3xl text-lg"
              >MyTastify.</NuxtLink
            >
          </div>

          <!-- Logged out -->
          <div v-if="!spotifyAuthToken">
            <button class="btn md:text-sm text-xs" @click="onClickLogIn">
              LOG IN TO SPOTIFY
            </button>
          </div>

          <!-- Logged In -->
          <div v-if="spotifyAuthToken">
            <button class="btn md:text-sm text-xs" @click="onClickLogOut">
              LOG OUT
            </button>
          </div>
        </nav>
      </header>
      <div
        class="container mx-auto p-4 bg-black bg-opacity-70 border-l-4 border-r-4 border-yellow backdrop-filter border-t-0 relative flex-grow"
      >
        <div class="border-gray pb-8 border-b" v-if="spotifyAuthToken">
          <div class="w-full flex items-end gap-6" v-if="meData">
            <img
              :src="meData.images[1].url"
              :alt="meData.display_name"
              class="rounded-full object-cover w-[160px] h-[160px]"
            />
            <div class="w-full overflow-hidden">
              <p
                class="text-white font-bold capitalize lg:text-4xl md:text-3xl text-2xl"
              >
                {{ meData.display_name }}
              </p>
              <p
                class="text-white lg:text-xl md:text-md text-sm w-full overflow-hidden"
              >
                {{ meData.email }}
              </p>
              <div class="flex mt-2">
                <div
                  class="rounded-full border border-yellow px-2 bg-yellow bg-opacity-20 text-sm capitalize text-white"
                  v-if="meData.product === 'premium'"
                >
                  <p class="text-white">🌟 Premium User</p>
                </div>
              </div>

              <div class="flex mt-2 items-center gap-3 flex-wrap">
                <img
                  :src="getFlagIcon(meData.country)"
                  :alt="meData.country"
                  class="object-cover w-[16px] h-[12px] rounded-sm shadow-sm"
                />

                <p class="text-white text-sm capitalize">
                  🙆‍♂️ {{ meData.followers.total }} Followers
                </p>
                <a
                  :href="meData.external_urls.spotify"
                  class="text-sm capitalize underline group text-white"
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

        <div
          class="lg:absolute fixed z-20 lg:-left-[72px] lg:bottom-auto lg:w-fit lg:block bottom-0 left-0 w-screen flex justify-center"
          v-if="spotifyAuthToken"
        >
          <nav class="w-full">
            <ul class="flex lg:flex-col lg:gap-1">
              <li
                :class="
                  'h-[72px] lg:w-[72px] w-full flex items-center justify-center bg-blacker lg:bg-black lg:bg-opacity-70 lg:rounded-l-lg transition-all ' +
                  (route.path === '/profile'
                    ? 'opacity-100 border-b-4 border-yellow'
                    : 'lg:opacity-60')
                "
              >
                <NuxtLink
                  class="w-full h-full flex justify-center items-center"
                  to="/profile"
                >
                  <div class="flex flex-col items-center p-2">
                    <Icon
                      name="material-symbols:person-2-rounded"
                      size="24"
                      class="svg-nav"
                    />
                    <p
                      class="text-xs mt-1 font-semibold text-center leading-3 tracking-tighter text-yellow"
                    >
                      Profile
                    </p>
                  </div>
                </NuxtLink>
              </li>
              <li
                :class="
                  'h-[72px] lg:w-[72px] w-full p-2 flex items-center justify-center bg-blacker lg:bg-black lg:bg-opacity-70 lg:rounded-l-lg transition-all ' +
                  (route.path === '/top-music'
                    ? 'opacity-100 border-b-4 border-yellow'
                    : 'lg:opacity-60')
                "
              >
                <NuxtLink
                  class="w-full h-full flex justify-center items-center"
                  to="/top-music"
                >
                  <div class="flex flex-col items-center">
                    <Icon
                      name="material-symbols:library-music"
                      size="24"
                      class="svg-nav"
                    />
                    <p
                      class="text-xs mt-1 font-semibold text-center leading-3 tracking-tighter text-yellow"
                    >
                      Top Music
                    </p>
                  </div>
                </NuxtLink>
              </li>
              <li
                :class="
                  'h-[72px] lg:w-[72px] w-full p-2 flex items-center justify-center bg-blacker lg:bg-black lg:bg-opacity-70 lg:rounded-l-lg transition-all ' +
                  (route.path === '/playlist'
                    ? 'opacity-100 border-b-4 border-yellow'
                    : 'lg:opacity-60')
                "
              >
                <NuxtLink
                  class="w-full h-full flex justify-center items-center"
                  to="/playlist"
                >
                  <div class="flex flex-col items-center">
                    <Icon
                      name="mdi:playlist-music-outline"
                      size="24"
                      class="svg-nav"
                    />
                    <p
                      class="text-xs mt-1 font-semibold text-center leading-3 tracking-tighter text-yellow"
                    >
                      Playlist
                    </p>
                  </div>
                </NuxtLink>
              </li>
              <li
                :class="
                  'h-[72px] lg:w-[72px] w-full p-2 flex items-center justify-center bg-blacker lg:bg-black lg:bg-opacity-70 lg:rounded-l-lg transition-all ' +
                  (route.path === '/podcast'
                    ? 'opacity-100 border-b-4 border-yellow'
                    : 'lg:opacity-60')
                "
              >
                <NuxtLink
                  class="w-full h-full flex justify-center items-center"
                  to="/podcast"
                >
                  <div class="flex flex-col items-center">
                    <Icon name="mdi:podcast" size="24" class="svg-nav" />
                    <p
                      class="text-xs mt-1 font-semibold text-center leading-3 tracking-tighter text-yellow"
                    >
                      Podcast
                    </p>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
        <slot />
        <div class="mt-8 flex flex-col items-center">
          <p class="text-white font-bold">
            Made by
            <a href="https://github.com/prmzk" class="underline">
              <Icon name="mdi:github" />Prmzk</a
            >
          </p>
          <p class="text-white font-bold">
            <NuxtLink to="/privacy-policy" class="underline"
              >Privacy Policy</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.svg-nav path {
  color: #f5cb5c;
}

.main-section {
  min-height: 100dvh;
}

svg path {
  color: #e8eddf;
}
</style>
