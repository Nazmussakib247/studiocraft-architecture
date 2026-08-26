import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { api, type SiteSettings } from "@/lib/api";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", projectType: "", budget: "", message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({ studioName: "StudioCraft", email: "hello@studiocraft.com", phone: "+1 (212) 555-0147", address: "245 West 29th Street, New York, NY 10001" });

  useEffect(() => { api<Partial<SiteSettings>>("/api/settings").then((value) => setSettings((current) => ({ ...current, ...value }))).catch(() => undefined); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api("/api/inquiries", { method: "POST", body: JSON.stringify(formData) });
      toast.success("Thank you! We'll be in touch within 24 hours.");
      setFormData({ name: "", email: "", phone: "", projectType: "", budget: "", message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 section-padding">
        <AnimatedSection>
          <p className="label-text text-accent mb-4">Get in Touch</p>
          <h1 className="heading-xl max-w-4xl mb-6">Let's Talk</h1>
          <p className="body-lg text-muted-foreground max-w-2xl">
            Ready to start your project? Fill out the form below or reach out directly.
          </p>
        </AnimatedSection>
      </section>

      <section className="section-padding pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Form */}
          <AnimatedSection className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-text text-muted-foreground block mb-2">Full Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 bg-secondary border-0 rounded-sm"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="label-text text-muted-foreground block mb-2">Email *</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 bg-secondary border-0 rounded-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-text text-muted-foreground block mb-2">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 bg-secondary border-0 rounded-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="label-text text-muted-foreground block mb-2">Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full h-12 px-3 bg-secondary border-0 rounded-sm text-foreground font-body text-sm appearance-none"
                  >
                    <option value="">Select type</option>
                    <option value="residential">Residential Architecture</option>
                    <option value="commercial">Commercial Architecture</option>
                    <option value="interior">Interior Design</option>
                    <option value="renovation">Renovation</option>
                    <option value="landscape">Landscape Design</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label-text text-muted-foreground block mb-2">Budget Range</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full h-12 px-3 bg-secondary border-0 rounded-sm text-foreground font-body text-sm appearance-none"
                >
                  <option value="">Select budget range</option>
                  <option value="50-100k">$50,000 — $100,000</option>
                  <option value="100-250k">$100,000 — $250,000</option>
                  <option value="250-500k">$250,000 — $500,000</option>
                  <option value="500k-1m">$500,000 — $1,000,000</option>
                  <option value="1m+">$1,000,000+</option>
                </select>
              </div>
              <div>
                <label className="label-text text-muted-foreground block mb-2">Project Description *</label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[150px] bg-secondary border-0 rounded-sm resize-none"
                  placeholder="Tell us about your project vision, timeline, and any specific requirements..."
                />
              </div>
              <Button variant="hero" size="xl" type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? "Sending…" : "Send Message"} <Send size={14} />
              </Button>
            </form>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-8">
              <div>
                <h3 className="heading-sm mb-6">Studio Location</h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="body-md">{settings.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <Phone className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <p className="body-md">{settings.phone}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <p className="body-md">{settings.email}</p>
                </div>
              </div>

              <div>
                <h3 className="heading-sm mb-4">Office Hours</h3>
                <div className="space-y-2 body-sm text-muted-foreground">
                  <p>Monday — Friday: 9:00 AM — 6:00 PM</p>
                  <p>Saturday: By appointment</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              <div>
                <h3 className="heading-sm mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {[{ label: "Portfolio", href: "https://nazmussakib.tech/" }, { label: "LinkedIn", href: "https://www.linkedin.com/in/nazmussakib247/" }].map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="label-text text-muted-foreground hover:text-accent transition-colors">{social.label}</a>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-sm border border-border">
                <iframe
                  title="StudioCraft studio location"
                  src="https://www.google.com/maps?q=245+West+29th+Street,+New+York,+NY+10001&output=embed"
                  className="w-full h-64 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
