# Voice Intent Data Prompt

Gebruik deze prompt in de DJConnect Home Assistant integration wanneer je de
website alleen nieuwe voice/PTT intentdata wilt laten verwerken, zonder extra
website- of layoutinstructies.

Canonical spoken music intent example data lives in
`examples/voice_intents.json` in the Home Assistant integration repo. Use that
file as source when updating website/client documentation.

```text
Werk de DJConnect voice/PTT intentdata bij voor de website.

Gebruik examples/voice_intents.json uit de Home Assistant integration repo als
canonical bron voor intentfamilies, volgorde, regels en voorbeeldzinnen.

Lever uitsluitend gestructureerde intentdata aan. Geen HTML, CSS, layoutadvies
of release-instructies.

Outputformaat:

{
  "version": "3.1.x",
  "source": "djconnect-home-assistant",
  "updated_at": "YYYY-MM-DD",
  "intent_order": [
    {
      "id": "current_track",
      "nl": "Huidige track status",
      "en": "Current track status"
    }
  ],
  "families": [
    {
      "id": "playback_control",
      "spotify_type": "backend_command",
      "plays_music": false,
      "label": {
        "nl": "Bediening",
        "en": "Control"
      },
      "title": {
        "nl": "Artiest starten",
        "en": "Start an artist"
      },
      "description": {
        "nl": "Korte uitleg in het Nederlands.",
        "en": "Short explanation in English."
      },
      "examples": {
        "nl": [
          "Stop muziek"
        ],
        "en": [
          "Stop music"
        ]
      },
      "commands": [
        {
          "phrase": {
            "nl": "Stop muziek",
            "en": "Stop music"
          },
          "backend_command": "pause"
        }
      ]
    }
  ],
  "artist_first": {
    "nl": "Nederlandse uitleg van artist-first fallback.",
    "en": "English explanation of artist-first fallback."
  },
  "tip": {
    "nl": "Tiptekst in het Nederlands.",
    "en": "Tip text in English."
  }
}

Vereisten:
- Houd dezelfde intentfamilies en dezelfde volgorde aan als
  examples/voice_intents.json.
- Neem `current_track` op als statusfamilie: geen Spotify search, geen playback
  starten of wijzigen, alleen huidige Spotify playback-status lezen en een
  DJ-response maken.
- Neem `playback_control` op als directe backend-command familie: geen Spotify
  search en geen Assist music intent parsing.
- Documenteer minimaal deze command mapping: `Stop muziek` -> `pause`,
  `Start muziek` -> `play`, `Zet harder` -> volume `+10`, `Zet zachter` ->
  volume `-10`, `Volgende nummer` -> `next`, `Vorig nummer` -> `previous`.
- Neem `artist_with_track` apart op wanneer de handling order dit noemt. Gebruik
  alleen voorbeeldzinnen die ook in `examples/voice_intents.json` staan.
- Houd generieke artiestverzoeken artist-first.
- Behandel expliciete `nummer`/`liedje`/`track`/`song` verzoeken als track
  searches.
- Behandel expliciete `album`/`plaat` verzoeken als album searches.
- Behandel expliciete `playlist`/`afspeellijst` verzoeken als playlist
  searches.
- Laat default playlist/favorieten-zinnen naar de geconfigureerde default
  playlist mappen.
- Houd dezelfde intentfamilies en dezelfde volgorde aan in NL en EN.
- Gebruik geen gemengde NL/EN voorbeeldzinnen in een taalveld, behalve
  producttermen zoals playlist.
- Zet voorbeeldzinnen exact zoals gebruikers ze kunnen zeggen.
- Neem alleen intents op die de Home Assistant integration daadwerkelijk
  ondersteunt of bewust als fallback verwerkt.
- Markeer nieuwe of experimentele intentfamilies met `"status": "experimental"`.
- Verwijder verouderde voorbeelden in plaats van ze als losse opmerkingen mee
  te sturen.
- Laat website-rendering, styling, release, changelog en deploy buiten deze
  output.
```
