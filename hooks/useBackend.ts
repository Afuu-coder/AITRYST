import { useState, useEffect } from 'react';
import { 
  createProduct, 
  getProductsByArtisan, 
  getProduct, 
  updateProduct, 
  deleteProduct,
  createArtisan,
  getArtisan,
  updateArtisan,
  createCampaign,
  getCampaignsByArtisan,
  uploadImage,
  generateAIContent,
  transcribeAudio,
  enhanceImage,
  calculatePricing,
  generateQRCode,
  Product,
  Artisan,
  Campaign,
  PricingData
} from '@/lib/backend';

// Types
export interface UseBackendHook {
  // Product management
  products: Product[];
  fetchProducts: (artisanId: string) => Promise<void>;
  createNewProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product | null>;
  updateExistingProduct: (productId: string, product: Partial<Product>) => Promise<Product | null>;
  deleteExistingProduct: (productId: string) => Promise<boolean>;
  
  // Artisan management
  artisan: Artisan | null;
  fetchArtisan: (artisanId: string) => Promise<void>;
  createNewArtisan: (artisan: Omit<Artisan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Artisan | null>;
  updateExistingArtisan: (artisanId: string, artisan: Partial<Artisan>) => Promise<Artisan | null>;
  
  // Campaign management
  campaigns: Campaign[];
  fetchCampaigns: (artisanId: string) => Promise<void>;
  createNewCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Campaign | null>;
  
  // Media upload
  uploadImageFile: (file: File, path: string) => Promise<string | null>;
  
  // AI services
  generateContent: (prompt: string, language: 'en' | 'hi') => Promise<any>;
  transcribeAudioFile: (audioBlob: Blob, language?: string) => Promise<string | null>;
  enhanceImageFile: (imageUrl: string, enhancementOptions?: any) => Promise<string | null>;
  calculateProductPricing: (materialCost: number, hoursWorked: number, productType: string) => Promise<PricingData | null>;
  
  // QR code generation
  generateProductQRCode: (productId: string) => Promise<string | null>;
  
  // Loading and error states
  loading: boolean;
  error: string | null;
}

export const useBackend = (): UseBackendHook => {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle API calls
  const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('API call failed:', err);
      // Re-throw the error so it can be handled by the caller
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Product management
  const fetchProducts = async (artisanId: string) => {
    await handleApiCall(async () => {
      const fetchedProducts = await getProductsByArtisan(artisanId);
      setProducts(fetchedProducts);
    });
  };

  const createNewProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return handleApiCall(async () => {
      const newProduct = await createProduct(product);
      setProducts(prev => [newProduct as Product, ...prev]);
      return newProduct;
    });
  };

  const updateExistingProduct = async (productId: string, product: Partial<Product>) => {
    return handleApiCall(async () => {
      const updatedProduct = await updateProduct(productId, product);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct as Product : p));
      return updatedProduct as Product;
    });
  };

  const deleteExistingProduct = async (productId: string) => {
    return handleApiCall(async () => {
      const result = await deleteProduct(productId);
      if (result) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
      return result;
    }) as Promise<boolean>;
  };

  // Artisan management
  const fetchArtisan = async (artisanId: string) => {
    await handleApiCall(async () => {
      const fetchedArtisan = await getArtisan(artisanId);
      setArtisan(fetchedArtisan);
    });
  };

  const createNewArtisan = async (artisan: Omit<Artisan, 'id' | 'createdAt' | 'updatedAt'>) => {
    return handleApiCall(async () => {
      const newArtisan = await createArtisan(artisan);
      setArtisan(newArtisan);
      return newArtisan;
    });
  };

  const updateExistingArtisan = async (artisanId: string, artisan: Partial<Artisan>) => {
    return handleApiCall(async () => {
      const updatedArtisan = await updateArtisan(artisanId, artisan);
      setArtisan(updatedArtisan as Artisan);
      return updatedArtisan as Artisan;
    });
  };

  // Campaign management
  const fetchCampaigns = async (artisanId: string) => {
    await handleApiCall(async () => {
      const fetchedCampaigns = await getCampaignsByArtisan(artisanId);
      setCampaigns(fetchedCampaigns);
    });
  };

  const createNewCampaign = async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => {
    return handleApiCall(async () => {
      const newCampaign = await createCampaign(campaign);
      setCampaigns(prev => [newCampaign as Campaign, ...prev]);
      return newCampaign;
    });
  };

  // Media upload
  const uploadImageFile = async (file: File, path: string) => {
    return handleApiCall(async () => {
      try {
        const result = await uploadImage(file, path);
        return result;
      } catch (error) {
        console.error('Error in uploadImageFile:', error);
        // Re-throw the error so it can be handled by the caller
        throw error;
      }
    });
  };

  // AI services
  const generateContent = async (prompt: string, language: 'en' | 'hi') => {
    return handleApiCall(async () => {
      return await generateAIContent(prompt, language);
    });
  };

  const transcribeAudioFile = async (audioBlob: Blob, language: string = 'hi-IN') => {
    return handleApiCall(async () => {
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('language', language);

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.transcription;
      } catch (error) {
        console.error('Transcription error:', error);
        throw error;
      }
    });
  };

  const enhanceImageFile = async (imageUrl: string, enhancementOptions?: any) => {
    return handleApiCall(async () => {
      return await enhanceImage(imageUrl, enhancementOptions);
    });
  };

  const calculateProductPricing = async (materialCost: number, hoursWorked: number, productType: string) => {
    return handleApiCall(async () => {
      return await calculatePricing(materialCost, hoursWorked, productType);
    });
  };

  // QR code generation
  const generateProductQRCode = async (productId: string) => {
    return handleApiCall(async () => {
      return await generateQRCode(productId);
    });
  };

  return {
    // Product management
    products,
    fetchProducts,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    
    // Artisan management
    artisan,
    fetchArtisan,
    createNewArtisan,
    updateExistingArtisan,
    
    // Campaign management
    campaigns,
    fetchCampaigns,
    createNewCampaign,
    
    // Media upload
    uploadImageFile,
    
    // AI services
    generateContent,
    transcribeAudioFile,
    enhanceImageFile,
    calculateProductPricing,
    
    // QR code generation
    generateProductQRCode,
    
    // Loading and error states
    loading,
    error
  };
};