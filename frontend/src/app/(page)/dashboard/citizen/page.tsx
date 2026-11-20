'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Building,
  Calculator,
  CalendarDays,
  CheckCircle2,
  Construction,
  FileBadge2,
  FileCheck2,
  LayoutDashboard,
  QrCode,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import {
  ApplicationType,
  FacilityBooking,
  HoldingTaxInput,
  HoldingTaxRecord,
  PaymentMethod,
  ServiceApplication,
  TimeSlot,
  WardInfo,
} from '@/types';
import { CITIZEN_FACILITIES, CitizenTab, isValidCitizenTab } from '@/data/citizenData';
import { StatusBadge } from '@/components/StatusBadge';
import { PaymentModal } from '@/components/PaymentModal';
import { QrCertificateData, QrCertificateModal } from '@/components/QrCertificateModal';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function CitizenPortalContent() {
  const { language, t } = useApp();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const rawTabParam = searchParams.get('tab');
  const validatedTab: CitizenTab | null = isValidCitizenTab(rawTabParam) ? rawTabParam : null;

  const citizenNameEn = user?.nameEn || 'Citizen Account';
  const citizenNameBn = user?.nameBn || citizenNameEn;
  const citizenTitleEn = user?.titleEn || 'Verified Resident';
  const citizenTitleBn = user?.titleBn || 'যাচাইকৃত নাগরিক';
  const citizenNid = user?.nid || '1992269184723';
  const citizenPhone = user?.phone || '01711482910';
  const citizenWard = user?.wardNumber || 27;

  const [activeTab, setActiveTab] = useState<CitizenTab>(validatedTab ?? 'overview');
  const [wards, setWards] = useState<WardInfo[]>([]);
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [taxRecords, setTaxRecords] = useState<HoldingTaxRecord[]>([]);
  const [bookings, setBookings] = useState<FacilityBooking[]>([]);

  // Payment & QR Modals
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    amountBdt: number;
    title: string;
    onConfirm: (method: PaymentMethod) => Promise<void>;
  }>({
    open: false,
    amountBdt: 0,
    title: '',
    onConfirm: async () => {},
  });
  const [qrModal, setQrModal] = useState<{ open: boolean; data: QrCertificateData | null }>({
    open: false,
    data: null,
  });

  // Trade License Form State
  const [tlMode, setTlMode] = useState<'new' | 'renewal'>('new');
  const [tlBusinessName, setTlBusinessName] = useState('Dhaka Green Logistics Ltd.');
  const [tlCategory, setTlCategory] = useState('IT & Software Consultancy');
  const [tlWard, setTlWard] = useState(citizenWard);
  const [tlAddress, setTlAddress] = useState('House 18, Road 6, Dhanmondi, Dhaka');
  const [tlNid, setTlNid] = useState(citizenNid);
  const [tlPhone, setTlPhone] = useState(citizenPhone);

  // Holding Tax Form State
  const [taxInput, setTaxInput] = useState<HoldingTaxInput>({
    wardNumber: citizenWard,
    holdingNumber: `${citizenWard}-0412-B`,
    ownerName: citizenNameEn,
    propertyType: 'residential',
    areaSqFt: 2200,
    floors: 1,
    roadWidthCategory: 'main_road',
  });
  const [applyRebate, setApplyRebate] = useState(true);

  // Certificates Form State
  const [certType, setCertType] = useState<'citizen_certificate' | 'birth_certificate'>('citizen_certificate');
  const [certApplicant, setCertApplicant] = useState(citizenNameEn);
  const [certNid, setCertNid] = useState(citizenNid);
  const [certWard, setCertWard] = useState(citizenWard);
  const [certAddress, setCertAddress] = useState('House 42, Road 9/A, Dhanmondi, Dhaka');

  // Road Digging Form State
  const [rdOrg, setRdOrg] = useState('Metro Optical Fiber Network');
  const [rdWard, setRdWard] = useState(36);
  const [rdRoad, setRdRoad] = useState('Motijheel Commercial Inner Lane 4');
  const [rdLength, setRdLength] = useState(25);
  const [rdSurface, setRdSurface] = useState<'Asphalt' | 'Concrete' | 'Paver'>('Asphalt');

  // Facility Booking State
  const [selectedFacilityIdx, setSelectedFacilityIdx] = useState(0);
  const [bookingDate, setBookingDate] = useState('2026-11-24');
  const [bookingSlot, setBookingSlot] = useState<TimeSlot>('morning');
  const [bookingPurpose, setBookingPurpose] = useState('Civic Community Workshop');

  const loadData = async () => {
    const [w, a, tx, b] = await Promise.all([
      mockApi.getWards(),
      mockApi.getApplications(),
      mockApi.getTaxRecords(),
      mockApi.getBookings(),
    ]);
    setWards(w);
    setApplications(a);
    setTaxRecords(tx);
    setBookings(b);
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      mockApi.getWards(),
      mockApi.getApplications(),
      mockApi.getTaxRecords(),
      mockApi.getBookings(),
    ]).then(([w, a, tx, b]) => {
      if (!active) return;
      setWards(w);
      setApplications(a);
      setTaxRecords(tx);
      setBookings(b);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (validatedTab) {
      queueMicrotask(() => setActiveTab(validatedTab));
    }
  }, [validatedTab]);

  const taxCalculation = useMemo(() => mockApi.calculateHoldingTax(taxInput), [taxInput]);
  const taxFinalPayable = applyRebate
    ? Math.round(taxCalculation.totalPayableBdt * 0.9)
    : taxCalculation.totalPayableBdt;

  const tlFee = tlCategory.includes('Retail') ? 3200 : tlCategory.includes('Manufacturing') ? 5500 : 4500;
  const rdFee = Math.max(5000, rdLength * (rdSurface === 'Concrete' ? 450 : rdSurface === 'Asphalt' ? 350 : 250));

  const selectedFacility = CITIZEN_FACILITIES[selectedFacilityIdx] ?? CITIZEN_FACILITIES[0];

  const isSlotTaken = (date: string, slot: TimeSlot) =>
    bookings.some(
      (b) =>
        b.facilityNameEn === selectedFacility.nameEn &&
        b.bookingDate === date &&
        (b.slot === slot || b.slot === 'full_day' || slot === 'full_day')
    );

  const openQrForApplication = (app: ServiceApplication) => {
    const titleMap: Record<ApplicationType, { en: string; bn: string }> = {
      trade_license: { en: 'Digital Trade License Certificate', bn: 'ডিজিটাল ট্রেড লাইসেন্স সনদ' },
      birth_certificate: { en: 'Birth Registration Certificate', bn: 'ডিজিটাল জন্ম নিবন্ধন সনদ' },
      citizen_certificate: { en: 'Citizen & Residency Certificate', bn: 'নাগরিকত্ব ও চারিত্রিক সনদ' },
      road_digging: { en: 'Road Excavation Authorization', bn: 'রাস্তা খনন অনুমোদনপত্র' },
    };
    setQrModal({
      open: true,
      data: {
        referenceId: app.referenceId,
        titleEn: titleMap[app.type].en,
        titleBn: titleMap[app.type].bn,
        ownerName: app.businessName ? `${app.applicantName} (${app.businessName})` : app.applicantName,
        wardNumber: app.wardNumber,
        issuedAt: app.reviewedAt || app.submittedAt,
        amountBdt: app.feeBdt,
        transactionId: app.transactionId,
        status: app.status,
        qrHash: app.qrHash,
        extraMeta: app.address,
      },
    });
  };

  const handleSubmitApplication = (
    type: ApplicationType,
    payload: {
      applicantName: string;
      nid: string;
      phone: string;
      wardNumber: number;
      businessName?: string;
      businessCategory?: string;
      address: string;
      feeBdt: number;
      details?: Record<string, string | number>;
    },
    modalTitle: string
  ) => {
    setPaymentModal({
      open: true,
      amountBdt: payload.feeBdt,
      title: modalTitle,
      onConfirm: async (method) => {
        const res = await mockApi.submitApplication({
          type,
          ...payload,
          paymentMethod: method,
        });
        await loadData();
        setPaymentModal((prev) => ({ ...prev, open: false }));
        openQrForApplication(res.application);
      },
    });
  };

  const handlePayHoldingTax = () => {
    setPaymentModal({
      open: true,
      amountBdt: taxFinalPayable,
      title: `${language === 'bn' ? 'হোল্ডিং ট্যাক্স পরিশোধ' : 'Holding Tax'} · ${taxInput.holdingNumber}`,
      onConfirm: async (method) => {
        const res = await mockApi.payHoldingTax(taxInput, taxFinalPayable, method);
        await loadData();
        setPaymentModal((prev) => ({ ...prev, open: false }));
        setQrModal({
          open: true,
          data: {
            referenceId: res.record.receiptId,
            titleEn: `Holding Tax Clearance Receipt (${res.record.fiscalYear})`,
            titleBn: `হোল্ডিং ট্যাক্স পরিশোধ রসিদ (${res.record.fiscalYear})`,
            ownerName: `${res.record.ownerName} · Holding ${res.record.holdingNumber}`,
            wardNumber: res.record.wardNumber,
            issuedAt: res.record.paidAt,
            amountBdt: res.record.amountPaidBdt,
            transactionId: res.record.transactionId,
            status: 'VERIFIED',
            qrHash: res.record.qrHash,
          },
        });
      },
    });
  };

  const handleBookFacility = () => {
    const slotMultiplier = bookingSlot === 'full_day' ? 1.8 : 1;
    const fee = Math.round(selectedFacility.feeBdt * slotMultiplier);
    setPaymentModal({
      open: true,
      amountBdt: fee,
      title: language === 'bn' ? selectedFacility.nameBn : selectedFacility.nameEn,
      onConfirm: async (method) => {
        const res = await mockApi.bookFacility({
          facilityType: selectedFacility.type,
          facilityNameEn: selectedFacility.nameEn,
          facilityNameBn: selectedFacility.nameBn,
          wardNumber: selectedFacility.wardNumber,
          bookingDate,
          slot: bookingSlot,
          applicantName: citizenNameEn,
          phone: citizenPhone,
          purpose: bookingPurpose,
          feeBdt: fee,
          paymentMethod: method,
        });
        await loadData();
        setPaymentModal((prev) => ({ ...prev, open: false }));
        setQrModal({
          open: true,
          data: {
            referenceId: res.booking.bookingId,
            titleEn: `Facility Booking Pass · ${res.booking.facilityNameEn}`,
            titleBn: `ফ্যাসিলিটি বুকিং পাস · ${res.booking.facilityNameBn}`,
            ownerName: res.booking.applicantName,
            wardNumber: res.booking.wardNumber,
            issuedAt: res.booking.bookingDate,
            amountBdt: res.booking.feeBdt,
            transactionId: res.booking.transactionId,
            status: 'CONFIRMED',
            qrHash: `SHA256:${res.booking.bookingId}`,
            extraMeta: `Slot: ${res.booking.slot.toUpperCase()} · ${res.booking.purpose}`,
          },
        });
      },
    });
  };

  const tabs: { id: CitizenTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: t.citizenPortal.tabs.overview, icon: LayoutDashboard },
    { id: 'tradeLicense', label: t.citizenPortal.tabs.tradeLicense, icon: FileBadge2 },
    { id: 'holdingTax', label: t.citizenPortal.tabs.holdingTax, icon: Calculator },
    { id: 'certificates', label: t.citizenPortal.tabs.certificates, icon: FileCheck2 },
    { id: 'roadDigging', label: t.citizenPortal.tabs.roadDigging, icon: Construction },
    { id: 'facilityBooking', label: t.citizenPortal.tabs.facilityBooking, icon: CalendarDays },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Portal Upgrade Banner */}
      <div className="p-4 bg-[#006A4E] text-white rounded-xl flex items-center justify-between shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold">
            ★
          </div>
          <div>
            <div className="font-bold text-sm">
              {language === 'bn' ? 'নতুন নাগরিক পোর্টাল চালু হয়েছে' : 'New Dedicated Citizen Portal Live'}
            </div>
            <div className="text-xs text-emerald-100">
              {language === 'bn'
                ? 'অনলাইন আবেদন, সনদ যাচাই, অভিযোগ ডেস্ক ও নোটিফিকেশনের জন্য নতুন নাগরিক পোর্টালে যান।'
                : 'Enjoy dedicated sidebar navigation, live grievance tracking, and instant certificate downloads.'}
            </div>
          </div>
        </div>
        <a
          href="/citizen"
          className="px-4 py-2 bg-white text-[#006A4E] text-xs font-bold rounded-lg hover:bg-emerald-50 transition shadow-sm"
        >
          {language === 'bn' ? 'নাগরিক পোর্টালে যান' : 'Go to Citizen Portal (/citizen)'}
        </a>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#006A4E]">
            {language === 'bn' ? citizenTitleBn : citizenTitleEn}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-0.5">
            {t.citizenPortal.title}
          </h1>
          <p className="text-sm text-[#4B5563] mt-1">{t.citizenPortal.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-4 bg-[#ECFDF5] border border-emerald-200 rounded-lg px-4 py-3 text-xs">
          <div>
            <span className="text-[#4B5563] block">{language === 'bn' ? 'নাগরিক নাম' : 'Citizen Account'}</span>
            <span className="font-bold text-[#111827]">
              {language === 'bn' ? citizenNameBn : citizenNameEn}
            </span>
          </div>
          <div className="border-l border-emerald-200 pl-4">
            <span className="text-[#4B5563] block">NID</span>
            <span className="font-mono font-semibold text-[#111827] tabular-nums">
              {citizenNid}
            </span>
          </div>
          <div className="border-l border-emerald-200 pl-4">
            <span className="text-[#4B5563] block">{language === 'bn' ? 'মোবাইল' : 'Mobile'}</span>
            <span className="font-mono font-semibold text-[#111827] tabular-nums">
              {citizenPhone}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-[#E2E8F0] mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#006A4E] text-white shadow-sm font-semibold'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-white/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-emerald-200' : 'text-[#006A4E]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="text-base font-bold text-[#111827]">{t.citizenPortal.myApplications}</h2>
              <span className="text-xs font-mono text-[#4B5563] tabular-nums">{applications.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-[#4B5563] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Reference ID</th>
                    <th className="px-6 py-3 font-semibold">Service / Business</th>
                    <th className="px-6 py-3 font-semibold">{t.common.ward}</th>
                    <th className="px-6 py-3 font-semibold text-right">Fee (BDT)</th>
                    <th className="px-6 py-3 font-semibold">{t.common.status}</th>
                    <th className="px-6 py-3 font-semibold text-right">QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-3.5 font-mono text-xs font-semibold text-[#006A4E]">
                        {app.referenceId}
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-[#111827]">
                          {app.businessName || app.applicantName}
                        </p>
                        <p className="text-xs text-[#4B5563]">{app.type.replace('_', ' ')}</p>
                      </td>
                      <td className="px-6 py-3.5 tabular-nums text-[#4B5563]">
                        {t.common.ward} {app.wardNumber}
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-[#111827] tabular-nums">
                        ৳{app.feeBdt.toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge
                          variant={
                            app.status === 'approved'
                              ? 'success'
                              : app.status === 'pending'
                                ? 'warning'
                                : 'danger'
                          }
                          label={t.common[app.status]}
                        />
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => openQrForApplication(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] border border-emerald-200 hover:bg-[#006A4E] hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{t.citizenPortal.viewQrReceipt}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tax Payments */}
            <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#111827]">{t.citizenPortal.taxPayments}</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('holdingTax')}
                  className="text-xs font-semibold text-[#006A4E] hover:underline cursor-pointer"
                >
                  + {t.citizenPortal.tabs.holdingTax}
                </button>
              </div>
              <div className="space-y-3">
                {taxRecords.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-lg border border-[#E2E8F0] bg-slate-50"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-[#006A4E]">{tx.receiptId}</p>
                      <p className="text-sm font-semibold text-[#111827]">
                        Holding {tx.holdingNumber} · {t.common.ward} {tx.wardNumber}
                      </p>
                      <p className="text-xs text-[#4B5563] tabular-nums">
                        {tx.paidAt} · ৳{tx.amountPaidBdt.toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setQrModal({
                          open: true,
                          data: {
                            referenceId: tx.receiptId,
                            titleEn: `Holding Tax Clearance (${tx.fiscalYear})`,
                            titleBn: `হোল্ডিং ট্যাক্স পরিশোধ রসিদ (${tx.fiscalYear})`,
                            ownerName: `${tx.ownerName} · Holding ${tx.holdingNumber}`,
                            wardNumber: tx.wardNumber,
                            issuedAt: tx.paidAt,
                            amountBdt: tx.amountPaidBdt,
                            transactionId: tx.transactionId,
                            status: 'VERIFIED',
                            qrHash: tx.qrHash,
                          },
                        })
                      }
                      className="px-3 py-1.5 text-xs font-semibold bg-[#ECFDF5] text-[#006A4E] border border-emerald-200 hover:bg-[#006A4E] hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      QR Receipt
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Facility Bookings */}
            <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#111827]">{t.citizenPortal.myBookings}</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('facilityBooking')}
                  className="text-xs font-semibold text-[#006A4E] hover:underline cursor-pointer"
                >
                  + {t.citizenPortal.tabs.facilityBooking}
                </button>
              </div>
              <div className="space-y-3">
                {bookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-lg border border-[#E2E8F0] bg-slate-50"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-[#006A4E]">{bk.bookingId}</p>
                      <p className="text-sm font-semibold text-[#111827]">
                        {language === 'bn' ? bk.facilityNameBn : bk.facilityNameEn}
                      </p>
                      <p className="text-xs text-[#4B5563] tabular-nums">
                        {bk.bookingDate} ({bk.slot}) · ৳{bk.feeBdt.toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge variant="success" label={t.common.confirmed} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TRADE LICENSE */}
      {activeTab === 'tradeLicense' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitApplication(
                'trade_license',
                {
                  applicantName: citizenNameEn,
                  nid: tlNid,
                  phone: tlPhone,
                  wardNumber: tlWard,
                  businessName: tlBusinessName,
                  businessCategory: tlCategory,
                  address: tlAddress,
                  feeBdt: tlFee,
                  details: { mode: tlMode },
                },
                `${tlMode === 'new' ? 'New' : 'Renewal'} Trade License · ${tlBusinessName}`
              );
            }}
            className="lg:col-span-8 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-[#111827]">
                {language === 'bn' ? 'ট্রেড লাইসেন্স অনলাইন আবেদন' : 'Digital Trade License Application'}
              </h2>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTlMode('new')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                    tlMode === 'new' ? 'bg-[#006A4E] text-white shadow-sm' : 'text-[#4B5563]'
                  }`}
                >
                  {language === 'bn' ? 'নতুন আবেদন' : 'New License'}
                </button>
                <button
                  type="button"
                  onClick={() => setTlMode('renewal')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                    tlMode === 'renewal' ? 'bg-[#006A4E] text-white shadow-sm' : 'text-[#4B5563]'
                  }`}
                >
                  {language === 'bn' ? 'লাইসেন্স নবায়ন' : 'Annual Renewal'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Business / Enterprise Name'}
                </label>
                <input
                  type="text"
                  required
                  value={tlBusinessName}
                  onChange={(e) => setTlBusinessName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'ব্যবসার ধরন' : 'Business Category'}
                </label>
                <select
                  value={tlCategory}
                  onChange={(e) => setTlCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                >
                  <option value="IT & Software Consultancy">IT & Software Consultancy (৳4,500)</option>
                  <option value="Retail Grocery & Agro">Retail Grocery & Agro (৳3,200)</option>
                  <option value="Manufacturing & Packaging">Manufacturing & Packaging (৳5,500)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'আবেদনকারীর NID নম্বর' : 'Applicant NID Number'}
                </label>
                <input
                  type="text"
                  required
                  value={tlNid}
                  onChange={(e) => setTlNid(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'ওয়ার্ড নির্বাচন' : 'Ward Jurisdiction'}
                </label>
                <select
                  value={tlWard}
                  onChange={(e) => setTlWard(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                >
                  {wards.map((w) => (
                    <option key={w.wardNumber} value={w.wardNumber}>
                      Ward {w.wardNumber} — {language === 'bn' ? w.nameBn : w.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'ব্যবসার পূর্ণ ঠিকানা' : 'Premises Street Address'}
                </label>
                <input
                  type="text"
                  required
                  value={tlAddress}
                  onChange={(e) => setTlAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Contact Phone'}
                </label>
                <input
                  type="text"
                  required
                  value={tlPhone}
                  onChange={(e) => setTlPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#4B5563] block">
                  {language === 'bn' ? 'নির্ধারিত সরকারি ফি' : 'Statutory License Fee'}
                </span>
                <span className="text-xl font-bold text-[#006A4E] tabular-nums">
                  ৳{tlFee.toLocaleString()}
                </span>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {t.citizenPortal.submitAndPay}
              </button>
            </div>
          </form>

          <div className="lg:col-span-4 civic-card bg-[#ECFDF5] rounded-xl border border-emerald-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#111827]">
              {language === 'bn' ? 'প্রয়োজনীয় কাগজপত্র (ডিজিটাল)' : 'Paperless Checklist'}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#4B5563]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span>National ID (NID) Smart Verification</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span>Premises Lease Deed or Ownership Holding Number</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span>Updated Holding Tax Receipt (Cross-checked automatically)</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB: HOLDING TAX CALCULATOR */}
      {activeTab === 'holdingTax' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#111827]">
              {language === 'bn' ? 'স্বয়ংক্রিয় হোল্ডিং ট্যাক্স ক্যালকুলেটর' : 'Automated Holding Tax Calculator'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'হোল্ডিং নম্বর' : 'Holding Number'}
                </label>
                <input
                  type="text"
                  value={taxInput.holdingNumber}
                  onChange={(e) => setTaxInput({ ...taxInput, holdingNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'মালিকের নাম' : 'Property Owner Name'}
                </label>
                <input
                  type="text"
                  value={taxInput.ownerName}
                  onChange={(e) => setTaxInput({ ...taxInput, ownerName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ওয়ার্ড' : 'Ward'}
                </label>
                <select
                  value={taxInput.wardNumber}
                  onChange={(e) => setTaxInput({ ...taxInput, wardNumber: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                >
                  {wards.map((w) => (
                    <option key={w.wardNumber} value={w.wardNumber}>
                      Ward {w.wardNumber} — {language === 'bn' ? w.nameBn : w.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ভবনের ধরন' : 'Property Usage Type'}
                </label>
                <select
                  value={taxInput.propertyType}
                  onChange={(e) =>
                    setTaxInput({
                      ...taxInput,
                      propertyType: e.target.value as HoldingTaxInput['propertyType'],
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                >
                  <option value="residential">Residential (আবাসিক)</option>
                  <option value="mixed">Mixed Use (মিশ্র)</option>
                  <option value="commercial">Commercial (বাণিজ্যিক)</option>
                  <option value="industrial">Industrial (শিল্প)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'প্রতি তলার আয়তন (বর্গফুট)' : 'Floor Area (Sq. Ft)'}
                </label>
                <input
                  type="number"
                  min={200}
                  max={50000}
                  value={taxInput.areaSqFt}
                  onChange={(e) =>
                    setTaxInput({ ...taxInput, areaSqFt: Math.max(200, Number(e.target.value) || 200) })
                  }
                  className="w-full px-3 py-2 text-sm tabular-nums border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'তলা সংখ্যা' : 'Number of Floors'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={taxInput.floors}
                  onChange={(e) =>
                    setTaxInput({ ...taxInput, floors: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className="w-full px-3 py-2 text-sm tabular-nums border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-[#4B5563] pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={applyRebate}
                onChange={(e) => setApplyRebate(e.target.checked)}
                className="w-4 h-4 accent-[#006A4E]"
              />
              <span>
                {language === 'bn'
                  ? 'অনলাইন আগাম পরিশোধে ১০% রিবেট প্রয়োগ করুন'
                  : 'Apply 10% Early Online Payment Rebate (FY 2026–27)'}
              </span>
            </label>
          </div>

          <div className="lg:col-span-5 civic-card bg-[#006A4E] text-white rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <p className="text-xs font-semibold text-emerald-200">
                {language === 'bn' ? 'তাৎক্ষণিক কর মূল্যায়ন বিবরণী' : 'Live Assessment Breakdown'}
              </p>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between border-b border-white/15 pb-2">
                  <span className="text-emerald-100/90">Annual Rental Valuation</span>
                  <span className="font-semibold tabular-nums">
                    ৳{taxCalculation.annualValuationBdt.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/15 pb-2">
                  <span className="text-emerald-100/90">Holding Tax (7%)</span>
                  <span className="font-semibold tabular-nums">
                    ৳{taxCalculation.annualTaxBdt.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/15 pb-2">
                  <span className="text-emerald-100/90">Conservancy Fee (2%)</span>
                  <span className="font-semibold tabular-nums">
                    ৳{taxCalculation.conservancyFeeBdt.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/15 pb-2">
                  <span className="text-emerald-100/90">Streetlight Fee (1.5%)</span>
                  <span className="font-semibold tabular-nums">
                    ৳{taxCalculation.streetLightFeeBdt.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-white">Net Annual Payable</span>
                  <span className="text-2xl font-bold text-emerald-200 tabular-nums">
                    ৳{taxFinalPayable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayHoldingTax}
              className="w-full py-3 bg-white hover:bg-[#ECFDF5] text-[#006A4E] font-semibold text-sm rounded-lg transition-colors cursor-pointer"
            >
              {t.citizenPortal.payNow} · ৳{taxFinalPayable.toLocaleString()}
            </button>
          </div>
        </div>
      )}

      {/* TAB: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitApplication(
              certType,
              {
                applicantName: certApplicant,
                nid: certNid,
                phone: citizenPhone,
                wardNumber: certWard,
                address: certAddress,
                feeBdt: 100,
              },
              certType === 'citizen_certificate' ? 'Citizen & Residency Certificate' : 'Birth Registration Extract'
            );
          }}
          className="max-w-2xl civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
        >
          <h2 className="text-lg font-bold text-[#111827]">
            {language === 'bn' ? 'জন্ম ও নাগরিক সনদ আবেদন' : 'Birth & Citizen Certificate Request'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সনদের ধরন' : 'Certificate Type'}
              </label>
              <select
                value={certType}
                onChange={(e) =>
                  setCertType(e.target.value as 'citizen_certificate' | 'birth_certificate')
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="citizen_certificate">Citizen & Character Certificate (নাগরিকত্ব সনদ)</option>
                <option value="birth_certificate">Digital Birth Registration Extract (জন্ম সনদ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'পূর্ণ নাম' : 'Applicant Full Name'}
              </label>
              <input
                type="text"
                required
                value={certApplicant}
                onChange={(e) => setCertApplicant(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NID / Birth Reg No.
              </label>
              <input
                type="text"
                required
                value={certNid}
                onChange={(e) => setCertNid(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'ওয়ার্ড' : 'Ward'}
              </label>
              <select
                value={certWard}
                onChange={(e) => setCertWard(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                {wards.map((w) => (
                  <option key={w.wardNumber} value={w.wardNumber}>
                    Ward {w.wardNumber} — {language === 'bn' ? w.nameBn : w.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'স্থায়ী ঠিকানা' : 'Verified Address'}
              </label>
              <input
                type="text"
                required
                value={certAddress}
                onChange={(e) => setCertAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#4B5563] block">Processing Fee</span>
              <span className="text-lg font-bold text-[#006A4E] tabular-nums">৳100</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {t.citizenPortal.submitAndPay}
            </button>
          </div>
        </form>
      )}

      {/* TAB: ROAD DIGGING */}
      {activeTab === 'roadDigging' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitApplication(
              'road_digging',
              {
                applicantName: rdOrg,
                nid: citizenNid,
                phone: citizenPhone,
                wardNumber: rdWard,
                businessName: `${rdRoad} (${rdLength}m ${rdSurface})`,
                address: rdRoad,
                feeBdt: rdFee,
                details: { lengthMeters: rdLength, surfaceType: rdSurface },
              },
              `Road Digging Permit · Ward ${rdWard} (${rdLength}m)`
            );
          }}
          className="max-w-2xl civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
        >
          <h2 className="text-lg font-bold text-[#111827]">
            {language === 'bn' ? 'রাস্তা খননের অনুমতি আবেদন' : 'Road Excavation & Restoration Permit'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সংস্থা / আবেদনকারীর নাম' : 'Utility Agency / Applicant'}
              </label>
              <input
                type="text"
                required
                value={rdOrg}
                onChange={(e) => setRdOrg(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ward</label>
              <select
                value={rdWard}
                onChange={(e) => setRdWard(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                {wards.map((w) => (
                  <option key={w.wardNumber} value={w.wardNumber}>
                    Ward {w.wardNumber} — {language === 'bn' ? w.nameBn : w.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সড়কের ধরন' : 'Road Surface Type'}
              </label>
              <select
                value={rdSurface}
                onChange={(e) => setRdSurface(e.target.value as 'Asphalt' | 'Concrete' | 'Paver')}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="Asphalt">Bituminous Asphalt (৳350/m)</option>
                <option value="Concrete">RCC Concrete (৳450/m)</option>
                <option value="Paver">Interlocking Paver (৳250/m)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'খননের দৈর্ঘ্য (মিটার)' : 'Trench Length (Meters)'}
              </label>
              <input
                type="number"
                min={5}
                max={1000}
                value={rdLength}
                onChange={(e) => setRdLength(Math.max(5, Number(e.target.value) || 5))}
                className="w-full px-3 py-2 text-sm tabular-nums border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সড়কের নাম ও অবস্থান' : 'Road Location'}
              </label>
              <input
                type="text"
                required
                value={rdRoad}
                onChange={(e) => setRdRoad(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#4B5563] block">Road Restoration Deposit</span>
              <span className="text-xl font-bold text-[#006A4E] tabular-nums">
                ৳{rdFee.toLocaleString()}
              </span>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {t.citizenPortal.submitAndPay}
            </button>
          </div>
        </form>
      )}

      {/* TAB: FACILITY BOOKING CALENDAR */}
      {activeTab === 'facilityBooking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#111827]">
              {language === 'bn'
                ? 'কমিউনিটি সেন্টার ও কবরস্থান স্লট বুকিং'
                : 'Community Center & Cemetery Slot Booking'}
            </h2>

            <div className="space-y-3">
              <p
                id="facility-selector-label"
                className="block text-xs font-semibold text-[#111827]"
              >
                {language === 'bn' ? 'সুবিধা কেন্দ্র নির্বাচন করুন' : 'Select Municipal Facility'}
              </p>
              <div
                role="group"
                aria-labelledby="facility-selector-label"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {CITIZEN_FACILITIES.map((fac, idx) => (
                  <button
                    key={fac.nameEn}
                    type="button"
                    aria-pressed={selectedFacilityIdx === idx}
                    onClick={() => setSelectedFacilityIdx(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedFacilityIdx === idx
                        ? 'border-[#006A4E] bg-[#ECFDF5] ring-2 ring-[#006A4E]/25'
                        : 'border-[#E2E8F0] hover:border-[#006A4E]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#4B5563] mb-1">
                      <span>{fac.type === 'community_center' ? 'Community Hall' : 'Cemetery'}</span>
                      <span className="tabular-nums">Ward {fac.wardNumber}</span>
                    </div>
                    <p className="text-sm font-bold text-[#111827]">
                      {language === 'bn' ? fac.nameBn : fac.nameEn}
                    </p>
                    <p className="text-xs font-semibold text-[#006A4E] mt-1 tabular-nums">
                      Base Fee: ৳{fac.feeBdt.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'তারিখ নির্বাচন করুন' : 'Reservation Date'}
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm tabular-nums border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'অনুষ্ঠানের উদ্দেশ্য' : 'Purpose / Event'}
                </label>
                <input
                  type="text"
                  value={bookingPurpose}
                  onChange={(e) => setBookingPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-2">
                {language === 'bn' ? 'লাইভ স্লট অ্যাভেইলেবিলিটি' : 'Live Slot Availability'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['morning', 'evening', 'full_day'] as TimeSlot[]).map((slot) => {
                  const taken = isSlotTaken(bookingDate, slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={taken}
                      onClick={() => setBookingSlot(slot)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        taken
                          ? 'bg-[#FEF2F2] border-red-200 text-[#C81E1E]/70 cursor-not-allowed'
                          : bookingSlot === slot
                            ? 'bg-[#006A4E] border-[#006A4E] text-white cursor-pointer'
                            : 'bg-white border-[#E2E8F0] hover:border-[#006A4E] hover:bg-[#ECFDF5] text-[#111827] cursor-pointer'
                      }`}
                    >
                      <p className="text-xs font-bold uppercase">{slot.replace('_', ' ')}</p>
                      <p className="text-[11px] mt-0.5">
                        {taken ? 'Booked' : 'Available'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#4B5563] block">Reservation Fee</span>
                <span className="text-xl font-bold text-[#006A4E] tabular-nums">
                  ৳{Math.round(selectedFacility.feeBdt * (bookingSlot === 'full_day' ? 1.8 : 1)).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                disabled={isSlotTaken(bookingDate, bookingSlot)}
                onClick={handleBookFacility}
                className="px-6 py-2.5 bg-[#006A4E] hover:bg-[#00523C] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {t.citizenPortal.submitAndPay}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 civic-card bg-[#ECFDF5]/60 rounded-xl border border-emerald-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#006A4E]" />
              <span>{language === 'bn' ? 'নিশ্চিতকৃত বুকিং সমূহ' : 'Confirmed Upcoming Slots'}</span>
            </h3>
            <div className="space-y-3">
              {bookings.map((bk) => (
                <div key={bk.id} className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-[#111827]">
                    <span>{language === 'bn' ? bk.facilityNameBn : bk.facilityNameEn}</span>
                    <span className="font-mono text-[#006A4E]">{bk.bookingId}</span>
                  </div>
                  <p className="text-[#4B5563] tabular-nums">
                    {bk.bookingDate} · {bk.slot.toUpperCase()} · {bk.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        open={paymentModal.open}
        amountBdt={paymentModal.amountBdt}
        title={paymentModal.title}
        onClose={() => setPaymentModal((prev) => ({ ...prev, open: false }))}
        onConfirm={paymentModal.onConfirm}
      />

      <QrCertificateModal
        open={qrModal.open}
        data={qrModal.data}
        onClose={() => setQrModal({ open: false, data: null })}
      />
    </div>
  );
}

export default function CitizenDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['citizen']}>
      <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-sm text-slate-500">Loading Citizen Portal...</div>}>
        <CitizenPortalContent />
      </Suspense>
    </ProtectedRoute>
  );
}
