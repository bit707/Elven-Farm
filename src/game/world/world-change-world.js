export function drawDungeonWorldChangesWorld({
  ctx,
  width = 0,
  height = 0,
  changes = [],
  pulse = 0,
  builtFinalArray = false,
  finalArrayMode = "preview",
  finalArrayRewardHint = "",
  drawCanvasCard = () => {},
  drawFinalArrayMonument = () => {},
  getRichSoilMetrics = () => null,
} = {}) {
  if (!ctx || !changes.length) return false;
  const priority = {
    solar_array_stela: 0,
    final_banquet: 1,
    drought_relief_shed: 2,
    drought_cracked_well: 3,
    lotus_basin_followup_order: 4,
    lotus_basin_trade_return: 5,
    waterway_trade_boat: 6,
    waterway_fresh_route: 7,
  };
  const visibleChanges = changes
    .slice()
    .sort((a, b) => (priority[a.visualType] ?? 9) - (priority[b.visualType] ?? 9))
    .slice(0, 10);
  const hasLotusBasinFollowup = visibleChanges.some((change) => change.visualType === "lotus_basin_followup_order");
  const hasLotusBasinReturn = visibleChanges.some((change) => change.visualType === "lotus_basin_trade_return") || hasLotusBasinFollowup;
  const hasWaterwayTradeBoat = visibleChanges.some((change) => change.visualType === "waterway_trade_boat");

  ctx.save();
  for (const change of visibleChanges) {
    if (change.visualType === "waterway_fresh_route" && (hasWaterwayTradeBoat || hasLotusBasinReturn)) continue;
    if (change.visualType === "waterway_trade_boat" && hasLotusBasinReturn) continue;
    if (change.visualType === "lotus_basin_trade_return" && hasLotusBasinFollowup) continue;

    if (change.visualType === "thunder_route") {
      ctx.strokeStyle = "rgba(230, 198, 94, 0.5)";
      ctx.lineWidth = 5;
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.moveTo(806, 286);
      ctx.bezierCurveTo(842, 240, 844, 198, 884, 154);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#5d6f65";
      ctx.fillRect(820, 254, 12, 74);
      ctx.fillStyle = "#e6c65e";
      ctx.beginPath();
      ctx.moveTo(804, 254);
      ctx.lineTo(846, 238);
      ctx.lineTo(838, 276);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fffdf5";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText("雷竹路标", 782, 342);
    } else if (change.visualType === "waterway_fresh_route" || change.visualType === "waterway_trade_boat" || change.visualType === "lotus_basin_trade_return" || change.visualType === "lotus_basin_followup_order") {
      const routeFollowup = change.visualType === "lotus_basin_followup_order";
      const routeReturned = change.visualType === "lotus_basin_trade_return" || routeFollowup;
      const tradeDone = change.visualType === "waterway_trade_boat" || routeReturned;
      ctx.strokeStyle = routeFollowup ? `rgba(255, 224, 153, ${0.72 + pulse / 48})` : routeReturned ? `rgba(242, 210, 139, ${0.62 + pulse / 44})` : tradeDone ? `rgba(224, 182, 109, ${0.56 + pulse / 42})` : `rgba(77, 145, 166, ${0.5 + pulse / 42})`;
      ctx.lineWidth = routeFollowup ? 7 : 5;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(702, 526);
      ctx.bezierCurveTo(760, 500, 800, 504, 870, 474);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = routeFollowup ? "rgba(255, 224, 153, 0.38)" : routeReturned ? "rgba(242, 210, 139, 0.34)" : tradeDone ? "rgba(224, 182, 109, 0.28)" : "rgba(202, 235, 210, 0.42)";
      ctx.beginPath();
      ctx.ellipse(828, 504, (routeFollowup ? 88 : 76) + pulse, routeFollowup ? 27 : 22, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = routeFollowup ? "#8f5f3f" : routeReturned ? "#b47d2f" : tradeDone ? "#8f5f3f" : "#286f58";
      ctx.beginPath();
      ctx.moveTo(784, 500);
      ctx.quadraticCurveTo(824, 530 + pulse / 2, 872, 500);
      ctx.lineTo(854, 526);
      ctx.quadraticCurveTo(820, 542, 792, 522);
      ctx.closePath();
      ctx.fill();
      if (routeFollowup) {
        ctx.fillStyle = "#f2d28b";
        for (let i = 0; i < 3; i += 1) {
          ctx.beginPath();
          ctx.roundRect(796 + i * 18, 498 + (i % 2) * 5, 16, 12, 3);
          ctx.fill();
        }
        ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
        ctx.beginPath();
        ctx.arc(874, 492 + pulse / 3, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#fffdf5";
      ctx.fillRect(822, 472 + pulse / 3, 6, 38);
      ctx.fillStyle = tradeDone ? "#f2d28b" : "#e0b66d";
      ctx.beginPath();
      ctx.moveTo(828, 474 + pulse / 3);
      ctx.lineTo(864, 486 + pulse / 3);
      ctx.lineTo(828, 498 + pulse / 3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fffdf5";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText(routeFollowup ? "莲泽续订" : routeReturned ? "莲泽返货" : tradeDone ? "莲泽水航" : "水航鲜货", 786, 552);
    } else if (change.visualType === "spirit_channel") {
      ctx.strokeStyle = `rgba(202, 235, 210, ${0.55 + pulse / 40})`;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(792, 186);
      ctx.bezierCurveTo(676, 264, 674, 382, 548, 438);
      ctx.bezierCurveTo(420, 496, 304, 470, 180, 570);
      ctx.stroke();
    } else if (change.visualType === "flower_honey") {
      for (let i = 0; i < 9; i += 1) {
        const x = 96 + i * 18;
        const y = 346 + (i % 3) * 12;
        ctx.fillStyle = i % 2 ? "#f2d28b" : "#d87f8d";
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#286f58";
        ctx.fillRect(x - 1, y + 6, 2, 12);
      }
    } else if (change.visualType === "rich_soil") {
      const metrics = getRichSoilMetrics();
      if (metrics) {
        const { originX, originY, tile, gap } = metrics;
        ctx.fillStyle = "rgba(222, 169, 82, 0.22)";
        ctx.beginPath();
        ctx.roundRect(originX - 28, originY - 28, (tile + gap) * 3 + 26, (tile + gap) * 2 + 26, 22);
        ctx.fill();
        ctx.fillStyle = "#b47d2f";
        ctx.font = "700 13px Microsoft YaHei";
        ctx.fillText("满溢沃土", originX - 18, originY - 36);
      }
    } else if (change.visualType === "moon_pool") {
      ctx.fillStyle = "rgba(77, 145, 166, 0.32)";
      ctx.beginPath();
      ctx.ellipse(686, 526, 86, 28, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 253, 245, 0.62)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(656, 510 + pulse, 18, 0.2, Math.PI * 1.7);
      ctx.stroke();
      ctx.fillStyle = "#fffdf5";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText("月莲静池", 642, 570);
    } else if (change.visualType === "warm_hearth") {
      ctx.fillStyle = "rgba(190, 79, 55, 0.24)";
      ctx.beginPath();
      ctx.arc(540, 510, 52 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f0a54e";
      ctx.beginPath();
      ctx.moveTo(540, 470);
      ctx.lineTo(568, 536);
      ctx.lineTo(514, 536);
      ctx.closePath();
      ctx.fill();
    } else if (change.visualType === "old_relic") {
      ctx.fillStyle = "#8f5f3f";
      ctx.fillRect(262, 456, 12, 58);
      ctx.fillStyle = "#e0b66d";
      ctx.fillRect(238, 438, 68, 34);
      ctx.fillStyle = "#17231d";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText("旧物", 258, 460);
    } else if (change.visualType === "lantern_road") {
      for (let i = 0; i < 7; i += 1) {
        const x = 666 + i * 32;
        const y = 178 - i * 8;
        ctx.strokeStyle = "#5b3328";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 42);
        ctx.stroke();
        ctx.fillStyle = `rgba(246, 240, 182, ${0.68 + (i % 2) * 0.18})`;
        ctx.beginPath();
        ctx.arc(x, y + 16, 12 + pulse / 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (change.visualType === "herb_valley_gate") {
      ctx.strokeStyle = `rgba(40, 111, 88, ${0.58 + pulse / 38})`;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(768, 202);
      ctx.bezierCurveTo(824, 132, 888, 132, 922, 202);
      ctx.stroke();
      ctx.strokeStyle = "rgba(202, 235, 210, 0.62)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(790, 214);
      ctx.bezierCurveTo(832, 166, 878, 166, 904, 214);
      ctx.stroke();
      ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
      ctx.beginPath();
      ctx.ellipse(846, 226, 70 + pulse, 20, -0.12, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 5; i += 1) {
        const leafX = 772 + i * 34;
        const leafY = 192 - (i % 2) * 18 + pulse / 3;
        ctx.fillStyle = i % 2 ? "#caebd2" : "#286f58";
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, 13, 7, -0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#fffdf5";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText("药谷藤门", 814, 260);
    } else if (change.visualType === "embers_gate") {
      ctx.fillStyle = "rgba(190, 79, 55, 0.18)";
      ctx.beginPath();
      ctx.ellipse(742, 206, 86 + pulse, 22, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(240, 165, 78, ${0.62 + pulse / 42})`;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(688, 186);
      ctx.bezierCurveTo(706, 118, 780, 118, 798, 186);
      ctx.stroke();
      ctx.fillStyle = "#8f5f3f";
      ctx.fillRect(684, 186, 12, 46);
      ctx.fillRect(790, 186, 12, 46);
      for (let i = 0; i < 4; i += 1) {
        const flameX = 706 + i * 22;
        const flameY = 176 - (i % 2) * 12 + pulse / 3;
        ctx.fillStyle = i % 2 ? "#de5f3f" : "#f0a54e";
        ctx.beginPath();
        ctx.moveTo(flameX, flameY + 18);
        ctx.quadraticCurveTo(flameX + 10, flameY - 10, flameX + 18, flameY + 16);
        ctx.quadraticCurveTo(flameX + 10, flameY + 8, flameX, flameY + 18);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = "#fffdf5";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText("炽砂断门", 714, 252);
    } else if (change.visualType === "drought_cracked_well") {
      ctx.fillStyle = "rgba(23, 35, 29, 0.18)";
      ctx.beginPath();
      ctx.ellipse(748, 354, 62, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8f7b5d";
      ctx.beginPath();
      ctx.ellipse(748, 326, 52, 30, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4a3a31";
      ctx.beginPath();
      ctx.ellipse(748, 326, 34, 18, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(92, 60, 42, 0.7)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(716, 300);
      ctx.lineTo(706, 344);
      ctx.moveTo(780, 300);
      ctx.lineTo(790, 344);
      ctx.moveTo(716, 300);
      ctx.lineTo(780, 300);
      ctx.stroke();
      ctx.strokeStyle = "rgba(190, 79, 55, 0.52)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i += 1) {
        const baseX = 716 + i * 22;
        ctx.beginPath();
        ctx.moveTo(baseX, 348);
        ctx.lineTo(baseX - 18, 370 + pulse / 3);
        ctx.lineTo(baseX + 6, 390 - pulse / 3);
        ctx.stroke();
      }
      ctx.fillStyle = "#fffdf5";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText("主街枯井", 716, 384);
    } else if (change.visualType === "drought_relief_shed") {
      ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
      ctx.beginPath();
      ctx.ellipse(844, 360, 72, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8f5f3f";
      ctx.fillRect(792, 300, 10, 58);
      ctx.fillRect(886, 300, 10, 58);
      ctx.fillStyle = "#d8b56f";
      ctx.beginPath();
      ctx.moveTo(782, 302);
      ctx.lineTo(846, 272 + pulse / 3);
      ctx.lineTo(908, 302);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fff6d7";
      ctx.fillRect(808, 304, 72, 28);
      ctx.fillStyle = "#5d6f65";
      ctx.fillRect(812, 334, 18, 20);
      ctx.fillRect(838, 334, 18, 20);
      ctx.fillRect(864, 334, 18, 20);
      ctx.strokeStyle = "rgba(224, 182, 109, 0.66)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(918, 314);
      ctx.lineTo(934, 322);
      ctx.lineTo(918, 330);
      ctx.stroke();
      ctx.fillStyle = "#fffdf5";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText("井边水棚", 808, 380);
    } else if (change.visualType === "final_nest_gate") {
      ctx.fillStyle = "rgba(23, 35, 29, 0.22)";
      ctx.beginPath();
      ctx.ellipse(860, 404, 74, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(77, 145, 166, 0.16)";
      ctx.beginPath();
      ctx.ellipse(860, 364, 68 + pulse, 38, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 253, 245, 0.56)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(808, 368);
      ctx.bezierCurveTo(822, 286, 898, 286, 912, 368);
      ctx.stroke();
      ctx.strokeStyle = "rgba(92, 60, 42, 0.72)";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(860, 360, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(23, 35, 29, 0.8)";
      ctx.beginPath();
      ctx.arc(860, 360, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(216, 127, 141, 0.54)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i += 1) {
        const wingX = 828 + i * 16;
        const wingY = 330 + (i % 2) * 10 + pulse / 4;
        ctx.beginPath();
        ctx.moveTo(wingX, wingY);
        ctx.quadraticCurveTo(wingX + 10, wingY - 12, wingX + 20, wingY);
        ctx.stroke();
      }
      ctx.fillStyle = "#fffdf5";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText("终巢水门", 822, 430);
    } else if (change.visualType === "solar_array_stela") {
      const mode = builtFinalArray ? "built" : finalArrayMode;
      drawFinalArrayMonument(ctx, mode);
      drawCanvasCard(ctx, 604, 120, 196, 58, "rgba(255, 248, 232, 0.84)");
      ctx.fillStyle = "#b47d2f";
      ctx.font = "700 13px Microsoft YaHei";
      ctx.fillText(mode === "built" ? "二十四节气大阵" : "终阵蓝图显影", 626, 144);
      ctx.fillStyle = "#5d6f65";
      ctx.font = "12px Microsoft YaHei";
      ctx.fillText((change.rewardHint || finalArrayRewardHint || "四时光纹待接通").slice(0, 18), 626, 164);
    } else if (change.visualType === "final_banquet") {
      continue;
    } else if (change.visualType === "fire_core_beacon") {
      ctx.fillStyle = `rgba(240, 165, 78, ${0.28 + pulse / 54})`;
      ctx.beginPath();
      ctx.arc(548, 516, 62 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(222, 95, 63, 0.72)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(548, 516, 38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(230, 198, 94, 0.6)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i += 1) {
        const angle = (Math.PI * 2 * i) / 8 + pulse / 60;
        ctx.beginPath();
        ctx.moveTo(548 + Math.cos(angle) * 30, 516 + Math.sin(angle) * 30);
        ctx.lineTo(548 + Math.cos(angle) * 58, 516 + Math.sin(angle) * 58);
        ctx.stroke();
      }
      ctx.fillStyle = "#f0a54e";
      ctx.beginPath();
      ctx.moveTo(548, 484 + pulse / 3);
      ctx.quadraticCurveTo(574, 516, 548, 550);
      ctx.quadraticCurveTo(522, 516, 548, 484 + pulse / 3);
      ctx.fill();
      ctx.fillStyle = "#fffdf5";
      ctx.font = "700 12px Microsoft YaHei";
      ctx.fillText("火位核心", 520, 586);
    } else {
      ctx.fillStyle = "rgba(246, 240, 182, 0.28)";
      ctx.beginPath();
      ctx.arc(width - 120, height - 126, 38 + pulse, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  return true;
}

export function drawDungeonWorldChangeLandmarksWorld({
  ctx,
  rows = [],
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !rows.length) return false;
  const colors = {
    water: "#4d91a6",
    ember: "#be4f37",
    good: "#286f58",
    gold: "#b47d2f",
    note: "#5b6f9a",
  };
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2) * 2;

  ctx.save();
  rows.forEach((row, index) => {
    const color = colors[row.tone] || colors.note;
    const bob = reducedMotion ? 0 : Math.sin(motion * 1.45 + index * 0.7) * 1.5;
    const x = row.rect.x;
    const y = row.rect.y + bob;
    ctx.strokeStyle = `${color}99`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(x + 16, y + row.rect.height);
    ctx.quadraticCurveTo(x + 34, y + row.rect.height + 14 + pulse, x + 52, y + row.rect.height + 7);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = `${color}22`;
    ctx.beginPath();
    ctx.roundRect(x - 3, y - 3, row.rect.width + 6, row.rect.height + 6, 16);
    ctx.fill();
    drawCanvasCard(ctx, x, y, row.rect.width, row.rect.height, "rgba(255, 253, 245, 0.88)");
    ctx.strokeStyle = `${color}aa`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x + 1, y + 1, row.rect.width - 2, row.rect.height - 2, 14);
    ctx.stroke();

    ctx.fillStyle = `${color}22`;
    ctx.beginPath();
    ctx.arc(x + 23, y + 23, 16 + pulse / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "900 14px Microsoft YaHei";
    ctx.fillText("景", x + 16, y + 28);
    ctx.font = "900 11px Microsoft YaHei";
    ctx.fillText(String(row.label || "洞天改景").slice(0, 8), x + 46, y + 18);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(row.detailText || row.title || "").slice(0, 16), x + 46, y + 33);
    ctx.fillStyle = color;
    ctx.font = "900 7px Microsoft YaHei";
    ctx.fillText("可点回看", x + row.rect.width - 48, y + row.rect.height - 7);
  });
  ctx.restore();
  return true;
}
