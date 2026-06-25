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
                "Vorig liedje",
                "Zet huidig nummer in favorieten",
                "Voeg dit nummer toe aan favorieten",
                "Bewaar deze track in favorieten",
                "Like dit nummer",
                "Zet deze song in mijn liked songs"
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
                "Previous track",
                "Save this track to liked songs",
                "Add this song to favorites",
                "Like this track"
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
      },
      {
        "phrase": {
          "nl": "Zet huidig nummer in favorieten",
          "en": "Save this track to liked songs"
        },
        "command": "save_current_track"
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
    "plays_music": false,
    "action": "none",
    "description": "Short conversational replies are answered naturally without rerunning the previous lookup or mutating playback.",
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
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Gesprek",
      "en": "Chat"
    },
    "title": {
      "nl": "Korte reactie",
      "en": "Short reply"
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
    "id": "help",
    "plays_music": false,
    "action": "none",
    "intent": "help",
    "response_shape": {
      "text_only": true,
      "images": [],
      "playback_actions": []
    },
    "description": "Ask what DJConnect can do. The response is a categorized text-only list of prompt options and must not reuse media cards or artwork.",
    "nl": [
      "Help",
      "Hulp",
      "Wat kun je?",
      "Welke commando's kan ik gebruiken?"
    ],
    "en": [
      "Help",
      "What can you do?",
      "Which commands can I use?"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Help",
      "en": "Help"
    },
    "title": {
      "nl": "Wat kan Ask DJ?",
      "en": "What can Ask DJ do?"
    },
    "examples": {
      "nl": [
        "Help",
        "Hulp",
        "Wat kun je?",
        "Welke commando's kan ik gebruiken?"
      ],
      "en": [
        "Help",
        "What can you do?",
        "Which commands can I use?"
      ]
    }
  },
  {
    "id": "personal_memory_summary",
    "plays_music": false,
    "action": "memory_summary",
    "intent": "personal_memory_summary",
    "response_shape": {
      "text_only": true,
      "images": [],
      "playback_actions": [],
      "sources": [
        "djconnect_memory"
      ]
    },
    "description": "Ask what DJConnect currently remembers about the user. The response must be based on DJ Memory only, without live playback artwork, Spotify profile enrichment, TTS replay or Play Now actions.",
    "nl": [
      "Wat weet je nu over mij?",
      "Wat weet je over mij?",
      "Wat weet DJConnect over mij?",
      "Wat staat er in mijn DJ Memory?",
      "Wat herinner je je over mij?"
    ],
    "en": [
      "What do you know about me?",
      "What does DJConnect know about me?",
      "What is in my DJ Memory?",
      "What do you remember about me?"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Privacy",
      "en": "Privacy"
    },
    "title": {
      "nl": "DJ Memory bekijken",
      "en": "Review DJ Memory"
    },
    "text": {
      "nl": "Privacyvraag over server-side DJ Memory. Render als tekst met bron djconnect_memory: geen oude album art, mediakaarten, TTS replay, Play Now en geen live Spotify playback of Spotify-profielverrijking.",
      "en": "Privacy question about server-side DJ Memory. Render as text with djconnect_memory source: no old album art, media cards, TTS replay, Play Now, live Spotify playback or Spotify profile enrichment."
    },
    "examples": {
      "nl": [
        "Wat weet je nu over mij?",
        "Wat weet je over mij?",
        "Wat weet DJConnect over mij?",
        "Wat staat er in mijn DJ Memory?",
        "Wat herinner je je over mij?"
      ],
      "en": [
        "What do you know about me?",
        "What does DJConnect know about me?",
        "What is in my DJ Memory?",
        "What do you remember about me?"
      ]
    }
  },
  {
    "id": "speaker_outputs",
    "plays_music": false,
    "action": "devices",
    "intent": "list_outputs",
    "response_shape": {
      "playback_actions_kind": "output",
      "button_labels": [
        "Activeer",
        "Actief"
      ]
    },
    "description": "Ask which Spotify output devices are available or request speaker switching. DJConnect returns a text list plus output actions when devices are known.",
    "nl": [
      "Welke speakers zijn er?",
      "Welke apparaten kan ik gebruiken?",
      "Wissel van speaker",
      "Zet de muziek op de woonkamer speaker"
    ],
    "en": [
      "Which speakers are available?",
      "Which devices can I use?",
      "Switch speaker",
      "Move music to the living room speaker"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Speakers",
      "en": "Speakers"
    },
    "title": {
      "nl": "Speaker kiezen",
      "en": "Choose a speaker"
    },
    "examples": {
      "nl": [
        "Welke speakers zijn er?",
        "Welke apparaten kan ik gebruiken?",
        "Wissel van speaker",
        "Zet de muziek op de woonkamer speaker"
      ],
      "en": [
        "Which speakers are available?",
        "Which devices can I use?",
        "Switch speaker",
        "Move music to the living room speaker"
      ]
    }
  },
  {
    "id": "retry_previous_request",
    "plays_music": true,
    "action": "retry",
    "intent": "retry_previous_request",
    "description": "Retry the previous retryable playback request from server-side Ask DJ history or memory. Clients must not reconstruct the old request locally.",
    "nl": [
      "Probeer opnieuw",
      "Nog een keer",
      "Retry",
      "Doe nog eens"
    ],
    "en": [
      "Try again",
      "Retry",
      "One more time",
      "Do that again"
    ],
    "playsMusic": true,
    "messageKind": "user",
    "pill": {
      "nl": "Opnieuw",
      "en": "Retry"
    },
    "title": {
      "nl": "Vorige vraag opnieuw proberen",
      "en": "Retry previous request"
    },
    "examples": {
      "nl": [
        "Probeer opnieuw",
        "Nog een keer",
        "Retry",
        "Doe nog eens"
      ],
      "en": [
        "Try again",
        "Retry",
        "One more time",
        "Do that again"
      ]
    }
  },
  {
    "id": "contextual_play_followup",
    "plays_music": true,
    "action": "play_music",
    "description": "Short playback follow-ups resolve against recent Ask DJ chat context. If the recent track has no artist context, Ask DJ asks which artist the user means instead of guessing.",
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
    ],
    "playsMusic": true,
    "messageKind": "user",
    "pill": {
      "nl": "Context",
      "en": "Context"
    },
    "title": {
      "nl": "Play Now follow-up",
      "en": "Play Now follow-up"
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
    "plays_music": false,
    "action": "none",
    "description": "Ask for an artist's albums. DJConnect can return a chronological album list with proxied album covers and Play Now actions per album.",
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
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Albums",
      "en": "Albums"
    },
    "title": {
      "nl": "Albums van een artiest",
      "en": "Artist albums"
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
    "plays_music": false,
    "action": "none",
    "description": "Ask for artists with similar music, using an explicit artist, current playback artist or recent conversation artist.",
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
    ],
    "playsMusic": false,
    "messageKind": "user",
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
    "plays_music": false,
    "action": "none",
    "description": "Ask what kind of music an artist makes. DJConnect phrases Spotify genre/profile data naturally.",
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
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Stijl",
      "en": "Style"
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
    "plays_music": false,
    "action": "none",
    "description": "Ask for upcoming concerts. DJConnect can return date, location and clickable source links when web agenda data is available.",
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
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Concerten",
      "en": "Concerts"
    },
    "title": {
      "nl": "Concertagenda",
      "en": "Concert calendar"
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
    "plays_music": false,
    "action": "none",
    "description": "Ask what the next queued track is. DJConnect reads Spotify queue context and can return track, artist, album art and a Play Now action without skipping automatically.",
    "nl": [
      "Wat wordt het volgende nummer?",
      "Wat is het volgende nummer?",
      "Welke track komt hierna?"
    ],
    "en": [
      "What is the next song?",
      "Which track is up next?",
      "What will play next?"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Wachtrij",
      "en": "Queue"
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
    "plays_music": false,
    "action": "profile_analysis",
    "description": "Ask for a personal listening profile based on DJConnect Memory and Spotify recently played/top profile data.",
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
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Profiel",
      "en": "Profile"
    },
    "title": {
      "nl": "Luisterprofiel analyseren",
      "en": "Analyze listening profile"
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
    "id": "recently_played_history",
    "plays_music": false,
    "action": "recently_played",
    "intent": "recently_played_history",
    "intent_category": "informational",
    "sources": [
      "spotify_recently_played"
    ],
    "item_types": [
      "tracks",
      "albums",
      "artists",
      "playlists"
    ],
    "response_shape": {
      "items": true,
      "assistant_message_items": true,
      "images": true,
      "playback_actions": "none unless explicitly returned by backend",
      "rendering": "compact_list"
    },
    "description": "Ask for recent listening-history lists for tracks, albums, artists or playlist contexts. DJConnect reads Spotify recently played data and returns read-only items with art/icon metadata.",
    "nl": [
      "Welke nummers heb ik afgelopen uur afgespeeld?",
      "Welke tracks heb ik net gehoord?",
      "Welke albums heb ik vandaag geluisterd?",
      "Welke artiesten hoorde ik net?",
      "Welke playlists heb ik afgelopen uur gespeeld?",
      "Wat heb ik vandaag geluisterd?"
    ],
    "en": [
      "Which tracks did I play in the last hour?",
      "Which songs did I just hear?",
      "Which albums did I listen to today?",
      "Which artists did I just hear?",
      "Which playlists did I play in the last hour?",
      "What did I listen to today?"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Recent",
      "en": "Recent"
    },
    "title": {
      "nl": "Recent geluisterd",
      "en": "Recently played"
    },
    "examples": {
      "nl": [
        "Welke nummers heb ik afgelopen uur afgespeeld?",
        "Welke tracks heb ik net gehoord?",
        "Welke albums heb ik vandaag geluisterd?",
        "Welke artiesten hoorde ik net?",
        "Welke playlists heb ik afgelopen uur gespeeld?",
        "Wat heb ik vandaag geluisterd?"
      ],
      "en": [
        "Which tracks did I play in the last hour?",
        "Which songs did I just hear?",
        "Which albums did I listen to today?",
        "Which artists did I just hear?",
        "Which playlists did I play in the last hour?",
        "What did I listen to today?"
      ]
    }
  },
  {
    "id": "personal_music_recommendations",
    "plays_music": false,
    "action": "none",
    "description": "Ask for recommendations. DJConnect can return Play Now actions but does not start playback until the user taps Play Now.",
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
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Aanbeveling",
      "en": "Recommendation"
    },
    "title": {
      "nl": "Persoonlijke aanbevelingen",
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
    "plays_music": false,
    "action": "none",
    "description": "Ask DJ to compose a playable mix from artist, track or genre seeds. The response returns a track_mix Play Now action and can later save the mix as a Spotify playlist.",
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
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Mix",
      "en": "Mix"
    },
    "title": {
      "nl": "Mix of playlist samenstellen",
      "en": "Build a mix or playlist"
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
    "id": "save_current_track",
    "plays_music": false,
    "action": "save_current_track",
    "intent": "playback_control",
    "response_shape": {
      "text_only": true,
      "images": [],
      "playback_actions": []
    },
    "description": "Save the currently playing Spotify track to the user's Liked Songs/favorites. Now Playing cards can expose this as a control action labelled Zet in favorieten.",
    "nl": [
      "Zet huidig nummer in favorieten",
      "Voeg dit nummer toe aan favorieten",
      "Bewaar deze track in favorieten",
      "Like dit nummer"
    ],
    "en": [
      "Save this track to liked songs",
      "Add this song to favorites",
      "Like this track",
      "Save the current song"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Favoriet",
      "en": "Favorite"
    },
    "title": {
      "nl": "Huidig nummer opslaan",
      "en": "Save current track"
    },
    "text": {
      "nl": "Slaat de huidige Spotify-track op in Liked Songs/favorieten. Geen Spotify search, geen media card en geen extra artwork.",
      "en": "Saves the currently playing Spotify track to Liked Songs/favorites. No Spotify search, media card or extra artwork."
    },
    "examples": {
      "nl": [
        "Zet huidig nummer in favorieten",
        "Voeg dit nummer toe aan favorieten",
        "Bewaar deze track in favorieten",
        "Like dit nummer"
      ],
      "en": [
        "Save this track to liked songs",
        "Add this song to favorites",
        "Like this track",
        "Save the current song"
      ]
    }
  },
  {
    "id": "dj_announcement",
    "plays_music": false,
    "action": "announce",
    "description": "Ask for a DJ-style announcement for the current or next track without changing playback.",
    "nl": [
      "Geef me een leuke aankondiging voor wat nu speelt",
      "Maak een DJ intro voor dit nummer",
      "Vertel iets leuks over het volgende nummer"
    ],
    "en": [
      "Give me a fun announcement for what is playing now",
      "Make a DJ intro for this song",
      "Tell me something fun about the next track"
    ],
    "playsMusic": false,
    "messageKind": "user",
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
    "plays_music": false,
    "action": "none",
    "message_kind": "system",
    "origin": "spotify_playback_context",
    "description": "Backend-generated text-only Ask DJ fact when Spotify playback moves to another artist/album combination. This has no user phrase and is included so website/client docs can explain the system bubble.",
    "nl": [
      "Automatisch DJ feitje bij nieuw album of nieuwe artiest"
    ],
    "en": [
      "Automatic DJ fact when a new album or artist starts"
    ],
    "playsMusic": false,
    "messageKind": "system",
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
    "plays_music": false,
    "action": "none",
    "message_kind": "system",
    "origin": "idle_suggestion",
    "description": "Backend-generated Ask DJ system message when the client opens Ask DJ while Spotify is idle. It can include one personalized Play Now action.",
    "nl": [
      "Er speelt nu niets. Zin in iets nieuws?"
    ],
    "en": [
      "Nothing is playing right now. Want something new?"
    ],
    "playsMusic": false,
    "messageKind": "system",
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
