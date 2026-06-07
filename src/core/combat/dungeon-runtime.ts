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

  export interface CombatRuntime {
    bossSkillsFor(bossId?: string | null): CombatRow[];
    bossPhaseForPercent(bossId?: string | null, hpPercent?: number | string | null): number;
    bossSkillForTurn(input?: BossSkillForTurnInput | null): CombatRow | null;
    skillImpact(skill?: CombatRow | null): number;
    spiritCombatSkills(input?: SpiritCombatSkillsInput | null): CombatRow[];
    spiritCombatBonus(input?: SpiritCombatBonusInput | null): number;
    dungeonBossMaxHp(input?: DungeonBossMaxHpInput | null): number;
    bossHpPercent(input?: BossHpPercentInput | null): number;
  }

  function byId(rows: CombatRow[], idField: string, id?: string | null): CombatRow | null {
    if (!id) return null;
    return rows.find((row) => row[idField] === id) || null;
  }

  function clampPercent(value: number): number {
    return Math.max(0, Math.min(1, value));
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

    return {
      bossSkillsFor,
      bossPhaseForPercent,
      bossSkillForTurn,
      skillImpact,
      spiritCombatSkills,
      spiritCombatBonus,
      dungeonBossMaxHp,
      bossHpPercent,
    };
  }
}
