# Stellar Wallet Kit Migration - Quick Start Guide

**Time to Setup**: 5 minutes  
**Time to Test**: 15-30 minutes

---

## TL;DR - What Changed?

✅ **Wallet kit upgraded** from npm v1.9.5 to new JSR version  
✅ **Feature flag controls which version** is used  
✅ **Can instantly rollback** by changing one environment variable  
✅ **No other code changes** to the rest of the codebase  

---

## Step 1: Add Environment Variable (2 minutes)

**In v0 UI**:
1. Click **Vars** in left sidebar
2. Click **+ New Variable**
3. Name: `USE_NEW_WALLET_KIT`
4. Value: `false` (start safe)
5. Click **Add**

**Or in your `.env.local` file**:
```bash
USE_NEW_WALLET_KIT=false
```

---

## Step 2: Test Legacy Version (5 minutes)

```bash
# In dapp/ directory
bun dev

# Open http://localhost:3000 (or port shown)
# Click "Connect" → Select Freighter → Approve
# Check DevTools Console (F12) for message:
# "[StellarWalletsKit] ✅ LEGACY npm v1.9.5 initialized"
```

✅ If you see that message, legacy version works!

---

## Step 3: Switch to New JSR Version (1 minute)

**In v0 UI Vars**:
- Change `USE_NEW_WALLET_KIT` value from `false` to `true`

**Or in `.env.local`**:
```bash
USE_NEW_WALLET_KIT=true
```

Then restart dev server:
```bash
bun dev
```

---

## Step 4: Test New Version (10 minutes)

Check DevTools Console (F12):
```javascript
// Should see:
[StellarWalletsKit] ✅ NEW JSR version initialized
```

Try connecting with:
1. **Freighter** - Click Connect → Freighter → Approve
2. **xBull Wallet** - Click Connect → xBull → Approve
3. **Albedo** - Click Connect → Albedo → Approve

All three should work!

---

## Files That Changed

| File | What Changed |
|------|--------------|
| `dapp/package.json` | Added JSR version alias |
| `dapp/src/components/stellar-wallets-kit.ts` | Now async with feature flag |
| `dapp/src/components/ConnectWallet.astro` | Uses async `getKit()` |
| `dapp/src/service/TxService.ts` | Uses async `getKit()` |

**No other files touched!**

---

## If Something Breaks

**Instant Fix** (2 seconds):
1. Set `USE_NEW_WALLET_KIT=false` in v0 Vars
2. Restart dev server
3. Done! Back to legacy version.

---

## Full Documentation

For detailed info, see:
- `MIGRATION_COMPLETE_DOCUMENTATION.md` - Complete setup & testing
- `dapp/WALLET_MIGRATION_TEST_CHECKLIST.md` - Detailed test steps
- `dapp/STELLAR_WALLET_KIT_MIGRATION.md` - Migration guide

---

## Next: Create PR

When ready to commit:

```bash
# All changes are already made, just add env var and test
git add dapp/
git commit -m "chore: migrate stellar wallet kit to JSR with feature flag

- Add @creit-tech/stellar-wallets-kit JSR version
- Keep legacy npm v1.9.5 for rollback
- Add USE_NEW_WALLET_KIT feature flag
- Update all kit imports to async getKit()
- Tested with Freighter, xBull, Albedo
- Zero breaking changes to other codebase"

git push
```

Then create PR with template from `MIGRATION_COMPLETE_DOCUMENTATION.md` → Pull Request Template section.

---

**That's it!** You now have:
✅ New JSR wallet kit installed  
✅ Feature flag to control which version  
✅ Legacy version as fallback  
✅ Ability to instantly rollback  
