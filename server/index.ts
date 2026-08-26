import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "./db";
import { createSession, destroySession, getAdmin, verifyPassword } from "./auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  getAdmin(req).then((admin) => {
    if (!admin) return res.status(401).json({ error: "Authentication required" });
    res.locals.admin = admin;
    next();
  }).catch(next);
}

app.get("/api/health", async (_req, res) => {
  try {
    await query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch {
    res.status(503).json({ ok: false, database: "unavailable" });
  }
});

app.get("/api/projects", async (req, res, next) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : null;
    const result = await query(
      `SELECT id, title, slug, category, location, size, image_key, gallery_image_keys,
              description, concept, materials, timeline, project_year, testimonial_text,
              testimonial_name, testimonial_role, published
       FROM projects WHERE published = TRUE AND ($1::text IS NULL OR category = $1)
       ORDER BY id`,
      [category],
    );
    res.json(result.rows);
  } catch (error) { next(error); }
});

app.get("/api/projects/:slug", async (req, res, next) => {
  try {
    const result = await query("SELECT * FROM projects WHERE slug = $1 AND published = TRUE", [req.params.slug]);
    const project = result.rows[0];
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) { next(error); }
});

app.get("/api/services", async (_req, res, next) => {
  try { const result = await query("SELECT * FROM services WHERE published = TRUE ORDER BY sort_order, id"); res.json(result.rows); } catch (error) { next(error); }
});

app.get("/api/testimonials", async (_req, res, next) => {
  try { const result = await query("SELECT * FROM testimonials WHERE published = TRUE ORDER BY sort_order, id"); res.json(result.rows); } catch (error) { next(error); }
});

app.get("/api/homepage-stats", async (_req, res, next) => {
  try { const result = await query("SELECT * FROM homepage_stats WHERE published = TRUE ORDER BY sort_order, id"); res.json(result.rows); } catch (error) { next(error); }
});

app.get("/api/settings", async (_req, res, next) => {
  try { const result = await query("SELECT value FROM site_settings WHERE key = 'general'"); res.json(result.rows[0]?.value || {}); } catch (error) { next(error); }
});

app.post("/api/inquiries", async (req, res, next) => {
  try {
    const { name, email, phone = "", projectType = "", budget = "", message } = req.body || {};
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.includes("@") || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Name, email, and project description are required." });
    }
    const result = await query(
      `INSERT INTO inquiries (name, email, phone, project_type, budget, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [name.trim(), email.trim().toLowerCase(), String(phone), String(projectType), String(budget), message.trim()],
    );
    res.status(201).json({ ok: true, inquiry: result.rows[0] });
  } catch (error) { next(error); }
});

app.post("/api/admin/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const result = await query<{ id: number; email: string; password_hash: string }>("SELECT id, email, password_hash FROM admins WHERE email = $1", [String(email || "").trim().toLowerCase()]);
    const admin = result.rows[0];
    if (!admin || !verifyPassword(String(password || ""), admin.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    await createSession(admin, res);
    res.json({ id: admin.id, email: admin.email });
  } catch (error) { next(error); }
});

app.post("/api/admin/logout", async (req, res, next) => {
  try { await destroySession(req, res); res.status(204).end(); } catch (error) { next(error); }
});

app.get("/api/admin/me", requireAdmin, (req, res) => res.json(res.locals.admin));

app.get("/api/admin/projects", requireAdmin, async (_req, res, next) => {
  try { const result = await query("SELECT * FROM projects ORDER BY id DESC"); res.json(result.rows); } catch (error) { next(error); }
});

app.post("/api/admin/projects", requireAdmin, async (req, res, next) => {
  try {
    const p = req.body || {};
    const result = await query(
      `INSERT INTO projects (title, slug, category, location, size, image_key, gallery_image_keys, description, concept, materials, timeline, project_year, testimonial_text, testimonial_name, testimonial_role, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [p.title, p.slug, p.category, p.location, p.size, p.imageKey, p.galleryImageKeys || [], p.description || "", p.concept || "", p.materials || [], p.timeline || "", p.projectYear || "", p.testimonialText || "", p.testimonialName || "", p.testimonialRole || "", p.published !== false],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { next(error); }
});

app.put("/api/admin/projects/:id", requireAdmin, async (req, res, next) => {
  try {
    const p = req.body || {};
    const result = await query(
      `UPDATE projects SET title=$1, slug=$2, category=$3, location=$4, size=$5, image_key=$6, gallery_image_keys=$7, description=$8, concept=$9, materials=$10, timeline=$11, project_year=$12, testimonial_text=$13, testimonial_name=$14, testimonial_role=$15, published=$16, updated_at=NOW() WHERE id=$17 RETURNING *`,
      [p.title, p.slug, p.category, p.location, p.size, p.imageKey, p.galleryImageKeys || [], p.description || "", p.concept || "", p.materials || [], p.timeline || "", p.projectYear || "", p.testimonialText || "", p.testimonialName || "", p.testimonialRole || "", p.published !== false, req.params.id],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });
    res.json(result.rows[0]);
  } catch (error) { next(error); }
});

app.delete("/api/admin/projects/:id", requireAdmin, async (req, res, next) => {
  try { await query("DELETE FROM projects WHERE id = $1", [req.params.id]); res.status(204).end(); } catch (error) { next(error); }
});

app.get("/api/admin/services", requireAdmin, async (_req, res, next) => {
  try { const result = await query("SELECT * FROM services ORDER BY sort_order, id"); res.json(result.rows); } catch (error) { next(error); }
});

app.post("/api/admin/services", requireAdmin, async (req, res, next) => {
  try { const { title, description, iconKey = "building", sortOrder = 0, published = true } = req.body || {}; const result = await query("INSERT INTO services (title, description, icon_key, sort_order, published) VALUES ($1,$2,$3,$4,$5) RETURNING *", [title, description, iconKey, sortOrder, published]); res.status(201).json(result.rows[0]); } catch (error) { next(error); }
});

app.put("/api/admin/services/:id", requireAdmin, async (req, res, next) => {
  try { const { title, description, iconKey = "building", sortOrder = 0, published = true } = req.body || {}; const result = await query("UPDATE services SET title=$1, description=$2, icon_key=$3, sort_order=$4, published=$5, updated_at=NOW() WHERE id=$6 RETURNING *", [title, description, iconKey, sortOrder, published, req.params.id]); if (!result.rows[0]) return res.status(404).json({ error: "Service not found" }); res.json(result.rows[0]); } catch (error) { next(error); }
});

app.delete("/api/admin/services/:id", requireAdmin, async (req, res, next) => {
  try { await query("DELETE FROM services WHERE id=$1", [req.params.id]); res.status(204).end(); } catch (error) { next(error); }
});

app.get("/api/admin/testimonials", requireAdmin, async (_req, res, next) => {
  try { const result = await query("SELECT * FROM testimonials ORDER BY sort_order, id"); res.json(result.rows); } catch (error) { next(error); }
});

app.post("/api/admin/testimonials", requireAdmin, async (req, res, next) => {
  try { const { name, role = "", quote, sortOrder = 0, published = true } = req.body || {}; const result = await query("INSERT INTO testimonials (name, role, quote, sort_order, published) VALUES ($1,$2,$3,$4,$5) RETURNING *", [name, role, quote, sortOrder, published]); res.status(201).json(result.rows[0]); } catch (error) { next(error); }
});

app.put("/api/admin/testimonials/:id", requireAdmin, async (req, res, next) => {
  try { const { name, role = "", quote, sortOrder = 0, published = true } = req.body || {}; const result = await query("UPDATE testimonials SET name=$1, role=$2, quote=$3, sort_order=$4, published=$5, updated_at=NOW() WHERE id=$6 RETURNING *", [name, role, quote, sortOrder, published, req.params.id]); if (!result.rows[0]) return res.status(404).json({ error: "Testimonial not found" }); res.json(result.rows[0]); } catch (error) { next(error); }
});

app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res, next) => {
  try { await query("DELETE FROM testimonials WHERE id=$1", [req.params.id]); res.status(204).end(); } catch (error) { next(error); }
});

app.get("/api/admin/stats", requireAdmin, async (_req, res, next) => {
  try { const result = await query("SELECT * FROM homepage_stats ORDER BY sort_order, id"); res.json(result.rows); } catch (error) { next(error); }
});

app.post("/api/admin/stats", requireAdmin, async (req, res, next) => {
  try { const { statKey, numberValue, label, sortOrder = 0, published = true } = req.body || {}; const result = await query("INSERT INTO homepage_stats (stat_key, number_value, label, sort_order, published) VALUES ($1,$2,$3,$4,$5) RETURNING *", [statKey, numberValue, label, sortOrder, published]); res.status(201).json(result.rows[0]); } catch (error) { next(error); }
});

app.put("/api/admin/stats/:id", requireAdmin, async (req, res, next) => {
  try { const { statKey, numberValue, label, sortOrder = 0, published = true } = req.body || {}; const result = await query("UPDATE homepage_stats SET stat_key=$1, number_value=$2, label=$3, sort_order=$4, published=$5, updated_at=NOW() WHERE id=$6 RETURNING *", [statKey, numberValue, label, sortOrder, published, req.params.id]); if (!result.rows[0]) return res.status(404).json({ error: "Stat not found" }); res.json(result.rows[0]); } catch (error) { next(error); }
});

app.delete("/api/admin/stats/:id", requireAdmin, async (req, res, next) => {
  try { await query("DELETE FROM homepage_stats WHERE id=$1", [req.params.id]); res.status(204).end(); }
  catch (error) { next(error); }
});

app.get("/api/admin/inquiries", requireAdmin, async (_req, res, next) => {
  try { const result = await query("SELECT * FROM inquiries ORDER BY created_at DESC"); res.json(result.rows); } catch (error) { next(error); }
});

app.patch("/api/admin/inquiries/:id", requireAdmin, async (req, res, next) => {
  try { const result = await query("UPDATE inquiries SET status=$1 WHERE id=$2 RETURNING *", [req.body.status, req.params.id]); res.json(result.rows[0]); } catch (error) { next(error); }
});

app.get("/api/admin/settings", requireAdmin, async (_req, res, next) => {
  try { const result = await query("SELECT key, value FROM site_settings ORDER BY key"); res.json(result.rows); } catch (error) { next(error); }
});

app.put("/api/admin/settings/:key", requireAdmin, async (req, res, next) => {
  try {
    const result = await query(`INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW() RETURNING *`, [req.params.key, req.body.value ?? {}]);
    res.json(result.rows[0]);
  } catch (error) { next(error); }
});

app.use(express.static(path.resolve(__dirname, "../dist")));
app.use((_req, res) => res.sendFile(path.resolve(__dirname, "../dist/index.html")));

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => console.log(`StudioCraft server listening on port ${port}`));
