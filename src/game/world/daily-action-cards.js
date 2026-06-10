export function drawSleepPrepChecklistCardWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motionMs = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec) return false;
  const rows = (spec.topRows.length ? spec.topRows : spec.rows.slice(0, 2)).slice(0, 3);
  const width = 284;
  const height = 66 + rows.length * 21;
  const x = ctx.canvas.width - width - 42;
  const y = 128;
  const accent = spec.stateClass === "busy" ? "#be4f37" : spec.stateClass === "warn" ? "#b47d2f" : "#286f58";
  const bob = reducedMotion ? 0 : Math.sin(motionMs / 520) * 2;
  ctx.save();
  drawCanvasCard(ctx, x, y + bob, width, height, spec.stateClass === "ready" ? "rgba(237, 243, 223, 0.88)" : "rgba(255, 248, 232, 0.9)");
  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(x + 16, y + 16 + bob, 50, 42, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 18px Microsoft YaHei";
  ctx.fillText("暮", x + 31, y + 43 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 15px Microsoft YaHei";
  ctx.fillText(`入夜前准备 ${spec.readinessScore}`, x + 78, y + 31 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(spec.sleepAdvice.slice(0, 22), x + 78, y + 51 + bob);
  rows.forEach((row, index) => {
    const rowY = y + 78 + index * 21 + bob;
    ctx.fillStyle = row.status === "warn" ? "#be4f37" : row.status === "todo" ? "#8f5f3f" : "#286f58";
    ctx.font = "700 12px Microsoft YaHei";
    ctx.fillText(`${index + 1}. ${row.label}`.slice(0, 22), x + 22, rowY);
  });
  ctx.restore();
  return true;
}

export function drawMorningActionBoardCardWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motionMs = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rows?.length) return false;
  const rows = spec.rows.slice(0, 2);
  const width = 286;
  const height = 74 + rows.length * 21;
  const x = 44;
  const y = 146;
  const accent = spec.stateClass === "urgent" ? "#be4f37" : spec.stateClass === "active" ? "#b47d2f" : "#286f58";
  const bob = reducedMotion ? 0 : Math.sin(motionMs / 620) * 1.5;
  ctx.save();
  drawCanvasCard(ctx, x, y + bob, width, height, spec.stateClass === "urgent" ? "rgba(255, 248, 232, 0.9)" : "rgba(248, 252, 247, 0.88)");
  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(x + 16, y + 16 + bob, 54, 48, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 18px Microsoft YaHei";
  ctx.fillText("晨", x + 32, y + 45 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 15px Microsoft YaHei";
  ctx.fillText(`清晨行动牌 · 第 ${spec.day} 天`, x + 84, y + 31 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(`${spec.termName} · ${spec.weatherName}`.slice(0, 20), x + 84, y + 51 + bob);
  rows.forEach((row, index) => {
    const rowY = y + 82 + index * 21 + bob;
    ctx.fillStyle = row.tone === "ember" ? "#be4f37" : row.tone === "water" ? "#4d91a6" : row.tone === "flower" ? "#a55666" : "#8f5f3f";
    ctx.font = "700 12px Microsoft YaHei";
    ctx.fillText(`${index + 1}. ${row.title}`.slice(0, 22), x + 22, rowY);
  });
  ctx.restore();
  return true;
}

export function drawSolarMorningSignBadgeWorld({
  ctx,
  sign = null,
  reducedMotion = false,
  motion = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !sign) return false;
  const palette = sign.tone === "urgent"
    ? { accent: "#be4f37", soft: "rgba(190, 79, 55, 0.12)", glyph: "险" }
    : sign.tone === "water"
      ? { accent: "#4d91a6", soft: "rgba(77, 145, 166, 0.16)", glyph: "露" }
      : sign.tone === "gold"
        ? { accent: "#b47d2f", soft: "rgba(224, 182, 109, 0.18)", glyph: "时" }
        : { accent: "#286f58", soft: "rgba(40, 111, 88, 0.14)", glyph: "签" };
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2) * 2;
  const x = 44;
  const y = 274;
  const reading = (sign.reading || []).slice(0, 3);
  const height = reading.length ? 98 : 74;
  ctx.save();
  drawCanvasCard(ctx, x, y + pulse, 250, height, "rgba(255, 253, 245, 0.86)");
  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(x + 14, y + 14 + pulse, 46, 46, 15);
  ctx.fill();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + 37, y + 37 + pulse, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = palette.accent;
  ctx.font = "800 17px Microsoft YaHei";
  ctx.fillText(palette.glyph, x + 28, y + 43 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(`${sign.title} · ${sign.termName}`.slice(0, 16), x + 72, y + 28 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${sign.weatherName} · ${sign.cta}`.slice(0, 22), x + 72, y + 47 + pulse);
  ctx.fillStyle = palette.accent;
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(sign.summary.slice(0, 24), x + 72, y + 63 + pulse);
  reading.forEach((entry, index) => {
    const chipX = x + 16 + index * 78;
    const chipY = y + 73 + pulse;
    ctx.fillStyle = index === 0
      ? "rgba(40, 111, 88, 0.12)"
      : index === 1
        ? "rgba(190, 79, 55, 0.1)"
        : "rgba(224, 182, 109, 0.14)";
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 70, 18, 8);
    ctx.fill();
    ctx.fillStyle = index === 1 ? "#be4f37" : index === 2 ? "#8f5f3f" : "#286f58";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(`${entry.label}${entry.title}`.slice(0, 6), chipX + 7, chipY + 13);
  });
  ctx.restore();
  return true;
}
