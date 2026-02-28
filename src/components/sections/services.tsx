'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Building, KeyRound, Paintbrush, Scaling, PencilRuler, HardHat, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: Service[] = [
  { icon: Building, title: 'Full Home Construction', description: 'From foundation to finish, we build your dream home from the ground up.' },
  { icon: KeyRound, title: 'Turnkey Projects', description: 'A complete solution, from design and planning to handing over the keys.' },
  { icon: Paintbrush, title: 'Interior & Exterior Design', description: 'Crafting beautiful and functional spaces that reflect your personal style.' },
  { icon: Scaling, title: 'Renovation & Remodeling', description: 'Transforming your existing space into something new and exciting.' },
  { icon: PencilRuler, title: 'Architecture & Planning', description: 'Expert architectural design and meticulous planning for a flawless build.' },
  { icon: HardHat, title: 'Civil Contracting', description: 'Robust civil engineering and contracting services for all project scales.' },
];

function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group h-full text-center bg-card/50 backdrop-blur-sm border border-border/30 rounded-[24px] p-6 shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
      <CardHeader className="items-center">
        <div className="p-5 bg-gradient-to-br from-primary/10 via-primary/20 to-primary/20 text-primary rounded-[18px] mb-6 inline-block transition-transform duration-300 group-hover:scale-110">
          <service.icon className="w-8 h-8" />
        </div>
        <CardTitle className="tracking-tight text-primary">{service.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
      </CardContent>
    </Card>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
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
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  const gridVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 }
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section 
      id="services"
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
      className="py-24 sm:py-32 bg-secondary"
    >
      <div className="container mx-auto px-4 md:px-6 text-center max-w-7xl">
        <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-primary"
            variants={cardVariants}
        >
            Our Expertise
        </motion.h2>
        <motion.p 
            className="max-w-3xl mx-auto text-muted-foreground md:text-lg mb-16"
            variants={cardVariants}
        >
          We offer a comprehensive range of construction and design services, tailored to meet the unique needs of each client.
        </motion.p>
        <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={gridVariants}
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={cardVariants}>
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
