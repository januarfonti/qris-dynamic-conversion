import { describe, it, expect } from 'vitest'
import { generateDynamicQRIS, validateQRIS } from '../converter'
import { toCRC16 } from '../utils'

describe('generateDynamicQRIS', () => {
  // Real static QRIS for testing - includes 010211 tag for static QRIS
  const validStaticQRIS = '00020101021126610014COM.GO-JEK.WWW01189360091434035299640210G4035299640303UMI51440014ID.CO.QRIS.WWW0215ID10253753027970303UMI5204581553033605802ID5924Anjani Falisha Kikanaya,6006MALANG61056513962070703A0163042735'
  
  it('should convert static QRIS to dynamic QRIS', () => {
    const result = generateDynamicQRIS({
      qrisStatic: validStaticQRIS,
      amount: '10000'
    })
    
    // Check that it contains dynamic tag
    expect(result).toContain('010212')
    expect(result).not.toContain('010211')
    
    // Check that it contains amount tag
    expect(result).toContain('540510000')
    
    // Check that CRC is recalculated (different from input)
    expect(result.slice(-4)).not.toBe('ABC1')
  })

  it('should handle percentage fee correctly', () => {
    const result = generateDynamicQRIS({
      qrisStatic: validStaticQRIS,
      amount: '10000',
      taxType: 'p',
      fee: '2.5'
    })
    
    // Should contain percentage fee tag structure
    expect(result).toContain('55020357') // Percentage fee tag
    expect(result).toContain('032.5') // Length 03 + value 2.5
  })

  it('should handle fixed amount fee correctly', () => {
    const result = generateDynamicQRIS({
      qrisStatic: validStaticQRIS,
      amount: '10000',
      taxType: 'r',
      fee: '500'
    })
    
    // Should contain fixed fee tag structure
    expect(result).toContain('55020256') // Fixed amount fee tag
    expect(result).toContain('03500') // Length 03 + value 500
  })

  it('should handle zero fee', () => {
    const result = generateDynamicQRIS({
      qrisStatic: validStaticQRIS,
      amount: '10000',
      fee: '0'
    })
    
    // Should not contain fee tag
    expect(result).not.toContain('5502')
  })

  it('should handle number inputs for amount and fee', () => {
    const result = generateDynamicQRIS({
      qrisStatic: validStaticQRIS,
      amount: 50000,
      taxType: 'r',
      fee: 1000
    })
    
    expect(result).toContain('540550000')
    expect(result).toContain('1000')
  })

  it('should throw error for invalid QRIS', () => {
    expect(() => {
      generateDynamicQRIS({
        qrisStatic: 'invalid',
        amount: '10000'
      })
    }).toThrow('Invalid QRIS format')
  })

  it('should throw error for zero amount', () => {
    expect(() => {
      generateDynamicQRIS({
        qrisStatic: validStaticQRIS,
        amount: '0'
      })
    }).toThrow('Amount must be greater than 0')
  })

  it('should throw error for missing country code', () => {
    const invalidQRIS = '00020101021126370016ID.CO.TELKOM.WWW011893600898021234567802150000000000000000303UME51440014ID.CO.QRIS.WWW0215ID20200185853940303UME52045499530336ABC1'
    
    expect(() => {
      generateDynamicQRIS({
        qrisStatic: invalidQRIS,
        amount: '10000'
      })
    }).toThrow('Invalid QRIS format')
  })
})

describe('validateQRIS', () => {
  it('should validate correct QRIS format', () => {
    // Note: This is a format check, not a real QRIS with correct CRC
    const result = validateQRIS('00020101021126370016ID.CO.TELKOM.WWW011893600898021234567802150000000000000000303UME51440014ID.CO.QRIS.WWW0215ID20200185853940303UME5204549953033605802ID5303360ABC1')
    
    // It will fail CRC check but pass format checks
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('Invalid CRC16 checksum')
  })

  it('should return errors for invalid inputs', () => {
    const result = validateQRIS('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('QRIS must be a non-empty string')
  })

  it('should return error for missing country code', () => {
    const result = validateQRIS('00020101021126370016ID.CO.TELKOM.ABCD')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('QRIS must contain Indonesia country code (5802ID)')
  })

  it('should return error for invalid CRC format', () => {
    const result = validateQRIS('00020101021126370016ID.CO.TELKOM.5802IDXYZ1')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('QRIS must end with a valid 4-character CRC16 checksum')
  })

  it('should validate a properly formatted QRIS with correct CRC', () => {
    // Create a valid QRIS by generating one
    const validQRIS = '00020101021126370016ID.CO.TELKOM.WWW011893600898021234567802150000000000000000303UME51440014ID.CO.QRIS.WWW0215ID20200185853940303UME5204549953033605802ID5303360'
    const correctCRC = toCRC16(validQRIS)
    const qrisWithCorrectCRC = validQRIS + correctCRC
    
    const result = validateQRIS(qrisWithCorrectCRC)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})