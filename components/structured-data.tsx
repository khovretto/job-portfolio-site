export function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://khovrov.dev";

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Maksim Khovrov",
    url: siteUrl,
    jobTitle: "AI Automation Engineer",
    description:
      "AI Automation Engineer building production voice agents, RAG systems, and automation workflows.",
    email: "mailto:mkhovrov01@gmail.com",
    sameAs: [
      "https://github.com/mkhovrov01",
      "https://www.linkedin.com/in/maksim-khovrov-113633293",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Novi Sad",
      addressCountry: "RS",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "MIREA — Russian Technological University",
    },
    knowsAbout: [
      "AI Automation",
      "Voice Agents",
      "RAG Systems",
      "LLM Agents",
      "n8n",
      "LangChain",
      "OpenAI API",
      "Qdrant",
      "Zep",
      "TypeScript",
      "Python",
      "Docker",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
