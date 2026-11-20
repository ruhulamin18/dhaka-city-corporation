'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { PersonProfileCard } from '@/components/about/PersonProfileCard';
import { SearchFilterBar } from '@/components/about/SearchFilterBar';
import { EmptyState } from '@/components/common/EmptyState';
import { COUNCILLORS_LIST, COUNCILLOR_ZONES } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutCouncillorsPage() {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedSeatType, setSelectedSeatType] = useState('all');

  const filteredCouncillors = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COUNCILLORS_LIST.filter((person) => {
      if (selectedZone !== 'all' && person.zoneId !== selectedZone) return false;
      if (selectedSeatType !== 'all' && person.seatType !== selectedSeatType) return false;
      if (!q) return true;
      return (
        person.name.en.toLowerCase().includes(q) ||
        person.name.bn.toLowerCase().includes(q) ||
        person.badgeText.en.toLowerCase().includes(q) ||
        person.badgeText.bn.toLowerCase().includes(q) ||
        (person.wardNumber !== undefined && String(person.wardNumber) === q)
      );
    });
  }, [query, selectedZone, selectedSeatType]);

  const hasActiveFilters =
    query.trim().length > 0 || selectedZone !== 'all' || selectedSeatType !== 'all';

  return (
    <AboutPageLayout activeSlug="councillors">
      <SearchFilterBar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder={
          language === 'bn'
            ? 'কাউন্সিলরের নাম বা ওয়ার্ড নম্বর দিয়ে খুঁজুন (যেমন: ২৭, ধানমন্ডি)...'
            : 'Search by Councillor name or Ward number (e.g. 27, Omar)...'
        }
        searchAriaLabel={
          language === 'bn' ? 'কাউন্সিলর অনুসন্ধান' : 'Search councillors'
        }
        filters={[
          {
            id: 'councillor-zone-filter',
            label: language === 'bn' ? 'জোন নির্বাচন' : 'Filter by Zone',
            value: selectedZone,
            onChange: setSelectedZone,
            options: COUNCILLOR_ZONES.map((z) => ({
              value: z.id,
              label: pickLang(z.label, language),
            })),
          },
          {
            id: 'councillor-seat-filter',
            label: language === 'bn' ? 'আসনের ধরন' : 'Seat Type',
            value: selectedSeatType,
            onChange: setSelectedSeatType,
            options: [
              { value: 'all', label: language === 'bn' ? 'সকল আসন' : 'All Seat Types' },
              {
                value: 'general',
                label: language === 'bn' ? 'সাধারণ ওয়ার্ড আসন' : 'General Ward Seat',
              },
              {
                value: 'reserved',
                label: language === 'bn' ? 'সংরক্ষিত নারী আসন' : 'Reserved Women’s Seat',
              },
            ],
          },
        ]}
        resultCountText={
          language === 'bn'
            ? `মোট ${filteredCouncillors.length} জন কাউন্সিলর পাওয়া গেছে`
            : `Showing ${filteredCouncillors.length} of ${COUNCILLORS_LIST.length} councillors`
        }
        hasActiveFilters={hasActiveFilters}
        resetLabel={language === 'bn' ? 'রিসেট' : 'Reset'}
        onReset={() => {
          setQuery('');
          setSelectedZone('all');
          setSelectedSeatType('all');
        }}
      />

      {filteredCouncillors.length === 0 ? (
        <EmptyState
          message={
            language === 'bn'
              ? 'আপনার নির্বাচিত জোন বা অনুসন্ধানের সাথে মিলে যায় এমন কোনো কাউন্সিলর পাওয়া যায়নি।'
              : 'No councillors match your current search or filter criteria.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCouncillors.map((person) => (
            <PersonProfileCard key={person.id} person={person} language={language} />
          ))}
        </div>
      )}
    </AboutPageLayout>
  );
}
