# 🎨 AI Artisan Assistant

**Transform your handcrafted products into compelling stories with AI-powered tools**

A comprehensive platform designed specifically for Indian artisans to enhance their products, generate marketing content, and create professional microsites with QR codes for easy sharing.

## 🌟 Features

### 🎯 **Studio Tools**
- **Image Enhancer**: AI-powered image enhancement for product photos
- **Voice Recording**: Speech-to-text for product descriptions
- **AI Content Generator**: Generate compelling product descriptions and marketing content
- **Smart Pricing Calculator**: AI-assisted pricing recommendations
- **QR Microsite Generator**: Create instant product webpages with QR codes
- **Festival Campaigns**: Generate seasonal marketing content

### 🛠️ **Technical Features**
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **Google Cloud AI** integration
- **Vercel** deployment
- **Responsive design** for mobile and desktop

## 🚀 Live Application

**Production URL**: https://aitrystt.vercel.app

## 📁 Project Structure

```
aitrystt/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── analyze-image/        # Image analysis
│   │   ├── calculate-pricing/    # Pricing calculations
│   │   ├── create-product/       # Product creation
│   │   ├── enhance-image/        # Image enhancement
│   │   ├── generate-content/     # Content generation
│   │   ├── generate-festival-campaign/ # Festival campaigns
│   │   ├── generate-platform-content/  # Platform content
│   │   ├── get-product/          # Product retrieval
│   │   ├── transcribe/           # Speech transcription
│   │   └── vertex-ai/            # Vertex AI integration
│   ├── dashboard/                # Dashboard page
│   ├── product/[id]/             # Dynamic product pages
│   ├── studio/                   # Studio tools
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
│   ├── app-shell.tsx             # Main app shell
│   ├── BackendProvider.tsx       # Backend context
│   ├── content-generator.tsx     # Content generation
│   ├── festival-campaigns.tsx    # Festival campaigns
│   ├── image-uploader.tsx        # Image upload
│   ├── pricing-calculator.tsx    # Pricing calculator
│   ├── qr-microsite.tsx          # QR microsite
│   ├── theme-provider.tsx        # Theme provider
│   └── voice-recorder.tsx        # Voice recording
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   ├── backend.ts                # Backend utilities
│   ├── firebase.ts               # Firebase utilities
│   ├── utils.ts                  # General utilities
│   ├── vertexAIServer.ts         # Vertex AI server
│   └── vertexImagenServer.ts     # Vertex Imagen server
├── public/                       # Static assets
├── scripts/                      # Build scripts
├── components.json               # shadcn/ui config
├── next.config.mjs               # Next.js config
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS config
├── service-account-key.json      # Google Cloud credentials
└── tsconfig.json                 # TypeScript config
```

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Project with AI services enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aitrystt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
   NEXT_PUBLIC_BASE_URL=https://aitrystt.vercel.app
   ```

4. **Add Google Cloud credentials**
   - Place your `service-account-key.json` in the root directory
   - Ensure the service account has access to:
     - Vertex AI
     - Cloud Storage
     - Firestore

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set environment variables in Vercel dashboard**
   - `GOOGLE_CLOUD_PROJECT_ID`
   - `GOOGLE_APPLICATION_CREDENTIALS` (upload service account key)

## 🎯 Usage

### For Artisans

1. **Upload Product Image**: Use the Image Enhancer to improve product photos
2. **Record Description**: Use Voice Recording to describe your product
3. **Generate Content**: Let AI create compelling product descriptions
4. **Calculate Pricing**: Get AI-assisted pricing recommendations
5. **Create QR Microsite**: Generate a shareable product webpage with QR code
6. **Festival Campaigns**: Create seasonal marketing content

### For Customers

1. **Scan QR Code**: Access product information instantly
2. **View Product Details**: See enhanced images and descriptions
3. **Contact Artisan**: Use WhatsApp integration for direct orders
4. **Share Products**: Share interesting products with others

## 🔧 API Endpoints

- `POST /api/analyze-image` - Analyze product images
- `POST /api/calculate-pricing` - Calculate product pricing
- `POST /api/create-product` - Create new product
- `POST /api/enhance-image` - Enhance product images
- `POST /api/generate-content` - Generate marketing content
- `POST /api/generate-festival-campaign` - Generate festival campaigns
- `POST /api/generate-platform-content` - Generate platform-specific content
- `GET /api/get-product` - Retrieve product information
- `POST /api/transcribe` - Transcribe voice recordings
- `POST /api/vertex-ai` - Vertex AI integration

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI Services**: Google Cloud Vertex AI, Vertex Imagen
- **Database**: Google Cloud Firestore
- **Storage**: Google Cloud Storage
- **Deployment**: Vercel
- **Authentication**: Google Cloud IAM

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices, making it easy for artisans to use on their smartphones.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for Indian Artisans**