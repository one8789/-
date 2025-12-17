
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Process from './components/Process';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import ClickSparkle from './components/ClickSparkle';
import StickyFooter from './components/StickyFooter';
import LoadingScreen from './components/LoadingScreen';
import CheckoutModal from './components/CheckoutModal';
import ModificationPolicy from './components/ModificationPolicy';
import Showcase from './components/Showcase';
import { OrderProvider } from './contexts/OrderContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for creativity fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <OrderProvider>
      <div className="font-sans antialiased text-gray-900 selection:bg-primary-200 selection:text-primary-900 relative bg-[#fff1f2] min-h-screen">
        {/* Loading Screen sits on top with z-index, allowing content underneath to be pre-rendered */}
        <LoadingScreen isLoading={loading} />
        
        {/* Main Content - Rendered immediately for SSG, but potentially covered by loader initially */}
        <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            <ParticleBackground />
            <ClickSparkle />
            
            <div className="max-w-screen-2xl mx-auto bg-white/50 relative shadow-2xl min-h-screen">
              <Header />
              <main className="relative z-10">
                <Hero />
                <Gallery />
                <Process />
                <ModificationPolicy />
                <Showcase />
              </main>
              <Footer />
              <StickyFooter />
              <CheckoutModal />
            </div>
        </div>
      </div>
    </OrderProvider>
  );
}

export default App;
