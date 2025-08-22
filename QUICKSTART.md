# Quick Start Guide

## Installation

```bash
npm install @januarfonti/qris-dynamic-conversion
```

## Basic Usage

```javascript
const { generateDynamicQRIS } = require('@januarfonti/qris-dynamic-conversion')
// or using ES modules
// import { generateDynamicQRIS } from '@januarfonti/qris-dynamic-conversion'

// Your static QRIS
const staticQRIS = 'YOUR_STATIC_QRIS_HERE'

// Convert to dynamic QRIS with amount
const dynamicQRIS = generateDynamicQRIS({
  qrisStatic: staticQRIS,
  amount: 50000  // IDR 50,000
})

console.log(dynamicQRIS)
```

## Publishing to NPM

1. Make sure you're logged in to NPM:
   ```bash
   npm login
   ```

2. Update the version in package.json if needed:
   ```bash
   npm version patch  # or minor/major
   ```

3. Publish to NPM:
   ```bash
   npm publish
   ```

## Using in Your Projects

### Nuxt 3 Example

```vue
<template>
  <div>
    <input v-model.number="amount" type="number" placeholder="Enter amount" />
    <button @click="generateQRIS">Generate Dynamic QRIS</button>
    <div v-if="dynamicQRIS">
      <pre>{{ dynamicQRIS }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generateDynamicQRIS } from '@januarfonti/qris-dynamic-conversion'

const amount = ref(0)
const dynamicQRIS = ref('')

// Your static QRIS
const staticQRIS = '00020101021126610014COM.GO-JEK.WWW01189360091434035299640210G4035299640303UMI51440014ID.CO.QRIS.WWW0215ID10253753027970303UMI5204581553033605802ID5924Anjani Falisha Kikanaya,6006MALANG61056513962070703A0163042735'

const generateQRIS = () => {
  try {
    dynamicQRIS.value = generateDynamicQRIS({
      qrisStatic: staticQRIS,
      amount: amount.value
    })
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>
```

## GitHub Repository Setup

1. Create a new repository on GitHub: https://github.com/new
   - Name: `qris-dynamic-conversion`
   - Description: "QRIS Static to Dynamic Converter - TypeScript/JavaScript library"

2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: QRIS Dynamic Conversion library"
   git branch -M main
   git remote add origin https://github.com/januarfonti/qris-dynamic-conversion.git
   git push -u origin main
   ```

3. Add NPM token to GitHub Secrets:
   - Go to Settings > Secrets and variables > Actions
   - Add new secret: `NPM_TOKEN` with your NPM access token

## Testing

Run tests locally:
```bash
npm test
```

Build the library:
```bash
npm run build
```

## Support

If you have any questions or issues, please open an issue on GitHub.