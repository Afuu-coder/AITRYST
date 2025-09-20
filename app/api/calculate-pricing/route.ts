import { NextResponse } from 'next/server';
import { calculatePricingWithAI } from '@/lib/vertexAIServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { materialCost, hoursWorked, productType } = body;
    
    // Calculate pricing using AI
    const result = await calculatePricingWithAI(materialCost, hoursWorked, productType);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating pricing:', error);
    return NextResponse.json(
      { error: 'Failed to calculate pricing' },
      { status: 500 }
    );
  }
}