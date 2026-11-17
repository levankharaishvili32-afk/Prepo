/**
 * Meta Pixel — მთელი ივენთების ლოგიკა ერთ ფაილში.
 *
 * - იტვირთება მხოლოდ მაშინ, როცა site.metaPixelId შევსებულია (იხ. components/MetaPixel.astro).
 * - PageView: გვერდის გახსნისას.
 * - Lead: ნებისმიერ „შეუკვეთე" ღილაკზე დაჭერისას ([data-order] ატრიბუტი).
 *   თუ ღილაკი კონკრეტულ გემოს ეკუთვნის (data-flavor="pesto"), გემო პარამეტრად მიჰყვება.
 */

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function loadPixel(pixelId: string) {
  if (window.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  fbq('init', pixelId);
}

export function trackPageView() {
  window.fbq?.('track', 'PageView');
}

export function trackLead(flavor?: string | null) {
  window.fbq?.('track', 'Lead', flavor ? { content_name: flavor, content_category: 'flavor' } : {});
}

/** ყველა „შეუკვეთე" ღილაკის მოსმენა ერთი დელეგირებული listener-ით. */
function bindOrderButtons() {
  document.addEventListener('click', (event) => {
    const button = (event.target as Element | null)?.closest<HTMLElement>('[data-order]');
    if (button) trackLead(button.dataset.flavor);
  });
}

export function initPixel(pixelId: string) {
  loadPixel(pixelId);
  trackPageView();
  bindOrderButtons();
}
