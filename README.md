<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,12&height=160&section=header&text=Shaurya%20Physiotherapy%20Clinic&fontSize=32&fontColor=fff&animation=twinkling&fontAlignY=38&desc=Full-Stack%20Clinic%20Management%20System&descAlignY=58&descSize=15"/>

![Next.js](https://img.shields.io/badge/Next.js_14-000?style=for-the-badge&logo=nextdotjs)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)

</div>

---

## 🏥 About

A production-grade clinic management web application built for **Dr. Nivedita Shashikant Pingale, PT** — BPTh, MPT (KEM Hospital), Certified Nutritionist & Mulligan Practitioner, located in **New Panvel West**.

The system digitizes the full patient lifecycle — from appointment booking to treatment tracking — replacing manual registers with a secure, real-time platform.

---

## ✨ Features

| Module | Description |
|---|---|
| 🔐 **Staff Authentication** | Google Auth login with role-based access control |
| 📅 **Appointment Management** | Book, view, update, and cancel appointments |
| 🧑‍⚕️ **Patient Records** | Full patient profile with history and treatment logs |
| 💊 **Treatment Tracking** | Session-wise treatment notes and progress monitoring |
| 📊 **Admin Dashboard** | Overview of daily appointments, active patients, stats |
| 🔔 **Real-time Updates** | Firestore live sync across all modules |

---

## 🛠️ Tech Stack

```yaml
Frontend:   Next.js 14 (App Router) · TypeScript · Tailwind CSS
Backend:    Firebase (Firestore · Auth · Hosting)
Auth:       Google OAuth via Firebase Auth
Database:   Cloud Firestore (NoSQL real-time)
Deployment: Vercel (Frontend) · Firebase (Backend)
```

---

## 📁 Project Structure

```
shaurya-physio/
├── src/
│   ├── app/               # Next.js App Router pages
│   │   └── login/         # Auth pages
│   ├── components/        # Reusable UI components
│   │   └── ui/            # Base UI elements
│   ├── hooks/             # Custom React hooks
│   │   ├── useAppointments.ts
│   │   └── usePatients.ts
│   ├── lib/               # Core utilities
│   │   ├── firebase.ts    # Firebase config
│   │   ├── firestore.ts   # DB operations
│   │   └── auth-context.tsx
│   └── types/             # TypeScript interfaces
├── firestore.rules        # Security rules
├── firestore.indexes.json
└── firebase.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Firestore enabled
- Google OAuth configured in Firebase Auth

### Installation

```bash
# Clone the repo
git clone https://github.com/Swagat744/shaurya-physio.git
cd shaurya-physio

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Fill in your Firebase config values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Deploy Firestore Rules

```bash
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

---

## 🔒 Security

- All routes protected with Firebase Auth middleware
- Firestore security rules restrict data access by role
- `.env.local` excluded from version control
- Google OAuth for secure staff login

---

## 👨‍💻 Developer

Built by **[Swagat Patil](https://github.com/Swagat744)** — B.Tech IT @ VESIT Mumbai

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,12&height=80&section=footer"/>

</div>
