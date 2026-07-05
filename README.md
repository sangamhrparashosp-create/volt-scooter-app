# Volt — Monthly Scooter Rental App

A prototype rental app: users pay a refundable deposit, buy a monthly pass,
then unlock scooters with no further per-ride charge.

## Stack
- **Frontend**: React + Vite + Tailwind
- **Backend**: Firebase (Auth + Firestore) — no server to run yourself
- **Hosting**: Firebase Hosting (free Spark plan)
- **Payments**: mocked in `src/lib/payments.js` (simulated checkout, no real money moves)

## 1. Run it locally

```bash
npm install
npm run dev
```

It won't fully work yet — you need a Firebase project first (next step).

## 2. Create your free Firebase project

1. Go to https://console.firebase.google.com → **Add project** (free Spark plan, no credit card needed).
2. Inside the project: **Build → Authentication → Get started → Email/Password → Enable**.
3. **Build → Firestore Database → Create database → Start in production mode**.
4. **Project settings (gear icon) → General → Your apps → Add app → Web (</>)**.
   Copy the `firebaseConfig` object it shows you.
5. Paste those values into `src/firebase.js`, replacing the placeholders.

## 3. Deploy Firestore security rules

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # pick your project
firebase deploy --only firestore:rules
```

These rules stop a user from editing their own deposit/pass fields directly
in the browser console — read the comments in `firebase/firestore.rules`.

## 4. Seed a scooter (so Home isn't empty)

Easiest path: sign up in the app once, then in the Firebase console manually
set your own user's `role` field to `"admin"` in Firestore, then visit
`/admin` in the app to add scooters through the UI.

## 5. Deploy for free

```bash
npm run build
firebase deploy --only hosting
```

You'll get a live URL like `https://your-project.web.app` — free, HTTPS,
no server management.

## What's mocked vs. real

| Piece | Status |
|---|---|
| Auth, user profiles | Real (Firebase Auth + Firestore) |
| Deposit / pass / ride records | Real (Firestore) |
| Payment charging | **Mocked** — simulates success, no money moves |
| Scooter unlock | **Mocked** — flips a Firestore status field, no hardware call |
| Scooter location/battery | **Mocked** — set manually via Admin panel |

## Before handling real money

1. Replace `src/lib/payments.js` with a real Razorpay/Stripe checkout.
   Razorpay in India requires business KYC before it can accept live payments.
2. Move deposit/pass/refund logic (`src/lib/firestore.js`) into **Cloud
   Functions** so the client can never fake a payment success — right now a
   technical user could open devtools and call `payDeposit()` without really
   paying. Fine for a demo, not for production.
3. Real scooter unlock/location needs IoT hardware on the scooters
   themselves — that's a separate hardware integration project.

## Free-tier limits to know

- Firestore free tier: 50K reads / 20K writes per day — plenty for a pilot,
  not for scale.
- Firebase Hosting free tier: 10GB storage, 360MB/day transfer.
- No cost as long as you stay under these; Firebase will warn before
  charging anything (Spark plan has no billing attached by default).
