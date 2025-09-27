// 订阅状态枚举
export type BillingCycle = 'monthly' | 'yearly';

// 订阅对象接口
export interface SubscriptionTracker {
  id: number;
  userId: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 创建订阅的请求体
export interface CreateSubscriptionRequest {
  name: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: string;
  notes?: string;
}

// 更新订阅的请求体
export interface UpdateSubscriptionRequest {
  name?: string;
  price?: number;
  currency?: string;
  billingCycle?: BillingCycle;
  startDate?: string;
  notes?: string;
  isActive?: boolean;
}

// API 响应格式
export interface SubscriptionListResponse {
  success: boolean;
  data: SubscriptionTracker[];
}

export interface SubscriptionResponse {
  success: boolean;
  data: SubscriptionTracker;
}

// 计费周期显示配置
export const BILLING_CYCLE_CONFIG = {
  monthly: { label: 'Monthly', color: '#007AFF' },
  yearly: { label: 'Yearly', color: '#34C759' }
} as const;

// 常用货币配置
export const CURRENCY_CONFIG = {
  USD: { label: '美元', symbol: '$', flag: '🇺🇸' },
  CNY: { label: '人民币', symbol: '¥', flag: '🇨🇳' },
  EUR: { label: '欧元', symbol: '€', flag: '🇪🇺' },
  JPY: { label: '日元', symbol: '¥', flag: '🇯🇵' },
  GBP: { label: '英镑', symbol: '£', flag: '🇬🇧' },
  KRW: { label: '韩元', symbol: '₩', flag: '🇰🇷' },
  HKD: { label: '港币', symbol: 'HK$', flag: '🇭🇰' },
} as const;

// 汇率配置（以美元为基准，实际应用中应该从API获取实时汇率）
export const EXCHANGE_RATES = {
  USD: 1.0,   // 基准货币
  CNY: 0.14,  // 1人民币 = 0.14美元
  EUR: 1.08,  // 1欧元 = 1.08美元
  JPY: 0.007, // 1日元 = 0.007美元
  GBP: 1.27,  // 1英镑 = 1.27美元
  KRW: 0.00076, // 1韩元 = 0.00076美元
  HKD: 0.13,  // 1港币 = 0.13美元
} as const;

// 基准货币（用于汇总计算）
export const BASE_CURRENCY = 'USD';

// 计算下次续费日期的工具函数
export const calculateNextBillingDate = (subscription: SubscriptionTracker): Date => {
  const startDate = new Date(subscription.startDate);
  const now = new Date();

  if (subscription.billingCycle === 'monthly') {
    // 按月计算
    const nextDate = new Date(startDate);
    while (nextDate <= now) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    return nextDate;
  } else {
    // 按年计算
    const nextDate = new Date(startDate);
    while (nextDate <= now) {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    return nextDate;
  }
};

// 计算距离下次续费的天数
export const getDaysUntilNextBilling = (subscription: SubscriptionTracker): number => {
  const nextBillingDate = calculateNextBillingDate(subscription);
  const now = new Date();
  const diffTime = nextBillingDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 计算订阅的年总费用
export const getAnnualCost = (subscription: SubscriptionTracker): number => {
  if (subscription.billingCycle === 'yearly') {
    return subscription.price;
  } else {
    return subscription.price * 12;
  }
};

// 获取货币显示信息（包含完整标签和符号）
export const getCurrencyDisplay = (currency: string) => {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG];
  return config || { label: currency, symbol: currency, flag: '💱' };
};

// 格式化价格显示（货币符号 + 金额）
export const formatPrice = (price: number, currency: string): string => {
  const { symbol } = getCurrencyDisplay(currency);
  return `${symbol}${price.toFixed(2)}`;
};

// 货币转换到指定目标货币
export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES];
  const toRate = EXCHANGE_RATES[toCurrency as keyof typeof EXCHANGE_RATES];

  if (!fromRate || !toRate) return amount;

  // 先转换为美元（基准货币），再转换为目标货币
  const amountInUSD = amount * fromRate;
  return amountInUSD / toRate;
};

// 货币转换到基准货币
export const convertToBaseCurrency = (amount: number, fromCurrency: string): number => {
  return convertCurrency(amount, fromCurrency, BASE_CURRENCY);
};

// 按货币分组统计费用（包含汇总）
export const calculateCostsByCurrency = (subscriptions: SubscriptionTracker[], displayCurrency: string = BASE_CURRENCY) => {
  const activeSubscriptions = subscriptions.filter(s => s.isActive);
  const monthlyCosts: { [currency: string]: number } = {};
  const annualCosts: { [currency: string]: number } = {};

  // 用于汇总计算的变量（转换为指定显示货币）
  let totalMonthlyInBase = 0;
  let totalAnnualInBase = 0;

  activeSubscriptions.forEach(subscription => {
    const currency = subscription.currency;

    // 计算月度费用
    const monthlyCost = subscription.billingCycle === 'monthly'
      ? subscription.price
      : subscription.price / 12;
    const annualCost = getAnnualCost(subscription);

    monthlyCosts[currency] = (monthlyCosts[currency] || 0) + monthlyCost;
    annualCosts[currency] = (annualCosts[currency] || 0) + annualCost;

    // 累加到显示货币汇总
    totalMonthlyInBase += convertCurrency(monthlyCost, currency, displayCurrency);
    totalAnnualInBase += convertCurrency(annualCost, currency, displayCurrency);
  });

  return {
    monthlyCosts,
    annualCosts,
    activeCount: activeSubscriptions.length,
    // 新增：显示货币汇总
    totalMonthlyInBase,
    totalAnnualInBase,
    baseCurrency: displayCurrency
  };
};
