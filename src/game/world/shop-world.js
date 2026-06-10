export function drawShopWordOfMouthWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.45) * 3;
  const accent = spec.bought ? "#286f58" : spec.visitActive ? "#be4f37" : "#b47d2f";

  ctx.save();
  ctx.strokeStyle = spec.visitActive ? "rgba(190, 79, 55, 0.48)" : "rgba(180, 125, 47, 0.42)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + pulse);
  ctx.quadraticCurveTo(rect.x + 82, rect.y - 42, rect.x + 32, rect.y + 18 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  const glow = ctx.createRadialGradient(anchor.x, anchor.y, 8, anchor.x, anchor.y, 64 + pulse);
  glow.addColorStop(0, spec.visitActive ? "rgba(255, 226, 164, 0.58)" : "rgba(255, 248, 232, 0.58)");
  glow.addColorStop(1, "rgba(255, 253, 245, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, 66 + pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.beginPath();
  ctx.roundRect(anchor.x - 28, anchor.y - 24 + pulse * 0.3, 56, 42, 12);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("闻", anchor.x - 8, anchor.y + 2 + pulse * 0.3);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.visitActive ? "今日" : "明日", anchor.x - 13, anchor.y + 16 + pulse * 0.3);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.visitActive ? "rgba(255, 248, 232, 0.96)" : "rgba(248, 252, 247, 0.96)");
  ctx.strokeStyle = spec.visitActive ? "rgba(190, 79, 55, 0.68)" : "rgba(180, 125, 47, 0.62)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = spec.visitActive ? "rgba(190, 79, 55, 0.14)" : "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 70, 66, 18);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 30, rect.y + 32 + pulse);
  ctx.quadraticCurveTo(rect.x + 46, rect.y + 20 + pulse, rect.x + 64, rect.y + 32 + pulse);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rect.x + 47, rect.y + 45 + pulse, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText("帖", rect.x + 38, rect.y + 74 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 98, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 98, rect.y + 45 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.sourceLabel} -> ${spec.customerLabel}`.slice(0, 28), rect.x + 98, rect.y + 64 + pulse);

  const nodes = [spec.sourceLabel, spec.customerLabel, spec.leadItemName];
  const nodeY = rect.y + 84 + pulse;
  nodes.forEach((node, index) => {
    const nodeX = rect.x + 100 + index * 72;
    ctx.fillStyle = index === 2 ? "rgba(202, 235, 210, 0.88)" : "rgba(255, 253, 245, 0.9)";
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 13, 58, 18, 8);
    ctx.fill();
    ctx.strokeStyle = index === 2 ? "rgba(40, 111, 88, 0.45)" : "rgba(143, 95, 63, 0.28)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = index === 2 ? "#286f58" : "#8f5f3f";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText(String(node || "来帖").slice(0, 5), nodeX + 7, nodeY);
    if (index < nodes.length - 1) {
      ctx.strokeStyle = "rgba(143, 95, 63, 0.5)";
      ctx.beginPath();
      ctx.moveTo(nodeX + 60, nodeY - 4);
      ctx.lineTo(nodeX + 70, nodeY - 4);
      ctx.stroke();
    }
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 20 + pulse, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} 路 ${spec.statusLabel}`.slice(0, 42), rect.x + 26, rect.y + rect.height - 8 + pulse);
  ctx.restore();
  return true;
}

export function drawShopWordOfMouthMissingShelfWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2.6;
  const cardY = rect.y + pulse;
  const accent = "#be4f37";

  ctx.save();
  ctx.strokeStyle = "rgba(190, 79, 55, 0.46)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 9;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width - 36, cardY + rect.height + 34, rect.x + rect.width - 62, cardY + rect.height - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  const glow = ctx.createRadialGradient(anchor.x, anchor.y, 10, anchor.x, anchor.y, 62 + pulse);
  glow.addColorStop(0, "rgba(255, 214, 186, 0.48)");
  glow.addColorStop(1, "rgba(255, 244, 232, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, 64 + pulse, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 246, 238, 0.97)");
  ctx.strokeStyle = "rgba(190, 79, 55, 0.72)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(rect.x, cardY, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 66, 64, 17);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(
    ctx,
    {
      itemId: spec.itemId,
      itemName: spec.itemName,
      count: spec.have,
    },
    rect.x + 30,
    cardY + 24,
    34,
    {
      accent,
      missing: !spec.itemId || spec.have <= 0,
      pulse: reducedMotion ? 0 : Math.sin(motion * 2.5) * 1.1,
    },
  );
  ctx.fillStyle = accent;
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText("缺", rect.x + 39, cardY + 72);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 96, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 96, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.customerName}认准 ${spec.itemName || spec.hotTagLabel}`.slice(0, 28), rect.x + 96, cardY + 65);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(String(spec.routeLabel || "").slice(0, 30), rect.x + 96, cardY + 82);

  const nodes = ["市闻来客", "头排缺货", "先补路线"];
  nodes.forEach((node, index) => {
    const nodeX = rect.x + 20 + index * 94;
    const nodeY = cardY + rect.height - 18;
    ctx.fillStyle = index === 1 ? "rgba(255, 226, 211, 0.92)" : "rgba(255, 253, 245, 0.92)";
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 12, 74, 18, 8);
    ctx.fill();
    ctx.strokeStyle = index === 1 ? "rgba(190, 79, 55, 0.45)" : "rgba(143, 95, 63, 0.26)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.fillStyle = index === 1 ? accent : "#8f5f3f";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText(node, nodeX + 8, nodeY + 1);
    if (index < nodes.length - 1) {
      ctx.strokeStyle = "rgba(143, 95, 63, 0.42)";
      ctx.beginPath();
      ctx.moveTo(nodeX + 76, nodeY - 4);
      ctx.lineTo(nodeX + 88, nodeY - 4);
      ctx.stroke();
    }
  });

  ctx.fillStyle = "#286f58";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText("缺货先补 · 可点", rect.x + rect.width - 92, cardY + 24);
  ctx.restore();
  return true;
}

export function drawShopWordOfMouthReadyShelfEchoWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.9) * 2.2;
  const cardY = rect.y + pulse;
  const accent = "#286f58";

  ctx.save();
  ctx.strokeStyle = "rgba(40, 111, 88, 0.46)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width - 28, cardY + rect.height + 28, rect.x + rect.width - 64, cardY + rect.height - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  const glow = ctx.createRadialGradient(anchor.x, anchor.y, 10, anchor.x, anchor.y, 64 + pulse);
  glow.addColorStop(0, "rgba(202, 235, 210, 0.56)");
  glow.addColorStop(1, "rgba(248, 252, 247, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, 64 + pulse, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(248, 252, 247, 0.97)");
  ctx.strokeStyle = "rgba(40, 111, 88, 0.7)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(rect.x, cardY, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(40, 111, 88, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 66, 64, 17);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(
    ctx,
    {
      itemId: spec.itemId,
      itemName: spec.itemName,
      count: spec.count,
    },
    rect.x + 30,
    cardY + 24,
    34,
    {
      accent,
      missing: false,
      pulse: reducedMotion ? 0 : Math.sin(motion * 2.35) * 1.1,
    },
  );
  ctx.fillStyle = accent;
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText("齐", rect.x + 39, cardY + 72);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 96, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 96, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} x${spec.count} 路 ${spec.customerName}`.slice(0, 30), rect.x + 96, cardY + 65);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.sourceLabel}传话 · ${spec.hotTagLabel}`.slice(0, 30), rect.x + 96, cardY + 82);

  const nodes = ["补货入仓", "头排备齐", "手动开铺"];
  nodes.forEach((node, index) => {
    const nodeX = rect.x + 20 + index * 94;
    const nodeY = cardY + rect.height - 18;
    ctx.fillStyle = index === 1 ? "rgba(202, 235, 210, 0.94)" : "rgba(255, 253, 245, 0.92)";
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 12, 74, 18, 8);
    ctx.fill();
    ctx.strokeStyle = index === 1 ? "rgba(40, 111, 88, 0.48)" : "rgba(143, 95, 63, 0.26)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.fillStyle = index === 1 ? accent : "#8f5f3f";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText(node, nodeX + 8, nodeY + 1);
    if (index < nodes.length - 1) {
      ctx.strokeStyle = "rgba(143, 95, 63, 0.42)";
      ctx.beginPath();
      ctx.moveTo(nodeX + 76, nodeY - 4);
      ctx.lineTo(nodeX + 88, nodeY - 4);
      ctx.stroke();
    }
  });

  ctx.fillStyle = "#286f58";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.cta, rect.x + rect.width - 98, cardY + 24);
  ctx.restore();
  return true;
}
