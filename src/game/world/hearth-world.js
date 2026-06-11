export function drawChiliSpiritHearthWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  focused = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor || !spec.hearth) return false;
  const { rect, anchor, hearth } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 2.7) * 3;
  const flame = reducedMotion ? 0.6 : (Math.sin(motion * 5.2) + 1) / 2;
  const accent = spec.workshopJob ? "#be4f37" : "#b47d2f";
  const soft = spec.active ? "rgba(190, 79, 55, 0.18)" : "rgba(224, 182, 109, 0.16)";

  ctx.save();
  ctx.strokeStyle = focused ? "rgba(190, 79, 55, 0.72)" : "rgba(224, 182, 109, 0.42)";
  ctx.lineWidth = focused ? 3 : 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo((anchor.x + hearth.x) / 2, Math.min(anchor.y, hearth.y) - 46, hearth.x, hearth.y - 30);
  ctx.stroke();
  ctx.setLineDash([]);

  const glow = ctx.createRadialGradient(hearth.x, hearth.y - 20, 8, hearth.x, hearth.y - 20, 92);
  glow.addColorStop(0, spec.active ? "rgba(240, 165, 78, 0.34)" : "rgba(224, 182, 109, 0.2)");
  glow.addColorStop(1, "rgba(240, 165, 78, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(hearth.x, hearth.y - 20, 92, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 4; i += 1) {
    const fx = hearth.x - 22 + i * 14;
    const fy = hearth.y - 28 - flame * (8 + i);
    ctx.fillStyle = i % 2 ? "rgba(247, 211, 109, 0.86)" : "rgba(190, 79, 55, 0.82)";
    ctx.beginPath();
    ctx.moveTo(fx, fy - 16);
    ctx.bezierCurveTo(fx + 12, fy - 2, fx + 8, fy + 16, fx, fy + 20);
    ctx.bezierCurveTo(fx - 8, fy + 16, fx - 12, fy - 2, fx, fy - 16);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, spec.active ? "rgba(255, 240, 232, 0.96)" : "rgba(255, 248, 232, 0.95)");
  ctx.strokeStyle = focused ? "rgba(190, 79, 55, 0.82)" : `${accent}66`;
  ctx.lineWidth = focused ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 2, rect.y + 2 + bob, rect.width - 4, rect.height - 4, 18);
  ctx.stroke();

  ctx.fillStyle = soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 16 + bob, 58, 58, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 24px Microsoft YaHei";
  ctx.fillText("椒", rect.x + 28, rect.y + 54 + bob);
  ctx.fillStyle = "#f7d36d";
  ctx.beginPath();
  ctx.arc(rect.x + 61, rect.y + 28 + bob - flame * 4, 7 + flame * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 16), rect.x + 88, rect.y + 26 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 16px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 16), rect.x + 88, rect.y + 50 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 30), rect.x + 88, rect.y + 70 + bob);

  const barX = rect.x + 88;
  const barY = rect.y + 82 + bob;
  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, rect.width - 108, 12, 6);
  ctx.fill();
  ctx.fillStyle = spec.active ? "rgba(190, 79, 55, 0.72)" : "rgba(180, 125, 47, 0.48)";
  ctx.beginPath();
  ctx.roundRect(barX + 2, barY + 2, Math.max(12, (rect.width - 112) * (spec.active ? Math.max(0.08, spec.progress / 100) : 0.18)), 8, 4);
  ctx.fill();

  const chips = spec.stages.length ? spec.stages.slice(0, 3) : [{ label: spec.stageLabel, status: spec.active ? "active" : "pending" }];
  chips.forEach((stage, index) => {
    const chipX = rect.x + 16 + index * 78;
    const chipY = rect.y + rect.height - 20 + bob;
    const active = stage.status === "active";
    const done = stage.status === "done";
    ctx.fillStyle = active ? "rgba(190, 79, 55, 0.18)" : done ? "rgba(40, 111, 88, 0.16)" : "rgba(255, 253, 245, 0.68)";
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 70, 17, 8);
    ctx.fill();
    ctx.fillStyle = active ? "#be4f37" : done ? "#286f58" : "#8f5f3f";
    ctx.font = "700 9px Microsoft YaHei";
    ctx.fillText(String(stage.label || "待命").slice(0, 5), chipX + 9, chipY + 12);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.outputText} · 帮工 ${spec.helperCount}`.slice(0, 30), rect.x + 88, rect.y + 108 + bob);
  ctx.restore();
  return true;
}

export function drawLajiaoHearthTheaterWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  focused = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor || !spec.hearth) return false;
  const { rect, anchor, hearth } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4) * 3;
  const ember = reducedMotion ? 0.55 : (Math.sin(motion * 4.8) + 1) / 2;
  const accent = spec.ready ? "#be4f37" : "#b47d2f";

  ctx.save();
  ctx.strokeStyle = focused ? "rgba(190, 79, 55, 0.82)" : spec.ready ? "rgba(190, 79, 55, 0.48)" : "rgba(180, 125, 47, 0.42)";
  ctx.lineWidth = focused ? 3 : 2;
  ctx.setLineDash([5, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 18;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y - 6);
  ctx.quadraticCurveTo((anchor.x + hearth.x) / 2, Math.min(anchor.y, hearth.y) - 78, hearth.x, hearth.y - 54);
  ctx.quadraticCurveTo((hearth.x + rect.x) / 2, rect.y - 24, rect.x + 42, rect.y + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 5; i += 1) {
    const t = reducedMotion ? i / 4 : (motion * 0.12 + i * 0.19) % 1;
    const beadX = anchor.x + (hearth.x - anchor.x) * t;
    const beadY = anchor.y - 6 + (hearth.y - 54 - anchor.y) * t - Math.sin(t * Math.PI) * 42;
    ctx.fillStyle = i % 2 ? "rgba(247, 211, 109, 0.78)" : "rgba(190, 79, 55, 0.7)";
    ctx.beginPath();
    ctx.arc(beadX, beadY, 4 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.ready ? "rgba(255, 240, 232, 0.96)" : "rgba(255, 248, 232, 0.95)");
  ctx.strokeStyle = focused ? "rgba(190, 79, 55, 0.86)" : `${accent}66`;
  ctx.lineWidth = focused ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 2, rect.y + 2 + pulse, rect.width - 4, rect.height - 4, 18);
  ctx.stroke();

  ctx.fillStyle = spec.ready ? "rgba(190, 79, 55, 0.16)" : "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 16 + pulse, 62, 62, 17);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("火", rect.x + 34, rect.y + 55 + pulse);
  ctx.fillStyle = "#f7d36d";
  ctx.beginPath();
  ctx.arc(rect.x + 59, rect.y + 30 + pulse - ember * 4, 6 + ember * 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 17), rect.x + 92, rect.y + 26 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 16px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 16), rect.x + 92, rect.y + 50 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 92, rect.y + 70 + pulse);

  ctx.fillStyle = spec.ready ? "rgba(190, 79, 55, 0.12)" : "rgba(180, 125, 47, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 88 + pulse, 112, 20, 10);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 9), rect.x + 34, rect.y + 102 + pulse);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.stageLabel} · ${spec.rewardText}`.slice(0, 25), rect.x + 142, rect.y + 102 + pulse);
  ctx.restore();
  return true;
}
