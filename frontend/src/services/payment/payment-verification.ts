import { PublicVerificationResult } from '@/types/payment';
import { PaymentService } from './payment-service';

export class PaymentVerificationService {
  /**
   * Public-facing transaction & receipt authenticator.
   * Strips out raw confidential data to prevent PII exposure.
   */
  public static async verifyPublicReceipt(
    queryRef: string
  ): Promise<PublicVerificationResult> {
    // Artificial cryptographic validation latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const clean = queryRef.trim();
    if (!clean) {
      return {
        verified: false,
        status: 'INVALID',
        verificationMessage: {
          bn: 'অনুগ্রহ করে সঠিক রসিদ নম্বর (যেমন: DSCC-RCP-2026-XXXX) বা ট্রানজেকশন আইডি প্রদান করুন।',
          en: 'Please provide a valid Receipt Number (e.g. DSCC-RCP-2026-XXXX) or Transaction ID.',
        },
      };
    }

    const receipt = PaymentService.getReceiptByNumberOrTxn(clean);
    if (receipt) {
      return {
        verified: true,
        status: 'VERIFIED',
        receiptNumber: receipt.receiptNumber,
        transactionReference: receipt.transactionReference,
        serviceName: receipt.serviceName,
        serviceReference: receipt.serviceReference,
        wardNumber: receipt.wardNumber,
        amount: receipt.amount,
        currency: receipt.currency,
        paymentDate: receipt.paidAt,
        paymentMethod: receipt.paymentMethod,
        issuingAuthority: {
          bn: 'ঢাকা সিটি কর্পোরেশন রাজস্ব বিভাগ',
          en: 'Dhaka City Corporation Revenue Department',
        },
        verificationMessage: {
          bn: 'রসিদটি ঢাকা সিটি কর্পোরেশনের কেন্দ্রীয় ট্রেজারি সার্ভার দ্বারা যাচাইকৃত ও সত্য।',
          en: 'The receipt has been verified as authentic by Dhaka City Corporation Central Treasury.',
        },
      };
    }

    // Check transaction if receipt not yet generated or pending
    const transaction = PaymentService.getTransactionByRef(clean);
    if (transaction) {
      if (transaction.status === 'SUCCESS') {
        return {
          verified: true,
          status: 'VERIFIED',
          receiptNumber: transaction.receiptNumber || 'N/A',
          transactionReference: transaction.transactionReference,
          serviceName: transaction.serviceName,
          serviceReference: transaction.serviceReference,
          wardNumber: transaction.wardNumber,
          amount: transaction.amount,
          currency: transaction.currency,
          paymentDate: transaction.completedAt || transaction.initiatedAt,
          paymentMethod: transaction.paymentMethod,
          issuingAuthority: {
            bn: 'ঢাকা সিটি কর্পোরেশন রাজস্ব বিভাগ',
            en: 'Dhaka City Corporation Revenue Department',
          },
          verificationMessage: {
            bn: 'লেনদেনটি সফলভাবে সম্পন্ন হয়েছে এবং সিটি কর্পোরেশনের মূল হিসেবে জমা হয়েছে।',
            en: 'Transaction completed successfully and credited to City Corporation treasury.',
          },
        };
      } else {
        return {
          verified: false,
          status: transaction.status === 'INITIATED' ? 'PENDING' : 'INVALID',
          transactionReference: transaction.transactionReference,
          amount: transaction.amount,
          verificationMessage: {
            bn: `লেনদেনটি বর্তমানে ${transaction.status} অবস্থায় রয়েছে। সিটি কর্পোরেশনের ব্যাংক হিসেবে চূড়ান্ত নিষ্পত্তি হয়নি।`,
            en: `Transaction is currently in ${transaction.status} state. Final settlement not confirmed.`,
          },
        };
      }
    }

    return {
      verified: false,
      status: 'INVALID',
      verificationMessage: {
        bn: 'প্রদত্ত নম্বরটির বিপরীতে ঢাকা সিটি কর্পোরেশনের কেন্দ্রীয় সার্ভারে কোনো পরিশোধিত রেকর্ড পাওয়া যায়নি।',
        en: 'No verified payment record found in Dhaka City Corporation central registry for this reference.',
      },
    };
  }
}
