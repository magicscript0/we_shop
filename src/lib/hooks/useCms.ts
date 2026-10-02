'use client';

import { useState, useEffect } from 'react';
import {
  CmsRegistry,
  DEFAULT_CMS_REGISTRY,
  getPublishedCms,
  CMS_UPDATED_EVENT,
} from '@/lib/services/cms';

/**
 * Custom React hook that subscribes to live CMS changes.
 * Components using this hook re-render automatically when an admin publishes new content.
 */
export function useCms(): CmsRegistry {
  const [cms, setCms] = useState<CmsRegistry>(DEFAULT_CMS_REGISTRY);

  useEffect(() => {
    // Initial client sync
    setCms(getPublishedCms());

    // Listen to live CMS update events within same window
    const handleCmsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CmsRegistry>;
      if (customEvent.detail) {
        setCms(customEvent.detail);
      } else {
        setCms(getPublishedCms());
      }
    };

    // Listen to storage events across different tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'we_store_cms_published') {
        setCms(getPublishedCms());
      }
    };

    window.addEventListener(CMS_UPDATED_EVENT, handleCmsUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, handleCmsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return cms;
}
