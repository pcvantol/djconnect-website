// Canonical spoken intent examples live in the Home Assistant repo:
// examples/voice_intents.json. Keep IDs, order and wording aligned.
window.DJCONNECT_VOICE_INTENTS = [
  {
    id: "current_track",
    spotifyType: "status",
    playsMusic: false,
    pill: { nl: "Status", en: "Status" },
    title: { nl: "Wat draait er nu?", en: "What is playing?" },
    text: {
      nl: "Leest de huidige Spotify playback-status en geeft een DJ-response. Dit start of wijzigt geen muziek.",
      en: "Reads the current Spotify playback status and returns a DJ response. This does not start or change music."
    },
    behavior: {
      nl: "Geen Spotify search. Geen playback-start. Alleen status lezen en antwoord geven.",
      en: "No Spotify search. No playback start. Only read status and answer."
    },
    examples: {
      nl: ["Welk nummer draait er nu?", "Welk nummer speelt er nu?", "Wat draait er?", "Wat speelt er?", "Wat is dit?"],
      en: ["What song is playing?", "What track is playing now?", "What's playing?", "Which song is this?"]
    }
  },
  {
    id: "playback_control",
    spotifyType: "backend_command",
    playsMusic: false,
    pill: { nl: "Bediening", en: "Control" },
    title: { nl: "Playback direct bedienen", en: "Direct playback control" },
    text: {
      nl: "Roept direct backend commands aan. DJConnect voert geen Spotify search uit en behandelt deze zinnen niet als muziekzoekopdracht.",
      en: "Calls backend commands directly. DJConnect does not run Spotify search or treat these phrases as music search requests."
    },
    behavior: {
      nl: "Geen Spotify search. Direct command uitvoeren en daarna een DJ-response geven.",
      en: "No Spotify search. Run the command directly and then return a DJ response."
    },
    commands: [
      { phrase: { nl: "Stop muziek", en: "Stop music" }, command: "pause" },
      { phrase: { nl: "Start muziek", en: "Start music" }, command: "play/resume" },
      { phrase: { nl: "Zet harder", en: "Turn it up" }, command: "volume +10" },
      { phrase: { nl: "Zet zachter", en: "Turn it down" }, command: "volume -10" },
      { phrase: { nl: "Volgende nummer", en: "Next song" }, command: "next" },
      { phrase: { nl: "Vorig nummer", en: "Previous song" }, command: "previous" }
    ],
    examples: {
      nl: ["Stop muziek", "Stop de muziek", "Pauzeer muziek", "Start muziek", "Start de muziek", "Hervat muziek", "Zet harder", "Zet de muziek harder", "Volume omhoog", "Zet zachter", "Zet de muziek zachter", "Volume omlaag", "Volgende nummer", "Volgend nummer", "Volgende track", "Vorig nummer", "Vorige track", "Vorig liedje"],
      en: ["Stop music", "Pause music", "Start music", "Play music", "Resume music", "Turn it up", "Volume up", "Louder", "Turn it down", "Volume down", "Quieter", "Next song", "Next track", "Skip", "Previous song", "Previous track"]
    }
  },
  {
    id: "default_playlist",
    spotifyType: "playlist",
    playsMusic: true,
    pill: { nl: "Standaard", en: "Default" },
    title: { nl: "Standaard playlist / favorieten", en: "Default playlist / favorites" },
    text: {
      nl: "Gebruikt de standaard playlist URI die in de DJConnect Home Assistant integration is ingesteld.",
      en: "Uses the default playlist URI configured in the DJConnect Home Assistant integration."
    },
    behavior: {
      nl: "Start Spotify playback via de ingestelde standaard playlist.",
      en: "Starts Spotify playback through the configured default playlist."
    },
    examples: {
      nl: ["Speel mijn standaard playlist", "Start favorieten", "Zet liked songs op"],
      en: ["Play my default playlist", "Start liked songs", "Play favorites"]
    }
  },
  {
    id: "playlist",
    spotifyType: "playlist",
    playsMusic: true,
    pill: { nl: "Playlist", en: "Playlist" },
    title: { nl: "Playlist starten", en: "Start a playlist" },
    text: {
      nl: "Gebruik playlist of afspeellijst als je een playlistnaam bedoelt.",
      en: "Use playlist when you mean a playlist name."
    },
    behavior: {
      nl: "Zoekt en start een Spotify playlist.",
      en: "Searches for and starts a Spotify playlist."
    },
    examples: {
      nl: ["Speel playlist DJConnect", "Start mijn afspeellijst Roadtrip", "Zet Chill playlist op", "Draai afspeellijst Avond"],
      en: ["Play playlist DJConnect", "Start my playlist Roadtrip", "Put on Chill playlist"]
    }
  },
  {
    id: "artist_with_track",
    spotifyType: "track",
    playsMusic: true,
    pill: { nl: "Artiest + track", en: "Artist + track" },
    title: { nl: "Nummer met artiestcontext", en: "Song with artist context" },
    text: {
      nl: "Resolvet naar track search met artiestcontext wanneer de zin zowel artiest als nummer noemt.",
      en: "Resolves to track search with artist context when the phrase names both artist and song."
    },
    behavior: {
      nl: "Start Spotify playback via gerichte track search met artiestcontext.",
      en: "Starts Spotify playback through targeted track search with artist context."
    },
    examples: {
      nl: ["Speel nummer Lithium van Nirvana", "Speel Lithium van Nirvana", "Zet het liedje Black van Pearl Jam op", "Draai track Nothing Else Matters van Metallica", "Speel artiest Nirvana met nummer Lithium"],
      en: ["Play Lithium by Nirvana", "Play the track Black by Pearl Jam", "Play artist Nirvana with song Lithium"]
    }
  },
  {
    id: "album",
    spotifyType: "album",
    playsMusic: true,
    pill: { nl: "Album", en: "Album" },
    title: { nl: "Album starten", en: "Start an album" },
    text: {
      nl: "Gebruik album of plaat om album search te forceren, ook wanneer de zin van/by bevat.",
      en: "Use album to force album search, even when the phrase contains van/by."
    },
    behavior: {
      nl: "Zoekt en start een Spotify album.",
      en: "Searches for and starts a Spotify album."
    },
    examples: {
      nl: ["Speel album Nevermind", "Speel album Ten van Pearl Jam", "Zet de plaat OK Computer van Radiohead op", "Draai album Rumours van Fleetwood Mac"],
      en: ["Play album Nevermind", "Play the album Ten by Pearl Jam", "Put on album OK Computer by Radiohead"]
    }
  },
  {
    id: "track",
    spotifyType: "track",
    playsMusic: true,
    pill: { nl: "Track", en: "Track" },
    title: { nl: "Nummer / track zoeken", en: "Find a song / track" },
    text: {
      nl: "Gebruik woorden zoals nummer, liedje, track of song als je echt een specifieke track bedoelt.",
      en: "Use words like song or track when you really mean a specific track."
    },
    behavior: {
      nl: "Zoekt en start een Spotify track.",
      en: "Searches for and starts a Spotify track."
    },
    examples: {
      nl: ["Speel nummer Lithium"],
      en: ["Play song Lithium"]
    }
  },
  {
    id: "artist",
    spotifyType: "artist",
    playsMusic: true,
    pill: { nl: "Artiest", en: "Artist" },
    title: { nl: "Artiest starten", en: "Start an artist" },
    text: {
      nl: "Generieke verzoeken zonder expliciet nummer, album of playlist blijven artist-first.",
      en: "Generic requests without explicit song, album or playlist wording stay artist-first."
    },
    behavior: {
      nl: "Zoekt en start Spotify playback voor de artiest.",
      en: "Searches and starts Spotify playback for the artist."
    },
    examples: {
      nl: ["Speel Nirvana", "Start Metallica", "Zet London Grammar op", "Draai Pearl Jam", "Ik heb wel zin in Nirvana", "Ik wil Metallica horen", "Nirvana wil ik wel horen"],
      en: ["Play Nirvana", "Start Metallica", "Put on London Grammar", "I want Pearl Jam", "I feel like Nirvana"]
    }
  }
];
