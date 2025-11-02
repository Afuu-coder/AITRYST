# 🔧 Fix Studio Tools - Add Environment Variables

## ⚠️ Studio Tools Need Google API Key

Your studio tools are failing because they need the Google API key in Vercel.

---

## 📋 **Quick Fix - Add Environment Variables**

### **Step 1: Go to Vercel Settings**

```
https://vercel.com/afjalambani-gmailcoms-projects/aitrystt/settings/environment-variables
```

---

### **Step 2: Add GOOGLE_API_KEY**

1. Click **"Add New"** button
2. Fill in:
   ```
   Name: GOOGLE_API_KEY
   Value: AIzaSyAqLdB8aCkCdmK7EsiqGR0ERDPu48y5bHQ
   ```
3. Select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Click **"Save"**

---

### **Step 3: Redeploy**

After adding the variable, redeploy:

```cmd
vercel --prod
```

Or wait for automatic redeploy (2-3 minutes)

---

## ✅ **Which Tools Need This**

### **Tools Using Google AI:**
- ✅ **AI Content Generation** - Uses Gemini AI
- ✅ **Platform Content** - Uses Gemini AI  
- ✅ **Image Analysis** - Uses Google Vision AI
- ✅ **AI Assistance** - All 7 features use Gemini

### **Tools NOT Needing Google:**
- ✅ **QR Microsite** - Uses Vercel Blob (already working!)
- ✅ **Voice Recording** - Client-side only
- ✅ **Smart Pricing** - Uses Gemini (needs API key)
- ✅ **Festival Campaigns** - Uses Gemini (needs API key)

---

## 🎯 **Alternative: Use CLI**

If you prefer CLI:

```cmd
cd d:\aitrystt\aitrystt
vercel env add GOOGLE_API_KEY
```

When prompted:
```
? What's the value of GOOGLE_API_KEY?
→ AIzaSyAqLdB8aCkCdmK7EsiqGR0ERDPu48y5bHQ

? Add GOOGLE_API_KEY to which Environments?
→ Select all: Production, Preview, Development
```

Then redeploy:
```cmd
vercel --prod
```

---

## ✅ **After Adding Environment Variable**

### **Test These Tools:**

1. **AI Content Generation**
   - Go to: https://aitrystt-nine.vercel.app/studio/ai-content
   - Generate content
   - Should work!

2. **AI Assistance**
   - Go to: https://aitrystt-nine.vercel.app/studio/ai-assistance
   - Try any of the 7 features
   - Should work!

3. **Festival Campaigns**
   - Go to: https://aitrystt-nine.vercel.app/studio/festival-campaigns
   - Generate campaign
   - Should work!

4. **Smart Pricing**
   - Go to: https://aitrystt-nine.vercel.app/studio/smart-pricing
   - Calculate pricing
   - Should work!

---

## 🆘 **If Still Not Working**

### **Check Environment Variables:**

1. Go to: https://vercel.com/afjalambani-gmailcoms-projects/aitrystt/settings/environment-variables

2. Verify you see:
   ```
   BLOB_READ_WRITE_TOKEN = Encrypted (Production, Preview, Development)
   GOOGLE_API_KEY = Encrypted (Production, Preview, Development)
   ```

3. If missing, add it again

4. Redeploy: `vercel --prod`

---

## 📊 **Summary**

**Issue:** Studio tools using Google AI failing
**Cause:** Missing `GOOGLE_API_KEY` environment variable
**Solution:** Add API key to Vercel environment variables
**Time:** 2 minutes
**Result:** All studio tools working!

---

## 🚀 **Quick Steps**

1. Go to: https://vercel.com/afjalambani-gmailcoms-projects/aitrystt/settings/environment-variables
2. Click "Add New"
3. Name: `GOOGLE_API_KEY`
4. Value: `AIzaSyAqLdB8aCkCdmK7EsiqGR0ERDPu48y5bHQ`
5. Select all environments
6. Save
7. Redeploy: `vercel --prod`
8. Test tools!

**That's it! All tools will work after this! 🎉**
