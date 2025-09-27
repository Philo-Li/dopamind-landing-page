export const defaultNavigationContent = {
  home: "Home",
  features: "Features",
  howItWorks: "How it works",
  pricing: "Pricing",
  download: "Download",
  support: "Support",
  dashboard: "Dashboard",
  calendar: "Calendar",
  subscription_tracker: "Subscription Tracker",
  fridge: "Fridge",
  habits: "Habits",
  referral: "Refer Friends",
  plans: "Plans",
};

export const defaultFooterContent = {
  description: "Dopamind helps ADHD minds plan, start, and finish the work that matters most.",
  sections: {
    product: "Product",
    support: "Support",
    community: "Community",
    legal: "Legal",
  },
  links: {
    supportCenter: "Support Center",
    contactUs: "Contact us",
    status: "Status",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    accountDeletion: "Account deletion",
    cookies: "Cookie policy",
    discord: "Join the Discord community",
    twitter: "Follow on X",
  },
};

export const defaultHomeContent = {
  hero: {
    badge: "Built for ADHD focus",
    title: "Focus better with Dopamind",
    titleHighlight: "AI accountability partner",
    subtitle: "Plan, start, and finish your day with an AI coach designed for neurodiverse minds.",
    downloadText: "Download Dopamind on mobile to sync with the web app.",
  },
  features: {
    section1: {
      title: "Plan your day with clarity",
      subtitle: "Break tasks into easy steps and capture context instantly.",
      points: [
        "AI breaks complex tasks into actionable steps.",
        "Voice capture tasks without losing momentum.",
        "Pin context, notes, and files alongside each task.",
      ],
    },
    section2: {
      title: "Stay accountable through the day",
      subtitle: "Automations and reminders nudge you when executive function energy dips.",
      points: [
        "Focus mode guides you with live prompts and positive reinforcement.",
        "Adaptive scheduling suggests when to start and resume.",
        "Syncs across devices so you can pick up anywhere.",
      ],
    },
  },
  howItWorks: {
    section1: {
      title: "Capture what matters",
      subtitle: "Tell Dopamind what you need to get done and it turns ideas into a plan.",
      example: {
        title: "Before you start a focus session",
        steps: [
          "Pick a task and the outcome you need.",
          "Choose how long you want to focus.",
          "Let the AI coach give you a quick pep talk.",
        ],
      },
    },
    section2: {
      title: "Focus with confidence",
      subtitle: "Stay in flow with soundscapes, progress prompts, and accountability checks.",
      stats: [
        { value: "20+", label: "Focus templates" },
        { value: "90%", label: "Users feel more in control" },
        { value: "7 days", label: "Premium trial included" },
      ],
    },
  },
  globalView: {
    title: "See the full picture",
    subtitle: "Calendar, timeline, and stats keep you on track across every device.",
    badges: ["Cross-platform sync", "Works on web, iOS, and Android"],
  },
  beyondTasks: {
    title: "More than task management",
    subtitle: "Dopamind layers accountability, rituals, and coaching for ADHD minds.",
    features: [
      {
        title: "AI accountability coach",
        description: "Get gentle nudges, reframes, and check-ins when you feel stuck.",
      },
      {
        title: "Habit rituals",
        description: "Build micro-routines with structured prompts and dopamine-friendly rewards.",
      },
      {
        title: "Executive function toolkit",
        description: "Timers, notes, and progress insights designed specifically for ADHD brains.",
      },
    ],
  },
  cloudSync: {
    title: "Your work, synced everywhere",
    subtitle: "Capture thoughts on the go and finish them on desktop without missing context.",
    features: [
      {
        title: "Real-time sync",
        description: "Updates flow instantly between mobile and web apps.",
      },
      {
        title: "Secure backups",
        description: "Automatic backups keep your plans safe and recoverable.",
      },
      {
        title: "Works offline",
        description: "Capture thoughts offline—everything syncs when you reconnect.",
      },
    ],
  },
  finalCta: {
    title: "Start focusing with Dopamind today",
    subtitle: "Join thousands of ADHD minds building healthier routines with AI support.",
    trial: "Includes a 7-day premium trial",
    users: "Trusted by {count} ADHD builders worldwide.",
    termsAndPrivacy: "By continuing you agree to our {terms} and {privacy}.",
    termsLink: "Terms of Service",
    privacyLink: "Privacy Policy",
  },
};

export function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== "object") {
    return target;
  }

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (Array.isArray(sourceValue)) {
      target[key] = sourceValue;
    } else if (sourceValue && typeof sourceValue === "object") {
      target[key] = deepMerge(
        targetValue && typeof targetValue === "object" ? targetValue : {},
        sourceValue,
      );
    } else if (sourceValue !== undefined) {
      target[key] = sourceValue;
    }
  });

  return target;
}

export function cloneDeep(value: any) {
  return JSON.parse(JSON.stringify(value));
}
