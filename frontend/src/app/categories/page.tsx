'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Categories main page - redirects to the categories selection page
 * This provides a consistent routing structure where:
 * - /categories redirects to /categories/selection (category listing)
 * - /categories/[slug] shows products for a specific category
 */
const CategoriesPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the categories selection page
    router.replace('/categories/selection');
  }, [router]);

  // No need for a loading spinner as this redirect should be nearly instant
  return null;
};

export default CategoriesPage;
