import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import interior1 from "@/assets/project-interior-1.jpg";
import heroImg from "@/assets/hero-architecture.jpg";

const teamMembers = [
  { name: "Alexander Chen", role: "Founder & Lead Architect", bio: "With 20 years of experience across three continents, Alexander founded StudioCraft to bridge the gap between art and habitation." },
  { name: "Maya Johansson", role: "Interior Design Director", bio: "Maya brings a Scandinavian-influenced minimalism to every project, creating spaces that feel both warm and refined." },
  { name: "David Okonkwo", role: "Senior Architect", bio: "Specializing in sustainable design, David ensures every project respects its environment while pushing creative boundaries." },
  { name: "Sofia Rivera", role: "Landscape Architect", bio: "Sofia's biophilic designs seamlessly connect indoor and outdoor spaces, enhancing wellbeing through nature." },
];

const values = [
  { title: "Design Excellence", description: "Every line, material, and detail is intentional. We pursue excellence without compromise." },
  { title: "Sustainability", description: "We design with the future in mind, integrating sustainable practices and materials into every project." },
  { title: "Collaboration", description: "We believe the best designs emerge from deep collaboration with our clients and their unique stories." },
  { title: "Innovation", description: "We embrace new technologies and methodologies to push the boundaries of what architecture can achieve." },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 section-padding">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">About Us</p>
          <h1 className="heading-xl max-w-4xl mb-6">Designing the Future of Living</h1>
          <p className="body-lg text-muted-foreground max-w-2xl">
            StudioCraft is an award-winning architecture and interior design studio creating extraordinary spaces since 2014.
          </p>
        </AnimatedSection>
      </section>

      {/* Story */}
      <section className="section-padding pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <div className="image-hover rounded-sm">
              <img src={heroImg} alt="StudioCraft studio" className="w-full h-[600px] object-cover rounded-sm" />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <h2 className="heading-lg mb-6">Our Story</h2>
            <p className="body-md text-muted-foreground mb-4">
              Founded in 2014 by Alexander Chen, StudioCraft began as a small studio with a big vision: to create spaces that don't just shelter, but transform the way people live and work.
            </p>
            <p className="body-md text-muted-foreground mb-4">
              Over the past decade, we've grown into a multidisciplinary team of architects, interior designers, and landscape specialists. Our portfolio spans private residences, corporate headquarters, restaurants, and cultural institutions across the globe.
            </p>
            <p className="body-md text-muted-foreground">
              What sets us apart is our holistic approach — we don't separate architecture from interiors. Every project is conceived as a complete environment, from structural concept to furniture selection.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding section-spacing bg-secondary">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">Our Philosophy</p>
          <h2 className="heading-lg mb-16">What Guides Us</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 0.1}>
              <div className="p-8 bg-background rounded-sm">
                <h3 className="heading-sm mb-3">{value.title}</h3>
                <p className="body-md text-muted-foreground">{value.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="section-padding section-spacing">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">Our Team</p>
          <h2 className="heading-lg mb-16">Meet the Studio</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <AnimatedSection key={member.name} delay={i * 0.1}>
              <div className="group">
                <div className="w-full h-80 bg-muted rounded-sm mb-4 flex items-center justify-center">
                  <span className="font-display text-6xl text-muted-foreground/30">{member.name[0]}</span>
                </div>
                <h3 className="heading-sm">{member.name}</h3>
                <p className="label-text text-accent mt-1 mb-3">{member.role}</p>
                <p className="body-sm text-muted-foreground">{member.bio}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding section-spacing bg-primary text-primary-foreground text-center">
        <AnimatedSection>
          <h2 className="heading-lg mb-6 max-w-3xl mx-auto">Let's Create Something Together</h2>
          <p className="body-lg text-primary-foreground/70 max-w-xl mx-auto mb-10">
            We'd love to hear about your project and explore how we can bring your vision to life.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">Get in Touch <ArrowRight size={14} /></Link>
          </Button>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
