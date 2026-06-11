export function drawCanalRestorationRouteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  pointOnPolyline = () => ({ x: 0, y: 0 }),
} = {}) {
  if (!ctx || !spec?.rect || !spec.waterPlots?.length) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 3;
  const canalStart = { x: 792, y: 186 };
  const bend = { x: 650, y: 324 };

  ctx.save();

  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.82)" : "rgba(77, 145, 166, 0.52)";
  ctx.lineWidth = active ? 4 : 3;
  ctx.setLineDash([10, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 18;
  spec.waterPlots.forEach((plot, index) => {
    ctx.beginPath();
    ctx.moveTo(canalStart.x, canalStart.y);
    ctx.bezierCurveTo(
      bend.x - index * 9,
      bend.y + index * 6,
      plot.screenX + 46,
      plot.screenY - 46,
      plot.screenX,
      plot.screenY,
    );
    ctx.stroke();
  });
  ctx.setLineDash([]);

  spec.waterPlots.forEach((plot, index) => {
    const localPulse = pulse + index * 0.7;
    ctx.fillStyle = plot.planted
      ? "rgba(202, 235, 210, 0.34)"
      : plot.newlyExpanded
        ? "rgba(159, 209, 223, 0.34)"
        : "rgba(255, 253, 245, 0.22)";
    ctx.beginPath();
    ctx.ellipse(plot.screenX, plot.screenY + 10, 26 + localPulse, 9 + localPulse * 0.25, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = plot.planted ? "rgba(40, 111, 88, 0.66)" : "rgba(255, 253, 245, 0.62)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(plot.screenX, plot.screenY - 2, plot.newlyExpanded ? 11 + Math.max(0, localPulse * 0.4) : 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = plot.planted ? "#286f58" : "#4d91a6";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(plot.planted ? "种" : "水", plot.screenX - 5, plot.screenY + 2);
  });

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(236, 248, 243, 0.92)");
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.92)" : "rgba(77, 145, 166, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + pulse, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(159, 209, 223, 0.26)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 54, 54, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.72)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.ellipse(rect.x + 41, rect.y + 45 + pulse, 20, 6, -0.1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("渠", rect.x + 30, rect.y + 47 + pulse);

  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 82, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 82, rect.y + 47 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 82, rect.y + 65 + pulse);

  const stats = [
    { label: "新水田", value: `+${spec.expandedCount}` },
    { label: "已种", value: `${spec.plantedCount}` },
    { label: "待种", value: `${spec.openCount}` },
  ];
  stats.forEach((row, index) => {
    const x = rect.x + 18 + index * 82;
    const y = rect.y + 78 + pulse;
    ctx.fillStyle = index === 2 && spec.openCount > 0 ? "rgba(255, 248, 232, 0.86)" : "rgba(255, 253, 245, 0.78)";
    ctx.beginPath();
    ctx.roundRect(x, y, 72, 18, 9);
    ctx.fill();
    ctx.fillStyle = index === 1 ? "#286f58" : "#4d91a6";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(row.label, x + 7, y + 12);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(row.value, x + 45, y + 12);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.8)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + rect.height - 20 + pulse, rect.width - 36, 15, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 36), rect.x + 28, rect.y + rect.height - 10 + pulse);

  if (!reducedMotion) {
    ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
    for (let i = 0; i < 6; i += 1) {
      const bead = pointOnPolyline([canalStart, bend, spec.waterPlots[i % spec.waterPlots.length]], (motion * 0.1 + i / 6) % 1);
      ctx.beginPath();
      ctx.arc(bead.x, bead.y - 8 + Math.sin(motion * 2 + i) * 3, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawCanalPermanentFlowWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.8) * 2.4;
  const accent = spec.tone === "done" ? "#286f58" : spec.tone === "active" ? "#4d91a6" : "#b47d2f";

  ctx.save();
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.9)" : "rgba(77, 145, 166, 0.5)";
  ctx.lineWidth = active ? 4 : 3;
  ctx.setLineDash([12, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(792, 186);
  ctx.bezierCurveTo(724, 226 + pulse, 690, 264 + pulse, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  spec.waterPlots.forEach((plot, index) => {
    const shimmer = reducedMotion ? 0 : Math.sin(motion * 2 + index * 0.5) * 2;
    ctx.fillStyle = plot.planted ? "rgba(202, 235, 210, 0.3)" : "rgba(159, 209, 223, 0.26)";
    ctx.beginPath();
    ctx.ellipse(plot.screenX, plot.screenY + shimmer, plot.planted ? 18 : 22, plot.planted ? 7 : 9, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = plot.planted ? "rgba(40, 111, 88, 0.58)" : "rgba(255, 253, 245, 0.56)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(plot.screenX, plot.screenY - 4 + shimmer * 0.3, plot.newlyExpanded ? 8 : 6, 0, Math.PI * 2);
    ctx.stroke();
  });

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(236, 248, 243, 0.95)");
  ctx.strokeStyle = active ? accent : `${accent}88`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(159, 209, 223, 0.24)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 56, 56, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.72)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(rect.x + 42, rect.y + 49 + pulse, 21, 7, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("脉", rect.x + 30, rect.y + 48 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 16), rect.x + 84, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 19), rect.x + 84, rect.y + 47 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 38), rect.x + 84, rect.y + 64 + pulse);

  const stats = [
    { label: "水田", value: spec.totalWaterPlots, color: "#4d91a6" },
    { label: "露珠芹", value: spec.waterCropCount, color: "#286f58" },
    { label: "灵芹菜", value: spec.dishCount, color: "#b47d2f" },
  ];
  stats.forEach((row, index) => {
    const x = rect.x + 18 + index * 86;
    const y = rect.y + 78 + pulse;
    ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
    ctx.strokeStyle = `${row.color}44`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(x, y, 74, 21, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = row.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(row.label, x + 8, y + 13);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(String(row.value), x + 52, y + 13);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 104 + pulse, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(String(spec.mapChangeText || "永久地图变化：新水田已写入地图").slice(0, 42), rect.x + 24, rect.y + 115 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 20 + pulse, rect.width - 32, 15, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(String(spec.acceptanceLine || spec.tomorrowFirstStep || `下一步：${spec.nextAction}`).slice(0, 42), rect.x + 24, rect.y + rect.height - 9 + pulse);
  ctx.restore();
  return true;
}

export function drawCanalExpandedFieldPlaqueWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  tile = 72,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.bounds || !spec.plotMarks?.length) return false;
  const { rect, bounds } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 2.5;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(246, 240, 182, 0.92)" : "rgba(159, 209, 223, 0.64)";
  ctx.lineWidth = active ? 3.4 : 2.2;
  ctx.setLineDash([10, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 9, bounds.minY - 9, bounds.maxX - bounds.minX + 18, bounds.maxY - bounds.minY + 18, 20);
  ctx.stroke();
  ctx.setLineDash([]);

  const glow = ctx.createRadialGradient(bounds.maxX, bounds.minY, 12, bounds.maxX, bounds.minY, 190 + Math.max(0, pulse));
  glow.addColorStop(0, "rgba(159, 209, 223, 0.24)");
  glow.addColorStop(0.48, "rgba(202, 235, 210, 0.12)");
  glow.addColorStop(1, "rgba(202, 235, 210, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(bounds.maxX, bounds.minY, 190 + Math.max(0, pulse), 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.9)" : "rgba(77, 145, 166, 0.5)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 18;
  spec.plotMarks.slice(0, 6).forEach((plot, index) => {
    ctx.beginPath();
    ctx.moveTo(792, 186);
    ctx.bezierCurveTo(706 - index * 8, 272 + index * 5, plot.centerX + 42, plot.centerY - 46, plot.centerX, plot.centerY);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  spec.plotMarks.forEach((plot, index) => {
    const shimmer = reducedMotion ? 0 : Math.sin(motion * 2.1 + index * 0.6) * 2;
    ctx.fillStyle = plot.planted ? "rgba(202, 235, 210, 0.28)" : "rgba(159, 209, 223, 0.24)";
    ctx.beginPath();
    ctx.roundRect(plot.screenX + 6, plot.screenY + 6 + shimmer * 0.2, tile - 12, tile - 12, 13);
    ctx.fill();
    ctx.strokeStyle = plot.newlyExpanded ? "rgba(255, 253, 245, 0.82)" : "rgba(159, 209, 223, 0.58)";
    ctx.lineWidth = plot.newlyExpanded ? 2.2 : 1.5;
    ctx.beginPath();
    ctx.roundRect(plot.screenX + 10, plot.screenY + 10 + shimmer * 0.2, tile - 20, tile - 20, 11);
    ctx.stroke();
    ctx.fillStyle = plot.planted ? "#286f58" : "#4d91a6";
    ctx.beginPath();
    ctx.roundRect(plot.screenX + tile - 26, plot.screenY + 9 + shimmer, 18, 16, 7);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(plot.planted ? "种" : "新", plot.screenX + tile - 21, plot.screenY + 20 + shimmer);
  });

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(236, 248, 243, 0.95)");
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.94)" : "rgba(77, 145, 166, 0.62)";
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + pulse, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(159, 209, 223, 0.25)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 48, 48, 15);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(rect.x + 38, rect.y + 44 + pulse, 18, 6, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("田", rect.x + 27, rect.y + 44 + pulse);

  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 76, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 76, rect.y + 44 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 76, rect.y + 61 + pulse);

  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(String(spec.mapEvidenceText || "新水田已写入地图").slice(0, 42), rect.x + 76, rect.y + 78 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 22 + pulse, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(String(spec.acceptanceLine || spec.tomorrowFirstStep || spec.memoryText).slice(0, 42), rect.x + 25, rect.y + rect.height - 11 + pulse);
  ctx.restore();
  return true;
}

export function drawCanalTomorrowGoalSignWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = 0,
  pulse = 0,
  plot = null,
  targetX = 0,
  targetY = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;

  ctx.save();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.66)";
  ctx.lineWidth = 2.2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 28, rect.y + rect.height + pulse - 6);
  ctx.quadraticCurveTo(rect.x + rect.width + 34, rect.y + rect.height + 34, targetX, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  const tile = plot?.tile || 72;
  ctx.fillStyle = "rgba(159, 209, 223, 0.2)";
  ctx.beginPath();
  ctx.ellipse(targetX, targetY + tile * 0.2, tile * 0.6 + pulse, tile * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(236, 248, 243, 0.94)");
  ctx.strokeStyle = "rgba(77, 145, 166, 0.76)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 14 + pulse, 42, 42, 15);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.78)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(rect.x + 33, rect.y + 42 + pulse, 16 + pulse, 5, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("渠", rect.x + 23, rect.y + 39 + pulse);

  ctx.fillStyle = "#286f58";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(String(spec.title || "").slice(0, 13), rect.x + 66, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(String(spec.headline || "").slice(0, 12), rect.x + 66, rect.y + 43 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(String(spec.detail || "").slice(0, 20), rect.x + 66, rect.y + 62 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.76)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 63 + pulse, rect.width - 28, 18, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(String(spec.routeText || "").slice(0, 25), rect.x + 24, rect.y + 76 + pulse);
  ctx.fillStyle = "#4d91a6";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(String(spec.mapChangeText || "永久地图变化：新水田已写入地图").slice(0, 27), rect.x + 24, rect.y + 94 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 8px Microsoft YaHei";
  ctx.fillText(String(spec.acceptanceLine || spec.safeNote || "只定位明日目标，不会自动执行").slice(0, 34), rect.x + 24, rect.y + 104 + pulse);
  ctx.restore();
  return true;
}

export function drawYuelianCanalClueSignWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = 0,
  pulse = 0,
  lotusX = 0,
  lotusY = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;

  ctx.save();
  ctx.fillStyle = "rgba(159, 209, 223, 0.22)";
  ctx.beginPath();
  ctx.ellipse(lotusX, lotusY, 38.88 + pulse, 12.24, 0, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 6; i += 1) {
    const angle = motion * 0.35 + i * Math.PI / 3;
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.8)" : "rgba(159, 209, 223, 0.78)";
    ctx.beginPath();
    ctx.ellipse(lotusX + Math.cos(angle) * 15, lotusY - 4 + Math.sin(angle) * 8, 5, 12, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(159, 209, 223, 0.74)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(rect.x + 26, rect.y + pulse + 8);
  ctx.quadraticCurveTo(rect.x - 20, rect.y - 16, lotusX, lotusY);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(236, 248, 243, 0.9)");
  ctx.strokeStyle = "rgba(159, 209, 223, 0.78)";
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(159, 209, 223, 0.24)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 13 + pulse, 38, 38, 14);
  ctx.fill();
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("莲", rect.x + 22, rect.y + 39 + pulse);

  ctx.fillStyle = "#286f58";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(String(spec.title || "").slice(0, 12), rect.x + 62, rect.y + 21 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(String(spec.headline || "").slice(0, 11), rect.x + 62, rect.y + 40 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(String(spec.detail || "").slice(0, 14), rect.x + 62, rect.y + 57 + pulse);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(String(spec.hint || "").slice(0, 22), rect.x + 16, rect.y + 69 + pulse);
  ctx.restore();
  return true;
}

export function drawQingheWaterTasteNoteWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = 0,
  pulse = 0,
  pondX = 662,
  pondY = 520,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;

  ctx.save();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.58)";
  ctx.lineWidth = 2.1;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(rect.x + 42, rect.y + rect.height + pulse - 4);
  ctx.quadraticCurveTo(rect.x + 28, rect.y + rect.height + 82, pondX, pondY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(159, 209, 223, 0.18)";
  ctx.beginPath();
  ctx.ellipse(pondX, pondY, 82 + pulse, 27, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.48)";
  ctx.lineWidth = 1.7;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(pondX, pondY, 34 + i * 18 + pulse, 9 + i * 4, -0.08, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(248, 252, 247, 0.94)");
  ctx.strokeStyle = spec.accepted ? "rgba(40, 111, 88, 0.68)" : "rgba(77, 145, 166, 0.72)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 14 + pulse, 44, 44, 15);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.76)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(rect.x + 34, rect.y + 44 + pulse, 17 + pulse * 0.2, 5.5, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = spec.accepted ? "#286f58" : "#4d91a6";
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText("青", rect.x + 24, rect.y + 40 + pulse);

  ctx.fillStyle = spec.accepted ? "#286f58" : "#4d91a6";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(String(spec.title || "").slice(0, 13), rect.x + 68, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(String(spec.headline || "").slice(0, 12), rect.x + 68, rect.y + 43 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(String(spec.detail || "").slice(0, 23), rect.x + 68, rect.y + 62 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.76)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 69 + pulse, rect.width - 28, 18, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.buildingName} · ${spec.firstStepText}`.slice(0, 28), rect.x + 24, rect.y + 82 + pulse);
  ctx.restore();
  return true;
}

export function drawPondOvernightWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.08) * 2.8;
  const colors = {
    built: "#286f58",
    water: "#4d91a6",
    catch: "#b47d2f",
  };

  ctx.save();
  ctx.strokeStyle = active ? "rgba(159, 209, 223, 0.88)" : "rgba(159, 209, 223, 0.52)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 42, rect.y + 20 + pulse);
  ctx.quadraticCurveTo(rect.x + rect.width + 28, rect.y - 18, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 8, 72 + Math.abs(pulse), 20, -0.08, 0, Math.PI * 2);
  ctx.fill();
  if (spec.ready) {
    ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
    ctx.beginPath();
    ctx.ellipse(anchor.x - 18 + Math.sin(motion * 2.4) * 5, anchor.y + 2, 10, 5, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(anchor.x - 28 + Math.sin(motion * 2.4) * 5, anchor.y + 2);
    ctx.lineTo(anchor.x - 36 + Math.sin(motion * 2.4) * 5, anchor.y - 4);
    ctx.lineTo(anchor.x - 36 + Math.sin(motion * 2.4) * 5, anchor.y + 8);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.strokeStyle = "rgba(255, 253, 245, 0.5)";
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(anchor.x, anchor.y + 8, 26 + i * 16 + Math.abs(pulse), 8 + i * 4, -0.08, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(236, 248, 243, 0.94)");
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.9)" : "rgba(77, 145, 166, 0.62)";
  ctx.lineWidth = active ? 2.6 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = spec.ready ? "rgba(202, 235, 210, 0.28)" : "rgba(159, 209, 223, 0.22)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 13, rect.y + 13 + pulse, 46, 46, 15);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "#286f58" : "#4d91a6";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText(spec.ready ? "晨" : "夜", rect.x + 25, rect.y + 42 + pulse);
  ctx.fillStyle = spec.ready ? "#286f58" : "#4d91a6";
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 14), rect.x + 72, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 14), rect.x + 72, rect.y + 43 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 28), rect.x + 72, rect.y + 60 + pulse);

  spec.steps.forEach((step, index) => {
    const x = rect.x + 16 + index * 88;
    const y = rect.y + 70 + pulse;
    const color = colors[step.tone] || "#8f5f3f";
    ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
    ctx.strokeStyle = `${color}55`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(x, y, 78, 20, 9);
    ctx.fill();
    ctx.stroke();
    if (index > 0) {
      ctx.strokeStyle = "rgba(77, 145, 166, 0.34)";
      ctx.beginPath();
      ctx.moveTo(x - 9, y + 10);
      ctx.lineTo(x - 2, y + 10);
      ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 5), x + 7, y + 9);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 7px Microsoft YaHei";
    ctx.fillText(String(step.value || "").slice(0, 8), x + 7, y + 17);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 44), rect.x + 18, rect.y + rect.height - 8 + pulse);
  ctx.restore();
  return true;
}

export function drawCanalSeedRewardRouteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.25) * 2.6;
  const colors = {
    seed: "#b47d2f",
    field: "#4d91a6",
    dish: "#286f58",
  };

  ctx.save();
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.86)" : "rgba(77, 145, 166, 0.52)";
  ctx.lineWidth = active ? 3.2 : 2.2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 28, rect.y + rect.height * 0.5 + pulse);
  ctx.quadraticCurveTo(rect.x + rect.width + 36, rect.y + rect.height + 18, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(159, 209, 223, 0.22)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 10, 44 + Math.abs(pulse), 12, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.64)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 6, 24, 7, -0.08, 0, Math.PI * 2);
  ctx.stroke();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.92)" : "rgba(180, 125, 47, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + pulse, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("种", rect.x + 28, rect.y + 44 + pulse);
  ctx.fillStyle = "#b47d2f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 78, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 78, rect.y + 43 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.detail}`.slice(0, 34), rect.x + 78, rect.y + 59 + pulse);

  spec.steps.forEach((step, index) => {
    const x = rect.x + 18 + index * 94;
    const y = rect.y + 74 + pulse;
    const color = colors[step.tone] || "#8f5f3f";
    ctx.fillStyle = `${color}18`;
    ctx.strokeStyle = `${color}44`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(x, y, 84, 23, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 5), x + 8, y + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(step.value || "").slice(0, 8), x + 8, y + 20);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 18 + pulse, rect.width - 32, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 44), rect.x + 24, rect.y + rect.height - 8 + pulse);
  ctx.restore();
  return true;
}

export function drawLuzhuQinHarvestRouteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  activeAction = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.08) * 2.4;
  const colors = {
    stock: "#4d91a6",
    recipe: "#286f58",
    market: "#b47d2f",
  };

  ctx.save();
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.88)" : "rgba(77, 145, 166, 0.52)";
  ctx.lineWidth = active ? 3.2 : 2;
  ctx.setLineDash([8, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + 40, rect.y - 18, rect.x + 74, rect.y + 26 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(159, 209, 223, 0.24)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 10, 42 + Math.abs(pulse), 12, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.72)";
  ctx.beginPath();
  ctx.arc(anchor.x + 12, anchor.y - 4, 4 + Math.abs(pulse) * 0.25, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(236, 248, 243, 0.96)");
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.92)" : "rgba(77, 145, 166, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + pulse, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("芹", rect.x + 28, rect.y + 44 + pulse);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 78, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 78, rect.y + 44 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(String(spec.detail || "").slice(0, 38), rect.x + 78, rect.y + 60 + pulse);

  spec.steps.forEach((step, index) => {
    const stepRect = step.rect;
    const color = colors[step.tone] || "#8f5f3f";
    const selected = activeAction === step.key;
    const x = stepRect.x;
    const y = stepRect.y + pulse;
    ctx.fillStyle = selected ? `${color}2f` : "rgba(255, 253, 245, 0.78)";
    ctx.strokeStyle = selected ? `${color}cc` : `${color}55`;
    ctx.lineWidth = selected ? 2 : 1.2;
    ctx.beginPath();
    ctx.roundRect(x, y, stepRect.width, stepRect.height, 11);
    ctx.fill();
    ctx.stroke();
    if (index > 0) {
      ctx.strokeStyle = "rgba(77, 145, 166, 0.36)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x - 10, y + stepRect.height * 0.5);
      ctx.lineTo(x - 2, y + stepRect.height * 0.5);
      ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 6), x + 9, y + 12);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(step.value || "").slice(0, 9), x + 9, y + 23);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 18 + pulse, rect.width - 32, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 52), rect.x + 24, rect.y + rect.height - 8 + pulse);
  ctx.restore();
  return true;
}

export function drawLingqinDishRouteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  activeAction = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.18) * 2.6;
  const colors = {
    stock: "#4d91a6",
    order: spec.orderReady ? "#286f58" : "#b47d2f",
    shop: "#8f5f3f",
  };

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.88)" : "rgba(180, 125, 47, 0.48)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 15;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width - 30, rect.y + rect.height + 40, rect.x + rect.width - 42, rect.y + rect.height - 22 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255, 248, 232, 0.24)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 7, 54 + Math.abs(pulse), 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(202, 235, 210, 0.7)";
  ctx.beginPath();
  ctx.roundRect(anchor.x - 22, anchor.y - 14, 44, 18, 8);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.9)" : "rgba(180, 125, 47, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + pulse, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = spec.orderReady ? "rgba(202, 235, 210, 0.28)" : "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 52, 50, 15);
  ctx.fill();
  ctx.fillStyle = spec.orderReady ? "#286f58" : "#b47d2f";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("菜", rect.x + 29, rect.y + 45 + pulse);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 19), rect.x + 80, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 80, rect.y + 45 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(String(spec.detail || "").slice(0, 40), rect.x + 80, rect.y + 62 + pulse);

  spec.steps.forEach((step, index) => {
    const stepRect = step.rect;
    const color = colors[step.tone] || "#8f5f3f";
    const selected = activeAction === step.key;
    const x = stepRect.x;
    const y = stepRect.y + pulse;
    ctx.fillStyle = selected ? `${color}30` : "rgba(255, 253, 245, 0.82)";
    ctx.strokeStyle = selected ? `${color}cc` : `${color}55`;
    ctx.lineWidth = selected ? 2 : 1.2;
    ctx.beginPath();
    ctx.roundRect(x, y, stepRect.width, stepRect.height, 11);
    ctx.fill();
    ctx.stroke();
    if (index > 0) {
      ctx.strokeStyle = "rgba(180, 125, 47, 0.34)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x - 10, y + stepRect.height * 0.5);
      ctx.lineTo(x - 2, y + stepRect.height * 0.5);
      ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 6), x + 9, y + 12);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(step.value || "").slice(0, 10), x + 9, y + 24);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 18 + pulse, rect.width - 32, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 54), rect.x + 24, rect.y + rect.height - 8 + pulse);
  ctx.restore();
  return true;
}

export function drawQinghePondBridgeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.12) * 3;
  const colors = {
    taste: "#b47d2f",
    qinghe: "#286f58",
    pond: "#4d91a6",
  };

  ctx.save();
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.9)" : "rgba(77, 145, 166, 0.54)";
  ctx.lineWidth = active ? 3.2 : 2.1;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 26, rect.y + rect.height - 18 + pulse);
  ctx.quadraticCurveTo(rect.x + rect.width + 42, rect.y + rect.height + 62, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(159, 209, 223, 0.24)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 8, 70 + Math.abs(pulse), 22, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.55)";
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(anchor.x, anchor.y + 8, 24 + i * 18 + Math.abs(pulse), 8 + i * 5, -0.08, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(248, 252, 247, 0.95)");
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.92)" : "rgba(77, 145, 166, 0.62)";
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + pulse, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(159, 209, 223, 0.24)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 13 + pulse, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("池", rect.x + 28, rect.y + 44 + pulse);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 78, rect.y + 22 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 78, rect.y + 44 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(String(spec.detail || "").slice(0, 38), rect.x + 78, rect.y + 60 + pulse);

  spec.steps.forEach((step, index) => {
    const x = rect.x + 18 + index * 98;
    const y = rect.y + 74 + pulse;
    const color = colors[step.tone] || "#8f5f3f";
    ctx.fillStyle = index === 1 && spec.accepted ? `${color}2d` : "rgba(255, 253, 245, 0.8)";
    ctx.strokeStyle = `${color}${index === 1 && spec.accepted ? "bb" : "55"}`;
    ctx.lineWidth = index === 1 && spec.accepted ? 2 : 1.2;
    ctx.beginPath();
    ctx.roundRect(x, y, 88, 24, 10);
    ctx.fill();
    ctx.stroke();
    if (index > 0) {
      ctx.strokeStyle = "rgba(77, 145, 166, 0.36)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x - 10, y + 12);
      ctx.lineTo(x - 2, y + 12);
      ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 6), x + 8, y + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(step.value || "").slice(0, 9), x + 8, y + 20);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 17 + pulse, rect.width - 32, 13, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 50), rect.x + 24, rect.y + rect.height - 8 + pulse);
  ctx.restore();
  return true;
}

export function drawQingboIngredientTriadWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.16) * 2.8;
  const tones = ["#4d91a6", "#286f58", "#b47d2f"];

  ctx.save();
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.88)" : "rgba(77, 145, 166, 0.5)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width + 20, rect.y + 10, rect.x + rect.width - 24, rect.y + 50 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(248, 252, 247, 0.96)");
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.9)" : "rgba(77, 145, 166, 0.62)";
  ctx.lineWidth = active ? 2.6 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = spec.readyToCraft ? "rgba(202, 235, 210, 0.3)" : "rgba(159, 209, 223, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = spec.readyToCraft ? "#286f58" : "#4d91a6";
  ctx.font = "900 19px Microsoft YaHei";
  ctx.fillText("三", rect.x + 29, rect.y + 44 + pulse);
  ctx.fillStyle = spec.readyToCraft ? "#286f58" : "#4d91a6";
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 16), rect.x + 78, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 78, rect.y + 45 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 38), rect.x + 78, rect.y + 62 + pulse);

  spec.inputs.forEach((entry, index) => {
    const x = rect.x + 18 + index * 98;
    const y = rect.y + 76 + pulse;
    const color = tones[index] || "#8f5f3f";
    ctx.fillStyle = entry.ready ? `${color}24` : "rgba(255, 248, 232, 0.84)";
    ctx.strokeStyle = entry.ready ? `${color}aa` : "rgba(190, 79, 55, 0.5)";
    ctx.lineWidth = entry.ready ? 1.7 : 1.4;
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
    ctx.fillStyle = entry.ready ? color : "#be4f37";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(entry.itemName.slice(0, 5), x + 8, y + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(`${entry.have}/${entry.count}${entry.ready ? " 齐" : " 缺"}`.slice(0, 9), x + 8, y + 20);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 17 + pulse, rect.width - 32, 13, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 50), rect.x + 24, rect.y + rect.height - 8 + pulse);
  ctx.restore();
  return true;
}

export function drawCanalRestorationFeedbackWorld({
  ctx,
  width = 0,
  height = 0,
  feedback = null,
  now = 0,
  ease = 0,
  pulse = 0,
  reducedMotion = false,
  tile = 0,
  gap = 0,
  originX = 0,
  originY = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const accent = "#4d91a6";

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const wash = ctx.createRadialGradient(width * 0.62, height * 0.42, 28, width * 0.62, height * 0.42, 360);
  wash.addColorStop(0, "rgba(159, 209, 223, 0.28)");
  wash.addColorStop(0.42, "rgba(202, 235, 210, 0.16)");
  wash.addColorStop(1, "rgba(159, 209, 223, 0)");
  ctx.fillStyle = wash;
  ctx.beginPath();
  ctx.arc(width * 0.62, height * 0.42, 360, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(159, 209, 223, 0.82)";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.setLineDash([28, 18]);
  ctx.lineDashOffset = reducedMotion ? 0 : -now / 24;
  ctx.beginPath();
  ctx.moveTo(792, 186);
  ctx.bezierCurveTo(676, 264, 674, 382, 548, 438);
  ctx.bezierCurveTo(420, 496, 304, 470, 180, 570);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(255, 253, 245, 0.7)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    const offset = i * 0.17 + ease * 0.35;
    const x = 786 - i * 112 - ease * 60;
    const y = 198 + i * 92 + Math.sin(now / 360 + i) * 12;
    ctx.beginPath();
    ctx.ellipse(x - offset * 32, y, 26 + pulse + i * 3, 8 + i, -0.24, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (const [index, mark] of (feedback.plotMarks || []).entries()) {
    const x = originX + mark.x * (tile + gap);
    const y = originY + mark.y * (tile + gap);
    const reveal = Math.max(0, Math.min(1, ease - index * 0.025));
    if (reveal <= 0) continue;
    ctx.fillStyle = `rgba(202, 235, 210, ${0.16 + 0.18 * reveal})`;
    ctx.beginPath();
    ctx.roundRect(x - 4, y - 4, tile + 8, tile + 8, 12);
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 253, 245, ${0.46 + 0.24 * Math.sin(now / 240 + index)})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(x + 5, y + 5, tile - 10, tile - 10, 10);
    ctx.stroke();
    ctx.fillStyle = `rgba(77, 145, 166, ${0.2 + 0.18 * reveal})`;
    ctx.beginPath();
    ctx.ellipse(x + tile / 2, y + tile * 0.72, tile * (0.28 + 0.08 * reveal), tile * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const cardWidth = 548;
  const cardHeight = 208;
  const x = Math.round(width / 2 - cardWidth / 2);
  const y = Math.round(78 + pulse - ease * 12);
  const glyphX = x + 84;
  const glyphY = y + 96;
  drawCanvasCard(ctx, x, y, cardWidth, cardHeight, "rgba(248, 252, 247, 0.96)");

  ctx.fillStyle = "rgba(159, 209, 223, 0.28)";
  ctx.beginPath();
  ctx.roundRect(x + 24, y + 28, 126, 126, 32);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.58)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(glyphX, glyphY + 24, 46 + pulse, 15, -0.12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.82)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(glyphX, glyphY - 6, 32 + pulse * 0.2, 0.22, Math.PI * 1.72);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "800 34px Microsoft YaHei";
  ctx.fillText("渠", glyphX - 24, glyphY + 4);

  for (let i = 0; i < 8; i += 1) {
    const angle = now / 430 + i * 0.78;
    const radius = 44 + (i % 3) * 9 + ease * 12;
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.86)" : "rgba(159, 209, 223, 0.72)";
    ctx.beginPath();
    ctx.arc(glyphX + Math.cos(angle) * radius, glyphY + Math.sin(angle) * radius * 0.56, 3 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = accent;
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.label || "水流恢复 · 地块扩张").slice(0, 24), x + 178, y + 38);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 24px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "旧渠重新活了过来").slice(0, 18), x + 178, y + 72);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 15px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 34), x + 178, y + 102);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.unlockText || "水系作物解锁").slice(0, 38), x + 178, y + 130);
  ctx.fillStyle = "#4d91a6";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(String(feedback.mapChangeText || "永久地图变化：新水田已写入地图").slice(0, 44), x + 178, y + 154);
  ctx.fillStyle = "#286f58";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(String(feedback.tomorrowGoalText || feedback.cta || "").slice(0, 44), x + 178, y + 174);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(String(feedback.acceptanceLine || "录屏证据：永久改图 + 明日目标").slice(0, 46), x + 178, y + 192);

  ctx.fillStyle = "rgba(255, 248, 232, 0.94)";
  ctx.strokeStyle = "rgba(224, 182, 109, 0.42)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(x + cardWidth - 138, y + 34, 102, 64, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText("露珠芹种子", x + cardWidth - 124, y + 58);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 18px Microsoft YaHei";
  ctx.fillText(`x${feedback.seedGiftCount || 0}`, x + cardWidth - 94, y + 84);

  ctx.fillStyle = "rgba(202, 235, 210, 0.86)";
  ctx.beginPath();
  ctx.roundRect(x + 176, y + cardHeight - 22, Math.max(30, (cardWidth - 216) * ease), 6, 999);
  ctx.fill();
  ctx.restore();
  return true;
}

export function drawCanalRestorationCelebrationWorldCardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawSpiritSprite = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.9) * 2.5;
  const cardY = rect.y + bob;
  const accent = spec.planted ? "#286f58" : "#4d91a6";
  const rowColors = {
    water: "#4d91a6",
    field: "#286f58",
    seed: "#b47d2f",
    spirit: "#8f5f3f",
  };

  ctx.save();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.52)";
  ctx.lineWidth = 3;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(792, 186);
  ctx.bezierCurveTo(676, 264, 674, 382, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(159, 209, 223, 0.24)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 6, 46 + Math.max(0, bob), 13, -0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.62)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(anchor.x - 22 + i * 22, anchor.y + 4 + Math.sin(motion * 2 + i) * 2, 13, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (spec.spirit) {
    drawSpiritSprite(ctx, spec.spirit, anchor.x - 64, anchor.y - 60 + bob, 58);
    ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
    ctx.beginPath();
    ctx.roundRect(anchor.x - 22, anchor.y - 64 + bob, 68, 28, 12);
    ctx.fill();
    ctx.fillStyle = "#286f58";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(spec.planted ? "水菜接上" : "水田亮了", anchor.x - 10, anchor.y - 47 + bob);
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.planted ? "rgba(237, 243, 223, 0.94)" : "rgba(236, 248, 243, 0.94)");
  ctx.strokeStyle = active ? accent : `${accent}77`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, cardY, rect.width, rect.height, 17);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, cardY + 12, 42, 42, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("渠", rect.x + 23, cardY + 40);

  ctx.fillStyle = accent;
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 16), rect.x + 66, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 66, cardY + 44);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 30), rect.x + 66, cardY + 61);

  spec.rows.slice(0, 4).forEach((row, index) => {
    const rowX = rect.x + 14 + (index % 2) * 134;
    const rowY = cardY + 72 + Math.floor(index / 2) * 18;
    const color = rowColors[row.tone] || accent;
    ctx.fillStyle = `${color}18`;
    ctx.beginPath();
    ctx.roundRect(rowX, rowY, 122, 14, 7);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(row.label.slice(0, 5), rowX + 8, rowY + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(row.value || "").slice(0, 8), rowX + 54, rowY + 10);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 58, cardY + rect.height - 19, rect.width - 72, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(`下一步：${spec.nextAction}`.slice(0, 28), rect.x + 68, cardY + rect.height - 9);
  ctx.restore();
  return true;
}

export function drawWaterCropPlantFeedbackWorld({
  ctx,
  width = 0,
  height = 0,
  feedback = null,
  now = 0,
  ease = 0,
  pulse = 0,
  reducedMotion = false,
  tile = 0,
  gap = 0,
  originX = 0,
  originY = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const plotX = originX + Number(feedback.plotX || 0) * (tile + gap);
  const plotY = originY + Number(feedback.plotY || 0) * (tile + gap);
  const centerX = plotX + tile / 2;
  const centerY = plotY + tile / 2;
  const accent = "#4d91a6";

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);

  const fieldGlow = ctx.createRadialGradient(centerX, centerY, 8, centerX, centerY, 126 + pulse);
  fieldGlow.addColorStop(0, "rgba(255, 253, 245, 0.62)");
  fieldGlow.addColorStop(0.42, "rgba(159, 209, 223, 0.3)");
  fieldGlow.addColorStop(1, "rgba(159, 209, 223, 0)");
  ctx.fillStyle = fieldGlow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 130 + pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 253, 245, 0.78)";
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -now / 28;
  ctx.beginPath();
  ctx.roundRect(plotX - 8, plotY - 8, tile + 16, tile + 16, 14);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 4; i += 1) {
    const wave = Math.max(0, ease - i * 0.12);
    ctx.strokeStyle = `rgba(77, 145, 166, ${0.42 * wave})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + tile * 0.18, tile * (0.22 + wave * 0.26 + i * 0.06), tile * (0.06 + i * 0.012), 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(202, 235, 210, 0.92)";
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 16, 28, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#286f58";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i += 1) {
    const sway = reducedMotion ? 0 : Math.sin(now / 360 + i) * 3;
    const stemX = centerX - 12 + i * 12;
    ctx.beginPath();
    ctx.moveTo(stemX, centerY + 12);
    ctx.quadraticCurveTo(stemX + sway, centerY - 2 - i * 3, stemX + 4 + sway, centerY - 20 - i * 2);
    ctx.stroke();
    ctx.fillStyle = i % 2 ? "#caebd2" : "#48a868";
    ctx.beginPath();
    ctx.ellipse(stemX + 8 + sway, centerY - 22 - i * 2, 9, 5, i % 2 ? 0.65 : -0.65, 0, Math.PI * 2);
    ctx.fill();
  }

  const cardWidth = 420;
  const cardHeight = 152;
  const cardX = Math.max(34, Math.min(width - cardWidth - 34, plotX - 136));
  const cardY = Math.max(70, Math.min(height - cardHeight - 34, plotY - 126 + pulse - ease * 8));
  drawCanvasCard(ctx, cardX, cardY, cardWidth, cardHeight, "rgba(248, 252, 247, 0.96)");

  ctx.fillStyle = "rgba(159, 209, 223, 0.22)";
  ctx.beginPath();
  ctx.roundRect(cardX + 18, cardY + 22, 88, 88, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.58)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.ellipse(cardX + 62, cardY + 88, 32 + pulse, 10, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "800 30px Microsoft YaHei";
  ctx.fillText("芹", cardX + 42, cardY + 68);

  ctx.fillStyle = accent;
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.title || "第一次水田播种").slice(0, 18), cardX + 126, cardY + 32);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 20px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "新渠的第一粒水菜接住了").slice(0, 18), cardX + 126, cardY + 62);
  ctx.fillStyle = "#286f58";
  ctx.font = "13px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 38), cardX + 126, cardY + 90);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(String(feedback.routeText || "").slice(0, 40), cardX + 126, cardY + 116);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(String(feedback.cta || "").slice(0, 46), cardX + 126, cardY + 136);

  ctx.fillStyle = "rgba(255, 248, 232, 0.92)";
  ctx.strokeStyle = "rgba(224, 182, 109, 0.38)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(cardX + 20, cardY + 116, 92, 22, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${feedback.growDays || 3} 夜后初收`, cardX + 32, cardY + 131);
  ctx.restore();
  return true;
}

export function drawWaterCropHarvestFeedbackWorld({
  ctx,
  width = 0,
  height = 0,
  feedback = null,
  now = 0,
  ease = 0,
  pulse = 0,
  reducedMotion = false,
  tile = 0,
  gap = 0,
  originX = 0,
  originY = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const plotX = originX + Number(feedback.plotX || 0) * (tile + gap);
  const plotY = originY + Number(feedback.plotY || 0) * (tile + gap);
  const centerX = plotX + tile / 2;
  const centerY = plotY + tile / 2;
  const accent = feedback.readyToCook ? "#286f58" : "#4d91a6";

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(centerX, centerY, 12, centerX, centerY, 150 + pulse);
  glow.addColorStop(0, "rgba(255, 253, 245, 0.68)");
  glow.addColorStop(0.42, feedback.readyToCook ? "rgba(202, 235, 210, 0.34)" : "rgba(159, 209, 223, 0.28)");
  glow.addColorStop(1, "rgba(159, 209, 223, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 154 + pulse, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 7; i += 1) {
    const angle = now / 420 + i * 0.9;
    const radius = 28 + (i % 3) * 10 + ease * 18;
    ctx.fillStyle = i % 2 ? "rgba(202, 235, 210, 0.78)" : "rgba(255, 253, 245, 0.88)";
    ctx.beginPath();
    ctx.ellipse(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius * 0.52, 4 + (i % 2), 7, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(77, 145, 166, 0.7)";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -now / 30;
  ctx.beginPath();
  ctx.roundRect(plotX - 7, plotY - 7, tile + 14, tile + 14, 14);
  ctx.stroke();
  ctx.setLineDash([]);

  const cardWidth = 492;
  const cardHeight = 166;
  const cardX = Math.max(34, Math.min(width - cardWidth - 34, plotX - 180));
  const cardY = Math.max(72, Math.min(height - cardHeight - 34, plotY - 138 + pulse - ease * 10));
  drawCanvasCard(ctx, cardX, cardY, cardWidth, cardHeight, "rgba(255, 253, 245, 0.96)");

  ctx.fillStyle = feedback.readyToCook ? "rgba(202, 235, 210, 0.34)" : "rgba(159, 209, 223, 0.24)";
  ctx.beginPath();
  ctx.roundRect(cardX + 20, cardY + 24, 106, 106, 28);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 30px Microsoft YaHei";
  ctx.fillText("收", cardX + 56, cardY + 64);
  ctx.fillStyle = "#286f58";
  ctx.font = "800 18px Microsoft YaHei";
  ctx.fillText(`+${feedback.amount || 1}`, cardX + 58, cardY + 98);
  if (feedback.qualityStars) {
    ctx.fillStyle = "#b47d2f";
    ctx.font = "700 12px Microsoft YaHei";
    ctx.fillText(`${feedback.qualityLabel || "凡品"} ${feedback.qualityStars}`.slice(0, 12), cardX + 38, cardY + 120);
  }

  ctx.fillStyle = accent;
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.label || "水田初收 · 凉菜线接上").slice(0, 24), cardX + 148, cardY + 34);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 21px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "露珠芹入仓").slice(0, 20), cardX + 148, cardY + 66);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 38), cardX + 148, cardY + 94);
  ctx.fillStyle = feedback.readyToCook ? "#b47d2f" : "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.routeText || "").slice(0, 42), cardX + 148, cardY + 120);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.orderText || "").slice(0, 46), cardX + 148, cardY + 144);

  const barX = cardX + 24;
  const barY = cardY + cardHeight - 20;
  const cropRatio = Math.max(0, Math.min(1, Number(feedback.haveCrop || 0) / Math.max(1, Number(feedback.needCrop || 2))));
  ctx.fillStyle = "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, cardWidth - 48, 6, 999);
  ctx.fill();
  ctx.fillStyle = feedback.readyToCook ? "rgba(224, 182, 109, 0.92)" : "rgba(77, 145, 166, 0.82)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(24, (cardWidth - 48) * cropRatio), 6, 999);
  ctx.fill();
  ctx.restore();
  return true;
}

export function drawWaterCropDishFeedbackWorld({
  ctx,
  width = 0,
  height = 0,
  feedback = null,
  now = 0,
  ease = 0,
  pulse = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const x = Math.round(width / 2 - 258);
  const y = Math.round(88 + pulse - ease * 10);
  const accent = feedback.orderReady ? "#286f58" : "#4d91a6";
  const menuDish = feedback.dishKind === "lingchi_sanxian_geng" || feedback.outputItemId === "item_food_lingchi_sanxian_geng";
  const fishDish = menuDish || feedback.dishKind === "qingbo_yukuai" || feedback.outputItemId === "item_food_qingbo_yukuai";

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(x + 112, y + 100, 18, x + 112, y + 100, 250);
  glow.addColorStop(0, "rgba(202, 235, 210, 0.36)");
  glow.addColorStop(0.45, "rgba(159, 209, 223, 0.2)");
  glow.addColorStop(1, "rgba(159, 209, 223, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 112, y + 100, 250, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, 516, 188, "rgba(255, 253, 245, 0.96)");
  ctx.fillStyle = "rgba(159, 209, 223, 0.23)";
  ctx.beginPath();
  ctx.roundRect(x + 24, y + 28, 126, 126, 32);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.beginPath();
  ctx.ellipse(x + 88, y + 104, 44 + pulse * 0.4, 22, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.68)";
  ctx.lineWidth = 3;
  ctx.stroke();
  if (fishDish) {
    ctx.fillStyle = "rgba(40, 111, 88, 0.9)";
    ctx.beginPath();
    ctx.ellipse(x + 86 + Math.sin(now / 280) * 4, y + 102, 34, 12, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 52, y + 102);
    ctx.lineTo(x + 34, y + 90);
    ctx.lineTo(x + 36, y + 113);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
    ctx.beginPath();
    ctx.arc(x + 105, y + 98, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 253, 245, 0.58)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(x + 88, y + 103, 14 + i * 11 + ease * 5, -0.7, 0.9);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = "#48a868";
    for (let i = 0; i < 5; i += 1) {
      const leafX = x + 54 + i * 14;
      const leafY = y + 98 + Math.sin(now / 360 + i) * 3;
      ctx.beginPath();
      ctx.ellipse(leafX, leafY, 12, 4, i % 2 ? 0.45 : -0.45, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255, 248, 232, 0.86)";
    ctx.beginPath();
    ctx.ellipse(x + 92, y + 108, 30, 8, -0.06, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = accent;
  ctx.font = "800 22px Microsoft YaHei";
  ctx.fillText(menuDish ? "三鲜" : fishDish ? "鱼脍" : "灵芹", x + 64, y + 82);

  for (let i = 0; i < 7; i += 1) {
    const angle = now / 440 + i * 0.9;
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.86)" : "rgba(159, 209, 223, 0.68)";
    ctx.beginPath();
    ctx.arc(x + 88 + Math.cos(angle) * (54 + ease * 8), y + 104 + Math.sin(angle) * 28, 3 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = accent;
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.label || "水系料理成品 · 订单板亮起").slice(0, 26), x + 176, y + 38);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 23px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "新渠第一盘口味做成了").slice(0, 18), x + 176, y + 72);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 14px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 40), x + 176, y + 102);
  ctx.fillStyle = feedback.orderReady ? "#b47d2f" : "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.orderText || "").slice(0, 42), x + 176, y + 128);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.rewardText || "").slice(0, 44), x + 176, y + 152);

  const ticketX = x + 358;
  const ticketY = y + 118;
  ctx.fillStyle = "rgba(255, 248, 232, 0.94)";
  ctx.strokeStyle = "rgba(224, 182, 109, 0.46)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(ticketX, ticketY, 126, 48, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(menuDish ? "双鲜上架" : fishDish ? "旧铺首卖" : feedback.orderReady ? "订单可交" : "订单接线", ticketX + 16, ticketY + 20);
  ctx.fillStyle = "#286f58";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.orderNpc || "青禾").slice(0, 6), ticketX + 18, ticketY + 38);

  ctx.fillStyle = "rgba(202, 235, 210, 0.86)";
  ctx.beginPath();
  ctx.roundRect(x + 176, y + 170, Math.max(36, 292 * ease), 6, 999);
  ctx.fill();
  ctx.restore();
  return true;
}

export function drawWaterCropOrderFeedbackWorld({
  ctx,
  width = 0,
  height = 0,
  feedback = null,
  now = 0,
  ease = 0,
  drift = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const x = Math.round(width / 2 - 270);
  const y = Math.round(112 + drift - ease * 12);

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(x + 120, y + 102, 12, x + 120, y + 102, 280);
  glow.addColorStop(0, "rgba(159, 209, 223, 0.38)");
  glow.addColorStop(0.42, "rgba(202, 235, 210, 0.18)");
  glow.addColorStop(1, "rgba(159, 209, 223, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 120, y + 102, 280, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, 540, 202, "rgba(255, 253, 245, 0.97)");
  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(x + 24, y + 28, 136, 138, 34);
  ctx.fill();

  ctx.strokeStyle = "rgba(77, 145, 166, 0.66)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 40, y + 118);
  ctx.bezierCurveTo(x + 74, y + 84 + drift, x + 92, y + 142 - drift, x + 128, y + 104);
  ctx.bezierCurveTo(x + 144, y + 88, x + 154, y + 96, x + 168, y + 82);
  ctx.stroke();
  ctx.fillStyle = "rgba(202, 235, 210, 0.84)";
  for (let i = 0; i < 5; i += 1) {
    const beadX = x + 52 + i * 23 + ease * 18;
    const beadY = y + 118 + Math.sin(now / 310 + i) * 12;
    ctx.beginPath();
    ctx.arc(beadX, beadY, 5 - i * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255, 248, 232, 0.94)";
  ctx.beginPath();
  ctx.roundRect(x + 72, y + 44, 70, 56, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 125, 47, 0.48)";
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "800 18px Microsoft YaHei";
  ctx.fillText("入账", x + 88, y + 78);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(String(feedback.npcLabel || "青禾").slice(0, 4), x + 92, y + 96);

  ctx.fillStyle = "#4d91a6";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.label || "水系链路闭环 · 新渠入账").slice(0, 26), x + 188, y + 40);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 23px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "新渠第一盘口味卖成了").slice(0, 18), x + 188, y + 74);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 42), x + 188, y + 104);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.rewardText || "").slice(0, 44), x + 188, y + 130);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.nextAdvice || "").slice(0, 48), x + 188, y + 156);

  const steps = String(feedback.routeText || "修渠 -> 露珠芹 -> 凉拌灵芹 -> 青禾清口单").split(" -> ");
  let stepX = x + 30;
  const stepY = y + 178;
  steps.forEach((step, index) => {
    const widthStep = 78 + Math.min(26, step.length * 2);
    ctx.fillStyle = index === steps.length - 1 ? "rgba(224, 182, 109, 0.24)" : "rgba(202, 235, 210, 0.76)";
    ctx.beginPath();
    ctx.roundRect(stepX, stepY - 17, widthStep, 24, 12);
    ctx.fill();
    ctx.fillStyle = index === steps.length - 1 ? "#8f5f3f" : "#286f58";
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(step.slice(0, 8), stepX + 10, stepY);
    if (index < steps.length - 1) {
      ctx.fillStyle = "rgba(77, 145, 166, 0.74)";
      ctx.fillText(">", stepX + widthStep + 6, stepY);
    }
    stepX += widthStep + 20;
  });

  ctx.fillStyle = "rgba(77, 145, 166, 0.82)";
  ctx.beginPath();
  ctx.roundRect(x + 188, y + 176, Math.max(42, 300 * ease), 6, 999);
  ctx.fill();
  ctx.restore();
  return true;
}

export function drawQinghePondEntryFeedbackWorld({
  ctx,
  width = 0,
  height = 0,
  feedback = null,
  now = 0,
  ease = 0,
  ripple = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const x = Math.round(width / 2 - 250);
  const y = Math.round(318 + ripple - ease * 10);

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(x + 102, y + 94, 12, x + 102, y + 94, 250);
  glow.addColorStop(0, "rgba(159, 209, 223, 0.36)");
  glow.addColorStop(0.44, "rgba(77, 145, 166, 0.18)");
  glow.addColorStop(1, "rgba(77, 145, 166, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 102, y + 94, 250, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, 500, 188, "rgba(248, 252, 247, 0.97)");
  ctx.fillStyle = "rgba(159, 209, 223, 0.24)";
  ctx.beginPath();
  ctx.roundRect(x + 24, y + 26, 128, 126, 30);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.ellipse(x + 88, y + 102, 48 + ripple * 0.3, 24, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.58)";
  ctx.lineWidth = 3;
  ctx.stroke();
  for (let i = 0; i < 3; i += 1) {
    const radius = 20 + i * 16 + ease * 8;
    ctx.strokeStyle = `rgba(77, 145, 166, ${0.32 - i * 0.07})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(x + 88, y + 102, radius, radius * 0.42, -0.08, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#4d91a6";
  ctx.font = "800 21px Microsoft YaHei";
  ctx.fillText("灵池", x + 64, y + 82);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText("第一尾灵鱼", x + 58, y + 132);

  ctx.fillStyle = "#4d91a6";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.label || "青禾一心 · 灵池支线浮现").slice(0, 24), x + 178, y + 38);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 22px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "水路下一站是旧池塘").slice(0, 18), x + 178, y + 70);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 42), x + 178, y + 98);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(`${feedback.questTitle} · ${feedback.buildingName} · ${feedback.buildCostText}`).slice(0, 42), x + 178, y + 124);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.nextAdvice || "").slice(0, 48), x + 178, y + 150);

  const stepY = y + 170;
  const steps = [feedback.firstStepText, feedback.secondStepText, feedback.rewardText].filter(Boolean);
  let stepX = x + 30;
  steps.slice(0, 3).forEach((step, index) => {
    const chipW = index === 2 ? 152 : 130;
    ctx.fillStyle = index === 0 ? "rgba(202, 235, 210, 0.78)" : index === 1 ? "rgba(159, 209, 223, 0.42)" : "rgba(224, 182, 109, 0.22)";
    ctx.beginPath();
    ctx.roundRect(stepX, stepY - 17, chipW, 24, 12);
    ctx.fill();
    ctx.fillStyle = index === 2 ? "#8f5f3f" : "#286f58";
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(String(step).slice(0, index === 2 ? 12 : 10), stepX + 10, stepY);
    stepX += chipW + 12;
  });

  ctx.fillStyle = "rgba(77, 145, 166, 0.78)";
  ctx.beginPath();
  ctx.roundRect(x + 178, y + 164, Math.max(42, 284 * ease), 6, 999);
  ctx.fill();
  ctx.restore();
  return true;
}

export function drawQinghePondProgressFeedbackWorld({
  ctx,
  width = 0,
  height = 0,
  feedback = null,
  now = 0,
  ease = 0,
  ripple = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const x = Math.round(width / 2 - 262);
  const y = Math.round(302 + ripple - ease * 10);
  const isReturnOrderPhase = feedback.phase === "return_order";
  const hasFishMoment = feedback.phase === "catch"
    || feedback.phase === "recipe"
    || feedback.phase === "sale"
    || feedback.phase === "restock"
    || feedback.phase === "signature"
    || feedback.phase === "menu"
    || isReturnOrderPhase;
  const hasShopSignMoment = feedback.phase === "sale"
    || feedback.phase === "restock"
    || feedback.phase === "signature"
    || feedback.phase === "menu"
    || isReturnOrderPhase;
  const hasCompletedMenuMoment = feedback.phase === "recipe"
    || feedback.phase === "sale"
    || feedback.phase === "restock"
    || feedback.phase === "signature"
    || feedback.phase === "menu"
    || isReturnOrderPhase;
  const phaseAccent = isReturnOrderPhase
    ? "#286f58"
    : feedback.phase === "menu"
      ? "#286f58"
      : feedback.phase === "signature"
        ? "#8f5f3f"
        : feedback.phase === "restock"
          ? "#4d91a6"
          : feedback.phase === "sale"
            ? "#b47d2f"
            : feedback.phase === "recipe"
              ? "#b47d2f"
              : feedback.phase === "catch"
                ? "#286f58"
                : "#4d91a6";
  const glyph = isReturnOrderPhase
    ? "订"
    : feedback.phase === "menu"
      ? "双"
      : feedback.phase === "signature"
        ? "牌"
        : feedback.phase === "restock"
          ? "鲜"
          : feedback.phase === "sale"
            ? "铺"
            : feedback.phase === "recipe"
              ? "谱"
              : feedback.phase === "catch"
                ? "鱼"
                : "池";

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(x + 116, y + 98, 14, x + 116, y + 98, 270);
  glow.addColorStop(0, "rgba(159, 209, 223, 0.4)");
  glow.addColorStop(0.48, "rgba(202, 235, 210, 0.2)");
  glow.addColorStop(1, "rgba(77, 145, 166, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 116, y + 98, 270, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, 524, 196, "rgba(248, 252, 247, 0.97)");
  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(x + 24, y + 26, 134, 132, 32);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.beginPath();
  ctx.ellipse(x + 92, y + 104, 48 + ripple * 0.35, 24, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(77, 145, 166, 0.6)";
  ctx.lineWidth = 3;
  ctx.stroke();
  for (let i = 0; i < 4; i += 1) {
    const radius = 18 + i * 12 + ease * 9;
    ctx.strokeStyle = `rgba(77, 145, 166, ${0.34 - i * 0.06})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(x + 92, y + 104, radius, radius * 0.42, -0.08, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (hasFishMoment) {
    ctx.fillStyle = "rgba(40, 111, 88, 0.86)";
    ctx.beginPath();
    ctx.ellipse(x + 88 + Math.sin(now / 280) * 5, y + 102, 28, 10, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
    ctx.beginPath();
    ctx.arc(x + 104, y + 99, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (feedback.phase === "recipe") {
    ctx.fillStyle = "rgba(224, 182, 109, 0.86)";
    ctx.beginPath();
    ctx.roundRect(x + 58, y + 54, 68, 48, 12);
    ctx.fill();
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "800 16px Microsoft YaHei";
    ctx.fillText("清波", x + 75, y + 82);
  }
  if (hasShopSignMoment) {
    const signStroke = isReturnOrderPhase
      ? "rgba(40, 111, 88, 0.52)"
      : feedback.phase === "menu"
        ? "rgba(40, 111, 88, 0.46)"
        : feedback.phase === "signature"
          ? "rgba(143, 95, 63, 0.46)"
          : feedback.phase === "restock"
            ? "rgba(77, 145, 166, 0.46)"
            : "rgba(180, 125, 47, 0.42)";
    const signInk = isReturnOrderPhase
      ? "#286f58"
      : feedback.phase === "menu"
        ? "#286f58"
        : feedback.phase === "signature"
          ? "#8f5f3f"
          : feedback.phase === "restock"
            ? "#4d91a6"
            : "#b47d2f";
    const signText = isReturnOrderPhase
      ? "回订"
      : feedback.phase === "menu"
        ? "双鲜"
        : feedback.phase === "signature"
          ? "成线"
          : feedback.phase === "restock"
            ? "补齐"
            : "首卖";
    ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
    ctx.beginPath();
    ctx.roundRect(x + 54, y + 56, 78, 48, 12);
    ctx.fill();
    ctx.strokeStyle = signStroke;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.fillStyle = signInk;
    ctx.font = "800 15px Microsoft YaHei";
    ctx.fillText(signText, x + 75, y + 84);
  }
  ctx.fillStyle = phaseAccent;
  ctx.font = "800 20px Microsoft YaHei";
  ctx.fillText(glyph, x + 82, y + 142);

  ctx.fillStyle = phaseAccent;
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.label || "灵池水鲜进度").slice(0, 25), x + 184, y + 38);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 22px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "灵池线推进").slice(0, 19), x + 184, y + 72);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 42), x + 184, y + 102);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.rewardText || "").slice(0, 44), x + 184, y + 128);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.nextAdvice || "").slice(0, 48), x + 184, y + 154);

  const steps = String(feedback.routeText || "建灵池浅塘 -> 第一网灵鱼 -> 清波鱼脍").split(" -> ");
  let chipX = x + 28;
  const chipY = y + 178;
  steps.slice(0, 3).forEach((step, index) => {
    const chipW = index === 2 ? 132 : 116;
    ctx.fillStyle = index === 2 && hasCompletedMenuMoment ? "rgba(224, 182, 109, 0.24)" : "rgba(202, 235, 210, 0.76)";
    ctx.beginPath();
    ctx.roundRect(chipX, chipY - 17, chipW, 24, 12);
    ctx.fill();
    ctx.fillStyle = index === 2 && hasCompletedMenuMoment ? "#8f5f3f" : "#286f58";
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(step.slice(0, index === 2 ? 11 : 9), chipX + 10, chipY);
    chipX += chipW + 12;
  });

  ctx.fillStyle = "rgba(77, 145, 166, 0.82)";
  ctx.beginPath();
  ctx.roundRect(x + 184, y + 170, Math.max(42, 284 * ease), 6, 999);
  ctx.fill();
  ctx.restore();
  return true;
}
