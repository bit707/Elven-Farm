import { existsSync, readFileSync } from "node:fs";

const CONFIG_PATH = "steam-release.config.json";

function readJsonConfig() {
  if (!existsSync(CONFIG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch (error) {
    throw new Error(`Invalid ${CONFIG_PATH}: ${error.message}`);
  }
}

function valueFrom(envName, config, key, fallback) {
  const value = process.env[envName] || config[key] || fallback;
  return String(value).trim();
}

export function readSteamReleaseConfig() {
  const config = readJsonConfig();
  const appId = valueFrom("XIANNONG_STEAM_APP_ID", config, "app_id", "TBD_APP_ID");
  const depotId = valueFrom("XIANNONG_STEAM_DEPOT_ID", config, "depot_id", "TBD_DEPOT_ID");
  const branch = valueFrom("XIANNONG_STEAM_BRANCH", config, "branch", "demo_candidate");
  const description = valueFrom(
    "XIANNONG_STEAM_BUILD_DESC",
    config,
    "build_desc",
    "Xiannong Dongtian demo candidate",
  );
  const configured = !appId.includes("TBD") && !depotId.includes("TBD");

  return {
    appId,
    depotId,
    branch,
    description,
    configured,
    source: existsSync(CONFIG_PATH) ? CONFIG_PATH : "defaults_or_environment",
  };
}
