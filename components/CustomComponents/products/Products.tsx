'use client';

import { productService, testBackendConnection } from '@/components/services/api';
import { Product } from '@/components/types/product';
import { useState, useEffect } from 'react';


export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionMethod, setConnectionMethod] = useState<string>('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test connection first
      const testResult = await testBackendConnection();
      
      if (testResult.success) {
        setConnectionMethod(`Connected via ${testResult.method}`);
        
        // Load products
        const data = await productService.getAllProducts();
        setProducts(data);
      } else {
        setError(`Cannot connect to backend using any method.
        
Your backend IS running (verified with curl), but the browser can't connect.

Possible solutions:
1. CORS issue - The proxy should fix this
2. Windows firewall blocking - Temporarily disable firewall
3. Network restriction - Try using 127.0.0.1 instead of localhost

Quick test: Open http://localhost:8080/products in your browser`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadProducts();
  };

  const handleOpenBackend = () => {
    window.open('http://localhost:8080', '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full animate-ping"></div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Connecting to Backend</h3>
          <p className="mt-2 text-gray-600">Testing connection methods...</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Trying proxy (/api/products)</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Trying direct connection</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Connection Issue Detected</h2>
          <p className="mt-2 text-gray-600">Backend is running but frontend can't connect</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">✅ Backend Status:</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700">Backend is running on <code className="bg-green-100 text-green-800 px-2 py-1 rounded">http://localhost:8080</code></span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700">CURL test successful (you verified this)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <span className="text-gray-700">Browser connection failed (CORS/Network issue)</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-4">🔧 Windows-Specific Fixes:</h3>
          <ol className="list-decimal list-inside space-y-3 text-blue-800">
            <li className="pl-2">
              <strong>Check Windows Firewall:</strong>
              <div className="mt-1 ml-4">
                <p className="text-sm">Temporarily disable Windows Defender Firewall for testing:</p>
                <code className="block bg-blue-100 text-blue-900 px-3 py-2 rounded mt-1 text-sm">
                  Windows Security → Firewall & network protection → Private network → Turn off
                </code>
              </div>
            </li>
            <li className="pl-2">
              <strong>Use 127.0.0.1 instead of localhost:</strong>
              <div className="mt-1 ml-4">
                <button
                  onClick={() => window.open('http://127.0.0.1:8080/products', '_blank')}
                  className="text-blue-700 hover:text-blue-900 underline text-sm"
                >
                  Click to test: http://127.0.0.1:8080/products
                </button>
              </div>
            </li>
            <li className="pl-2">
              <strong>Run Chrome without CORS (temporary):</strong>
              <div className="mt-1 ml-4">
                <p className="text-sm">Close all Chrome windows and run:</p>
                <code className="block bg-blue-100 text-blue-900 px-3 py-2 rounded mt-1 text-sm">
                  chrome.exe --disable-web-security --user-data-dir="C:/temp"
                </code>
              </div>
            </li>
            <li className="pl-2">
              <strong>Clear browser cache:</strong>
              <div className="mt-1 ml-4">
                <p className="text-sm">Press Ctrl+Shift+Delete and clear cache/cookies</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
          
          <button
            onClick={handleOpenBackend}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Backend in New Tab
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Reload Page
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Error Details:</h4>
            <pre className="text-sm text-red-700 whitespace-pre-wrap bg-white p-3 rounded border">
              {error}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-green-600 mt-1">
            ✅ {connectionMethod} | {products.length} products loaded
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Backend: ✅ Connected
          </span>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error';
                }}
              />
              {product.aiEnabled && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                  AI Enabled
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                <span className="text-xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>ID: {product.id}</span>
                <span className={`px-2 py-1 rounded ${product.aiEnabled ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                  {product.aiEnabled ? 'AI Enabled' : 'Standard'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}