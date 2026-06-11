export function drawWeatherLifeScenePropWorld({
  ctx,
  scene = null,
  motion = 0,
  index = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !scene) return false;
  const bob = reducedMotion ? 0 : Math.sin(motion * 2 + index * 0.8) * 2;
  ctx.save();
  ctx.translate(scene.x, scene.y + bob);
  ctx.fillStyle = "rgba(23, 35, 29, 0.14)";
  ctx.beginPath();
  ctx.ellipse(0, 36, 46, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  if (scene.key === "rain_awning") {
    ctx.fillStyle = "#4d91a6";
    ctx.beginPath();
    ctx.moveTo(-52, -2);
    ctx.quadraticCurveTo(-12, -34, 52, -4);
    ctx.lineTo(40, 8);
    ctx.quadraticCurveTo(0, -12, -42, 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 253, 245, 0.58)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-34 + i * 22, -12);
      ctx.lineTo(-42 + i * 24, 8);
      ctx.stroke();
    }
  } else if (scene.key === "rain_footprints") {
    ctx.fillStyle = "rgba(77, 145, 166, 0.42)";
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.ellipse(-42 + i * 14, 14 + (i % 2) * 10, 5, 2.6, i % 2 ? -0.4 : 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (scene.key === "pond_overflow") {
    ctx.strokeStyle = "rgba(159, 209, 223, 0.62)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(0, 4 + i * 10, 38 + i * 9 + Math.sin(motion + i) * 3, 8, -0.08, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (scene.key === "water_jars") {
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = i === 1 ? "#4d91a6" : "#8f5f3f";
      ctx.beginPath();
      ctx.roundRect(-36 + i * 28, 2 - i * 3, 22, 34, 8);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 253, 245, 0.5)";
      ctx.fillRect(-31 + i * 28, 10 - i * 3, 12, 4);
    }
  } else if (scene.key === "shade_cloth") {
    ctx.fillStyle = "rgba(224, 182, 109, 0.88)";
    ctx.beginPath();
    ctx.moveTo(-52, -10);
    ctx.lineTo(46, -24);
    ctx.lineTo(38, 10);
    ctx.lineTo(-46, 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8f5f3f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-44, 18);
    ctx.lineTo(-44, 44);
    ctx.moveTo(38, 10);
    ctx.lineTo(38, 42);
    ctx.stroke();
  } else if (scene.key === "dry_cracks") {
    ctx.strokeStyle = "rgba(92, 60, 42, 0.62)";
    ctx.lineWidth = 2.4;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-44 + i * 24, 0);
      ctx.lineTo(-28 + i * 20, 18);
      ctx.lineTo(-38 + i * 24, 36);
      ctx.stroke();
    }
  } else if (scene.key === "frost_brazier") {
    ctx.fillStyle = "#5b3928";
    ctx.beginPath();
    ctx.ellipse(0, 22, 32, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.82)" : "rgba(190, 79, 55, 0.82)";
      ctx.beginPath();
      ctx.moveTo(-18 + i * 8, 15);
      ctx.quadraticCurveTo(-12 + i * 7, -4 - Math.max(0, Math.sin(motion + i)) * 8, -5 + i * 7, 16);
      ctx.closePath();
      ctx.fill();
    }
  } else if (scene.key === "warm_cloth") {
    ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.roundRect(-42 + i * 28, 2 + i * 4, 38, 18, 7);
      ctx.fill();
      ctx.strokeStyle = "rgba(77, 145, 166, 0.34)";
      ctx.stroke();
    }
  } else if (scene.key === "window_frost") {
    ctx.strokeStyle = "rgba(228, 246, 242, 0.78)";
    ctx.lineWidth = 2;
    ctx.strokeRect(-28, -8, 56, 42);
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-18 + i * 12, 4);
      ctx.lineTo(-8 + i * 10, 24);
      ctx.moveTo(-20 + i * 14, 20);
      ctx.lineTo(0 + i * 10, 8);
      ctx.stroke();
    }
  } else if (scene.key === "mist_lanterns") {
    for (let i = 0; i < 3; i += 1) {
      const x = -36 + i * 36;
      ctx.strokeStyle = "#5b3928";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, -12);
      ctx.lineTo(x, 36);
      ctx.stroke();
      ctx.fillStyle = `rgba(246, 240, 182, ${0.54 + i * 0.08})`;
      ctx.beginPath();
      ctx.arc(x, 2, 13 + Math.sin(motion + i) * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (scene.key === "fog_sign") {
    ctx.fillStyle = "#8f5f3f";
    ctx.beginPath();
    ctx.roundRect(-44, -10, 88, 32, 9);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText("旧铺", -15, 10);
    ctx.fillStyle = "rgba(255, 253, 245, 0.28)";
    ctx.fillRect(-54, 25, 108, 12);
  } else if (scene.key === "dew_leaf_bowls") {
    ctx.fillStyle = "#286f58";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(-30 + i * 30, 12, 18, 7, -0.2 + i * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 253, 245, 0.72)";
      ctx.beginPath();
      ctx.arc(-30 + i * 30, 8, 3 + Math.max(0, Math.sin(motion + i)) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#286f58";
    }
  } else if (scene.key === "herb_dew") {
    ctx.strokeStyle = "#8f5f3f";
    ctx.lineWidth = 3;
    ctx.strokeRect(-42, -4, 84, 38);
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = "#48a868";
      ctx.beginPath();
      ctx.ellipse(-30 + i * 15, 18, 5, 9, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 253, 245, 0.72)";
      ctx.beginPath();
      ctx.arc(-28 + i * 15, 8, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (scene.key === "cloud_queue") {
    ctx.fillStyle = "rgba(255, 253, 245, 0.48)";
    ctx.beginPath();
    ctx.ellipse(-16, -8, 44, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(24, -4, 38, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(93, 111, 101, 0.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-44, 24);
    ctx.quadraticCurveTo(-8, 8, 48, 24);
    ctx.stroke();
  } else if (scene.key === "clear_bench") {
    ctx.fillStyle = "#8f5f3f";
    ctx.fillRect(-42, 10, 84, 10);
    ctx.fillRect(-34, 24, 68, 8);
    ctx.strokeStyle = "#5b3928";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-28, 32);
    ctx.lineTo(-34, 48);
    ctx.moveTo(28, 32);
    ctx.lineTo(34, 48);
    ctx.stroke();
    ctx.fillStyle = "rgba(246, 240, 182, 0.72)";
    ctx.beginPath();
    ctx.arc(46, -8, 10 + Math.sin(motion) * 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (scene.key === "drying_rack") {
    ctx.strokeStyle = "#8f5f3f";
    ctx.lineWidth = 3;
    ctx.strokeRect(-44, -4, 88, 38);
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i % 2 ? "#e0b66d" : "#fffdf5";
      ctx.beginPath();
      ctx.roundRect(-36 + i * 20, 2, 14, 28, 4);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
  ctx.beginPath();
  ctx.roundRect(-52, -46, 112, 28, 12);
  ctx.fill();
  ctx.strokeStyle = `${scene.accent}66`;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = scene.accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(scene.label.slice(0, 8), -40, -28);
  ctx.restore();
  return true;
}

export function drawWeatherLifeVignettesWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawWeatherLifeSceneProp = null,
} = {}) {
  if (!ctx || !spec?.active || typeof drawWeatherLifeSceneProp !== "function") return false;
  ctx.save();
  spec.scenes.forEach((scene, index) => drawWeatherLifeSceneProp(ctx, scene, motion, index));
  const lead = spec.scenes[0];
  if (lead) {
    drawCanvasCard(ctx, 660, 148, 246, 68, "rgba(255, 248, 232, 0.84)");
    ctx.fillStyle = `${lead.accent}22`;
    ctx.beginPath();
    ctx.roundRect(676, 164, 38, 36, 13);
    ctx.fill();
    ctx.fillStyle = lead.accent;
    ctx.font = "800 16px Microsoft YaHei";
    ctx.fillText("景", 686, 187);
    ctx.font = "700 12px Microsoft YaHei";
    ctx.fillText(spec.title, 728, 168);
    ctx.fillStyle = "#17231d";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText(lead.label.slice(0, 12), 728, 188);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "11px Microsoft YaHei";
    ctx.fillText(lead.text.slice(0, 26), 728, 205);
  }
  ctx.restore();
  return true;
}
