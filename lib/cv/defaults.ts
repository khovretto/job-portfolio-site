import type { Locale } from "@/lib/i18n/config";
import type { CvContent } from "@/lib/cv/schema";

// This repository is public, so the phone number is added in the editor, not here.
const contacts: CvContent["contacts"] = [
  { label: "mkhovrov01@gmail.com", url: "mailto:mkhovrov01@gmail.com" },
  { label: "t.me/khovre", url: "https://t.me/khovre" },
  { label: "linkedin.com/in/maksim-khovrov-113633293", url: "https://www.linkedin.com/in/maksim-khovrov-113633293/" },
  { label: "github.com/mkhovrov01", url: "https://github.com/mkhovrov01" },
  { label: "khovrov.dev", url: "https://khovrov.dev" },
];

// The starting point of the editor until a language is first saved.
const defaults: Record<Locale, CvContent> = {
  en: {
    name: "Maksim Khovrov",
    headline: "AI / LLM Engineer",
    location: "Novi Sad, Serbia  ·  Remote / Hybrid / Open to Relocation",
    contacts,
    summary:
      "AI engineer with 4.5 years in development and automation, the last 2+ focused on production LLM systems: RAG pipelines, conversational AI agents, and self-hosted AI infrastructure. Shipped 30+ voice AI solutions to production and built a governed retrieval system that now runs five self-hosted personal projects end to end.\nSeeking AI Engineer / LLM Engineer roles: designing, deploying, and scaling production AI products, with a focus on agentic workflows, retrieval systems, and AI infrastructure.",
    experience: [
      {
        role: "Product Manager / Automation Engineer",
        company: "MCN Telecom — Moscow / Remote",
        url: "https://mcn.ru/",
        period: "Mar 2023 – Nov 2025",
        responsibilities: [
          "Managed the full implementation cycle of the internal voice AI assistant with RAG: requirements, system design, launch, support.",
          "Designed integration architectures with Bitrix24, amoCRM, 1C, and IP telephony.",
          "Built business logic in n8n with custom JavaScript and Python functions.",
          "Built RAG pipelines: dataset preparation, vector store configuration, retriever tuning.",
          "Wrote system prompts and scenarios to improve LLM response accuracy.",
          "Gathered requirements, decomposed tasks, prepared final documentation (Swagger API).",
          "Managed a team of 10: onboarding, mentoring, code review, internal knowledge base.",
        ],
        achievements: [
          "Launched 30+ voice AI solutions into production across medical, retail, recruitment, financial, and municipal-infrastructure clients.",
          "Designed and shipped 3 RAG pipelines (Qdrant, Zep) for client knowledge bases, raising response accuracy from 70% to 98%.",
          "Migrated the voice pipeline from a step-based to a real-time streaming architecture.",
          "Led 15+ technical audits and supported commercial proposals that closed $400K+ in deals.",
          "Scaled the automation team from 3 to 10+ people.",
          "Built alerting and error handling for high-uptime external API integrations.",
        ],
      },
      {
        role: "QA Engineer",
        company: "MCN Telecom — Moscow / Remote",
        url: "https://mcn.ru/",
        period: "Jul 2021 – Mar 2023",
        responsibilities: [
          "Conducted manual testing, developed technical documentation and system guides.",
          "Built and maintained internal automation workflows, shifting from manual QA to backend automation engineering.",
        ],
        achievements: [
          "Took ownership of the department's technical stack when the team was reduced to 3 members; became the primary developer for automated solutions.",
          "Promoted to Product Manager / Automation Engineer.",
        ],
      },
    ],
    projectsNote: "Self-hosted and self-built. Portfolio and live demos: khovrov.dev",
    projects: [
      {
        name: "Cogan",
        url: "",
        period: "",
        description:
          "System for preparing and checking complex document packages, from normative requirements to finished PDF and DOCX; runs in production for a client. Includes a product agent with its own evaluation harness and sandbox; OCR/PDF reconstruction runs on a separate untrusted-compute worker. FastAPI, React, TypeScript, SQLite, LangGraph, Docling, Typst. Live demo: editor.khovrov.dev.",
        bullets: [],
      },
      {
        name: "Mnemosyne",
        url: "",
        period: "",
        description:
          "Access-controlled knowledge retrieval broker: every AI query is scoped and re-validated against a canonical registry before it's served, so the access boundary is structural, not a prompt instruction. Python, PostgreSQL, Qdrant, FastAPI, MCP.",
        bullets: [],
      },
      {
        name: "Personal AI Assistant",
        url: "",
        period: "",
        description:
          "Self-hosted chat assistant (Open WebUI) grounded through Mnemosyne, answering with citations instead of improvising. FastAPI, Qdrant, OpenRouter.",
        bullets: [],
      },
      {
        name: "KB Auditor and RAG Builder",
        url: "",
        period: "",
        description:
          "Agent-orchestrated pipeline that crawls a public knowledge base, audits it, builds a RAG index, and evaluates retrieval quality end to end; n8n runs the agentic stages. Next.js, PostgreSQL, Prisma, n8n.",
        bullets: [],
      },
      {
        name: "PhonoForge",
        url: "",
        period: "",
        description:
          "Speech-ML project that designs a constructed-language vocabulary and its recognizer together, screening for phonetic distinctiveness before any audio is recorded; benchmarked against three baselines. Python, PanPhon, WavLM.",
        bullets: [],
      },
    ],
    skills: [
      { group: "Languages", items: "Python, JavaScript, TypeScript, SQL" },
      { group: "AI & Retrieval", items: "RAG, LangChain, OpenAI API, Qdrant, Zep, Prompt Engineering, MCP" },
      { group: "Backend & Infra", items: "FastAPI, Next.js, PostgreSQL, Docker, Caddy, Linux, Git" },
      { group: "Automation & CRM", items: "n8n, REST APIs, Webhooks, Bitrix24, amoCRM, 1C, Swagger" },
    ],
    education: [
      {
        institution: "MIREA — Russian Technological University, Moscow",
        degree: "Software Engineering (incomplete, 2023)",
        period: "",
      },
    ],
    languages: [
      { name: "Russian", level: "Native" },
      { name: "English", level: "C1, cert.efset.org/en/7MbYem" },
    ],
  },
  ru: {
    name: "Максим Ховров",
    headline: "AI / LLM-инженер",
    location: "Нови-Сад, Сербия  ·  Удалённо / гибрид / готов к релокации",
    contacts,
    summary:
      "AI-инженер: 4,5 года в разработке и автоматизации, из них последние 2+ года — продакшн-системы на LLM: RAG-пайплайны, диалоговые AI-агенты и self-hosted AI-инфраструктура. Запустил в продакшн 30+ голосовых AI-решений и построил систему управляемого поиска, на которой работают пять self-hosted личных проектов.\nИщу роли AI Engineer / LLM Engineer: проектирование, запуск и масштабирование AI-продуктов в продакшене, с упором на агентные процессы, поисковые системы и AI-инфраструктуру.",
    experience: [
      {
        role: "Продакт-менеджер / инженер по автоматизации",
        company: "MCN Telecom — Москва / удалённо",
        url: "https://mcn.ru/",
        period: "март 2023 – ноябрь 2025",
        responsibilities: [
          "Вёл полный цикл внедрения внутреннего голосового AI-ассистента с RAG: требования, проектирование, запуск, поддержка.",
          "Проектировал архитектуру интеграций с Bitrix24, amoCRM, 1С и IP-телефонией.",
          "Писал бизнес-логику в n8n с функциями на JavaScript и Python.",
          "Создавал RAG-пайплайны: подготовка данных, настройка векторного хранилища, тюнинг ретривера.",
          "Писал системные промпты и сценарии для повышения точности ответов LLM.",
          "Собирал требования, декомпозировал задачи, готовил итоговую документацию (Swagger API).",
          "Управлял командой из 10 человек: онбординг, менторство, код-ревью, внутренняя база знаний.",
        ],
        achievements: [
          "Запустил в продакшн 30+ голосовых AI-решений для клиентов из медицины, ритейла, рекрутинга, финансов и муниципальной инфраструктуры.",
          "Спроектировал и запустил 3 RAG-пайплайна (Qdrant, Zep) для клиентских баз знаний, повысив точность ответов с 70% до 98%.",
          "Перевёл голосовой пайплайн с пошаговой архитектуры на потоковую в реальном времени.",
          "Провёл 15+ технических аудитов и поддержал коммерческие предложения, закрывшие сделки на $400K+.",
          "Масштабировал команду автоматизации с 3 до 10+ человек.",
          "Построил алертинг и обработку ошибок для высокодоступных интеграций с внешними API.",
        ],
      },
      {
        role: "QA-инженер",
        company: "MCN Telecom — Москва / удалённо",
        url: "https://mcn.ru/",
        period: "июль 2021 – март 2023",
        responsibilities: [
          "Проводил ручное тестирование, писал техническую документацию и руководства по системам.",
          "Создавал и поддерживал внутренние процессы автоматизации, перейдя от ручного QA к бэкенд-автоматизации.",
        ],
        achievements: [
          "Принял ответственность за технический стек отдела при сокращении команды до 3 человек; стал основным разработчиком автоматизированных решений.",
          "Повышен до продакт-менеджера / инженера по автоматизации.",
        ],
      },
    ],
    projectsNote: "Сам разрабатываю и размещаю. Портфолио и живые демо: khovrov.dev",
    projects: [
      {
        name: "Cogan",
        url: "",
        period: "",
        description:
          "Система подготовки и проверки сложных комплектов документов: от нормативных требований до готовых PDF и DOCX; работает в продакшене у клиента. Включает агента продукта со своим харнессом оценки и песочницей; OCR и реконструкция PDF вынесены на отдельный изолированный воркер. FastAPI, React, TypeScript, SQLite, LangGraph, Docling, Typst. Живое демо: editor.khovrov.dev.",
        bullets: [],
      },
      {
        name: "Mnemosyne",
        url: "",
        period: "",
        description:
          "Брокер поиска по знаниям с контролем доступа: каждый запрос ИИ ограничивается и перепроверяется по каноническому реестру, поэтому граница доступа задана структурой, а не инструкцией в промпте. Python, PostgreSQL, Qdrant, FastAPI, MCP.",
        bullets: [],
      },
      {
        name: "Личный AI-ассистент",
        url: "",
        period: "",
        description:
          "Self-hosted чат-ассистент (Open WebUI) с опорой на Mnemosyne: отвечает с цитатами, а не додумывает. FastAPI, Qdrant, OpenRouter.",
        bullets: [],
      },
      {
        name: "KB Auditor и RAG Builder",
        url: "",
        period: "",
        description:
          "Пайплайн с агентами: обходит публичную базу знаний, проводит аудит, строит RAG-индекс и оценивает качество поиска; агентные этапы выполняет n8n. Next.js, PostgreSQL, Prisma, n8n.",
        bullets: [],
      },
      {
        name: "PhonoForge",
        url: "",
        period: "",
        description:
          "Speech-ML-проект: словарь искусственного языка и его распознаватель проектируются вместе, фонетическая различимость проверяется до записи аудио; сравнение с тремя базовыми подходами. Python, PanPhon, WavLM.",
        bullets: [],
      },
    ],
    skills: [
      { group: "Языки", items: "Python, JavaScript, TypeScript, SQL" },
      { group: "AI и поиск", items: "RAG, LangChain, OpenAI API, Qdrant, Zep, промпт-инжиниринг, MCP" },
      { group: "Бэкенд и инфраструктура", items: "FastAPI, Next.js, PostgreSQL, Docker, Caddy, Linux, Git" },
      { group: "Автоматизация и CRM", items: "n8n, REST API, вебхуки, Битрикс24, amoCRM, 1С, Swagger" },
    ],
    education: [
      {
        institution: "МИРЭА — Российский технологический университет, Москва",
        degree: "Программная инженерия (неоконченное, 2023)",
        period: "",
      },
    ],
    languages: [
      { name: "Русский", level: "родной" },
      { name: "Английский", level: "C1, cert.efset.org/en/7MbYem" },
    ],
  },
};

export function defaultCvContent(locale: Locale): CvContent {
  return defaults[locale];
}
