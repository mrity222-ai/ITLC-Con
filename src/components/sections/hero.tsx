'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center shadow-xl">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/80">{label}</p>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section id="home" className="h-screen w-full relative bg-black">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxob3VzZSUyMGV4dGVyaW9yfGVufDB8fHx8MTc3MTQ0MDAxNnww&ixlib=rb-4.1.0&q=80&w=1080"
        >
          <source src="https://videos.pexels.com/video-files/5586619/5586619-hd_1920_1080_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Building Dream Homes with Precision & Trust
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          ITLC India redefines luxury living through innovative design, unparalleled craftsmanship, and a commitment to excellence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className={cn(
            "rounded-[12px] font-semibold px-7 py-3.5 shadow-button-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-button-light-hover",
            "bg-gradient-to-br from-[#3B6AF5] to-[#2F5FE3] text-white"
          )}>
            <Link href="#contact">Get Free Site Visit</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold shadow-lg transition-transform hover:scale-105 backdrop-blur-sm rounded-[12px]">
            <Link href="#projects">View Projects</Link>
          </Button>
        </div>

        <div className="absolute bottom-20 right-10 hidden md:flex flex-col gap-6">
          <StatCard value="10+" label="Years Experience" />
          <StatCard value="50+" label="Projects Completed" />
        </div>
        
        <Link href="#about" aria-label="Scroll down" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-8 h-8 text-white" />
        </Link>
      </div>
    </section>
  );
}
