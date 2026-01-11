'use client';

// /workspaces/website/apps/web/app/[locale]/products/[category]/[slug]/page.tsx
// Description: Dynamic universal product detail page - reads from Firebase public
// Last modified: 2025-12-13
// Related docs: /docs/features/ADMIN_PANEL.md

import { useParams, notFound } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { getEnrichedProductData, EnrichedProduct } from '../../../../../lib/catalogue/publicCatalogueLoader';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import UniversalProductPage from '../../_components/UniversalProductPage';

export default function DynamicProductPage() {
  const { category, slug } = useParams();
  const { language } = useLanguage();

  const [productsData, setProductsData] = useState<Record<string, EnrichedProduct[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products data from Firebase (with local JSON fallback)
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await getEnrichedProductData(language);
        setProductsData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [language]);

  const categoryProducts = productsData[category as string] || [];

  const product = useMemo(() => {
    return categoryProducts.find((p: EnrichedProduct) =>
      p.id === slug ||
      p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug ||
      p.id.replace(/[^a-z0-9]/g, '-') === slug
    );
  }, [categoryProducts, slug]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-zinc-400 hover:text-white underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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