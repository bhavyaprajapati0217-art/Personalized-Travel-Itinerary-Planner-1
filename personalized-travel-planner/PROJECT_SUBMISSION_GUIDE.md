# 🎓 MySkillWallet Project Submission Guide
## Project: Personalized Travel Itinerary Planner
**Module:** Generative AI with Google Cloud

---

## 📌 Submission Overview
Your portal displays the following requirement:
> **"Please update the demo and GitHub links so that your mentor can review and evaluate your project."**

This guide provides the exact steps to:
1. Initialize and push your repository to **GitHub** (to get your **GitHub Link**).
2. Deploy the live web application on **Vercel** or **Render** (to get your **Demo Link**).
3. Update both links on the **MySkillWallet** dashboard.

---

## Step 1: Push Your Code to GitHub (To get your GitHub Link)

### 1.1 Create a new repository on GitHub
1. Open [GitHub](https://github.com/) and sign in.
2. Click the **`+`** icon in the top right corner and select **New repository**.
3. Name your repository: `personalized-travel-itinerary-planner`.
4. Choose **Public** (so your mentor can review your code).
5. Leave "Initialize this repository with a README" **unchecked** (we already have a complete README).
6. Click **Create repository**.
7. Copy the repository URL (e.g., `https://github.com/your-username/personalized-travel-itinerary-planner.git`).

### 1.2 Initialize Git and push from your machine
Open PowerShell or Command Prompt, navigate to the project directory, and run:

```bash
cd C:\Users\aruls\.gemini\antigravity\scratch\personalized-travel-planner

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: complete full-stack personalized travel planner with React, FastAPI, Gemini AI & Supabase"

# Rename branch to main
git branch -M main

# Add your GitHub remote repository (replace with your actual URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/personalized-travel-itinerary-planner.git

# Push to GitHub
git push -u origin main
```

Your **GitHub Link** is now ready:  
`https://github.com/<YOUR_GITHUB_USERNAME>/personalized-travel-itinerary-planner`

---

## Step 2: Deploy Your Live Demo (To get your Demo Link)

You can choose either of the following free and fast hosting methods:

### Option A: Deploy Frontend on Vercel (Recommended - Takes 2 Minutes)
1. Visit [vercel.com](https://vercel.com/) and sign in with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Select your `personalized-travel-itinerary-planner` repository.
4. Set the **Root Directory** to `frontend`.
5. Under Build Settings, ensure:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **Deploy**.
7. In ~60 seconds, Vercel will give you a live URL, for example:  
   `https://personalized-travel-planner.vercel.app`

### Option B: Deploy Standalone Live Preview on GitHub Pages (Instant - 1 Minute)
If you want an instant zero-configuration demo:
1. In your GitHub repository, go to **Settings** -> **Pages**.
2. Under "Build and deployment", select **Deploy from a branch**.
3. Point to the branch `main` and folder `/demo_preview`.
4. Click **Save**.
5. Your live demo URL will be:  
   `https://<YOUR_GITHUB_USERNAME>.github.io/personalized-travel-itinerary-planner/`

### Option C: Deploy Backend on Render (Optional for Full Cloud API)
1. Go to [render.com](https://render.com/) and click **New Web Service**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Environment: `Python 3`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add Environment Variables:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Key)*
   - `SUPABASE_URL`: *(Your Supabase Project URL)*
   - `SUPABASE_KEY`: *(Your Supabase Anon Key)*

---

## Step 3: Update the Links on MySkillWallet

1. Go to your **MySkillWallet Project Dashboard**:  
   [https://myskillwallet.ai/dashboard/skillwallet/module/generative-ai-with-google-cloud-6abce5e29b1bd523aabe38e0?moduleTab=microProjects](https://myskillwallet.ai/dashboard/skillwallet/module/generative-ai-with-google-cloud-6abce5e29b1bd523aabe38e0?moduleTab=microProjects)
2. Open the project **Personalized Travel Itinerary Planner**.
3. Click the button: **Add Github Link**
   - Paste your GitHub repository URL:  
     `https://github.com/<YOUR_GITHUB_USERNAME>/personalized-travel-itinerary-planner`
4. Click the button: **Add Demo Link**
   - Paste your live deployment URL:  
     `https://<YOUR_APP_NAME>.vercel.app` *(or GitHub Pages URL)*
5. Click **Save / Submit**.

---

## Step 4: Mentor Evaluation Checklist

Before submitting, verify that you can demonstrate all 3 core scenarios:
- [x] **Scenario 1 (Solo Weekend)**: Loaded Barcelona 2-day plan with Sagrada Família, Boqueria tapas, and Gothic Quarter.
- [x] **Scenario 2 (Couple Vacation)**: Loaded Amalfi Coast 3-day plan with Capri boat charter, clifftop dining, and Villa Cimbrone.
- [x] **Scenario 3 (Group Multi-Day)**: Loaded Kyoto & Osaka 4-day plan with bamboo hikes, Fushimi Inari, Dotonbori, and ICOCA pass.
- [x] **Smart Trip Builder**: Tested generating a custom destination with budget and pacing options.
- [x] **Regenerate Day**: Tested regenerating an individual day based on feedback.
- [x] **Swap Activity**: Tested clicking "Swap Activity" to replace a venue.
- [x] **Budget Tracker**: Confirmed live budget calculation across attractions, dining, accommodation, and transit.
