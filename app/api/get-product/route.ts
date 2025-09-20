import { NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';
import path from 'path';

// Set Google Cloud credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(process.cwd(), 'service-account-key.json');

// Initialize Firestore
const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'artisan-ai-472017',
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Try to get product data from Firestore
    try {
      const productDoc = await firestore.collection('products').doc(productId).get();
      
      if (productDoc.exists) {
        const productData = productDoc.data();
        
        // Increment view count
        try {
          await firestore.collection('products').doc(productId).update({
            views: (productData?.views || 0) + 1,
            lastViewed: new Date()
          });
        } catch (updateError) {
          console.log('Could not update view count:', updateError instanceof Error ? updateError.message : 'Unknown error');
        }
        
        return NextResponse.json({
          success: true,
          product: {
            ...productData,
            views: (productData?.views || 0) + 1
          }
        });
      }
    } catch (firestoreError) {
      console.log('Firestore not available:', firestoreError instanceof Error ? firestoreError.message : 'Unknown error');
    }
    
    // Fallback: Return mock data if Firestore is not available
    return NextResponse.json({
      success: true,
      product: {
        id: productId,
        name: "Handcrafted Product",
        description: "This is a beautiful handcrafted product created by skilled artisans. Each piece is unique and made with traditional techniques.",
        priceINR: 1500,
        whatsapp: "+919876543210",
        micrositeUrl: `https://aitrystt.vercel.app/product/${productId}`,
        qrCodeUrl: null,
        whatsappLink: `https://wa.me/919876543210?text=Hi! I'm interested in your handcrafted product.`,
        imageUrl: "https://images.unsplash.com/photo-1500961777889-4860e041249e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        createdAt: new Date(),
        views: 1,
        status: 'active'
      }
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
