export function drawSpiritAuraWorld({
  ctx,
  x = 0,
  y = 0,
  label = "",
  pulse = 0,
} = {}) {
  if (!ctx) return false;
  ctx.save();
  ctx.fillStyle = "rgba(246, 240, 182, 0.22)";
  ctx.beginPath();
  ctx.ellipse(x + 60, y + 88, 72 + pulse, 24 + pulse / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
  ctx.beginPath();
  ctx.roundRect(x + 10, y + 118, 152, 34, 14);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "700 16px Microsoft YaHei";
  ctx.fillText(label, x + 24, y + 141);
  ctx.restore();
  return true;
}

export function drawSpiritCropScoutWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  active = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.row) return false;
  const { rect, copy, plotPoint, spiritPoint, row } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2 + spec.index) * 2.2;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.strokeStyle = active ? `${copy.accent}dd` : `${copy.accent}88`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(spiritPoint.x, spiritPoint.y);
  ctx.quadraticCurveTo((spiritPoint.x + plotPoint.x) / 2, Math.min(spiritPoint.y, plotPoint.y) - 42, plotPoint.x, plotPoint.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = `${copy.accent}26`;
  ctx.beginPath();
  ctx.ellipse(plotPoint.x, plotPoint.y + 20, 54 + Math.abs(pulse), 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `${copy.accent}99`;
  ctx.lineWidth = active ? 2.6 : 1.8;
  ctx.beginPath();
  ctx.arc(plotPoint.x, plotPoint.y, 17 + Math.abs(pulse), 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = copy.accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(copy.glyph, plotPoint.x, plotPoint.y + 5);

  const beadProgress = reducedMotion ? 0.55 : (motion * 0.24 + spec.index * 0.13) % 1;
  const beadX = spiritPoint.x + (plotPoint.x - spiritPoint.x) * beadProgress;
  const beadY = spiritPoint.y + (plotPoint.y - spiritPoint.y) * beadProgress - Math.sin(beadProgress * Math.PI) * 36;
  ctx.fillStyle = copy.fill;
  ctx.strokeStyle = copy.accent;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(beadX, beadY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, copy.fill);
  ctx.strokeStyle = active ? `${copy.accent}dd` : `${copy.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = copy.accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 42, 34, 13);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(copy.glyph, rect.x + 35, cardY + 36);
  ctx.textAlign = "left";
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 66, cardY + 25);
  ctx.fillStyle = copy.accent;
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 22), rect.x + 66, cardY + 42);

  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${copy.action} · ${row.cropName}`.slice(0, 26), rect.x + 18, cardY + 66);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(copy.line.slice(0, 30), rect.x + 18, cardY + 84);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 9px Microsoft YaHei";
  ctx.fillText(spec.safetyText.slice(0, 34), rect.x + 18, cardY + rect.height - 10);

  if (!reducedMotion) {
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.88)" : `${copy.accent}66`;
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 22 - i * 16, cardY + 18 + Math.sin(motion * 2 + i) * 3, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawSpiritJobShiftTheaterWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  active = false,
  focusedSpiritId = "",
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.rows?.length) return false;
  const { rect } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.4) * 2;
  const cardY = rect.y + bob;

  ctx.save();
  spec.rows.forEach((row, rowIndex) => {
    const rowRect = row.rowRect;
    const rowCenter = { x: rowRect.x + 18, y: rowRect.y + rowRect.height * 0.5 + bob };
    const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4 + rowIndex) * 2;
    ctx.strokeStyle = `${row.accent}66`;
    ctx.lineWidth = focusedSpiritId === row.spiritId ? 2.8 : 1.8;
    ctx.setLineDash([6, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
    ctx.beginPath();
    ctx.moveTo(row.anchor.x, row.anchor.y);
    ctx.quadraticCurveTo((row.anchor.x + rowCenter.x) / 2, Math.min(row.anchor.y, rowCenter.y) - 28 - rowIndex * 4, rowCenter.x, rowCenter.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = row.soft;
    ctx.beginPath();
    ctx.ellipse(row.anchor.x, row.anchor.y + 18, 36 + pulse, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 253, 245, 0.9)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : "rgba(40, 111, 88, 0.34)";
  ctx.lineWidth = active ? 2.8 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(202, 235, 210, 0.52)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 13, 44, 28, 12);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText("班", rect.x + 27, cardY + 33);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 70, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.subtitle.slice(0, 24), rect.x + 70, cardY + 39);

  spec.rows.forEach((row, rowIndex) => {
    const rowRect = row.rowRect;
    const y = rowRect.y + bob;
    const highlighted = focusedSpiritId === row.spiritId;
    const statusColor = row.status === "已见效" ? "#286f58" : row.status === "顺天时" ? "#4d91a6" : row.status === "要休整" ? "#be4f37" : "#b47d2f";
    ctx.fillStyle = highlighted ? `${row.accent}22` : rowIndex % 2 ? "rgba(255, 248, 232, 0.72)" : "rgba(237, 243, 223, 0.58)";
    ctx.beginPath();
    ctx.roundRect(rowRect.x, y, rowRect.width, rowRect.height, 10);
    ctx.fill();
    ctx.strokeStyle = highlighted ? `${row.accent}bb` : "rgba(23, 35, 29, 0.08)";
    ctx.lineWidth = highlighted ? 1.8 : 1;
    ctx.stroke();

    ctx.fillStyle = `${statusColor}22`;
    ctx.beginPath();
    ctx.roundRect(rowRect.x + 8, y + 4, 44, 15, 7);
    ctx.fill();
    ctx.fillStyle = statusColor;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(row.status.slice(0, 3), rowRect.x + 15, y + 15);
    ctx.fillStyle = row.accent;
    ctx.font = "900 11px Microsoft YaHei";
    ctx.fillText(`${row.glyph} ${row.spiritName}`.slice(0, 8), rowRect.x + 60, y + 15);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(`${row.jobName} · ${row.actionText}`.slice(0, 19), rowRect.x + 132, y + 15);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(`${row.levelText} ${row.efficiencyText}`, rowRect.x + rowRect.width - 64, y + 15);
  });

  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  if (spec.moreCount > 0) {
    ctx.fillText(`另有 ${spec.moreCount} 只精怪在洞天深处执行班次`, rect.x + 18, cardY + rect.height - 8);
  } else {
    ctx.fillText("点击只定位伙伴栏，不会自动切岗或派工", rect.x + 18, cardY + rect.height - 8);
  }
  ctx.restore();
  return true;
}

export function drawSpiritJobEffectWorld({
  ctx,
  spirit = null,
  x = 0,
  y = 0,
  size = 112,
  profile = {},
  tick = 0,
  hasRisk = false,
} = {}) {
  if (!ctx || !spirit) return false;
  const job = spirit.job || "farm";
  ctx.save();
  ctx.strokeStyle = profile.accent;
  ctx.fillStyle = profile.glow;
  ctx.lineWidth = 3;

  if (job === "farm") {
    ctx.beginPath();
    ctx.arc(x + size * 0.82, y + size * 0.28, 12 + Math.sin(tick) * 2, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = "rgba(77, 145, 166, 0.55)";
      ctx.beginPath();
      ctx.ellipse(x + size * 0.78 + i * 12, y + size * 0.42 + i * 8, 4, 8, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (job === "workshop") {
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i % 2 ? profile.accent : "#fffdf5";
      ctx.beginPath();
      ctx.arc(x + size * 0.82 + Math.cos(tick + i) * 18, y + size * 0.42 + Math.sin(tick + i) * 14, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (job === "shop") {
    ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
    ctx.beginPath();
    ctx.roundRect(x + size * 0.62, y + size * 0.08, 54, 26, 10);
    ctx.fill();
    ctx.fillStyle = "#b47d2f";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText("招客", x + size * 0.7, y + size * 0.26);
  } else if (job === "expedition") {
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(x + size * 0.7, y + size * 0.42);
    ctx.bezierCurveTo(x + size * 1.1, y + size * 0.14, x + size * 1.24, y + size * 0.82, x + size * 1.5, y + size * 0.44);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (job === "patrol") {
    ctx.fillStyle = hasRisk ? "rgba(246, 240, 182, 0.42)" : "rgba(246, 240, 182, 0.3)";
    ctx.beginPath();
    ctx.moveTo(x + size * 0.5, y + size * 0.48);
    ctx.arc(x + size * 0.5, y + size * 0.48, hasRisk ? size * 0.88 : size * 0.72, -0.38, 0.38);
    ctx.closePath();
    ctx.fill();
    if (hasRisk) {
      ctx.strokeStyle = "rgba(224, 182, 109, 0.58)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y + size * 0.48);
      ctx.lineTo(x + size * 1.25, y + size * 0.2 + Math.sin(tick) * 6);
      ctx.stroke();
    }
  } else if (job === "garden") {
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = i % 2 ? profile.base : profile.accent;
      ctx.beginPath();
      ctx.ellipse(x + size * 0.78 + Math.cos(tick + i) * 24, y + size * 0.32 + Math.sin(tick * 0.8 + i) * 16, 5, 9, i, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawSpiritWorkRangeAuraWorld({
  ctx,
  range = null,
  profile = {},
  station = null,
  index = 0,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !range || !station) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.8 + index) * 3;
  const centerX = station.x + station.size * 0.5;
  const centerY = station.y + station.size * 0.66;
  const radiusX = Math.max(station.size * 0.54, station.size * (0.18 + range.rangeX * 0.12));
  const radiusY = Math.max(station.size * 0.18, station.size * (0.1 + range.rangeY * 0.035));
  const alpha = range.evolved ? 0.28 : 0.14;

  ctx.save();
  ctx.fillStyle = range.evolved ? profile.glow : "rgba(255, 253, 245, 0.16)";
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX + pulse, radiusY + pulse / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = range.evolved ? 0.82 : 0.48;
  ctx.strokeStyle = range.evolved ? `${profile.accent}88` : "rgba(93, 111, 101, 0.36)";
  ctx.lineWidth = range.evolved ? 3 : 2;
  if (!range.evolved) ctx.setLineDash([6, 9]);
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX + pulse, radiusY + pulse / 3, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  if (range.evolved) {
    const spokeCount = Math.min(10, Math.max(4, Math.round(range.area / 4)));
    ctx.strokeStyle = `${profile.accent}55`;
    ctx.lineWidth = 1.5;
    for (let spoke = 0; spoke < spokeCount; spoke += 1) {
      const angle = (Math.PI * 2 * spoke) / spokeCount + motion * 0.12;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * radiusX * 0.32, centerY + Math.sin(angle) * radiusY * 0.32);
      ctx.lineTo(centerX + Math.cos(angle) * radiusX * 0.88, centerY + Math.sin(angle) * radiusY * 0.88);
      ctx.stroke();
    }
  }

  const tagWidth = range.evolved ? 142 : 108;
  const tagX = Math.max(16, Math.min(ctx.canvas.width - tagWidth - 16, station.x + station.size * 0.1));
  const tagY = Math.max(30, station.y + station.size + 36 + (index % 2) * 6);
  drawCanvasCard(ctx, tagX, tagY, tagWidth, range.evolved ? 44 : 34, range.evolved ? "rgba(255, 248, 232, 0.82)" : "rgba(255, 253, 245, 0.58)");
  ctx.fillStyle = range.evolved ? profile.accent : "#5d6f65";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${range.stageName} · ${range.rangeLabel}`.slice(0, 15), tagX + 10, tagY + 17);
  if (range.evolved) {
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText("工作范围已扩大", tagX + 10, tagY + 34);
  }
  ctx.restore();
  return true;
}
