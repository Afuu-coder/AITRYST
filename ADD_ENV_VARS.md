# 🔧 Add All Environment Variables to Vercel

## Critical: Add these environment variables to fix all studio tools

---

## 📋 **Environment Variables to Add**

Go to: https://vercel.com/afjalambani-gmailcoms-projects/aitrystt/settings/environment-variables

---

### **1. GOOGLE_API_KEY**

```
Name: GOOGLE_API_KEY
Value: AIzaSyAqLdB8aCkCdmK7EsiqGR0ERDPu48y5bHQ
Environments: Production, Preview, Development
```

**Click "Add New" → Fill in → Select all environments → Save**

---

### **2. GOOGLE_CLOUD_PROJECT_ID**

```
Name: GOOGLE_CLOUD_PROJECT_ID
Value: craftai-476916
Environments: Production, Preview, Development
```

**Click "Add New" → Fill in → Select all environments → Save**

---

### **3. GOOGLE_CLOUD_CREDENTIALS** (Service Account JSON)

```
Name: GOOGLE_CLOUD_CREDENTIALS
Value: (paste the entire JSON below)
Environments: Production, Preview, Development
```

**Paste your Google Cloud service account JSON as the value**

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  ...
}
```

**Note:** Use your own Google Cloud service account credentials

**Click "Add New" → Fill in → Select all environments → Save**

---

## ✅ **After Adding All Variables**

You should see these environment variables:

```
BLOB_READ_WRITE_TOKEN = Encrypted (Production, Preview, Development)
GOOGLE_API_KEY = Encrypted (Production, Preview, Development)
GOOGLE_CLOUD_PROJECT_ID = Encrypted (Production, Preview, Development)
GOOGLE_CLOUD_CREDENTIALS = Encrypted (Production, Preview, Development)
```

---

## 🚀 **Redeploy**

After adding all variables, redeploy:

```cmd
cd d:\aitrystt\aitrystt
vercel --prod
```

Wait 2-3 minutes for deployment to complete.

---

## ✅ **Test All Features**

After redeployment, test these:

1. **Image Enhancement** - https://aitrystt-nine.vercel.app/studio/image-enhancer
2. **AI Content** - https://aitrystt-nine.vercel.app/studio/ai-content
3. **AI Assistance** - https://aitrystt-nine.vercel.app/studio/ai-assistance
4. **Festival Campaigns** - https://aitrystt-nine.vercel.app/studio/festival-campaigns
5. **Smart Pricing** - https://aitrystt-nine.vercel.app/studio/smart-pricing
6. **QR Microsite** - https://aitrystt-nine.vercel.app/studio/qr-microsite

All should work without errors!

---

## 🎯 **Quick Summary**

1. Go to Vercel environment variables page
2. Add 3 new variables (GOOGLE_API_KEY, GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_CREDENTIALS)
3. Redeploy with `vercel --prod`
4. All features will work!

**Time: 5 minutes**
**Result: 100% working app!**
