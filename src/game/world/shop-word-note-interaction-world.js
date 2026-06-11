function noteTitle(title = "") {
  return String(title || "").replace(" · 可点", "");
}

export function shopWordNoteInteractionTargetsWorld({
  shopWordOfMouthNote = null,
  shopWordOfMouthMissingShelfNote = null,
  shopWordOfMouthReadyShelfEcho = null,
} = {}) {
  const targets = [];

  if (shopWordOfMouthNote) {
    targets.push({
      id: shopWordOfMouthNote.id,
      type: "shop_word_of_mouth_note",
      label: shopWordOfMouthNote.title,
      visitActive: shopWordOfMouthNote.visitActive,
      rect: shopWordOfMouthNote.rect,
    });
  }

  if (shopWordOfMouthMissingShelfNote) {
    targets.push({
      id: shopWordOfMouthMissingShelfNote.id,
      type: "shop_word_of_mouth_missing_shelf_note",
      label: shopWordOfMouthMissingShelfNote.title,
      itemId: shopWordOfMouthMissingShelfNote.itemId,
      rect: shopWordOfMouthMissingShelfNote.rect,
    });
  }

  if (shopWordOfMouthReadyShelfEcho) {
    targets.push({
      id: shopWordOfMouthReadyShelfEcho.id,
      type: "shop_word_of_mouth_ready_shelf_echo",
      label: shopWordOfMouthReadyShelfEcho.title,
      itemId: shopWordOfMouthReadyShelfEcho.itemId,
      rect: shopWordOfMouthReadyShelfEcho.rect,
    });
  }

  return targets;
}

export function shopWordOfMouthNoteFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: spec.selector,
    fallbackSelector: "#shopReport",
    label: `点选铺前来帖：${noteTitle(spec.title)}`,
    log: `${spec.headline}。${spec.routeText}；${spec.detail} ${spec.safeNote}。`,
    panelGroup: "core",
    missingTitle: "点选铺前市闻来帖",
    missingLog: `旧铺市闻或来帖卡暂时没有找到，先打开旧铺经营报告查看最近口碑。${spec.safeNote}。`,
  };
}

export function shopWordOfMouthNoteFocusTargetWorld({ spec = null } = {}) {
  return shopWordOfMouthNoteFocusSpecWorld({ spec });
}

export function shopWordOfMouthMissingShelfSpecWorld({
  wordSpec = null,
  day = 1,
  inventory = {},
  standingSupply = null,
  leadItemId = "",
  tagCandidate = null,
  desiredTags = [],
  itemNameText = "",
  desiredCount = 2,
  route = null,
  tags = [],
  hotTag = "",
  hotTagLabel = "对口货",
  customerName = "来帖客",
  sourceLabel = "铺前市闻",
  have = 0,
  selector = ".shop-word-of-mouth",
  safeNote = "",
  title = "来帖缺货签 · 可点",
  headline = "来帖到了，头排还空着",
  routeText = "市闻来客 -> 头排缺货 -> 先补路线",
} = {}) {
  if (!wordSpec) return null;
  const standingRow = standingSupply?.focusRow || null;
  const itemId = standingRow?.itemId || leadItemId || tagCandidate?.itemId || "";
  const finalTags = itemId ? tags : desiredTags;
  const finalHotTag = hotTag || finalTags[0] || "";
  const finalItemName = standingRow?.itemName || itemNameText || wordSpec.leadItemName || wordSpec.hotTagLabel || "对口货";
  const finalHave = itemId ? Number(inventory[itemId] || have || 0) : Number(have || 0);
  const routeLabel = route
    ? `${route.label}：${route.title}`
    : itemId
      ? `先补 ${finalItemName}`
      : `先补 ${hotTagLabel || finalHotTag || "对口货"}`;
  return {
    active: true,
    id: "shop_word_of_mouth_missing_shelf_note",
    key: `${day}:${wordSpec.id || "word"}:${itemId || finalHotTag}:${finalHave}:${desiredCount}`,
    title,
    headline,
    detail: itemId
      ? `${customerName}会顺着${sourceLabel}来认${finalItemName}，当前只有 ${finalHave}/${desiredCount}。`
      : `${customerName}会顺着${sourceLabel}来认${hotTagLabel || finalHotTag || "对口货"}，先找一条能补货的路线。`,
    sourceLabel,
    customerName,
    itemId,
    itemName: finalItemName,
    have: finalHave,
    desiredCount,
    hotTag: finalHotTag,
    hotTagLabel: hotTagLabel || "对口货",
    routeText,
    routeLabel,
    routeAction: route?.action || (itemId ? "shop" : ""),
    routeRecipeId: route?.recipeId || "",
    routeSeedId: route?.seedId || "",
    routeShopTag: route?.shopTag || finalHotTag || "",
    routeItemId: route?.itemId || itemId || "",
    selector,
    safeNote,
    rect: { x: 386, y: 112, width: 316, height: 112 },
    anchor: { x: 678, y: 236 },
  };
}

export function shopWordOfMouthMissingShelfFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: spec.selector,
    fallbackSelector: "#shopReport",
    label: "点选来帖缺货签",
    log: `${spec.detail}${spec.routeText}；${spec.safeNote}。`,
    panelGroup: "core",
    missingTitle: "点选来帖缺货签",
    missingLog: `旧铺市闻或补货路线暂时没有找到，先打开旧铺经营报告查看最近口碑。${spec.safeNote}。`,
  };
}

export function shopWordOfMouthMissingShelfFocusTargetWorld({ spec = null } = {}) {
  return shopWordOfMouthMissingShelfFocusSpecWorld({ spec });
}

export function shopWordOfMouthMissingShelfShopFocusTargetWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: spec.selector,
    fallbackSelector: "#shopReport",
    missingTitle: "点选来帖缺货签",
    missingLog: `旧铺市闻或来帖卡暂时没有找到，先打开旧铺经营报告查看最近口碑。${spec.safeNote}。`,
  };
}

export function shopWordOfMouthMissingShelfLogWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    title: "点选来帖缺货签",
    log: `${spec.detail}${spec.routeText}；${spec.routeLabel}。已定位补货路线和市闻来帖，${spec.safeNote}。`,
  };
}

export function shopWordOfMouthReadyShelfEchoSpecWorld({
  wordSpec = null,
  wordShelf = null,
  day = 1,
  title = "来帖头排备齐签 · 可点",
  headline = "对口货已经回到头排",
  routeText = "补货入仓 -> 头排备齐 -> 手动开铺",
  cta = "手动开铺接帖 · 可点",
  safeNote = "只定位旧铺市闻、来帖和头排货签，不会自动开铺、接客、成交、改价、补货或消耗库存",
} = {}) {
  if (!wordSpec || !wordShelf?.ready) return null;
  const customerName = wordShelf.customerName || wordSpec.preferredLabels?.[0] || "来帖客";
  const sourceLabel = wordShelf.sourceLabel || wordSpec.sourceLabels?.[0] || "铺前市闻";
  const count = Number(wordShelf.count || 0);
  return {
    active: true,
    id: "shop_word_of_mouth_ready_shelf_echo",
    key: `${day}:${wordSpec.id || "word"}:${wordShelf.itemId}:${count}:ready_shelf`,
    title,
    headline,
    detail: `${wordShelf.itemName} x${count} 已能接住${customerName}，先看市闻来帖，再手动开铺。`,
    itemId: wordShelf.itemId,
    itemName: wordShelf.itemName,
    count,
    customerName,
    sourceLabel,
    hotTagLabel: wordShelf.hotTagLabel || wordSpec.hotTagLabel || "对口货",
    routeText,
    cta,
    selector: wordShelf.selector || (wordSpec.preview ? ".shop-word-of-mouth" : ".shop-word-of-mouth-visit"),
    safeNote,
    rect: { x: 386, y: 112, width: 316, height: 112 },
    anchor: { x: 678, y: 236 },
  };
}

export function shopWordOfMouthReadyShelfFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: spec.selector,
    fallbackSelector: "#shopReport",
    label: "点选来帖头排备齐签",
    log: `${spec.detail}${spec.routeText}；${spec.safeNote}。`,
    panelGroup: "core",
    missingTitle: "点选来帖头排备齐签",
    missingLog: `旧铺市闻、来帖或头排货签暂时没有找到，先打开旧铺经营报告查看最近口碑。${spec.safeNote}。`,
  };
}

export function shopWordOfMouthReadyShelfFocusTargetWorld({ spec = null } = {}) {
  return shopWordOfMouthReadyShelfFocusSpecWorld({ spec });
}

export function shopWordOfMouthReadyShelfShopFocusTargetWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: spec.selector,
    fallbackSelector: "#shopReport",
    missingTitle: "点选来帖头排备齐签",
    missingLog: `旧铺市闻、来帖或头排货签暂时没有找到，先打开旧铺经营报告查看最近口碑。${spec.safeNote}。`,
  };
}

export function shopWordOfMouthReadyShelfLogWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    title: "点选来帖头排备齐签",
    log: `${spec.itemName} x${spec.count} 已经能接住${spec.customerName}。${spec.routeText}；已定位市闻来帖和头排货签，${spec.safeNote}。`,
  };
}
