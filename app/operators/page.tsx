import OperatorsPageContent from './_components/OperatorsPageContent';
import { operatorsMetadata } from '@/lib/metadata/operators.metadata';

export const metadata = operatorsMetadata;

export default function OperatorsPage() {
  return <OperatorsPageContent />;
}

