import React from "react";
import { Link } from "react-router-dom";
import { Activity, Globe } from "../components/icons";
import { DashboardPreview } from "../components/landing/DashboardPreview";

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Background Dots Mesh with Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Left Glow & Dots */}
        <div 
          className="absolute -left-[20%] top-[20%] w-[50%] h-[60%] opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at center, #8c5cff 0%, transparent 50%)",
          }}
        ></div>
        <div 
          className="absolute -left-[10%] top-[30%] w-[30%] h-[50%] opacity-40"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 70%)"
          }}
        ></div>

        {/* Right Glow & Dots */}
        <div 
          className="absolute -right-[20%] bottom-[0%] w-[50%] h-[60%] opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at center, #8c5cff 0%, transparent 50%)",
          }}
        ></div>
        <div 
          className="absolute -right-[10%] bottom-[10%] w-[30%] h-[50%] opacity-40"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 70%)"
          }}
        ></div>
      </div>

      {/* Top Navbar */}
      <header className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Activity className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-white">ping.me</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-400">
            <a href="#platform" className="hover:text-white transition-colors">Platform <span className="opacity-50 ml-1">v</span></a>
            <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#community" className="hover:text-white transition-colors">Community <span className="opacity-50 ml-1">v</span></a>
            <a href="#company" className="hover:text-white transition-colors">Company <span className="opacity-50 ml-1">v</span></a>
            <a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link to="/signup">
            <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20">
              Sign up
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center text-center pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          The most reliable<br />uptime monitoring
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Get 10 monitors, 10 heartbeats and a status page<br />with 3-minute checks totally free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-xl mx-auto space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative w-full">
            <input 
              type="email" 
              placeholder="Your work e-mail" 
              className="w-full bg-[#18181b] border border-[#27272a] text-white px-5 py-3.5 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-500"
            />
          </div>
          <button className="w-full sm:w-auto whitespace-nowrap bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 text-lg">
            Get started in 30 seconds
          </button>
        </div>

        <p className="text-gray-500 text-sm">
          Looking for an enterprise solution? <a href="#demo" className="underline hover:text-white transition-colors">Book a demo</a>
        </p>
      </main>

      {/* Dashboard Preview Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-32">
        <div className="relative rounded-2xl overflow-hidden border border-[#27272a] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#09090b] z-20 pointer-events-none top-[60%]"></div>
          <DashboardPreview />
        </div>
      </section>

      {/* Logos Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-32">
        <p className="text-gray-500 text-sm font-medium mb-10 uppercase tracking-widest">
          Relied on by the world's best engineering teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-bold font-serif italic">AMETEK</span>
          <span className="text-2xl font-bold">redis</span>
          <span className="text-xl font-bold flex items-center"><Activity className="w-5 h-5 mr-1" /> Octopus Deploy</span>
          <span className="text-2xl font-bold font-mono">accenture</span>
          <span className="text-xl font-bold flex items-center"><Globe className="w-5 h-5 mr-1" /> Raspberry Pi</span>
          <span className="text-2xl font-bold italic">brave</span>
          <span className="text-2xl font-bold tracking-widest">DRATA</span>
        </div>
      </section>

      {/* Features Text */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-32">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Best-in-class uptime monitoring.<br />No false positives.
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Get a screenshot of the error and a second-by-second<br />timeline with our fastest 30-second checks.
        </p>
        <button className="bg-[#18181b] hover:bg-[#27272a] border border-[#3f3f46] text-white px-8 py-3 rounded-full font-medium transition-all shadow-sm">
          Explore website monitoring &rsaquo;
        </button>
      </section>

      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 group">
          <svg className="w-6 h-6 text-black group-hover:hidden block" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" /></svg>
          <svg className="w-6 h-6 text-black hidden group-hover:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};
