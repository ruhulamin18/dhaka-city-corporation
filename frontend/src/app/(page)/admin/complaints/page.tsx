'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Upload,
  Camera,
  Layers,
  ArrowRight,
  ShieldAlert,
  Send,
  X,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi, FIELD_STAFF } from '@/services/mockApi';
import { Complaint, ComplaintStatus, ComplaintCategory } from '@/types';

export default function AdminComplaintsPage() {
  const { language } = useApp();
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal / Active Item State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    mockApi.getComplaints().then((data) => {
      if (!active) return;
      setComplaints(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locationLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWard = selectedWard === 'all' || c.wardNumber.toString() === selectedWard;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesSearch && matchesWard && matchesCategory && matchesStatus;
  });

  const handleOpenDetail = (c: Complaint) => {
    setSelectedComplaint(c);
    setSelectedStaffId(c.assignedStaffId || '');
    setResolutionNote(c.resolutionNote || '');
    setProofPhotoUrl(c.proofPhotoUrl || '');
  };

  const handleAssignStaff = async () => {
    if (!selectedComplaint || !selectedStaffId) return;
    setIsUpdating(true);
    try {
      const updated = await mockApi.assignComplaint(selectedComplaint.id, selectedStaffId);
      if (updated) {
        setSelectedComplaint(updated);
        setComplaints((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setActionSuccess(
          language === 'bn'
            ? 'দায়িত্বপ্রাপ্ত কর্মকর্তা সফলভাবে নিযুক্ত হয়েছেন।'
            : 'Field officer assigned successfully.'
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (newStatus: ComplaintStatus) => {
    if (!selectedComplaint) return;
    setIsUpdating(true);
    try {
      const updated = await mockApi.updateComplaintStatus(
        selectedComplaint.id,
        newStatus,
        resolutionNote || undefined,
        proofPhotoUrl || undefined
      );
      if (updated) {
        setSelectedComplaint(updated);
        setComplaints((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setActionSuccess(
          language === 'bn'
            ? `অভিযোগের অবস্থা পরিবর্তিত হয়েছে: ${newStatus}`
            : `Complaint status updated to ${newStatus}`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Proof photo simulator
  const handleSimulateProofPhoto = () => {
    const sampleProof =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23059669"/><text x="50%" y="45%" fill="white" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle">OFFICIAL RESOLUTION VERIFIED</text><text x="50%" y="58%" fill="%23ECFDF5" font-family="sans-serif" font-size="14" text-anchor="middle">Field Team Restored · Ward Location Verified</text></svg>';
    setProofPhotoUrl(sampleProof);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              {language === 'bn' ? 'নাগরিক অভিযোগ ও ফিল্ড অ্যাকশন' : 'Civic Grievance & Field Oversight'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'অভিযোগ ব্যবস্থাপনা ও পর্যবেক্ষণ কেন্দ্র' : 'Grievance Inspection & Resolution Desk'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'নাগরিকদের প্রেরিত ছবি, জিপিএস কো-অর্ডিনেট, ওয়ার্ড ও দায়িত্বপ্রাপ্ত কর্মকর্তাদের কাজের অগ্রগতি তদারকি।'
                : 'Scrutinize citizen geo-tagged photos, coordinate with ward field inspectors, and verify before/after proofs.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadComplaints}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'ট্র্যাকিং আইডি, নাগরিকের নাম বা স্থান...'
                  : 'Search by ID, citizen name, location...'
              }
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          {/* Ward Filter */}
          <div>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              <option value="all">{language === 'bn' ? 'সকল ওয়ার্ড' : 'All Wards'}</option>
              <option value="1">Ward 01 (Uttara)</option>
              <option value="12">Ward 12 (Mirpur)</option>
              <option value="19">Ward 19 (Gulshan / Banani)</option>
              <option value="24">Ward 24 (Tejgaon)</option>
              <option value="27">Ward 27 (Dhanmondi / Farmgate)</option>
              <option value="32">Ward 32 (Lalbagh / Old Dhaka)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              <option value="all">{language === 'bn' ? 'সকল সমস্যা বিভাগ' : 'All Categories'}</option>
              <option value="road">{language === 'bn' ? 'সড়ক ও ফুটপাত' : 'Roads & Footpaths'}</option>
              <option value="drainage">{language === 'bn' ? 'ড্রেনেজ ও জলাবদ্ধতা' : 'Drainage & Waterlogging'}</option>
              <option value="waste">{language === 'bn' ? 'বর্জ্য ব্যবস্থাপনা' : 'Waste Management'}</option>
              <option value="streetlight">{language === 'bn' ? 'সড়কবাতি' : 'Street Lighting'}</option>
              <option value="mosquito">{language === 'bn' ? 'মশক নিয়ন্ত্রণ' : 'Mosquito & Vector Control'}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              <option value="all">{language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
              <option value="pending">{language === 'bn' ? 'নতুন / পেন্ডিং' : 'Pending'}</option>
              <option value="assigned">{language === 'bn' ? 'কর্মকর্তা নিযুক্ত' : 'Assigned'}</option>
              <option value="in_progress">{language === 'bn' ? 'চলমান / প্রক্রিয়াধীন' : 'In Progress'}</option>
              <option value="resolved">{language === 'bn' ? 'নিষ্পন্ন' : 'Resolved'}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            {language === 'bn' ? 'মোট ফিল্টারকৃত অভিযোগ:' : 'Showing complaints:'}{' '}
            <strong className="text-slate-800">{filteredComplaints.length}</strong>
          </span>
          {(searchQuery || selectedWard !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedWard('all');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="text-rose-600 hover:underline font-semibold"
            >
              {language === 'bn' ? 'ফিল্টার রিসেট' : 'Reset Filters'}
            </button>
          )}
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">ID / Ward</th>
                <th className="p-3.5">Title & Location</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Citizen Details</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Field Officer</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                    {language === 'bn'
                      ? 'কোনো অভিযোগের রেকর্ড পাওয়া যায়নি।'
                      : 'No grievances match the search filter.'}
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {c.trackingId}
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        Ward {c.wardNumber}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{c.locationLabel}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-xs font-medium text-slate-800">
                        {c.citizenName}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {c.phone}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-md inline-block uppercase tracking-wider ${
                          c.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : c.status === 'assigned'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-slate-700">
                      {c.assignedStaffName ? (
                        <span className="font-medium text-emerald-800">
                          {c.assignedStaffName}
                        </span>
                      ) : (
                        <span className="text-amber-700 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenDetail(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {language === 'bn' ? 'পরিদর্শন' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection & Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedComplaint.trackingId}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Ward {selectedComplaint.wardNumber}
                  </span>
                  <span className="capitalize text-xs font-semibold text-slate-500">
                    {selectedComplaint.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedComplaint.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setActionSuccess(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Geo Coordinates & Citizen Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'অভিযোগকারী নাগরিক' : 'Citizen Information'}
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {selectedComplaint.citizenName}
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  Phone: {selectedComplaint.phone}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Submitted: {new Date(selectedComplaint.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'জিপিএস অবস্থান ও মানচিত্র' : 'Geo Coordinates & Location'}
                </div>
                <div className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{selectedComplaint.locationLabel}</span>
                </div>
                <div className="text-xs font-mono text-slate-500 mt-1">
                  Lat: {selectedComplaint.latitude.toFixed(5)}°N, Lng:{' '}
                  {selectedComplaint.longitude.toFixed(5)}°E
                </div>
                <a
                  href={`https://maps.google.com/?q=${selectedComplaint.latitude},${selectedComplaint.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#006A4E] font-semibold hover:underline mt-1.5"
                >
                  {language === 'bn' ? 'গুগল ম্যাপে দেখুন' : 'Open in Google Maps'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {language === 'bn' ? 'অভিযোগের বিবরণ' : 'Citizen Description'}
              </label>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed">
                {selectedComplaint.description}
              </div>
            </div>

            {/* Photo Comparison: Before (Citizen) vs After (Field Proof) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-600" />
                  <span>{language === 'bn' ? 'নাগরিকের আপলোড করা ছবি (Before)' : 'Citizen Geo-Photo (Before)'}</span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center min-h-[160px]">
                  {selectedComplaint.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedComplaint.photoUrl}
                      alt="Before"
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No image attached</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'bn' ? 'সমাধানের প্রমাণ ছবি (After Proof)' : 'Resolution Proof (After)'}</span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center min-h-[160px] relative">
                  {proofPhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={proofPhotoUrl}
                      alt="After Proof"
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500 mb-2">No resolution proof uploaded yet</p>
                      <button
                        type="button"
                        onClick={handleSimulateProofPhoto}
                        className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                      >
                        {language === 'bn' ? 'ফিল্ড ফটো সিমুলেট' : 'Attach Field Photo'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Officer Assignment Control */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'bn' ? 'ফিল্ড কর্মকর্তা নিয়োগ' : 'Field Staff & Department Assignment'}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                >
                  <option value="">-- {language === 'bn' ? 'কর্মকর্তা নির্বাচন করুন' : 'Select Officer / Inspector'} --</option>
                  {FIELD_STAFF.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.nameEn} ({staff.departmentEn} · Ward {staff.wardNumber})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!selectedStaffId || isUpdating}
                  onClick={handleAssignStaff}
                  className="px-4 py-2 bg-[#006A4E] text-white text-xs font-semibold rounded-lg hover:bg-[#00523c] transition disabled:opacity-50"
                >
                  {language === 'bn' ? 'নিয়োগ নিশ্চিত করুন' : 'Assign Officer'}
                </button>
              </div>
            </div>

            {/* Resolution Note & Status Transition */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  {language === 'bn'
                    ? 'সমাধানের বিবরণ / পরিদর্শক রিপোর্ট'
                    : 'Resolution Description / Inspector Work Log'}
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'ফিল্ড টিম কর্তৃক গৃহীত ব্যবস্থা ও সমাধানের বিবরণ লিখুন...'
                      : 'Enter field restoration summary, team actions taken...'
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('in_progress')}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  {language === 'bn' ? 'চলমান নির্ধারণ করুন' : 'Mark In Progress'}
                </button>

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('resolved')}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
                >
                  {language === 'bn' ? 'নিষ্পন্ন ও বন্ধ করুন' : 'Resolve & Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
