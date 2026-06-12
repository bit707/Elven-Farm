export function shopDiagnosisRuntime(report = [], goods = [], themeScore = 0, {
  currentShelfTheme = () => null,
  shopFeedbackBy = () => null,
  shuqiLowStockGoods = () => [],
  shuqiStockWarningActive = () => false,
  shuqiLedgerInsightActive = () => false,
  splitTags = (value = "") => String(value || "").split("|").map((tag) => tag.trim()).filter(Boolean),
  itemName = (itemId = "") => itemId,
} = {}) {
  const diagnostics = [];
  const priceLeaveCount = report.filter((entry) => entry.reason === "price").length;
  const stockout = goods.length === 0;
  const theme = currentShelfTheme();
  const lowStockGoods = shuqiLowStockGoods(goods);

  if (priceLeaveCount >= 2) diagnostics.push(shopFeedbackBy("diagnosis", 0)?.result_text || "今天多位顾客觉得偏贵。");
  if (stockout) diagnostics.push(shopFeedbackBy("diagnosis", 1)?.result_text || "热卖标签商品断货影响成交。");
  if (theme && themeScore < Number(theme.min_theme_ratio)) {
    diagnostics.push(`${theme.note} 未成型，建议补齐 ${splitTags(theme.required_item_tags).join(" / ")} 标签商品。`);
  }
  if (shuqiStockWarningActive() && lowStockGoods.length > 0) {
    diagnostics.push(`书契夹出了缺货签：${lowStockGoods.slice(0, 2).map(({ itemId }) => itemName(itemId)).join(" / ")} 只剩最后一件，明早先补再开铺。`);
  } else if (shuqiStockWarningActive() && diagnostics.length === 0 && report.some((entry) => entry.reason === "buy")) {
    diagnostics.push("书契把缺货签收回账夹了：今天货架余量稳，可以放心把目标抬到更高分。");
  } else if (shuqiLedgerInsightActive() && diagnostics.length === 0 && report.some((entry) => entry.reason === "buy")) {
    diagnostics.push("书契把今日账页压平了：买卖不算走样，可以开始盯下一张更值钱的单子。");
  }

  return diagnostics;
}
