/**
 * Type of tax/fee to apply
 */
export type TaxType = 'p' | 'r' // 'p' for percentage, 'r' for rupiah (fixed amount)

/**
 * Options for generating dynamic QRIS
 */
export interface GenerateDynamicQRISOptions {
  /**
   * The static QRIS string to convert
   */
  qrisStatic: string
  
  /**
   * The transaction amount in IDR (Indonesian Rupiah)
   */
  amount: string | number
  
  /**
   * Type of tax/fee: 'p' for percentage, 'r' for rupiah (fixed amount)
   * @default 'p'
   */
  taxType?: TaxType
  
  /**
   * Fee value - either percentage (if taxType is 'p') or fixed amount in IDR (if taxType is 'r')
   * @default '0'
   */
  fee?: string | number
}

/**
 * Result of QRIS validation
 */
export interface QRISValidationResult {
  isValid: boolean
  errors: string[]
}