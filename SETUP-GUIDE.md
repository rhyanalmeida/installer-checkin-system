# 🚀 Quick Supabase Setup Guide

## Step 1: Create Free Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (free)
4. Create a new organization

## Step 2: Create Your Project
1. Click "New Project"
2. Choose your organization
3. Enter project name: `installer-checkin`
4. Enter database password (save this!)
5. Choose region closest to you
6. Click "Create new project"

## Step 3: Get Your Credentials
1. Go to Settings → API
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Anon Key** (starts with `eyJ`)

## Step 4: Set Up Environment Variables
Create a `.env.local` file in your project:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Set Up Database
1. Go to SQL Editor in Supabase
2. Copy and paste the contents of `supabase/setup.sql`
3. Click "Run" to create tables

## Step 6: Deploy Email Function (Optional)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Deploy the email function
supabase functions deploy send-completion-email
```

## ✅ That's it! Your app will now work with a real database.

### 🔒 **Security Benefits:**
- Your data is private and secure
- No sensitive information exposed
- You control access completely
- Automatic backups included

### 💰 **Cost:**
- **FREE** for your use case
- No credit card required
- Generous limits (500MB database, 50K users/month)

### 🎯 **Next Steps:**
1. Follow the setup guide above
2. Update your `.env.local` file
3. Deploy your app to Netlify
4. Test the full functionality

**Need help?** The Supabase community is very helpful and their documentation is excellent! 