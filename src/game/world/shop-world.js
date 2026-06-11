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

export function drawCommerceWorldMarksWorld({
  ctx,
  originX = 0,
  originY = 0,
  tile = 72,
  gap = 8,
  reducedMotion = false,
  motion = 0,
  craftDone = false,
  orderDone = false,
  shopOpenDone = false,
  firstSaleDone = false,
  seasonalDoorstep = null,
  doorstepScene = null,
  shopWordOfMouth = null,
} = {}) {
  if (!ctx || !(craftDone || orderDone || shopOpenDone || firstSaleDone)) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion / 460) * 3;
  const shopX = originX - 174;
  const shopY = originY - 22;
  const aromaX = originX + tile * 5.2 + gap * 4;
  const aromaY = originY - 54;
  const slipX = originX + tile * 5.72 + gap * 4;
  const slipY = originY + tile * 1.9;
  const saleX = originX - 88;
  const saleY = originY + 164;

  ctx.save();

  const drawLabel = (text, x, y, tone = "#8f5f3f") => {
    const width = Math.max(68, text.length * 13 + 18);
    ctx.fillStyle = "rgba(255, 248, 232, 0.88)";
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 14, width, 20, 9);
    ctx.fill();
    ctx.fillStyle = tone;
    ctx.font = "700 12px Microsoft YaHei";
    ctx.fillText(text, x, y);
  };

  if (craftDone) {
    ctx.fillStyle = "rgba(143, 95, 63, 0.94)";
    ctx.beginPath();
    ctx.roundRect(aromaX - 16, aromaY, 42, 16, 7);
    ctx.fill();
    ctx.fillStyle = "#f0a54e";
    ctx.fillRect(aromaX - 10, aromaY + 4, 8, 8);
    ctx.fillRect(aromaX + 1, aromaY + 5, 9, 7);
    ctx.fillRect(aromaX + 13, aromaY + 4, 7, 8);
    ctx.strokeStyle = `rgba(40, 111, 88, ${0.42 + pulse / 18})`;
    ctx.lineWidth = 2;
    for (const offset of [0, 10, 20]) {
      ctx.beginPath();
      ctx.moveTo(aromaX - 4 + offset, aromaY - 1);
      ctx.bezierCurveTo(aromaX - 8 + offset, aromaY - 16 - pulse, aromaX + 5 + offset, aromaY - 20 + pulse, aromaX + offset, aromaY - 32);
      ctx.stroke();
    }
    drawLabel("后厂起香", aromaX - 18, aromaY - 40, "#286f58");
  }

  if (orderDone) {
    ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
    ctx.beginPath();
    ctx.roundRect(slipX - 10, slipY - 18, 34, 42, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(190, 79, 55, 0.66)";
    ctx.lineWidth = 2;
    ctx.strokeRect(slipX - 5, slipY - 12, 24, 28);
    ctx.fillStyle = "#be4f37";
    ctx.fillRect(slipX - 2, slipY - 24, 8, 8);
    ctx.strokeStyle = "rgba(143, 95, 63, 0.54)";
    ctx.beginPath();
    ctx.moveTo(slipX + 3, slipY - 16);
    ctx.lineTo(slipX + 3, slipY - 28);
    ctx.stroke();
    ctx.fillStyle = "#8f5f3f";
    ctx.fillRect(slipX, slipY - 5, 12, 2);
    ctx.fillRect(slipX, slipY + 2, 10, 2);
    ctx.fillRect(slipX, slipY + 9, 8, 2);
    drawLabel("第一张委托", slipX - 22, slipY - 34, "#be4f37");
  }

  if (shopOpenDone) {
    const flagY = shopY + pulse;
    ctx.strokeStyle = "#5b3328";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(shopX, flagY - 8);
    ctx.lineTo(shopX, flagY + 48);
    ctx.stroke();
    ctx.fillStyle = "#f0a54e";
    ctx.beginPath();
    ctx.moveTo(shopX + 3, flagY - 4);
    ctx.lineTo(shopX + 44, flagY + 8);
    ctx.lineTo(shopX + 3, flagY + 22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText("开张", shopX + 8, flagY + 11);
    drawLabel("旧铺开张", shopX - 18, flagY - 18, "#8f5f3f");
    if (seasonalDoorstep?.active) {
      const sceneX = shopX + 4;
      const sceneY = flagY + 54;
      const toneColor = seasonalDoorstep.tone.includes("rain") ? "#4d91a6"
        : seasonalDoorstep.tone.includes("heat") ? "#be4f37"
        : seasonalDoorstep.tone.includes("mist") ? "#5d6f65"
        : seasonalDoorstep.tone.includes("cold") ? "#8f5f3f"
        : "#b47d2f";
      ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
      ctx.beginPath();
      ctx.roundRect(sceneX - 6, sceneY - 14, 78, 34, 12);
      ctx.fill();
      ctx.strokeStyle = `${toneColor}66`;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (seasonalDoorstep.tone.includes("rain")) {
        ctx.strokeStyle = toneColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(sceneX + 20, sceneY + 2, 20, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(77, 145, 166, 0.4)";
        for (let index = 0; index < 3; index += 1) {
          ctx.beginPath();
          ctx.moveTo(sceneX + 4 + index * 18, sceneY + 7);
          ctx.lineTo(sceneX + 1 + index * 18, sceneY + 16);
          ctx.stroke();
        }
      } else if (seasonalDoorstep.tone.includes("heat")) {
        ctx.strokeStyle = "#b47d2f";
        ctx.lineWidth = 2;
        for (let index = 0; index < 4; index += 1) {
          ctx.beginPath();
          ctx.moveTo(sceneX + 5 + index * 8, sceneY - 8);
          ctx.lineTo(sceneX + 2 + index * 8, sceneY + 10);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(77, 145, 166, 0.76)";
        ctx.beginPath();
        ctx.ellipse(sceneX + 50, sceneY + 10, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (seasonalDoorstep.tone.includes("mist")) {
        ctx.fillStyle = "rgba(224, 182, 109, 0.9)";
        ctx.beginPath();
        ctx.arc(sceneX + 24, sceneY + 4, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(93, 111, 101, 0.5)";
        ctx.setLineDash([5, 6]);
        ctx.beginPath();
        ctx.moveTo(sceneX + 38, sceneY + 2);
        ctx.lineTo(sceneX + 66, sceneY - 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (seasonalDoorstep.tone.includes("cold")) {
        ctx.fillStyle = "rgba(143, 95, 63, 0.88)";
        ctx.beginPath();
        ctx.roundRect(sceneX + 12, sceneY + 2, 28, 14, 6);
        ctx.fill();
        ctx.strokeStyle = "rgba(224, 182, 109, 0.8)";
        for (let index = 0; index < 3; index += 1) {
          ctx.beginPath();
          ctx.moveTo(sceneX + 18 + index * 6, sceneY - 2);
          ctx.quadraticCurveTo(sceneX + 14 + index * 6, sceneY - 9 - pulse, sceneX + 20 + index * 6, sceneY - 14);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = "rgba(255, 248, 232, 0.94)";
        ctx.fillRect(sceneX + 12, sceneY - 8, 28, 18);
        ctx.strokeStyle = toneColor;
        ctx.strokeRect(sceneX + 12, sceneY - 8, 28, 18);
        ctx.fillStyle = toneColor;
        ctx.font = "700 10px Microsoft YaHei";
        ctx.fillText("节气", sceneX + 15, sceneY + 5);
      }
      drawLabel(`节气门口 · ${seasonalDoorstep.bubble}`, sceneX - 6, sceneY + 36, toneColor);
    }
    if (doorstepScene?.active) {
      const badgeX = shopX + 48;
      const badgeY = flagY + 10;
      ctx.fillStyle = "rgba(241, 249, 251, 0.94)";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY - 12, 44, 24, 10);
      ctx.fill();
      ctx.strokeStyle = "rgba(77, 145, 166, 0.42)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(badgeX + 13, badgeY - 1, 5, 0, Math.PI * 2);
      ctx.arc(badgeX + 26, badgeY - 2, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(badgeX + 11, badgeY + 5);
      ctx.lineTo(badgeX + 15, badgeY + 9);
      ctx.moveTo(badgeX + 24, badgeY + 4);
      ctx.lineTo(badgeX + 28, badgeY + 8);
      ctx.stroke();
      drawLabel(doorstepScene.introducedCount > 0 ? "熟脸带新脚步" : doorstepScene.crowdBoost >= 2 ? "熟脸带热门口" : "熟脸回门", badgeX - 10, badgeY - 20, "#4d91a6");
    }
    if (shopWordOfMouth) {
      const noteX = shopX + 54;
      const noteY = flagY + 36;
      ctx.fillStyle = "rgba(255, 248, 232, 0.94)";
      ctx.beginPath();
      ctx.roundRect(noteX, noteY - 10, 40, 22, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(180, 125, 47, 0.42)";
      ctx.lineWidth = 2;
      ctx.strokeRect(noteX + 7, noteY - 5, 16, 12);
      ctx.beginPath();
      ctx.moveTo(noteX + 27, noteY - 1);
      ctx.lineTo(noteX + 33, noteY - 5);
      ctx.moveTo(noteX + 27, noteY + 5);
      ctx.lineTo(noteX + 33, noteY + 1);
      ctx.stroke();
      drawLabel(shopWordOfMouth.preview ? "口碑起风" : "铺前市闻", noteX - 12, noteY + 28, "#b47d2f");
    }
  }

  if (firstSaleDone) {
    ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
    ctx.beginPath();
    ctx.roundRect(saleX, saleY - 16, 44, 30, 9);
    ctx.fill();
    ctx.strokeStyle = `rgba(224, 182, 109, ${0.52 + pulse / 20})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(saleX + 5, saleY - 10, 18, 18);
    ctx.beginPath();
    ctx.arc(saleX + 31, saleY - 1, 8 + pulse / 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#be4f37";
    ctx.fillRect(saleX + 9, saleY - 4, 10, 2);
    ctx.fillRect(saleX + 9, saleY + 2, 8, 2);
    ctx.fillStyle = "#f0a54e";
    ctx.beginPath();
    ctx.arc(saleX + 31, saleY - 1, 5, 0, Math.PI * 2);
    ctx.fill();
    drawLabel("第一笔钱签", saleX - 8, saleY - 24, "#be4f37");
  }

  ctx.restore();
  return true;
}

function ecologyShopAuraVisitorBubbleWorld(
  archetype = "",
  ecologyShopAura = null,
  ecologyShopAuraVisualPalette = () => ({ label: "余韵" }),
) {
  const label = ecologyShopAuraVisualPalette(ecologyShopAura?.comboId).label;
  const bubbles = {
    villager: `${label}，去看看`,
    child: "好香呀",
    rogue_cultivator: "路上补点货",
    healer: "这味能入药",
    crafter: "材料气不赖",
    trader: "回单在这边",
    guest: "今日有好礼？",
    faction: "采办要核货",
    pilgrim: "灵息往铺里走",
    collector: "稀货有线索",
  };
  return bubbles[archetype] || "顺着余韵来";
}

function ecologyShopAuraVisitorRowsWorld({
  ecologyShopAura = null,
  customerDisplayName = (archetype = "") => archetype,
  ecologyShopAuraVisitorColor = () => "#5d6f65",
  ecologyShopAuraVisualPalette = () => ({ label: "余韵" }),
} = {}) {
  if (!ecologyShopAura?.active) return [];
  const preferred = ecologyShopAura.preferredArchetypes?.length ? ecologyShopAura.preferredArchetypes : ["villager"];
  return preferred.slice(0, 3).map((archetype, index) => ({
    archetype,
    name: customerDisplayName(archetype),
    color: ecologyShopAuraVisitorColor(archetype),
    bubble: ecologyShopAuraVisitorBubbleWorld(archetype, ecologyShopAura, ecologyShopAuraVisualPalette),
    delay: index * 0.23,
  }));
}

export function drawEcologyShopAuraVisitorsWorld({
  ctx,
  ecologyShopAura = null,
  motion = 0,
  reducedMotion = false,
  pointOnPolyline = () => ({ x: 0, y: 0 }),
  customerDisplayName = (archetype = "") => archetype,
  ecologyShopAuraVisitorColor = () => "#5d6f65",
  ecologyShopAuraVisualPalette = () => ({
    accent: "#b47d2f",
    mote: "#fffdf5",
    label: "余韵",
  }),
} = {}) {
  if (!ctx) return false;
  const visitors = ecologyShopAuraVisitorRowsWorld({
    ecologyShopAura,
    customerDisplayName,
    ecologyShopAuraVisitorColor,
    ecologyShopAuraVisualPalette,
  });
  if (!visitors.length) return false;
  const palette = ecologyShopAuraVisualPalette(ecologyShopAura?.comboId);
  const paths = [
    [{ x: 370, y: 342 }, { x: 282, y: 318 }, { x: 204, y: 286 }, { x: 138, y: 248 }],
    [{ x: 424, y: 396 }, { x: 322, y: 360 }, { x: 236, y: 318 }, { x: 168, y: 270 }],
    [{ x: 514, y: 366 }, { x: 394, y: 326 }, { x: 286, y: 294 }, { x: 198, y: 258 }],
  ];
  ctx.save();
  visitors.forEach((visitor, index) => {
    const path = paths[index % paths.length];
    const progress = reducedMotion ? 0.78 : (0.58 + ((motion * 0.08 + visitor.delay) % 0.38));
    const point = pointOnPolyline(path, progress);
    const bob = reducedMotion ? 0 : Math.sin(motion * 3 + index) * 3;
    const x = point.x;
    const y = point.y + bob;

    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = `${palette.accent}66`;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
    ctx.beginPath();
    path.forEach((routePoint, routeIndex) => {
      if (routeIndex === 0) ctx.moveTo(routePoint.x, routePoint.y);
      else ctx.lineTo(routePoint.x, routePoint.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
    ctx.beginPath();
    ctx.ellipse(x + 14, y + 43, 20, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = visitor.color;
    ctx.beginPath();
    ctx.roundRect(x, y + 12, 28, 34, 10);
    ctx.fill();
    ctx.fillStyle = "#fff0d4";
    ctx.beginPath();
    ctx.arc(x + 14, y + 6, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.mote;
    ctx.beginPath();
    ctx.arc(x + 24, y - 2, 4, 0, Math.PI * 2);
    ctx.fill();

    const bubbleWidth = Math.max(82, Math.min(120, visitor.bubble.length * 12));
    ctx.fillStyle = "rgba(255, 248, 232, 0.94)";
    ctx.strokeStyle = `${palette.accent}55`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 30, y - 20, bubbleWidth, 26, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = palette.accent;
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(visitor.bubble.slice(0, 9), x + 40, y - 4);

    ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
    ctx.beginPath();
    ctx.roundRect(x - 12, y + 50, 62, 21, 9);
    ctx.fill();
    ctx.fillStyle = "#17231d";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText(String(visitor.name || "").slice(0, 5), x, y + 64);
  });
  ctx.restore();
  return true;
}

export function drawEcologyShopAuraAtShopWorld({
  ctx,
  ecologyShopAura = null,
  motion = 0,
  reducedMotion = false,
  pointOnPolyline = () => ({ x: 0, y: 0 }),
  ecologyShopAuraVisualPalette = () => ({
    accent: "#b47d2f",
    soft: "rgba(255, 248, 232, 0.4)",
    mote: "#fffdf5",
    glyph: "铺",
    label: "余韵",
  }),
} = {}) {
  if (!ctx || !ecologyShopAura?.active) return false;
  const palette = ecologyShopAuraVisualPalette(ecologyShopAura.comboId);
  const route = [
    { x: 508, y: 382 },
    { x: 418, y: 330 },
    { x: 312, y: 284 },
    { x: 202, y: 238 },
    { x: 96, y: 218 },
  ];
  const drift = reducedMotion ? 0 : motion;
  ctx.save();
  ctx.globalAlpha = 0.86;
  ctx.strokeStyle = palette.soft;
  ctx.lineWidth = ecologyShopAura.inspectionCareActive ? 7 : 5;
  ctx.setLineDash([12, 14]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 18;
  ctx.beginPath();
  route.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.quadraticCurveTo((route[index - 1].x + point.x) / 2, Math.min(route[index - 1].y, point.y) - 26, point.x, point.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 9; i += 1) {
    const progress = (i / 9 + drift * 0.08) % 1;
    const point = pointOnPolyline(route, progress);
    const bob = Math.sin(drift * 2 + i * 0.9) * 5;
    ctx.globalAlpha = 0.38 + (i % 3) * 0.12;
    ctx.fillStyle = i % 2 ? palette.mote : "#fffdf5";
    ctx.beginPath();
    ctx.arc(point.x + Math.sin(drift + i) * 5, point.y + bob, ecologyShopAura.inspectionCareActive ? 4.2 : 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const doorGlow = ctx.createRadialGradient(116, 214, 8, 116, 214, 86);
  doorGlow.addColorStop(0, palette.soft);
  doorGlow.addColorStop(0.58, "rgba(255, 253, 245, 0.16)");
  doorGlow.addColorStop(1, "rgba(255, 253, 245, 0)");
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = doorGlow;
  ctx.beginPath();
  ctx.ellipse(116, 218, 96, 42, -0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.96;
  ctx.fillStyle = "rgba(255, 248, 232, 0.88)";
  ctx.beginPath();
  ctx.roundRect(62, 174, 128, 36, 14);
  ctx.fill();
  ctx.strokeStyle = `${palette.accent}88`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = palette.accent;
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(`${palette.glyph} · 夜事余韵`, 78, 197);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(202, 204, 142, 30, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(23, 35, 29, 0.12)";
  ctx.stroke();
  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${palette.label} · 来客 +${ecologyShopAura.visitorBonus}`, 216, 224);

  if (ecologyShopAura.inspectionCareActive) {
    ctx.fillStyle = "rgba(246, 240, 182, 0.88)";
    ctx.beginPath();
    ctx.roundRect(214, 236, 112, 24, 10);
    ctx.fill();
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText("巡看照料已接入", 228, 252);
  }
  ctx.restore();
  return true;
}

export function drawQingboWaterFreshSignatureSignWorld({
  ctx,
  aura = null,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !aura?.active) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2;
  const ripple = reducedMotion ? 0 : Math.sin(motion * 2.8) * 3;
  const x = 54;
  const y = 134;
  ctx.save();
  ctx.globalAlpha = 0.95;
  const glow = ctx.createRadialGradient(x + 82, y + 34, 10, x + 82, y + 34, 92);
  glow.addColorStop(0, "rgba(77, 145, 166, 0.28)");
  glow.addColorStop(0.58, "rgba(202, 235, 210, 0.14)");
  glow.addColorStop(1, "rgba(241, 249, 251, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(x + 82, y + 40, 108, 48, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(77, 145, 166, 0.68)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 18, y + 8 + pulse);
  ctx.lineTo(x + 18, y + 68 + pulse);
  ctx.moveTo(x + 140, y + 8 + pulse);
  ctx.lineTo(x + 140, y + 68 + pulse);
  ctx.stroke();

  ctx.fillStyle = "rgba(241, 249, 251, 0.94)";
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 12 + pulse, 152, 48, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.6)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#4d91a6";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText("清波水鲜招牌", x + 18, y + 32 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(
    `${aura.regularsActive ? "熟客" : aura.itemName} x${aura.regularsActive ? aura.menuDishCount || aura.count : aura.count} · 来客 +${aura.visitorBonus}`,
    x + 18,
    y + 49 + pulse,
  );

  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.arc(x + 132, y + 36 + pulse, 14 + Math.max(0, ripple), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4d91a6";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText("鲜", x + 126, y + 41 + pulse);

  for (let i = 0; i < 3; i += 1) {
    ctx.strokeStyle = `rgba(77, 145, 166, ${0.22 - i * 0.04})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + 124, y + 72 + pulse, 18 + i * 9 + Math.max(0, ripple), 0.12, Math.PI - 0.12);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawShopDisplayDiagnosisSignWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !spec?.active) return false;
  const x = 56;
  const y = 186;
  const w = 158;
  const h = 66;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2;
  const accent = spec.tone === "warn" ? "#be4f37" : spec.tone === "good" ? "#286f58" : "#b47d2f";
  const feature = spec.featuredGoods?.[0] || null;

  ctx.save();
  ctx.fillStyle = "rgba(255, 248, 232, 0.92)";
  ctx.strokeStyle = spec.tone === "warn" ? "rgba(190, 79, 55, 0.58)" : "rgba(40, 111, 88, 0.36)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y + pulse, w, h, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText("货架陈列", x + 14, y + 20 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`主题 ${spec.themeScore}% · ${spec.hotTagLabel}`.slice(0, 15), x + 14, y + 39 + pulse);
  ctx.fillStyle = accent;
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`主推 ${feature ? feature.itemName : "可卖货"}`.slice(0, 16), x + 14, y + 56 + pulse);
  ctx.fillStyle = spec.tone === "warn" ? "rgba(190, 79, 55, 0.14)" : "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.arc(x + w - 22, y + 22 + pulse, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(spec.tone === "warn" ? "调" : "推", x + w - 28, y + 26 + pulse);
  ctx.restore();
  return true;
}

export function drawShopRestockTargetSignWorld({
  ctx,
  target = null,
  have = 0,
  ready = false,
  overdue = false,
  waterFresh = false,
  waterwayReorder = false,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !target || target.status !== "active") return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 2;
  const x = 220;
  const y = 278;
  const w = 168;
  const h = 76;

  ctx.save();
  ctx.fillStyle = waterFresh
    ? ready
      ? "rgba(226, 244, 238, 0.95)"
      : "rgba(226, 241, 247, 0.94)"
    : ready
      ? "rgba(237, 243, 223, 0.94)"
      : overdue
        ? "rgba(255, 240, 232, 0.94)"
        : "rgba(255, 248, 232, 0.94)";
  ctx.strokeStyle = waterFresh
    ? "rgba(77, 145, 166, 0.62)"
    : ready
      ? "rgba(40, 111, 88, 0.58)"
      : overdue
        ? "rgba(190, 79, 55, 0.58)"
        : "rgba(180, 125, 47, 0.5)";
  ctx.lineWidth = ready ? 3 : 2;
  ctx.beginPath();
  ctx.roundRect(x, y + pulse, w, h, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = waterFresh ? "#4d91a6" : ready ? "#286f58" : overdue ? "#be4f37" : "#8f5f3f";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(
    ready ? "补货可完成" : overdue ? "补货逾期" : waterwayReorder ? "水航回订" : waterFresh ? "水鲜补货" : "补货追踪",
    x + 14,
    y + 20 + pulse,
  );
  ctx.fillStyle = "#17231d";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(target.itemName || "").slice(0, 8), x + 14, y + 40 + pulse);
  ctx.fillStyle = waterFresh ? "#4d91a6" : ready ? "#286f58" : overdue ? "#be4f37" : "#8f5f3f";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(`${have}/${target.desiredCount} · 第${target.dueDay}天`, x + 14, y + 60 + pulse);
  ctx.fillStyle = waterFresh ? "rgba(77, 145, 166, 0.18)" : ready ? "rgba(40, 111, 88, 0.18)" : "rgba(180, 125, 47, 0.16)";
  ctx.beginPath();
  ctx.arc(x + w - 22, y + 22 + pulse, ready ? 13 : 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = waterFresh ? "#4d91a6" : ready ? "#286f58" : "#8f5f3f";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(ready ? "成" : waterwayReorder ? "航" : waterFresh ? "鲜" : "货", x + w - 28, y + 26 + pulse);
  ctx.restore();
  return true;
}

export function drawShopCompendiumDisplayMotifWorld({
  ctx,
  display = null,
  x = 0,
  y = 0,
  index = 0,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !display) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4 + index) * 2;
  const glow = display.entry?.cleared ? 8 : 6;

  ctx.save();
  ctx.fillStyle = "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.ellipse(x + 16, y + 20, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = display.palette.card;
  ctx.strokeStyle = display.palette.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y - 10, 32, 34, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = display.palette.glow;
  ctx.beginPath();
  ctx.arc(x + 16, y - 2, glow + Math.max(0, pulse), 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = display.palette.accent;
  ctx.fillStyle = display.palette.accent;
  ctx.lineWidth = 2;
  const motif = display.motif || "seed";
  if (motif === "thunder") {
    ctx.beginPath();
    ctx.moveTo(x + 17, y - 9);
    ctx.lineTo(x + 9, y + 6 + pulse);
    ctx.lineTo(x + 18, y + 5 + pulse);
    ctx.lineTo(x + 13, y + 22);
    ctx.lineTo(x + 25, y + 4);
    ctx.lineTo(x + 17, y + 5);
    ctx.stroke();
  } else if (motif === "water") {
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(x + 16, y + 7, 7 + i * 5 + pulse * 0.4, 0.18, Math.PI - 0.18);
      ctx.stroke();
    }
  } else if (motif === "bloom") {
    for (let i = 0; i < 5; i += 1) {
      const angle = (Math.PI * 2 * i) / 5 + motion * 0.2;
      ctx.beginPath();
      ctx.ellipse(x + 16 + Math.cos(angle) * 7, y + 7 + Math.sin(angle) * 5, 4, 7, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = display.palette.glow;
    ctx.beginPath();
    ctx.arc(x + 16, y + 7, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (motif === "earth") {
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.roundRect(x + 7 + i * 6, y + 16 - i * 5, 5, 8 + i * 3, 2);
      ctx.fill();
    }
    ctx.strokeRect(x + 7, y + 16, 18, 4);
  } else if (motif === "moon") {
    ctx.beginPath();
    ctx.arc(x + 18, y + 5, 9, Math.PI * 0.24, Math.PI * 1.78);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 253, 245, 0.74)";
    ctx.beginPath();
    ctx.arc(x + 21, y + 2, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (motif === "frost") {
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * i) / 3;
      ctx.beginPath();
      ctx.moveTo(x + 16, y + 7);
      ctx.lineTo(x + 16 + Math.cos(angle) * (10 + pulse * 0.5), y + 7 + Math.sin(angle) * (10 + pulse * 0.5));
      ctx.stroke();
    }
  } else if (motif === "wind") {
    for (let i = 0; i < 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 5 + i * 8);
      ctx.bezierCurveTo(x + 13, y - 1 + i * 8 + pulse, x + 20, y + 12 + i * 5, x + 28, y + 4 + i * 8);
      ctx.stroke();
    }
  } else if (motif === "lantern") {
    ctx.fillStyle = display.palette.glow;
    ctx.beginPath();
    ctx.roundRect(x + 10, y - 4, 13, 18, 6);
    ctx.fill();
    ctx.strokeRect(x + 10, y - 4, 13, 18);
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 14);
    ctx.lineTo(x + 16, y + 23 + pulse);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 8, 6, 11, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x + 21, y + 4, 5, 3, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(143, 95, 63, 0.78)";
  ctx.font = "9px Microsoft YaHei";
  ctx.fillText(index === 0 ? "印" : "记", x + 11, y + 22);
  ctx.restore();
  return true;
}

export function drawCompendiumDisplayAudienceWorld({
  ctx,
  compendiumDisplays = [],
  remark = null,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !compendiumDisplays.length) return false;
  const focus = compendiumDisplays[0];
  const bob = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2.5;
  const x = 222;
  const y = 272 + bob;

  ctx.save();
  ctx.strokeStyle = focus.palette.accent;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 14);
  ctx.lineTo(148, 264);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
  ctx.beginPath();
  ctx.ellipse(x + 18, y + 42, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.beginPath();
  ctx.arc(x + 18, y + 4, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = focus.palette.accent;
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 16, 30, 36, 12);
  ctx.fill();
  ctx.fillStyle = focus.palette.glow;
  ctx.beginPath();
  ctx.arc(x + 28, y + 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 248, 232, 0.92)";
  ctx.beginPath();
  ctx.roundRect(x - 12, y - 34, 96, 24, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.24)";
  ctx.stroke();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 11px Microsoft YaHei";
  const label = remark?.compendiumDisplay || focus.shortTitle || "节气印记";
  ctx.fillText(`看${String(label).slice(0, 4)}`, x, y - 18);
  ctx.restore();
  return true;
}

export function drawShopReputationStageSignWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !spec || spec.progressCount <= 0) return false;
  const x = 56;
  const y = 166;
  const width = 256;
  const height = spec.progressCount >= 5 ? 94 : 78;
  const accentMap = {
    quiet: "#8f5f3f",
    start: "#b47d2f",
    return: "#286f58",
    spread: "#4d91a6",
    trust: "#286f58",
    complete: "#b47d2f",
  };
  const accent = accentMap[spec.tone] || "#b47d2f";
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4) * 2;
  const proofCount = Math.max(0, Math.min(spec.progressTotal || 8, spec.progressCount || 0));

  ctx.save();
  ctx.fillStyle = spec.tone === "complete" ? "rgba(255, 248, 232, 0.96)" : "rgba(255, 253, 245, 0.9)";
  ctx.strokeStyle = `${accent}66`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y + pulse, width, height, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(x + 14, y + 12 + pulse, 52, 44, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 24px Microsoft YaHei";
  ctx.fillText("铺", x + 28, y + 42 + pulse);

  ctx.fillStyle = "#17231d";
  ctx.font = "700 14px Microsoft YaHei";
  ctx.fillText(`旧铺名声 · ${spec.stageName}`.slice(0, 16), x + 78, y + 28 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(`${spec.metricsText} · ${spec.hotTagLabel}`.slice(0, 22), x + 78, y + 48 + pulse);

  ctx.fillStyle = "rgba(23, 35, 29, 0.1)";
  ctx.beginPath();
  ctx.roundRect(x + 78, y + 58 + pulse, 132, 7, 999);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(x + 78, y + 58 + pulse, Math.max(12, 132 * spec.progressPercent / 100), 7, 999);
  ctx.fill();

  for (let i = 0; i < (spec.progressTotal || 8); i += 1) {
    const dotX = x + 18 + i * 24;
    const dotY = y + height - 16 + pulse;
    ctx.fillStyle = i < proofCount ? accent : "rgba(143, 95, 63, 0.18)";
    ctx.beginPath();
    ctx.arc(dotX, dotY, i < proofCount ? 4.2 : 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  if (spec.progressCount >= 3) {
    const path = [
      { x: 80, y: 302 },
      { x: 116, y: 286 },
      { x: 154, y: 284 },
      { x: 196, y: 296 },
    ];
    ctx.strokeStyle = "rgba(40, 111, 88, 0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    path.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (spec.progressCount >= 5) {
    ctx.fillStyle = "rgba(239, 217, 208, 0.94)";
    ctx.strokeStyle = "rgba(190, 79, 55, 0.42)";
    ctx.beginPath();
    ctx.roundRect(272, 198 + pulse, 30, 42, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#be4f37";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText("来帖", 276, 222 + pulse);
  }

  if (spec.progressCount >= 7) {
    ctx.fillStyle = "rgba(224, 182, 109, 0.88)";
    ctx.beginPath();
    ctx.roundRect(304, 238 + pulse, 34, 24, 7);
    ctx.fill();
    ctx.strokeStyle = "rgba(143, 95, 63, 0.58)";
    ctx.stroke();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText("捎", 316, 255 + pulse);
    ctx.strokeStyle = "rgba(143, 95, 63, 0.5)";
    ctx.beginPath();
    ctx.arc(321, 238 + pulse, 12, Math.PI, Math.PI * 2);
    ctx.stroke();
  }

  if (spec.tone === "complete") {
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.74)" : "rgba(202, 235, 210, 0.7)";
      ctx.beginPath();
      ctx.arc(86 + i * 48, 154 + Math.sin(motion * 1.7 + i) * 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  return true;
}

export function drawCareChainShopEchoWorld({
  ctx,
  echo = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !echo) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2;

  ctx.save();
  ctx.strokeStyle = echo.tone === "town" ? "rgba(40, 111, 88, 0.46)" : "rgba(224, 182, 109, 0.42)";
  ctx.lineWidth = 2.4;
  ctx.setLineDash([5, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(92, 298);
  ctx.quadraticCurveTo(150, 278 + pulse, 236, 292);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i % 2 ? "rgba(202, 235, 210, 0.72)" : "rgba(246, 240, 182, 0.72)";
    ctx.beginPath();
    ctx.ellipse(104 + i * 34, 294 + Math.sin(motion * 1.8 + i) * 2, 8, 4, -0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, 218, 206 + pulse, 174, 58, "rgba(237, 243, 223, 0.88)");
  ctx.fillStyle = echo.tone === "town" ? "#286f58" : "#8f5f3f";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`生机回声 · ${echo.stageName}`, 236, 228 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(echo.shopLine.slice(0, 22), 236, 246 + pulse);
  ctx.fillStyle = "rgba(40, 111, 88, 0.14)";
  ctx.beginPath();
  ctx.arc(364, 224 + pulse, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText("稳", 358, 228 + pulse);
  ctx.restore();
  return true;
}
