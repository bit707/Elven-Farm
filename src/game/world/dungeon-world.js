export function drawDungeonWorldWorld({
  ctx,
  width = 0,
  height = 0,
  day = 1,
  run = null,
  dungeon = null,
  mechanic = null,
  mechanicHud = null,
  spiritSolution = null,
  structureRoute = null,
  palette = null,
  hazards = [],
  dungeonTitle = "",
  floorSummary = "",
  roomEventText = "",
  lastEnemy = null,
  bossReady = false,
  bossNameText = "",
  bossBarLabel = "",
  currentSkill = null,
  counterSpec = null,
  theaterSpec = null,
  companionSpirit = null,
  drawCanvasCard = () => {},
  drawDungeonMechanicAtmosphere = () => {},
  drawDungeonStructureRouteRibbon = () => {},
  drawDungeonMechanicStageSet = () => {},
  drawActiveDungeonMechanicOverlay = () => {},
  drawDungeonSpiritSolutionTrace = () => {},
  drawDungeonFeedbackOverlay = () => {},
  drawDungeonTelegraph = () => {},
  drawDungeonBossCounterCard = () => {},
  drawDungeonBar = () => {},
  drawDungeonEnemyShape = () => {},
  drawSpiritAura = () => {},
  drawSpiritSprite = () => {},
  drawDungeonLootNodes = () => {},
  drawDungeonSkillBadges = () => {},
  drawDungeonFirstMechanicTheater = () => {},
  drawDungeonMechanicWorldCard = () => {},
  drawDungeonSpiritSolutionWorldCard = () => {},
  drawActiveCutsceneOverlay = () => {},
  drawActiveDialogueStage = () => {},
} = {}) {
  if (!ctx || !run || !palette) return false;
  const caveGradient = ctx.createLinearGradient(0, 0, width, height);
  caveGradient.addColorStop(0, palette.top);
  caveGradient.addColorStop(0.58, palette.mid);
  caveGradient.addColorStop(1, palette.bottom);
  ctx.fillStyle = caveGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.fillStyle = "rgba(255, 253, 245, 0.05)";
  for (let ridge = 0; ridge < 3; ridge += 1) {
    ctx.beginPath();
    ctx.moveTo(0, 210 + ridge * 86);
    for (let x = 0; x <= width + 80; x += 80) {
      const y = 190 + ridge * 86 + Math.sin((x + ridge * 70) / 90) * 24;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = palette.glow;
  for (let i = 0; i < 24; i += 1) {
    const x = 70 + ((i * 97 + run.floor * 31 + run.turn * 13) % (width - 140));
    const y = 86 + ((i * 53 + day * 17) % (height - 172));
    ctx.beginPath();
    ctx.arc(x, y, 10 + (i % 4) * 7, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDungeonMechanicAtmosphere(ctx, width, height, run, mechanic, dungeon, mechanicHud);

  hazards.forEach((hazard, index) => {
    ctx.fillStyle = index === 0 ? palette.hazard : "rgba(255, 253, 245, 0.12)";
    const x = 172 + index * 186;
    const y = 220 + ((run.turn + index) % 2) * 78;
    ctx.beginPath();
    ctx.ellipse(x, y, 74 + hazard.severity * 8, 30 + hazard.severity * 3, -0.18 + index * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "700 14px Microsoft YaHei";
    ctx.fillText(hazard.label, x - 42, y + 5);
  });

  drawCanvasCard(ctx, 58, 48, 440, 138, "rgba(255, 253, 245, 0.88)");
  ctx.fillStyle = "#17231d";
  ctx.font = "700 26px Microsoft YaHei";
  ctx.fillText(dungeonTitle, 84, 88);
  ctx.font = "16px Microsoft YaHei";
  ctx.fillStyle = "#5d6f65";
  ctx.fillText(floorSummary, 84, 118);
  ctx.fillText(roomEventText, 84, 146);
  drawDungeonBar(ctx, 84, 158, 360, 14, run.hp, 100, "#4d91a6", `HP ${run.hp}/100`);
  drawDungeonStructureRouteRibbon(ctx, structureRoute);

  const doorwayGlow = ctx.createRadialGradient(674, 260, 12, 674, 260, 120);
  doorwayGlow.addColorStop(0, "rgba(255, 253, 245, 0.72)");
  doorwayGlow.addColorStop(1, "rgba(255, 253, 245, 0)");
  ctx.fillStyle = doorwayGlow;
  ctx.beginPath();
  ctx.arc(674, 260, 132, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.fillRect(610, 190, 130, 180);
  ctx.fillStyle = "#5b3328";
  ctx.fillRect(632, 220, 86, 132);
  ctx.fillStyle = "#fff4c4";
  ctx.beginPath();
  ctx.arc(674, 212, 26, 0, Math.PI * 2);
  ctx.fill();
  drawDungeonMechanicStageSet(ctx, width, height, run, mechanic, dungeon, mechanicHud);
  drawActiveDungeonMechanicOverlay(ctx, width, height, run, mechanic, dungeon, mechanicHud);
  drawDungeonSpiritSolutionTrace(ctx, run, mechanic, dungeon, spiritSolution);
  drawDungeonFeedbackOverlay(ctx, width, height);

  if (bossReady) {
    if (currentSkill) drawDungeonTelegraph(ctx, currentSkill, 432, 352, palette);
    if (counterSpec) drawDungeonBossCounterCard(ctx, counterSpec);
    ctx.fillStyle = "rgba(23, 35, 29, 0.24)";
    ctx.beginPath();
    ctx.ellipse(444, 424, 162, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.boss;
    ctx.beginPath();
    ctx.roundRect(318, 238, 248, 178, 44);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
    ctx.beginPath();
    ctx.arc(386, 304, 8, 0, Math.PI * 2);
    ctx.arc(486, 304, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "700 24px Microsoft YaHei";
    ctx.fillText(bossNameText, 354, 352);
    drawDungeonBar(ctx, 306, 434, 280, 18, run.bossHp, run.bossMaxHp, palette.boss, bossBarLabel);
  } else if (lastEnemy) {
    drawDungeonEnemyShape(ctx, lastEnemy, 410, 356, 1.4, palette);
  }

  if (companionSpirit) {
    drawSpiritAura(ctx, 86, 382, "随行协战");
    drawSpiritSprite(ctx, companionSpirit, 104, 378, 118);
  }

  drawDungeonLootNodes(ctx, run, width, height, palette);
  drawDungeonSkillBadges(ctx, run, 560, 416);
  if (theaterSpec) drawDungeonFirstMechanicTheater(ctx, theaterSpec);
  drawDungeonMechanicWorldCard(ctx, mechanicHud, 598, 48, 280, 188);
  drawDungeonSpiritSolutionWorldCard(ctx, spiritSolution, 598, 244, 280, 126);
  drawActiveCutsceneOverlay(ctx, width, height);
  drawActiveDialogueStage(ctx, width, height);
  return true;
}

export function drawDungeonMechanicAtmosphereWorld({
  ctx,
  width = 0,
  height = 0,
  run = null,
  mechanicState = null,
  spec = null,
  reducedMotion = false,
  now = 0,
  wave = 0,
  slowWave = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !run || !mechanicState || !spec) return false;
  const { theme, tone } = spec;

  ctx.save();
  const fieldGlow = ctx.createRadialGradient(674, 262, 24, 674, 262, 420);
  fieldGlow.addColorStop(0, theme.soft);
  fieldGlow.addColorStop(0.56, `rgba(255, 253, 245, ${0.04 + spec.intensity * 0.08})`);
  fieldGlow.addColorStop(1, "rgba(255, 253, 245, 0)");
  ctx.fillStyle = fieldGlow;
  ctx.fillRect(0, 0, width, height);

  switch (tone) {
    case "thunder": {
      ctx.strokeStyle = "rgba(246, 240, 182, 0.2)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 7; i += 1) {
        const x = 112 + i * 118;
        ctx.beginPath();
        ctx.moveTo(x, 28);
        ctx.lineTo(x + 20 + wave * 6, 84);
        ctx.lineTo(x - 8, 124);
        ctx.lineTo(x + 28, 178);
        ctx.stroke();
      }
      ctx.strokeStyle = theme.glow;
      ctx.lineWidth = mechanicState.resonanceTurn ? 4 : 2;
      [582, 674, 766].forEach((x, index) => {
        ctx.globalAlpha = index < mechanicState.pillarsLit || mechanicState.resonanceTurn ? 0.5 : 0.18;
        ctx.beginPath();
        ctx.arc(x, 392, 58 + index * 14 + wave * 8, 0, Math.PI * 2);
        ctx.stroke();
      });
      break;
    }
    case "water": {
      const waterTop = 498 - mechanicState.waterLevel * 38 + slowWave * 6;
      ctx.fillStyle = "rgba(77, 145, 166, 0.12)";
      ctx.fillRect(0, waterTop, width, height - waterTop);
      for (let i = 0; i < 5; i += 1) {
        ctx.strokeStyle = i === mechanicState.waterLevel + 1 ? theme.glow : "rgba(255, 253, 245, 0.18)";
        ctx.lineWidth = i === mechanicState.waterLevel + 1 ? 4 : 2;
        ctx.beginPath();
        const y = waterTop + i * 22;
        ctx.moveTo(84, y);
        for (let x = 84; x <= width - 84; x += 60) {
          ctx.quadraticCurveTo(x + 30, y + Math.sin((x + now / 12) / 34) * 8, x + 60, y);
        }
        ctx.stroke();
      }
      break;
    }
    case "insect": {
      for (let i = 0; i < 6; i += 1) {
        const active = i % 3 === mechanicState.cadence;
        ctx.strokeStyle = active ? "rgba(202, 235, 210, 0.48)" : "rgba(255, 253, 245, 0.15)";
        ctx.lineWidth = active ? 4 : 2;
        ctx.beginPath();
        ctx.arc(160 + i * 86, 292 + Math.sin(i) * 26, 38 + i * 10 + wave * 5, -0.3, Math.PI * 1.35);
        ctx.stroke();
      }
      ctx.fillStyle = theme.soft;
      for (let i = 0; i < 18; i += 1) {
        const x = 90 + ((i * 71 + run.turn * 13) % (width - 180));
        const y = 170 + ((i * 43 + run.floor * 19) % 250);
        ctx.beginPath();
        ctx.arc(x, y + wave * 6, 3 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "overflow": {
      const pressure = mechanicState.overflow / 5;
      const overflowGradient = ctx.createLinearGradient(0, height - 220, 0, height);
      overflowGradient.addColorStop(0, "rgba(224, 182, 109, 0)");
      overflowGradient.addColorStop(1, `rgba(224, 182, 109, ${0.16 + pressure * 0.16})`);
      ctx.fillStyle = overflowGradient;
      ctx.fillRect(0, height - 240, width, 240);
      for (let i = 0; i < 20; i += 1) {
        const x = 86 + ((i * 83 + run.turn * 31) % (width - 172));
        const y = height - 78 - ((i * 27 + run.floor * 17) % 136);
        ctx.fillStyle = i % 3 === 0 ? "rgba(190, 79, 55, 0.22)" : theme.soft;
        ctx.beginPath();
        ctx.arc(x, y - wave * 8, 5 + pressure * 8 + (i % 2) * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "mirror": {
      ctx.fillStyle = "rgba(159, 209, 223, 0.12)";
      ctx.beginPath();
      ctx.ellipse(width / 2, height - 128, width * 0.42, 58, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 253, 245, 0.28)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath();
        ctx.ellipse(width / 2, height - 128 + i * 7, width * (0.24 + i * 0.06), 16 + i * 6, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.22 + mechanicState.verifiedPaths * 0.08;
      ctx.fillStyle = theme.glow;
      ctx.beginPath();
      ctx.roundRect(626, height - 194, 96, 82, 36);
      ctx.fill();
      break;
    }
    case "frost": {
      const frostAlpha = 0.08 + mechanicState.coldStacks * 0.035;
      const frostGradient = ctx.createRadialGradient(width / 2, height / 2, 120, width / 2, height / 2, 560);
      frostGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      frostGradient.addColorStop(1, `rgba(202, 235, 210, ${frostAlpha})`);
      ctx.fillStyle = frostGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.32)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i += 1) {
        const x = 42 + i * 92;
        const y = i % 2 ? 56 : height - 60;
        ctx.beginPath();
        ctx.moveTo(x - 14, y);
        ctx.lineTo(x + 14, y);
        ctx.moveTo(x, y - 14);
        ctx.lineTo(x, y + 14);
        ctx.stroke();
      }
      break;
    }
    case "wind": {
      const direction = mechanicState.windShift ? -1 : 1;
      for (let i = 0; i < 7; i += 1) {
        const y = 132 + i * 58;
        const startX = direction > 0 ? 44 : width - 44;
        const endX = direction > 0 ? width - 74 : 74;
        ctx.strokeStyle = i < mechanicState.routeMarks + 2 ? "rgba(242, 210, 139, 0.32)" : "rgba(255, 253, 245, 0.12)";
        ctx.lineWidth = i < mechanicState.routeMarks + 2 ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.bezierCurveTo(startX + direction * 180, y - 42, endX - direction * 210, y + 44 + wave * 12, endX, y - 8);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(180, 125, 47, 0.22)";
      for (let i = 0; i < 18; i += 1) {
        const x = 86 + ((i * 67 + run.turn * 29) % (width - 172));
        const y = 120 + ((i * 41 + run.floor * 23) % (height - 240));
        ctx.beginPath();
        ctx.ellipse(x, y + wave * 10, 12, 5, direction * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "lantern": {
      ctx.fillStyle = "rgba(91, 51, 40, 0.16)";
      ctx.beginPath();
      ctx.moveTo(84, height - 82);
      ctx.bezierCurveTo(264, height - 238, 506, height - 182, 674, 320);
      ctx.bezierCurveTo(750, 256, 784, 224, 832, 168);
      ctx.lineTo(860, 188);
      ctx.bezierCurveTo(780, 286, 754, 342, 674, 386);
      ctx.bezierCurveTo(490, height - 112, 260, height - 118, 92, height - 38);
      ctx.closePath();
      ctx.fill();
      let previous = null;
      for (let i = 0; i < 7; i += 1) {
        const lit = i < mechanicState.lanternChain;
        const t = i / 6;
        const x = 116 + t * 650;
        const y = height - 92 - Math.sin(t * Math.PI) * 238;
        if (previous) {
          ctx.strokeStyle = lit ? "rgba(240, 165, 78, 0.34)" : "rgba(255, 253, 245, 0.1)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        ctx.fillStyle = lit ? theme.glow : "rgba(255, 253, 245, 0.12)";
        ctx.beginPath();
        ctx.arc(x, y + wave * 5, lit ? 13 : 8, 0, Math.PI * 2);
        ctx.fill();
        previous = { x, y };
      }
      break;
    }
    default: {
      ctx.fillStyle = "rgba(255, 253, 245, 0.1)";
      for (let i = 0; i < 10; i += 1) {
        ctx.beginPath();
        ctx.ellipse(92 + i * 88, 170 + (i % 4) * 54 + wave * 8, 42, 16, -0.12, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
  }

  ctx.globalAlpha = 0.88;
  drawCanvasCard(ctx, 72, 202, 292, 62, "rgba(255, 253, 245, 0.72)");
  ctx.fillStyle = theme.accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(spec.title, 94, 224);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 17px Microsoft YaHei";
  ctx.fillText(spec.name.slice(0, 10), 94, 247);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(spec.label.slice(0, 31), 178, 247);
  ctx.restore();
  return true;
}

export function drawActiveDungeonMechanicOverlayWorld({
  ctx,
  width = 0,
  height = 0,
  run = null,
  mechanicState = null,
  hud = null,
  theme = null,
  pulse = 0,
} = {}) {
  if (!ctx || !run || !mechanicState || !hud || !theme) return false;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (hud.tone) {
    case "thunder": {
      const positions = [582, 674, 766];
      positions.forEach((x, index) => {
        const lit = index < mechanicState.pillarsLit;
        ctx.fillStyle = lit ? theme.soft : "rgba(255, 253, 245, 0.08)";
        ctx.beginPath();
        ctx.roundRect(x - 14, 404, 28, 96, 14);
        ctx.fill();
        ctx.fillStyle = lit ? theme.glow : "rgba(255, 253, 245, 0.14)";
        ctx.beginPath();
        ctx.arc(x, 390, lit ? 16 + pulse / 3 : 10, 0, Math.PI * 2);
        ctx.fill();
      });
      if (mechanicState.resonanceTurn) {
        ctx.strokeStyle = theme.glow;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(520, 82);
        ctx.lineTo(566, 134 + pulse / 3);
        ctx.lineTo(544, 184);
        ctx.lineTo(598, 238);
        ctx.lineTo(574, 302);
        ctx.stroke();
      }
      break;
    }
    case "water": {
      const waterTop = 486 - mechanicState.waterLevel * 32;
      ctx.fillStyle = theme.soft;
      ctx.beginPath();
      ctx.roundRect(98, waterTop, width - 196, height - waterTop - 84, 24);
      ctx.fill();
      for (let i = 0; i < 3; i += 1) {
        const gateX = 214 + i * 174;
        ctx.fillStyle = i < mechanicState.sluicesAligned ? theme.accent : "rgba(93, 111, 101, 0.24)";
        ctx.fillRect(gateX, waterTop - 46, 12, 56);
        ctx.fillRect(gateX + 34, waterTop - 46, 12, 56);
        ctx.fillStyle = i === mechanicState.waterLevel ? theme.glow : "rgba(255, 253, 245, 0.16)";
        ctx.fillRect(gateX - 12, waterTop - 8, 70, 8);
      }
      break;
    }
    case "insect": {
      for (let i = 0; i < 3; i += 1) {
        ctx.strokeStyle = i === mechanicState.cadence ? theme.accent : "rgba(255, 253, 245, 0.22)";
        ctx.lineWidth = i === mechanicState.cadence ? 5 : 2;
        ctx.beginPath();
        ctx.arc(674, 260, 72 + i * 24 + pulse / 4, 0.55, Math.PI * 2.1);
        ctx.stroke();
      }
      for (let i = 0; i < mechanicState.listened; i += 1) {
        const x = 594 + i * 62;
        const y = 474 - (i % 2) * 26;
        ctx.fillStyle = theme.glow;
        ctx.beginPath();
        ctx.arc(x, y + pulse / 4, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "overflow": {
      ctx.fillStyle = "rgba(224, 182, 109, 0.1)";
      ctx.fillRect(0, height - 164, width, 164);
      for (let i = 0; i < mechanicState.overflow * 5; i += 1) {
        const x = 120 + ((i * 94 + run.turn * 17) % (width - 240));
        const y = height - 92 - ((i * 29 + run.floor * 18) % 138) - pulse;
        ctx.fillStyle = i % 2 ? theme.accent : theme.glow;
        ctx.beginPath();
        ctx.arc(x, y, 5 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "mirror": {
      ctx.fillStyle = "rgba(255, 253, 245, 0.12)";
      ctx.beginPath();
      ctx.ellipse(674, 468, 176, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < Math.max(1, mechanicState.verifiedPaths + 1); i += 1) {
        const offset = i * 26;
        ctx.strokeStyle = i < mechanicState.verifiedPaths ? theme.accent : "rgba(255, 253, 245, 0.18)";
        ctx.lineWidth = i < mechanicState.verifiedPaths ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(544 - offset, 454);
        ctx.quadraticCurveTo(674, 382 - offset / 2, 804 + offset, 454);
        ctx.stroke();
      }
      break;
    }
    case "frost": {
      const points = [
        { x: 154, y: 124 },
        { x: 294, y: 520 },
        { x: 722, y: 140 },
        { x: 836, y: 488 },
      ];
      points.forEach((point, index) => {
        if (index >= mechanicState.coldStacks) return;
        ctx.strokeStyle = index < mechanicState.coldStacks - 1 ? theme.glow : theme.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(point.x - 18, point.y);
        ctx.lineTo(point.x + 18, point.y);
        ctx.moveTo(point.x, point.y - 18);
        ctx.lineTo(point.x, point.y + 18);
        ctx.moveTo(point.x - 12, point.y - 12);
        ctx.lineTo(point.x + 12, point.y + 12);
        ctx.moveTo(point.x - 12, point.y + 12);
        ctx.lineTo(point.x + 12, point.y - 12);
        ctx.stroke();
      });
      ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(674, 260, 126 + pulse / 3, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "wind": {
      const direction = mechanicState.windShift ? -1 : 1;
      for (let i = 0; i < 3; i += 1) {
        const startX = direction > 0 ? 96 : width - 96;
        const endX = direction > 0 ? width - 140 : 140;
        const baseY = 210 + i * 86;
        ctx.strokeStyle = i < mechanicState.routeMarks ? theme.accent : "rgba(255, 253, 245, 0.18)";
        ctx.lineWidth = i < mechanicState.routeMarks ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(startX, baseY);
        ctx.bezierCurveTo(startX + direction * 140, baseY - 36, endX - direction * 160, baseY + 26 + pulse / 4, endX, baseY - 14);
        ctx.stroke();
      }
      break;
    }
    case "lantern": {
      let previous = null;
      for (let i = 0; i < 7; i += 1) {
        const t = i / 6;
        const x = 164 + t * 520;
        const y = 120 + Math.sin(t * Math.PI) * 102;
        if (previous) {
          ctx.strokeStyle = i < mechanicState.lanternChain ? "rgba(240, 165, 78, 0.42)" : "rgba(255, 253, 245, 0.12)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        ctx.fillStyle = i < mechanicState.lanternChain ? theme.glow : "rgba(255, 253, 245, 0.14)";
        ctx.beginPath();
        ctx.arc(x, y + pulse / 5, i < mechanicState.lanternChain ? 11 : 7, 0, Math.PI * 2);
        ctx.fill();
        previous = { x, y };
      }
      break;
    }
    default: {
      for (let i = 0; i < 8; i += 1) {
        ctx.fillStyle = "rgba(255, 253, 245, 0.12)";
        ctx.beginPath();
        ctx.arc(122 + i * 94, 118 + (i % 2) * 18 + pulse / 3, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
  }

  ctx.restore();
  return true;
}

export function dungeonMechanicStageSetSpecWorld({
  run = null,
  mechanic = null,
  mechanicState = null,
  hud = null,
  theme = null,
} = {}) {
  if (!run || !mechanic || !mechanicState || !hud || !theme) return null;
  const nodeCount = Math.max(3, Math.min(7, hud.nodes.length || hud.progressMax || 3));
  const nodes = Array.from({ length: nodeCount }, (_, index) => {
    const hudNode = hud.nodes[index] || { label: `${index + 1}`, active: index < hud.progressCurrent };
    return {
      ...hudNode,
      x: 238 + index * (448 / Math.max(1, nodeCount - 1)),
      y: 476 - Math.sin((index / Math.max(1, nodeCount - 1)) * Math.PI) * 72,
    };
  });
  const nextNode = nodes.find((node) => !node.active) || nodes[nodes.length - 1];
  const toneLabels = {
    thunder: "雷木机关舞台",
    water: "回渠闸口舞台",
    insect: "虫鸣林道舞台",
    overflow: "满溢取舍舞台",
    mirror: "镜湖真路舞台",
    frost: "寒露霜窖舞台",
    wind: "落叶旧路舞台",
    lantern: "长灯影路舞台",
    mist: "秘境机关舞台",
  };
  return {
    tone: hud.tone,
    theme,
    title: toneLabels[hud.tone] || toneLabels.mist,
    mechanicName: hud.title,
    progressText: hud.progressText,
    actionHint: hud.actionReady ? `可主动：${hud.actionLabel}` : hud.actionUsed ? "本层已顺应节气" : hud.tags[0]?.label || mechanic.field_rule || "观察机关变化",
    fieldRule: mechanic.field_rule || "",
    puzzleCore: mechanic.puzzle_core || "",
    progressPercent: hud.progressPercent,
    nodes,
    nextNode,
  };
}

export function drawDungeonMechanicStageTokenWorld({
  ctx,
  spec = null,
  node = null,
  index = 0,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !spec || !node) return false;
  const { theme, tone } = spec;
  const active = Boolean(node.active);
  const emphasis = Boolean(node.emphasis) || node === spec.nextNode;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2 + index) * 3;
  const radius = active ? 13 + pulse * 0.25 : emphasis ? 12 + pulse * 0.18 : 9;

  ctx.save();
  ctx.fillStyle = active ? theme.glow : emphasis ? theme.soft : "rgba(255, 253, 245, 0.22)";
  ctx.beginPath();
  ctx.arc(node.x, node.y, radius + 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = active ? theme.accent : "rgba(255, 253, 245, 0.72)";
  ctx.strokeStyle = active ? theme.accent : emphasis ? `${theme.accent}88` : "rgba(23, 35, 29, 0.22)";
  ctx.lineWidth = active || emphasis ? 3 : 1.5;
  ctx.beginPath();
  ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = active ? "#fffdf5" : theme.accent;
  ctx.font = "800 10px Microsoft YaHei";
  const glyphs = {
    thunder: active ? "雷" : "柱",
    water: active ? "闸" : "水",
    insect: active ? "拍" : "鸣",
    overflow: active ? "溢" : "压",
    mirror: active ? "真" : "镜",
    frost: active ? "霜" : "寒",
    wind: active ? "路" : "叶",
    lantern: active ? "灯" : "影",
    mist: "境",
  };
  ctx.fillText(glyphs[tone] || glyphs.mist, node.x - 6, node.y + 4);

  if (active || emphasis) {
    ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
    ctx.beginPath();
    ctx.roundRect(node.x - 22, node.y + 18, 44, 18, 9);
    ctx.fill();
    ctx.fillStyle = active ? "#286f58" : "#8f5f3f";
    ctx.font = "700 9px Microsoft YaHei";
    ctx.fillText(String(node.label || `${index + 1}`).slice(0, 4), node.x - 12, node.y + 31);
  }

  ctx.restore();
  return true;
}

export function drawDungeonMechanicStageSetWorld({
  ctx,
  spec = null,
  motion = 0,
  pulse = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawDungeonMechanicStageToken = () => {},
} = {}) {
  if (!ctx || !spec?.nodes?.length) return false;
  const { theme, nodes, tone } = spec;

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.strokeStyle = "rgba(255, 253, 245, 0.22)";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  nodes.forEach((node, index) => {
    if (index === 0) ctx.moveTo(node.x, node.y);
    else {
      const previous = nodes[index - 1];
      ctx.quadraticCurveTo((previous.x + node.x) / 2, Math.min(previous.y, node.y) - 26 - pulse * 0.25, node.x, node.y);
    }
  });
  ctx.stroke();

  ctx.strokeStyle = `${theme.accent}77`;
  ctx.lineWidth = 5;
  ctx.setLineDash([16, 12]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 18;
  ctx.beginPath();
  nodes.forEach((node, index) => {
    if (index === 0) ctx.moveTo(node.x, node.y);
    else {
      const previous = nodes[index - 1];
      ctx.quadraticCurveTo((previous.x + node.x) / 2, Math.min(previous.y, node.y) - 26 - pulse * 0.25, node.x, node.y);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);

  if (tone === "mirror" || tone === "water") {
    ctx.fillStyle = tone === "mirror" ? "rgba(159, 209, 223, 0.2)" : "rgba(77, 145, 166, 0.2)";
    ctx.beginPath();
    ctx.ellipse(462, 492, 248, 34 + pulse * 0.3, -0.02, 0, Math.PI * 2);
    ctx.fill();
  } else if (tone === "overflow") {
    ctx.fillStyle = "rgba(224, 182, 109, 0.18)";
    ctx.beginPath();
    ctx.ellipse(462, 506, 286, 42 + pulse * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (tone === "frost") {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i += 1) {
      const x = 214 + i * 92;
      ctx.beginPath();
      ctx.moveTo(x - 16, 510 + (i % 2) * 8);
      ctx.lineTo(x + 16, 510 + (i % 2) * 8);
      ctx.moveTo(x, 494 + (i % 2) * 8);
      ctx.lineTo(x, 526 + (i % 2) * 8);
      ctx.stroke();
    }
  } else if (tone === "wind") {
    ctx.fillStyle = "rgba(180, 125, 47, 0.24)";
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath();
      ctx.ellipse(184 + i * 44, 474 + Math.sin(motion + i) * 16, 12, 5, -0.42, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  nodes.forEach((node, index) => drawDungeonMechanicStageToken({
    ctx,
    spec,
    node,
    index,
    motion,
    reducedMotion,
  }));

  const cardX = 170;
  const cardY = 528;
  drawCanvasCard(ctx, cardX, cardY, 466, 74, "rgba(255, 253, 245, 0.82)");
  ctx.fillStyle = theme.soft;
  ctx.beginPath();
  ctx.roundRect(cardX + 18, cardY + 18, 58, 38, 14);
  ctx.fill();
  ctx.fillStyle = theme.accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText(tone === "lantern" ? "灯" : tone === "thunder" ? "雷" : tone === "water" ? "闸" : tone === "insect" ? "鸣" : tone === "mirror" ? "镜" : tone === "frost" ? "霜" : tone === "wind" ? "叶" : tone === "overflow" ? "溢" : "境", cardX + 38, cardY + 44);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(`${spec.title} · ${spec.mechanicName}`.slice(0, 22), cardX + 92, cardY + 28);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(spec.progressText.slice(0, 34), cardX + 92, cardY + 48);
  ctx.fillStyle = theme.accent;
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(spec.actionHint.slice(0, 32), cardX + 92, cardY + 64);

  const barX = cardX + 318;
  const barY = cardY + 22;
  ctx.fillStyle = "rgba(23, 35, 29, 0.1)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, 124, 10, 999);
  ctx.fill();
  ctx.fillStyle = theme.accent;
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(12, 124 * (spec.progressPercent / 100)), 10, 999);
  ctx.fill();
  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.progressPercent}% 读懂`, barX + 36, barY + 27);

  ctx.restore();
  return true;
}
