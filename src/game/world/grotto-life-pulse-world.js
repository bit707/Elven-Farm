function grottoLifePulseTonePaletteWorld(tone = "calm") {
  const palettes = {
    ripe: { accent: "#b47d2f", soft: "rgba(246, 240, 182, 0.28)", fill: "rgba(255, 253, 245, 0.9)" },
    care: { accent: "#4d91a6", soft: "rgba(77, 145, 166, 0.18)", fill: "rgba(236, 248, 243, 0.88)" },
    ready: { accent: "#286f58", soft: "rgba(72, 168, 104, 0.18)", fill: "rgba(255, 253, 245, 0.88)" },
    fire: { accent: "#be4f37", soft: "rgba(190, 79, 55, 0.16)", fill: "rgba(255, 248, 232, 0.9)" },
    spirit: { accent: "#7f5570", soft: "rgba(127, 85, 112, 0.16)", fill: "rgba(255, 253, 245, 0.9)" },
    warm: { accent: "#8f5f3f", soft: "rgba(224, 182, 109, 0.18)", fill: "rgba(255, 248, 232, 0.88)" },
    empty: { accent: "#5d6f65", soft: "rgba(93, 111, 101, 0.12)", fill: "rgba(255, 253, 245, 0.76)" },
    calm: { accent: "#286f58", soft: "rgba(72, 168, 104, 0.12)", fill: "rgba(255, 253, 245, 0.82)" },
  };
  return palettes[tone] || palettes.calm;
}

export function drawGrottoLifePulseWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  focusKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;

  ctx.save();
  drawCanvasCard(ctx, rect.x, rect.y, rect.width, rect.height, "rgba(255, 248, 232, 0.84)");
  const lead = spec.nodes[0];
  const leadPalette = grottoLifePulseTonePaletteWorld(lead.tone);
  ctx.fillStyle = leadPalette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14, 42, 42, 15);
  ctx.fill();
  ctx.fillStyle = leadPalette.accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("脉", rect.x + 25, rect.y + 42);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 68, rect.y + 28);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(`${spec.subtitle} · ${lead.title}：${lead.label}`.slice(0, 26), rect.x + 68, rect.y + 48);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(lead.text.slice(0, 30), rect.x + 18, rect.y + 78);

  for (const [index, node] of spec.nodes.entries()) {
    const palette = grottoLifePulseTonePaletteWorld(node.tone);
    const active = focusKey === node.key;
    const bob = reducedMotion ? 0 : Math.sin(motion * 1.5 + index * 0.7) * 1.8;
    if (node.anchor) {
      ctx.strokeStyle = `${palette.accent}${active ? "bb" : "66"}`;
      ctx.lineWidth = active ? 2.4 : 1.4;
      ctx.setLineDash(active ? [7, 5] : [4, 7]);
      ctx.lineDashOffset = reducedMotion ? 0 : -motion * 6;
      ctx.beginPath();
      ctx.moveTo(node.anchor.x, node.anchor.y);
      ctx.quadraticCurveTo(rect.x + rect.width * 0.5, rect.y + 28 + index * 4, node.rect.x + node.rect.width * 0.5, node.rect.y + bob);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.arc(node.anchor.x, node.anchor.y, active ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.98)" : palette.fill;
    ctx.strokeStyle = active ? palette.accent : `${palette.accent}88`;
    ctx.lineWidth = active ? 2.4 : 1.2;
    ctx.beginPath();
    ctx.roundRect(node.rect.x, node.rect.y + bob, node.rect.width, node.rect.height, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = palette.accent;
    ctx.font = "900 16px Microsoft YaHei";
    ctx.fillText(node.glyph, node.rect.x + 8, node.rect.y + 22 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 3), node.rect.x + 26, node.rect.y + 17 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.label.slice(0, 5), node.rect.x + 8, node.rect.y + 40 + bob);
  }
  ctx.fillStyle = "rgba(93, 111, 101, 0.82)";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText("可点定位 · 不代劳", rect.x + rect.width - 104, rect.y + rect.height - 12);
  ctx.restore();
  return true;
}
