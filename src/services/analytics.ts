/**
 * Analytics Abstraction Layer
 *
 * Provides a clean interface for event tracking across the product funnel.
 * Easily pluggable into PostHog, Google Analytics, Mixpanel, or Plausible
 * without coupling component code to third-party SDKs.
 */

export type AnalyticsEventName =
  | 'app_loaded'
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
  | 'checkout_clicked'
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

  public track(eventName: AnalyticsEventName, properties?: AnalyticsEventProperties): void {
    if (!this.enabled) return;

    // Log to console in development mode
    if ((import.meta as any).env?.DEV) {
      console.log(`[Analytics Event] ${eventName}:`, properties || {});
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
          if (eventName === 'checkout_started' || eventName === 'hotmart_checkout_clicked' || eventName === 'hotmart_checkout_initiated' || eventName === 'checkout_clicked') {
            win.fbq('track', 'InitiateCheckout', properties);
          } else if (eventName === 'payment_success' || eventName === 'purchase_completed') {
            win.fbq('track', 'Purchase', {
              currency: 'CHF',
              value: properties?.price || properties?.value || 39.00,
              ...properties,
            });
          } else if (eventName === 'optimizer_started') {
            win.fbq('track', 'Lead', properties);
          } else if (eventName === 'result_preview_viewed' || eventName === 'paywall_viewed' || eventName === 'results_viewed') {
            win.fbq('track', 'ViewContent', {
              content_name: eventName,
              ...properties,
            });
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
