import { redirect } from 'next/navigation';

export default function LegacyNewProjectPage() {
  redirect('/app/analysis/new');
}