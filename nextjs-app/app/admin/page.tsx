import { Metadata } from 'next';
import AdminPanel from './AdminPanel';

export const metadata: Metadata = {
  title: 'Admin Panel - Pokemon Manager',
};

/*
  NEXT.JS ARCHITECTURE: React Server Components + Client Components

  This page demonstrates Next.js's hybrid approach:
  - The page wrapper is a Server Component (no JavaScript shipped)
  - AdminPanel is a Client Component ('use client') for interactivity

  Comparison with Astro Islands:
  - Similar concept: Server-rendered shell with hydrated "islands"
  - Key difference: All client components share React's runtime
  - In Astro: Each island is isolated, cannot share state
  - In Next.js: Client components can share state via context/stores

  Trade-off:
  - More flexible state sharing than Astro
  - But still ships React runtime (~134 KB) even for simple pages
  - Astro ships 0 KB JS for static pages

  For complex admin UIs like this, Next.js works naturally because
  all interactive parts share the React runtime and can communicate.
*/

export default function AdminPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <AdminPanel />
    </div>
  );
}
