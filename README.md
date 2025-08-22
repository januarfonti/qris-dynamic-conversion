# QRIS Dynamic Conversion

[![npm version](https://img.shields.io/npm/v/@januarfonti/qris-dynamic-conversion.svg)](https://www.npmjs.com/package/@januarfonti/qris-dynamic-conversion)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A TypeScript library to convert static QRIS (Quick Response Code Indonesian Standard) to dynamic QRIS with customizable amount and fee. This library allows you to generate dynamic payment QR codes for Indonesian payment systems.

## Features

- 🚀 Convert static QRIS to dynamic QRIS
- 💰 Set custom transaction amounts
- 📊 Support for percentage or fixed fee
- ✅ QRIS validation with detailed error messages
- 📦 TypeScript support with full type definitions
- 🪶 Lightweight with zero dependencies
- 🧪 Thoroughly tested

## Installation

```bash
npm install @januarfonti/qris-dynamic-conversion
```

Or using yarn:

```bash
yarn add @januarfonti/qris-dynamic-conversion
```

Or using pnpm:

```bash
pnpm add @januarfonti/qris-dynamic-conversion
```

## Usage

### Basic Usage

```typescript
import { generateDynamicQRIS } from '@januarfonti/qris-dynamic-conversion'

const staticQRIS = 'YOUR_STATIC_QRIS_STRING_HERE'

// Convert to dynamic QRIS with amount only
const dynamicQRIS = generateDynamicQRIS({
  qrisStatic: staticQRIS,
  amount: 50000 // IDR 50,000
})

console.log(dynamicQRIS)
```

### With Percentage Fee

```typescript
import { generateDynamicQRIS } from '@januarfonti/qris-dynamic-conversion'

const dynamicQRIS = generateDynamicQRIS({
  qrisStatic: staticQRIS,
  amount: 100000, // IDR 100,000
  taxType: 'p',  // percentage
  fee: 2.5        // 2.5% fee
})
```

### With Fixed Amount Fee

```typescript
import { generateDynamicQRIS } from '@januarfonti/qris-dynamic-conversion'

const dynamicQRIS = generateDynamicQRIS({
  qrisStatic: staticQRIS,
  amount: 100000, // IDR 100,000
  taxType: 'r',  // rupiah (fixed amount)
  fee: 1000       // IDR 1,000 fee
})
```

### QRIS Validation

```typescript
import { validateQRIS } from '@januarfonti/qris-dynamic-conversion'

const validationResult = validateQRIS(qrisString)

if (validationResult.isValid) {
  console.log('QRIS is valid!')
} else {
  console.log('QRIS validation errors:', validationResult.errors)
}
```

## API Reference

### `generateDynamicQRIS(options)`

Converts a static QRIS to dynamic QRIS with specified amount and optional fee.

#### Parameters

- `options` (GenerateDynamicQRISOptions): Configuration object with the following properties:
  - `qrisStatic` (string): The static QRIS string to convert
  - `amount` (string | number): Transaction amount in IDR
  - `taxType` (optional, 'p' | 'r'): Type of fee - 'p' for percentage, 'r' for rupiah (fixed amount). Default: 'p'
  - `fee` (optional, string | number): Fee value. Default: '0'

#### Returns

- `string`: The generated dynamic QRIS string

#### Throws

- `Error`: If the input QRIS is invalid or amount is zero

### `validateQRIS(qris)`

Validates a QRIS string and returns detailed validation results.

#### Parameters

- `qris` (string): The QRIS string to validate

#### Returns

- `QRISValidationResult`: Object containing:
  - `isValid` (boolean): Whether the QRIS is valid
  - `errors` (string[]): Array of validation error messages

### Utility Functions

The library also exports utility functions that can be used independently:

- `pad(num)`: Pad a number with leading zeros
- `toCRC16(data)`: Calculate CRC16 checksum
- `isValidQRIS(qris)`: Quick validation check

## Examples

### Integration with Nuxt 3

```vue
<template>
  <div>
    <input v-model="amount" type="number" placeholder="Enter amount" />
    <button @click="generateQRIS">Generate Dynamic QRIS</button>
    <div v-if="dynamicQRIS">
      <p>{{ dynamicQRIS }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generateDynamicQRIS } from '@januarfonti/qris-dynamic-conversion'

const amount = ref(0)
const dynamicQRIS = ref('')
const staticQRIS = 'YOUR_STATIC_QRIS_HERE'

const generateQRIS = () => {
  try {
    dynamicQRIS.value = generateDynamicQRIS({
      qrisStatic: staticQRIS,
      amount: amount.value
    })
  } catch (error) {
    console.error('Error generating QRIS:', error)
  }
}
</script>
```

### Integration with Next.js

```tsx
import { useState } from 'react'
import { generateDynamicQRIS } from '@januarfonti/qris-dynamic-conversion'

export default function QRISGenerator() {
  const [amount, setAmount] = useState('')
  const [dynamicQRIS, setDynamicQRIS] = useState('')
  const staticQRIS = 'YOUR_STATIC_QRIS_HERE'

  const handleGenerate = () => {
    try {
      const result = generateDynamicQRIS({
        qrisStatic: staticQRIS,
        amount: amount
      })
      setDynamicQRIS(result)
    } catch (error) {
      console.error('Error generating QRIS:', error)
    }
  }

  return (
    <div>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount" 
      />
      <button onClick={handleGenerate}>Generate Dynamic QRIS</button>
      {dynamicQRIS && <p>{dynamicQRIS}</p>}
    </div>
  )
}
```

## How It Works

The library performs the following operations:

1. **Validates** the input static QRIS format
2. **Removes** the old CRC16 checksum
3. **Replaces** the static identifier (010211) with dynamic identifier (010212)
4. **Inserts** the amount tag (tag 54) with the specified value
5. **Adds** optional fee tag (tag 55) if specified
6. **Recalculates** the CRC16 checksum for the modified data
7. **Returns** the complete dynamic QRIS string

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Januar Fonti**
- GitHub: [@januarfonti](https://github.com/januarfonti)

## Acknowledgments

- Bank Indonesia for QRIS specifications
- The Indonesian fintech community

## Support

If you found this project helpful, please consider giving it a ⭐️ on [GitHub](https://github.com/januarfonti/qris-dynamic-conversion)!