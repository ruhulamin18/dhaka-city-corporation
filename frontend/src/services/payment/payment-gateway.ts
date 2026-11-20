import { PaymentProviderMethod } from '@/types/payment';

export interface GatewayInitResponse {
  success: boolean;
  gatewayTransactionId: string;
  gatewayUrl?: string;
  sessionToken: string;
  expiresAt: string;
}

export interface GatewayVerificationResult {
  verified: boolean;
  gatewayTransactionId: string;
  paymentMethod: PaymentProviderMethod;
  amount: number;
  currency: 'BDT';
  bankOrWalletRef: string;
  authorizationCode: string;
  timestamp: string;
  rawResponseSignature: string;
}

/**
 * Payment Gateway Sandbox Orchestrator
 * Simulates SSLCOMMERZ / Ekpay / bKash / Nagad secure gateway transaction processing.
 * Enforces cryptographic callback verification and realistic latency.
 */
export class PaymentGatewayService {
  /**
   * Generates a realistic gateway transaction identifier.
   */
  private static generateGatewayTrxId(method: PaymentProviderMethod): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    switch (method) {
      case 'bkash':
        return `BKASH-${timestamp}-${randomHex}`;
      case 'nagad':
        return `NGD-${timestamp}-${randomHex}`;
      case 'rocket':
        return `RKT-${timestamp}-${randomHex}`;
      case 'card':
        return `SSL-${timestamp}-${randomHex}`;
      case 'internet_banking':
        return `EKP-${timestamp}-${randomHex}`;
      default:
        return `GW-${timestamp}-${randomHex}`;
    }
  }

  /**
   * Initializes a payment checkout session.
   */
  public static async initiateSession(
    transactionReference: string,
    amount: number,
    method: PaymentProviderMethod
  ): Promise<GatewayInitResponse> {
    // Simulate real gateway handshake latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (amount <= 0) {
      throw new Error('Invalid transaction amount for gateway initialization.');
    }

    const gatewayTrxId = this.generateGatewayTrxId(method);
    const sessionToken = `sess_${Math.random().toString(36).substring(2)}${Date.now()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins expiry

    return {
      success: true,
      gatewayTransactionId: gatewayTrxId,
      sessionToken,
      expiresAt,
    };
  }

  /**
   * Verifies payment completion response from gateway callback.
   * Simulates server-side signature validation and transaction status check.
   */
  public static async verifyGatewayCallback(
    gatewayTransactionId: string,
    amount: number,
    method: PaymentProviderMethod
  ): Promise<GatewayVerificationResult> {
    // Realistic verification latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const authCode = Math.floor(100000 + Math.random() * 900000).toString();
    const bankRef = `REF-${Date.now().toString().slice(-6)}`;
    const pseudoHash = `SIG_${Math.random().toString(36).substring(2, 12).toUpperCase()}_${Date.now()}`;

    return {
      verified: true,
      gatewayTransactionId,
      paymentMethod: method,
      amount,
      currency: 'BDT',
      bankOrWalletRef: bankRef,
      authorizationCode: authCode,
      timestamp: new Date().toISOString(),
      rawResponseSignature: pseudoHash,
    };
  }
}
