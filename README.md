# Flashcards - AI-Powered Learning App

Täydellinen web-sovellus flashcard- ja monivalinta-korttien luomiseen ja jakamiseen tekoälyn avulla.

## 🎯 Ominaisuudet

- ✨ **AI-pohjainen korttien luonti** - Claude generoi kortteja aihealueen perusteella
- 🎴 **Flashcard-kortit** - Perinteinen kysymys/vastaus-muoto
- ❓ **Monivalinta-kortit** - 4-vaihtoehtoiset kysymykset selityksillä
- 📊 **Edistymisen seuranta** - Näe kuinka monta korttia osattu
- 🔗 **Linkki-jako** - Jaa korttisettit muiden kanssa linkillä
- 🔐 **Turvallinen** - API-avaimet salataan, ei lähetetä clientiltä
- 📱 **Responsiivinen** - Toimii desktop- ja mobiililaitteilla

## 🚀 Asennus

### 1. Kloonaa tai lataa projekti

```bash
npm install
```

### 2. Supabase-setup

1. Mene https://supabase.com
2. Luo uusi projekti
3. Aja `supabase-schema.sql` SQL Editorissa
4. Kopioi Project URL ja API Key (anon)

### 3. Environment-muuttujat

Kopioi `.env.local` ja täytä:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 4. Kehityspalvelin

```bash
npm run dev
```

Avaa http://localhost:3000

## 🌐 Deployment (Vercel)

### 1. Push GitHubiin

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/flashcards.git
git push -u origin main
```

### 2. Vercelissa

1. Mene https://vercel.com
2. Kirjaudu GitHub:lla
3. Klikkaa "Import Project"
4. Valitse repositorio
5. Lisää environment variables
6. Klikkaa "Deploy"

**3-4 minuutissa sovellus on live!**

## 📖 Käyttö

### Home-sivu
- Näet kaikki luomasi korttisettit
- Klikkaa "Uusi setti" luodaksesi uuden
- Valitse korttien tyyppi (Flashcard tai Monivalinta)
- Anna aihealue ja määrä
- Claude generoi kortit automaattisesti

### Harjoittelu
- Klikkaa "Harjoittele" avataksesi setin
- **Flashcardissa:** Klikkaa korttia nähdäksesi vastauksen, klikkaa "Osattu" mukaansa
- **Monivalinnassa:** Valitse oikea vastaus, näet heti onko oikein
- Seuraa edistymistä tilastoissa

### Linkki-jako
- Kaikki samat käyttäjät (linkillä tulleet) näkevät samat setit
- Kaikki voivat luoda, muokata ja poistaa setejä
- Linkki jaetaan selaimen osoiterivillä

## 🔧 Teknologia

- **Frontend:** Next.js 14 + React 18
- **Tietokanta:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude API
- **Hosting:** Vercel
- **Styling:** Tailwind CSS + Custom CSS

## 📝 Muistiinpanot

- API-avaimet salataan selaimessa ennen tallennusta
- Jokainen käyttäjä saa oman session-tokenin
- Kortit tallennetaan Supabaseen ja synkronoituvat reaaliajassa
- Maksimi 4 käyttäjää sopii ilmaisen Supabase-tieriin

## 🐛 Troubleshooting

**"Missing Supabase environment variables"**
- Tarkista .env.local-tiedosto
- Varmista että muuttujat ovat oikein kopioitu

**"API error"**
- Tarkista Anthropic API-avain
- Varmista että Supabase on online

**Kortit eivät näy**
- Tarkista että tietokanta on alustettu
- Katso Supabase console → SQL Editor

## 📞 Tuki

Jos tulee ongelmia, tarkista:
1. Environment-muuttujat
2. Supabase-tietokantayhteys
3. API-avaimet
4. Selain-konsoli virheille (F12)

---

Hyvää oppimista! 🚀
