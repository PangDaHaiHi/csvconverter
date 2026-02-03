export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxtjs/sitemap",
    "@nuxtjs/seo",
  ],
  robots: {
    blockAiBots: false,
    header: false,
    disallow: ["/cdn-cgi/"],
    sitemap: ["https://csvconverter.online/sitemap.xml"],
  },
  sitemap: {
    exclude: ["/privacy-policy", "/**/privacy-policy"],
  },
  site: {
    url: "https://csvconverter.online",
    name: "CSV Converter",
    description:
      "Free online CSV converter: Convert JSON, Excel (XLSX), TXT, XML to CSV. Safe, client-side, and fast.",
    defaultLocale: "en",
  },

  runtimeConfig: {
    public: {
      gtagId: "G-RGG9PEJF5X",
    },
  },

  i18n: {
    baseUrl: "https://csvconverter.online",
    langDir: "locales",
    strategy: "prefix_except_default",
    locales: [
      { code: "en", iso: "en-US", file: "en.json", name: "English" },
      { code: "zh", iso: "zh-CN", file: "zh.json", name: "简体中文" },
      { code: "es", iso: "es-ES", file: "es.json", name: "Español" },
      { code: "de", iso: "de-DE", file: "de.json", name: "Deutsch" },
      { code: "fr", iso: "fr-FR", file: "fr.json", name: "Français" },
      { code: "ja", iso: "ja-JP", file: "ja.json", name: "日本語" },
      { code: "pt", iso: "pt-PT", file: "pt.json", name: "Português" },
      { code: "ru", iso: "ru-RU", file: "ru.json", name: "Русский" },
      { code: "ko", iso: "ko-KR", file: "ko.json", name: "한국어" },
      { code: "it", iso: "it-IT", file: "it.json", name: "Italiano" },
    ],
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    compilation: {
      strictMessage: false,
    },
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/papaparse@5.5.3/papaparse.min.js",
          defer: true,
        },
      ],
    },
  },

  nitro: {
    preset: "cloudflare-pages",
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },

  devtools: { enabled: false },
  compatibilityDate: "2025-01-22",
});
