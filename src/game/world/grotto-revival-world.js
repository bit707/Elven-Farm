export function drawGrottoClearEchoWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.plot?.rect) return false;
  const { rect, plot } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4) * 2;
  const shimmer = reducedMotion ? 0.5 : (Math.sin(motion * 3.1) + 1) / 2;

  ctx.save();
  ctx.fillStyle = active ? "rgba(255, 253, 245, 0.34)" : `rgba(246, 240, 182, ${0.18 + shimmer * 0.12})`;
  ctx.beginPath();
  ctx.roundRect(plot.rect.x + 6, plot.rect.y + 6, plot.rect.width - 12, plot.rect.height - 12, 15);
  ctx.fill();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.94)" : "rgba(224, 182, 109, 0.58)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.ellipse(plot.screenX, plot.screenY + 7, plot.rect.width * (0.26 + shimmer * 0.06), plot.rect.height * 0.12, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(plot.screenX - 18, plot.screenY + 5);
  ctx.lineTo(plot.screenX, plot.screenY - 13 - shimmer * 4);
  ctx.lineTo(plot.screenX + 18, plot.screenY + 5);
  ctx.lineTo(plot.screenX, plot.screenY + 20 + shimmer * 3);
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : "rgba(180, 125, 47, 0.48)";
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(plot.screenX + 20, plot.screenY - 10);
  ctx.quadraticCurveTo((plot.screenX + rect.x) / 2, Math.min(plot.screenY, rect.y) - 22, rect.x + 36, rect.y + rect.height - 12 + pulse);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(255, 248, 232, 0.95)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.9)" : "rgba(180, 125, 47, 0.5)";
  ctx.lineWidth = active ? 2.5 : 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + pulse, rect.width - 2, rect.height - 2, 16);
  ctx.stroke();
  ctx.fillStyle = "rgba(224, 182, 109, 0.22)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 46, 46, 15);
  ctx.fill();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("清", rect.x + 28, rect.y + 44 + pulse);
  ctx.fillStyle = "#b47d2f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 72, rect.y + 24 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 72, rect.y + 47 + pulse);
  ctx.fillStyle = "#286f58";
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 28), rect.x + 72, rect.y + 66 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText("只定位露纹 · 不自动继续清理", rect.x + 72, rect.y + 82 + pulse);
  ctx.restore();
  return true;
}

export function drawFirstRevivalTriptychWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.plot?.rect) return false;
  const { rect, plot, nextPlot } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2.2;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.fillStyle = active ? "rgba(255, 253, 245, 0.36)" : "rgba(246, 240, 182, 0.18)";
  ctx.beginPath();
  ctx.roundRect(plot.rect.x + 5, plot.rect.y + 5, plot.rect.width - 10, plot.rect.height - 10, 14);
  ctx.fill();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.96)" : "rgba(224, 182, 109, 0.62)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.ellipse(plot.screenX, plot.screenY + 8, plot.rect.width * 0.32, plot.rect.height * 0.13, 0, 0, Math.PI * 2);
  ctx.stroke();

  if (nextPlot?.rect) {
    ctx.fillStyle = "rgba(190, 79, 55, 0.1)";
    ctx.beginPath();
    ctx.roundRect(nextPlot.rect.x + 8, nextPlot.rect.y + 8, nextPlot.rect.width - 16, nextPlot.rect.height - 16, 12);
    ctx.fill();
    ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.75)" : "rgba(190, 79, 55, 0.42)";
    ctx.lineWidth = active ? 2.4 : 1.6;
    ctx.setLineDash([5, 7]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
    ctx.beginPath();
    ctx.moveTo(plot.screenX + 18, plot.screenY - 8);
    ctx.quadraticCurveTo((plot.screenX + nextPlot.screenX) / 2, Math.min(plot.screenY, nextPlot.screenY) - 32, nextPlot.screenX - 18, nextPlot.screenY - 8);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.86)" : "rgba(180, 125, 47, 0.48)";
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(plot.screenX, plot.screenY - 18);
  ctx.quadraticCurveTo((plot.screenX + rect.x) / 2, Math.min(plot.screenY, cardY) - 30, rect.x + 34, cardY + rect.height - 12);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, active ? "rgba(255, 253, 245, 0.97)" : "rgba(255, 248, 232, 0.94)");
  ctx.strokeStyle = active ? `${spec.accent}ee` : `${spec.accent}88`;
  ctx.lineWidth = active ? 2.7 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = `${spec.accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 46, 46, 15);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("苏", rect.x + 28, cardY + 43);

  ctx.fillStyle = spec.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 72, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 26), rect.x + 72, cardY + 41);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.routeText.slice(0, 36), rect.x + 72, cardY + 57);

  const nodeY = cardY + 78;
  const startX = rect.x + 22;
  const gap = 98;
  ctx.strokeStyle = `${spec.accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX + 16, nodeY);
  ctx.lineTo(startX + gap * 2 + 16, nodeY);
  ctx.stroke();
  spec.nodes.forEach((node, index) => {
    const x = startX + index * gap;
    ctx.fillStyle = index === 0 ? "rgba(255, 240, 232, 0.95)" : index === 1 ? "rgba(246, 240, 182, 0.92)" : "rgba(237, 243, 223, 0.92)";
    ctx.strokeStyle = active || index === 1 ? spec.accent : `${spec.accent}88`;
    ctx.lineWidth = active || index === 1 ? 2.1 : 1.3;
    ctx.beginPath();
    ctx.arc(x + 16, nodeY, active || index === 1 ? 12 : 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = spec.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.glyph, x + 12, nodeY + 3);
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.label.slice(0, 5), x - 4, nodeY + 22);
  });

  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText("只定位 · 不自动继续清理", rect.x + 198, cardY + 96);

  if (!reducedMotion) {
    for (let i = 0; i < 5; i += 1) {
      const sparkleX = rect.x + rect.width - 34 - i * 13;
      const sparkleY = cardY + 18 + Math.sin(motion * 2.3 + i) * 4;
      ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.8)" : `${spec.accent}66`;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawFirstSeedWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.plot?.rect || !spec?.rect) return false;
  const { plot, rect } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2;
  const shimmer = reducedMotion ? 0.5 : (Math.sin(motion * 2.7) + 1) / 2;
  ctx.save();

  ctx.fillStyle = active ? "rgba(255, 253, 245, 0.36)" : `rgba(202, 235, 210, ${0.16 + shimmer * 0.08})`;
  ctx.beginPath();
  ctx.roundRect(plot.rect.x + 8, plot.rect.y + 8, plot.rect.width - 16, plot.rect.height - 16, 14);
  ctx.fill();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.9)" : "rgba(40, 111, 88, 0.52)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.ellipse(plot.screenX, plot.screenY + 14, plot.rect.width * (0.24 + shimmer * 0.06), plot.rect.height * 0.1, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(246, 240, 182, 0.74)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(plot.screenX - 20, plot.screenY + 10);
  ctx.quadraticCurveTo(plot.screenX - 6, plot.screenY - 10 - bob, plot.screenX, plot.screenY - 4);
  ctx.quadraticCurveTo(plot.screenX + 8, plot.screenY + 8 + bob, plot.screenX + 22, plot.screenY - 10);
  ctx.stroke();
  ctx.fillStyle = "#b47d2f";
  ctx.beginPath();
  ctx.arc(plot.screenX, plot.screenY - 10 + bob, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.beginPath();
  ctx.ellipse(plot.screenX - 7, plot.screenY - 18 + bob, 7, 4, -0.55, 0, Math.PI * 2);
  ctx.ellipse(plot.screenX + 7, plot.screenY - 18 + bob, 7, 4, 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.82)" : "rgba(40, 111, 88, 0.42)";
  ctx.lineWidth = active ? 2.5 : 1.7;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(plot.screenX + 18, plot.screenY - 14);
  ctx.quadraticCurveTo((plot.screenX + rect.x) / 2, rect.y + rect.height + 16, rect.x + 32, rect.y + rect.height - 10 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(237, 243, 223, 0.94)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.82)" : "rgba(40, 111, 88, 0.48)";
  ctx.lineWidth = active ? 2.4 : 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + bob, rect.width - 2, rect.height - 2, 16);
  ctx.stroke();
  ctx.fillStyle = "rgba(202, 235, 210, 0.44)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + bob, 42, 40, 14);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText("种", rect.x + 26, rect.y + 40 + bob);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 68, rect.y + 22 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 68, rect.y + 43 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 28), rect.x + 68, rect.y + 62 + bob);
  ctx.restore();
  return true;
}

export function drawGrottoVeinWorldChainWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  restoredKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.stages?.length) return false;
  const { rect, palette } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 2;
  const veinPoints = spec.stages.map((stage) => stage.point).filter(Boolean);
  ctx.save();

  if ((spec.restoredPlots || []).length > 0) {
    ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.72)" : "rgba(224, 182, 109, 0.38)";
    ctx.lineWidth = active ? 2.4 : 1.6;
    ctx.setLineDash([6, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
    (spec.restoredPlots || []).forEach((plot, index) => {
      const focused = active && restoredKey === plot.key;
      const shimmer = reducedMotion ? 0.5 : (Math.sin(motion * 2.5 + index * 0.7) + 1) / 2;
      ctx.beginPath();
      ctx.moveTo(plot.screenX, plot.screenY - 8);
      ctx.quadraticCurveTo((plot.screenX + rect.x) / 2, Math.min(plot.screenY, rect.y) - 24, rect.x + 42 + index * 18, rect.y + rect.height - 18 + pulse);
      ctx.stroke();
      ctx.fillStyle = focused ? "rgba(255, 253, 245, 0.42)" : `rgba(246, 240, 182, ${0.16 + shimmer * 0.12})`;
      ctx.beginPath();
      ctx.roundRect(plot.rect.x + 7, plot.rect.y + 7, plot.rect.width - 14, plot.rect.height - 14, 14);
      ctx.fill();
      ctx.strokeStyle = focused ? "rgba(224, 182, 109, 0.94)" : "rgba(224, 182, 109, 0.58)";
      ctx.lineWidth = focused ? 3 : 2;
      ctx.beginPath();
      ctx.ellipse(plot.screenX, plot.screenY + 6, plot.rect.width * (0.24 + shimmer * 0.08), plot.rect.height * 0.12, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(plot.screenX - 16, plot.screenY + 4);
      ctx.lineTo(plot.screenX, plot.screenY - 12 - shimmer * 4);
      ctx.lineTo(plot.screenX + 16, plot.screenY + 4);
      ctx.lineTo(plot.screenX, plot.screenY + 18 + shimmer * 3);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = focused ? "#b47d2f" : "#286f58";
      ctx.beginPath();
      ctx.arc(plot.screenX + 22, plot.screenY - 22, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
      ctx.font = "900 8px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(String(index + 1), plot.screenX + 22, plot.screenY - 19);
      ctx.textAlign = "left";
      if (index === 0 || focused) {
        ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
        ctx.beginPath();
        ctx.roundRect(plot.screenX - 44, plot.screenY + 28, 88, 22, 10);
        ctx.fill();
        ctx.fillStyle = focused ? "#b47d2f" : "#8f5f3f";
        ctx.font = "800 10px Microsoft YaHei";
        ctx.fillText(focused ? "复苏节点" : "第一口气回来了", plot.screenX - 36, plot.screenY + 43);
      }
    });
    ctx.setLineDash([]);
  }

  if (veinPoints.length > 1) {
    ctx.strokeStyle = active ? `${palette.accent}cc` : `${palette.accent}66`;
    ctx.lineWidth = active ? 4 : 2.4;
    ctx.setLineDash([10, 9]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
    ctx.beginPath();
    veinPoints.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else {
        const previous = veinPoints[index - 1];
        ctx.quadraticCurveTo((previous.x + point.x) / 2, Math.min(previous.y, point.y) - 34, point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  spec.stages.forEach((stage, index) => {
    const point = stage.point;
    const current = stage.key === spec.active?.key && !stage.done;
    const glowRadius = stage.done ? 30 : current ? 34 + pulse : 22;
    ctx.fillStyle = stage.done ? "rgba(202, 235, 210, 0.24)" : current ? palette.glow : "rgba(255, 253, 245, 0.18)";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y + 12, glowRadius, 12 + pulse * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = stage.done ? "#286f58" : current ? palette.accent : "rgba(255, 253, 245, 0.9)";
    ctx.strokeStyle = current ? palette.accent : stage.done ? "#286f58" : "rgba(143, 95, 63, 0.24)";
    ctx.lineWidth = current ? 3 : 1.5;
    ctx.beginPath();
    ctx.roundRect(point.x - 15, point.y - 24 + (current ? pulse : 0), 30, 28, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = stage.done || current ? "#fffdf5" : palette.accent;
    ctx.font = "900 12px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(stage.glyph, point.x, point.y - 6 + (current ? pulse : 0));
    ctx.textAlign = "left";
    if (current || stage.done || index === 0) {
      ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
      ctx.beginPath();
      ctx.roundRect(point.x - 32, point.y + 8, 64, 18, 9);
      ctx.fill();
      ctx.fillStyle = stage.done ? "#286f58" : palette.accent;
      ctx.font = "800 9px Microsoft YaHei";
      ctx.fillText(stage.label.slice(0, 5), point.x - 20, point.y + 21);
    }
  });

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, palette.soft);
  ctx.strokeStyle = active ? `${palette.accent}aa` : `${palette.accent}55`;
  ctx.lineWidth = active ? 2.4 : 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + pulse, rect.width - 2, rect.height - 2, 16);
  ctx.stroke();
  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 15 + pulse, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("纹", rect.x + 30, rect.y + 45 + pulse);
  ctx.fillStyle = palette.accent;
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(`${spec.title} · ${spec.doneCount}/${spec.total}`, rect.x + 78, rect.y + 27 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 78, rect.y + 50 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 78, rect.y + 69 + pulse);

  const laneX = rect.x + 18;
  const laneY = rect.y + 88 + pulse;
  const gap = 62;
  ctx.strokeStyle = `${palette.accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(laneX + 8, laneY);
  ctx.lineTo(laneX + gap * 4 + 8, laneY);
  ctx.stroke();
  spec.stages.forEach((stage, index) => {
    const dotX = laneX + index * gap;
    const current = stage.key === spec.active?.key && !stage.done;
    ctx.fillStyle = stage.done ? "#286f58" : current ? palette.accent : "rgba(255, 253, 245, 0.92)";
    ctx.strokeStyle = stage.done || current ? palette.accent : "rgba(93, 111, 101, 0.22)";
    ctx.lineWidth = current ? 2.5 : 1;
    ctx.beginPath();
    ctx.arc(dotX + 8, laneY, current ? 8 : 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = stage.done || current ? "#fffdf5" : palette.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(index + 1), dotX + 5, laneY + 3);
    ctx.fillStyle = current ? palette.accent : "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(stage.title.slice(0, 4), dotX - 4, laneY + 20);
  });
  ctx.restore();
  return true;
}
