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
