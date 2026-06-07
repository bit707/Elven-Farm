namespace XiannongCore.Farming {
  export type FarmingRow = Record<string, string | undefined>;

  export interface FarmingPlot {
    cropId?: string | null;
    seedItemId?: string | null;
    waterSoil?: boolean;
    watered?: boolean;
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

    return {
      cropForHarvestTarget,
      cropSolarAffinity,
      cropSolarYieldBonus,
      seedProjectedHarvestSpec,
    };
  }
}
