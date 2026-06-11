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
