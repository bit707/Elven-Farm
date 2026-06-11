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
