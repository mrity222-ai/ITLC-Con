'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function FullWidthVideoSection() {
  const posterImage = PlaceHolderImages.find(p => p.id === 'testimonial-2');

  return (
    <section className="h-screen w-full relative bg-black overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterImage?.imageUrl}
        className="w-full h-full object-cover"
        preload="metadata"
      >
        <source src="/vio/2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/30"></div>
    </section>
  );
}
