# Fiber Intake Tracker

A modern, responsive web application for tracking daily fiber intake built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Features

### Core Features
- **Daily Fiber Tracker**: Track your fiber intake throughout the day
- **Editable Daily Target**: Set and adjust your personal fiber intake goal
- **Color-Coded Status Indicator**:
  - 🟢 Green: Target met or within range
  - 🟡 Yellow: Below target
  - 🔴 Red: Significantly exceeded target
- **Calendar View**: Visual monthly calendar showing your fiber intake history
- **Entry Management**: Add, edit, and delete fiber entries for any day
- **Persistent Storage**: All data saved locally using localStorage

### Technical Features
- Built with Next.js 14+ App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React Calendar for calendar functionality
- Lucide React for icons
- Mobile-responsive design
- Dark mode support
- Ready for Vercel deployment

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/solikiev/Fiber.git
cd Fiber
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

#### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

#### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure build settings
4. Click "Deploy"

Your app will be live at `https://your-app-name.vercel.app`

### Other Deployment Options

This app can also be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Any platform supporting Node.js

## Usage

### Dashboard View

1. **View Today's Total**: See your current fiber intake for today
2. **Edit Target**: Click the edit icon next to your target to adjust your daily goal
3. **Add Entry**: Fill in the amount (in grams) and description, then click "Add Entry"
4. **Manage Entries**: Edit or delete any entry using the action buttons

### Calendar View

1. **Browse History**: Navigate through months to view your intake history
2. **Color Indicators**: Each day with entries shows a colored badge indicating status
3. **View Details**: Click any date to see all entries for that day
4. **Edit History**: Modify or delete past entries as needed

## Data Storage

All data is stored locally in your browser using localStorage:
- **Fiber Entries**: Date, amount, description, and timestamp
- **Daily Target**: Your personal fiber goal

**Note**: Data is stored per browser/device. Clearing browser data will remove all entries.

## Project Structure

```
Fiber/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with navigation
│   └── globals.css         # Global styles
├── components/
│   ├── Dashboard.tsx       # Dashboard view component
│   └── CalendarView.tsx    # Calendar view component
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   └── storage.ts          # localStorage utilities
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.js          # Next.js configuration
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- ESLint for code linting
- TypeScript for type checking
- Prettier-compatible formatting (via ESLint)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires localStorage support.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, React, and TypeScript