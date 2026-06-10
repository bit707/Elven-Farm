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

export function drawSpiritIdentityMemoryNameplateWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  active = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.8) * 1.8;

  ctx.save();
  ctx.globalAlpha = spec.tone === "quiet" ? 0.86 : 0.96;
  ctx.strokeStyle = active ? `${spec.accent}dd` : `${spec.accent}66`;
  ctx.lineWidth = active ? 2.4 : 1.4;
  ctx.setLineDash(active ? [5, 5] : []);
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + 18, rect.y + rect.height + 10 + bob, rect.x + 22, rect.y + rect.height - 3 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, spec.fill);
  ctx.strokeStyle = active ? `${spec.accent}ee` : `${spec.accent}77`;
  ctx.lineWidth = active ? 2.3 : 1.3;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + bob, rect.width - 2, rect.height - 2, 14);
  ctx.stroke();

  ctx.fillStyle = `${spec.accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 8, rect.y + 8 + bob, 28, 28, 10);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.glyph.slice(0, 1), rect.x + 16, rect.y + 27 + bob);

  ctx.fillStyle = spec.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 42, rect.y + 15 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(spec.spiritName.slice(0, 7), rect.x + 42, rect.y + 31 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.behaviorText.slice(0, spec.rect.width > 140 ? 9 : 7), rect.x + 84, rect.y + 31 + bob);

  const hookRows = [
    { label: "名", text: spec.spiritName },
    { label: "动", text: spec.behaviorText },
    { label: "言", text: spec.quoteShort || spec.quote || "嗯嗯" },
  ];
  hookRows.forEach((hook, hookIndex) => {
    const hookX = rect.x + 42 + hookIndex * 50;
    const hookY = rect.y + 38 + bob;
    ctx.fillStyle = hookIndex === 0 ? "rgba(202, 235, 210, 0.36)" : hookIndex === 1 ? "rgba(246, 240, 182, 0.32)" : "rgba(255, 253, 245, 0.82)";
    ctx.beginPath();
    ctx.roundRect(hookX, hookY, 44, 15, 7);
    ctx.fill();
    ctx.fillStyle = hookIndex === 0 ? "#286f58" : hookIndex === 1 ? "#b47d2f" : "#8f5f3f";
    ctx.font = "900 7px Microsoft YaHei";
    ctx.fillText(hook.label, hookX + 5, hookY + 10);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 7px Microsoft YaHei";
    ctx.fillText(String(hook.text || "").slice(0, 4), hookX + 14, hookY + 10);
  });

  if (spec.tone !== "quiet") {
    ctx.fillStyle = spec.tone === "rare" ? "rgba(216, 127, 141, 0.18)" : "rgba(40, 111, 88, 0.14)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 42, rect.y + 55 + bob, rect.width - 52, 12, 6);
    ctx.fill();
    ctx.fillStyle = spec.tone === "rare" ? "#8f5f3f" : "#286f58";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(`${spec.bondText} · 可点`.slice(0, 16), rect.x + 48, rect.y + 64 + bob);
  }
  ctx.restore();
  return true;
}

export function drawSpiritFinaleCompanionAnchorWorld({
  ctx,
  finale = null,
  station = null,
  index = 0,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !finale || !station) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 4;
  const centerX = station.x + station.size * 0.52;
  const centerY = station.y + station.size * 0.78;
  const accent = finale.accent || finale.profile.accent;

  ctx.save();
  ctx.fillStyle = finale.glow || "rgba(246, 240, 182, 0.24)";
  ctx.globalAlpha = 0.72;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 16, station.size * 0.62 + pulse, station.size * 0.2 + pulse / 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.92;
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 2.6;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 18;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 14, station.size * 0.62 + pulse, station.size * 0.2 + pulse / 4, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 5; i += 1) {
    const angle = motion * 0.7 + i * 1.26;
    ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.76)" : `${accent}99`;
    ctx.beginPath();
    ctx.arc(centerX + Math.cos(angle) * station.size * 0.44, centerY + 6 + Math.sin(angle) * station.size * 0.16, 2.7, 0, Math.PI * 2);
    ctx.fill();
  }

  const tagWidth = 146;
  const tagX = Math.max(16, Math.min(ctx.canvas.width - tagWidth - 16, station.x + station.size * 0.18));
  const tagY = Math.max(34, station.y + station.size + 62 + (index % 2) * 8);
  drawCanvasCard(ctx, tagX, tagY, tagWidth, 48, "rgba(255, 248, 232, 0.86)");
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${finale.glyph} ${finale.title}`.slice(0, 12), tagX + 10, tagY + 18);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(finale.anchorLabel.slice(0, 11), tagX + 10, tagY + 34);
  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(tagX + tagWidth - 34, tagY + 9, 22, 22, 9);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(finale.glyph.slice(0, 1), tagX + tagWidth - 27, tagY + 25);
  ctx.restore();
  return true;
}

export function drawSpiritMoodRepairWorldSceneWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  active = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, anchor, event, spirit, profile } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.9) * 2.4;
  const cardY = rect.y + bob;
  const accent = profile.accent || "#be4f37";

  ctx.save();
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.76)" : "rgba(190, 79, 55, 0.42)";
  ctx.lineWidth = active ? 2.6 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + 36, cardY + rect.height - 16);
  ctx.quadraticCurveTo(anchor.x - 38, cardY + rect.height + 34, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255, 248, 232, 0.68)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 18, 50 + Math.max(0, bob), 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(190, 79, 55, 0.18)";
  ctx.beginPath();
  ctx.roundRect(anchor.x - 38, anchor.y - 2, 76, 28, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.32)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(anchor.x - 38, anchor.y - 2, 76, 28, 12);
  ctx.stroke();
  ctx.fillStyle = "rgba(246, 240, 182, 0.82)";
  ctx.beginPath();
  ctx.arc(anchor.x + 38, anchor.y - 16 + bob, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.38)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(anchor.x + 38, anchor.y - 16 + bob, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(77, 145, 166, 0.36)";
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(anchor.x + 35 + i * 4, anchor.y - 30 - i * 3 + bob, 2, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 240, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : "rgba(190, 79, 55, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 52, 48, 15);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(event.glyph || "安", rect.x + 31, cardY + 43);

  ctx.fillStyle = "#be4f37";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 82, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(`${spirit.name} · ${spec.headline}`.slice(0, 18), rect.x + 82, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 32), rect.x + 82, cardY + 64);

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 76, rect.width - 32, 28, 12);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`安抚：${spec.action}`.slice(0, 30), rect.x + 28, cardY + 93);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 43, cardY + 24);

  ctx.restore();
  return true;
}

export function drawSpiritCareNeedWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  active = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, anchor, profile } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.72) * 2;
  const accent = spec.needKind === "hunger" ? "#b47d2f" : spec.needKind === "mood" ? "#d87f8d" : profile.accent || "#4d91a6";
  const glyph = spec.needKind === "hunger" ? "食" : spec.needKind === "mood" ? "摸" : "歇";
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(rect.x + 34, cardY + rect.height - 12);
  ctx.quadraticCurveTo(anchor.x - 26, cardY + rect.height + 26, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = `${accent}18`;
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 18, 42 + Math.abs(bob), 13, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.needKind === "hunger" ? "rgba(255, 248, 232, 0.96)" : "rgba(255, 253, 245, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 17);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 15, 50, 48, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(glyph, rect.x + 30, cardY + 45);
  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 19, cardY + 55, 40, 17, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.actionLabel.slice(0, 4), rect.x + 27, cardY + 67);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.cta, rect.x + 80, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 80, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.statusText.slice(0, 30), rect.x + 80, cardY + 65);

  ctx.fillStyle = "rgba(237, 243, 223, 0.74)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + 76, rect.width - 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`下一步：${spec.detail}`.slice(0, 34), rect.x + 28, cardY + 89);

  if (!reducedMotion) {
    ctx.fillStyle = `${accent}88`;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 42 + i * 8, cardY + 21 + Math.sin(motion * 2.1 + i) * 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawSpiritJobShiftFeedbackWorld({
  ctx,
  width = 960,
  height = 640,
  feedback = null,
  station = null,
  motion = 0,
  reducedMotion = false,
  startX = 0,
  startY = 0,
  targetX = 0,
  targetY = 0,
  tokenX = 0,
  tokenY = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback || !station) return false;
  const accent = feedback.accent || "#286f58";

  ctx.save();
  ctx.globalAlpha = feedback.fade;
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 3;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 24;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo((startX + targetX) / 2, Math.min(startY, targetY) - 86, targetX, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = feedback.glow || "rgba(246, 240, 182, 0.24)";
  ctx.beginPath();
  ctx.ellipse(targetX, targetY + station.size * 0.4, station.size * 0.54 + Math.sin(motion * 3) * 3, station.size * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `${accent}99`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(targetX, targetY, 34 + Math.sin(motion * 3.4) * (reducedMotion ? 0 : 3), 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(tokenX - 20, tokenY - 18, 40, 36, 13);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "700 20px Microsoft YaHei";
  ctx.fillText(feedback.glyph || "灵", tokenX - 10, tokenY + 8);

  const cardX = Math.max(28, Math.min(width - 288, targetX + 34));
  const cardY = Math.max(76, Math.min(height - 124, targetY - 72));
  drawCanvasCard(ctx, cardX, cardY, 268, 102, "rgba(255, 248, 232, 0.94)");
  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(cardX + 16, cardY + 16, 48, 54, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "700 24px Microsoft YaHei";
  ctx.fillText(feedback.glyph || "灵", cardX + 29, cardY + 52);
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText("岗位调度回声", cardX + 80, cardY + 26);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 17px Microsoft YaHei";
  ctx.fillText(`${feedback.spiritName} · ${feedback.jobName}`.slice(0, 16), cardX + 80, cardY + 52);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${feedback.action} · 效率 ${feedback.efficiency}`.slice(0, 25), cardX + 80, cardY + 74);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${feedback.focus} · ${feedback.specialty}`.slice(0, 32), cardX + 18, cardY + 94);
  ctx.restore();
  return true;
}

export function drawSpiritNightWorkFeedbackWorld({
  ctx,
  width = 960,
  height = 640,
  feedback = null,
  motion = 0,
  progress = 1,
  wave = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;

  ctx.save();
  ctx.globalAlpha = feedback.fade;
  ctx.fillStyle = `rgba(16, 27, 32, ${0.1 * (feedback.fade || 1)})`;
  ctx.fillRect(0, 0, width, height);

  (feedback.synergies || []).forEach((synergy, index) => {
    const stations = (synergy.entries || [])
      .map((entry) => feedback.entries.find((candidate) => candidate.spiritName === entry.spirit)?.station)
      .filter(Boolean);
    if (stations.length < 2) return;
    const from = stations[0];
    const to = stations[1];
    const fromX = from.x + from.size * 0.5;
    const fromY = from.y + from.size * 0.52;
    const toX = to.x + to.size * 0.5;
    const toY = to.y + to.size * 0.52;
    const dash = reducedMotion ? 0 : -motion * (18 + index * 5);
    ctx.save();
    ctx.globalAlpha = 0.44 + wave * 0.32;
    ctx.strokeStyle = synergy.accent || "#e0b66d";
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 12]);
    ctx.lineDashOffset = dash;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.bezierCurveTo((fromX + toX) / 2, Math.min(fromY, toY) - 48 - index * 12, (fromX + toX) / 2, Math.max(fromY, toY) + 28, toX, toY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
    ctx.beginPath();
    ctx.arc((fromX + toX) / 2, (fromY + toY) / 2 - 18, 14 + wave * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = synergy.accent || "#b47d2f";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText((synergy.glyph || "协").slice(0, 1), (fromX + toX) / 2 - 6, (fromY + toY) / 2 - 13);
    ctx.restore();
  });

  feedback.entries.forEach((entry, index) => {
    const station = entry.station || { x: 320, y: 320, size: 82 };
    const cx = station.x + station.size * 0.5;
    const cy = station.y + station.size * 0.52;
    const local = Math.max(0, Math.min(1, progress * 1.2 - index * 0.08));
    const pulse = reducedMotion ? 0 : Math.sin(motion * 4 + index) * 3;
    const ring = station.size * (0.28 + local * 0.36);
    ctx.fillStyle = entry.glow || "rgba(246, 240, 182, 0.24)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + station.size * 0.24, station.size * 0.46 + pulse, station.size * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `${entry.accent || "#286f58"}aa`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, ring, 0, Math.PI * 2);
    ctx.stroke();

    for (let mote = 0; mote < 5; mote += 1) {
      const angle = motion * 1.4 + mote * 1.26 + index;
      const radius = ring * (0.62 + mote * 0.06);
      ctx.fillStyle = mote % 2 ? "rgba(255, 248, 232, 0.78)" : "rgba(246, 240, 182, 0.72)";
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius * 0.58, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const tagWidth = Math.min(176, Math.max(118, String(entry.text || "").length * 8));
    const tagX = Math.max(18, Math.min(width - tagWidth - 18, cx + 24));
    const tagY = Math.max(48, Math.min(height - 74, cy - 54 - index * 3));
    drawCanvasCard(ctx, tagX, tagY, tagWidth, 48, "rgba(255, 248, 232, 0.88)");
    ctx.fillStyle = entry.accent || "#286f58";
    ctx.font = "700 12px Microsoft YaHei";
    ctx.fillText(`${entry.glyph || "灵"} ${entry.spiritName}`.slice(0, 12), tagX + 12, tagY + 18);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "11px Microsoft YaHei";
    ctx.fillText(String(entry.text || entry.focus || "夜勤完成").slice(0, 18), tagX + 12, tagY + 36);
  });

  const cardX = Math.max(36, width - 356);
  const cardY = Math.max(132, height - 210);
  drawCanvasCard(ctx, cardX, cardY, 318, 118, "rgba(255, 248, 232, 0.95)");
  ctx.fillStyle = "rgba(246, 240, 182, 0.22)";
  ctx.beginPath();
  ctx.roundRect(cardX + 18, cardY + 18, 54, 68, 16);
  ctx.fill();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "700 28px Microsoft YaHei";
  ctx.fillText("勤", cardX + 32, cardY + 60);
  ctx.fillStyle = "#b47d2f";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText("精怪夜勤回声", cardX + 88, cardY + 28);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 18px Microsoft YaHei";
  ctx.fillText(feedback.headline.slice(0, 18), cardX + 88, cardY + 54);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`总影响 ${feedback.totalImpact} · 协作链 ${(feedback.synergies || []).length} · 次日已结算`, cardX + 88, cardY + 76);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 38), cardX + 20, cardY + 100);
  ctx.restore();
  return true;
}

export function drawSpiritSpriteWorld({
  ctx,
  spirit = null,
  x = 0,
  y = 0,
  size = 112,
  profile = {},
  bob = 0,
  isFire = false,
  spiritImage = null,
} = {}) {
  if (!ctx || !spirit) return false;
  ctx.save();
  if (profile.shape === "root" && spiritImage) {
    ctx.fillStyle = profile.glow;
    ctx.beginPath();
    ctx.ellipse(x + size * 0.48, y + size * 0.78, size * 0.42, size * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(spiritImage, x, y, size, size);
  } else {
    ctx.fillStyle = profile.glow;
    ctx.beginPath();
    ctx.ellipse(x + size * 0.48, y + size * 0.78, size * 0.42, size * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    if (profile.shape === "bamboo") {
      ctx.fillStyle = profile.base;
      ctx.beginPath();
      ctx.roundRect(x + size * 0.34, y + bob + size * 0.08, size * 0.28, size * 0.8, size * 0.12);
      ctx.fill();
      ctx.strokeStyle = profile.accent;
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.moveTo(x + size * 0.34, y + bob + size * (0.28 + i * 0.18));
        ctx.lineTo(x + size * 0.62, y + bob + size * (0.28 + i * 0.18));
        ctx.stroke();
      }
      ctx.fillStyle = "#7ba66c";
      ctx.beginPath();
      ctx.ellipse(x + size * 0.68, y + bob + size * 0.28, size * 0.24, size * 0.08, -0.55, 0, Math.PI * 2);
      ctx.ellipse(x + size * 0.28, y + bob + size * 0.44, size * 0.22, size * 0.07, 0.48, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = profile.accent;
      ctx.beginPath();
      ctx.moveTo(x + size * 0.62, y + bob + size * 0.02);
      ctx.lineTo(x + size * 0.5, y + bob + size * 0.22);
      ctx.lineTo(x + size * 0.62, y + bob + size * 0.2);
      ctx.lineTo(x + size * 0.48, y + bob + size * 0.42);
      ctx.stroke();
    } else if (profile.shape === "lotus") {
      ctx.fillStyle = "rgba(77, 145, 166, 0.32)";
      ctx.beginPath();
      ctx.ellipse(x + size * 0.5, y + bob + size * 0.74, size * 0.42, size * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 6; i += 1) {
        ctx.fillStyle = i % 2 ? profile.base : "#fffdf5";
        ctx.beginPath();
        ctx.ellipse(x + size * 0.5 + Math.cos(i) * size * 0.18, y + bob + size * 0.42 + Math.sin(i) * size * 0.1, size * 0.16, size * 0.28, i, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (profile.shape === "lantern") {
      ctx.strokeStyle = profile.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y + bob);
      ctx.lineTo(x + size * 0.5, y + bob + size * 0.16);
      ctx.stroke();
      ctx.fillStyle = profile.base;
      ctx.beginPath();
      ctx.roundRect(x + size * 0.25, y + bob + size * 0.18, size * 0.5, size * 0.56, size * 0.18);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 253, 245, 0.55)";
      ctx.fillRect(x + size * 0.36, y + bob + size * 0.26, size * 0.28, size * 0.38);
    } else if (profile.shape === "flower") {
      for (let i = 0; i < 7; i += 1) {
        ctx.fillStyle = i % 2 ? profile.base : "#f5a4aa";
        ctx.beginPath();
        ctx.ellipse(x + size * 0.5 + Math.cos(i) * size * 0.2, y + bob + size * 0.32 + Math.sin(i) * size * 0.16, size * 0.14, size * 0.22, i, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = profile.accent;
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + bob + size * 0.34, size * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5d8b52";
      ctx.beginPath();
      ctx.roundRect(x + size * 0.42, y + bob + size * 0.48, size * 0.16, size * 0.38, size * 0.08);
      ctx.fill();
    } else if (profile.shape === "scroll") {
      ctx.fillStyle = profile.base;
      ctx.beginPath();
      ctx.roundRect(x + size * 0.26, y + bob + size * 0.22, size * 0.5, size * 0.54, size * 0.08);
      ctx.fill();
      ctx.strokeStyle = profile.accent;
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.moveTo(x + size * 0.36, y + bob + size * (0.36 + i * 0.12));
        ctx.lineTo(x + size * 0.66, y + bob + size * (0.36 + i * 0.12));
        ctx.stroke();
      }
      ctx.fillStyle = "#e0b66d";
      ctx.beginPath();
      ctx.arc(x + size * 0.26, y + bob + size * 0.28, size * 0.08, 0, Math.PI * 2);
      ctx.arc(x + size * 0.76, y + bob + size * 0.72, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else if (profile.shape === "bee") {
      ctx.fillStyle = "rgba(255, 253, 245, 0.58)";
      ctx.beginPath();
      ctx.ellipse(x + size * 0.34, y + bob + size * 0.28, size * 0.16, size * 0.26, -0.7, 0, Math.PI * 2);
      ctx.ellipse(x + size * 0.64, y + bob + size * 0.28, size * 0.16, size * 0.26, 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = profile.base;
      ctx.beginPath();
      ctx.ellipse(x + size * 0.5, y + bob + size * 0.54, size * 0.34, size * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = profile.accent;
      ctx.lineWidth = 4;
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.moveTo(x + size * (0.34 + i * 0.11), y + bob + size * 0.32);
        ctx.lineTo(x + size * (0.34 + i * 0.11), y + bob + size * 0.74);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = isFire ? "#be4f37" : profile.base;
      ctx.beginPath();
      ctx.moveTo(x + size * 0.48, y + bob + size * 0.08);
      ctx.bezierCurveTo(x + size * 0.88, y + bob + size * 0.34, x + size * 0.78, y + bob + size * 0.84, x + size * 0.48, y + bob + size * 0.92);
      ctx.bezierCurveTo(x + size * 0.18, y + bob + size * 0.84, x + size * 0.08, y + bob + size * 0.34, x + size * 0.48, y + bob + size * 0.08);
      ctx.fill();
      if (isFire) {
        ctx.fillStyle = "rgba(247, 211, 109, 0.92)";
        ctx.beginPath();
        ctx.moveTo(x + size * 0.42, y + bob + size * 0.02);
        ctx.lineTo(x + size * 0.52, y + bob - size * 0.14);
        ctx.lineTo(x + size * 0.62, y + bob + size * 0.06);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.fillStyle = profile.shape === "scroll" ? profile.accent : profile.accent;
    ctx.beginPath();
    ctx.arc(x + size * 0.38, y + bob + size * 0.5, Math.max(3.2, size * 0.04), 0, Math.PI * 2);
    ctx.arc(x + size * 0.58, y + bob + size * 0.5, Math.max(3.2, size * 0.04), 0, Math.PI * 2);
    ctx.fill();
    if (profile.shape === "lantern") {
      ctx.fillStyle = "rgba(190, 79, 55, 0.82)";
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + bob + size * 0.64, size * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(x - 6, y + size + 4, size + 24, 30, 12);
  ctx.fill();
  ctx.fillStyle = isFire ? "#be4f37" : "#286f58";
  ctx.font = "700 14px Microsoft YaHei";
  ctx.fillText(spirit.name.slice(0, 8), x + 6, y + size + 24);
  ctx.restore();
  return true;
}

export function drawSpiritInteractionWorldEchoWorld({
  ctx,
  spec = null,
  station = null,
  motion = 0,
  pulse = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !station) return false;
  const { rect } = spec;
  const spiritX = station.x + station.size * 0.5;
  const spiritY = station.y + station.size * 0.38;

  ctx.save();
  ctx.fillStyle = spec.glow;
  ctx.beginPath();
  ctx.ellipse(spiritX, station.y + station.size * 0.82, station.size * 0.58 + pulse, station.size * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `${spec.accent}88`;
  ctx.lineWidth = 1.8;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(rect.x + 22, rect.y + rect.height - 10);
  ctx.quadraticCurveTo(rect.x - 16, rect.y + rect.height + 18, spiritX, spiritY);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.firstInteraction ? "rgba(255, 244, 224, 0.95)" : "rgba(255, 248, 232, 0.92)");
  ctx.strokeStyle = `${spec.accent}aa`;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = `${spec.accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 13 + pulse, 44, 44, 15);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(spec.glyph.slice(0, 1), rect.x + 25, rect.y + 42 + pulse);

  ctx.fillStyle = spec.type === "feed" ? "rgba(224, 182, 109, 0.22)" : spec.firstInteraction ? "rgba(246, 240, 182, 0.3)" : "rgba(202, 235, 210, 0.24)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 62, rect.y + 14 + pulse, 42, 42, 14);
  ctx.fill();
  ctx.fillStyle = spec.type === "feed" ? "#b47d2f" : spec.accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText(spec.propGlyph.slice(0, 1), rect.x + rect.width - 49, rect.y + 42 + pulse);
  for (let mote = 0; mote < 4; mote += 1) {
    const angle = motion * 2 + mote * 1.4;
    ctx.fillStyle = mote % 2 ? "rgba(246, 240, 182, 0.82)" : `${spec.accent}66`;
    ctx.beginPath();
    ctx.arc(rect.x + rect.width - 42 + Math.cos(angle) * (20 + mote), rect.y + 35 + pulse + Math.sin(angle) * 8, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.label.slice(0, 13), rect.x + 66, rect.y + 22 + pulse);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(spec.motionText.slice(0, 13), rect.x + 66, rect.y + 41 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`“${spec.quote}”`.slice(0, 20), rect.x + 66, rect.y + 59 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.72)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 66 + pulse, rect.width - 28, 22, 10);
  ctx.fill();
  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.warmthLine.slice(0, 31), rect.x + 24, rect.y + 81 + pulse);

  ctx.fillStyle = "rgba(190, 79, 55, 0.12)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 92 + pulse, 76, 19, 8);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.bondText, rect.x + 25, rect.y + 106 + pulse);

  ctx.fillStyle = spec.firstInteraction ? "rgba(224, 182, 109, 0.24)" : "rgba(40, 111, 88, 0.12)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 96, rect.y + 92 + pulse, rect.width - 112, 19, 8);
  ctx.fill();
  ctx.fillStyle = spec.firstInteraction ? "#b47d2f" : "#286f58";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.memoryLine.slice(0, 22), rect.x + 106, rect.y + 106 + pulse);
  ctx.restore();
  return true;
}

export function drawSpiritBondHeartlineWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  ctx.save();

  ctx.strokeStyle = active ? `${spec.accent}cc` : `${spec.accent}66`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x - 18, rect.y + rect.height + 18, rect.x + 24, rect.y + rect.height - 12);
  ctx.stroke();
  ctx.setLineDash([]);

  const glow = ctx.createRadialGradient(spec.anchor.x, spec.anchor.y, 10, spec.anchor.x, spec.anchor.y, 86);
  glow.addColorStop(0, spec.glow);
  glow.addColorStop(0.62, "rgba(246, 240, 182, 0.14)");
  glow.addColorStop(1, "rgba(246, 240, 182, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(spec.anchor.x, spec.anchor.y, 86 + pulse, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.entry.firstInteraction ? "rgba(255, 244, 224, 0.94)" : "rgba(255, 253, 245, 0.91)");
  ctx.strokeStyle = active ? `${spec.accent}ee` : `${spec.accent}88`;
  ctx.lineWidth = active ? 2.7 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + pulse, rect.width - 2, rect.height - 2, 17);
  ctx.stroke();

  ctx.fillStyle = `${spec.accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 13 + pulse, 42, 42, 14);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("心", rect.x + 23, rect.y + 40 + pulse);

  ctx.fillStyle = spec.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 66, rect.y + 21 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 24), rect.x + 66, rect.y + 40 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 28), rect.x + 66, rect.y + 55 + pulse);

  const laneX = rect.x + 22;
  const laneY = rect.y + 68 + pulse;
  const gap = 86;
  ctx.strokeStyle = `${spec.accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(laneX + 10, laneY);
  ctx.lineTo(laneX + gap * 2 + 10, laneY);
  ctx.stroke();
  spec.steps.forEach((step, index) => {
    const dotX = laneX + index * gap;
    const strong = index === 2;
    ctx.fillStyle = strong ? `${spec.accent}dd` : "rgba(255, 253, 245, 0.94)";
    ctx.strokeStyle = strong ? spec.accent : `${spec.accent}88`;
    ctx.lineWidth = strong ? 2.3 : 1.5;
    ctx.beginPath();
    ctx.arc(dotX + 10, laneY, strong ? 9 : 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = strong ? "#fffdf5" : spec.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(index + 1), dotX + 7, laneY + 3);
    ctx.fillStyle = strong ? spec.accent : "#8f5f3f";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 4), dotX - 2, laneY + 17);
  });

  const barX = rect.x + rect.width - 88;
  const barY = rect.y + 26 + pulse;
  ctx.fillStyle = "rgba(23, 35, 29, 0.08)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, 64, 8, 4);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(6, 64 * spec.progress), 8, 4);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(spec.progressText, barX + 21, barY + 21);

  if (!reducedMotion) {
    for (let i = 0; i < 5; i += 1) {
      const angle = motion * 1.7 + i * 1.1;
      ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.78)" : `${spec.accent}66`;
      ctx.beginPath();
      ctx.arc(spec.anchor.x + Math.cos(angle) * (28 + i * 4), spec.anchor.y + Math.sin(angle) * 13, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawSpiritInteractionMemoryTriptychWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${spec.accent}dd` : `${spec.accent}66`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + 16, cardY + rect.height + 18, rect.x + 30, cardY + rect.height - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  const glow = ctx.createRadialGradient(spec.anchor.x, spec.anchor.y, 8, spec.anchor.x, spec.anchor.y, 96);
  glow.addColorStop(0, active ? spec.glow : "rgba(246, 240, 182, 0.14)");
  glow.addColorStop(1, "rgba(246, 240, 182, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(spec.anchor.x, spec.anchor.y, active ? 96 : 76, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, active ? "rgba(255, 253, 245, 0.97)" : "rgba(255, 248, 232, 0.93)");
  ctx.strokeStyle = active ? `${spec.accent}ee` : `${spec.accent}88`;
  ctx.lineWidth = active ? 2.5 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = `${spec.accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 44, 44, 15);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("忆", rect.x + 27, cardY + 42);

  ctx.fillStyle = spec.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 70, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 26), rect.x + 70, cardY + 41);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText("点开只定位伙伴栏和生活图鉴", rect.x + 70, cardY + 57);

  const startX = rect.x + 20;
  const nodeY = cardY + 78;
  const gap = 94;
  ctx.strokeStyle = `${spec.accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX + 17, nodeY);
  ctx.lineTo(startX + gap * 2 + 17, nodeY);
  ctx.stroke();
  spec.nodes.forEach((node, index) => {
    const nodeX = startX + index * gap;
    const strong = active || index === 0;
    ctx.fillStyle = index === 0 ? "rgba(202, 235, 210, 0.95)" : index === 1 ? "rgba(246, 240, 182, 0.92)" : "rgba(255, 253, 245, 0.96)";
    ctx.strokeStyle = strong ? spec.accent : `${spec.accent}88`;
    ctx.lineWidth = strong ? 2.2 : 1.4;
    ctx.beginPath();
    ctx.arc(nodeX + 17, nodeY, strong ? 13 : 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = spec.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.short, nodeX + 12, nodeY + 3);
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.label.replace("记住", "").slice(0, 4), nodeX - 2, nodeY + 23);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.text || "").slice(0, 7), nodeX - 2, nodeY + 35);
  });

  ctx.fillStyle = active ? spec.accent : "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(String(spec.recallCheckLine || spec.recallLine || "").slice(0, 36), rect.x + 18, cardY + rect.height - 12);

  if (!reducedMotion) {
    for (let i = 0; i < 4; i += 1) {
      const angle = motion * 1.8 + i * 1.25;
      ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.78)" : `${spec.accent}66`;
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 28 + Math.cos(angle) * (12 + i * 2), cardY + 18 + Math.sin(angle) * 10, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawFirstTwoSpiritDuoWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0.5,
  accent = "#b47d2f",
  focused = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, luoboAnchor, lajiaoAnchor } = spec;
  const cardY = rect.y + bob;
  const cardCenter = { x: rect.x + 38, y: rect.y + rect.height * 0.55 + bob };

  ctx.save();
  ctx.strokeStyle = focused ? "rgba(190, 79, 55, 0.82)" : `${accent}66`;
  ctx.lineWidth = focused ? 3 : 2;
  ctx.setLineDash([7, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 15;
  ctx.beginPath();
  ctx.moveTo(luoboAnchor.x, luoboAnchor.y);
  ctx.quadraticCurveTo((luoboAnchor.x + cardCenter.x) / 2, Math.min(luoboAnchor.y, cardCenter.y) - 42, cardCenter.x, cardCenter.y);
  ctx.quadraticCurveTo((cardCenter.x + lajiaoAnchor.x) / 2, Math.min(cardCenter.y, lajiaoAnchor.y) - 48, lajiaoAnchor.x, lajiaoAnchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 6; i += 1) {
    const t = reducedMotion ? i / 5 : (motion * 0.1 + i * 0.17) % 1;
    const source = t < 0.5 ? luoboAnchor : cardCenter;
    const target = t < 0.5 ? cardCenter : lajiaoAnchor;
    const localT = t < 0.5 ? t * 2 : (t - 0.5) * 2;
    const x = source.x + (target.x - source.x) * localT;
    const y = source.y + (target.y - source.y) * localT - Math.sin(localT * Math.PI) * 30;
    ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.82)" : "rgba(202, 235, 210, 0.82)";
    ctx.beginPath();
    ctx.arc(x, y, 4 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.active ? "rgba(255, 240, 232, 0.95)" : "rgba(248, 252, 247, 0.95)");
  ctx.strokeStyle = focused ? "rgba(190, 79, 55, 0.84)" : `${accent}66`;
  ctx.lineWidth = focused ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 2, cardY + 2, rect.width - 4, rect.height - 4, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(202, 235, 210, 0.36)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 16, 46, 46, 14);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("萝", rect.x + 27, cardY + 46);
  ctx.fillStyle = "rgba(190, 79, 55, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 62, cardY + 16, 46, 46, 14);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("椒", rect.x + 75, cardY + 46);
  ctx.fillStyle = "#f7d36d";
  ctx.beginPath();
  ctx.arc(rect.x + 98, cardY + 24 - pulse * 3, 5 + pulse * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 14), rect.x + 124, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 16px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 15), rect.x + 124, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 18, cardY + 76);

  const barX = rect.x + 18;
  const barY = cardY + 86;
  ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, rect.width - 36, 13, 7);
  ctx.fill();
  ctx.fillStyle = `${accent}aa`;
  ctx.beginPath();
  ctx.roundRect(barX + 2, barY + 2, Math.max(14, (rect.width - 40) * (spec.progress / 100)), 9, 5);
  ctx.fill();

  const chipY = cardY + rect.height - 18;
  [
    { text: spec.farmText, color: "#286f58" },
    { text: spec.recipeText, color: "#be4f37" },
    { text: spec.lajiaoIntroDone ? "已互认" : "待记忆", color: spec.lajiaoIntroDone ? "#286f58" : "#b47d2f" },
  ].forEach((chip, index) => {
    const chipX = rect.x + 16 + index * 88;
    ctx.fillStyle = "rgba(255, 253, 245, 0.66)";
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 78, 17, 8);
    ctx.fill();
    ctx.fillStyle = chip.color;
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(chip.text.slice(0, 7), chipX + 8, chipY + 12);
  });
  ctx.restore();
  return true;
}

export function drawRareSpiritTheaterGlyphWorld({
  ctx,
  lineId = "",
  x = 0,
  y = 0,
  motion = 0,
  pulse = 0,
} = {}) {
  if (!ctx) return false;
  ctx.save();
  if (lineId === "spirit_line_hualing") {
    ["#d87f8d", "#f2d28b", "#fffdf5"].forEach((color, index) => {
      const angle = motion + index * 2.1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(angle) * 12, y + Math.sin(angle) * 8, 5, 10, angle, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (lineId === "spirit_line_leizhu") {
    ctx.strokeStyle = "#e6c65e";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 18);
    ctx.lineTo(x - 14, y + 2 + pulse);
    ctx.lineTo(x + 2, y - 1 + pulse);
    ctx.lineTo(x - 7, y + 20);
    ctx.lineTo(x + 16, y - 8);
    ctx.stroke();
  } else if (lineId === "spirit_line_yuelian") {
    ctx.strokeStyle = "rgba(255, 253, 245, 0.86)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 18 + pulse, Math.PI * 0.18, Math.PI * 1.82);
    ctx.stroke();
    ctx.fillStyle = "rgba(159, 209, 223, 0.36)";
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 24, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (lineId === "spirit_line_dengying") {
    ctx.fillStyle = "rgba(246, 240, 182, 0.82)";
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 18, 18, 28, 8);
    ctx.fill();
    ctx.strokeStyle = "#5b3328";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x, y + 24 + pulse);
    ctx.stroke();
  } else if (lineId === "spirit_line_shuqi") {
    ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
    ctx.beginPath();
    ctx.roundRect(x - 18, y - 14, 36, 26, 5);
    ctx.fill();
    ctx.strokeStyle = "#8f5f3f";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#8f5f3f";
    ctx.fillRect(x - 10, y - 5, 20, 2);
    ctx.fillRect(x - 10, y + 2, 15, 2);
  } else if (lineId === "spirit_line_fengmi") {
    ctx.fillStyle = "#e0b66d";
    ctx.beginPath();
    ctx.arc(x, y, 12 + pulse / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#17231d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 3);
    ctx.lineTo(x + 10, y + 3);
    ctx.moveTo(x - 8, y + 5);
    ctx.lineTo(x + 8, y - 5);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 253, 245, 0.72)";
    ctx.beginPath();
    ctx.ellipse(x - 14, y - 10, 6, 3, -0.5, 0, Math.PI * 2);
    ctx.ellipse(x + 14, y - 10, 6, 3, 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "rgba(202, 235, 210, 0.76)";
    ctx.beginPath();
    ctx.arc(x, y, 13 + pulse / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return true;
}

export function drawRareSpiritTheaterMomentWorld({
  ctx,
  interaction = null,
  station = null,
  profile = {},
  lineId = "",
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !interaction || !station) return false;
  const x = station.x + station.size * 0.48;
  const y = station.y - 78 + Math.sin(motion * 2.1) * (reducedMotion ? 0 : 4);
  const cardWidth = 232;
  const cardHeight = 86;
  const cardX = Math.max(36, Math.min(920 - cardWidth, x));
  const cardY = Math.max(86, y);

  ctx.save();
  ctx.fillStyle = profile.glow || "rgba(246, 240, 182, 0.24)";
  ctx.beginPath();
  ctx.ellipse(station.x + station.size * 0.5, station.y + station.size * 0.72, station.size * 0.62, station.size * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = profile.accent;
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(station.x + station.size * 0.5, station.y + 8);
  ctx.bezierCurveTo(station.x + station.size * 0.72, cardY + cardHeight + 24, cardX + 42, cardY + cardHeight + 18, cardX + 44, cardY + cardHeight);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, cardX, cardY, cardWidth, cardHeight, "rgba(255, 248, 232, 0.94)");
  ctx.fillStyle = profile.glow;
  ctx.beginPath();
  ctx.arc(cardX + 42, cardY + 42, 26, 0, Math.PI * 2);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, lineId, cardX + 42, cardY + 42, motion);

  ctx.fillStyle = profile.accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText("今日小剧场", cardX + 82, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(`${interaction.spiritName} · ${interaction.floatingText || `羁绊 +${interaction.bondGain}`}`.slice(0, 18), cardX + 82, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(String(interaction.actionText || "洞天日常").slice(0, 24), cardX + 82, cardY + 64);
  if (interaction.extraText) {
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText(String(interaction.extraText).slice(0, 30), cardX + 18, cardY + 78);
  }

  for (let i = 0; i < 6; i += 1) {
    const moteX = cardX + 16 + i * 36;
    const moteY = cardY - 4 + Math.sin(motion * 2.4 + i) * 4;
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.84)" : profile.accent;
    ctx.beginPath();
    ctx.arc(moteX, moteY, i % 2 ? 2 : 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return true;
}

export function drawRareSpiritDailyStageWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  active = false,
  profile = {},
  accent = "#286f58",
  rowAccents = [],
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.focus) return false;
  const { rect, focus } = spec;
  const cardY = rect.y + bob;
  const anchorX = spec.anchor?.anchorX || rect.x + rect.width - 62;
  const anchorY = spec.anchor?.anchorY || rect.y + rect.height + 32;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchorX, anchorY);
  ctx.quadraticCurveTo(rect.x + rect.width - 36, cardY + rect.height + 28, rect.x + rect.width - 42, cardY + rect.height - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = profile.glow || "rgba(246, 240, 182, 0.18)";
  ctx.beginPath();
  ctx.ellipse(anchorX, anchorY + 13, 58 + Math.abs(bob), 16, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, focus.giftReady ? "rgba(255, 240, 238, 0.96)" : "rgba(255, 253, 245, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.7 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 15, 60, 58, 16);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, focus.lineId, rect.x + 44, cardY + 43, motion);
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(focus.giftReady ? "回礼" : "日常", rect.x + 31, cardY + 76);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 86, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(`${focus.spiritName} · ${focus.actionShort}`.slice(0, 18), rect.x + 86, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`在${focus.focus}${focus.action}`.slice(0, 32), rect.x + 86, cardY + 65);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`“${focus.quote}”`.slice(0, 30), rect.x + 86, cardY + 83);

  ctx.fillStyle = focus.giftReady ? "rgba(216, 127, 141, 0.16)" : "rgba(202, 235, 210, 0.62)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 78, cardY + 13, 62, 20, 10);
  ctx.fill();
  ctx.fillStyle = focus.giftReady ? "#be4f37" : "#286f58";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 7), rect.x + rect.width - 69, cardY + 27);

  const rowStart = cardY + 104;
  spec.rows.slice(0, 3).forEach((row, index) => {
    const rowY = rowStart + index * 18;
    if (rowY > cardY + rect.height - 8) return;
    const rowAccent = rowAccents[index] || (row.giftReady ? "#d87f8d" : "#286f58");
    ctx.fillStyle = row.giftReady ? "rgba(255, 240, 238, 0.74)" : "rgba(255, 248, 232, 0.74)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 16, rowY - 13, rect.width - 32, 16, 8);
    ctx.fill();
    ctx.fillStyle = rowAccent;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(row.stateLabel.slice(0, 3), rect.x + 28, rowY - 2);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(`${row.spiritName} · ${row.actionShort}`.slice(0, 14), rect.x + 64, rowY - 2);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(`Lv.${row.bondLevel}`, rect.x + rect.width - 48, rowY - 2);
  });

  if (!reducedMotion) {
    for (let i = 0; i < 7; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.9)" : `${accent}88`;
      ctx.beginPath();
      ctx.arc(rect.x + 28 + i * 18, cardY + rect.height + 4 + Math.sin(motion * 2.2 + i) * 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawRareSpiritWorldInvitationWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  palette = {},
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.slot) return false;
  const { rect, slot } = spec;

  ctx.save();
  ctx.strokeStyle = `${palette.accent}88`;
  ctx.lineWidth = 2.3;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(slot.anchorX, slot.anchorY);
  ctx.quadraticCurveTo(rect.x + 32, rect.y + rect.height + 24 + pulse, rect.x + 44, rect.y + rect.height - 6 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.ellipse(slot.anchorX, slot.anchorY + 12, 58 + pulse, 16, -0.08, 0, Math.PI * 2);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, spec.lineId, slot.anchorX, slot.anchorY - 12 + pulse * 0.35, motion);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = `${palette.accent}bb`;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 62, 62, 17);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, spec.lineId, rect.x + 45, rect.y + 45 + pulse, motion);
  ctx.fillStyle = palette.accent;
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 30, rect.y + 76 + pulse);

  ctx.fillStyle = palette.accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 88, rect.y + 23 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 88, rect.y + 46 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 31), rect.x + 88, rect.y + 65 + pulse);

  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 78 + pulse, rect.width - 32, 17, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  const queueText = spec.count > 1 ? `另有 ${spec.count - 1} 条可推进：${spec.nextEvents.join(" / ")}` : `奖励 ${spec.rewardText}`;
  ctx.fillText(`${spec.actionText} · ${queueText}`.slice(0, 36), rect.x + 26, rect.y + 90 + pulse);
  ctx.restore();
  return true;
}

export function drawRareSpiritClueRoadsignWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  active = false,
  palette = {},
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor) return false;
  const { rect, anchor } = spec;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.strokeStyle = active ? `${palette.accent}dd` : `${palette.accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([5, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + 38, cardY + rect.height + 24, rect.x + 36, cardY + rect.height - 4);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 10, 52 + Math.abs(pulse), 14, 0, 0, Math.PI * 2);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, spec.lineId, anchor.x, anchor.y - 12 + pulse * 0.25, motion);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}99`;
  ctx.lineWidth = active ? 2.7 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, cardY, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 58, 17);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 24px Microsoft YaHei";
  ctx.fillText(palette.badge, rect.x + 31, cardY + 50);
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 22, cardY + 58, 42, 16, 8);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 32, cardY + 69);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 17), rect.x + 84, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 84, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.sceneText} · ${spec.actionText}`.slice(0, 38), rect.x + 84, cardY + 62);

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.strokeStyle = `${palette.accent}44`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 78, rect.width - 32, 20, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = spec.tone === "clue" ? "#4d91a6" : "#8f5f3f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText((spec.clueSource || spec.hint || "继续推进相关系统").slice(0, 35), rect.x + 26, cardY + 91);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  const queueText = spec.count > 1 ? `另有 ${spec.count - 1} 条线索：${spec.nextEvents.join(" / ")}` : `奖励预告：${spec.rewardText}`;
  ctx.fillText(`只定位目标册，不会自动触发事件 · ${queueText}`.slice(0, 44), rect.x + 22, cardY + 108);
  ctx.restore();
  return true;
}

export function drawRareSpiritIdentityPortraitWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect, anchor, palette } = spec;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.strokeStyle = activeNodeKey ? `${palette.state}dd` : `${palette.base}66`;
  ctx.lineWidth = activeNodeKey ? 3 : 1.8;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 9;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + 48, cardY + rect.height + 22, rect.x + 44, cardY + rect.height - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 10, 62 + Math.abs(pulse), 17, -0.08, 0, Math.PI * 2);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, spec.lineId, anchor.x, anchor.y - 12 + pulse * 0.25, motion);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.soft);
  ctx.strokeStyle = activeNodeKey ? `${palette.state}ee` : `${palette.base}88`;
  ctx.lineWidth = activeNodeKey ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 20);
  ctx.stroke();

  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 15, 58, 50, 16);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, spec.lineId, rect.x + 45, cardY + 41, motion);
  ctx.fillStyle = palette.state;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.sourceLabel, rect.x + 24, cardY + 64);

  ctx.fillStyle = palette.base;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 86, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.subtitle.slice(0, 22), rect.x + 86, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.sceneText} · ${spec.actionText}`.slice(0, 40), rect.x + 86, cardY + 63);

  spec.nodes.forEach((node, index) => {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    const bob = (active ? pulse / 1.5 : Math.sin(motion * 1.4 + index) * 0.8) + pulse;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.96)" : "rgba(255, 253, 245, 0.72)";
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 14);
    ctx.fill();
    ctx.strokeStyle = active ? `${node.accent}ee` : `${node.accent}77`;
    ctx.lineWidth = active ? 2.4 : 1.3;
    ctx.stroke();

    ctx.fillStyle = active ? node.accent : `${node.accent}cc`;
    ctx.beginPath();
    ctx.arc(nodeRect.x + 18, nodeRect.y + 20 + bob, active ? 13 : 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 13px Microsoft YaHei";
    ctx.fillText(node.glyph, nodeRect.x + 12, nodeRect.y + 25 + bob);

    ctx.fillStyle = "#17231d";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(node.label, nodeRect.x + 34, nodeRect.y + 17 + bob);
    ctx.fillStyle = active ? node.accent : "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(node.text.slice(0, 7), nodeRect.x + 34, nodeRect.y + 31 + bob);
  });

  const focusNode = spec.nodes.find((node) => node.key === activeNodeKey) || spec.nodes[0];
  if (focusNode) {
    ctx.fillStyle = spec.ready ? "rgba(255, 240, 238, 0.72)" : spec.clueKnown ? "rgba(232, 247, 250, 0.72)" : "rgba(236, 248, 243, 0.72)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 18, cardY + rect.height - 18, rect.width - 36, 13, 7);
    ctx.fill();
    ctx.fillStyle = spec.ready ? "#be4f37" : spec.clueKnown ? "#4d91a6" : "#286f58";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(`${focusNode.label}：${focusNode.detail}`.slice(0, 48), rect.x + 30, cardY + rect.height - 8);
  }

  if (!reducedMotion) {
    for (let i = 0; i < 6; i += 1) {
      const moteX = rect.x + 30 + i * 48 + Math.sin(motion * 1.8 + i) * 3;
      const moteY = cardY - 4 + Math.cos(motion * 1.4 + i) * 4;
      ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.86)" : `${palette.base}88`;
      ctx.beginPath();
      ctx.arc(moteX, moteY, i % 2 ? 2 : 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawRareSpiritMemoryCompassWorldWorld({
  ctx,
  spec = null,
  pulse = 0,
  active = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor) return false;
  const { rect, anchor } = spec;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(125, 99, 63, 0.92)" : "rgba(125, 99, 63, 0.56)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.bezierCurveTo(anchor.x - 28, anchor.y - 38, rect.x + 42, cardY + 28, rect.x + 24, cardY + 62);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 249, 238, 0.95)");
  ctx.strokeStyle = active ? "rgba(125, 99, 63, 0.92)" : "rgba(125, 99, 63, 0.6)";
  ctx.lineWidth = active ? 2.5 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "#7d633f";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.subtitle, rect.x + 18, cardY + 24);
  ctx.font = "bold 12px Microsoft YaHei";
  ctx.fillText(spec.sectionTitle, rect.x + 18, cardY + 46);
  ctx.fillText(spec.overviewTitle, rect.x + 108, cardY + 46);
  ctx.fillText(spec.moodTitle, rect.x + 18, cardY + 68);
  ctx.fillText(spec.giftTitle, rect.x + 108, cardY + 68);
  ctx.fillStyle = "#2d352c";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(`${spec.leadName || "伙伴"} 的记忆正在发亮`, rect.x + 18, cardY + 92);
  ctx.fillText("只定位生活图鉴与事件入口", rect.x + 18, cardY + 112);
  ctx.restore();
  return true;
}

export function drawHualingWelcomeDanceWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  active = false,
  palette = null,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor || !palette) return false;
  const { rect, anchor } = spec;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.strokeStyle = active ? `${palette.accent}dd` : `${palette.accent}66`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y - 18);
  ctx.quadraticCurveTo(rect.x + 54, cardY + rect.height + 28, rect.x + 42, cardY + rect.height - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.ellipse(anchor.x + 4, anchor.y + 18, 82, 20, -0.06, 0, Math.PI * 2);
  ctx.fill();

  if (spec.stage === "silent_market") {
    for (let i = 0; i < 3; i += 1) {
      const poleX = anchor.x - 42 + i * 34;
      const flagWave = reducedMotion ? 0 : Math.sin(motion * 1.5 + i) * 3;
      ctx.strokeStyle = "rgba(143, 95, 63, 0.76)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(poleX, anchor.y - 56);
      ctx.lineTo(poleX, anchor.y + 12);
      ctx.stroke();
      ctx.fillStyle = i % 2 ? "rgba(216, 127, 141, 0.82)" : "rgba(242, 210, 139, 0.86)";
      ctx.beginPath();
      ctx.moveTo(poleX, anchor.y - 52);
      ctx.lineTo(poleX + 24, anchor.y - 46 + flagWave);
      ctx.lineTo(poleX, anchor.y - 35);
      ctx.closePath();
      ctx.fill();
    }
    for (let i = 0; i < 3; i += 1) {
      const guestX = anchor.x + 70 + i * 18;
      const guestBob = reducedMotion ? 0 : Math.sin(motion * 1.8 + i) * 2;
      ctx.fillStyle = "rgba(23, 35, 29, 0.14)";
      ctx.beginPath();
      ctx.ellipse(guestX, anchor.y + 32, 13, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = i === 1 ? "rgba(242, 210, 139, 0.78)" : "rgba(255, 253, 245, 0.72)";
      ctx.beginPath();
      ctx.arc(guestX, anchor.y - 2 + guestBob, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = i === 1 ? "rgba(216, 127, 141, 0.7)" : "rgba(143, 95, 63, 0.62)";
      ctx.beginPath();
      ctx.roundRect(guestX - 8, anchor.y + 5 + guestBob, 16, 23, 5);
      ctx.fill();
    }
  }

  for (let i = 0; i < 12; i += 1) {
    const drift = reducedMotion ? 0 : Math.sin(motion * 1.6 + i) * 7;
    const fall = reducedMotion ? 0 : Math.cos(motion * 1.2 + i * 0.6) * 5;
    const petalX = anchor.x - 64 + i * 14 + drift;
    const petalY = anchor.y - 42 + (i % 4) * 11 + fall;
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 253, 245, 0.88)" : i % 2 ? "rgba(216, 127, 141, 0.86)" : "rgba(242, 210, 139, 0.82)";
    ctx.beginPath();
    ctx.ellipse(petalX, petalY, 6, 3.4, motion + i * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(anchor.x - 18, anchor.y - 48, 18, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y - 22 + pulse, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.ellipse(anchor.x - 6, anchor.y - 36 + pulse, 9, 5, -0.5, 0, Math.PI * 2);
  ctx.ellipse(anchor.x + 8, anchor.y - 37 + pulse, 10, 5, 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.beginPath();
  ctx.arc(anchor.x - 5, anchor.y - 24 + pulse, 2.5, 0, Math.PI * 2);
  ctx.arc(anchor.x + 6, anchor.y - 24 + pulse, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#286f58";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(anchor.x + 1, anchor.y - 20 + pulse, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.roundRect(anchor.x - 13, anchor.y - 8 + pulse, 26, 22, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("铃", anchor.x - 5, anchor.y + 7 + pulse);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 58, 16);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, "spirit_line_hualing", rect.x + 43, cardY + 42, motion);
  ctx.fillStyle = palette.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.stageLabel, rect.x + 27, cardY + 75);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 84, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 84, cardY + 44);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 32), rect.x + 84, cardY + 62);
  ctx.fillStyle = palette.text;
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`“${spec.quote}”`.slice(0, 30), rect.x + 84, cardY + 80);

  ctx.fillStyle = active ? `${palette.accent}22` : "rgba(255, 253, 245, 0.78)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 21, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.actionText} · ${spec.cta}`.slice(0, 35), rect.x + 24, cardY + rect.height - 10);
  ctx.restore();
  return true;
}

export function drawLeizhuWindGuideWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  active = false,
  palette = null,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor || !palette) return false;
  const { rect, anchor } = spec;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.strokeStyle = active ? `${palette.bolt}dd` : `${palette.bolt}77`;
  ctx.lineWidth = active ? 4 : 3;
  ctx.setLineDash([11, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.moveTo(anchor.x - 28, anchor.y + 12);
  ctx.bezierCurveTo(anchor.x + 8, anchor.y - 34, anchor.x + 28, anchor.y - 76, anchor.x + 72, anchor.y - 118);
  ctx.stroke();
  ctx.setLineDash([]);

  if (spec.stage === "old_route" || spec.stage === "old_route_run" || spec.stage === "route_ready") {
    for (let i = 0; i < 4; i += 1) {
      const stakeX = anchor.x - 62 + i * 34;
      const stakeY = anchor.y - 10 - i * 19;
      ctx.strokeStyle = "rgba(143, 95, 63, 0.78)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(stakeX, stakeY + 28);
      ctx.lineTo(stakeX + 10, stakeY - 22);
      ctx.stroke();
      ctx.fillStyle = i % 2 ? "rgba(230, 198, 94, 0.88)" : "rgba(255, 253, 245, 0.82)";
      ctx.beginPath();
      ctx.arc(stakeX + 10, stakeY - 24, 5 + (active ? 1 : 0), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.ellipse(anchor.x - 10, anchor.y + 28, 82, 20, -0.18, 0, Math.PI * 2);
  ctx.fill();

  const guideBob = pulse * 0.7;
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(anchor.x - 18, anchor.y - 52 + guideBob);
  ctx.lineTo(anchor.x + 34, anchor.y + 28);
  ctx.stroke();
  ctx.lineCap = "butt";
  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.beginPath();
  ctx.arc(anchor.x - 6, anchor.y - 24 + guideBob, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5d8b52";
  ctx.beginPath();
  ctx.roundRect(anchor.x - 18, anchor.y - 9 + guideBob, 32, 25, 8);
  ctx.fill();
  ctx.fillStyle = "#e6c65e";
  ctx.beginPath();
  ctx.ellipse(anchor.x - 13, anchor.y - 38 + guideBob, 12, 5, -0.6, 0, Math.PI * 2);
  ctx.ellipse(anchor.x + 8, anchor.y - 39 + guideBob, 12, 5, 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#17231d";
  ctx.beginPath();
  ctx.arc(anchor.x - 11, anchor.y - 26 + guideBob, 2.4, 0, Math.PI * 2);
  ctx.arc(anchor.x + 2, anchor.y - 27 + guideBob, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.bolt;
  ctx.beginPath();
  ctx.moveTo(anchor.x + 24, anchor.y - 60 + pulse);
  ctx.lineTo(anchor.x + 10, anchor.y - 28 + pulse);
  ctx.lineTo(anchor.x + 27, anchor.y - 31 + pulse);
  ctx.lineTo(anchor.x + 12, anchor.y + 2 + pulse);
  ctx.lineTo(anchor.x + 44, anchor.y - 38 + pulse);
  ctx.lineTo(anchor.x + 26, anchor.y - 35 + pulse);
  ctx.closePath();
  ctx.fill();

  if (spec.stage === "escort" || spec.stage === "escort_ready" || spec.stage === "old_route_run") {
    const cartX = anchor.x - 92;
    const cartY = anchor.y + 26;
    ctx.fillStyle = "rgba(143, 95, 63, 0.84)";
    ctx.beginPath();
    ctx.roundRect(cartX, cartY - 28, 56, 24, 6);
    ctx.fill();
    ctx.strokeStyle = "rgba(230, 198, 94, 0.78)";
    ctx.lineWidth = 2.4;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(cartX + 8 + i * 16, cartY - 29);
      ctx.lineTo(cartX + 10 + i * 14, cartY - 4);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(23, 35, 29, 0.24)";
    ctx.beginPath();
    ctx.arc(cartX + 12, cartY - 2, 6, 0, Math.PI * 2);
    ctx.arc(cartX + 46, cartY - 2, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = active ? `${palette.bolt}ee` : `${palette.accent}88`;
  ctx.lineWidth = active ? 2.9 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 15, 62, 62, 17);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, "spirit_line_leizhu", rect.x + 45, cardY + 45, motion);
  ctx.fillStyle = palette.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.stageLabel, rect.x + 28, cardY + 79);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 88, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 88, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 88, cardY + 68);
  ctx.fillStyle = spec.tone === "old" ? "#4d91a6" : "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`“${spec.quote}”`.slice(0, 30), rect.x + 88, cardY + 86);

  ctx.fillStyle = active ? "rgba(230, 198, 94, 0.24)" : "rgba(255, 253, 245, 0.8)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 22, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.actionText} · ${spec.cta}`.slice(0, 35), rect.x + 24, cardY + rect.height - 11);

  if (!reducedMotion) {
    for (let i = 0; i < 5; i += 1) {
      const sparkX = rect.x + rect.width - 42 - i * 16;
      const sparkY = cardY + 16 + Math.sin(motion * 2.2 + i) * 4;
      ctx.fillStyle = i % 2 ? "rgba(230, 198, 94, 0.82)" : "rgba(255, 253, 245, 0.9)";
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  return true;
}

export function drawYuelianMoonlitPondWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  active = false,
  palette = null,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor || !palette) return false;
  const { rect, anchor } = spec;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 4, 98, 42, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = active ? `${palette.accent}cc` : `${palette.accent}66`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(anchor.x - 18, anchor.y - 8);
  ctx.quadraticCurveTo(rect.x + rect.width - 46, cardY - 18, rect.x + rect.width - 36, cardY + 18);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 3; i += 1) {
    const ring = reducedMotion ? i * 9 : ((motion * 11 + i * 13) % 34);
    ctx.strokeStyle = `rgba(223, 247, 238, ${Math.max(0.08, 0.32 - ring / 120)})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(anchor.x - 20 + i * 20, anchor.y + 12, 12 + ring, 5 + ring * 0.34, -0.08, 0, Math.PI * 2);
    ctx.stroke();
  }

  const lotusX = anchor.x - 42;
  const lotusY = anchor.y - 12 + pulse * 0.4;
  ctx.fillStyle = "rgba(79, 130, 120, 0.92)";
  ctx.beginPath();
  ctx.arc(lotusX, lotusY + 18, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(223, 247, 238, 0.32)";
  ctx.beginPath();
  ctx.moveTo(lotusX, lotusY + 18);
  ctx.arc(lotusX, lotusY + 18, 16, -0.35, 0.78);
  ctx.closePath();
  ctx.fill();

  if (spec.stage === "moon_pond" || spec.stage === "moon_ready") {
    ctx.strokeStyle = palette.glow;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(anchor.x + 46, anchor.y - 58 + pulse * 0.4, 22, Math.PI * 0.18, Math.PI * 1.82);
    ctx.stroke();
    ctx.fillStyle = "rgba(159, 209, 223, 0.16)";
    ctx.beginPath();
    ctx.arc(anchor.x + 46, anchor.y - 58 + pulse * 0.4, 32, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = palette.glow;
    ctx.beginPath();
    ctx.arc(lotusX + 12, lotusY + 4, 5 + (active ? 1 : 0), 0, Math.PI * 2);
    ctx.fill();
  }

  const spiritX = anchor.x - 8 + Math.sin(motion * 0.8) * (reducedMotion ? 0 : 4);
  const spiritY = anchor.y - 38 + pulse * 0.5;
  ctx.fillStyle = "rgba(159, 209, 223, 0.22)";
  ctx.beginPath();
  ctx.arc(spiritX, spiritY, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.beginPath();
  ctx.ellipse(spiritX, spiritY, 8, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.ellipse(spiritX - 7, spiritY - 12, 13, 5, -0.55, 0, Math.PI * 2);
  ctx.ellipse(spiritX + 8, spiritY - 13, 13, 5, 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.beginPath();
  ctx.arc(spiritX - 4, spiritY - 2, 2.4, 0, Math.PI * 2);
  ctx.arc(spiritX + 5, spiritY - 2, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4d91a6";
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.arc(spiritX + 1, spiritY + 2, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(159, 209, 223, 0.82)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(spiritX - 6, spiritY + 12);
  ctx.quadraticCurveTo(spiritX - 18, spiritY + 28, spiritX - 8, spiritY + 34);
  ctx.moveTo(spiritX + 6, spiritY + 12);
  ctx.quadraticCurveTo(spiritX + 18, spiritY + 28, spiritX + 5, spiritY + 34);
  ctx.stroke();

  if (spec.stage === "respite" || spec.stage === "respite_ready" || spec.stage === "rest_prompt") {
    for (let i = 0; i < 3; i += 1) {
      const restX = anchor.x - 82 + i * 28;
      const restY = anchor.y + 46 + Math.sin(motion + i) * (reducedMotion ? 0 : 1.5);
      ctx.fillStyle = "rgba(255, 253, 245, 0.5)";
      ctx.beginPath();
      ctx.ellipse(restX, restY, 22, 8, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = i % 2 ? "rgba(140, 122, 184, 0.42)" : "rgba(159, 209, 223, 0.42)";
      ctx.beginPath();
      ctx.arc(restX - 4, restY - 7, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 253, 245, 0.58)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(restX + 4, restY - 10);
      ctx.quadraticCurveTo(restX + 14, restY - 18, restX + 20, restY - 10);
      ctx.stroke();
    }
  }

  for (let i = 0; i < 7; i += 1) {
    const moteX = anchor.x - 72 + i * 22 + Math.sin(motion * 0.9 + i) * (reducedMotion ? 0 : 5);
    const moteY = anchor.y - 52 + (i % 3) * 18 + Math.cos(motion * 1.1 + i) * (reducedMotion ? 0 : 4);
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.78)" : "rgba(159, 209, 223, 0.68)";
    ctx.beginPath();
    ctx.arc(moteX, moteY, i % 2 ? 2.4 : 3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 58, 16);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, "spirit_line_yuelian", rect.x + 43, cardY + 43, motion);
  ctx.fillStyle = palette.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.stageLabel, rect.x + 27, cardY + 76);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 86, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 86, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 86, cardY + 66);
  ctx.fillStyle = spec.tone === "moon" ? "#286f58" : "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`“${spec.quote}”`.slice(0, 30), rect.x + 86, cardY + 84);

  ctx.fillStyle = active ? "rgba(159, 209, 223, 0.24)" : "rgba(255, 253, 245, 0.78)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 21, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.actionText} · ${spec.cta}`.slice(0, 36), rect.x + 24, cardY + rect.height - 10);
  ctx.restore();
  return true;
}

export function drawDengyingLanternPathWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  active = false,
  palette = null,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor || !palette) return false;
  const { rect, anchor } = spec;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.fillStyle = "rgba(23, 35, 29, 0.18)";
  ctx.beginPath();
  ctx.ellipse(anchor.x + 8, anchor.y + 58, 88, 18, 0.06, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = active ? `${palette.glow}` : "rgba(224, 182, 109, 0.48)";
  ctx.lineWidth = active ? 4 : 3;
  ctx.setLineDash([10, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 15;
  ctx.beginPath();
  ctx.moveTo(anchor.x - 74, anchor.y + 52);
  ctx.bezierCurveTo(anchor.x - 24, anchor.y + 4, anchor.x + 58, anchor.y + 18, anchor.x + 116, anchor.y - 42);
  ctx.stroke();
  ctx.setLineDash([]);

  const lampCount = spec.stage === "revealed" || spec.stage === "reveal_ready" || spec.stage === "winter_lantern" ? 5 : 3;
  for (let i = 0; i < lampCount; i += 1) {
    const t = lampCount <= 1 ? 0 : i / (lampCount - 1);
    const lampX = anchor.x - 70 + t * 178;
    const lampY = anchor.y + 42 - Math.sin(t * Math.PI) * 46 + Math.sin(motion * 1.4 + i) * (reducedMotion ? 0 : 3);
    ctx.strokeStyle = "rgba(91, 51, 40, 0.74)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lampX, lampY - 26);
    ctx.lineTo(lampX, lampY - 8);
    ctx.stroke();
    ctx.fillStyle = i < 2 || spec.tone !== "shadow" ? palette.glow : "rgba(143, 95, 63, 0.34)";
    ctx.beginPath();
    ctx.roundRect(lampX - 8, lampY - 8, 16, 24, 7);
    ctx.fill();
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 253, 245, 0.74)";
    ctx.fillRect(lampX - 5, lampY + 1, 10, 2);
  }

  if (spec.stage === "revealed") {
    ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
    ctx.strokeStyle = "rgba(255, 253, 245, 0.72)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(anchor.x + 124, anchor.y - 52 + pulse * 0.5, 34, 22, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 253, 245, 0.8)";
    ctx.font = "900 13px Microsoft YaHei";
    ctx.fillText("隐", anchor.x + 116, anchor.y - 47 + pulse * 0.5);
  }

  const spiritX = anchor.x - 6 + Math.sin(motion * 0.9) * (reducedMotion ? 0 : 4);
  const spiritY = anchor.y + 2 + pulse * 0.45;
  ctx.fillStyle = "rgba(91, 51, 40, 0.3)";
  ctx.beginPath();
  ctx.ellipse(spiritX - 4, spiritY + 36, 32, 8, 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(246, 240, 182, 0.24)";
  ctx.beginPath();
  ctx.arc(spiritX, spiritY - 4, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2d28b";
  ctx.beginPath();
  ctx.roundRect(spiritX - 10, spiritY - 18, 20, 30, 9);
  ctx.fill();
  ctx.strokeStyle = "#5b3328";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#5b3328";
  ctx.beginPath();
  ctx.arc(spiritX - 4, spiritY - 6, 2.3, 0, Math.PI * 2);
  ctx.arc(spiritX + 5, spiritY - 6, 2.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#5b3328";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(spiritX + 1, spiritY - 1, 4.5, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(spiritX, spiritY + 12);
  ctx.lineTo(spiritX, spiritY + 34 + pulse);
  ctx.stroke();

  if (spec.stage === "night_patrol" || spec.stage === "bond_ready" || spec.stage === "winter_lantern" || spec.stage === "reveal_ready") {
    ctx.strokeStyle = "rgba(255, 253, 245, 0.52)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      const rayX = spiritX - 54 + i * 36;
      ctx.beginPath();
      ctx.moveTo(rayX, spiritY + 42);
      ctx.quadraticCurveTo(rayX + 16, spiritY + 30 - i * 3, rayX + 34, spiritY + 42);
      ctx.stroke();
    }
  }

  for (let i = 0; i < 8; i += 1) {
    const moteX = anchor.x - 96 + i * 28 + Math.sin(motion * 1.1 + i) * (reducedMotion ? 0 : 5);
    const moteY = anchor.y - 34 + (i % 3) * 18 + Math.cos(motion * 1.3 + i) * (reducedMotion ? 0 : 4);
    ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.78)" : "rgba(255, 253, 245, 0.72)";
    ctx.beginPath();
    ctx.arc(moteX, moteY, i % 2 ? 2.2 : 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 60, 60, 16);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, "spirit_line_dengying", rect.x + 44, cardY + 44, motion);
  ctx.fillStyle = palette.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.stageLabel, rect.x + 28, cardY + 78);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 88, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 88, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 88, cardY + 67);
  ctx.fillStyle = spec.tone === "revealed" ? "#4d91a6" : "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`“${spec.quote}”`.slice(0, 30), rect.x + 88, cardY + 86);

  ctx.fillStyle = active ? "rgba(246, 240, 182, 0.24)" : "rgba(255, 253, 245, 0.78)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 21, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.actionText} · ${spec.cta}`.slice(0, 36), rect.x + 24, cardY + rect.height - 10);
  ctx.restore();
  return true;
}

export function drawShuqiLedgerDeskWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  active = false,
  palette = null,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
  itemName = (itemId) => itemId || "",
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor || !palette) return false;
  const { rect, anchor } = spec;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.fillStyle = "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.ellipse(anchor.x + 28, anchor.y + 44, 112, 24, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = active ? `${palette.accent}dd` : `${palette.accent}77`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(anchor.x + 32, anchor.y + 4);
  ctx.quadraticCurveTo(rect.x + 44, cardY - 20, rect.x + 42, cardY + 18);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(143, 95, 63, 0.72)";
  ctx.beginPath();
  ctx.roundRect(anchor.x - 64, anchor.y + 12, 150, 38, 10);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
  ctx.beginPath();
  ctx.roundRect(anchor.x - 54, anchor.y - 20 + pulse * 0.35, 118, 52, 8);
  ctx.fill();
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = "rgba(143, 95, 63, 0.54)";
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(anchor.x - 38, anchor.y - 3 + i * 10 + pulse * 0.25);
    ctx.lineTo(anchor.x + 36 - i * 4, anchor.y - 5 + i * 10 + pulse * 0.25);
    ctx.stroke();
  }

  ctx.fillStyle = palette.seal;
  ctx.beginPath();
  ctx.arc(anchor.x + 48, anchor.y + 13 + pulse * 0.2, 9 + (active ? 1 : 0), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("账", anchor.x + 43, anchor.y + 17 + pulse * 0.2);

  const slipCount = spec.tone === "stock" ? 4 : spec.tone === "legacy" ? 5 : 3;
  for (let i = 0; i < slipCount; i += 1) {
    const slipX = anchor.x - 44 + i * 20;
    const slipY = anchor.y + 42 + Math.sin(motion * 1.4 + i) * (reducedMotion ? 0 : 2);
    ctx.fillStyle = spec.tone === "stock"
      ? "rgba(190, 79, 55, 0.86)"
      : spec.tone === "legacy"
        ? "rgba(224, 182, 109, 0.88)"
        : "rgba(255, 253, 245, 0.86)";
    ctx.beginPath();
    ctx.roundRect(slipX, slipY, 15, 28, 5);
    ctx.fill();
    ctx.strokeStyle = "rgba(91, 51, 40, 0.34)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (spec.tone === "legacy") {
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = "rgba(255, 248, 232, 0.88)";
      ctx.strokeStyle = "rgba(180, 125, 47, 0.64)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(anchor.x + 66 + i * 8, anchor.y - 10 + i * 9 + pulse * 0.2, 42, 28, 7);
      ctx.fill();
      ctx.stroke();
    }
  } else if (spec.tone === "stock") {
    spec.lowStockGoods.slice(0, 2).forEach((entry, index) => {
      const tagX = anchor.x + 72;
      const tagY = anchor.y - 8 + index * 28 + pulse * 0.2;
      ctx.fillStyle = "rgba(255, 240, 238, 0.92)";
      ctx.beginPath();
      ctx.roundRect(tagX, tagY, 74, 21, 9);
      ctx.fill();
      ctx.fillStyle = "#be4f37";
      ctx.font = "800 9px Microsoft YaHei";
      ctx.fillText(`${itemName(entry.itemId).slice(0, 4)} ${entry.count}`, tagX + 8, tagY + 14);
    });
  }

  const spiritX = anchor.x - 82 + Math.sin(motion * 0.9) * (reducedMotion ? 0 : 3);
  const spiritY = anchor.y - 18 + pulse * 0.35;
  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.arc(spiritX, spiritY, 25, 0, Math.PI * 2);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, "spirit_line_shuqi", spiritX, spiritY, motion);
  ctx.fillStyle = palette.ink;
  ctx.beginPath();
  ctx.arc(spiritX - 6, spiritY - 3, 2.3, 0, Math.PI * 2);
  ctx.arc(spiritX + 6, spiritY - 3, 2.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(spiritX, spiritY + 2, 5, 0.15, Math.PI - 0.15);
  ctx.stroke();

  if (!reducedMotion) {
    for (let i = 0; i < 7; i += 1) {
      const moteX = anchor.x - 82 + i * 26 + Math.sin(motion * 1.2 + i) * 5;
      const moteY = anchor.y - 54 + (i % 3) * 18 + Math.cos(motion * 1.1 + i) * 3;
      ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.78)" : `${palette.accent}77`;
      ctx.beginPath();
      ctx.arc(moteX, moteY, i % 2 ? 2.2 : 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}88`;
  ctx.lineWidth = active ? 2.9 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 60, 60, 16);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, "spirit_line_shuqi", rect.x + 44, cardY + 43, motion);
  ctx.fillStyle = palette.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.stageLabel, rect.x + 27, cardY + 77);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 86, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 86, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 36), rect.x + 86, cardY + 67);
  ctx.fillStyle = spec.tone === "stock" ? "#be4f37" : spec.tone === "legacy" ? "#b47d2f" : "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`“${spec.quote}”`.slice(0, 31), rect.x + 86, cardY + 86);

  ctx.fillStyle = active ? "rgba(224, 182, 109, 0.24)" : "rgba(255, 253, 245, 0.78)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 21, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.actionText} · ${spec.cta}`.slice(0, 38), rect.x + 24, cardY + rect.height - 10);
  ctx.restore();
  return true;
}

export function drawFengmiHoneyYardWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  active = false,
  palette = null,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawRareSpiritTheaterGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor || !palette) return false;
  const { rect, anchor } = spec;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.fillStyle = "rgba(40, 111, 88, 0.14)";
  ctx.beginPath();
  ctx.ellipse(anchor.x + 8, anchor.y + 72, 118, 28, -0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = active ? `${palette.accent}dd` : `${palette.accent}77`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x + 18, anchor.y + 26);
  ctx.quadraticCurveTo(rect.x + 48, cardY - 10, rect.x + 46, cardY + 18);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 4; i += 1) {
    const flowerX = anchor.x - 86 + i * 42;
    const flowerY = anchor.y + 42 + Math.sin(motion * 1.1 + i) * (reducedMotion ? 0 : 3);
    ctx.fillStyle = i % 2 ? "rgba(216, 127, 141, 0.74)" : "rgba(246, 240, 182, 0.82)";
    for (let p = 0; p < 5; p += 1) {
      ctx.beginPath();
      ctx.ellipse(flowerX + Math.cos(p * 1.26) * 8, flowerY + Math.sin(p * 1.26) * 6, 5, 8, p, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = palette.leaf;
    ctx.beginPath();
    ctx.arc(flowerX, flowerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(93, 139, 82, 0.76)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(flowerX, flowerY + 6);
    ctx.lineTo(flowerX - 2, flowerY + 28);
    ctx.stroke();
  }

  const hiveX = anchor.x - 20;
  const hiveY = anchor.y - 38 + pulse * 0.35;
  ctx.fillStyle = "rgba(143, 95, 63, 0.58)";
  ctx.beginPath();
  ctx.roundRect(hiveX - 12, hiveY + 20, 92, 24, 10);
  ctx.fill();
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i % 2 ? "#f2d28b" : palette.honey;
    ctx.beginPath();
    ctx.ellipse(hiveX + 26, hiveY + i * 13, 42 - i * 4, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(91, 51, 40, 0.28)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(91, 51, 40, 0.76)";
  ctx.beginPath();
  ctx.arc(hiveX + 26, hiveY + 27, 8, 0, Math.PI * 2);
  ctx.fill();

  const spiritX = anchor.x - 62 + Math.sin(motion * 1.3) * (reducedMotion ? 0 : 4);
  const spiritY = anchor.y - 8 + pulse * 0.45;
  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.arc(spiritX, spiritY, 25, 0, Math.PI * 2);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, "spirit_line_fengmi", spiritX, spiritY, motion);
  ctx.fillStyle = "#17231d";
  ctx.beginPath();
  ctx.arc(spiritX - 4, spiritY - 1, 2.2, 0, Math.PI * 2);
  ctx.arc(spiritX + 6, spiritY - 1, 2.2, 0, Math.PI * 2);
  ctx.fill();

  const jarX = anchor.x + 66;
  const jarY = anchor.y + 8 + pulse * 0.25;
  ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
  ctx.beginPath();
  ctx.roundRect(jarX, jarY, 34, 42, 9);
  ctx.fill();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = palette.honey;
  ctx.beginPath();
  ctx.roundRect(jarX + 5, jarY + 18, 24, 20, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("蜜", jarX + 12, jarY + 32);

  if (spec.tone === "dessert" || spec.tone === "feast" || spec.tone === "active") {
    const potX = anchor.x + 16;
    const potY = anchor.y + 58;
    ctx.fillStyle = "rgba(91, 51, 40, 0.84)";
    ctx.beginPath();
    ctx.roundRect(potX, potY - 22, 58, 28, 9);
    ctx.fill();
    ctx.fillStyle = palette.honey;
    ctx.beginPath();
    ctx.ellipse(potX + 30, potY - 22, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 253, 245, 0.58)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(potX + 14 + i * 14, potY - 34 + Math.sin(motion + i) * 2);
      ctx.quadraticCurveTo(potX + 20 + i * 12, potY - 48, potX + 26 + i * 10, potY - 34);
      ctx.stroke();
    }
  }

  if (spec.tone === "feast" || spec.tone === "active") {
    for (let i = 0; i < 4; i += 1) {
      const cupX = anchor.x - 72 + i * 36;
      const cupY = anchor.y + 92 + Math.sin(motion * 1.1 + i) * (reducedMotion ? 0 : 1.6);
      ctx.fillStyle = i % 2 ? "rgba(216, 127, 141, 0.68)" : "rgba(255, 253, 245, 0.86)";
      ctx.beginPath();
      ctx.roundRect(cupX, cupY, 22, 16, 7);
      ctx.fill();
      ctx.strokeStyle = "rgba(143, 95, 63, 0.34)";
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }
  }

  if (!reducedMotion) {
    for (let i = 0; i < 9; i += 1) {
      const moteX = anchor.x - 104 + i * 24 + Math.sin(motion * 1.4 + i) * 6;
      const moteY = anchor.y - 52 + (i % 4) * 20 + Math.cos(motion * 1.2 + i) * 4;
      ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.82)" : `${palette.accent}77`;
      ctx.beginPath();
      ctx.arc(moteX, moteY, i % 2 ? 2.2 : 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}88`;
  ctx.lineWidth = active ? 2.9 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 60, 60, 16);
  ctx.fill();
  drawRareSpiritTheaterGlyph(ctx, "spirit_line_fengmi", rect.x + 44, cardY + 43, motion);
  ctx.fillStyle = palette.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.stageLabel, rect.x + 27, cardY + 77);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 86, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 86, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 36), rect.x + 86, cardY + 67);
  ctx.fillStyle = spec.tone === "active" ? "#286f58" : spec.tone === "feast" ? "#d87f8d" : "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`“${spec.quote}”`.slice(0, 31), rect.x + 86, cardY + 86);

  ctx.fillStyle = active ? "rgba(224, 182, 109, 0.24)" : "rgba(255, 253, 245, 0.78)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 21, rect.width - 32, 16, 8);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.actionText} · ${spec.cta}`.slice(0, 38), rect.x + 24, cardY + rect.height - 10);
  ctx.restore();
  return true;
}

export function drawSpiritSproutPreviewWorld({
  ctx,
  spec = null,
  bob = 0,
  tremble = 0,
  label = "?",
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.sprout) return false;
  const { sprout, x, y, tile, cardWidth } = spec;

  ctx.save();
  ctx.fillStyle = "rgba(245, 240, 182, 0.34)";
  ctx.beginPath();
  ctx.ellipse(x + tile / 2, y + tile * 0.55, tile * 0.42, tile * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(246, 240, 182, 0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + tile / 2, y + tile * 0.48, tile * 0.38, 0.1, Math.PI * 1.9);
  ctx.stroke();

  if (sprout.stage === "peek" || sprout.stage === "born") {
    ctx.fillStyle = sprout.stage === "born" ? "#fffdf5" : "#f5f0b6";
    ctx.beginPath();
    ctx.arc(x + tile / 2 + tremble, y + tile * 0.42 + bob, tile * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#286f58";
    ctx.beginPath();
    ctx.arc(x + tile * 0.43 + tremble, y + tile * 0.39 + bob, 3.5, 0, Math.PI * 2);
    ctx.arc(x + tile * 0.57 + tremble, y + tile * 0.39 + bob, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#286f58";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + tile / 2 + tremble, y + tile * 0.45 + bob, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.fillStyle = "#48a868";
    ctx.beginPath();
    ctx.ellipse(x + tile * 0.38, y + tile * 0.25 + bob, 10, 5, -0.6, 0, Math.PI * 2);
    ctx.ellipse(x + tile * 0.62, y + tile * 0.25 + bob, 10, 5, 0.6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#48a868";
    ctx.beginPath();
    ctx.ellipse(x + tile * 0.43 + tremble, y + tile * 0.45 + bob, 13, 6, -0.4, 0, Math.PI * 2);
    ctx.ellipse(x + tile * 0.58 + tremble, y + tile * 0.42 + bob, 13, 6, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, x + tile * 0.42, y - 32 + bob, cardWidth, 32, "rgba(255, 253, 245, 0.9)");
  ctx.fillStyle = sprout.stage === "born" ? "#be4f37" : "#286f58";
  ctx.font = "700 14px Microsoft YaHei";
  ctx.fillText(label, x + tile * 0.42 + 11, y - 13 + bob);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText("可点", x + tile * 0.42 + cardWidth - 27, y - 13 + bob);
  ctx.restore();
  return true;
}

export function drawSpiritSproutHeartbeatWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  beat = 0,
  pulse = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.preview || !spec?.labelRect) return false;
  const { centerX, centerY, preview } = spec;

  ctx.save();

  const glow = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, preview.tile * (1.08 + beat * 0.16));
  glow.addColorStop(0, spec.soft);
  glow.addColorStop(0.48, "rgba(246, 240, 182, 0.18)");
  glow.addColorStop(1, "rgba(246, 240, 182, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 5, preview.tile * (0.92 + beat * 0.12), preview.tile * (0.38 + beat * 0.06), -0.05, 0, Math.PI * 2);
  ctx.fill();

  for (let ring = 0; ring < 3; ring += 1) {
    const ringDone = ring <= spec.stageRank;
    const ringPulse = ringDone ? beat * 8 + pulse * 0.45 : 0;
    ctx.strokeStyle = ringDone ? `${spec.accent}${active ? "dd" : "99"}` : "rgba(143, 95, 63, 0.18)";
    ctx.lineWidth = active && ringDone ? 3 : ringDone ? 2 : 1.4;
    ctx.setLineDash(ringDone ? [7, 8] : [3, 7]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * (12 + ring * 3);
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY + 5,
      preview.tile * (0.36 + ring * 0.2) + ringPulse,
      preview.tile * (0.15 + ring * 0.075) + ringPulse * 0.25,
      -0.04,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
  ctx.setLineDash([]);

  for (let i = 0; i < 3; i += 1) {
    const angle = motion * 1.1 + i * ((Math.PI * 2) / 3);
    const radiusX = preview.tile * (0.48 + spec.stageRank * 0.08);
    const radiusY = preview.tile * 0.24;
    const moteX = centerX + Math.cos(angle) * radiusX;
    const moteY = centerY + Math.sin(angle) * radiusY;
    ctx.fillStyle = i <= spec.stageRank ? spec.accent : "rgba(255, 253, 245, 0.72)";
    ctx.beginPath();
    ctx.arc(moteX, moteY, i <= spec.stageRank ? 3.2 : 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const label = spec.labelRect;
  const labelY = label.y + pulse * 0.18;
  drawCanvasCard(ctx, label.x, labelY, label.width, label.height, active ? "rgba(255, 248, 232, 0.96)" : "rgba(255, 253, 245, 0.88)");
  ctx.strokeStyle = active ? spec.accent : `${spec.accent}77`;
  ctx.lineWidth = active ? 2.4 : 1.5;
  ctx.beginPath();
  ctx.roundRect(label.x + 1, labelY + 1, label.width - 2, label.height - 2, 13);
  ctx.stroke();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, label.x + 12, labelY + 14);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.beatText, label.x + 12, labelY + 29);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.glyph, label.x + label.width - 28, labelY + 25);
  ctx.restore();
  return true;
}

export function drawSpiritSproutStageVignetteWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  reducedMotion = false,
  bornSpirit = null,
  drawCanvasCard = () => {},
  drawSpiritSprite = () => {},
} = {}) {
  if (!ctx || !spec?.preview || !spec?.cardRect) return false;
  const { centerX, centerY, preview } = spec;
  ctx.save();

  const glow = ctx.createRadialGradient(centerX, centerY, 8, centerX, centerY, preview.tile * 1.36);
  glow.addColorStop(0, spec.soft);
  glow.addColorStop(0.54, "rgba(246, 240, 182, 0.16)");
  glow.addColorStop(1, "rgba(246, 240, 182, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, preview.tile * 1.36 + pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `${spec.accent}66`;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 4, preview.tile * (0.42 + i * 0.17) + pulse / 2, preview.tile * (0.18 + i * 0.07), -0.05, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  if (spec.sprout.stage === "tremble") {
    ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
    for (let i = 0; i < 5; i += 1) {
      const angle = motion * 1.2 + i * 1.25;
      const x = centerX + Math.cos(angle) * (preview.tile * 0.48);
      const y = centerY + Math.sin(angle) * (preview.tile * 0.22);
      ctx.beginPath();
      ctx.arc(x, y, 2.5 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = spec.accent;
    ctx.font = "900 18px Microsoft YaHei";
    ctx.fillText("?", centerX + preview.tile * 0.32 + pulse / 2, centerY - preview.tile * 0.38);
  } else if (spec.sprout.stage === "peek") {
    ctx.fillStyle = "rgba(143, 95, 63, 0.22)";
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 13, preview.tile * 0.34, preview.tile * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.beginPath();
    ctx.arc(centerX + pulse / 2, centerY - 8, preview.tile * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#286f58";
    ctx.beginPath();
    ctx.arc(centerX - 8 + pulse / 2, centerY - 12, 3, 0, Math.PI * 2);
    ctx.arc(centerX + 8 + pulse / 2, centerY - 12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(180, 125, 47, 0.46)";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.ellipse(centerX - 34 + i * 22, centerY + 28 + (i % 2) * 4, 5, 2.2, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.sprout.stage === "born" && bornSpirit) {
    ctx.strokeStyle = "rgba(246, 240, 182, 0.72)";
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 18;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 8);
    ctx.bezierCurveTo(centerX + 78, centerY - 74, centerX + 158, centerY - 32, centerX + 224, centerY - 94);
    ctx.stroke();
    ctx.setLineDash([]);
    drawSpiritSprite(ctx, bornSpirit, centerX + 22, centerY - 56 + pulse / 2, 64);
    ctx.fillStyle = "rgba(246, 240, 182, 0.82)";
    for (let i = 0; i < 6; i += 1) {
      const angle = motion * 1.3 + i;
      ctx.beginPath();
      ctx.arc(centerX + 106 + Math.cos(angle) * 34, centerY - 48 + Math.sin(angle) * 16, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const card = spec.cardRect;
  drawCanvasCard(ctx, card.x, card.y, card.width, card.height, "rgba(255, 253, 245, 0.9)");
  ctx.strokeStyle = `${spec.accent}88`;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(card.x + 1, card.y + 1, card.width - 2, card.height - 2, 15);
  ctx.stroke();
  ctx.fillStyle = spec.soft;
  ctx.beginPath();
  ctx.roundRect(card.x + 12, card.y + 13, 42, 38, 12);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.glyph, card.x + 25, card.y + 38);
  ctx.fillStyle = spec.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(`成精苗圃小演出 ${spec.stepText}`, card.x + 66, card.y + 20);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(`${spec.title} · ${spec.subtitle}`.slice(0, 18), card.x + 66, card.y + 39);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(spec.action.slice(0, 24), card.x + 66, card.y + 54);

  ctx.restore();
  return true;
}

export function drawSpiritSproutAnomalyWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  bob = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.cardRect || !spec?.bubbleRect || !spec?.preview) return false;
  const { cardRect: card, bubbleRect: bubble, preview } = spec;

  ctx.save();

  const halo = ctx.createRadialGradient(spec.centerX, spec.centerY, 4, spec.centerX, spec.centerY, preview.tile * 1.08 + pulse);
  halo.addColorStop(0, spec.soft);
  halo.addColorStop(0.62, "rgba(246, 240, 182, 0.15)");
  halo.addColorStop(1, "rgba(246, 240, 182, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.ellipse(spec.centerX, spec.centerY + 5, preview.tile * 0.92 + pulse, preview.tile * 0.46 + pulse / 2, -0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `${spec.accent}88`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([5, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  for (let i = 0; i < 2; i += 1) {
    ctx.beginPath();
    ctx.ellipse(spec.centerX, spec.centerY + 4, preview.tile * (0.5 + i * 0.18) + pulse / 3, preview.tile * (0.22 + i * 0.08), 0.03, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(143, 95, 63, 0.55)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    const startX = spec.centerX - 24 + i * 15;
    const startY = spec.centerY + 18 + (i % 2) * 5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + 8, startY + 5);
    ctx.lineTo(startX + 17, startY + 1);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 253, 245, 0.8)";
  for (let i = 0; i < 5; i += 1) {
    const angle = motion * 0.9 + i * 1.2;
    ctx.beginPath();
    ctx.arc(spec.centerX + Math.cos(angle) * preview.tile * 0.48, spec.centerY + Math.sin(angle) * preview.tile * 0.25, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = `${spec.accent}66`;
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(spec.centerX, spec.centerY - 14);
  ctx.quadraticCurveTo(card.x + 16, card.y + card.height / 2, card.x + 26, card.y + card.height - 18);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, bubble.x, bubble.y + bob, bubble.width, bubble.height, "rgba(255, 253, 245, 0.94)");
  ctx.fillStyle = spec.soft;
  ctx.beginPath();
  ctx.roundRect(bubble.x + 8, bubble.y + 8 + bob, bubble.width - 16, bubble.height - 16, 14);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 24px Microsoft YaHei";
  ctx.fillText(spec.glyph, bubble.x + 22, bubble.y + 34 + bob);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("问号气泡", bubble.x + 11, bubble.y + 44 + bob);

  drawCanvasCard(ctx, card.x, card.y + bob, card.width, card.height, "rgba(255, 248, 232, 0.95)");
  ctx.strokeStyle = active ? spec.accent : `${spec.accent}88`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.roundRect(card.x, card.y + bob, card.width, card.height, 18);
  ctx.stroke();

  ctx.fillStyle = spec.soft;
  ctx.beginPath();
  ctx.roundRect(card.x + 12, card.y + 13 + bob, 44, 44, 14);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 19px Microsoft YaHei";
  ctx.fillText(spec.glyph, card.x + 29, card.y + 42 + bob);

  ctx.fillStyle = spec.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点定位`, card.x + 66, card.y + 21 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 13), card.x + 66, card.y + 41 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.body.slice(0, 24), card.x + 66, card.y + 57 + bob);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(card.x + 14, card.y + 68 + bob, card.width - 28, 29, 10);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("只定位说明：不会自动收获 · 不会自动入夜", card.x + 22, card.y + 81 + bob);
  ctx.fillText("不会触发成精", card.x + 22, card.y + 93 + bob);

  ctx.restore();
  return true;
}

export function drawSpiritSproutTimelineWorldCardWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.preview || !spec?.rows?.length) return false;
  const { rect, preview } = spec;
  const cardY = rect.y + bob;
  const accent = spec.sprout.stage === "born" ? "#be4f37" : spec.sprout.stage === "peek" ? "#b47d2f" : "#286f58";

  ctx.save();
  ctx.strokeStyle = `${accent}55`;
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(preview.x + preview.tile / 2, preview.y + preview.tile * 0.28);
  ctx.quadraticCurveTo(rect.x + 18, cardY + rect.height + 16, rect.x + 22, cardY + rect.height - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.94)");
  ctx.strokeStyle = active ? accent : `${accent}77`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, cardY, rect.width, rect.height, 16);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 10, cardY + 10, 38, 38, 12);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText(spec.sprout.stage === "born" ? "精" : "芽", rect.x + 20, cardY + 35);

  ctx.fillStyle = accent;
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 58, cardY + 19);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 14), rect.x + 58, cardY + 38);

  ctx.strokeStyle = `${accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 26, cardY + 60);
  ctx.lineTo(rect.x + rect.width - 28, cardY + 60);
  ctx.stroke();
  spec.rows.forEach((row, index) => {
    const dotX = rect.x + 32 + index * 72;
    const dotY = cardY + 60;
    ctx.fillStyle = row.done ? accent : "rgba(255, 253, 245, 0.95)";
    ctx.strokeStyle = row.active ? "#fffdf5" : `${accent}77`;
    ctx.lineWidth = row.active ? 3 : 1.6;
    ctx.beginPath();
    ctx.arc(dotX, dotY, row.active ? 8 : 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = row.done ? "#fffdf5" : accent;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(row.label.slice(0, 2), dotX - 8, dotY + 3);
    ctx.fillStyle = row.active ? accent : "#8f5f3f";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(row.detail.slice(0, 6), dotX - 20, dotY + 18);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 56, cardY + rect.height - 19, rect.width - 68, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(`下一步：${spec.nextAction}`.slice(0, 26), rect.x + 64, cardY + rect.height - 9);
  ctx.restore();
  return true;
}

export function drawSpiritSproutForeshadowTrailWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0,
  focused = false,
  focusStepKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.steps?.length || !spec?.lineStart || !spec?.preview) return false;
  const accent = spec.sprout.stage === "peek" ? "#b47d2f" : spec.sprout.stage === "born" ? "#be4f37" : "#286f58";
  const { rect, lineStart } = spec;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = `${accent}${focused ? "aa" : "66"}`;
  ctx.lineWidth = focused ? 3 : 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(lineStart.x, lineStart.y);
  ctx.bezierCurveTo(lineStart.x + 26, lineStart.y - 42, rect.x + 22, cardY + 18, rect.x + 34, cardY + rect.height - 22);
  ctx.stroke();
  ctx.setLineDash([]);

  const glow = ctx.createRadialGradient(lineStart.x, lineStart.y, 4, lineStart.x, lineStart.y, spec.preview.tile * 1.08 + pulse);
  glow.addColorStop(0, "rgba(246, 240, 182, 0.26)");
  glow.addColorStop(0.58, "rgba(202, 235, 210, 0.16)");
  glow.addColorStop(1, "rgba(246, 240, 182, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(lineStart.x, lineStart.y + 22, spec.preview.tile * 0.82 + pulse, spec.preview.tile * 0.32, -0.04, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.93)");
  ctx.strokeStyle = focused ? "rgba(224, 182, 109, 0.86)" : `${accent}77`;
  ctx.lineWidth = focused ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}1f`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, cardY + 10, 42, 32, 12);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText("伏", rect.x + 25, cardY + 32);
  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 64, cardY + 19);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 64, cardY + 38);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText("夜动 -> 晨探 -> 手收 -> 代劳".slice(0, 28), rect.x + 174, cardY + 19);

  ctx.strokeStyle = "rgba(141, 164, 98, 0.42)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  spec.steps.forEach((step, index) => {
    const x = step.point.x;
    const y = step.point.y + bob;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  spec.steps.forEach((step) => {
    const x = step.point.x;
    const y = step.point.y + bob;
    const nodeFocused = focused && focusStepKey === step.key;
    const radius = step.active ? 12 + Math.max(0, pulse) : 10;
    ctx.fillStyle = step.done
      ? "rgba(141, 164, 98, 0.22)"
      : step.active
        ? "rgba(190, 79, 55, 0.2)"
        : "rgba(23, 35, 29, 0.1)";
    ctx.beginPath();
    ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = step.done ? "#8da462" : step.active ? "#be4f37" : "#a8b2aa";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(step.glyph, x, y + 4);
    ctx.fillStyle = step.active ? "#17231d" : "#5d6f65";
    ctx.font = step.active ? "800 9px Microsoft YaHei" : "700 8px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 4), x, cardY + 78);
    if (nodeFocused) {
      ctx.strokeStyle = "rgba(224, 182, 109, 0.86)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius + 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 58, cardY + rect.height - 28, 42, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("只定位", rect.x + rect.width - 49, cardY + rect.height - 16);
  ctx.restore();
  return true;
}

export function drawFirstSpiritPromiseWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0,
  focused = false,
  focusNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.rows?.length) return false;
  const { rect, plotAnchor, rows, activeRow } = spec;
  const accent = spec.completed >= 4 ? "#be4f37" : activeRow?.key === "signal" ? "#b47d2f" : "#286f58";
  const cardY = rect.y + bob;

  ctx.save();
  if (plotAnchor) {
    ctx.strokeStyle = `${accent}66`;
    ctx.lineWidth = focused ? 3 : 2;
    ctx.setLineDash([7, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
    ctx.beginPath();
    ctx.moveTo(plotAnchor.x, plotAnchor.y);
    ctx.quadraticCurveTo((plotAnchor.x + rect.x) / 2, Math.min(plotAnchor.y, rect.y) - 36, rect.x + 38, cardY + rect.height - 22);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(246, 240, 182, 0.22)";
    ctx.beginPath();
    ctx.ellipse(plotAnchor.x, plotAnchor.y + 16, 34 + pulse, 11 + pulse * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 253, 245, 0.92)");
  ctx.strokeStyle = focused ? "rgba(224, 182, 109, 0.86)" : `${accent}77`;
  ctx.lineWidth = focused ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}1f`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 52, 52, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(spec.completed >= spec.total ? "达" : "灵", rect.x + 31, cardY + 47);
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("30m", rect.x + 28, cardY + 63);

  ctx.fillStyle = accent;
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(`${spec.title} · ${spec.completed}/${spec.total}`, rect.x + 80, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 24), rect.x + 80, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.promiseText.slice(0, 38), rect.x + 80, cardY + 62);

  ctx.strokeStyle = "rgba(141, 164, 98, 0.42)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  rows.forEach((row, index) => {
    const x = row.point.x;
    const y = row.point.y + bob;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  rows.forEach((row) => {
    const x = row.point.x;
    const y = row.point.y + bob;
    const active = row.active;
    const nodeFocused = focused && focusNodeKey === row.key;
    const radius = active ? 13 + Math.max(0, pulse) : 11;
    ctx.fillStyle = row.done
      ? "rgba(141, 164, 98, 0.24)"
      : active
        ? "rgba(190, 79, 55, 0.2)"
        : "rgba(23, 35, 29, 0.1)";
    ctx.beginPath();
    ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = row.done ? "#8da462" : active ? "#be4f37" : "#a8b2aa";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 11px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(row.glyph, x, y + 4);
    ctx.fillStyle = active ? "#17231d" : "#5d6f65";
    ctx.font = active ? "800 10px Microsoft YaHei" : "700 9px Microsoft YaHei";
    ctx.fillText(row.label.slice(0, 5), x, cardY + 100);
    if (nodeFocused) {
      ctx.strokeStyle = "rgba(224, 182, 109, 0.82)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius + 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 66, cardY + 13, 48, 20, 10);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 53, cardY + 27);
  ctx.restore();
  return true;
}

export function drawFirstSpiritJoinTriptychWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  active = false,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawSpiritSprite = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.nodes?.length || !spec?.profile || !spec?.anchor) return false;
  const { rect, profile } = spec;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${profile.accent}cc` : `${profile.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.setLineDash(active ? [8, 5] : [5, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + 36, cardY + 22, rect.x + 18, cardY + 44);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = profile.accent;
  ctx.beginPath();
  ctx.arc(spec.anchor.x, spec.anchor.y, active ? 6 : 4, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 253, 245, 0.9)");
  ctx.fillStyle = profile.glow || "rgba(246, 240, 182, 0.22)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 46, 46, 16);
  ctx.fill();
  drawSpiritSprite(ctx, spec.spirit, rect.x + 17, cardY + 12, 42);
  ctx.fillStyle = profile.accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText("入队三拍", rect.x + 72, cardY + 28);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.replace(" · 可点", "").slice(0, 14), rect.x + 72, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 28), rect.x + 72, cardY + 64);

  spec.nodes.forEach((node, index) => {
    const nodeActive = activeNodeKey === node.key;
    const nodeBob = reducedMotion ? 0 : Math.sin(motion * 1.4 + index) * 0.8;
    ctx.fillStyle = nodeActive ? "rgba(255, 248, 232, 0.98)" : "rgba(255, 248, 232, 0.74)";
    ctx.strokeStyle = nodeActive ? profile.accent : "rgba(143, 95, 63, 0.32)";
    ctx.lineWidth = nodeActive ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(node.rect.x, node.rect.y + bob + nodeBob, node.rect.width, node.rect.height, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = profile.accent;
    ctx.font = "900 15px Microsoft YaHei";
    ctx.fillText(node.glyph, node.rect.x + 8, node.rect.y + 21 + bob + nodeBob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.label.slice(0, 5), node.rect.x + 30, node.rect.y + 17 + bob + nodeBob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.text.slice(0, 8), node.rect.x + 8, node.rect.y + 38 + bob + nodeBob);
  });

  ctx.fillStyle = "rgba(93, 111, 101, 0.82)";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText("只定位 · 不代劳", rect.x + rect.width - 90, cardY + rect.height - 10);
  ctx.restore();
  return true;
}
