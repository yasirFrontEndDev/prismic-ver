'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      marginBottom: '2rem',
      borderBottom: '1px solid #dee2e6'
    }}>
      <div style={{
        display: 'flex',
        gap: '1rem'
      }}>
        <Link 
          href="/" 
          style={{
            color: pathname === '/' ? '#0070f3' : '#000',
            textDecoration: 'none',
            fontWeight: pathname === '/' ? 'bold' : 'normal'
          }}
        >
          Home
        </Link>
        <Link 
          href="/migrate" 
          style={{
            color: pathname === '/migrate' ? '#0070f3' : '#000',
            textDecoration: 'none',
            fontWeight: pathname === '/migrate' ? 'bold' : 'normal'
          }}
        >
          Migrate
        </Link>
        <Link 
          href="/migrate-display" 
          style={{
            color: pathname === '/migrate-display' ? '#0070f3' : '#000',
            textDecoration: 'none',
            fontWeight: pathname === '/migrate-display' ? 'bold' : 'normal'
          }}
        >
          Migrate Display
        </Link>
      </div>
    </nav>
  );
}
