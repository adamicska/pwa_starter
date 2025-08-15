# PWA Next.js Boilerplate

A modern, production-ready Progressive Web App (PWA) boilerplate built with Next.js 15, TypeScript, Tailwind CSS v4, and Skeleton UI design system. This boilerplate provides everything you need to build fast, reliable, and engaging web applications with native-like features.

## ✨ Features

### 🚀 Core Technologies
- **Next.js 15** with App Router and React Server Components
- **TypeScript** with strict mode for enhanced type safety
- **Tailwind CSS v4** with CSS variables and modern styling
- **Skeleton UI** design system for beautiful, consistent components

### 📱 Progressive Web App
- **Service Worker** with advanced caching strategies
- **Offline Support** with background sync capabilities
- **App Install Prompt** with smart user experience
- **Push Notifications** with Web Push API integration
- **Network Status Detection** with offline indicators

### 🔐 Authentication
- **Supabase Auth** integration with email/password and OAuth
- **Protected Routes** with middleware-based authentication
- **User Management** with profile and session handling
- **Social Login** support (Google, GitHub, etc.)

### 🎨 UI Components
- **Radix UI** primitives for accessibility
- **Lucide React** icons for consistent iconography
- **Theme Support** with dark/light mode toggle
- **Responsive Design** mobile-first approach
- **Component Library** with 20+ pre-built components

### 🛠️ Developer Experience
- **ESLint** and **Prettier** for code quality
- **Husky** and **lint-staged** for pre-commit hooks
- **TypeScript** strict mode with comprehensive types
- **Storybook** for component development and testing
- **Vitest** for unit and component testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone or use this boilerplate**
   ```bash
   git clone <your-repo-url>
   cd pwa-nextjs-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME="PWA Next.js Boilerplate"
   
   # Push Notifications (optional)
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard
│   ├── offline/           # Offline fallback page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── pwa/              # PWA-specific components
│   ├── shared/           # Shared components
│   └── ui/               # UI component library
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   ├── sw.js            # Service worker
│   └── icons/           # App icons
├── styles/               # Additional styles
├── types/                # TypeScript type definitions
└── stories/              # Storybook stories
```

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Set up authentication providers in your Supabase dashboard
4. Configure RLS policies for your tables

### PWA Configuration

The PWA is configured through:
- **manifest.json** - App metadata and icons
- **service worker** - Caching and offline functionality
- **PWA components** - Install prompt and notifications

### Push Notifications Setup

1. Generate VAPID keys:
   ```bash
   npx web-push generate-vapid-keys
   ```
2. Add keys to your environment variables
3. Configure notification permissions in the app

## 🎨 Customization

### Theming

The app uses CSS variables for theming. Customize colors in `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... more variables */
}
```

### Components

All UI components are in `components/ui/` and built with:
- Tailwind CSS for styling
- Radix UI for accessibility
- TypeScript for type safety

### Adding New Features

1. Create components in appropriate directories
2. Add routes in the `app/` directory
3. Update types in `types/` directory
4. Add stories for Storybook testing

## 🧪 Testing

### Running Tests
```bash
# Unit tests with Vitest
npm run test

# Component tests with Storybook
npm run storybook

# E2E tests (if configured)
npm run test:e2e
```

### Testing Strategy
- **Unit Tests** - Business logic and utilities
- **Component Tests** - UI components with Storybook
- **Integration Tests** - API endpoints and database
- **E2E Tests** - User workflows and PWA features

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Other Platforms

The app works on any platform supporting Node.js:
- **Netlify** - Static site deployment
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment

### Environment Variables for Production

Ensure these are set in production:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

## 🔐 Security

### Best Practices Implemented

- **Row Level Security (RLS)** in Supabase
- **HTTPS-only** cookies and sessions
- **CSRF Protection** with Next.js built-ins
- **Input Validation** with TypeScript
- **Secure Headers** configured in next.config.ts

### Security Checklist

- [ ] Environment variables secured
- [ ] Database RLS policies configured
- [ ] HTTPS enabled in production
- [ ] Authentication flows tested
- [ ] API endpoints protected

## 📊 Performance

### Optimizations Included

- **Image Optimization** with Next.js Image component
- **Code Splitting** with dynamic imports
- **Service Worker Caching** for offline performance
- **CSS Optimization** with Tailwind CSS purging
- **Bundle Analysis** with built-in tools

### Performance Monitoring

Monitor your app's performance:
```bash
# Analyze bundle size
npm run analyze

# Lighthouse audit
npm run lighthouse

# Performance testing
npm run perf
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for new code
- Write tests for new features
- Update documentation as needed
- Use semantic commit messages

## � License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help

- Check the [documentation](./docs/)
- Search [existing issues](./issues)
- Join our [Discord community](./discord)
- Contact [support](./support)

### Common Issues

**Service Worker not updating**
- Clear browser cache and reinstall
- Check for console errors
- Verify service worker registration

**Supabase connection issues**
- Verify environment variables
- Check network connectivity
- Review Supabase dashboard logs

**Build errors**
- Clear `.next` directory
- Reinstall dependencies
- Check Node.js version compatibility

## 🎯 Roadmap

### Upcoming Features

- [ ] Internationalization (i18n) support
- [ ] Advanced caching strategies
- [ ] Real-time features with Supabase Realtime
- [ ] Enhanced offline capabilities
- [ ] Additional authentication providers
- [ ] Performance monitoring dashboard

### Version History

- **v1.0.0** - Initial release with core PWA features
- **v1.1.0** - Enhanced authentication and UI components
- **v1.2.0** - Storybook integration and testing setup

---

## 🙏 Acknowledgments

Built with these amazing technologies:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Radix UI](https://radix-ui.com/) - Accessible components
- [Skeleton UI](https://skeleton.dev/) - Design system

---

**Happy building! 🚀**
