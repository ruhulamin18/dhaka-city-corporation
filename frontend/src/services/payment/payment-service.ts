import {
  BillLookupRecord,
  PaymentAuditLogItem,
  PaymentProviderMethod,
  PaymentReceipt,
  PaymentServiceType,
  PaymentTransaction,
} from '@/types/payment';
import { SEED_BILL_LOOKUP_RECORDS } from '@/config/payment-config';
import { PaymentGatewayService } from './payment-gateway';

const STORAGE_KEYS = {
  TRANSACTIONS: 'dscc_payment_transactions_v1',
  RECEIPTS: 'dscc_payment_receipts_v1',
  BILLS: 'dscc_payment_bills_v1',
};

// Seed initial transaction history if empty
const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'TXN-INIT-001',
    transactionReference: 'TXN-2026-891245',
    gatewayTransactionId: 'BKASH-M8K92-7492',
    userId: 'usr_citizen_demo',
    payerName: 'আব্দুর রহিম',
    payerPhone: '01711-234567',
    serviceType: 'HOLDING_TAX',
    serviceName: { bn: 'হোল্ডিং ট্যাক্স বিল', en: 'Holding Tax Bill' },
    serviceReference: 'H-10482',
    wardNumber: 19,
    fiscalYear: '২০২৪-২০২৫',
    amount: 27927,
    currency: 'BDT',
    paymentMethod: 'bkash',
    status: 'SUCCESS',
    receiptNumber: 'DSCC-RCP-2026-10492',
    verificationReference: 'VER-DSCC-8849-B94F',
    initiatedAt: '2026-01-15T10:24:00Z',
    completedAt: '2026-01-15T10:25:12Z',
    verifiedAt: '2026-01-15T10:25:14Z',
    breakdown: {
      baseAmount: 26030,
      arrearsAmount: 4500,
      rebateAmount: 2603,
      vatAmount: 0,
      totalAmount: 27927,
    },
    auditLogs: [
      {
        id: 'LOG-001',
        timestamp: '2026-01-15T10:24:00Z',
        eventType: 'TRANSACTION_INITIATED',
        eventDetails: 'Holding tax payment initiated for H-10482',
      },
      {
        id: 'LOG-002',
        timestamp: '2026-01-15T10:25:12Z',
        eventType: 'PAYMENT_SUCCESS',
        eventDetails: 'Gateway callback received and verified with bKash',
      },
      {
        id: 'LOG-003',
        timestamp: '2026-01-15T10:25:14Z',
        eventType: 'RECEIPT_ISSUED',
        eventDetails: 'Receipt DSCC-RCP-2026-10492 generated',
      },
    ],
  },
  {
    id: 'TXN-INIT-002',
    transactionReference: 'TXN-2026-551023',
    gatewayTransactionId: 'SSL-202611-98214',
    userId: 'usr_citizen_demo',
    payerName: 'মেসার্স মেঘনা এন্টারপ্রাইজ',
    payerPhone: '01914-556677',
    serviceType: 'TRADE_LICENSE',
    serviceName: { bn: 'ট্রেড লাইসেন্স নবায়ন', en: 'Trade License Renewal' },
    serviceReference: 'TRAD/DSCC/019284/2026',
    wardNumber: 21,
    fiscalYear: '২০২৫-২০২৬',
    amount: 7210,
    currency: 'BDT',
    paymentMethod: 'card',
    status: 'SUCCESS',
    receiptNumber: 'DSCC-RCP-2026-38291',
    verificationReference: 'VER-DSCC-3829-K29A',
    initiatedAt: '2026-02-02T14:10:00Z',
    completedAt: '2026-02-02T14:11:45Z',
    verifiedAt: '2026-02-02T14:11:47Z',
    breakdown: {
      baseAmount: 6400,
      vatAmount: 810,
      totalAmount: 7210,
    },
    auditLogs: [
      {
        id: 'LOG-004',
        timestamp: '2026-02-02T14:10:00Z',
        eventType: 'TRANSACTION_INITIATED',
        eventDetails: 'Trade license renewal payment initiated',
      },
      {
        id: 'LOG-005',
        timestamp: '2026-02-02T14:11:45Z',
        eventType: 'PAYMENT_SUCCESS',
        eventDetails: 'Visa Debit Card payment captured via SSLCOMMERZ',
      },
    ],
  },
  {
    id: 'TXN-INIT-003',
    transactionReference: 'TXN-2026-210948',
    gatewayTransactionId: 'NGD-202602-4412',
    userId: 'usr_citizen_demo',
    payerName: 'তানভীর আহমেদ চৌধুরী',
    payerPhone: '01678-990011',
    serviceType: 'CERTIFICATE',
    serviceName: { bn: 'নাগরিকত্ব সনদ ফি', en: 'Citizenship Certificate Fee' },
    serviceReference: 'CERT-2026-98124',
    wardNumber: 7,
    amount: 200,
    currency: 'BDT',
    paymentMethod: 'nagad',
    status: 'SUCCESS',
    receiptNumber: 'DSCC-RCP-2026-77192',
    verificationReference: 'VER-DSCC-7719-Z08L',
    initiatedAt: '2026-02-10T09:30:00Z',
    completedAt: '2026-02-10T09:30:58Z',
    verifiedAt: '2026-02-10T09:31:00Z',
    breakdown: {
      baseAmount: 200,
      totalAmount: 200,
    },
    auditLogs: [
      {
        id: 'LOG-006',
        timestamp: '2026-02-10T09:30:00Z',
        eventType: 'TRANSACTION_INITIATED',
        eventDetails: 'Certificate fee payment initiated',
      },
      {
        id: 'LOG-007',
        timestamp: '2026-02-10T09:30:58Z',
        eventType: 'PAYMENT_SUCCESS',
        eventDetails: 'Nagad payment verified',
      },
    ],
  },
];

const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'RCP-001',
    receiptNumber: 'DSCC-RCP-2026-10492',
    transactionReference: 'TXN-2026-891245',
    gatewayTransactionId: 'BKASH-M8K92-7492',
    serviceType: 'HOLDING_TAX',
    serviceName: { bn: 'হোল্ডিং ট্যাক্স বিল পরিশোধ', en: 'Holding Tax Bill Payment' },
    serviceReference: 'H-10482',
    wardNumber: 19,
    payerName: 'আলহাজ্ব ড. রফিকুল ইসলাম',
    payerPhone: '01711-234567',
    payerAddress: 'বাড়ি নং ৪২, রোড নং ৭, বনানী, ঢাকা-১২১৩',
    fiscalYear: '২০২৫-২০২৬ (১ম ও ২য় প্রান্তিক)',
    amount: 27927,
    currency: 'BDT',
    paymentMethod: 'bkash',
    paymentStatus: 'SUCCESS',
    paidAt: '2026-01-15T10:25:12Z',
    issuedAt: '2026-01-15T10:25:14Z',
    verificationReference: 'VER-DSCC-8849-B94F',
    qrCodeValue: 'https://dscc.gov.bd/online-payment/verification?ref=DSCC-RCP-2026-10492',
    breakdown: {
      items: [
        { label: 'সাধারণ পৌর কর (১২%)', amount: 14200 },
        { label: 'আলোকায়ন কর (৩%)', amount: 3550 },
        { label: 'পরিচ্ছন্নতা ও বর্জ্য কর (৭%)', amount: 8280 },
        { label: 'বকেয়া পরিমাণ', amount: 4500 },
        { label: 'সময়োপযোগী ১০% রিবেট / ছাড়', amount: -2603 },
      ],
      total: 27927,
    },
    notes: {
      bn: 'এটি একটি কম্পিউটার জেনারেটেড সরকারি পেমেন্ট রশিদ, যাতে কোন ম্যানুয়াল স্বাক্ষরের প্রয়োজন নেই।',
      en: 'This is a computer-generated official receipt and requires no manual signature.',
    },
  },
  {
    id: 'RCP-002',
    receiptNumber: 'DSCC-RCP-2026-38291',
    transactionReference: 'TXN-2026-551023',
    gatewayTransactionId: 'SSL-202611-98214',
    serviceType: 'TRADE_LICENSE',
    serviceName: { bn: 'ট্রেড লাইসেন্স নবায়ন ফি', en: 'Trade License Renewal Fee' },
    serviceReference: 'TRAD/DSCC/019284/2026',
    wardNumber: 21,
    payerName: 'মেসার্স মেঘনা এন্টারপ্রাইজ',
    payerPhone: '01914-556677',
    payerAddress: 'দোকান নং ১৫, বায়তুল মোকাররম সুপার মার্কেট, ঢাকা',
    fiscalYear: '২০২৫-২০২৬',
    amount: 7210,
    currency: 'BDT',
    paymentMethod: 'card',
    paymentStatus: 'SUCCESS',
    paidAt: '2026-02-02T14:11:45Z',
    issuedAt: '2026-02-02T14:11:47Z',
    verificationReference: 'VER-DSCC-3829-K29A',
    qrCodeValue: 'https://dscc.gov.bd/online-payment/verification?ref=DSCC-RCP-2026-38291',
    breakdown: {
      items: [
        { label: 'মূল ট্রেড লাইসেন্স ফি (শ্রেণি: খ)', amount: 4500 },
        { label: 'সাইনবোর্ড বিজ্ঞাপন কর', amount: 900 },
        { label: 'উৎস কর (সরকার নির্ধারিত)', amount: 1000 },
        { label: '১৫% সরকারি মূসক / ভ্যাট', amount: 810 },
      ],
      total: 7210,
    },
  },
];

export class PaymentService {
  private static getFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static saveToStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save to localStorage [${key}]:`, e);
    }
  }

  /**
   * Search for an assessment bill or service application.
   * If not in seed, generates a deterministic valid record so users can test any holding or license.
   */
  public static async lookupBill(
    serviceType: PaymentServiceType,
    referenceNumber: string,
    wardNumber?: number
  ): Promise<BillLookupRecord> {
    // Artificial latency for authentic civic database lookup feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cleanRef = referenceNumber.trim();
    if (!cleanRef) {
      throw new Error('দয়া করে সঠিক রেফারেন্স নম্বর বা আইডি প্রদান করুন');
    }

    const bills: BillLookupRecord[] = this.getFromStorage(
      STORAGE_KEYS.BILLS,
      SEED_BILL_LOOKUP_RECORDS
    );

    // Exact match search
    const found = bills.find(
      (b) =>
        b.serviceType === serviceType &&
        (b.referenceNumber.toLowerCase() === cleanRef.toLowerCase() ||
          (b.secondaryReference &&
            b.secondaryReference.toLowerCase() === cleanRef.toLowerCase()))
    );

    if (found) {
      return found;
    }

    // Dynamic Generator for test coverage so users can enter any number
    const resolvedWard = wardNumber || (Math.floor(Math.random() * 54) + 1);
    const mockRecord: BillLookupRecord = this.generateDynamicBill(
      serviceType,
      cleanRef,
      resolvedWard
    );

    // Save dynamic bill for session continuity
    bills.push(mockRecord);
    this.saveToStorage(STORAGE_KEYS.BILLS, bills);

    return mockRecord;
  }

  /**
   * Generates a deterministic dynamic bill record for testing any arbitrary reference
   */
  private static generateDynamicBill(
    serviceType: PaymentServiceType,
    ref: string,
    ward: number
  ): BillLookupRecord {
    switch (serviceType) {
      case 'HOLDING_TAX': {
        const base = 8500 + (Math.abs(ref.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 15000);
        const arrears = ref.length % 2 === 0 ? 2500 : 0;
        const rebate = Math.round(base * 0.1);
        const total = base + arrears - rebate;
        return {
          id: `BILL-GEN-${Date.now()}`,
          serviceType: 'HOLDING_TAX',
          referenceNumber: ref,
          wardNumber: ward,
          payerName: { bn: 'নাগরিক করদাতা', en: 'Citizen Taxpayer' },
          payerPhone: '01700-000000',
          payerAddress: {
            bn: `হোল্ডিং নং ${ref}, ওয়ার্ড ${ward}, ঢাকা সিটি কর্পোরেশন`,
            en: `Holding No ${ref}, Ward ${ward}, Dhaka City Corporation`,
          },
          propertyOrBusinessDetails: {
            bn: 'আবাসিক ভবন (মূল্যায়ন ডাটাবেজ অনুযায়ী)',
            en: 'Residential Property (as per assessment registry)',
          },
          fiscalYear: '২০২৫-২০২৬',
          categoryLabel: { bn: 'আবাসিক হোল্ডিং ট্যাক্স', en: 'Residential Holding Tax' },
          subItems: [
            { label: { bn: 'সাধারণ পৌর কর', en: 'General Municipal Tax' }, amount: Math.round(base * 0.65) },
            { label: { bn: 'আলোকায়ন ও পরিচ্ছন্নতা কর', en: 'Lighting & Sanitation Tax' }, amount: Math.round(base * 0.35) },
          ],
          arrearsAmount: arrears,
          currentAmount: base,
          rebateAmount: rebate,
          vatOrServiceCharge: 0,
          totalPayable: total,
          paymentStatus: 'unpaid',
        };
      }
      case 'TRADE_LICENSE': {
        const base = 5000;
        const vat = Math.round(base * 0.15);
        return {
          id: `BILL-GEN-${Date.now()}`,
          serviceType: 'TRADE_LICENSE',
          referenceNumber: ref,
          wardNumber: ward,
          payerName: { bn: 'বাণিজ্যিক প্রতিষ্ঠান', en: 'Commercial Business Concern' },
          payerAddress: {
            bn: `দোকান/অফিস, ওয়ার্ড ${ward}, ঢাকা`,
            en: `Shop/Office, Ward ${ward}, Dhaka`,
          },
          propertyOrBusinessDetails: {
            bn: 'ব্যবসা ও বাণিজ্যিক প্রতিষ্ঠান লাইসেন্স নবায়ন',
            en: 'Business & Commercial Trade License Renewal',
          },
          fiscalYear: '২০২৫-২০২৬',
          categoryLabel: { bn: 'ট্রেড লাইসেন্স ফি', en: 'Trade License Fee' },
          subItems: [
            { label: { bn: 'ট্রেড লাইসেন্স নবায়ন ফি', en: 'Trade License Renewal Fee' }, amount: 4000 },
            { label: { bn: 'সাইনবোর্ড কর', en: 'Signboard Tax' }, amount: 1000 },
          ],
          arrearsAmount: 0,
          currentAmount: base,
          rebateAmount: 0,
          vatOrServiceCharge: vat,
          totalPayable: base + vat,
          paymentStatus: 'unpaid',
        };
      }
      case 'CERTIFICATE':
        return {
          id: `BILL-GEN-${Date.now()}`,
          serviceType: 'CERTIFICATE',
          referenceNumber: ref,
          wardNumber: ward,
          payerName: { bn: 'আবেদনকারী নাগরিক', en: 'Citizen Applicant' },
          propertyOrBusinessDetails: {
            bn: 'নাগরিক সনদপত্র আবেদন প্রক্রিয়াকরণ ফি',
            en: 'Citizen Statutory Certificate Processing Fee',
          },
          categoryLabel: { bn: 'সনদপত্র সরকারি ফি', en: 'Statutory Certificate Fee' },
          subItems: [
            { label: { bn: 'সরকারি সনদপত্র ফি', en: 'Statutory Certificate Fee' }, amount: 150 },
          ],
          arrearsAmount: 0,
          currentAmount: 150,
          rebateAmount: 0,
          vatOrServiceCharge: 0,
          totalPayable: 150,
          paymentStatus: 'unpaid',
        };
      case 'APPLICATION':
        return {
          id: `BILL-GEN-${Date.now()}`,
          serviceType: 'APPLICATION',
          referenceNumber: ref,
          wardNumber: ward,
          payerName: { bn: 'আবেদনকারী', en: 'Applicant' },
          propertyOrBusinessDetails: {
            bn: 'অনলাইন নাগরিক সেবা আবেদন ফি',
            en: 'Online Civic Service Application Fee',
          },
          categoryLabel: { bn: 'আবেদন ফি', en: 'Application Fee' },
          subItems: [
            { label: { bn: 'আবেদন প্রক্রিয়াকরণ ফি', en: 'Application Processing Fee' }, amount: 500 },
          ],
          arrearsAmount: 0,
          currentAmount: 500,
          rebateAmount: 0,
          vatOrServiceCharge: 0,
          totalPayable: 500,
          paymentStatus: 'unpaid',
        };
      default:
        return {
          id: `BILL-GEN-${Date.now()}`,
          serviceType: 'OTHER_SERVICE',
          referenceNumber: ref,
          wardNumber: ward,
          payerName: { bn: 'নাগরিক সেবাগ্রহীতা', en: 'Civic Service Recipient' },
          propertyOrBusinessDetails: {
            bn: 'পৌর বিশেষ সেবা ও ব্যবস্থাপনা ফি',
            en: 'Special Municipal Service & Management Fee',
          },
          categoryLabel: { bn: 'পৌর সেবা ফি', en: 'Municipal Service Fee' },
          subItems: [
            { label: { bn: 'পৌর সেবা ফি', en: 'Civic Service Charge' }, amount: 2000 },
          ],
          arrearsAmount: 0,
          currentAmount: 2000,
          rebateAmount: 0,
          vatOrServiceCharge: 300,
          totalPayable: 2300,
          paymentStatus: 'unpaid',
        };
    }
  }

  /**
   * Initializes a new transaction before gateway redirect.
   */
  public static async initiateTransaction(
    bill: BillLookupRecord,
    paymentMethod: PaymentProviderMethod,
    payerDetails: { name: string; phone: string; address?: string; userId?: string }
  ): Promise<PaymentTransaction> {
    const trxRef = `TXN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const verificationRef = `VER-DSCC-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newTransaction: PaymentTransaction = {
      id: `TRX-${Date.now()}`,
      transactionReference: trxRef,
      userId: payerDetails.userId || 'usr_guest',
      payerName: payerDetails.name,
      payerPhone: payerDetails.phone,
      serviceType: bill.serviceType,
      serviceName: {
        bn: bill.categoryLabel.bn,
        en: bill.categoryLabel.en,
      },
      serviceReference: bill.referenceNumber,
      wardNumber: bill.wardNumber,
      fiscalYear: bill.fiscalYear,
      amount: bill.totalPayable,
      currency: 'BDT',
      paymentMethod,
      status: 'INITIATED',
      verificationReference: verificationRef,
      initiatedAt: new Date().toISOString(),
      breakdown: {
        baseAmount: bill.currentAmount,
        arrearsAmount: bill.arrearsAmount,
        rebateAmount: bill.rebateAmount,
        vatAmount: bill.vatOrServiceCharge,
        totalAmount: bill.totalPayable,
      },
      auditLogs: [
        {
          id: `LOG-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          eventType: 'TRANSACTION_INITIATED',
          eventDetails: `Transaction ${trxRef} initiated via ${paymentMethod.toUpperCase()} for amount ৳${bill.totalPayable.toLocaleString('en-IN')}`,
        },
      ],
    };

    const transactions = this.getAllTransactions();
    transactions.unshift(newTransaction);
    this.saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

    return newTransaction;
  }

  /**
   * Completes a transaction after gateway authorization and issues official receipt.
   */
  public static async completePayment(
    transactionId: string,
    gatewayResponse: {
      gatewayTransactionId: string;
      bankOrWalletRef: string;
      authorizationCode: string;
    }
  ): Promise<{ transaction: PaymentTransaction; receipt: PaymentReceipt }> {
    const transactions = this.getAllTransactions();
    const index = transactions.findIndex((t) => t.id === transactionId || t.transactionReference === transactionId);

    if (index === -1) {
      throw new Error('Transaction record not found.');
    }

    const currentTrx = transactions[index];
    const receiptNo = `DSCC-RCP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();

    // Update Transaction
    currentTrx.status = 'SUCCESS';
    currentTrx.gatewayTransactionId = gatewayResponse.gatewayTransactionId;
    currentTrx.receiptNumber = receiptNo;
    currentTrx.completedAt = nowIso;
    currentTrx.verifiedAt = nowIso;

    currentTrx.auditLogs.push(
      {
        id: `LOG-${Date.now()}-2`,
        timestamp: nowIso,
        eventType: 'SIGNATURE_VERIFIED',
        eventDetails: `Gateway authorization confirmed (Auth Code: ${gatewayResponse.authorizationCode}, Ref: ${gatewayResponse.bankOrWalletRef})`,
      },
      {
        id: `LOG-${Date.now()}-3`,
        timestamp: nowIso,
        eventType: 'PAYMENT_SUCCESS',
        eventDetails: `Payment marked successful. Funds captured.`,
      },
      {
        id: `LOG-${Date.now()}-4`,
        timestamp: nowIso,
        eventType: 'RECEIPT_ISSUED',
        eventDetails: `Official digital receipt ${receiptNo} issued.`,
      }
    );

    transactions[index] = currentTrx;
    this.saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

    // Create & Save Official Receipt
    const receipt: PaymentReceipt = {
      id: `RCP-${Date.now()}`,
      receiptNumber: receiptNo,
      transactionReference: currentTrx.transactionReference,
      gatewayTransactionId: gatewayResponse.gatewayTransactionId,
      serviceType: currentTrx.serviceType,
      serviceName: currentTrx.serviceName,
      serviceReference: currentTrx.serviceReference,
      wardNumber: currentTrx.wardNumber,
      payerName: currentTrx.payerName,
      payerPhone: currentTrx.payerPhone,
      fiscalYear: currentTrx.fiscalYear,
      amount: currentTrx.amount,
      currency: 'BDT',
      paymentMethod: currentTrx.paymentMethod,
      paymentStatus: 'SUCCESS',
      paidAt: nowIso,
      issuedAt: nowIso,
      verificationReference: currentTrx.verificationReference,
      qrCodeValue: `https://dscc.gov.bd/online-payment/verification?ref=${receiptNo}`,
      breakdown: {
        items: [
          { label: 'মূল বিল বা সেবা ফি', amount: currentTrx.breakdown.baseAmount },
          ...(currentTrx.breakdown.arrearsAmount ? [{ label: 'বকেয়া কর / ফি', amount: currentTrx.breakdown.arrearsAmount }] : []),
          ...(currentTrx.breakdown.rebateAmount ? [{ label: 'রিবেট / ছাড়', amount: -currentTrx.breakdown.rebateAmount }] : []),
          ...(currentTrx.breakdown.vatAmount ? [{ label: 'মূসক / ভ্যাট', amount: currentTrx.breakdown.vatAmount }] : []),
        ],
        total: currentTrx.amount,
      },
      notes: {
        bn: 'এটি একটি কম্পিউটার জেনারেটেড সরকারি পেমেন্ট রশিদ, যাতে কোন ম্যানুয়াল স্বাক্ষরের প্রয়োজন নেই।',
        en: 'This is a computer-generated official receipt and requires no manual signature.',
      },
    };

    const receipts = this.getAllReceipts();
    receipts.unshift(receipt);
    this.saveToStorage(STORAGE_KEYS.RECEIPTS, receipts);

    // Also mark the bill status as paid in local storage
    const bills = this.getFromStorage<BillLookupRecord[]>(STORAGE_KEYS.BILLS, SEED_BILL_LOOKUP_RECORDS);
    const billIdx = bills.findIndex(
      (b) => b.serviceType === currentTrx.serviceType && b.referenceNumber === currentTrx.serviceReference
    );
    if (billIdx !== -1) {
      bills[billIdx].paymentStatus = 'paid';
      bills[billIdx].lastPaymentDate = nowIso;
      bills[billIdx].lastReceiptNumber = receiptNo;
      this.saveToStorage(STORAGE_KEYS.BILLS, bills);
    }

    return { transaction: currentTrx, receipt };
  }

  public static getAllTransactions(): PaymentTransaction[] {
    return this.getFromStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }

  public static getAllReceipts(): PaymentReceipt[] {
    return this.getFromStorage(STORAGE_KEYS.RECEIPTS, INITIAL_RECEIPTS);
  }

  public static getReceiptByNumberOrTxn(ref: string): PaymentReceipt | null {
    const clean = ref.trim().toLowerCase();
    const receipts = this.getAllReceipts();
    return (
      receipts.find(
        (r) =>
          r.receiptNumber.toLowerCase() === clean ||
          r.transactionReference.toLowerCase() === clean ||
          r.gatewayTransactionId.toLowerCase() === clean
      ) || null
    );
  }

  public static getTransactionByRef(ref: string): PaymentTransaction | null {
    const clean = ref.trim().toLowerCase();
    const transactions = this.getAllTransactions();
    return (
      transactions.find(
        (t) =>
          t.transactionReference.toLowerCase() === clean ||
          t.id.toLowerCase() === clean ||
          (t.receiptNumber && t.receiptNumber.toLowerCase() === clean)
      ) || null
    );
  }
}
