'use client';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

const getImagesByIds = (ids: string[]): ImagePlaceholder[] => {
    return ids.map(id => PlaceHolderImages.find(p => p.id === id)).filter((p): p is ImagePlaceholder => !!p);
};

const columnsData = [
  { ids: ['gallery-1', 'gallery-2', 'gallery-3', 'gallery-4', 'gallery-5'], duration: 40 },
  { ids: ['gallery-6', 'gallery-7', 'gallery-8', 'gallery-9', 'gallery-15'], duration: 55 },
  { ids: ['gallery-10', 'gallery-11', 'gallery-12', 'gallery-13', 'gallery-14'], duration: 45 },
];

const ScrollingColumn = ({ images, duration, isReverse = false }: { images: ImagePlaceholder[]; duration: number; isReverse?: boolean }) => {
    const duplicatedImages = React.useMemo(() => [...images, ...images], [images]);

    return (
        <motion.div
            className="flex flex-col gap-4"
            animate={{
                translateY: isReverse ? ['-50%', '0%'] : ['0%', '-50%'],
            }}
            transition={{
                ease: 'linear',
                duration: duration,
                repeat: Infinity,
            }}
        >
            {duplicatedImages.map((image, index) => (
                <div
                    key={`${image.id}-${index}`}
                    className="overflow-hidden rounded-xl shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                >
                    <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={500}
                        height={700}
                        className="h-auto w-full object-cover"
                        data-ai-hint={image.imageHint}
                    />
                </div>
            ))}
        </motion.div>
    );
};

export default function ScrollingGallerySection() {
    const columns = columnsData.map(col => ({...col, images: getImagesByIds(col.ids)}));

    return (
        <section id="gallery" className="py-24 sm:py-32 bg-secondary overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start mb-16">
                    <div className="mb-8 md:mb-0">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
                            Our Project Gallery
                        </h2>
                        <p className="mt-4 text-muted-foreground max-w-xl md:text-lg">
                            Explore a curated collection of our finest work, showcasing our dedication to quality and design excellence.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4 h-[800px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                {columns.map((col, i) => (
                    <ScrollingColumn key={i} images={col.images} duration={col.duration} isReverse={i % 2 === 1} />
                ))}
            </div>
        </section>
    );
}
