'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { correctAddress } from '@/ai/flows/address-correction-lead-form';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number." }),
  address: z.string().min(10, { message: "Please enter a complete address." }),
  plotSize: z.string().min(2, { message: "Please enter plot size." }),
  city: z.string().min(2, { message: "City is required." }),
});

export default function LeadFormSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrectingAddress, setIsCorrectingAddress] = useState(false);
  const [addressSuggestion, setAddressSuggestion] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      plotSize: "",
      city: "",
    },
  });

  async function handleAddressBlur(addressInput: string) {
    if (addressInput.length < 10) return;
    
    setIsCorrectingAddress(true);
    setAddressSuggestion(null);

    try {
      const result = await correctAddress({ addressInput });
      if (result.correctedAddress && result.correctedAddress.toLowerCase() !== addressInput.toLowerCase()) {
        setAddressSuggestion(result.correctedAddress);
      }
    } catch (error) {
      console.error("Address correction failed:", error);
    } finally {
      setIsCorrectingAddress(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Enquiry Sent!",
          description: "Thank you for your interest. We will get back to you shortly.",
        });
        form.reset();
      } else {
        throw new Error("Submission failed");
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  }

  return (
    <section id="contact" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-primary">Planning to Build Your Dream Home?</h2>
          <p className="text-muted-foreground mb-12">
            Fill out the form below for a free consultation and site visit. Let's start building your future together.
          </p>
        </div>
        <div className="max-w-xl mx-auto bg-background p-8 rounded-[20px] shadow-card-light">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Address</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input {...field} onBlur={() => handleAddressBlur(field.value)} />
                            {isCorrectingAddress && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                        </div>
                    </FormControl>
                    {addressSuggestion && (
                        <div className="bg-accent/10 p-2 rounded-md text-sm text-foreground">
                            Suggested: <button type="button" className="font-semibold text-accent" onClick={() => {
                                form.setValue('address', addressSuggestion);
                                setAddressSuggestion(null);
                            }}>{addressSuggestion}</button>
                        </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="plotSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plot Size (in sq. ft.)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" size="lg" className={cn(
                "w-full rounded-[12px] font-semibold px-7 py-3.5 shadow-button-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-button-light-hover",
                "bg-primary text-primary-foreground"
              )} disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Submit Your Enquiry'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
