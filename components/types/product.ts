export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  aiEnabled?: boolean;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: Product | Product[];
}