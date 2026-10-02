'use client';

import { useState, useEffect } from 'react';
import {
  PricingSettings,
  DEFAULT_PRICING_SETTINGS,
  getStoredPricingSettings,
  PRICING_SETTINGS_UPDATED_EVENT,
  PRICING_SETTINGS_STORAGE_KEY,
} from '@/lib/services/pricing';

/**
 * Custom React hook that subscribes to live Pricing Settings changes.
 */
export function usePricingSettings(): PricingSettings {
  const [settings, setSettings] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);

  useEffect(() => {
    // Initial sync
    setSettings(getStoredPricingSettings());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<PricingSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(getStoredPricingSettings());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === PRICING_SETTINGS_STORAGE_KEY) {
        setSettings(getStoredPricingSettings());
      }
    };

    window.addEventListener(PRICING_SETTINGS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(PRICING_SETTINGS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return settings;
}
