'use client'; // This must be the very first line of the file

// Now, directly import your GlobeComponent here.
// Since page.tsx itself is now a client component, it's safe to import
// other client components or modules that rely on browser APIs.
import GlobeComponent from '../components/GlobeComponent'; // Adjust path if needed

// You no longer need `next/dynamic` here, as `page.tsx` is now client-side.
// The `ssr: false` effectively moves to the 'use client' directive on this page.

export default function Home() {
  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      background: 'black' // Keep this for debugging if you want
    }}>
      <GlobeComponent />
    </main>
  );
}