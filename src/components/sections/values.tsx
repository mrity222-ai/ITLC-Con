'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Shield, Star, Users, Lightbulb, type LucideIcon } from 'lucide-react';

const values: { title: string; icon: LucideIcon }[] = [
  { title: "Quality Craftsmanship", icon: Star },
  { title: "Client-Centric", icon: Users },
  { title: "Integrity & Transparency", icon: Shield },
  { title: "Innovative Design", icon: Lightbulb }
];

export default function ValuesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 }
    },
  };
  
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.section 
      id="values" 
      ref={sectionRef}
      className="py-24 sm:py-32 bg-secondary relative overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-blue-50/20 to-background dark:from-background dark:via-blue-900/10 dark:to-background"></div>
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200/50 rounded-full filter blur-3xl opacity-50 animate-pulse dark:bg-blue-900/30"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200/50 rounded-full filter blur-3xl opacity-40 animate-pulse animation-delay-4000 dark:bg-indigo-900/30"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div className="text-center mb-16" variants={cardVariants}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-br from-[#3B6AF5] to-[#2F5FE3] bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground md:text-lg">
            The principles that guide every foundation we lay and every home we build.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={cardVariants}
            >
              <Card className="group bg-background/60 backdrop-blur-lg border border-border/20 rounded-[24px] p-8 text-center h-full flex flex-col justify-center items-center transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20">
                <motion.div 
                  className="relative bg-gradient-to-br from-primary/10 via-primary/20 to-indigo-500/20 rounded-[20px] p-5 mb-6 w-fit transform transition-transform duration-300 group-hover:scale-110"
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-primary/10 rounded-[20px] blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <value.icon className="relative w-10 h-10 text-primary" />
                </motion.div>
                <h3 className="font-bold text-xl tracking-tight text-foreground">{value.title}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}