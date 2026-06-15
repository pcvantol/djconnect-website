// Canonical spoken music intent examples live in the Home Assistant repo:
// examples/voice_intents.json. Keep the music families and wording aligned.
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
      nl: ["Speel Nirvana", "Start Metallica", "Zet London Grammar op", "Draai Pearl Jam", "Ik heb wel zin in Nirvana", "Ik wil Metallica horen", "Nirvana wil ik wel horen"],
      en: ["Play Nirvana", "Start Metallica", "Put on London Grammar", "I want Pearl Jam", "I feel like Nirvana"]
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
      nl: ["Speel nummer Lithium", "Speel nummer Lithium van Nirvana", "Speel Lithium van Nirvana", "Zet het liedje Black van Pearl Jam op", "Draai track Nothing Else Matters van Metallica", "Speel artiest Nirvana met nummer Lithium"],
      en: ["Play song Lithium", "Play Lithium by Nirvana", "Play the track Black by Pearl Jam", "Play artist Nirvana with song Lithium"]
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
      nl: ["Speel album Nevermind", "Speel album Ten van Pearl Jam", "Zet de plaat OK Computer van Radiohead op", "Draai album Rumours van Fleetwood Mac"],
      en: ["Play album Nevermind", "Play the album Ten by Pearl Jam", "Put on album OK Computer by Radiohead"]
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
      nl: ["Speel playlist DJConnect", "Start mijn afspeellijst Roadtrip", "Zet Chill playlist op", "Draai afspeellijst Avond"],
      en: ["Play playlist DJConnect", "Start my playlist Roadtrip", "Put on Chill playlist"]
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
      nl: ["Speel mijn standaard playlist", "Start favorieten", "Zet liked songs op"],
      en: ["Play my default playlist", "Start liked songs", "Play favorites"]
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
