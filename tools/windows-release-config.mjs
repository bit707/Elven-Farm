import { existsSync, readFileSync } from "node:fs";

const CONFIG_PATH = "windows-release.config.json";

function readJsonConfig() {
  if (!existsSync(CONFIG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch (error) {
    throw new Error(`Invalid ${CONFIG_PATH}: ${error.message}`);
  }
}

function valueFrom(envName, config, key, fallback = "") {
  const value = process.env[envName] || config[key] || fallback;
  return String(value).trim();
}

function boolFrom(envName, config, key) {
  const raw = process.env[envName] ?? config[key] ?? false;
  return raw === true || String(raw).toLowerCase() === "true";
}

export function readWindowsReleaseConfig() {
  const config = readJsonConfig();
  const signedExePath = valueFrom("XIANNONG_SIGNED_EXE_PATH", config, "signed_exe_path");
  const signatureEvidencePath = valueFrom("XIANNONG_SIGNATURE_EVIDENCE_PATH", config, "signature_evidence_path");
  const steamworksEvidencePath = valueFrom("XIANNONG_STEAMWORKS_EVIDENCE_PATH", config, "steamworks_evidence_path");
  const steamworksSdkReady = boolFrom("XIANNONG_STEAMWORKS_SDK_READY", config, "steamworks_sdk_ready");
  const signatureReady = Boolean(signedExePath && signatureEvidencePath);

  return {
    signedExePath,
    signatureEvidencePath,
    steamworksEvidencePath,
    signatureReady,
    steamworksSdkReady,
    configured: signatureReady || steamworksSdkReady || Boolean(steamworksEvidencePath),
    source: existsSync(CONFIG_PATH) ? CONFIG_PATH : "defaults_or_environment",
  };
}
