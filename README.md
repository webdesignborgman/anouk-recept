# 🥕 Anouk's Recipe Collection

Een persoonlijke recepten-app gebouwd voor Anouk 🧡.  
Hier kan zij haar favoriete recepten (PDF of afbeelding) uploaden, beheren en snel terugvinden via haar telefoon of desktop.

---

## ✨ Features

- ✅ Google Login (alleen via Gmail account)
- ✅ Upload van PDF of Afbeeldingen
- ✅ Categorieën: Ontbijt, Lunch, Diner, Tussendoor, Extra informatie
- ✅ Eigen dashboard met overzicht van recepten
- ✅ Recept detailpagina (met zoombare image of PDF link)
- ✅ Delete functionaliteit met confirm + Firestore & Storage cleanup
- ✅ Mobile friendly & responsive
- ✅ Toast notifications voor feedback

---

## 🚀 Technologieën

| Frontend | Backend | Database/Storage |
|---|---|---|
| Next.js 15 | Firebase Authentication | Firestore Database |
| Tailwind CSS | Firebase Storage | Google Cloud |
| Lucide-react (icons) |  |  |

---

## ✅ Installatie lokaal

1. **Clone repository**

```bash
git clone https://github.com/webdesignborgman/anouk-recept.git
cd anouk-recept
```

2. **.env.local aanmaken**

Maak een `.env.local` bestand aan en vul je Firebase-configuratie in:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

> ✅ Let op: deze `.env.local` staat in `.gitignore` en push je dus **niet** mee naar GitHub.

3. **Dependencies installeren**

```bash
npm install
```

4. **Start de dev server**

```bash
npm run dev
```

---

## 🛠️ Firebase Setup

- ✅ Firestore: Collection `recipes`
- ✅ Storage: Uploads gaan naar `recipes/{userId}/...`
- ✅ Auth: Alleen Google Sign-in toegestaan (alle andere login-methodes uitzetten)

---

## 📂 Project structuur

```
├── app/
│   ├── dashboard/
│   ├── login/
│   ├── signup/
│   ├── upload/
│   ├── recipes/[id]/
│   └── page.tsx (Home)
├── components/
├── public/
├── firebase.ts
├── tailwind.config.ts
├── next.config.js
├── .env.local
└── README.md
```

---

## ✅ Todo voor later (wishlist)

- [ ] Zoeken op naam
- [ ] Filteren per categorie
- [ ] Recepten kunnen bewerken (edit functie)
- [ ] Extra tagging-systeem
- [ ] UI polish met betere transitions

---

## ❤️ Gemaakt door

Borgman Webdesign  
[https://github.com/webdesignborgman](https://github.com/webdesignborgman)

---