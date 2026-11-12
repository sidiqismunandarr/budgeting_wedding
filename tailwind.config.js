/**
 * Tailwind CSS Configuration
 * Our Wedding Budget — Perencana Anggaran Pernikahan
 */
tailwind.config = {
    theme: {
        extend: {
            colors: {
                cream: '#FDFBF7',
                beige: {
                    DEFAULT: '#F5EFE6',
                    dark: '#EAE0D2',
                },
                softpink: {
                    light: '#FAF0F1',
                    DEFAULT: '#F4D9DC',
                    dark: '#E8B4B8',
                    accent: '#C98A90',
                },
                sage: {
                    light: '#EFF2EE',
                    DEFAULT: '#8A9A86',
                    dark: '#6B7E67',
                },
                charcoal: {
                    DEFAULT: '#2D312E',
                    muted: '#646B66',
                }
            },
            fontFamily: {
                serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 10px 30px -10px rgba(45, 49, 46, 0.06)',
                'card': '0 4px 20px -2px rgba(138, 154, 134, 0.08)',
            }
        }
    }
};

