import AboutPageContent from './_components/AboutPageContent';
import { aboutMetadata } from '@/lib/metadata/about.metadata';

export const metadata = aboutMetadata;

export default function AboutPage() {
  return <AboutPageContent />;
}

