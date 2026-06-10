function drawWaterwayWorldLabel(ctx, text, x, y, tone = "#8f5f3f") {
  const width = Math.max(68, text.length * 13 + 18);
  ctx.fillStyle = "rgba(255, 248, 232, 0.88)";
  ctx.beginPath();
  ctx.roundRect(x - 8, y - 14, width, 20, 9);
  ctx.fill();
  ctx.fillStyle = tone;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(text, x, y);
}

export function drawQingboWaterFreshRestockWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.25) * 3;
  const ready = Boolean(spec.ready);
  const returnSale = spec.phase === "return_sale";
  const accent = returnSale ? "#b47d2f" : ready ? "#286f58" : "#4d91a6";
  const shopX = 142;
  const shopY = 208;

  ctx.save();
  ctx.strokeStyle = returnSale ? "rgba(180, 125, 47, 0.56)" : "rgba(77, 145, 166, 0.56)";
  ctx.lineWidth = 2.1;
  ctx.setLineDash([8, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + 30, rect.y + pulse + 4);
  ctx.quadraticCurveTo(rect.x - 72, rect.y - 22, shopX + 78, shopY + 42);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = returnSale ? "rgba(224, 182, 109, 0.18)" : "rgba(77, 145, 166, 0.16)";
  ctx.beginPath();
  ctx.ellipse(shopX + 88, shopY + 52, 74 + pulse, 18, -0.08, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, returnSale ? "rgba(255, 248, 232, 0.96)" : "rgba(236, 248, 243, 0.95)");
  ctx.strokeStyle = returnSale ? "rgba(180, 125, 47, 0.7)" : ready ? "rgba(40, 111, 88, 0.72)" : "rgba(77, 145, 166, 0.7)";
  ctx.lineWidth = ready ? 2.4 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = returnSale ? "rgba(224, 182, 109, 0.24)" : "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 13, rect.y + 14 + pulse, 52, 52, 16);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 24, rect.y + 28 + pulse, 32, 20, 7);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.52)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText(returnSale ? "客" : ready ? "成" : "补", rect.x + 31, rect.y + 45 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 13), rect.x + 78, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 13), rect.x + 78, rect.y + 43 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 27), rect.x + 78, rect.y + 62 + pulse);

  const progress = Math.max(0.05, Math.min(1, Number(spec.have || 0) / Math.max(1, Number(spec.desiredCount || 1))));
  ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 72 + pulse, rect.width - 32, 12, 999);
  ctx.fill();
  ctx.fillStyle = returnSale ? "rgba(180, 125, 47, 0.72)" : ready ? "rgba(40, 111, 88, 0.72)" : "rgba(77, 145, 166, 0.68)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 72 + pulse, (rect.width - 32) * progress, 12, 999);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.routeText.slice(0, 32), rect.x + 24, rect.y + 82 + pulse);
  ctx.restore();
  return true;
}

export function drawQingboFirstSaleRestockSeedWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.35) * 3;
  const accent = spec.ready ? "#286f58" : "#4d91a6";
  const steps = [
    { label: "首卖", text: `${spec.customerName.slice(0, 4)}买走`, color: "#b47d2f" },
    { label: "记住", text: "灵池鲜味", color: "#4d91a6" },
    { label: "补货", text: `${spec.have}/${spec.desiredCount}份`, color: spec.ready ? "#286f58" : "#be6a3c" },
  ];

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.72)" : "rgba(77, 145, 166, 0.48)";
  ctx.lineWidth = active ? 2.6 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + pulse);
  ctx.quadraticCurveTo(rect.x - 58, rect.y + 22 + pulse, rect.x + 20, rect.y + 24 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(77, 145, 166, 0.17)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + pulse, 58 + pulse, 18, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(anchor.x - 42, anchor.y - 16 + pulse, 84, 30, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.54)";
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("首卖留香", anchor.x - 28, anchor.y + 4 + pulse);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.ready ? "rgba(236, 248, 243, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.86)" : spec.ready ? "rgba(40, 111, 88, 0.68)" : "rgba(77, 145, 166, 0.66)";
  ctx.lineWidth = active ? 2.8 : 1.9;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 19);
  ctx.stroke();

  ctx.fillStyle = spec.ready ? "rgba(202, 235, 210, 0.32)" : "rgba(159, 209, 223, 0.22)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 58, 58, 18);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.95)";
  ctx.beginPath();
  ctx.ellipse(rect.x + 43, rect.y + 43 + pulse, 24, 10, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.56)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText(spec.ready ? "回" : "种", rect.x + 34, rect.y + 48 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 16), rect.x + 86, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 16), rect.x + 86, rect.y + 45 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 86, rect.y + 63 + pulse);

  steps.forEach((step, index) => {
    const x = rect.x + 18 + index * 96;
    const y = rect.y + 78 + pulse;
    ctx.fillStyle = `${step.color}20`;
    ctx.strokeStyle = `${step.color}88`;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(x, y, 86, 24, 10);
    ctx.fill();
    ctx.stroke();
    if (index > 0) {
      ctx.strokeStyle = "rgba(77, 145, 166, 0.36)";
      ctx.beginPath();
      ctx.moveTo(x - 10, y + 12);
      ctx.lineTo(x - 2, y + 12);
      ctx.stroke();
    }
    ctx.fillStyle = step.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label, x + 8, y + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(step.text.slice(0, 8), x + 8, y + 20);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 18 + pulse, rect.width - 32, 13, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 54), rect.x + 24, rect.y + rect.height - 9 + pulse);
  ctx.restore();
  return true;
}

export function drawLingchiWaterFreshMenuWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.08) * 3;
  const shopX = 144;
  const shopY = 194;
  const bowlX = rect.x + 44;
  const bowlY = rect.y + 52 + pulse;
  const readyTone = spec.phase === "shop" || spec.readyToCraft;
  const accent = spec.phase === "shop" ? "#b47d2f" : readyTone ? "#286f58" : "#4d91a6";

  ctx.save();
  ctx.strokeStyle = spec.phase === "shop" ? "rgba(180, 125, 47, 0.58)" : "rgba(77, 145, 166, 0.54)";
  ctx.lineWidth = 2.1;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(rect.x + 34, rect.y + rect.height + pulse - 6);
  ctx.quadraticCurveTo(rect.x - 58, rect.y + rect.height + 26, shopX + 104, shopY + 88);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(224, 182, 109, 0.16)";
  ctx.beginPath();
  ctx.ellipse(shopX + 106, shopY + 90, 74 + pulse, 17, -0.08, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = spec.phase === "shop" ? "rgba(180, 125, 47, 0.74)" : "rgba(77, 145, 166, 0.68)";
  ctx.lineWidth = readyTone ? 2.3 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = spec.phase === "shop" ? "rgba(224, 182, 109, 0.24)" : "rgba(77, 145, 166, 0.17)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 13, rect.y + 13 + pulse, 62, 62, 18);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.beginPath();
  ctx.ellipse(bowlX, bowlY, 25, 11, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(77, 145, 166, 0.7)";
  ctx.beginPath();
  ctx.ellipse(bowlX - 2, bowlY - 3, 14, 4, -0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(202, 235, 210, 0.9)";
  ctx.beginPath();
  ctx.arc(bowlX + 8, bowlY - 4, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.48)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bowlX - 20, bowlY + 1);
  ctx.quadraticCurveTo(bowlX, bowlY + 18, bowlX + 20, bowlY + 1);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(spec.phase === "shop" ? "双" : "羹", rect.x + 33, rect.y + 40 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 14), rect.x + 88, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 14), rect.x + 88, rect.y + 44 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 28), rect.x + 88, rect.y + 63 + pulse);

  ctx.fillStyle = "rgba(248, 252, 247, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 74 + pulse, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  const stockText = spec.phase === "shop"
    ? `${spec.routeText} · 清波库存 ${spec.qingboCount}`
    : `${spec.routeText} · ${spec.price}灵石基准`;
  ctx.fillText(stockText.slice(0, 34), rect.x + 26, rect.y + 86 + pulse);
  ctx.restore();
  return true;
}

export function drawWaterFreshRegularPledgeWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.18) * 3;
  const pledgeActive = spec.phase === "active";
  const accent = pledgeActive ? "#286f58" : "#b47d2f";
  const shopX = 144;
  const shopY = 194;

  ctx.save();
  ctx.strokeStyle = pledgeActive ? "rgba(40, 111, 88, 0.58)" : "rgba(180, 125, 47, 0.56)";
  ctx.lineWidth = 2.1;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + 30, rect.y + rect.height + pulse - 8);
  ctx.quadraticCurveTo(rect.x - 48, rect.y + rect.height + 34, shopX + 118, shopY + 72);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = pledgeActive ? "rgba(202, 235, 210, 0.2)" : "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.ellipse(shopX + 118, shopY + 72, 78 + pulse, 17, -0.08, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, pledgeActive ? "rgba(236, 248, 243, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = pledgeActive ? "rgba(40, 111, 88, 0.72)" : "rgba(180, 125, 47, 0.7)";
  ctx.lineWidth = spec.ready ? 2.4 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = pledgeActive ? "rgba(40, 111, 88, 0.16)" : "rgba(224, 182, 109, 0.22)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 13, rect.y + 14 + pulse, 54, 54, 16);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 24, rect.y + 27 + pulse, 32, 25, 7);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.42)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText(pledgeActive ? "帖" : "约", rect.x + 31, rect.y + 45 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 13), rect.x + 80, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 13), rect.x + 80, rect.y + 43 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 27), rect.x + 80, rect.y + 62 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.8)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 72 + pulse, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.statusLabel} · ${spec.routeText}`.slice(0, 34), rect.x + 26, rect.y + 84 + pulse);
  ctx.restore();
  return true;
}

export function drawWaterFreshMenuRegularReasonWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.12) * 3;
  const accent = spec.paired ? "#286f58" : "#4d91a6";
  const steps = [
    { label: "同桌", text: spec.paired ? "两味齐" : "先补菜", color: spec.paired ? "#286f58" : "#be6a3c" },
    { label: "留话", text: spec.customerLabel.slice(0, 5), color: "#b47d2f" },
    { label: "回门", text: spec.ready ? "可接帖" : "等备货", color: spec.ready ? "#286f58" : "#4d91a6" },
  ];

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.76)" : "rgba(77, 145, 166, 0.46)";
  ctx.lineWidth = active ? 2.7 : 2;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + pulse);
  ctx.quadraticCurveTo(rect.x + 40, rect.y - 42 + pulse, rect.x + 28, rect.y + 20 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(224, 182, 109, 0.17)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + pulse, 70 + pulse, 18, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.beginPath();
  ctx.roundRect(anchor.x - 52, anchor.y - 17 + pulse, 104, 31, 13);
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 125, 47, 0.5)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("双水鲜同桌", anchor.x - 34, anchor.y + 4 + pulse);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.ready ? "rgba(236, 248, 243, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.86)" : spec.ready ? "rgba(40, 111, 88, 0.68)" : "rgba(77, 145, 166, 0.66)";
  ctx.lineWidth = active ? 2.8 : 1.9;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 19);
  ctx.stroke();

  ctx.fillStyle = spec.paired ? "rgba(202, 235, 210, 0.28)" : "rgba(159, 209, 223, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 13 + pulse, 64, 62, 18);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.beginPath();
  ctx.ellipse(rect.x + 38, rect.y + 41 + pulse, 19, 8, -0.08, 0, Math.PI * 2);
  ctx.ellipse(rect.x + 58, rect.y + 45 + pulse, 17, 7, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.52)";
  ctx.lineWidth = 1.3;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText(spec.paired ? "熟" : "留", rect.x + 37, rect.y + 51 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 16), rect.x + 90, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 16), rect.x + 90, rect.y + 45 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 35), rect.x + 90, rect.y + 63 + pulse);

  steps.forEach((step, index) => {
    const x = rect.x + 18 + index * 98;
    const y = rect.y + 78 + pulse;
    ctx.fillStyle = `${step.color}20`;
    ctx.strokeStyle = `${step.color}88`;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(x, y, 88, 24, 10);
    ctx.fill();
    ctx.stroke();
    if (index > 0) {
      ctx.strokeStyle = "rgba(77, 145, 166, 0.34)";
      ctx.beginPath();
      ctx.moveTo(x - 10, y + 12);
      ctx.lineTo(x - 2, y + 12);
      ctx.stroke();
    }
    ctx.fillStyle = step.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label, x + 8, y + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(step.text.slice(0, 8), x + 8, y + 20);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 18 + pulse, rect.width - 32, 13, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 56), rect.x + 24, rect.y + rect.height - 9 + pulse);
  ctx.restore();
  return true;
}

export function drawQingheWaterFreshReturnOrderWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.05) * 3;
  const ready = spec.phase === "deliver";
  const accent = ready ? "#286f58" : "#4d91a6";
  const shopX = 148;
  const shopY = 214;
  const pondX = 684;
  const pondY = 512;

  ctx.save();
  ctx.strokeStyle = ready ? "rgba(40, 111, 88, 0.62)" : "rgba(77, 145, 166, 0.56)";
  ctx.lineWidth = ready ? 2.8 : 2;
  ctx.setLineDash([8, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(shopX + 128, shopY + 58);
  ctx.bezierCurveTo(356, 276 + pulse, rect.x - 36, rect.y + rect.height + 34, rect.x + 34, rect.y + rect.height - 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 36, rect.y + rect.height - 8 + pulse);
  ctx.quadraticCurveTo(pondX - 42, rect.y + rect.height + 54, pondX, pondY - 12);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = ready ? "rgba(202, 235, 210, 0.24)" : "rgba(159, 209, 223, 0.22)";
  ctx.beginPath();
  ctx.ellipse(pondX, pondY - 8, 92 + pulse, 22, -0.06, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, ready ? "rgba(236, 248, 243, 0.96)" : "rgba(232, 247, 250, 0.96)");
  ctx.strokeStyle = ready ? "rgba(40, 111, 88, 0.74)" : "rgba(77, 145, 166, 0.72)";
  ctx.lineWidth = ready ? 2.6 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  const stampGradient = ctx.createLinearGradient(rect.x + 14, rect.y, rect.x + 72, rect.y + 70);
  stampGradient.addColorStop(0, ready ? "rgba(40, 111, 88, 0.24)" : "rgba(77, 145, 166, 0.26)");
  stampGradient.addColorStop(1, "rgba(255, 253, 245, 0.82)");
  ctx.fillStyle = stampGradient;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 15 + pulse, 58, 58, 18);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 24, rect.y + 30 + pulse, 38, 23, 7);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.5)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 28, rect.y + 42 + pulse);
  ctx.quadraticCurveTo(rect.x + 42, rect.y + 34 + pulse, rect.x + 58, rect.y + 42 + pulse);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(ready ? "交" : "回", rect.x + 34, rect.y + 48 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 14), rect.x + 86, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 15), rect.x + 86, rect.y + 46 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 30), rect.x + 86, rect.y + 65 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 76 + pulse, rect.width - 32, 17, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${ready ? spec.rewardText : spec.missingText}`.slice(0, 38), rect.x + 26, rect.y + 88 + pulse);
  ctx.restore();
  return true;
}

export function drawQingheWaterwayPreludeWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.86) * 3;
  const ready = spec.phase === "deliver";
  const locked = spec.phase === "story" || spec.phase === "favor";
  const accent = ready ? "#286f58" : locked ? "#8f5f3f" : "#4d91a6";
  const waterX = 826;
  const waterY = 506;

  ctx.save();
  ctx.strokeStyle = ready ? "rgba(40, 111, 88, 0.64)" : locked ? "rgba(143, 95, 63, 0.5)" : "rgba(77, 145, 166, 0.58)";
  ctx.lineWidth = ready ? 3 : 2.2;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 26, rect.y + rect.height - 14 + pulse);
  ctx.quadraticCurveTo(waterX - 62, waterY - 58, waterX, waterY - 14);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = ready ? "rgba(202, 235, 210, 0.28)" : "rgba(159, 209, 223, 0.2)";
  ctx.beginPath();
  ctx.ellipse(waterX, waterY, 88 + pulse, 24, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = locked ? "rgba(143, 95, 63, 0.78)" : ready ? "#286f58" : "#4d91a6";
  ctx.beginPath();
  ctx.moveTo(waterX - 40, waterY - 4);
  ctx.quadraticCurveTo(waterX, waterY + 24 + pulse / 2, waterX + 46, waterY - 4);
  ctx.lineTo(waterX + 30, waterY + 18);
  ctx.quadraticCurveTo(waterX, waterY + 31, waterX - 30, waterY + 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.fillRect(waterX - 1, waterY - 36 + pulse / 3, 5, 38);
  ctx.fillStyle = ready ? "#f2d28b" : "#e0b66d";
  ctx.beginPath();
  ctx.moveTo(waterX + 4, waterY - 34 + pulse / 3);
  ctx.lineTo(waterX + 39, waterY - 23 + pulse / 3);
  ctx.lineTo(waterX + 4, waterY - 11 + pulse / 3);
  ctx.closePath();
  ctx.fill();

  const cardFill = locked ? "rgba(255, 248, 232, 0.96)" : ready ? "rgba(236, 248, 243, 0.96)" : "rgba(232, 247, 250, 0.96)";
  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, cardFill);
  ctx.strokeStyle = ready ? "rgba(40, 111, 88, 0.76)" : locked ? "rgba(143, 95, 63, 0.66)" : "rgba(77, 145, 166, 0.72)";
  ctx.lineWidth = ready ? 2.8 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = locked ? "rgba(224, 182, 109, 0.24)" : "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 15 + pulse, 62, 62, 18);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(rect.x + 45, rect.y + 46 + pulse, 18, Math.PI * 0.12, Math.PI * 1.88);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(ready ? "航" : locked ? "候" : "备", rect.x + 34, rect.y + 52 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 90, rect.y + 24 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 16), rect.x + 90, rect.y + 47 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 31), rect.x + 90, rect.y + 67 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 80 + pulse, rect.width - 32, 17, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${ready ? spec.rewardText : spec.missingText}`.slice(0, 40), rect.x + 26, rect.y + 92 + pulse);
  ctx.restore();
  return true;
}

export function drawWaterFreshReturnToWaterwayReasonWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.94) * 3;
  const accent = spec.ready ? "#286f58" : spec.unlocked ? "#4d91a6" : "#8f5f3f";
  const steps = [
    { label: "回订", text: "双水鲜", color: "#4d91a6" },
    { label: "小簿", text: spec.favorReady ? "青禾信" : `青禾${spec.qingheFavorLevel}/5`, color: spec.favorReady ? "#286f58" : "#b47d2f" },
    { label: "水航", text: spec.ready ? "可交" : spec.unlocked ? "备货" : "待开", color: spec.ready ? "#286f58" : "#8f5f3f" },
  ];

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.76)" : "rgba(77, 145, 166, 0.48)";
  ctx.lineWidth = active ? 2.8 : 2.1;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 22, rect.y + 22 + pulse);
  ctx.quadraticCurveTo(anchor.x - 140, anchor.y - 76 + pulse, anchor.x, anchor.y + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = spec.ready ? "rgba(202, 235, 210, 0.25)" : "rgba(159, 209, 223, 0.2)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + pulse, 78 + pulse, 22, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(anchor.x - 38, anchor.y - 3 + pulse);
  ctx.quadraticCurveTo(anchor.x, anchor.y + 23 + pulse, anchor.x + 42, anchor.y - 3 + pulse);
  ctx.lineTo(anchor.x + 26, anchor.y + 17 + pulse);
  ctx.quadraticCurveTo(anchor.x, anchor.y + 29 + pulse, anchor.x - 26, anchor.y + 16 + pulse);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.fillRect(anchor.x - 1, anchor.y - 34 + pulse / 2, 5, 36);
  ctx.fillStyle = spec.ready ? "#f2d28b" : "#e0b66d";
  ctx.beginPath();
  ctx.moveTo(anchor.x + 4, anchor.y - 32 + pulse / 2);
  ctx.lineTo(anchor.x + 36, anchor.y - 21 + pulse / 2);
  ctx.lineTo(anchor.x + 4, anchor.y - 9 + pulse / 2);
  ctx.closePath();
  ctx.fill();
  drawWaterwayWorldLabel(ctx, "水航路标", anchor.x - 42, anchor.y - 46 + pulse, accent);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.ready ? "rgba(236, 248, 243, 0.96)" : "rgba(232, 247, 250, 0.96)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.86)" : spec.ready ? "rgba(40, 111, 88, 0.72)" : "rgba(77, 145, 166, 0.68)";
  ctx.lineWidth = active ? 2.9 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 19);
  ctx.stroke();

  ctx.fillStyle = spec.ready ? "rgba(202, 235, 210, 0.28)" : "rgba(159, 209, 223, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 13 + pulse, 64, 62, 18);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(rect.x + 46, rect.y + 44 + pulse, 19, Math.PI * 0.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText(spec.ready ? "航" : "路", rect.x + 36, rect.y + 51 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 17), rect.x + 92, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 92, rect.y + 45 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 36), rect.x + 92, rect.y + 63 + pulse);

  steps.forEach((step, index) => {
    const x = rect.x + 18 + index * 104;
    const y = rect.y + 77 + pulse;
    ctx.fillStyle = `${step.color}20`;
    ctx.strokeStyle = `${step.color}88`;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(x, y, 94, 24, 10);
    ctx.fill();
    ctx.stroke();
    if (index > 0) {
      ctx.strokeStyle = "rgba(77, 145, 166, 0.34)";
      ctx.beginPath();
      ctx.moveTo(x - 10, y + 12);
      ctx.lineTo(x - 2, y + 12);
      ctx.stroke();
    }
    ctx.fillStyle = step.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label, x + 8, y + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(step.text.slice(0, 9), x + 8, y + 20);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 18 + pulse, rect.width - 32, 13, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.gateText} · ${spec.safeNote}`.slice(0, 58), rect.x + 24, rect.y + rect.height - 9 + pulse);
  ctx.restore();
  return true;
}

export function drawQingheLotusBasinTradeDispatchWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.92) * 3;
  const travelling = spec.phase === "travel";
  const ready = spec.phase === "dispatch";
  const warning = spec.phase === "supply" || spec.phase === "cargo";
  const accent = travelling ? "#4d91a6" : ready ? "#286f58" : warning ? "#b47d2f" : "#8f5f3f";
  const waterY = rect.y + rect.height - 10;

  ctx.save();
  ctx.strokeStyle = travelling ? "rgba(77, 145, 166, 0.62)" : ready ? "rgba(40, 111, 88, 0.58)" : "rgba(180, 125, 47, 0.5)";
  ctx.lineWidth = travelling ? 3 : 2.2;
  ctx.setLineDash([10, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.moveTo(702, 526);
  ctx.bezierCurveTo(746, 544 + pulse, 812, 548 - pulse, 878, 560);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = travelling ? "rgba(159, 209, 223, 0.28)" : ready ? "rgba(202, 235, 210, 0.22)" : "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.ellipse(rect.x + rect.width - 60, waterY + pulse / 2, 86 + pulse, 20, -0.12, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, travelling ? "rgba(232, 247, 250, 0.96)" : ready ? "rgba(236, 248, 243, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = travelling ? "rgba(77, 145, 166, 0.74)" : ready ? "rgba(40, 111, 88, 0.74)" : "rgba(180, 125, 47, 0.68)";
  ctx.lineWidth = ready || travelling ? 2.6 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  const boatX = rect.x + 47;
  const boatY = rect.y + 51 + pulse;
  ctx.fillStyle = "rgba(159, 209, 223, 0.35)";
  ctx.beginPath();
  ctx.ellipse(boatX + 4, boatY + 20, 42, 11, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(boatX - 28, boatY + 5);
  ctx.quadraticCurveTo(boatX + 2, boatY + 28, boatX + 34, boatY + 5);
  ctx.lineTo(boatX + 24, boatY + 23);
  ctx.quadraticCurveTo(boatX, boatY + 35, boatX - 22, boatY + 22);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.fillRect(boatX + 1, boatY - 24, 5, 32);
  ctx.fillStyle = ready ? "#f2d28b" : "#e0b66d";
  ctx.beginPath();
  ctx.moveTo(boatX + 6, boatY - 22);
  ctx.lineTo(boatX + 34, boatY - 12);
  ctx.lineTo(boatX + 6, boatY - 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(travelling ? "返" : ready ? "发" : "备", boatX - 8, boatY + 20);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 92, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 16), rect.x + 92, rect.y + 46 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 32), rect.x + 92, rect.y + 65 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 72 + pulse, rect.width - 32, 17, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · 风险 ${spec.riskText} · ${spec.supplyText}`.slice(0, 42), rect.x + 26, rect.y + 84 + pulse);
  ctx.restore();
  return true;
}

export function drawQingheLotusBasinFollowupOrderWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.02) * 3;
  const ready = spec.phase === "deliver";
  const accent = ready ? "#286f58" : "#b47d2f";
  const waterX = rect.x + rect.width - 60;
  const waterY = rect.y + rect.height + 24;

  ctx.save();
  ctx.strokeStyle = ready ? "rgba(40, 111, 88, 0.62)" : "rgba(180, 125, 47, 0.56)";
  ctx.lineWidth = ready ? 2.8 : 2.2;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(waterX - 20, waterY - 10);
  ctx.quadraticCurveTo(rect.x + rect.width * 0.66, rect.y + rect.height + 42, rect.x + 46, rect.y + rect.height - 8 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = ready ? "rgba(202, 235, 210, 0.24)" : "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.ellipse(waterX, waterY - 8, 82 + pulse, 22, -0.1, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, ready ? "rgba(236, 248, 243, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = ready ? "rgba(40, 111, 88, 0.76)" : "rgba(180, 125, 47, 0.72)";
  ctx.lineWidth = ready ? 2.8 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = ready ? "rgba(40, 111, 88, 0.18)" : "rgba(224, 182, 109, 0.24)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 15, rect.y + 15 + pulse, 62, 62, 16);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 27, rect.y + 25 + pulse, 38, 42, 7);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.42)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(ready ? "交" : "续", rect.x + 35, rect.y + 51 + pulse);
  ctx.fillStyle = "rgba(143, 95, 63, 0.48)";
  ctx.fillRect(rect.x + 34, rect.y + 58 + pulse, 22, 2);
  ctx.fillRect(rect.x + 34, rect.y + 64 + pulse, 16, 2);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 92, rect.y + 24 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 16), rect.x + 92, rect.y + 47 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 32), rect.x + 92, rect.y + 67 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 80 + pulse, rect.width - 32, 17, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${ready ? spec.rewardText : spec.missingText}`.slice(0, 42), rect.x + 26, rect.y + 92 + pulse);
  ctx.restore();
  return true;
}

export function drawLotusBasinReturnFollowupReasonWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.04) * 3;
  const accent = spec.ready ? "#286f58" : "#b47d2f";
  const steps = [
    { label: "返货", text: "跑得通", color: "#4d91a6" },
    { label: "等货", text: "莲泽认门", color: "#b47d2f" },
    { label: "续订", text: spec.ready ? "可交" : spec.visible ? "备货" : "待写单", color: spec.ready ? "#286f58" : "#8f5f3f" },
  ];

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.76)" : "rgba(180, 125, 47, 0.5)";
  ctx.lineWidth = active ? 2.8 : 2.1;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + pulse);
  ctx.bezierCurveTo(anchor.x - 118, anchor.y - 48 + pulse, rect.x + rect.width + 80, rect.y + 8 + pulse, rect.x + rect.width - 20, rect.y + 28 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + pulse, 82 + pulse, 22, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(anchor.x - 42, anchor.y - 2 + pulse);
  ctx.quadraticCurveTo(anchor.x, anchor.y + 24 + pulse, anchor.x + 46, anchor.y - 2 + pulse);
  ctx.lineTo(anchor.x + 30, anchor.y + 18 + pulse);
  ctx.quadraticCurveTo(anchor.x, anchor.y + 30 + pulse, anchor.x - 30, anchor.y + 17 + pulse);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.fillRect(anchor.x - 1, anchor.y - 34 + pulse / 2, 5, 36);
  ctx.fillStyle = "#f2d28b";
  ctx.beginPath();
  ctx.moveTo(anchor.x + 4, anchor.y - 32 + pulse / 2);
  ctx.lineTo(anchor.x + 38, anchor.y - 21 + pulse / 2);
  ctx.lineTo(anchor.x + 4, anchor.y - 9 + pulse / 2);
  ctx.closePath();
  ctx.fill();
  drawWaterwayWorldLabel(ctx, "返货回声", anchor.x - 42, anchor.y - 46 + pulse, accent);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.ready ? "rgba(236, 248, 243, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.86)" : spec.ready ? "rgba(40, 111, 88, 0.72)" : "rgba(180, 125, 47, 0.72)";
  ctx.lineWidth = active ? 2.9 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 19);
  ctx.stroke();

  ctx.fillStyle = spec.ready ? "rgba(202, 235, 210, 0.28)" : "rgba(224, 182, 109, 0.23)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 13 + pulse, 64, 62, 18);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 28, rect.y + 25 + pulse, 36, 42, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.44)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText(spec.ready ? "续" : "等", rect.x + 37, rect.y + 52 + pulse);
  ctx.fillStyle = "rgba(143, 95, 63, 0.48)";
  ctx.fillRect(rect.x + 34, rect.y + 58 + pulse, 22, 2);
  ctx.fillRect(rect.x + 34, rect.y + 64 + pulse, 16, 2);

  ctx.fillStyle = accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 17), rect.x + 92, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 92, rect.y + 45 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 37), rect.x + 92, rect.y + 63 + pulse);

  steps.forEach((step, index) => {
    const x = rect.x + 18 + index * 104;
    const y = rect.y + 77 + pulse;
    ctx.fillStyle = `${step.color}20`;
    ctx.strokeStyle = `${step.color}88`;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(x, y, 94, 24, 10);
    ctx.fill();
    ctx.stroke();
    if (index > 0) {
      ctx.strokeStyle = "rgba(180, 125, 47, 0.34)";
      ctx.beginPath();
      ctx.moveTo(x - 10, y + 12);
      ctx.lineTo(x - 2, y + 12);
      ctx.stroke();
    }
    ctx.fillStyle = step.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label, x + 8, y + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(step.text.slice(0, 9), x + 8, y + 20);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 18 + pulse, rect.width - 32, 13, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.gateText} · ${spec.safeNote}`.slice(0, 58), rect.x + 24, rect.y + rect.height - 9 + pulse);
  ctx.restore();
  return true;
}

export function drawQingheLotusBasinLongOrderWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.98) * 3;
  const stable = spec.phase === "stable";
  const ready = spec.phase === "restock_ready";
  const warning = spec.phase === "restock" || spec.phase === "stock";
  const accent = stable ? "#286f58" : ready ? "#4d91a6" : warning ? "#b47d2f" : "#8f5f3f";
  const shopX = 150;
  const shopY = 224;

  ctx.save();
  ctx.strokeStyle = stable ? "rgba(40, 111, 88, 0.58)" : "rgba(180, 125, 47, 0.5)";
  ctx.lineWidth = stable ? 3 : 2.2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(rect.x + 34, rect.y + rect.height - 8 + pulse);
  ctx.quadraticCurveTo(rect.x - 88, rect.y + rect.height + 36, shopX + 104, shopY + 70);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, stable ? "rgba(236, 248, 243, 0.96)" : ready ? "rgba(232, 247, 250, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = stable ? "rgba(40, 111, 88, 0.74)" : ready ? "rgba(77, 145, 166, 0.72)" : "rgba(180, 125, 47, 0.68)";
  ctx.lineWidth = stable || ready ? 2.7 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = stable ? "rgba(40, 111, 88, 0.18)" : "rgba(224, 182, 109, 0.22)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 15, rect.y + 15 + pulse, 62, 62, 16);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x + 28, rect.y + 27 + pulse, 36, 36, 7);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.fillRect(rect.x + 35, rect.y + 37 + pulse, 22, 2);
  ctx.fillRect(rect.x + 35, rect.y + 45 + pulse, 18, 2);
  ctx.fillRect(rect.x + 35, rect.y + 53 + pulse, 24, 2);
  ctx.fillStyle = accent;
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(stable ? "稳" : ready ? "成" : "账", rect.x + 34, rect.y + 73 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 92, rect.y + 24 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 92, rect.y + 47 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 92, rect.y + 67 + pulse);

  const progressWidth = rect.width - 122;
  const [progressNow, progressTarget] = String(spec.progressText || "0/3").split("/").map((value) => Number(value || 0));
  const progress = progressTarget > 0 ? Math.max(0.05, Math.min(1, progressNow / progressTarget)) : stable ? 1 : 0.16;
  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 92, rect.y + 78 + pulse, progressWidth, 16, 8);
  ctx.fill();
  ctx.fillStyle = stable ? "rgba(40, 111, 88, 0.72)" : "rgba(77, 145, 166, 0.62)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 94, rect.y + 80 + pulse, Math.max(12, (progressWidth - 4) * progress), 12, 6);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  const statusLine = spec.phase === "restock" || spec.phase === "restock_ready"
    ? `${spec.targetItemName} ${spec.have}/${spec.desiredCount} · ${spec.routeText}`
    : `${spec.routeText} · 长单 ${spec.progressText}`;
  ctx.fillText(statusLine.slice(0, 39), rect.x + 102, rect.y + 91 + pulse);
  ctx.restore();
  return true;
}

export function drawQingheLotusBasinStandingOrderWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.05) * 3;
  const ready = spec.ready;
  const echoReady = spec.phase === "town_echo";
  const accent = ready ? "#286f58" : "#be4f37";
  const shopX = 156;
  const shopY = 220;

  ctx.save();
  ctx.strokeStyle = ready ? "rgba(40, 111, 88, 0.58)" : "rgba(190, 79, 55, 0.45)";
  ctx.lineWidth = ready ? 2.8 : 2.2;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + 20, rect.y + rect.height - 8 + pulse);
  ctx.quadraticCurveTo(rect.x - 90, rect.y + rect.height + 12, shopX + 120, shopY + 54);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, ready ? "rgba(236, 248, 243, 0.96)" : "rgba(255, 240, 232, 0.96)");
  ctx.strokeStyle = ready ? "rgba(40, 111, 88, 0.74)" : "rgba(190, 79, 55, 0.66)";
  ctx.lineWidth = ready ? 2.7 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = ready ? "rgba(40, 111, 88, 0.18)" : "rgba(190, 79, 55, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 60, 60, 16);
  ctx.fill();
  for (let i = 0; i < 3; i += 1) {
    const crateX = rect.x + 24 + i * 13;
    const crateY = rect.y + 39 + pulse - (i % 2) * 5;
    ctx.fillStyle = i % 2 ? "#e0b66d" : "#8f5f3f";
    ctx.beginPath();
    ctx.roundRect(crateX, crateY, 18, 14, 4);
    ctx.fill();
  }
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(ready ? "常" : "补", rect.x + 35, rect.y + 35 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 90, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 90, rect.y + 46 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 33), rect.x + 90, rect.y + 65 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 72 + pulse, rect.width - 32, 17, 8);
  ctx.fill();
  ctx.fillStyle = echoReady ? "#286f58" : "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.focusItemName} ${spec.focusHave}/${spec.focusTarget}`.slice(0, 40), rect.x + 26, rect.y + 84 + pulse);
  ctx.restore();
  return true;
}

export function drawQingheWaterwayAfterwordWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.16) * 3;
  const accent = "#4d91a6";

  ctx.save();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.56)";
  ctx.lineWidth = 2.2;
  ctx.setLineDash([7, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 34, rect.y + rect.height - 10 + pulse);
  ctx.quadraticCurveTo(rect.x + rect.width + 26, rect.y + rect.height + 42, 822, 502);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(232, 247, 250, 0.96)");
  ctx.strokeStyle = "rgba(77, 145, 166, 0.74)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 58, 58, 16);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 25, rect.y + 25 + pulse, 36, 40, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.45)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(rect.x + 31, rect.y + 36 + pulse);
  ctx.lineTo(rect.x + 55, rect.y + 36 + pulse);
  ctx.moveTo(rect.x + 31, rect.y + 45 + pulse);
  ctx.lineTo(rect.x + 52, rect.y + 45 + pulse);
  ctx.moveTo(rect.x + 31, rect.y + 54 + pulse);
  ctx.lineTo(rect.x + 57, rect.y + 54 + pulse);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("簿", rect.x + 36, rect.y + 76 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 14), rect.x + 86, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 16), rect.x + 86, rect.y + 46 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 31), rect.x + 86, rect.y + 65 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 72 + pulse, rect.width - 32, 17, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · 第 ${spec.momentDay} 天`.slice(0, 38), rect.x + 26, rect.y + 84 + pulse);
  ctx.restore();
  return true;
}

export function drawQingheWaterwayTownRumorWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.22) * 3;
  const accent = spec.ready ? "#286f58" : "#b47d2f";

  ctx.save();
  ctx.strokeStyle = spec.ready ? "rgba(40, 111, 88, 0.54)" : "rgba(180, 125, 47, 0.48)";
  ctx.lineWidth = spec.ready ? 2.8 : 2.2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(rect.x + 24, rect.y + rect.height - 8 + pulse);
  ctx.quadraticCurveTo(rect.x - 54, rect.y + rect.height + 36, anchor.x, anchor.y);
  ctx.quadraticCurveTo(anchor.x + 86, anchor.y + 18, 338, 256);
  ctx.stroke();
  ctx.setLineDash([]);

  const lampGlow = ctx.createRadialGradient(anchor.x, anchor.y, 8, anchor.x, anchor.y, 54 + pulse);
  lampGlow.addColorStop(0, spec.ready ? "rgba(202, 235, 210, 0.68)" : "rgba(255, 226, 164, 0.62)");
  lampGlow.addColorStop(1, "rgba(255, 253, 245, 0)");
  ctx.fillStyle = lampGlow;
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, 58 + pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = spec.ready ? "rgba(40, 111, 88, 0.24)" : "rgba(180, 125, 47, 0.22)";
  ctx.beginPath();
  ctx.roundRect(anchor.x - 22, anchor.y - 28 + pulse * 0.35, 44, 54, 13);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("传", anchor.x - 8, anchor.y + 4 + pulse * 0.35);
  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.ready ? "认门" : "待补", anchor.x - 15, anchor.y + 20 + pulse * 0.35);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.ready ? "rgba(236, 248, 243, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = spec.ready ? "rgba(40, 111, 88, 0.74)" : "rgba(180, 125, 47, 0.68)";
  ctx.lineWidth = spec.ready ? 2.6 : 2.2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = spec.ready ? "rgba(40, 111, 88, 0.18)" : "rgba(224, 182, 109, 0.22)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 58, 58, 16);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(rect.x + 43, rect.y + 40 + pulse, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rect.x + 59, rect.y + 40 + pulse);
  ctx.quadraticCurveTo(rect.x + 69, rect.y + 32 + pulse, rect.x + 72, rect.y + 24 + pulse);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("话", rect.x + 34, rect.y + 74 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 88, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 88, rect.y + 46 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 35), rect.x + 88, rect.y + 65 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 72 + pulse, rect.width - 32, 17, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · 常单 ${spec.stockedKinds}/${Math.max(2, spec.stockedKinds || 2)} 类`.slice(0, 40), rect.x + 26, rect.y + 84 + pulse);
  ctx.restore();
  return true;
}
