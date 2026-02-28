'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Header() {
  const logoImage = PlaceHolderImages.find((p) => p.id === 'logo');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-24 px-4 md:px-6 max-w-7xl transition-all"> 
        
        <Link href="#home" className="flex items-center gap-4 text-xl font-bold tracking-tight group">
          {logoImage && (
            <div className="relative">
              <Image 
                src={logoImage.imageUrl} 
                alt={logoImage.description} 
                width={52} 
                height={52} 
                className="h-14 w-14 rounded-none object-contain transition-transform duration-300 group-hover:scale-105" 
                /* Changed rounded-lg to rounded-none */
              />
            </div>
          )}
          <span className="text-primary leading-tight">
            Design & Construction
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <Button asChild size="lg" className={cn(
            "hidden md:block rounded-[12px] font-semibold px-7 py-3.5 shadow-button-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-button-light-hover",
            "bg-primary text-primary-foreground"
        )}>
          <Link href="#contact">Get a Quote</Link>
        </Button>
      </div>
    </header>
  );
}
