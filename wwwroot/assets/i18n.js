(() => {
  const supportedLanguages = ["en", "nl", "de", "fr", "es"];
  const defaultLanguage = "nl";

  const shared = {
    en: {
      productName: "DJConnect",
      tagline: "Music control with character",
      clientApple: "iOS, macOS and Apple Watch",
      clientWindows: "Windows",
      clientEmbedded: "ESP32",
      clientRaspberryPi: "Raspberry Pi / Linux",
      requirements: "Home Assistant, the HACS DJConnect integration, a music backend and local pairing.",
      pairing: "Pair locally on the same network as Home Assistant, then use remote-capable app clients through your Home Assistant URL.",
      legalCopyright: "Copyright Peter van Tol 2026. Released under the MIT License.",
      legalSpotify: "Spotify is a trademark of Spotify AB. DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB.",
      legalPrivacy: "Privacy: DJConnect stores account tokens and pairing data in the app or Home Assistant. This website does not receive or store account data.",
      legalPrivacyLink: "Privacy Policy",
      legalSupport: "Support"
    },
    nl: {
      productName: "DJConnect",
      tagline: "Muziekbediening met karakter",
      clientApple: "iOS, macOS en Apple Watch",
      clientWindows: "Windows",
      clientEmbedded: "ESP32",
      clientRaspberryPi: "Raspberry Pi / Linux",
      requirements: "Home Assistant, de HACS DJConnect integration, een music backend en lokale pairing.",
      pairing: "Pair lokaal op hetzelfde netwerk als Home Assistant en gebruik remote-capable app-clients daarna via je Home Assistant URL.",
      legalCopyright: "Copyright Peter van Tol 2026. Released under the MIT License.",
      legalSpotify: "Spotify is a trademark of Spotify AB. DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB.",
      legalPrivacy: "Privacy: DJConnect bewaart accounttokens en koppelgegevens in de app of Home Assistant. Deze website ontvangt of bewaart geen accountgegevens.",
      legalPrivacyLink: "Privacy Policy",
      legalSupport: "Support"
    },
    de: {
      productName: "DJConnect",
      tagline: "Musiksteuerung mit Charakter",
      clientApple: "iOS, macOS und Apple Watch",
      clientWindows: "Windows",
      clientEmbedded: "ESP32",
      clientRaspberryPi: "Raspberry Pi / Linux",
      requirements: "Home Assistant, die HACS DJConnect-Integration, ein Musik-Backend und lokales Pairing.",
      pairing: "Kopple lokal im selben Netzwerk wie Home Assistant und nutze danach remote-fähige App-Clients über deine Home-Assistant-URL.",
      legalCopyright: "Copyright Peter van Tol 2026. Released under the MIT License.",
      legalSpotify: "Spotify is a trademark of Spotify AB. DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB.",
      legalPrivacy: "Datenschutz: DJConnect speichert Account-Tokens und Pairing-Daten in der App oder in Home Assistant. Diese Website empfängt oder speichert keine Account-Daten.",
      legalPrivacyLink: "Privacy Policy",
      legalSupport: "Support"
    },
    fr: {
      productName: "DJConnect",
      tagline: "Contrôle musical avec du caractère",
      clientApple: "iOS, macOS et Apple Watch",
      clientWindows: "Windows",
      clientEmbedded: "ESP32",
      clientRaspberryPi: "Raspberry Pi / Linux",
      requirements: "Home Assistant, l'integration HACS DJConnect, un backend musical et un appairage local.",
      pairing: "Associez localement sur le meme reseau que Home Assistant, puis utilisez les clients d'app compatibles distance via votre URL Home Assistant.",
      legalCopyright: "Copyright Peter van Tol 2026. Released under the MIT License.",
      legalSpotify: "Spotify is a trademark of Spotify AB. DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB.",
      legalPrivacy: "Confidentialite : DJConnect stocke les jetons de compte et les donnees d'appairage dans l'app ou Home Assistant. Ce site ne recoit ni ne stocke de donnees de compte.",
      legalPrivacyLink: "Privacy Policy",
      legalSupport: "Support"
    },
    es: {
      productName: "DJConnect",
      tagline: "Control musical con caracter",
      clientApple: "iOS, macOS y Apple Watch",
      clientWindows: "Windows",
      clientEmbedded: "ESP32",
      clientRaspberryPi: "Raspberry Pi / Linux",
      requirements: "Home Assistant, la integracion HACS DJConnect, un backend musical y emparejamiento local.",
      pairing: "Empareja localmente en la misma red que Home Assistant y despues usa los clientes de app compatibles con remoto mediante tu URL de Home Assistant.",
      legalCopyright: "Copyright Peter van Tol 2026. Released under the MIT License.",
      legalSpotify: "Spotify is a trademark of Spotify AB. DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB.",
      legalPrivacy: "Privacidad: DJConnect guarda tokens de cuenta y datos de emparejamiento en la app o en Home Assistant. Este sitio no recibe ni guarda datos de cuenta.",
      legalPrivacyLink: "Privacy Policy",
      legalSupport: "Support"
    }
  };

  const normalizeLanguage = (language) => (
    supportedLanguages.includes(language) ? language : defaultLanguage
  );

  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  const pathLanguage = window.location.pathname.split("/").filter(Boolean)[0];
  const initialLanguage = normalizeLanguage(urlLanguage || pathLanguage || localStorage.getItem("djconnect-language") || defaultLanguage);
  localStorage.setItem("djconnect-language", initialLanguage);

  window.DJCONNECT_I18N = {
    supportedLanguages,
    defaultLanguage,
    shared,
    initialLanguage,
    normalizeLanguage
  };
})();
