window.DJCONNECT_VOICE_INTENTS = [
  {
    id: "artist",
    pill: { nl: "Artiest", en: "Artist" },
    title: { nl: "Artiest starten", en: "Start an artist" },
    text: {
      nl: "Zonder expliciet 'nummer', 'album' of 'playlist' behandelt DJConnect dit als artiestverzoek.",
      en: "Without explicit 'song', 'album' or 'playlist' wording, DJConnect treats this as an artist request."
    },
    examples: {
      nl: ["Speel Nirvana", "Ik heb zin in Pearl Jam", "Ik wil Metallica horen", "Nirvana wil ik wel horen", "Zet London Grammar op", "Zet Heaven aan", "Speel maar af Above & Beyond", "Artiest Nirvana", "Band Pearl Jam"],
      en: ["Play Nirvana", "I feel like Pearl Jam", "I want to hear Metallica", "Put on London Grammar", "Start Above & Beyond", "Artist Nirvana", "Band Pearl Jam"]
    }
  },
  {
    id: "track",
    pill: { nl: "Nummer", en: "Track" },
    title: { nl: "Nummer / track zoeken", en: "Find a song / track" },
    text: {
      nl: "Gebruik woorden zoals nummer, liedje of track als je echt een specifieke track bedoelt.",
      en: "Use words like song or track when you really mean a specific track."
    },
    examples: {
      nl: ["Speel nummer Lithium", "Nummer Lithium", "Speel nummer Lithium van Nirvana", "Speel nummer Lithium van artiest Nirvana", "Speel artiest Nirvana met nummer Lithium", "Start het liedje Everlong", "Zet track Nothing Else Matters van Metallica op", "Draai nummer Teardrop van Massive Attack"],
      en: ["Play song Lithium", "Song Lithium", "Play song Lithium by Nirvana", "Play artist Nirvana with song Lithium", "Start the track Everlong", "Put on track Heroes by David Bowie", "Play song Paranoid Android by Radiohead"]
    }
  },
  {
    id: "album",
    pill: { nl: "Album", en: "Album" },
    title: { nl: "Album starten", en: "Start an album" },
    text: {
      nl: "Gebruik album of plaat om album search te forceren.",
      en: "Use album to force album search."
    },
    examples: {
      nl: ["Speel album Nevermind", "Album Nevermind", "Speel album Ten van Pearl Jam", "De plaat Ten van Pearl Jam", "Start het album Nevermind", "Zet de plaat OK Computer van Radiohead op"],
      en: ["Play album Nevermind", "Album Nevermind", "Play album Ten by Pearl Jam", "The album Ten by Pearl Jam", "Start the album Nevermind", "Put on the album OK Computer by Radiohead"]
    }
  },
  {
    id: "playlist",
    pill: { nl: "Playlist", en: "Playlist" },
    title: { nl: "Playlist starten", en: "Start a playlist" },
    text: {
      nl: "Gebruik playlist of afspeellijst als je een playlistnaam bedoelt.",
      en: "Use playlist when you mean a playlist name."
    },
    examples: {
      nl: ["Speel playlist Roadtrip", "Start mijn playlist Rustig wakker worden", "Zet afspeellijst Dinner Jazz op", "Speel mijn playlist Workout", "Playlist Roadtrip"],
      en: ["Play playlist Roadtrip", "Start my playlist Morning Chill", "Put on playlist Dinner Jazz", "Play my playlist Workout", "Playlist Roadtrip"]
    }
  },
  {
    id: "default_playlist",
    pill: { nl: "Standaard", en: "Default" },
    title: { nl: "Standaard playlist / favorieten", en: "Default playlist / favorites" },
    text: {
      nl: "Deze gebruikt de standaard playlist URI die in de DJConnect Home Assistant integration is ingesteld.",
      en: "This uses the default playlist URI configured in the DJConnect Home Assistant integration."
    },
    examples: {
      nl: ["Speel standaard playlist", "Start mijn favorieten", "Zet liked songs op", "Speel mijn standaard playlist"],
      en: ["Play default playlist", "Start my favorites", "Put on liked songs", "Play my default playlist"]
    }
  },
  {
    id: "playback",
    pill: { nl: "Playback", en: "Playback" },
    title: { nl: "Playback controls", en: "Playback controls" },
    text: {
      nl: "Bedien playback met korte opdrachten naast de app- en deviceknoppen.",
      en: "Control playback with short commands alongside the app and device controls."
    },
    examples: {
      nl: ["Pauze", "Speel verder", "Volgende", "Vorige", "Zet shuffle aan", "Zet shuffle uit", "Herhaal dit nummer", "Zet herhalen uit"],
      en: ["Pause", "Resume", "Next", "Previous", "Turn shuffle on", "Turn shuffle off", "Repeat this song", "Turn repeat off"]
    }
  }
];
