import type { Locale } from "@/lib/i18n/config";
import { contactLinks } from "@/lib/profile";
import type { CvContent } from "@/lib/cv/schema";

const contacts: CvContent["contacts"] = [
  { label: contactLinks.email, url: `mailto:${contactLinks.email}` },
  { label: "t.me/khovre", url: contactLinks.telegram },
  { label: "khovrov.dev", url: "https://khovrov.dev" },
  { label: "github.com/mkhovrov01", url: contactLinks.github },
  { label: "LinkedIn", url: contactLinks.linkedin },
];

// The starting point of the editor until a language is first saved.
// The facts come from the public site and "Context for AI.md".
const defaults: Record<Locale, CvContent> = {
  en: {
    name: "Maksim Khovrov",
    headline: "AI Automation Engineer",
    location: "Novi Sad, Serbia (GMT+2). Open to remote work.",
    contacts,
    summary:
      "4.5 years in development and automation, with 2+ years of focused work with LLMs and AI agents. I combine development, testing and business understanding with experience managing a team of 10 people. Seeking a position in AI development, automation or technical product management.",
    experience: [
      {
        role: "Project Manager / Automation Engineer",
        company: "MCN Telecom, Business Process Automation department",
        url: "https://mcn.ru/",
        period: "2020 – 2024 (4 yrs 5 mo)",
        bullets: [
          "Launched 30+ voice robots into production across medical, retail, recruitment, financial and municipal infrastructure sectors.",
          "Implemented an internal custom voice AI robot with RAG to handle company B2C customers.",
          "Designed and deployed 3 RAG pipelines (Qdrant, Zep) for client knowledge bases, increasing robot response accuracy from 70% to 98%.",
          "Conducted 15+ technical audits and helped prepare commercial proposals that closed deals worth $400K+.",
          "Core developer through a team restructuring: redesigned processes, onboarded specialists and scaled the team from 3 to 10+ people.",
          "Added alerting and error handling for external API integrations.",
          "Designed integration architectures with Bitrix24, amoCRM, 1C and IP telephony; built business logic in n8n with custom JavaScript and Python functions.",
          "Mentored new developers: code reviews, training on the stack and an internal knowledge base.",
        ],
      },
    ],
    projects: [
      {
        name: "Cogan",
        url: "https://khovrov.dev/#project",
        period: "",
        description:
          "System for preparing and checking complex document packages, in active development and running in production for a client: from the requirements of normative acts to a finished PDF and DOCX.",
        bullets: [
          "Built the FastAPI and React product: normative library with accepted clauses, versioned templates and projects, extraction review, package checks and immutable releases.",
          "Designed a document model that keeps content apart from appearance: inheritable Formattings build one set of data into both PDF (Typst) and DOCX.",
          "Integrated AI across the product as 25 managed actions, each with its own versioned prompt, model, limit and switch.",
          "Developing Cogan AI, the product agent, with tools chosen by context and checked proposals, plus a harness that runs it in a sandbox against scenarios and compares variants.",
        ],
      },
      {
        name: "Mnemosyne + Personal Assistant",
        url: "https://khovrov.dev/#demo-assistant",
        period: "",
        description:
          "RAG system behind the assistant on my site: a profile-pinned broker in front of a Postgres registry and a Qdrant vector store, so private data is unreachable from the public token.",
        bullets: [],
      },
      {
        name: "Knowledge Base RAG Auditor",
        url: "https://khovrov.dev/#demo-kb-audit",
        period: "",
        description: "Public tool that audits a site and estimates the scope, cost and confidence of a RAG pipeline.",
        bullets: [],
      },
      {
        name: "PhonoForge",
        url: "https://khovrov.dev/#demo-phonoforge",
        period: "",
        description: "Conlang and speech recognition experiment with a browser demo.",
        bullets: [],
      },
    ],
    skills: [
      { group: "Languages", items: "JavaScript, TypeScript, Python, SQL" },
      { group: "AI and data", items: "LangChain, RAG, Qdrant, Zep, Pinecone, OpenAI API, prompt engineering, fine-tuning" },
      { group: "Tools", items: "n8n, Git, GitHub, Docker, Linux, Jupyter, Swagger, REST, CI/CD, Jira, Notion" },
      { group: "Systems", items: "Bitrix24, amoCRM, 1C, VoIP, PostgreSQL" },
    ],
    education: [
      {
        institution: "MIREA — Russian Technological University",
        degree: "Computer Science and Software Engineering (incomplete degree)",
        period: "",
      },
    ],
    languages: [],
  },
  ru: {
    name: "Максим Ховров",
    headline: "Инженер по AI-автоматизации",
    location: "Нови-Сад, Сербия (GMT+2). Открыт к удалённой работе.",
    contacts,
    summary:
      "4,5 года в разработке и автоматизации, из них 2+ года — в системах на основе LLM и AI-агентах. Сочетаю разработку, тестирование и понимание бизнеса с опытом управления командой из 10 человек. Ищу позицию в AI-разработке, автоматизации или техническом продакт-менеджменте.",
    experience: [
      {
        role: "Проджект-менеджер / Инженер по автоматизации",
        company: "MCN Telecom, отдел автоматизации бизнес-процессов",
        url: "https://mcn.ru/",
        period: "2020 — 2024 (4 года 5 мес)",
        bullets: [
          "Запустил в продакшн 30+ голосовых роботов в медицине, ритейле, рекрутинге, финансах и муниципальной инфраструктуре.",
          "Внедрил внутреннего голосового AI-робота с RAG для работы с B2C-клиентами компании.",
          "Спроектировал и развернул 3 RAG-пайплайна (Qdrant, Zep) для клиентских баз знаний, повысив точность ответов роботов с 70% до 98%.",
          "Провёл 15+ технических аудитов и помог подготовить коммерческие предложения, закрывшие сделки на $400K+.",
          "Ключевой разработчик в период реструктуризации: перестроил процессы, онбордил специалистов, масштабировал команду с 3 до 10+ человек.",
          "Добавил алертинг и обработку ошибок для интеграций с внешними API.",
          "Проектировал архитектуру интеграций с Bitrix24, amoCRM, 1С и IP-телефонией; писал бизнес-логику в n8n с функциями на JavaScript и Python.",
          "Менторил новых разработчиков: код-ревью, обучение стеку, внутренняя база знаний.",
        ],
      },
    ],
    projects: [
      {
        name: "Cogan",
        url: "https://khovrov.dev/#project",
        period: "",
        description:
          "Система подготовки и проверки сложных комплектов документов, в активной разработке и в продакшене у клиента: от требований нормативных актов до готовых PDF и DOCX.",
        bullets: [
          "Разработал продукт на FastAPI и React: нормативная библиотека с принятыми пунктами, версионные шаблоны и проекты, проверка извлечения, проверка пакета и неизменяемые выпуски.",
          "Спроектировал модель документа, где содержимое отделено от вида: наследуемые Оформления собирают одни данные в PDF (Typst) и DOCX.",
          "Встроил ИИ по всему продукту: 25 управляемых действий, у каждого свой версионируемый промпт, модель, лимит и выключатель.",
          "Разрабатываю Коган AI, агента продукта: инструменты по контексту, проверяемые предложения и харнесс, который гоняет его в песочнице по сценариям и сравнивает варианты.",
        ],
      },
      {
        name: "Mnemosyne + личный ассистент",
        url: "https://khovrov.dev/#demo-assistant",
        period: "",
        description:
          "RAG-система за ассистентом на моём сайте: брокер с закреплённым профилем перед реестром в Postgres и векторным хранилищем Qdrant, поэтому приватные данные недостижимы с публичным токеном.",
        bullets: [],
      },
      {
        name: "Knowledge Base RAG Auditor",
        url: "https://khovrov.dev/#demo-kb-audit",
        period: "",
        description: "Публичный инструмент: аудит сайта и оценка объёма, стоимости и уверенности RAG-пайплайна.",
        bullets: [],
      },
      {
        name: "PhonoForge",
        url: "https://khovrov.dev/#demo-phonoforge",
        period: "",
        description: "Эксперимент с конлангом и распознаванием речи, с демо в браузере.",
        bullets: [],
      },
    ],
    skills: [
      { group: "Языки", items: "JavaScript, TypeScript, Python, SQL" },
      { group: "AI и данные", items: "LangChain, RAG, Qdrant, Zep, Pinecone, OpenAI API, промпт-инжиниринг, fine-tuning" },
      { group: "Инструменты", items: "n8n, Git, GitHub, Docker, Linux, Jupyter, Swagger, REST, CI/CD, Jira, Notion" },
      { group: "Системы", items: "Битрикс24, amoCRM, 1С, VoIP, PostgreSQL" },
    ],
    education: [
      {
        institution: "МИРЭА — Российский технологический университет",
        degree: "Компьютерные науки и программная инженерия (неоконченное)",
        period: "",
      },
    ],
    languages: [],
  },
};

export function defaultCvContent(locale: Locale): CvContent {
  return defaults[locale];
}
