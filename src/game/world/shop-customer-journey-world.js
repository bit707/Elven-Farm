export function drawShopFirstSaleActionTrailWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const cardY = rect.y + (reducedMotion ? 0 : Math.sin(motion * 2.2) * 2.4) * 0.35;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.72)" : "rgba(224, 182, 109, 0.48)";
  ctx.lineWidth = active ? 3.5 : 2.5;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 15;
  ctx.beginPath();
  spec.path.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else {
      const prev = spec.path[index - 1];
      ctx.quadraticCurveTo((prev.x + point.x) / 2, Math.min(prev.y, point.y) - 18, point.x, point.y);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);

  spec.steps.forEach((step, index) => {
    const point = spec.path[Math.min(index + 1, spec.path.length - 1)] || spec.anchor;
    const bob = reducedMotion ? 0 : Math.sin(motion * 2.4 + index) * 2;
    ctx.fillStyle = `${step.accent}22`;
    ctx.beginPath();
    ctx.arc(point.x, point.y - 20 + bob, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = step.accent;
    ctx.beginPath();
    ctx.arc(point.x, point.y - 20 + bob, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(step.label, point.x - 4, point.y - 16 + bob);
  });

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.86)" : "rgba(180, 125, 47, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(40, 111, 88, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 48, 46, 15);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("\u52a8", rect.x + 28, cardY + 43);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 76, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 76, cardY + 43);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} \u00b7 ${spec.price || 0} \u7075\u77f3`.slice(0, 28), rect.x + 76, cardY + 59);

  const rowY = cardY + 72;
  spec.steps.forEach((step, index) => {
    const stepX = rect.x + 16 + index * 74;
    ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
    ctx.strokeStyle = `${step.accent}44`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(stepX, rowY, 66, 24, 10);
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
  ctx.fillText(`${spec.cta} \u00b7 ${spec.returnText}`.slice(0, 48), rect.x + 18, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function drawShopFirstSaleKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const accent = spec.accent || "#b47d2f";
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4) * 2;

  ctx.save();
  ctx.globalAlpha = active ? 1 : 0.94;
  ctx.strokeStyle = active ? `${accent}cc` : `${accent}66`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.setLineDash([5, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + 22, rect.y + 12 + pulse, rect.x + 18, rect.y + 48 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 5; i += 1) {
    const stepX = rect.x - 18 + i * 18;
    const stepY = rect.y + 58 + Math.sin(motion * 1.8 + i) * (reducedMotion ? 0 : 1.6);
    ctx.fillStyle = i % 2 ? `${accent}55` : "rgba(23, 35, 29, 0.16)";
    ctx.beginPath();
    ctx.ellipse(stepX, stepY, 6.5, 3.4, i % 2 ? -0.32 : 0.32, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(255, 248, 232, 0.94)");
  ctx.strokeStyle = active ? accent : `${accent}88`;
  ctx.lineWidth = active ? 2.5 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 15);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 10, rect.y + 12 + pulse, 42, 40, 12);
  ctx.fill();
  ctx.strokeStyle = `${accent}99`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 17, rect.y + 18 + pulse, 18, 22, 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rect.x + 41, rect.y + 30 + pulse, 8 + Math.abs(pulse) * 0.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#f0a54e";
  ctx.beginPath();
  ctx.arc(rect.x + 41, rect.y + 30 + pulse, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("\u94b1\u7b7e", rect.x + 16, rect.y + 56 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 12), rect.x + 60, rect.y + 19 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(`${spec.customerName}\u8bb0\u4f4f\u4e86`.slice(0, 12), rect.x + 60, rect.y + 37 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.itemName.slice(0, 10), rect.x + 60, rect.y + 51 + pulse);
  ctx.fillStyle = active ? "#286f58" : "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`\u987e\u5ba2\u811a\u5370 \u00b7 \u56de\u5934\u82d7\u5934 ${spec.returnChance || 0}%`.slice(0, 18), rect.x + 60, rect.y + 65 + pulse);
  ctx.restore();
  return true;
}

export function drawShopReturningTrailWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const accent = spec.accent || "#b47d2f";
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}cc` : `${accent}55`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.bezierCurveTo(334, 292 + pulse, 484, 322 + pulse, rect.x + 22, cardY + 74);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 5; i += 1) {
    const stepX = rect.x - 46 + i * 24;
    const stepY = cardY + 76 + Math.sin(motion * 1.7 + i) * (reducedMotion ? 0 : 2);
    ctx.fillStyle = `${accent}${active ? "88" : "55"}`;
    ctx.beginPath();
    ctx.ellipse(stepX, stepY, 8, 4, 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? accent : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, cardY, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 13, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("\u56de", rect.x + 29, cardY + 43);
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 50, 38, 15, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("\u53ef\u70b9", rect.x + 30, cardY + 61);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 17), rect.x + 78, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 78, cardY + 44);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.customerLabel} \u00b7 ${spec.itemText}`.slice(0, 30), rect.x + 78, cardY + 61);

  ctx.fillStyle = spec.realized ? "rgba(237, 243, 223, 0.92)" : "rgba(255, 253, 245, 0.9)";
  ctx.strokeStyle = `${accent}44`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 72, rect.width - 32, 21, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = spec.realized ? "#286f58" : "#b47d2f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText((spec.resultText || "\u719f\u8138\u82d7\u5934").slice(0, 28), rect.x + 26, cardY + 86);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`\u4e0b\u4e00\u6b65\uff1a${spec.nextAction} \u00b7 \u4e0d\u4f1a\u81ea\u52a8\u5f00\u94fa\u3001\u8865\u8d27\u6216\u6539\u4ef7`.slice(0, 42), rect.x + 22, cardY + 103);
  ctx.restore();
  return true;
}

export function drawShopThoughtRouteWorldCardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  accent = "#4d91a6",
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.76) * 2;
  const glow = reducedMotion ? 0.34 : 0.34 + Math.sin(motion * 2.2) * 0.12;
  const cardY = rect.y + pulse * 0.4;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}77`;
  ctx.lineWidth = active ? 3.1 : 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.bezierCurveTo(anchor.x + 68, anchor.y - 12 + pulse, rect.x - 42, cardY + 26, rect.x + 18, cardY + 58);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = `rgba(248, 243, 232, ${0.96 - glow * 0.08})`;
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.6 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, cardY, rect.width, rect.height, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.font = "bold 16px 'Microsoft YaHei'";
  ctx.fillText((spec.title || "\u65e7\u94fa\u60f3\u6cd5\u7eed\u8def\u7ebf\u7b7e \u00b7 \u53ef\u70b9").slice(0, 18), rect.x + 18, cardY + 28);
  ctx.fillStyle = "#243128";
  ctx.font = "13px 'Microsoft YaHei'";
  ctx.fillText((spec.headline || "").slice(0, 28), rect.x + 18, cardY + 50);

  (spec.steps || []).slice(0, 3).forEach((step, index) => {
    const rowY = cardY + 72 + index * 16;
    ctx.fillStyle = step.accent || accent;
    ctx.font = "bold 12px 'Microsoft YaHei'";
    ctx.fillText((step.title || "").slice(0, 10), rect.x + 18, rowY);
    ctx.fillStyle = "#465448";
    ctx.font = "12px 'Microsoft YaHei'";
    ctx.fillText((step.text || "").slice(0, 20), rect.x + 92, rowY);
  });
  ctx.restore();
  return true;
}

function drawShopCustomerLessonWorldRows(ctx, rect, cardY, steps = []) {
  steps.forEach((step, index) => {
    const stepX = rect.x + 16 + index * 92;
    const stepY = cardY + 73;
    ctx.fillStyle = `${step.accent}1f`;
    ctx.strokeStyle = `${step.accent}55`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(stepX, stepY, 84, 28, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = step.accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(step.badge, stepX + 8, stepY + 18);
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(step.title || "").slice(0, 5), stepX + 26, stepY + 11);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 7px Microsoft YaHei";
    ctx.fillText(String(step.text || "").slice(0, 10), stepX + 26, stepY + 22);
  });
}

export function drawShopCustomerLessonMorningFollowupWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.actionAccent || "#b47d2f";
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.85) * 2.1;
  const glow = reducedMotion ? 0.36 : 0.36 + Math.sin(motion * 2.6) * 0.12;
  const cardY = rect.y + pulse * 0.38;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3.2 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 10);
  ctx.bezierCurveTo(anchor.x + 86, anchor.y + 18 + pulse, rect.x - 42, cardY + 34, rect.x + 18, cardY + 62);
  ctx.stroke();
  ctx.setLineDash([]);

  const lampX = anchor.x + 34;
  const lampY = anchor.y + 12 + pulse * 0.45;
  ctx.fillStyle = `${accent}${Math.round(glow * 120).toString(16).padStart(2, "0")}`;
  ctx.beginPath();
  ctx.ellipse(lampX, lampY + 22, 42, 14, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.42)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(lampX, lampY - 10);
  ctx.lineTo(lampX, lampY + 7);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 248, 232, 0.96)";
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}88`;
  ctx.lineWidth = active ? 2.2 : 1.4;
  ctx.beginPath();
  ctx.roundRect(lampX - 18, lampY + 4, 36, 34, 11);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText("\u6539", lampX - 8, lampY + 27);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 251, 236, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 13, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("\u94fa", rect.x + 28, cardY + 43);
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 50, 38, 15, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("\u53ef\u70b9", rect.x + 30, cardY + 61);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} \u00b7 ${spec.hotTagLabel}`.slice(0, 24), rect.x + 78, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 22), rect.x + 78, cardY + 44);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`\u6539\u6cd5\uff1a${spec.nextAction}`.slice(0, 34), rect.x + 78, cardY + 60);

  drawShopCustomerLessonWorldRows(ctx, rect, cardY, spec.steps || []);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} \u00b7 \u4e0d\u81ea\u52a8\u5f00\u94fa\u3001\u8c03\u4ef7/\u8865\u8d27`.slice(0, 48), rect.x + 18, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function drawShopCustomerLessonVerificationEchoWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.tone === "warn" ? "#be4f37" : spec.tone === "steady" ? "#b47d2f" : "#286f58";
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.05) * 2;
  const cardY = rect.y + pulse * 0.35;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3.2 : 2;
  ctx.setLineDash([7, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x + 26, anchor.y + 36);
  ctx.bezierCurveTo(anchor.x + 132, anchor.y + 66 + pulse, rect.x - 36, cardY + 52, rect.x + 26, cardY + 70);
  ctx.stroke();
  ctx.setLineDash([]);

  const sealX = rect.x + 22;
  const sealY = cardY - 10;
  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.arc(sealX + 18, sealY + 20, 24 + Math.abs(pulse) * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}88`;
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.arc(sealX + 18, sealY + 20, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.tone === "warn" ? "\u518d" : "\u9a8c", sealX + 11, sealY + 25);

  drawCanvasCard(
    ctx,
    rect.x,
    cardY,
    rect.width,
    rect.height,
    spec.tone === "warn" ? "rgba(255, 240, 232, 0.96)" : "rgba(240, 248, 238, 0.96)",
  );
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("\u9a8c", rect.x + 28, cardY + 44);
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 51, 38, 15, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("\u53ef\u70b9", rect.x + 30, cardY + 62);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} \u00b7 ${spec.hotTagLabel}`.slice(0, 23), rect.x + 78, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 78, cardY + 44);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(
    `\u6210\u4ea4 ${spec.buyers}/${spec.visitors} \u00b7 \u8f6c\u5316 ${spec.conversion}%${spec.delta ? ` (${spec.delta > 0 ? "+" : ""}${spec.delta})` : ""}`.slice(0, 34),
    rect.x + 78,
    cardY + 60,
  );

  drawShopCustomerLessonWorldRows(ctx, rect, cardY, spec.steps || []);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} \u00b7 \u4e0d\u81ea\u52a8\u5f00\u94fa\u3001\u6210\u4ea4/\u6263\u5e93\u5b58`.slice(0, 48), rect.x + 18, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function shopTrialTheaterWorldSpecWorld({
  opening = null,
  report = [],
  goods = [],
  thoughtEntries = [],
  liveFocus = null,
  forecast = null,
  firstSale = null,
  day = 1,
  itemName = (itemId) => itemId,
} = {}) {
  const firstReport = (Array.isArray(report) ? report : [])
    .map((entry, reportIndex) => ({ ...entry, reportIndex }))
    .find((entry) => entry.reason && entry.reason !== "diagnosis") || null;
  const active = Boolean((Array.isArray(goods) && goods.length) || opening?.opened || liveFocus || (Array.isArray(thoughtEntries) && thoughtEntries.length) || firstSale || firstReport);
  if (!active) return null;
  const leadThought = thoughtEntries?.[0] || null;
  const leadReport = firstSale?.reportEntry || firstReport || null;
  const hasSale = Boolean(firstSale || leadReport?.reason === "buy");
  const hasLeaver = Boolean(leadReport && ["price", "stock", "tag"].includes(leadReport.reason));
  const hotTagLabel = liveFocus?.hotTagLabel || opening?.hotTagLabel || forecast?.hotTagLabel || "热卖标签";
  const leadCustomer = firstSale?.customerName
    || leadReport?.name
    || leadThought?.name
    || forecast?.customerName
    || "第一批顾客";
  const leadItem = firstSale?.itemName
    || (leadReport?.itemId ? itemName(leadReport.itemId) : "")
    || forecast?.itemText
    || goods?.[0]?.itemName
    || "今日主推货";
  const resultText = hasSale
    ? `${leadCustomer}买走${leadItem}${firstSale?.price ? `，成交 ${firstSale.price} 灵石` : ""}`
    : hasLeaver
      ? `${leadCustomer}犹豫离店：${leadReport?.text || liveFocus?.topBlockerLabel || "还没被说服"}`
      : opening?.opened
        ? `${Number(liveFocus?.buyers || 0)} 单成交 · ${Number(liveFocus?.leavers || 0)} 位犹豫`
        : "尚未开铺，先用热卖牌测试顾客";
  const reasonText = firstSale?.reasonText
    || leadReport?.detail
    || leadThought?.detail
    || leadThought?.text
    || forecast?.advice
    || "把顾客想法、货架标签和价格放在同一张小账里看。";
  const nextAction = hasSale
    ? firstSale?.returnCta || liveFocus?.shelfAdvice || `继续围绕${hotTagLabel}补货，复现第一笔成交原因。`
    : hasLeaver
      ? liveFocus?.shelfAdvice || "按离店原因微调价格、库存或货架主题。"
      : forecast?.advice || "先准备一件匹配热卖标签的加工品，再开铺观察。";
  const tone = hasSale ? "good" : hasLeaver ? "warn" : goods.length ? "ready" : "empty";
  const steps = [
    {
      label: "想法泡泡",
      title: leadThought?.name || leadCustomer,
      text: leadThought?.text || `想找${hotTagLabel}货`,
      state: thoughtEntries.length ? "done" : goods.length ? "todo" : "empty",
    },
    {
      label: "热卖牌",
      title: hotTagLabel || "热卖标签",
      text: leadItem,
      state: goods.length ? "done" : "todo",
    },
    {
      label: hasSale ? "成交原因" : hasLeaver ? "离店原因" : "等开铺",
      title: hasSale ? "买单" : hasLeaver ? "没买" : "试营业",
      text: resultText,
      state: hasSale ? "good" : hasLeaver ? "warn" : opening?.opened ? "mid" : "todo",
    },
  ];
  return {
    key: `${day}:${tone}:${leadCustomer}:${leadItem}:${hotTagLabel}:${Number(liveFocus?.buyers || 0)}:${Number(liveFocus?.leavers || 0)}`,
    day,
    tone,
    title: hasSale ? "首单原因小剧场 · 可点" : opening?.opened ? "顾客想法小剧场 · 可点" : "旧铺试营业预告 · 可点",
    headline: hasSale ? "第一笔成交原因已经写清" : hasLeaver ? "顾客没买也留下了原因" : "开铺前先看谁会被什么吸引",
    leadCustomer,
    leadItem,
    hotTagLabel,
    resultText,
    reasonText,
    nextAction,
    steps,
    selector: hasSale && firstSale?.reportIndex >= 0
      ? `[data-shop-report-index="${Number(firstSale.reportIndex)}"]`
      : hasLeaver && Number.isFinite(Number(leadReport?.reportIndex))
        ? `[data-shop-report-index="${Number(leadReport.reportIndex)}"]`
        : '[data-shop-board="opening"]',
    fallbackSelector: hasSale ? '[data-shop-board="decision-ledger"]' : '[data-shop-board="opening"]',
    rect: { x: 222, y: 238, width: 316, height: 126 },
    anchor: { x: 146, y: 208 },
  };
}

export function shopTrialTheaterWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_trial_theater",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      trialTheater: spec,
      rect,
    }
    : null;
}

export const SHOP_CUSTOMER_JOURNEY_STAGES_WORLD = [
  { key: "enter", label: "进店", short: "门口驻足" },
  { key: "browse", label: "看牌", short: "看热卖牌" },
  { key: "price", label: "试价", short: "掂预算" },
  { key: "result", label: "成交/离店", short: "递货或回头" },
  { key: "return", label: "复购建议", short: "明日补货" },
];

export function shopCustomerDecisionChainsWorld({
  opening = null,
  report = [],
  shopTagLabel = (tag) => tag || "",
} = {}) {
  const bubbles = Array.isArray(opening?.needBubbles) ? opening.needBubbles : [];
  const rows = (Array.isArray(report) ? report : [])
    .filter((entry) => ["buy", "price", "stock", "tag"].includes(entry.reason))
    .slice(0, 3);
  const fallbackAdvice = opening?.liveFocus?.shelfAdvice
    || opening?.lastSession?.liveFocus?.shelfAdvice
    || "先看顾客话里的需求，再调整货架和价格。";
  return rows.map((entry, index) => {
    const bubble = bubbles.find((item) => item.customerArchetype && item.customerArchetype === entry.customerArchetype)
      || bubbles.find((item) => item.name === entry.name)
      || bubbles[index]
      || null;
    const resultLabels = {
      buy: "成交",
      price: "嫌贵离店",
      stock: "货架太薄",
      tag: "标签不合",
    };
    const advice = entry.reason === "buy"
      ? `延续 ${bubble?.tag ? shopTagLabel(bubble.tag) : opening?.hotTagLabel || "这类需求"}，明天补一件同标签货。`
      : entry.reason === "price"
        ? "下次先降一点倍率，等熟客留下再抬价。"
        : entry.reason === "stock"
          ? "补足热卖货库存，薄货架会让谨慎顾客退开。"
          : entry.reason === "tag"
            ? `围绕 ${opening?.hotTagLabel || "热卖标签"} 换一件更对口的商品。`
            : fallbackAdvice;
    return {
      name: entry.name || bubble?.name || "顾客",
      need: bubble?.text || bubble?.detail || "进店随手看了看",
      result: `${resultLabels[entry.reason] || "反馈"}：${entry.text || "留下反馈"}`,
      reason: String(entry.detail || "").split("→").map((part) => part.trim()).filter(Boolean).slice(-1)[0] || entry.detail || "原因待观察",
      advice,
      tone: entry.reason === "buy" ? "good" : entry.reason === "price" ? "warn" : "mid",
    };
  });
}

export function shopCustomerDecisionChainsMarkupWorld(chains = []) {
  if (!Array.isArray(chains) || !chains.length) return "";
  return `
    <div class="shop-decision-chain">
      <strong>顾客决策链</strong>
      ${chains.map((chain) => `
        <div class="shop-decision-step ${chain.tone}">
          <b>${chain.name}</b>
          <span>进店：${chain.need}</span>
          <span>结果：${chain.result}</span>
          <small>原因：${chain.reason} · 建议：${chain.advice}</small>
        </div>
      `).join("")}
    </div>
  `;
}

export function shopDecisionLedgerBlockerProfileWorld(reason = "", context = {}) {
  const hotTagLabel = context.hotTagLabel || "热卖标签";
  const lowStockName = context.lowStockName || "热卖货";
  const profiles = {
    price: {
      label: "价签偏高",
      detail: "顾客不是讨厌这件货，而是觉得今天这个价还需要更多理由。",
      nextAction: "明天先压低 5% 到 10% 价签，等熟客留下再试探利润。",
    },
    stock: {
      label: "货架太薄",
      detail: "谨慎顾客看见余量太少，会担心买断别人要用的货。",
      nextAction: `先补 ${lowStockName} 到 2 件以上，让货架看起来更稳。`,
    },
    tag: {
      label: "标签不合",
      detail: "来客有需求，但货架没有把需求讲明白。",
      nextAction: `围绕“${hotTagLabel}”补一件更对口的商品或换陈列主题。`,
    },
  };
  return profiles[reason] || {
    label: "原因待观察",
    detail: "今天反馈还不够集中，先保留这页账，下一次开铺再比较。",
    nextAction: "继续开一轮小规模试营业，观察哪类顾客最常停下。",
  };
}

export function shopCustomerDecisionLedgerSpecWorld({
  customers = [],
  report = [],
  goods = [],
  theme = null,
  themeScore = 0,
  hotTag = "",
  sessionSales = 0,
  needBubbles = [],
  liveFocus = null,
  failureRecovery = null,
  day = 1,
  themeName = "",
  customerDisplayName = (archetype) => archetype || "",
  shopTagLabel = (tag) => tag || "",
  itemName = (itemId) => itemId || "",
  lowStockGoods = [],
  shopCustomerDecisionChains = () => [],
  normalizeShopCustomerDecisionLedger = (ledger) => ledger,
} = {}) {
  const visitors = Array.isArray(customers) ? customers.length : 0;
  const safeReport = Array.isArray(report) ? report : [];
  const buys = safeReport.filter((entry) => entry.reason === "buy");
  const leaves = safeReport.filter((entry) => ["price", "stock", "tag"].includes(entry.reason));
  const archetypeCounts = (Array.isArray(customers) ? customers : []).reduce((counts, customer) => {
    counts[customer.archetype] = Number(counts[customer.archetype] || 0) + 1;
    return counts;
  }, {});
  const mainCustomerArchetype = Object.entries(archetypeCounts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || "";
  const mainCustomer = mainCustomerArchetype ? customerDisplayName(mainCustomerArchetype) : "客群未定";
  const hotTagLabel = shopTagLabel(hotTag);
  const conversion = visitors ? Math.round((buys.length / visitors) * 100) : 0;
  const safeLowStockGoods = Array.isArray(lowStockGoods) ? lowStockGoods : [];
  const lowStockName = safeLowStockGoods[0]?.itemName
    || (safeLowStockGoods[0]?.itemId ? itemName(safeLowStockGoods[0].itemId) : "")
    || (goods?.[0]?.itemId ? itemName(goods[0].itemId) : "热卖货");
  const blockerCounts = leaves.reduce((counts, entry) => {
    counts[entry.reason] = Number(counts[entry.reason] || 0) + 1;
    return counts;
  }, {});
  const blockers = Object.entries(blockerCounts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .map(([reason, count]) => {
      const profile = shopDecisionLedgerBlockerProfileWorld(reason, { hotTagLabel, lowStockName });
      return {
        reason,
        label: profile.label,
        count: Number(count || 0),
        detail: profile.detail,
        nextAction: profile.nextAction,
      };
    });
  const openingLike = {
    needBubbles,
    liveFocus,
    hotTagLabel,
  };
  const chains = shopCustomerDecisionChains(openingLike, safeReport)
    .map((chain) => ({
      ...chain,
      evidence: chain.reason,
    }))
    .slice(0, 4);
  const topItemId = liveFocus?.topItemId || buys[0]?.itemId || "";
  const topItemName = liveFocus?.topItemName || (topItemId ? itemName(topItemId) : "");
  const mainLine = visitors > 0
    ? `${mainCustomer}今天最常进门，热点落在“${hotTagLabel}”。`
    : `还没有稳定客群，先用“${hotTagLabel}”做一次小试。`;
  const saleLine = buys.length > 0
    ? `${buys.length} 位顾客买单，成交率 ${conversion}%${topItemName ? `，${topItemName}最能说明货架价值` : ""}。`
    : "今天还没有成交，但顾客已经留下了可修正的线索。";
  const leaveLine = leaves.length > 0
    ? `${leaves.length} 位顾客犹豫离店，最大短板是${blockers[0]?.label || liveFocus?.topBlockerLabel || "标签不够清楚"}。`
    : "没有明显离店短板，可以沿着这组陈列继续加深库存。";
  const nextAction = failureRecovery?.action
    || blockers[0]?.nextAction
    || liveFocus?.shelfAdvice
    || (buys.length > 0 ? `沿着“${hotTagLabel}”补一件同标签加工品。` : "先准备一件标签明确的可卖货，再开铺观察。");
  const mood = buys.length >= leaves.length && buys.length > 0
    ? "门口热度稳住了，顾客愿意把理由说出口。"
    : leaves.length > 0
      ? "今天不算失败，账页已经把流失原因圈出来了。"
      : "旧铺还在试声量，先让货架讲清楚第一句话。";
  return normalizeShopCustomerDecisionLedger({
    day,
    title: "顾客决策账页",
    headline: liveFocus?.headline || (buys.length > 0 ? `${topItemName || hotTagLabel}开始被看懂` : `${hotTagLabel}还需要更清楚的陈列`),
    mainCustomer,
    mainCustomerArchetype,
    hotTag,
    hotTagLabel,
    visitors,
    buyers: buys.length,
    leavers: leaves.length,
    sales: sessionSales,
    conversion,
    themeName: theme?.note || themeName,
    themeScore: Math.round(themeScore * 100),
    summaryLines: [mainLine, saleLine, leaveLine],
    chains,
    blockers,
    nextAction,
    mood,
    evidence: `${theme?.note || themeName} · 主题 ${Math.round(themeScore * 100)}% · 收入 ${sessionSales} 灵石`,
  });
}

export function shopCustomerDecisionLedgerMarkupWorld(ledger = null, day = 1) {
  if (!ledger) return "";
  const blockerText = Array.isArray(ledger.blockers) && ledger.blockers.length
    ? ledger.blockers.map((entry) => `<b>${entry.label} ${entry.count}</b>`).join("")
    : "<b>无明显短板</b>";
  const chainText = Array.isArray(ledger.chains) && ledger.chains.length
    ? ledger.chains.slice(0, 3).map((chain) => `
      <div class="shop-ledger-chain ${chain.tone}">
        <b>${chain.name}</b>
        <span>${chain.need}</span>
        <small>${chain.result}</small>
      </div>
    `).join("")
    : "<small>继续开铺后，这里会记录顾客从进店到成交或离店的路径。</small>";
  return `
    <div class="shop-decision-ledger" data-shop-board="decision-ledger">
      <strong>${ledger.title} · 第 ${ledger.day || day} 天</strong>
      <span>${ledger.headline}</span>
      <div class="shop-ledger-metrics">
        <b>主客 ${ledger.mainCustomer}</b>
        <b>成交 ${ledger.buyers}/${ledger.visitors}</b>
        <b>主题 ${ledger.themeScore}%</b>
        <b>收入 ${ledger.sales}</b>
      </div>
      <div class="shop-ledger-lines">
        ${ledger.summaryLines.map((line) => `<small>${line}</small>`).join("")}
      </div>
      <div class="shop-ledger-blockers">${blockerText}</div>
      <div class="shop-ledger-chains">${chainText}</div>
      <small>明日建议：${ledger.nextAction}</small>
      <small>${ledger.mood} · ${ledger.evidence}</small>
    </div>
  `;
}

export function shopCustomerJourneyRowsWorld({
  opening = null,
  ledger = null,
  sourceChains = [],
  needBubbles = [],
  shopTagLabel = (tag) => tag || "",
  stages = SHOP_CUSTOMER_JOURNEY_STAGES_WORLD,
} = {}) {
  const safeChains = Array.isArray(sourceChains) ? sourceChains : [];
  const safeNeedBubbles = Array.isArray(needBubbles) ? needBubbles : [];
  const rows = safeChains.slice(0, 4).map((chain, index) => {
    const resultText = chain.result || "";
    const bought = chain.tone === "good" || resultText.includes("成交");
    const warned = chain.tone === "warn" || resultText.includes("嫌贵") || resultText.includes("离店");
    const bubble = safeNeedBubbles[index] || safeNeedBubbles.find((entry) => entry.name === chain.name) || null;
    const path = [
      { ...stages[0], text: bubble?.text || chain.need || "进门看看", state: "done" },
      { ...stages[1], text: ledger?.hotTagLabel || opening?.hotTagLabel || "看热卖牌", state: "done" },
      { ...stages[2], text: warned ? "价签卡住了" : "预算对上了", state: warned ? "warn" : "done" },
      { ...stages[3], text: bought ? "递货收钱" : "回头离店", state: bought ? "good" : warned ? "warn" : "mid" },
      { ...stages[4], text: chain.advice || ledger?.nextAction || "记到明日备货", state: bought ? "good" : "mid" },
    ];
    return {
      name: chain.name || bubble?.name || "顾客",
      need: chain.need || bubble?.text || "随手看看",
      result: resultText || "等待下一次开铺复盘",
      reason: chain.reason || chain.evidence || "原因待观察",
      advice: chain.advice || ledger?.nextAction || "明天继续沿着这条反馈调整。",
      tone: bought ? "good" : warned ? "warn" : "mid",
      bought,
      warned,
      path,
    };
  });
  if (rows.length) return rows;
  return safeNeedBubbles.slice(0, 3).map((bubble) => ({
    name: bubble.name || "顾客",
    need: bubble.text || "想找一件顺眼的货",
    result: "还没有形成成交旅线",
    reason: bubble.detail || "等待下一次开铺",
    advice: `围绕 ${bubble.tag ? shopTagLabel(bubble.tag) : opening?.hotTagLabel || "门口需求"} 准备一件对口商品。`,
    tone: "mid",
    bought: false,
    warned: false,
    path: stages.map((stage, index) => ({
      ...stage,
      text: index === 0 ? bubble.text || "进门看看" : index === 4 ? "等开铺验证" : stage.short,
      state: index === 0 ? "done" : "pending",
    })),
  }));
}

export function shopCustomerJourneySpecWorld({
  opening = null,
  ledger = null,
  liveFocus = null,
  rows = [],
} = {}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const buyers = Number(ledger?.buyers ?? liveFocus?.buyers ?? 0);
  const visitors = Number(ledger?.visitors || opening?.lastSession?.visitors || Math.max(safeRows.length, buyers));
  const leavers = Number(ledger?.leavers ?? liveFocus?.leavers ?? 0);
  const conversion = visitors ? Math.round((buyers / visitors) * 100) : Number(ledger?.conversion || 0);
  const mainRow = safeRows.find((row) => row.bought) || safeRows[0] || null;
  const blocker = ledger?.blockers?.[0] || null;
  return {
    active: Boolean(ledger || liveFocus || safeRows.length),
    title: buyers > 0 ? "顾客旅线复盘" : leavers > 0 ? "顾客离店旅线" : "顾客旅线待形成",
    headline: ledger?.headline || liveFocus?.headline || (mainRow ? `${mainRow.name}留下了第一条线索` : "等下一次开铺生成旅线"),
    hotTagLabel: ledger?.hotTagLabel || liveFocus?.hotTagLabel || opening?.hotTagLabel || "旧铺需求",
    mainCustomer: ledger?.mainCustomer || mainRow?.name || "客群未定",
    conversion,
    visitors,
    buyers,
    leavers,
    rows: safeRows,
    mainRow,
    nextAction: ledger?.nextAction || liveFocus?.shelfAdvice || mainRow?.advice || "先准备一件标签清楚的商品，再开铺观察。",
    blockerText: blocker ? `${blocker.label} ${blocker.count}` : liveFocus?.topBlockerLabel || "无明显短板",
    mood: ledger?.mood || (buyers > 0 ? "成交理由已经能被复盘，旧铺开始像真正的店。" : "门口有人回头，说明下一次调整有方向。"),
    visualCue: "画面反馈：进店、看牌、试价、成交/离店、复购建议会沿旧铺动线亮起。",
  };
}

export function shopCustomerJourneyMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  const rows = (Array.isArray(spec.rows) ? spec.rows : []).slice(0, 3);
  return `
    <div class="shop-customer-journey ${spec.buyers > 0 ? "good" : spec.leavers > 0 ? "warn" : "idle"}" data-shop-board="customer-journey">
      <strong>${spec.title} · ${spec.hotTagLabel}</strong>
      <span>${spec.headline}</span>
      <div class="shop-journey-metrics">
        <b>主客 ${spec.mainCustomer}</b>
        <b>成交率 ${spec.conversion}%</b>
        <b>成交 ${spec.buyers}/${spec.visitors}</b>
        <b>离店 ${spec.leavers}</b>
      </div>
      <div class="shop-journey-rows">
        ${rows.map((row) => `
          <div class="shop-journey-row ${row.tone}">
            <b>${row.name}</b>
            <span>${row.need}</span>
            <div class="shop-journey-path">
              ${row.path.map((stage) => `<i class="${stage.state}"><em>${stage.label}</em><small>${stage.text}</small></i>`).join("")}
            </div>
            <small>原因：${row.reason} · 下一步：${row.advice}</small>
          </div>
        `).join("")}
      </div>
      <small>短板：${spec.blockerText} · 建议：${spec.nextAction}</small>
      <small>${spec.mood} · ${spec.visualCue}</small>
    </div>
  `;
}

export function shopCustomerReasonCardsSpecWorld({
  opening = null,
  safeLedger = null,
  journey = null,
  failureRecovery = null,
} = {}) {
  const rows = Array.isArray(journey?.rows) ? journey.rows : [];
  const buyChain = (safeLedger?.chains || []).find((chain) => (
    chain.tone === "good"
    || String(chain.result || "").includes("成交")
  )) || rows.find((row) => row.bought) || null;
  const hesitateChain = (safeLedger?.chains || []).find((chain) => (
    chain.tone === "warn"
    || String(chain.result || "").includes("离店")
    || String(chain.result || "").includes("嫌贵")
  )) || rows.find((row) => row.warned) || null;
  const blocker = safeLedger?.blockers?.[0] || null;
  const hotTagLabel = safeLedger?.hotTagLabel || journey?.hotTagLabel || opening?.hotTagLabel || "今日客需";
  const buyTitle = buyChain
    ? `${buyChain.name || "顾客"}为什么买`
    : "成交理由待验证";
  const buyBody = buyChain
    ? buyChain.reason || buyChain.evidence || buyChain.result || "商品、价签和顾客需求对上了。"
    : `先围绕“${hotTagLabel}”摆一件标签明确的货，等第一位顾客把理由说出口。`;
  const buyDetail = buyChain?.need
    ? `进店需求：${buyChain.need}`
    : safeLedger?.buyers > 0
      ? `${safeLedger.buyers} 单成交已经写入账页。`
      : "开铺后这里会记录第一条购买理由。";
  const hesitateTitle = blocker?.label
    || (hesitateChain ? `${hesitateChain.name || "顾客"}为什么犹豫` : "暂无集中离店短板");
  const hesitateBody = blocker?.detail
    || hesitateChain?.reason
    || failureRecovery?.learningLine
    || (safeLedger?.leavers > 0 ? "顾客有犹豫，但原因还需要下一轮开铺继续确认。" : "当前没有明显劝退点，可以继续沿着成交标签补厚。");
  const hesitateDetail = blocker
    ? `影响 ${blocker.count || 1} 位顾客 · ${failureRecovery?.learningLine || safeLedger?.mood || "账页已圈出短板"}`
    : hesitateChain?.result || (safeLedger?.leavers > 0 ? `离店 ${safeLedger.leavers} 位` : "离店理由未集中。");
  const fixAction = failureRecovery?.tomorrowAction
    || failureRecovery?.action
    || safeLedger?.nextAction
    || journey?.nextAction
    || "明天先修正一处最明显的货架、价签或库存短板。";
  const fixDetail = failureRecovery?.gentleFix
    || failureRecovery?.support
    || "只把下一步讲清楚，不会自动开铺、调价、补货或消耗资源。";
  const active = Boolean(safeLedger || journey?.active || failureRecovery || rows.length);
  return {
    active,
    title: "顾客买/不买三因牌",
    headline: "把成交理由、犹豫理由和明日改法压成一眼能读懂的三张牌。",
    hotTagLabel,
    conversion: Number(safeLedger?.conversion ?? journey?.conversion ?? 0),
    cards: [
      {
        key: "buy_reason",
        label: "为什么买",
        title: buyTitle,
        body: buyBody,
        detail: buyDetail,
        tone: buyChain ? "good" : "idle",
      },
      {
        key: "hesitate_reason",
        label: "为什么犹豫/离店",
        title: hesitateTitle,
        body: hesitateBody,
        detail: hesitateDetail,
        tone: blocker || hesitateChain ? "warn" : "mid",
      },
      {
        key: "tomorrow_fix",
        label: "明日怎么改",
        title: "先改一处最有效",
        body: fixAction,
        detail: fixDetail,
        tone: failureRecovery || blocker ? "good" : "mid",
      },
    ],
    safety: "只解释经营原因和建议路线，不会自动开铺、调价、补货或消耗资源。",
  };
}

export function shopCustomerReasonCardsMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  return `
    <div class="shop-reason-cards" data-shop-board="reason-cards">
      <strong>${spec.title} · ${spec.hotTagLabel}</strong>
      <span>${spec.headline}</span>
      <div class="shop-reason-card-grid">
        ${spec.cards.map((card) => `
          <div class="shop-reason-card ${card.tone}" data-shop-reason-card="${card.key}">
            <b>${card.label}</b>
            <em>${card.title}</em>
            <span>${card.body}</span>
            <small>${card.detail}</small>
          </div>
        `).join("")}
      </div>
      <small>成交率 ${spec.conversion}% · ${spec.safety}</small>
    </div>
  `;
}

export function shopCustomerDayLessonSpecWorld({
  safeOpening = null,
  day = 0,
  session = null,
  firstSale = null,
  ledger = null,
  sessionDay = 0,
  journey = null,
  failureRecovery = null,
  reasonSpec = null,
  reflection = null,
  stateDay = 1,
  customerDisplayName = (archetype) => archetype || "",
} = {}) {
  if (day && sessionDay && sessionDay !== day) return null;
  if (day && !sessionDay && !(safeOpening?.opened || safeOpening?.summaryUnlocked)) return null;
  if (!reasonSpec?.active) return null;
  const visitors = Number(ledger?.visitors ?? journey?.visitors ?? session?.visitors ?? 0);
  const buyers = Number(ledger?.buyers ?? journey?.buyers ?? session?.buyers ?? 0);
  const leavers = Number(ledger?.leavers ?? journey?.leavers ?? 0);
  const conversion = Number(ledger?.conversion ?? journey?.conversion ?? reasonSpec.conversion ?? 0);
  const hotTagLabel = reasonSpec.hotTagLabel || ledger?.hotTagLabel || journey?.hotTagLabel || safeOpening?.hotTagLabel || "今日客需";
  const cards = reasonSpec.cards.map((card) => ({
    key: card.key,
    label: card.label,
    title: card.title,
    body: card.body,
    detail: card.detail,
    tone: card.tone,
    buttonLabel: card.key === "buy_reason" ? "回看购买理由" : card.key === "hesitate_reason" ? "回看犹豫原因" : "回看明日改法",
  }));
  return {
    active: true,
    title: "旧铺顾客三因复盘",
    headline: buyers > 0
      ? `${customerDisplayName(ledger?.mainCustomerArchetype || "") || ledger?.mainCustomer || journey?.mainCustomer || "今日主客"}为什么买，已经能说清。`
      : leavers > 0
        ? "今天没白亏，离店原因已经写成明日改法。"
        : "旧铺开始留下顾客脚印，下一次开张会更容易读懂。",
    day: day || sessionDay || stateDay,
    hotTagLabel,
    visitors,
    buyers,
    leavers,
    conversion,
    evidence: ledger?.evidence || reflection?.scoreLine || `${hotTagLabel} · 来客 ${visitors} · 成交 ${buyers}`,
    reviewQuote: reflection?.reviewQuote || firstSale?.reviewQuote || session?.reviewQuote || "",
    nextAction: ledger?.nextAction || journey?.nextAction || reasonSpec.cards.find((card) => card.key === "tomorrow_fix")?.body || "明天先修正一处最明显的货架、价签或库存短板。",
    cards,
    safety: "只回看旧铺账页和顾客旅线，不会自动开铺、调价、补货、交单或消耗资源。",
  };
}

export function shopCustomerDayLessonMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  return `
    <div class="day-summary-shop-customer-lesson">
      <div class="day-summary-shop-customer-head">
        <span>
          <strong>${spec.title} · ${spec.hotTagLabel}</strong>
          <small>${spec.headline}</small>
        </span>
        <em>成交 ${spec.buyers}/${spec.visitors} · ${spec.conversion}%</em>
      </div>
      <div class="day-summary-shop-customer-grid">
        ${spec.cards.map((card) => `
          <button type="button" class="day-summary-shop-customer-card ${card.tone}" data-day-summary-shop-customer-lesson="${card.key}">
            <b>${card.label}</b>
            <em>${card.title}</em>
            <span>${card.body}</span>
            <small>${card.detail}</small>
            <i>${card.buttonLabel}</i>
          </button>
        `).join("")}
      </div>
      ${spec.reviewQuote ? `<small class="day-summary-shop-customer-quote">顾客短评：${spec.reviewQuote}</small>` : ""}
      <small>证据：${spec.evidence} · 明日建议：${spec.nextAction}</small>
      <small>${spec.safety}</small>
    </div>
  `;
}

export function shopFirstCustomerThresholdSafetyTextWorld() {
  return "只回看旧铺报告和顾客旅线，不会自动开铺、上架、接客、成交、改价、补货、交单、扣库存或消耗资源";
}

export function shopFirstCustomerThresholdWorldSpecWorld({
  opening = null,
  journey = null,
  report = [],
  day = 1,
  width = 960,
  height = 640,
  itemName = (itemId) => itemId || "今日主推货",
  safety = shopFirstCustomerThresholdSafetyTextWorld(),
} = {}) {
  const session = opening?.lastSession?.day === day ? opening.lastSession : null;
  const ledger = opening?.customerDecisionLedger || session?.customerDecisionLedger || null;
  const activeJourney = journey || ledger || null;
  if (!opening?.opened || !activeJourney?.active || !activeJourney.rows?.length) return null;
  const firstRow = activeJourney.rows.find((row) => row.bought) || activeJourney.rows[0];
  if (!firstRow) return null;
  const firstReport = (Array.isArray(report) ? report : [])
    .map((entry, reportIndex) => ({ ...entry, reportIndex }))
    .find((entry) => entry.reason !== "diagnosis" && (!firstRow.name || entry.name === firstRow.name)) || null;
  const bought = Boolean(firstRow.bought || firstReport?.reason === "buy");
  const warned = Boolean(firstRow.warned || ["price", "stock", "tag"].includes(firstReport?.reason || ""));
  const resultLabel = bought ? "买单成立" : warned ? "犹豫离店" : "留下线索";
  const resultText = bought
    ? firstRow.result || firstReport?.text || "递货收钱"
    : warned
      ? firstRow.reason || firstReport?.detail || firstReport?.text || "还没被说服"
      : firstRow.result || firstRow.reason || "先记住这条顾客线索";
  const priceText = bought && firstReport?.text
    ? (firstReport.text.match(/成交\s*\d+/)?.[0] || "成交")
    : bought
      ? "预算对上"
      : warned
        ? activeJourney.blockerText || "价格/库存/标签卡住"
        : "等待复盘";
  const reportIndex = Number.isFinite(Number(firstReport?.reportIndex)) ? Number(firstReport.reportIndex) : -1;
  const selector = reportIndex >= 0
    ? `[data-shop-report-index="${Number(reportIndex)}"]`
    : '[data-shop-board="customer-journey"]';
  const cardWidth = 308;
  const cardHeight = 122;
  const x = Math.max(240, Math.min(width - cardWidth - 34, 316));
  const y = Math.max(370, Math.min(height - cardHeight - 30, 454));
  return {
    key: `${day}:${firstRow.name}:${bought ? "buy" : warned ? "warn" : "note"}:${activeJourney.buyers}:${activeJourney.leavers}:${activeJourney.conversion}`,
    day,
    title: "首客过门三步桥 · 可点",
    headline: `${firstRow.name || "第一位顾客"}已经走完整条门口判断`,
    customerName: firstRow.name || activeJourney.mainCustomer || "第一位顾客",
    hotTagLabel: activeJourney.hotTagLabel || opening.hotTagLabel || "旧铺需求",
    itemName: firstReport?.itemId ? itemName(firstReport.itemId) : activeJourney.hotTagLabel || "今日主推货",
    resultLabel,
    resultText,
    priceText,
    reasonText: firstRow.reason || firstReport?.detail || "顾客把门口、货签和价签连起来判断。",
    nextAction: firstRow.advice || activeJourney.nextAction || "明天先修正最明显的一处货架、价签或库存短板。",
    bought,
    warned,
    reportIndex,
    selector,
    fallbackSelector: '[data-shop-board="customer-journey"]',
    safety,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 154, y: 232 },
    steps: [
      { key: "threshold", badge: "门", title: "跨过门槛", text: firstRow.need || "进门看看", accent: "#4d91a6", state: "done" },
      { key: "sign", badge: "牌", title: "先看货签", text: activeJourney.hotTagLabel || "热卖牌", accent: "#b47d2f", state: "done" },
      { key: "decision", badge: bought ? "买" : warned ? "犹" : "记", title: resultLabel, text: priceText, accent: bought ? "#286f58" : warned ? "#be4f37" : "#8f5f3f", state: bought ? "good" : warned ? "warn" : "mid" },
    ],
  };
}

export function shopFirstCustomerThresholdWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
  entry = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "first_customer_threshold",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      firstCustomerThreshold: spec,
      entry,
      rect,
    }
    : null;
}

export function shopFirstSaleReceiptWorldSpecWorld({
  opening = null,
  report = [],
  itemName = (itemId) => itemId || "",
} = {}) {
  const firstSale = opening?.firstSale || null;
  if (!firstSale) return null;
  const safeReport = Array.isArray(report) ? report : [];
  const reportIndex = safeReport.findIndex((entry) =>
    entry.reason === "buy"
    && (!firstSale.itemId || entry.itemId === firstSale.itemId)
    && (!firstSale.customerArchetype || entry.customerArchetype === firstSale.customerArchetype)
  );
  const reportEntry = reportIndex >= 0 ? { ...safeReport[reportIndex], reportIndex } : null;
  return {
    firstSale,
    reportIndex,
    reportEntry,
    title: "首单成交小票",
    customerName: firstSale.name || reportEntry?.name || "第一位买客",
    itemName: firstSale.itemName || itemName(firstSale.itemId || reportEntry?.itemId || ""),
    price: Number(firstSale.price || 0),
    reasonText: firstSale.reasonText || reportEntry?.detail || "顾客觉得商品和价格都合适。",
    reviewQuote: firstSale.reviewQuote || "这家旧铺，像是会记得客人要什么。",
    returnPreview: firstSale.returnPreview || null,
    returnChance: Number(firstSale.returnPreview?.chance || 0),
    returnSummary: firstSale.returnPreview?.summary || "",
    returnCta: firstSale.returnPreview?.cta || "",
    returnTone: firstSale.returnPreview?.tone || "note",
    rect: { x: 206, y: 332, width: 244, height: firstSale.returnPreview ? 122 : 88 },
  };
}

export function shopFirstSaleLessonWorldSpecWorld({
  opening = null,
  receipt = null,
  reflection = null,
  regularBoard = null,
  restockRoutes = [],
  day = 1,
} = {}) {
  if (!receipt?.firstSale) return null;
  const route = restockRoutes[0] || null;
  const returnChance = Number(receipt.returnChance || receipt.returnPreview?.chance || 0);
  const returnText = receipt.returnSummary
    || receipt.returnPreview?.summary
    || regularBoard?.rows?.[0]?.summary
    || "下轮继续摆同类货，顾客更容易记住这扇门。";
  const nextAction = route
    ? `${route.label}：${route.title}`
    : receipt.returnCta || regularBoard?.rows?.[0]?.detail || `继续补 ${receipt.itemName} 或同标签货。`;
  const reasonShort = receipt.reasonText || reflection?.digest || "商品、价格和热卖标签刚好对上。";
  const needBubble = (opening?.needBubbles || []).find((entry) => (
    entry.name === receipt.customerName
    || entry.customerArchetype === receipt.firstSale?.customerArchetype
  )) || (opening?.needBubbles || [])[0] || null;
  const needText = needBubble?.text || needBubble?.detail || receipt.reviewQuote || "顾客先看懂了货架想卖什么。";
  const reasonProofs = [
    { label: "想法泡泡", text: needText, tone: "need" },
    { label: "买了什么", text: receipt.itemName, tone: "goods" },
    { label: "价签成立", text: `${receipt.price || 0} 灵石`, tone: "price" },
    { label: "明日补货", text: nextAction, tone: "next" },
  ];
  return {
    key: `${day}:${receipt.customerName}:${receipt.itemName}:${receipt.price}:${returnChance}:first_sale_lesson`,
    day,
    receipt,
    reflection,
    regularBoard,
    route,
    restockRoutes,
    title: "首单原因续航牌 · 可点",
    headline: `${receipt.customerName}为什么买单？`,
    customerName: receipt.customerName,
    itemName: receipt.itemName,
    price: receipt.price,
    reasonText: reasonShort,
    reviewQuote: receipt.reviewQuote,
    returnChance,
    returnText,
    nextAction,
    needText,
    reasonProofs,
    memoryLine: `${receipt.customerName}因为${reasonShort}买走${receipt.itemName}`,
    safety: "只定位旧铺报告和顾客旅线，不会自动开铺、接客、成交、改价、补货或消耗库存",
    reportIndex: receipt.reportIndex,
    selector: receipt.reportIndex >= 0
      ? `[data-shop-report-index="${Number(receipt.reportIndex)}"]`
      : '[data-shop-board="customer-focus"]',
    fallbackSelector: '[data-shop-board="opening"]',
    rect: { x: 528, y: 186, width: 336, height: 164 },
    anchor: {
      x: receipt.rect.x + receipt.rect.width,
      y: receipt.rect.y + 28,
    },
    accent: returnChance >= 65 ? "#286f58" : returnChance >= 45 ? "#b47d2f" : "#8f5f3f",
  };
}

export function shopFirstSaleLessonWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "first_sale_lesson",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      firstSaleLesson: spec,
      firstSaleReceipt: spec.receipt,
      entry: spec.receipt.reportEntry,
      rect,
    }
    : null;
}

export function shopFirstSaleKeepsakeWorldSpecWorld({
  opening = null,
  receipt = null,
  lesson = null,
  day = 1,
} = {}) {
  if (!receipt?.firstSale) return null;
  const firstSale = receipt.firstSale || {};
  const saleDay = Number(firstSale.day || opening?.firstSaleDay || day);
  const age = Math.max(0, day - saleDay);
  const returnChance = Number(lesson?.returnChance || receipt.returnChance || 0);
  const hotTagLabel = opening?.hotTagLabel || opening?.lastSession?.hotTagLabel || "首单货签";
  const nextAction = lesson?.nextAction
    || receipt.returnCta
    || opening?.lastSession?.liveFocus?.shelfAdvice
    || `明天补一件${hotTagLabel}相关货，再开铺验证回头苗头。`;
  const returnText = lesson?.returnText
    || receipt.returnSummary
    || "这位顾客已经把旧铺和第一件货连在一起。";
  return {
    key: `${day}:${receipt.customerName}:${receipt.itemName}:${returnChance}:first_sale_keepsake`,
    day,
    title: "首单钱签余温 · 可点",
    headline: age > 0 ? `第一笔成交已经挂了 ${age} 天` : "第一笔成交刚挂上门口",
    customerName: receipt.customerName,
    itemName: receipt.itemName,
    price: receipt.price,
    reasonText: receipt.reasonText,
    reviewQuote: receipt.reviewQuote,
    returnChance,
    returnText,
    nextAction,
    hotTagLabel,
    reportIndex: receipt.reportIndex,
    selector: receipt.reportIndex >= 0
      ? `[data-shop-report-index="${Number(receipt.reportIndex)}"]`
      : '[data-shop-board="decision-ledger"]',
    fallbackSelector: '[data-shop-board="opening"]',
    receipt,
    lesson,
    accent: returnChance >= 60 ? "#286f58" : returnChance >= 40 ? "#b47d2f" : "#8f5f3f",
    rect: { x: 176, y: 262, width: 146, height: 72 },
    anchor: { x: 214, y: 226 },
  };
}

export function shopFirstSaleKeepsakeWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "first_sale_keepsake",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      firstSaleKeepsake: spec,
      firstSaleReceipt: spec.receipt,
      entry: spec.receipt?.reportEntry || null,
      rect,
    }
    : null;
}

export function shopFirstSaleActionTrailWorldSpecWorld({
  receipt = null,
  lesson = null,
  day = 1,
} = {}) {
  if (!lesson?.receipt || !receipt?.firstSale) return null;
  const needText = lesson.needText || receipt.reviewQuote || "顾客先看懂了货架。";
  const itemText = receipt.itemName || "首单货";
  const priceText = receipt.price ? `${receipt.price} 灵石` : "价签成立";
  const reviewText = receipt.reviewQuote || "顾客把这扇门记住了。";
  const returnText = lesson.returnText || receipt.returnSummary || "明天沿着同类货补货。";
  const path = [
    { x: 86, y: 304 },
    { x: 134, y: 286 },
    { x: 184, y: 286 },
    { x: 232, y: 306 },
    { x: 288, y: 330 },
  ];
  return {
    key: `${day}:${receipt.customerName}:${itemText}:${priceText}:first_sale_action_trail`,
    day,
    title: "首单成交动作线 · 可点",
    headline: `${receipt.customerName}为什么掏钱`,
    customerName: receipt.customerName,
    itemName: itemText,
    price: receipt.price,
    reasonText: receipt.reasonText,
    reviewText,
    returnText,
    reportIndex: receipt.reportIndex,
    selector: receipt.reportIndex >= 0
      ? `[data-shop-report-index="${Number(receipt.reportIndex)}"]`
      : '[data-shop-board="customer-journey"]',
    fallbackSelector: '[data-shop-board="opening"]',
    rect: { x: 332, y: 236, width: 318, height: 112 },
    anchor: { x: 174, y: 286 },
    path,
    steps: [
      { key: "need", label: "想", title: "想法泡泡", text: needText, accent: "#4d91a6" },
      { key: "goods", label: "货", title: "伸手拿货", text: itemText, accent: "#286f58" },
      { key: "price", label: "价", title: "价签成立", text: priceText, accent: "#b47d2f" },
      { key: "coin", label: "钱", title: "灵石入账", text: reviewText, accent: "#be4f37" },
    ],
    cta: "只定位旧铺报告，不会自动开铺、补货或改价",
  };
}

export function shopFirstSaleActionTrailWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
  lesson = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "first_sale_action_trail",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      firstSaleActionTrail: spec,
      firstSaleLesson: lesson,
      firstSaleReceipt: spec,
      rect,
    }
    : null;
}

export function shopCustomerLessonMorningFollowupSafetyTextWorld() {
  return "只定位旧铺复盘、顾客旅线和明日改法，不会自动开铺、调价、补货、接客、成交、交单、扣库存或消耗资源";
}

export function shopCustomerLessonMorningFollowupSpecWorld({
  summary = null,
  lastSummary = null,
  day = 1,
  safety = shopCustomerLessonMorningFollowupSafetyTextWorld(),
} = {}) {
  if (!summary?.active || !lastSummary || Number(lastSummary.nextDay || 0) !== Number(day || 0)) return null;
  const cards = Array.isArray(summary.cards) ? summary.cards : [];
  const buyCard = cards.find((card) => card.key === "buy_reason") || cards[0] || null;
  const hesitateCard = cards.find((card) => card.key === "hesitate_reason") || cards[1] || null;
  const fixCard = cards.find((card) => card.key === "tomorrow_fix") || cards[2] || null;
  const nextAction = summary.nextAction || fixCard?.body || "明天先修正一处最明显的货架、价签或库存短板。";
  const actionText = String(nextAction);
  const actionType = /价|贵|便宜|倍率|价格/.test(actionText)
    ? "price"
    : /缺|补|库存|备|货/.test(actionText)
      ? "stock"
      : /签|标签|热卖|客需|需求/.test(actionText)
        ? "tag"
        : /陈列|货架|主题|头排/.test(actionText)
          ? "display"
          : "review";
  const actionLabel = {
    price: "先看价签",
    stock: "先补库存",
    tag: "先亮标签",
    display: "先调陈列",
    review: "先看账页",
  }[actionType];
  const actionAccent = {
    price: "#be4f37",
    stock: "#286f58",
    tag: "#b47d2f",
    display: "#4d91a6",
    review: "#8f5f3f",
  }[actionType];
  const visitors = Number(summary.visitors || 0);
  const buyers = Number(summary.buyers || 0);
  const leavers = Number(summary.leavers || 0);
  const conversion = Number(summary.conversion || 0);
  const hotTagLabel = summary.hotTagLabel || "今日客需";
  const headline = buyers > 0
    ? `昨夜复盘：成交 ${buyers}/${Math.max(visitors, buyers + leavers, 1)}，今天把原因放大`
    : leavers > 0
      ? "昨夜复盘：离店原因已圈出，今天先改一处"
      : "昨夜复盘：顾客脚印已留下，今天先开铺验证";
  return {
    key: `${lastSummary.day || Math.max(1, day - 1)}:${day}:${hotTagLabel}:${buyers}:${leavers}:${conversion}:${actionType}:${nextAction}`,
    day,
    title: "旧铺明日改法灯 · 可点",
    headline,
    hotTagLabel,
    nextAction,
    actionType,
    actionLabel,
    actionAccent,
    evidence: summary.evidence || `${hotTagLabel} · 来客 ${visitors} · 成交 ${buyers}`,
    detail: fixCard?.detail || "先看明日改法，再手动开铺验证。",
    reviewLine: buyCard?.body || summary.headline || "顾客理由已经写入昨夜复盘。",
    blockerLine: hesitateCard?.body || "旧铺账页会指出最明显短板。",
    buyers,
    leavers,
    visitors,
    conversion,
    selector: '[data-shop-board="reason-cards"]',
    fallbackSelector: '[data-shop-board="customer-journey"]',
    rect: { x: 394, y: 252, width: 300, height: 124 },
    anchor: { x: 154, y: 232 },
    routeText: "昨夜复盘 -> 今日先改 -> 手动开铺验证",
    safety,
    steps: [
      {
        key: "review",
        badge: "昨",
        title: "昨夜复盘",
        text: `${buyers}/${Math.max(visitors, buyers + leavers, 1)} 成交`,
        accent: buyers > 0 ? "#286f58" : "#8f5f3f",
      },
      {
        key: "fix",
        badge: "改",
        title: "今日先改",
        text: actionLabel,
        accent: actionAccent,
      },
      {
        key: "verify",
        badge: "验",
        title: "开铺验证",
        text: `${conversion}% 转化`,
        accent: "#b47d2f",
      },
    ],
  };
}

export function shopCustomerLessonMorningFollowupWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_customer_lesson_morning_followup",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      shopCustomerLessonMorningFollowup: spec,
      rect,
    }
    : null;
}

export function shopCustomerLessonVerificationEchoSafetyTextWorld() {
  return "只回看旧铺改法验证、顾客旅线和经营报告，不会自动开铺、调价、补货、接客、成交、交单、扣库存或消耗资源";
}

export function shopCustomerLessonVerificationEchoWorldSpecWorld({
  summary = null,
  morning = null,
  opening = null,
  journey = null,
  day = 1,
  width = 960,
  height = 640,
  safety = shopCustomerLessonVerificationEchoSafetyTextWorld(),
} = {}) {
  if (!morning) return null;
  const session = opening?.lastSession?.day === day ? opening.lastSession : null;
  const ledger = opening?.customerDecisionLedger || session?.customerDecisionLedger || null;
  if ((!session && !opening?.opened) || !journey?.active) return null;
  const todayBuyers = Number(ledger?.buyers ?? journey.buyers ?? session?.buyers ?? 0);
  const todayVisitors = Math.max(Number(ledger?.visitors ?? journey.visitors ?? session?.visitors ?? 0), todayBuyers + Number(ledger?.leavers ?? journey.leavers ?? 0), 1);
  const todayLeavers = Number(ledger?.leavers ?? journey.leavers ?? 0);
  const todayConversion = Number(ledger?.conversion ?? journey.conversion ?? Math.round((todayBuyers / todayVisitors) * 100));
  const yesterdayConversion = Number(summary?.conversion || 0);
  const delta = todayConversion - yesterdayConversion;
  const improved = delta > 0 || todayBuyers > Number(summary?.buyers || 0);
  const held = !improved && todayBuyers > 0 && todayLeavers <= Number(summary?.leavers || todayLeavers);
  const tone = improved ? "good" : held ? "steady" : "warn";
  const headline = improved
    ? "今日改法接住了更多顾客"
    : held
      ? "今日改法稳住了旧铺脚步"
      : "今日验证还没完全接住";
  const mainRow = journey.rows?.find((row) => row.bought) || journey.rows?.[0] || null;
  const resultLine = mainRow?.result || ledger?.summaryLines?.[1] || (todayBuyers > 0 ? "至少一位顾客完成买单。" : "顾客仍在犹豫，短板需要继续调整。");
  const nextAction = ledger?.nextAction || journey.nextAction || summary?.nextAction || "继续沿着旧铺三因复盘修正一处最明显短板。";
  const rectWidth = 304;
  const rectHeight = 122;
  const x = Math.max(250, Math.min(width - rectWidth - 34, 582));
  const y = Math.max(354, Math.min(height - rectHeight - 30, 386));
  return {
    key: `${day}:${morning.actionType}:${todayBuyers}:${todayLeavers}:${todayConversion}:${delta}:${nextAction}`,
    day,
    title: "旧铺改法验证回响 · 可点",
    headline,
    tone,
    hotTagLabel: morning.hotTagLabel,
    yesterdayAction: morning.nextAction,
    todayResult: resultLine,
    nextAction,
    buyers: todayBuyers,
    visitors: todayVisitors,
    leavers: todayLeavers,
    conversion: todayConversion,
    delta,
    selector: '[data-shop-board="customer-journey"]',
    fallbackSelector: '[data-shop-board="reason-cards"]',
    rect: { x, y, width: rectWidth, height: rectHeight },
    anchor: { x: 154, y: 232 },
    routeText: "昨夜改法 -> 今日开铺 -> 结果回响",
    safety,
    steps: [
      {
        key: "fix",
        badge: "改",
        title: "昨夜改法",
        text: morning.actionLabel,
        accent: morning.actionAccent,
      },
      {
        key: "open",
        badge: "铺",
        title: "今日开铺",
        text: `来客 ${todayVisitors}`,
        accent: "#b47d2f",
      },
      {
        key: "result",
        badge: improved || held ? "稳" : "再",
        title: improved ? "接住了" : held ? "稳住了" : "再调整",
        text: `${todayConversion}%${delta ? ` ${delta > 0 ? "+" : ""}${delta}` : ""}`,
        accent: improved || held ? "#286f58" : "#be4f37",
      },
    ],
  };
}

export function shopCustomerLessonVerificationEchoWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_customer_lesson_verification_echo",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      shopCustomerLessonVerificationEcho: spec,
      rect,
    }
    : null;
}

export function shopReturningTrailWorldSpecWorld({
  opening = null,
  digest = null,
  regularBoard = null,
  day = 1,
} = {}) {
  const digestRow = digest?.rows?.[0] || null;
  const regularRow = regularBoard?.rows?.[0] || null;
  if (!digestRow && !regularRow) return null;
  const realized = Boolean(digestRow);
  const customerLabel = digestRow?.customerLabel || regularRow?.customerLabel || "熟脸顾客";
  const chance = Math.max(0, Number(digestRow?.chance || digestRow?.returnVisitChance || regularRow?.chance || 0));
  const itemText = digestRow?.itemName
    || opening?.firstSale?.itemName
    || opening?.lastSession?.liveFocus?.topItemName
    || regularBoard?.hotTagLabel
    || "应季货";
  const resultText = digestRow
    ? digestRow.bought
      ? `${customerLabel} 又买走 ${digestRow.itemName || itemText}`
      : `${customerLabel} 回门看货`
    : `${customerLabel} 回头苗头 ${chance}%`;
  const detailText = digestRow?.resultText
    || digestRow?.arrivalText
    || regularRow?.quote
    || regularBoard?.headline
    || `${customerLabel}已经把旧铺和${itemText}连在一起。`;
  const nextAction = digest?.nextAction
    || regularRow?.detail
    || regularBoard?.nextAction
    || `明天继续把 ${itemText} 留在显眼处。`;
  return {
    key: `${day}:${customerLabel}:${itemText}:${chance}:${realized ? "returned" : "preview"}:returning_trail`,
    day,
    title: realized ? "熟脸回门路牌 · 可点" : "明日熟脸路牌 · 可点",
    headline: realized ? "昨天的脚步真的回来了" : "这条回头路可以接住",
    customerLabel,
    itemText,
    chance,
    realized,
    resultText,
    detailText,
    nextAction,
    digest,
    regularBoard,
    row: digestRow || regularRow,
    selector: '[data-shop-board="opening"]',
    fallbackSelector: '[data-shop-board="customer-focus"]',
    rect: { x: 596, y: 350, width: 292, height: 108 },
    anchor: { x: 214, y: 226 },
    accent: realized ? "#286f58" : chance >= 60 ? "#286f58" : chance >= 45 ? "#b47d2f" : "#8f5f3f",
  };
}

export function shopReturningTrailWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "returning_trail",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      returningTrail: spec,
      rect,
    }
    : null;
}

export function shopTrialPreviewSpecWorld({
  opening = null,
  goods = [],
  theme = null,
  customers = [],
  fame = 0,
  priceMultiplier = 1,
  firstSaleReceipt = null,
  firstSaleLesson = null,
  display = null,
  hotTag = "",
  hotTagLabel = "",
  shopHotTag = () => "",
  shopTagLabel = (tag) => tag || "",
  customerNeedBubble = () => null,
  segmentForCustomer = () => null,
  activeShopCompendiumDisplays = () => [],
} = {}) {
  if (firstSaleReceipt?.firstSale) {
    const returnChance = Number(firstSaleLesson?.returnChance || firstSaleReceipt.returnChance || 0);
    return {
      active: true,
      mode: "first-sale",
      tone: "ready",
      title: "首单复盘看板",
      headline: `${firstSaleReceipt.customerName}买走${firstSaleReceipt.itemName}，第一笔成交已经写进旧铺账页。`,
      goodsText: `${firstSaleReceipt.itemName} · 成交 ${firstSaleReceipt.price || 0} 灵石`,
      themeText: opening?.hotTagLabel ? `热卖标签 ${opening.hotTagLabel}` : "热卖标签已从首单生成",
      hotTagLabel: opening?.hotTagLabel || "首单货签",
      priceText: `为什么买：${firstSaleReceipt.reasonText}`,
      customerLabel: firstSaleReceipt.customerName,
      thoughtText: firstSaleReceipt.reviewQuote,
      thoughtDetail: `顾客短评：${firstSaleReceipt.reviewQuote}`,
      returnText: firstSaleLesson?.returnText || firstSaleReceipt.returnSummary || "继续围绕同类货补货，顾客更容易记住这扇门。",
      returnChance,
      nextAction: firstSaleLesson?.nextAction || firstSaleReceipt.returnCta || "明天补同标签货，再开铺验证回头苗头。",
      advice: firstSaleLesson?.nextAction || firstSaleReceipt.returnCta || "把首单原因变成明天的补货路线。",
      safety: "只复盘首单原因和回头苗头，不会自动开铺、补货或改价。",
    };
  }

  const safeGoods = (Array.isArray(goods) ? goods : []).filter(({ item, count }) => item && Number(count || 0) > 0);
  const safeDisplay = display || {};
  const resolvedHotTag = safeDisplay?.hotTag || hotTag || shopHotTag(safeGoods, theme);
  const resolvedHotTagLabel = safeDisplay?.hotTagLabel || hotTagLabel || shopTagLabel(resolvedHotTag);
  const topGood = safeDisplay?.featuredGoods?.[0] || null;
  const target = safeDisplay?.customerTargets?.[0] || null;
  const customer = target?.archetype
    ? customers.find((entry) => entry.archetype === target.archetype)
    : customers.find((entry) => Number(entry.fame_requirement || 0) <= fame);
  const bubble = customer
    ? customerNeedBubble(
      customer,
      segmentForCustomer(customer),
      resolvedHotTag,
      activeShopCompendiumDisplays(safeGoods, theme, 2, resolvedHotTag),
    )
    : null;
  const pricePercent = Math.round(Number(priceMultiplier || 1) * 100);
  const priceText = pricePercent >= 125
    ? `${pricePercent}% · 偏贵，可能劝退谨慎顾客`
    : pricePercent <= 85
      ? `${pricePercent}% · 亲民，适合先试营业留客`
      : `${pricePercent}% · 稳价，适合观察第一批反馈`;
  const tone = safeGoods.length === 0
    ? "empty"
    : pricePercent >= 125 || safeDisplay.tone === "warn"
      ? "warn"
      : safeDisplay.tone === "good"
        ? "ready"
        : "focus";
  const goodsTotal = safeGoods.reduce((sum, entry) => sum + Number(entry.count || 0), 0);
  return {
    active: safeGoods.length > 0,
    tone,
    title: "旧铺试营业看板",
    headline: safeGoods.length > 0
      ? `${topGood?.itemName || "主推货"}可以试摆，先看${target?.name || "第一批顾客"}会不会停下。`
      : "货架还空着，先准备一份作物或加工品再开铺。",
    goodsText: safeGoods.length > 0 ? `${safeGoods.length} 类 / ${goodsTotal} 件可卖货` : "暂无可卖货",
    themeText: `${safeDisplay.themeName || theme?.note || "当前主题"} · 匹配 ${safeDisplay.themeScore || 0}% / 门槛 ${safeDisplay.minThemeScore || 0}%`,
    hotTagLabel: resolvedHotTagLabel,
    priceText,
    customerLabel: target?.name || bubble?.name || "路过客",
    thoughtText: bubble?.text || `想找${resolvedHotTagLabel}`,
    thoughtDetail: bubble?.detail || `热卖标签预告：${resolvedHotTagLabel}`,
    advice: safeGoods.length > 0
      ? safeDisplay.advice || `开铺后观察想法泡泡，确认${resolvedHotTagLabel}是否真的能成交。`
      : "先做出一份加工品，或把可卖作物留到旧铺头排。",
    safety: "只预告顾客需求和热卖标签，不会自动开铺、调价或补货。",
  };
}

export function shopTrialPreviewMarkupWorld(spec = null) {
  if (!spec) return "";
  if (spec.mode === "first-sale") {
    return `
      <strong>${spec.title}</strong>
      <span>${spec.headline}</span>
      <small>首单：${spec.goodsText} · ${spec.themeText}</small>
      <small>${spec.priceText}</small>
      <div class="shop-trial-preview-bubble receipt">
        <b>顾客短评：${spec.customerLabel}</b>
        <span>“${spec.thoughtText}”</span>
        <small>${spec.thoughtDetail}</small>
      </div>
      <small class="shop-trial-preview-tag">回头苗头：${spec.returnChance || 0}% · ${spec.returnText}</small>
      <small>明日补货：${spec.nextAction} · ${spec.safety}</small>
    `;
  }
  return `
    <strong>${spec.title}</strong>
    <span>${spec.headline}</span>
    <small>货架：${spec.goodsText} · ${spec.themeText}</small>
    <small>价格：${spec.priceText}</small>
    <div class="shop-trial-preview-bubble">
      <b>想法泡泡：${spec.customerLabel}</b>
      <span>“${spec.thoughtText}”</span>
      <small>${spec.thoughtDetail}</small>
    </div>
    <small class="shop-trial-preview-tag">热卖标签预告：${spec.hotTagLabel}</small>
    <small>${spec.advice} · ${spec.safety}</small>
  `;
}

export function drawShopTrialTheaterWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect } = spec;
  const accent = {
    good: "#286f58",
    warn: "#be4f37",
    ready: "#b47d2f",
    empty: "#8f5f3f",
  }[spec.tone] || "#b47d2f";
  const fill = spec.tone === "good"
    ? "rgba(237, 243, 223, 0.94)"
    : spec.tone === "warn"
      ? "rgba(255, 240, 232, 0.95)"
      : "rgba(255, 248, 232, 0.95)";
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.05) * 2;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}cc` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + 24, cardY - 22, rect.x + 34, cardY + 18);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, fill);
  ctx.strokeStyle = active ? accent : `${accent}88`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, cardY, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 52, 48, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(spec.tone === "good" ? "买" : spec.tone === "warn" ? "问" : "客", rect.x + 29, cardY + 45);
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 53, 40, 15, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 30, cardY + 64);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 19), rect.x + 78, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 78, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`热卖标签 ${spec.hotTagLabel || "待观察"} · ${spec.leadCustomer}`.slice(0, 34), rect.x + 78, cardY + 62);

  const lineY = cardY + 82;
  ctx.strokeStyle = `${accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 26, lineY);
  ctx.lineTo(rect.x + rect.width - 28, lineY);
  ctx.stroke();
  spec.steps.forEach((step, index) => {
    const dotX = rect.x + 42 + index * 104;
    const stateColor = step.state === "good" ? "#286f58" : step.state === "warn" ? "#be4f37" : step.state === "done" ? accent : "#8f5f3f";
    ctx.fillStyle = ["good", "warn", "done"].includes(step.state) ? stateColor : "rgba(255, 253, 245, 0.96)";
    ctx.strokeStyle = `${stateColor}88`;
    ctx.lineWidth = index === 2 && ["good", "warn"].includes(step.state) ? 2.5 : 1.4;
    ctx.beginPath();
    ctx.arc(dotX, lineY, index === 2 ? 8 : 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = ["good", "warn", "done"].includes(step.state) ? "#fffdf5" : stateColor;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(index + 1), dotX - 3, lineY + 3);
    ctx.fillStyle = stateColor;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 5), dotX - 20, lineY - 12);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(step.text || step.title).slice(0, 10), dotX - 28, lineY + 18);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 19, rect.width - 32, 15, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`只定位旧铺报告，不会自动开铺、改价或补货 · ${spec.nextAction}`.slice(0, 42), rect.x + 24, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function drawShopFirstCustomerThresholdWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.bought ? "#286f58" : spec.warned ? "#be4f37" : "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 2.1;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3.1 : 1.9;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 14);
  ctx.bezierCurveTo(anchor.x + 90, anchor.y + 18, rect.x - 34, cardY + 52, rect.x + 26, cardY + 72);
  ctx.stroke();
  ctx.setLineDash([]);

  const footprintPath = [
    { x: anchor.x + 20, y: anchor.y + 34 },
    { x: rect.x - 10, y: cardY + 80 },
    { x: rect.x + 42, y: cardY + 86 },
  ];
  footprintPath.forEach((point, index) => {
    const lift = reducedMotion ? 0 : Math.sin(motion * 2 + index) * 1.4;
    ctx.fillStyle = index % 2 ? "rgba(77, 145, 166, 0.32)" : "rgba(180, 125, 47, 0.34)";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y + lift, 9, 4.5, index % 2 ? -0.35 : 0.28, 0, Math.PI * 2);
    ctx.fill();
  });

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.warned ? "rgba(255, 240, 232, 0.95)" : "rgba(255, 253, 245, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 16, 54, 54, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 21px Microsoft YaHei";
  ctx.fillText(spec.bought ? "客" : spec.warned ? "问" : "记", rect.x + 31, cardY + 50);
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 21, cardY + 58, 40, 16, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 31, cardY + 70);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 82, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 82, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.hotTagLabel} · ${spec.itemName} · ${spec.resultLabel}`.slice(0, 35), rect.x + 82, cardY + 62);

  const lineY = cardY + 84;
  ctx.strokeStyle = `${accent}42`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 31, lineY);
  ctx.lineTo(rect.x + rect.width - 32, lineY);
  ctx.stroke();

  spec.steps.forEach((step, index) => {
    const dotX = rect.x + 42 + index * 102;
    const stateColor = step.accent;
    ctx.fillStyle = ["good", "warn", "done"].includes(step.state) ? stateColor : "rgba(255, 253, 245, 0.96)";
    ctx.strokeStyle = `${stateColor}88`;
    ctx.lineWidth = index === 2 ? 2.5 : 1.4;
    ctx.beginPath();
    ctx.arc(dotX, lineY, index === 2 ? 8 : 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = ["good", "warn", "done"].includes(step.state) ? "#fffdf5" : stateColor;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.badge, dotX - 4, lineY + 3);
    ctx.fillStyle = stateColor;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.title.slice(0, 5), dotX - 22, lineY - 12);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(step.text || "").slice(0, 10), dotX - 28, lineY + 18);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 18, rect.width - 32, 13, 7);
  ctx.fill();
  ctx.fillStyle = spec.warned ? "#be4f37" : "#286f58";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.resultText} · ${spec.safety}`.slice(0, 48), rect.x + 24, cardY + rect.height - 9);
  ctx.restore();
  return true;
}

export function drawShopFirstSaleLessonWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.3) * 2;
  const cardY = rect.y + pulse;
  const accent = spec.accent || "#b47d2f";

  ctx.save();
  ctx.strokeStyle = active ? `${accent}cc` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x - 24, cardY + 42, rect.x + 26, cardY + 78);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? accent : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, cardY, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 54, 50, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 21px Microsoft YaHei";
  ctx.fillText("因", rect.x + 31, cardY + 46);
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 53, 42, 15, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 31, cardY + 64);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 82, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 82, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} · 成交 ${spec.price || 0} 灵石`.slice(0, 30), rect.x + 82, cardY + 62);

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 82, cardY + 68, rect.width - 98, 18, 9);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("成交原因四格 · 玩家能说出首单原因", rect.x + 94, cardY + 81);

  const proofY = cardY + 94;
  const proofColors = {
    need: "#4d91a6",
    goods: "#286f58",
    price: "#b47d2f",
    next: "#8f5f3f",
  };
  (spec.reasonProofs || []).slice(0, 4).forEach((proof, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const proofX = rect.x + 16 + col * 154;
    const boxY = proofY + row * 28;
    const proofW = col === 0 ? 142 : 150;
    const toneColor = proofColors[proof.tone] || accent;
    ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
    ctx.strokeStyle = `${toneColor}44`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(proofX, boxY, proofW, 22, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = toneColor;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(proof.label, proofX + 8, boxY + 9);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(proof.text || "").slice(0, col === 0 ? 12 : 13), proofX + 8, boxY + 19);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 20, rect.width - 32, 15, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`回头苗头 ${spec.returnChance || 0}% · ${spec.safety}`.slice(0, 52), rect.x + 24, cardY + rect.height - 9);
  ctx.restore();
  return true;
}
