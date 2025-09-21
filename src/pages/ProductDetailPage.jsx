import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Product from '../components/Product';
import { getProductById } from '../data/products';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const product = getProductById(productId);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Product 
      product={product} 
      onBack={handleBack}
    />
  );
};

export default ProductDetailPage;
