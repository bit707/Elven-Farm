export function cropWorldGrowthVisualSpecFallback({
  crop = null,
  plot = null,
  plotIndex = 0,
  day = 1,
  cropSolarAffinity,
  cropSolarYieldBonus,
}) {
  if (!crop || !plot?.cropId) return null;
  const affinity = cropSolarAffinity(crop, plot);
  const yieldBonus = cropSolarYieldBonus(crop, plot, affinity);
  const growDays = Math.max(1, Number(crop.grow_days || 1));
  const age = Math.max(0, day - Number(plot.plantedDay || day));
  const rawProgress = plot.mature ? 1 : Math.max(0.08, Math.min(0.96, (age + (plot.watered ? 0.32 : 0)) / growDays));
  const stage = plot.mature
    ? "ripe"
    : rawProgress >= 0.72
      ? "bud"
      : rawProgress >= 0.38
        ? "leaf"
        : "sprout";
  const stageLabel = {
    sprout: "新芽",
    leaf: "抽叶",
    bud: "将熟",
    ripe: "可收",
  }[stage] || "生长";
  const needsWater = !plot.mature && !plot.watered;
  const affinityTone = affinity.state || "offseason";
  const palette = {
    boost: { accent: "#e0b66d", fill: "rgba(255, 248, 232, 0.9)", glow: "rgba(246, 240, 182, 0.28)" },
    season: { accent: "#48a868", fill: "rgba(237, 243, 223, 0.88)", glow: "rgba(202, 235, 210, 0.22)" },
    risk: { accent: "#be4f37", fill: "rgba(255, 240, 232, 0.92)", glow: "rgba(190, 79, 55, 0.2)" },
    offseason: { accent: "#8f5f3f", fill: "rgba(255, 253, 245, 0.82)", glow: "rgba(143, 95, 63, 0.13)" },
  }[affinityTone] || { accent: "#5d6f65", fill: "rgba(255, 253, 245, 0.82)", glow: "rgba(93, 111, 101, 0.13)" };
  const elementPalette = crop.element_type === "water"
    ? { body: "#4d91a6", leaf: "#caebd2" }
    : crop.element_type === "fire"
      ? { body: "#be4f37", leaf: "#f0a54e" }
      : crop.element_type === "wood"
        ? { body: "#48a868", leaf: "#f5f0b6" }
        : { body: "#b47d2f", leaf: "#286f58" };
  return {
    affinity,
    yieldBonus,
    growDays,
    age,
    progress: rawProgress,
    stage,
    stageLabel,
    needsWater,
    remaining: plot.mature ? 0 : Math.max(0, growDays - age),
    spriteScale: plot.mature ? 0.76 : Math.max(0.34, 0.36 + rawProgress * 0.28),
    plotIndex,
    palette,
    elementPalette,
    badge: yieldBonus.amount > 0 ? `${affinity.label || "宜"}+${yieldBonus.amount}` : affinity.label || stageLabel,
  };
}

export function drawCropWorldGrowthVisualWorld({ ctx, x, y, tile, visual, settings }) {
  if (!visual) return;
  const motion = settings.reducedMotion ? 0 : performance.now() / 1000;
  const pulse = settings.reducedMotion ? 0 : Math.sin(motion * 2.4 + visual.plotIndex) * 2;
  const centerX = x + tile / 2;
  const centerY = y + tile / 2;
  ctx.save();

  ctx.fillStyle = visual.stage === "ripe" ? "rgba(246, 240, 182, 0.26)" : visual.palette.glow;
  ctx.beginPath();
  ctx.ellipse(centerX, y + tile * 0.68, tile * (0.24 + visual.progress * 0.16) + pulse, tile * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();

  if (visual.needsWater) {
    ctx.strokeStyle = "rgba(92, 60, 42, 0.54)";
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x + tile * (0.18 + i * 0.2), y + tile * 0.36);
      ctx.lineTo(x + tile * (0.12 + i * 0.22), y + tile * 0.55);
      ctx.lineTo(x + tile * (0.28 + i * 0.18), y + tile * 0.72);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(232, 246, 242, 0.94)";
    ctx.strokeStyle = "rgba(77, 145, 166, 0.58)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x + 7, y + 7, 28, 20, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#4d91a6";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText("补水", x + 11, y + 21);
  }

  if (visual.stage === "sprout" || visual.stage === "leaf") {
    const sproutCount = visual.stage === "sprout" ? 2 : 4;
    ctx.strokeStyle = visual.elementPalette.body;
    ctx.lineWidth = 2.2;
    for (let i = 0; i < sproutCount; i += 1) {
      const offset = (i - (sproutCount - 1) / 2) * tile * 0.08;
      ctx.beginPath();
      ctx.moveTo(centerX + offset, y + tile * 0.66);
      ctx.quadraticCurveTo(centerX + offset * 0.4, y + tile * (0.58 - visual.progress * 0.12), centerX + offset * 1.2, y + tile * (0.48 - visual.progress * 0.12));
      ctx.stroke();
      ctx.fillStyle = i % 2 ? visual.elementPalette.leaf : visual.elementPalette.body;
      ctx.beginPath();
      ctx.ellipse(centerX + offset * 1.25, y + tile * (0.47 - visual.progress * 0.11), 4 + visual.progress * 5, 2.8 + visual.progress * 3, i % 2 ? 0.6 : -0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (visual.stage === "ripe" || visual.stage === "bud") {
    ctx.strokeStyle = visual.stage === "ripe" ? "rgba(224, 182, 109, 0.72)" : `${visual.palette.accent}66`;
    ctx.lineWidth = visual.stage === "ripe" ? 2.8 : 1.8;
    ctx.setLineDash(visual.stage === "ripe" ? [8, 6] : [5, 7]);
    ctx.lineDashOffset = settings.reducedMotion ? 0 : -motion * 14;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 2, tile * 0.38 + pulse, tile * 0.26 + pulse * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (visual.affinity.state !== "empty") {
    ctx.fillStyle = visual.palette.fill;
    ctx.strokeStyle = visual.palette.accent;
    ctx.lineWidth = visual.affinity.state === "boost" || visual.affinity.state === "risk" ? 2.1 : 1.3;
    ctx.beginPath();
    ctx.roundRect(x + tile - 36, y + tile - 23, 30, 18, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = visual.palette.accent;
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(visual.badge.slice(0, 4), x + tile - 32, y + tile - 10);
  }

  const progressWidth = Math.max(12, (tile - 18) * visual.progress);
  ctx.fillStyle = "rgba(23, 35, 29, 0.14)";
  ctx.beginPath();
  ctx.roundRect(x + 9, y + tile - 8, tile - 18, 4, 999);
  ctx.fill();
  ctx.fillStyle = visual.needsWater ? "#4d91a6" : visual.stage === "ripe" ? "#b47d2f" : visual.elementPalette.body;
  ctx.beginPath();
  ctx.roundRect(x + 9, y + tile - 8, progressWidth, 4, 999);
  ctx.fill();

  if (visual.stage === "ripe") {
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.82)" : "rgba(246, 240, 182, 0.78)";
      ctx.beginPath();
      ctx.arc(x + tile * (0.24 + i * 0.16), y + tile * (0.22 + (i % 2) * 0.1) + Math.sin(motion * 2 + i) * (settings.reducedMotion ? 0 : 2), 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}
