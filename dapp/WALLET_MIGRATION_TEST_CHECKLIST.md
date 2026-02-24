# Stellar Wallet Kit Migration - Testing Checklist

## Pre-Test Setup

- [ ] Ensure `USE_NEW_WALLET_KIT=true` is set in environment
- [ ] Verify all three wallets are installed/available in browser
- [ ] Open browser developer console for error tracking
- [ ] Test on both Testnet and Mainnet if possible

## Test Case 1: Freighter Wallet

### Connection
- [ ] Click "Connect" button
- [ ] Modal appears with wallet options
- [ ] Freighter appears in wallet list
- [ ] Click Freighter and approve connection
- [ ] Button changes to "Profile"
- [ ] Public key is stored correctly

### Transactions
- [ ] Create a test Soroban transaction
- [ ] Click sign button
- [ ] Freighter extension prompts for signature
- [ ] Transaction is signed successfully
- [ ] Response shows correct return value

### Disconnection
- [ ] Click "Profile" button
- [ ] Disconnect option appears
- [ ] Click disconnect
- [ ] Button returns to "Connect"
- [ ] localStorage is cleared

### Network Switching (Freighter)
- [ ] Switch network in Freighter extension
- [ ] App detects network mismatch (console warning)
- [ ] Reconnect with new network
- [ ] Transaction uses correct network

---

## Test Case 2: xBull Wallet

### Connection
- [ ] Click "Connect" button
- [ ] Modal appears
- [ ] xBull appears in wallet list
- [ ] Click xBull and approve connection
- [ ] Verify public key matches xBull account
- [ ] Button changes to "Profile"

### Transactions
- [ ] Create a test transaction
- [ ] Click sign button
- [ ] xBull wallet shows signing prompt
- [ ] Approve in xBull
- [ ] Transaction is signed and submitted
- [ ] Response is correct

### Account Funding
- [ ] Ensure xBull account has funds
- [ ] If unfunded, funding notification should appear
- [ ] Funding modal should show network info
- [ ] Can proceed if funded

---

## Test Case 3: Albedo Wallet

### Connection
- [ ] Click "Connect" button
- [ ] Albedo appears in list
- [ ] Click Albedo
- [ ] Albedo browser window/tab appears
- [ ] Approve connection in Albedo
- [ ] App recognizes connection
- [ ] Button shows "Profile"

### Transactions
- [ ] Create test transaction
- [ ] Trigger signing
- [ ] Albedo shows signing confirmation
- [ ] Approve signature
- [ ] Transaction submitted successfully
- [ ] Correct return value received

### Session Management
- [ ] Reload page
- [ ] Public key should be restored from localStorage
- [ ] Don't need to reconnect
- [ ] Transaction still works after reload

---

## Test Case 4: Feature Flag Fallback

### With Legacy Version
- [ ] Set `USE_NEW_WALLET_KIT=false`
- [ ] Restart dev server
- [ ] Connect with each wallet (Freighter, xBull, Albedo)
- [ ] All three should still work
- [ ] Console should show "[StellarWalletsKit] ✅ LEGACY npm v1.9.5 initialized"

### With New JSR Version
- [ ] Set `USE_NEW_WALLET_KIT=true`
- [ ] Restart dev server
- [ ] Connect with each wallet
- [ ] All three should work with new version
- [ ] Console should show "[StellarWalletsKit] ✅ NEW JSR version initialized"

### Fallback Mechanism
- [ ] Temporarily break JSR import (rename package)
- [ ] `USE_NEW_WALLET_KIT=true` should still work (fallback to legacy)
- [ ] Console shows "[StellarWalletsKit] ⚠️ Fallback to legacy npm v1.9.5"
- [ ] Wallets still functional

---

## Test Case 5: Error Handling

### Network Errors
- [ ] Disconnect network while signing
- [ ] App should show appropriate error message
- [ ] User can retry

### Invalid Network
- [ ] Set wallet to different network than app expects
- [ ] App detects mismatch
- [ ] Shows error or notification
- [ ] User can switch network

### Unfunded Wallet
- [ ] Use unfunded account
- [ ] Funding check triggers
- [ ] Modal shows unfunded message
- [ ] Network info is correct

### Transaction Failures
- [ ] Trigger a transaction that will fail (bad data, etc.)
- [ ] Error message is displayed
- [ ] User can retry
- [ ] No stuck states

---

## Test Case 6: State Management

### localStorage Persistence
- [ ] Connect wallet
- [ ] Reload page with F5
- [ ] Public key should still be set
- [ ] Button should show "Profile" without reconnecting
- [ ] localStorage contains: `publicKey` and `walletProvider`

### Multiple Wallets
- [ ] Connect with Freighter
- [ ] Disconnect
- [ ] Connect with xBull
- [ ] Verify only xBull is stored
- [ ] Disconnect
- [ ] Connect with Albedo
- [ ] Verify only Albedo is stored

### Timeout Handling
- [ ] Leave page idle for 5+ minutes
- [ ] Connection should remain valid
- [ ] Transaction signing should still work
- [ ] No unexpected disconnections

---

## Test Case 7: UI/UX

### Modal Behavior
- [ ] Connect modal closes after selection
- [ ] Can't open multiple modals simultaneously
- [ ] Modal is responsive on mobile

### Button States
- [ ] "Connect" button before connection
- [ ] "Profile" button after connection
- [ ] Button text and icon update correctly
- [ ] Button disabled states work properly

### Loading States
- [ ] Signing shows loading indicator (if applicable)
- [ ] Transaction submission shows progress
- [ ] No missing state feedback

---

## Test Case 8: Cross-Browser

### Desktop Browsers
- [ ] Chrome/Chromium 
  - [ ] Freighter: Works
  - [ ] xBull: Works
  - [ ] Albedo: Works
- [ ] Firefox
  - [ ] Freighter: Works
  - [ ] xBull: Works
  - [ ] Albedo: Works
- [ ] Safari (if applicable)
  - [ ] Freighter: Works
  - [ ] xBull: Works
  - [ ] Albedo: Works

### Mobile Browsers
- [ ] iOS Safari
  - [ ] WalletConnect should work
- [ ] Android Chrome
  - [ ] WalletConnect should work

---

## Console Output Verification

Expected console messages (in order):

```javascript
// On page load:
[WalletKit] Initialized with strategy: NEW (JSR)
// or
[WalletKit] Initialized with strategy: LEGACY (npm v1.9.5)

// On first kit initialization:
[StellarWalletsKit] Initializing NEW JSR version...
[StellarWalletsKit] ✅ NEW JSR version initialized
// or fallback:
[StellarWalletsKit] ✅ LEGACY npm v1.9.5 initialized

// On wallet connection:
Connected to: [wallet name]
```

---

## Sign-Off

- [ ] All test cases passed with `USE_NEW_WALLET_KIT=true`
- [ ] All test cases passed with `USE_NEW_WALLET_KIT=false`
- [ ] No console errors detected
- [ ] Freighter verified working
- [ ] xBull Wallet verified working
- [ ] Albedo verified working
- [ ] Fallback mechanism works
- [ ] No breaking changes to existing functionality

**Tested By**: ________________  
**Date**: ________________  
**Notes**: ________________

---

## Rollback Instructions

If any test fails:

1. Set `USE_NEW_WALLET_KIT=false`
2. Restart dev server
3. Re-test failing case
4. If legacy version works, issue is with new JSR version
5. Report issue with:
   - Console output
   - Wallet name (Freighter/xBull/Albedo)
   - Reproduction steps
   - Error message (if any)
