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

export function drawSpiritJobPersonaBubbleWorld({
  ctx,
  persona = null,
  station = null,
  pulse = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !persona || !station) return false;
  const x = station.x + station.size * 0.42;
  const y = station.y - 28 + pulse;
  const width = Math.min(172, Math.max(112, persona.shortLine.length * 11));
  ctx.save();
  drawCanvasCard(ctx, x, y, width, 42, "rgba(255, 253, 245, 0.84)");
  ctx.fillStyle = persona.tone === "ember" ? "#be4f37" : persona.tone === "gold" ? "#b47d2f" : persona.tone === "water" || persona.tone === "sky" ? "#4d91a6" : persona.tone === "flower" ? "#d87f8d" : "#286f58";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${persona.glyph} ${persona.action}`.slice(0, 14), x + 12, y + 18);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(persona.focus.slice(0, 12), x + 12, y + 34);
  ctx.restore();
  return true;
}

export function drawSpiritWorldLifeStatusWorld({
  ctx,
  spec = null,
  station = null,
  index = 0,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec || !station) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 2.5;
  const compact = index >= 4 && spec.tone === "good";
  const width = compact ? 104 : 168;
  const height = compact ? 34 : 72;
  const x = Math.max(16, Math.min(ctx.canvas.width - width - 16, station.x + station.size * 0.56));
  const y = Math.max(18, Math.min(ctx.canvas.height - height - 18, station.y + station.size * 0.06 + (index % 2) * 10 + pulse));

  ctx.save();
  ctx.fillStyle = spec.glow;
  ctx.beginPath();
  ctx.ellipse(station.x + station.size * 0.52, station.y + station.size * 0.92, station.size * 0.54 + pulse, station.size * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, width, height, spec.fill);
  ctx.strokeStyle = spec.stroke;
  ctx.lineWidth = spec.tone === "need" || spec.tone === "rare" ? 2.2 : 1.4;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, compact ? 12 : 16);
  ctx.stroke();

  ctx.fillStyle = spec.color;
  ctx.beginPath();
  ctx.roundRect(x + 10, y + 10, compact ? 24 : 34, compact ? 20 : 34, compact ? 8 : 12);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = compact ? "700 11px Microsoft YaHei" : "800 16px Microsoft YaHei";
  ctx.fillText(spec.glyph.slice(0, 1), x + (compact ? 17 : 21), y + (compact ? 25 : 33));

  ctx.fillStyle = "#17231d";
  ctx.font = compact ? "700 10px Microsoft YaHei" : "700 12px Microsoft YaHei";
  ctx.fillText((compact ? spec.headline.replace(" · 今日状态", "") : spec.headline).slice(0, compact ? 8 : 12), x + (compact ? 42 : 54), y + (compact ? 17 : 22));
  ctx.fillStyle = spec.color;
  ctx.font = compact ? "9px Microsoft YaHei" : "11px Microsoft YaHei";
  ctx.fillText((compact ? spec.action : spec.detail).slice(0, compact ? 8 : 16), x + (compact ? 42 : 54), y + (compact ? 29 : 40));

  if (!compact) {
    spec.chips.forEach((chip, chipIndex) => {
      const chipX = x + 12 + chipIndex * 50;
      const chipY = y + 50;
      const low = chip.value < (chip.key === "hunger" ? 45 : 60);
      ctx.fillStyle = low ? "rgba(190, 79, 55, 0.12)" : "rgba(255, 253, 245, 0.62)";
      ctx.beginPath();
      ctx.roundRect(chipX, chipY, 44, 18, 7);
      ctx.fill();
      ctx.fillStyle = low ? "#be4f37" : "#5d6f65";
      ctx.font = "700 9px Microsoft YaHei";
      ctx.fillText(`${chip.glyph}${chip.value}`, chipX + 6, chipY + 13);
    });
  }

  if (spec.tone === "need" || spec.tone === "rare") {
    ctx.strokeStyle = spec.color;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 6]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
    ctx.beginPath();
    ctx.moveTo(x + 14, y + height - 8);
    ctx.quadraticCurveTo(station.x + station.size * 0.8, station.y + station.size * 0.2, station.x + station.size * 0.5, station.y + station.size * 0.48);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
  return true;
}

export function drawSpiritDailyChorePropWorld({
  ctx,
  chore = null,
  station = null,
  index = 0,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !chore || !station) return false;
  const palette = {
    water: { fill: "rgba(232, 246, 242, 0.9)", stroke: "#4d91a6", text: "#286f58" },
    ember: { fill: "rgba(255, 240, 232, 0.9)", stroke: "#be4f37", text: "#8f5f3f" },
    gold: { fill: "rgba(255, 248, 232, 0.92)", stroke: "#b47d2f", text: "#8f5f3f" },
    jade: { fill: "rgba(237, 243, 223, 0.9)", stroke: "#286f58", text: "#286f58" },
    sky: { fill: "rgba(232, 246, 242, 0.88)", stroke: "#4d91a6", text: "#286f58" },
    flower: { fill: "rgba(255, 242, 238, 0.9)", stroke: "#d87f8d", text: "#8f5f3f" },
  };
  const colors = palette[chore.tone] || palette.jade;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2;
  const cardWidth = chore.seasonal ? 138 : 116;
  const x = Math.max(12, Math.min(ctx.canvas.width - cardWidth - 2, station.x - 8 + (index % 2) * 22));
  const y = Math.max(20, station.y + station.size * 0.58 + pulse);

  ctx.save();
  ctx.fillStyle = colors.fill;
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.roundRect(x, y, cardWidth, 38, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = `${colors.stroke}24`;
  ctx.beginPath();
  ctx.arc(x + 20, y + 19, 14 + pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.stroke;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(chore.glyph.slice(0, 1), x + 15, y + 24);
  ctx.fillStyle = colors.text;
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(chore.prop.slice(0, 6), x + 38, y + 16);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(chore.action.slice(0, 8), x + 38, y + 30);

  if (chore.seasonal) {
    const seasonalTone = chore.seasonal.tone || "clear";
    const seasonalColor = seasonalTone.includes("rain") ? "#4d91a6"
      : seasonalTone.includes("heat") ? "#be4f37"
        : seasonalTone.includes("cold") ? "#8f5f3f"
          : seasonalTone.includes("mist") ? "#5d6f65"
            : seasonalTone.includes("dew") ? "#286f58"
              : "#b47d2f";
    ctx.fillStyle = `${seasonalColor}22`;
    ctx.beginPath();
    ctx.roundRect(x + cardWidth - 42, y + 7, 32, 24, 9);
    ctx.fill();
    ctx.strokeStyle = `${seasonalColor}66`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = seasonalColor;
    ctx.font = "900 11px Microsoft YaHei";
    ctx.fillText(chore.seasonal.glyph.slice(0, 1), x + cardWidth - 33, y + 23);
  }

  if (chore.rareMoment || chore.synergy) {
    ctx.fillStyle = chore.rareMoment ? "#d87f8d" : "#e0b66d";
    ctx.beginPath();
    ctx.arc(x + 104, y + 10, 4 + pulse * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return true;
}

export function drawSpiritCompanionCareHintWorld({
  ctx,
  care = null,
  station = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !care || !station) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion) * 3;
  const centerX = station.x + station.size * 0.54;
  const centerY = station.y + station.size * 0.58;
  const shouldShowBadge = care.tone !== "good" || care.status === "还在熟悉你" || care.rareMoment;

  ctx.save();
  ctx.fillStyle = care.halo;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + station.size * 0.28, station.size * 0.44 + pulse, station.size * 0.16 + pulse / 3, 0, 0, Math.PI * 2);
  ctx.fill();

  if (!shouldShowBadge) {
    ctx.strokeStyle = care.stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX + station.size * 0.36, station.y + station.size * 0.18 + pulse, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return true;
  }

  const width = care.label.length > 5 ? 122 : 104;
  const x = Math.max(12, Math.min(ctx.canvas.width - width - 12, station.x + station.size * 0.2));
  const y = Math.max(18, station.y + station.size * 0.82 + pulse);
  drawCanvasCard(ctx, x, y, width, 42, care.fill);
  ctx.fillStyle = care.color;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(care.label.slice(0, 8), x + 12, y + 17);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(care.detail.slice(0, 9), x + 12, y + 33);

  ctx.fillStyle = care.mark;
  const iconX = x + width - 22;
  const iconY = y + 14;
  if (care.tone === "rare") {
    ctx.beginPath();
    ctx.moveTo(iconX, iconY - 7);
    ctx.lineTo(iconX + 8, iconY + 2);
    ctx.lineTo(iconX + 1, iconY + 11);
    ctx.lineTo(iconX - 7, iconY + 2);
    ctx.closePath();
    ctx.fill();
  } else if (care.tone === "need") {
    ctx.beginPath();
    ctx.arc(iconX, iconY + 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
    ctx.fillRect(iconX - 4, iconY, 8, 2);
  } else {
    ctx.beginPath();
    ctx.arc(iconX - 4, iconY, 5, 0, Math.PI * 2);
    ctx.arc(iconX + 4, iconY, 5, 0, Math.PI * 2);
    ctx.moveTo(iconX - 9, iconY + 3);
    ctx.quadraticCurveTo(iconX, iconY + 13, iconX + 9, iconY + 3);
    ctx.fill();
  }
  ctx.restore();
  return true;
}
