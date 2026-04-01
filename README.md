# AntarYatra 🌍

**Your personal mental wellness companion**

AntarYatra is a comprehensive mental health and wellness platform designed to make mental health support accessible to everyone. Built with modern web technologies and a focus on user privacy, it combines AI-powered insights, evidence-based techniques, and community support.

## Features ✨

### Core Wellness Tools
- 🧘 **Breathing Exercises** - Guided techniques for stress relief and relaxation
- 📔 **Journaling** - Private space for self-reflection and emotional expression
- 🎯 **Mood Tracking** - Visual analytics of emotional patterns over time
- 🧠 **Mental Health Assessment** - Evidence-based wellness questionnaires
- 🎡 **Emotion Wheel** - Interactive tool to identify and understand emotions
- 😤 **Anger Room** - Safe space to process difficult emotions
- 🌌 **Guided Visualizations** - Immersive relaxation and mindfulness experiences
- 🌳 **Grounding Techniques** - Practical exercises for anxiety and dissociation

### Advanced Features
- 🤖 **AI-Powered Insights** - Personalized analysis of journal entries and mood patterns using Claude API
- 🏆 **Achievement System** - Gamified wellness tracking with badges and milestones
- 👥 **Community Platform** - Real-time chat, peer support, and connection
- 🆘 **Crisis Support** - Quick access to emergency resources and therapist directory
- 🌍 **Multi-Language Support** - Full support for 12 Indian languages (Hindi, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Assamese, Bengali, Punjabi, English)

### Dashboard Pages
- **Overview** - Personal wellness dashboard with key metrics
- **Journal** - Journaling experience with AI analysis
- **Mood** - Mood tracking with heatmap and patterns
- **Mindspace** - Guided exercises and tools
- **Community** - Real-time chat and peer connections
- **Rewards** - Achievements and progress tracking
- **Profile** - User settings and preferences

## Tech Stack 🛠️

- **Frontend**: Next.js 15.2.4 with App Router
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v4.1.9
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI Integration**: Claude API via OpenRouter
- **Real-time Chat**: Supabase Realtime
- **Language**: TypeScript 5
- **Testing**: Vitest

## Project Structure 📁

```
.
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── layout.tsx          # Dashboard layout with background
│   │   ├── page.tsx            # Overview page
│   │   ├── journal/            # Journaling features
│   │   ├── mood/               # Mood tracking
│   │   ├── mindspace/          # Wellness tools
│   │   ├── community/          # Community chat
│   │   ├── rewards/            # Achievements
│   │   └── profile/            # User settings
│   ├── admin/                  # Admin panel
│   ├── api/                    # API routes
│   │   └── ai/                 # AI integration endpoints
│   ├── crisis/                 # Crisis support page
│   ├── login/                  # Authentication
│   └── page.tsx                # Landing page
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── [feature]/              # Feature-specific components
│   └── live-chat-room.tsx      # Real-time chat
├── lib/                         # Utilities and services
│   ├── i18n/                   # i18n system (12 languages)
│   ├── supabase/               # Supabase client/server
│   ├── security/               # Security utilities
│   ├── actions/                # Server actions
│   └── openrouter.ts           # Claude API integration
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
└── styles/                      # Global styles
```

## Getting Started 🚀

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Supabase account
- OpenRouter API key (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Addyy-M13/AntarYatra-Public.git
cd AntarYatra-Public-Build-master
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**
Create a `.env.local` file with:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Integration (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_key

# Admin credentials (optional)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
```

4. **Database Setup**
- Create a Supabase project
- Run migrations in `lib/security/rls-policies.sql.ts`
- Create tables: `chat_messages`, `journal_entries`, `user_profiles`, `achievements`

5. **Run Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts 📜

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm test           # Run tests with Vitest
npm run type-check # Run TypeScript type checking
```

## Language Support 🌐

AntarYatra supports 12 languages across India:

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Complete |
| Hindi (Hinglish) | `hi` | ✅ Complete |
| Tamil (Tanglish) | `ta` | ✅ Complete |
| Telugu (Tenglish) | `te` | ✅ Complete |
| Marathi | `mr` | ✅ Complete |
| Gujarati | `gu` | ✅ Complete |
| Kannada | `kn` | ✅ Complete |
| Malayalam | `ml` | ✅ Complete |
| Odia | `od` | ✅ Complete |
| Assamese | `as` | ✅ Complete |
| Bengali (Banglish) | `bn` | ✅ Complete |
| Punjabi | `pa` | ✅ Complete |

Translation system: `lib/i18n/translations.ts` with `useTranslation` hook

## Key Components 🧩

### EtherealShadow
Animated background with SVG filters and Framer Motion animations. Used in dashboard layout.

### ShaderBackground
WebGL2-powered animated grid mesh with scrolling lines and vignette effects.

### FeatureHighlight
Reusable animated component for displaying features with icon, title, and descriptions.

### GlassAccountSettingsCard
Premium glass morphism effect settings card with animations and responsive grid.

### TherapistDirectoryCard
Professional therapist cards with ratings, specialties, and booking capabilities.

### LiveChatRoom
Real-time chat powered by Supabase Realtime with message history and online status.

## Database Schema 🗄️

### Key Tables
- **chat_messages** - Real-time community chat and DMs
- **profiles** - User data and preferences
- **journal_entries** - User journals with AI analysis
- **mood_entries** - Mood tracking history
- **achievements** - User badges and milestones
- **therapist_directory** - Crisis support resources

All tables include RLS (Row Level Security) policies in `lib/security/rls-policies.sql.ts`

## API Integration 🔌

### AI Features (Claude API via OpenRouter)
- Journal analysis and insights
- CBT technique recommendations
- Dream interpretation
- Growth tracking

Endpoints:
- `POST /api/ai/journal` - Analyze journal entries
- `POST /api/ai/cbt` - CBT intervention suggestions
- `POST /api/ai/dream` - Dream analysis
- `POST /api/ai/insights` - User insights generation

## Security 🔐

- Single Sign-On with Supabase Auth
- Row Level Security (RLS) on all database tables
- Input validation and sanitization
- Rate limiting on API endpoints
- Encrypted user data
- Admin authentication panel

See `lib/security/` for detailed security implementations.

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Use TypeScript for all new code
- Follow shadcn/ui component patterns
- Use Tailwind CSS for styling
- Add Framer Motion for animations
- Update translations in `lib/i18n/translations.ts`
- Test components thoroughly

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

For issues, questions, or feedback:
- Open an issue on GitHub
- Contact: [your-email]
- Crisis Support: Emergency numbers available on the crisis page

## Acknowledgments 🙏

Built with ❤️ for mental health accessibility in India.

- shadcn/ui for beautiful components
- Supabase for backend infrastructure
- Framer Motion for smooth animations
- Claude AI for intelligent insights
- The open-source community

---

**AntarYatra** - *Journey Within* 🌟
