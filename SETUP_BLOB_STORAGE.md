# 🗄️ Setup Vercel Blob Storage - Step by Step

## ⚠️ CRITICAL: This is REQUIRED for QR Microsite to work!

---

## 📋 **Step-by-Step Instructions**

### **Step 1: Open Your Project Dashboard**

1. Open your browser
2. Go to: **https://vercel.com/afjalambani-gmailcoms-projects/aitrystt**
3. You should see your project dashboard

---

### **Step 2: Navigate to Storage Tab**

1. Look at the top navigation menu
2. You'll see tabs: **Overview**, **Deployments**, **Analytics**, **Logs**, **Storage**, **Settings**
3. Click on **"Storage"** tab

---

### **Step 3: Create Blob Database**

1. You'll see a page saying "No databases yet"
2. Click the **"Create Database"** button (big blue button)
3. A modal will appear with database options

---

### **Step 4: Select Blob Storage**

You'll see several options:
- **Postgres** (for SQL databases)
- **KV** (for key-value storage)
- **Blob** ← **SELECT THIS ONE!**
- **Edge Config**

1. Click on **"Blob"**
2. You'll see: "Store large files like images, videos, and more"

---

### **Step 5: Create the Blob Store**

1. Click **"Create"** button
2. Vercel will create your Blob storage (takes 5-10 seconds)
3. You'll see a success message: "Blob store created"

---

### **Step 6: Verify Environment Variable**

After creating Blob storage:

1. Go to **"Settings"** tab (top menu)
2. Click **"Environment Variables"** (left sidebar)
3. You should see:
   ```
   BLOB_READ_WRITE_TOKEN = vercel_blob_rw_XXXXXXXXXXXXXXXXX
   ```
4. **Status:** Production ✅

---

### **Step 7: Automatic Redeploy**

Vercel automatically redeploys your app with the new environment variable!

**Wait 2-3 minutes for the redeploy to complete.**

You can check deployment status:
- Go to **"Deployments"** tab
- You'll see a new deployment in progress
- Wait for it to show **"Ready"** status

---

## ✅ **Verification**

After Blob storage is created and redeployed:

### **Test QR Microsite:**

1. Go to: **https://aitrystt-nine.vercel.app/studio/qr-microsite**

2. Fill in the form:
   ```
   Product Name: Test Pottery
   Description: Beautiful handcrafted pottery
   Price: 1500
   WhatsApp: +91 9876543210
   Image: Upload a photo (optional)
   ```

3. Click **"Generate QR Microsite"**

4. You should get:
   - ✅ **QR Code URL** - `https://xxxxx.public.blob.vercel-storage.com/qr-codes/abc123.png`
   - ✅ **Microsite URL** - `https://xxxxx.public.blob.vercel-storage.com/microsites/abc123.html`
   - ✅ **WhatsApp Link** - Working

5. Click the QR code to view it
6. Click the microsite URL to open it
7. Test the WhatsApp button

---

## 🆘 **Troubleshooting**

### **Issue: Can't find Storage tab**

**Solution:**
- Make sure you're logged in to Vercel
- Make sure you're on the correct project
- URL should be: `https://vercel.com/afjalambani-gmailcoms-projects/aitrystt`

---

### **Issue: Create Database button not showing**

**Solution:**
- Refresh the page
- Make sure you have permissions (you're the owner)
- Try a different browser

---

### **Issue: Blob option not available**

**Solution:**
- Make sure you're on the Storage tab
- Scroll down to see all database options
- Blob should be the third option

---

### **Issue: QR Microsite still not working after setup**

**Solution:**
1. Check environment variables in Settings
2. Verify `BLOB_READ_WRITE_TOKEN` exists
3. Wait for automatic redeploy to complete
4. Clear browser cache
5. Try generating a new QR code

---

## 📊 **What Happens After Setup**

### **1. Blob Storage Created**
- Storage location: Vercel Blob
- Access: Public URLs
- Free tier: 1 GB storage, 100 GB bandwidth

### **2. Environment Variable Added**
- `BLOB_READ_WRITE_TOKEN` automatically added
- Available in Production environment
- Used by `/api/create-product-vercel` route

### **3. Automatic Redeploy**
- Vercel redeploys your app
- New environment variable is available
- QR Microsite API can now upload files

### **4. QR Microsite Works!**
- Upload product images → Vercel Blob
- Generate HTML microsites → Vercel Blob
- Generate QR codes → Vercel Blob
- All files get public URLs

---

## 🎯 **Expected File Structure in Blob**

After generating QR codes, your Blob storage will have:

```
blob-storage/
├── product-images/
│   ├── abc123.jpg
│   ├── def456.png
│   └── ...
├── microsites/
│   ├── abc123.html
│   ├── def456.html
│   └── ...
└── qr-codes/
    ├── abc123.png
    ├── def456.png
    └── ...
```

---

## 💰 **Blob Storage Pricing**

### **Free Tier (Perfect for you!):**
- **Storage:** 1 GB
- **Bandwidth:** 100 GB/month
- **Files:** Unlimited
- **Cost:** $0

### **Capacity Estimate:**
- ~10,000 QR codes with product images
- ~50,000 QR codes without images
- Perfect for artisan marketplace!

---

## ✅ **Quick Checklist**

- [ ] Open Vercel Dashboard
- [ ] Go to Storage tab
- [ ] Click Create Database
- [ ] Select Blob
- [ ] Click Create
- [ ] Wait for creation (5-10 seconds)
- [ ] Verify environment variable in Settings
- [ ] Wait for automatic redeploy (2-3 minutes)
- [ ] Test QR Microsite generation
- [ ] Verify QR code displays
- [ ] Verify microsite URL opens
- [ ] Test WhatsApp button

---

## 🚀 **You're Almost Done!**

**Just 5 minutes to complete:**

1. Open: https://vercel.com/afjalambani-gmailcoms-projects/aitrystt
2. Click: Storage → Create Database → Blob → Create
3. Wait: 2-3 minutes for redeploy
4. Test: Generate a QR code
5. Done: QR Microsite fully functional!

**Your app is already live at:** https://aitrystt-nine.vercel.app

**Just need to enable Blob storage and you're 100% ready! 🎉**
