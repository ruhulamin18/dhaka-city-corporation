'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { NoticeItem, WardInfo } from '@/types';
import { HeroSection } from '@/components/sections/HeroSection';
import { NoticeTicker } from '@/components/sections/NoticeTicker';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { NoticeAndWardSection } from '@/components/sections/NoticeAndWardSection';

export default function HomePage() {
  const { language } = useApp();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [wards, setWards] = useState<WardInfo[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getNotices(), mockApi.getWards()]).then(([nData, wData]) => {
      if (!active) return;
      setNotices(nData);
      setWards(wData);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <HeroSection language={language} wards={wards} notices={notices} />
      <NoticeTicker language={language} />
      <ServicesSection language={language} />
      <NoticeAndWardSection notices={notices} wards={wards} />
    </div>
  );
}
