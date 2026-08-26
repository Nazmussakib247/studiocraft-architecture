import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

const Footer = () => {
  const [settings, setSettings] = useState({ studioName: "StudioCraft", email: "hello@studiocraft.com", phone: "+1 (212) 555-0147", address: "245 West 29th Street, New York, NY 10001" });
  useEffect(() => { api<Partial<typeof settings>>("/api/settings").then((value) => setSettings((current) => ({ ...current, ...value }))).catch(() => undefined); }, []);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-padding py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
              <h3 className="font-display text-3xl font-semibold mb-4">{settings.studioName}</h3>
            <p className="body-md text-primary-foreground/70 max-w-md">
              Creating spaces that inspire. Award-winning architecture and interior design studio based in New York.
            </p>
          </div>
          <div>
            <h4 className="label-text text-primary-foreground/50 mb-6">Navigation</h4>
            <div className="flex flex-col gap-3">
              {["Home", "About", "Services", "Portfolio", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="body-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="label-text text-primary-foreground/50 mb-6">Contact</h4>
            <div className="flex flex-col gap-3 body-sm text-primary-foreground/70">
              <p>{settings.address}</p>
              <p className="mt-2">{settings.email}</p>
              <p>{settings.phone}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="body-sm text-primary-foreground/40">
            © 2026 StudioCraft Architecture. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[{ label: "Portfolio", href: "https://nazmussakib.tech/" }, { label: "LinkedIn", href: "https://www.linkedin.com/in/nazmussakib247/" }].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="label-text text-primary-foreground/40 hover:text-primary-foreground transition-colors"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
