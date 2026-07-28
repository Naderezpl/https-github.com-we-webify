import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";

export type SocialLink = {
  id: string;
  platform: "instagram" | "facebook" | "twitter" | "tiktok" | "linkedin" | "youtube" | "whatsapp";
  href: string;
};

export type SampleSiteCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  siteUrl: string;
  showViewButton: boolean;
  viewButtonLabel: string;
};

export type TermsContent = {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  intro: string;
  body: string;
};

export type SiteContent = {
  about: {
    eyebrow: string;
    titleHighlight: string;
    description: string;
    bullets: string[];
  };
  contact: {
    eyebrow: string;
    introTitle: string;
    intro: string;
    phoneLabel: string;
    phone: string;
    emailLabel: string;
    email: string;
    locationLabel: string;
    location: string;
    followTitle: string;
    socials: SocialLink[];
    formTitle: string;
    whatsappNumber: string;
    projectOptions: string[];
  };
  sampleProjects: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    cards: SampleSiteCard[];
  };
  terms: TermsContent;
};

const uid = () =>
  (crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2) + Date.now().toString(36));

const sampleImage = (seed: string) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    `Modern dark-themed professional website mockup, neon cyan purple accents, glassmorphism ui, ${seed}`
  )}&image_size=landscape_16_9`;

export const TERMS_TEMPLATE_BODY = `1. Services
Webify (hereafter "we", "us", "our") designs, builds, and delivers custom websites, landing pages, e-commerce stores, and related digital services on a project-by-project basis. By requesting a quote, signing a proposal, or otherwise engaging us to deliver services, you ("the Client") agree to these terms.

2. Project Scope
Any changes, additions, or work outside the written scope of the agreed proposal will be quoted separately and billed as additional work. We reserve the right to pause delivery until scope changes are agreed in writing.

3. Payment
- A 50% deposit is required to schedule work.
- Remaining balance is due on project delivery (or on the milestone schedule agreed in writing).
- Website files, source code, and domain access will be transferred in full only after all outstanding invoices are paid.

4. Revisions & Approvals
Each tier includes the number of revisions listed in the proposal. Additional revisions are billed hourly. Delays in Client feedback may shift delivery timelines.

5. Third-Party Costs
Domain names, hosting, SSL certificates, SaaS subscriptions, premium fonts, icons, stock media, and any third-party licenses are the Client's responsibility unless explicitly listed as included in the proposal. We may pass these through at cost.

6. Intellectual Property
Upon final payment, the Client receives full ownership of the final deliverables created specifically for them (design files, custom code, content we produced). We retain the right to showcase finished work in our portfolio and case studies unless otherwise agreed in writing.

7. Warranties & Liability
We warrant that delivered work will materially conform to the agreed specification for a period of 30 days from delivery. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages, or loss of profits, revenue, or data arising from the services or their use. Our total aggregate liability under any agreement shall not exceed the total fees paid by the Client for the relevant project.

8. Maintenance & Support
Any post-launch support or maintenance is covered only if explicitly purchased. "Lifetime one-time pay" refers to the design and build fee for the delivered website; hosting, domain renewals, and ongoing maintenance fees are separate and remain the Client's responsibility.

9. Termination
Either party may terminate a project in writing. If the Client terminates before completion, we will invoice for work already performed plus non-refundable third-party costs; the Client will receive deliverables created up to that point only after payment.

10. Governing Law
These terms are governed by the laws of the Republic of Lebanon. Any disputes will be resolved in the competent courts of Beirut.

For questions about these terms, reach out to us via the Contact page.`;

const defaults: SiteContent = {
  about: {
    eyebrow: "About webify",
    titleHighlight: "innovation meets web design",
    description:
      "Our mission is to help businesses stand out online with beautiful, user friendly websites With Lifetime One Time Pay",
    bullets: [
      "Lifetime one-time payment — minimal maintenance fees, database, website Domain",
      "Handcrafted UI with neon / glassmorphism aesthetics",
      "Support from the same team that designs your site",
    ],
  },
  contact: {
    eyebrow: "Get in touch",
    introTitle: "Contact Information",
    intro:
      "Ready to start planning? Reach out to us for a custom quote or to discuss your website requirements.",
    phoneLabel: "Phone",
    phone: "+961 81 193 419",
    emailLabel: "Email",
    email: "info@webify.com",
    locationLabel: "Location",
    location: "Lebanon, Beirut, Jiyeh",
    followTitle: "Follow Us",
    socials: [
      { id: uid(), platform: "instagram", href: "#" },
      { id: uid(), platform: "facebook", href: "#" },
    ],
    formTitle: "Send a Message",
    whatsappNumber: "96181193419",
    projectOptions: [
      "Landing Page",
      "Business Website",
      "E-commerce",
      "Portfolio",
      "Dashboard / SaaS",
      "Other",
    ],
  },
  sampleProjects: {
    eyebrow: "Portfolio",
    title: "Sites we've",
    titleHighlight: "shipped for clients",
    subtitle:
      "A selection of websites we've built. Click on any card to view the live site.",
    cards: [
      {
        id: uid(),
        title: "Luxe Atelier Boutique",
        description:
          "Minimal e-commerce for a luxury fashion boutique — Stripe checkout, sizing, and lookbook.",
        imageUrl: sampleImage("e commerce fashion boutique hero"),
        siteUrl: "https://example.com/",
        showViewButton: true,
        viewButtonLabel: "Click to view site",
      },
      {
        id: uid(),
        title: "Orbit SaaS Dashboard",
        description:
          "Marketing website + gated dashboard experience for an analytics SaaS startup.",
        imageUrl: sampleImage("saas marketing website dashboard ui"),
        siteUrl: "https://example.com/",
        showViewButton: true,
        viewButtonLabel: "Click to view site",
      },
      {
        id: uid(),
        title: "Northstar Architecture",
        description:
          "Portfolio site for an architecture studio with cinematic project galleries.",
        imageUrl: sampleImage("architecture portfolio website"),
        siteUrl: "https://example.com/",
        showViewButton: true,
        viewButtonLabel: "Click to view site",
      },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of",
    titleHighlight: "Service",
    intro:
      "Last updated — July 2026. These Terms of Service govern your use of the webify website and any services we provide.",
    body: TERMS_TEMPLATE_BODY,
  },
};

type State = {
  content: SiteContent;
  setAbout: (patch: Partial<SiteContent["about"]>) => void;
  setAboutBullet: (i: number, value: string) => void;
  addAboutBullet: () => void;
  removeAboutBullet: (i: number) => void;
  setContact: (patch: Partial<SiteContent["contact"]>) => void;
  setSocial: (id: string, patch: Partial<SocialLink>) => void;
  addSocial: () => void;
  removeSocial: (id: string) => void;
  setProjectOption: (i: number, value: string) => void;
  addProjectOption: () => void;
  removeProjectOption: (i: number) => void;
  setSampleProjects: (patch: Partial<Omit<SiteContent["sampleProjects"], "cards">>) => void;
  setSampleCard: (id: string, patch: Partial<SampleSiteCard>) => void;
  addSampleCard: () => void;
  removeSampleCard: (id: string) => void;
  setTerms: (patch: Partial<TermsContent>) => void;
  resetDefaults: () => void;
  syncToDatabase: () => Promise<boolean>;
  syncFromDatabase: () => Promise<boolean>;
};

function isPartialSiteContent(obj: unknown): obj is Partial<SiteContent> {
  return typeof obj === "object" && obj !== null;
}

export const useSiteContentStore = create<State>()(
  persist(
    (set, get) => ({
      content: defaults,
      setAbout: (patch) =>
        set((s) => ({
          content: { ...s.content, about: { ...s.content.about, ...patch } },
        })),
      setAboutBullet: (i, value) =>
        set((s) => {
          const next = [...s.content.about.bullets];
          next[i] = value;
          return {
            content: {
              ...s.content,
              about: { ...s.content.about, bullets: next },
            },
          };
        }),
      addAboutBullet: () =>
        set((s) => ({
          content: {
            ...s.content,
            about: {
              ...s.content.about,
              bullets: [...s.content.about.bullets, "New point"],
            },
          },
        })),
      removeAboutBullet: (i) =>
        set((s) => ({
          content: {
            ...s.content,
            about: {
              ...s.content.about,
              bullets: s.content.about.bullets.filter((_, idx) => idx !== i),
            },
          },
        })),
      setContact: (patch) =>
        set((s) => ({
          content: {
            ...s.content,
            contact: { ...s.content.contact, ...patch },
          },
        })),
      setSocial: (id, patch) =>
        set((s) => ({
          content: {
            ...s.content,
            contact: {
              ...s.content.contact,
              socials: s.content.contact.socials.map((x) =>
                x.id === id ? { ...x, ...patch } : x
              ),
            },
          },
        })),
      addSocial: () =>
        set((s) => ({
          content: {
            ...s.content,
            contact: {
              ...s.content.contact,
              socials: [
                ...s.content.contact.socials,
                { id: uid(), platform: "instagram", href: "#" },
              ],
            },
          },
        })),
      removeSocial: (id) =>
        set((s) => ({
          content: {
            ...s.content,
            contact: {
              ...s.content.contact,
              socials: s.content.contact.socials.filter((x) => x.id !== id),
            },
          },
        })),
      setProjectOption: (i, value) =>
        set((s) => {
          const next = [...s.content.contact.projectOptions];
          next[i] = value;
          return {
            content: {
              ...s.content,
              contact: { ...s.content.contact, projectOptions: next },
            },
          };
        }),
      addProjectOption: () =>
        set((s) => ({
          content: {
            ...s.content,
            contact: {
              ...s.content.contact,
              projectOptions: [...s.content.contact.projectOptions, "New option"],
            },
          },
        })),
      removeProjectOption: (i) =>
        set((s) => ({
          content: {
            ...s.content,
            contact: {
              ...s.content.contact,
              projectOptions: s.content.contact.projectOptions.filter(
                (_, idx) => idx !== i
              ),
            },
          },
        })),
      setSampleProjects: (patch) =>
        set((s) => ({
          content: {
            ...s.content,
            sampleProjects: { ...s.content.sampleProjects, ...patch },
          },
        })),
      setSampleCard: (id, patch) =>
        set((s) => ({
          content: {
            ...s.content,
            sampleProjects: {
              ...s.content.sampleProjects,
              cards: s.content.sampleProjects.cards.map((c) =>
                c.id === id ? { ...c, ...patch } : c
              ),
            },
          },
        })),
      addSampleCard: () =>
        set((s) => {
          const n = s.content.sampleProjects.cards.length + 1;
          return {
            content: {
              ...s.content,
              sampleProjects: {
                ...s.content.sampleProjects,
                cards: [
                  ...s.content.sampleProjects.cards,
                  {
                    id: uid(),
                    title: `Sample Project ${n}`,
                    description:
                      "Describe what this website is for, who the client is, and what was delivered.",
                    imageUrl: sampleImage(`sample project ${n}`),
                    siteUrl: "https://example.com/",
                    showViewButton: true,
                    viewButtonLabel: "Click to view site",
                  },
                ],
              },
            },
          };
        }),
      removeSampleCard: (id) =>
        set((s) => ({
          content: {
            ...s.content,
            sampleProjects: {
              ...s.content.sampleProjects,
              cards: s.content.sampleProjects.cards.filter((c) => c.id !== id),
            },
          },
        })),
      setTerms: (patch) =>
        set((s) => ({
          content: { ...s.content, terms: { ...s.content.terms, ...patch } },
        })),
      resetDefaults: () => set({ content: defaults }),
      syncToDatabase: async () => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          if (!supabaseUrl) return false;
          const supabase = createClient();
          const content = get().content;
          const { error } = await supabase
            .from("site_settings")
            .upsert(
              { id: "main", content: content, updated_at: new Date().toISOString() },
              { onConflict: "id" }
            );
          if (error) {
            console.error("SiteContent syncToDatabase error:", error);
            return false;
          }
          return true;
        } catch (err) {
          console.error("SiteContent syncToDatabase failed:", err);
          return false;
        }
      },
      syncFromDatabase: async () => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          if (!supabaseUrl) return false;
          const supabase = createClient();
          const { data, error } = await supabase
            .from("site_settings")
            .select("content")
            .eq("id", "main")
            .maybeSingle();
          if (error) {
            console.error("SiteContent syncFromDatabase error:", error);
            return false;
          }
          if (!data || !data.content || !isPartialSiteContent(data.content)) {
            return false;
          }
          const dbContent = data.content as Partial<SiteContent>;
          const merged: SiteContent = {
            about: { ...defaults.about, ...(dbContent.about ?? {}) },
            contact: { ...defaults.contact, ...(dbContent.contact ?? {}) },
            sampleProjects: { ...defaults.sampleProjects, ...(dbContent.sampleProjects ?? {}) },
            terms: { ...defaults.terms, ...(dbContent.terms ?? {}) },
          };
          set({ content: merged });
          return true;
        } catch (err) {
          console.error("SiteContent syncFromDatabase failed:", err);
          return false;
        }
      },
    }),
    {
      name: "webify.sitecontent.v5",
      version: 5,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 4) {
          return { content: defaults };
        }
        if (version < 5) {
          const state = persistedState as {
            content?: Partial<SiteContent> & {
              sampleSites?: SiteContent["sampleProjects"];
            };
          };
          const content = state.content ?? {};
          return {
            content: {
              ...defaults,
              ...content,
              sampleProjects:
                content.sampleProjects ??
                content.sampleSites ??
                defaults.sampleProjects,
              terms: content.terms ?? defaults.terms,
            },
          };
        }
        return persistedState as State;
      },
    }
  )
);
