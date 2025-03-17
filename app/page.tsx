'use client';

import Navbar from './components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: '#333'
        }}>
          DD Content
        </h1>
      </div>
    </>
  );
}
