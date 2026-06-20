// Canonical spoken intent examples live in the Home Assistant repo:
// examples/voice_intents.json and VOICE_INTENT_DATA.md. Keep IDs, order and wording aligned.
window.DJCONNECT_VOICE_INTENTS = [
  {
    "id": "current_track",
    "spotifyType": "status",
    "playsMusic": false,
    "pill": {
      "nl": "Status",
      "en": "Status"
    },
    "title": {
      "nl": "Wat draait er nu?",
      "en": "What is playing?"
    },
    "text": {
      "nl": "Leest de huidige Spotify playback-status en geeft een DJ-response. Dit start of wijzigt geen muziek.",
      "en": "Reads the current Spotify playback status and returns a DJ response. This does not start or change music."
    },
    "behavior": {
      "nl": "Geen Spotify search. Geen playback-start. Alleen status lezen en antwoord geven.",
      "en": "No Spotify search. No playback start. Only read status and answer."
    },
    "examples": {
      "nl": [
        "Welk nummer draait er nu?",
        "Welk nummer speelt er nu?",
        "Wat draait er?",
        "Wat speelt er?",
        "Wat is dit?"
      ],
      "en": [
        "What song is playing?",
        "What track is playing now?",
        "What's playing?",
        "Which song is this?"
      ]
    }
  },
  {
    "id": "playback_control",
    "spotifyType": "backend_command",
    "playsMusic": false,
    "pill": {
      "nl": "Bediening",
      "en": "Control"
    },
    "title": {
      "nl": "Playback direct bedienen",
      "en": "Direct playback control"
    },
    "text": {
      "nl": "Roept direct backend commands aan. DJConnect voert geen Spotify search uit en behandelt deze zinnen niet als muziekzoekopdracht.",
      "en": "Calls backend commands directly. DJConnect does not run Spotify search or treat these phrases as music search requests."
    },
    "behavior": {
      "nl": "Geen Spotify search. Direct command uitvoeren en daarna een DJ-response geven.",
      "en": "No Spotify search. Run the command directly and then return a DJ response."
    },
    "examples": {
          "nl": [
                "Stop muziek",
                "Stop de muziek",
                "Pauzeer muziek",
                "Start muziek",
                "Start de muziek",
                "Hervat muziek",
                "Zet harder",
                "Zet de muziek harder",
                "Volume omhoog",
                "Zet zachter",
                "Zet de muziek zachter",
                "Volume omlaag",
                "Volgende nummer",
                "Volgend nummer",
                "Volgende track",
                "Vorig nummer",
                "Vorige track",
                "Vorig liedje"
          ],
          "en": [
                "Stop music",
                "Pause music",
                "Start music",
                "Play music",
                "Resume music",
                "Turn it up",
                "Volume up",
                "Louder",
                "Turn it down",
                "Volume down",
                "Quieter",
                "Next song",
                "Next track",
                "Skip",
                "Previous song",
                "Previous track"
          ]
    },
    "commands": [
      {
        "phrase": {
          "nl": "Stop muziek",
          "en": "Stop music"
        },
        "command": "pause"
      },
      {
        "phrase": {
          "nl": "Start muziek",
          "en": "Start music"
        },
        "command": "play/resume"
      },
      {
        "phrase": {
          "nl": "Zet harder",
          "en": "Turn it up"
        },
        "command": "volume +10"
      },
      {
        "phrase": {
          "nl": "Zet zachter",
          "en": "Turn it down"
        },
        "command": "volume -10"
      },
      {
        "phrase": {
          "nl": "Volgende nummer",
          "en": "Next song"
        },
        "command": "next"
      },
      {
        "phrase": {
          "nl": "Vorig nummer",
          "en": "Previous song"
        },
        "command": "previous"
      }
    ]
  },
  {
    "id": "default_playlist",
    "spotifyType": "playlist",
    "playsMusic": true,
    "pill": {
      "nl": "Standaard",
      "en": "Default"
    },
    "title": {
      "nl": "Standaard playlist / favorieten",
      "en": "Default playlist / favorites"
    },
    "text": {
      "nl": "Gebruikt de standaard playlist URI die in de DJConnect Home Assistant integration is ingesteld.",
      "en": "Uses the default playlist URI configured in the DJConnect Home Assistant integration."
    },
    "behavior": {
      "nl": "Start Spotify playback via de ingestelde standaard playlist.",
      "en": "Starts Spotify playback through the configured default playlist."
    },
    "examples": {
      "nl": [
        "Speel mijn standaard playlist",
        "Start favorieten",
        "Zet liked songs op"
      ],
      "en": [
        "Play my default playlist",
        "Start liked songs",
        "Play favorites"
      ]
    }
  },
  {
    "id": "playlist",
    "spotifyType": "playlist",
    "playsMusic": true,
    "pill": {
      "nl": "Playlist",
      "en": "Playlist"
    },
    "title": {
      "nl": "Playlist starten",
      "en": "Start a playlist"
    },
    "text": {
      "nl": "Gebruik playlist of afspeellijst als je een playlistnaam bedoelt.",
      "en": "Use playlist when you mean a playlist name."
    },
    "behavior": {
      "nl": "Zoekt en start een Spotify playlist.",
      "en": "Searches for and starts a Spotify playlist."
    },
    "examples": {
      "nl": [
        "Speel playlist DJConnect",
        "Start mijn afspeellijst Roadtrip",
        "Zet Chill playlist op",
        "Draai afspeellijst Avond"
      ],
      "en": [
        "Play playlist DJConnect",
        "Start my playlist Roadtrip",
        "Put on Chill playlist"
      ]
    }
  },
  {
    "id": "artist_with_track",
    "spotifyType": "track",
    "playsMusic": true,
    "pill": {
      "nl": "Artiest + track",
      "en": "Artist + track"
    },
    "title": {
      "nl": "Nummer met artiestcontext",
      "en": "Song with artist context"
    },
    "text": {
      "nl": "Resolvet naar track search met artiestcontext wanneer de zin zowel artiest als nummer noemt.",
      "en": "Resolves to track search with artist context when the phrase names both artist and song."
    },
    "behavior": {
      "nl": "Start Spotify playback via gerichte track search met artiestcontext.",
      "en": "Starts Spotify playback through targeted track search with artist context."
    },
    "examples": {
      "nl": [
        "Speel nummer Lithium van Nirvana",
        "Speel Lithium van Nirvana",
        "Zet het liedje Black van Pearl Jam op",
        "Draai track Nothing Else Matters van Metallica",
        "Speel artiest Nirvana met nummer Lithium"
      ],
      "en": [
        "Play Lithium by Nirvana",
        "Play the track Black by Pearl Jam",
        "Play artist Nirvana with song Lithium"
      ]
    }
  },
  {
    "id": "album",
    "spotifyType": "album",
    "playsMusic": true,
    "pill": {
      "nl": "Album",
      "en": "Album"
    },
    "title": {
      "nl": "Album starten",
      "en": "Start an album"
    },
    "text": {
      "nl": "Gebruik album of plaat om album search te forceren, ook wanneer de zin van/by bevat.",
      "en": "Use album to force album search, even when the phrase contains van/by."
    },
    "behavior": {
      "nl": "Zoekt en start een Spotify album.",
      "en": "Searches for and starts a Spotify album."
    },
    "examples": {
      "nl": [
        "Speel album Nevermind",
        "Speel album Ten van Pearl Jam",
        "Zet de plaat OK Computer van Radiohead op",
        "Draai album Rumours van Fleetwood Mac"
      ],
      "en": [
        "Play album Nevermind",
        "Play the album Ten by Pearl Jam",
        "Put on album OK Computer by Radiohead"
      ]
    }
  },
  {
    "id": "track",
    "spotifyType": "track",
    "playsMusic": true,
    "pill": {
      "nl": "Track",
      "en": "Track"
    },
    "title": {
      "nl": "Nummer / track zoeken",
      "en": "Find a song / track"
    },
    "text": {
      "nl": "Gebruik woorden zoals nummer, liedje, track of song als je echt een specifieke track bedoelt.",
      "en": "Use words like song or track when you really mean a specific track."
    },
    "behavior": {
      "nl": "Zoekt en start een Spotify track.",
      "en": "Searches for and starts a Spotify track."
    },
    "examples": {
      "nl": [
        "Speel nummer Lithium"
      ],
      "en": [
        "Play song Lithium"
      ]
    }
  },
  {
    "id": "artist",
    "spotifyType": "artist",
    "playsMusic": true,
    "pill": {
      "nl": "Artiest",
      "en": "Artist"
    },
    "title": {
      "nl": "Artiest starten",
      "en": "Start an artist"
    },
    "text": {
      "nl": "Generieke verzoeken zonder expliciet nummer, album of playlist blijven artist-first.",
      "en": "Generic requests without explicit song, album or playlist wording stay artist-first."
    },
    "behavior": {
      "nl": "Zoekt en start Spotify playback voor de artiest.",
      "en": "Searches and starts Spotify playback for the artist."
    },
    "examples": {
      "nl": [
        "Speel Nirvana",
        "Start Metallica",
        "Zet London Grammar op",
        "Draai Pearl Jam",
        "Ik heb wel zin in Nirvana",
        "Ik wil Metallica horen",
        "Nirvana wil ik wel horen"
      ],
      "en": [
        "Play Nirvana",
        "Start Metallica",
        "Put on London Grammar",
        "I want Pearl Jam",
        "I feel like Nirvana"
      ]
    }
  }
];

window.DJCONNECT_ASK_DJ_INTENTS = [
  {
    "id": "conversation_followup",
    "playsMusic": false,
    "action": "none",
    "messageKind": "user",
    "origin": null,
    "description": "Short conversational replies are answered naturally without rerunning the previous lookup or mutating playback.",
    "pill": {
      "nl": "Follow-up",
      "en": "Follow-up"
    },
    "title": {
      "nl": "Korte reacties",
      "en": "Short replies"
    },
    "examples": {
      "nl": [
        "Geeft niet",
        "Dank je",
        "Laat maar",
        "Prima",
        "Jammer"
      ],
      "en": [
        "No worries",
        "Thanks",
        "Never mind",
        "That's fine",
        "Too bad"
      ]
    }
  },
  {
    "id": "contextual_play_followup",
    "playsMusic": true,
    "action": "play_music",
    "messageKind": "user",
    "origin": null,
    "description": "Short playback follow-ups resolve against recent Ask DJ chat context. If the recent track has no artist context, Ask DJ asks which artist the user means instead of guessing.",
    "pill": {
      "nl": "Context",
      "en": "Context"
    },
    "title": {
      "nl": "Contextueel afspelen",
      "en": "Contextual playback"
    },
    "examples": {
      "nl": [
        "Speel af",
        "Speel maar",
        "Speel maar af",
        "Zet maar op",
        "Wat is die beuker?",
        "Speel die dikke knaller",
        "Vertel iets over die monsterhit",
        "Welke artiest bedoel je?"
      ],
      "en": [
        "Play it",
        "Play that",
        "Play this",
        "Which artist do you mean?"
      ]
    }
  },
  {
    "id": "album_discography",
    "playsMusic": false,
    "action": "none",
    "messageKind": "user",
    "origin": null,
    "description": "Ask for an artist's albums. DJConnect can return a chronological album list with proxied album covers and Play Now actions per album.",
    "pill": {
      "nl": "Albums",
      "en": "Albums"
    },
    "title": {
      "nl": "Discografie vragen",
      "en": "Discography questions"
    },
    "examples": {
      "nl": [
        "Welke albums hebben Radiohead uitgebracht?",
        "Welke albums bracht deze artiest uit?",
        "Welke albums zijn er van Prince?",
        "Albums van Suzan en Freek",
        "Geef me de albums van Guns N' Roses"
      ],
      "en": [
        "Which albums has Radiohead released?",
        "Which albums did this artist release?",
        "Albums by Prince"
      ]
    }
  },
  {
    "id": "similar_artists",
    "playsMusic": false,
    "action": "none",
    "messageKind": "user",
    "origin": null,
    "description": "Ask for artists with similar music, using an explicit artist, current playback artist or recent conversation artist.",
    "pill": {
      "nl": "Vergelijkbaar",
      "en": "Similar"
    },
    "title": {
      "nl": "Vergelijkbare artiesten",
      "en": "Similar artists"
    },
    "examples": {
      "nl": [
        "Welke artiesten maken vergelijkbare muziek als Radiohead?",
        "Welke artiesten maken vergelijkbare muziek als wat nu speelt?",
        "Welke artiesten lijken op deze artiest?",
        "Vergelijkbare artiesten als de artiest waar het in de conversatie over gaat"
      ],
      "en": [
        "Which artists make similar music to Radiohead?",
        "Which artists are similar to what is playing now?",
        "Similar artists to this artist"
      ]
    }
  },
  {
    "id": "artist_genre_style",
    "playsMusic": false,
    "action": "none",
    "messageKind": "user",
    "origin": null,
    "description": "Ask what kind of music an artist makes. DJConnect phrases Spotify genre/profile data naturally.",
    "pill": {
      "nl": "Genre",
      "en": "Genre"
    },
    "title": {
      "nl": "Genre en stijl",
      "en": "Genre and style"
    },
    "examples": {
      "nl": [
        "Wat voor muziek maakt Beastie Boys?",
        "Wat voor muziek maakt deze artiest?",
        "Welk genre maakt Muse?",
        "Wat is het genre van Radiohead?"
      ],
      "en": [
        "What kind of music does Beastie Boys make?",
        "What kind of music does this artist make?",
        "What genre is Muse?"
      ]
    }
  },
  {
    "id": "concert_agenda",
    "playsMusic": false,
    "action": "none",
    "messageKind": "user",
    "origin": null,
    "description": "Ask for upcoming concerts. DJConnect can return date, location and clickable source links when web agenda data is available.",
    "pill": {
      "nl": "Concerten",
      "en": "Concerts"
    },
    "title": {
      "nl": "Concertagenda",
      "en": "Concert agenda"
    },
    "examples": {
      "nl": [
        "Wanneer speelt Radiohead in Nederland?",
        "Heeft deze artiest binnenkort concerten?",
        "Concerten van The National",
        "Tourdata voor Muse"
      ],
      "en": [
        "When does Radiohead play in the Netherlands?",
        "Does this artist have upcoming concerts?",
        "Concerts for The National",
        "Tour dates for Muse"
      ]
    }
  },
  {
    "id": "next_track_info",
    "playsMusic": false,
    "action": "none",
    "messageKind": "user",
    "origin": null,
    "description": "Ask what the next queued track is. DJConnect reads Spotify queue context and can return track, artist, album art and a Play Now action without skipping automatically.",
    "pill": {
      "nl": "Volgende",
      "en": "Next"
    },
    "title": {
      "nl": "Volgende track",
      "en": "Next track"
    },
    "examples": {
      "nl": [
        "Wat wordt het volgende nummer?",
        "Wat is het volgende nummer?",
        "Welke track komt hierna?"
      ],
      "en": [
        "What is the next song?",
        "Which track is up next?",
        "What will play next?"
      ]
    }
  },
  {
    "id": "personal_music_profile_analysis",
    "playsMusic": false,
    "action": "profile_analysis",
    "messageKind": "user",
    "origin": null,
    "description": "Ask for a personal listening profile based on DJConnect Memory and Spotify recently played/top profile data.",
    "pill": {
      "nl": "Profiel",
      "en": "Profile"
    },
    "title": {
      "nl": "Luisterprofiel",
      "en": "Listening profile"
    },
    "examples": {
      "nl": [
        "Omschrijf eens waar ik zoal naar luisterde de afgelopen maand",
        "Wat zegt mijn muziek van de laatste twee weken over mijn stemming?",
        "Welke genres luister ik de laatste tijd veel?",
        "Maak een profiel van mijn muzieksmaak dit jaar"
      ],
      "en": [
        "Describe what I have been listening to over the last month",
        "What does my music from the last two weeks say about my mood?",
        "Which genres have I been listening to lately?",
        "Make a profile of my music taste this year"
      ]
    }
  },
  {
    "id": "personal_music_recommendations",
    "playsMusic": false,
    "action": "none",
    "messageKind": "user",
    "origin": null,
    "description": "Ask for recommendations. DJConnect can return Play Now actions but does not start playback until the user taps Play Now.",
    "pill": {
      "nl": "Aanbevelingen",
      "en": "Recommendations"
    },
    "title": {
      "nl": "Persoonlijke tips",
      "en": "Personal recommendations"
    },
    "examples": {
      "nl": [
        "Speel wat anders",
        "Doe maar wat leuks van Radiohead",
        "Zet een leuke playlist op met rustige muziek",
        "Ik voel me moe en geprikkeld, zet iets ontspannends klaar"
      ],
      "en": [
        "Play something different",
        "Give me something fun by Radiohead",
        "Find a nice playlist with calm music",
        "I feel tired and overstimulated, suggest something relaxing"
      ]
    }
  },
  {
    "id": "seed_playlist_mix",
    "playsMusic": false,
    "action": "none",
    "messageKind": "user",
    "origin": null,
    "description": "Ask DJ to compose a playable mix from artist, track or genre seeds. The response returns a track_mix Play Now action and can later save the mix as a Spotify playlist.",
    "pill": {
      "nl": "Mix",
      "en": "Mix"
    },
    "title": {
      "nl": "Mix samenstellen",
      "en": "Build a mix"
    },
    "examples": {
      "nl": [
        "Stel een playlist samen op basis van Radiohead, Massive Attack en Portishead",
        "Maak een mix met Above & Beyond, Armin van Buuren en Ferry Corsten",
        "Ik wil een playlist obv tracks Reckoner, Teardrop en Angel",
        "Ik wil een playlist in genre ambient, techno en downtempo",
        "Sla deze mix op als Spotify playlist"
      ],
      "en": [
        "Create a playlist based on Radiohead, Massive Attack and Portishead",
        "Make a mix with Above & Beyond, Armin van Buuren and Ferry Corsten",
        "I want a playlist based on tracks Reckoner, Teardrop and Angel",
        "I want a playlist in genres ambient, techno and downtempo",
        "Save this mix as a Spotify playlist"
      ]
    }
  },
  {
    "id": "dj_announcement",
    "playsMusic": false,
    "action": "announce",
    "messageKind": "user",
    "origin": null,
    "description": "Ask for a DJ-style announcement for the current or next track without changing playback.",
    "pill": {
      "nl": "DJ intro",
      "en": "DJ intro"
    },
    "title": {
      "nl": "DJ-aankondiging",
      "en": "DJ announcement"
    },
    "examples": {
      "nl": [
        "Geef me een leuke aankondiging voor wat nu speelt",
        "Maak een DJ intro voor dit nummer",
        "Vertel iets leuks over het volgende nummer"
      ],
      "en": [
        "Give me a fun announcement for what is playing now",
        "Make a DJ intro for this song",
        "Tell me something fun about the next track"
      ]
    }
  },
  {
    "id": "ambient_music_fact",
    "playsMusic": false,
    "action": "none",
    "messageKind": "system",
    "origin": "spotify_playback_context",
    "description": "Backend-generated text-only Ask DJ fact when Spotify playback moves to another artist/album combination. This has no user phrase and is included so website/client docs can explain the system bubble.",
    "pill": {
      "nl": "Systeem",
      "en": "System"
    },
    "title": {
      "nl": "Automatisch feitje",
      "en": "Automatic fact"
    },
    "examples": {
      "nl": [
        "Automatisch DJ feitje bij nieuw album of nieuwe artiest"
      ],
      "en": [
        "Automatic DJ fact when a new album or artist starts"
      ]
    }
  },
  {
    "id": "idle_suggestion",
    "playsMusic": false,
    "action": "none",
    "messageKind": "system",
    "origin": "idle_suggestion",
    "description": "Backend-generated Ask DJ system message when the client opens Ask DJ while Spotify is idle. It can include one personalized Play Now action.",
    "pill": {
      "nl": "Suggestie",
      "en": "Suggestion"
    },
    "title": {
      "nl": "Idle suggestie",
      "en": "Idle suggestion"
    },
    "examples": {
      "nl": [
        "Er speelt nu niets. Zin in iets nieuws?"
      ],
      "en": [
        "Nothing is playing right now. Want something new?"
      ]
    }
  }
];
