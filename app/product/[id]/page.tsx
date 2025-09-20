import ProductPageClient from './product-client'

// Generate static params for static export
export async function generateStaticParams() {
  // Return some sample product IDs for static generation
  return [
    { id: 'sample-1' },
    { id: 'sample-2' },
    { id: 'sample-3' },
  ]
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductPageClient params={params} />
}