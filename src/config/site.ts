/**
 * Prepo — საიტის ყველა ცვლადი ერთ ფაილში.
 *
 * წესი: თუ მნიშვნელობა `null`-ია, შესაბამისი ელემენტი საიტზე იმალება
 * (ან ნეიტრალური ტექსტი ჩანს). რიცხვი, ტელეფონი ან ბმული არ მოიფიქრო —
 * ჩაწერე მხოლოდ დადასტურებული ინფორმაცია.
 */
import type { ImageKey } from './images';

export type Flavor = {
  /** უნიკალური გასაღები; Meta Pixel-ის Lead ივენთს მიჰყვება პარამეტრად */
  id: string;
  /** 'available' = იყიდება, 'soon' = „მალე" ბარათი */
  status: 'available' | 'soon';
  name: string;
  /** მოკლე სლოგანი სახელის ქვეშ */
  tagline?: string;
  description?: string;
  /** ძირითადი შემადგენლობა (ჩიპებად ჩანს) */
  ingredients?: string[];
  /** ბარათის ფონის ფერი (HEX). ტექსტი მასზე ყოველთვის კრემისფერი და მსხვილია. */
  color?: string;
  /** პერსონაჟის სურათის გასაღები src/config/images.ts-დან */
  mascot?: ImageKey;
  mascotAlt?: string;
};

export type FaqItem = {
  question: string;
  /** null = პასუხი ჯერ არ არის; კითხვა საიტზე არ ჩანს */
  answer: string | null;
};

/** პესტო: კაკალი თუ ნუში — დასაზუსტებელია მფლობელთან (ალერგენების გამო მნიშვნელოვანია). */
export const pestoNut = 'კაკალი';

export const site = {
  name: 'Prepo',
  nameKa: 'პრეპო',
  title: 'Prepo — რესტორნის გემო სახლში, წუთებში',
  description:
    'პრეპო ნამდვილი იტალიური სოუსია, უკვე მომზადებული და გაყინული. შენ მხოლოდ პასტა მოხარშე. დანარჩენი ჩვენ უკვე გავაკეთეთ.',

  // ───────── ღია საკითხები (ბრიფის მე-7 განყოფილება) ─────────

  /** ერთი კონტეინერის ფასი ლარში, მაგ. 12. null = ფასი არსად ჩანს. */
  price: null as number | null,

  /** სად მიდის ყველა „შეუკვეთე" ღილაკი (Instagram DM, Messenger, ფორმა...). */
  orderUrl: null as string | null,
  /** ტექსტი შეკვეთის სექციაში, სანამ orderUrl ცარიელია. */
  orderFallbackText: 'შეკვეთის ბმული მალე დაემატება.',

  phone: null as string | null, // მაგ. '+995 5XX XX XX XX'
  email: null as string | null,
  instagramUrl: null as string | null,
  facebookUrl: null as string | null,

  /** Meta Pixel ID. null = Pixel საერთოდ არ იტვირთება. */
  metaPixelId: null as string | null,

  /** დომენი პროტოკოლის გარეშე, მაგ. 'prepo.ge'. საჭიროა სწორი OG ბმულებისთვის. */
  domain: 'prepo-tau.vercel.app' as string | null,

  /** Footer-ის იურიდიული ტექსტი (იურიდიული პირი, ს/კ და ა.შ.). */
  legalText: null as string | null,

  /** მომზადების დრო, მაგ. '5 წუთში'. null = ყველგან წერია „წუთებში". ჯერ გაზომილი არ არის! */
  cookTime: null as string | null,
  /** რამდენ პორციაზეა ერთი კონტეინერი (250 მლ). */
  servings: null as string | null,
  /** მიწოდება: ზონა, ვადა, ღირებულება. */
  delivery: null as string | null,
  /** გადახდის გზები. */
  payment: null as string | null,
  allergens: null as string | null,
  nutrition: null as string | null,
  shelfLife: null as string | null,

  // ───────── გემოები ─────────
  // ახალი გემო = ერთი ახალი ჩანაწერი ამ მასივში.
  flavors: [
    {
      id: 'arrabbiata',
      status: 'available',
      name: 'არაბიატა',
      tagline: 'ცხარე თუ გიყვარს',
      description:
        'პომიდორი, ნიორი, ზეითუნის ზეთი და ცხარე წიწაკა. კლასიკური იტალიური არაბიატა, ხასიათიანებისთვის.',
      ingredients: ['პომიდორი', 'ნიორი', 'ზეითუნის ზეთი', 'ცხარე წიწაკა'],
      color: '#D52B1E',
      mascot: 'mascotArrabbiata',
      mascotAlt: 'არაბიატას პერსონაჟი: წითელი სოუსის კუბი წიწაკის ქუდით და ნივრის კბილით ხელში',
    },
    {
      id: 'pesto',
      status: 'available',
      name: 'პესტო',
      tagline: 'მწვანე კლასიკა',
      description: `ახალი ბაზილიკი, ზეითუნის ზეთი, ყველი და ${pestoNut}. გენუური პესტო, როგორიც უნდა იყოს.`,
      ingredients: ['ახალი ბაზილიკი', 'extra virgin ზეითუნის ზეთი', 'ყველი', pestoNut],
      color: '#3F8F2E',
      mascot: 'mascotPesto',
      mascotAlt: 'პესტოს პერსონაჟი: მწვანე სოუსის კუბი ბაზილიკის ფოთლის ბერეტით, თვალს გიკრავს',
    },
    {
      id: 'third',
      status: 'soon',
      name: 'მესამე გემო',
    },
  ] as Flavor[],

  // ───────── ხშირი კითხვები ─────────
  // საიტზე ჩანს მხოლოდ ის კითხვები, რომლებსაც answer აქვთ.
  faq: [
    {
      question: 'როგორ შევინახო?',
      answer: 'საყინულეში, −18°C-ზე.',
    },
    {
      question: 'როგორ მოვამზადო?',
      answer:
        'ამოიღე საყინულიდან და გახსენი კონტეინერი. გაყინული სოუსი პირდაპირ ტაფაში მიდის. შეურიე მოხარშულ პასტას და ვახშამი მზადაა. არ სჭირდება დაჭრა, მოშუშვა ან რეცეპტის ძებნა.',
    },
    {
      question: 'კონტეინერს ხელახლა გამოვიყენებ?',
      answer: 'კი. კონტეინერი მრავალჯერადია, ჰერმეტული და მიკროტალღურში დასადები.',
    },
    { question: 'რამდენ პორციაზეა ერთი კონტეინერი?', answer: null },
    { question: 'რა ვადა აქვს?', answer: null },
    { question: 'სად და როგორ ხდება მიწოდება?', answer: null },
    { question: 'როგორ გადავიხადო?', answer: null },
    { question: 'რა ალერგენებს შეიცავს?', answer: null },
  ] as FaqItem[],
};

/** აბსოლუტური ბმული (OG თეგებისთვის). დომენის გარეშე აბრუნებს ფარდობით მისამართს. */
export const absoluteUrl = (path: string) =>
  site.domain ? new URL(path, `https://${site.domain}`).href : path;

/** „წუთებში" ან დადასტურებული კონკრეტული დრო. */
export const cookTimeText = site.cookTime ?? 'წუთებში';
