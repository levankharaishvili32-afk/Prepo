/**
 * ყველა სურათის იმპორტი ერთ ადგილას.
 *
 * ახლანდელი ფოტოები AI-ით არის დაგენერირებული (კონცეფციის ვიზუალი).
 * რეალური ფოტოს ჩასასმელად: ფაილი ჩააგდე src/assets/-ში და აქ შეცვალე მხოლოდ იმპორტის გზა.
 * ზომებს და ფორმატებს (WebP/AVIF) Astro თვითონ აგენერირებს build-ის დროს.
 */
import logoRed from '../assets/logo-red.png';
import logoCream from '../assets/logo-cream.png';
import logoFullRed from '../assets/logo-full-red.png';
import mascotArrabbiata from '../assets/mascot-arrabbiata.png';
import mascotPesto from '../assets/mascot-pesto.png';
import mascotSitting from '../assets/mascot-sitting.png';
import heroPoster from '../assets/hero-poster.jpg';
import heroVertical from '../assets/hero-vertical.jpg';
import packaging from '../assets/packaging-mockup.jpg';
import promoIngredients from '../assets/promo-ingredients.jpg';
import promoKitchen from '../assets/promo-kitchen.jpg';
import promoRedGreen from '../assets/promo-red-green.jpg';
import gallery1 from '../assets/gallery-1-spaghetti-plate.jpg';
import gallery2 from '../assets/gallery-2-pasta-and-sauce.jpg';
import gallery3 from '../assets/gallery-3-rigatoni-plate.jpg';
import gallery4 from '../assets/gallery-4-rigatoni-serving.jpg';

export const images = {
  /** ლოგო: წითელი, გამჭვირვალე ფონით (კრემისფერ ფონზე) */
  logoRed,
  /** ლოგო: კრემისფერი, გამჭვირვალე ფონით (წითელ/მუქ ფონზე) */
  logoCream,
  /** ლოგო „პრეპო" წარწერით ქვემოთ */
  logoFullRed,
  mascotArrabbiata,
  mascotPesto,
  /** მჯდომარე მასკოტი, ხელს იქნევს */
  mascotSitting,
  /** Hero ვიდეოს პირველი კადრი (poster) */
  heroPoster,
  /** ვერტიკალური კადრი: ტაფა + ორივე კონტეინერი (სათადარიგო hero) */
  heroVertical,
  /** შეფუთვის მოკაპი, ორივე გემო */
  packaging,
  /** სარეკლამო ფოტო ინგრედიენტებით */
  promoIngredients,
  /** სარეკლამო ფოტო სამზარეულოში */
  promoKitchen,
  /** სარეკლამო ფოტო წითელ-მწვანე ფონზე */
  promoRedGreen,
  /** გალერეის ფოტოები (components/Gallery.astro) */
  gallery1,
  gallery2,
  gallery3,
  gallery4,
};

export type ImageKey = keyof typeof images;
