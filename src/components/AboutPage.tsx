'use client';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-800 mb-8">
            About Lestaree
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Coming soon... Learn more about our mission to create sustainable energy solutions for Indonesia.
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To become Indonesia&apos;s leading platform for sustainable energy intelligence, 
              providing comprehensive insights that balance renewable energy development 
              with environmental protection.
            </p>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Empowering organizations and communities with AI-driven tools to make 
              informed decisions about renewable energy projects while safeguarding 
              Indonesia&apos;s unique ecosystem.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
