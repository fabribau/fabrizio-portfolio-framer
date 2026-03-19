export type Locale = "es" | "en";

export const translations = {
  // ── Overlay (Scrollytelling) ──
  overlay: {
    name: { es: "Fabrizio Riera Bauer", en: "Fabrizio Riera Bauer" },
    title: { es: "Ingeniero en Informática", en: "Software Engineer" },
    missionLabel: { es: "La Misión", en: "The Mission" },
    mission: { es: "Transformo ideas\nen software.", en: "I turn ideas\ninto software." },
    approachLabel: { es: "El Enfoque", en: "The Approach" },
    approach: { es: "IA, Web\n& Aprendizaje.", en: "AI, Web\n& Learning." },
  },

  // ── Projects ──
  projects: {
    heading: { es: "Proyectos Destacados", en: "Selected Works" },
    items: [
      {
        title: { es: "Olimpiadas de Atletismo", en: "Athletics School Olympics" },
        tech: "Java | Spring Boot | Next.js | MySQL",
        desc: {
          es: "Sistema para administrar torneos, series y publicar resultados en tiempo real. Usado en las ediciones 2024 y 2025.",
          en: "System to manage tournaments, heats, and publish results in real-time. Used in the 2024 and 2025 editions.",
        },
      },
      {
        title: { es: "Agenda Médica", en: "Medical Agenda" },
        tech: "Groovy | Grails | PostgreSQL | JavaScript",
        desc: {
          es: "App para médicos, secretarias y pacientes: gestión de turnos, historia clínica y recetas digitales.",
          en: "App for doctors, secretaries, and patients: appointment management, clinical history, and digital prescriptions.",
        },
      },
      {
        title: { es: "Sistema GestionAR", en: "GestionAR Platform" },
        tech: "Groovy | Grails | PostgreSQL | CRM",
        desc: {
          es: "Plataforma de agro-inversiones integrada con CRM para la gestión integral de clientes e inversiones.",
          en: "Agri-investment platform integrated with CRM for comprehensive client and investment management.",
        },
      },
      {
        title: { es: "Tesis: Asistente IA contra Apuestas", en: "Thesis: AI Gambling Prevention" },
        tech: "RAG | LLM | Vercel AI SDK | Google AI",
        desc: {
          es: "Asistente conversacional basado en IA para la prevención de apuestas online. Proyecto de tesis de grado.",
          en: "Conversational AI assistant for online gambling prevention. Undergraduate thesis project.",
        },
      },
    ],
  },

  // ── Tech Carousel ──
  techCarousel: {
    heading: { es: "Tecnologías", en: "Technologies" },
  },

  // ── Experience ──
  experience: {
    heading: { es: "Experiencia", en: "Experience" },
    items: [
      {
        role: { es: "Docente Auxiliar-Alumno", en: "Auxiliary-Student Teacher" },
        org: "Universidad Nacional de San Luis",
        period: { es: "Sep 2022 – Actualidad", en: "Sep 2022 – Present" },
        desc: {
          es: "Dictado de clases prácticas, exámenes y desarrollo de evaluaciones en materias centrales de Informática.",
          en: "Leading practical classes, exams, and developing evaluations for core Software Engineering courses.",
        },
      },
      {
        role: { es: "Desarrollador FullStack (Trainee-Junior)", en: "FullStack Developer (Trainee-Junior)" },
        org: "RunaId",
        period: { es: "Oct 2024 – Dic 2024", en: "Oct 2024 – Dec 2024" },
        desc: {
          es: "Análisis, diseño y desarrollo de proyectos como Agenda Médica y GestionAR durante Prácticas Profesionales.",
          en: "Analysis, design, and development of projects like Medical Agenda and GestionAR during Professional Internship.",
        },
      },
      {
        role: { es: "Desarrollador FullStack · Admin de Sistemas", en: "FullStack Developer · Sys Admin" },
        org: { es: "Secretaría de Deportes – San Luis", en: "Sports Department – San Luis" },
        period: { es: "Mar 2024 – Oct 2024", en: "Mar 2024 – Oct 2024" },
        desc: {
          es: "Captura de requerimientos e implementación del sistema de Olimpiadas de Atletismo escolar.",
          en: "Requirements capture and implementation of the Athletics School Olympics system.",
        },
      },
    ],
    educationHeading: { es: "Educación", en: "Education" },
    education: {
      degree: { es: "Ingeniero en Informática", en: "Software Engineering Graduate" },
      org: "Universidad Nacional de San Luis",
      period: "2018 – 2025",
      gpa: { es: "Promedio: 8,91 (con aplazos) · 9,05 (sin aplazos)", en: "GPA: 8.91 (w/ fails) · 9.05 (w/o fails)" },
      thesis: {
        es: "Tesis: \"Asistente Conversacional basado en IA para la Prevención de Apuestas Online\"",
        en: "Thesis: \"Conversational AI Assistant for Online Gambling Prevention\"",
      },
    },
  },

  // ── Footer ──
  footer: {
    contact: { es: "Contacto", en: "Contact" },
    builtWith: { es: "Hecho con Next.js, Framer Motion & ♥", en: "Built with Next.js, Framer Motion & ♥" },
  },

  // ── UI ──
  ui: {
    langToggle: { es: "EN", en: "ES" },
    sequenceLoading: { es: "Cargando secuencia", en: "Loading sequence" },
  },
} as const;
