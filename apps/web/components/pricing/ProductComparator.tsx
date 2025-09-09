'use client';

// /workspaces/website/apps/web/components/pricing/ProductComparator.tsx
// Description: Product comparator component for pricing page
// Last modified: 2025-08-27
// Related docs: /docs/JOURNAL.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

import '../../styles/custom-select.css';
import React, { useState, useMemo } from 'react';
import productsData from '../../data/products/base.json';
import { getCategoryIcon } from '../../components/ui/Icons';
import Badge from '../../components/ui/Badge';

interface ProductComparatorProps {
  translations: any;
  locale: string;
}

export default function ProductComparator({ translations, locale }: ProductComparatorProps) {
  const t = translations.comparator || {};
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [product1Id, setProduct1Id] = useState<string>('');
  const [product2Id, setProduct2Id] = useState<string>('');

  // Flatten all products from all categories
  const allProducts = useMemo(() => {
    const products = [];
    for (const category in productsData) {
      if (Array.isArray(productsData[category])) {
        products.push(...productsData[category]);
      }
    }
    return products;
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    return Object.keys(productsData).filter(key => Array.isArray(productsData[key]));
  }, []);

  // Get products for selected category
  const categoryProducts = useMemo(() => {
    if (!selectedCategory || !productsData[selectedCategory]) return [];
    return productsData[selectedCategory];
  }, [selectedCategory]);

  // Get selected products
  const product1 = allProducts.find(p => p.id === product1Id);
  const product2 = allProducts.find(p => p.id === product2Id);

  // Calculate break-even point
  const calculateBreakEven = (hourlyPrice: number, monthlyPrice: number) => {
    return monthlyPrice / hourlyPrice;
  };

  // Calculate annual savings
  const calculateAnnualSavings = (monthlyPrice: number, annualPrice: number) => {
    return (monthlyPrice * 12) - annualPrice;
  };

  const handleReset = () => {
    setSelectedCategory('');
    setProduct1Id('');
    setProduct2Id('');
  };

  return (
    <div className="w-full overflow-x-hidden">

      {/* Category Selection - More visual */}
      <div className="mb-8 sm:mb-12 px-4">
        <p className="text-center text-zinc-400 mb-4 sm:mb-6 text-sm sm:text-base">{t.selectCategory || 'First choose a product category'}</p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setProduct1Id('');
                setProduct2Id('');
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white scale-105'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                {getCategoryIcon(cat, { size: 'sm' })}
                <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Product Selection - Card based */}
      {selectedCategory && (
        <div className="mb-8 sm:mb-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Product 1 Selection */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">{t.firstProduct || 'First product'}</h3>
                <Badge variant="primary">1</Badge>
              </div>
              <select
                value={product1Id}
                onChange={(e) => setProduct1Id(e.target.value)}
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                className="custom-select w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-white"
              >
                <option value="">{t.selectProduct || 'Select a product'}</option>
                {categoryProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.vcpu || product.cpu} / {product.ram} / {product.storage}
                  </option>
                ))}
              </select>
            </div>

            {/* Product 2 Selection */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">{t.secondProduct || 'Second product'}</h3>
                <Badge variant="secondary">2</Badge>
              </div>
              <select
                value={product2Id}
                onChange={(e) => setProduct2Id(e.target.value)}
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                className="custom-select w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-white"
              >
                <option value="">{t.selectProduct || 'Select a product'}</option>
                {categoryProducts.filter(p => p.id !== product1Id).map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.vcpu || product.cpu} / {product.ram} / {product.storage}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Comparison */}
      {product1 && product2 && (
        <div className="space-y-6 sm:space-y-8 px-4">
          {/* Comparison Table */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-zinc-800">
            <h3 className="text-xl sm:text-2xl font-light text-white mb-4 sm:mb-8 text-center">{t.comparison || 'Detailed comparison'}</h3>

            <div className="overflow-x-auto max-w-full">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 sm:py-4 text-xs sm:text-sm">{t.specs || 'Specifications'}</th>
                    <th className="text-center py-2 sm:py-4 text-xs sm:text-sm">
                      <div className="flex items-center justify-center gap-2">
                        {getCategoryIcon(product1.category, { size: 'sm' })}
                        <span>{product1.name}</span>
                      </div>
                    </th>
                    <th className="text-center py-2 sm:py-4 text-xs sm:text-sm">
                      <div className="flex items-center justify-center gap-2">
                        {getCategoryIcon(product2.category, { size: 'sm' })}
                        <span>{product2.name}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* CPU */}
                  {(product1.vcpu || product2.vcpu) && (
                    <tr className="border-b border-white/5">
                      <td className="py-2 sm:py-4 text-gray-400 text-xs sm:text-sm">{t.features?.cpu || 'CPU'}</td>
                      <td className="text-center py-2 sm:py-4 text-xs sm:text-sm">{product1.vcpu}</td>
                      <td className="text-center py-2 sm:py-4 text-xs sm:text-sm">{product2.vcpu}</td>
                    </tr>
                  )}

                  {/* RAM */}
                  <tr className="border-b border-white/5">
                    <td className="py-4 text-gray-400">{t.features?.ram || 'RAM'}</td>
                    <td className="text-center py-4">{product1.ram}</td>
                    <td className="text-center py-4">{product2.ram}</td>
                  </tr>

                  {/* Storage */}
                  <tr className="border-b border-white/5">
                    <td className="py-4 text-gray-400">{t.features?.storage || 'Storage'}</td>
                    <td className="text-center py-4">{product1.storage}</td>
                    <td className="text-center py-4">{product2.storage}</td>
                  </tr>

                  {/* Bandwidth */}
                  {(product1.bandwidth || product2.bandwidth) && (
                    <tr className="border-b border-white/5">
                      <td className="py-2 sm:py-4 text-gray-400 text-xs sm:text-sm">{t.features?.bandwidth || 'Bandwidth'}</td>
                      <td className="text-center py-2 sm:py-4 text-xs sm:text-sm">{product1.bandwidth}</td>
                      <td className="text-center py-2 sm:py-4 text-xs sm:text-sm">{product2.bandwidth}</td>
                    </tr>
                  )}

                  {/* Pricing */}
                  <tr className="border-b border-white/5">
                    <td className="py-4 text-gray-400">{t.pricing || 'Pricing'}</td>
                    <td className="text-center py-4">
                      <div className="space-y-1">
                        {product1.hourly && (
                          <div className="text-sm">
                            <span className="text-cyan-400">€{product1.hourly}{t.perHour || '/h'}</span>
                          </div>
                        )}
                        {product1.monthly && (
                          <div className="text-sm">
                            <span className="text-green-400">€{product1.monthly}{t.perMonth || '/month'}</span>
                          </div>
                        )}
                        {product1.annual && (
                          <div className="text-sm">
                            <span className="text-purple-400">€{product1.annual}{t.perYearShort || '/year'}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-4">
                      <div className="space-y-1">
                        {product2.hourly && (
                          <div className="text-sm">
                            <span className="text-cyan-400">€{product2.hourly}{t.perHour || '/h'}</span>
                          </div>
                        )}
                        {product2.monthly && (
                          <div className="text-sm">
                            <span className="text-green-400">€{product2.monthly}{t.perMonth || '/month'}</span>
                          </div>
                        )}
                        {product2.annual && (
                          <div className="text-sm">
                            <span className="text-purple-400">€{product2.annual}{t.perYearShort || '/year'}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Break-even Analysis */}
          {product1.hourly && product1.monthly && (
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10">
              <h3 className="text-lg sm:text-xl font-bold mb-4">{t.breakeven || 'Break-even analysis'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 mb-2">{product1.name}</p>
                  <p className="text-2xl font-bold">
                    {Math.round(calculateBreakEven(product1.hourly, product1.monthly))} {t.hours || 'heures'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {t.breakevenHours || 'to equal monthly rate'}
                  </p>
                </div>
                {product2.hourly && product2.monthly && (
                  <div>
                    <p className="text-gray-400 mb-2">{product2.name}</p>
                    <p className="text-2xl font-bold">
                      {Math.round(calculateBreakEven(product2.hourly, product2.monthly))} {t.hours}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {t.breakevenHours || 'to equal monthly rate'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10">
            <h3 className="text-lg sm:text-xl font-bold mb-4">{t.recommendation || 'Recommendations'}</h3>
            <div className="space-y-4">
              {product1.hourly && product1.monthly && (
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold">{product1.name}:</span>
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-gray-400">
                    <li>• {t.recommendHourly || 'Hourly rate recommended if usage <'} {Math.round(calculateBreakEven(product1.hourly, product1.monthly))} {t.hoursPerMonth || 'hours/month'}</li>
                    <li>• {t.recommendMonthly || 'Monthly rate recommended if usage >'} {Math.round(calculateBreakEven(product1.hourly, product1.monthly))} {t.hoursPerMonth || 'hours/month'}</li>
                    {product1.annual && (
                      <li>• {t.savingsWithAnnual || 'Savings with annual rate'}: €{calculateAnnualSavings(product1.monthly, product1.annual)} {t.perYear || 'per year'}</li>
                    )}
                  </ul>
                </div>
              )}
              {product2.hourly && product2.monthly && (
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold">{product2.name}:</span>
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-gray-400">
                    <li>• {t.recommendHourly || 'Hourly rate recommended if usage <'} {Math.round(calculateBreakEven(product2.hourly, product2.monthly))} {t.hoursPerMonth || 'hours/month'}</li>
                    <li>• {t.recommendMonthly || 'Monthly rate recommended if usage >'} {Math.round(calculateBreakEven(product2.hourly, product2.monthly))} {t.hoursPerMonth || 'hours/month'}</li>
                    {product2.annual && (
                      <li>• {t.savingsWithAnnual || 'Savings with annual rate'}: €{calculateAnnualSavings(product2.monthly, product2.annual)} {t.perYear || 'per year'}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Reset Button */}
          <div className="text-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              {t.resetComparison || 'New comparison'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}