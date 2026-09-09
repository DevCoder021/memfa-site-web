// src/app/(site)/page.tsx
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Accueil - Mission Évangélique Maranatha',
  description: 'Bienvenue sur le site officiel de la Mission Évangélique Maranatha (MEMFA). Découvrez notre vision, nos cultes, nos actualités et nos programmes d\'édification.',
};

export default function HomePage() {
  return <HomeClient />;
}