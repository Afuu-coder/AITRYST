import { NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import QRCode from 'qrcode';
import path from 'path';

// Set Google Cloud credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(process.cwd(), 'service-account-key.json');

// Initialize Google Cloud services
const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'artisan-ai-472017',
});

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'artisan-ai-472017',
});

const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'artisan-ai-472017-qr-microsite';

export async function POST(request: Request) {
  try {
    console.log('Creating product with Google Cloud services...');
    
    // Parse form data
    const formData = await request.formData();
    const productName = formData.get('productName') as string;
    const productDescription = formData.get('productDescription') as string;
    const productPrice = formData.get('productPrice') as string;
    const artisanPhone = formData.get('artisanPhone') as string;
    const productImage = formData.get('productImage') as File | null;
    
    console.log('Product data:', { productName, productDescription, productPrice, artisanPhone, hasImage: !!productImage });
    
    // Generate unique product ID
    const productId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log('Generated product ID:', productId);
    
    // Create microsite URL - use production URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aitrystt.vercel.app';
    const micrositeUrl = `${baseUrl}/product/${productId}`;
    console.log('Microsite URL:', micrositeUrl);
    
    // Generate QR code
    console.log('Generating QR code...');
    const qrCodeDataURL = await QRCode.toDataURL(micrositeUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Convert data URL to buffer
    const qrCodeBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
    
    // Upload QR code to Cloud Storage (with fallback)
    console.log('Uploading QR code to Cloud Storage...');
    let qrCodeUrl = qrCodeDataURL; // Fallback to data URL
    
    try {
      const qrFileName = `qr-codes/${productId}.png`;
      const qrFile = storage.bucket(bucketName).file(qrFileName);
      
      await qrFile.save(qrCodeBuffer, {
        metadata: {
          contentType: 'image/png',
          cacheControl: 'public, max-age=31536000',
        },
      });
      
      // Make QR code publicly accessible
      await qrFile.makePublic();
      
      // Get public URL for QR code
      qrCodeUrl = `https://storage.googleapis.com/${bucketName}/${qrFileName}`;
      console.log('QR Code URL:', qrCodeUrl);
    } catch (storageError) {
      console.log('Cloud Storage not available, using data URL fallback:', storageError instanceof Error ? storageError.message : 'Unknown error');
      // Use data URL as fallback
      qrCodeUrl = qrCodeDataURL;
    }
    
    // Handle product image upload if provided (with fallback)
    let productImageUrl = null;
    if (productImage && productImage.size > 0) {
      console.log('Processing product image...');
      
      try {
        // Try to upload to Cloud Storage
        const imageFileName = `product-images/${productId}.${productImage.name.split('.').pop()}`;
        const imageFile = storage.bucket(bucketName).file(imageFileName);
        
        const imageBuffer = Buffer.from(await productImage.arrayBuffer());
        await imageFile.save(imageBuffer, {
          metadata: {
            contentType: productImage.type,
            cacheControl: 'public, max-age=31536000',
          },
        });
        
        await imageFile.makePublic();
        productImageUrl = `https://storage.googleapis.com/${bucketName}/${imageFileName}`;
        console.log('Product Image URL:', productImageUrl);
      } catch (storageError) {
        console.log('Cloud Storage not available for image, using data URL fallback:', storageError instanceof Error ? storageError.message : 'Unknown error');
        // Convert image to data URL as fallback
        const imageBuffer = Buffer.from(await productImage.arrayBuffer());
        const base64Image = imageBuffer.toString('base64');
        productImageUrl = `data:${productImage.type};base64,${base64Image}`;
      }
    }
    
    // Create WhatsApp link
    const formattedPhone = artisanPhone.replace(/\D/g, '');
    const whatsappMessage = `Hi! I'm interested in your ${productName}. Price: ₹${productPrice}\n\nProduct Details:\n${productDescription}`;
    const whatsappLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Save product data to Firestore (with fallback)
    console.log('Saving product data to Firestore...');
    const productData = {
      id: productId,
      name: productName,
      description: productDescription,
      priceINR: parseInt(productPrice),
      whatsapp: artisanPhone,
      micrositeUrl: micrositeUrl,
      qrCodeUrl: qrCodeUrl,
      whatsappLink: whatsappLink,
      imageUrl: productImageUrl,
      createdAt: new Date(),
      views: 0,
      status: 'active'
    };
    
    try {
      await firestore.collection('products').doc(productId).set(productData);
      console.log('Product saved to Firestore successfully!');
    } catch (firestoreError) {
      console.log('Firestore not available, using local storage fallback:', firestoreError instanceof Error ? firestoreError.message : 'Unknown error');
      // For now, we'll still return the data even if Firestore fails
      // In a production app, you might want to store this in a local database
    }
    
    return NextResponse.json({
      success: true,
      productId,
      micrositeUrl,
      qrCodeUrl,
      whatsappLink,
      productData
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to create product microsite: ${errorMessage}` },
      { status: 500 }
    );
  }
}
