'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-black leading-tight">
                <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  Sustainable Energy Intelligence for Indonesia
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Lestaree maps renewable energy potential and environmental impact across Indonesia. 
                We forecast energy output while analyzing air, water, and soil footprints with AI-powered recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-6 text-lg rounded-full">
                  Explore Platform
                </Button>
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-6 text-lg rounded-full">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px]">
              {/* Floating Cards */}
              <div className="absolute top-12 left-12 bg-white rounded-2xl p-6 shadow-xl animate-float">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-4">
                  🌱
                </div>
                <h4 className="font-bold text-gray-800">Clean Energy</h4>
                <p className="text-gray-600">Solar & Wind Mapping</p>
              </div>
              <div className="absolute top-32 right-8 bg-white rounded-2xl p-6 shadow-xl animate-float-delayed">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-4">
                  🧠
                </div>
                <h4 className="font-bold text-gray-800">AI Analytics</h4>
                <p className="text-gray-600">Environmental Impact</p>
              </div>
              <div className="absolute bottom-20 left-5 bg-white rounded-2xl p-6 shadow-xl animate-float-delayed-2">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-4">
                  📊
                </div>
                <h4 className="font-bold text-gray-800">Smart Insights</h4>
                <p className="text-gray-600">Sustainability Reports</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl lg:text-5xl font-black mb-2">17,000+</h3>
              <p className="text-lg opacity-90">Islands Mapped</p>
            </div>
            <div>
              <h3 className="text-4xl lg:text-5xl font-black mb-2">95%</h3>
              <p className="text-lg opacity-90">Accuracy Rate</p>
            </div>
            <div>
              <h3 className="text-4xl lg:text-5xl font-black mb-2">500+</h3>
              <p className="text-lg opacity-90">Projects Analyzed</p>
            </div>
            <div>
              <h3 className="text-4xl lg:text-5xl font-black mb-2">24/7</h3>
              <p className="text-lg opacity-90">Real-time Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-4">
              Comprehensive Sustainability Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Beyond clean energy generation—we provide complete environmental impact analysis 
              and AI-driven recommendations for sustainable development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🗺️',
                title: 'Renewable Energy Mapping',
                description: 'Advanced satellite imagery and geographic analysis to identify optimal locations for solar, wind, and hydroelectric projects across Indonesia\'s diverse landscape.'
              },
              {
                icon: '🌍',
                title: 'Environmental Footprint Analysis',
                description: 'Comprehensive assessment of environmental impact on air quality, water resources, and soil composition from renewable energy installations.'
              },
              {
                icon: '🤖',
                title: 'AI-Powered Recommendations',
                description: 'Machine learning algorithms provide actionable insights and optimization strategies for sustainable energy projects with minimal environmental impact.'
              },
              {
                icon: '📈',
                title: 'Energy Output Forecasting',
                description: 'Predictive analytics for renewable energy generation potential based on weather patterns, seasonal variations, and local conditions.'
              },
              {
                icon: '💧',
                title: 'Water & Soil Monitoring',
                description: 'Real-time tracking of water quality and soil health metrics to ensure sustainable development practices and environmental protection.'
              },
              {
                icon: '📊',
                title: 'Comprehensive Reporting',
                description: 'Detailed sustainability reports and dashboard analytics for stakeholders, investors, and environmental agencies.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-green-100">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white text-3xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-800">
                Pioneering Sustainable Development in Indonesia
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Indonesia's unique archipelago presents both incredible opportunities and complex challenges 
                for renewable energy development. Lestaree bridges this gap with cutting-edge technology 
                and environmental science.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform combines satellite imagery, environmental sensors, and artificial intelligence 
                to provide unprecedented insights into sustainable energy potential while safeguarding 
                Indonesia's precious ecosystems.
              </p>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-6 text-lg rounded-full">
                Discover Our Impact
              </Button>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
              <div className="w-72 h-48 bg-green-600 rounded-lg opacity-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6">
            Ready to Build a Sustainable Future?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join leading organizations using Lestaree to make informed decisions about renewable energy 
            projects while protecting Indonesia's environment.
          </p>
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-6 text-lg rounded-full">
            Start Your Project
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-green-400 text-lg font-bold mb-4">Lestaree</h3>
              <p className="text-gray-300 leading-relaxed">
                Sustainable energy intelligence platform mapping renewable potential and environmental 
                impact across Indonesia.
              </p>
            </div>
            <div>
              <h3 className="text-green-400 text-lg font-bold mb-4">Platform</h3>
              <div className="space-y-2">
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Energy Mapping</a></p>
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Impact Analysis</a></p>
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">AI Recommendations</a></p>
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Reporting Tools</a></p>
              </div>
            </div>
            <div>
              <h3 className="text-green-400 text-lg font-bold mb-4">Company</h3>
              <div className="space-y-2">
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">About Us</a></p>
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Our Mission</a></p>
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Careers</a></p>
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Contact</a></p>
              </div>
            </div>
            <div>
              <h3 className="text-green-400 text-lg font-bold mb-4">Resources</h3>
              <div className="space-y-2">
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Documentation</a></p>
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Case Studies</a></p>
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Blog</a></p>
                <p><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Support</a></p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 Lestaree. All rights reserved. Building a sustainable future for Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
