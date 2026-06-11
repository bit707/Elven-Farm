export function drawShopWeatherShelfGoodIconWorld({
  ctx,
  good = {},
  x = 0,
  y = 0,
  size = 28,
  options = {},
  itemId = good.itemId || good.item?.item_id || "",
  tags = [],
  cropBaicai = null,
  cropBailuobo = null,
} = {}) {
  if (!ctx) return false;
  const safeTags = Array.isArray(tags) ? tags : [];
  const missing = options.missing || !itemId;
  const accent = options.accent || "#b47d2f";
  const pulse = Number(options.pulse || 0);
  ctx.save();
  ctx.translate(x, y + pulse);

  ctx.fillStyle = missing ? "rgba(255, 253, 245, 0.62)" : "rgba(255, 253, 245, 0.92)";
  ctx.strokeStyle = missing ? "rgba(190, 79, 55, 0.48)" : `${accent}88`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, 8);
  ctx.fill();
  ctx.stroke();

  if (missing) {
    ctx.strokeStyle = "rgba(190, 79, 55, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size * 0.28, size * 0.28);
    ctx.lineTo(size * 0.72, size * 0.72);
    ctx.moveTo(size * 0.72, size * 0.28);
    ctx.lineTo(size * 0.28, size * 0.72);
    ctx.stroke();
    ctx.fillStyle = "rgba(190, 79, 55, 0.18)";
    ctx.beginPath();
    ctx.arc(size * 0.5, size * 0.5, size * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return true;
  }

  const cropImage = itemId.includes("baicai")
    ? cropBaicai
    : itemId.includes("bailuobo")
      ? cropBailuobo
      : null;
  if (cropImage) {
    ctx.drawImage(cropImage, size * 0.12, size * 0.08, size * 0.76, size * 0.78);
  } else if (safeTags.some((tag) => ["drink", "water_food", "refreshing", "food_cold", "cooling"].includes(tag)) || /tang|soup|tea|water|dew/.test(itemId)) {
    ctx.fillStyle = "rgba(77, 145, 166, 0.2)";
    ctx.beginPath();
    ctx.ellipse(size * 0.5, size * 0.72, size * 0.34, size * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4d91a6";
    ctx.beginPath();
    ctx.roundRect(size * 0.25, size * 0.34, size * 0.5, size * 0.34, 7);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
    ctx.beginPath();
    ctx.ellipse(size * 0.5, size * 0.36, size * 0.23, size * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(77, 145, 166, 0.72)";
    ctx.beginPath();
    ctx.arc(size * 0.76, size * 0.48, size * 0.1, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  } else if (safeTags.some((tag) => ["herb", "medicine"].includes(tag)) || /herb|lingzhi|shihu|medicine/.test(itemId)) {
    ctx.strokeStyle = "#286f58";
    ctx.lineWidth = 2.2;
    for (let leaf = 0; leaf < 3; leaf += 1) {
      ctx.beginPath();
      ctx.moveTo(size * 0.5, size * 0.78);
      ctx.quadraticCurveTo(size * (0.24 + leaf * 0.18), size * 0.42, size * (0.28 + leaf * 0.2), size * 0.18);
      ctx.stroke();
      ctx.fillStyle = leaf % 2 ? "#7ba66c" : "#48a868";
      ctx.beginPath();
      ctx.ellipse(size * (0.28 + leaf * 0.2), size * (0.32 + leaf * 0.08), size * 0.11, size * 0.06, -0.8 + leaf * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (safeTags.some((tag) => ["metal", "ore", "material"].includes(tag)) || /ore|stone|crystal|shard|coal/.test(itemId)) {
    const oreGradient = ctx.createLinearGradient(0, 0, size, size);
    oreGradient.addColorStop(0, "#d6c28d");
    oreGradient.addColorStop(1, "#6f6a5c");
    ctx.fillStyle = oreGradient;
    ctx.beginPath();
    ctx.moveTo(size * 0.28, size * 0.7);
    ctx.lineTo(size * 0.42, size * 0.24);
    ctx.lineTo(size * 0.72, size * 0.34);
    ctx.lineTo(size * 0.78, size * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.42)";
    ctx.fillRect(size * 0.44, size * 0.36, size * 0.18, size * 0.05);
  } else if (safeTags.includes("wood") || /wood/.test(itemId)) {
    ctx.strokeStyle = "#8f5f3f";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    [0.34, 0.5, 0.66].forEach((offset, index) => {
      ctx.beginPath();
      ctx.moveTo(size * offset, size * 0.25 + index);
      ctx.lineTo(size * (offset - 0.08), size * 0.74);
      ctx.stroke();
    });
    ctx.strokeStyle = "#e0b66d";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(size * 0.24, size * 0.5);
    ctx.lineTo(size * 0.75, size * 0.45);
    ctx.stroke();
  } else if (safeTags.some((tag) => ["gift", "premium", "festival"].includes(tag))) {
    ctx.fillStyle = "#d87f8d";
    ctx.beginPath();
    ctx.roundRect(size * 0.22, size * 0.34, size * 0.56, size * 0.38, 6);
    ctx.fill();
    ctx.fillStyle = "#f5f0b6";
    ctx.fillRect(size * 0.47, size * 0.28, size * 0.08, size * 0.48);
    ctx.fillRect(size * 0.18, size * 0.46, size * 0.64, size * 0.08);
    ctx.strokeStyle = "#d87f8d";
    ctx.beginPath();
    ctx.arc(size * 0.42, size * 0.28, size * 0.09, 0, Math.PI * 2);
    ctx.arc(size * 0.6, size * 0.28, size * 0.09, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.roundRect(size * 0.25, size * 0.2, size * 0.48, size * 0.58, 7);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
    ctx.fillRect(size * 0.34, size * 0.34, size * 0.3, size * 0.05);
    ctx.fillRect(size * 0.34, size * 0.48, size * 0.24, size * 0.05);
  }

  if (Number(good.count || 0) > 0) {
    ctx.fillStyle = "rgba(23, 35, 29, 0.72)";
    ctx.beginPath();
    ctx.roundRect(size * 0.56, size * 0.62, size * 0.34, size * 0.24, 6);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(`x${Math.min(9, Number(good.count || 0))}`, size * 0.61, size * 0.79);
  }
  ctx.restore();
  return true;
}

export function drawShopWeatherShelfCustomerVignetteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawShopCrowdPerson,
  drawShopWeatherShelfGoodIcon,
  cardTitle = "\u5929\u6c14\u8d27\u7b7e\u987e\u5ba2\u5c0f\u666f",
} = {}) {
  if (!spec?.active || !ctx || !drawShopCrowdPerson || !drawShopWeatherShelfGoodIcon) return false;
  const x = 526;
  const y = 214;
  const bob = reducedMotion ? 0 : Math.sin(motion * 2.2) * 2;
  const lookX = x + (spec.status === "missing" ? 30 : 0);
  ctx.save();

  ctx.strokeStyle = spec.status === "attracted" ? "rgba(40, 111, 88, 0.42)" : spec.status === "missing" ? "rgba(190, 79, 55, 0.38)" : "rgba(180, 125, 47, 0.38)";
  ctx.lineWidth = 2.4;
  ctx.setLineDash(spec.status === "missing" ? [5, 7] : [8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(lookX + 42, y + 96);
  ctx.quadraticCurveTo(lookX - 12, y + 58, 500, 224);
  ctx.stroke();
  ctx.setLineDash([]);

  drawShopCrowdPerson(ctx, lookX, y + 44 + bob, {
    buyer: spec.status === "attracted",
    leaver: spec.status === "missing",
    looker: spec.status === "hesitate",
    index: 5,
    color: spec.accent,
    accent: spec.accent,
    alpha: 0.92,
  }, motion);

  const cardX = x - 10;
  const cardY = y - 10 + bob;
  const cardW = 166;
  const cardH = 58;
  ctx.fillStyle = spec.tone === "good"
    ? "rgba(237, 243, 223, 0.92)"
    : spec.tone === "warn"
      ? "rgba(255, 240, 232, 0.93)"
      : "rgba(255, 248, 232, 0.92)";
  ctx.strokeStyle = `${spec.accent}66`;
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = spec.accent;
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(cardTitle, cardX + 12, cardY + 18);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${spec.customerLabel} \u00b7 ${spec.label}`.slice(0, 15), cardX + 12, cardY + 34);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "9px Microsoft YaHei";
  ctx.fillText(spec.bubble.slice(0, 18), cardX + 12, cardY + 48);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.strokeStyle = `${spec.accent}55`;
  ctx.beginPath();
  ctx.roundRect(cardX + cardW - 42, cardY + 12, 34, 34, 10);
  ctx.fill();
  ctx.stroke();
  drawShopWeatherShelfGoodIcon(ctx, spec.good, cardX + cardW - 38, cardY + 15, 28, {
    accent: spec.accent,
    missing: spec.status === "missing",
  });

  if (spec.status === "missing") {
    ctx.strokeStyle = "rgba(190, 79, 55, 0.48)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + cardW - 26, cardY + 52);
    ctx.quadraticCurveTo(cardX + cardW - 42, cardY + 72, cardX + cardW - 72, cardY + 62);
    ctx.stroke();
  } else if (spec.status === "attracted") {
    ctx.fillStyle = "rgba(224, 182, 109, 0.82)";
    for (let i = 0; i < Math.min(5, Math.max(2, spec.count + 1)); i += 1) {
      ctx.beginPath();
      ctx.arc(cardX + 18 + i * 9, cardY + cardH + 9 + Math.sin(motion * 2 + i) * 2, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  return true;
}

export function drawShopWeatherShelfSignWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  afterglow = null,
  drawShopWeatherShelfGoodIcon,
  labels = {},
} = {}) {
  if (!spec?.active || !ctx || !drawShopWeatherShelfGoodIcon) return false;
  const hasGoods = spec.topGoods.length > 0;
  const x = 318;
  const y = 158;
  const w = 188;
  const h = 88;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.3) * 2;
  const accent = hasGoods
    ? spec.tone === "rain" ? "#4d91a6" : spec.tone === "warn" ? "#be4f37" : "#286f58"
    : "#be4f37";
  const topGood = spec.topGoods[0] || null;
  const shelfGoods = spec.topGoods.length
    ? spec.topGoods
    : [
      { itemName: labels.missingPrimaryName || "\u7f3a\u8d27", count: 0, missing: true },
      { itemName: labels.missingSecondaryName || "\u5f85\u8865", count: 0, missing: true },
    ];
  ctx.save();
  ctx.fillStyle = hasGoods ? "rgba(255, 253, 245, 0.93)" : "rgba(255, 240, 232, 0.94)";
  ctx.strokeStyle = `${accent}77`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y + pulse, w, h, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(x + 12, y + 12 + pulse, 42, 42, 13);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 22px Microsoft YaHei";
  ctx.fillText(hasGoods ? (labels.primaryPush || "\u63a8") : (labels.primaryMissing || "\u7f3a"), x + 23, y + 40 + pulse);

  ctx.fillStyle = "#17231d";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText((hasGoods ? (labels.shelfTitle || "\u5929\u6c14\u4e3b\u63a8\u8d27") : (labels.emptyTitle || "\u7f3a\u5c11\u5929\u6c14\u5bf9\u53e3\u8d27")).slice(0, 12), x + 64, y + 26 + pulse);
  ctx.fillStyle = accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText((topGood ? `${topGood.itemName} x${topGood.count}` : spec.missingTagText || labels.defaultGoodName || "\u5e94\u5b63\u8d27").slice(0, 14), x + 64, y + 45 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.weatherName} \u00b7 ${spec.title}`.slice(0, 22), x + 64, y + 62 + pulse);

  ctx.strokeStyle = `${accent}66`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 22, y + h - 22 + pulse);
  ctx.lineTo(x + w - 18, y + h - 22 + pulse);
  ctx.stroke();

  shelfGoods.slice(0, 3).forEach((good, index) => {
    const boxX = x + 22 + index * 45;
    const boxY = y + h - 39 + pulse + Math.sin(motion * 1.7 + index) * (reducedMotion ? 0 : 1.5);
    if (hasGoods && index === 0) {
      ctx.fillStyle = "rgba(224, 182, 109, 0.22)";
      ctx.beginPath();
      ctx.arc(boxX + 15, boxY + 13, 23 + Math.sin(motion * 2.1) * (reducedMotion ? 0 : 2), 0, Math.PI * 2);
      ctx.fill();
    }
    drawShopWeatherShelfGoodIcon(ctx, good, boxX, boxY - 2, 30, {
      accent,
      missing: !hasGoods || good.missing,
      pulse: hasGoods ? 0 : Math.sin(motion * 2 + index) * (reducedMotion ? 0 : 1.2),
    });
    ctx.fillStyle = index === 0 && hasGoods ? accent : "rgba(143, 95, 63, 0.74)";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText((good.itemName || labels.refillName || "\u8865\u8d27").slice(0, 3), boxX + 1, boxY + 37);
  });

  if (hasGoods) {
    ctx.fillStyle = "rgba(224, 182, 109, 0.82)";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(x + 150 + i * 8, y + 72 + pulse + Math.sin(motion * 1.5 + i) * 2, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.strokeStyle = "rgba(190, 79, 55, 0.72)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w - 32, y + 20 + pulse);
    ctx.lineTo(x + w - 20, y + 32 + pulse);
    ctx.moveTo(x + w - 20, y + 20 + pulse);
    ctx.lineTo(x + w - 32, y + 32 + pulse);
    ctx.stroke();
    ctx.strokeStyle = "rgba(190, 79, 55, 0.52)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 36, y + h - 3 + pulse);
    ctx.quadraticCurveTo(x + 76, y + h + 17 + pulse, x + 124, y + h - 3 + pulse);
    ctx.stroke();
    ctx.fillStyle = "rgba(190, 79, 55, 0.82)";
    ctx.beginPath();
    ctx.moveTo(x + 124, y + h - 3 + pulse);
    ctx.lineTo(x + 114, y + h - 8 + pulse);
    ctx.lineTo(x + 116, y + h + 4 + pulse);
    ctx.closePath();
    ctx.fill();
  }
  if (afterglow?.active) {
    const badgeX = x + 74;
    const badgeY = y + h + 5 + pulse;
    const badgeW = 112;
    const badgeH = 25;
    const badgeAccent = afterglow.success ? "#286f58" : "#be4f37";
    ctx.fillStyle = afterglow.success ? "rgba(237, 243, 223, 0.94)" : "rgba(255, 240, 232, 0.94)";
    ctx.strokeStyle = `${badgeAccent}66`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = badgeAccent;
    ctx.font = "800 11px Microsoft YaHei";
    ctx.fillText(afterglow.label, badgeX + 12, badgeY + 17);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText((afterglow.itemName || afterglow.weatherName || labels.afterglowTitle || "\u5929\u6c14\u8d27\u7b7e").slice(0, 7), badgeX + 72, badgeY + 17);
    if (afterglow.success) {
      ctx.fillStyle = "rgba(224, 182, 109, 0.88)";
      for (let i = 0; i < Math.min(5, Math.max(2, afterglow.count + 1)); i += 1) {
        ctx.beginPath();
        ctx.arc(badgeX - 10 + i * 12, badgeY + 12 + Math.sin(motion * 2 + i) * 3, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = "rgba(190, 79, 55, 0.42)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(badgeX - 10, badgeY + 5);
      ctx.quadraticCurveTo(badgeX - 22, badgeY + 12, badgeX - 10, badgeY + 20);
      ctx.stroke();
    }
  }
  ctx.restore();
  return true;
}
