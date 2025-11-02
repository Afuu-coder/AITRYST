import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, micrositeUrl } = body

    if (!productId && !micrositeUrl) {
      return NextResponse.json(
        { error: 'Product ID or microsite URL is required' },
        { status: 400 }
      )
    }

    // Generate the URL for the microsite
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const url = micrositeUrl || `${baseUrl}/microsite/${productId}`

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })

    return NextResponse.json({
      qrCodeUrl: qrCodeDataUrl,
      micrositeUrl: url
    })
  } catch (error: any) {
    console.error('QR code generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
