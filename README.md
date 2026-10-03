# Md. Ashraful Islam — Senior Graphic Designer Portfolio

A modern, responsive, high-performance portfolio website tailored for **Md. Ashraful Islam**, Senior Graphic Designer specializing in brand identity architecture, precision pre-press offset printing setup, commercial outdoor signage, and high-impact digital media.

Built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**, designed for effortless 1-click deployment on **GitHub** and **Netlify**.

---

## ✨ Key Features

- 🌓 **Dark & Light Mode**: Smooth theme toggle with system preference detection and `localStorage` persistence.
- 🖼️ **Interactive Project Galleries**: Filterable bento grid showcase (Signage & Outdoor, Brand Identity, Packaging & Offset, Social Media & Ads) with a full-featured keyboard-accessible modal lightbox.
- 📄 **Curriculum Vitae & Google Drive Download**:
  - Direct Google Drive download link for original CV files.
  - In-browser printable 2-page CV view matching official academic & professional credentials.
  - Interactive Drive link manager allowing you to update your URL anytime.
- 📬 **Working Contact Form with Notifications**:
  - Pre-configured with Netlify Forms (`data-netlify="true"`). When deployed on Netlify, form submissions automatically trigger instant email notifications to your inbox.
  - Direct `mailto:` client fallback option.
  - Quick action contact cards for direct Email, WhatsApp, Behance, and Facebook.
- 🎨 **Anti-AI Slop Design**: Follows strict design guidelines with editorial typography (`Syne` + `Plus Jakarta Sans`), 60-30-10 color discipline, unboxed metadata, and zero broken images.
- 🚀 **Netlify & GitHub Ready**: Includes `netlify.toml` and `public/_redirects` for zero-configuration SPA routing.

---

## 🚀 How to Deploy to GitHub & Netlify

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit of portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ashraful-portfolio.git
git push -u origin main
```

### 2. Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com) and log in.
2. Click **"Add new site"** → **"Import an existing project"** → Choose **GitHub**.
3. Select your repository (`ashraful-portfolio`).
4. Netlify will auto-detect the configuration from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy site"**!

### 3. Enable Email Notifications for Contact Form Submissions
1. In your Netlify Site dashboard, go to **Site settings** → **Forms**.
2. Under **Form notifications**, click **"Add notification"** → **Email notification**.
3. Set your email address (`milonpabna92@gmail.com`).
4. Every inquiry submitted through the portfolio contact form will now be emailed directly to you!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
