/**
 * Stellar Wallets Kit Wrapper with Feature Flag
 * 
 * This module manages the dual wallet kit implementation during migration.
 * Allows switching between v1.9.5 (npm) and new JSR version without code changes.
 * 
 * Environment variable: USE_NEW_WALLET_KIT
 * - undefined/false: Use old npm v1.9.5 (@creit.tech/stellar-wallets-kit)
 * - true: Use new JSR version (@creit.tech/stellar-wallets-kit-jsr)
 */

type WalletKit = any;

let cachedKit: WalletKit | null = null;
const useNewKit = import.meta.env.USE_NEW_WALLET_KIT === "true";

console.log(
  "[WalletKit] Initialized with strategy:",
  useNewKit ? "NEW (JSR)" : "LEGACY (npm v1.9.5)",
);

/**
 * Get the appropriate wallet kit instance (old or new)
 */
async function getWalletKit(): Promise<WalletKit> {
  if (cachedKit) {
    return cachedKit;
  }

  if (useNewKit) {
    console.log("[WalletKit] Loading NEW JSR version...");
    try {
      // Import from the new JSR version (aliased as stellar-wallets-kit-jsr)
      const kitModule = await import("@creit.tech/stellar-wallets-kit-jsr");
      cachedKit = kitModule;
      console.log("[WalletKit] ✅ New JSR version loaded successfully");
      return cachedKit;
    } catch (error) {
      console.error(
        "[WalletKit] ❌ Failed to load new JSR version, falling back to legacy:",
        error,
      );
      // Fallback to legacy
      cachedKit = await import("@creit.tech/stellar-wallets-kit");
      console.log("[WalletKit] ⚠️ Fallback to legacy npm v1.9.5");
      return cachedKit;
    }
  } else {
    console.log("[WalletKit] Loading LEGACY npm v1.9.5...");
    cachedKit = await import("@creit.tech/stellar-wallets-kit");
    console.log("[WalletKit] ✅ Legacy npm v1.9.5 loaded successfully");
    return cachedKit;
  }
}

export { getWalletKit, useNewKit };
