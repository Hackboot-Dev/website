// apps/web/app/[locale]/admin/catalogue/components/layout/CatalogueHeader.tsx
// Description: Catalogue page header component
// Last modified: 2025-12-19

'use client';

type CatalogueHeaderProps = {
  totalProducts: number;
  categoriesCount: number;
};

export function CatalogueHeader({ totalProducts, categoriesCount }: CatalogueHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 flex-shrink-0">
      <div>
        <h1 className="text-xl font-light text-white">Catalogue Produits</h1>
        <p className="text-zinc-500 text-sm">
          {totalProducts} produits • {categoriesCount} catégories
        </p>
      </div>
    </div>
  );
}
