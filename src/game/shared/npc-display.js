function fallbackLocalize(key, fallback = key) {
  return fallback;
}

function resolveLocalize(localize) {
  return typeof localize === "function" ? localize : fallbackLocalize;
}

export function npcNameData(npcId, options = {}) {
  if (npcId === "player") return "你";
  if (npcId === "spirit_group") return "精怪们";

  const text = resolveLocalize(options.localize);
  const npc = options.npcsById?.get?.(npcId);
  if (npc) return text(npc.npc_name_key, npcId);

  const spiritInstance = options.spirits?.find?.((spirit) => spirit.id === npcId);
  if (spiritInstance?.name) return spiritInstance.name;

  const spirit = options.spiritCatalog?.find?.((entry) => entry.spirit_id === npcId);
  if (spirit) return text(spirit.spirit_name_key, npcId);
  return npcId;
}

export function npcPortraitSrcData(npcId = "", options = {}) {
  const assetSources = options.assetSources || {};
  const assetSrc = typeof options.assetSrc === "function" ? options.assetSrc : (src) => src;
  return assetSources[npcId] ? assetSrc(assetSources[npcId]) : assetSrc("assets/customer-villager.svg");
}

export function npcPortraitImageData(npcId = "", images = {}) {
  return images[npcId] || images.customer || null;
}
