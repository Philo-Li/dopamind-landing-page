// 礼品码相关的TypeScript类型定义

export interface PromoCodeHistory {
  id: number
  usedAt: string
  promoCode: {
    code: string
    days: number
    description?: string
  }
}

export interface PromoCodeRedeemResponse {
  success: boolean
  days: number
  message?: string
}

export interface PromoCodeValidationResponse {
  valid: boolean
  days?: number
  error?: string
}

export interface PromoCodeHistoryResponse {
  history: PromoCodeHistory[]
  total: number
  page: number
  limit: number
}

// API错误码常量
export const PROMO_CODE_ERROR_CODES = {
  INVALID_CODE: 'INVALID_CODE',
  EXPIRED_CODE: 'EXPIRED_CODE',
  USED_CODE: 'USED_CODE',
  MAX_USES_REACHED: 'MAX_USES_REACHED',
  DISABLED_CODE: 'DISABLED_CODE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
} as const

export type PromoCodeErrorCode = typeof PROMO_CODE_ERROR_CODES[keyof typeof PROMO_CODE_ERROR_CODES]