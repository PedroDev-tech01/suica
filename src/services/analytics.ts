/**
 * Analytics Abstraction Layer
 *
 * Provides a clean, deduplicated interface for event tracking across the product funnel.
 * Easily pluggable into PostHog, Google Analytics, Mixpanel, or Meta Pixel.
 */

export type AnalyticsEventName =
  | 'app_loaded'
  | 'landing_page_view'
  | 'hero_cta_click'
  | 'product_preview_view'
  | 'preview_cta_click'
  | 'how_it_works_view'
  | 'how_it_works_cta_click'
  | 'benefits_view'
  | 'benefits_cta_click'
  | 'pricing_view'
  | 'pricing_cta_click'
  | 'faq_view'
  | 'faq_cta_click'
  | 'final_cta_click'
  | 'sticky_cta_click'
  | 'checkout_click'
  | 'progress_saved'
  | 'view_changed'
  | 'landing_view'
  | 'cta_clicked'
  | 'optimizer_started'
  | 'optimizer_step_1_completed'
  | 'optimizer_step_2_completed'
  | 'optimizer_step_3_completed'
  | 'optimizer_step_4_completed'
  | 'result_preview_viewed'
  | 'paywall_viewed'
  | 'checkout_started'
  | 'payment_success'
  | 'payment_failed'
  | 'full_report_viewed'
  | 'bonus_toolkit_opened'
  | 'profile_completed'
  | 'current_plan_completed'
  | 'comparison_started'
  | 'results_viewed'
  | 'priminfo_clicked'
  | 'report_downloaded'
  | 'hotmart_checkout_clicked'
  | 'hotmart_checkout_initiated'
  | 'purchase_completed'
  | 'data_cleared'
  | 'bonus_viewed';

export interface AnalyticsEventProperties {
  [key: string]: string | number | boolean | undefined | null;
}

class AnalyticsService {
  private enabled = true;
  private lastInitiateCheckoutTimestamp = 0;
  private recordedSectionViews = new Set<string>();

  /**
   * Tracks an analytical event with deduplication protections for rapid double clicks.
   */
  public track(eventName: AnalyticsEventName, properties?: AnalyticsEventProperties): void {
    if (!this.enabled) return;

    const now = Date.now();

    // Deduplicate section view impressions per session
    if (
      eventName === 'product_preview_view' ||
      eventName === 'how_it_works_view' ||
      eventName === 'benefits_view' ||
      eventName === 'pricing_view' ||
      eventName === 'faq_view'
    ) {
      if (this.recordedSectionViews.has(eventName)) {
        return;
      }
      this.recordedSectionViews.add(eventName);
    }

    // Log to console in development mode only
    if ((import.meta as any).env?.DEV) {
      console.log(`[Analytics] ${eventName}:`, properties || {});
    }

    // Window event dispatch for external observers or GTM datalayer
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('shio_analytics_event', {
          detail: { event: eventName, properties, timestamp: new Date().toISOString() },
        })
      );

      // Forward events to Meta Pixel (fbq) if available
      const win = window as any;
      if (typeof win.fbq === 'function') {
        try {
          // STRICT RULE: InitiateCheckout is fired ONLY on genuine checkout action, debounced to 1200ms
          if (eventName === 'checkout_click' || eventName === 'hotmart_checkout_clicked') {
            if (now - this.lastInitiateCheckoutTimestamp > 1200) {
              this.lastInitiateCheckoutTimestamp = now;
              win.fbq('track', 'InitiateCheckout', {
                content_name: 'Swiss Health Insurance Optimizer 2026 / 2027 Edition',
                content_category: 'Digital Product',
                currency: 'CHF',
                value: properties?.price || properties?.value || 19.90,
                ...properties,
              });
            }
          } else if (
            eventName === 'hero_cta_click' ||
            eventName === 'preview_cta_click' ||
            eventName === 'pricing_cta_click' ||
            eventName === 'sticky_cta_click' ||
            eventName === 'how_it_works_cta_click' ||
            eventName === 'benefits_cta_click' ||
            eventName === 'faq_cta_click' ||
            eventName === 'final_cta_click'
          ) {
            // Track specific CTA click as Custom Event in Meta Pixel
            win.fbq('trackCustom', eventName, {
              currency: 'CHF',
              value: 19.90,
              ...properties,
            });
          } else if (eventName === 'landing_page_view' || eventName === 'landing_view') {
            win.fbq('track', 'ViewContent', {
              content_name: 'Swiss Health Insurance Optimizer 2026 / 2027 Edition',
              currency: 'CHF',
              value: 19.90,
              ...properties,
            });
          } else if (eventName === 'payment_success' || eventName === 'purchase_completed') {
            // ONLY fired on confirmed post-payment verification (never on landing page)
            win.fbq('track', 'Purchase', {
              content_name: 'Swiss Health Insurance Optimizer 2026 / 2027 Edition',
              currency: 'CHF',
              value: properties?.price || properties?.value || 19.90,
              ...properties,
            });
          } else if (eventName === 'optimizer_started') {
            win.fbq('track', 'Lead', properties);
          } else {
            win.fbq('trackCustom', eventName, properties);
          }
        } catch {
          // Ignore pixel tracking errors
        }
      }
    }
  }
}

export const analytics = new AnalyticsService();
