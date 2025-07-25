'use client';

import GlobeComponent from '../components/GlobeComponent';

export default function MapPage() {
  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      background: 'black',
      paddingTop: '80px', // Space for navbar
    }}>
      <div style={{
        position: 'absolute',
        top: '80px', // Start below navbar
        left: 0,
        width: '100%',
        height: 'calc(100% - 80px)', // Full height minus navbar
        zIndex: 1,
      }}>
        <GlobeComponent />
      </div>
    </main>
  );
}
