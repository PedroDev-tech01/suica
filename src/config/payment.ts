/**
 * ============================================================================
 * HOTMART CHECKOUT & ACCESS CONFIGURATION
 * ============================================================================
 *
 * Centralized active Hotmart checkout link.
 * All purchase CTAs reference this exact link to prevent discrepancies.
 */
export const HOTMART_CHECKOUT_URL: string =
  'https://pay.hotmart.com/V107645076B?sck=HOTMART_PRODUCT_PAGE&off=eslm65ys&hotfeature=32&_gl=1*1pa1bp6*_gcl_aw*R0NMLjE3ODkwOTcwOTcuQ2p3S0NBandxb25WQmhBNEVpd0E5d1lKM1VXQXdpVW0yRmZRUGpQV1ZZTUtFOEJPMHU4WjZMNEMzeWFpdmgzLW5Qc3dxd2hlaHBhbkNob0NFc3dRQXZEX0J3RQ..*_gcl_au*MjY1MTM5MjI5LjE3ODY0MDEyODQuMTU0MDA2MzkyNC4xNzg2OTkyMjg3LjE3ODY5OTIyODcuMjA5NDMxODgwMy4xNzg2OTMyNzA3LjE3ODY5OTIyODc.*FPAU*MTQ0MTE2MjgzMy4xNzg2NDAxMjc5*_ga*MTY0MDE0Mjk2MS4xNzg2NDAxMjc4*_ga_GQH2V1F11Q*czE3OTAyMDY3MTIkbzIzJGcxJHQxNzkwMjA5NTMxJGo2MCRsMSRoODA1NDg3MDk3&bid=1790209536507';

/**
 * Product & Pricing Configuration (Swiss Health Insurance Optimizer 2026 / 2027)
 */
export const PAYMENT_CONFIG = {
  priceCHF: 19.90,
  currency: 'CHF',
  edition: '2026 / 2027 Edition',
  hotmartCheckoutUrl: HOTMART_CHECKOUT_URL,
  fullAccessPath: '/optimizer-access',
};

/**
 * Builds the final checkout URL preserving incoming campaign parameters (UTM tags, src, sck)
 * from Meta Ads or Google Ads without breaking Hotmart's checkout structure.
 */
export function getCheckoutUrlWithUtms(): string {
  const baseUrl = HOTMART_CHECKOUT_URL;
  if (!baseUrl || typeof window === 'undefined') return baseUrl;

  try {
    const currentParams = new URLSearchParams(window.location.search);
    const trackingKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'src',
      'sck',
      'fbclid',
      'gclid',
    ];

    const hasTrackingParams = trackingKeys.some((k) => currentParams.has(k));
    if (!hasTrackingParams) return baseUrl;

    const parsedUrl = new URL(baseUrl);
    trackingKeys.forEach((key) => {
      const val = currentParams.get(key);
      if (val) {
        parsedUrl.searchParams.set(key, val);
      }
    });

    return parsedUrl.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * Redirects the user directly to the Hotmart checkout page in a new window/tab,
 * with fallback for top navigation.
 */
export function redirectToHotmartCheckout(): void {
  const url = getCheckoutUrlWithUtms();
  if (!url) return;
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      if (typeof window !== 'undefined' && window.self === window.top) {
        window.location.href = url;
      }
    }
  } catch {
    if (typeof window !== 'undefined' && window.self === window.top) {
      window.location.href = url;
    }
  }
}
