import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Home, Store, Paintbrush, Sofa, Monitor, Utensils, Box, TreePine } from "lucide-react";
import { api, type Service } from "@/lib/api";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const architectureServices = [
  { icon: Home, title: "Residential Architecture", description: "Custom homes designed to reflect your lifestyle, from contemporary villas to urban townhouses." },
  { icon: Building2, title: "Commercial Architecture", description: "Office buildings, retail spaces, and mixed-use developments that elevate brands and productivity." },
  { icon: TreePine, title: "Landscape Design", description: "Outdoor environments that extend the architectural vision into gardens, terraces, and public spaces." },
  { icon: Box, title: "Renovation Projects", description: "Thoughtful renovations that breathe new life into existing structures while preserving their character." },
];

const interiorServices = [
  { icon: Sofa, title: "Home Interior Design", description: "Complete residential interiors — from spatial planning to furniture curation and styling." },
  { icon: Monitor, title: "Office Interior", description: "Workspaces designed for productivity, collaboration, and brand expression." },
  { icon: Utensils, title: "Restaurant & Retail Interior", description: "Hospitality and retail environments that create memorable customer experiences." },
  { icon: Paintbrush, title: "3D Visualization", description: "Photorealistic renders and virtual walkthroughs to experience your space before it's built." },
  { icon: Store, title: "Custom Furniture Design", description: "Bespoke furniture pieces designed specifically for your space and lifestyle." },
];

const processSteps = [
  { step: "01", title: "Discovery", description: "We listen deeply to understand your vision, needs, and aspirations for the project." },
  { step: "02", title: "Concept", description: "Our team develops initial concepts, mood boards, and spatial strategies." },
  { step: "03", title: "Design", description: "Detailed design development with 3D visualizations, material selections, and technical drawings." },
  { step: "04", title: "Execution", description: "We oversee construction and installation to ensure every detail is realized perfectly." },
];

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => { api<Service[]>("/api/services").then(setServices).catch(() => undefined); }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 section-padding">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">Our Services</p>
          <h1 className="heading-xl max-w-4xl mb-6">Comprehensive Design Solutions</h1>
          <p className="body-lg text-muted-foreground max-w-2xl">
            From concept to completion, we offer a full spectrum of architecture and interior design services tailored to your vision.
          </p>
        </AnimatedSection>
      </section>

      {/* Managed Services */}
      <section className="section-padding pb-20">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">Studio Services</p>
          <h2 className="heading-lg mb-12">What We Do</h2>
        </AnimatedSection>
        {services.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{services.map((service, i) => <AnimatedSection key={service.id} delay={i * 0.08}><div className="p-8 border border-border rounded-sm"><h3 className="heading-sm mb-3">{service.title}</h3><p className="body-md text-muted-foreground">{service.description}</p></div></AnimatedSection>)}</div>}
      </section>

      {/* Architecture Services */}
      <section className="section-padding pb-32">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">Architecture</p>
          <h2 className="heading-lg mb-12">Architecture Services</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {architectureServices.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.1}>
              <div className="p-8 border border-border rounded-sm hover:border-accent/30 transition-colors duration-500 group">
                <service.icon className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h3 className="heading-sm mb-3">{service.title}</h3>
                <p className="body-md text-muted-foreground">{service.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Interior Services */}
      <section className="section-padding section-spacing bg-secondary">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">Interior Design</p>
          <h2 className="heading-lg mb-12">Interior Design Services</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interiorServices.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.1}>
              <div className="p-8 bg-background rounded-sm hover:shadow-lg transition-all duration-500 group">
                <service.icon className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h3 className="heading-sm mb-3">{service.title}</h3>
                <p className="body-md text-muted-foreground">{service.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="section-padding section-spacing">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">Our Process</p>
          <h2 className="heading-lg mb-16">How We Work</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, i) => (
            <AnimatedSection key={step.step} delay={i * 0.1}>
              <div>
                <span className="font-display text-6xl text-accent/30">{step.step}</span>
                <h3 className="heading-sm mt-4 mb-3">{step.title}</h3>
                <p className="body-sm text-muted-foreground">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding section-spacing bg-primary text-primary-foreground text-center">
        <AnimatedSection>
          <h2 className="heading-lg mb-6 max-w-3xl mx-auto">Ready to Start Your Project?</h2>
          <p className="body-lg text-primary-foreground/70 max-w-xl mx-auto mb-10">
            Book a free consultation to discuss your vision and explore how we can help.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">Book Consultation <ArrowRight size={14} /></Link>
          </Button>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
