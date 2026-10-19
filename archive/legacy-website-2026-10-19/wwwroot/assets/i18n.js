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

  const normalizeLanguage = (language, fallback = defaultLanguage) => (
    supportedLanguages.includes(language) ? language : fallback
  );

  const firstSupportedLanguage = (...languages) => (
    languages.find((language) => supportedLanguages.includes(language)) || defaultLanguage
  );

  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  const pathLanguage = window.location.pathname.split("/").filter(Boolean)[0];
  const storedLanguage = localStorage.getItem("djconnect-language");
  const browserLanguage = [
    ...(navigator.languages || []),
    navigator.language
  ]
    .filter(Boolean)
    .map((language) => language.toLowerCase().split("-")[0])
    .find((language) => supportedLanguages.includes(language));
  const initialLanguage = firstSupportedLanguage(urlLanguage, storedLanguage, pathLanguage, browserLanguage, defaultLanguage);
  localStorage.setItem("djconnect-language", initialLanguage);

  const localizedPathFor = (targetUrl, language) => {
    if (targetUrl.origin !== window.location.origin) return null;
    if (targetUrl.pathname.startsWith("/api/") || targetUrl.pathname.startsWith("/go/")) return null;
    if (targetUrl.pathname.startsWith("/assets/")) return null;

    const normalizedLanguage = normalizeLanguage(language);
    const parts = targetUrl.pathname.split("/").filter(Boolean);
    const hasLanguagePrefix = supportedLanguages.includes(parts[0]);
    const pageParts = hasLanguagePrefix ? parts.slice(1) : parts;
    const pagePath = pageParts.join("/");
    const isIndex = pagePath === "" || pagePath === "index.html";
    const localizedPath = normalizedLanguage === defaultLanguage
      ? `/${isIndex ? "" : pagePath}`
      : `/${normalizedLanguage}/${isIndex ? "" : pagePath}`;

    return `${localizedPath}${targetUrl.search}${targetUrl.hash}`;
  };

  const localizeUrl = (href, language = localStorage.getItem("djconnect-language") || initialLanguage) => {
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
    const targetUrl = new URL(href, window.location.href);
    return localizedPathFor(targetUrl, language) || href;
  };

  const applyLocalizedLinks = (language = localStorage.getItem("djconnect-language") || initialLanguage) => {
    document.querySelectorAll("a[href]").forEach((link) => {
      const originalHref = link.dataset.baseHref || link.getAttribute("href");
      if (!originalHref) return;
      link.dataset.baseHref = originalHref;
      const localizedHref = localizeUrl(originalHref, language);
      if (localizedHref !== originalHref || link.getAttribute("href") !== localizedHref) {
        link.setAttribute("href", localizedHref);
      }
    });
  };

  document.addEventListener("click", (event) => {
    const languageButton = event.target.closest?.("[data-lang]");
    if (languageButton?.dataset?.lang) {
      window.setTimeout(() => applyLocalizedLinks(languageButton.dataset.lang), 0);
    }

    const link = event.target.closest?.("a[href]");
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;
    const originalHref = link.dataset.baseHref || link.getAttribute("href");
    const localizedHref = localizeUrl(originalHref);
    if (!localizedHref || localizedHref === link.getAttribute("href")) return;
    event.preventDefault();
    window.location.href = localizedHref;
  });

  document.addEventListener("DOMContentLoaded", () => applyLocalizedLinks(initialLanguage));

  window.DJCONNECT_I18N = {
    supportedLanguages,
    defaultLanguage,
    shared,
    initialLanguage,
    normalizeLanguage,
    firstSupportedLanguage,
    localizeUrl,
    applyLocalizedLinks
  };
})();
