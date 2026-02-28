import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero';
import AboutSection from '@/components/sections/about';
import ValuesSection from '@/components/sections/values';
import VideoTestimonialsSection from '@/components/sections/video-testimonials';
import ServicesSection from '@/components/sections/services';
import ConstructionProgressSection from '@/components/sections/construction-progress';
import ProjectsSection from '@/components/sections/projects';
import WhyChooseUsSection from '@/components/sections/why-choose-us';
import LeadFormSection from '@/components/sections/lead-form';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ValuesSection />
        <VideoTestimonialsSection />
        <ServicesSection />
        <ConstructionProgressSection />
        <ProjectsSection />
        <WhyChooseUsSection />
        <LeadFormSection />
      </main>
      <Footer />
    </div>
  );
}
