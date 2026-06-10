export function drawLayeredHillsWorld({
  ctx,
  width = 960,
  height = 640,
  weatherFx = "",
  atmosphere = {},
} = {}) {
  if (!ctx) return false;
  const mist = weatherFx.includes("mist") || weatherFx.includes("rain") || weatherFx.includes("dew");
  ctx.save();
  ctx.fillStyle = atmosphere.hillFar || "rgba(40, 111, 88, 0.18)";
  ctx.beginPath();
  ctx.moveTo(0, 238);
  ctx.bezierCurveTo(130, 130, 238, 210, 360, 148);
  ctx.bezierCurveTo(470, 96, 572, 210, 690, 146);
  ctx.bezierCurveTo(806, 78, 878, 142, width, 104);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  ctx.fillStyle = atmosphere.hillNear || "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.moveTo(0, 318);
  ctx.bezierCurveTo(150, 224, 280, 272, 408, 218);
  ctx.bezierCurveTo(550, 158, 644, 286, 792, 210);
  ctx.bezierCurveTo(872, 168, 916, 194, width, 172);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  ctx.fillStyle = mist ? "rgba(255, 253, 245, 0.42)" : "rgba(255, 253, 245, 0.22)";
  for (let i = 0; i < 4; i += 1) {
    const y = 112 + i * 38;
    ctx.beginPath();
    ctx.ellipse(160 + i * 230, y, 142, 16, -0.04, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return true;
}

export function drawCanalAndTownWorld({
  ctx,
  height = 640,
  repaired = false,
  reducedMotion = false,
  now = 0,
} = {}) {
  if (!ctx) return false;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const canalGradient = ctx.createLinearGradient(80, 0, 820, height);
  canalGradient.addColorStop(0, repaired ? "rgba(71, 157, 168, 0.86)" : "rgba(98, 92, 78, 0.52)");
  canalGradient.addColorStop(1, repaired ? "rgba(202, 235, 210, 0.86)" : "rgba(132, 110, 85, 0.42)");
  ctx.strokeStyle = canalGradient;
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(792, 186);
  ctx.bezierCurveTo(676, 264, 674, 382, 548, 438);
  ctx.bezierCurveTo(420, 496, 304, 470, 180, 570);
  ctx.stroke();

  ctx.strokeStyle = repaired ? "rgba(255, 253, 245, 0.45)" : "rgba(255, 253, 245, 0.16)";
  ctx.lineWidth = 5;
  ctx.setLineDash([18, 24]);
  ctx.lineDashOffset = repaired && !reducedMotion ? -now / 28 : 0;
  ctx.beginPath();
  ctx.moveTo(792, 186);
  ctx.bezierCurveTo(676, 264, 674, 382, 548, 438);
  ctx.bezierCurveTo(420, 496, 304, 470, 180, 570);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(130, 98, 70, 0.32)";
  ctx.beginPath();
  ctx.ellipse(788, 176, 74, 22, -0.38, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8f5f3f";
  ctx.fillRect(64, 238, 146, 86);
  ctx.fillStyle = "#be4f37";
  ctx.beginPath();
  ctx.moveTo(48, 242);
  ctx.lineTo(138, 184);
  ctx.lineTo(226, 242);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.85)";
  ctx.fillRect(96, 272, 36, 52);
  ctx.fillStyle = "#286f58";
  ctx.fillRect(148, 264, 44, 30);

  ctx.fillStyle = "rgba(23, 35, 29, 0.24)";
  ctx.fillRect(40, 332, 246, 12);
  ctx.restore();
  return true;
}
