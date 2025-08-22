/**
 * Pad a number with leading zeros to ensure it has at least 2 digits
 * @param num - The number to pad
 * @returns The padded string
 */
export function pad(num: string | number): string {
  return String(num).padStart(2, '0')
}

/**
 * Calculate CRC16 checksum for QRIS data
 * @param data - The data to calculate checksum for
 * @returns The CRC16 checksum as a 4-character uppercase hex string
 */
export function toCRC16(data: string): string {
  let crc = 0xFFFF
  
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8
    
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
    }
  }
  
  return ((crc & 0xFFFF).toString(16).toUpperCase()).padStart(4, '0')
}

/**
 * Validate if a string is a valid QRIS format
 * @param qris - The QRIS string to validate
 * @returns True if valid, false otherwise
 */
export function isValidQRIS(qris: string): boolean {
  // Basic validation - check if it contains required markers
  if (!qris || typeof qris !== 'string') {
    return false
  }
  
  // Check for minimum length
  if (qris.length < 20) {
    return false
  }
  
  // Check if it contains the Indonesia country code
  if (!qris.includes('5802ID')) {
    return false
  }
  
  // Check if it has a CRC at the end (4 hex characters)
  const lastFourChars = qris.slice(-4)
  if (!/^[0-9A-F]{4}$/i.test(lastFourChars)) {
    return false
  }
  
  return true
}