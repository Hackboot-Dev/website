// /workspaces/website/apps/web/utils/translations.ts
// Description: Translation utility for loading and caching translations
// Last modified: 2025-08-27

export async function getTranslation(language: string, namespace: string) {
  try {
    const translations = await import(`../data/translations/${namespace}/${language}.json`);
    return translations.default || translations;
  } catch (error) {
    // Fallback to French if language not found
    try {
      const frenchTranslations = await import(`../data/translations/${namespace}/fr.json`);
      return frenchTranslations.default || frenchTranslations;
    } catch (fallbackError) {
      console.error(`Failed to load translations for ${namespace}/${language}`, error);
      return {};
    }
  }
}