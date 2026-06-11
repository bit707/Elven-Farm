export function spiritAutomationTrailSpecWorld({
  spirit = null,
  station = null,
  index = 0,
  spiritVisualProfile = () => ({ glyph: "灵", accent: "#286f58", glow: "rgba(202, 235, 210, 0.2)" }),
} = {}) {
  if (!spirit || !station) return null;
  const job = spirit.job || "farm";
  const profile = spiritVisualProfile(spirit);
  const center = {
    x: station.x + station.size * 0.5,
    y: station.y + station.size * 0.5,
  };
  const common = {
    job,
    label: "岗位自动化",
    glyph: profile.glyph,
    accent: profile.accent,
    soft: profile.glow,
    phase: index * 0.17,
    path: [center],
  };
  if (job === "farm") {
    return {
      ...common,
      label: "自动浇水轨迹",
      glyph: "水",
      path: [
        { x: center.x + station.size * 0.18, y: center.y - station.size * 0.18 },
        { x: station.x - 24, y: station.y + station.size * 0.22 },
        { x: station.x + station.size * 0.32, y: station.y + station.size * 0.02 },
        { x: station.x + station.size * 0.82, y: station.y + station.size * 0.26 },
      ],
      nodes: [
        { x: station.x - 24, y: station.y + station.size * 0.22 },
        { x: station.x + station.size * 0.32, y: station.y + station.size * 0.02 },
        { x: station.x + station.size * 0.82, y: station.y + station.size * 0.26 },
      ],
    };
  }
  if (job === "workshop") {
    return {
      ...common,
      label: "工坊投料",
      glyph: "料",
      path: [
        { x: center.x + station.size * 0.22, y: center.y },
        { x: 804, y: 434 },
        { x: 708, y: 470 },
        { x: 618, y: 502 },
      ],
      nodes: [
        { x: 804, y: 434 },
        { x: 708, y: 470 },
        { x: 618, y: 502 },
      ],
    };
  }
  if (job === "shop") {
    return {
      ...common,
      label: "补货跑动",
      glyph: "货",
      path: [
        { x: center.x, y: center.y + station.size * 0.18 },
        { x: 244, y: 298 },
        { x: 218, y: 264 },
        { x: 184, y: 236 },
        { x: 154, y: 210 },
      ],
      nodes: [
        { x: 244, y: 298 },
        { x: 184, y: 236 },
        { x: 154, y: 210 },
      ],
    };
  }
  if (job === "patrol") {
    return {
      ...common,
      label: "巡灯扫线",
      glyph: "巡",
      path: [
        { x: center.x - station.size * 0.12, y: center.y },
        { x: center.x + station.size * 0.58, y: center.y - station.size * 0.28 },
        { x: center.x + station.size * 0.86, y: center.y + station.size * 0.12 },
      ],
      nodes: [
        { x: center.x + station.size * 0.58, y: center.y - station.size * 0.28 },
        { x: center.x + station.size * 0.86, y: center.y + station.size * 0.12 },
      ],
    };
  }
  if (job === "expedition") {
    return {
      ...common,
      label: "远征旗路",
      glyph: "旗",
      path: [
        { x: center.x, y: center.y },
        { x: center.x + station.size * 0.5, y: center.y - station.size * 0.38 },
        { x: center.x + station.size * 0.92, y: center.y + station.size * 0.02 },
        { x: center.x + station.size * 1.34, y: center.y - station.size * 0.3 },
      ],
      nodes: [
        { x: center.x + station.size * 0.5, y: center.y - station.size * 0.38 },
        { x: center.x + station.size * 0.92, y: center.y + station.size * 0.02 },
        { x: center.x + station.size * 1.34, y: center.y - station.size * 0.3 },
      ],
    };
  }
  return {
    ...common,
    label: "庭院安抚波",
    glyph: "息",
    path: [
      { x: center.x - station.size * 0.34, y: center.y + station.size * 0.08 },
      { x: center.x, y: center.y - station.size * 0.22 },
      { x: center.x + station.size * 0.38, y: center.y + station.size * 0.06 },
    ],
    nodes: [
      { x: center.x - station.size * 0.34, y: center.y + station.size * 0.08 },
      { x: center.x + station.size * 0.38, y: center.y + station.size * 0.06 },
    ],
  };
}

export function drawSpiritAutomationTrailWorld({
  ctx,
  spirit = null,
  station = null,
  index = 0,
  spec = null,
  reducedMotion = false,
  motion = 0,
  pointOnPolyline = () => ({ x: 0, y: 0 }),
} = {}) {
  if (!ctx || !spirit || !station || !spec) return false;
  const progress = reducedMotion ? 0.62 : (motion * 0.16 + spec.phase) % 1;
  const point = pointOnPolyline(spec.path, progress);
  const centerX = station.x + station.size * 0.5;
  const centerY = station.y + station.size * 0.52;

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.strokeStyle = `${spec.accent}88`;
  ctx.lineWidth = spec.job === "patrol" ? 2.5 : 3;
  ctx.lineCap = "round";
  ctx.setLineDash(spec.job === "farm" ? [5, 8] : [8, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  spec.path.forEach((routePoint, routeIndex) => {
    if (routeIndex === 0) ctx.moveTo(routePoint.x, routePoint.y);
    else ctx.lineTo(routePoint.x, routePoint.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  if (spec.job === "farm") {
    spec.nodes.forEach((node, nodeIndex) => {
      ctx.fillStyle = nodeIndex % 2 ? "rgba(77, 145, 166, 0.55)" : "rgba(202, 235, 210, 0.58)";
      ctx.beginPath();
      ctx.ellipse(node.x, node.y + Math.sin(motion * 2 + nodeIndex) * (reducedMotion ? 0 : 2), 10, 5, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 253, 245, 0.48)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, 13 + nodeIndex * 3, 0.15, Math.PI - 0.15);
      ctx.stroke();
    });
    ctx.fillStyle = "rgba(77, 145, 166, 0.76)";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.ellipse(point.x + i * 5, point.y + i * 3, 3, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.job === "workshop") {
    spec.nodes.forEach((node, nodeIndex) => {
      ctx.fillStyle = nodeIndex % 2 ? "rgba(246, 240, 182, 0.62)" : "rgba(240, 165, 78, 0.5)";
      ctx.beginPath();
      ctx.arc(node.x, node.y - 18 - Math.sin(motion * 2 + nodeIndex) * (reducedMotion ? 0 : 4), 7 - nodeIndex, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#8f5f3f";
    ctx.beginPath();
    ctx.roundRect(point.x - 12, point.y - 9, 24, 18, 6);
    ctx.fill();
    ctx.fillStyle = "#f2d28b";
    ctx.beginPath();
    ctx.arc(point.x + 8, point.y - 10, 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (spec.job === "shop") {
    ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
    ctx.beginPath();
    ctx.roundRect(point.x - 14, point.y - 14, 28, 22, 8);
    ctx.fill();
    ctx.fillStyle = "#8f5f3f";
    ctx.beginPath();
    ctx.roundRect(point.x - 9, point.y - 4, 22, 16, 5);
    ctx.fill();
    ctx.fillStyle = "#e0b66d";
    ctx.fillRect(point.x - 2, point.y - 17, 5, 12);
    spec.nodes.forEach((node, nodeIndex) => {
      ctx.fillStyle = nodeIndex === 0 ? "rgba(224, 182, 109, 0.72)" : "rgba(255, 248, 232, 0.78)";
      ctx.beginPath();
      ctx.roundRect(node.x - 8, node.y - 6, 16, 12, 4);
      ctx.fill();
    });
  } else if (spec.job === "patrol") {
    const sweep = reducedMotion ? 0.2 : Math.sin(motion * 1.6 + index) * 0.42;
    ctx.fillStyle = "rgba(246, 240, 182, 0.22)";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, station.size * 0.92, -0.22 + sweep, 0.34 + sweep);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(246, 240, 182, 0.7)";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.fillStyle = "#f2d28b";
    ctx.beginPath();
    ctx.roundRect(point.x - 6, point.y - 10, 12, 18, 5);
    ctx.fill();
  } else if (spec.job === "expedition") {
    spec.nodes.forEach((node, nodeIndex) => {
      ctx.strokeStyle = spec.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(node.x, node.y - 18);
      ctx.lineTo(node.x, node.y + 10);
      ctx.stroke();
      ctx.fillStyle = nodeIndex % 2 ? "#fffdf5" : "#e6c65e";
      ctx.beginPath();
      ctx.moveTo(node.x, node.y - 18);
      ctx.lineTo(node.x + 18, node.y - 10 + Math.sin(motion + nodeIndex) * (reducedMotion ? 0 : 2));
      ctx.lineTo(node.x, node.y - 2);
      ctx.closePath();
      ctx.fill();
    });
    ctx.fillStyle = "rgba(255, 248, 232, 0.86)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const wave = reducedMotion ? 0 : Math.sin(motion * 2 + index) * 4;
    ctx.strokeStyle = `${spec.accent}66`;
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + station.size * 0.2, station.size * (0.36 + ring * 0.18) + wave, station.size * (0.14 + ring * 0.06), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(216, 127, 141, 0.74)";
    spec.nodes.forEach((node, nodeIndex) => {
      ctx.beginPath();
      ctx.ellipse(node.x, node.y + Math.sin(motion + nodeIndex) * (reducedMotion ? 0 : 3), 5, 8, nodeIndex, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (index < 6) {
    const tagWidth = spec.label.length > 5 ? 102 : 86;
    const tagX = Math.max(14, Math.min(ctx.canvas.width - tagWidth - 14, station.x + station.size * 0.38));
    const tagY = Math.max(24, station.y + station.size * 0.78);
    ctx.fillStyle = "rgba(255, 248, 232, 0.74)";
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tagWidth, 24, 10);
    ctx.fill();
    ctx.fillStyle = spec.accent;
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText(`${spec.glyph} ${spec.label}`.slice(0, 9), tagX + 8, tagY + 16);
  }
  ctx.restore();
  return true;
}

export function spiritSeasonalWorkTrailSpecWorld({
  spirit = null,
  station = null,
  index = 0,
  day = 0,
  spiritVisualProfile = () => ({ glyph: "灵" }),
  spiritSeasonalWorkMomentSpec = () => null,
  spiritSeasonalWorkSceneProfile = () => ({}),
} = {}) {
  const seasonal = spiritSeasonalWorkMomentSpec(spirit, spirit?.job || "farm");
  if (!spirit || !station || !seasonal) return { active: false };
  const profile = spiritVisualProfile(spirit);
  const center = {
    x: station.x + station.size * 0.5,
    y: station.y + station.size * 0.58,
  };
  const tone = seasonal.tone || "clear";
  const byTone = spiritSeasonalWorkSceneProfile(tone);
  const job = spirit.job || "farm";
  const routeByJob = {
    farm: [
      { x: center.x - station.size * 0.32, y: center.y + station.size * 0.28 },
      { x: center.x + station.size * 0.05, y: center.y + station.size * 0.08 },
      { x: center.x + station.size * 0.48, y: center.y + station.size * 0.26 },
    ],
    workshop: [
      { x: center.x - station.size * 0.28, y: center.y + station.size * 0.12 },
      { x: center.x + station.size * 0.16, y: center.y - station.size * 0.18 },
      { x: center.x + station.size * 0.56, y: center.y + station.size * 0.1 },
    ],
    shop: [
      { x: center.x - station.size * 0.34, y: center.y + station.size * 0.18 },
      { x: center.x + station.size * 0.08, y: center.y - station.size * 0.2 },
      { x: center.x + station.size * 0.58, y: center.y + station.size * 0.02 },
    ],
    patrol: [
      { x: center.x - station.size * 0.42, y: center.y + station.size * 0.06 },
      { x: center.x + station.size * 0.18, y: center.y - station.size * 0.34 },
      { x: center.x + station.size * 0.62, y: center.y + station.size * 0.08 },
    ],
    expedition: [
      { x: center.x - station.size * 0.18, y: center.y + station.size * 0.16 },
      { x: center.x + station.size * 0.38, y: center.y - station.size * 0.34 },
      { x: center.x + station.size * 0.88, y: center.y - station.size * 0.02 },
    ],
    garden: [
      { x: center.x - station.size * 0.42, y: center.y + station.size * 0.18 },
      { x: center.x, y: center.y - station.size * 0.2 },
      { x: center.x + station.size * 0.42, y: center.y + station.size * 0.18 },
    ],
  };
  return {
    active: true,
    title: "节气岗位轨迹",
    spiritName: spirit.name || "精怪",
    job,
    profile,
    center,
    route: routeByJob[job] || routeByJob.farm,
    phase: (day * 0.11 + index * 0.23) % 1,
    prop: seasonal.prop,
    detail: seasonal.detail,
    effect: seasonal.effect,
    weatherName: seasonal.weatherName,
    termName: seasonal.termName,
    ...byTone,
  };
}

export function drawSpiritSeasonalWorkTrailWorld({
  ctx,
  spirit = null,
  station = null,
  index = 0,
  spec = null,
  reducedMotion = false,
  motion = 0,
  pointOnPolyline = () => ({ x: 0, y: 0 }),
} = {}) {
  if (!ctx || !spirit || !station || !spec?.active) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4 + index) * 3;
  const bead = pointOnPolyline(spec.route, reducedMotion ? 0.56 : (motion * 0.13 + spec.phase) % 1);

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = `${spec.accent}88`;
  ctx.lineWidth = 2.6;
  ctx.lineCap = "round";
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  spec.route.forEach((point, pointIndex) => {
    if (pointIndex === 0) ctx.moveTo(point.x, point.y);
    else {
      const previous = spec.route[pointIndex - 1];
      ctx.quadraticCurveTo((previous.x + point.x) / 2, Math.min(previous.y, point.y) - 18, point.x, point.y);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = spec.soft;
  ctx.beginPath();
  ctx.ellipse(spec.center.x, spec.center.y + station.size * 0.34, station.size * 0.48 + pulse, station.size * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  if (spec.mode === "rain") {
    ctx.fillStyle = "rgba(77, 145, 166, 0.28)";
    ctx.beginPath();
    ctx.ellipse(spec.center.x, spec.center.y - station.size * 0.2 + pulse * 0.2, station.size * 0.44, station.size * 0.18, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `${spec.accent}88`;
    ctx.beginPath();
    ctx.moveTo(spec.center.x, spec.center.y - station.size * 0.12);
    ctx.lineTo(spec.center.x - station.size * 0.05, spec.center.y + station.size * 0.18);
    ctx.stroke();
    for (let drop = 0; drop < 5; drop += 1) {
      const fall = reducedMotion ? 0.5 : (motion * 0.8 + drop * 0.19 + index * 0.07) % 1;
      ctx.fillStyle = "rgba(159, 209, 223, 0.78)";
      ctx.beginPath();
      ctx.ellipse(spec.center.x - 38 + drop * 18, spec.center.y - 36 + fall * 46, 2.4, 5.4, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.mode === "heat") {
    ctx.strokeStyle = `${spec.accent}66`;
    for (let arc = 0; arc < 3; arc += 1) {
      ctx.beginPath();
      ctx.arc(spec.center.x - 4, spec.center.y + 8, station.size * (0.32 + arc * 0.12) + pulse, -0.55, 0.55);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(246, 240, 182, 0.74)";
    for (let blade = 0; blade < 4; blade += 1) {
      ctx.beginPath();
      ctx.ellipse(spec.center.x + station.size * 0.42, spec.center.y - 12 + blade * 8, 13, 4, blade * 0.28 + motion * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.mode === "mist") {
    ctx.strokeStyle = "rgba(255, 253, 245, 0.72)";
    ctx.lineWidth = 3.2;
    for (let band = 0; band < 3; band += 1) {
      ctx.beginPath();
      ctx.moveTo(spec.center.x - station.size * 0.52, spec.center.y + band * 10);
      ctx.bezierCurveTo(spec.center.x - 18, spec.center.y - 16 + band * 10, spec.center.x + 16, spec.center.y + 18 + band * 10, spec.center.x + station.size * 0.55, spec.center.y - 2 + band * 10);
      ctx.stroke();
    }
    ctx.fillStyle = "#f2d28b";
    for (let lamp = 0; lamp < 3; lamp += 1) {
      const point = spec.route[Math.min(lamp, spec.route.length - 1)];
      ctx.beginPath();
      ctx.arc(point.x, point.y - 8 + Math.sin(motion + lamp) * (reducedMotion ? 0 : 2), 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.mode === "cold") {
    ctx.fillStyle = "rgba(255, 253, 245, 0.5)";
    ctx.beginPath();
    ctx.roundRect(spec.center.x - 32, spec.center.y + 14, 64, 18, 8);
    ctx.fill();
    ctx.strokeStyle = `${spec.accent}77`;
    for (let puff = 0; puff < 4; puff += 1) {
      ctx.beginPath();
      ctx.arc(spec.center.x - 24 + puff * 16, spec.center.y - 6 - Math.sin(motion + puff) * (reducedMotion ? 0 : 4), 7, 0.2, Math.PI * 1.4);
      ctx.stroke();
    }
  } else if (spec.mode === "dew") {
    ctx.fillStyle = "rgba(202, 235, 210, 0.76)";
    for (let dew = 0; dew < 6; dew += 1) {
      const angle = dew * 0.9 + motion * (reducedMotion ? 0 : 0.5);
      ctx.beginPath();
      ctx.ellipse(spec.center.x + Math.cos(angle) * 34, spec.center.y + 18 + Math.sin(angle) * 12, 3.2, 5.6, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
    ctx.beginPath();
    ctx.roundRect(spec.center.x + station.size * 0.35, spec.center.y + 2, 22, 16, 6);
    ctx.fill();
  } else {
    ctx.fillStyle = "rgba(255, 248, 232, 0.82)";
    ctx.beginPath();
    ctx.roundRect(spec.center.x + station.size * 0.32, spec.center.y - 16, 34, 28, 8);
    ctx.fill();
    ctx.strokeStyle = `${spec.accent}88`;
    ctx.stroke();
    ctx.fillStyle = spec.accent;
    ctx.font = "800 11px Microsoft YaHei";
    ctx.fillText(spec.glyph, spec.center.x + station.size * 0.32 + 10, spec.center.y + 3);
  }

  ctx.fillStyle = spec.accent;
  ctx.beginPath();
  ctx.arc(bead.x, bead.y, 5.5 + pulse * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.glyph.slice(0, 1), bead.x - 4, bead.y + 4);

  if (index < 4) {
    const tagW = 110;
    const tagX = Math.max(14, Math.min(ctx.canvas.width - tagW - 14, station.x + station.size * 0.16));
    const tagY = Math.max(22, station.y + station.size * 0.42 + (index % 2) * 8);
    ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
    ctx.strokeStyle = `${spec.accent}55`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tagW, 28, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = spec.accent;
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(spec.title, tagX + 8, tagY + 12);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText(`${spec.label} · ${spec.prop}`.slice(0, 12), tagX + 8, tagY + 23);
  }
  ctx.restore();
  return true;
}

export function drawSpiritJobSynergyNetworkWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = 0,
  drawCanvasCard = () => {},
  pointOnPolyline = () => ({ x: 0, y: 0 }),
} = {}) {
  if (!ctx || !spec?.rows?.length) return false;
  ctx.save();
  spec.rows.forEach((row, rowIndex) => {
    if (!row.points || row.points.length < 2) return;
    const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2 + rowIndex) * 2.5;
    const bead = pointOnPolyline(row.points, reducedMotion ? 0.58 : (motion * 0.12 + rowIndex * 0.22) % 1);
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = `${row.accent}99`;
    ctx.lineWidth = 3.5 + rowIndex * 0.4;
    ctx.lineCap = "round";
    ctx.setLineDash([12, 10]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 22;
    ctx.beginPath();
    row.points.forEach((point, pointIndex) => {
      if (pointIndex === 0) ctx.moveTo(point.x, point.y);
      else {
        const previous = row.points[pointIndex - 1];
        const midX = (previous.x + point.x) / 2;
        const midY = Math.min(previous.y, point.y) - 36 - rowIndex * 12;
        ctx.quadraticCurveTo(midX, midY, point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    row.nodes.forEach((node, nodeIndex) => {
      ctx.fillStyle = nodeIndex % 2 ? "rgba(255, 248, 232, 0.78)" : `${row.accent}44`;
      ctx.beginPath();
      ctx.arc(node.point.x, node.point.y, 14 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `${row.accent}bb`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.point.x, node.point.y, 8 + nodeIndex * 1.5, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.fillStyle = row.accent;
    ctx.beginPath();
    ctx.arc(bead.x, bead.y, 7 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
    ctx.beginPath();
    ctx.arc(bead.x, bead.y, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const labelPoint = row.points[Math.min(1, row.points.length - 1)];
    const cardX = Math.max(18, Math.min(ctx.canvas.width - 178, labelPoint.x - 72));
    const cardY = Math.max(42, Math.min(ctx.canvas.height - 74, labelPoint.y - 72 - rowIndex * 10));
    drawCanvasCard(ctx, cardX, cardY, 178, 58, "rgba(255, 248, 232, 0.84)");
    ctx.fillStyle = row.accent;
    ctx.font = "700 12px Microsoft YaHei";
    ctx.fillText(`${row.glyph || "灵"} 搭班光轨`.slice(0, 12), cardX + 12, cardY + 19);
    ctx.fillStyle = "#17231d";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText(row.label.slice(0, 10), cardX + 12, cardY + 37);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText(`协作收益：${row.rewardText}`.slice(0, 22), cardX + 12, cardY + 51);
  });

  const networkX = 388;
  const networkY = 158;
  drawCanvasCard(ctx, networkX, networkY, 194, 54, "rgba(255, 253, 245, 0.76)");
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(`岗位协作网 · ${spec.rows.length} 条`, networkX + 14, networkY + 21);
  ctx.fillStyle = "#286f58";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`接力节点 ${spec.spirits.length} · 协作收益已入账`, networkX + 14, networkY + 39);
  ctx.restore();
  return true;
}
