import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, type Project } from "@/lib/api";
import { getProjectImage } from "@/lib/projectImages";

const fallbackProjects = [
  { id: 1, slug: "the-glass-pavilion", title: "The Glass Pavilion", category: "Residential", location: "Malibu, CA", size: "4,200 sq ft", image_key: "residential1", description: "A cantilevered concrete and glass residence perched on a hillside." },
  { id: 2, slug: "zen-corporate-hq", title: "Zen Corporate HQ", category: "Commercial", location: "San Francisco, CA", size: "28,000 sq ft", image_key: "commercial1", description: "A biophilic office headquarters designed for wellbeing and focus." },
  { id: 3, slug: "minimal-living-room", title: "Minimal Living Room", category: "Interior", location: "New York, NY", size: "1,200 sq ft", image_key: "interior1", description: "Warm minimalism with concrete walls and curated furniture." },
  { id: 4, slug: "marble-and-wood-kitchen", title: "Marble & Wood Kitchen", category: "Interior", location: "New York, NY", size: "800 sq ft", image_key: "interior2", description: "A chef's kitchen blending Calacatta marble with walnut cabinetry." },
  { id: 5, slug: "botanical-restaurant", title: "Botanical Restaurant", category: "Commercial", location: "Chicago, IL", size: "3,500 sq ft", image_key: "restaurant1", description: "A dining experience surrounded by living walls and warm concrete." },
  { id: 6, slug: "sunset-residence", title: "Sunset Residence", category: "Residential", location: "Austin, TX", size: "3,800 sq ft", image_key: "hero", description: "A modern home designed to frame golden-hour light throughout the day." },
];

const categories = ["All", "Residential", "Commercial", "Interior"];

const PortfolioPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState<Array<Pick<Project, "id" | "slug" | "title" | "category" | "location" | "size" | "image_key" | "description">> | typeof fallbackProjects>(fallbackProjects);

  useEffect(() => { api<Project[]>("/api/projects").then(setProjects).catch(() => undefined); }, []);

  const filteredProjects = activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter);

  return <div className="min-h-screen bg-background"><Navbar /><section className="pt-32 pb-12 section-padding"><AnimatedSection><p className="label-text text-accent mb-4">Our Work</p><h1 className="heading-xl max-w-4xl mb-6">Portfolio</h1><p className="body-lg text-muted-foreground max-w-2xl">A curated selection of architecture and interior design projects that define our practice.</p></AnimatedSection></section><section className="section-padding pb-8"><div className="flex gap-4 flex-wrap">{categories.map((category) => <button key={category} onClick={() => setActiveFilter(category)} className={`label-text px-4 py-2 rounded-sm transition-all duration-300 ${activeFilter === category ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{category}</button>)}</div></section><section className="section-padding pb-32"><div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">{filteredProjects.map((project, index) => <AnimatedSection key={project.id} delay={index * 0.05}><Link to={`/portfolio/${project.slug}`} className="group block break-inside-avoid"><div className="image-hover rounded-sm mb-3"><img src={getProjectImage(project.image_key)} alt={project.title} className={`w-full object-cover rounded-sm ${index % 3 === 0 ? "h-[500px]" : index % 3 === 1 ? "h-[350px]" : "h-[420px]"}`} /></div><h3 className="heading-sm group-hover:text-accent transition-colors">{project.title}</h3><div className="flex justify-between items-center mt-1"><p className="body-sm text-muted-foreground">{project.location}</p><span className="label-text text-muted-foreground">{project.category}</span></div></Link></AnimatedSection>)}</div></section><Footer /></div>;
};

export default PortfolioPage;
