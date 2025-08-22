// Basic usage example for @januarfonti/qris-dynamic-conversion

const { generateDynamicQRIS, validateQRIS } = require('@januarfonti/qris-dynamic-conversion')

// Example static QRIS (you should use your actual static QRIS)
const staticQRIS = '00020101021126370016ID.CO.TELKOM.WWW011893600898021234567802150000000000000000303UME51440014ID.CO.QRIS.WWW0215ID20200185853940303UME5204549953033605802ID5303360ABC1'

// Example 1: Basic conversion with amount only
console.log('=== Example 1: Basic Conversion ===')
try {
  const dynamicQRIS = generateDynamicQRIS({
    qrisStatic: staticQRIS,
    amount: 50000
  })
  console.log('Dynamic QRIS:', dynamicQRIS)
} catch (error) {
  console.error('Error:', error.message)
}

// Example 2: With percentage fee
console.log('\n=== Example 2: With Percentage Fee ===')
try {
  const dynamicQRIS = generateDynamicQRIS({
    qrisStatic: staticQRIS,
    amount: 100000,
    taxType: 'p',
    fee: 2.5 // 2.5% fee
  })
  console.log('Dynamic QRIS with 2.5% fee:', dynamicQRIS)
} catch (error) {
  console.error('Error:', error.message)
}

// Example 3: With fixed amount fee
console.log('\n=== Example 3: With Fixed Amount Fee ===')
try {
  const dynamicQRIS = generateDynamicQRIS({
    qrisStatic: staticQRIS,
    amount: 100000,
    taxType: 'r',
    fee: 1000 // IDR 1,000 fee
  })
  console.log('Dynamic QRIS with IDR 1,000 fee:', dynamicQRIS)
} catch (error) {
  console.error('Error:', error.message)
}

// Example 4: Validate QRIS
console.log('\n=== Example 4: QRIS Validation ===')
const validationResult = validateQRIS(staticQRIS)
console.log('Is valid:', validationResult.isValid)
if (!validationResult.isValid) {
  console.log('Validation errors:', validationResult.errors)
}