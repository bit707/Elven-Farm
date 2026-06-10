export const SAVE_KEY = "xiannong_dongtian_p0_save";
export const SAVE_PROFILE_ID = "profile_1";
export const SETTINGS_KEY = "xiannong_dongtian_settings";
export const ERROR_LOG_KEY = "xiannong_dongtian_error_log";
export const ACHIEVEMENT_KEY = "xiannong_dongtian_achievements";
export const CLOUD_SAVE_KEY = "xiannong_dongtian_steam_cloud_mirror";
export const PLATFORM_STATE_KEY = "xiannong_dongtian_platform_state";
export const SAVE_SCHEMA_VERSION = 2;

export const BUILD_INFO = {
  version: "0.2.0-demo",
  phase: "P0/P1 Demo Foundation",
  steamAppId: "TBD",
  buildDate: "2026-06-02",
};

export const STEAMWORKS_BRIDGE = {
  adapterId: "steamworks-adapter-v1",
  expectedGlobal: "XiannongSteamworks",
  appId: BUILD_INFO.steamAppId,
  cloudPath: "steam_cloud/xiannong_dongtian_profile.json",
  overlayTarget: "store",
  requiredFeatures: ["achievements", "remote_storage", "overlay", "stats"],
};
