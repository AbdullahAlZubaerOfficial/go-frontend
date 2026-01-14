import axios from 'axios';
import { Product } from '../types/product';


// Use relative path for client-side, full URL for server-side
const isClient = typeof window !== 'undefined';
const API_BASE_URL = isClient ? '/api' : 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request logging
api.interceptors.request.use(
  (config) => {
    if (isClient) {
      console.log(`📡 Frontend → ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response logging
api.interceptors.response.use(
  (response) => {
    if (isClient) {
      console.log(`✅ Response ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const productService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      console.log(`🌐 Fetching products from: ${API_BASE_URL}/products`);
      const response = await api.get('/products');
      console.log(`✅ Got ${response.data.length} products`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch products:', error);
      
      // Try direct connection as fallback
      if (isClient) {
        try {
          console.log('🔄 Trying direct connection to backend...');
          const directResponse = await axios.get('http://localhost:8080/products', {
            timeout: 3000,
          });
          console.log('✅ Direct connection worked!');
          return directResponse.data;
        } catch (directError) {
          console.error('❌ Direct connection also failed');
        }
      }
      
      throw new Error(`Cannot fetch products. Please ensure:
1. Backend is running on http://localhost:8080
2. Check browser console for CORS errors
3. Try refreshing the page`);
    }
  },

  // Create a new product
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const response = await api.post('/create-products', product);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Failed to create product: ' + error.message);
    }
  },

  // Health check
  checkHealth: async (): Promise<boolean> => {
    try {
      await api.get('/');
      return true;
    } catch {
      return false;
    }
  },
};

// Test function
export const testBackendConnection = async (): Promise<{
  success: boolean;
  method: string;
  data?: any;
}> => {
  const testMethods = [
    { name: 'proxy', url: '/api/products' },
    { name: 'direct', url: 'http://localhost:8080/products' },
    { name: 'localhost', url: 'http://127.0.0.1:8080/products' },
  ];

  for (const method of testMethods) {
    try {
      console.log(`🔍 Testing ${method.name} connection...`);
      const response = await fetch(method.url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${method.name} connection successful!`);
        return { success: true, method: method.name, data };
      }
    } catch (error) {
      console.log(`❌ ${method.name} failed:`, error);
    }
  }
  
  return { success: false, method: 'all failed' };
};