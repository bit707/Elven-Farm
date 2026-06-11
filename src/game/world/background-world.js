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

export function drawAmbientMotesWorld({
  ctx,
  width = 960,
  height = 640,
  weatherFx = "",
  termId = "",
  reducedMotion = false,
  day = 1,
  now = 0,
} = {}) {
  if (!ctx) return false;
  const isRain = weatherFx.includes("rain");
  const isCold = weatherFx.includes("snow") || weatherFx.includes("frost") || weatherFx.includes("cold");
  ctx.save();
  ctx.fillStyle = isRain ? "rgba(77, 145, 166, 0.28)" : isCold ? "rgba(255, 255, 255, 0.58)" : "rgba(246, 240, 182, 0.36)";
  for (let i = 0; i < 28; i += 1) {
    const drift = reducedMotion ? 0 : now / (70 + i * 2);
    const x = (i * 83 + day * 29 + drift) % width;
    const y = 150 + ((i * 47 + day * 31 + drift) % (height - 210));
    const radius = termId.includes("guyu") || termId.includes("qingming") ? 3 : 2;
    ctx.beginPath();
    ctx.arc(x, y, radius + (i % 3) * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return true;
}

export function drawDroughtWorldOverlayWorld({
  ctx,
  width = 960,
  height = 640,
  active = false,
  reducedMotion = false,
  now = 0,
} = {}) {
  if (!ctx || !active) return false;
  const pulse = reducedMotion ? 0 : Math.sin(now / 460) * 3;
  ctx.save();
  ctx.fillStyle = "rgba(190, 79, 55, 0.10)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(92, 60, 42, 0.28)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i += 1) {
    const x = 112 + i * 82;
    ctx.beginPath();
    ctx.moveTo(x, 512 + (i % 2) * 10);
    ctx.lineTo(x - 18, 548 + pulse);
    ctx.lineTo(x + 12, 590 - pulse);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 248, 232, 0.72)";
  ctx.beginPath();
  ctx.roundRect(698, 302, 138, 52, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.42)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(744, 326, 34, 18, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText("镇井见底", 784, 330);
  ctx.strokeStyle = "rgba(224, 182, 109, 0.34)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    const y = 166 + i * 46 + pulse;
    ctx.beginPath();
    ctx.moveTo(38, y);
    ctx.bezierCurveTo(184, y - 18, 314, y + 28, 472, y - 8);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawFinalBanquetWorldOverlayWorld({
  ctx,
  width = 960,
  height = 640,
  active = false,
  reducedMotion = false,
  motion = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !active) return false;
  ctx.save();
  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, "rgba(246, 240, 182, 0.16)");
  wash.addColorStop(0.58, "rgba(224, 182, 109, 0.07)");
  wash.addColorStop(1, "rgba(190, 79, 55, 0.08)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 18; i += 1) {
    const drift = reducedMotion ? 0 : motion * (10 + i * 0.6);
    const x = (i * 67 + drift * 8) % width;
    const y = 48 + ((i * 43 + drift * 5) % (height - 96));
    ctx.fillStyle = i % 3 === 0 ? "rgba(246, 240, 182, 0.42)" : "rgba(224, 182, 109, 0.28)";
    ctx.beginPath();
    ctx.roundRect(x, y, 8, 12, 4);
    ctx.fill();
  }

  drawCanvasCard(ctx, width - 330, height - 132, 286, 88, "rgba(255, 248, 232, 0.88)");
  ctx.fillStyle = "#be4f37";
  ctx.font = "700 14px Microsoft YaHei";
  ctx.fillText("主线完成 · 第二年已开启", width - 306, height - 102);
  ctx.fillStyle = "#17231d";
  ctx.font = "13px Microsoft YaHei";
  ctx.fillText("洞天进入自由经营、同住后日谈与商路扩张", width - 306, height - 78);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText("蟠桃大宴的灯还没灭，新的年册已经翻开。", width - 306, height - 58);
  ctx.restore();
  return true;
}
