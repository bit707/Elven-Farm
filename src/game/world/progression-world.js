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
