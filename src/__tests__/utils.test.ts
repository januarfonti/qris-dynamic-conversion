import { describe, it, expect } from 'vitest'
import { pad, toCRC16, isValidQRIS } from '../utils'

describe('pad', () => {
  it('should pad single digit numbers with leading zero', () => {
    expect(pad(1)).toBe('01')
    expect(pad(5)).toBe('05')
    expect(pad(9)).toBe('09')
  })

  it('should not pad two digit numbers', () => {
    expect(pad(10)).toBe('10')
    expect(pad(99)).toBe('99')
  })

  it('should handle string inputs', () => {
    expect(pad('1')).toBe('01')
    expect(pad('10')).toBe('10')
  })

  it('should handle numbers longer than 2 digits', () => {
    expect(pad(100)).toBe('100')
    expect(pad(1000)).toBe('1000')
  })
})

describe('toCRC16', () => {
  it('should calculate correct CRC16 for known values', () => {
    // Test with a simple string
    expect(toCRC16('123456789')).toBe('29B1')
    
    // Test with empty string
    expect(toCRC16('')).toBe('FFFF')
  })

  it('should return 4 character uppercase hex string', () => {
    const result = toCRC16('test data')
    expect(result).toMatch(/^[0-9A-F]{4}$/)
    expect(result.length).toBe(4)
  })

  it('should be consistent for same input', () => {
    const input = 'QRIS test data'
    const result1 = toCRC16(input)
    const result2 = toCRC16(input)
    expect(result1).toBe(result2)
  })
})

describe('isValidQRIS', () => {
  it('should return false for invalid inputs', () => {
    expect(isValidQRIS('')).toBe(false)
    expect(isValidQRIS(null as any)).toBe(false)
    expect(isValidQRIS(undefined as any)).toBe(false)
    expect(isValidQRIS(123 as any)).toBe(false)
  })

  it('should return false for too short strings', () => {
    expect(isValidQRIS('short')).toBe(false)
    expect(isValidQRIS('123456789')).toBe(false)
  })

  it('should return false if missing Indonesia country code', () => {
    expect(isValidQRIS('00020101021126370016ID.CO.TELKOM.WWW011893600898021234567802150000000000000000303UME51440014ID.CO.QRIS.WWW0215ID20200185853940303UME520454995303360540312055F204')).toBe(false)
  })

  it('should return false if CRC is invalid format', () => {
    expect(isValidQRIS('00020101021126370016ID.CO.TELKOM.WWW011893600898021234567802150000000000000000303UME51440014ID.CO.QRIS.WWW0215ID20200185853940303UME5204549953033605802IDZZZZ')).toBe(false)
    expect(isValidQRIS('00020101021126370016ID.CO.TELKOM.WWW011893600898021234567802150000000000000000303UME51440014ID.CO.QRIS.WWW0215ID20200185853940303UME5204549953033605802ID123')).toBe(false)
  })

  it('should return true for valid QRIS format', () => {
    // Example static QRIS (format is correct, CRC might not match)
    expect(isValidQRIS('00020101021126370016ID.CO.TELKOM.WWW011893600898021234567802150000000000000000303UME51440014ID.CO.QRIS.WWW0215ID20200185853940303UME5204549953033605802ID5303360ABC1')).toBe(true)
  })
})