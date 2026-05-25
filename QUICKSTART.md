# 🚀 Quick Start - Pääsy alkuun 5 minuutissa

Seuraa nämä vaiheet päästäksesi alkuun nopeasti.

## Vaihe 1: Tarvikkeet (2 min)

Hanki nämä API-avaimet:

### Anthropic API Key (AI korttien luomiseen)
1. Mene https://console.anthropic.com
2. Klikkaa "API Keys"
3. Klikkaa "Create Key"
4. Kopioi avain (näkyy vain kerran!)
5. **Tallenna turvallisesti** ⚠️

### Supabase (Tietokanta - jo luotu!)
URL: `https://vhwcxmhkgmqknnuiqbqw.supabase.co`
Key: `sb_publishable_7_dwxEWsJEM6WgpQjp8FUQ_BOtnINXm`

✅ **Näillä pääset alkuun!**

---

## Vaihe 2: Paikallinen testaus (2 min)

Jos haluat testata ensin omalla koneella:

```bash
# 1. Asenna dependencies
npm install

# 2. Käynnistä dev-palvelin
npm run dev

# 3. Avaa selaimessa
# http://localhost:3000
```

Sovellus pyytää Anthropic API-avaimen - liitä se.

✅ **Valmis! Testaa lokaalisti.**

---

## Vaihe 3: Live Verceliin (3 min)

Nyt laita se Verceliin jotta perheen kanssa voi käyttää:

### 1. GitHub
```bash
git init
git add .
git commit -m "Flashcards app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashcards.git
git push -u origin main
```

⚠️ Korvaa `YOUR_USERNAME` omalla GitHub-käyttäjätunnuksellasi.

### 2. Vercel
1. Mene https://vercel.com/new
2. Kirjaudu GitHub:lla
3. Valitse repositorio `flashcards`
4. Klikkaa "Continue"
5. Lisää environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://vhwcxmhkgmqknnuiqbqw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_7_dwxEWsJEM6WgpQjp8FUQ_BOtnINXm
   NEXT_PUBLIC_ANTHROPIC_API_KEY = (liitä Anthropic API key)
   ```
6. Klikkaa "Deploy"

**Odota 3-5 min...**

✅ **Valmista!** Saat linkin kuten:
```
https://flashcards-xyz.vercel.app
```

---

## 🎯 Käyttö

### Ensimmäinen käyttö
1. Avaa sovellus linkistä
2. Liitä Anthropic API-avain (jos pyytää)
3. Klikkaa "Uusi setti"
4. Kirjoita aihealue (esim. "Portugali")
5. Valitse korttien tyyppi ja määrä
6. Klikkaa "Luo kortit" ✨

### Harjoittelu
- Klikkaa "Harjoittele"
- **Flashcard:** Klikkaa nähdäksesi vastauksen
- **Monivalinta:** Valitse oikea vastaus

### Jakaminen
- **Sama linkki kaikille** → Kaikki näkevät samat setit
- Jaa linkki perheen kanssa
- Kaikki voivat luoda uusia setejä

---

## 🔍 Troubleshooting

| Ongelma | Ratkaisu |
|---------|----------|
| "API key required" | Liitä Anthropic API-avain |
| Kortit eivät näy | Odota 5-10 sec, päivitä selain |
| Verkkovirhe | Tarkista internet-yhteys |
| Build epäonnistui | Tarkista env-muuttujat |

---

## 📞 Apua?

- Lue `README.md` pidempi ohjeille
- Lue `DEPLOYMENT.md` deployment-asioihin
- Tarkista Vercel logs (klikkaa deployment)
- Tarkista DevTools (F12 → Console)

---

**Onnittelut! 🎉 Sinulla on nyt toimiva flashcard-sovellus!**

Seuraavaksi:
- Jaa linkki perheelle
- Luo oppimateriaaleja
- Oppivat yhdessä! 📚
