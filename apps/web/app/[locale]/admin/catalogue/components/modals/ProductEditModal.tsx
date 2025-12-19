// apps/web/app/[locale]/admin/catalogue/components/modals/ProductEditModal.tsx
// Description: Product edit/create modal component
// Last modified: 2025-12-19

'use client';

import { X, Plus, Trash2, ChevronRight, AlertCircle } from 'lucide-react';
import type {
  Product,
  ProductTranslation,
  CategoryData,
  TechnicalSection,
  TechnicalSpec,
  BenchmarksData,
  BenchmarkMetric,
  SecurityData,
  FeaturesData,
  EditModalTab,
  SectionsSubTab,
} from '../../types';

type ProductEditModalProps = {
  isOpen: boolean;
  isCreateMode: boolean;
  category: CategoryData | undefined;

  // Active tabs
  activeTab: EditModalTab;
  onActiveTabChange: (tab: EditModalTab) => void;
  sectionsSubTab: SectionsSubTab;
  onSectionsSubTabChange: (tab: SectionsSubTab) => void;
  translationTab: 'fr' | 'en';
  onTranslationTabChange: (tab: 'fr' | 'en') => void;

  // Editing state
  editingProduct: Product | null;
  editingTranslationsFr: ProductTranslation;
  editingTranslationsEn: ProductTranslation;
  editingTechnicalSections: TechnicalSection[];
  editingBenchmarks: BenchmarksData;
  editingSecurity: SecurityData;
  editingFeatures: FeaturesData;

  // Validation
  validationErrors: string[];
  canSave: boolean;
  saveError: string | null;

  // Actions
  onClose: () => void;
  onSave: () => void;

  // Field updates
  onUpdateField: (field: string, value: unknown) => void;
  onAddSpec: () => void;
  onRemoveSpec: (key: string) => void;
  onRenameSpecKey: (oldKey: string, newKey: string) => void;
  getEditingProductSpecs: () => [string, unknown][];

  // Translation updates
  onUpdateTranslation: (lang: 'fr' | 'en', field: keyof ProductTranslation, value: string | string[]) => void;
  onAddTranslationArrayItem: (lang: 'fr' | 'en', field: 'features' | 'use_cases') => void;
  onRemoveTranslationArrayItem: (lang: 'fr' | 'en', field: 'features' | 'use_cases', index: number) => void;
  onUpdateTranslationArrayItem: (lang: 'fr' | 'en', field: 'features' | 'use_cases', index: number, value: string) => void;

  // Technical sections
  onAddTechnicalSection: () => void;
  onRemoveTechnicalSection: (index: number) => void;
  onUpdateTechnicalSection: (index: number, field: keyof TechnicalSection, value: string | TechnicalSpec[]) => void;
  onAddSpecToSection: (sectionIndex: number) => void;
  onRemoveSpecFromSection: (sectionIndex: number, specIndex: number) => void;
  onUpdateSpecInSection: (sectionIndex: number, specIndex: number, field: keyof TechnicalSpec, value: string) => void;

  // Benchmarks
  onAddBenchmarkMetric: () => void;
  onRemoveBenchmarkMetric: (index: number) => void;
  onUpdateBenchmarkMetric: (index: number, field: keyof BenchmarkMetric, value: string | number) => void;
  onUpdateBenchmarkField: (field: keyof BenchmarksData, value: string) => void;

  // Security
  onAddSecurityItem: () => void;
  onRemoveSecurityItem: (index: number) => void;
  onUpdateSecurityItem: (index: number, lang: 'en' | 'fr', value: string) => void;
  onUpdateSecurityField: (field: keyof SecurityData, value: string) => void;

  // Features
  onAddFeatureItem: () => void;
  onRemoveFeatureItem: (index: number) => void;
  onUpdateFeatureItem: (index: number, lang: 'en' | 'fr', value: string) => void;
  onUpdateFeaturesField: (field: keyof FeaturesData, value: string) => void;
};

export function ProductEditModal({
  isOpen,
  isCreateMode,
  category,
  activeTab,
  onActiveTabChange,
  sectionsSubTab,
  onSectionsSubTabChange,
  translationTab,
  onTranslationTabChange,
  editingProduct,
  editingTranslationsFr,
  editingTranslationsEn,
  editingTechnicalSections,
  editingBenchmarks,
  editingSecurity,
  editingFeatures,
  validationErrors,
  canSave,
  saveError,
  onClose,
  onSave,
  onUpdateField,
  onAddSpec,
  onRemoveSpec,
  onRenameSpecKey,
  getEditingProductSpecs,
  onUpdateTranslation,
  onAddTranslationArrayItem,
  onRemoveTranslationArrayItem,
  onUpdateTranslationArrayItem,
  onAddTechnicalSection,
  onRemoveTechnicalSection,
  onUpdateTechnicalSection,
  onAddSpecToSection,
  onRemoveSpecFromSection,
  onUpdateSpecInSection,
  onAddBenchmarkMetric,
  onRemoveBenchmarkMetric,
  onUpdateBenchmarkMetric,
  onUpdateBenchmarkField,
  onAddSecurityItem,
  onRemoveSecurityItem,
  onUpdateSecurityItem,
  onUpdateSecurityField,
  onAddFeatureItem,
  onRemoveFeatureItem,
  onUpdateFeatureItem,
  onUpdateFeaturesField,
}: ProductEditModalProps) {
  if (!isOpen || !editingProduct) {
    return null;
  }

  const currentEditTranslation = translationTab === 'fr' ? editingTranslationsFr : editingTranslationsEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg w-[90vw] max-w-5xl max-h-[90vh] flex flex-col modal-appear">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 flex-shrink-0">
          <div>
            <h2 className="text-xl font-medium text-white">
              {isCreateMode ? 'Nouveau produit' : 'Modifier le produit'}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {isCreateMode
                ? `Catégorie: ${category?.name || editingProduct.category}`
                : `${editingProduct.name} • ${editingProduct.id}`
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-2 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 flex-shrink-0">
          {(['general', 'specs', 'translations', 'sections'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onActiveTabChange(tab)}
              className={`px-4 py-2 text-sm rounded-t transition-colors ${
                activeTab === tab
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              {tab === 'general' && 'Général'}
              {tab === 'specs' && 'Spécifications'}
              {tab === 'translations' && 'Traductions'}
              {tab === 'sections' && 'Sections page'}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 modal-scrollbar">
          {/* General Tab */}
          {activeTab === 'general' && (
            <GeneralTab
              editingProduct={editingProduct}
              isCreateMode={isCreateMode}
              onUpdateField={onUpdateField}
            />
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <SpecsTab
              specs={getEditingProductSpecs()}
              onAddSpec={onAddSpec}
              onRemoveSpec={onRemoveSpec}
              onRenameSpecKey={onRenameSpecKey}
              onUpdateField={onUpdateField}
            />
          )}

          {/* Translations Tab */}
          {activeTab === 'translations' && (
            <TranslationsTab
              translationTab={translationTab}
              onTranslationTabChange={onTranslationTabChange}
              currentEditTranslation={currentEditTranslation}
              onUpdateTranslation={onUpdateTranslation}
              onAddTranslationArrayItem={onAddTranslationArrayItem}
              onRemoveTranslationArrayItem={onRemoveTranslationArrayItem}
              onUpdateTranslationArrayItem={onUpdateTranslationArrayItem}
            />
          )}

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <SectionsTab
              sectionsSubTab={sectionsSubTab}
              onSectionsSubTabChange={onSectionsSubTabChange}
              editingTechnicalSections={editingTechnicalSections}
              editingBenchmarks={editingBenchmarks}
              editingSecurity={editingSecurity}
              editingFeatures={editingFeatures}
              onAddTechnicalSection={onAddTechnicalSection}
              onRemoveTechnicalSection={onRemoveTechnicalSection}
              onUpdateTechnicalSection={onUpdateTechnicalSection}
              onAddSpecToSection={onAddSpecToSection}
              onRemoveSpecFromSection={onRemoveSpecFromSection}
              onUpdateSpecInSection={onUpdateSpecInSection}
              onAddBenchmarkMetric={onAddBenchmarkMetric}
              onRemoveBenchmarkMetric={onRemoveBenchmarkMetric}
              onUpdateBenchmarkMetric={onUpdateBenchmarkMetric}
              onUpdateBenchmarkField={onUpdateBenchmarkField}
              onAddSecurityItem={onAddSecurityItem}
              onRemoveSecurityItem={onRemoveSecurityItem}
              onUpdateSecurityItem={onUpdateSecurityItem}
              onUpdateSecurityField={onUpdateSecurityField}
              onAddFeatureItem={onAddFeatureItem}
              onRemoveFeatureItem={onRemoveFeatureItem}
              onUpdateFeatureItem={onUpdateFeatureItem}
              onUpdateFeaturesField={onUpdateFeaturesField}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-zinc-800 flex-shrink-0">
          <div className="flex-1">
            {saveError ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-xs text-red-400">{saveError}</span>
              </div>
            ) : validationErrors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {validationErrors.map((error, idx) => (
                  <span key={idx} className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                    {error}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-xs">
                {isCreateMode
                  ? 'Prêt à créer le produit'
                  : 'Prêt à sauvegarder les modifications'
                }
              </p>
            )}
          </div>
          <div className="flex gap-3 ml-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onSave}
              disabled={!canSave}
              className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                canSave
                  ? 'bg-white text-zinc-900 hover:bg-zinc-200 cursor-pointer'
                  : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {isCreateMode ? 'Créer' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for tabs

type GeneralTabProps = {
  editingProduct: Product;
  isCreateMode: boolean;
  onUpdateField: (field: string, value: unknown) => void;
};

function GeneralTab({ editingProduct, isCreateMode, onUpdateField }: GeneralTabProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Nom du produit</label>
          <input
            type="text"
            value={editingProduct.name || ''}
            onChange={(e) => onUpdateField('name', e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">
            ID {!isCreateMode && '(non modifiable)'}
          </label>
          <input
            type="text"
            value={editingProduct.id}
            onChange={(e) => isCreateMode && onUpdateField('id', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
            disabled={!isCreateMode}
            placeholder={isCreateMode ? 'ex: vpsnano, gpu-a100' : ''}
            className={`w-full px-4 py-3 rounded ${
              isCreateMode
                ? 'bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 focus:outline-none'
                : 'bg-zinc-800/50 border border-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          />
          {isCreateMode && (
            <p className="text-zinc-600 text-xs mt-1">Minuscules, chiffres, tirets uniquement</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Catégorie</label>
          <input
            type="text"
            value={editingProduct.category || ''}
            disabled
            className="w-full bg-zinc-800/50 border border-zinc-800 text-zinc-500 px-4 py-3 rounded cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Tier</label>
          <div className="relative">
            <select
              value={editingProduct.tier || ''}
              onChange={(e) => onUpdateField('tier', e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="business">Business</option>
              <option value="enterprise">Enterprise</option>
              <option value="premium">Premium</option>
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 rotate-90 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-white text-sm font-medium mb-4">Tarification</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PriceInput
            label="Mensuel (€)"
            value={editingProduct.monthly}
            onChange={(v) => onUpdateField('monthly', v)}
            color="emerald"
            step="0.01"
          />
          <PriceInput
            label="Horaire (€)"
            value={editingProduct.hourly}
            onChange={(v) => onUpdateField('hourly', v)}
            color="blue"
            step="0.0001"
          />
          <PriceInput
            label="Annuel (€)"
            value={editingProduct.annual}
            onChange={(v) => onUpdateField('annual', v)}
            color="violet"
            step="0.01"
          />
          <PriceInput
            label="Par GB/mois (€)"
            value={editingProduct.price_per_gb_month}
            onChange={(v) => onUpdateField('price_per_gb_month', v)}
            color="amber"
            step="0.0001"
          />
        </div>
      </div>
    </div>
  );
}

type PriceInputProps = {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  color: 'emerald' | 'blue' | 'violet' | 'amber';
  step: string;
};

function PriceInput({ label, value, onChange, color, step }: PriceInputProps) {
  const colorClasses = {
    emerald: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 border-b-emerald-500/30 focus:border-emerald-400',
    blue: 'bg-blue-500/5 border-blue-500/20 text-blue-400 border-b-blue-500/30 focus:border-blue-400',
    violet: 'bg-violet-500/5 border-violet-500/20 text-violet-400 border-b-violet-500/30 focus:border-violet-400',
    amber: 'bg-amber-500/5 border-amber-500/20 text-amber-400 border-b-amber-500/30 focus:border-amber-400',
  };

  return (
    <div className={`p-4 rounded border ${colorClasses[color].split(' ').slice(0, 2).join(' ')}`}>
      <label className={`block text-xs uppercase tracking-wider mb-2 ${colorClasses[color].split(' ')[2]}`}>
        {label}
      </label>
      <input
        type="number"
        step={step}
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
        placeholder="—"
        className={`w-full bg-transparent border-0 border-b text-white text-xl font-light px-0 py-2 focus:outline-none transition-colors placeholder:text-zinc-600 ${colorClasses[color].split(' ').slice(3).join(' ')}`}
      />
    </div>
  );
}

type SpecsTabProps = {
  specs: [string, unknown][];
  onAddSpec: () => void;
  onRemoveSpec: (key: string) => void;
  onRenameSpecKey: (oldKey: string, newKey: string) => void;
  onUpdateField: (field: string, value: unknown) => void;
};

function SpecsTab({ specs, onAddSpec, onRemoveSpec, onRenameSpecKey, onUpdateField }: SpecsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-sm font-medium">Spécifications techniques</h3>
        <button
          onClick={onAddSpec}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      <div className="space-y-2">
        {specs.map(([key, value]) => (
          <div key={key} className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-800 p-3 rounded group">
            <input
              type="text"
              value={key}
              onChange={(e) => onRenameSpecKey(key, e.target.value)}
              className="flex-1 bg-transparent border-0 border-b border-transparent hover:border-zinc-600 focus:border-zinc-500 text-zinc-400 px-0 py-1 focus:outline-none transition-colors"
              placeholder="Clé"
            />
            <span className="text-zinc-600">:</span>
            <input
              type="text"
              value={typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)}
              onChange={(e) => {
                let newValue: unknown = e.target.value;
                if (e.target.value === 'true') newValue = true;
                else if (e.target.value === 'false') newValue = false;
                else if (!isNaN(Number(e.target.value)) && e.target.value !== '') newValue = Number(e.target.value);
                onUpdateField(key, newValue);
              }}
              className="flex-1 bg-transparent border-0 border-b border-transparent hover:border-zinc-600 focus:border-zinc-500 text-white px-0 py-1 focus:outline-none transition-colors"
              placeholder="Valeur"
            />
            <button
              onClick={() => onRemoveSpec(key)}
              className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {specs.length === 0 && (
          <div className="text-center py-8 text-zinc-600">
            <p>Aucune spécification</p>
            <p className="text-xs mt-1">Cliquez sur "Ajouter" pour créer une spécification</p>
          </div>
        )}
      </div>
    </div>
  );
}

type TranslationsTabProps = {
  translationTab: 'fr' | 'en';
  onTranslationTabChange: (tab: 'fr' | 'en') => void;
  currentEditTranslation: ProductTranslation;
  onUpdateTranslation: (lang: 'fr' | 'en', field: keyof ProductTranslation, value: string | string[]) => void;
  onAddTranslationArrayItem: (lang: 'fr' | 'en', field: 'features' | 'use_cases') => void;
  onRemoveTranslationArrayItem: (lang: 'fr' | 'en', field: 'features' | 'use_cases', index: number) => void;
  onUpdateTranslationArrayItem: (lang: 'fr' | 'en', field: 'features' | 'use_cases', index: number, value: string) => void;
};

function TranslationsTab({
  translationTab,
  onTranslationTabChange,
  currentEditTranslation,
  onUpdateTranslation,
  onAddTranslationArrayItem,
  onRemoveTranslationArrayItem,
  onUpdateTranslationArrayItem,
}: TranslationsTabProps) {
  const lang = translationTab;

  return (
    <div className="space-y-6">
      {/* Language selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => onTranslationTabChange('fr')}
          className={`px-4 py-2 text-sm rounded transition-colors ${
            translationTab === 'fr'
              ? 'bg-white text-zinc-900'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Français
        </button>
        <button
          onClick={() => onTranslationTabChange('en')}
          className={`px-4 py-2 text-sm rounded transition-colors ${
            translationTab === 'en'
              ? 'bg-white text-zinc-900'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          English
        </button>
      </div>

      {/* Translation fields */}
      <div className="space-y-6">
        {/* Usage */}
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Usage</label>
          <input
            type="text"
            value={currentEditTranslation.usage || ''}
            onChange={(e) => onUpdateTranslation(lang, 'usage', e.target.value)}
            placeholder={lang === 'fr' ? 'Ex: Serveur de production' : 'Ex: Production server'}
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Description</label>
          <textarea
            value={currentEditTranslation.description || ''}
            onChange={(e) => onUpdateTranslation(lang, 'description', e.target.value)}
            placeholder={lang === 'fr' ? 'Description détaillée du produit...' : 'Detailed product description...'}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors resize-none placeholder:text-zinc-600"
          />
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Public cible</label>
          <input
            type="text"
            value={currentEditTranslation.target_audience || ''}
            onChange={(e) => onUpdateTranslation(lang, 'target_audience', e.target.value)}
            placeholder={lang === 'fr' ? 'Ex: Développeurs, PME' : 'Ex: Developers, SMBs'}
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
          />
        </div>

        {/* Highlight */}
        <div>
          <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Highlight</label>
          <input
            type="text"
            value={currentEditTranslation.highlight || ''}
            onChange={(e) => onUpdateTranslation(lang, 'highlight', e.target.value)}
            placeholder={lang === 'fr' ? 'Ex: Meilleur rapport qualité/prix' : 'Ex: Best value for money'}
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
          />
        </div>

        {/* Features */}
        <ArrayField
          label="Features"
          items={currentEditTranslation.features || []}
          onAdd={() => onAddTranslationArrayItem(lang, 'features')}
          onRemove={(idx) => onRemoveTranslationArrayItem(lang, 'features', idx)}
          onUpdate={(idx, value) => onUpdateTranslationArrayItem(lang, 'features', idx, value)}
        />

        {/* Use Cases */}
        <ArrayField
          label="Cas d'usage"
          items={currentEditTranslation.use_cases || []}
          onAdd={() => onAddTranslationArrayItem(lang, 'use_cases')}
          onRemove={(idx) => onRemoveTranslationArrayItem(lang, 'use_cases', idx)}
          onUpdate={(idx, value) => onUpdateTranslationArrayItem(lang, 'use_cases', idx, value)}
        />
      </div>
    </div>
  );
}

type ArrayFieldProps = {
  label: string;
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
};

function ArrayField({ label, items, onAdd, onRemove, onUpdate }: ArrayFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-zinc-400 text-xs uppercase tracking-wider">{label}</label>
        <button
          onClick={onAdd}
          className="text-zinc-500 hover:text-white text-xs flex items-center gap-1"
        >
          <Plus className="h-3 w-3" /> Ajouter
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <span className="text-zinc-600 text-sm w-6">{idx + 1}.</span>
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdate(idx, e.target.value)}
              className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded focus:border-zinc-500 focus:outline-none transition-colors text-sm"
            />
            <button
              onClick={() => onRemove(idx)}
              className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-zinc-600 text-xs">Aucun élément</p>
        )}
      </div>
    </div>
  );
}

// Sections Tab is split into a separate file due to complexity
// Import it from ./SectionsTab.tsx

type SectionsTabProps = {
  sectionsSubTab: SectionsSubTab;
  onSectionsSubTabChange: (tab: SectionsSubTab) => void;
  editingTechnicalSections: TechnicalSection[];
  editingBenchmarks: BenchmarksData;
  editingSecurity: SecurityData;
  editingFeatures: FeaturesData;
  onAddTechnicalSection: () => void;
  onRemoveTechnicalSection: (index: number) => void;
  onUpdateTechnicalSection: (index: number, field: keyof TechnicalSection, value: string | TechnicalSpec[]) => void;
  onAddSpecToSection: (sectionIndex: number) => void;
  onRemoveSpecFromSection: (sectionIndex: number, specIndex: number) => void;
  onUpdateSpecInSection: (sectionIndex: number, specIndex: number, field: keyof TechnicalSpec, value: string) => void;
  onAddBenchmarkMetric: () => void;
  onRemoveBenchmarkMetric: (index: number) => void;
  onUpdateBenchmarkMetric: (index: number, field: keyof BenchmarkMetric, value: string | number) => void;
  onUpdateBenchmarkField: (field: keyof BenchmarksData, value: string) => void;
  onAddSecurityItem: () => void;
  onRemoveSecurityItem: (index: number) => void;
  onUpdateSecurityItem: (index: number, lang: 'en' | 'fr', value: string) => void;
  onUpdateSecurityField: (field: keyof SecurityData, value: string) => void;
  onAddFeatureItem: () => void;
  onRemoveFeatureItem: (index: number) => void;
  onUpdateFeatureItem: (index: number, lang: 'en' | 'fr', value: string) => void;
  onUpdateFeaturesField: (field: keyof FeaturesData, value: string) => void;
};

function SectionsTab({
  sectionsSubTab,
  onSectionsSubTabChange,
  editingTechnicalSections,
  editingBenchmarks,
  editingSecurity,
  editingFeatures,
  onAddTechnicalSection,
  onRemoveTechnicalSection,
  onUpdateTechnicalSection,
  onAddSpecToSection,
  onRemoveSpecFromSection,
  onUpdateSpecInSection,
  onAddBenchmarkMetric,
  onRemoveBenchmarkMetric,
  onUpdateBenchmarkMetric,
  onUpdateBenchmarkField,
  onAddSecurityItem,
  onRemoveSecurityItem,
  onUpdateSecurityItem,
  onUpdateSecurityField,
  onAddFeatureItem,
  onRemoveFeatureItem,
  onUpdateFeatureItem,
  onUpdateFeaturesField,
}: SectionsTabProps) {
  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-4">
        {(['technical', 'benchmarks', 'security', 'features'] as const).map((subTab) => (
          <button
            key={subTab}
            onClick={() => onSectionsSubTabChange(subTab)}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              sectionsSubTab === subTab
                ? 'bg-white text-zinc-900'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {subTab === 'technical' && 'Specs techniques'}
            {subTab === 'benchmarks' && 'Benchmarks'}
            {subTab === 'security' && 'Sécurité'}
            {subTab === 'features' && 'Features'}
          </button>
        ))}
      </div>

      {/* Technical Sections Editor */}
      {sectionsSubTab === 'technical' && (
        <TechnicalSectionsEditor
          sections={editingTechnicalSections}
          onAddSection={onAddTechnicalSection}
          onRemoveSection={onRemoveTechnicalSection}
          onUpdateSection={onUpdateTechnicalSection}
          onAddSpec={onAddSpecToSection}
          onRemoveSpec={onRemoveSpecFromSection}
          onUpdateSpec={onUpdateSpecInSection}
        />
      )}

      {/* Benchmarks Editor */}
      {sectionsSubTab === 'benchmarks' && (
        <BenchmarksEditor
          benchmarks={editingBenchmarks}
          onAddMetric={onAddBenchmarkMetric}
          onRemoveMetric={onRemoveBenchmarkMetric}
          onUpdateMetric={onUpdateBenchmarkMetric}
          onUpdateField={onUpdateBenchmarkField}
        />
      )}

      {/* Security Editor */}
      {sectionsSubTab === 'security' && (
        <SecurityEditor
          security={editingSecurity}
          onAddItem={onAddSecurityItem}
          onRemoveItem={onRemoveSecurityItem}
          onUpdateItem={onUpdateSecurityItem}
          onUpdateField={onUpdateSecurityField}
        />
      )}

      {/* Features Editor */}
      {sectionsSubTab === 'features' && (
        <FeaturesEditor
          features={editingFeatures}
          onAddItem={onAddFeatureItem}
          onRemoveItem={onRemoveFeatureItem}
          onUpdateItem={onUpdateFeatureItem}
          onUpdateField={onUpdateFeaturesField}
        />
      )}
    </div>
  );
}

// Technical Sections Editor
type TechnicalSectionsEditorProps = {
  sections: TechnicalSection[];
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
  onUpdateSection: (index: number, field: keyof TechnicalSection, value: string | TechnicalSpec[]) => void;
  onAddSpec: (sectionIndex: number) => void;
  onRemoveSpec: (sectionIndex: number, specIndex: number) => void;
  onUpdateSpec: (sectionIndex: number, specIndex: number, field: keyof TechnicalSpec, value: string) => void;
};

function TechnicalSectionsEditor({
  sections,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
  onAddSpec,
  onRemoveSpec,
  onUpdateSpec,
}: TechnicalSectionsEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm font-medium">Spécifications techniques</h3>
          <p className="text-zinc-500 text-xs">Cartes affichées sur la page produit</p>
        </div>
        <button
          onClick={onAddSection}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter section
        </button>
      </div>

      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 text-xs mb-1">Nom (EN)</label>
                <input
                  type="text"
                  value={section.category}
                  onChange={(e) => onUpdateSection(sectionIdx, 'category', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-xs mb-1">Nom (FR)</label>
                <input
                  type="text"
                  value={section.category_fr || ''}
                  onChange={(e) => onUpdateSection(sectionIdx, 'category_fr', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => onRemoveSection(sectionIdx)}
              className="text-zinc-600 hover:text-red-400 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-xs">Spécifications ({section.specs.length})</span>
              <button
                onClick={() => onAddSpec(sectionIdx)}
                className="text-zinc-500 hover:text-white text-xs flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Ajouter
              </button>
            </div>
            {section.specs.map((spec, specIdx) => (
              <div key={specIdx} className="grid grid-cols-4 gap-2 items-center group">
                <input
                  type="text"
                  value={spec.name}
                  onChange={(e) => onUpdateSpec(sectionIdx, specIdx, 'name', e.target.value)}
                  placeholder="Nom EN"
                  className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={spec.name_fr || ''}
                  onChange={(e) => onUpdateSpec(sectionIdx, specIdx, 'name_fr', e.target.value)}
                  placeholder="Nom FR"
                  className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => onUpdateSpec(sectionIdx, specIdx, 'value', e.target.value)}
                  placeholder="Valeur EN"
                  className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={spec.value_fr || ''}
                    onChange={(e) => onUpdateSpec(sectionIdx, specIdx, 'value_fr', e.target.value)}
                    placeholder="Valeur FR"
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
                  />
                  <button
                    onClick={() => onRemoveSpec(sectionIdx, specIdx)}
                    className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {sections.length === 0 && (
        <div className="text-center py-8 text-zinc-600">
          <p>Aucune section technique</p>
        </div>
      )}
    </div>
  );
}

// Benchmarks Editor
type BenchmarksEditorProps = {
  benchmarks: BenchmarksData;
  onAddMetric: () => void;
  onRemoveMetric: (index: number) => void;
  onUpdateMetric: (index: number, field: keyof BenchmarkMetric, value: string | number) => void;
  onUpdateField: (field: keyof BenchmarksData, value: string) => void;
};

function BenchmarksEditor({
  benchmarks,
  onAddMetric,
  onRemoveMetric,
  onUpdateMetric,
  onUpdateField,
}: BenchmarksEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm font-medium">Benchmarks de performance</h3>
          <p className="text-zinc-500 text-xs">Métriques affichées dans la section "Benchmarks"</p>
        </div>
        <button
          onClick={onAddMetric}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter métrique
        </button>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-2 gap-4 bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
        <div>
          <label className="block text-zinc-500 text-xs mb-1">Titre section (EN)</label>
          <input
            type="text"
            value={benchmarks.title || ''}
            onChange={(e) => onUpdateField('title', e.target.value)}
            placeholder="Performance Benchmarks"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-zinc-500 text-xs mb-1">Titre section (FR)</label>
          <input
            type="text"
            value={benchmarks.title_fr || ''}
            onChange={(e) => onUpdateField('title_fr', e.target.value)}
            placeholder="Benchmarks de Performance"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-zinc-500 text-xs mb-1">Sous-titre (EN)</label>
          <input
            type="text"
            value={benchmarks.subtitle || ''}
            onChange={(e) => onUpdateField('subtitle', e.target.value)}
            placeholder="Real-world metrics"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-zinc-500 text-xs mb-1">Sous-titre (FR)</label>
          <input
            type="text"
            value={benchmarks.subtitle_fr || ''}
            onChange={(e) => onUpdateField('subtitle_fr', e.target.value)}
            placeholder="Métriques réelles"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-2">
        {benchmarks.metrics.map((metric, idx) => (
          <div key={idx} className="bg-zinc-800/30 border border-zinc-800 rounded p-3 group">
            <div className="grid grid-cols-6 gap-2 items-center">
              <input
                type="text"
                value={metric.name}
                onChange={(e) => onUpdateMetric(idx, 'name', e.target.value)}
                placeholder="Nom EN"
                className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
              />
              <input
                type="number"
                value={metric.value}
                onChange={(e) => onUpdateMetric(idx, 'value', parseFloat(e.target.value) || 0)}
                placeholder="Valeur"
                className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
              />
              <input
                type="text"
                value={metric.unit}
                onChange={(e) => onUpdateMetric(idx, 'unit', e.target.value)}
                placeholder="Unité"
                className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none"
              />
              <input
                type="text"
                value={metric.comparison}
                onChange={(e) => onUpdateMetric(idx, 'comparison', e.target.value)}
                placeholder="Comparaison"
                className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded text-xs focus:border-zinc-500 focus:outline-none col-span-2"
              />
              <button
                onClick={() => onRemoveMetric(idx)}
                className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity justify-self-end"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {benchmarks.metrics.length === 0 && (
        <div className="text-center py-8 text-zinc-600">
          <p>Aucun benchmark</p>
        </div>
      )}
    </div>
  );
}

// Security Editor
type SecurityEditorProps = {
  security: SecurityData;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, lang: 'en' | 'fr', value: string) => void;
  onUpdateField: (field: keyof SecurityData, value: string) => void;
};

function SecurityEditor({
  security,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onUpdateField,
}: SecurityEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm font-medium">Sécurité & Conformité</h3>
          <p className="text-zinc-500 text-xs">Liste des features sécurité affichées</p>
        </div>
        <button
          onClick={onAddItem}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-2 gap-4 bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
        <div>
          <label className="block text-zinc-500 text-xs mb-1">Titre (EN)</label>
          <input
            type="text"
            value={security.title || ''}
            onChange={(e) => onUpdateField('title', e.target.value)}
            placeholder="Security & Compliance"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-zinc-500 text-xs mb-1">Titre (FR)</label>
          <input
            type="text"
            value={security.title_fr || ''}
            onChange={(e) => onUpdateField('title_fr', e.target.value)}
            placeholder="Sécurité & Conformité"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {security.items.map((item, idx) => {
          const itemObj = typeof item === 'string' ? { en: item, fr: item } : item;
          return (
            <div key={idx} className="grid grid-cols-2 gap-2 items-center group">
              <input
                type="text"
                value={itemObj.en}
                onChange={(e) => onUpdateItem(idx, 'en', e.target.value)}
                placeholder="English"
                className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={itemObj.fr}
                  onChange={(e) => onUpdateItem(idx, 'fr', e.target.value)}
                  placeholder="Français"
                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                />
                <button
                  onClick={() => onRemoveItem(idx)}
                  className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {security.items.length === 0 && (
        <div className="text-center py-8 text-zinc-600">
          <p>Aucun élément de sécurité</p>
        </div>
      )}
    </div>
  );
}

// Features Editor
type FeaturesEditorProps = {
  features: FeaturesData;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, lang: 'en' | 'fr', value: string) => void;
  onUpdateField: (field: keyof FeaturesData, value: string) => void;
};

function FeaturesEditor({
  features,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onUpdateField,
}: FeaturesEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm font-medium">Fonctionnalités</h3>
          <p className="text-zinc-500 text-xs">Liste des fonctionnalités du produit</p>
        </div>
        <button
          onClick={onAddItem}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-2 gap-4 bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
        <div>
          <label className="block text-zinc-500 text-xs mb-1">Titre (EN)</label>
          <input
            type="text"
            value={features.title || ''}
            onChange={(e) => onUpdateField('title', e.target.value)}
            placeholder="Features"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-zinc-500 text-xs mb-1">Titre (FR)</label>
          <input
            type="text"
            value={features.title_fr || ''}
            onChange={(e) => onUpdateField('title_fr', e.target.value)}
            placeholder="Fonctionnalités"
            className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {features.items.map((item, idx) => {
          const itemObj = typeof item === 'string' ? { en: item, fr: item } : item;
          return (
            <div key={idx} className="grid grid-cols-2 gap-2 items-center group">
              <input
                type="text"
                value={itemObj.en}
                onChange={(e) => onUpdateItem(idx, 'en', e.target.value)}
                placeholder="English"
                className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={itemObj.fr}
                  onChange={(e) => onUpdateItem(idx, 'fr', e.target.value)}
                  placeholder="Français"
                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:border-zinc-500 focus:outline-none"
                />
                <button
                  onClick={() => onRemoveItem(idx)}
                  className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {features.items.length === 0 && (
        <div className="text-center py-8 text-zinc-600">
          <p>Aucune fonctionnalité</p>
        </div>
      )}
    </div>
  );
}
