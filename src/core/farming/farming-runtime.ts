namespace XiannongCore.Farming {
  export type FarmingRow = Record<string, string | undefined>;

  export interface FarmingPlot {
    cropId?: string | null;
    seedItemId?: string | null;
    waterSoil?: boolean;
    watered?: boolean;
    mature?: boolean;
    plantedDay?: number | string | null;
  }

  export interface FarmingRisk {
    kind?: string;
    title?: string;
    resolved?: boolean;
  }

  export interface FarmingRuntimeData {
    crops: FarmingRow[];
    cropsById?: Map<string, FarmingRow>;
    cropsBySeed?: Map<string, FarmingRow>;
  }

  export interface FarmingRuntimeHooks {
    splitTags(value?: string): string[];
    localize(key: string | undefined, fallback: string): string;
    unresolvedRisks(): FarmingRisk[];
    hasAnySpirit(): boolean;
    qualityQuestItemIdForCrop(cropId?: string): string;
  }

  export interface CropSolarAffinity {
    state: "empty" | "risk" | "boost" | "season" | "offseason";
    label: string;
    detail: string;
    yieldBonus?: number;
  }

  export interface CropSolarYieldBonus {
    amount: number;
    text: string;
  }

  export interface SeedProjectedHarvestSpec {
    count: number;
    affinity: CropSolarAffinity | null;
    yieldBonus: CropSolarYieldBonus;
  }

  export interface HarvestQualitySpec {
    score: number;
    tier: number;
    label: string;
    qualityItemId: string;
    qualityCount: number;
  }

  export interface CropWorldGrowthVisualSpec {
    affinity: CropSolarAffinity;
    yieldBonus: CropSolarYieldBonus;
    growDays: number;
    age: number;
    progress: number;
    stage: "sprout" | "leaf" | "bud" | "ripe";
    stageLabel: string;
    needsWater: boolean;
    remaining: number;
    spriteScale: number;
    plotIndex: number;
    palette: { accent: string; fill: string; glow: string };
    elementPalette: { body: string; leaf: string };
    badge: string;
  }

  export interface NightCropGrowthInput {
    plot: FarmingPlot;
    crop?: FarmingRow | null;
    beforeWatered?: boolean;
    beforeMature?: boolean;
    day: number;
    waterBonus: number;
    growthModifier: number;
    waterCareBonus?: number;
    farmGrowthBonus?: number;
    pondAutoWater?: boolean;
  }

  export interface NightWeatherGrowthPlanInput {
    weather?: FarmingRow | null;
    farmGrowthBonus?: number;
    waterCareBonus?: number;
  }

  export interface NightWeatherGrowthPlan {
    waterBonus: number;
    weatherGrowthModifier: number;
    farmGrowthBonus: number;
    waterCareBonus: number;
    growthModifier: number;
  }

  export type NightCropCareSource = "manual" | "rain" | "pond" | "finale_water" | "finale_farm" | "";

  export interface NightCropGrowthPlan {
    cropId: string;
    effectiveWatered: boolean;
    careSource: NightCropCareSource;
    caredBySystem: boolean;
    beforeMature: boolean;
    matureAfter: boolean;
    newlyMature: boolean;
    growDays: number;
    adjustedGrowDays: number;
  }

  export interface NightCropStatePlanInput {
    plot: FarmingPlot;
    growthPlan?: NightCropGrowthPlan | null;
    beforeMature?: boolean;
  }

  export interface NightCropStatePlan {
    cropId: string;
    matureAfter: boolean;
    newlyMature: boolean;
    wateredAfter: false;
  }

  export interface HarvestYieldPlanInput {
    crop?: FarmingRow | null;
    plot?: FarmingPlot | null;
    affinity?: CropSolarAffinity | null;
    farmTaskLevel?: number;
    cohabWaterBonus?: number;
    pondCropBonus?: number;
  }

  export interface HarvestYieldPlan {
    amount: number;
    baseYield: number;
    harvestBonus: number;
    cohabWaterBonus: number;
    pondCropBonus: number;
    solarYield: CropSolarYieldBonus;
    affinity: CropSolarAffinity | null;
  }

  export interface HarvestStatePlanInput {
    plot?: FarmingPlot | null;
  }

  export interface HarvestStatePlan {
    cropId: null;
    seedItemId: null;
    plantedDay: null;
    watered: false;
    mature: false;
  }

  export interface HarvestProgressPlanInput {
    harvestBefore?: number;
    harvestAfter?: number;
    qualityBefore?: number;
    qualityAfter?: number;
    threshold?: number;
  }

  export interface HarvestProgressPlan {
    threshold: number;
    harvestReady: boolean;
    qualityReady: boolean;
  }

  export interface HarvestQualityRewardPlanInput {
    qualitySpec?: HarvestQualitySpec | null;
    qualityBefore?: number;
  }

  export interface HarvestQualityRewardPlan {
    rewardItemId: string;
    rewardCount: number;
    shouldReward: boolean;
    qualityBefore: number;
    qualityAfter: number;
  }

  export interface PlantStatePlanInput {
    crop?: FarmingRow | null;
    seedItemId?: string;
    day: number;
    firstSeeded?: boolean;
  }

  export interface PlantStatePlan {
    cropId: string;
    seedItemId: string;
    plantedDay: number;
    watered: false;
    mature: false;
    firstSeeded: boolean;
    firstSeededDay?: number;
    firstSeededSeedId?: string;
    firstSeededCropId?: string;
  }

  export interface WaterStatePlanInput {
    plot?: FarmingPlot | null;
    day?: number;
  }

  export interface WaterStatePlan {
    cropId: string;
    watered: true;
    wasWatered: boolean;
    wateredDay: number;
  }

  export interface FarmingRuntime {
    cropForHarvestTarget(targetId?: string): FarmingRow | null;
    cropSolarAffinity(
      crop?: FarmingRow | null,
      plot?: FarmingPlot | null,
      term?: FarmingRow | null,
      weather?: FarmingRow | null,
    ): CropSolarAffinity;
    cropSolarYieldBonus(crop?: FarmingRow | null, plot?: FarmingPlot | null, affinity?: CropSolarAffinity | null): CropSolarYieldBonus;
    seedProjectedHarvestSpec(crop?: FarmingRow | null, plot?: FarmingPlot | null): SeedProjectedHarvestSpec;
    harvestQualitySpec(crop?: FarmingRow | null, plot?: FarmingPlot | null, amount?: number, affinity?: CropSolarAffinity | null): HarvestQualitySpec;
    cropWorldGrowthVisualSpec(crop?: FarmingRow | null, plot?: FarmingPlot | null, plotIndex?: number, day?: number): CropWorldGrowthVisualSpec | null;
    nightWeatherGrowthPlan(input: NightWeatherGrowthPlanInput): NightWeatherGrowthPlan;
    nightCropGrowthPlan(input: NightCropGrowthInput): NightCropGrowthPlan;
    nightCropStatePlan(input: NightCropStatePlanInput): NightCropStatePlan;
    harvestYieldPlan(input: HarvestYieldPlanInput): HarvestYieldPlan;
    harvestStatePlan(input: HarvestStatePlanInput): HarvestStatePlan;
    harvestProgressPlan(input: HarvestProgressPlanInput): HarvestProgressPlan;
    harvestQualityRewardPlan(input: HarvestQualityRewardPlanInput): HarvestQualityRewardPlan;
    plantStatePlan(input: PlantStatePlanInput): PlantStatePlan;
    waterStatePlan(input: WaterStatePlanInput): WaterStatePlan;
  }

  export function createFarmingRuntime(data: FarmingRuntimeData, hooks: FarmingRuntimeHooks): FarmingRuntime {
    function splitTags(value?: string): string[] {
      return hooks.splitTags(value || "");
    }

    function cropForHarvestTarget(targetId = ""): FarmingRow | null {
      if (!targetId) return null;
      return data.cropsById?.get(targetId)
        || data.cropsBySeed?.get(targetId)
        || data.crops.find((crop) => crop.crop_id === targetId || crop.seed_item_id === targetId || crop.output_item_id === targetId)
        || null;
    }

    function cropSolarAffinity(
      crop: FarmingRow | null = null,
      plot: FarmingPlot | null = null,
      term: FarmingRow | null = null,
      weather: FarmingRow | null = null,
    ): CropSolarAffinity {
      if (!crop) return { state: "empty", label: "", detail: "" };
      const termId = term?.term_id || "term_lichun";
      const shortTerm = termId.replace("term_", "");
      const seasonMatches = splitTags(crop.season_list || crop.season_tags).includes(term?.season || "");
      const cropBonusTags = splitTags(crop.solar_term_bonus_tags);
      const termMatches = cropBonusTags.includes(shortTerm) || cropBonusTags.includes(termId);
      const termBonuses = splitTags(term?.crop_bonus_tags);
      const cropTags = [
        crop.element_type,
        ...splitTags(crop.suitable_soil_tags),
        ...splitTags(crop.process_recipe_tags),
        ...splitTags(crop.gift_tags),
      ].filter((tag): tag is string => Boolean(tag));
      const tagMatch = cropTags.some((tag) => termBonuses.some((bonus) => bonus.includes(tag) || tag.includes(bonus.replace("_crop", ""))));
      const weaknesses = splitTags(crop.disaster_weakness_tags);
      const activeRisk = hooks.unresolvedRisks().find((risk) => Boolean(risk.kind && weaknesses.includes(risk.kind)));
      const weatherRisk = weaknesses.includes(weather?.disaster_tag || "") || (weaknesses.includes("drought") && Number(weather?.water_bonus || 0) < 0);
      const waterFit = crop.element_type === "water" && Boolean(plot?.waterSoil);
      const boostCount = [termMatches, tagMatch, waterFit].filter(Boolean).length;
      const cropName = hooks.localize(crop.crop_name_key, crop.crop_id || "");

      if (activeRisk || weatherRisk) {
        return {
          state: "risk",
          label: "Risk",
          yieldBonus: 0,
          detail: `${cropName} is exposed to ${activeRisk?.title || weather?.disaster_tag || "current weather"}; protect it first.`,
        };
      }
      if (termMatches || tagMatch || waterFit) {
        return {
          state: "boost",
          label: waterFit ? "Water" : "Term",
          yieldBonus: Math.min(2, boostCount),
          detail: `${cropName} matches ${hooks.localize(term?.term_name_key, termId)} conditions.`,
        };
      }
      if (seasonMatches) {
        return {
          state: "season",
          label: "Season",
          yieldBonus: 0,
          detail: `${cropName} is in season and should grow steadily.`,
        };
      }
      return {
        state: "offseason",
        label: "Off",
        yieldBonus: 0,
        detail: `${cropName} is outside its strongest solar-term window.`,
      };
    }

    function cropSolarYieldBonus(crop: FarmingRow | null = null, plot: FarmingPlot | null = null, affinity: CropSolarAffinity | null = cropSolarAffinity(crop, plot)): CropSolarYieldBonus {
      if (!crop || !affinity || affinity.state === "empty") return { amount: 0, text: "" };
      const amount = Math.max(0, Number(affinity.yieldBonus || 0));
      if (amount <= 0) {
        return {
          amount: 0,
          text: affinity.state === "risk" ? ` ${affinity.detail}` : "",
        };
      }
      return {
        amount,
        text: ` Solar affinity${affinity.label ? ` (${affinity.label})` : ""} adds ${amount} extra yield.`,
      };
    }

    function seedProjectedHarvestSpec(crop: FarmingRow | null = null, plot: FarmingPlot | null = null): SeedProjectedHarvestSpec {
      if (!crop) return { count: 1, affinity: null, yieldBonus: { amount: 0, text: "" } };
      const simulatedPlot = {
        ...(plot || {}),
        cropId: crop.crop_id,
        seedItemId: crop.seed_item_id,
      };
      const affinity = cropSolarAffinity(crop, simulatedPlot);
      const yieldBonus = cropSolarYieldBonus(crop, simulatedPlot, affinity);
      return {
        count: Math.max(1, Number(crop.harvest_yield_min || 1) + Number(yieldBonus.amount || 0)),
        affinity,
        yieldBonus,
      };
    }

    function harvestQualitySpec(crop: FarmingRow | null = null, plot: FarmingPlot | null = null, amount = 1, affinity: CropSolarAffinity | null = cropSolarAffinity(crop, plot)): HarvestQualitySpec {
      if (!crop) return { score: 0, tier: 1, label: "Normal", qualityItemId: "", qualityCount: 0 };
      const baseScore = Number(crop.base_quality_weight || 50);
      const affinityBonus = affinity?.state === "boost" ? 14 : affinity?.state === "season" ? 8 : affinity?.state === "risk" ? -16 : 0;
      const soilBonus = plot?.waterSoil ? (crop.element_type === "water" ? 10 : 2) : 0;
      const spiritBonus = hooks.hasAnySpirit() ? 4 : 0;
      const cleanGrowBonus = plot?.watered ? 2 : 0;
      const score = baseScore + affinityBonus + soilBonus + spiritBonus + cleanGrowBonus;
      const tier = score >= 92 ? 3 : score >= 72 ? 2 : 1;
      const qualityItemId = tier >= 2 ? hooks.qualityQuestItemIdForCrop(crop.crop_id) : "";
      const qualityCount = qualityItemId
        ? Math.max(1, Math.min(Number(amount || 1), Math.round(Number(amount || 1) * (tier >= 3 ? 0.8 : 0.6))))
        : 0;
      return {
        score,
        tier,
        label: tier >= 3 ? "Superior" : tier >= 2 ? "Fine" : "Normal",
        qualityItemId,
        qualityCount,
      };
    }

    function cropWorldGrowthVisualSpec(crop: FarmingRow | null = null, plot: FarmingPlot | null = null, plotIndex = 0, day = 1): CropWorldGrowthVisualSpec | null {
      if (!crop || !plot?.cropId) return null;
      const affinity = cropSolarAffinity(crop, plot);
      const yieldBonus = cropSolarYieldBonus(crop, plot, affinity);
      const growDays = Math.max(1, Number(crop.grow_days || 1));
      const age = Math.max(0, Number(day || 1) - Number(plot.plantedDay || day || 1));
      const rawProgress = plot.mature ? 1 : Math.max(0.08, Math.min(0.96, (age + (plot.watered ? 0.32 : 0)) / growDays));
      const stage = plot.mature
        ? "ripe"
        : rawProgress >= 0.72
          ? "bud"
          : rawProgress >= 0.38
            ? "leaf"
            : "sprout";
      const stageLabel = {
        sprout: "Sprout",
        leaf: "Leaf",
        bud: "Bud",
        ripe: "Ripe",
      }[stage] || "Growing";
      const needsWater = !plot.mature && !plot.watered;
      const affinityTone = affinity.state === "empty" ? "offseason" : affinity.state;
      const palette = {
        boost: { accent: "#e0b66d", fill: "rgba(255, 248, 232, 0.9)", glow: "rgba(246, 240, 182, 0.28)" },
        season: { accent: "#48a868", fill: "rgba(237, 243, 223, 0.88)", glow: "rgba(202, 235, 210, 0.22)" },
        risk: { accent: "#be4f37", fill: "rgba(255, 240, 232, 0.92)", glow: "rgba(190, 79, 55, 0.2)" },
        offseason: { accent: "#8f5f3f", fill: "rgba(255, 253, 245, 0.82)", glow: "rgba(143, 95, 63, 0.13)" },
      }[affinityTone] || { accent: "#5d6f65", fill: "rgba(255, 253, 245, 0.82)", glow: "rgba(93, 111, 101, 0.13)" };
      const elementPalette = crop.element_type === "water"
        ? { body: "#4d91a6", leaf: "#caebd2" }
        : crop.element_type === "fire"
          ? { body: "#be4f37", leaf: "#f0a54e" }
          : crop.element_type === "wood"
            ? { body: "#48a868", leaf: "#f5f0b6" }
            : { body: "#b47d2f", leaf: "#286f58" };
      return {
        affinity,
        yieldBonus,
        growDays,
        age,
        progress: rawProgress,
        stage,
        stageLabel,
        needsWater,
        remaining: plot.mature ? 0 : Math.max(0, growDays - age),
        spriteScale: plot.mature ? 0.76 : Math.max(0.34, 0.36 + rawProgress * 0.28),
        plotIndex,
        palette,
        elementPalette,
        badge: yieldBonus.amount > 0 ? `${affinity.label || "Term"}+${yieldBonus.amount}` : affinity.label || stageLabel,
      };
    }

    function nightWeatherGrowthPlan(input: NightWeatherGrowthPlanInput): NightWeatherGrowthPlan {
      const weather = input.weather || {};
      const waterBonus = Number(weather.water_bonus || 0);
      const weatherGrowthModifier = Number(weather.crop_growth_modifier || 1);
      const farmGrowthBonus = Number(input.farmGrowthBonus || 0);
      const waterCareBonus = Number(input.waterCareBonus || 0);
      return {
        waterBonus,
        weatherGrowthModifier,
        farmGrowthBonus,
        waterCareBonus,
        growthModifier: weatherGrowthModifier + farmGrowthBonus,
      };
    }

    function nightCropGrowthPlan(input: NightCropGrowthInput): NightCropGrowthPlan {
      const plot = input.plot;
      const crop = input.crop || (plot.cropId ? cropForHarvestTarget(plot.cropId) : null);
      const cropId = plot.cropId || crop?.crop_id || "";
      const growDays = Math.max(1, Number(crop?.grow_days || 1));
      const growthModifier = Math.max(0.01, Number(input.growthModifier || 1));
      const rainWatered = Number(input.waterBonus || 0) >= 0.3;
      const finaleWatered = Number(input.waterCareBonus || 0) > 0 && crop?.element_type === "water";
      const pondWatered = Boolean(input.pondAutoWater && plot.waterSoil && crop?.element_type === "water");
      const finaleFarmCare = Number(input.farmGrowthBonus || 0) > 0 && Boolean(cropId) && Number(input.day || 1) % 2 === 0;
      const manualWatered = Boolean(plot.watered);
      const effectiveWatered = manualWatered || rainWatered || pondWatered || finaleWatered || finaleFarmCare;
      const adjustedGrowDays = Math.max(1, Math.ceil(growDays / growthModifier));
      const beforeMature = Boolean(input.beforeMature ?? plot.mature);
      const matureAfter = beforeMature || (effectiveWatered && Number(input.day || 1) - Number(plot.plantedDay || input.day || 1) >= adjustedGrowDays);
      const careSource: NightCropCareSource = manualWatered
        ? "manual"
        : rainWatered
          ? "rain"
          : pondWatered
            ? "pond"
            : finaleWatered
              ? "finale_water"
              : finaleFarmCare
                ? "finale_farm"
                : "";
      return {
        cropId,
        effectiveWatered,
        careSource,
        caredBySystem: !Boolean(input.beforeWatered) && careSource !== "" && careSource !== "manual",
        beforeMature,
        matureAfter,
        newlyMature: !beforeMature && matureAfter,
        growDays,
        adjustedGrowDays,
      };
    }

    function nightCropStatePlan(input: NightCropStatePlanInput): NightCropStatePlan {
      const plot = input.plot;
      const growthPlan = input.growthPlan || null;
      const beforeMature = Boolean(input.beforeMature ?? plot.mature);
      const matureAfter = growthPlan ? Boolean(growthPlan.matureAfter) : beforeMature;
      return {
        cropId: String(growthPlan?.cropId || plot.cropId || ""),
        matureAfter,
        newlyMature: growthPlan ? Boolean(growthPlan.newlyMature) : !beforeMature && matureAfter,
        wateredAfter: false,
      };
    }

    function harvestYieldPlan(input: HarvestYieldPlanInput): HarvestYieldPlan {
      const crop = input.crop || null;
      const plot = input.plot || null;
      const affinity = input.affinity || cropSolarAffinity(crop, plot);
      const solarYield = cropSolarYieldBonus(crop, plot, affinity);
      const baseYield = Math.max(1, Number(crop?.harvest_yield_min || 1));
      const farmTaskLevel = Number(input.farmTaskLevel || 0);
      const harvestBonus = farmTaskLevel >= 5 ? 2 : farmTaskLevel >= 3 ? 1 : 0;
      const cohabWaterBonus = Number(input.cohabWaterBonus || 0);
      const pondCropBonus = Number(input.pondCropBonus || 0);
      const amount = Math.max(1, baseYield + harvestBonus + cohabWaterBonus + pondCropBonus + Number(solarYield.amount || 0));
      return {
        amount,
        baseYield,
        harvestBonus,
        cohabWaterBonus,
        pondCropBonus,
        solarYield,
        affinity,
      };
    }

    function harvestStatePlan(input: HarvestStatePlanInput): HarvestStatePlan {
      return {
        cropId: null,
        seedItemId: null,
        plantedDay: null,
        watered: false,
        mature: false,
      };
    }

    function harvestProgressPlan(input: HarvestProgressPlanInput): HarvestProgressPlan {
      const threshold = Math.max(1, Number(input.threshold || 5));
      const harvestBefore = Number(input.harvestBefore || 0);
      const harvestAfter = Number(input.harvestAfter || 0);
      const qualityBefore = Number(input.qualityBefore || 0);
      const qualityAfter = Number(input.qualityAfter || 0);
      return {
        threshold,
        harvestReady: harvestBefore < threshold && harvestAfter >= threshold,
        qualityReady: qualityBefore < threshold && qualityAfter >= threshold,
      };
    }

    function harvestQualityRewardPlan(input: HarvestQualityRewardPlanInput): HarvestQualityRewardPlan {
      const qualitySpec = input.qualitySpec || null;
      const rewardItemId = String(qualitySpec?.qualityItemId || "");
      const rewardCount = Math.max(0, Number(qualitySpec?.qualityCount || 0));
      const qualityBefore = Number(input.qualityBefore || 0);
      const shouldReward = Boolean(rewardItemId && rewardCount > 0);
      return {
        rewardItemId,
        rewardCount: shouldReward ? rewardCount : 0,
        shouldReward,
        qualityBefore,
        qualityAfter: qualityBefore + (shouldReward ? rewardCount : 0),
      };
    }

    function plantStatePlan(input: PlantStatePlanInput): PlantStatePlan {
      const crop = input.crop || {};
      const cropId = String(crop.crop_id || "");
      const seedItemId = String(crop.seed_item_id || input.seedItemId || "");
      const plantedDay = Number(input.day || 1);
      const firstSeeded = Boolean(input.firstSeeded);
      const plan: PlantStatePlan = {
        cropId,
        seedItemId,
        plantedDay,
        watered: false,
        mature: false,
        firstSeeded,
      };
      if (firstSeeded) {
        plan.firstSeededDay = plantedDay;
        plan.firstSeededSeedId = seedItemId;
        plan.firstSeededCropId = cropId;
      }
      return plan;
    }

    function waterStatePlan(input: WaterStatePlanInput): WaterStatePlan {
      const plot = input.plot || {};
      return {
        cropId: String(plot.cropId || ""),
        watered: true,
        wasWatered: Boolean(plot.watered),
        wateredDay: Number(input.day || 1),
      };
    }

    return {
      cropForHarvestTarget,
      cropSolarAffinity,
      cropSolarYieldBonus,
      seedProjectedHarvestSpec,
      harvestQualitySpec,
      cropWorldGrowthVisualSpec,
      nightWeatherGrowthPlan,
      nightCropGrowthPlan,
      nightCropStatePlan,
      harvestYieldPlan,
      harvestStatePlan,
      harvestProgressPlan,
      harvestQualityRewardPlan,
      plantStatePlan,
      waterStatePlan,
    };
  }
}
