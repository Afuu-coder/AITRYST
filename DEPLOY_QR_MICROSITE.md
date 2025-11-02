# 🚀 Deploy to Vercel with QR Microsite - Complete Guide

## ✅ Pre-Deployment Checklist

Your project is ready! Here's what's configured:

- ✅ **@vercel/blob** installed in package.json
- ✅ **QR Microsite** using `/api/create-product-vercel`
- ✅ **Vercel Account** ready: `afjalambani-7845`
- ✅ **All features** tested and working
- ✅ **Navigation** clean and functional

---

## 📋 Step-by-Step Deployment

### **Step 1: Deploy to Vercel**

Open Command Prompt in your project folder:

```cmd
cd d:\aitrystt\aitrystt
vercel
```

### **Follow the Prompts:**

```
? Set up and deploy "d:\aitrystt\aitrystt"? 
→ Yes

? Which scope do you want to deploy to? 
→ afjalambani-7845

? Link to existing project? 
→ No

? What's your project's name? 
→ aitrystt

? In which directory is your code located? 
→ ./

? Want to override the settings? 
→ No
```

**Wait for deployment (2-3 minutes)...**

You'll get:
```
🔍  Inspect: https://vercel.com/afjalambani-7845/aitrystt/xxxxx
✅  Production: https://aitrystt.vercel.app
```

---

### **Step 2: Create Vercel Blob Storage (CRITICAL FOR QR MICROSITE)**

This is **REQUIRED** for QR Microsite to work!

#### **Option A: Via Vercel Dashboard (Recommended)**

1. Go to: https://vercel.com/afjalambani-7845/aitrystt

2. Click **"Storage"** tab (top menu)

3. Click **"Create Database"**

4. Select **"Blob"**

5. Click **"Create"**

6. **Done!** Vercel automatically adds `BLOB_READ_WRITE_TOKEN` to your environment variables

#### **Option B: Via CLI**

```cmd
vercel env add BLOB_READ_WRITE_TOKEN
```

Then paste the token from your Blob store.

---

### **Step 3: Redeploy with Blob Storage**

After creating Blob storage, redeploy:

```cmd
vercel --prod
```

This ensures the `BLOB_READ_WRITE_TOKEN` is available in production.

---

### **Step 4: Verify QR Microsite Works**

1. Go to: **https://aitrystt.vercel.app/studio/qr-microsite**

2. Fill in the form:
   ```
   Product Name: Test Product
   Description: Beautiful handcrafted item
   Price: 1000
   WhatsApp: +91 9876543210
   Upload Image: (optional)
   ```

3. Click **"Generate QR Microsite"**

4. You should get:
   - ✅ **QR Code URL** (hosted on Vercel Blob)
   - ✅ **Microsite URL** (hosted on Vercel Blob)
   - ✅ **WhatsApp Link** (working)

---

## 🎯 Expected URLs After Deployment

### **Your Live App:**
```
Main App: https://aitrystt.vercel.app
About: https://aitrystt.vercel.app/about
Dashboard: https://aitrystt.vercel.app/dashboard
Studio: https://aitrystt.vercel.app/studio
QR Microsite: https://aitrystt.vercel.app/studio/qr-microsite
AI Assistance: https://aitrystt.vercel.app/studio/ai-assistance
```

### **QR Microsite Generated URLs:**
```
QR Code: https://xxxxx.public.blob.vercel-storage.com/qr-codes/abc123.png
Microsite: https://xxxxx.public.blob.vercel-storage.com/microsites/abc123.html
Product Image: https://xxxxx.public.blob.vercel-storage.com/product-images/abc123.jpg
```

---

## 🔧 Environment Variables

After creating Blob storage, verify in Vercel Dashboard:

**Go to:** https://vercel.com/afjalambani-7845/aitrystt/settings/environment-variables

**You should see:**
```
BLOB_READ_WRITE_TOKEN = vercel_blob_rw_XXXXXXXXXXXXXXXXX
```

**Status:** Production ✅

---

## 🆘 Troubleshooting QR Microsite

### **Issue 1: "Missing BLOB_READ_WRITE_TOKEN" Error**

**Cause:** Blob storage not created

**Solution:**
1. Go to Storage tab in Vercel Dashboard
2. Create Blob database
3. Redeploy: `vercel --prod`

---

### **Issue 2: "Failed to upload to Blob" Error**

**Cause:** Token not set or invalid

**Solution:**
1. Check environment variables in Vercel Dashboard
2. Recreate Blob storage if needed
3. Redeploy: `vercel --prod`

---

### **Issue 3: QR Code Not Generating**

**Cause:** Blob storage not connected

**Solution:**
1. Verify Blob storage exists in Storage tab
2. Check `BLOB_READ_WRITE_TOKEN` is set
3. Redeploy: `vercel --prod`
4. Clear browser cache and try again

---

### **Issue 4: Microsite URL Not Working**

**Cause:** HTML file not uploaded to Blob

**Solution:**
1. Check Vercel logs: `vercel logs`
2. Verify Blob storage has files in `microsites/` folder
3. Try generating a new QR code

---

## 📊 How QR Microsite Works on Vercel

### **1. User Creates QR Code:**
- User fills form at `/studio/qr-microsite`
- Clicks "Generate QR Microsite"

### **2. API Processing:**
- POST request to `/api/create-product-vercel`
- Uploads product image to Vercel Blob (if provided)
- Generates HTML microsite
- Uploads HTML to Vercel Blob
- Generates QR code pointing to microsite URL
- Uploads QR code to Vercel Blob

### **3. User Gets:**
- **QR Code URL** - Public Vercel Blob URL
- **Microsite URL** - Public Vercel Blob URL
- **WhatsApp Link** - Direct messaging link

### **4. Customer Scans QR:**
- Opens microsite from Vercel Blob
- Views product details
- Clicks WhatsApp button
- Sends message to artisan

---

## 💰 Vercel Blob Free Tier

Perfect for your use case:

- **Storage:** 1 GB
- **Bandwidth:** 100 GB/month
- **Files:** Unlimited
- **Cost:** FREE

**Estimated Capacity:**
- ~10,000 QR codes (with images)
- ~50,000 QR codes (without images)

---

## ✅ Deployment Commands Summary

```cmd
# Initial deployment
cd d:\aitrystt\aitrystt
vercel

# After creating Blob storage
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Check environment variables
vercel env ls
```

---

## 🎉 Post-Deployment Checklist

After deployment, verify:

- [ ] Main app loads: https://aitrystt.vercel.app
- [ ] About page loads: https://aitrystt.vercel.app/about
- [ ] Dashboard loads: https://aitrystt.vercel.app/dashboard
- [ ] Studio loads: https://aitrystt.vercel.app/studio
- [ ] QR Microsite page loads: https://aitrystt.vercel.app/studio/qr-microsite
- [ ] Blob storage created in Vercel Dashboard
- [ ] `BLOB_READ_WRITE_TOKEN` environment variable set
- [ ] Generate test QR code successfully
- [ ] QR code image displays
- [ ] Microsite URL opens
- [ ] WhatsApp link works

---

## 📞 Quick Commands Reference

```cmd
# Deploy
vercel

# Deploy to production
vercel --prod

# Check status
vercel ls

# View logs
vercel logs

# Open dashboard
vercel dashboard

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull
```

---

## 🚀 Ready to Deploy!

**Your QR Microsite is fully configured and ready!**

**Run this command now:**

```cmd
cd d:\aitrystt\aitrystt
vercel
```

**After deployment:**
1. Create Blob storage in Vercel Dashboard
2. Redeploy with `vercel --prod`
3. Test QR Microsite generation
4. Share your live app!

**Your app will be live at:** https://aitrystt.vercel.app

**Let's deploy! 🎉**
