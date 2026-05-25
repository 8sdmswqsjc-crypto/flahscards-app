# Deployment Verceliin

Tämä on helpoin tapa saada sovellus live ja jaettavaksi.

## 🚀 Vaihe 1: GitHub

### Jos et vielä ole GitHub-käyttäjä
1. Mene https://github.com/signup
2. Luo ilmainen tili

### Palauta projekti GitHubiin

```bash
# Navigoi projektin kansioon
cd flashcards-app

# Alusta Git (jos et ole vielä tehnyt)
git init

# Lisää kaikki tiedostot
git add .

# Tee ensimmäinen commit
git commit -m "Initial Flashcards app commit"

# Nimeä branch
git branch -M main

# Lisää remote (korvaa YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/flashcards-app.git

# Push GitHubiin
git push -u origin main
```

## 🎯 Vaihe 2: Vercel

### 1. Kirjaudu Verceliin
1. Mene https://vercel.com
2. Klikkaa "Sign Up"
3. Valitse "Continue with GitHub"
4. Hyväksy GitHub-autentikointi

### 2. Importoi projekti
1. Klikkaa "Import Project"
2. Liitä repository URL:
   ```
   https://github.com/YOUR_USERNAME/flashcards-app.git
   ```
3. Klikkaa "Import"

### 3. Konfiguroi environment-muuttujat

Vercel kysyy environment-muuttujat. Täytä seuraavat:

```
NEXT_PUBLIC_SUPABASE_URL = https://vhwcxmhkgmqknnuiqbqw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_7_dwxEWsJEM6WgpQjp8FUQ_BOtnINXm
NEXT_PUBLIC_ANTHROPIC_API_KEY = sk-ant-xxxxx... (sinun avaimesi)
```

⚠️ **TÄRKEÄ:** Näet nämä vain kerran! Kopioi oikeat arvot.

### 4. Deploy

1. Klikkaa "Deploy"
2. Odota 3-5 minuuttia
3. Kun näet "Congratulations", sovellus on live!

Saat linkin kuten:
```
https://flashcards-app-xyz.vercel.app
```

## 🔗 Jakaminen

**Linkin jakaminen:**
Jokainen joka avaa linkin:
- Saa omat korttisettit
- Voi luoda, muokata ja poistaa setejä
- Näkee muiden luomat setit

**Linkki on sama kaikille!** Voit jakaa sen:
- Perheelle
- Ystäville
- Sosiaalisen median kautta
- Sähköpostilla

## 📝 Päivitykset

Kun haluat päivittää sovellusta:

```bash
# Tee muutokset paikallisesti
# (muokkaa app/page.js, components, jne.)

# Commit ja push
git add .
git commit -m "Päivitys: [mitä muutit]"
git push

# Vercel päivittyy automaattisesti!
```

Deployment kestää noin 1-2 minuuttia.

## 🔐 Turvallisuus

- **API-avaimet:** Tallennetaan Vercel:n salaisen environment-muuttujan kautta
- **Frontend:** Ei koskaan näyttää salasia
- **Backend:** Ainostaan Next.js API-reitit näkevät API-avaimet
- **Tietokanta:** Supabase RLS (Row Level Security) suojaa dataa

## 🆘 Ongelmat

### "Build failed"
- Tarkista että .env.local on oikein
- Tarkista että kaikki tiedostot ovat olemassa
- Katso Vercel build log:it

### "Blank page"
- Avaa DevTools (F12) → Console
- Katso virheitä
- Tarkista Environment variables

### API-kutsut eivät toimi
- Tarkista että API-avaimet ovat oikein
- Tarkista Supabase-yhteys
- Katso Vercel Function logs

## 📊 Monitoring

Vercel-dashboardista voit nähdä:
- Deployment-historia
- Build-status
- Analytics (Page views, yms.)
- Errors ja logs

Käy osoitteessa: https://vercel.com/dashboard

---

**Valmista! 🎉** Sovellus on nyt live ja jaettavissa!
