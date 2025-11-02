import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import QRCode from 'qrcode';

export async function POST(request: Request) {
  try {
    console.log('Creating product with Vercel Blob...');
    
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
    
    // Handle product image upload if provided
    let productImageUrl = null;
    if (productImage && productImage.size > 0) {
      console.log('Uploading product image to Vercel Blob...');
      const imageBlob = await put(`product-images/${productId}.${productImage.name.split('.').pop()}`, productImage, {
        access: 'public',
      });
      productImageUrl = imageBlob.url;
      console.log('Product Image URL:', productImageUrl);
    }
    
    // Create WhatsApp link
    const formattedPhone = artisanPhone.replace(/\D/g, '');
    const whatsappMessage = `Hi! I'm interested in your ${productName}. Price: ₹${productPrice}\\n\\nProduct Details:\\n${productDescription}`;
    const whatsappLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Generate HTML microsite
    console.log('Generating HTML microsite...');
    const micrositeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - Handcrafted Product</title>
    <meta name="description" content="${productDescription}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); overflow: hidden; }
        .image-container { width: 100%; aspect-ratio: 1; background: #f0f0f0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .image-container img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder { font-size: 80px; }
        .content { padding: 30px; }
        h1 { font-size: 28px; color: #1a1a1a; margin-bottom: 10px; }
        .artisan { color: #666; font-size: 16px; margin-bottom: 20px; }
        .price { font-size: 36px; font-weight: bold; color: #8b5cf6; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .rating { display: flex; align-items: center; gap: 5px; font-size: 14px; color: #666; }
        .star { color: #fbbf24; }
        .description { color: #444; line-height: 1.6; margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 10px; }
        .info-item { }
        .info-label { font-size: 12px; color: #666; margin-bottom: 5px; }
        .info-value { font-weight: 600; color: #1a1a1a; }
        .buttons { display: flex; gap: 10px; margin-top: 20px; }
        .btn { flex: 1; padding: 16px; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s; text-decoration: none; }
        .btn-primary { background: #10b981; color: white; }
        .btn-primary:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
        .btn-secondary { background: #f3f4f6; color: #1a1a1a; }
        .btn-secondary:hover { background: #e5e7eb; }
        .badge { display: inline-block; padding: 8px 16px; background: #f3f4f6; border-radius: 20px; font-size: 12px; color: #666; margin: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        @media (max-width: 640px) {
            .buttons { flex-direction: column; }
            .info-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-container">
            ${productImageUrl ? `<img src="${productImageUrl}" alt="${productName}">` : '<div class="placeholder">🎨</div>'}
        </div>
        <div class="content">
            <h1>${productName}</h1>
            <p class="artisan">Artisan</p>
            <div class="price">
                ₹${productPrice}
                <div class="rating">
                    <span class="star">★</span>
                    <span>4.8 (24 reviews)</span>
                </div>
            </div>
            <div class="description">
                <h2 style="font-size: 18px; margin-bottom: 10px;">Description</h2>
                <p>${productDescription}</p>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Category</div>
                    <div class="info-value">Handcrafted Product</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Artisan</div>
                    <div class="info-value">Artisan</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Material</div>
                    <div class="info-value">Ceramic Clay</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Dimensions</div>
                    <div class="info-value">8" x 6" x 6"</div>
                </div>
            </div>
            <div class="buttons">
                <a href="${whatsappLink}" class="btn btn-primary" target="_blank">
                    <span>💬</span>
                    Order via WhatsApp
                </a>
                <button class="btn btn-secondary" onclick="shareProduct()">
                    <span>📤</span>
                    Share
                </button>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <span class="badge">✓ 100% Handcrafted</span>
                <span class="badge">✓ Authentic Artisan Work</span>
                <span class="badge">✓ Secure Payment</span>
            </div>
        </div>
    </div>
    <div class="footer">
        <p>Powered by AITRYST - Empowering Artisans</p>
    </div>
    <script>
        function shareProduct() {
            if (navigator.share) {
                navigator.share({
                    title: '${productName}',
                    text: '${productDescription}',
                    url: window.location.href
                }).catch(err => console.log('Error sharing:', err));
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        }
    </script>
</body>
</html>`;

    // Upload HTML microsite to Vercel Blob
    console.log('Uploading HTML microsite to Vercel Blob...');
    const micrositeBlob = await put(`microsites/${productId}.html`, micrositeHtml, {
      access: 'public',
      contentType: 'text/html',
    });
    const micrositeUrl = micrositeBlob.url;
    console.log('✅ Microsite uploaded to Vercel Blob:', micrositeUrl);
    
    // Generate QR code with Vercel Blob URL
    console.log('Generating QR code...');
    const qrCodeDataURL = await QRCode.toDataURL(micrositeUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
    
    // Upload QR code to Vercel Blob
    const qrCodeBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
    const qrCodeBlob = await put(`qr-codes/${productId}.png`, qrCodeBuffer, {
      access: 'public',
      contentType: 'image/png',
    });
    const qrCodeUrl = qrCodeBlob.url;
    console.log('✅ QR Code uploaded to Vercel Blob:', qrCodeUrl);
    
    // Return response
    return NextResponse.json({
      success: true,
      productId,
      micrositeUrl,
      qrCodeUrl,
      whatsappLink,
      productData: {
        id: productId,
        name: productName,
        description: productDescription,
        price: productPrice,
        phone: artisanPhone,
        image: productImageUrl,
        micrositeUrl,
        qrCodeUrl,
        whatsappLink,
        artisan: 'Artisan',
        category: 'Handcrafted Product',
        material: 'Ceramic Clay',
        dimensions: '8" x 6" x 6"',
        rating: 4.8,
        reviews: 24
      }
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
