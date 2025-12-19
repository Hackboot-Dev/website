// apps/web/app/[locale]/admin/catalogue/CataloguePageClientNew.tsx
// Description: Simplified catalogue page client using extracted components
// Last modified: 2025-12-19

'use client';

import { useState, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

// Hooks
import { useCatalogue, useProductEdit } from './hooks';

// Components
import {
  CatalogueHeader,
  CategoryColumn,
  ProductColumn,
  ProductDetail,
  ProductEditModal,
} from './components';

// Types
import type { Product, ProductTranslation } from './types';

export default function CataloguePageClient() {
  // Selection state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [translationTab, setTranslationTab] = useState<'fr' | 'en'>('fr');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Catalogue hook
  const {
    categories,
    loading,
    error,
    totalProducts,
    addToPendingChanges,
    markForDeletion,
    loadCatalogue,
  } = useCatalogue();

  // Product edit hook
  const productEdit = useProductEdit({
    onSave: useCallback((
      product: Product,
      translations: { fr: ProductTranslation; en: ProductTranslation },
      isNew: boolean
    ) => {
      addToPendingChanges(product.category, product, translations, isNew);
      setSelectedProductId(product.id);
    }, [addToPendingChanges]),
  });

  // Computed values
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedProduct = selectedCategory?.products.find(p => p.id === selectedProductId);

  // Handlers
  const handleSelectCategory = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedProductId(null);
    setShowDeleteConfirm(false);
  }, []);

  const handleSelectProduct = useCallback((productId: string | null) => {
    setSelectedProductId(productId);
    setShowDeleteConfirm(false);
  }, []);

  const handleCreateProduct = useCallback(() => {
    if (selectedCategory) {
      productEdit.openCreateModal(selectedCategory);
    }
  }, [selectedCategory, productEdit]);

  const handleEditProduct = useCallback(() => {
    if (selectedProduct && selectedCategory) {
      productEdit.openEditModal(selectedProduct, selectedCategory);
    }
  }, [selectedProduct, selectedCategory, productEdit]);

  const handleDeleteProduct = useCallback(() => {
    if (selectedProduct && selectedCategory) {
      markForDeletion(selectedCategory.id, selectedProduct.id);
      setSelectedProductId(null);
      setShowDeleteConfirm(false);
    }
  }, [selectedProduct, selectedCategory, markForDeletion]);

  const handleSaveProduct = useCallback(() => {
    if (selectedCategory) {
      productEdit.saveProduct(selectedCategory);
    }
  }, [selectedCategory, productEdit]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  // Error state
  if (error && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => loadCatalogue(true)}
          className="px-4 py-2 border border-zinc-700 text-zinc-300 hover:text-white text-sm"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <CatalogueHeader
        totalProducts={totalProducts}
        categoriesCount={categories.length}
      />

      {/* Columns Container */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Column 1: Categories */}
        <CategoryColumn
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />

        {/* Column 2: Products */}
        <ProductColumn
          category={selectedCategory}
          selectedCategoryId={selectedCategoryId}
          selectedProductId={selectedProductId}
          onSelectProduct={handleSelectProduct}
          onCreateProduct={handleCreateProduct}
        />

        {/* Column 3: Product Detail */}
        <ProductDetail
          product={selectedProduct}
          category={selectedCategory}
          translationTab={translationTab}
          showDeleteConfirm={showDeleteConfirm}
          onTranslationTabChange={setTranslationTab}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onShowDeleteConfirm={setShowDeleteConfirm}
        />
      </div>

      {/* Edit Modal */}
      <ProductEditModal
        isOpen={productEdit.isOpen}
        isCreateMode={productEdit.isCreateMode}
        category={selectedCategory}
        activeTab={productEdit.activeTab}
        onActiveTabChange={productEdit.setActiveTab}
        sectionsSubTab={productEdit.sectionsSubTab}
        onSectionsSubTabChange={productEdit.setSectionsSubTab}
        translationTab={productEdit.translationTab}
        onTranslationTabChange={productEdit.setTranslationTab}
        editingProduct={productEdit.editingProduct}
        editingTranslationsFr={productEdit.editingTranslationsFr}
        editingTranslationsEn={productEdit.editingTranslationsEn}
        editingTechnicalSections={productEdit.editingTechnicalSections}
        editingBenchmarks={productEdit.editingBenchmarks}
        editingSecurity={productEdit.editingSecurity}
        editingFeatures={productEdit.editingFeatures}
        validationErrors={productEdit.validationErrors}
        canSave={productEdit.canSave}
        saveError={productEdit.saveError}
        onClose={productEdit.closeModal}
        onSave={handleSaveProduct}
        onUpdateField={productEdit.updateField}
        onAddSpec={productEdit.addSpec}
        onRemoveSpec={productEdit.removeSpec}
        onRenameSpecKey={productEdit.renameSpecKey}
        getEditingProductSpecs={productEdit.getEditingProductSpecs}
        onUpdateTranslation={productEdit.updateTranslation}
        onAddTranslationArrayItem={productEdit.addTranslationArrayItem}
        onRemoveTranslationArrayItem={productEdit.removeTranslationArrayItem}
        onUpdateTranslationArrayItem={productEdit.updateTranslationArrayItem}
        onAddTechnicalSection={productEdit.addTechnicalSection}
        onRemoveTechnicalSection={productEdit.removeTechnicalSection}
        onUpdateTechnicalSection={productEdit.updateTechnicalSection}
        onAddSpecToSection={productEdit.addSpecToSection}
        onRemoveSpecFromSection={productEdit.removeSpecFromSection}
        onUpdateSpecInSection={productEdit.updateSpecInSection}
        onAddBenchmarkMetric={productEdit.addBenchmarkMetric}
        onRemoveBenchmarkMetric={productEdit.removeBenchmarkMetric}
        onUpdateBenchmarkMetric={productEdit.updateBenchmarkMetric}
        onUpdateBenchmarkField={productEdit.updateBenchmarkField}
        onAddSecurityItem={productEdit.addSecurityItem}
        onRemoveSecurityItem={productEdit.removeSecurityItem}
        onUpdateSecurityItem={productEdit.updateSecurityItem}
        onUpdateSecurityField={productEdit.updateSecurityField}
        onAddFeatureItem={productEdit.addFeatureItem}
        onRemoveFeatureItem={productEdit.removeFeatureItem}
        onUpdateFeatureItem={productEdit.updateFeatureItem}
        onUpdateFeaturesField={productEdit.updateFeaturesField}
      />
    </div>
  );
}
