/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    // პალიტრა მთლიანად ჩანაცვლებულია: სუფთა თეთრი (#fff) და შავი (#000) განზრახ არ არსებობს.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'prepo-red': '#D52B1E', // ბრენდის წითელი: ფონები, ღილაკები, არაბიატა
      'logo-red': '#C8191E', // ლოგოს წითელი კრემისფერ ფონზე
      'pesto-green': '#3F8F2E', // პესტოს მწვანე (მასზე მხოლოდ დიდი/მსხვილი ტექსტი!)
      cream: '#FFF3DF', // მთავარი ღია ფონი, ტექსტი ფერად ფონზე
      'dark-red': '#7A0F0A', // მუქი ტექსტი კრემისფერ ფონზე
    },
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Georgian Variable"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '28px',
        'card-lg': '40px',
        'card-xl': '56px',
      },
      boxShadow: {
        // ჩრდილები მუქი წითლით, არა შავით
        soft: '0 24px 48px -24px rgb(122 15 10 / 0.38)',
        pop: '0 6px 0 0 rgb(122 15 10 / 0.9)',
      },
      maxWidth: {
        page: '72rem',
      },
    },
  },
  plugins: [],
};
