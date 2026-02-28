import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

export default function Footer() {
  const services = [
    { name: 'Full Home Construction', href: '#services' },
    { name: 'Turnkey Projects', href: '#services' },
    { name: 'Interior & Exterior Design', href: '#services' },
    { name: 'Renovation & Remodeling', href: '#services' },
  ];

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Our Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
    { name: 'Privacy Policy', href: '#' },
  ];

  const logoImage = PlaceHolderImages.find((p) => p.id === 'logo');

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand Info (Updated for Big Logo) */}
          <div className="flex flex-col items-start">
            {logoImage && (
              <div className="mb-6">
                <Image 
                  src={logoImage.imageUrl} 
                  alt={logoImage.description} 
                  width={80} 
                  height={80} 
                  className="h-20 w-20 rounded-xl object-contain shadow-sm" 
                />
              </div>
            )}
            <h3 className="text-2xl font-bold text-primary mb-2 leading-tight">
              Construction & Design
            </h3>
            <div className="w-16 h-0.5 bg-primary mb-4"></div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
              Building dream homes with precision and trust for over a decade.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-primary">Services</h4>
            <ul className="space-y-3">
              {services.map(service => (
                <li key={service.name}>
                  <Link href={service.href} className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                    <ChevronRight className="w-4 h-4 mr-2 text-primary" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="group relative text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.name}
                    <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-primary">Contact Us</h4>
            <address className="not-italic text-sm space-y-4 text-muted-foreground">
              <p className="flex items-start">
                <MapPin size={16} className="mr-3 mt-1 shrink-0 text-primary" />
                <span>G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226002</span>
              </p>
              <p className="flex items-center">
                <Mail size={16} className="mr-3 shrink-0 text-primary" />
                <a href="mailto:info.itlcindia@gmail.com" className="hover:text-primary transition-colors duration-300">info.itlcindia@gmail.com</a>
              </p>
              <p className="flex items-center">
                <Phone size={16} className="mr-3 shrink-0 text-primary" />
                <a href="tel:+919532341000" className="hover:text-primary transition-colors duration-300">(+91) 953 234 1000</a>
              </p>
            </address>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-muted/20">
          <div className="flex flex-col md:flex-row justify-center items-center text-sm text-muted-foreground">
            <p>&copy; 2015-2026 Construction & Design. All rights reserved.</p>
          </div>
          <p className="text-center text-xs text-muted-foreground/70 mt-6">
            Designed & Developed with Excellence by ITLC Team
          </p>
        </div>
      </div>
    </footer>
  );
}
