import { Award, ShieldCheck, Users, Lightbulb, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Award,
    title: 'Decade of Experience',
    description: 'With over 10 years in the industry, we bring a wealth of knowledge and expertise to every project.',
  },
  {
    icon: ShieldCheck,
    title: 'Uncompromising Quality',
    description: 'We use only the finest materials and adhere to the highest standards of craftsmanship and safety.',
  },
  {
    icon: Users,
    title: 'Client-First Approach',
    description: 'Your vision is our blueprint. We collaborate closely with you at every stage to ensure your complete satisfaction.',
  },
  {
    icon: Lightbulb,
    title: 'Innovative Solutions',
    description: 'We leverage modern architectural trends and sustainable technologies to build future-ready homes.',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section id="why-us" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-primary">Why Choose ITLC India?</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            We are more than just builders. We are partners in creating the space you'll call home.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
             <Card key={feature.title} className="h-full text-center bg-secondary border rounded-[20px] p-4 shadow-card-light transition-all duration-300 hover:-translate-y-2 hover:shadow-card-light-hover">
             <CardHeader className="items-center">
               <div className="p-5 bg-primary/10 text-primary rounded-[16px] mb-4 inline-block">
                 <feature.icon className="w-8 h-8" />
               </div>
               <CardTitle className="text-lg font-semibold tracking-tight text-primary">{feature.title}</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground text-sm">{feature.description}</p>
             </CardContent>
           </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
