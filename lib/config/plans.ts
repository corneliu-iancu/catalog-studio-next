import { Check, X } from "lucide-react";

export interface PlanFeature {
  name: string;
  included: boolean;
  value?: string | number;
}

export interface PlanPrice {
  monthly: number;
  yearly: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  prices: {
    EUR: PlanPrice;
    RON: PlanPrice;
  };
  popular?: boolean;
  features: PlanFeature[];
  cta: string;
  ctaHref: string;
  highlight?: string;
}

export const CURRENCY_CONFIG = {
  en: {
    code: 'EUR',
    symbol: '€',
    position: 'after' as const, // €29 or 29€
  },
  ro: {
    code: 'RON',
    symbol: 'lei',
    position: 'after' as const, // 99 lei
  },
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for testing and small restaurants getting started",
    prices: {
      EUR: { monthly: 0, yearly: 0 },
      RON: { monthly: 0, yearly: 0 },
    },
    cta: "Start Free",
    ctaHref: "/auth/signup",
    features: [
      { name: "1 restaurant/menu", included: true, value: "1" },
      { name: "Up to 20 products", included: true, value: "20" },
      { name: "2 menu templates", included: true, value: "2" },
      { name: "Basic image uploads (720p)", included: true },
      { name: "QR code generation", included: true },
      { name: "Mobile-responsive design", included: true },
      { name: "Basic analytics", included: true },
      { name: "Custom domain", included: false },
      { name: "Remove branding", included: false },
      { name: "Priority support", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Custom themes", included: false },
    ],
  },
  {
    id: "basic",
    name: "Basic",
    description: "Great for growing restaurants that need more flexibility",
    prices: {
      EUR: { monthly: 29, yearly: 290 },
      RON: { monthly: 145, yearly: 1450 }, // Approximate conversion: 1 EUR = 5 RON
    },
    popular: true,
    cta: "Get Started",
    ctaHref: "/auth/signup",
    highlight: "Most Popular",
    features: [
      { name: "Up to 3 restaurants/menus", included: true, value: "3" },
      { name: "Up to 100 products", included: true, value: "100" },
      { name: "10 premium templates", included: true, value: "10" },
      { name: "High-quality image uploads (1080p)", included: true },
      { name: "QR code generation", included: true },
      { name: "Mobile-responsive design", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom domain", included: true },
      { name: "Remove branding", included: true },
      { name: "Email support", included: true },
      { name: "Priority support", included: false },
      { name: "Custom themes", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "For restaurant groups and professionals who need it all",
    prices: {
      EUR: { monthly: 79, yearly: 790 },
      RON: { monthly: 395, yearly: 3950 }, // Approximate conversion: 1 EUR = 5 RON
    },
    cta: "Go Premium",
    ctaHref: "/auth/signup",
    features: [
      { name: "Unlimited restaurants/menus", included: true, value: "∞" },
      { name: "Unlimited products", included: true, value: "∞" },
      { name: "All premium templates", included: true, value: "25+" },
      { name: "Ultra HD image uploads (4K)", included: true },
      { name: "QR code generation", included: true },
      { name: "Mobile-responsive design", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom domain", included: true },
      { name: "Remove branding", included: true },
      { name: "Priority support", included: true },
      { name: "Custom themes", included: true },
      { name: "API access", included: true },
    ],
  },
];

export const EARLY_BIRD_OFFER = {
  enabled: true,
  limit: 20,
  plan: "basic",
  months: 6,
  title: "🎉 Early Bird Special",
  description: "First 20 customers get 6 months of Basic plan free",
};

export const ANNUAL_DISCOUNT_PERCENTAGE = 17; // Percentage saved on annual plans

