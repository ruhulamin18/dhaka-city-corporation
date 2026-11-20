/**
 * Dhaka City Corporation — Online Payment System Types
 * Bilingual FinTech Architecture & Transaction Lifecycle
 */

export type PaymentServiceType =
  | 'HOLDING_TAX'
  | 'TRADE_LICENSE'
  | 'CERTIFICATE'
  | 'APPLICATION'
  | 'OTHER_SERVICE';

export type PaymentStatus =
  | 'INITIATED'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED';

export type PaymentProviderMethod =
  | 'bkash'
  | 'nagad'
  | 'rocket'
  | 'card'
  | 'internet_banking';

export interface PaymentItemDetail {
  label: { bn: string; en: string };
  amount: number;
  description?: { bn: string; en: string };
}

export interface BillLookupRecord {
  id: string;
  serviceType: PaymentServiceType;
  referenceNumber: string; // e.g. Holding No, Trade License No, Application ID
  secondaryReference?: string;
  wardNumber: number;
  payerName: { bn: string; en: string };
  payerPhone?: string;
  payerAddress?: { bn: string; en: string };
  propertyOrBusinessDetails?: { bn: string; en: string };
  fiscalYear?: string;
  categoryLabel: { bn: string; en: string };
  subItems: PaymentItemDetail[];
  arrearsAmount: number;
  currentAmount: number;
  rebateAmount: number; // e.g. 10% early payment rebate
  vatOrServiceCharge: number;
  totalPayable: number;
  paymentStatus: 'unpaid' | 'paid' | 'partial' | 'ineligible';
  eligibilityNotes?: { bn: string; en: string };
  lastPaymentDate?: string;
  lastReceiptNumber?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionReference: string; // e.g. TXN-2026-948123
  gatewayTransactionId?: string; // e.g. SSL-202611-883921 / BKASH-TRX-9941
  userId?: string;
  payerName: string;
  payerPhone: string;
  serviceType: PaymentServiceType;
  serviceName: { bn: string; en: string };
  serviceReference: string; // Holding Number, License Number, etc.
  wardNumber: number;
  fiscalYear?: string;
  amount: number;
  currency: 'BDT';
  paymentMethod: PaymentProviderMethod;
  status: PaymentStatus;
  receiptNumber?: string; // e.g. DSCC-RCP-2026-7731
  verificationReference: string; // SHA-256 / CRC verification token
  initiatedAt: string;
  completedAt?: string;
  verifiedAt?: string;
  breakdown: {
    baseAmount: number;
    arrearsAmount?: number;
    vatAmount?: number;
    rebateAmount?: number;
    gatewayFee?: number;
    totalAmount: number;
  };
  auditLogs: PaymentAuditLogItem[];
}

export interface PaymentAuditLogItem {
  id: string;
  timestamp: string;
  eventType:
    | 'TRANSACTION_INITIATED'
    | 'GATEWAY_REDIRECT'
    | 'CALLBACK_RECEIVED'
    | 'SIGNATURE_VERIFIED'
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'PAYMENT_CANCELLED'
    | 'RECEIPT_ISSUED'
    | 'REFUND_REQUESTED'
    | 'REFUND_COMPLETED';
  eventDetails: string;
  actorIp?: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string; // DSCC-RCP-2026-XXXX
  transactionReference: string;
  gatewayTransactionId: string;
  serviceType: PaymentServiceType;
  serviceName: { bn: string; en: string };
  serviceReference: string;
  wardNumber: number;
  payerName: string;
  payerPhone: string;
  payerAddress?: string;
  fiscalYear?: string;
  amount: number;
  currency: 'BDT';
  paymentMethod: PaymentProviderMethod;
  paymentStatus: 'SUCCESS';
  paidAt: string;
  issuedAt: string;
  verificationReference: string;
  qrCodeValue: string;
  breakdown: {
    items: { label: string; amount: number }[];
    total: number;
  };
  notes?: { bn: string; en: string };
}

export interface PublicVerificationResult {
  verified: boolean;
  status: 'VERIFIED' | 'PENDING' | 'INVALID' | 'CANCELLED';
  receiptNumber?: string;
  transactionReference?: string;
  serviceName?: { bn: string; en: string };
  serviceReference?: string;
  wardNumber?: number;
  amount?: number;
  currency?: string;
  paymentDate?: string;
  paymentMethod?: PaymentProviderMethod;
  issuingAuthority?: { bn: string; en: string };
  verificationMessage: { bn: string; en: string };
}
