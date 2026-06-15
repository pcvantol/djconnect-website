# Voice Intent Data Prompt

Gebruik deze prompt in de DJConnect Home Assistant integration wanneer je de
website alleen nieuwe voice/PTT intentdata wilt laten verwerken, zonder extra
website- of layoutinstructies.

```text
Werk de DJConnect voice/PTT intentdata bij voor de website.

Lever uitsluitend gestructureerde intentdata aan. Geen HTML, CSS, layoutadvies
of release-instructies.

Outputformaat:

{
  "version": "3.1.x",
  "source": "djconnect-home-assistant",
  "updated_at": "YYYY-MM-DD",
  "intent_order": [
    {
      "id": "default_playlist",
      "nl": "Default playlist / favorieten",
      "en": "Default playlist / favorites"
    }
  ],
  "families": [
    {
      "id": "artist",
      "label": {
        "nl": "Artiest",
        "en": "Artist"
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
          "Speel Nirvana"
        ],
        "en": [
          "Play Nirvana"
        ]
      }
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

