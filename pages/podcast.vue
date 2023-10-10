<script setup lang="ts">
import { useFetchSpotify } from "~/composables/useFetchSpotify";
import { SpotifyPodcastEpisode } from "~/types";
const podcastData = ref<SpotifyPodcastEpisode[] | null>();
const { data } = await useFetchSpotify<{
  items: SpotifyPodcastEpisode[];
}>("/me/shows?limit=50");
podcastData.value = data?.value?.items;
console.log(podcastData);
</script>

<template>
  <div class="flex flex-col gap-4 pt-8 px-8 min-h-[500px]">
    <div v-for="podcast in podcastData">
      <div class="flex gap-4 items-center">
        <div class="flex-shrink-0">
          <img
            :src="podcast.show.images[0].url"
            :alt="podcast.show.name"
            class="border border-yellow border-l-4 rounded-lg w-[100px] aspect-square"
          />
        </div>
        <div>
          <p class="text-white text-xl font-bold">{{ podcast.show.name }}</p>
          <p class="text-white text-sm">{{ podcast.show.publisher }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
