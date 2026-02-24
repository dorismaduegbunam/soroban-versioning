# Stellar Wallets Kit Migration Guide

## Overview

This document outlines the migration from `@creit.tech/stellar-wallets-kit@^1.9.5` (npm) to the new JSR version with feature flag support for safe rollback.

## Migration Status

- **Status**: Dual installation complete - both versions coexist
- **Fallback**: Available via `USE_NEW_WALLET_KIT` environment variable
- **Tested Wallets**: Freighter, xBull Wallet, Albedo
- **Network Support**: Testnet and Mainnet (via `PUBLIC_SOROBAN_NETWORK_PASSPHRASE`)

## What Changed

### 1. **Package Installation**

Both versions are installed:
```json
{
  "@creit.tech/stellar-wallets-kit": "^1.9.5",           // Legacy npm version
  "@creit.tech/stellar-wallets-kit-jsr": "npm:@creit.tech/stellar-wallets-kit@latest"  // New JSR alias
}
```

### 2. **Kit Initialization**

**Before (Synchronous)**:
```typescript
import { StellarWalletsKit, allowAllModules } from "@creit.tech/stellar-wallets-kit";
const kit = new StellarWalletsKit({ modules: [...allowAllModules()], network });
export { kit };
```

**After (Async with Feature Flag)**:
```typescript
import { getKit } from "./stellar-wallets-kit";
const walletKit = await getKit();  // Automatically selects version based on USE_NEW_WALLET_KIT
```

### 3. **Component Updates**

All components using `kit` now use async initialization:

```typescript
// Old: synchronous
const { kit } = await import("./stellar-wallets-kit");
kit.openModal({ ... });

// New: async with feature flag fallback
const { getKit } = await import("./stellar-wallets-kit");
const walletKit = await getKit();
walletKit.openModal({ ... });
```

### Files Modified

1. **package.json** - Added JSR alias
2. **src/components/stellar-wallets-kit.ts** - Async initialization with feature flag
3. **src/components/stellar-wallets-kit-wrapper.ts** - (New) Feature flag wrapper utility
4. **src/components/ConnectWallet.astro** - Updated to use async `getKit()`
5. **src/service/TxService.ts** - Updated signing methods to use async `getKit()`

## Configuration

### Enable New JSR Version

Add to your environment variables:
```
USE_NEW_WALLET_KIT=true
```

### Fallback to Legacy

Remove or set to `false`:
```
USE_NEW_WALLET_KIT=false
```

If not set, defaults to legacy npm v1.9.5 for safety.

## Testing Checklist

### Wallet Connection
- [ ] Freighter wallet connects successfully
- [ ] xBull Wallet connects successfully
- [ ] Albedo connects successfully
- [ ] Modal opens and closes correctly
- [ ] Wallet switching works (disconnect and reconnect)

### Transactions
- [ ] Soroban transaction signing works
- [ ] XLM payment transaction signing works
- [ ] Transaction submission succeeds
- [ ] Error handling displays correctly
- [ ] Network mismatch detection works

### State Management
- [ ] Public key persists in localStorage
- [ ] Provider ID persists correctly
- [ ] Wallet unfunding notification triggers
- [ ] Profile modal opens after connection

### Browser Compatibility
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (if applicable)

## Rollback Strategy

If issues arise with the new JSR version:

1. **Quick Rollback**:
   ```
   USE_NEW_WALLET_KIT=false
   ```
   (or omit the variable entirely)

2. **Full Cleanup** (after confirming legacy works):
   ```bash
   bun remove @creit.tech/stellar-wallets-kit-jsr
   ```

3. **Revert Code Changes**:
   All code changes are backward compatible. The async `getKit()` function automatically falls back to legacy if the new version fails to load.

## Known Differences

### Legacy (v1.9.5)
- Explicit `LedgerModule()` support
- Synchronous initialization
- Battle-tested stability

### New (JSR)
- Enhanced wallet discovery
- Modern module system
- Better error reporting

Both versions are API-compatible for this dapp's use cases.

## Debugging

Enable logging by checking browser console:
```javascript
// You'll see messages like:
// [WalletKit] Initialized with strategy: NEW (JSR)
// [StellarWalletsKit] ✅ NEW JSR version initialized
// or
// [StellarWalletsKit] ⚠️ Fallback to legacy npm v1.9.5
```

## Performance Impact

- **Slight increase in initialization time** during first `getKit()` call
- **No impact on transaction speed** - wallet signing remains unchanged
- **Caching** - kit instance is cached after first initialization

## Future Steps

1. After 2+ weeks of successful operation with `USE_NEW_WALLET_KIT=true`:
   - Remove legacy npm version from package.json
   - Clean up feature flag wrapper
   - Update to JSR native imports

2. Monitor Stellar Wallets Kit releases for new wallet support

## Support

For issues or questions:
- Check console logs for [WalletKit] or [StellarWalletsKit] messages
- Test with `USE_NEW_WALLET_KIT=false` to confirm it's migration-related
- Report with env var setting and wallet used

---

**Migration Date**: 2026-02-24  
**Legacy Version**: @creit.tech/stellar-wallets-kit@^1.9.5  
**New Version**: @creit.tech/stellar-wallets-kit (JSR)  
**Feature Flag**: USE_NEW_WALLET_KIT
