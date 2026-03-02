'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Briefcase, Coins, Timer, Award, Smile, type LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const turnkeyBenefits: { title: string; description: string, icon: LucideIcon }[] = [
  { title: 'Single Point of Contact', description: 'One contract for the entire project lifecycle, ensuring seamless communication.', icon: Briefcase },
  { title: 'Cost-Effective Execution', description: 'Optimized budgeting and resource management to prevent hidden costs.', icon: Coins },
  { title: 'Faster Project Completion', description: 'Streamlined workflows and parallel activities to meet tight deadlines.', icon: Timer },
  { title: 'Assured Quality Standards', description: 'Rigorous quality control and premium materials at every stage.', icon: Award },
  { title: 'Hassle-Free Experience', description: 'We manage all complexities, from permits to handover, for your peace of mind.', icon: Smile },
];

const turnkeyImage = PlaceHolderImages.find(p => p.id === 'turnkey-illustration');

export default function TurnkeyProjectsSection() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };
  
  return (
    <motion.section
      id="turnkey-projects"
      className="py-24 sm:py-32 bg-background"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Image */}
            {turnkeyImage && (
                <motion.div 
                    className="relative aspect-square lg:aspect-[4/3.5] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <Image
                        src={turnkeyImage.imageUrl}
                        alt={turnkeyImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={turnkeyImage.imageHint}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>
            )}

            {/* Right Column: Content */}
            <motion.div 
                className="flex flex-col justify-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
                <motion.h3 
                    className="text-primary font-semibold mb-2"
                    variants={itemVariants}
                >
                    End-to-End Construction Solutions
                </motion.h3>
                <motion.h2 
                    className="text-4xl md:text-5xl font-bold font-headline mb-6 tracking-tight text-foreground"
                    variants={itemVariants}
                >
                    Turnkey Projects
                </motion.h2>

                <motion.p className="text-muted-foreground leading-relaxed mb-8" variants={itemVariants}>
                    Our turnkey project services cover every stage of construction—from initial planning and design to material procurement, execution, and final handover. With a single point of responsibility, we simplify the entire process, ensuring transparency, efficiency, and superior results for your dream project.
                </motion.p>
                
                <motion.div 
                    className="grid sm:grid-cols-2 gap-6"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                    }}
                >
                    {turnkeyBenefits.map((benefit) => (
                        <motion.div key={benefit.title} variants={itemVariants}>
                            <Card className="bg-secondary/50 border-border/50 h-full transition-all duration-300 hover:shadow-card-light hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                                        <benefit.icon className="w-5 h-5"/>
                                    </div>
                                    <CardTitle className="text-base font-semibold">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
