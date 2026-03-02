// Tailwind CDN config (kept tiny). If CDN fails, the site still looks ok via site.css.
// https://cdn.tailwindcss.com

window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial',
          'Apple Color Emoji', 'Segoe UI Emoji'
        ],
      },
    },
  },
};
