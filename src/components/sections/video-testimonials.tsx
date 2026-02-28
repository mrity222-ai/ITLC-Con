'use client';

import { Card } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    id: 1,
    videoUrl: '/vio/1.mp4',
    posterId: 'testimonial-1',
  },
  {
    id: 2,
    videoUrl: '/vio/2.mp4',
    posterId: 'testimonial-2',
  },
  {
    id: 3,
    videoUrl: '/vio/3.mp4',
    posterId: 'testimonial-3',
  },
];

export default function VideoTestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-primary">
            Hear From Our Clients
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            Watch what our satisfied customers have to say about their experience with ITLC INDIA.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => {
            const posterImage = PlaceHolderImages.find(p => p.id === testimonial.posterId);
            return (
              <Card key={testimonial.id} className="bg-secondary border rounded-[20px] p-0 overflow-hidden shadow-card-light transition-all duration-300 hover:-translate-y-2 hover:shadow-card-light-hover">
                <div className="aspect-video relative bg-black">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={posterImage?.imageUrl}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  >
                    <source src={testimonial.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
