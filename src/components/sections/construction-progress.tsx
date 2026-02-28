'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const progressSteps: {
  id: string;
  title: string;
  description: string;
  image?: ImagePlaceholder;
}[] = [
  { id: 'progress-foundation', title: '01. Foundation', description: 'A solid start is key. We lay a robust foundation to ensure stability and longevity for your dream home.', image: PlaceHolderImages.find(img => img.id === 'progress-foundation') },
  { id: 'progress-structure', title: '02. Superstructure', description: 'The skeleton of your home takes shape with high-quality materials and precise engineering.', image: PlaceHolderImages.find(img => img.id === 'progress-structure') },
  { id: 'progress-exterior', title: '03. Exterior Finishes', description: 'We bring the design to life, focusing on aesthetics, weatherproofing, and durability.', image: PlaceHolderImages.find(img => img.id === 'progress-exterior') },
  { id: 'progress-interior', title: '04. Interior Works', description: 'The final touches that make a house a home, from flooring and painting to fixtures and fittings.', image: PlaceHolderImages.find(img => img.id === 'progress-interior') },
];

export default function ConstructionProgressSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const imageIndex = useTransform(scrollYProgress, [0, 1], [0, progressSteps.length - 0.001]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    return imageIndex.onChange((latest) => {
      setCurrentStep(Math.floor(latest));
    });
  }, [imageIndex]);

  const currentStepData = progressSteps[currentStep];
  
  return (
    <section id="progress" ref={ref} className="h-[400vh] relative bg-background">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {progressSteps.map((step, index) => {
            if (!step.image) return null;
            const isActive = index === currentStep;
            return (
              <motion.div
                key={step.id}
                className="absolute inset-0"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              >
                <Image
                  src={step.image.imageUrl}
                  alt={step.image.description}
                  fill
                  className="object-cover"
                  data-ai-hint={step.image.imageHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40" />
              </motion.div>
            );
          })}
        </div>
        
        <div className="relative z-10 text-white text-center p-8 max-w-4xl mx-auto w-full flex justify-center items-center min-h-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>{currentStepData.title}</h2>
              <p className="text-lg md:text-xl text-white/90" style={{textShadow: '0 1px 5px rgba(0,0,0,0.5)'}}>{currentStepData.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
