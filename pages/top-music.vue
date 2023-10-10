<script setup lang="ts">
import { SpotifyTopTracks, SpotifyTopArtists } from "../types";
import { useFetchSpotify } from "~/composables/useFetchSpotify";

const spotifyAuthToken = useCookie("spotify_auth_token");
if (!spotifyAuthToken.value) navigateTo("/");

const { data: topArtist } = await useFetchSpotify<SpotifyTopArtists>(
  "/me/top/artists?limit=50&time_range=long_term"
);

const topTrackData = ref<SpotifyTopTracks | null>();
const { data: topTrack } = await useFetchSpotify<SpotifyTopTracks>(
  "/me/top/tracks?limit=20&time_range=long_term"
);
topTrackData.value = topTrack?.value;

const topArtistData = computed(() => {
  return { ...topArtist?.value, items: topArtist?.value?.items.slice(0, 10) };
});

const topGenreData = computed(() => {
  const topGenres: { name: string; sum: number }[] = [];

  topArtist?.value?.items.forEach((artist) => {
    artist.genres.forEach((genre) => {
      let found = false;
      topGenres.forEach((topGenre) => {
        if (topGenre.name === genre) {
          topGenre.sum++;
          found = true;
        }
      });
      if (!found)
        topGenres.push({
          name: genre,
          sum: 1,
        });
    });
  });

  return topGenres
    .sort((genreA, genreB) => (genreA.sum < genreB.sum ? 1 : -1))
    .splice(0, 5);
});
</script>

<template>
  <div class="min-h-screen pt-12 px-4">
    <div class="mb-16">
      <h2 class="text-2xl tracking-tighter mb-4 font-bold text-white">
        Top Genre
      </h2>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(genre, i) in topGenreData"
          class="relative group flex items-center gap-1"
        >
          <p class="text-4xl text-yellow font-bold tracking-tighter opacity-80">
            {{ i + 1 }}.
          </p>
          <p class="capitalize text-xl text-white relative">
            {{ genre.name }}
          </p>
        </div>
      </div>
    </div>
    <div class="mb-16">
      <h2 class="text-2xl tracking-tighter mb-8 font-bold text-white">
        Top Artist
      </h2>
      <div class="flex flex-col gap-2">
        <div v-for="(artist, i) in topArtistData?.items" class="relative group">
          <img
            v-if="i < 10"
            :src="artist.images[0].url"
            :alt="artist.name"
            :class="'object-cover transition-all group-hover:aspect-[4/1] w-full md:aspect-[10/1] sm:aspect-[9/1] aspect-[5/1] artist-image brightness-50 rounded-lg'"
          />
          <a
            :href="artist.external_urls.spotify"
            v-if="i < 10"
            :class="'shadow-lg transition-all object-cover w-full group-hover:aspect-[4/1] md:aspect-[10/1] sm:aspect-[9/1] aspect-[5/1] artist-image absolute z-10 bottom-0 flex items-center overflow-hidden border border-yellow rounded-lg bg-white bg-opacity-10 backdrop-blur-[1px]'"
          >
            <p
              :class="'group-hover:translate-x-2/3 transition-all font-space tracking-tighter text-white font-bold lg:text-xl md:text-lg text-sm whitespace-nowrap p-4'"
            >
              {{ artist.name }}
            </p>
          </a>
        </div>
      </div>
    </div>
    <div class="mb-16">
      <h2 class="text-2xl tracking-tighter mb-8 font-bold text-white">
        Top Tracks
      </h2>
      <div class="flex flex-wrap">
        <div
          v-for="track in topTrackData?.items"
          class="md:w-1/2 w-full flex gap-3 p-2 items-center"
        >
          <div
            class="w-[56px] aspect-square border border-yellow border-l-4 flex rounded-md overflow-hidden flex-shrink-0"
          >
            <img
              :src="track.album.images[2].url"
              :alt="track.album.name"
              class=""
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-white text-sm line-clamp-2 font-semibold">
              {{ track.name }}
            </p>
            <p class="text-xs">
              <span
                v-for="(artist, i) in track.album.artists"
                class="text-white"
              >
                <span v-if="i !== 0"> - </span>{{ artist.name }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.artist-image {
  object-position: 0 50%;
}
</style>
