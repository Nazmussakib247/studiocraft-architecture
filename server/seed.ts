import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closeDatabase, query } from "./db";
import { hashPassword } from "./auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const services = [
  { title: "Architecture", description: "Residential and commercial buildings designed with purpose and precision.", iconKey: "building", sortOrder: 1 },
  { title: "Interior Design", description: "Curated interiors that blend aesthetics with functionality.", iconKey: "paintbrush", sortOrder: 2 },
  { title: "Consultation", description: "Expert guidance to bring your architectural vision to life.", iconKey: "users", sortOrder: 3 },
  { title: "3D Visualization", description: "Photorealistic renders to preview your space before construction.", iconKey: "award", sortOrder: 4 },
];

const testimonials = [
  { name: "Sarah Mitchell", role: "Homeowner, Malibu", quote: "StudioCraft transformed our vision into a breathtaking reality. Every detail was thoughtfully considered.", sortOrder: 1 },
  { name: "James Park", role: "CEO, Meridian Corp", quote: "Their commercial design elevated our workspace culture. Employees love coming to the office now.", sortOrder: 2 },
  { name: "Elena Rossi", role: "Restaurant Owner", quote: "The restaurant interior they designed has become a destination in itself. Truly exceptional work.", sortOrder: 3 },
];

const stats = [
  { key: "projects", number: "150+", label: "Projects Completed", sortOrder: 1 },
  { key: "years", number: "12", label: "Years Experience", sortOrder: 2 },
  { key: "awards", number: "35+", label: "Design Awards", sortOrder: 3 },
  { key: "satisfaction", number: "98%", label: "Client Satisfaction", sortOrder: 4 },
];

const projects = [
  { title: "The Glass Pavilion", slug: "the-glass-pavilion", category: "Residential", location: "Malibu, CA", size: "4,200 sq ft", imageKey: "residential1", gallery: ["residential1", "interior1", "hero"], description: "A cantilevered concrete and glass residence perched on a hillside.", concept: "Inspired by the California coastline, this residence dissolves the boundary between indoor and outdoor living. Floor-to-ceiling glazing captures panoramic ocean views, while exposed concrete provides thermal mass and textural contrast.", materials: ["Exposed Concrete", "Low-Iron Glass", "White Oak", "Travertine Stone", "Blackened Steel"], timeline: "18 months", year: "2024", quote: "StudioCraft understood our desire for a home that felt like an extension of the landscape.", client: "Sarah Mitchell", role: "Homeowner" },
  { title: "Zen Corporate HQ", slug: "zen-corporate-hq", category: "Commercial", location: "San Francisco, CA", size: "28,000 sq ft", imageKey: "commercial1", gallery: ["commercial1", "interior1", "restaurant1"], description: "A biophilic office headquarters designed for wellbeing and focus.", concept: "A workspace designed around biophilic principles. Living walls, natural materials, and abundant daylight create an environment that promotes focus, creativity, and wellbeing.", materials: ["Structural Steel", "Curtain Wall Glass", "Living Plant Walls", "Bamboo Flooring", "Acoustic Felt"], timeline: "24 months", year: "2023", quote: "Employee satisfaction increased 40% after moving into our new headquarters.", client: "James Park", role: "CEO, Meridian Corp" },
  { title: "Minimal Living Room", slug: "minimal-living-room", category: "Interior", location: "New York, NY", size: "1,200 sq ft", imageKey: "interior1", gallery: ["interior1", "interior2", "hero"], description: "Warm minimalism with concrete walls and curated furniture.", concept: "A study in warm minimalism. Raw concrete walls meet rich walnut furnishings, creating a space that feels both gallery-like and deeply comfortable.", materials: ["Board-Formed Concrete", "American Walnut", "Linen Upholstery", "Brushed Brass", "Limestone"], timeline: "6 months", year: "2024", quote: "Every material choice was deliberate and beautiful. It feels like living in a work of art.", client: "Michael Torres", role: "Homeowner" },
  { title: "Marble & Wood Kitchen", slug: "marble-and-wood-kitchen", category: "Interior", location: "New York, NY", size: "800 sq ft", imageKey: "interior2", gallery: ["interior2", "interior1", "residential1"], description: "A chef's kitchen blending Calacatta marble with walnut cabinetry.", concept: "A chef's kitchen where Calacatta marble meets rich walnut cabinetry. Every surface was chosen for beauty, durability, and tactile pleasure.", materials: ["Calacatta Marble", "Walnut Veneer", "Brushed Nickel", "Porcelain Tile", "Integrated LED"], timeline: "4 months", year: "2025", quote: "Cooking in this kitchen is a sensory experience. The materials are stunning.", client: "Anna Kovács", role: "Homeowner" },
  { title: "Botanical Restaurant", slug: "botanical-restaurant", category: "Commercial", location: "Chicago, IL", size: "3,500 sq ft", imageKey: "restaurant1", gallery: ["restaurant1", "interior1", "commercial1"], description: "A dining experience surrounded by living walls and warm concrete.", concept: "A dining environment where lush botanicals and raw concrete create an atmosphere of urban nature. The design encourages lingering and exploration.", materials: ["Poured Concrete", "Reclaimed Wood", "Living Plants", "Leather Banquettes", "Hand-Blown Glass"], timeline: "8 months", year: "2023", quote: "The space itself has become a draw. Guests come for the atmosphere as much as the food.", client: "Elena Rossi", role: "Restaurant Owner" },
  { title: "Sunset Residence", slug: "sunset-residence", category: "Residential", location: "Austin, TX", size: "3,800 sq ft", imageKey: "hero", gallery: ["hero", "residential1", "interior2"], description: "A modern home designed to frame golden-hour light throughout the day.", concept: "Oriented to capture the Texas golden hour, this home uses deep overhangs and strategic glazing to frame light as a design material.", materials: ["Rammed Earth", "Corten Steel", "Cedar Cladding", "Polished Concrete", "Bronze Hardware"], timeline: "16 months", year: "2024", quote: "Every evening, the house transforms with the light. It's magical.", client: "Robert Kim", role: "Homeowner" },
];

async function main() {
  const schema = await fs.readFile(path.join(__dirname, "schema.sql"), "utf8");
  await query(schema);
  const email = (process.env.ADMIN_EMAIL || "admin@studiocraft.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "change-this-password";
  await query(
    `INSERT INTO admins (email, password_hash) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, hashPassword(password)],
  );
  for (const p of projects) {
    await query(
      `INSERT INTO projects (title, slug, category, location, size, image_key, gallery_image_keys, description, concept, materials, timeline, project_year, testimonial_text, testimonial_name, testimonial_role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, category=EXCLUDED.category, location=EXCLUDED.location, size=EXCLUDED.size, image_key=EXCLUDED.image_key, gallery_image_keys=EXCLUDED.gallery_image_keys, description=EXCLUDED.description, concept=EXCLUDED.concept, materials=EXCLUDED.materials, timeline=EXCLUDED.timeline, project_year=EXCLUDED.project_year, testimonial_text=EXCLUDED.testimonial_text, testimonial_name=EXCLUDED.testimonial_name, testimonial_role=EXCLUDED.testimonial_role, updated_at=NOW()`,
      [p.title, p.slug, p.category, p.location, p.size, p.imageKey, p.gallery, p.description, p.concept, p.materials, p.timeline, p.year, p.quote, p.client, p.role],
    );
  }
  for (const item of services) {
    await query(`INSERT INTO services (title, description, icon_key, sort_order) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, [item.title, item.description, item.iconKey, item.sortOrder]);
  }
  for (const item of testimonials) {
    await query(`INSERT INTO testimonials (name, role, quote, sort_order) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, [item.name, item.role, item.quote, item.sortOrder]);
  }
  for (const item of stats) {
    await query(`INSERT INTO homepage_stats (stat_key, number_value, label, sort_order) VALUES ($1, $2, $3, $4) ON CONFLICT (stat_key) DO UPDATE SET number_value=EXCLUDED.number_value, label=EXCLUDED.label, sort_order=EXCLUDED.sort_order`, [item.key, item.number, item.label, item.sortOrder]);
  }
  await query(`INSERT INTO site_settings (key, value) VALUES ('general', $1) ON CONFLICT (key) DO NOTHING`, [JSON.stringify({ studioName: "StudioCraft", email: "hello@studiocraft.com", phone: "+1 (212) 555-0147", address: "245 West 29th Street, New York, NY 10001" })]);
  console.log(`Database ready. Admin: ${email}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => closeDatabase());
