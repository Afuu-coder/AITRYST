<div align="center">

# 🎨 AITRYST - AI-Powered Artisan Platform

### *Empowering Indian Artisans with AI Technology*

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://aitrystt-nine.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

**Transform handcrafted products into compelling stories with AI-powered tools**

A comprehensive platform designed for Indian artisans to showcase, market, and sell their handcrafted products globally using cutting-edge AI technology.

[🚀 Live Demo](https://aitrystt-nine.vercel.app) • [📚 Documentation](./END_TO_END_PROJECT_GUIDE.md) • [🎯 Features](#-features) • [💻 Setup](#-quick-start)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 **Studio Tools**

- 🖼️ **Image Enhancement**
  - AI-powered photo enhancement
  - Background removal
  - Quality improvement
  - Google Cloud Vision integration

- 🎤 **Voice Recording**
  - Speech-to-text conversion
  - Multi-language support
  - Real-time transcription
  - Audio playback

- ✍️ **AI Content Generation**
  - Product descriptions
  - Marketing copy
  - Social media posts
  - Email templates

</td>
<td width="50%">

### 🚀 **Advanced Features**

- 💰 **Smart Pricing**
  - Cost-plus pricing
  - Market-based pricing
  - Profit analysis
  - AI recommendations

- 📱 **QR Microsite Generator**
  - Instant product pages
  - QR code generation
  - WhatsApp integration
  - Vercel Blob storage

- 🎉 **Festival Campaigns**
  - Diwali, Holi, Eid campaigns
  - Social media content
  - Email campaigns
  - Visual suggestions

</td>
</tr>
</table>

### 🤖 **AI Assistance (7 Features)**

1. **Personalized Recommendations** - Get AI suggestions for product positioning
2. **Market Trends Analysis** - Understand current market demand
3. **Price Suggestions** - Optimal pricing recommendations
4. **Design Improvement Tips** - Enhance product aesthetics
5. **Social Media Captions** - Engaging posts for Instagram, Facebook
6. **Ad Campaign Content** - Complete marketing campaigns
7. **Speech-to-Text** - Convert voice descriptions to text

### 📊 **Dashboard Analytics**

- Real-time QR code tracking
- AI usage statistics
- Product performance metrics
- Engagement analytics
- Growth percentages
- Recent activity feed

---

## 🌐 Live Application

<div align="center">

### 🚀 **Production URL**

**[https://aitrystt-nine.vercel.app](https://aitrystt-nine.vercel.app)**

*Try it now - No signup required!*

</div>

---

## 🛠️ Quick Start

### Prerequisites

```bash
Node.js: 18.x or higher
npm: 9.x or higher
Vercel CLI: Latest
Google Cloud Account
Vercel Account
```

### Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/Afuu-coder/AITRYSTT.git
cd AITRYSTT
```

2️⃣ **Install dependencies**
```bash
npm install
```

3️⃣ **Set up environment variables**

Create `.env.local` file:
```env
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_CREDENTIALS={"type":"service_account",...}
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

4️⃣ **Run development server**
```bash
npm run dev
```

5️⃣ **Open in browser**
```
http://localhost:3000
```

### 📝 Detailed Setup Guide

For complete setup instructions, see:
- 📘 [Complete Setup Guide](./END_TO_END_PROJECT_GUIDE.md#-setup--installation)
- 🚀 [Deployment Guide](./DEPLOY_TO_VERCEL.md)
- 💾 [Blob Storage Setup](./SETUP_BLOB_STORAGE.md)
- 🔧 [Environment Variables](./ADD_ENV_VARS.md)

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Afuu-coder/AITRYSTT)

</div>

**Or deploy via CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Gemini AI API key | ✅ Yes |
| `GOOGLE_CLOUD_PROJECT_ID` | Google Cloud project ID | ✅ Yes |
| `GOOGLE_CLOUD_CREDENTIALS` | Service account JSON | ✅ Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | ✅ Yes |

### Post-Deployment Steps

1. **Create Vercel Blob Storage**
   - Go to Vercel Dashboard → Storage
   - Click "Create Database" → Select "Blob"
   - Token is automatically added

2. **Redeploy**
   ```bash
   vercel --prod
   ```

3. **Test all features**
   - QR Microsite generation
   - AI content generation
   - Image enhancement

📚 **Full deployment guide:** [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md)

---

## 🎯 Usage

### 👨‍🎨 For Artisans

**Step-by-Step Workflow:**

1. 📸 **Upload Product Image** → Use Image Enhancer for professional photos
2. 🎤 **Record Description** → Voice-to-text for easy product descriptions
3. ✍️ **Generate Content** → AI creates compelling marketing copy
4. 💰 **Calculate Pricing** → Get smart pricing recommendations
5. 📱 **Create QR Microsite** → Generate shareable product page with QR code
6. 🎉 **Festival Campaigns** → Create seasonal marketing content
7. 📊 **Track Performance** → Monitor analytics in dashboard

### 🛍️ For Customers

1. 📱 **Scan QR Code** → Access product information instantly
2. 👀 **View Details** → See enhanced images and descriptions
3. 💬 **Contact Artisan** → WhatsApp integration for direct orders
4. 🔗 **Share Products** → Share with friends and family

---

## 🔌 API Endpoints

### Core APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/create-product-vercel` | POST | Create QR microsite with Vercel Blob |
| `/api/generate-content` | POST | Generate AI marketing content |
| `/api/analyze-image` | POST | Analyze product images with Vision AI |
| `/api/enhance-image` | POST | Enhance product photos |
| `/api/calculate-pricing` | POST | Calculate smart pricing |
| `/api/generate-festival-campaign` | POST | Generate festival campaigns |
| `/api/transcribe` | POST | Transcribe voice recordings |
| `/api/get-product` | GET | Retrieve product information |

### AI Assistance APIs

| Endpoint | Description |
|----------|-------------|
| `/api/ai-assistance/personalized-recommendations` | Get personalized recommendations |
| `/api/ai-assistance/market-trends` | Analyze market trends |
| `/api/ai-assistance/design-improvements` | Get design tips |
| `/api/ai-assistance/social-media-captions` | Generate social media captions |
| `/api/ai-assistance/ad-campaigns` | Create ad campaign content |
| `/api/ai-assistance/speech-to-text` | Convert speech to text |

📚 **Full API documentation:** [END_TO_END_PROJECT_GUIDE.md](./END_TO_END_PROJECT_GUIDE.md#-api-documentation)

---

## 🎨 Tech Stack

<table>
<tr>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="48" height="48" alt="Next.js" />
<br><b>Next.js 14</b>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
<br><b>TypeScript</b>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
<br><b>React 18</b>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="48" height="48" alt="Tailwind" />
<br><b>TailwindCSS</b>
</td>
</tr>
<tr>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" width="48" height="48" alt="Google Cloud" />
<br><b>Google Cloud</b>
</td>
<td align="center" width="25%">
<img src="https://assets.vercel.com/image/upload/v1607554385/repositories/vercel/logo.png" width="48" height="48" alt="Vercel" />
<br><b>Vercel</b>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="48" height="48" alt="Node.js" />
<br><b>Node.js</b>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="48" height="48" alt="npm" />
<br><b>npm</b>
</td>
</tr>
</table>

### 🔧 Complete Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- TailwindCSS 3.4
- shadcn/ui components
- Lucide React icons

**Backend:**
- Next.js API Routes
- Node.js 18+
- Google Gemini AI
- Google Cloud Vision
- Vercel Blob Storage

**Deployment:**
- Vercel (Hosting)
- Vercel Edge Network (CDN)
- Vercel Blob (File Storage)

---

## 📁 Project Structure

```
aitrystt/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (22 endpoints)
│   │   ├── ai-assistance/        # AI assistance features
│   │   ├── analyze-image/        # Image analysis
│   │   ├── calculate-pricing/    # Pricing calculations
│   │   ├── create-product-vercel/ # QR microsite generation
│   │   ├── enhance-image/        # Image enhancement
│   │   ├── generate-content/     # Content generation
│   │   └── ...
│   ├── about/                    # About page
│   ├── dashboard/                # Analytics dashboard
│   ├── studio/                   # Studio tools
│   │   ├── ai-assistance/        # AI assistance hub
│   │   ├── ai-content/           # AI content generator
│   │   ├── festival-campaigns/   # Festival campaigns
│   │   ├── image-enhancer/       # Image enhancer
│   │   ├── qr-microsite/         # QR microsite generator
│   │   ├── smart-pricing/        # Smart pricing
│   │   └── voice-recording/      # Voice recording
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ui/                       # UI components (shadcn/ui)
│   └── ...
├── lib/                          # Utility libraries
├── public/                       # Static assets
├── .env.local                    # Environment variables (local)
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js config
├── package.json                  # Dependencies
├── README.md                     # This file
├── END_TO_END_PROJECT_GUIDE.md   # Complete documentation
├── PROJECT_FEATURES_DOCUMENTATION.md  # Feature details
├── DEPLOY_TO_VERCEL.md           # Deployment guide
└── tsconfig.json                 # TypeScript config
```

---

## 📱 Mobile Support

<div align="center">

### ✅ Fully Responsive Design

| Device | Status | Optimizations |
|--------|--------|---------------|
| 📱 Mobile | ✅ Optimized | Touch-friendly, mobile-first design |
| 📱 Tablet | ✅ Optimized | Adaptive layouts, optimized spacing |
| 💻 Desktop | ✅ Optimized | Full-featured, multi-column layouts |

*Works seamlessly on all devices - smartphones, tablets, and desktops*

</div>

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### 🔧 Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/Afuu-coder/AITRYSTT.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Wait for review

### 📋 Contribution Guidelines

- ✅ Follow TypeScript best practices
- ✅ Write meaningful commit messages
- ✅ Update documentation
- ✅ Test your changes thoroughly
- ✅ Respect the existing code style

---

## 📊 Project Statistics

<div align="center">

| Metric | Value |
|--------|-------|
| 📁 Total Files | 100+ |
| 📝 Lines of Code | 10,000+ |
| 🎨 Components | 50+ |
| 🔌 API Routes | 22 |
| 📄 Pages | 14+ |
| 🚀 Features | 10+ |
| ⚡ Build Time | ~2 min |
| 🎯 Lighthouse Score | 90+ |

</div>

---

## 📚 Documentation

- 📘 [Complete Project Guide](./END_TO_END_PROJECT_GUIDE.md) - Full end-to-end documentation
- 📗 [Features Documentation](./PROJECT_FEATURES_DOCUMENTATION.md) - Detailed feature breakdown
- 🚀 [Deployment Guide](./DEPLOY_TO_VERCEL.md) - Step-by-step deployment
- 💾 [Blob Storage Setup](./SETUP_BLOB_STORAGE.md) - Configure Vercel Blob
- 🔧 [Troubleshooting](./FIX_STUDIO_TOOLS.md) - Common issues and fixes
- ⚙️ [Environment Variables](./ADD_ENV_VARS.md) - Required environment variables

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

<div align="center">

### Need Help?

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/Afuu-coder/AITRYSTT/issues)
[![Documentation](https://img.shields.io/badge/Read-Documentation-blue?style=for-the-badge&logo=readthedocs)](./END_TO_END_PROJECT_GUIDE.md)

**For support and questions:**
- 🐛 [Create an issue](https://github.com/Afuu-coder/AITRYSTT/issues)
- 📧 Contact the development team
- 📚 Check the [documentation](./END_TO_END_PROJECT_GUIDE.md)

</div>

---

## 🌟 Star History

<div align="center">

If you find this project useful, please consider giving it a ⭐!

[![Star History Chart](https://api.star-history.com/svg?repos=Afuu-coder/AITRYSTT&type=Date)](https://star-history.com/#Afuu-coder/AITRYSTT&Date)

</div>

---

<div align="center">

### 🎨 **Built with ❤️ for Indian Artisans**

**Empowering traditional craftsmanship with modern AI technology**

[⬆ Back to Top](#-aitryst---ai-powered-artisan-platform)

</div>
