import React from 'react';
import { notFound } from 'next/navigation';
import { SmartCityLayout } from '@/components/smart-city/SmartCityLayout';
import { GisMapView } from '@/components/smart-city/views/GisMapView';
import { WardMapView } from '@/components/smart-city/views/WardMapView';
import { WasteManagementView } from '@/components/smart-city/views/WasteManagementView';
import { DrainageMonitoringView } from '@/components/smart-city/views/DrainageMonitoringView';
import { RoadMonitoringView } from '@/components/smart-city/views/RoadMonitoringView';
import { SmartParkingView } from '@/components/smart-city/views/SmartParkingView';
import { AirQualityView } from '@/components/smart-city/views/AirQualityView';
import { FacilityLocatorView } from '@/components/smart-city/views/FacilityLocatorView';
import { EmergencySosView } from '@/components/smart-city/views/EmergencySosView';
import { DisasterAlertsView } from '@/components/smart-city/views/DisasterAlertsView';
import { AiAssistantView } from '@/components/smart-city/views/AiAssistantView';
import { SmartCityDashboardView } from '@/components/smart-city/views/SmartCityDashboardView';
import { SMART_CITY_FEATURES } from '@/data/smart-city/features';
import type { SmartCityFeatureSlug } from '@/types/smart-city';

export function generateStaticParams() {
  return Object.keys(SMART_CITY_FEATURES).map((slug) => ({
    feature: slug,
  }));
}

interface PageProps {
  params: Promise<{ feature: string }>;
}

export default async function SmartCityFeaturePage({ params }: PageProps) {
  const { feature } = await params;

  if (!(feature in SMART_CITY_FEATURES)) {
    notFound();
  }

  const slug = feature as SmartCityFeatureSlug;

  const renderView = () => {
    switch (slug) {
      case 'gis-map':
        return <GisMapView />;
      case 'ward-map':
        return <WardMapView />;
      case 'waste-management':
        return <WasteManagementView />;
      case 'drainage-monitoring':
        return <DrainageMonitoringView />;
      case 'road-monitoring':
        return <RoadMonitoringView />;
      case 'smart-parking':
        return <SmartParkingView />;
      case 'air-quality':
        return <AirQualityView />;
      case 'facility-locator':
        return <FacilityLocatorView />;
      case 'emergency-sos':
        return <EmergencySosView />;
      case 'disaster-alerts':
        return <DisasterAlertsView />;
      case 'ai-assistant':
        return <AiAssistantView />;
      case 'dashboard':
        return <SmartCityDashboardView />;
      default:
        notFound();
    }
  };

  return (
    <SmartCityLayout activeSlug={slug}>
      {renderView()}
    </SmartCityLayout>
  );
}
