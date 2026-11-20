import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryServicesPage from '@/components/citizen-services/CategoryServicesPage';
import {
  CITIZEN_SERVICE_CATEGORIES,
  getCategoryBySlug,
} from '@/data/services';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CITIZEN_SERVICE_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return { title: 'Category Not Found | Dhaka City Corporation' };
  }
  return {
    title: `${category.title.en} | Citizen Services | Dhaka City Corporation`,
    description: category.description.en,
  };
}

export default async function CitizenServiceCategoryRoute({
  params,
}: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return <CategoryServicesPage categorySlug={category.slug} />;
}
