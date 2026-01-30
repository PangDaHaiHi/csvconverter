export const useGoogleAnalytics = () => {
  const config = useRuntimeConfig();
  const gtagId = config.public.gtagId;

  const enable = () => {
    if (!gtagId) {
      console.warn("Google Analytics: No GTAG_ID provided.");
      return;
    }

    if (process.client && typeof window !== "undefined") {
      // Check if already initialized
      if ((window as any).dataLayer) return;

      // Inject script
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      (window as any).gtag = gtag;

      gtag("js", new Date());
      gtag("config", gtagId, {
        anonymize_ip: true,
      });
    }
  };

  return {
    enable,
  };
};
