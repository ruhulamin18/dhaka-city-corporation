'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Camera, CheckCircle2, MapPin, Play, Satellite, Upload } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { FIELD_STAFF, getSampleCitizenPhoto, mockApi } from '@/services/mockApi';
import { Complaint } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SatellitePinMap } from '@/components/SatellitePinMap';
import { WorkspaceHeader } from '@/components/common/WorkspaceHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { DHAKA_CENTER } from '@/lib/dhakaCoords';

function StaffDashboardContent() {
  const { language, t } = useApp();
  const { user } = useAuth();
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [proofPhotos, setProofPhotos] = useState<Record<string, string>>({});
  const [expandedMapId, setExpandedMapId] = useState<string | null>(null);

  const loadData = async () => {
    const list = await mockApi.getComplaints();
    setComplaints(list);
  };

  useEffect(() => {
    let active = true;
    mockApi.getComplaints().then((list) => {
      if (!active) return;
      setComplaints(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const assignedTasks = complaints.filter((c) => {
    if (selectedStaffId === 'all') return c.assignedStaffId || c.status !== 'pending';
    return c.assignedStaffId === selectedStaffId;
  });
  const mappedTasks = assignedTasks.filter(
    (task): task is Complaint & { latitude: number; longitude: number } =>
      task.latitude != null && task.longitude != null
  );

  const handleProofUpload = (complaintId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProofPhotos((prev) => ({ ...prev, [complaintId]: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateTask = async (
    complaintId: string,
    status: 'in_progress' | 'resolved'
  ) => {
    await mockApi.updateComplaintStatus(
      complaintId,
      status,
      notes[complaintId] ||
        (status === 'resolved' ? 'Site repaired, cleaned, and verified by field team.' : undefined),
      proofPhotos[complaintId]
    );
    await loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <WorkspaceHeader
        kicker={
          language === 'bn'
            ? 'মাঠপর্যায়ের প্রকৌশলী ও পরিচ্ছন্নতা কর্মী পোর্টাল'
            : 'Field Operations & Rapid Dispatch Portal'
        }
        title={
          language === 'bn'
            ? 'নির্ধারিত কাজের তালিকা ও সমাধান প্রমাণ'
            : 'Assigned Field Tasks & Proof Upload'
        }
        userName={(language === 'bn' ? user?.nameBn : user?.nameEn) || 'Field Staff'}
        userMeta={user?.employeeId || 'EMP-STF-209'}
        actions={
          <select
            aria-label={language === 'bn' ? 'মাঠকর্মী ফিল্টার' : 'Filter by field staff'}
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border border-[#E2E8F0] rounded-lg bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
          >
            <option value="all">All Assigned Field Tasks</option>
            {FIELD_STAFF.map((st) => (
              <option key={st.id} value={st.id}>
                {language === 'bn' ? st.nameBn : st.nameEn}
              </option>
            ))}
          </select>
        }
      />

      {assignedTasks.length === 0 ? (
        <EmptyState message="No field complaints assigned to this staff filter yet. Assign complaints from the Officer Desk!" />
      ) : (
        <div className="space-y-6">
          {/* Live Field Sites Satellite Overview */}
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Satellite className="w-4 h-4 text-[#006A4E]" />
                <span>
                  {language === 'bn'
                    ? 'মাঠপর্যায়ের নির্ধারিত কাজের স্যাটেলাইট ম্যাপ'
                    : 'Assigned Field Operations Satellite Map'}
                </span>
              </h2>
              <span className="text-xs font-mono text-[#4B5563] tabular-nums">
                {assignedTasks.length} {language === 'bn' ? 'টি সাইট' : 'active sites'}
              </span>
            </div>
            <SatellitePinMap
              lat={mappedTasks[0]?.latitude ?? DHAKA_CENTER.lat}
              lng={mappedTasks[0]?.longitude ?? DHAKA_CENTER.lng}
              zoom={12}
              heightClassName="h-64"
              pins={mappedTasks.map((task) => ({
                id: task.id,
                lat: task.latitude,
                lng: task.longitude,
                badge: `${task.trackingId} · Ward ${task.wardNumber}`,
                title: task.title,
                subtitle: task.locationLabel,
                color: task.status === 'resolved' ? 'teal' : task.status === 'in_progress' ? 'amber' : 'rose',
              }))}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignedTasks.map((task) => (
            <div key={task.id} className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#4B5563] mb-1">
                    <span className="font-mono font-bold text-[#006A4E]">{task.trackingId}</span>
                    <span>·</span>
                    <span className="tabular-nums">Ward {task.wardNumber}</span>
                    <span>·</span>
                    <span className="font-semibold text-[#006A4E]">
                      {task.assignedStaffName || 'Unassigned'}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[#111827]">{task.title}</h2>
                </div>
                <StatusBadge
                  variant={
                    task.status === 'resolved'
                      ? 'success'
                      : task.status === 'in_progress'
                        ? 'warning'
                        : 'neutral'
                  }
                  label={t.complaintsPage.steps[task.status]}
                />
              </div>

              <p className="text-sm text-[#4B5563]">{task.description}</p>

              <div className="bg-slate-50 border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#111827]">
                  <MapPin className="w-4 h-4 text-[#C81E1E] shrink-0" />
                  <span>{task.locationLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  {task.latitude != null && task.longitude != null && (
                    <>
                      <span className="font-mono text-[#4B5563] tabular-nums">
                        {task.latitude.toFixed(4)}°N, {task.longitude.toFixed(4)}°E
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedMapId(expandedMapId === task.id ? null : task.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ECFDF5] border border-emerald-200 hover:bg-[#006A4E] text-[#006A4E] hover:text-white text-[11px] font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        <Satellite className="w-3 h-3" />
                        <span>
                          {expandedMapId === task.id
                            ? language === 'bn'
                              ? 'ম্যাপ লুকান'
                              : 'Hide Map'
                            : language === 'bn'
                              ? 'স্যাটেলাইট'
                              : 'Satellite'}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {expandedMapId === task.id && task.latitude != null && task.longitude != null && (
                <SatellitePinMap
                  lat={task.latitude}
                  lng={task.longitude}
                  zoom={17}
                  label={task.trackingId}
                  subtitle={task.locationLabel}
                  heightClassName="h-48"
                  pinColor={task.status === 'resolved' ? 'teal' : 'rose'}
                />
              )}

              {(proofPhotos[task.id] || task.proofPhotoUrl) && (
                <div className="relative w-full h-36 rounded-lg border border-emerald-200 overflow-hidden">
                  <Image
                    src={proofPhotos[task.id] || task.proofPhotoUrl || ''}
                    alt="Resolution proof"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
              )}

              {task.status !== 'resolved' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={notes[task.id] || ''}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [task.id]: e.target.value }))}
                    placeholder="Enter field inspection / repair completion note..."
                    className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs font-semibold rounded-lg cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Proof Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProofUpload(task.id, e)}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProofPhotos((prev) => ({
                          ...prev,
                          [task.id]: getSampleCitizenPhoto(`Resolved · ${task.trackingId}`),
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] hover:border-[#006A4E] hover:bg-[#ECFDF5] text-[#111827] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#006A4E]" />
                      <span>Capture Sample Proof</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {task.status !== 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateTask(task.id, 'in_progress')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ECFDF5] hover:bg-emerald-100 text-[#006A4E] border border-emerald-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Mark In Progress</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleUpdateTask(task.id, 'resolved')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StaffDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <StaffDashboardContent />
    </ProtectedRoute>
  );
}
