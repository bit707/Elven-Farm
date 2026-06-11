export function drawSolarTermFieldAuraWorld({
  ctx,
  x = 0,
  y = 0,
  tile = 0,
  plot = null,
  atmosphere = null,
  plotIndex = 0,
  reducedMotion = false,
  now = 0,
  crop = null,
  affinity = { state: "empty", label: "" },
} = {}) {
  if (!ctx || !plot || !atmosphere) return false;
  const motion = reducedMotion ? 0 : now / 700;
  ctx.save();
  ctx.fillStyle = atmosphere.fieldWash;
  ctx.beginPath();
  ctx.roundRect(x + 5, y + 5, tile - 10, tile - 10, 7);
  ctx.fill();
  ctx.strokeStyle = atmosphere.accent;
  ctx.fillStyle = atmosphere.mote;
  ctx.lineWidth = 1.6;
  const offset = reducedMotion ? 0 : Math.sin(motion + plotIndex) * 2;
  if (atmosphere.motif === "leaf") {
    ctx.beginPath();
    ctx.ellipse(x + tile * 0.24, y + tile * 0.28 + offset, 6, 3.5, -0.5, 0, Math.PI * 2);
    ctx.ellipse(x + tile * 0.72, y + tile * 0.66 - offset, 5, 3, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (atmosphere.motif === "rain" || atmosphere.motif === "dew") {
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(x + 14 + i * 18, y + 18 + ((plotIndex + i) % 3) * 11, atmosphere.motif === "dew" ? 2.5 : 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (atmosphere.motif === "spark") {
    ctx.beginPath();
    ctx.moveTo(x + tile * 0.18, y + tile * 0.2);
    ctx.lineTo(x + tile * 0.3, y + tile * 0.36);
    ctx.lineTo(x + tile * 0.24, y + tile * 0.36);
    ctx.lineTo(x + tile * 0.38, y + tile * 0.56);
    ctx.stroke();
  } else if (atmosphere.motif === "heat" || atmosphere.motif === "sun") {
    for (let i = 0; i < 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x + 12, y + 22 + i * 16);
      ctx.bezierCurveTo(x + 25, y + 14 + i * 16 + offset, x + 40, y + 30 + i * 16, x + 54, y + 22 + i * 16);
      ctx.stroke();
    }
  } else if (atmosphere.motif === "grain") {
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x + 18 + i * 12, y + tile * 0.64);
      ctx.lineTo(x + 15 + i * 12, y + tile * 0.44);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x + 14 + i * 12, y + tile * 0.48, 3, 6, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (atmosphere.motif === "frost") {
    ctx.beginPath();
    ctx.moveTo(x + 9, y + 11);
    ctx.lineTo(x + 25, y + 11);
    ctx.moveTo(x + 11, y + 9);
    ctx.lineTo(x + 11, y + 25);
    ctx.moveTo(x + tile - 10, y + tile - 26);
    ctx.lineTo(x + tile - 10, y + tile - 10);
    ctx.stroke();
  } else if (atmosphere.motif === "lantern") {
    ctx.beginPath();
    ctx.roundRect(x + tile * 0.68, y + tile * 0.2 + offset, 8, 11, 4);
    ctx.fill();
  }

  if (crop && affinity.state !== "empty") {
    const colors = {
      boost: "#e0b66d",
      season: "#48a868",
      risk: "#be4f37",
      offseason: "#5d6f65",
    };
    const color = colors[affinity.state] || atmosphere.accent;
    ctx.fillStyle = affinity.state === "risk" ? "rgba(239, 217, 208, 0.92)" : "rgba(255, 253, 245, 0.88)";
    ctx.strokeStyle = color;
    ctx.lineWidth = affinity.state === "risk" || affinity.state === "boost" ? 2.4 : 1.6;
    ctx.beginPath();
    ctx.roundRect(x + tile - 26, y + 6, 20, 18, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(affinity.label, x + tile - 21, y + 19);
    if (affinity.state === "boost" || affinity.state === "risk") {
      ctx.strokeStyle = color;
      ctx.globalAlpha = affinity.state === "risk" ? 0.52 : 0.42;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x + 3, y + 3, tile - 6, tile - 6, 8);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();
  return true;
}

export function drawFieldRiskOverlayWorld({
  ctx,
  x = 0,
  y = 0,
  tile = 0,
  plot = null,
  plotIndex = 0,
  risk = null,
  guard = null,
  reducedMotion = false,
  now = 0,
} = {}) {
  if (!ctx || !risk || !plot?.cropId) return false;
  const guardState = guard?.state || "active";
  const motion = reducedMotion ? 0 : now / 520;
  const alpha = guardState === "guarded" ? 0.18 : guardState === "weaken" ? 0.28 : 0.42;
  ctx.save();
  if (risk.kind === "pest") {
    ctx.fillStyle = `rgba(65, 70, 42, ${alpha})`;
    for (let i = 0; i < Math.max(2, Number(risk.severity || 2)); i += 1) {
      const px = x + tile * (0.22 + i * 0.18) + Math.sin(motion + i + plotIndex) * 3;
      const py = y + tile * (0.24 + (i % 2) * 0.32) + Math.cos(motion * 0.8 + i) * 2;
      ctx.beginPath();
      ctx.ellipse(px, py, 4, 7, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(px - 5, py - 1, 10, 2);
    }
  } else if (risk.kind === "frost") {
    ctx.strokeStyle = `rgba(228, 246, 242, ${Math.min(0.74, alpha + 0.28)})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x + tile * (0.22 + i * 0.18), y + tile * 0.18);
      ctx.lineTo(x + tile * (0.34 + i * 0.16), y + tile * 0.46);
      ctx.lineTo(x + tile * (0.24 + i * 0.2), y + tile * 0.74);
      ctx.stroke();
    }
  } else if (risk.kind === "drought") {
    ctx.strokeStyle = `rgba(92, 60, 42, ${Math.min(0.82, alpha + 0.22)})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x + tile * (0.24 + i * 0.18), y + tile * 0.22);
      ctx.lineTo(x + tile * (0.18 + i * 0.2), y + tile * 0.48);
      ctx.lineTo(x + tile * (0.34 + i * 0.16), y + tile * 0.72);
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = `rgba(190, 79, 55, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + tile / 2, y + tile / 2, tile * (0.24 + Math.sin(motion + plotIndex) * 0.03), 0, Math.PI * 2);
    ctx.stroke();
  }

  if (guardState === "guarded" || guardState === "weaken") {
    ctx.strokeStyle = guardState === "guarded" ? "rgba(246, 240, 182, 0.72)" : "rgba(224, 182, 109, 0.52)";
    ctx.lineWidth = guardState === "guarded" ? 3 : 2;
    ctx.beginPath();
    ctx.roundRect(x + 6, y + 6, tile - 12, tile - 12, 12);
    ctx.stroke();
    ctx.fillStyle = "rgba(246, 240, 182, 0.58)";
    ctx.beginPath();
    ctx.arc(x + tile - 14, y + 14, 4 + Math.sin(motion) * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return true;
}

export function drawGrowingCropUseRouteBadgeWorld({
  ctx,
  x = 0,
  y = 0,
  tile = 0,
  plot = null,
  plotIndex = 0,
  route = null,
  reducedMotion = false,
  now = 0,
} = {}) {
  if (!ctx || !plot?.cropId || !route || route.type === "stock") return false;
  const label = route.type === "order" ? "单" : route.type === "recipe" ? "锅" : route.type === "shop" ? "铺" : "仓";
  const palette = route.type === "order"
    ? { fill: "rgba(255, 248, 232, 0.9)", stroke: "#d19a4a", text: "#8f5f3f" }
    : route.type === "recipe"
      ? { fill: "rgba(255, 244, 232, 0.88)", stroke: "#be4f37", text: "#8f5f3f" }
      : { fill: "rgba(248, 252, 247, 0.9)", stroke: "#4d91a6", text: "#286f58" };
  const motion = reducedMotion ? 0 : Math.sin(now / 760 + plotIndex) * 1.2;
  ctx.save();
  ctx.fillStyle = palette.fill;
  ctx.strokeStyle = palette.stroke;
  ctx.lineWidth = plot.mature ? 2.4 : 1.6;
  ctx.beginPath();
  ctx.roundRect(x + 6, y + tile - 24 + motion, 22, 18, 7);
  ctx.fill();
  ctx.stroke();
  if (plot.mature) {
    ctx.strokeStyle = "rgba(246, 240, 182, 0.58)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 17, y + tile - 15 + motion, 14, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = palette.text;
  ctx.font = "800 12px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(label, x + 17, y + tile - 11 + motion);
  ctx.restore();
  return true;
}
