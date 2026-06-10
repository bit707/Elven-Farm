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
