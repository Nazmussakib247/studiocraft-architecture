import { useCallback, useEffect, useState } from "react";
import { LogOut, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, type HomepageStat, type Inquiry, type Project, type Service, type Testimonial } from "@/lib/api";

const emptyService = { title: "", description: "", iconKey: "building", sortOrder: 0, published: true };
const emptyTestimonial = { name: "", role: "", quote: "", sortOrder: 0, published: true };
const emptyStat = { statKey: "", numberValue: "", label: "", sortOrder: 0, published: true };

const emptyProject = {
  title: "", slug: "", category: "Residential", location: "", size: "", imageKey: "hero",
  galleryImageKeys: "hero, interior1, residential1", description: "", concept: "", materials: "",
  timeline: "", projectYear: "", testimonialText: "", testimonialName: "", testimonialRole: "", published: true,
};

type ProjectForm = typeof emptyProject;

export default function AdminPage() {
  const [admin, setAdmin] = useState<{ email: string } | null>(null);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<HomepageStat[]>([]);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [statForm, setStatForm] = useState(emptyStat);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [editingStatId, setEditingStatId] = useState<number | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState({ studioName: "", email: "", phone: "", address: "" });
  const [form, setForm] = useState<ProjectForm>(emptyProject);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [active, setActive] = useState<"projects" | "services" | "testimonials" | "stats" | "inquiries" | "settings">("projects");
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    const [me, projectRows, serviceRows, testimonialRows, statRows, inquiryRows, settingRows] = await Promise.all([
      api<{ email: string }>("/api/admin/me"), api<Project[]>("/api/admin/projects"), api<Service[]>("/api/admin/services"), api<Testimonial[]>("/api/admin/testimonials"), api<HomepageStat[]>("/api/admin/stats"), api<Inquiry[]>("/api/admin/inquiries"), api<{ key: string; value: typeof settings }[]>("/api/admin/settings"),
    ]);
    setAdmin(me); setProjects(projectRows); setServices(serviceRows); setTestimonials(testimonialRows); setStats(statRows); setInquiries(inquiryRows);
    const general = settingRows.find((row) => row.key === "general");
    if (general) setSettings((current) => ({ ...current, ...general.value }));
  }, []);

  useEffect(() => { loadDashboard().catch(() => undefined); }, [loadDashboard]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault(); setError("");
    try { await api("/api/admin/login", { method: "POST", body: JSON.stringify(login) }); await loadDashboard(); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to log in"); }
  }

  async function saveService(event: React.FormEvent) {
    event.preventDefault();
    const saved = await api<Service>(editingServiceId ? `/api/admin/services/${editingServiceId}` : "/api/admin/services", { method: editingServiceId ? "PUT" : "POST", body: JSON.stringify(serviceForm) });
    setServices((items) => editingServiceId ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved].sort((a, b) => a.sort_order - b.sort_order));
    setEditingServiceId(null); setServiceForm(emptyService);
  }

  async function saveTestimonial(event: React.FormEvent) {
    event.preventDefault();
    const saved = await api<Testimonial>(editingTestimonialId ? `/api/admin/testimonials/${editingTestimonialId}` : "/api/admin/testimonials", { method: editingTestimonialId ? "PUT" : "POST", body: JSON.stringify(testimonialForm) });
    setTestimonials((items) => editingTestimonialId ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved].sort((a, b) => a.sort_order - b.sort_order));
    setEditingTestimonialId(null); setTestimonialForm(emptyTestimonial);
  }

  async function saveStat(event: React.FormEvent) {
    event.preventDefault();
    const saved = await api<HomepageStat>(editingStatId ? `/api/admin/stats/${editingStatId}` : "/api/admin/stats", { method: editingStatId ? "PUT" : "POST", body: JSON.stringify(statForm) });
    setStats((items) => editingStatId ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved].sort((a, b) => a.sort_order - b.sort_order));
    setEditingStatId(null); setStatForm(emptyStat);
  }

  async function deleteContent(type: "services" | "testimonials" | "stats", id: number) {
    if (!window.confirm("Delete this item?")) return;
    await api(`/api/admin/${type}/${id}`, { method: "DELETE" });
    if (type === "services") setServices((items) => items.filter((item) => item.id !== id));
    if (type === "testimonials") setTestimonials((items) => items.filter((item) => item.id !== id));
    if (type === "stats") setStats((items) => items.filter((item) => item.id !== id));
  }

  async function saveProject(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const payload = { ...form, galleryImageKeys: form.galleryImageKeys.split(",").map((value) => value.trim()).filter(Boolean), materials: form.materials.split(",").map((value) => value.trim()).filter(Boolean) };
    try {
      const saved = await api<Project>(editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects", { method: editingId ? "PUT" : "POST", body: JSON.stringify(payload) });
      setProjects((items) => editingId ? items.map((item) => item.id === saved.id ? saved : item) : [saved, ...items]);
      setEditingId(null); setForm(emptyProject);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save project"); }
  }

  function editProject(project: Project) {
    setEditingId(project.id); setActive("projects"); setForm({ title: project.title, slug: project.slug, category: project.category, location: project.location, size: project.size, imageKey: project.image_key, galleryImageKeys: project.gallery_image_keys.join(", "), description: project.description, concept: project.concept, materials: project.materials.join(", "), timeline: project.timeline, projectYear: project.project_year, testimonialText: project.testimonial_text, testimonialName: project.testimonial_name, testimonialRole: project.testimonial_role, published: project.published });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeProject(id: number) {
    if (!window.confirm("Delete this project?")) return;
    await api(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects((items) => items.filter((item) => item.id !== id));
  }

  async function updateInquiry(id: number, status: Inquiry["status"]) {
    const updated = await api<Inquiry>(`/api/admin/inquiries/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    setInquiries((items) => items.map((item) => item.id === id ? updated : item));
  }

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    await api("/api/admin/settings/general", { method: "PUT", body: JSON.stringify({ value: settings }) });
  }

  if (!admin) return <main className="min-h-screen bg-secondary flex items-center justify-center px-4"><form onSubmit={handleLogin} className="w-full max-w-md bg-background p-8 rounded-sm shadow-sm"><p className="label-text text-accent mb-3">StudioCraft</p><h1 className="heading-md mb-8">Admin sign in</h1>{error && <p className="text-sm text-red-600 mb-4">{error}</p>}<div className="space-y-4"><Input type="email" placeholder="Email address" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} /><Input type="password" placeholder="Password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /><Button type="submit" variant="hero" className="w-full">Sign in</Button></div></form></main>;

  return <main className="min-h-screen bg-secondary"><header className="bg-background border-b border-border"><div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between"><div><p className="label-text text-accent">StudioCraft</p><p className="text-sm text-muted-foreground mt-1">Content administration</p></div><Button variant="ghost" onClick={async () => { await api("/api/admin/logout", { method: "POST" }); setAdmin(null); }}><LogOut size={16} /> Sign out</Button></div></header><div className="max-w-7xl mx-auto px-6 py-10"><nav className="flex gap-2 mb-8 flex-wrap"><Button variant={active === "projects" ? "default" : "outline"} onClick={() => setActive("projects")}>Projects</Button><Button variant={active === "services" ? "default" : "outline"} onClick={() => setActive("services")}>Services</Button><Button variant={active === "testimonials" ? "default" : "outline"} onClick={() => setActive("testimonials")}>Testimonials</Button><Button variant={active === "stats" ? "default" : "outline"} onClick={() => setActive("stats")}>Homepage stats</Button><Button variant={active === "inquiries" ? "default" : "outline"} onClick={() => setActive("inquiries")}>Inquiries ({inquiries.filter((item) => item.status === "new").length})</Button><Button variant={active === "settings" ? "default" : "outline"} onClick={() => setActive("settings")}>Site settings</Button></nav>{error && <p className="text-sm text-red-600 mb-4">{error}</p>}
    {active === "projects" && <div className="grid lg:grid-cols-[380px_1fr] gap-8"><form onSubmit={saveProject} className="bg-background p-6 rounded-sm space-y-3"><div className="flex justify-between items-center mb-2"><h2 className="heading-sm">{editingId ? "Edit project" : "New project"}</h2>{editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(emptyProject); }}>Cancel</Button>}</div>{(["title","slug","location","size","imageKey","timeline","projectYear","testimonialName","testimonialRole"] as const).map((key) => <Input key={key} placeholder={key} required={!["imageKey","timeline","projectYear","testimonialName","testimonialRole"].includes(key)} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />)}<Input placeholder="galleryImageKeys (comma separated)" value={form.galleryImageKeys} onChange={(e) => setForm({ ...form, galleryImageKeys: e.target.value })} /><Input placeholder="materials (comma separated)" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} /><select className="w-full h-10 px-3 bg-secondary rounded-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Residential</option><option>Commercial</option><option>Interior</option></select><Textarea placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><Textarea placeholder="Project concept" value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} /><Textarea placeholder="Client testimonial" value={form.testimonialText} onChange={(e) => setForm({ ...form, testimonialText: e.target.value })} /><label className="flex gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label><Button type="submit" variant="hero" className="w-full"><Save size={15} /> Save project</Button></form><section><div className="flex justify-between items-center mb-4"><h2 className="heading-sm">All projects</h2><Button variant="outline" onClick={() => { setEditingId(null); setForm(emptyProject); }}><Plus size={15} /> New</Button></div><div className="space-y-3">{projects.map((project) => <div key={project.id} className="bg-background p-5 rounded-sm flex items-center justify-between gap-4"><div><h3 className="font-medium">{project.title}</h3><p className="text-sm text-muted-foreground">{project.category} · {project.location} · {project.published ? "Published" : "Draft"}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => editProject(project)}>Edit</Button><Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}><Trash2 size={15} /></Button></div></div>)}</div></section></div>}
    {active === "services" && <div className="grid lg:grid-cols-[380px_1fr] gap-8"><form onSubmit={saveService} className="bg-background p-6 rounded-sm space-y-3"><div className="flex justify-between items-center"><h2 className="heading-sm">{editingServiceId ? "Edit service" : "New service"}</h2>{editingServiceId && <Button type="button" variant="ghost" onClick={() => { setEditingServiceId(null); setServiceForm(emptyService); }}>Cancel</Button>}</div><Input placeholder="Service title" required value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} /><Textarea placeholder="Description" required value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} /><Input placeholder="Icon key: building, paintbrush, users, award" value={serviceForm.iconKey} onChange={(e) => setServiceForm({ ...serviceForm, iconKey: e.target.value })} /><Input type="number" placeholder="Sort order" value={serviceForm.sortOrder} onChange={(e) => setServiceForm({ ...serviceForm, sortOrder: Number(e.target.value) })} /><label className="flex gap-2 text-sm"><input type="checkbox" checked={serviceForm.published} onChange={(e) => setServiceForm({ ...serviceForm, published: e.target.checked })} /> Published</label><Button type="submit" variant="hero" className="w-full"><Save size={15} /> Save service</Button></form><section><div className="flex justify-between items-center mb-4"><h2 className="heading-sm">Services</h2><Button variant="outline" onClick={() => { setEditingServiceId(null); setServiceForm(emptyService); }}><Plus size={15} /> New</Button></div><div className="space-y-3">{services.map((item) => <div key={item.id} className="bg-background p-5 rounded-sm flex items-center justify-between gap-4"><div><h3 className="font-medium">{item.title}</h3><p className="text-sm text-muted-foreground">{item.description}</p><p className="text-xs text-muted-foreground mt-2">Order {item.sort_order} · {item.published ? "Published" : "Draft"}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => { setEditingServiceId(item.id); setServiceForm({ title: item.title, description: item.description, iconKey: item.icon_key, sortOrder: item.sort_order, published: item.published }); }}>Edit</Button><Button variant="ghost" size="sm" onClick={() => deleteContent("services", item.id)}><Trash2 size={15} /></Button></div></div>)}</div></section></div>}
    {active === "testimonials" && <div className="grid lg:grid-cols-[380px_1fr] gap-8"><form onSubmit={saveTestimonial} className="bg-background p-6 rounded-sm space-y-3"><div className="flex justify-between items-center"><h2 className="heading-sm">{editingTestimonialId ? "Edit testimonial" : "New testimonial"}</h2>{editingTestimonialId && <Button type="button" variant="ghost" onClick={() => { setEditingTestimonialId(null); setTestimonialForm(emptyTestimonial); }}>Cancel</Button>}</div><Input placeholder="Client name" required value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} /><Input placeholder="Role" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} /><Textarea placeholder="Quote" required value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} /><Input type="number" placeholder="Sort order" value={testimonialForm.sortOrder} onChange={(e) => setTestimonialForm({ ...testimonialForm, sortOrder: Number(e.target.value) })} /><label className="flex gap-2 text-sm"><input type="checkbox" checked={testimonialForm.published} onChange={(e) => setTestimonialForm({ ...testimonialForm, published: e.target.checked })} /> Published</label><Button type="submit" variant="hero" className="w-full"><Save size={15} /> Save testimonial</Button></form><section><div className="flex justify-between items-center mb-4"><h2 className="heading-sm">Testimonials</h2><Button variant="outline" onClick={() => { setEditingTestimonialId(null); setTestimonialForm(emptyTestimonial); }}><Plus size={15} /> New</Button></div><div className="space-y-3">{testimonials.map((item) => <div key={item.id} className="bg-background p-5 rounded-sm flex items-center justify-between gap-4"><div><h3 className="font-medium">{item.name}</h3><p className="text-sm text-muted-foreground">“{item.quote}”</p><p className="text-xs text-muted-foreground mt-2">{item.role} · {item.published ? "Published" : "Draft"}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => { setEditingTestimonialId(item.id); setTestimonialForm({ name: item.name, role: item.role, quote: item.quote, sortOrder: item.sort_order, published: item.published }); }}>Edit</Button><Button variant="ghost" size="sm" onClick={() => deleteContent("testimonials", item.id)}><Trash2 size={15} /></Button></div></div>)}</div></section></div>}
    {active === "stats" && <div className="grid lg:grid-cols-[380px_1fr] gap-8"><form onSubmit={saveStat} className="bg-background p-6 rounded-sm space-y-3"><div className="flex justify-between items-center"><h2 className="heading-sm">{editingStatId ? "Edit homepage stat" : "New homepage stat"}</h2>{editingStatId && <Button type="button" variant="ghost" onClick={() => { setEditingStatId(null); setStatForm(emptyStat); }}>Cancel</Button>}</div><Input placeholder="Key e.g. projects" required value={statForm.statKey} onChange={(e) => setStatForm({ ...statForm, statKey: e.target.value })} /><Input placeholder="Value e.g. 150+" required value={statForm.numberValue} onChange={(e) => setStatForm({ ...statForm, numberValue: e.target.value })} /><Input placeholder="Label e.g. Projects Completed" required value={statForm.label} onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} /><Input type="number" placeholder="Sort order" value={statForm.sortOrder} onChange={(e) => setStatForm({ ...statForm, sortOrder: Number(e.target.value) })} /><label className="flex gap-2 text-sm"><input type="checkbox" checked={statForm.published} onChange={(e) => setStatForm({ ...statForm, published: e.target.checked })} /> Published</label><Button type="submit" variant="hero" className="w-full"><Save size={15} /> Save stat</Button></form><section><div className="flex justify-between items-center mb-4"><h2 className="heading-sm">Homepage stats</h2><Button variant="outline" onClick={() => { setEditingStatId(null); setStatForm(emptyStat); }}><Plus size={15} /> New</Button></div><div className="space-y-3">{stats.map((item) => <div key={item.id} className="bg-background p-5 rounded-sm flex items-center justify-between gap-4"><div><h3 className="font-medium">{item.number_value} <span className="font-normal">{item.label}</span></h3><p className="text-xs text-muted-foreground mt-2">Key: {item.stat_key} · Order {item.sort_order} · {item.published ? "Published" : "Draft"}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => { setEditingStatId(item.id); setStatForm({ statKey: item.stat_key, numberValue: item.number_value, label: item.label, sortOrder: item.sort_order, published: item.published }); }}>Edit</Button><Button variant="ghost" size="sm" onClick={() => deleteContent("stats", item.id)}><Trash2 size={15} /></Button></div></div>)}</div></section></div>}
    {active === "inquiries" && <section className="space-y-4">{inquiries.map((item) => <article key={item.id} className="bg-background p-6 rounded-sm"><div className="flex flex-col md:flex-row md:items-start justify-between gap-4"><div><h2 className="font-medium">{item.name}</h2><p className="text-sm text-muted-foreground">{item.email} {item.phone && `· ${item.phone}`}</p><p className="text-sm mt-4 whitespace-pre-wrap">{item.message}</p></div><select className="h-10 px-3 bg-secondary rounded-sm" value={item.status} onChange={(e) => updateInquiry(item.id, e.target.value as Inquiry["status"])}><option value="new">New</option><option value="contacted">Contacted</option><option value="archived">Archived</option></select></div></article>)}</section>}
    {active === "settings" && <form onSubmit={saveSettings} className="bg-background p-6 rounded-sm max-w-2xl space-y-4"><h2 className="heading-sm">General site settings</h2>{(["studioName","email","phone","address"] as const).map((key) => <Input key={key} placeholder={key} value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />)}<Button type="submit" variant="hero"><Save size={15} /> Save settings</Button></form>}
  </div></main>;
}
