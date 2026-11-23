/**
 * Dhaka Smart City Corporation — Official QR Code & Cryptographic Verification Configuration
 *
 * Configures the QR payload format, environment feature flags, and payload generators.
 * When `ENABLE_QR_LIVE_URL` is false (default), the QR code encodes human-readable verification details.
 * When enabled (e.g. for production deployment), it cleanly appends the live verification link.
 */

export const QR_CONFIG = {
  // Feature flag: set via NEXT_PUBLIC_ENABLE_QR_LIVE_URL or toggle here
  ENABLE_LIVE_URL: process.env.NEXT_PUBLIC_ENABLE_QR_LIVE_URL === 'true' || false,
  // Base official domain for verification
  BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://dscc.smartcity.gov.bd',
  // Official Issuing Authority
  AUTHORITY_NAME_EN: 'Dhaka Smart City Corporation',
  AUTHORITY_NAME_BN: 'ঢাকা স্মার্ট সিটি কর্পোরেশন',
};

export interface QrRecordPayloadInput {
  status?: string;
  id: string;
  type: string;
  name: string;
  ward: string | number;
  date: string;
  authority?: string;
  feePaid?: string | number;
  hash: string;
}

/**
 * Builds a clean, human-readable multi-line payload for DSCC official QR codes.
 *
 * Format:
 * DHAKA SMART CITY CORPORATION
 * Status: VERIFIED
 * ID: <Record ID>
 * Type: <Document Type>
 * Name: <Recipient Name>
 * Ward: <Ward Zone>
 * Date: <Issue / Payment Date>
 * Authority: Dhaka Smart City Corporation
 * Fee Paid: <Amount>
 * Hash: <Digital Hash Signature>
 * [Optional when ENABLE_LIVE_URL is true] Verify Online: <baseUrl>/verify?id=<ID>
 */
export function buildQrRecordPayload(
  record: QrRecordPayloadInput,
  options?: { enableLiveUrl?: boolean; baseUrl?: string }
): string {
  const isLiveUrlEnabled =
    options?.enableLiveUrl !== undefined ? options.enableLiveUrl : QR_CONFIG.ENABLE_LIVE_URL;

  const baseUrl = options?.baseUrl || QR_CONFIG.BASE_URL;

  const wardFormatted =
    typeof record.ward === 'number' || /^\d+$/.test(String(record.ward).trim())
      ? `Ward ${record.ward}`
      : String(record.ward);

  const feeFormatted =
    record.feePaid !== undefined && record.feePaid !== null && record.feePaid !== ''
      ? typeof record.feePaid === 'number'
        ? `৳${record.feePaid.toLocaleString('en-IN')}`
        : String(record.feePaid).startsWith('৳')
        ? String(record.feePaid)
        : `৳${record.feePaid}`
      : 'Free / N/A';

  const lines = [
    'DHAKA SMART CITY CORPORATION',
    `Status: ${record.status || 'VERIFIED'}`,
    `ID: ${record.id}`,
    `Type: ${record.type}`,
    `Name: ${record.name}`,
    `Ward: ${wardFormatted}`,
    `Date: ${record.date}`,
    `Authority: ${record.authority || QR_CONFIG.AUTHORITY_NAME_EN}`,
    `Fee Paid: ${feeFormatted}`,
    `Hash: ${record.hash}`,
  ];

  if (isLiveUrlEnabled) {
    const cleanId = encodeURIComponent(record.id.trim());
    lines.push(`Verify Online: ${baseUrl}/verify?id=${cleanId}`);
  }

  return lines.join('\n');
}
