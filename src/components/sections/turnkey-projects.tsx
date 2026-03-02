'use client';

import { CheckCircle, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const turnkeyServices = [
  'Architectural Planning & Design',
  'Structural Engineering',
  'Material Procurement',
  'Construction Execution',
  'Quality Control & Safety Compliance',
  'Project Management',
  'Final Inspection & Handover',
];

const turnkeyBenefits = [
  { title: 'Single Contract Responsibility', description: 'One point of contact for the entire lifecycle of the project.' },
  { title: 'Cost-Effective Execution', description: 'Optimized budgeting with no hidden costs.' },
  { title: 'Faster Project Completion', description: 'Streamlined workflows to meet deadlines.' },
  { title: 'Assured Quality Standards', description: 'Rigorous quality control at every stage.' },
  { title: 'Hassle-Free Experience', description: 'We manage the complexities, so you don\'t have to.' },
];

export default function TurnkeyProjectsSection() {
  return (
    <motion.section
      id="turnkey-projects"
      className="py-24 sm:py-32 bg-background relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/20 via-transparent to-transparent"></div>
       <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl opacity-40 animate-pulse animation-delay-4000"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4 tracking-tight text-foreground">
            Turnkey Projects
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground md:text-lg">
            End-to-End Construction Solutions Under One Roof
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <div className="bg-card/60 backdrop-blur-lg border border-border/20 rounded-[24px] p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        We provide complete turnkey project services that cover every stage of construction—from initial planning and design to material procurement, execution, and final handover. Our integrated approach ensures seamless coordination, strict quality control, and timely delivery without hidden costs or delays.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        With a single point of responsibility, we simplify the entire construction process for our clients, ensuring transparency, efficiency, and superior results. Whether it’s residential, commercial, or infrastructure projects, our expert team manages everything so you can focus on your vision while we handle the execution.
                    </p>
                </div>
                <div className="bg-card/60 backdrop-blur-lg border border-border/20 rounded-[24px] p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <h3 className="font-bold font-headline text-xl tracking-tight text-foreground mb-6">Our Turnkey Services Include:</h3>
                    <ul className="space-y-3">
                        {turnkeyServices.map((service) => (
                            <li key={service} className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-primary shrink-0" />
                                <span className="text-muted-foreground">{service}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
            <motion.div 
                className="bg-card/60 backdrop-blur-lg border border-border/20 rounded-[24px] p-8 shadow-lg space-y-8 sticky top-28 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <h3 className="font-bold font-headline text-xl tracking-tight text-foreground">Why Choose Our Turnkey Solutions?</h3>
                <div className="space-y-6">
                    {turnkeyBenefits.map((benefit) => (
                        <div key={benefit.title} className="flex items-start">
                            <div className="mr-4 mt-1">
                                <div className="bg-primary/10 text-primary rounded-full p-2">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
