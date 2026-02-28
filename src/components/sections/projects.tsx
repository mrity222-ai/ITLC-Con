'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

const projects: {
  id: string;
  category: 'Ongoing' | 'Completed';
  title: string;
  image?: ImagePlaceholder;
}[] = [
  { id: 'project-1', category: 'Ongoing', title: 'Modern Villa', image: PlaceHolderImages.find(p => p.id === 'project-1') },
  { id: 'project-2', category: 'Completed', title: 'Luxury Apartment Interior', image: PlaceHolderImages.find(p => p.id === 'project-2') },
  { id: 'project-3', category: 'Completed', title: 'Residential Complex', image: PlaceHolderImages.find(p => p.id === 'project-3') },
  { id: 'project-4', category: 'Completed', title: 'Commercial Hub', image: PlaceHolderImages.find(p => p.id === 'project-4') },
  { id: 'project-5', category: 'Ongoing', title: 'Minimalist Penthouse', image: PlaceHolderImages.find(p => p.id === 'project-5') },
  { id: 'project-6', category: 'Completed', title: 'Corporate Office Building', image: PlaceHolderImages.find(p => p.id === 'project-6') },
].filter((p): p is { id: string; category: 'Ongoing' | 'Completed'; title: string; image: ImagePlaceholder } => !!p.image);

type Category = 'All' | 'Ongoing' | 'Completed';
const categories: Category[] = ['All', 'Ongoing', 'Completed'];

export default function ProjectsSection() {
  const [filter, setFilter] = useState<Category>('All');
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight bg-gradient-to-br from-[#3B6AF5] to-[#2F5FE3] bg-clip-text text-transparent">Our Portfolio</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            A glimpse into the quality, diversity, and craftsmanship of our completed and ongoing projects.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
              className={cn("rounded-full", filter === category ? "bg-primary text-primary-foreground" : "text-foreground")}
            >
              {category}
            </Button>
          ))}
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-[20px] overflow-hidden shadow-card-light cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-card-light-hover"
                onClick={() => setSelectedProject(project)}
              >
                <motion.div className="w-full h-full">
                  <Image
                    src={project.image.imageUrl}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={project.image.imageHint}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <p className="text-sm uppercase tracking-wider font-semibold text-white/80">{project.category}</p>
                  <h3 className="text-xl font-bold">{project.title}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-background/50 text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Maximize className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 border-0 rounded-[20px]">
          {selectedProject && selectedProject.image && (
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={selectedProject.image.imageUrl}
                  alt={selectedProject.title}
                  fill
                  className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  data-ai-hint={selectedProject.image.imageHint}
                />
              </div>
              <div className="p-8">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-br from-[#3B6AF5] to-[#2F5FE3] bg-clip-text text-transparent">{selectedProject.title}</DialogTitle>
                  <DialogDescription className="text-sm text-primary font-semibold">{selectedProject.category} Project</DialogDescription>
                </DialogHeader>
                <div className="mt-4 text-muted-foreground space-y-4 text-sm">
                  <p>This is a placeholder description for the {selectedProject.title} project. Here we would detail the scope, challenges, and outcomes of the project, highlighting the quality of our work.</p>
                  <p>Key features: Modern architecture, sustainable materials, luxury finishes.</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
