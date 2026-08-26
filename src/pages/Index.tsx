import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Building2, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImg from "@/assets/hero-architecture.jpg";
import interior1 from "@/assets/project-interior-1.jpg";
import commercial1 from "@/assets/project-commercial-1.jpg";
import residential1 from "@/assets/project-residential-1.jpg";
import interior2 from "@/assets/project-interior-2.jpg";
import restaurant1 from "@/assets/project-restaurant-1.jpg";
import { api, type HomepageStat, type Project, type Service, type Testimonial } from "@/lib/api";
import { getProjectImage } from "@/lib/projectImages";

const fallbackProjects = [
  { slug: "the-glass-pavilion", title: "The Glass Pavilion", category: "Residential", location: "Malibu, CA", image_key: "residential1" },
  { slug: "zen-corporate-hq", title: "Zen Corporate HQ", category: "Commercial", location: "San Francisco, CA", image_key: "commercial1" },
  { slug: "marble-and-wood-kitchen", title: "Marble & Wood Kitchen", category: "Interior", location: "New York, NY", image_key: "interior2" },
  { slug: "botanical-restaurant", title: "Botanical Restaurant", category: "Commercial", location: "Chicago, IL", image_key: "restaurant1" },
];

const fallbackServices = [
  { title: "Architecture", description: "Residential and commercial buildings designed with purpose and precision.", icon_key: "building" },
  { title: "Interior Design", description: "Curated interiors that blend aesthetics with functionality.", icon_key: "paintbrush" },
  { title: "Consultation", description: "Expert guidance to bring your architectural vision to life.", icon_key: "users" },
  { title: "3D Visualization", description: "Photorealistic renders to preview your space before construction.", icon_key: "award" },
];

const iconMap = { building: Building2, paintbrush: Paintbrush, users: Users, award: Award };

const fallbackTestimonials = [
  { name: "Sarah Mitchell", role: "Homeowner, Malibu", quote: "StudioCraft transformed our vision into a breathtaking reality. Every detail was thoughtfully considered." },
  { name: "James Park", role: "CEO, Meridian Corp", quote: "Their commercial design elevated our workspace culture. Employees love coming to the office now." },
  { name: "Elena Rossi", role: "Restaurant Owner", quote: "The restaurant interior they designed has become a destination in itself. Truly exceptional work." },
];

const fallbackStats = [
  { number_value: "150+", label: "Projects Completed" },
  { number_value: "12", label: "Years Experience" },
  { number_value: "35+", label: "Design Awards" },
  { number_value: "98%", label: "Client Satisfaction" },
];

const Index = () => {
  const [projects, setProjects] = useState<Array<Project | typeof fallbackProjects[number]>>(fallbackProjects);
  const [services, setServices] = useState<Array<Service | typeof fallbackServices[number]>>(fallbackServices);
  const [testimonials, setTestimonials] = useState<Array<Testimonial | typeof fallbackTestimonials[number]>>(fallbackTestimonials);
  const [stats, setStats] = useState<Array<HomepageStat | typeof fallbackStats[number]>>(fallbackStats);

  useEffect(() => {
    api<Project[]>("/api/projects").then((items) => setProjects(items.slice(0, 4))).catch(() => undefined);
    api<Service[]>("/api/services").then(setServices).catch(() => undefined);
    api<Testimonial[]>("/api/testimonials").then(setTestimonials).catch(() => undefined);
    api<HomepageStat[]>("/api/homepage-stats").then(setStats).catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen flex items-end">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Modern architecture building at dusk" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        </div>
        <div className="relative section-padding pb-20 md:pb-32 w-full">
          <AnimatedSection>
            <p className="label-text text-background/60 mb-4">Architecture & Interior Design</p>
            <h1 className="heading-xl text-background max-w-4xl mb-6">
              Spaces That <em className="italic">Inspire</em>
            </h1>
            <p className="body-lg text-background/70 max-w-xl mb-10">
              Award-winning studio crafting extraordinary residential, commercial, and hospitality spaces.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/portfolio">View Portfolio</Link>
              </Button>
              <Button variant="heroOutline" size="xl" className="border-background/30 text-background hover:bg-background hover:text-foreground" asChild>
                <Link to="/contact">Book Consultation</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="section-padding py-16 border-b border-border scroll-mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <p className="font-display text-4xl md:text-5xl font-light text-accent">{stat.number_value}</p>
                <p className="label-text text-muted-foreground mt-2">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* About Intro */}
      <section id="about" className="section-padding section-spacing scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <p className="label-text text-accent mb-4">About Our Studio</p>
            <h2 className="heading-lg mb-6">Design With Intention</h2>
            <p className="body-lg text-muted-foreground mb-6">
              For over a decade, StudioCraft has been redefining how people experience the spaces they inhabit. We believe architecture is more than structure — it's the art of shaping how life unfolds.
            </p>
            <p className="body-md text-muted-foreground mb-8">
              Our multidisciplinary team of architects, interior designers, and landscape specialists work together to create cohesive environments that are as beautiful as they are functional.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 label-text text-foreground line-reveal">
              Learn More About Us <ArrowRight size={14} />
            </Link>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="image-hover rounded-sm">
              <img src={interior1} alt="Modern interior design living room" className="w-full h-[500px] object-cover rounded-sm" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section-padding section-spacing bg-secondary scroll-mt-24">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">What We Do</p>
          <h2 className="heading-lg mb-16 max-w-2xl">Our Services</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.1}>
              <div className="p-8 bg-background rounded-sm hover:shadow-lg transition-shadow duration-500">
                {(() => { const Icon = iconMap[service.icon_key as keyof typeof iconMap] || Building2; return <Icon className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />; })()}
                <h3 className="heading-sm mb-3">{service.title}</h3>
                <p className="body-sm text-muted-foreground">{service.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">Explore All Services <ArrowRight size={14} /></Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="section-padding section-spacing scroll-mt-24">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="label-text text-accent mb-4">Selected Work</p>
              <h2 className="heading-lg">Featured Projects</h2>
            </div>
            <Link to="/portfolio" className="inline-flex items-center gap-2 label-text text-foreground line-reveal">
              View All Projects <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 0.1}>
              <Link to={`/portfolio/${project.slug}`} className="group block">
                <div className="image-hover rounded-sm mb-4">
                  <img
                    src={getProjectImage(project.image_key)}
                    alt={project.title}
                    className="w-full h-[400px] object-cover rounded-sm"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="heading-sm group-hover:text-accent transition-colors">{project.title}</h3>
                    <p className="body-sm text-muted-foreground">{project.location}</p>
                  </div>
                  <span className="label-text text-muted-foreground">{project.category}</span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding section-spacing bg-primary text-primary-foreground scroll-mt-24">
        <AnimatedSection>
          <p className="label-text text-primary-foreground/50 mb-4">Client Testimonials</p>
          <h2 className="heading-lg mb-16 max-w-2xl">What Our Clients Say</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <AnimatedSection key={testimonial.name} delay={i * 0.15}>
              <div className="border border-primary-foreground/10 rounded-sm p-8">
                <p className="body-md text-primary-foreground/80 mb-8 italic font-display text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-medium text-primary-foreground">{testimonial.name}</p>
                  <p className="body-sm text-primary-foreground/50">{testimonial.role}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding section-spacing text-center">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">Start Your Project</p>
          <h2 className="heading-lg mb-6 max-w-3xl mx-auto">Ready to Create Something Extraordinary?</h2>
          <p className="body-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Let's discuss your vision and bring it to life with thoughtful design.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Book a Consultation</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
