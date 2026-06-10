export function drawShopShelfPrepWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.55) * 2.2;
  const cardY = rect.y + bob;
  const accent = spec.tone === "warn" ? "#be4f37" : spec.tone === "ready" ? "#286f58" : "#b47d2f";

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(rect.x + 54, cardY + rect.height - 6);
  ctx.quadraticCurveTo(rect.x + 82, cardY + rect.height + 36, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.tone === "warn" ? "rgba(255, 240, 232, 0.96)" : "rgba(255, 253, 245, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 18, 54, 54, 15);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.count,
  }, rect.x + 24, cardY + 26, 34, {
    accent,
    missing: false,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.2) * 1.2,
  });
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("主推", rect.x + 28, cardY + 76);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 84, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} x${spec.count}`.slice(0, 18), rect.x + 84, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.themeName} ${spec.themeScore}% · ${spec.hotTagLabel}`.slice(0, 30), rect.x + 84, cardY + 66);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`客群 ${spec.customerName} · ${spec.weatherText}`.slice(0, 34), rect.x + 84, cardY + 84);

  ctx.fillStyle = spec.tone === "warn" ? "rgba(190, 79, 55, 0.12)" : "rgba(202, 235, 210, 0.6)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 94, rect.width - 32, 20, 10);
  ctx.fill();
  ctx.fillStyle = spec.tone === "warn" ? "#be4f37" : "#286f58";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.openingExpectation}`.slice(0, 36), rect.x + 28, cardY + 108);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.9)" : "rgba(224, 182, 109, 0.58)";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 44 + i * 9, cardY + 21 + Math.sin(motion * 2 + i) * 2, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawShopDailyGoodsEyeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.tone === "ready"
    ? "#286f58"
    : spec.tone === "weather"
      ? "#4d91a6"
      : spec.tone === "warn"
        ? "#be4f37"
        : "#b47d2f";
  const fill = spec.tone === "warn"
    ? "rgba(255, 240, 232, 0.96)"
    : spec.tone === "weather"
      ? "rgba(236, 248, 250, 0.96)"
      : "rgba(255, 253, 245, 0.96)";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.35) * 2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}58`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.bezierCurveTo(anchor.x + 58, anchor.y - 54, rect.x + 36, cardY + rect.height + 30, rect.x + 42, cardY + rect.height - 6);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(23, 35, 29, 0.13)";
  ctx.beginPath();
  ctx.ellipse(rect.x + rect.width * 0.5, cardY + rect.height + 8, rect.width * 0.38, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, fill);
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}8a`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  if (active) {
    ctx.strokeStyle = `${accent}66`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
    ctx.beginPath();
    ctx.roundRect(rect.x - 5, cardY - 5, rect.width + 10, rect.height + 10, 21);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 16, 58, 58, 16);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.count,
  }, rect.x + 24, cardY + 25, 38, {
    accent,
    missing: false,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.4) * 1.1,
  });
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("货眼", rect.x + 25, cardY + 84);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.badge}`.slice(0, 24), rect.x + 86, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} x${spec.count}`.slice(0, 18), rect.x + 86, cardY + 48);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`为什么值得摆出来：${spec.headline}`.slice(0, 32), rect.x + 86, cardY + 66);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`客眼 ${spec.customerName} · ${spec.hotTagLabel} · ${spec.themeScore}%`.slice(0, 35), rect.x + 86, cardY + 83);

  const chips = [
    { label: "货签", text: spec.tagText || spec.hotTagLabel },
    { label: "客眼", text: spec.customerName },
    { label: "理由", text: spec.mode === "word" ? "市闻对口" : spec.mode === "weather" ? "天气对口" : "陈列顺眼" },
  ];
  chips.forEach((chip, index) => {
    const chipX = rect.x + 18 + index * 94;
    const chipY = cardY + 96;
    ctx.fillStyle = index === 2 ? `${accent}18` : "rgba(255, 253, 245, 0.78)";
    ctx.strokeStyle = `${accent}36`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 82, 22, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(chip.label, chipX + 8, chipY + 9);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(String(chip.text || "").slice(0, 7), chipX + 29, chipY + 16);
  });

  ctx.fillStyle = spec.tone === "warn" ? "rgba(190, 79, 55, 0.12)" : "rgba(202, 235, 210, 0.45)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 26, rect.width - 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = spec.tone === "warn" ? "#be4f37" : "#286f58";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.route.slice(0, 31), rect.x + 28, cardY + rect.height - 14);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.9)" : "rgba(224, 182, 109, 0.56)";
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 44 + i * 8, cardY + 22 + Math.sin(motion * 1.8 + i) * 2.6, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawShopCustomerPickShadowWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
  drawShopCrowdPerson = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.tone === "warn" ? "#be4f37" : spec.tone === "weather" ? "#4d91a6" : "#286f58";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.6) * 2.2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}5f`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([5, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 12);
  ctx.quadraticCurveTo(rect.x - 28, cardY + rect.height - 18, rect.x + 30, cardY + rect.height - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.tone === "warn" ? "rgba(255, 240, 232, 0.95)" : "rgba(255, 253, 245, 0.95)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 15, 58, 58, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("影", rect.x + 31, cardY + 50);
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.count,
  }, rect.x + 48, cardY + 48, 24, {
    accent,
    missing: false,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.2) * 1,
  });

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 86, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 86, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} x${spec.count} · ${spec.hotTagLabel}`.slice(0, 34), rect.x + 86, cardY + 64);

  const shelfX = rect.x + 24;
  const shelfY = cardY + 87;
  ctx.strokeStyle = `${accent}55`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(shelfX, shelfY);
  ctx.lineTo(rect.x + rect.width - 24, shelfY);
  ctx.stroke();
  spec.rows.forEach((row, index) => {
    const personX = rect.x + 66 + index * 138;
    const personY = shelfY + 2 + (reducedMotion ? 0 : Math.sin(motion * 2.1 + index) * 1.4);
    drawShopCrowdPerson(ctx, personX - 18, personY + 4, {
      coat: row.tone === "warn" ? "#be4f37" : row.tone === "ready" ? "#286f58" : "#b47d2f",
      scarf: index === 0 ? "#f6f0b6" : "#9fd1df",
      scale: 0.56,
    }, motion + index);
    ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
    ctx.beginPath();
    ctx.roundRect(personX - 26, personY - 45, 118, 32, 12);
    ctx.fill();
    ctx.strokeStyle = `${row.accent}44`;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.fillStyle = row.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(`${row.badge} ${row.customerName}`.slice(0, 9), personX - 16, personY - 32);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(row.thought.slice(0, 12), personX - 16, personY - 19);
  });

  ctx.fillStyle = spec.tone === "warn" ? "rgba(190, 79, 55, 0.12)" : "rgba(202, 235, 210, 0.44)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 18, rect.width - 36, 14, 7);
  ctx.fill();
  ctx.fillStyle = spec.tone === "warn" ? "#be4f37" : "#286f58";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 46), rect.x + 26, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function drawShopSpiritGreeterWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.accent || "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.8) * 2.2;
  const cardY = rect.y + bob;
  const footPulse = reducedMotion ? 0 : Math.sin(motion * 3.2) * 2.2;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}d8` : `${accent}62`;
  ctx.lineWidth = active ? 3.1 : 1.9;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 10);
  ctx.bezierCurveTo(anchor.x + 40, anchor.y + 82, rect.x - 16, cardY + 92, rect.x + 26, cardY + 76);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 4; i += 1) {
    const t = reducedMotion ? i / 3 : (motion * 0.12 + i * 0.22) % 1;
    const beadX = anchor.x + (rect.x + 28 - anchor.x) * t;
    const beadY = anchor.y + 10 + (cardY + 76 - anchor.y - 10) * t - Math.sin(t * Math.PI) * 18;
    ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.72)" : "rgba(202, 235, 210, 0.68)";
    ctx.beginPath();
    ctx.arc(beadX, beadY, 3.6 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.opened ? "rgba(239, 249, 236, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 58, 16);
  ctx.fill();
  ctx.fillStyle = "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.ellipse(rect.x + 44, cardY + 72, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff6d7";
  ctx.beginPath();
  ctx.arc(rect.x + 42, cardY + 35 + footPulse * 0.25, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.beginPath();
  ctx.roundRect(rect.x + 30, cardY + 47 + footPulse * 0.2, 24, 18, 7);
  ctx.fill();
  ctx.fillStyle = accent;
  if (spec.actionKey === "wipe_sign") {
    ctx.fillRect(rect.x + 52, cardY + 25 + footPulse * 0.2, 18, 5);
    ctx.fillRect(rect.x + 58, cardY + 18 + footPulse * 0.2, 5, 18);
  } else if (spec.actionKey === "point_queue") {
    ctx.fillRect(rect.x + 55, cardY + 45 + footPulse * 0.2, 20, 4);
    ctx.fillRect(rect.x + 70, cardY + 40 + footPulse * 0.2, 4, 10);
  } else {
    ctx.beginPath();
    ctx.roundRect(rect.x + 54, cardY + 42 + footPulse * 0.2, 20, 15, 4);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.75)";
    ctx.fillRect(rect.x + 58, cardY + 47 + footPulse * 0.2, 12, 2);
  }
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.nodes[1]?.badge || "迎", rect.x + 38, cardY + 60);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 19), rect.x + 86, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 86, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.actionTitle} · ${spec.itemText} · ${spec.customerText}`.slice(0, 37), rect.x + 86, cardY + 62);

  const nodeY = cardY + 80;
  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 16 + index * 100;
    ctx.fillStyle = index === 1 ? `${node.accent}18` : "rgba(255, 253, 245, 0.78)";
    ctx.strokeStyle = `${node.accent}52`;
    ctx.lineWidth = active && index === 1 ? 1.8 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 10, 88, 27, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 15, nodeY + 3, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge.slice(0, 1), nodeX + 11, nodeY + 6);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 4), nodeX + 30, nodeY - 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 8), nodeX + 30, nodeY + 12);
  });

  ctx.fillStyle = spec.opened ? "rgba(202, 235, 210, 0.48)" : "rgba(224, 182, 109, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 18, rect.width - 36, 14, 7);
  ctx.fill();
  ctx.fillStyle = spec.opened ? "#286f58" : "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 45), rect.x + 26, cardY + rect.height - 8);

  ctx.restore();
  return true;
}

export function drawShopRestockRunnerWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
  pointOnPolyline = () => ({ x: 0, y: 0 }),
} = {}) {
  if (!ctx || !spec?.rect || !Array.isArray(spec.path)) return false;
  const { rect, path } = spec;
  const accent = spec.waterFresh ? "#4d91a6" : spec.ready ? "#286f58" : spec.overdue ? "#be4f37" : "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 2.2;
  const progress = Math.max(0, Math.min(1, Number(spec.have || 0) / Math.max(1, Number(spec.desiredCount || 1))));
  const runnerPoint = pointOnPolyline(path, reducedMotion ? 0.58 : (motion * 0.16) % 1);
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}cc` : `${accent}66`;
  ctx.lineWidth = active ? 3.2 : 2.2;
  ctx.setLineDash([8, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  path.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y + bob);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
  ctx.beginPath();
  ctx.ellipse(runnerPoint.x, runnerPoint.y + 17, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "rgba(226, 244, 238, 0.96)" : spec.waterFresh ? "rgba(226, 241, 247, 0.96)" : "rgba(255, 246, 215, 0.96)";
  ctx.beginPath();
  ctx.arc(runnerPoint.x, runnerPoint.y + bob, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `${accent}aa`;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(runnerPoint.x - 10, runnerPoint.y + 6 + bob, 20, 11, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(224, 182, 109, 0.94)";
  ctx.beginPath();
  ctx.roundRect(runnerPoint.x + 12, runnerPoint.y + 3 + bob, 17, 13, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.58)";
  ctx.stroke();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.ready ? "交" : "跑", runnerPoint.x - 6, runnerPoint.y + 2 + bob);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.overdue ? "rgba(255, 240, 232, 0.96)" : "rgba(255, 253, 245, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}18`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 17, 62, 62, 16);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.have,
  }, rect.x + 25, cardY + 27, 38, {
    accent,
    missing: !spec.ready && Number(spec.have || 0) <= 0,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.6) * 1.2,
  });
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.ready ? "可交" : "跑腿", rect.x + 30, cardY + 84);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 92, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} ${spec.have}/${spec.desiredCount}`.slice(0, 18), rect.x + 92, cardY + 47);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${spec.sourceLabel} · ${spec.dueText} · ${spec.runnerAction}`.slice(0, 32), rect.x + 92, cardY + 66);

  ctx.fillStyle = "rgba(23, 35, 29, 0.1)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 92, cardY + 76, rect.width - 112, 9, 5);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "#286f58" : accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 92, cardY + 76, Math.max(10, (rect.width - 112) * progress), 9, 5);
  ctx.fill();

  ctx.fillStyle = spec.ready ? "rgba(202, 235, 210, 0.72)" : spec.overdue ? "rgba(239, 217, 208, 0.72)" : "rgba(255, 246, 215, 0.76)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 96, rect.width - 32, 20, 10);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "#286f58" : spec.overdue ? "#be4f37" : "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.routeText}`.slice(0, 42), rect.x + 28, cardY + 110);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.88)" : "rgba(224, 182, 109, 0.55)";
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 50 + i * 8, cardY + 23 + Math.sin(motion * 2 + i) * 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}
