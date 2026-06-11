export function weatherWorldMoodSpecWorld({
  weather = null,
  term = null,
  atmosphere = null,
  localize = (key, fallback = "") => fallback || key || "",
} = {}) {
  const weatherId = String(weather?.weather_id || "weather_clear");
  const weatherFx = String(weather?.visual_fx_id || weatherId || term?.weather_weight_group || "");
  const disaster = String(weather?.disaster_tag || "none");
  const waterBonus = Number(weather?.water_bonus || 0);
  const growthModifier = Number(weather?.crop_growth_modifier || 1);
  const moodModifier = Number(weather?.mood_modifier || 0);
  const weatherName = localize(weather?.weather_name_key, weatherId);
  const termName = localize(term?.term_name_key, term?.term_id || "节气");
  const base = {
    weatherId,
    weatherFx,
    disaster,
    weatherName,
    termName,
    waterBonus,
    growthModifier,
    moodModifier,
    atmosphereLabel: atmosphere?.label || "天时",
    warning: disaster && disaster !== "none",
  };
  if (weatherFx.includes("rain") || disaster === "waterlog") {
    const heavy = weatherFx.includes("heavy") || disaster === "waterlog";
    return {
      ...base,
      kind: heavy ? "storm-rain" : "soft-rain",
      glyph: heavy ? "暴" : "雨",
      title: heavy ? "暴雨压畦" : "雨线入田",
      detail: heavy ? "水洼沿田埂扩开，低洼处要小心水涝。" : "雨丝补进灵田，水润作物更容易接上成长。",
      overlay: heavy ? "rgba(77, 145, 166, 0.22)" : "rgba(159, 209, 223, 0.16)",
      particleCount: heavy ? 82 : 48,
      accent: "#4d91a6",
    };
  }
  if (weatherFx.includes("mist") || disaster === "mist") {
    return {
      ...base,
      kind: "mist",
      glyph: "雾",
      title: "雾带贴镇",
      detail: "白雾压低远山，镇民与精怪的小动作更像从雾里浮出来。",
      overlay: "rgba(255, 253, 245, 0.26)",
      particleCount: 8,
      accent: "#4d91a6",
    };
  }
  if (weatherFx.includes("hot") || weatherFx.includes("dry") || disaster === "heat" || disaster === "drought") {
    return {
      ...base,
      kind: disaster === "drought" ? "drought" : "hot-wind",
      glyph: disaster === "drought" ? "旱" : "暑",
      title: disaster === "drought" ? "旱纹爬田" : "热风穿垄",
      detail: disaster === "drought" ? "裂纹贴近田角，水分被迅速抽走。" : "热浪在屋檐和田埂上晃，成长节奏会放慢。",
      overlay: disaster === "drought" ? "rgba(190, 79, 55, 0.18)" : "rgba(231, 195, 111, 0.2)",
      particleCount: 11,
      accent: "#be4f37",
    };
  }
  if (weatherFx.includes("snow") || weatherFx.includes("frost") || weatherFx.includes("cold") || disaster === "frost" || disaster === "freeze" || disaster.includes("snow")) {
    const snow = weatherFx.includes("snow") || disaster.includes("snow");
    return {
      ...base,
      kind: snow ? "snow" : "frost",
      glyph: snow ? "雪" : "霜",
      title: snow ? "雪粉覆径" : "霜边入畦",
      detail: snow ? "雪点压住路面，冷光会让作物成长更慢。" : "霜线贴着田垄爬，怕冷作物需要优先照看。",
      overlay: snow ? "rgba(235, 244, 255, 0.3)" : "rgba(228, 246, 242, 0.34)",
      particleCount: weatherFx.includes("heavy") ? 48 : 32,
      accent: snow ? "#9fd1df" : "#4d91a6",
    };
  }
  if (weatherFx.includes("dew")) {
    return {
      ...base,
      kind: "dew",
      glyph: "露",
      title: "露珠挂叶",
      detail: "低处泛着露光，水润田会更早显出成长感。",
      overlay: "rgba(159, 213, 203, 0.15)",
      particleCount: 24,
      accent: "#4d91a6",
    };
  }
  if (weatherFx.includes("cloudy")) {
    return {
      ...base,
      kind: "cloudy",
      glyph: "云",
      title: "云影过镇",
      detail: "云层压淡日光，今日更适合稳步安排田铺和工坊。",
      overlay: "rgba(226, 222, 202, 0.18)",
      particleCount: 6,
      accent: "#5d6f65",
    };
  }
  return {
    ...base,
    kind: "clear",
    glyph: "晴",
    title: "晴光照田",
    detail: "天色清稳，洞天的日常动作最容易被看清。",
    overlay: "rgba(246, 240, 182, 0.07)",
    particleCount: 14,
    accent: "#b47d2f",
  };
}

export function drawSolarTermAtmosphereWorld({
  ctx,
  width = 960,
  height = 640,
  atmosphere = null,
  weatherFx = "",
  reducedMotion = false,
  motion = 0,
  day = 1,
} = {}) {
  if (!ctx || !atmosphere) return false;
  ctx.save();
  ctx.fillStyle = atmosphere.wash;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = atmosphere.accent;
  ctx.fillStyle = atmosphere.mote;
  ctx.lineWidth = 2;
  const count = atmosphere.motif === "heat" ? 8 : atmosphere.motif === "lantern" ? 10 : 16;
  for (let i = 0; i < count; i += 1) {
    const drift = reducedMotion ? 0 : motion * (12 + i * 0.8);
    const x = (i * 97 + day * 31 + drift) % width;
    const y = 88 + ((i * 43 + day * 17 + drift) % 270);
    if (atmosphere.motif === "heat") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + 14, y - 8, x - 10, y + 14, x + 8, y + 24);
      ctx.stroke();
    } else if (atmosphere.motif === "spark") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 8, y + 14);
      ctx.lineTo(x + 2, y + 12);
      ctx.lineTo(x - 5, y + 28);
      ctx.stroke();
    } else if (atmosphere.motif === "lantern") {
      ctx.beginPath();
      ctx.roundRect(x, y, 9, 13, 4);
      ctx.fill();
    } else if (atmosphere.motif === "grain") {
      ctx.beginPath();
      ctx.ellipse(x, y, 4, 9, 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (atmosphere.motif === "frost") {
      ctx.beginPath();
      ctx.moveTo(x - 6, y);
      ctx.lineTo(x + 6, y);
      ctx.moveTo(x, y - 6);
      ctx.lineTo(x, y + 6);
      ctx.stroke();
    } else if (atmosphere.motif === "rain" || atmosphere.motif === "dew") {
      ctx.beginPath();
      ctx.arc(x, y, atmosphere.motif === "dew" ? 2.8 : 2.1, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(x, y, 5, 2.8, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (!weatherFx.includes("rain") && atmosphere.motif === "rain") {
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#fffdf5";
    for (let i = 0; i < 4; i += 1) ctx.fillRect(0, 118 + i * 48, width, 14);
  }
  ctx.restore();
  return true;
}

export function drawWeatherWorldMoodLayerWorld({
  ctx,
  width = 960,
  height = 640,
  spec = null,
  reducedMotion = false,
  motion = 0,
  day = 1,
  drawCanvasCard = () => {},
  signedPercent = (value) => `${value}`,
  multiplierText = (value) => `${value}`,
} = {}) {
  if (!ctx || !spec) return false;
  ctx.save();
  ctx.fillStyle = spec.overlay;
  ctx.fillRect(0, 0, width, height);

  if (spec.kind === "soft-rain" || spec.kind === "storm-rain") {
    ctx.strokeStyle = spec.kind === "storm-rain" ? "rgba(77, 145, 166, 0.48)" : "rgba(77, 145, 166, 0.34)";
    ctx.lineWidth = spec.kind === "storm-rain" ? 2.4 : 1.6;
    for (let i = 0; i < spec.particleCount; i += 1) {
      const drift = reducedMotion ? 0 : motion * (spec.kind === "storm-rain" ? 54 : 32);
      const x = (i * 37 + day * 11 + drift) % (width + 42);
      const y = (i * 71 + day * 17 + drift * 1.7) % (height + 48);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 14, y + (spec.kind === "storm-rain" ? 38 : 30));
      ctx.stroke();
    }
    ctx.fillStyle = spec.kind === "storm-rain" ? "rgba(77, 145, 166, 0.24)" : "rgba(159, 209, 223, 0.2)";
    for (let i = 0; i < 7; i += 1) {
      const ripple = reducedMotion ? 0 : Math.sin(motion * 2.4 + i) * 4;
      ctx.beginPath();
      ctx.ellipse(126 + i * 104, 568 - (i % 3) * 24, 22 + ripple, 6, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 253, 245, 0.18)";
      ctx.stroke();
    }
  } else if (spec.kind === "mist") {
    for (let i = 0; i < spec.particleCount; i += 1) {
      const x = reducedMotion ? -40 : -80 + ((motion * 18 + i * 156) % (width + 180));
      const y = 86 + i * 52;
      ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.26)" : "rgba(223, 247, 238, 0.22)";
      ctx.beginPath();
      ctx.roundRect(x, y, 210, 24, 12);
      ctx.fill();
    }
  } else if (spec.kind === "hot-wind" || spec.kind === "drought") {
    ctx.strokeStyle = spec.kind === "drought" ? "rgba(92, 60, 42, 0.44)" : "rgba(190, 79, 55, 0.34)";
    ctx.lineWidth = 2;
    for (let i = 0; i < spec.particleCount; i += 1) {
      const y = 118 + i * 42;
      const wave = reducedMotion ? 0 : Math.sin(motion * 1.7 + i) * 10;
      ctx.beginPath();
      ctx.moveTo(68 + wave, y);
      ctx.bezierCurveTo(188, y - 18, 274, y + 20, 396 + wave, y + 2);
      ctx.bezierCurveTo(518, y - 14, 646, y + 18, 820 + wave, y - 2);
      ctx.stroke();
    }
    if (spec.kind === "drought") {
      ctx.strokeStyle = "rgba(92, 60, 42, 0.46)";
      ctx.lineWidth = 2.2;
      for (let i = 0; i < 6; i += 1) {
        const x = 130 + i * 118;
        const y = 494 - (i % 2) * 38;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 18, y + 18);
        ctx.lineTo(x + 7, y + 38);
        ctx.lineTo(x + 30, y + 56);
        ctx.stroke();
      }
    }
  } else if (spec.kind === "snow" || spec.kind === "frost") {
    ctx.fillStyle = spec.kind === "snow" ? "rgba(255, 255, 255, 0.78)" : "rgba(228, 246, 242, 0.68)";
    for (let i = 0; i < spec.particleCount; i += 1) {
      const drift = reducedMotion ? 0 : motion * (spec.kind === "snow" ? 18 : 8);
      const x = (i * 53 + day * 9 + drift) % width;
      const y = (i * 47 + day * 13 + drift * 1.4) % height;
      ctx.beginPath();
      if (spec.kind === "snow") {
        ctx.arc(x, y, spec.weatherFx.includes("heavy") ? 3.1 : 2.2, 0, Math.PI * 2);
      } else {
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y + 5);
      }
      spec.kind === "snow" ? ctx.fill() : ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255, 253, 245, 0.52)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, 96 + i * 86);
      ctx.lineTo(42, 82 + i * 86);
      ctx.lineTo(88, 92 + i * 86);
      ctx.stroke();
    }
  } else if (spec.kind === "dew") {
    for (let i = 0; i < spec.particleCount; i += 1) {
      const x = 80 + ((i * 67 + day * 19) % (width - 140));
      const y = 278 + ((i * 31 + day * 7) % 274);
      const sparkle = reducedMotion ? 0.4 : 0.28 + Math.max(0, Math.sin(motion * 2.6 + i)) * 0.34;
      ctx.fillStyle = `rgba(255, 253, 245, ${sparkle})`;
      ctx.beginPath();
      ctx.arc(x, y, i % 3 === 0 ? 3.2 : 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.kind === "cloudy") {
    for (let i = 0; i < spec.particleCount; i += 1) {
      const x = reducedMotion ? 50 + i * 142 : -90 + ((motion * 12 + i * 184) % (width + 180));
      const y = 72 + (i % 3) * 62;
      ctx.fillStyle = "rgba(255, 253, 245, 0.2)";
      ctx.beginPath();
      ctx.ellipse(x, y, 64, 18, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 44, y + 4, 54, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    for (let i = 0; i < spec.particleCount; i += 1) {
      const twinkle = reducedMotion ? 0.42 : 0.24 + Math.max(0, Math.sin(motion * 1.8 + i * 0.7)) * 0.36;
      ctx.fillStyle = `rgba(246, 240, 182, ${twinkle})`;
      ctx.beginPath();
      ctx.arc((i * 83 + day * 23) % width, 96 + ((i * 41 + day * 17) % 238), 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawCanvasCard(ctx, 386, 42, 254, spec.warning ? 92 : 76, "rgba(255, 248, 232, 0.86)");
  ctx.fillStyle = `${spec.accent}22`;
  ctx.beginPath();
  ctx.roundRect(404, 58, 48, 44, 15);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "800 23px Microsoft YaHei";
  ctx.fillText(spec.glyph, 417, 88);
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText("主世界天象", 468, 64);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 15px Microsoft YaHei";
  ctx.fillText(`${spec.weatherName} · ${spec.title}`.slice(0, 16), 468, 85);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.termName} · 水分 ${signedPercent(spec.waterBonus)} · 成长 ${multiplierText(spec.growthModifier)}`, 468, 104);
  if (spec.warning) {
    ctx.fillStyle = "rgba(190, 79, 55, 0.12)";
    ctx.beginPath();
    ctx.roundRect(404, 112, 214, 18, 8);
    ctx.fill();
    ctx.fillStyle = "#be4f37";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText(`灾害标签：${spec.disaster} · ${spec.detail}`.slice(0, 28), 414, 125);
  }
  ctx.restore();
  return true;
}
