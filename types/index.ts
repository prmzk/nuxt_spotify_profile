// Profile fetch
export type MeReturn = {
  country: string;
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  product: string;
  type: string;
  uri: string;
};

// Access token
export type SpotifyAccessTokenReturn = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type SpotifyTopArtists = {
  href: string;
  limit: number;
  next?: string;
  previous?: string;
  offset: number;
  total: number;
  items: SpotifyArtist[];
};

export type SpotifyArtist = {
  external_urls: { spotify: string };
  followers: { href?: string; total: number };
  genres: string[];
  href: string;
  id: string;
  images: { height: number; url: string; width: number }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

export type SpotifyTopTracks = {
  href: string;
  limit: number;
  next?: string;
  previous?: string;
  offset: number;
  total: number;
  items: SpotifyTrack[];
};

export type SpotifyTrack = {
  album: SpotifyAlbum;
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
  genres: string[];
  href: string;
  id: string;
  name: string;
  popularity: number;
  type: string;
  uri: string;
  preview_url: string;
};

export type SpotifyAlbum = {
  album_type: string;
  artists: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
};

export type PlayerInfo = {
  context?: {
    external_urls: {
      spotify: string;
    };
    href: string;
    type: "playlist" | "artist" | "album" | "show";
    uri: string;
  };
  item: SpotifyTrack;
  currently_playing_type: "track" | "episode";
  device: {
    name: string;
    type: string;
  };
  is_playing: boolean;
};

export type SpotifyPlaylist = {
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string;
      total: number;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name: string;
  };
  tracks: SpotifyTopTracks;
};

export type SpotifySavedTracks = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: [
    {
      added_at: string;
      track: {
        album: SpotifyAlbum;
        artists: SpotifyArtist[];
        available_markets: [string];
        disc_number: number;
        duration_ms: number;
        explicit: boolean;
        external_ids: {
          isrc: string;
          ean: string;
          upc: string;
        };
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        is_playable: boolean;
        linked_from: {};
        restrictions: {
          reason: string;
        };
        name: string;
        popularity: number;
        preview_url: string;
        track_number: number;
        type: string;
        uri: string;
        is_local: false;
      };
    }
  ];
};

export type SpotifyPodcastEpisode = {
  added_at: string;
  show: {
    available_markets: string[];
    copyrights: string[];
    description: string;
    explicit: false;
    external_urls: {
      spotify: string;
    };
    href: string;
    html_description: string;
    id: string;
    images: {
      height: number;
      url: string;
      width: number;
    }[];
    is_externally_hosted: boolean;
    languages: string[];
    media_type: string;
    name: string;
    publisher: string;
    total_episodes: number;
    type: string;
    uri: string;
  };
};
