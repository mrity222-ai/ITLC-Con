'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion, useInView, animate, useAnimation } from 'framer-motion';

// --- Reusable Counter Component ---
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
    const nodeRef = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView && nodeRef.current) {
            const node = nodeRef.current;
            const controls = animate(0, to, {
                duration: 2.5,
                ease: "easeOut",
                onUpdate(value) {
                    node.textContent = Math.round(value).toString() + suffix;
                }
            });
            return () => controls.stop();
        }
    }, [to, suffix, isInView]);

    return <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-[#2563EB] to-[#1E40AF] bg-clip-text text-transparent" ref={nodeRef} >0{suffix}</p>;
}

// --- Main About Section Component ---
const stats = [
    { value: 50, label: "Homes Delivered" },
    { value: 10, label: "Years Experience", suffix: "+" },
    { value: 98, label: "Client Satisfaction", suffix: "%" },
];

const aboutImage = PlaceHolderImages.find(p => p.id === 'about-construction');

export default function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const animationControls = useAnimation();
  const imageAnimationControls = useAnimation();

  useEffect(() => {
      if (isInView) {
          animationControls.start('visible');
          imageAnimationControls.start('float');
      }
  }, [isInView, animationControls, imageAnimationControls]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }
    },
  };

  const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };
  
  const imageContainerVariants = {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' }}
  }
  
  const imageFloatVariants = {
      float: {
          y: [0, -10, 0],
          transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
      }
  }

  return (
    <motion.section 
        id="about" 
        ref={sectionRef}
        className="py-24 sm:py-32 bg-background relative overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        animate={animationControls}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-100/30 via-transparent to-transparent opacity-50 dark:from-blue-900/20"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-indigo-100/30 via-transparent to-transparent opacity-50 dark:from-indigo-900/20"></div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
            {aboutImage && (
              <motion.div 
                variants={imageContainerVariants}
                className="relative aspect-[4/3]"
              >
                  <motion.div
                    className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 group"
                    style={{ filter: 'drop-shadow(0 20px 25px rgba(37, 99, 235, 0.1))' }}
                    variants={imageFloatVariants}
                    animate={imageAnimationControls}
                  >
                    <motion.div 
                        className="w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Image
                          src={aboutImage.imageUrl}
                          alt={aboutImage.description}
                          fill
                          className="object-cover"
                          data-ai-hint={aboutImage.imageHint}
                          sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </motion.div>
              </motion.div>
            )}
          <motion.div 
            className="bg-card/40 backdrop-blur-lg p-8 lg:p-12 rounded-3xl border border-border/50 shadow-xl shadow-black/5"
            variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-br from-[#2563EB] to-[#1E40AF] bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Building Trust. Crafting Excellence.
            </motion.h2>
            <motion.div variants={itemVariants} className="w-20 h-1.5 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] mb-8 rounded-full"></motion.div>
            
            <motion.div 
              className="space-y-6 text-muted-foreground"
              variants={itemVariants}
            >
              <p>
                For over a decade, ITLC INDIA PVT LTD has been turning visions into reality. We believe building a home is creating a foundation for memories, and we're dedicated to achieving that with unmatched precision and unwavering trust.
              </p>
              <p>
                Our mission is to deliver high-quality, sustainable, and beautiful living spaces. We aim to be India's most trusted construction partner, known for our commitment to excellence and client satisfaction.
              </p>
            </motion.div>

            <motion.div 
                className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-border/50"
                variants={itemVariants}
            >
              {stats.map(stat => (
                  <motion.div 
                      key={stat.label}
                      className="text-center transition-transform duration-300 hover:scale-110"
                      variants={itemVariants}
                  >
                    <Counter to={stat.value} suffix={stat.suffix || ''} />
                    <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                  </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
