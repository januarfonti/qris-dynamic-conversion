import type { GenerateDynamicQRISOptions, QRISValidationResult } from './types'
import { pad, toCRC16, isValidQRIS } from './utils'

/**
 * Convert a static QRIS to dynamic QRIS with specified amount and fee
 * @param options - Options for generating dynamic QRIS
 * @returns The generated dynamic QRIS string
 * @throws Error if the input QRIS is invalid
 */
export function generateDynamicQRIS(options: GenerateDynamicQRISOptions): string {
  const { 
    qrisStatic, 
    amount, 
    taxType = 'p', 
    fee = '0' 
  } = options
  
  // Validate input QRIS
  if (!isValidQRIS(qrisStatic)) {
    throw new Error('Invalid QRIS format')
  }
  
  // Convert amount and fee to string
  const amountStr = String(amount)
  const feeStr = String(fee)
  
  // Validate amount
  if (!amountStr || amountStr === '0') {
    throw new Error('Amount must be greater than 0')
  }
  
  // Remove old CRC (last 4 characters)
  const qrisWithoutCRC = qrisStatic.slice(0, -4)
  
  // Replace tag 010211 (static) with 010212 (dynamic)
  const dynamicQRIS = qrisWithoutCRC.replace('010211', '010212')
  
  // Split by Indonesia country code
  const parts = dynamicQRIS.split('5802ID')
  
  if (parts.length !== 2) {
    throw new Error('Invalid QRIS format: missing or duplicate country code')
  }
  
  const beforeCountryCode = parts[0]!
  const afterCountryCode = parts[1]!
  
  // Build amount tag (tag 54)
  const amountTag = '54' + pad(amountStr.length) + amountStr
  
  // Build tax/fee tag if applicable (tag 55)
  let taxTag = ''
  if (feeStr !== '0') {
    if (taxType === 'p') {
      // Percentage fee (tag 5502 with subtype 03 and subtag 57)
      taxTag = '55020357' + pad(feeStr.length) + feeStr
    } else if (taxType === 'r') {
      // Fixed amount fee (tag 5502 with subtype 02 and subtag 56)
      taxTag = '55020256' + pad(feeStr.length) + feeStr
    }
  }
  
  // Combine amount and tax tags with country code
  const middlePart = amountTag + taxTag + '5802ID'
  
  // Combine all parts
  const outputWithoutCRC = beforeCountryCode.trim() + middlePart + afterCountryCode.trim()
  
  // Calculate and append CRC
  const crc = toCRC16(outputWithoutCRC)
  const finalQRIS = outputWithoutCRC + crc
  
  return finalQRIS
}

/**
 * Validate a QRIS string and return detailed validation results
 * @param qris - The QRIS string to validate
 * @returns Validation result with any errors found
 */
export function validateQRIS(qris: string): QRISValidationResult {
  const errors: string[] = []
  
  if (!qris || typeof qris !== 'string') {
    errors.push('QRIS must be a non-empty string')
    return { isValid: false, errors }
  }
  
  if (qris.length < 20) {
    errors.push('QRIS is too short')
  }
  
  if (!qris.includes('5802ID')) {
    errors.push('QRIS must contain Indonesia country code (5802ID)')
  }
  
  const lastFourChars = qris.slice(-4)
  if (!/^[0-9A-F]{4}$/i.test(lastFourChars)) {
    errors.push('QRIS must end with a valid 4-character CRC16 checksum')
  }
  
  // Verify CRC if basic format is valid
  if (errors.length === 0) {
    const dataWithoutCRC = qris.slice(0, -4)
    const expectedCRC = toCRC16(dataWithoutCRC)
    const actualCRC = qris.slice(-4).toUpperCase()
    
    if (expectedCRC !== actualCRC) {
      errors.push(`Invalid CRC16 checksum. Expected: ${expectedCRC}, Actual: ${actualCRC}`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}