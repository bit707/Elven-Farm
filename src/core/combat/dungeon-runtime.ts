namespace XiannongCore.Combat {
  export type CombatRow = Record<string, string | undefined>;

  export interface CombatSpirit {
    id?: string | null;
    jobLevels?: {
      expedition?: number | string | null;
      [key: string]: number | string | null | undefined;
    } | null;
  }

  export interface CombatDungeonRun {
    bossHp?: number | string | null;
    bossMaxHp?: number | string | null;
  }

  export interface CombatRuntimeData {
    bosses: CombatRow[];
    bossSkills: CombatRow[];
    spiritSkills: CombatRow[];
    bossesById?: Map<string, CombatRow>;
    bossSkillsByBoss?: Map<string, CombatRow[]>;
    spiritSkillsBySpirit?: Map<string, CombatRow[]>;
  }

  export interface BossSkillForTurnInput {
    bossId?: string | null;
    turn?: number | string | null;
    hpPercent?: number | string | null;
  }

  export interface SpiritCombatSkillsInput {
    spirit?: CombatSpirit | null;
    dungeonClearCount?: number | string | null;
  }

  export interface SpiritCombatBonusInput extends SpiritCombatSkillsInput {
    skills?: CombatRow[] | null;
  }

  export interface DungeonBossMaxHpInput {
    bossId?: string | null;
    boss?: CombatRow | null;
    fallback?: number | string | null;
  }

  export interface BossHpPercentInput extends DungeonBossMaxHpInput {
    run?: CombatDungeonRun | null;
    bossHp?: number | string | null;
    bossMaxHp?: number | string | null;
  }

  export interface DungeonMechanicEffects {
    enemyPowerDown?: number | string | null;
    damageUp?: number | string | null;
    damageDown?: number | string | null;
    bossGuard?: number | string | null;
    strikeBonus?: number | string | null;
    lootMultiplier?: number | string | null;
  }

  export interface DungeonMechanicState {
    pillarsLit?: number | string | null;
    resonanceTurn?: boolean | number | string | null;
    waterLevel?: number | string | null;
    sluicesAligned?: number | string | null;
    cadence?: number | string | null;
    listened?: number | string | null;
    overflow?: number | string | null;
    verifiedPaths?: number | string | null;
    coldStacks?: number | string | null;
    windShift?: number | string | null;
    routeMarks?: number | string | null;
    lanternChain?: number | string | null;
  }

  export interface DungeonMechanicEffectsInput {
    mechanicId?: string | null;
    mechanicState?: DungeonMechanicState | null;
    support?: number | string | null;
    phase?: string | null;
  }

  export interface DungeonMechanicAdvancePlanInput extends DungeonMechanicEffectsInput {
    hiddenRevealPressureDown?: number | string | null;
  }

  export interface DungeonMechanicAdvancePlan {
    nextState: DungeonMechanicState;
    changed: Array<keyof DungeonMechanicState>;
  }

  export interface DungeonMechanicActionPlanInput extends DungeonMechanicEffectsInput {
    currentHp?: number | string | null;
  }

  export interface DungeonMechanicActionPlan extends DungeonMechanicAdvancePlan {
    hpAfter: number | null;
    hpDelta: number;
  }

  export interface DungeonExplorePlanInput {
    enemy?: CombatRow | null;
    hazardPressure?: number | string | null;
    spiritPower?: number | string | null;
    mechanicBonus?: number | string | null;
    rotationHazardReduce?: number | string | null;
    rotationPathBonus?: number | string | null;
    hiddenRevealPressureDown?: number | string | null;
    failureInsightPathBonus?: number | string | null;
    failureInsightOverflowRelief?: number | string | null;
    mechanicEffects?: DungeonMechanicEffects | null;
  }

  export interface DungeonExplorePlan {
    enemyPower: number;
    damage: number;
  }

  export interface DungeonExploreStatePlanInput {
    hp?: number | string | null;
    damage?: number | string | null;
    progress?: number | string | null;
    turn?: number | string | null;
    enemyId?: string | null;
    lootCount?: number | string | null;
  }

  export interface DungeonExploreStatePlan {
    hpAfter: number;
    progressAfter: number;
    turnAfter: number;
    lastEnemyId: string | null;
    combatMoment: "danger" | "loot" | "steady";
  }

  export interface DungeonExploreOutcomePlanInput {
    hp?: number | string | null;
    floor?: number | string | null;
    maxFloor?: number | string | null;
    stamina?: number | string | null;
  }

  export interface DungeonExploreOutcomePlan {
    outcome: "failed" | "boss_ready" | "advance";
    finished: boolean;
    bossReady: boolean;
    floorAfter: number;
    staminaAfter: number | null;
    combatMoment: "failed" | "boss_ready" | null;
  }

  export interface DungeonLootPlanInput {
    pool?: CombatRow[] | null;
    floor?: number | string | null;
    countMultiplier?: number | string | null;
    day?: number | string | null;
    runSeed?: number | string | null;
    turn?: number | string | null;
    conditionResults?: Record<string, boolean | number | string | null | undefined> | null;
  }

  export interface DungeonLootPlanEntry {
    itemId: string;
    count: number;
  }

  export interface DungeonBossExchangePlanInput {
    boss?: CombatRow | null;
    bossSkill?: CombatRow | null;
    supportSkill?: CombatRow | null;
    bossShield?: number | string | null;
    phase?: number | string | null;
    maxFloor?: number | string | null;
    spiritPower?: number | string | null;
    hazardPressure?: number | string | null;
    rotationBossGuard?: number | string | null;
    rotationPathBonus?: number | string | null;
    failureInsightBossGuard?: number | string | null;
    failureInsightBossStrikeBonus?: number | string | null;
    mechanicEffects?: DungeonMechanicEffects | null;
  }

  export interface DungeonBossExchangePlan {
    bossPressure: number;
    skillPressure: number;
    supportGuard: number;
    damage: number;
    baseStrike: number;
    shieldAfterSkill: number;
    absorbed: number;
    bossShieldAfter: number;
    bossDamage: number;
  }

  export interface DungeonBossExchangeStatePlanInput {
    bossId?: string | null;
    hp?: number | string | null;
    bossHp?: number | string | null;
    bossMaxHp?: number | string | null;
    bossShieldAfter?: number | string | null;
    turn?: number | string | null;
    phaseBefore?: number | string | null;
    damage?: number | string | null;
    bossDamage?: number | string | null;
  }

  export interface DungeonBossExchangeStatePlan {
    hpAfter: number;
    bossHpAfter: number;
    bossShieldAfter: number;
    turnAfter: number;
    bossPhaseAfter: number;
    combatMoment: "boss_defeat" | "failed" | "phase_shift" | "boss_exchange";
  }

  export interface DungeonBossClearPlanInput {
    areaId?: string | null;
    bossId?: string | null;
    bossLoot?: DungeonLootPlanEntry[] | null;
    hasBaizhiMotherDew?: boolean | number | string | null;
    hasFireCore?: boolean | number | string | null;
    hasDinghaiItem?: boolean | number | string | null;
  }

  export interface DungeonBossClearPlan {
    finished: boolean;
    fameDelta: number;
    clearAreaId: string;
    defeatedBossId: string;
    guaranteedLoot: DungeonLootPlanEntry[];
    bossLoot: DungeonLootPlanEntry[];
    lastLoot: DungeonLootPlanEntry[];
  }

  export interface DungeonFailureRewardPlanInput {
    outcome?: "explore_failed" | "boss_failed" | "retreat" | string | null;
    mechanicId?: string | null;
    overflow?: number | string | null;
    floor?: number | string | null;
    bossReady?: boolean | number | string | null;
    finished?: boolean | number | string | null;
    progress?: number | string | null;
    alreadyCleared?: boolean | number | string | null;
  }

  export interface DungeonFailureRewardPlan {
    shouldRecord: boolean;
    finished: boolean;
    failureReason: "overflow" | "battle" | "boss" | "retreat" | "";
    stampKind: "shard";
    stampAmount: number;
  }

  export interface DungeonPostBattleSideEffectPlanInput {
    areaId?: string | null;
    bossId?: string | null;
    termId?: string | null;
  }

  export interface DungeonPostBattleSideEffectPlan {
    completionKeys: string[];
    seasonalGoal: {
      category: string;
      key: string;
      amount: number;
    } | null;
    storyHooks: string[];
    cohabEvent: {
      trigger: string;
      areaId: string;
    } | null;
  }

  export interface CombatRuntime {
    bossSkillsFor(bossId?: string | null): CombatRow[];
    bossPhaseForPercent(bossId?: string | null, hpPercent?: number | string | null): number;
    bossSkillForTurn(input?: BossSkillForTurnInput | null): CombatRow | null;
    skillImpact(skill?: CombatRow | null): number;
    spiritCombatSkills(input?: SpiritCombatSkillsInput | null): CombatRow[];
    spiritCombatBonus(input?: SpiritCombatBonusInput | null): number;
    dungeonBossMaxHp(input?: DungeonBossMaxHpInput | null): number;
    bossHpPercent(input?: BossHpPercentInput | null): number;
    dungeonMechanicEffects(input?: DungeonMechanicEffectsInput | null): Required<DungeonMechanicEffects>;
    dungeonMechanicAdvancePlan(input?: DungeonMechanicAdvancePlanInput | null): DungeonMechanicAdvancePlan;
    dungeonMechanicActionPlan(input?: DungeonMechanicActionPlanInput | null): DungeonMechanicActionPlan;
    dungeonExplorePlan(input?: DungeonExplorePlanInput | null): DungeonExplorePlan;
    dungeonExploreStatePlan(input?: DungeonExploreStatePlanInput | null): DungeonExploreStatePlan;
    dungeonExploreOutcomePlan(input?: DungeonExploreOutcomePlanInput | null): DungeonExploreOutcomePlan;
    dungeonLootPlan(input?: DungeonLootPlanInput | null): DungeonLootPlanEntry[];
    dungeonBossExchangePlan(input?: DungeonBossExchangePlanInput | null): DungeonBossExchangePlan;
    dungeonBossExchangeStatePlan(input?: DungeonBossExchangeStatePlanInput | null): DungeonBossExchangeStatePlan;
    dungeonBossClearPlan(input?: DungeonBossClearPlanInput | null): DungeonBossClearPlan;
    dungeonFailureRewardPlan(input?: DungeonFailureRewardPlanInput | null): DungeonFailureRewardPlan;
    dungeonPostBattleSideEffectPlan(input?: DungeonPostBattleSideEffectPlanInput | null): DungeonPostBattleSideEffectPlan;
  }

  function byId(rows: CombatRow[], idField: string, id?: string | null): CombatRow | null {
    if (!id) return null;
    return rows.find((row) => row[idField] === id) || null;
  }

  function clampPercent(value: number): number {
    return Math.max(0, Math.min(1, value));
  }

  function effectValue(effects: DungeonMechanicEffects | null | undefined, key: keyof DungeonMechanicEffects): number {
    return Number(effects?.[key] || 0);
  }

  function mechanicValue(state: DungeonMechanicState | null | undefined, key: keyof DungeonMechanicState, fallback = 0): number {
    return Number(state?.[key] ?? fallback);
  }

  function finiteNumber(value: number | string | null | undefined, fallback = 0): number {
    const parsed = Number(value ?? fallback);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function lootConditionPass(entry: CombatRow, conditionResults: Record<string, boolean | number | string | null | undefined>): boolean {
    const condition = entry.condition_group || "always_true";
    if (!condition || condition === "always_true") return true;
    const result = conditionResults[condition];
    return result === true || result === 1 || result === "1" || result === "true";
  }

  function truthyFlag(value: boolean | number | string | null | undefined): boolean {
    return value === true || value === 1 || value === "1" || value === "true";
  }

  function changedKeys(before: DungeonMechanicState, after: DungeonMechanicState): Array<keyof DungeonMechanicState> {
    const keys: Array<keyof DungeonMechanicState> = [
      "pillarsLit",
      "resonanceTurn",
      "waterLevel",
      "sluicesAligned",
      "cadence",
      "listened",
      "overflow",
      "verifiedPaths",
      "coldStacks",
      "windShift",
      "routeMarks",
      "lanternChain",
    ];
    return keys.filter((key) => before[key] !== after[key]);
  }

  export function createDungeonRuntime(data: CombatRuntimeData): CombatRuntime {
    function bossForId(bossId?: string | null): CombatRow | null {
      if (!bossId) return null;
      return data.bossesById?.get(bossId) || byId(data.bosses, "boss_id", bossId);
    }

    function bossSkillsFor(bossId: string | null = ""): CombatRow[] {
      return [...(data.bossSkillsByBoss?.get(bossId || "") || data.bossSkills.filter((skill) => skill.boss_id === bossId))]
        .sort((a, b) => Number(a.phase_index) - Number(b.phase_index) || Number(a.order_in_phase) - Number(b.order_in_phase));
    }

    function bossPhaseForPercent(bossId: string | null = "", hpPercent: number | string | null = 1): number {
      const boss = bossForId(bossId);
      const phaseCount = Math.max(1, Number(boss?.phase_count || 1));
      const percent = clampPercent(Number(hpPercent ?? 1));
      if (phaseCount >= 3) {
        if (percent <= 0.35) return 3;
        if (percent <= 0.7) return 2;
        return 1;
      }
      if (phaseCount >= 2 && percent <= 0.5) return 2;
      return 1;
    }

    function bossSkillForTurn(input: BossSkillForTurnInput | null = null): CombatRow | null {
      const bossId = input?.bossId || "";
      const phase = bossPhaseForPercent(bossId, input?.hpPercent ?? 1);
      const skills = bossSkillsFor(bossId).filter((skill) => Number(skill.phase_index) === phase);
      if (skills.length === 0) return null;
      return skills[Math.max(0, Number(input?.turn || 0)) % skills.length];
    }

    function skillImpact(skill: CombatRow | null = null): number {
      if (!skill) return 0;
      const primary = Number(skill.effect_param_1 || 0);
      if (skill.effect_type === "damage") return primary;
      if (skill.effect_type === "spawn_hazard") return primary * 4;
      if (skill.effect_type === "shield") return Math.round(primary / 12);
      return Math.max(0, primary);
    }

    function spiritCombatSkills(input: SpiritCombatSkillsInput | null = null): CombatRow[] {
      const spirit = input?.spirit || null;
      if (!spirit) return [];
      const direct = data.spiritSkillsBySpirit?.get(spirit.id || "") || data.spiritSkills.filter((skill) => skill.spirit_id === spirit.id);
      const combat = data.spiritSkills.filter((skill) => skill.effect_type === "combat");
      return direct.length > 0 ? [...direct] : combat.slice(0, Number(input?.dungeonClearCount || 0) > 0 ? 2 : 1);
    }

    function spiritCombatBonus(input: SpiritCombatBonusInput | null = null): number {
      const spirit = input?.spirit || null;
      const skills = input?.skills || spiritCombatSkills(input);
      const skillBonus = skills.reduce((sum, skill) => {
        const value = Number(skill.effect_param_1 || 0);
        return sum + (skill.effect_type === "combat" ? Math.max(3, Math.round(value * 6)) : 1);
      }, 0);
      return skillBonus + (spirit ? Math.max(0, Number(spirit.jobLevels?.expedition || 0) * 3) : 0);
    }

    function dungeonBossMaxHp(input: DungeonBossMaxHpInput | null = null): number {
      const boss = input?.boss || bossForId(input?.bossId || "");
      return Math.max(300, Number(boss?.hp_total || input?.fallback || 1200));
    }

    function bossHpPercent(input: BossHpPercentInput | null = null): number {
      const maxHp = Number(input?.bossMaxHp || input?.run?.bossMaxHp || dungeonBossMaxHp(input));
      if (maxHp <= 0) return 1;
      return clampPercent(Number(input?.bossHp ?? input?.run?.bossHp ?? maxHp) / maxHp);
    }

    function dungeonMechanicEffects(input: DungeonMechanicEffectsInput | null = null): Required<DungeonMechanicEffects> {
      const mechanicId = input?.mechanicId || "";
      const mechanicState = input?.mechanicState || null;
      const support = Number(input?.support || 0);
      const effects = {
        enemyPowerDown: 0,
        damageUp: 0,
        damageDown: 0,
        bossGuard: 0,
        strikeBonus: 0,
        lootMultiplier: 1,
      };
      if (!mechanicState || !mechanicId) return effects;
      switch (mechanicId) {
        case "dsm_001":
          if (mechanicState.resonanceTurn) {
            effects.enemyPowerDown += 2 + support;
            if (Number(mechanicState.pillarsLit || 0) >= 2) effects.strikeBonus += 16;
          } else {
            effects.damageUp += Math.max(1, 2 - support);
          }
          if (Number(mechanicState.pillarsLit || 0) >= 3) effects.bossGuard += 3 + Math.min(2, support);
          break;
        case "dsm_002":
          if (Number(mechanicState.waterLevel || 0) === 0) {
            effects.damageUp += Math.max(0, 1 - Math.min(1, support));
            effects.enemyPowerDown += support > 0 ? 1 : 0;
          } else if (Number(mechanicState.waterLevel || 0) === 1) {
            effects.enemyPowerDown += 2 + support;
            effects.strikeBonus += 10;
          } else {
            effects.damageUp += support >= 2 ? 0 : 2;
            effects.lootMultiplier += 0.12;
          }
          if (Number(mechanicState.sluicesAligned || 0) >= 3) effects.bossGuard += 3;
          break;
        case "dsm_003":
          if (Number(mechanicState.cadence || 0) === 1 || support >= 2) effects.enemyPowerDown += 2 + support;
          if (Number(mechanicState.cadence || 0) === 2 && support === 0) effects.damageUp += 2;
          if (Number(mechanicState.listened || 0) >= 3) {
            effects.bossGuard += 2;
            effects.lootMultiplier += 0.1;
          }
          break;
        case "dsm_004": {
          const overflow = Number(mechanicState.overflow || 0);
          const effectiveOverflow = Math.max(0, overflow - Math.min(2, support));
          effects.damageUp += Math.max(0, effectiveOverflow - 1);
          effects.lootMultiplier += overflow * 0.12;
          effects.strikeBonus += overflow * 6;
          effects.enemyPowerDown += support;
          break;
        }
        case "dsm_005":
          effects.enemyPowerDown += Number(mechanicState.verifiedPaths || 0) + support;
          if (support === 0 && Number(mechanicState.verifiedPaths || 0) === 0) effects.damageUp += 1;
          if (Number(mechanicState.verifiedPaths || 0) >= 2) {
            effects.bossGuard += 2;
            effects.strikeBonus += Number(mechanicState.verifiedPaths || 0) * 8;
          }
          break;
        case "dsm_006": {
          const coldStacks = Number(mechanicState.coldStacks || 0);
          const effectiveCold = Math.max(0, coldStacks - support);
          effects.damageUp += effectiveCold;
          effects.damageDown += support >= 2 ? 1 : 0;
          if (coldStacks <= 1 && support > 0) effects.strikeBonus += 12;
          break;
        }
        case "dsm_007":
          if (Number(mechanicState.routeMarks || 0) > 0) effects.enemyPowerDown += Number(mechanicState.routeMarks || 0) + Math.min(1, support);
          if (Number(mechanicState.routeMarks || 0) === 0 && Number(mechanicState.windShift || 0) === 1) effects.damageUp += 1;
          if (Number(mechanicState.routeMarks || 0) >= 2) {
            effects.lootMultiplier += 0.1;
            effects.bossGuard += 2;
          }
          break;
        case "dsm_008":
          effects.enemyPowerDown += Math.min(4, Math.floor(Number(mechanicState.lanternChain || 1) / 2)) + Math.min(2, support);
          if (Number(mechanicState.lanternChain || 1) < 3) effects.damageUp += Math.max(0, 2 - support);
          if (Number(mechanicState.lanternChain || 1) >= 4) effects.bossGuard += 2 + Math.floor(Number(mechanicState.lanternChain || 1) / 3);
          effects.strikeBonus += Number(mechanicState.lanternChain || 1) * 8;
          if (Number(mechanicState.lanternChain || 1) >= 7) effects.lootMultiplier += 0.15;
          break;
        default:
          break;
      }
      if (input?.phase === "boss" && mechanicId === "dsm_001" && Number(mechanicState.pillarsLit || 0) < 3) effects.damageUp += 1;
      return effects;
    }

    function dungeonMechanicAdvancePlan(input: DungeonMechanicAdvancePlanInput | null = null): DungeonMechanicAdvancePlan {
      const mechanicId = input?.mechanicId || "";
      const support = Number(input?.support || 0);
      const hiddenRevealStart = Number(input?.hiddenRevealPressureDown || 0) > 0 ? 1 : 0;
      const nextState: DungeonMechanicState = {
        ...(input?.mechanicState || {}),
      };
      switch (mechanicId) {
        case "dsm_001":
          if (nextState.resonanceTurn) {
            nextState.pillarsLit = Math.min(3, mechanicValue(nextState, "pillarsLit") + (support >= 2 ? 2 : 1));
          }
          nextState.resonanceTurn = !nextState.resonanceTurn;
          break;
        case "dsm_002":
          if (mechanicValue(nextState, "waterLevel", 1) === 1 || support >= 2) {
            nextState.sluicesAligned = Math.min(3, mechanicValue(nextState, "sluicesAligned") + 1);
          }
          nextState.waterLevel = (mechanicValue(nextState, "waterLevel", 1) + 1) % 3;
          break;
        case "dsm_003":
          if (mechanicValue(nextState, "cadence", 1) === 1 || support >= 2) {
            nextState.listened = Math.min(3, mechanicValue(nextState, "listened") + 1);
          }
          nextState.cadence = (mechanicValue(nextState, "cadence", 1) + 1) % 3;
          break;
        case "dsm_004":
          nextState.overflow = Math.min(5, mechanicValue(nextState, "overflow") + (support >= 2 ? 1 : 2));
          break;
        case "dsm_005":
          if (support > 0) nextState.verifiedPaths = Math.min(3, mechanicValue(nextState, "verifiedPaths") + 1);
          break;
        case "dsm_006":
          nextState.coldStacks = Math.max(0, Math.min(4, mechanicValue(nextState, "coldStacks") + (support >= 2 ? 0 : 1) - (input?.phase === "boss" && support >= 3 ? 1 : 0)));
          break;
        case "dsm_007":
          if (support > 0) nextState.routeMarks = Math.min(3, mechanicValue(nextState, "routeMarks") + 1);
          nextState.windShift = mechanicValue(nextState, "windShift") ? 0 : 1;
          break;
        case "dsm_008":
          nextState.lanternChain = Math.min(7, mechanicValue(nextState, "lanternChain", 1 + hiddenRevealStart) + 1 + (support >= 2 ? 1 : 0));
          break;
        default:
          break;
      }
      return {
        nextState,
        changed: changedKeys(input?.mechanicState || {}, nextState),
      };
    }

    function dungeonMechanicActionPlan(input: DungeonMechanicActionPlanInput | null = null): DungeonMechanicActionPlan {
      const mechanicId = input?.mechanicId || "";
      const support = Number(input?.support || 0);
      const nextState: DungeonMechanicState = {
        ...(input?.mechanicState || {}),
      };
      let hpDelta = 0;
      switch (mechanicId) {
        case "dsm_001":
          nextState.resonanceTurn = true;
          nextState.pillarsLit = Math.min(3, mechanicValue(nextState, "pillarsLit") + (support >= 2 ? 2 : 1));
          break;
        case "dsm_002":
          nextState.waterLevel = 1;
          nextState.sluicesAligned = Math.min(3, mechanicValue(nextState, "sluicesAligned") + 1 + (support >= 2 ? 1 : 0));
          break;
        case "dsm_003":
          nextState.cadence = 1;
          nextState.listened = Math.min(3, mechanicValue(nextState, "listened") + 1 + (support >= 2 ? 1 : 0));
          break;
        case "dsm_004":
          nextState.overflow = Math.max(0, mechanicValue(nextState, "overflow") - (support >= 2 ? 3 : 2));
          hpDelta = 4 + support;
          break;
        case "dsm_005":
          nextState.verifiedPaths = Math.min(3, mechanicValue(nextState, "verifiedPaths") + 1 + (support >= 2 ? 1 : 0));
          break;
        case "dsm_006":
          nextState.coldStacks = Math.max(0, mechanicValue(nextState, "coldStacks") - (support >= 2 ? 3 : 2));
          hpDelta = 3;
          break;
        case "dsm_007":
          nextState.routeMarks = Math.min(3, mechanicValue(nextState, "routeMarks") + 1 + (support >= 2 ? 1 : 0));
          nextState.windShift = 0;
          break;
        case "dsm_008":
          nextState.lanternChain = Math.min(7, mechanicValue(nextState, "lanternChain", 1) + 2 + (support >= 2 ? 1 : 0));
          break;
        default:
          break;
      }
      const currentHp = input?.currentHp === undefined || input?.currentHp === null ? null : Number(input.currentHp);
      const hpAfter = currentHp === null || !Number.isFinite(currentHp) ? null : Math.min(100, currentHp + hpDelta);
      return {
        nextState,
        changed: changedKeys(input?.mechanicState || {}, nextState),
        hpAfter,
        hpDelta,
      };
    }

    function dungeonExplorePlan(input: DungeonExplorePlanInput | null = null): DungeonExplorePlan {
      const effects = input?.mechanicEffects || null;
      const enemyPower = Math.max(8,
        Number(input?.enemy?.atk || 16)
        + Number(input?.enemy?.def || 6)
        + Number(input?.hazardPressure || 0)
        - Number(input?.spiritPower || 0)
        - Number(input?.mechanicBonus || 0)
        - Number(input?.rotationHazardReduce || 0)
        - Number(input?.rotationPathBonus || 0)
        - Number(input?.hiddenRevealPressureDown || 0)
        - Number(input?.failureInsightPathBonus || 0)
        - Number(input?.failureInsightOverflowRelief || 0)
        - effectValue(effects, "enemyPowerDown"),
      );
      const damage = Math.max(4, Math.round(enemyPower / 4) + effectValue(effects, "damageUp") - effectValue(effects, "damageDown"));
      return { enemyPower, damage };
    }

    function dungeonExploreStatePlan(input: DungeonExploreStatePlanInput | null = null): DungeonExploreStatePlan {
      const damage = finiteNumber(input?.damage, 0);
      const lootCount = finiteNumber(input?.lootCount, 0);
      return {
        hpAfter: Math.max(0, finiteNumber(input?.hp, 0) - damage),
        progressAfter: finiteNumber(input?.progress, 0) + 1,
        turnAfter: finiteNumber(input?.turn, 0) + 1,
        lastEnemyId: input?.enemyId || null,
        combatMoment: damage >= 16 ? "danger" : lootCount > 0 ? "loot" : "steady",
      };
    }

    function dungeonExploreOutcomePlan(input: DungeonExploreOutcomePlanInput | null = null): DungeonExploreOutcomePlan {
      const hp = finiteNumber(input?.hp, 0);
      const floor = finiteNumber(input?.floor, 1);
      const maxFloor = finiteNumber(input?.maxFloor, 1);
      if (hp <= 0) {
        return {
          outcome: "failed",
          finished: true,
          bossReady: false,
          floorAfter: floor,
          staminaAfter: Math.max(25, finiteNumber(input?.stamina, 0) - 12),
          combatMoment: "failed",
        };
      }
      if (floor >= maxFloor) {
        return {
          outcome: "boss_ready",
          finished: false,
          bossReady: true,
          floorAfter: floor,
          staminaAfter: null,
          combatMoment: "boss_ready",
        };
      }
      return {
        outcome: "advance",
        finished: false,
        bossReady: false,
        floorAfter: floor + 1,
        staminaAfter: null,
        combatMoment: null,
      };
    }

    function dungeonLootPlan(input: DungeonLootPlanInput | null = null): DungeonLootPlanEntry[] {
      const pool = input?.pool || [];
      if (pool.length === 0) return [];
      const conditionResults = input?.conditionResults || {};
      const available = pool.filter((entry) => lootConditionPass(entry, conditionResults));
      const weighted = available.length > 0 ? available : pool;
      const totalWeight = weighted.reduce((sum, entry) => sum + Math.max(1, finiteNumber(entry.weight, 1)), 0);
      if (totalWeight <= 0) return [];
      const floor = finiteNumber(input?.floor, 1);
      const day = finiteNumber(input?.day, 0);
      const runSeed = finiteNumber(input?.runSeed, 0);
      const turn = finiteNumber(input?.turn, 0);
      const countMultiplier = finiteNumber(input?.countMultiplier, 1);
      let roll = ((day * 37) + (floor * 19) + (runSeed * 11) + turn) % totalWeight;
      const entry = weighted.find((candidate) => {
        roll -= Math.max(1, finiteNumber(candidate.weight, 1));
        return roll < 0;
      }) || weighted[0];
      if (!entry?.item_id) return [];
      const min = finiteNumber(entry.min_count, 1);
      const max = finiteNumber(entry.max_count, min);
      const baseCount = Math.min(max, min + (floor % Math.max(1, max - min + 1)));
      const count = Math.max(1, Math.ceil(baseCount * countMultiplier));
      return [{ itemId: entry.item_id, count }];
    }

    function dungeonBossExchangePlan(input: DungeonBossExchangePlanInput | null = null): DungeonBossExchangePlan {
      const effects = input?.mechanicEffects || null;
      const bossPressure = Math.max(20, Math.round(Number(input?.boss?.hp_total || 1200) / 90) + Number(input?.boss?.phase_count || 1) * 6);
      const skillPressure = skillImpact(input?.bossSkill || null);
      const supportGuard = input?.supportSkill ? Math.max(2, Math.round(Number(input.supportSkill.effect_param_1 || 1) * 4)) : 0;
      const damage = Math.max(8,
        bossPressure
        + skillPressure
        + Number(input?.hazardPressure || 0)
        - Math.round(Number(input?.spiritPower || 0) / 3)
        - supportGuard
        - Number(input?.rotationBossGuard || 0)
        - Number(input?.failureInsightBossGuard || 0)
        - effectValue(effects, "bossGuard")
        + effectValue(effects, "damageUp")
        - effectValue(effects, "damageDown"),
      );
      const supportStrike = input?.supportSkill?.effect_type === "combat" ? Math.round(Number(input.supportSkill.effect_param_1 || 1) * 90) : 0;
      const baseStrike = 260
        + Number(input?.maxFloor || 0) * 28
        + Math.round(Number(input?.spiritPower || 0) * 7)
        + Number(input?.rotationPathBonus || 0) * 8
        + Number(input?.failureInsightBossStrikeBonus || 0)
        + effectValue(effects, "strikeBonus")
        + supportStrike;
      const shieldAfterSkill = input?.bossSkill?.effect_type === "shield"
        ? Math.max(Number(input?.bossShield || 0), Number(input.bossSkill.effect_param_1 || 0))
        : Number(input?.bossShield || 0);
      const absorbed = Math.min(shieldAfterSkill, Math.round(baseStrike * 0.45));
      const bossShieldAfter = Math.max(0, shieldAfterSkill - absorbed);
      const bossDamage = Math.max(80, baseStrike - absorbed - Number(input?.phase || 1) * 12);
      return {
        bossPressure,
        skillPressure,
        supportGuard,
        damage,
        baseStrike,
        shieldAfterSkill,
        absorbed,
        bossShieldAfter,
        bossDamage,
      };
    }

    function dungeonBossExchangeStatePlan(input: DungeonBossExchangeStatePlanInput | null = null): DungeonBossExchangeStatePlan {
      const hpAfter = Math.max(0, finiteNumber(input?.hp, 0) - finiteNumber(input?.damage, 0));
      const bossHpAfter = Math.max(0, finiteNumber(input?.bossHp, finiteNumber(input?.bossMaxHp, 0)) - finiteNumber(input?.bossDamage, 0));
      const bossShieldAfter = Math.max(0, finiteNumber(input?.bossShieldAfter, 0));
      const turnAfter = finiteNumber(input?.turn, 0) + 1;
      const bossMaxHp = finiteNumber(input?.bossMaxHp, 0);
      const hpPercent = bossMaxHp > 0 ? bossHpAfter / bossMaxHp : 1;
      const bossPhaseAfter = bossPhaseForPercent(input?.bossId || "", hpPercent);
      const phaseBefore = finiteNumber(input?.phaseBefore, bossPhaseAfter);
      const combatMoment = bossHpAfter <= 0
        ? "boss_defeat"
        : hpAfter <= 0
          ? "failed"
          : phaseBefore !== bossPhaseAfter
            ? "phase_shift"
            : "boss_exchange";
      return {
        hpAfter,
        bossHpAfter,
        bossShieldAfter,
        turnAfter,
        bossPhaseAfter,
        combatMoment,
      };
    }

    function dungeonBossClearPlan(input: DungeonBossClearPlanInput | null = null): DungeonBossClearPlan {
      const bossId = input?.bossId || "";
      const bossLoot = [...(input?.bossLoot || [])];
      const guaranteedLoot: DungeonLootPlanEntry[] = [];
      if (bossId === "boss_shixiang_tengmu" && !truthyFlag(input?.hasBaizhiMotherDew)) {
        guaranteedLoot.push({ itemId: "item_special_baicao_mulu", count: 1 });
      }
      if (bossId === "boss_chiyan_xiehou" && !truthyFlag(input?.hasFireCore)) {
        guaranteedLoot.push({ itemId: "item_special_huojing", count: 1 });
      }
      if (bossId === "boss_shiling_mingmu" && !truthyFlag(input?.hasDinghaiItem)) {
        guaranteedLoot.push({ itemId: "item_special_dinghai_shenzhu", count: 1 });
      }
      const lastLoot = [...bossLoot, ...guaranteedLoot];
      return {
        finished: true,
        fameDelta: 5,
        clearAreaId: input?.areaId || "",
        defeatedBossId: bossId,
        guaranteedLoot,
        bossLoot: lastLoot,
        lastLoot,
      };
    }

    function dungeonFailureRewardPlan(input: DungeonFailureRewardPlanInput | null = null): DungeonFailureRewardPlan {
      const outcome = input?.outcome || "";
      const overflowFailure = input?.mechanicId === "dsm_004" && finiteNumber(input?.overflow, 0) >= 4;
      if (outcome === "boss_failed") {
        return {
          shouldRecord: true,
          finished: true,
          failureReason: "boss",
          stampKind: "shard",
          stampAmount: 2,
        };
      }
      if (outcome === "retreat") {
        const shouldRecord = !truthyFlag(input?.finished) && finiteNumber(input?.progress, 0) > 0 && !truthyFlag(input?.alreadyCleared);
        return {
          shouldRecord,
          finished: true,
          failureReason: shouldRecord ? overflowFailure ? "overflow" : "retreat" : "",
          stampKind: "shard",
          stampAmount: shouldRecord ? truthyFlag(input?.bossReady) ? 2 : 1 : 0,
        };
      }
      return {
        shouldRecord: true,
        finished: true,
        failureReason: overflowFailure ? "overflow" : "battle",
        stampKind: "shard",
        stampAmount: overflowFailure ? 2 : finiteNumber(input?.floor, 1) >= 3 ? 2 : 1,
      };
    }

    function dungeonPostBattleSideEffectPlan(input: DungeonPostBattleSideEffectPlanInput | null = null): DungeonPostBattleSideEffectPlan {
      const bossId = input?.bossId || "";
      const storyHooks: string[] = [];
      if (bossId === "boss_shixiang_tengmu") storyHooks.push("herb_valley_baizhi_finish");
      if (bossId === "boss_chiyan_xiehou") storyHooks.push("fire_ruin_finish");
      if (bossId === "boss_shiling_mingmu") storyHooks.push("chapter4_pantao_finale");
      return {
        completionKeys: ["dungeon"],
        seasonalGoal: input?.termId === "term_dongzhi"
          ? {
            category: "seasonal",
            key: "lanternDungeonClears",
            amount: 1,
          }
          : null,
        storyHooks,
        cohabEvent: {
          trigger: "on_dungeon_return",
          areaId: input?.areaId || "",
        },
      };
    }

    return {
      bossSkillsFor,
      bossPhaseForPercent,
      bossSkillForTurn,
      skillImpact,
      spiritCombatSkills,
      spiritCombatBonus,
      dungeonBossMaxHp,
      bossHpPercent,
      dungeonMechanicEffects,
      dungeonMechanicAdvancePlan,
      dungeonMechanicActionPlan,
      dungeonExplorePlan,
      dungeonExploreStatePlan,
      dungeonExploreOutcomePlan,
      dungeonLootPlan,
      dungeonBossExchangePlan,
      dungeonBossExchangeStatePlan,
      dungeonBossClearPlan,
      dungeonFailureRewardPlan,
      dungeonPostBattleSideEffectPlan,
    };
  }
}
