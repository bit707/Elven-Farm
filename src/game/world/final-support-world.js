export function drawFinalSupportOverviewWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect, stats } = spec;
  const accent = stats.stageReady > 0 ? "#8f1f1f" : stats.supportReady > 0 ? "#be4f37" : stats.prepReady > 0 ? "#b47d2f" : "#8f5f3f";
  const gold = "#c9953d";
  const ink = "#17231d";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.42) * 1.7;

  ctx.save();
  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.97)");
  ctx.fillStyle = "rgba(143, 31, 31, 0.11)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 46, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 38, 29, 12);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("总", rect.x + 29, rect.y + 39 + bob);
  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("终阵进度总览牌 · 可点", rect.x + 66, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(spec.subtitle, rect.x + 66, rect.y + 48 + bob);

  ctx.fillStyle = "rgba(255, 253, 245, 0.72)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 68 + bob, rect.width - 36, 12, 7);
  ctx.fill();
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 68 + bob, Math.max(10, Math.round((rect.width - 36) * spec.percent / 100)), 12, 7);
  ctx.fill();
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.shortSummary, rect.x + 18, rect.y + 92 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.96)" : "rgba(255, 253, 245, 0.68)";
    ctx.strokeStyle = active ? "rgba(201, 149, 61, 0.84)" : "rgba(143, 31, 31, 0.26)";
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(201, 149, 61, 0.28)" : "rgba(143, 31, 31, 0.14)";
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = ink;
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText("只定位总览 · 不自动领取 / 激活 / 应用", rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(201, 149, 61, 0.82)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawFinalSupportPrepFeedbackWorld({
  ctx,
  width = 960,
  feedback = null,
  age = 0,
  ease = 0,
  pulse = 0,
  portrait = null,
  day = 1,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const x = Math.round(width / 2 - 250);
  const y = Math.round(78 + pulse - ease * 12);
  const accent = "#be4f37";
  const gold = "#c9953d";

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(x + 250, y + 76, 24, x + 250, y + 76, 260);
  glow.addColorStop(0, "rgba(246, 240, 182, 0.34)");
  glow.addColorStop(0.56, "rgba(190, 79, 55, 0.13)");
  glow.addColorStop(1, "rgba(255, 253, 245, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 250, y + 76, 260, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, 500, 146, "rgba(255, 248, 232, 0.96)");
  ctx.fillStyle = "rgba(190, 79, 55, 0.14)";
  ctx.beginPath();
  ctx.roundRect(x + 16, y + 16, 468, 42, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(x + 26, y + 22, 42, 30, 12);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText("阵", x + 38, y + 43);
  ctx.fillStyle = gold;
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText("预备支援入阵回响", x + 82, y + 36);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${feedback.supportType || "终章支援"} · 第 ${day} 天`, x + 82, y + 51);

  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x + 30, y + 72, 58, 58, 18);
    ctx.clip();
    ctx.drawImage(portrait, x + 30, y + 72, 58, 58);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(190, 79, 55, 0.18)";
    ctx.beginPath();
    ctx.roundRect(x + 30, y + 72, 58, 58, 18);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.font = "900 20px Microsoft YaHei";
    ctx.fillText(String(feedback.npcName || "镇").slice(0, 1), x + 49, y + 108);
  }

  ctx.fillStyle = "#17231d";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "预备支援入阵").slice(0, 18), x + 108, y + 86);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "13px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "关系伏笔已经转成终阵准备。").slice(0, 42), x + 108, y + 109);
  ctx.fillStyle = accent;
  ctx.font = "800 12px Microsoft YaHei";
  const memoryLine = feedback.latestTitle
    ? `来自关系记忆「${feedback.latestTitle}」`
    : String(feedback.note || "关系伏笔已写入终阵。");
  ctx.fillText(memoryLine.slice(0, 36), x + 108, y + 130);

  for (let i = 0; i < 9; i += 1) {
    const angle = i * 0.7 + age / 560;
    const radius = 34 + (i % 3) * 13 + ease * 10;
    const cx = x + 418 + Math.cos(angle) * radius;
    const cy = y + 92 + Math.sin(angle) * radius * 0.7;
    ctx.fillStyle = i % 2 ? "rgba(201, 149, 61, 0.46)" : "rgba(190, 79, 55, 0.34)";
    ctx.beginPath();
    ctx.arc(cx, cy, 3.2 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(201, 149, 61, 0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + 418, y + 92, 24 + ease * 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText("入阵", x + 402, y + 98);
  ctx.restore();
  return true;
}

export function drawFinalSupportPrepKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  shortText = (text) => String(text || ""),
  effectText = () => "",
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const accent = "#be4f37";
  const gold = "#c9953d";
  const ink = "#17231d";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.46) * 1.9;

  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = activeNodeKey ? "rgba(190, 79, 55, 0.78)" : "rgba(190, 79, 55, 0.38)";
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([3, 7]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 7;
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.width - 30, rect.y + rect.height - 14 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 22, spec.point.x, spec.point.y + 48);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.97)");
  ctx.fillStyle = "rgba(190, 79, 55, 0.15)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 46, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 38, 28, 12);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("阵", rect.x + 29, rect.y + 38 + bob);
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 88, rect.y + 18 + bob, 58, 26, 13);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("可领", rect.x + rect.width - 72, rect.y + 36 + bob);
  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("终章伏笔亮签 · 可点", rect.x + 66, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 20), rect.x + 66, rect.y + 47 + bob);

  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(spec.shortSummary, rect.x + 18, rect.y + 78 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(shortText(effectText(spec.prep.effectTarget, spec.prep.effectValue), 28), rect.x + 18, rect.y + 93 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.96)" : "rgba(255, 253, 245, 0.68)";
    ctx.strokeStyle = active ? "rgba(201, 149, 61, 0.88)" : "rgba(190, 79, 55, 0.3)";
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(201, 149, 61, 0.28)" : "rgba(190, 79, 55, 0.16)";
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = ink;
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText("只定位领取入口 · 不自动领取", rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(201, 149, 61, 0.84)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawFinalSupportStageKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  shortText = (text) => String(text || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const accent = "#8f1f1f";
  const gold = "#c9953d";
  const ink = "#17231d";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.62) * 1.8;

  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = activeNodeKey ? "rgba(143, 31, 31, 0.78)" : "rgba(143, 31, 31, 0.38)";
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([5, 6]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    ctx.moveTo(rect.x + 28, rect.y + 16 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y - 22, spec.point.x, spec.point.y + 34);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.97)");
  ctx.fillStyle = "rgba(143, 31, 31, 0.13)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 48, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 38, 29, 12);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("阶", rect.x + 29, rect.y + 39 + bob);
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 88, rect.y + 18 + bob, 58, 26, 13);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("可用", rect.x + rect.width - 72, rect.y + 36 + bob);
  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("终章阶段亮签 · 可点", rect.x + 66, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 20), rect.x + 66, rect.y + 48 + bob);

  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(spec.shortSummary, rect.x + 18, rect.y + 80 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(shortText(spec.effectText, 30), rect.x + 18, rect.y + 95 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.96)" : "rgba(255, 253, 245, 0.68)";
    ctx.strokeStyle = active ? "rgba(201, 149, 61, 0.88)" : "rgba(143, 31, 31, 0.3)";
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(201, 149, 61, 0.28)" : "rgba(143, 31, 31, 0.15)";
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = ink;
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText("只定位应用入口 · 不自动应用", rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(201, 149, 61, 0.84)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawFinalSupportStageAfterglowWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  shortText = (text) => String(text || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const accent = "#8f5f3f";
  const gold = "#c9953d";
  const ink = "#17231d";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.54) * 1.6;

  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = activeNodeKey ? "rgba(143, 95, 63, 0.74)" : "rgba(143, 95, 63, 0.34)";
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([2, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 6;
    ctx.beginPath();
    ctx.moveTo(rect.x + 26, rect.y + rect.height - 10 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 30, spec.point.x + 8, spec.point.y + 54);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 253, 245, 0.96)");
  ctx.fillStyle = "rgba(143, 95, 63, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 44, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 38, 28, 12);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("余", rect.x + 29, rect.y + 38 + bob);
  ctx.fillStyle = gold;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("已写入", rect.x + rect.width - 78, rect.y + 36 + bob);
  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("终章阶段余辉签 · 可点", rect.x + 66, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 20), rect.x + 66, rect.y + 47 + bob);

  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(spec.shortSummary, rect.x + 18, rect.y + 76 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(shortText(`${spec.effectText} · ${spec.cutsceneText}`, 32), rect.x + 18, rect.y + 91 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.96)" : "rgba(255, 253, 245, 0.68)";
    ctx.strokeStyle = active ? "rgba(201, 149, 61, 0.82)" : "rgba(143, 95, 63, 0.28)";
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(201, 149, 61, 0.26)" : "rgba(143, 95, 63, 0.14)";
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = ink;
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText("只定位回看入口 · 不重复应用", rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(201, 149, 61, 0.82)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}
