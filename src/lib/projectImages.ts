import hero from "@/assets/hero-architecture.jpg";
import commercial1 from "@/assets/project-commercial-1.jpg";
import interior1 from "@/assets/project-interior-1.jpg";
import interior2 from "@/assets/project-interior-2.jpg";
import residential1 from "@/assets/project-residential-1.jpg";
import restaurant1 from "@/assets/project-restaurant-1.jpg";

export const projectImages: Record<string, string> = {
  hero,
  commercial1,
  interior1,
  interior2,
  residential1,
  restaurant1,
};

export function getProjectImage(key: string) {
  return projectImages[key] || hero;
}
