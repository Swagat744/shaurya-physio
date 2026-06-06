# Shaurya Physiotherapy Clinic — Setup Guide

## Project Overview
Full-stack clinic management system built with:
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase (Firestore + Authentication)
- **Hosting**: Firebase Hosting (static export)

---

## Firestore Database Structure

### Collection: `appointments`
```
appointments/
  {docId}/
    patientName: string        # Full name from booking form
    phone: string              # 10-digit mobile
    age: number
    problem: string            # Chief complaint
    preferredDate: string      # YYYY-MM-DD format
    preferredTime: string      # e.g. "5:00 PM"
    status: string             # "pending" | "confirmed" | "completed" | "cancelled"
    notes: string              # Optional staff notes
    patientId?: string         # Linked patient record (optional)
    createdAt: Timestamp
```

### Collection: `patients`
```
patients/
  {docId}/
    name: string
    phone: string
    age: number
    gender: string             # "Male" | "Female" | "Other"
    address?: string
    medicalHistory?: string
    createdAt: Timestamp
```

### Collection: `treatments`
```
treatments/
  {docId}/
    patientId: string          # Reference to patients/{id}
    patientName: string
    date: string               # YYYY-MM-DD
    diagnosis: string
    doctorNotes: string
    exercises: Array<{
      name: string
      sets?: string
      reps?: string
      duration?: string
      instructions?: string
    }>
    precautions: string
    nextVisit?: string         # YYYY-MM-DD
    createdAt: Timestamp
    updatedAt: Timestamp
```

---

## Step 1: Firebase Project Setup

1. Go to https://console.firebase.google.com
2. Click **Add project** → Name it (e.g. `shaurya-physio`)
3. Disable Google Analytics (optional)
4. Click **Create project**

### Enable Authentication
1. In Firebase console: **Authentication** → **Get started**
2. Under **Sign-in method** tab → Enable **Google**
3. Add your domain under **Authorized domains** (add `localhost` for development)

### Enable Firestore
1. **Firestore Database** → **Create database**
2. Choose **Production mode** (rules will be deployed separately)
3. Select a location (e.g. `asia-south1` npm run devfor Mumbai)

### Register Web App
1. **Project Settings** (gear icon) → **Your apps** → **Web** (</> icon)
2. Name it (e.g. `shaurya-web`)
3. Check **Also set up Firebase Hosting**
4. Copy the `firebaseConfig` object — you'll need these values

---

## Step 2: Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Firebase CLI: `npm install -g firebase-tools`

### Install dependencies
```bash
npm install
```

### Configure environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and fill in your Firebase config values:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaS...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...
```

### Run development server
```bash
npm run dev
```
Open http://localhost:3000

---

## Step 3: Deploy Firestore Security Rules

```bash
firebase login
firebase use --add   # Select your project
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

## Step 4: Build and Deploy to Firebase Hosting

```bash
npm run build        # Generates the "out/" static export
firebase deploy --only hosting
```

Or deploy everything at once:
```bash
firebase deploy
```

Your site will be live at: `https://your-project-id.web.app`

### Custom Domain (Optional)
In Firebase console → **Hosting** → **Add custom domain**

---

## Step 5: Configure Authorized Staff

Currently any Google account can log in. To restrict to specific emails:

**Option A — Firestore-based allowlist:**
Create a `allowedUsers` collection in Firestore with allowed email addresses,
then add a check in `src/app/dashboard/layout.tsx` to verify the email.

**Option B — Firebase Authentication rules:**
Add a custom claim `admin: true` to allowed users via Firebase Admin SDK
or the Firebase console, then verify `request.auth.token.admin == true` in
Firestore rules.

---

## WhatsApp Notifications

The current implementation provides a **click-to-send** link:
After booking, the receptionist sees a "Send WhatsApp Confirmation" button
that opens WhatsApp Web/App with a pre-filled message.

### For fully automated sending (Twilio):
1. Create a Twilio account at https://twilio.com
2. Enable the WhatsApp Sandbox or purchase a WhatsApp-enabled number
3. Install Twilio SDK: `npm install twilio`
4. Create a Next.js API route at `src/app/api/notify/route.ts`
5. Add environment variables: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
   `TWILIO_WHATSAPP_FROM`
6. Uncomment and use `sendWhatsAppViaTwilio()` from `src/lib/whatsapp.ts`

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + Auth provider
│   ├── page.tsx                # Home page
│   ├── about/page.tsx          # About Doctor page
│   ├── services/page.tsx       # Services page
│   ├── book/page.tsx           # Book Appointment page
│   ├── contact/page.tsx        # Contact page
│   ├── login/page.tsx          # Staff login
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout + auth guard
│       ├── page.tsx            # Dashboard overview
│       ├── patients/page.tsx   # Patient management
│       ├── appointments/page.tsx # Appointment management
│       └── treatments/page.tsx # Treatment records
├── components/
│   ├── public/
│   │   ├── Navbar.tsx          # Public navigation
│   │   └── Footer.tsx          # Public footer
│   └── dashboard/
│       └── Sidebar.tsx         # Dashboard sidebar
└── lib/
    ├── firebase.ts             # Firebase app init
    ├── firestore.ts            # All Firestore operations
    ├── auth-context.tsx        # Auth context provider
    ├── whatsapp.ts             # WhatsApp notification utility
    └── utils.ts                # cn() helper
```
