// Canonical spoken intent examples live in the Home Assistant repo:
// examples/voice_intents.json and VOICE_INTENT_DATA.md. Keep IDs, order and wording aligned.
window.DJCONNECT_VOICE_INTENTS = [
  {
    "id": "current_track",
    "spotifyType": "status",
    "playsMusic": false,
    "pill": {
      "nl": "Status",
      "en": "Status",
      "de": "Status",
      "fr": "Statut",
      "es": "Estado"
    },
    "title": {
      "nl": "Wat draait er nu?",
      "en": "What is playing?",
      "de": "Was laeuft gerade?",
      "fr": "Que joue-t-on maintenant ?",
      "es": "Que esta sonando?"
    },
    "text": {
      "nl": "Leest de huidige playback-status en geeft een DJ-response. Dit start of wijzigt geen muziek.",
      "en": "Reads the current playback status and returns a DJ response. This does not start or change music.",
      "de": "Liest den aktuellen Wiedergabestatus und gibt eine DJ-Antwort. Das startet oder aendert keine Musik.",
      "fr": "Lit le statut de lecture actuel et renvoie une reponse DJ. Cela ne demarre ni ne modifie la musique.",
      "es": "Lee el estado de reproduccion actual y devuelve una respuesta de DJ. No inicia ni cambia musica."
    },
    "behavior": {
      "nl": "Geen Spotify search. Geen playback-start. Alleen status lezen en antwoord geven.",
      "en": "No Spotify search. No playback start. Only read status and answer.",
      "de": "Keine Spotify-Suche. Kein Wiedergabestart. Nur Status lesen und antworten.",
      "fr": "Pas de recherche Spotify. Pas de demarrage de lecture. Lecture du statut et reponse seulement.",
      "es": "Sin busqueda en Spotify. Sin iniciar reproduccion. Solo lee el estado y responde."
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
      ],
      "de": [
        "Welcher Song laeuft gerade?",
        "Welcher Track spielt jetzt?",
        "Was laeuft?",
        "Welches Lied ist das?"
      ],
      "fr": [
        "Quelle chanson passe ?",
        "Quel morceau joue maintenant ?",
        "Qu est-ce qui passe ?",
        "C est quelle chanson ?"
      ],
      "es": [
        "Que cancion esta sonando?",
        "Que tema suena ahora?",
        "Que esta sonando?",
        "Que cancion es esta?"
      ]
    }
  },
  {
    "id": "playback_control",
    "spotifyType": "backend_command",
    "playsMusic": false,
    "pill": {
      "nl": "Bediening",
      "en": "Control",
      "de": "Steuerung",
      "fr": "Controle",
      "es": "Control"
    },
    "title": {
      "nl": "Playback direct bedienen",
      "en": "Direct playback control",
      "de": "Wiedergabe direkt steuern",
      "fr": "Controler directement la lecture",
      "es": "Control directo de reproduccion"
    },
    "text": {
      "nl": "Roept direct backend commands aan. DJConnect voert geen Spotify search uit en behandelt deze zinnen niet als muziekzoekopdracht.",
      "en": "Calls backend commands directly. DJConnect does not run Spotify search or treat these phrases as music search requests.",
      "de": "Fuehrt direkte Backend-Befehle aus. DJConnect startet keine Spotify-Suche und behandelt diese Saetze nicht als Musiksuche.",
      "fr": "Appelle directement les commandes backend. DJConnect ne lance pas de recherche Spotify et ne traite pas ces phrases comme des recherches musicales.",
      "es": "Ejecuta comandos directos del backend. DJConnect no realiza una busqueda en Spotify ni trata estas frases como busquedas de musica."
    },
    "behavior": {
      "nl": "Geen Spotify search. Direct command uitvoeren en daarna een DJ-response geven.",
      "en": "No Spotify search. Run the command directly and then return a DJ response.",
      "de": "Keine Spotify-Suche. Befehl direkt ausfuehren und danach eine DJ-Antwort geben.",
      "fr": "Pas de recherche Spotify. Executer la commande directement puis donner une reponse DJ.",
      "es": "Sin busqueda en Spotify. Ejecuta el comando directamente y luego devuelve una respuesta de DJ."
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
      ],
      "de": [
        "Musik stoppen",
        "Musik pausieren",
        "Musik starten",
        "Mach lauter",
        "Lautstaerke hoch",
        "Mach leiser",
        "Naechster Song",
        "Vorheriger Song",
        "Diesen Track speichern"
      ],
      "fr": [
        "Arrete la musique",
        "Mets la musique en pause",
        "Lance la musique",
        "Monte le volume",
        "Baisse le volume",
        "Morceau suivant",
        "Morceau precedent",
        "Ajoute ce titre aux favoris"
      ],
      "es": [
        "Para la musica",
        "Pausa la musica",
        "Inicia la musica",
        "Sube el volumen",
        "Baja el volumen",
        "Siguiente cancion",
        "Cancion anterior",
        "Guarda este tema en favoritos"
      ]
    },
    "commands": [
      {
        "phrase": {
          "nl": "Stop muziek",
          "en": "Stop music",
          "de": "Musik stoppen",
          "fr": "Arrete la musique",
          "es": "Para la musica"
        },
        "command": "pause"
      },
      {
        "phrase": {
          "nl": "Start muziek",
          "en": "Start music",
          "de": "Musik starten",
          "fr": "Lance la musique",
          "es": "Inicia la musica"
        },
        "command": "play/resume"
      },
      {
        "phrase": {
          "nl": "Zet harder",
          "en": "Turn it up",
          "de": "Mach lauter",
          "fr": "Monte le volume",
          "es": "Sube el volumen"
        },
        "command": "volume +10"
      },
      {
        "phrase": {
          "nl": "Zet zachter",
          "en": "Turn it down",
          "de": "Mach leiser",
          "fr": "Baisse le volume",
          "es": "Baja el volumen"
        },
        "command": "volume -10"
      },
      {
        "phrase": {
          "nl": "Volgende nummer",
          "en": "Next song",
          "de": "Naechster Song",
          "fr": "Morceau suivant",
          "es": "Siguiente cancion"
        },
        "command": "next"
      },
      {
        "phrase": {
          "nl": "Vorig nummer",
          "en": "Previous song",
          "de": "Vorheriger Song",
          "fr": "Morceau precedent",
          "es": "Cancion anterior"
        },
        "command": "previous"
      },
      {
        "phrase": {
          "nl": "Zet huidig nummer in favorieten",
          "en": "Save this track to liked songs",
          "de": "Diesen Track speichern",
          "fr": "Ajoute ce titre aux favoris",
          "es": "Guarda este tema en favoritos"
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
      "en": "Default",
      "de": "Standard",
      "fr": "Defaut",
      "es": "Predeterminada"
    },
    "title": {
      "nl": "Standaard playlist / favorieten",
      "en": "Default playlist / favorites",
      "de": "Standard-Playlist / Favoriten",
      "fr": "Playlist par defaut / favoris",
      "es": "Playlist predeterminada / favoritos"
    },
    "text": {
      "nl": "Gebruikt de standaard playlist URI die in de DJConnect Home Assistant integration is ingesteld.",
      "en": "Uses the default playlist URI configured in the DJConnect Home Assistant integration.",
      "de": "Verwendet die Standard-Playlist-URI, die in der DJConnect Home Assistant Integration eingestellt ist.",
      "fr": "Utilise l URI de playlist par defaut configuree dans l integration Home Assistant DJConnect.",
      "es": "Usa la URI de playlist predeterminada configurada en la integracion DJConnect de Home Assistant."
    },
    "behavior": {
      "nl": "Start playback via de ingestelde standaard playlist.",
      "en": "Starts playback through the configured default playlist.",
      "de": "Startet die Wiedergabe ueber die konfigurierte Standard-Playlist.",
      "fr": "Demarre la lecture via la playlist par defaut configuree.",
      "es": "Inicia la reproduccion mediante la playlist predeterminada configurada."
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
      ],
      "de": [
        "Spiele meine Standard-Playlist",
        "Starte Favoriten",
        "Spiel meine Lieblingssongs"
      ],
      "fr": [
        "Lance ma playlist par defaut",
        "Lance les favoris",
        "Mets mes titres aimes"
      ],
      "es": [
        "Reproduce mi playlist predeterminada",
        "Inicia favoritos",
        "Pon canciones favoritas"
      ]
    }
  },
  {
    "id": "playlist",
    "spotifyType": "playlist",
    "playsMusic": true,
    "pill": {
      "nl": "Playlist",
      "en": "Playlist",
      "de": "Playlist",
      "fr": "Playlist",
      "es": "Playlist"
    },
    "title": {
      "nl": "Playlist starten",
      "en": "Start a playlist",
      "de": "Playlist starten",
      "fr": "Lancer une playlist",
      "es": "Iniciar una playlist"
    },
    "text": {
      "nl": "Gebruik playlist of afspeellijst als je een playlistnaam bedoelt.",
      "en": "Use playlist when you mean a playlist name.",
      "de": "Verwende Playlist, wenn du einen Playlistnamen meinst.",
      "fr": "Utilise playlist quand tu veux designer un nom de playlist.",
      "es": "Usa playlist cuando te refieres al nombre de una playlist."
    },
    "behavior": {
      "nl": "Zoekt en start een Spotify playlist.",
      "en": "Searches for and starts a Spotify playlist.",
      "de": "Sucht und startet eine Spotify-Playlist.",
      "fr": "Recherche et lance une playlist Spotify.",
      "es": "Busca e inicia una playlist de Spotify."
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
      ],
      "de": [
        "Spiele Playlist DJConnect",
        "Starte meine Playlist Roadtrip",
        "Mach die Chill-Playlist an"
      ],
      "fr": [
        "Lance la playlist DJConnect",
        "Lance ma playlist Roadtrip",
        "Mets la playlist Chill"
      ],
      "es": [
        "Reproduce playlist DJConnect",
        "Inicia mi playlist Roadtrip",
        "Pon la playlist Chill"
      ]
    }
  },
  {
    "id": "artist_with_track",
    "spotifyType": "track",
    "playsMusic": true,
    "pill": {
      "nl": "Artiest + track",
      "en": "Artist + track",
      "de": "Kuenstler + Track",
      "fr": "Artiste + titre",
      "es": "Artista + tema"
    },
    "title": {
      "nl": "Nummer met artiestcontext",
      "en": "Song with artist context",
      "de": "Song mit Kuenstlerkontext",
      "fr": "Titre avec contexte artiste",
      "es": "Cancion con contexto de artista"
    },
    "text": {
      "nl": "Resolvet naar track search met artiestcontext wanneer de zin zowel artiest als nummer noemt.",
      "en": "Resolves to track search with artist context when the phrase names both artist and song.",
      "de": "Wird zur Track-Suche mit Kuenstlerkontext, wenn der Satz sowohl Kuenstler als auch Song nennt.",
      "fr": "Declenche une recherche de titre avec contexte artiste quand la phrase nomme a la fois artiste et chanson.",
      "es": "Resuelve a busqueda de tema con contexto de artista cuando la frase nombra artista y cancion."
    },
    "behavior": {
      "nl": "Start playback via gerichte track search met artiestcontext.",
      "en": "Starts playback through targeted track search with artist context.",
      "de": "Startet Wiedergabe ueber gezielte Track-Suche mit Kuenstlerkontext.",
      "fr": "Demarre la lecture via une recherche de titre ciblee avec contexte artiste.",
      "es": "Inicia reproduccion con busqueda de tema dirigida y contexto de artista."
    },
    "examples": {
      "nl": [
        "Speel nummer Moonlit Signal van Neon Harbor",
        "Speel Moonlit Signal van Neon Harbor",
        "Zet het liedje Night Glass van Echo Vale op",
        "Draai track Static Sunrise van Silver Circuit",
        "Speel artiest Neon Harbor met nummer Moonlit Signal"
      ],
      "en": [
        "Play Moonlit Signal by Neon Harbor",
        "Play the track Night Glass by Echo Vale",
        "Play artist Neon Harbor with song Moonlit Signal"
      ],
      "de": [
        "Spiel Moonlit Signal von Neon Harbor",
        "Spiel den Track Night Glass von Echo Vale",
        "Spiel Kuenstler Neon Harbor mit Song Moonlit Signal"
      ],
      "fr": [
        "Joue Moonlit Signal de Neon Harbor",
        "Joue le titre Night Glass de Echo Vale",
        "Joue l artiste Neon Harbor avec le titre Moonlit Signal"
      ],
      "es": [
        "Reproduce Moonlit Signal de Neon Harbor",
        "Reproduce el tema Night Glass de Echo Vale",
        "Reproduce artista Neon Harbor con cancion Moonlit Signal"
      ]
    }
  },
  {
    "id": "album",
    "spotifyType": "album",
    "playsMusic": true,
    "pill": {
      "nl": "Album",
      "en": "Album",
      "de": "Album",
      "fr": "Album",
      "es": "Album"
    },
    "title": {
      "nl": "Album starten",
      "en": "Start an album",
      "de": "Album starten",
      "fr": "Lancer un album",
      "es": "Iniciar un album"
    },
    "text": {
      "nl": "Gebruik album of plaat om album search te forceren, ook wanneer de zin van/by bevat.",
      "en": "Use album to force album search, even when the phrase contains van/by.",
      "de": "Verwende Album, um Albumsuche zu erzwingen, auch wenn der Satz von/by enthaelt.",
      "fr": "Utilise album pour forcer la recherche d album, meme si la phrase contient de/by.",
      "es": "Usa album para forzar busqueda de album, incluso si la frase contiene de/by."
    },
    "behavior": {
      "nl": "Zoekt en start een Spotify album.",
      "en": "Searches for and starts a Spotify album.",
      "de": "Sucht und startet ein Spotify-Album.",
      "fr": "Recherche et lance un album Spotify.",
      "es": "Busca e inicia un album de Spotify."
    },
    "examples": {
      "nl": [
        "Speel album Velvet Weather",
        "Speel album First Light van Echo Vale",
        "Zet de plaat Voorbeeldalbum van Voorbeeldartiest op",
        "Draai album Harbor Lights van Maple Signal"
      ],
      "en": [
        "Play album Velvet Weather",
        "Play the album First Light by Echo Vale",
        "Put on album Example Album by Example Artist"
      ],
      "de": [
        "Spiel Album Velvet Weather",
        "Spiel das Album First Light von Echo Vale",
        "Mach Album Beispielalbum von Beispielkuenstler an"
      ],
      "fr": [
        "Joue album Velvet Weather",
        "Joue l album First Light de Echo Vale",
        "Mets l album Exemple Album de Exemple Artiste"
      ],
      "es": [
        "Reproduce album Velvet Weather",
        "Reproduce el album First Light de Echo Vale",
        "Pon album Album Ejemplo de Artista Ejemplo"
      ]
    }
  },
  {
    "id": "track",
    "spotifyType": "track",
    "playsMusic": true,
    "pill": {
      "nl": "Track",
      "en": "Track",
      "de": "Track",
      "fr": "Titre",
      "es": "Tema"
    },
    "title": {
      "nl": "Nummer / track zoeken",
      "en": "Find a song / track",
      "de": "Song / Track suchen",
      "fr": "Trouver une chanson / un titre",
      "es": "Buscar cancion / tema"
    },
    "text": {
      "nl": "Gebruik woorden zoals nummer, liedje, track of song als je echt een specifieke track bedoelt.",
      "en": "Use words like song or track when you really mean a specific track.",
      "de": "Verwende Woerter wie Song oder Track, wenn du wirklich einen bestimmten Track meinst.",
      "fr": "Utilise des mots comme chanson ou titre quand tu veux vraiment un titre precis.",
      "es": "Usa palabras como cancion o tema cuando quieres un tema especifico."
    },
    "behavior": {
      "nl": "Zoekt en start een Spotify track.",
      "en": "Searches for and starts a Spotify track.",
      "de": "Sucht und startet einen Spotify-Track.",
      "fr": "Recherche et lance un titre Spotify.",
      "es": "Busca e inicia un tema de Spotify."
    },
    "examples": {
      "nl": [
        "Speel nummer Moonlit Signal"
      ],
      "en": [
        "Play song Moonlit Signal"
      ],
      "de": [
        "Spiel Song Moonlit Signal",
        "Spiel Track Night Glass"
      ],
      "fr": [
        "Joue la chanson Moonlit Signal",
        "Joue le titre Night Glass"
      ],
      "es": [
        "Reproduce cancion Moonlit Signal",
        "Reproduce tema Night Glass"
      ]
    }
  },
  {
    "id": "artist",
    "spotifyType": "artist",
    "playsMusic": true,
    "pill": {
      "nl": "Artiest",
      "en": "Artist",
      "de": "Kuenstler",
      "fr": "Artiste",
      "es": "Artista"
    },
    "title": {
      "nl": "Artiest starten",
      "en": "Start an artist",
      "de": "Kuenstler starten",
      "fr": "Lancer un artiste",
      "es": "Iniciar artista"
    },
    "text": {
      "nl": "Generieke verzoeken zonder expliciet nummer, album of playlist blijven artist-first.",
      "en": "Generic requests without explicit song, album or playlist wording stay artist-first.",
      "de": "Allgemeine Anfragen ohne ausdruecklich Song, Album oder Playlist bleiben kuenstlerorientiert.",
      "fr": "Les demandes generales sans chanson, album ou playlist explicite restent centrees sur l artiste.",
      "es": "Las peticiones genericas sin cancion, album o playlist explicitos se tratan primero como artista."
    },
    "behavior": {
      "nl": "Zoekt en start playback voor de artiest.",
      "en": "Searches and starts playback for the artist.",
      "de": "Sucht den Kuenstler und startet die Wiedergabe.",
      "fr": "Recherche et demarre la lecture pour l artiste.",
      "es": "Busca e inicia reproduccion del artista."
    },
    "examples": {
      "nl": [
        "Speel Neon Harbor",
        "Start Silver Circuit",
        "Zet Velvet Atlas op",
        "Draai Echo Vale",
        "Ik heb wel zin in Neon Harbor",
        "Ik wil Silver Circuit horen",
        "Neon Harbor wil ik wel horen"
      ],
      "en": [
        "Play Neon Harbor",
        "Start Silver Circuit",
        "Put on Velvet Atlas",
        "I want Echo Vale",
        "I feel like Neon Harbor"
      ],
      "de": [
        "Spiel Neon Harbor",
        "Starte Silver Circuit",
        "Mach Velvet Atlas an",
        "Ich habe Lust auf Neon Harbor"
      ],
      "fr": [
        "Joue Neon Harbor",
        "Lance Silver Circuit",
        "Mets Velvet Atlas",
        "J ai envie de Neon Harbor"
      ],
      "es": [
        "Reproduce Neon Harbor",
        "Inicia Silver Circuit",
        "Pon Velvet Atlas",
        "Me apetece Neon Harbor"
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
      "en": "Chat",
      "de": "Chat",
      "fr": "Conversation",
      "es": "Chat"
    },
    "title": {
      "nl": "Korte reactie",
      "en": "Short reply",
      "de": "Kurze Antwort",
      "fr": "Reponse courte",
      "es": "Respuesta corta"
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
      ],
      "de": [
        "Kein Problem",
        "Danke",
        "Lass gut sein",
        "Passt schon",
        "Schade"
      ],
      "fr": [
        "Pas de souci",
        "Merci",
        "Laisse tomber",
        "Tres bien",
        "Dommage"
      ],
      "es": [
        "No pasa nada",
        "Gracias",
        "Dejalo",
        "Esta bien",
        "Que pena"
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
      "en": "Help",
      "de": "Hilfe",
      "fr": "Aide",
      "es": "Ayuda"
    },
    "title": {
      "nl": "Wat kan Ask DJ?",
      "en": "What can Ask DJ do?",
      "de": "Was kann Ask DJ?",
      "fr": "Que peut faire Ask DJ ?",
      "es": "Que puede hacer Ask DJ?"
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
      ],
      "de": [
        "Hilfe",
        "Was kannst du?",
        "Welche Befehle kann ich nutzen?"
      ],
      "fr": [
        "Aide",
        "Que peux-tu faire ?",
        "Quelles commandes puis-je utiliser ?"
      ],
      "es": [
        "Ayuda",
        "Que puedes hacer?",
        "Que comandos puedo usar?"
      ]
    }
  },
  {
    "id": "music_discovery_help",
    "plays_music": false,
    "action": "none",
    "intent": "music_discovery_help",
    "response_shape": {
      "text_only": true,
      "images": [],
      "playback_actions": [],
      "sources": [
        "music_discovery",
        "djconnect_music_dna"
      ]
    },
    "description": "Read-only Discover and Music DNA explanation prompts. These questions explain backend-owned recommendations, feedback and reasons; they must not mutate playback, Discover or Music DNA state.",
    "nl": [
      "Wat is er nieuw in Discover?",
      "Ververs mijn Discover aanbevelingen",
      "Hoe werkt Discover met feedback?",
      "Waarom past deze aanbeveling bij mijn smaak?"
    ],
    "en": [
      "What is new in Discover?",
      "Refresh my Discover recommendations",
      "How does Discover work with feedback?",
      "Why does this recommendation fit my taste?"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Discover",
      "en": "Discover",
      "de": "Discover",
      "fr": "Discover",
      "es": "Discover"
    },
    "title": {
      "nl": "Discover uitleg",
      "en": "Discover help",
      "de": "Discover-Hilfe",
      "fr": "Aide Discover",
      "es": "Ayuda Discover"
    },
    "text": {
      "nl": "Read-only vragen over Discover, Music DNA, feedback en aanbevelingsredenen. Uitlegvragen muteren geen playback, Discover of Music DNA state.",
      "en": "Read-only questions about Discover, Music DNA, feedback and recommendation reasons. Explanation questions do not mutate playback, Discover or Music DNA state.",
      "de": "Read-only Fragen zu Discover, Music DNA, Feedback und Empfehlungsgruenden. Erklaerfragen aendern weder Playback noch Discover oder Music DNA state.",
      "fr": "Questions read-only sur Discover, Music DNA, feedback et raisons de recommandation. Ces questions ne modifient pas playback, Discover ou Music DNA state.",
      "es": "Preguntas read-only sobre Discover, Music DNA, feedback y razones de recomendacion. No modifican playback, Discover ni Music DNA state."
    },
    "examples": {
      "nl": [
        "Wat is er nieuw in Discover?",
        "Ververs mijn Discover aanbevelingen",
        "Hoe werkt Discover met feedback?",
        "Waarom past deze aanbeveling bij mijn smaak?"
      ],
      "en": [
        "What is new in Discover?",
        "Refresh my Discover recommendations",
        "How does Discover work with feedback?",
        "Why does this recommendation fit my taste?"
      ],
      "de": [
        "Was ist neu in Discover?",
        "Aktualisiere meine Discover-Empfehlungen"
      ],
      "fr": [
        "Quoi de neuf dans Discover ?",
        "Actualise mes recommandations Discover"
      ],
      "es": [
        "Que hay de nuevo en Discover?",
        "Actualiza mis recomendaciones Discover"
      ]
    }
  },
  {
    "id": "personal_music_dna_summary",
    "plays_music": false,
    "action": "music_dna_summary",
    "intent": "personal_music_dna_summary",
    "response_shape": {
      "text_only": true,
      "images": [],
      "playback_actions": [],
      "sources": [
        "djconnect_music_dna"
      ]
    },
    "description": "Ask what DJConnect currently remembers about the user or how Music DNA privacy works. The response must be based on Music DNA only, without live playback artwork, Spotify profile enrichment or Play Now actions, and must mention that Music DNA stores no raw audio, OAuth tokens or full prompts.",
    "nl": [
      "Wat weet je nu over mij?",
      "Wat weet je over mij?",
      "Wat weet DJConnect over mij?",
      "Wat staat er in mijn Music DNA?",
      "Wat zegt mijn Music DNA?",
      "Welke gegevens bewaart Music DNA over mij?",
      "Wat herinner je je over mij?"
    ],
    "en": [
      "What do you know about me?",
      "What does DJConnect know about me?",
      "What is in my Music DNA?",
      "What does my Music DNA say?",
      "What data does Music DNA keep about me?",
      "What do you remember about me?"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Privacy",
      "en": "Privacy",
      "de": "Datenschutz",
      "fr": "Confidentialite",
      "es": "Privacidad"
    },
    "title": {
      "nl": "Music DNA bekijken",
      "en": "Review Music DNA",
      "de": "Music DNA ansehen",
      "fr": "Consulter Music DNA",
      "es": "Revisar Music DNA"
    },
    "text": {
      "nl": "Privacyvraag over server-side Music DNA. Render als tekst met bron djconnect_music_dna: geen oude album art, mediakaarten, Play Now, live playback, profielverrijking, raw audio, OAuth tokens of volledige prompts.",
      "en": "Privacy question about server-side Music DNA. Render as text with djconnect_music_dna source: no old album art, media cards, Play Now, live playback, profile enrichment, raw audio, OAuth tokens or full prompts.",
      "de": "Datenschutzfrage zu serverseitigem Music DNA. Als Text mit Quelle djconnect_music_dna rendern: keine alte Albumgrafik, Medienkarten, Play Now, Live-Wiedergabe oder Profilanreicherung.",
      "fr": "Question de confidentialite sur Music DNA cote serveur. A rendre en texte avec la source djconnect_music_dna : pas d ancienne pochette, cartes media, Play Now, lecture live ou enrichissement de profil.",
      "es": "Pregunta de privacidad sobre Music DNA del servidor. Renderiza como texto con fuente djconnect_music_dna: sin arte antiguo, tarjetas multimedia, Play Now, reproduccion en vivo ni enriquecimiento de perfil."
    },
    "examples": {
      "nl": [
        "Wat weet je nu over mij?",
        "Wat weet je over mij?",
        "Wat weet DJConnect over mij?",
        "Wat staat er in mijn Music DNA?",
        "Wat zegt mijn Music DNA?",
        "Welke gegevens bewaart Music DNA over mij?",
        "Wat herinner je je over mij?"
      ],
      "en": [
        "What do you know about me?",
        "What does DJConnect know about me?",
        "What is in my Music DNA?",
        "What does my Music DNA say?",
        "What data does Music DNA keep about me?",
        "What do you remember about me?"
      ],
      "de": [
        "Was weisst du ueber mich?",
        "Was steht in meinem Music DNA?",
        "Woran erinnerst du dich ueber mich?"
      ],
      "fr": [
        "Que sais-tu de moi ?",
        "Que contient mon Music DNA ?",
        "De quoi te souviens-tu sur moi ?"
      ],
      "es": [
        "Que sabes de mi?",
        "Que hay en mi Music DNA?",
        "Que recuerdas de mi?"
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
    "description": "Ask which backend output devices or target players are available, or request speaker switching. DJConnect returns a text list plus backend-aware output actions when outputs are known.",
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
      "en": "Speakers",
      "de": "Lautsprecher",
      "fr": "Enceintes",
      "es": "Altavoces"
    },
    "title": {
      "nl": "Speaker kiezen",
      "en": "Choose a speaker",
      "de": "Lautsprecher waehlen",
      "fr": "Choisir une enceinte",
      "es": "Elegir altavoz"
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
      ],
      "de": [
        "Welche Lautsprecher gibt es?",
        "Welche Geraete kann ich nutzen?",
        "Wechsle den Lautsprecher"
      ],
      "fr": [
        "Quelles enceintes sont disponibles ?",
        "Quels appareils puis-je utiliser ?",
        "Change d enceinte"
      ],
      "es": [
        "Que altavoces hay?",
        "Que dispositivos puedo usar?",
        "Cambia de altavoz"
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
      "en": "Retry",
      "de": "Erneut",
      "fr": "Reessayer",
      "es": "Reintentar"
    },
    "title": {
      "nl": "Vorige vraag opnieuw proberen",
      "en": "Retry previous request",
      "de": "Letzte Anfrage wiederholen",
      "fr": "Relancer la demande precedente",
      "es": "Repetir peticion anterior"
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
      ],
      "de": [
        "Nochmal versuchen",
        "Versuch es erneut"
      ],
      "fr": [
        "Reessaie",
        "Essaie encore"
      ],
      "es": [
        "Intentalo otra vez",
        "Prueba de nuevo"
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
      "en": "Context",
      "de": "Play Now",
      "fr": "Play Now",
      "es": "Play Now"
    },
    "title": {
      "nl": "Play Now follow-up",
      "en": "Play Now follow-up",
      "de": "Vorschlag abspielen",
      "fr": "Lire une suggestion",
      "es": "Reproducir sugerencia"
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
      ],
      "de": [
        "Ja, spiel das",
        "Spiel diese Empfehlung"
      ],
      "fr": [
        "Oui, joue ca",
        "Joue cette recommandation"
      ],
      "es": [
        "Si, reproduce eso",
        "Reproduce esa recomendacion"
      ]
    }
  },
  {
    "id": "album_discography",
    "plays_music": false,
    "action": "none",
    "description": "Ask for an artist's albums. DJConnect can return a chronological album list with proxied album covers and Play Now actions per album.",
    "nl": [
      "Welke albums hebben Voorbeeldartiest uitgebracht?",
      "Welke albums bracht deze artiest uit?",
      "Welke albums zijn er van Orion Vale?",
      "Albums van Suzan en Freek",
      "Geef me de albums van Guns N' Roses"
    ],
    "en": [
      "Which albums has Example Artist released?",
      "Which albums did this artist release?",
      "Albums by Orion Vale"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Albums",
      "en": "Albums",
      "de": "Alben",
      "fr": "Albums",
      "es": "Albumes"
    },
    "title": {
      "nl": "Albums van een artiest",
      "en": "Artist albums",
      "de": "Alben eines Kuenstlers",
      "fr": "Albums d un artiste",
      "es": "Albumes de un artista"
    },
    "examples": {
      "nl": [
        "Welke albums hebben Voorbeeldartiest uitgebracht?",
        "Welke albums bracht deze artiest uit?",
        "Welke albums zijn er van Orion Vale?",
        "Albums van Suzan en Freek",
        "Geef me de albums van Guns N' Roses"
      ],
      "en": [
        "Which albums has Example Artist released?",
        "Which albums did this artist release?",
        "Albums by Orion Vale"
      ],
      "de": [
        "Welche Alben hat Neon Harbor?",
        "Zeig Alben von Echo Vale"
      ],
      "fr": [
        "Quels albums a Neon Harbor ?",
        "Montre les albums de Echo Vale"
      ],
      "es": [
        "Que albumes tiene Neon Harbor?",
        "Muestra albumes de Echo Vale"
      ]
    }
  },
  {
    "id": "artist_item_list",
    "plays_music": false,
    "action": "none",
    "intent": "artist_item_list",
    "response_shape": {
      "playback_actions_kind": [
        "track",
        "album",
        "playlist"
      ],
      "button_labels": [
        "Play Now"
      ],
      "images": "proxied when Spotify art is available"
    },
    "description": "Ask which tracks, albums or playlists exist for an artist. DJConnect parses the artist name and returns Play Now rows without starting playback.",
    "nl": [
      "Welke muziek heeft Scooter gemaakt?",
      "Welke nummers heeft Voorbeeldartiest gemaakt?",
      "Geef me 5 nummers van Echo Vale",
      "Geef me albums van Voorbeeldartiest",
      "Toon playlists van Silver Circuit"
    ],
    "en": [
      "What music has Scooter made?",
      "Which songs has Example Artist released?",
      "Give me 5 songs by Echo Vale",
      "Show albums by Example Artist",
      "Find playlists from Silver Circuit"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Catalogus",
      "en": "Catalog",
      "de": "Liste",
      "fr": "Liste",
      "es": "Lista"
    },
    "title": {
      "nl": "Tracks, albums of playlists",
      "en": "Tracks, albums or playlists",
      "de": "Songs oder Alben auflisten",
      "fr": "Lister titres ou albums",
      "es": "Listar canciones o albumes"
    },
    "examples": {
      "nl": [
        "Welke muziek heeft Scooter gemaakt?",
        "Welke nummers heeft Voorbeeldartiest gemaakt?",
        "Geef me 5 nummers van Echo Vale",
        "Geef me albums van Voorbeeldartiest",
        "Toon playlists van Silver Circuit"
      ],
      "en": [
        "What music has Scooter made?",
        "Which songs has Example Artist released?",
        "Give me 5 songs by Echo Vale",
        "Show albums by Example Artist",
        "Find playlists from Silver Circuit"
      ],
      "de": [
        "Zeig Songs von Neon Harbor",
        "Welche Tracks gibt es?"
      ],
      "fr": [
        "Montre des titres de Neon Harbor",
        "Quels morceaux existent ?"
      ],
      "es": [
        "Muestra canciones de Neon Harbor",
        "Que temas hay?"
      ]
    }
  },
  {
    "id": "similar_artists",
    "plays_music": false,
    "action": "none",
    "description": "Ask for artists with similar music, using an explicit artist, current playback artist or recent conversation artist.",
    "nl": [
      "Welke artiesten maken vergelijkbare muziek als Voorbeeldartiest?",
      "Welke artiesten maken vergelijkbare muziek als wat nu speelt?",
      "Welke artiesten lijken op deze artiest?",
      "Vergelijkbare artiesten als de artiest waar het in de conversatie over gaat"
    ],
    "en": [
      "Which artists make similar music to Example Artist?",
      "Which artists are similar to what is playing now?",
      "Similar artists to this artist"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Vergelijkbaar",
      "en": "Similar",
      "de": "Aehnlich",
      "fr": "Similaire",
      "es": "Similar"
    },
    "title": {
      "nl": "Vergelijkbare artiesten",
      "en": "Similar artists",
      "de": "Aehnliche Kuenstler",
      "fr": "Artistes similaires",
      "es": "Artistas similares"
    },
    "examples": {
      "nl": [
        "Welke artiesten maken vergelijkbare muziek als Voorbeeldartiest?",
        "Welke artiesten maken vergelijkbare muziek als wat nu speelt?",
        "Welke artiesten lijken op deze artiest?",
        "Vergelijkbare artiesten als de artiest waar het in de conversatie over gaat"
      ],
      "en": [
        "Which artists make similar music to Example Artist?",
        "Which artists are similar to what is playing now?",
        "Similar artists to this artist"
      ],
      "de": [
        "Welche Kuenstler sind aehnlich?",
        "Gib mir aehnliche Musik"
      ],
      "fr": [
        "Quels artistes sont similaires ?",
        "Donne-moi de la musique similaire"
      ],
      "es": [
        "Que artistas son similares?",
        "Dame musica parecida"
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
      "Welk genre maakt Luna Circuit?",
      "Wat is het genre van Voorbeeldartiest?"
    ],
    "en": [
      "What kind of music does Beastie Boys make?",
      "What kind of music does this artist make?",
      "What genre is Luna Circuit?"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Stijl",
      "en": "Style",
      "de": "Stil",
      "fr": "Style",
      "es": "Estilo"
    },
    "title": {
      "nl": "Genre en stijl",
      "en": "Genre and style",
      "de": "Genre und Stil erklaeren",
      "fr": "Expliquer genre et style",
      "es": "Explicar genero y estilo"
    },
    "examples": {
      "nl": [
        "Wat voor muziek maakt Beastie Boys?",
        "Wat voor muziek maakt deze artiest?",
        "Welk genre maakt Luna Circuit?",
        "Wat is het genre van Voorbeeldartiest?"
      ],
      "en": [
        "What kind of music does Beastie Boys make?",
        "What kind of music does this artist make?",
        "What genre is Luna Circuit?"
      ],
      "de": [
        "Welches Genre ist Neon Harbor?",
        "Beschreibe den Stil"
      ],
      "fr": [
        "Quel est le genre de Neon Harbor ?",
        "Decris le style"
      ],
      "es": [
        "Que genero es Neon Harbor?",
        "Describe el estilo"
      ]
    }
  },
  {
    "id": "concert_agenda",
    "plays_music": false,
    "action": "none",
    "description": "Ask for upcoming concerts. DJConnect can return date, location and clickable source links when web agenda data is available.",
    "nl": [
      "Wanneer speelt Voorbeeldartiest in Nederland?",
      "Heeft deze artiest binnenkort concerten?",
      "Concerten van The National",
      "Tourdata voor Luna Circuit"
    ],
    "en": [
      "When does Example Artist play in the Netherlands?",
      "Does this artist have upcoming concerts?",
      "Concerts for The National",
      "Tour dates for Luna Circuit"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Concerten",
      "en": "Concerts",
      "de": "Konzerte",
      "fr": "Concerts",
      "es": "Conciertos"
    },
    "title": {
      "nl": "Concertagenda",
      "en": "Concert calendar",
      "de": "Konzertfragen",
      "fr": "Questions de concert",
      "es": "Preguntas de conciertos"
    },
    "examples": {
      "nl": [
        "Wanneer speelt Voorbeeldartiest in Nederland?",
        "Heeft deze artiest binnenkort concerten?",
        "Concerten van The National",
        "Tourdata voor Luna Circuit"
      ],
      "en": [
        "When does Example Artist play in the Netherlands?",
        "Does this artist have upcoming concerts?",
        "Concerts for The National",
        "Tour dates for Luna Circuit"
      ],
      "de": [
        "Gibt es Konzerte?",
        "Wann spielt Neon Harbor?"
      ],
      "fr": [
        "Y a-t-il des concerts ?",
        "Quand joue Neon Harbor ?"
      ],
      "es": [
        "Hay conciertos?",
        "Cuando toca Neon Harbor?"
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
      "en": "Queue",
      "de": "Naechster",
      "fr": "Suivant",
      "es": "Siguiente"
    },
    "title": {
      "nl": "Volgende track",
      "en": "Next track",
      "de": "Naechsten Track erklaeren",
      "fr": "Expliquer le titre suivant",
      "es": "Explicar siguiente tema"
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
      ],
      "de": [
        "Was kommt als naechstes?",
        "Erzaehl mir vom naechsten Track"
      ],
      "fr": [
        "Qu est-ce qui vient ensuite ?",
        "Parle-moi du titre suivant"
      ],
      "es": [
        "Que viene despues?",
        "Cuentame del siguiente tema"
      ]
    }
  },
  {
    "id": "current_track_versions",
    "plays_music": false,
    "action": "none",
    "intent": "current_track_versions",
    "response_shape": {
      "playback_actions_kind": "track",
      "button_labels": [
        "Play Now"
      ],
      "images": "proxied per result when Spotify art is available"
    },
    "description": "Ask for live, acoustic or remix versions of the current track. DJConnect searches from the current track and artist, returns matching Play Now rows and does not start playback automatically.",
    "nl": [
      "Heb je een live versie?",
      "Zoek een live versie van dit nummer",
      "Heb je een akoestische versie?",
      "Is er een unplugged versie?",
      "Heb je remixes?",
      "Zoek een remix van dit nummer"
    ],
    "en": [
      "Do you have a live version?",
      "Find a live version of this song",
      "Do you have an acoustic version?",
      "Is there an unplugged version?",
      "Do you have remixes?",
      "Find a remix of this track"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Versies",
      "en": "Versions",
      "de": "Versionen",
      "fr": "Versions",
      "es": "Versiones"
    },
    "title": {
      "nl": "Live, akoestisch of remix",
      "en": "Live, acoustic or remix",
      "de": "Versionen des aktuellen Tracks",
      "fr": "Versions du titre actuel",
      "es": "Versiones del tema actual"
    },
    "examples": {
      "nl": [
        "Heb je een live versie?",
        "Zoek een live versie van dit nummer",
        "Heb je een akoestische versie?",
        "Is er een unplugged versie?",
        "Heb je remixes?",
        "Zoek een remix van dit nummer"
      ],
      "en": [
        "Do you have a live version?",
        "Find a live version of this song",
        "Do you have an acoustic version?",
        "Is there an unplugged version?",
        "Do you have remixes?",
        "Find a remix of this track"
      ],
      "de": [
        "Gibt es andere Versionen?",
        "Welche Version ist das?"
      ],
      "fr": [
        "Existe-t-il d autres versions ?",
        "Quelle version est-ce ?"
      ],
      "es": [
        "Hay otras versiones?",
        "Que version es esta?"
      ]
    }
  },
  {
    "id": "track_versions_search",
    "plays_music": false,
    "action": "none",
    "intent": "track_versions_search",
    "response_shape": {
      "playback_actions_kind": "track",
      "button_labels": [
        "Play Now"
      ],
      "max_results": 10
    },
    "description": "Search Spotify for tracks with the requested title by different artists. DJConnect uses limit 10, requires every meaningful title-query word to appear in the found track title, returns at most 10 Play Now rows and does not start playback automatically.",
    "nl": [
      "Geef me 10 uitvoeringen van Voorbeeldlied door verschillende artiesten",
      "Doe me 10 uitvoeringen door verschillende artiesten van \"Voorbeeldlied\"",
      "Zoek versies van \"Voorbeeldlied\"",
      "Toon covers van \"Voorbeeldlied\""
    ],
    "en": [
      "Find versions of \"Example Song\"",
      "Give me versions titled Example Song",
      "Give me 10 versions of Example Song by different artists",
      "Show covers of \"Example Song\""
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Titelversies",
      "en": "Title versions",
      "de": "Titelversionen",
      "fr": "Versions par titre",
      "es": "Versiones por titulo"
    },
    "title": {
      "nl": "Tracks met dezelfde titel",
      "en": "Tracks with the same title",
      "de": "Tracks mit gleichem Titel",
      "fr": "Titres avec le meme nom",
      "es": "Temas con el mismo titulo"
    },
    "text": {
      "nl": "Zoekt maximaal 10 Spotify tracks met dezelfde betekenisvolle titelwoorden door verschillende artiesten. Toont Play Now, maar start niets automatisch.",
      "en": "Searches up to 10 Spotify tracks whose title contains every meaningful query word, ideally by different artists. Shows Play Now but starts nothing automatically.",
      "de": "Sucht bis zu 10 Spotify Tracks, deren Titel alle wichtigen Suchwoerter enthalten. Zeigt Play Now, startet aber nichts automatisch.",
      "fr": "Cherche jusqu'a 10 tracks Spotify dont le titre contient tous les mots significatifs. Affiche Play Now sans lancer automatiquement.",
      "es": "Busca hasta 10 tracks de Spotify cuyo titulo contiene todas las palabras significativas. Muestra Play Now sin iniciar automaticamente."
    },
    "examples": {
      "nl": [
        "Geef me 10 uitvoeringen van Voorbeeldlied door verschillende artiesten",
        "Doe me 10 uitvoeringen door verschillende artiesten van \"Voorbeeldlied\"",
        "Zoek versies van \"Voorbeeldlied\"",
        "Toon covers van \"Voorbeeldlied\""
      ],
      "en": [
        "Find versions of \"Example Song\"",
        "Give me versions titled Example Song",
        "Give me 10 versions of Example Song by different artists",
        "Show covers of \"Example Song\""
      ],
      "de": [
        "Finde Versionen von \"Example Song\""
      ],
      "fr": [
        "Trouve des versions de \"Example Song\""
      ],
      "es": [
        "Busca versiones de \"Example Song\""
      ]
    }
  },
  {
    "id": "personal_music_profile_analysis",
    "plays_music": false,
    "action": "profile_analysis",
    "description": "Ask for a personal listening profile based on Music DNA and Spotify recently played/top profile data.",
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
      "en": "Profile",
      "de": "Profil",
      "fr": "Profil",
      "es": "Perfil"
    },
    "title": {
      "nl": "Luisterprofiel analyseren",
      "en": "Analyze listening profile",
      "de": "Musikprofil analysieren",
      "fr": "Analyser le profil musical",
      "es": "Analizar perfil musical"
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
      ],
      "de": [
        "Beschreibe meinen Musikgeschmack",
        "Was hoere ich gerne?"
      ],
      "fr": [
        "Decris mes gouts musicaux",
        "Qu est-ce que j aime ecouter ?"
      ],
      "es": [
        "Describe mi gusto musical",
        "Que me gusta escuchar?"
      ]
    }
  },
  {
    "id": "track_insight",
    "plays_music": false,
    "action": "track_insight",
    "intent": "track_insight",
    "intent_category": "informational",
    "sources": [
      "track_insight"
    ],
    "response_shape": {
      "track_insight": true,
      "analysis": true,
      "visual_profile": true,
      "playback_actions": "none"
    },
    "description": "Ask for Track Insight on the current track, returning normalized track metadata, concise analysis and deterministic visualization hints without changing playback.",
    "nl": [
      "Geef Track Insight voor dit nummer",
      "Vertel me over deze track",
      "Wat is de vibe van deze plaat?",
      "Wat maakt dit nummer bijzonder?"
    ],
    "en": [
      "Give me Track Insight for this song",
      "Tell me about this track",
      "What is the vibe of this song?",
      "What makes this track special?"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Insight",
      "en": "Insight",
      "de": "Insight",
      "fr": "Insight",
      "es": "Insight"
    },
    "title": {
      "nl": "Track Insight",
      "en": "Track Insight",
      "de": "Track Insight",
      "fr": "Track Insight",
      "es": "Track Insight"
    },
    "examples": {
      "nl": [
        "Geef Track Insight voor dit nummer",
        "Vertel me over deze track",
        "Wat is de vibe van deze plaat?",
        "Wat maakt dit nummer bijzonder?"
      ],
      "en": [
        "Give me Track Insight for this song",
        "Tell me about this track",
        "What is the vibe of this song?",
        "What makes this track special?"
      ],
      "de": [
        "Gib Track Insight fuer diesen Song",
        "Welche Stimmung hat dieser Track?"
      ],
      "fr": [
        "Donne Track Insight pour ce morceau",
        "Quelle ambiance a ce titre ?"
      ],
      "es": [
        "Dame Track Insight de esta cancion",
        "Que ambiente tiene este tema?"
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
      "en": "Recent",
      "de": "Verlauf",
      "fr": "Historique",
      "es": "Historial"
    },
    "title": {
      "nl": "Recent geluisterd",
      "en": "Recently played",
      "de": "Kuerzlich gehoert",
      "fr": "Ecoute recente",
      "es": "Escuchado recientemente"
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
      ],
      "de": [
        "Was habe ich zuletzt gehoert?",
        "Zeig meinen Hoerverlauf"
      ],
      "fr": [
        "Qu ai-je ecoute recemment ?",
        "Montre mon historique"
      ],
      "es": [
        "Que escuche recientemente?",
        "Muestra mi historial"
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
      "Doe maar wat leuks van Voorbeeldartiest",
      "Zet een leuke playlist op met rustige muziek",
      "Ik voel me moe en geprikkeld, zet iets ontspannends klaar"
    ],
    "en": [
      "Play something different",
      "Give me something fun by Example Artist",
      "Find a nice playlist with calm music",
      "I feel tired and overstimulated, suggest something relaxing"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Aanbeveling",
      "en": "Recommendation",
      "de": "Empfehlungen",
      "fr": "Recommandations",
      "es": "Recomendaciones"
    },
    "title": {
      "nl": "Persoonlijke aanbevelingen",
      "en": "Personal recommendations",
      "de": "Persoenliche Empfehlungen",
      "fr": "Recommandations personnelles",
      "es": "Recomendaciones personales"
    },
    "examples": {
      "nl": [
        "Speel wat anders",
        "Doe maar wat leuks van Voorbeeldartiest",
        "Zet een leuke playlist op met rustige muziek",
        "Ik voel me moe en geprikkeld, zet iets ontspannends klaar"
      ],
      "en": [
        "Play something different",
        "Give me something fun by Example Artist",
        "Find a nice playlist with calm music",
        "I feel tired and overstimulated, suggest something relaxing"
      ],
      "de": [
        "Welche Musik empfiehlst du mir?",
        "Empfiehl mir etwas"
      ],
      "fr": [
        "Quelle musique me recommandes-tu ?",
        "Recommande-moi quelque chose"
      ],
      "es": [
        "Que musica me recomiendas?",
        "Recomiendame algo"
      ]
    }
  },
  {
    "id": "seed_playlist_mix",
    "plays_music": false,
    "action": "none",
    "description": "Ask DJ to compose a playable mix from artist, track or genre seeds. The response returns backend-aware Play Now actions; Spotify Direct can later save the mix as a Spotify playlist.",
    "nl": [
      "Stel een playlist samen op basis van Voorbeeldartiest, Artiest A en Artiest B",
      "Maak een mix met Above & Beyond, Armin van Buuren en Ferry Corsten",
      "Ik wil een playlist obv tracks Reckoner, Teardrop en Angel",
      "Ik wil een playlist in genre ambient, techno en downtempo",
      "Maak een 90s dance mix",
      "Maak playlist obv huidig nummer",
      "Ik wil meer van deze muziek horen",
      "Heb je meer nummers die hierop lijken",
      "Ik wil vergelijkbare tracks",
      "Speel vergelijkbare nummers",
      "Sla deze mix op als Spotify playlist"
    ],
    "en": [
      "Create a playlist based on Example Artist, Artist A and Artist B",
      "Make a mix with Above & Beyond, Armin van Buuren and Ferry Corsten",
      "I want a playlist based on tracks Reckoner, Teardrop and Angel",
      "I want a playlist in genres ambient, techno and downtempo",
      "Make a 90s dance mix",
      "Create a playlist based on the current track",
      "I want more of this music",
      "Do you have more songs like this",
      "I want similar tracks",
      "Queue similar tracks",
      "Save this mix as a Spotify playlist"
    ],
    "playsMusic": false,
    "messageKind": "user",
    "pill": {
      "nl": "Mix",
      "en": "Mix",
      "de": "Mix",
      "fr": "Mix",
      "es": "Mix"
    },
    "title": {
      "nl": "Mix of playlist samenstellen",
      "en": "Build a mix or playlist",
      "de": "Seed-Mix bauen",
      "fr": "Creer un mix de depart",
      "es": "Crear mix semilla"
    },
    "examples": {
      "nl": [
        "Stel een playlist samen op basis van Voorbeeldartiest, Artiest A en Artiest B",
        "Maak een mix met Above & Beyond, Armin van Buuren en Ferry Corsten",
        "Ik wil een playlist obv tracks Reckoner, Teardrop en Angel",
        "Ik wil een playlist in genre ambient, techno en downtempo",
        "Maak een 90s dance mix",
        "Maak playlist obv huidig nummer",
        "Ik wil meer van deze muziek horen",
        "Heb je meer nummers die hierop lijken",
        "Ik wil vergelijkbare tracks",
        "Speel vergelijkbare nummers",
        "Sla deze mix op als Spotify playlist"
      ],
      "en": [
        "Create a playlist based on Example Artist, Artist A and Artist B",
        "Make a mix with Above & Beyond, Armin van Buuren and Ferry Corsten",
        "I want a playlist based on tracks Reckoner, Teardrop and Angel",
        "I want a playlist in genres ambient, techno and downtempo",
        "Make a 90s dance mix",
        "Create a playlist based on the current track",
        "I want more of this music",
        "Do you have more songs like this",
        "I want similar tracks",
        "Queue similar tracks",
        "Save this mix as a Spotify playlist"
      ],
      "de": [
        "Mach einen Mix daraus",
        "Erstelle einen Mix mit diesem Vibe"
      ],
      "fr": [
        "Fais un mix avec ca",
        "Cree un mix avec cette ambiance"
      ],
      "es": [
        "Haz un mix con eso",
        "Crea un mix con este ambiente"
      ]
    }
  },
  {
    "id": "save_current_track",
    "plays_music": false,
    "action": "set_current_track_favorite",
    "intent": "playback_control",
    "response_shape": {
      "text_only": true,
      "images": [],
      "playback_actions": []
    },
    "description": "Toggle the currently playing Spotify track in the user's Liked Songs/favorites. Now Playing cards can expose this as a control action with toggle state and client prompt.",
    "nl": [
      "Zet huidig nummer in favorieten",
      "Haal huidig nummer uit favorieten",
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
      "en": "Favorite",
      "de": "Speichern",
      "fr": "Sauver",
      "es": "Guardar"
    },
    "title": {
      "nl": "Huidig nummer opslaan",
      "en": "Save current track",
      "de": "Aktuellen Track speichern",
      "fr": "Sauver le titre actuel",
      "es": "Guardar tema actual"
    },
    "text": {
      "nl": "Slaat de huidige Spotify-track op in Liked Songs/favorieten. Geen Spotify search, geen media card en geen extra artwork.",
      "en": "Saves the currently playing Spotify track to Liked Songs/favorites. No Spotify search, media card or extra artwork."
    },
    "examples": {
      "nl": [
        "Zet huidig nummer in favorieten",
        "Haal huidig nummer uit favorieten",
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
      "de": [
        "Speichere diesen Track",
        "Fuege ihn zu Favoriten hinzu"
      ],
      "fr": [
        "Sauve ce titre",
        "Ajoute-le aux favoris"
      ],
      "es": [
        "Guarda este tema",
        "Anadelo a favoritos"
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
      "en": "DJ intro",
      "de": "Ansage",
      "fr": "Annonce",
      "es": "Anuncio"
    },
    "title": {
      "nl": "DJ-aankondiging",
      "en": "DJ announcement",
      "de": "DJ-Ansage",
      "fr": "Annonce DJ",
      "es": "Anuncio DJ"
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
      ],
      "de": [
        "Mach eine DJ-Ansage",
        "Sag etwas ueber diesen Track"
      ],
      "fr": [
        "Fais une annonce DJ",
        "Dis quelque chose sur ce titre"
      ],
      "es": [
        "Haz un anuncio de DJ",
        "Di algo sobre este tema"
      ]
    }
  },
  {
    "id": "ambient_music_fact",
    "plays_music": false,
    "action": "none",
    "message_kind": "system",
    "origin": "spotify_playback_context",
    "description": "Backend-generated text-only Ask DJ fact when playback moves to another artist/album combination. This has no user phrase and is included so website/client docs can explain the system bubble.",
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
      "en": "System",
      "de": "Fakt",
      "fr": "Info",
      "es": "Dato"
    },
    "title": {
      "nl": "Automatisch feitje",
      "en": "Automatic fact",
      "de": "Musikfakt",
      "fr": "Info musicale",
      "es": "Dato musical"
    },
    "examples": {
      "nl": [
        "Automatisch DJ feitje bij nieuw album of nieuwe artiest"
      ],
      "en": [
        "Automatic DJ fact when a new album or artist starts"
      ],
      "de": [
        "Erzaehl mir etwas ueber die Musik",
        "Gib mir einen Fakt"
      ],
      "fr": [
        "Raconte-moi quelque chose sur la musique",
        "Donne-moi une info"
      ],
      "es": [
        "Cuentame algo sobre la musica",
        "Dame un dato"
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
      "en": "Suggestion",
      "de": "Vorschlag",
      "fr": "Suggestion",
      "es": "Sugerencia"
    },
    "title": {
      "nl": "Idle suggestie",
      "en": "Idle suggestion",
      "de": "Hoervorschlag",
      "fr": "Suggestion d ecoute",
      "es": "Sugerencia de escucha"
    },
    "examples": {
      "nl": [
        "Er speelt nu niets. Zin in iets nieuws?"
      ],
      "en": [
        "Nothing is playing right now. Want something new?"
      ],
      "de": [
        "Was soll ich hoeren?",
        "Schlag etwas vor"
      ],
      "fr": [
        "Que devrais-je ecouter ?",
        "Propose quelque chose"
      ],
      "es": [
        "Que deberia escuchar?",
        "Sugiere algo"
      ]
    }
  }
];
