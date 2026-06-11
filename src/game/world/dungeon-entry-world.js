export function drawDungeonEntranceSilhouetteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect, anchor, theme } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.9) * 2.4;

  ctx.save();

  if (anchor) {
    ctx.strokeStyle = `${theme.accent}55`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 7;
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y + 4);
    ctx.quadraticCurveTo(rect.x + rect.width * 0.72, rect.y + rect.height + 22, rect.x + rect.width - 28, rect.y + rect.height - 12);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(255, 253, 245, 0.91)");
  ctx.strokeStyle = activeNodeKey ? `${theme.accent}ee` : `${theme.accent}77`;
  ctx.lineWidth = activeNodeKey ? 2.5 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + pulse + 1, rect.width - 2, rect.height - 2, 20);
  ctx.stroke();

  ctx.fillStyle = "rgba(23, 35, 29, 0.08)";
  ctx.beginPath();
  ctx.ellipse(rect.x + 54, rect.y + 35 + pulse, 44, 17, -0.12, 0, Math.PI * 2);
  ctx.fill();
  drawGlyph(ctx, spec, rect.x + 24, rect.y + 15 + pulse, 42, motion);
  ctx.fillStyle = theme.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("入口辨识", rect.x + 24, rect.y + 58 + pulse);

  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 82, rect.y + 24 + pulse);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.subtitle} · ${spec.note}`.slice(0, 38), rect.x + 82, rect.y + 43 + pulse);

  spec.nodes.forEach((node, index) => {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    const isRule = node.key === "field_rule";
    const isSolution = node.key === "spirit_solution";
    const fill = isRule
      ? "rgba(236, 248, 243, 0.9)"
      : isSolution
        ? theme.soft
        : "rgba(255, 248, 232, 0.92)";
    const accent = isRule ? "#286f58" : isSolution ? theme.accent : "#b47d2f";
    const bob = active ? pulse / 1.7 : Math.sin(motion * 1.3 + index) * 0.8;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 15);
    ctx.fill();
    ctx.strokeStyle = active ? `${accent}ee` : `${accent}77`;
    ctx.lineWidth = active ? 2.4 : 1.4;
    ctx.stroke();

    ctx.fillStyle = active ? accent : `${accent}dd`;
    ctx.beginPath();
    ctx.arc(nodeRect.x + 21, nodeRect.y + 20 + bob, active ? 14 : 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 14px Microsoft YaHei";
    ctx.fillText(node.glyph, nodeRect.x + 14, nodeRect.y + 25 + bob);

    ctx.fillStyle = "#17231d";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.label, nodeRect.x + 40, nodeRect.y + 18 + bob);
    ctx.fillStyle = active ? accent : "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 8), nodeRect.x + 40, nodeRect.y + 33 + bob);
  });

  const focusNode = spec.nodes.find((node) => node.key === activeNodeKey) || spec.nodes[0];
  if (focusNode) {
    ctx.fillStyle = "rgba(236, 248, 243, 0.76)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 18, rect.y + rect.height - 19 + pulse, rect.width - 36, 14, 7);
    ctx.fill();
    ctx.fillStyle = "#286f58";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(`${focusNode.label}：${focusNode.text}`.slice(0, 51), rect.x + 30, rect.y + rect.height - 9 + pulse);
  }

  ctx.restore();
  return true;
}

export function drawDungeonEntranceFieldPreviewWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, anchor, theme } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.65) * 2.4;
  const cardY = rect.y + pulse;

  ctx.save();
  if (anchor) {
    ctx.strokeStyle = active ? `${theme.accent}cc` : `${theme.accent}55`;
    ctx.lineWidth = active ? 3 : 1.8;
    ctx.setLineDash([6, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y + 8);
    ctx.quadraticCurveTo(rect.x + rect.width - 42, cardY - 26, rect.x + rect.width - 30, cardY + 24);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 253, 245, 0.94)");
  ctx.strokeStyle = active ? `${theme.accent}ee` : `${theme.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = theme.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 58, 16);
  ctx.fill();
  drawGlyph(ctx, spec, rect.x + 21, cardY + 21, 44, motion);
  ctx.fillStyle = theme.accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("三幕", rect.x + 31, cardY + 79);

  ctx.fillStyle = theme.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 86, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 86, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.termLabel} · ${spec.puzzleCore}`.slice(0, 38), rect.x + 86, cardY + 64);

  const laneY = cardY + 88;
  ctx.strokeStyle = `${theme.accent}40`;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 38, laneY);
  ctx.lineTo(rect.x + rect.width - 38, laneY);
  ctx.stroke();
  spec.acts.forEach((act, index) => {
    const actX = rect.x + 42 + index * 112;
    const strong = active && index === 1;
    ctx.fillStyle = strong ? `${act.accent}dd` : "rgba(255, 253, 245, 0.92)";
    ctx.strokeStyle = `${act.accent}88`;
    ctx.lineWidth = strong ? 2.6 : 1.5;
    ctx.beginPath();
    ctx.arc(actX, laneY, strong ? 12 : 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = strong ? "#fffdf5" : act.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(act.badge, actX - 4, laneY + 3);

    ctx.fillStyle = act.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(act.title.slice(0, 5), actX - 22, laneY + 24);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(act.detail.slice(0, 10), actX - 32, laneY + 39);
  });

  ctx.fillStyle = "rgba(236, 248, 243, 0.74)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 18, rect.width - 36, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(spec.safeNote.slice(0, 48), rect.x + 26, cardY + rect.height - 8);
  ctx.restore();
  return true;
}
