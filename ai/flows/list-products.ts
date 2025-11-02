'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ListProductsOutputSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
  })),
});
export type ListProductsOutput = z.infer<typeof ListProductsOutputSchema>;

export async function listProducts(): Promise<ListProductsOutput> {
  // For now, return mock data since we don't have a database setup
  // In a real implementation, this would fetch from your database
  return {
    products: [
      {
        id: '1',
        name: 'Ceramic Vase',
        description: 'Handcrafted ceramic vase with traditional patterns',
      },
      {
        id: '2', 
        name: 'Wooden Bowl',
        description: 'Beautiful wooden bowl carved from mango wood',
      },
      {
        id: '3',
        name: 'Textile Wall Hanging',
        description: 'Colorful textile wall hanging with mirror work',
      },
    ],
  };
}
