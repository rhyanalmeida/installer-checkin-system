# 🗄️ Supabase Database Setup Guide

## 📋 **Step-by-Step Setup Instructions**

### 1. **Access Your Supabase Project**
- Go to: https://app.supabase.com/project/pwdwhcdzhubbmlsfbzw
- Sign in with your credentials

### 2. **Open SQL Editor**
- In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
- Click **"New query"** to create a new SQL script

### 3. **Copy and Paste the Setup SQL**
Copy the entire contents of `supabase/setup.sql` and paste it into the SQL Editor.

### 4. **Run the SQL Script**
- Click the **"Run"** button (or press Ctrl+Enter)
- This will create all the necessary tables and data

### 5. **Verify Setup**
After running the SQL, you should see:
- ✅ **4 tables created:** `installers`, `checkins`, `checklist_items`, `email_templates`
- ✅ **17 checklist items** inserted with your specific requirements
- ✅ **Indexes created** for better performance
- ✅ **Row Level Security (RLS)** enabled
- ✅ **Email template** created

### 6. **Test the Connection**
Your app should now be able to:
- ✅ Connect to the database
- ✅ Create new check-ins
- ✅ Save checklist progress
- ✅ Send email notifications (when Edge Function is set up)

## 🔧 **What Gets Created**

### **Tables:**
1. **`installers`** - Store installer information
2. **`checkins`** - Store check-in sessions and progress
3. **`checklist_items`** - Your 17 specific checklist items
4. **`email_templates`** - Email notification templates

### **Your 17 Checklist Items:**
1. Check materials in the warehouse with photos and videos
2. Scan QR code and change the status of any moved materials
3. Record checking materials with the client in the van and confirm payment method
4. Record the entire house, including the basement, before placing the drop cloths
5. Show drop cloths placed and furniture covered with plastic, if necessary
6. Videos of water temperature test and 5-gallon bucket
7. Video after demolition
8. Photos and videos before closing the walls with plywood
9. Photos and videos before closing the walls with acrylic
10. Photos and videos of new drain and valve
11. Client pointing out where they want the accessories
12. Video showing silicone application, slowly
13. Final water and bucket test
14. Show the completed work to the client
15. Photos of clean bathroom, hallway, and driveway
16. COC (Certificate of Completion)
17. Flush shower valve

## 🚀 **Next Steps After Database Setup**

1. **Test your app** at: https://wonderful-conkies-bba66d.netlify.app
2. **Try creating a check-in** to verify database connectivity
3. **Set up email notifications** (optional - requires Edge Function deployment)

## 🔒 **Security Features**

- **Row Level Security (RLS)** enabled on all tables
- **Proper indexing** for fast queries
- **Input validation** and sanitization
- **Automatic timestamps** for audit trails

## 📞 **Need Help?**

If you encounter any issues:
1. Check the Supabase logs in your dashboard
2. Verify your environment variables are correct
3. Test the connection in your app

---

**🎉 Your Supabase database is now ready to power your installer check-in system!** 