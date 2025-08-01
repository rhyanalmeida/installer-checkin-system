# Installer Check-in System

A comprehensive React application for professional installer check-ins with checklist functionality, email notifications, and printable tags.

## 🚀 Features

- **Multi-step Check-in Form** - Beautiful, responsive form with installer, location, and project information
- **17-Item Checklist** - Comprehensive installation checklist with progress tracking
- **Email Notifications** - Automatic completion emails with detailed project information
- **Printable Tags** - Professional QR-coded tags and certificates for completed installations
- **Dashboard** - Analytics and management interface for tracking installations
- **Real-time Updates** - Live progress tracking and status updates
- **Mobile Responsive** - Works seamlessly on all devices

## 🏗️ Architecture

The application uses a modern tech stack with React, TypeScript, Tailwind CSS, and Supabase for the backend.

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for beautiful UI
- **React Router** - Client-side routing
- **React Hook Form** - Form management with validation
- **React Query** - Data fetching and caching
- **Lucide React** - Beautiful icons

### Backend (Supabase)
- **PostgreSQL** - Reliable database
- **Row Level Security** - Data protection
- **Edge Functions** - Serverless functions for email notifications
- **Real-time Subscriptions** - Live updates

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Email service (Gmail, SendGrid, etc.)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rhyanalmeida/bitinstallercheckin.git
cd bitinstallercheckin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

Edit `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `supabase/setup.sql`

### 5. Deploy Edge Function

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your_project_ref
```

4. Deploy the email function:
```bash
supabase functions deploy send-completion-email
```

5. Set environment variables for the function:
```bash
supabase secrets set SMTP_HOST=smtp.gmail.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=your_email@gmail.com
supabase secrets set SMTP_PASS=your_app_password
supabase secrets set SMTP_FROM=your_email@gmail.com
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📱 Usage

### Check-in Process

1. **Installer Information** - Enter name, email, phone, and company
2. **Location Details** - Provide installation address and location
3. **Project Information** - Enter project name, client, and description
4. **Checklist Completion** - Complete all 17 required checklist items
5. **Email Notification** - Automatic completion email sent
6. **Print Tags** - Generate professional QR-coded tags and certificates

### Checklist Items

The system includes 17 comprehensive checklist items:

1. Safety Equipment Check
2. Site Assessment
3. Material Verification
4. Tool Inspection
5. Area Preparation
6. Installation Start
7. Quality Check 1
8. Installation Progress
9. Quality Check 2
10. Installation Completion
11. Final Quality Inspection
12. Testing & Calibration
13. Documentation
14. Client Walkthrough
15. Cleanup
16. Final Photos
17. Client Sign-off

## 🎨 Customization

### Adding New Checklist Items

Edit the checklist items in `src/pages/Checklist.tsx`:

```typescript
const defaultChecklistItems: ChecklistItem[] = [
  // Add your custom items here
  { id: '18', item_name: 'Custom Item', category: 'Custom', is_required: true, description: 'Description', sort_order: 18, created_at: '' },
]
```

### Customizing Email Templates

Modify the email template in `supabase/functions/send-completion-email/index.ts`:

```typescript
const emailContent = `
  // Your custom HTML email template
`
```

### Styling

The application uses Tailwind CSS. Customize colors and styles in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

### Other Platforms

The application can be deployed to any static hosting platform that supports React applications.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx     # Main layout component
│   └── ui/            # UI components
├── lib/               # Utilities and configurations
│   ├── supabase.ts    # Supabase client and types
│   └── utils.ts       # Utility functions
├── pages/             # Page components
│   ├── CheckinForm.tsx
│   ├── Checklist.tsx
│   ├── PrintTags.tsx
│   ├── Dashboard.tsx
│   └── NotFound.tsx
└── main.tsx          # Application entry point
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Input validation and sanitization
- HTTPS enforcement
- JWT token authentication
- Rate limiting on API endpoints

## 📊 Performance

- Lazy loading for routes
- React.memo for component optimization
- Image optimization
- Caching strategies
- CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

## 🔄 Updates

Stay updated with the latest features and improvements by following the repository and checking the releases page.

---

**Built with ❤️ using React, TypeScript, and Supabase** 