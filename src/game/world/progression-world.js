export function spiritJobReadyWorldAccentWorld(job = "") {
  return {
    farm: "#286f58",
    workshop: "#b47d2f",
    shop: "#d87f8d",
    patrol: "#4f6f8f",
    expedition: "#8f5f3f",
    garden: "#7ba66c",
  }[job] || "#b47d2f";
}

export function drawSpiritJobReadyWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  accentForJob = spiritJobReadyWorldAccentWorld,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.65) * 2;
  const accent = accentForJob(spec.job);

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width - 36, rect.y + rect.height + 34 + bob, rect.x + rect.width - 54, rect.y + rect.height - 8 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(248, 252, 247, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, rect.y + 1.5 + bob, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 16 + bob, 54, 54, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText(spec.kind === "task" ? "事" : "修", rect.x + 30, rect.y + 49 + bob);
  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 22, rect.y + 58 + bob, 38, 17, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.jobLabel.slice(0, 4), rect.x + 28, rect.y + 70 + bob);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 82, rect.y + 25 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 82, rect.y + 48 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 31), rect.x + 82, rect.y + 67 + bob);

  ctx.fillStyle = "rgba(255, 248, 232, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 82, rect.y + 76 + bob, rect.width - 102, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`奖励 ${spec.rewardText}`.slice(0, 28), rect.x + 92, rect.y + 89 + bob);

  ctx.fillStyle = spec.kind === "task" ? "rgba(202, 235, 210, 0.64)" : "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 24 + bob, rect.width - 32, 18, 9);
  ctx.fill();
  ctx.fillStyle = spec.kind === "task" ? "#286f58" : "#b47d2f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.effectText}`.slice(0, 36), rect.x + 28, rect.y + rect.height - 11 + bob);

  const totalReady = Number(spec.readyTaskCount || 0) + Number(spec.readyGoalCount || 0);
  if (totalReady > 1) {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(rect.x + rect.width - 24, rect.y + 24 + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(String(totalReady).slice(0, 2), rect.x + rect.width - 29, rect.y + 28 + bob);
  }

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(246, 240, 182, 0.92)" : "rgba(246, 240, 182, 0.62)";
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + 30 + i * 13, rect.y + rect.height + 4 + bob + Math.sin(motion * 2 + i) * 2, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawYear2GoalWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.42) * 2;
  const accent = spec.ready ? "#286f58" : "#b47d2f";
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width * 0.58, cardY + rect.height + 38, rect.x + rect.width * 0.5, cardY + rect.height - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.ready ? "rgba(237, 248, 243, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 15, 60, 64, 15);
  ctx.fill();
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 22, cardY + 22, 44, 50, 10);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("鉴", rect.x + 32, cardY + 54);
  ctx.strokeStyle = "rgba(255, 253, 245, 0.88)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 32, cardY + 62);
  ctx.lineTo(rect.x + 58, cardY + 62);
  ctx.stroke();

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 86, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 86, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.goalScope} · ${spec.goalTitle}`.slice(0, 30), rect.x + 86, cardY + 66);

  ctx.fillStyle = "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 86, cardY + 76, rect.width - 112, 8, 4);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 86, cardY + 76, Math.max(10, (rect.width - 112) * spec.progressPercent), 8, 4);
  ctx.fill();
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`进度 ${Math.min(spec.progress, spec.target)}/${spec.target} · ${spec.estimatedMinutes || 10} 分钟 · 奖励 ${spec.rewardText}`.slice(0, 37), rect.x + 86, cardY + 98);

  const rowStart = cardY + 116;
  spec.rows.slice(0, 3).forEach((row, index) => {
    const rowY = rowStart + index * 18;
    if (rowY > cardY + rect.height - 10) return;
    const rowAccent = row.ready ? "#286f58" : index === 0 ? "#b47d2f" : "#8f5f3f";
    ctx.fillStyle = row.ready ? "rgba(202, 235, 210, 0.62)" : "rgba(255, 253, 245, 0.72)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 16, rowY - 13, rect.width - 32, 16, 8);
    ctx.fill();
    ctx.fillStyle = rowAccent;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(row.ready ? "可收" : row.scope, rect.x + 28, rowY - 2);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(row.title.slice(0, 13), rect.x + 64, rowY - 2);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(row.progressText, rect.x + rect.width - 50, rowY - 2);
  });

  ctx.fillStyle = spec.ready ? "rgba(202, 235, 210, 0.76)" : "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 78, cardY + 12, 62, 20, 10);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 7), rect.x + rect.width - 68, cardY + 26);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(246, 240, 182, 0.9)" : "rgba(246, 240, 182, 0.58)";
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + 28 + i * 16, cardY + rect.height + 4 + Math.sin(motion * 2.1 + i) * 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawPostMainlineTenHourRouteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.18) * 2;
  const accent = spec.pass ? "#286f58" : spec.contentPass ? "#b47d2f" : "#be4f37";
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}e8` : `${accent}68`;
  ctx.lineWidth = active ? 3 : 1.6;
  ctx.setLineDash([8, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 9;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.bezierCurveTo(anchor.x - 66, cardY + rect.height + 34, rect.x + rect.width * 0.72, cardY + rect.height + 30, rect.x + rect.width - 28, cardY + rect.height - 6);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.pass ? "rgba(237, 248, 243, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${accent}f0` : `${accent}90`;
  ctx.lineWidth = active ? 2.8 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 16, 58, 62, 16);
  ctx.fill();
  ctx.strokeStyle = `${accent}99`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 30, cardY + 28);
  ctx.lineTo(rect.x + 56, cardY + 28);
  ctx.lineTo(rect.x + 56, cardY + 64);
  ctx.lineTo(rect.x + 30, cardY + 64);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("路", rect.x + 32, cardY + 55);
  ctx.fillStyle = "rgba(246, 240, 182, 0.82)";
  ctx.beginPath();
  ctx.arc(rect.x + 58, cardY + 26, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 84, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 84, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`约 ${spec.totalHours} 小时 · 覆盖 ${spec.coverageDone}/${spec.coverageTotal} 类`.slice(0, 30), rect.x + 84, cardY + 66);

  const meterX = rect.x + 84;
  const meterY = cardY + 78;
  const meterW = rect.width - 104;
  ctx.fillStyle = "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.roundRect(meterX, meterY, meterW, 8, 4);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(meterX, meterY, Math.max(12, meterW * Math.min(1, spec.totalMinutes / spec.targetMinutes)), 8, 4);
  ctx.fill();

  const beadY = cardY + 104;
  const beadGap = 30;
  spec.routeRows.slice(0, 6).forEach((row, index) => {
    const beadX = rect.x + 22 + index * beadGap;
    const isFocus = row.key === spec.focusRow.key;
    ctx.fillStyle = isFocus ? accent : "rgba(255, 253, 245, 0.86)";
    ctx.strokeStyle = isFocus ? `${accent}ee` : "rgba(143, 95, 63, 0.22)";
    ctx.lineWidth = isFocus ? 2.2 : 1.2;
    ctx.beginPath();
    ctx.arc(beadX, beadY, isFocus ? 8 : 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.strokeStyle = "rgba(143, 95, 63, 0.18)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 22, beadY);
  ctx.lineTo(rect.x + 22 + beadGap * Math.min(5, spec.routeRows.length - 1), beadY);
  ctx.stroke();

  ctx.fillStyle = "#17231d";
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(spec.focusRow.title.slice(0, 12), rect.x + 204, cardY + 100);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.focusRow.minutes} 分钟 · 可点`.slice(0, 16), rect.x + 204, cardY + 118);

  ctx.fillStyle = spec.pass ? "rgba(202, 235, 210, 0.76)" : "rgba(224, 182, 109, 0.24)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 82, cardY + 12, 66, 20, 10);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("年路 · 可点", rect.x + rect.width - 74, cardY + 26);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(246, 240, 182, 0.9)" : "rgba(246, 240, 182, 0.58)";
    for (let i = 0; i < 6; i += 1) {
      const spark = motion * 1.7 + i;
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 34 + Math.cos(spark) * 18, cardY + 56 + Math.sin(spark * 1.2) * 22, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawPostMainlineTodayRouteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.55) * 1.8;
  const accent = spec.rowNode?.accent || "#b47d2f";
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.bezierCurveTo(anchor.x - 52, anchor.y + 10, rect.x + 34, cardY + 18, rect.x + 24, cardY + 54);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 250, 238, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}18`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 52, 52, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText(spec.rowNode.icon || "今", rect.x + 29, cardY + 47);
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 52, 38, 15, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 30, cardY + 63);

  ctx.fillStyle = accent;
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 78, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 14), rect.x + 78, cardY + 43);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.rowNode.title} · ${spec.minutes} 分钟`.slice(0, 28), rect.x + 78, cardY + 58);
  ctx.fillText(`${spec.targetLabel} · 覆盖 ${spec.coverageDone}/${spec.coverageTotal}`.slice(0, 28), rect.x + 78, cardY + 71);

  spec.rows.slice(0, 3).forEach((row, index) => {
    const chipX = rect.x + 16 + index * 72;
    const chipY = cardY + 80;
    const rowAccent = row.accent || accent;
    ctx.fillStyle = row.active ? `${rowAccent}22` : "rgba(255, 253, 245, 0.78)";
    ctx.strokeStyle = row.active ? `${rowAccent}aa` : "rgba(143, 95, 63, 0.2)";
    ctx.lineWidth = row.active ? 1.6 : 1;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 64, 22, 9);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = row.active ? rowAccent : "#8f5f3f";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(row.stationLabel || row.title || "路线").slice(0, 5), chipX + 6, chipY + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 7px Microsoft YaHei";
    ctx.fillText(`${Math.max(0, Number(row.minutes || 0))} 分钟`.slice(0, 8), chipX + 6, chipY + 19);
  });
  ctx.restore();
  return true;
}

export function drawPostMainlineRouteStationsWorld({
  ctx,
  stations = [],
  motion = 0,
  reducedMotion = false,
  activeRouteKey = "",
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !stations.length) return false;
  ctx.save();

  ctx.strokeStyle = "rgba(180, 125, 47, 0.26)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 8]);
  ctx.beginPath();
  stations.forEach((station, index) => {
    const x = station.rect.x + station.rect.width / 2;
    const y = station.rect.y + station.rect.height / 2 + Math.sin(motion + index) * (reducedMotion ? 0 : 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  for (const station of stations) {
    const { rect } = station;
    const bob = reducedMotion ? 0 : Math.sin(motion * 1.6 + station.order) * 2;
    const active = activeRouteKey === station.routeKey;
    const accent = station.accent || "#8f5f3f";
    const y = rect.y + bob;

    ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
    ctx.beginPath();
    ctx.ellipse(rect.x + rect.width / 2, rect.y + rect.height + 4, 42, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    drawCanvasCard(ctx, rect.x, y, rect.width, rect.height, active ? "rgba(237, 248, 243, 0.94)" : "rgba(255, 248, 232, 0.9)");
    ctx.strokeStyle = active ? `${accent}f0` : `${accent}80`;
    ctx.lineWidth = active ? 2.6 : 1.4;
    ctx.beginPath();
    ctx.roundRect(rect.x + 1.5, y + 1.5, rect.width - 3, rect.height - 3, 14);
    ctx.stroke();

    ctx.fillStyle = `${accent}22`;
    ctx.beginPath();
    ctx.roundRect(rect.x + 8, y + 9, 34, 34, 10);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.font = "900 17px Microsoft YaHei";
    ctx.fillText(station.icon, rect.x + 16, y + 32);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 11px Microsoft YaHei";
    ctx.fillText(station.label.slice(0, 5), rect.x + 46, y + 22);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(`${station.minutes}分`.slice(0, 8), rect.x + 46, y + 38);

    ctx.fillStyle = "rgba(255, 253, 245, 0.72)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 9, y + 50, rect.width - 18, 14, 7);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.font = "800 8.5px Microsoft YaHei";
    ctx.fillText("年路小站 · 可点", rect.x + 18, y + 60);

    if (!reducedMotion) {
      ctx.fillStyle = active ? "rgba(246, 240, 182, 0.92)" : "rgba(246, 240, 182, 0.54)";
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 13 + Math.sin(motion * 2 + station.order) * 2, y + 12, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawYearOneRhythmWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.stage) return false;
  const { rect, stage, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.28) * 2;
  const palettes = {
    ready: { accent: "#286f58", soft: "rgba(237, 243, 223, 0.96)", glow: "rgba(40, 111, 88, 0.2)" },
    soon: { accent: "#be4f37", soft: "rgba(255, 248, 232, 0.97)", glow: "rgba(190, 79, 55, 0.18)" },
    late: { accent: "#a55666", soft: "rgba(255, 244, 240, 0.97)", glow: "rgba(165, 86, 102, 0.2)" },
    steady: { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(224, 182, 109, 0.18)" },
  };
  const palette = palettes[spec.urgency] || palettes.steady;
  const cardY = rect.y + bob;
  const progressWidth = rect.width - 122;
  const progressRatio = Math.max(0, Math.min(1, stage.progressPercent / 100));

  ctx.save();
  ctx.strokeStyle = active ? `${palette.accent}dd` : `${palette.accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width * 0.52, cardY - 42, rect.x + rect.width * 0.42, cardY + 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.ellipse(rect.x + 52, cardY + 70, 58, 70, -0.12, 0, Math.PI * 2);
  ctx.fill();
  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.soft);
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  const dialX = rect.x + 52;
  const dialY = cardY + 66;
  ctx.strokeStyle = "rgba(143, 95, 63, 0.24)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(dialX, dialY, 34, -Math.PI / 2, Math.PI * 1.5);
  ctx.stroke();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(dialX, dialY, 34, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progressRatio);
  ctx.stroke();
  stage.stageDefs.forEach((entry, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(1, stage.stageDefs.length);
    const px = dialX + Math.cos(angle) * 34;
    const py = dialY + Math.sin(angle) * 34;
    ctx.fillStyle = index < stage.index ? "#286f58" : index === stage.index ? palette.accent : "rgba(143, 95, 63, 0.42)";
    ctx.beginPath();
    ctx.arc(px, py, index === stage.index ? 5.5 : 4.2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = palette.accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("年", dialX - 9, dialY + 6);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${stage.index + 1}/${stage.totalStages}`, dialX - 10, dialY + 22);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(`${spec.title} · ${stage.acceptance}`, rect.x + 96, cardY + 26);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${stage.shortTitle} · ${stage.headline}`.slice(0, 20), rect.x + 96, cardY + 50);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(stage.promise.slice(0, 33), rect.x + 96, cardY + 68);

  ctx.fillStyle = "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 96, cardY + 80, progressWidth, 8, 4);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 96, cardY + 80, Math.max(12, progressWidth * progressRatio), 8, 4);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(`${stage.tempoLabel} · 验收 ${stage.doneCount}/${stage.total}`, rect.x + 96, cardY + 102);

  const rowStart = cardY + 122;
  spec.rows.slice(0, 3).forEach((row, index) => {
    const rowY = rowStart + index * 18;
    if (rowY > cardY + rect.height - 10) return;
    const rowAccent = row.done ? "#286f58" : index === 0 ? palette.accent : "#8f5f3f";
    ctx.fillStyle = row.done ? "rgba(202, 235, 210, 0.62)" : "rgba(255, 253, 245, 0.74)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 18, rowY - 13, rect.width - 36, 16, 8);
    ctx.fill();
    ctx.fillStyle = rowAccent;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(row.done ? "已备" : "缺口", rect.x + 30, rowY - 2);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(row.label.slice(0, 14), rect.x + 72, rowY - 2);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText((row.done ? "可验收" : row.hint).slice(0, 18), rect.x + 168, rowY - 2);
  });

  ctx.fillStyle = active ? "rgba(246, 240, 182, 0.92)" : "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 88, cardY + 13, 72, 20, 10);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 8), rect.x + rect.width - 78, cardY + 27);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(246, 240, 182, 0.9)" : "rgba(246, 240, 182, 0.58)";
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + 34 + i * 16, cardY + rect.height + 4 + Math.sin(motion * 2 + i) * 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawYearOneRhythmStampWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const accent = spec.readyCount > 0 ? "#b47d2f" : spec.claimedCount > 0 ? "#286f58" : "#8f5f3f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.34) * 1.5;

  ctx.save();
  ctx.fillStyle = "rgba(23, 35, 29, 0.14)";
  ctx.beginPath();
  ctx.ellipse(rect.x + rect.width * 0.5, rect.y + rect.height + 6, rect.width * 0.42, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.9)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.6 : 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + bob + 1, rect.width - 2, rect.height - 2, 16);
  ctx.stroke();

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("首年阶段印记台", rect.x + 16, rect.y + 22 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`已盖 ${spec.claimedCount}/${spec.checkpoints.length} · ${spec.cta}`, rect.x + 16, rect.y + 40 + bob);

  const startX = rect.x + 18;
  const stampY = rect.y + 58 + bob;
  spec.checkpoints.forEach((checkpoint, index) => {
    const cx = startX + index * 48;
    const ready = checkpoint.ready && !checkpoint.claimed;
    const claimed = checkpoint.claimed;
    const current = checkpoint.id === spec.current.id;
    const stampAccent = claimed ? "#286f58" : ready ? "#b47d2f" : current ? "#be4f37" : "rgba(143, 95, 63, 0.42)";
    ctx.fillStyle = claimed ? "rgba(202, 235, 210, 0.82)" : ready ? "rgba(246, 240, 182, 0.74)" : "rgba(255, 253, 245, 0.68)";
    ctx.beginPath();
    ctx.roundRect(cx, stampY - 15, 34, 28, 9);
    ctx.fill();
    ctx.strokeStyle = stampAccent;
    ctx.lineWidth = ready || current || claimed ? 2 : 1;
    ctx.stroke();
    ctx.fillStyle = stampAccent;
    ctx.font = "900 12px Microsoft YaHei";
    ctx.fillText(claimed ? "印" : ready ? "盖" : String(index + 1), cx + 10, stampY + 4);
    if (ready && !reducedMotion) {
      ctx.fillStyle = "rgba(246, 240, 182, 0.82)";
      ctx.beginPath();
      ctx.arc(cx + 28, stampY - 10 + Math.sin(motion * 3 + index) * 1.8, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 70, rect.y + 16 + bob, 50, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 4), rect.x + rect.width - 60, rect.y + 31 + bob);
  ctx.restore();
  return true;
}

export function drawYearOneRhythmStampLandmarksWorld({
  ctx,
  specs = [],
  motion = 0,
  reducedMotion = false,
  focusedKey = "",
} = {}) {
  if (!ctx || !specs.length) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.8) * 3;

  ctx.save();
  specs.forEach((mark, index) => {
    const localPulse = pulse + index * 0.8;
    const focused = focusedKey === mark.key;
    ctx.fillStyle = mark.soft;
    ctx.beginPath();
    ctx.ellipse(mark.x + 22, mark.y + 30, 44 + localPulse, 18 + localPulse * 0.24, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `${mark.accent}88`;
    ctx.lineWidth = focused ? 3.2 : 2;
    ctx.setLineDash([7, 6]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
    ctx.beginPath();
    ctx.arc(mark.x + 22, mark.y + 20, (focused ? 24 : 20) + Math.max(0, localPulse * 0.45), 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = mark.accent;
    ctx.beginPath();
    ctx.roundRect(mark.x + 4, mark.y + 3, 36, 34, 10);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 15px Microsoft YaHei";
    ctx.fillText(mark.glyph, mark.x + 14, mark.y + 26);
    ctx.fillStyle = "rgba(255, 248, 232, 0.88)";
    ctx.beginPath();
    ctx.roundRect(mark.x + 44, mark.y + 4, 72, 30, 12);
    ctx.fill();
    ctx.fillStyle = mark.accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(mark.line, mark.x + 52, mark.y + 23);
    if (!reducedMotion) {
      ctx.fillStyle = "rgba(246, 240, 182, 0.72)";
      for (let mote = 0; mote < 3; mote += 1) {
        ctx.beginPath();
        ctx.arc(mark.x + 16 + mote * 18, mark.y - 4 + Math.sin(motion * 2.4 + mote + index) * 4, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  if (specs.length >= 2) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.24)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 9]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 18;
    ctx.beginPath();
    specs.forEach((mark, index) => {
      if (index === 0) ctx.moveTo(mark.x + 24, mark.y + 20);
      else ctx.lineTo(mark.x + 24, mark.y + 20);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
  return true;
}

export function drawBuiltStructuresWorld({
  ctx,
  slots = [],
  builtBuildingIds = null,
  reducedMotion = false,
  newlyBuiltId = "",
  newlyBuiltAt = 0,
  now = 0,
  chapter4FinalArrayBuilt = false,
  chapter4FinalArrayBuildingId = "",
  spiritManorBuildingId = "",
  drawBuiltStructureIcon = () => {},
  drawFinalArrayMonument = () => {},
} = {}) {
  if (!ctx || !slots.length || !builtBuildingIds) return false;
  for (const slot of slots) {
    if (slot.id !== "build_house_start" && !builtBuildingIds.has(slot.id)) continue;
    if (slot.id === "build_fishpond_lv1" || slot.id === spiritManorBuildingId) continue;
    const pulse = newlyBuiltId === slot.id ? Math.max(0, 1 - (now - Number(newlyBuiltAt || 0)) / 2200) : 0;
    if (pulse > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(246, 240, 182, ${0.2 * pulse})`;
      ctx.beginPath();
      ctx.ellipse(slot.x + 46, slot.y + 58, 86 + pulse * 28, 42 + pulse * 14, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    drawBuiltStructureIcon(ctx, slot.id, slot.x, slot.y, slot.color, slot.accent, slot);
  }
  if (chapter4FinalArrayBuilt && chapter4FinalArrayBuildingId) drawFinalArrayMonument(ctx, "built");
  return true;
}

export function drawOrderBuildPrepBlueprintWorld({
  ctx,
  target = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawBuiltStructureIcon = () => {},
} = {}) {
  if (!ctx || !target?.top) return false;
  const { top } = target;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 3.5;
  const ready = top.buildReady;
  const accent = ready ? "#b47d2f" : "#4f6f8f";
  const soft = ready ? "rgba(224, 182, 109, 0.22)" : "rgba(79, 111, 143, 0.2)";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.55 + target.x) * 1.6;
  const x = target.x;
  const y = target.y + bob;

  ctx.save();
  ctx.fillStyle = soft;
  ctx.beginPath();
  ctx.ellipse(x + 48, y + 78, 82 + pulse, 28 + pulse * 0.28, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = ready ? "rgba(224, 182, 109, 0.9)" : "rgba(79, 111, 143, 0.82)";
  ctx.lineWidth = 2.8;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.roundRect(x - 8, y + 20, 116, 78, 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + 92);
  ctx.lineTo(x + 50, y + 36);
  ctx.lineTo(x + 104, y + 92);
  ctx.moveTo(x + 20, y + 58);
  ctx.lineTo(x + 86, y + 58);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.globalAlpha = 0.34;
  drawBuiltStructureIcon(ctx, target.id, x, y, target.color, target.accent, target);
  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 90, 96, 20, 10);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(ready ? "材料已齐 · 可建" : "订单需建 · 缺料", x + 16, y + 104);

  for (let index = 0; index < 4; index += 1) {
    const pileX = x + 12 + index * 20;
    const pileY = y + 76 - (index % 2) * 5;
    ctx.fillStyle = index % 2 ? "#d8b56f" : "#8f7b5d";
    ctx.beginPath();
    ctx.roundRect(pileX, pileY, 15, 10, 3);
    ctx.fill();
  }

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(x + 100, y + 18, 17 + pulse * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText((target.badge || "坊").slice(0, 1), x + 96, y + 23);

  drawCanvasCard(ctx, x - 14, y - 44, 154, 42, ready ? "rgba(255, 248, 232, 0.92)" : "rgba(235, 248, 255, 0.9)");
  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("订单工坊蓝图", x + 2, y - 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(`${top.buildingLabel} · ${top.machineLabel}`.slice(0, 16), x + 2, y - 9);
  ctx.restore();
  return true;
}

export function drawSpiritManorSiteWorld({
  ctx,
  livingState = null,
  motion = 0,
  reducedMotion = false,
  spiritManorBuildingId = "",
  drawBuiltStructureIcon = () => {},
} = {}) {
  if (!ctx || !livingState?.spiritManorReady) return false;
  const built = livingState.spiritManorBuilt;
  const x = 316;
  const y = 154;
  ctx.save();

  if (!built) {
    const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 0.08 + 0.18;
    ctx.fillStyle = `rgba(224, 182, 109, ${0.16 + pulse})`;
    ctx.beginPath();
    ctx.ellipse(x + 120, y + 126, 118, 28, -0.03, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#b47d2f";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(x + 12, y + 20, 212, 102);
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(143, 95, 63, 0.8)";
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 112);
    ctx.lineTo(x + 54, y + 40);
    ctx.lineTo(x + 190, y + 40);
    ctx.lineTo(x + 224, y + 112);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
    ctx.fillRect(x + 142, y - 12, 112, 44);
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText("阿檀蓝图", x + 156, y + 6);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText("百怪大院待建", x + 156, y + 24);
    ctx.restore();
    return true;
  }

  drawBuiltStructureIcon(ctx, spiritManorBuildingId, x + 70, y + 8, "#9a7042", "#e0b66d");
  ctx.fillStyle = "rgba(255, 248, 232, 0.86)";
  ctx.fillRect(x + 116, y - 8, 136, 48);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText("百怪大院", x + 132, y + 10);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("宿舍与岗位已接通", x + 132, y + 28);
  ctx.restore();
  return true;
}

export function drawPondLifeWorld({
  ctx,
  livingState = null,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !livingState?.pondBuilt) return false;
  const centerX = 902;
  const centerY = 408;
  const pondLevel = Number(livingState.pondWaterLevel ?? 1);
  const pondLabel = livingState.pondWaterLabel || "平水";
  const waterWidth = pondLevel === 0 ? 68 : pondLevel === 2 ? 78 : 74;
  const waterHeight = pondLevel === 0 ? 28 : pondLevel === 2 ? 38 : 33;
  const waterY = centerY + (pondLevel === 0 ? 7 : pondLevel === 2 ? -2 : 2);
  const waterColors = pondLevel === 0
    ? ["#ccd6b6", "#8da38a", "#556c69"]
    : pondLevel === 2
      ? ["#b8ece1", "#78c3bb", "#3b747d"]
      : ["#9fd7cb", "#63a4a1", "#3e6e73"];

  ctx.save();
  ctx.fillStyle = "rgba(43, 69, 79, 0.14)";
  ctx.beginPath();
  ctx.ellipse(centerX + 4, centerY + 16, 86, 42, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(124, 93, 67, 0.18)";
  ctx.beginPath();
  ctx.ellipse(centerX - 6, centerY + 8, 66, 22, -0.08, 0, Math.PI * 2);
  ctx.fill();

  const pondGradient = ctx.createLinearGradient(centerX, waterY - 44, centerX, waterY + 46);
  pondGradient.addColorStop(0, waterColors[0]);
  pondGradient.addColorStop(0.52, waterColors[1]);
  pondGradient.addColorStop(1, waterColors[2]);
  ctx.fillStyle = pondGradient;
  ctx.beginPath();
  ctx.ellipse(centerX, waterY, waterWidth, waterHeight, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(223, 247, 238, 0.42)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(centerX, waterY, waterWidth, waterHeight, -0.08, Math.PI * 0.15, Math.PI * 1.12);
  ctx.stroke();

  for (let index = 0; index < 3; index += 1) {
    const pulse = (motion + index * 0.8) % 2.8;
    const radius = 8 + pulse * (pondLevel === 2 ? 9 : 7);
    const alpha = Math.max(0, 0.22 - pulse * 0.06);
    ctx.strokeStyle = `rgba(223, 247, 238, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX - 18 + index * 20, waterY - 2 + (index % 2) * 10, radius, Math.max(4, radius * 0.38), -0.12, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "#4f8278";
  const reedBaseY = waterY + waterHeight - 12;
  for (let index = 0; index < 5; index += 1) {
    const reedX = centerX - 70 + index * 28;
    const sway = reducedMotion ? 0 : Math.sin(motion * 1.4 + index) * 4;
    ctx.fillRect(reedX, reedBaseY, 4, 18);
    ctx.beginPath();
    ctx.moveTo(reedX + 2, reedBaseY);
    ctx.quadraticCurveTo(reedX + sway, reedBaseY - 10, reedX + 10 + sway, reedBaseY - 26);
    ctx.lineTo(reedX + 6 + sway, reedBaseY - 26);
    ctx.quadraticCurveTo(reedX + sway * 0.2, reedBaseY - 12, reedX - 2, reedBaseY);
    ctx.fill();
  }

  if (livingState.pondLastCatch) {
    ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
    const fishCount = Math.min(2, Number(livingState.pondLastCatch.count || 1));
    for (let index = 0; index < fishCount; index += 1) {
      const fishX = centerX - 16 + index * 26;
      const fishY = waterY - 6 + Math.sin(motion * 1.8 + index) * 4;
      ctx.beginPath();
      ctx.ellipse(fishX, fishY, 8, 4, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fishX - 8, fishY);
      ctx.lineTo(fishX - 14, fishY - 4);
      ctx.lineTo(fishX - 14, fishY + 4);
      ctx.closePath();
      ctx.fill();
    }
  }

  if (livingState.pondLotusStage && livingState.pondLotusStage !== "none") {
    const pads = [
      { x: centerX - 30, y: waterY + 8, r: 10 },
      { x: centerX + 12, y: waterY + 12, r: 9 },
      { x: centerX + 26, y: waterY - 3, r: 8 },
    ];
    for (const pad of pads) {
      ctx.fillStyle = "rgba(79, 130, 120, 0.92)";
      ctx.beginPath();
      ctx.arc(pad.x, pad.y, pad.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(223, 247, 238, 0.28)";
      ctx.beginPath();
      ctx.moveTo(pad.x, pad.y);
      ctx.arc(pad.x, pad.y, pad.r - 1.5, -0.3, 0.72);
      ctx.closePath();
      ctx.fill();
    }
    const lotusX = centerX - 4;
    const lotusY = waterY - 10;
    if (livingState.pondLotusStage === "bud") {
      ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
      ctx.beginPath();
      ctx.ellipse(lotusX, lotusY, 5, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(159, 209, 223, 0.24)";
      ctx.beginPath();
      ctx.arc(lotusX, lotusY, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(159, 209, 223, 0.22)";
      ctx.beginPath();
      ctx.arc(lotusX, lotusY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fffdf5";
      for (let index = 0; index < 6; index += 1) {
        const angle = (Math.PI * 2 * index) / 6;
        ctx.beginPath();
        ctx.ellipse(lotusX + Math.cos(angle) * 5, lotusY + Math.sin(angle) * 4, 3.8, 7, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#e6c65e";
      ctx.beginPath();
      ctx.arc(lotusX, lotusY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      for (let index = 0; index < 3; index += 1) {
        const glintX = centerX + 22 + index * 10;
        const glintY = waterY - 18 + Math.sin(motion * 1.2 + index) * 6;
        ctx.fillStyle = `rgba(255, 253, 245, ${0.52 - index * 0.08})`;
        ctx.beginPath();
        ctx.arc(glintX, glintY, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  if (livingState.pondHasYuelianSpirit) {
    const spiritX = centerX + 34 + Math.sin(motion * 0.8) * 5;
    const spiritY = waterY - 36 + Math.cos(motion * 1.1) * 4;
    ctx.fillStyle = "rgba(159, 209, 223, 0.2)";
    ctx.beginPath();
    ctx.arc(spiritX, spiritY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.beginPath();
    ctx.ellipse(spiritX, spiritY, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(159, 209, 223, 0.72)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(spiritX - 3, spiritY + 8);
    ctx.quadraticCurveTo(spiritX - 9, spiritY + 18, spiritX - 2, spiritY + 22);
    ctx.moveTo(spiritX + 3, spiritY + 8);
    ctx.quadraticCurveTo(spiritX + 9, spiritY + 18, spiritX + 1, spiritY + 22);
    ctx.stroke();
  }

  if (livingState.pondYuelianRestActive) {
    ctx.fillStyle = "rgba(255, 253, 245, 0.5)";
    ctx.beginPath();
    ctx.ellipse(centerX - 46, waterY - 28, 24, 8, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(159, 209, 223, 0.66)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX - 46, waterY - 28, 28, 11, -0.18, Math.PI * 0.1, Math.PI * 1.1);
    ctx.stroke();
    for (let index = 0; index < 4; index += 1) {
      ctx.fillStyle = `rgba(255, 253, 245, ${0.62 - index * 0.08})`;
      ctx.beginPath();
      ctx.arc(centerX - 58 + index * 8, waterY - 32 + Math.sin(motion + index) * 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (livingState.pondMoonPondActive) {
    ctx.strokeStyle = "rgba(255, 253, 245, 0.78)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX + 50, waterY - 40, 16, Math.PI * 0.18, Math.PI * 1.82);
    ctx.stroke();
    ctx.fillStyle = "rgba(159, 209, 223, 0.2)";
    ctx.beginPath();
    ctx.arc(centerX + 50, waterY - 40, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  if (livingState.hasFishingNet) {
    ctx.strokeStyle = "#8f5f3f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX + 58, waterY - 26);
    ctx.lineTo(centerX + 80, waterY - 60);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 253, 245, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX + 54, waterY - 20, 12, 10, 0.1, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "#17231d";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(`${livingState.pondFirstCatchDone ? "灵池有鱼" : "灵池浅塘"} · ${pondLabel}`, centerX - 52, centerY + 56);
  if (livingState.pondWaterControlUnlocked) {
    ctx.fillStyle = "rgba(23, 35, 29, 0.76)";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText(
      livingState.pondMoonPondActive
        ? "无月之月已经落成"
        : livingState.pondYuelianRestActive
          ? "凝露莲席正在收露"
          : livingState.pondLotusStage !== "none"
            ? livingState.pondLotusText
            : livingState.pondWaterMastery
              ? "稳水看口"
              : "已学会调水",
      centerX - 42,
      centerY + 72,
    );
  }
  ctx.restore();
  return true;
}

export function worldLandmarkTargetsWorld({
  livingState = null,
  finalArrayVisible = false,
  finalArrayBuilt = false,
  grid = null,
} = {}) {
  if (!livingState) return [];
  const targets = [];

  if (livingState.spiritManorReady) {
    const x = 316;
    const y = 154;
    targets.push({
      id: livingState.spiritManorBuilt ? "spirit_manor_built" : "spirit_manor_plan",
      type: "spirit_manor",
      built: livingState.spiritManorBuilt,
      label: livingState.spiritManorBuilt ? "百怪大院" : "百怪大院蓝图",
      rect: livingState.spiritManorBuilt
        ? { x: x + 56, y: y - 6, width: 214, height: 136 }
        : { x: x + 4, y: y - 18, width: 258, height: 176 },
    });
  }

  if (livingState.pondBuilt) {
    const centerX = 902;
    const centerY = 408;
    targets.push({
      id: "pond_life",
      type: "pond",
      label: livingState.pondFirstCatchDone ? "灵池有鱼" : "灵池浅塘",
      rect: { x: centerX - 92, y: centerY - 76, width: 190, height: 164 },
    });
  }

  if (finalArrayVisible && grid) {
    const centerX = grid.originX + (grid.cols * grid.tile + (grid.cols - 1) * grid.gap) / 2;
    const stelaX = centerX + grid.cols * (grid.tile + grid.gap) * 0.42;
    const stelaY = grid.originY - 12;
    targets.push({
      id: "final_array_monument",
      type: "final_array",
      built: finalArrayBuilt,
      label: finalArrayBuilt ? "二十四节气大阵" : "终阵碑",
      rect: { x: stelaX - 8, y: stelaY - 10, width: 84, height: 132 },
    });
  }

  return targets;
}

export function worldLandmarkAtCanvasPointWorld(px, py, targets = []) {
  return (targets || [])
    .slice()
    .reverse()
    .find(({ rect }) => (
      px >= rect.x
      && px <= rect.x + rect.width
      && py >= rect.y
      && py <= rect.y + rect.height
    )) || null;
}

export function worldLandmarkFocusSpecWorld({
  target = null,
  spiritCount = 0,
  spiritSelector = "#spiritList",
  spiritManorBuildSelector = "",
  spiritManorReady = false,
  spiritManorMissing = "",
  pondSelector = '[data-pond-action="catch"]',
  pondWaterStatus = "",
  pondReady = false,
  pondLotusText = "",
  finalArrayBuildSelector = "",
  finalArrayBuilt = false,
  finalArrayBuildingName = "",
  finalArrayBuildReady = false,
  finalArrayCostText = "",
  finalArrayBanquetComplete = false,
} = {}) {
  if (!target) return null;

  if (target.type === "spirit_manor") {
    if (target.built) {
      return {
        selector: spiritSelector,
        fallbackSelector: "#spiritList",
        label: `点选景物：${target.label}`,
        log: spiritCount > 0
          ? `${target.label} 已经住进 ${spiritCount} 只精怪。先看伙伴栏里的岗位、心情和生活事件，把宿舍真正转成长期运转。`
          : `${target.label} 已经立起，接下来可以在伙伴栏继续接入新的精怪、岗位和日常陪伴。`,
        missingTitle: "点选景物：百怪大院",
        missingLog: "精怪伙伴栏暂时没有找到，先确认上方伙伴区是否正常显示。",
      };
    }
    return {
      selector: spiritManorBuildSelector,
      fallbackSelector: ".build-panel",
      label: `点选景物：${target.label}`,
      log: `${target.label} 已在建设面板高亮。${spiritManorReady ? "材料已经齐备，阿檀的榫卯线可以直接落成。" : `${spiritManorMissing ? `还差 ${spiritManorMissing}。` : "还需要先补齐材料。"}建成后会把岗位总览、宿舍分配和情绪管理一起接上。`}`,
      panelGroup: "systems",
      missingTitle: "点选景物：百怪大院蓝图",
      missingLog: "百怪大院蓝图入口暂时没有找到，先确认系统深挖分组是否可见。",
    };
  }

  if (target.type === "pond") {
    return {
      selector: pondSelector,
      fallbackSelector: ".build-panel",
      label: `点选景物：${target.label}`,
      log: `${target.label} 已在建设面板高亮。当前 ${pondWaterStatus}。${pondReady ? "今天可以试网捞鱼。" : "今天已经试过一网，明天再来看水口。"}${pondLotusText ? ` ${pondLotusText}，静池生态已经开始留下长期画面。` : ""}`,
      panelGroup: "systems",
      missingTitle: "点选景物：灵池",
      missingLog: "灵池对应的调水入口暂时没有找到，先确认系统深挖分组是否可见。",
    };
  }

  if (target.type === "final_array") {
    if (!finalArrayBuilt) {
      return {
        selector: finalArrayBuildSelector,
        fallbackSelector: "#finalSupportPanel",
        label: `点选景物：${target.label}`,
        log: finalArrayBuildingName
          ? `${finalArrayBuildingName} 已在建设面板高亮。${finalArrayBuildReady ? "阵材已齐，可以开始搭阵。" : `还差材料：${finalArrayCostText}。`}`
          : "终阵碑已经显影，接下来去终章支援和建设面板把阵台真正搭起来。",
        panelGroup: "systems",
        missingTitle: "点选景物：终阵碑",
        missingLog: "终阵碑对应入口暂时没有找到，先确认系统深挖分组是否可见。",
      };
    }
    return finalArrayBanquetComplete
      ? {
        selector: "#goalBookPanel",
        label: `点选景物：${target.label}`,
        log: "终阵已经把主线托进新的年册。去目标册接第二年目标、长期收藏和自由造景下一步。",
        panelGroup: "core",
        missingTitle: "点选景物：二十四节气大阵",
        missingLog: "目标册暂时没有找到，先确认核心试玩分组是否可见。",
      }
      : {
        selector: "#finalSupportPanel",
        fallbackSelector: ".build-panel",
        label: `点选景物：${target.label}`,
        log: "终阵碑已在终章支援面板落点。先看还有哪几路关系线、建设线和经营线可以继续压进阵脚。",
        panelGroup: "systems",
        missingTitle: "点选景物：二十四节气大阵",
        missingLog: "终章支援面板暂时没有找到，先确认系统深挖分组是否可见。",
      };
  }

  return null;
}
