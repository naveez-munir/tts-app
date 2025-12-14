import ContactPageContent from './_components/ContactPageContent';
import { contactMetadata } from '@/lib/metadata/contact.metadata';

export const metadata = contactMetadata;

export default function ContactPage() {
  return <ContactPageContent />;
}

