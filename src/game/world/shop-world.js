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

export function drawShopWordOfMouthSaleEchoWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2) * 2.2;
  const cardY = rect.y + pulse * 0.35;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.74)" : "rgba(180, 125, 47, 0.5)";
  ctx.lineWidth = active ? 3.4 : 2.4;
  ctx.setLineDash([8, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  spec.path.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else {
      const prev = spec.path[index - 1];
      ctx.quadraticCurveTo((prev.x + point.x) / 2, Math.min(prev.y, point.y) - 16, point.x, point.y);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);

  spec.steps.forEach((step, index) => {
    const point = spec.path[Math.min(index + 1, spec.path.length - 1)] || spec.anchor;
    const bob = reducedMotion ? 0 : Math.sin(motion * 2.2 + index) * 2;
    ctx.fillStyle = `${step.accent}24`;
    ctx.beginPath();
    ctx.arc(point.x, point.y - 19 + bob, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = step.accent;
    ctx.beginPath();
    ctx.arc(point.x, point.y - 19 + bob, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(step.label, point.x - 4, point.y - 15 + bob);
  });

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(248, 252, 247, 0.97)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.9)" : "rgba(40, 111, 88, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(40, 111, 88, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("帖", rect.x + 28, cardY + 43);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 78, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 78, cardY + 43);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.customerName} · ${spec.itemName} · ${spec.price || 0} 灵石`.slice(0, 32), rect.x + 78, cardY + 59);

  const rowY = cardY + 74;
  spec.steps.forEach((step, index) => {
    const stepX = rect.x + 16 + index * 76;
    ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
    ctx.strokeStyle = `${step.accent}44`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(stepX, rowY, 68, 24, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = step.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.title.slice(0, 5), stepX + 7, rowY + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(step.text || "").slice(0, 8), stepX + 7, rowY + 20);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.cta}`.slice(0, 52), rect.x + 18, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function drawShopWordOfMouthSaleReasonWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.25) * 2;
  const cardY = rect.y + pulse * 0.45;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.82)" : "rgba(180, 125, 47, 0.46)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x - 28, rect.y + 24 + pulse, rect.x + 18, cardY + 74);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.9)" : "rgba(180, 125, 47, 0.58)";
  ctx.lineWidth = active ? 2.6 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(180, 125, 47, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, cardY + 12, 44, 42, 14);
  ctx.fill();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "900 19px Microsoft YaHei";
  ctx.fillText("因", rect.x + 25, cardY + 40);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 13), rect.x + 66, cardY + 21);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 14), rect.x + 66, cardY + 39);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(`${spec.customerName} · ${spec.itemName}`.slice(0, 24), rect.x + 66, cardY + 53);

  spec.reasons.forEach((reason, index) => {
    const rowY = cardY + 64 + index * 18;
    ctx.fillStyle = `${reason.accent}1f`;
    ctx.strokeStyle = `${reason.accent}4d`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(rect.x + 12, rowY, rect.width - 24, 15, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = reason.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(reason.title.slice(0, 5), rect.x + 21, rowY + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(reason.text || "").slice(0, 15), rect.x + 72, rowY + 10);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`明日：${spec.nextText}`.slice(0, 25), rect.x + 15, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function drawShopWordOfMouthFollowupRestockWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.05) * 2.1;
  const cardY = rect.y + pulse * 0.4;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.82)" : "rgba(40, 111, 88, 0.44)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([5, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x - 34, rect.y + 20 + pulse, rect.x + 18, cardY + 62);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(240, 248, 238, 0.96)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.9)" : "rgba(40, 111, 88, 0.58)";
  ctx.lineWidth = active ? 2.6 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(40, 111, 88, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, cardY + 12, 44, 42, 14);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 19px Microsoft YaHei";
  ctx.fillText("续", rect.x + 25, cardY + 40);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 13), rect.x + 66, cardY + 21);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 14), rect.x + 66, cardY + 39);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(`${spec.customerName} · ${spec.itemName}`.slice(0, 24), rect.x + 66, cardY + 53);

  spec.steps.forEach((step, index) => {
    const stepX = rect.x + 12 + index * 66;
    const stepY = cardY + 66;
    ctx.fillStyle = `${step.accent}1f`;
    ctx.strokeStyle = `${step.accent}4d`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(stepX, stepY, 60, 29, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = step.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.title.slice(0, 5), stepX + 7, stepY + 11);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 7px Microsoft YaHei";
    ctx.fillText(String(step.text || "").slice(0, 8), stepX + 7, stepY + 23);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 32), rect.x + 15, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

function shopWorldAtCanvasPointResult({
  px = 0,
  py = 0,
  spec = null,
  type = "",
  label = "",
  payloadKey = "",
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type,
      label: label || spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      [payloadKey]: spec,
      rect,
    }
    : null;
}

export function shopWordOfMouthSaleEchoWorldSpecWorld({
  opening = null,
  report = [],
  day = 1,
  itemName = (itemId) => itemId || "对口货",
} = {}) {
  const visit = opening?.lastSession?.day === day ? opening.lastSession.shopWordOfMouthVisit || null : null;
  if (!visit?.bought) return null;
  const safeReport = Array.isArray(report) ? report : [];
  const reportIndex = safeReport.findIndex((entry) => entry.wordOfMouthLead && entry.reason === "buy");
  const reportEntry = reportIndex >= 0
    ? safeReport[reportIndex]
    : safeReport.find((entry) => entry.customerArchetype === visit.customerArchetype && entry.reason === "buy") || null;
  const itemId = reportEntry?.itemId || "";
  const itemNameText = itemId ? itemName(itemId) : visit.leadItemName || visit.hotTagLabel || "对口货";
  const price = Number((String(reportEntry?.text || visit.resultText || "").match(/成交 (\d+)/) || [0, 0])[1] || 0);
  const customerName = reportEntry?.name || visit.customerLabel || "来帖客";
  const sourceLabel = visit.sourceLabel || "铺前市闻";
  const resultText = visit.resultText || reportEntry?.text || `${customerName}顺着市闻进门买走了${itemNameText}。`;
  const path = [
    { x: 82, y: 258 },
    { x: 142, y: 246 },
    { x: 198, y: 270 },
    { x: 260, y: 298 },
    { x: 326, y: 324 },
  ];
  return {
    key: `${day}:${visit.sourceId || "word"}:${customerName}:${itemNameText}:${price}:word_of_mouth_sale_echo`,
    day,
    title: "来帖成交回响 · 可点",
    headline: "市闻真的变成一笔买卖",
    customerName,
    sourceLabel,
    itemId,
    itemName: itemNameText,
    price,
    resultText,
    reportIndex,
    selector: reportIndex >= 0
      ? `[data-shop-report-index="${Number(reportIndex)}"]`
      : ".shop-word-of-mouth-visit",
    fallbackSelector: '[data-shop-board="opening"]',
    rect: { x: 330, y: 360, width: 326, height: 118 },
    anchor: { x: 180, y: 278 },
    path,
    steps: [
      { key: "word", label: "闻", title: "市闻传来", text: sourceLabel, accent: "#b47d2f" },
      { key: "visit", label: "客", title: "来客认门", text: customerName, accent: "#4d91a6" },
      { key: "goods", label: "货", title: "头排接货", text: itemNameText, accent: "#286f58" },
      { key: "sale", label: "成", title: "成交入账", text: price ? `${price} 灵石` : "成交", accent: "#be4f37" },
    ],
    cta: "只回看旧铺报告和市闻来帖，不会自动开铺、接客、成交、改价、补货或消耗库存",
  };
}

export function shopWordOfMouthSaleEchoWorldAtCanvasPointWorld({ px = 0, py = 0, spec = null } = {}) {
  return shopWorldAtCanvasPointResult({
    px,
    py,
    spec,
    type: "shop_word_of_mouth_sale_echo",
    payloadKey: "shopWordOfMouthSaleEcho",
  });
}

export function shopWordOfMouthSaleReasonWorldSpecWorld({
  echo = null,
  day = 1,
} = {}) {
  if (!echo) return null;
  const itemText = echo.itemName || "对口货";
  const sourceText = echo.sourceLabel || "铺前市闻";
  const customerText = echo.customerName || "来帖客";
  const priceText = echo.price ? `${echo.price} 灵石` : "成交入账";
  const nextText = itemText === "对口货" ? "明日继续按市闻标签备货" : `明日把 ${itemText} 留在头排`;
  return {
    key: `${echo.key}:reason_card`,
    day,
    title: "来帖成交三因签 · 可点",
    headline: "这单为什么能成",
    customerName: customerText,
    sourceLabel: sourceText,
    itemId: echo.itemId || "",
    itemName: itemText,
    price: echo.price,
    resultText: echo.resultText,
    reportIndex: echo.reportIndex,
    selector: echo.selector,
    fallbackSelector: echo.fallbackSelector,
    rect: { x: 666, y: 236, width: 214, height: 126 },
    anchor: { x: echo.rect.x + echo.rect.width - 24, y: echo.rect.y + 24 },
    reasons: [
      { key: "source", title: "话头命中", text: sourceText, accent: "#b47d2f" },
      { key: "goods", title: "头排有货", text: itemText, accent: "#286f58" },
      { key: "result", title: "买单成立", text: priceText, accent: "#be4f37" },
    ],
    nextText,
    cta: "只复盘成交原因和定位旧铺报告，不会自动开铺、接客、成交、改价、补货或消耗库存",
  };
}

export function shopWordOfMouthSaleReasonWorldAtCanvasPointWorld({ px = 0, py = 0, spec = null } = {}) {
  return shopWorldAtCanvasPointResult({
    px,
    py,
    spec,
    type: "shop_word_of_mouth_sale_reason",
    payloadKey: "shopWordOfMouthSaleReason",
  });
}

export function shopWordOfMouthFollowupRestockWorldSpecWorld({
  reason = null,
  day = 1,
} = {}) {
  if (!reason) return null;
  const itemText = reason.itemName || "对口货";
  const sourceText = reason.sourceLabel || "铺前市闻";
  const customerText = reason.customerName || "来帖客";
  const stockText = reason.price ? `刚成交 ${reason.price} 灵石` : "刚完成一笔来帖单";
  const tomorrowText = itemText === "对口货" ? "按来帖标签补一批" : `补 2 份 ${itemText}`;
  return {
    key: `${reason.key}:followup_restock`,
    day,
    title: "来帖续货明日签 · 可点",
    headline: "别让这股口碑断档",
    customerName: customerText,
    sourceLabel: sourceText,
    itemId: reason.itemId || "",
    itemName: itemText,
    price: reason.price,
    reportIndex: reason.reportIndex,
    selector: reason.selector,
    fallbackSelector: reason.fallbackSelector,
    rect: { x: 664, y: 374, width: 218, height: 112 },
    anchor: { x: reason.rect.x + 34, y: reason.rect.y + reason.rect.height - 8 },
    steps: [
      { key: "sold", title: "今日卖出", text: stockText, accent: "#be4f37" },
      { key: "restock", title: "明日续货", text: tomorrowText, accent: "#286f58" },
      { key: "front", title: "仍放头排", text: sourceText, accent: "#b47d2f" },
    ],
    cta: "只提示明日续货和定位旧铺报告，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存",
  };
}

export function shopWordOfMouthFollowupRestockWorldAtCanvasPointWorld({ px = 0, py = 0, spec = null } = {}) {
  return shopWorldAtCanvasPointResult({
    px,
    py,
    spec,
    type: "shop_word_of_mouth_followup_restock",
    payloadKey: "shopWordOfMouthFollowupRestock",
  });
}

export function drawShopWordOfMouthMorningFollowupWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.9) * 2.2;
  const glow = reducedMotion ? 0.45 : 0.45 + Math.sin(motion * 2.4) * 0.16;
  const cardY = rect.y + pulse * 0.36;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.8)" : "rgba(180, 125, 47, 0.5)";
  ctx.lineWidth = active ? 3.2 : 2.1;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x - 38, rect.y + 18 + pulse, rect.x + 18, cardY + 58);
  ctx.stroke();
  ctx.setLineDash([]);

  const lampX = spec.anchor.x + 8;
  const lampY = spec.anchor.y - 24 + pulse * 0.5;
  ctx.fillStyle = `rgba(224, 182, 109, ${glow * 0.42})`;
  ctx.beginPath();
  ctx.ellipse(lampX, lampY + 18, 34, 13, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 125, 47, 0.55)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(lampX, lampY - 8);
  ctx.lineTo(lampX, lampY + 6);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 248, 232, 0.96)";
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.78)" : "rgba(180, 125, 47, 0.66)";
  ctx.lineWidth = active ? 2.2 : 1.3;
  ctx.beginPath();
  ctx.roundRect(lampX - 15, lampY + 3, 30, 30, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText("晨", lampX - 8, lampY + 24);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 251, 236, 0.96)");
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.88)" : "rgba(180, 125, 47, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.13)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, cardY + 12, 44, 42, 14);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 19px Microsoft YaHei";
  ctx.fillText("续", rect.x + 25, cardY + 40);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 13), rect.x + 66, cardY + 21);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 15), rect.x + 66, cardY + 39);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(`${spec.customerName} 昨天买过 ${spec.itemName}`.slice(0, 24), rect.x + 66, cardY + 53);

  spec.steps.forEach((step, index) => {
    const stepX = rect.x + 12 + index * 70;
    const stepY = cardY + 66;
    ctx.fillStyle = `${step.accent}1f`;
    ctx.strokeStyle = `${step.accent}4d`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(stepX, stepY, 64, 29, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = step.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(step.title || "").slice(0, 5), stepX + 7, stepY + 11);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 7px Microsoft YaHei";
    ctx.fillText(String(step.text || "").slice(0, 8), stepX + 7, stepY + 23);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("只回看续货复盘，不自动补货或开铺", rect.x + 15, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function drawShopWordOfMouthRestockedMorningWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 1.9;
  const cardY = rect.y + pulse * 0.35;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.86)" : "rgba(40, 111, 88, 0.48)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([4, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x - 28, rect.y + 42 + pulse, rect.x + 18, cardY + 58);
  ctx.stroke();
  ctx.setLineDash([]);

  const boxX = spec.anchor.x + 8;
  const boxY = spec.anchor.y + 6 + pulse * 0.4;
  ctx.fillStyle = "rgba(23, 35, 29, 0.14)";
  ctx.beginPath();
  ctx.ellipse(boxX + 16, boxY + 28, 32, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 248, 232, 0.94)";
  ctx.strokeStyle = "rgba(40, 111, 88, 0.62)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, 44, 30, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("备回", boxX + 10, boxY + 19);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(240, 248, 238, 0.96)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.9)" : "rgba(40, 111, 88, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(40, 111, 88, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, cardY + 12, 48, 46, 14);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(
    ctx,
    {
      itemId: spec.itemId,
      itemName: spec.itemName,
      count: spec.have,
    },
    rect.x + 18,
    cardY + 17,
    36,
    {
      accent: "#286f58",
      pulse: reducedMotion ? 0 : Math.sin(motion * 2.8) * 1.1,
    },
  );

  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 13), rect.x + 70, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 15), rect.x + 70, cardY + 40);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} ${spec.have}/${spec.targetCount} · ${spec.customerName}`.slice(0, 27), rect.x + 70, cardY + 54);

  spec.steps.forEach((step, index) => {
    const stepX = rect.x + 12 + index * 68;
    const stepY = cardY + 67;
    ctx.fillStyle = `${step.accent}1f`;
    ctx.strokeStyle = `${step.accent}4d`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(stepX, stepY, 62, 28, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = step.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(step.title || "").slice(0, 5), stepX + 7, stepY + 11);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 7px Microsoft YaHei";
    ctx.fillText(String(step.text || "").slice(0, 8), stepX + 7, stepY + 23);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("只确认备回，不自动上架或开铺", rect.x + 15, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function drawShopWordOfMouthRestockCaughtWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.3) * 2;
  const cardY = rect.y + pulse * 0.36;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.86)" : "rgba(40, 111, 88, 0.5)";
  ctx.lineWidth = active ? 3.2 : 2.1;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.bezierCurveTo(spec.anchor.x - 18, spec.anchor.y + 78 + pulse, rect.x + 42, cardY - 8, rect.x + 28, cardY + 64);
  ctx.stroke();
  ctx.setLineDash([]);

  const sealX = rect.x + 24;
  const sealY = cardY - 14;
  ctx.fillStyle = "rgba(190, 79, 55, 0.14)";
  ctx.beginPath();
  ctx.arc(sealX, sealY + 20, 24 + Math.abs(pulse) * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.82)" : "rgba(180, 125, 47, 0.52)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(sealX, sealY + 20, 17, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText("接", sealX - 7, sealY + 25);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.97)");
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.9)" : "rgba(40, 111, 88, 0.6)";
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("成", rect.x + 28, cardY + 43);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 13), rect.x + 78, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 16), rect.x + 78, cardY + 42);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(`${spec.customerName} · ${spec.itemName} · ${spec.price || 0} 灵石`.slice(0, 29), rect.x + 78, cardY + 57);

  spec.steps.forEach((step, index) => {
    const stepX = rect.x + 14 + index * 86;
    const stepY = cardY + 72;
    ctx.fillStyle = `${step.accent}1f`;
    ctx.strokeStyle = `${step.accent}4d`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(stepX, stepY, 78, 27, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = step.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(step.title || "").slice(0, 5), stepX + 7, stepY + 11);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 7px Microsoft YaHei";
    ctx.fillText(String(step.text || "").slice(0, 9), stepX + 7, stepY + 22);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("只回看接住结果，不自动上架、开铺或成交", rect.x + 15, cardY + rect.height - 7);
  ctx.restore();
  return true;
}
