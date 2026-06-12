export function normalizeShopRestockTargetData(target = null, options = {}) {
  if (!target) return null;
  const itemId = target.itemId || "";
  const day = Number(options.day || 1);
  const itemNameFor = typeof options.itemName === "function" ? options.itemName : () => "";
  const createdDay = Number(target.createdDay || target.day || day);
  return {
    id: target.id || `shop_restock_${itemId || "goods"}_${createdDay}`,
    itemId,
    itemName: target.itemName || (itemId ? itemNameFor(itemId) : "可卖货"),
    desiredCount: Math.max(1, Number(target.desiredCount || 1)),
    createdDay,
    dueDay: Number(target.dueDay || createdDay + 2),
    source: target.source || "customer_focus",
    reason: target.reason || "",
    note: target.note || "",
    status: target.status || "active",
    completedDay: Number(target.completedDay || 0),
    canceledDay: Number(target.canceledDay || 0),
  };
}
