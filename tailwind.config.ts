import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	fontSize: {
  		xs: '0.7rem',
  		sm: '0.8rem'
  	},
  	extend: {
  		colors: {
  			greenBackgroundTransparent: 'rgba(0,194,120,.12)',
			redbar:'rgba(1, 167, 129, 0.325)',
			greenbar:'rgba(228, 75, 68, 0.325)',
  			redBackgroundTransparent: 'rgba(234,56,59,.12)',
  			baseBackgroundL2: 'rgb(32,33,39)',
  			baseBackgroundL3: 'rgb(56 58 69)',
  			greenPrimaryButtonBackground: 'rgb(0,194,120)',
  			redPrimaryButtonBackground: 'rgb(253 75 78)',
  			greenText: 'rgb(0 194 120)',
  			redText: 'rgb(253 75 78)',
  			baseTextHighEmphasis: 'rgb(244, 244, 246)',
  			baseTextMedEmphasis: 'rgb(150, 159, 175)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderColor: {
  			redBorder: 'rgba(234,56,59,.5)',
  			greenBorder: 'rgba(0,194,120,.4)',
  			baseBorderMed: '#cccccc',
  			accentBlue: 'rgb(76,148,255)',
  			baseBorderLight: 'rgb(32,33,39)',
  			baseTextHighEmphasis: 'rgb(244,244,246)'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		textColor: {
  			greenPrimaryButtonText: 'rgb(20,21,27)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  // Using CSS-based plugins via @plugin in globals.css (Tailwind v4).
  // Keep this empty to avoid double-registering plugins in JS.
  plugins: [],
};
export default config;