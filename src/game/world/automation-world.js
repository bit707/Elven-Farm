export function spiritAutomationBenefitToneColorWorld(tone = "stable") {
  const colors = {
    urgent: "#be4f37",
    hot: "#be4f37",
    gold: "#b47d2f",
    ready: "#286f58",
    stable: "#5d6f65",
    water: "#4d91a6",
    flower: "#d87f8d",
  };
  return colors[tone] || colors.stable;
}

export function drawSpiritAutomationRelayWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  activeJob = "",
  reducedMotion = false,
  pointOnPolyline = (points) => points?.[0] || { x: 0, y: 0 },
  toneColor = spiritAutomationBenefitToneColorWorld,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.nodes?.length) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.85) * 2.2;
  const routePoints = spec.nodes.map((node) => node.anchor);
  const accent = spec.activeCount >= 3 ? "#286f58" : spec.activeCount >= 2 ? "#b47d2f" : "#8f5f3f";

  ctx.save();
  if (routePoints.length >= 2) {
    ctx.strokeStyle = active ? `${accent}dd` : `${accent}88`;
    ctx.lineWidth = active ? 4 : 2.6;
    ctx.setLineDash([12, 9]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
    ctx.beginPath();
    routePoints.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y - 18 + pulse);
      else {
        const previous = routePoints[index - 1];
        ctx.quadraticCurveTo(
          (previous.x + point.x) / 2,
          Math.min(previous.y, point.y) - 72 + pulse,
          point.x,
          point.y - 18 + pulse * 0.4,
        );
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    const beadCount = Math.max(2, Math.min(5, spec.nodes.length + 1));
    for (let i = 0; i < beadCount; i += 1) {
      const point = pointOnPolyline(routePoints, reducedMotion ? i / Math.max(1, beadCount - 1) : (motion * 0.12 + i / beadCount) % 1);
      ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.86)" : `${accent}aa`;
      ctx.beginPath();
      ctx.arc(point.x, point.y - 22 + pulse * 0.5, 5 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  spec.nodes.forEach((node) => {
    const nodeAccent = toneColor(node.tone);
    const selected = active && activeJob === node.job;
    ctx.fillStyle = node.active ? `${nodeAccent}24` : "rgba(255, 253, 245, 0.38)";
    ctx.strokeStyle = selected ? `${nodeAccent}ee` : node.active ? `${nodeAccent}99` : "rgba(143, 95, 63, 0.28)";
    ctx.lineWidth = selected ? 2.8 : node.active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(node.rect.x, node.rect.y + pulse, node.rect.width, node.rect.height, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.active ? nodeAccent : "#8f5f3f";
    ctx.font = "900 12px Microsoft YaHei";
    ctx.fillText(`${node.index + 1}${node.glyph || node.routeName.slice(0, 1)}`, node.rect.x + 9, node.rect.y + 21 + pulse);
    ctx.fillStyle = node.active ? "#17231d" : "#5d6f65";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.routeName.slice(0, 4), node.rect.x + 32, node.rect.y + 15 + pulse);
    ctx.fillStyle = node.active ? nodeAccent : "#8f5f3f";
    ctx.font = "700 8px Microsoft YaHei";
    ctx.fillText(node.active ? "接力中" : "待接棒", node.rect.x + 32, node.rect.y + 27 + pulse);
  });

  const { rect } = spec;
  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, spec.activeCount >= 2 ? "rgba(248, 252, 247, 0.94)" : "rgba(255, 248, 232, 0.94)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.88)" : `${accent}66`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, rect.y + 1.5 + pulse, rect.width - 3, rect.height - 3, 17);
  ctx.stroke();
  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 48, 42, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("接", rect.x + 31, rect.y + 42 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 接力节点 ${spec.activeCount}/${spec.totalCount}`, rect.x + 76, rect.y + 25 + pulse);
  ctx.fillStyle = accent;
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(`省工接力：${spec.previewRoute}`.slice(0, 26), rect.x + 76, rect.y + 45 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 76, rect.y + 63 + pulse);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 36, rect.y + 20 + pulse);
  ctx.restore();
  return true;
}

export function drawSpiritAutomationGroundTraceWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  toneColor = spiritAutomationBenefitToneColorWorld,
} = {}) {
  if (!ctx || !spec?.traces?.length) return false;
  ctx.save();
  spec.traces.forEach((trace, index) => {
    const accent = toneColor(trace.tone);
    const alpha = trace.active ? 0.88 : 0.38;
    const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2 + index * 0.8) * 2;
    const { anchor, rect } = trace;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = trace.active ? `${accent}22` : "rgba(255, 253, 245, 0.18)";
    ctx.beginPath();
    ctx.ellipse(anchor.x, anchor.y + 20, trace.active ? 42 + pulse : 30, trace.active ? 13 : 9, 0, 0, Math.PI * 2);
    ctx.fill();

    if (trace.active) {
      ctx.strokeStyle = `${accent}55`;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = reducedMotion ? 0 : -motion * 9;
      ctx.beginPath();
      ctx.moveTo(anchor.x, anchor.y + 8);
      ctx.quadraticCurveTo(anchor.x + (index % 2 ? 34 : -34), anchor.y - 22, rect.x + 18, rect.y + 18);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (trace.job === "farm") {
      ctx.fillStyle = "rgba(77, 145, 166, 0.58)";
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.ellipse(anchor.x - 14 + i * 14, anchor.y - 6 + Math.sin(motion + i) * 3, 3.5, 8, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (trace.job === "workshop") {
      for (let i = 0; i < 5; i += 1) {
        ctx.fillStyle = i % 2 ? "#fffdf5" : accent;
        ctx.beginPath();
        ctx.arc(anchor.x + Math.cos(motion * 1.8 + i) * 22, anchor.y - 2 + Math.sin(motion * 1.8 + i) * 12, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (trace.job === "shop") {
      ctx.fillStyle = "rgba(255, 248, 232, 0.86)";
      ctx.strokeStyle = `${accent}77`;
      ctx.beginPath();
      ctx.roundRect(anchor.x - 18, anchor.y - 18, 48, 25, 9);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.font = "800 10px Microsoft YaHei";
      ctx.fillText("货签", anchor.x - 8, anchor.y - 2);
    } else if (trace.job === "patrol") {
      ctx.fillStyle = "rgba(246, 240, 182, 0.32)";
      ctx.beginPath();
      ctx.moveTo(anchor.x, anchor.y - 2);
      ctx.arc(anchor.x, anchor.y - 2, 42 + pulse, -0.42, 0.42);
      ctx.closePath();
      ctx.fill();
    } else if (trace.job === "expedition") {
      ctx.strokeStyle = `${accent}77`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
      ctx.beginPath();
      ctx.moveTo(anchor.x - 26, anchor.y + 8);
      ctx.quadraticCurveTo(anchor.x + 12, anchor.y - 34, anchor.x + 40, anchor.y + 4);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(anchor.x + 36, anchor.y - 12);
      ctx.lineTo(anchor.x + 58, anchor.y - 4);
      ctx.lineTo(anchor.x + 36, anchor.y + 6);
      ctx.closePath();
      ctx.fill();
    } else if (trace.job === "garden") {
      for (let i = 0; i < 5; i += 1) {
        ctx.fillStyle = i % 2 ? "rgba(216, 127, 141, 0.72)" : `${accent}88`;
        ctx.beginPath();
        ctx.ellipse(anchor.x + Math.cos(motion * 0.9 + i) * 24, anchor.y - 3 + Math.sin(motion * 0.8 + i) * 12, 4, 8, i, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 0.95;
    ctx.fillStyle = trace.active ? "rgba(255, 253, 245, 0.92)" : "rgba(255, 253, 245, 0.62)";
    ctx.strokeStyle = trace.active ? `${accent}88` : "rgba(93, 111, 101, 0.2)";
    ctx.lineWidth = trace.active ? 1.6 : 1;
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y + pulse * 0.3, rect.width, rect.height, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = trace.active ? `${accent}24` : "rgba(93, 111, 101, 0.1)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 8, rect.y + 9 + pulse * 0.3, 28, 26, 10);
    ctx.fill();
    ctx.fillStyle = trace.active ? accent : "#5d6f65";
    ctx.font = "900 14px Microsoft YaHei";
    ctx.fillText(trace.glyph.slice(0, 1), rect.x + 17, rect.y + 27 + pulse * 0.3);
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(`${trace.active ? "已接" : "待接"}${trace.label}`.slice(0, 8), rect.x + 44, rect.y + 19 + pulse * 0.3);
    ctx.fillStyle = trace.active ? "#17231d" : "#5d6f65";
    ctx.font = "700 9px Microsoft YaHei";
    ctx.fillText(String(trace.value || trace.action || "自动化").slice(0, 10), rect.x + 44, rect.y + 34 + pulse * 0.3);
    ctx.fillStyle = trace.active ? accent : "#8f5f3f";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText("可点", rect.x + rect.width - 25, rect.y + 12 + pulse * 0.3);
  });
  ctx.restore();
  return true;
}

export function drawAutomationHubWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  pointOnPolyline = (points) => points?.[0] || { x: 0, y: 0 },
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 3;
  const progress = Math.max(0, Math.min(1, Number(spec.progress || 0) / 100));
  const active = spec.queueCount > 0;
  const accent = active ? "#be4f37" : spec.activeCount >= 2 ? "#286f58" : "#b47d2f";
  const route = [
    { x: 318, y: 482 },
    { x: 432, y: 520 },
    { x: 558, y: 532 },
    { x: 676, y: 496 },
    { x: 764, y: 438 },
    { x: 828, y: 374 },
  ];

  ctx.save();
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.48)" : "rgba(180, 125, 47, 0.42)";
  ctx.lineWidth = 3;
  ctx.setLineDash([9, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  route.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y + pulse);
    else ctx.lineTo(point.x, point.y + pulse * 0.5);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 6; i += 1) {
    const point = pointOnPolyline(route, reducedMotion ? i / 5 : (motion * 0.1 + i * 0.16) % 1);
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.78)" : "rgba(246, 240, 182, 0.7)";
    ctx.beginPath();
    ctx.arc(point.x, point.y - 8 + pulse * 0.4, 4 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, active ? "rgba(255, 240, 232, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.76)" : spec.activeCount >= 2 ? "rgba(40, 111, 88, 0.7)" : "rgba(180, 125, 47, 0.66)";
  ctx.lineWidth = active || spec.activeCount >= 2 ? 2.6 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + pulse, rect.width, rect.height, 18);
  ctx.stroke();

  ctx.fillStyle = active ? "rgba(190, 79, 55, 0.16)" : "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + pulse, 64, 64, 17);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x + 27, rect.y + 28 + pulse, 38, 28, 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rect.x + 46, rect.y + 42 + pulse, 18, -0.25, Math.PI * 1.25);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(active ? "转" : "岗", rect.x + 38, rect.y + 49 + pulse);

  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 15), rect.x + 92, rect.y + 24 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 92, rect.y + 47 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 38), rect.x + 92, rect.y + 66 + pulse);

  const barX = rect.x + 92;
  const barY = rect.y + 78 + pulse;
  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, rect.width - 112, 14, 7);
  ctx.fill();
  ctx.fillStyle = active ? "rgba(190, 79, 55, 0.7)" : "rgba(40, 111, 88, 0.62)";
  ctx.beginPath();
  ctx.roundRect(barX + 2, barY + 2, Math.max(14, (rect.width - 116) * (active ? Math.max(0.12, progress) : spec.activeCount / 6)), 10, 5);
  ctx.fill();

  (spec.lines || []).slice(0, 6).forEach((line, index) => {
    const chipX = rect.x + 18 + index * 60;
    const chipY = rect.y + rect.height - 24 + pulse;
    ctx.fillStyle = line.active ? "rgba(237, 243, 223, 0.86)" : "rgba(255, 253, 245, 0.64)";
    ctx.strokeStyle = line.active ? "rgba(40, 111, 88, 0.28)" : "rgba(143, 95, 63, 0.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 56, 18, 9);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = line.active ? "#286f58" : "#8f5f3f";
    ctx.font = "700 9px Microsoft YaHei";
    ctx.fillText(`${line.active ? "亮" : "待"}${line.label}`.slice(0, 5), chipX + 7, chipY + 12);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · 六线 ${spec.activeCount}/6 · 精怪 ${spec.helperCount}`.slice(0, 48), rect.x + 102, rect.y + 98 + pulse);
  ctx.restore();
  return true;
}

export function drawSpiritAutomationBenefitBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  stationTargets = [],
  toneColor = spiritAutomationBenefitToneColorWorld,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 2;
  const accent = toneColor(spec.top?.tone || "ready");
  const rows = spec.rows.slice(0, 3);
  ctx.save();

  ctx.strokeStyle = `${accent}44`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 9;
  stationTargets.forEach(({ station }, index) => {
    if (index > 3) return;
    ctx.beginPath();
    ctx.moveTo(station.x + station.size * 0.5, station.y + station.size * 0.45);
    ctx.quadraticCurveTo((station.x + rect.x) / 2, rect.y + rect.height + 24, rect.x + 38 + index * 42, rect.y + rect.height - 10 + bob);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(248, 252, 247, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.78)" : `${accent}66`;
  ctx.lineWidth = active ? 2.6 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 2, rect.y + 2 + bob, rect.width - 4, rect.height - 4, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + bob, 54, 46, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("省", rect.x + 32, rect.y + 43 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText("精怪今日省工", rect.x + 82, rect.y + 29 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(spec.summary.slice(0, 22), rect.x + 82, rect.y + 49 + bob);

  rows.forEach((row, index) => {
    const rowY = rect.y + 78 + index * 20 + bob;
    const color = toneColor(row.tone);
    ctx.fillStyle = `${color}22`;
    ctx.beginPath();
    ctx.roundRect(rect.x + 18, rowY - 13, 28, 16, 7);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(row.glyph, rect.x + 27, rowY);
    ctx.font = "800 12px Microsoft YaHei";
    ctx.fillText(`${row.title} · ${row.value}`.slice(0, 18), rect.x + 54, rowY);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "11px Microsoft YaHei";
    ctx.fillText(row.detail.slice(0, 24), rect.x + 164, rowY);
  });

  ctx.fillStyle = "rgba(255, 248, 232, 0.86)";
  ctx.strokeStyle = "rgba(224, 182, 109, 0.38)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 25 + bob, rect.width - 32, 18, 9);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`下一协作：${spec.advice.label}`.slice(0, 34), rect.x + 26, rect.y + rect.height - 12 + bob);
  ctx.fillStyle = accent;
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, rect.y + 24 + bob);

  ctx.restore();
  return true;
}
