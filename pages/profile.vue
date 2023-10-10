<script setup lang="ts">
import { useFetchSpotify } from "~/composables/useFetchSpotify";
import {
  PlayerInfo,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyArtist,
  SpotifySavedTracks,
} from "~/types";

// const recentlyPlayedData = ref<SpotifyTopTracks | null>();

const recentlyPlayedData = ref<{ track: SpotifyTrack }[] | null>();
const { data: recentlyPlayed } = await useFetchSpotify<{
  items: { track: SpotifyTrack }[];
}>("/me/player/recently-played?limit=10");
recentlyPlayedData.value = recentlyPlayed?.value?.items;

const playbackStateData = ref<PlayerInfo | null>();
const { data: playbackState } = await useFetchSpotify<PlayerInfo>("/me/player");
playbackStateData.value = playbackState?.value;

const playbackPlaylistData = ref<SpotifyPlaylist | null>();
if (playbackStateData.value?.context?.type === "playlist") {
  const { data: playbackPlaylist } =
    await useFetchSpotify<SpotifyPlaylist | null>(
      `/playlists/${playbackStateData.value?.context?.uri.split(":")[2]}`,
      {
        watch: [playbackStateData],
      }
    );
  playbackPlaylistData.value = playbackPlaylist?.value;
}

const playbackArtistData = ref<SpotifyArtist | null>();
if (playbackStateData.value?.context?.type === "artist") {
  const { data: playbackPlaylist } =
    await useFetchSpotify<SpotifyArtist | null>(
      `/artists/${playbackStateData.value?.context?.uri.split(":")[2]}`,
      {
        watch: [playbackStateData],
      }
    );
  playbackArtistData.value = playbackPlaylist?.value;
}

const playerLargeImage = computed(() => {
  if (playbackPlaylistData.value)
    return {
      url: playbackPlaylistData.value.images[0].url,
      alt: playbackPlaylistData.value.name,
    };
  else if (playbackArtistData.value)
    return {
      url: playbackArtistData.value.images[0].url,
      alt: playbackArtistData.value.name,
    };
  else
    return {
      url: playbackStateData.value?.item.album.images[1].url,
      alt: playbackStateData.value?.item.album.name,
    };
});

const savedTrackData = ref<SpotifySavedTracks | null>();
const { data: savedTracks } = await useFetchSpotify<SpotifySavedTracks | null>(
  "/me/tracks?limit=40",
  {
    watch: [playbackStateData],
  }
);
savedTrackData.value = savedTracks?.value;
</script>

<template>
  <div class="min-h-screen pt-12 px-4">
    <div class="mb-8">
      <p v-if="!playbackStateData">
        Start your spotify session to see what's playing here.
      </p>
      <div
        class="flex gap-4 items-center flex-col md:flex-row"
        v-if="playbackStateData?.currently_playing_type === 'track'"
      >
        <div class="md:w-1/4 flex-shrink-0 relative">
          <img
            :src="playerLargeImage.url"
            :alt="playerLargeImage.alt"
            class="rounded-lg aspect-square w-full"
          />
          <div
            class="md:w-[56px] w-[36px] flex-shrink-0 border border-yellow border-l-4 absolute -right-2 -bottom-2 shadow-md"
            v-if="playbackStateData.context?.type === 'artist' || 'playlist'"
          >
            <img
              :src="playbackStateData.item.album.images[0].url"
              :alt="playbackStateData.item.album.name"
              class="aspect-square"
            />
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex flex-col md:flex-row gap-2">
            <img
              src="/player.gif"
              class="aspect-square w-[24px] h-[24px] flex-shrink-0 mx-auto sm:mx-0"
              alt="cd"
            />
            <p class="text-white font-semibold text-xl">
              {{ playbackStateData?.item.name }}
            </p>
          </div>

          <p class="text-white text-md">
            by
            <span
              v-for="(artist, i) in playbackStateData?.item.album.artists"
              class="text-white"
            >
              <span v-if="i !== 0"> - </span>{{ artist.name }}
            </span>
          </p>
          <p class="text-white text-md">
            Played from
            {{
              playbackStateData?.context?.type === "playlist"
                ? `"${playbackPlaylistData?.name}" playlist`
                : playbackStateData?.context?.type === "artist"
                ? playbackStateData.item.album.artists[0].name
                : playbackStateData.item.album.name
            }}
          </p>
        </div>
      </div>
      <div v-if="playbackStateData?.currently_playing_type === 'episode'">
        <div class="flex flex-col sm:flex-row gap-2 items-center">
          <img
            src="/player.gif"
            class="aspect-square w-[24px] h-[24px] flex-shrink-0 mx-auto sm:mx-0"
            alt="cd"
          />
          <p class="text-white font-semibold text-xl">Listening to a podcast</p>
        </div>
      </div>
    </div>
    <div class="mb-16">
      <h2 class="text-2xl tracking-tighter mb-4 font-bold text-white">
        Recently Played Tracks
      </h2>
      <div class="flex flex-wrap">
        <div
          v-if="recentlyPlayedData?.length"
          v-for="track in recentlyPlayedData"
          class="md:w-1/2 w-full flex gap-3 p-2 items-center"
        >
          <div
            class="w-[56px] aspect-square border border-yellow border-l-4 flex rounded-md overflow-hidden flex-shrink-0"
          >
            <img
              :src="track.track.album.images[2].url"
              :alt="track.track.album.name"
              class=""
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-white text-sm line-clamp-2 font-semibold">
              {{ track.track.name }}
            </p>
            <p class="text-xs">
              <span
                v-for="(artist, i) in track.track.album.artists"
                class="text-white"
              >
                <span v-if="i !== 0"> - </span>{{ artist.name }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-16">
      <h2 class="text-2xl tracking-tighter mb-4 font-bold text-white">
        Saved Tracks
      </h2>
      <div class="flex flex-wrap flex-col md:flex-row" v-if="savedTrackData">
        <div v-for="track in savedTrackData.items" class="md:w-1/2 w-full p-1">
          <div class="flex gap-2 items-center">
            <div class="flex-shrink-0">
              <img
                :src="track.track.album.images[0].url"
                :alt="track.track.album.name"
                class="w-[48px] aspect-square"
              />
            </div>
            <div class="overflow-hidden">
              <p class="truncate text-sm text-white max-w-full">
                {{ track.track.name }}
              </p>
              <p class="truncate text-xs text-white">
                {{ track.track.artists[0].name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
