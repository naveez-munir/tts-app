import LandingPageContent from './_components/LandingPageContent';
import { landingMetadata } from '@/lib/metadata/landing.metadata';

export const metadata = landingMetadata;

export default function Home() {
  return <LandingPageContent />;
}
