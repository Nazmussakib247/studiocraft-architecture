import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, type Project } from "@/lib/api";
import { getProjectImage } from "@/lib/projectImages";

export default function ProjectDetailPage() {
  const { id: slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);

  useEffect(() => {
    if (!slug) return;
    api<Project>(`/api/projects/${slug}`).then((item) => {
      setProject(item);
      api<Project[]>(`/api/projects?category=${encodeURIComponent(item.category)}`).then((items) => setRelated(items.filter((candidate) => candidate.slug !== item.slug).slice(0, 3))).catch(() => undefined);
    }).catch(() => setProject(null));
  }, [slug]);

  if (!project) return <div className="min-h-screen bg-background"><Navbar /><div className="pt-32 section-padding text-center"><h1 className="heading-lg mb-4">Project Not Found</h1><Button variant="outline" asChild><Link to="/portfolio">Back to Portfolio</Link></Button></div><Footer /></div>;

  return <div className="min-h-screen bg-background"><Navbar /><section className="pt-20"><img src={getProjectImage(project.image_key)} alt={project.title} className="w-full h-[70vh] object-cover" /></section><section className="section-padding py-16"><AnimatedSection><Link to="/portfolio" className="inline-flex items-center gap-2 label-text text-muted-foreground mb-8 hover:text-foreground transition-colors"><ArrowLeft size={14} /> Back to Portfolio</Link><div className="grid grid-cols-1 lg:grid-cols-3 gap-12"><div className="lg:col-span-2"><p className="label-text text-accent mb-4">{project.category}</p><h1 className="heading-xl mb-6">{project.title}</h1><p className="body-lg text-muted-foreground">{project.concept || project.description}</p></div><div className="space-y-6"><div><p className="label-text text-muted-foreground mb-1">Location</p><p className="body-md">{project.location}</p></div><div><p className="label-text text-muted-foreground mb-1">Size</p><p className="body-md">{project.size}</p></div><div><p className="label-text text-muted-foreground mb-1">Timeline</p><p className="body-md">{project.timeline}</p></div><div><p className="label-text text-muted-foreground mb-1">Year</p><p className="body-md">{project.project_year}</p></div></div></div></AnimatedSection></section><section className="section-padding pb-20"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{(project.gallery_image_keys?.length ? project.gallery_image_keys : [project.image_key]).map((key, index) => <AnimatedSection key={`${key}-${index}`} delay={index * 0.1} className={index === 0 ? "md:col-span-2" : ""}><img src={getProjectImage(key)} alt={`${project.title} view ${index + 1}`} className={`w-full object-cover rounded-sm ${index === 0 ? "h-[500px]" : "h-[400px]"}`} /></AnimatedSection>)}</div></section><section className="section-padding pb-20"><AnimatedSection><p className="label-text text-accent mb-4">Materials</p><h2 className="heading-lg mb-8">Materials Used</h2><div className="flex flex-wrap gap-3">{project.materials.map((material) => <span key={material} className="px-4 py-2 bg-secondary rounded-sm body-sm">{material}</span>)}</div></AnimatedSection></section>{project.testimonial_text && <section className="section-padding section-spacing bg-primary text-primary-foreground"><AnimatedSection><p className="label-text text-primary-foreground/50 mb-4">Client Testimonial</p><blockquote className="heading-md italic max-w-3xl mb-8">“{project.testimonial_text}”</blockquote><p className="font-medium">{project.testimonial_name}</p><p className="body-sm text-primary-foreground/50">{project.testimonial_role}</p></AnimatedSection></section>}<section className="section-padding section-spacing"><AnimatedSection><h2 className="heading-lg mb-12">Related Projects</h2></AnimatedSection><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{related.map((item, index) => <AnimatedSection key={item.id} delay={index * 0.1}><Link to={`/portfolio/${item.slug}`} className="group block"><div className="image-hover rounded-sm mb-3"><img src={getProjectImage(item.image_key)} alt={item.title} className="w-full h-[300px] object-cover rounded-sm" /></div><h3 className="heading-sm group-hover:text-accent transition-colors">{item.title}</h3><p className="body-sm text-muted-foreground">{item.location}</p></Link></AnimatedSection>)}</div></section><Footer /></div>;
}
