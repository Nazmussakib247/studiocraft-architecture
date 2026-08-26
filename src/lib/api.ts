export async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || "Something went wrong");
  return payload as T;
}

export type Project = {
  id: number;
  title: string;
  slug: string;
  category: string;
  location: string;
  size: string;
  image_key: string;
  gallery_image_keys: string[];
  description: string;
  concept: string;
  materials: string[];
  timeline: string;
  project_year: string;
  testimonial_text: string;
  testimonial_name: string;
  testimonial_role: string;
  published: boolean;
};

export type SiteSettings = {
  studioName: string;
  email: string;
  phone: string;
  address: string;
};

export type Service = {
  id: number;
  title: string;
  description: string;
  icon_key: string;
  sort_order: number;
  published: boolean;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
  sort_order: number;
  published: boolean;
};

export type HomepageStat = {
  id: number;
  stat_key: string;
  number_value: string;
  label: string;
  sort_order: number;
  published: boolean;
};

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  budget: string;
  message: string;
  status: "new" | "contacted" | "archived";
  created_at: string;
};
