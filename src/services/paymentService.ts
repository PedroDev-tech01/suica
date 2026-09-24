/**
 * Payment & Access Service (Hotmart Integration)
 *
 * Provides utilities for Hotmart checkout redirection and local access verification.
 * MVP architecture: No database, no user authentication system, no API or webhook.
 * Hotmart Club provides the /optimizer-access link to verified purchasers.
 */

import { HOTMART_CHECKOUT_URL, PAYMENT_CONFIG, redirectToHotmartCheckout } from '../config/payment';
import { dbService } from './database';

export class PaymentService {
  /**
   * Returns the configured Hotmart checkout URL.
   */
  getCheckoutUrl(): string {
    return HOTMART_CHECKOUT_URL;
  }

  /**
   * Redirects the user directly to Hotmart checkout.
   */
  redirectToCheckout(): void {
    redirectToHotmartCheckout();
  }

  /**
   * Checks whether full access is granted in the user's browser session.
   */
  hasAccess(): boolean {
    return dbService.isFullAccessGranted();
  }

  /**
   * Grants full access for this browser session.
   */
  grantAccess(): void {
    dbService.setFullAccessGranted(true);
  }

  /**
   * Revokes full access.
   */
  revokeAccess(): void {
    dbService.setFullAccessGranted(false);
  }
}

export const paymentService = new PaymentService();
export { HOTMART_CHECKOUT_URL, PAYMENT_CONFIG, redirectToHotmartCheckout };
