/**
 * Meta Pixel — მთელი ივენთების ლოგიკა ერთ ფაილში.
 *
 * - იტვირთება მხოლოდ მაშინ, როცა site.metaPixelId შევსებულია (იხ. components/MetaPixel.astro).
 * - PageView: გვერდის გახსნისას.
 * - Lead: ნებისმიერ „შეუკვეთე" ღილაკზე დაჭერისას ([data-order] ატრიბუტი).
 *   თუ ღილაკი კონკრეტულ გემოს ეკუთვნის (data-flavor="pesto"), გემო პარამეტრად მიჰყვება.
 * - Purchase: /thank-you გვერდის გახსნისას, შეკვეთის წარმატებით გაგზავნის შემდეგ.
 *   პარამეტრები: value (ჯამი), currency (GEL), contents, num_items.
 *   იგზავნება ერთხელ: გვერდის განახლება ან პირდაპირ გახსნა ივენთს აღარ იმეორებს.
 *   თუ ფასი საიტზე მითითებული არ არის (price: null), Purchase-ის ნაცვლად იგზავნება Lead.
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

export type OrderDetail = { items: { id: string; quantity: number }[]; total: number | null };

export function trackOrder(detail: OrderDetail) {
  const contents = detail.items.map((item) => ({ id: item.id, quantity: item.quantity }));
  if (detail.total !== null) {
    const numItems = detail.items.reduce((sum, item) => sum + item.quantity, 0);
    window.fbq?.('track', 'Purchase', {
      value: detail.total,
      currency: 'GEL',
      contents,
      content_ids: detail.items.map((item) => item.id),
      content_type: 'product',
      num_items: numItems,
    });
  } else {
    window.fbq?.('track', 'Lead', { content_name: detail.items.map((item) => item.id).join(','), content_category: 'order' });
  }
}

/**
 * /thank-you გვერდი შეკვეთის დეტალებს ორი გზით გვაწვდის: `prepo:order` ივენთით და window.__prepoOrder-ით.
 * ორივეს ვამოწმებთ, რომ ივენთი არ დაიკარგოს სკრიპტების ჩატვირთვის რიგის მიუხედავად, და ვაგზავნით მხოლოდ ერთხელ.
 */
function bindOrderForm() {
  let sent = false;
  const send = (detail?: OrderDetail) => {
    if (sent || !detail) return;
    sent = true;
    trackOrder(detail);
  };
  document.addEventListener('prepo:order', (event) => send((event as CustomEvent<OrderDetail>).detail));
  send((window as Window & { __prepoOrder?: OrderDetail }).__prepoOrder);
}

export function initPixel(pixelId: string) {
  loadPixel(pixelId);
  trackPageView();
  bindOrderButtons();
  bindOrderForm();
}
