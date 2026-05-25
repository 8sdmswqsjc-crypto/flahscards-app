# 📁 Projektin Rakenne

Näin projekti näyttää loukkaavasti:

```
flashcards-app/
├── app/                          # Next.js app-kansio
│   ├── api/
│   │   └── generate-cards/
│   │       └── route.js          # Claude API -kutsu
│   ├── study/
│   │   └── [id]/
│   │       └── page.js           # Harjoittelu-sivu
│   ├── layout.js                 # Root layout
│   ├── globals.css               # Globaalit tyylit
│   └── page.js                   # Home-sivu
│
├── lib/
│   └── supabase.js               # Supabase client + apufunktiot
│
├── public/                       # Staattiset tiedostot (jos tarvitaan)
│
├── .env.local                    # Environment-muuttujat (ÄLÄÄ COMMITOI!)
├── .gitignore                    # Git-ignorat
├── next.config.js                # Next.js-config
├── tailwind.config.js            # Tailwind-config
├── postcss.config.js             # PostCSS-config
├── package.json                  # Dependencies ja scripts
│
├── supabase-schema.sql           # Tietokanta SQL-schema
├── README.md                     # Pääohjeet
├── QUICKSTART.md                 # Nopea aloitus
├── DEPLOYMENT.md                 # Vercel-ohjeistus
└── PROJECT-STRUCTURE.md          # Tämä tiedosto

```

## 🔑 Tärkeimmät Tiedostot

### Frontend (React/Next.js)

#### `app/page.js` — **Home-sivu**
- Näyttää kaikki korttisettit
- "Uusi setti" -napin
- API-avaimen asetuksen
- Korttisettien poistamisen

**Mitä tarvitset tietää:**
- `useState` hallinnoi UI-tilaa
- `useEffect` lataa korttisettit Supabasesta
- Näyttää korttisettien grid-layoutin

#### `app/study/[id]/page.js` — **Harjoittelu-sivu**
- Näyttää yksittäiset kortit
- Flashcard flip-animaatiot
- Monivalinta-valinnat
- Edistymisen seuranta

**Mitä tarvitset tietää:**
- `useParams()` saa korttisetin ID:n
- Lataa kortit tyypin perusteella
- Animaatiot CSS:llä (`transform`, `perspective`)

#### `app/api/generate-cards/route.js` — **Backend-API**
- Claude API -kutsut
- Salaa API-avaimet
- Palauttaa generoidut kortit JSON:na

**Miksi tämä tarvitaan:**
- Ei lähetetä API-avainta selaimesta
- Turvallisuus ja hiljaisuus

### Tietokanta (Supabase/PostgreSQL)

#### `supabase-schema.sql`
Luodaan nämä taulut:
- `sessions` — käyttäjä-istunnot
- `card_sets` — korttisettien metatiedot
- `flashcards` — flashcard-kortit
- `multiple_choice` — monivalinta-kortit
- `api_keys` — salatut API-avaimet

**Rakenne:**
```sql
sessions
  ├── id (UUID)
  ├── session_token (string)
  └── created_at

card_sets
  ├── id
  ├── session_id (foreign key)
  ├── name
  ├── type ('flashcard' | 'multiple_choice')
  └── created_at

flashcards
  ├── id
  ├── card_set_id (foreign key)
  ├── question
  ├── answer
  ├── difficulty (1-3)
  └── background_index (0-4)

multiple_choice
  ├── id
  ├── card_set_id (foreign key)
  ├── question
  ├── correct_answer
  ├── option_b, option_c, option_d
  ├── explanation
  ├── difficulty
  └── background_index
```

### Konfiguraatiot

#### `next.config.js`
- Next.js asetukset
- Build-optimoinnit

#### `tailwind.config.js`
- Tailwind CSS -konfiguraatio
- Custom värit ja teemat

#### `package.json`
- Npm-pakettien riippuvuudet
- Scripts (dev, build, start)

---

## 🔄 Data Flow

```
User clicks "Uusi setti"
    ↓
Form: topic + numCards
    ↓
POST /api/generate-cards
    ↓
Backend: Call Claude API
    ↓
Claude returns JSON cards
    ↓
Save to Supabase
    ↓
Show in Home-sivu
    ↓
User clicks "Harjoittele"
    ↓
Load from Supabase
    ↓
Show Study-sivu
    ↓
User answers questions
    ↓
Update UI + stats
```

---

## 📝 Editointi & Laajentaminen

### Värien muuttaminen
- `app/page.js` → `backgrounds` array
- `app/study/[id]/page.js` → `backgrounds` array

### Uusien ominaisuuksien lisääminen

**1. Uusi API-kutsu:**
```
app/api/[feature]/route.js
```

**2. Uusi sivu:**
```
app/[feature]/page.js
```

**3. Uusi tietokanta-taulu:**
- Aja SQL `supabase-schema.sql`:ssa
- Päivitä `lib/supabase.js` apufunktioit

### Tyylin muuttaminen
- Inline CSS: Muuta `<style>` tagit sivuilla
- Tailwind: Muuta `tailwind.config.js`

---

## 🚀 Deployment

1. **Lokal testaus:** `npm run dev`
2. **Build:** `npm run build`
3. **Tuotanto:** Vercelissa automaattinen (git push)

---

## 🔐 Salaisuudet

Nämä **eivät saa** mennä GitHubiin:
- `.env.local` (lisätty `.gitignore`:ssa)
- API-avaimet
- Salasanat

Vercelissa säilytä environment-muuttujissa.

---

## 📚 Lukemista

- [Next.js docs](https://nextjs.org)
- [Supabase docs](https://supabase.com/docs)
- [React hooks](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com)

---

**Mallia? Katso koodia kommenteissa! 💬**
