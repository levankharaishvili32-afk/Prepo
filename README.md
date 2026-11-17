# Prepo (პრეპო) — ვებსაიტი

ერთგვერდიანი, mobile-first ლენდინგი. Astro + Tailwind CSS, სტატიკური build.
ბრენდის, ტექსტების და ასეტების წყარო: [PREPO_WEBSITE_BRIEF.md](PREPO_WEBSITE_BRIEF.md). შესავსები საკითხები: [TODO.md](TODO.md).

## ლოკალურად გაშვება

საჭიროა Node.js 20 ან უფრო ახალი.

```bash
npm install
```

```bash
npm run dev
```

საიტი გაიხსნება მისამართზე `http://localhost:4321`. ფაილის შენახვისას გვერდი თავისით ახლდება.

საბოლოო ვერსიის შესამოწმებლად:

```bash
npm run build
```

```bash
npm run preview
```

`build` ქმნის `dist/` საქაღალდეს — ეს არის ის, რაც სერვერზე იტვირთება.

## სად რა იცვლება

თითქმის ყველაფერი ერთ ფაილშია: **[src/config/site.ts](src/config/site.ts)**.
წესი მარტივია: თუ მნიშვნელობა `null`-ია, შესაბამისი ელემენტი საიტზე არ ჩანს.

### ფასი

```ts
price: 12,   // ლარში; null = ფასი არსად ჩანს
```

ფასი გამოჩნდება გემოების ბარათებში და შეკვეთის სექციაში.

### ბმულები და კონტაქტი

```ts
orderUrl: 'https://ig.me/m/...',       // სად მიდის ყველა „შეუკვეთე" ღილაკი
phone: '+995 ...',
email: '...',
instagramUrl: 'https://instagram.com/...',
facebookUrl: 'https://facebook.com/...',
domain: 'prepo.ge',                    // პროტოკოლის გარეშე
legalText: '...',                      // footer-ის იურიდიული ტექსტი
metaPixelId: '1234567890',             // null = Pixel არ იტვირთება
```

- სანამ `orderUrl` ცარიელია, „შეუკვეთე" ღილაკები გვერდის შეკვეთის სექციაზე ჩადის და იქ ჩანს `orderFallbackText`.
- `domain` აუცილებელია გაშვებამდე: მის გარეშე OG სურათის ბმული ფარდობითია და Facebook/Instagram-ზე გაზიარებისას სურათი არ გამოჩნდება.

### გემოები

`flavors` მასივი იმავე ფაილში. ახალი გემო = ერთი ახალი ჩანაწერი:

```ts
{
  id: 'carbonara',              // ლათინურად; Meta Pixel-ის Lead ივენთს მიჰყვება
  status: 'available',          // 'soon' = „მალე" ბარათი
  name: 'კარბონარა',
  tagline: '...',
  description: '...',
  ingredients: ['...', '...'],
  color: '#D52B1E',             // ბარათის ფონი
  mascot: 'mascotArrabbiata',   // გასაღები src/config/images.ts-დან
  mascotAlt: '...',
},
```

მესამე გემოს გასააქტიურებლად შეცვალე `status: 'soon'` → `'available'` და შეავსე დანარჩენი ველები.
პესტოს „კაკალი/ნუში" ერთი ცვლადია ფაილის თავში: `pestoNut`.

### ხშირი კითხვები

`faq` მასივი. საიტზე ჩანს მხოლოდ ის კითხვები, რომლებსაც `answer` აქვთ; `answer: null` დამალულია.

### მომზადების დრო

`cookTime: null` ნიშნავს, რომ დრო ჯერ დადასტურებული არ არის. კონკრეტული რიცხვი საიტზე არსად წერია, მხოლოდ „წუთებში".

### სურათები

ყველა სურათის იმპორტი ერთ ფაილშია: **[src/config/images.ts](src/config/images.ts)**.

რეალური ფოტოს ჩასასმელად:

1. ფაილი ჩააგდე `src/assets/`-ში (JPG ან PNG, სასურველია 1200px+ სიგანე).
2. `images.ts`-ში შეცვალე შესაბამისი იმპორტის გზა.

ზომებს და ფორმატებს (AVIF/WebP) Astro თვითონ აგენერირებს.

ორიგინალი ასეტები ხელუხლებლად დევს `assets-original/`-ში. მათგან საიტის ვერსიებს სკრიპტები ამზადებს:

```bash
npm run assets
```

ეს ქმნის გამჭვირვალე ლოგოებს, მასკოტების სტიკერებს (კრემისფერი კონტურით), ფოტოებს, favicon-ებს და OG სურათს.

```bash
npm run video
```

ეს კუმშავს hero-ს ვიდეოს (`public/video/hero.mp4` და `hero.webm`, თითო ~1 MB) და იღებს poster კადრს.

### ტექსტები

სექციების ტექსტები თვითონ კომპონენტებშია: `src/components/` (`Hero.astro`, `HowItWorks.astro`, `WhyPrepo.astro`, `Packaging.astro`, `OrderSection.astro`).

### ფერები

[tailwind.config.mjs](tailwind.config.mjs): `prepo-red`, `logo-red`, `pesto-green`, `cream`, `dark-red`. სუფთა თეთრი და შავი პალიტრაში განზრახ არ არის.
მწვანე ფონზე (`pesto-green`) მხოლოდ დიდი და მსხვილი ტექსტი იწერება — პატარა ტექსტისთვის კონტრასტი არასაკმარისია.

## შეკვეთა

ახლა შეკვეთა ღილაკზეა დაფუძნებული: ყველა „შეუკვეთე" ღილაკი (`src/components/OrderButton.astro`) `orderUrl`-ზე მიდის.
შეკვეთის სექცია ცალკე კომპონენტია (`src/components/OrderSection.astro`) — ფორმის ან კალათის დამატებისას მხოლოდ ის იცვლება.

## Meta Pixel

მთელი ლოგიკა ერთ ფაილშია: [src/lib/pixel.ts](src/lib/pixel.ts).

- იტვირთება მხოლოდ მაშინ, როცა `metaPixelId` შევსებულია.
- `PageView` — გვერდის გახსნისას.
- `Lead` — ნებისმიერ „შეუკვეთე" ღილაკზე დაჭერისას. გემოს ბარათის ღილაკი პარამეტრად აგზავნის გემოს: `content_name: 'pesto'`.

## Vercel-ზე ატვირთვა

1. კოდი ატვირთე GitHub-ზე:

   ```bash
   git init
   ```

   ```bash
   git add -A
   ```

   ```bash
   git commit -m "Prepo website"
   ```

   შემდეგ შექმენი ცარიელი რეპოზიტორია GitHub-ზე და მიჰყევი იქ ნაჩვენებ `git remote add` / `git push` ბრძანებებს.

2. [vercel.com](https://vercel.com)-ზე: **Add New → Project** → აირჩიე რეპოზიტორია.
3. Vercel თვითონ ამოიცნობს Astro-ს (Build Command: `npm run build`, Output Directory: `dist`). დააჭირე **Deploy**.
4. დომენი: **Project → Settings → Domains**. დომენის მიბმის შემდეგ `site.ts`-ში შეავსე `domain` და ხელახლა ატვირთე (`git push`).

Netlify-ზე იგივე პარამეტრებია: build command `npm run build`, publish directory `dist`.

## შემოწმება

`npm run preview` გაშვებული უნდა იყოს მეორე ტერმინალში.

```bash
node scripts/screenshots.mjs
```

იღებს სქრინშოტებს 375 / 768 / 1440 სიგანეზე (`.cache/screenshots/`) და ამოწმებს ჰორიზონტალურ გადმოსვლას.

```bash
node scripts/lighthouse.mjs
```

უშვებს Lighthouse-ს mobile რეჟიმში; სრული ანგარიში: `.cache/lighthouse.html`.

ბოლო შედეგი (ლოკალური preview, mobile): Performance 96 · Accessibility 100 · Best Practices 100 · SEO 100.

## სტრუქტურა

```
assets-original/      ჩამოტვირთული ორიგინალები (ხელუხლებელი)
scripts/              ასეტების დამუშავება, ვიდეო, სქრინშოტები, Lighthouse
public/               favicon, apple-touch-icon, og.jpg, video/
src/
  assets/             საიტის სურათები
  config/site.ts      ფასი, ბმულები, გემოები, FAQ
  config/images.ts    ყველა სურათის იმპორტი
  lib/pixel.ts        Meta Pixel
  layouts/Base.astro  <head>, meta/OG თეგები, შრიფტი
  components/         სექციები
  pages/              index.astro, 404.astro
  styles/global.css
```
