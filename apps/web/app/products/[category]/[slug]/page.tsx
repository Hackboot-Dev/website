'use client';

// /workspaces/website/apps/web/app/products/[category]/[slug]/page.tsx
// Description: Dynamic universal product detail page
// Last modified: 2025-08-26

import { useParams, notFound } from 'next/navigation';
import { useMemo } from 'react';
import { getEnrichedProductData } from '../../../../utils/productDataLoader';
import { useLanguage } from '../../../../contexts/LanguageContext';
import UniversalProductPage from '../../_components/UniversalProductPage';

export default function DynamicProductPage() {
  const { category, slug } = useParams();
  const { language } = useLanguage();

  // Log pour confirmer qu'on utilise la nouvelle page universelle
  console.log('🚀 NOUVELLE PAGE UNIVERSELLE ACTIVE', { 
    category, 
    slug, 
    language,
    timestamp: new Date().toISOString() 
  });

  const productsData = getEnrichedProductData(language);
  const categoryProducts = productsData[category as string] || [];
  
  const product = useMemo(() => {
    return categoryProducts.find((p: any) => 
      p.id === slug || 
      p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug ||
      p.id.replace(/[^a-z0-9]/g, '-') === slug
    );
  }, [categoryProducts, slug]);

  if (!product) {
    notFound();
  }

  return (
    <UniversalProductPage 
      product={product} 
      category={category as string}
      allProducts={categoryProducts} 
    />
  );
}