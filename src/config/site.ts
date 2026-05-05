export type SiteSocialIcon = "github" | "linkedin" | "website" | "mail" | "rss" | "youtube";

type SiteSocialLink = {
  href: string;
  label: string;
  icon: SiteSocialIcon;
};

export const siteRoutes = {
  home: "/",
  members: "/members",
  categories: "/categories",
  tags: "/tags",
  archives: "/archives",
  about: "/about",
} as const;

export const siteConfig = {
  name: "CLUB 360 PRO",
  title: "CLUB 360 PRO",
  avatar: "/images/AVATAR.png",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://club360.kozenetpro.com",
  repositoryUrl: "https://github.com/kozenetpro/club360-pro",
  socialLinks: [
    { href: "https://github.com/kozenetpro/club360-pro", label: "GitHub", icon: "github" },
    { href: "https://club360.kozenetpro.com", label: "Website", icon: "website" },
    { href: "/feed.xml", label: "RSS", icon: "rss" },
    { href: "https://youtube.com/club360pro", label: "YouTube", icon: "youtube" },
  ] satisfies SiteSocialLink[],
  focusAreas: [
    "Cloud Computing",
    "Mathematics",
    "Cybersecurity",
    "Software development",
    "Learning in public",
    "Programming",
    "Algorithm",
    "Networking",
    "Machine Learning",
    "Artificial Intelligence",
    "Internet of Things",
    "Blockchain",
    "Big Data",
    "DevOps",
    "Agile",
    "Scrum",
    "Lean",
    "Kanban",
    "ITIL",
    "COBIT",
  ],
} as const;
