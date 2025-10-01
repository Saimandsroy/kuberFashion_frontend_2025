import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/hero';
import FeaturedCategories from '../components/FeaturedCategories';
import ProductRibbon from '../components/ProductRibbon';
import { getFeaturedProducts, fetchProducts } from '../data/products';
import { productsAPI } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load featured products
        const featured = await getFeaturedProducts();
        setFeaturedProducts(featured);

        // Load all products for other sections
        const allProducts = await fetchProducts();
        
        // Get top-rated products for "Inspired by Your Interest"
        try {
          const topRatedResponse = await productsAPI.getTopRated();
          setLikedProducts(topRatedResponse.data.data?.slice(0, 6) || allProducts.slice(0, 6));
        } catch (err) {
          setLikedProducts(allProducts.slice(0, 6));
        }

        // Get newest products for "Trending Now"
        try {
          const newestResponse = await productsAPI.getNewest();
          setTrendingProducts(newestResponse.data.data?.slice(0, 6) || allProducts.slice(2, 8));
        } catch (err) {
          setTrendingProducts(allProducts.slice(2, 8));
        }

      } catch (err) {
        console.error('Error loading homepage products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      {/* Reduced spacing between sections */}
      <div className="space-y-4 sm:space-y-6">
        <FeaturedCategories />
        
        <ProductRibbon 
          products={featuredProducts} 
          title="Top Products"
          showTitle={true}
          loading={loading}
        />
        
        <ProductRibbon 
          products={likedProducts} 
          title="Inspired by Your Interest"
          showTitle={true}
          loading={loading}
        />
        
        <ProductRibbon 
          products={trendingProducts} 
          title="Trending Now"
          showTitle={true}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default HomePage;
