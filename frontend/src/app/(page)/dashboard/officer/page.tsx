'use client';

import React, { useEffect, useState } from 'react';
import { Check, Satellite, UserPlus, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { FIELD_STAFF, mockApi } from '@/services/mockApi';
import { Complaint, ServiceApplication } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SatellitePinMap } from '@/components/SatellitePinMap';
import { WorkspaceHeader } from '@/components/common/WorkspaceHeader';

function OfficerDashboardContent() {
  const { language, t } = useApp();
  const { user } = useAuth();
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [previewComplaintId, setPreviewComplaintId] = useState<string | null>(null);

  const loadData = async () => {
    const [a, c] = await Promise.all([mockApi.getApplications(), mockApi.getComplaints()]);
    setApplications(a);
    setComplaints(c);
  };

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getApplications(), mockApi.getComplaints()]).then(([a, c]) => {
      if (!active) return;
      setApplications(a);
      setComplaints(c);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleReviewApp = async (id: string, status: 'approved' | 'rejected') => {
    await mockApi.updateApplicationStatus(id, status, user?.nameEn || 'Department Officer');
    await loadData();
  };

  const handleAssignStaff = async (complaintId: string, staffId: string) => {
    if (!staffId) return;
    await mockApi.assignComplaint(complaintId, staffId);
    await loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <WorkspaceHeader
        kicker={
          language === 'bn'
            ? 'বিভাগীয় কর্মকর্তা ও কাউন্সিলর প্যানেল'
            : 'Department Officer & Ward Councillor Desk'
        }
        title={
          language === 'bn'
            ? 'আবেদন যাচাই ও অভিযোগ বণ্টন'
            : 'Application Review & Staff Dispatch'
        }
        userName={(language === 'bn' ? user?.nameBn : user?.nameEn) || 'Department Officer'}
        userMeta={`${user?.employeeId || 'EMP-OFF-104'} · ${user?.department || 'Revenue & Trade Licensing'}`}
      />

      {/* Application Verification Queue */}
      <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#111827]">
            {language === 'bn'
              ? 'ট্রেড লাইসেন্স, সনদ ও রাস্তা খনন আবেদন কিউ'
              : 'E-Service Approval Queue (Trade License, Certificates, Road Digging)'}
          </h2>
          <span className="text-xs font-mono text-[#4B5563] tabular-nums">
            {applications.filter((a) => a.status === 'pending').length} pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-[#4B5563] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-3 font-semibold">Reference ID</th>
                <th className="px-6 py-3 font-semibold">Applicant / Business</th>
                <th className="px-6 py-3 font-semibold">Ward</th>
                <th className="px-6 py-3 font-semibold text-right">Fee Paid</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-3.5 font-mono text-xs font-bold text-[#006A4E]">
                    {app.referenceId}
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-[#111827]">
                      {app.businessName || app.applicantName}
                    </p>
                    <p className="text-xs text-[#4B5563]">
                      {app.type.replace('_', ' ')} · NID: {app.nid}
                    </p>
                  </td>
                  <td className="px-6 py-3.5 tabular-nums text-[#4B5563]">Ward {app.wardNumber}</td>
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
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleReviewApp(app.id, 'approved')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#006A4E] hover:bg-[#00523C] rounded-md transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewApp(app.id, 'rejected')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#C81E1E] bg-[#FEF2F2] hover:bg-red-100 border border-red-200 rounded-md transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incoming Complaints Dispatch */}
      <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#006A4E]" />
            <span>
              {language === 'bn'
                ? 'অভিযোগ মাঠকর্মী অ্যাসাইনমেন্ট'
                : 'Geo-Tagged Complaints Dispatch Queue'}
            </span>
          </h2>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {complaints.map((c) => (
            <div key={c.id} className="p-5 space-y-4 hover:bg-slate-50/70">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B5563]">
                    <span className="font-mono font-bold text-[#006A4E]">{c.trackingId}</span>
                    <span>·</span>
                    <span>{language === 'bn' ? c.departmentBn : c.departmentEn}</span>
                    <span>·</span>
                    <span className="tabular-nums">Ward {c.wardNumber}</span>
                    <span>·</span>
                    <StatusBadge
                      variant={
                        c.status === 'resolved'
                          ? 'success'
                          : c.status === 'pending'
                            ? 'warning'
                            : 'neutral'
                      }
                      label={t.complaintsPage.steps[c.status]}
                    />
                  </div>
                  <h3 className="text-sm font-bold text-[#111827]">{c.title}</h3>
                  <p className="text-xs text-[#4B5563]">{c.locationLabel}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewComplaintId(previewComplaintId === c.id ? null : c.id)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] border border-emerald-200 hover:bg-[#006A4E] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Satellite className="w-3.5 h-3.5" />
                    <span>
                      {previewComplaintId === c.id
                        ? language === 'bn'
                          ? 'ম্যাপ লুকান'
                          : 'Hide Map'
                        : language === 'bn'
                          ? 'স্যাটেলাইট ম্যাপ'
                          : 'Satellite View'}
                    </span>
                  </button>
                  <label
                    htmlFor={`assign-staff-${c.id}`}
                    className="text-xs font-semibold text-[#4B5563] whitespace-nowrap"
                  >
                    Assign Field Staff:
                  </label>
                  <select
                    id={`assign-staff-${c.id}`}
                    value={c.assignedStaffId || ''}
                    onChange={(e) => handleAssignStaff(c.id, e.target.value)}
                    className="px-3 py-2 text-xs font-medium border border-[#E2E8F0] rounded-lg bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  >
                    <option value="">-- Select Field Staff --</option>
                    {FIELD_STAFF.map((st) => (
                      <option key={st.id} value={st.id}>
                        {language === 'bn' ? st.nameBn : st.nameEn} (Ward {st.wardNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {previewComplaintId === c.id && (
                <SatellitePinMap
                  lat={c.latitude}
                  lng={c.longitude}
                  zoom={16}
                  label={`${c.trackingId} · Ward ${c.wardNumber}`}
                  subtitle={c.locationLabel}
                  heightClassName="h-52"
                  pinColor={c.status === 'resolved' ? 'teal' : 'rose'}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OfficerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['officer']}>
      <OfficerDashboardContent />
    </ProtectedRoute>
  );
}
