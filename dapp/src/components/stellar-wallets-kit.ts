/**
 * Stellar Wallets Kit Initialization
 * 
 * Uses feature flag (USE_NEW_WALLET_KIT env var) to switch between:
 * - Legacy: @creit.tech/stellar-wallets-kit@^1.9.5 (npm)
 * - New: @creit.tech/stellar-wallets-kit (JSR)
 * 
 * Both versions maintain API compatibility for this dapp's usage.
 */

let _kitInstance: any = null;
const useNewKit = import.meta.env.USE_NEW_WALLET_KIT === "true";

async function initializeKit(): Promise<any> {
  if (_kitInstance) {
    return _kitInstance;
  }

  if (useNewKit) {
    console.log("[StellarWalletsKit] Initializing NEW JSR version...");
    try {
      // New JSR version import
      const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit-jsr");

      _kitInstance = new StellarWalletsKit();
      
      // Configure network after initialization if needed
      // @ts-ignore
      _kitInstance.network = import.meta.env.PUBLIC_SOROBAN_NETWORK_PASSPHRASE;

      console.log("[StellarWalletsKit] ✅ NEW JSR version initialized");
      return _kitInstance;
    } catch (error) {
      console.error(
        "[StellarWalletsKit] ❌ Failed to initialize new JSR version, falling back to legacy:",
        error,
      );
      return initializeLegacyKit();
    }
  } else {
    return initializeLegacyKit();
  }
}

function initializeLegacyKit(): any {
  console.log("[StellarWalletsKit] Initializing LEGACY npm v1.9.5...");

  const {
    allowAllModules,
    StellarWalletsKit,
  } = require("@creit.tech/stellar-wallets-kit");
  const { LedgerModule } = require("@creit.tech/stellar-wallets-kit/modules/ledger.module");

  _kitInstance = new StellarWalletsKit({
    modules: [...allowAllModules(), new LedgerModule()],
    // @ts-ignore
    network: import.meta.env.PUBLIC_SOROBAN_NETWORK_PASSPHRASE,
  });

  console.log("[StellarWalletsKit] ✅ LEGACY npm v1.9.5 initialized");
  return _kitInstance;
}

/**
 * Get or initialize the wallet kit
 * Safe to call multiple times - uses cached instance
 */
export async function getKit(): Promise<any> {
  if (!_kitInstance) {
    await initializeKit();
  }
  return _kitInstance;
}

// For backward compatibility, export a promise-based kit
export const kit = (async () => {
  await initializeKit();
  return _kitInstance as any;
})();

export { useNewKit };
