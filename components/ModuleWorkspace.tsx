"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { GALLERY_PHOTOS, MODULE_PHOTOS } from "@/lib/cats";
import { useLanguage } from "@/lib/i18n";
import type { ModuleKey } from "@/lib/modules";
import type { Slide } from "./Carousel";
import ModulePanel from "./ModulePanel";

export default function ModuleWorkspace({ moduleKey }: { moduleKey: ModuleKey }) {
  const { t } = useLanguage();
  if (moduleKey === "gallery") {
    // Same layout as every other module: the photos are just the carousel's slides.
    const slides: Slide[] = GALLERY_PHOTOS.map((photo) => ({ src: photo.src, caption: t.gallery.captions[photo.captionIndex] }));
    return <ModulePanel label={t.gallery.title} body={t.gallery.description} slides={slides} />;
  }
  if (moduleKey === "contact") {
    const contact = t.sections.contact;
    return (
      <div>
        <ul className="grid content-start gap-3">
          <li>
            <a href={`mailto:${contact.email}`} className="m3-interactive cookie-button-high flex min-h-20 items-center gap-3 break-all rounded-m3-lg px-5 py-4">
              <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              {contact.email}
            </a>
          </li>
          <li>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="m3-interactive cookie-button-high flex min-h-20 items-center gap-3 rounded-m3-lg px-5 py-4">
              <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              {contact.phone}
            </a>
          </li>
          <li>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.city)}`} target="_blank" rel="noopener noreferrer" className="m3-interactive cookie-button-high flex min-h-20 items-center gap-3 rounded-m3-lg px-5 py-4">
              <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span>{contact.city}<span className="ml-3 text-sm text-on-surface-variant">{contact.map}</span></span>
            </a>
          </li>
        </ul>
        <p className="mt-4 flex flex-col items-center gap-0.5 text-center text-xs text-on-surface-variant">
          <span className="mb-1 font-medium text-on-surface">{contact.demoNote}</span>
          <span>{t.footer.credit}</span>
          <span>{contact.aiNote}</span>
        </p>
      </div>
    );
  }
  const content = t.modules[moduleKey];
  const photos = MODULE_PHOTOS[moduleKey];
  // The highlight cards lead, followed by the regular slides — all in one carousel.
  const slides: Slide[] = [
    ...content.cards.map((card, i) => ({ caption: card.title, detail: card.desc, src: photos.cards[i] })),
    ...content.slides.map((caption, i) => ({ caption, src: photos.slides[i % photos.slides.length] })),
  ];
  return <ModulePanel label={content.title} body={content.body} slides={slides} />;
}
