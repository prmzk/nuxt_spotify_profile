<script setup lang="ts">
import { useFetchSpotify } from "~/composables/useFetchSpotify";
import { SpotifyPlaylist } from "~/types";
const playlistData = ref<SpotifyPlaylist[] | null>();
const { data } = await useFetchSpotify<{
  items: SpotifyPlaylist[];
}>("/me/playlists?limit=50");
playlistData.value = data?.value?.items;
</script>

<template>
  <div class="flex flex-col gap-4 pt-8 px-8">
    <div v-for="playlist in playlistData">
      <div class="flex gap-4 items-center">
        <div class="flex-shrink-0">
          <img
            :src="playlist.images[0].url"
            :alt="playlist.name"
            class="border border-yellow border-l-4 rounded-lg w-[100px] aspect-square"
          />
        </div>
        <div>
          <p class="text-white text-xl font-bold">{{ playlist.name }}</p>
          <p class="text-white text-md">{{ playlist.tracks.total }} tracks</p>
        </div>
      </div>
    </div>
  </div>
</template>
