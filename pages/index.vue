<script setup lang="ts">
const spotifyAuthToken = useCookie("spotify_auth_token");
if (spotifyAuthToken.value) navigateTo("/profile");
</script>

<template>
  <div class="w-full flex justify-center mt-8">
    <img
      src="/gorillaz.png"
      alt="gorillaz"
      class="rounded-md border-2 border-black"
    />
  </div>
</template>
