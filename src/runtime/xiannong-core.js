"use strict";
var XiannongCore;
(function (XiannongCore) {
    var Combat;
    (function (Combat) {
        function byId(rows, idField, id) {
            if (!id)
                return null;
            return rows.find((row) => row[idField] === id) || null;
        }
        function clampPercent(value) {
            return Math.max(0, Math.min(1, value));
        }
        function effectValue(effects, key) {
            return Number(effects?.[key] || 0);
        }
        function mechanicValue(state, key, fallback = 0) {
            return Number(state?.[key] ?? fallback);
        }
        function finiteNumber(value, fallback = 0) {
            const parsed = Number(value ?? fallback);
            return Number.isFinite(parsed) ? parsed : fallback;
        }
        function lootConditionPass(entry, conditionResults) {
            const condition = entry.condition_group || "always_true";
            if (!condition || condition === "always_true")
                return true;
            const result = conditionResults[condition];
            return result === true || result === 1 || result === "1" || result === "true";
        }
        function truthyFlag(value) {
            return value === true || value === 1 || value === "1" || value === "true";
        }
        function changedKeys(before, after) {
            const keys = [
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
        function createDungeonRuntime(data) {
            function bossForId(bossId) {
                if (!bossId)
                    return null;
                return data.bossesById?.get(bossId) || byId(data.bosses, "boss_id", bossId);
            }
            function bossSkillsFor(bossId = "") {
                return [...(data.bossSkillsByBoss?.get(bossId || "") || data.bossSkills.filter((skill) => skill.boss_id === bossId))]
                    .sort((a, b) => Number(a.phase_index) - Number(b.phase_index) || Number(a.order_in_phase) - Number(b.order_in_phase));
            }
            function bossPhaseForPercent(bossId = "", hpPercent = 1) {
                const boss = bossForId(bossId);
                const phaseCount = Math.max(1, Number(boss?.phase_count || 1));
                const percent = clampPercent(Number(hpPercent ?? 1));
                if (phaseCount >= 3) {
                    if (percent <= 0.35)
                        return 3;
                    if (percent <= 0.7)
                        return 2;
                    return 1;
                }
                if (phaseCount >= 2 && percent <= 0.5)
                    return 2;
                return 1;
            }
            function bossSkillForTurn(input = null) {
                const bossId = input?.bossId || "";
                const phase = bossPhaseForPercent(bossId, input?.hpPercent ?? 1);
                const skills = bossSkillsFor(bossId).filter((skill) => Number(skill.phase_index) === phase);
                if (skills.length === 0)
                    return null;
                return skills[Math.max(0, Number(input?.turn || 0)) % skills.length];
            }
            function skillImpact(skill = null) {
                if (!skill)
                    return 0;
                const primary = Number(skill.effect_param_1 || 0);
                if (skill.effect_type === "damage")
                    return primary;
                if (skill.effect_type === "spawn_hazard")
                    return primary * 4;
                if (skill.effect_type === "shield")
                    return Math.round(primary / 12);
                return Math.max(0, primary);
            }
            function spiritCombatSkills(input = null) {
                const spirit = input?.spirit || null;
                if (!spirit)
                    return [];
                const direct = data.spiritSkillsBySpirit?.get(spirit.id || "") || data.spiritSkills.filter((skill) => skill.spirit_id === spirit.id);
                const combat = data.spiritSkills.filter((skill) => skill.effect_type === "combat");
                return direct.length > 0 ? [...direct] : combat.slice(0, Number(input?.dungeonClearCount || 0) > 0 ? 2 : 1);
            }
            function spiritCombatBonus(input = null) {
                const spirit = input?.spirit || null;
                const skills = input?.skills || spiritCombatSkills(input);
                const skillBonus = skills.reduce((sum, skill) => {
                    const value = Number(skill.effect_param_1 || 0);
                    return sum + (skill.effect_type === "combat" ? Math.max(3, Math.round(value * 6)) : 1);
                }, 0);
                return skillBonus + (spirit ? Math.max(0, Number(spirit.jobLevels?.expedition || 0) * 3) : 0);
            }
            function dungeonBossMaxHp(input = null) {
                const boss = input?.boss || bossForId(input?.bossId || "");
                return Math.max(300, Number(boss?.hp_total || input?.fallback || 1200));
            }
            function bossHpPercent(input = null) {
                const maxHp = Number(input?.bossMaxHp || input?.run?.bossMaxHp || dungeonBossMaxHp(input));
                if (maxHp <= 0)
                    return 1;
                return clampPercent(Number(input?.bossHp ?? input?.run?.bossHp ?? maxHp) / maxHp);
            }
            function dungeonMechanicEffects(input = null) {
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
                if (!mechanicState || !mechanicId)
                    return effects;
                switch (mechanicId) {
                    case "dsm_001":
                        if (mechanicState.resonanceTurn) {
                            effects.enemyPowerDown += 2 + support;
                            if (Number(mechanicState.pillarsLit || 0) >= 2)
                                effects.strikeBonus += 16;
                        }
                        else {
                            effects.damageUp += Math.max(1, 2 - support);
                        }
                        if (Number(mechanicState.pillarsLit || 0) >= 3)
                            effects.bossGuard += 3 + Math.min(2, support);
                        break;
                    case "dsm_002":
                        if (Number(mechanicState.waterLevel || 0) === 0) {
                            effects.damageUp += Math.max(0, 1 - Math.min(1, support));
                            effects.enemyPowerDown += support > 0 ? 1 : 0;
                        }
                        else if (Number(mechanicState.waterLevel || 0) === 1) {
                            effects.enemyPowerDown += 2 + support;
                            effects.strikeBonus += 10;
                        }
                        else {
                            effects.damageUp += support >= 2 ? 0 : 2;
                            effects.lootMultiplier += 0.12;
                        }
                        if (Number(mechanicState.sluicesAligned || 0) >= 3)
                            effects.bossGuard += 3;
                        break;
                    case "dsm_003":
                        if (Number(mechanicState.cadence || 0) === 1 || support >= 2)
                            effects.enemyPowerDown += 2 + support;
                        if (Number(mechanicState.cadence || 0) === 2 && support === 0)
                            effects.damageUp += 2;
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
                        if (support === 0 && Number(mechanicState.verifiedPaths || 0) === 0)
                            effects.damageUp += 1;
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
                        if (coldStacks <= 1 && support > 0)
                            effects.strikeBonus += 12;
                        break;
                    }
                    case "dsm_007":
                        if (Number(mechanicState.routeMarks || 0) > 0)
                            effects.enemyPowerDown += Number(mechanicState.routeMarks || 0) + Math.min(1, support);
                        if (Number(mechanicState.routeMarks || 0) === 0 && Number(mechanicState.windShift || 0) === 1)
                            effects.damageUp += 1;
                        if (Number(mechanicState.routeMarks || 0) >= 2) {
                            effects.lootMultiplier += 0.1;
                            effects.bossGuard += 2;
                        }
                        break;
                    case "dsm_008":
                        effects.enemyPowerDown += Math.min(4, Math.floor(Number(mechanicState.lanternChain || 1) / 2)) + Math.min(2, support);
                        if (Number(mechanicState.lanternChain || 1) < 3)
                            effects.damageUp += Math.max(0, 2 - support);
                        if (Number(mechanicState.lanternChain || 1) >= 4)
                            effects.bossGuard += 2 + Math.floor(Number(mechanicState.lanternChain || 1) / 3);
                        effects.strikeBonus += Number(mechanicState.lanternChain || 1) * 8;
                        if (Number(mechanicState.lanternChain || 1) >= 7)
                            effects.lootMultiplier += 0.15;
                        break;
                    default:
                        break;
                }
                if (input?.phase === "boss" && mechanicId === "dsm_001" && Number(mechanicState.pillarsLit || 0) < 3)
                    effects.damageUp += 1;
                return effects;
            }
            function dungeonMechanicAdvancePlan(input = null) {
                const mechanicId = input?.mechanicId || "";
                const support = Number(input?.support || 0);
                const hiddenRevealStart = Number(input?.hiddenRevealPressureDown || 0) > 0 ? 1 : 0;
                const nextState = {
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
                        if (support > 0)
                            nextState.verifiedPaths = Math.min(3, mechanicValue(nextState, "verifiedPaths") + 1);
                        break;
                    case "dsm_006":
                        nextState.coldStacks = Math.max(0, Math.min(4, mechanicValue(nextState, "coldStacks") + (support >= 2 ? 0 : 1) - (input?.phase === "boss" && support >= 3 ? 1 : 0)));
                        break;
                    case "dsm_007":
                        if (support > 0)
                            nextState.routeMarks = Math.min(3, mechanicValue(nextState, "routeMarks") + 1);
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
            function dungeonMechanicActionPlan(input = null) {
                const mechanicId = input?.mechanicId || "";
                const support = Number(input?.support || 0);
                const nextState = {
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
            function dungeonExplorePlan(input = null) {
                const effects = input?.mechanicEffects || null;
                const enemyPower = Math.max(8, Number(input?.enemy?.atk || 16)
                    + Number(input?.enemy?.def || 6)
                    + Number(input?.hazardPressure || 0)
                    - Number(input?.spiritPower || 0)
                    - Number(input?.mechanicBonus || 0)
                    - Number(input?.rotationHazardReduce || 0)
                    - Number(input?.rotationPathBonus || 0)
                    - Number(input?.hiddenRevealPressureDown || 0)
                    - Number(input?.failureInsightPathBonus || 0)
                    - Number(input?.failureInsightOverflowRelief || 0)
                    - effectValue(effects, "enemyPowerDown"));
                const damage = Math.max(4, Math.round(enemyPower / 4) + effectValue(effects, "damageUp") - effectValue(effects, "damageDown"));
                return { enemyPower, damage };
            }
            function dungeonExploreStatePlan(input = null) {
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
            function dungeonExploreOutcomePlan(input = null) {
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
            function dungeonLootPlan(input = null) {
                const pool = input?.pool || [];
                if (pool.length === 0)
                    return [];
                const conditionResults = input?.conditionResults || {};
                const available = pool.filter((entry) => lootConditionPass(entry, conditionResults));
                const weighted = available.length > 0 ? available : pool;
                const totalWeight = weighted.reduce((sum, entry) => sum + Math.max(1, finiteNumber(entry.weight, 1)), 0);
                if (totalWeight <= 0)
                    return [];
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
                if (!entry?.item_id)
                    return [];
                const min = finiteNumber(entry.min_count, 1);
                const max = finiteNumber(entry.max_count, min);
                const baseCount = Math.min(max, min + (floor % Math.max(1, max - min + 1)));
                const count = Math.max(1, Math.ceil(baseCount * countMultiplier));
                return [{ itemId: entry.item_id, count }];
            }
            function dungeonBossExchangePlan(input = null) {
                const effects = input?.mechanicEffects || null;
                const bossPressure = Math.max(20, Math.round(Number(input?.boss?.hp_total || 1200) / 90) + Number(input?.boss?.phase_count || 1) * 6);
                const skillPressure = skillImpact(input?.bossSkill || null);
                const supportGuard = input?.supportSkill ? Math.max(2, Math.round(Number(input.supportSkill.effect_param_1 || 1) * 4)) : 0;
                const damage = Math.max(8, bossPressure
                    + skillPressure
                    + Number(input?.hazardPressure || 0)
                    - Math.round(Number(input?.spiritPower || 0) / 3)
                    - supportGuard
                    - Number(input?.rotationBossGuard || 0)
                    - Number(input?.failureInsightBossGuard || 0)
                    - effectValue(effects, "bossGuard")
                    + effectValue(effects, "damageUp")
                    - effectValue(effects, "damageDown"));
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
            function dungeonBossExchangeStatePlan(input = null) {
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
            function dungeonBossClearPlan(input = null) {
                const bossId = input?.bossId || "";
                const bossLoot = [...(input?.bossLoot || [])];
                const guaranteedLoot = [];
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
            function dungeonFailureRewardPlan(input = null) {
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
            function dungeonFailureInsightPlan(input = null) {
                const reason = input?.reason || "battle";
                const previous = input?.previous || {};
                const run = input?.run || null;
                const mechanicId = input?.mechanicId || input?.mechanic?.dungeon_id || "";
                const bossRelated = reason === "boss" || truthyFlag(run?.bossReady);
                const bossId = input?.bossId || "";
                const bossPercent = bossHpPercent({ run, bossId, bossMaxHp: run?.bossMaxHp });
                const failures = Math.max(0, Number(previous.failures || 0)) + 1;
                const revealedFloor = Math.max(Number(previous.revealedFloor || 0), Number(run?.floor || input?.floorStart || input?.dungeon?.floor_start || 1));
                const bossPhaseSeen = Math.max(Number(previous.bossPhaseSeen || 0), bossRelated ? Number(run?.bossPhase || 1) : 0);
                const bossPercentNow = Math.ceil(bossPercent * 100);
                const previousBestPercent = Number(previous.bossBestPercent || 100);
                const bossBestPercent = bossRelated ? Math.min(previousBestPercent, bossPercentNow) : previousBestPercent;
                const previousSkillIds = Array.isArray(previous.bossSkillIds) ? previous.bossSkillIds : [];
                const lastBossSkillId = String(run?.lastBossSkillId || "");
                const bossSkillIds = [...new Set([...previousSkillIds, lastBossSkillId]
                        .map((skillId) => String(skillId || ""))
                        .filter(Boolean))]
                    .slice(-5);
                const nextBossSkill = truthyFlag(run?.bossReady)
                    ? bossSkillForTurn({ bossId, turn: Number(run?.turn || 0), hpPercent: bossPercent })
                    : null;
                const bossFamiliarity = bossRelated
                    ? Math.min(5, Math.max(Number(previous.bossFamiliarity || 0), Math.ceil((100 - bossBestPercent) / 20) + Math.max(0, bossPhaseSeen - 1) + Math.min(1, bossSkillIds.length)))
                    : Number(previous.bossFamiliarity || 0);
                const basePathBonus = Math.min(3, 1 + Math.floor(failures / 2));
                const pathBonus = Math.max(Number(previous.pathBonus || 0), reason === "boss" ? Math.max(1, basePathBonus - 1) : basePathBonus);
                const overflowRelief = Math.max(Number(previous.overflowRelief || 0), mechanicId === "dsm_004" && Number(run?.mechanicState?.overflow || 0) >= 4 ? 2 : 0);
                const bossGuard = Math.max(Number(previous.bossGuard || 0), bossPhaseSeen > 0 ? Math.min(4, bossPhaseSeen + Math.floor(bossFamiliarity / 2)) : 0);
                const bossStrikeBonus = Math.max(Number(previous.bossStrikeBonus || 0), bossFamiliarity > 0 ? Math.min(90, 18 * bossFamiliarity) : 0);
                return {
                    key: input?.key || "",
                    dungeonId: input?.dungeonId || input?.dungeon?.area_id || "",
                    mechanicId,
                    failures,
                    lastReason: reason,
                    unlockedDay: Number(input?.day || 0),
                    revealedFloor,
                    pathBonus,
                    bossPhaseSeen,
                    bossGuard,
                    bossStrikeBonus,
                    bossFamiliarity,
                    bossBestPercent,
                    bossSkillIds,
                    bossNextSkillId: nextBossSkill?.boss_skill_id || "",
                    overflowRelief,
                };
            }
            function dungeonPostBattleSideEffectPlan(input = null) {
                const bossId = input?.bossId || "";
                const storyHooks = [];
                if (bossId === "boss_shixiang_tengmu")
                    storyHooks.push("herb_valley_baizhi_finish");
                if (bossId === "boss_chiyan_xiehou")
                    storyHooks.push("fire_ruin_finish");
                if (bossId === "boss_shiling_mingmu")
                    storyHooks.push("chapter4_pantao_finale");
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
                dungeonFailureInsightPlan,
                dungeonPostBattleSideEffectPlan,
            };
        }
        Combat.createDungeonRuntime = createDungeonRuntime;
    })(Combat = XiannongCore.Combat || (XiannongCore.Combat = {}));
})(XiannongCore || (XiannongCore = {}));
var XiannongCore;
(function (XiannongCore) {
    var Data;
    (function (Data) {
        function globalValue(name) {
            return globalThis[name];
        }
        function isObject(value) {
            return typeof value === "object" && value !== null;
        }
        function isRuntimeDataFile(value) {
            if (!isObject(value))
                return false;
            return typeof value.key === "string"
                && typeof value.path === "string"
                && Array.isArray(value.columns)
                && Array.isArray(value.rows);
        }
        function isRuntimeDataManifest(value) {
            if (!isObject(value))
                return false;
            if (value.source !== "csv" || !isObject(value.files))
                return false;
            return Object.values(value.files).every(isRuntimeDataFile);
        }
        function cloneRows(rows) {
            return rows.map((row) => ({ ...row }));
        }
        function createRuntimeDataLoader(options = {}) {
            const manifestPath = options.manifestPath || "runtime-data/runtime-data.json";
            const embeddedGlobal = options.embeddedGlobal || "XIANNONG_EMBEDDED_RUNTIME_DATA";
            let manifestPromise = null;
            let lastMode = "idle";
            let lastHash = "";
            let lastError = "";
            async function loadManifest() {
                if (manifestPromise)
                    return manifestPromise;
                const embedded = globalValue(embeddedGlobal);
                if (isRuntimeDataManifest(embedded)) {
                    lastMode = "embedded-json";
                    lastHash = embedded.contentHash || "";
                    manifestPromise = Promise.resolve(embedded);
                    return manifestPromise;
                }
                manifestPromise = fetch(manifestPath)
                    .then(async (response) => {
                    if (!response.ok)
                        throw new Error(`Cannot load runtime data: ${manifestPath}`);
                    const manifest = await response.json();
                    if (!isRuntimeDataManifest(manifest)) {
                        throw new Error(`Invalid runtime data manifest: ${manifestPath}`);
                    }
                    lastMode = "runtime-json";
                    lastHash = manifest.contentHash || "";
                    return manifest;
                })
                    .catch((error) => {
                    lastMode = "csv-fallback";
                    lastError = error instanceof Error ? error.message : String(error);
                    return null;
                });
                return manifestPromise;
            }
            return {
                async loadTable(key, csvPath, fallback) {
                    const manifest = await loadManifest();
                    const file = manifest?.files[key];
                    if (file && file.path === csvPath)
                        return cloneRows(file.rows);
                    lastMode = "csv-fallback";
                    return fallback();
                },
                status() {
                    return {
                        mode: lastMode,
                        contentHash: lastHash,
                        error: lastError,
                    };
                },
            };
        }
        Data.createRuntimeDataLoader = createRuntimeDataLoader;
    })(Data = XiannongCore.Data || (XiannongCore.Data = {}));
})(XiannongCore || (XiannongCore = {}));
var XiannongCore;
(function (XiannongCore) {
    var Farming;
    (function (Farming) {
        function createFarmingRuntime(data, hooks) {
            function splitTags(value) {
                return hooks.splitTags(value || "");
            }
            function cropForHarvestTarget(targetId = "") {
                if (!targetId)
                    return null;
                return data.cropsById?.get(targetId)
                    || data.cropsBySeed?.get(targetId)
                    || data.crops.find((crop) => crop.crop_id === targetId || crop.seed_item_id === targetId || crop.output_item_id === targetId)
                    || null;
            }
            function cropSolarAffinity(crop = null, plot = null, term = null, weather = null) {
                if (!crop)
                    return { state: "empty", label: "", detail: "" };
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
                ].filter((tag) => Boolean(tag));
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
            function cropSolarYieldBonus(crop = null, plot = null, affinity = cropSolarAffinity(crop, plot)) {
                if (!crop || !affinity || affinity.state === "empty")
                    return { amount: 0, text: "" };
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
            function seedProjectedHarvestSpec(crop = null, plot = null) {
                if (!crop)
                    return { count: 1, affinity: null, yieldBonus: { amount: 0, text: "" } };
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
            function harvestQualitySpec(crop = null, plot = null, amount = 1, affinity = cropSolarAffinity(crop, plot)) {
                if (!crop)
                    return { score: 0, tier: 1, label: "Normal", qualityItemId: "", qualityCount: 0 };
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
            function cropWorldGrowthVisualSpec(crop = null, plot = null, plotIndex = 0, day = 1) {
                if (!crop || !plot?.cropId)
                    return null;
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
            function nightWeatherGrowthPlan(input) {
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
            function nightCropGrowthPlan(input) {
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
                const careSource = manualWatered
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
            function nightCropStatePlan(input) {
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
            function harvestYieldPlan(input) {
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
            function harvestStatePlan(input) {
                return {
                    cropId: null,
                    seedItemId: null,
                    plantedDay: null,
                    watered: false,
                    mature: false,
                };
            }
            function harvestProgressPlan(input) {
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
            function harvestQualityRewardPlan(input) {
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
            function harvestRouteAccountingPlan(input) {
                const route = input.route || null;
                if (!route)
                    return { lastHarvestUseRoute: null, hasRoute: false };
                const count = Math.max(1, Number(route.count || input.count || 1));
                const itemId = String(route.itemId || input.itemId || "");
                const lastHarvestUseRoute = {
                    ...route,
                    itemId,
                    count,
                    day: Number(route.day || input.day || 1),
                    ready: Boolean(route.ready),
                };
                return {
                    lastHarvestUseRoute,
                    hasRoute: Boolean(itemId),
                };
            }
            function harvestRouteSelectionPlan(input) {
                const candidates = (input.candidates || []).filter((route) => Boolean(route));
                const route = candidates[0] || input.fallbackRoute || null;
                if (!route)
                    return { route: null, candidateCount: candidates.length };
                return {
                    route: {
                        ...route,
                        itemId: String(route.itemId || input.itemId || ""),
                        count: Math.max(1, Number(route.count || input.count || 1)),
                        day: Number(route.day || input.day || 1),
                        ready: Boolean(route.ready),
                    },
                    candidateCount: candidates.length,
                };
            }
            function plantStatePlan(input) {
                const crop = input.crop || {};
                const cropId = String(crop.crop_id || "");
                const seedItemId = String(crop.seed_item_id || input.seedItemId || "");
                const plantedDay = Number(input.day || 1);
                const firstSeeded = Boolean(input.firstSeeded);
                const plan = {
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
            function waterStatePlan(input) {
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
                harvestRouteAccountingPlan,
                harvestRouteSelectionPlan,
                plantStatePlan,
                waterStatePlan,
            };
        }
        Farming.createFarmingRuntime = createFarmingRuntime;
    })(Farming = XiannongCore.Farming || (XiannongCore.Farming = {}));
})(XiannongCore || (XiannongCore = {}));
var XiannongCore;
(function (XiannongCore) {
    var Npc;
    (function (Npc) {
        function createNpcRuntime() {
            function favorLevel(value = 0) {
                const favor = Number(value || 0);
                if (favor >= 100)
                    return 5;
                if (favor >= 70)
                    return 4;
                if (favor >= 45)
                    return 3;
                if (favor >= 20)
                    return 2;
                if (favor >= 5)
                    return 1;
                return 0;
            }
            function claimableFavorRewards(input) {
                const npcId = String(input.npcId || "");
                const level = favorLevel(input.favorValue || 0);
                const claimed = new Set(input.claimedRewardIds || []);
                const rewards = (input.rewards || []).filter((reward) => {
                    if (npcId && reward.npc_id !== npcId)
                        return false;
                    if (Number(reward.favor_level || 0) > level)
                        return false;
                    if (claimed.has(String(reward.reward_id || "")))
                        return false;
                    return true;
                });
                return {
                    level,
                    rewards,
                    rewardIds: rewards.map((reward) => String(reward.reward_id || "")).filter(Boolean),
                };
            }
            function memoryId(memory = null) {
                return String(memory?.id || "");
            }
            function rememberedMemorySet(input) {
                return new Set((input.rememberedMemoryIds || []).map((id) => String(id || "")).filter(Boolean));
            }
            function interactionTotal(counts = null) {
                const greet = Number(counts?.greet || 0);
                const errand = Number(counts?.errand || 0);
                const gift = Number(counts?.gift || 0);
                return Math.max(Number(counts?.total || 0), greet + errand + gift);
            }
            function nextRelationshipMemory(input) {
                const remembered = rememberedMemorySet(input);
                const memory = (input.memories || []).find((entry) => !remembered.has(memoryId(entry))) || null;
                return {
                    memory,
                    memoryId: memoryId(memory),
                };
            }
            function relationshipMemoryProgress(input) {
                const next = nextRelationshipMemory(input).memory;
                const level = favorLevel(input.favorValue || 0);
                const interactions = interactionTotal(input.counts);
                if (!next) {
                    return {
                        level,
                        interactions,
                        next: null,
                        nextId: "",
                        needFavor: 0,
                        needInteractions: 0,
                        ready: false,
                        complete: true,
                    };
                }
                const needFavor = Math.max(0, Number(next.level || 0) - level);
                const needInteractions = Math.max(0, Number(next.interactions || 0) - interactions);
                return {
                    level,
                    interactions,
                    next,
                    nextId: memoryId(next),
                    needFavor,
                    needInteractions,
                    ready: needFavor <= 0 && needInteractions <= 0,
                    complete: false,
                };
            }
            function claimableRelationshipMemories(input) {
                const remembered = rememberedMemorySet(input);
                const level = favorLevel(input.favorValue || 0);
                const interactions = interactionTotal(input.counts);
                const memories = (input.memories || []).filter((memory) => {
                    if (remembered.has(memoryId(memory)))
                        return false;
                    if (level < Number(memory.level || 0))
                        return false;
                    if (interactions < Number(memory.interactions || 0))
                        return false;
                    return true;
                });
                return {
                    level,
                    interactions,
                    memories,
                    memoryIds: memories.map((memory) => memoryId(memory)).filter(Boolean),
                };
            }
            function relationshipMemoryWritePlan(input) {
                const npcId = String(input.npcId || "");
                const memory = input.memory || null;
                const id = memoryId(memory);
                if (!npcId || !memory || !id) {
                    return {
                        canWrite: false,
                        memoryId: id,
                        entry: null,
                        focus: null,
                        dialogue: null,
                    };
                }
                const day = Number(input.day || 0);
                const npcName = String(input.npcName || npcId);
                const interactions = Math.max(0, Number(input.interactions || 0));
                const createdAt = Number(input.createdAt || 0);
                const entry = {
                    day,
                    npcId,
                    npcName,
                    memoryId: id,
                    level: memory.level,
                    title: memory.title,
                    summary: memory.summary,
                    line: memory.line,
                    interactions,
                };
                return {
                    canWrite: true,
                    memoryId: id,
                    entry,
                    focus: {
                        key: `${day}:${npcId}:${id}:memory_new_page`,
                        day,
                        npcId,
                        memoryId: id,
                        nodeKey: "memory",
                        source: "unlock",
                        createdAt,
                    },
                    dialogue: {
                        speakerId: npcId,
                        speaker: npcName,
                        text: entry.line,
                        groupId: `town_life_memory_${id}`,
                        lineOrder: 0,
                    },
                };
            }
            function schedulePriority(schedule = null, context = {}) {
                const termMatch = Boolean(schedule?.solar_term && schedule.solar_term === context.termId);
                const weatherMatch = Boolean(schedule?.weather_tag && (schedule.weather_tag === context.weatherId || schedule.weather_tag === context.disasterTag));
                const seasonMatch = Boolean(schedule?.season && schedule.season === context.season);
                const droughtMatch = Boolean(context.droughtActive && String(schedule?.action_param || "").includes("drought"));
                const festival = schedule?.action_type === "festival";
                return {
                    score: (termMatch ? 8 : 0) + (weatherMatch ? 6 : 0) + (seasonMatch ? 3 : 0) + (droughtMatch ? 12 : 0) + (festival ? 4 : 0),
                    termMatch,
                    weatherMatch,
                    seasonMatch,
                    droughtMatch,
                    festival,
                };
            }
            function scheduleMatchesNow(schedule = null, context = {}) {
                if (!schedule) {
                    return {
                        matches: false,
                        seasonMatch: false,
                        termMatch: false,
                        weatherMatch: false,
                        timeMatch: false,
                    };
                }
                const season = schedule.season || "all";
                const solarTerm = schedule.solar_term || "all";
                const weatherTag = schedule.weather_tag || "all";
                const minute = Number(context.minute || 0);
                const seasonMatch = season === "all" || season === context.season;
                const termMatch = solarTerm === "all" || solarTerm === context.termId;
                const weatherMatch = weatherTag === "all" || weatherTag === context.weatherId || weatherTag === context.disasterTag;
                const timeMatch = minute >= Number(schedule.time_start || 0) && minute < Number(schedule.time_end || 1440);
                return {
                    matches: seasonMatch && termMatch && weatherMatch && timeMatch,
                    seasonMatch,
                    termMatch,
                    weatherMatch,
                    timeMatch,
                };
            }
            return {
                favorLevel,
                claimableFavorRewards,
                nextRelationshipMemory,
                relationshipMemoryProgress,
                claimableRelationshipMemories,
                relationshipMemoryWritePlan,
                schedulePriority,
                scheduleMatchesNow,
            };
        }
        Npc.createNpcRuntime = createNpcRuntime;
    })(Npc = XiannongCore.Npc || (XiannongCore.Npc = {}));
})(XiannongCore || (XiannongCore = {}));
var XiannongCore;
(function (XiannongCore) {
    var Persistence;
    (function (Persistence) {
        function globalValue(name) {
            return globalThis[name];
        }
        function isObject(value) {
            return typeof value === "object" && value !== null;
        }
        function asDesktopBridge(value) {
            if (!isObject(value))
                return null;
            if (typeof value.writeProfile !== "function" && typeof value.readProfile !== "function")
                return null;
            return value;
        }
        function compactJson(payload) {
            return typeof payload === "string" ? payload : JSON.stringify(payload);
        }
        function prettyJson(payload) {
            return typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
        }
        function createSaveRuntime(options = {}) {
            const bridgeName = options.desktopBridgeName || "XiannongStorage";
            const browserStorage = options.localStorage
                || (globalValue("localStorage") ?? null);
            function desktopBridge() {
                return asDesktopBridge(globalValue(bridgeName));
            }
            return {
                writeBrowserSlot(key, payload) {
                    const raw = compactJson(payload);
                    if (!browserStorage) {
                        return {
                            ok: false,
                            adapter: "browser-localStorage",
                            path: key,
                            error: "localStorage unavailable",
                        };
                    }
                    browserStorage.setItem(key, raw);
                    return {
                        ok: true,
                        adapter: "browser-localStorage",
                        path: key,
                        bytes: raw.length,
                        updatedAt: new Date().toISOString(),
                    };
                },
                readBrowserSlot(key) {
                    return browserStorage?.getItem(key) ?? null;
                },
                async writeDesktopProfile(profileId, payload) {
                    const bridge = desktopBridge();
                    if (!bridge?.writeProfile) {
                        return {
                            ok: false,
                            adapter: "browser-localStorage",
                            path: profileId,
                            error: "desktop JSON save bridge unavailable",
                        };
                    }
                    try {
                        const raw = prettyJson(payload);
                        return await bridge.writeProfile(profileId, raw);
                    }
                    catch (error) {
                        return {
                            ok: false,
                            adapter: bridge.adapterId || bridge.mode || "desktop-json-save",
                            path: profileId,
                            error: error instanceof Error ? error.message : String(error),
                        };
                    }
                },
                async readDesktopProfile(profileId) {
                    const bridge = desktopBridge();
                    if (!bridge?.readProfile) {
                        return {
                            ok: false,
                            adapter: "browser-localStorage",
                            path: profileId,
                            missing: true,
                            error: "desktop JSON save bridge unavailable",
                        };
                    }
                    try {
                        return await bridge.readProfile(profileId);
                    }
                    catch (error) {
                        return {
                            ok: false,
                            adapter: bridge.adapterId || bridge.mode || "desktop-json-save",
                            path: profileId,
                            error: error instanceof Error ? error.message : String(error),
                        };
                    }
                },
                bridgeAvailable() {
                    return Boolean(desktopBridge());
                },
                adapterLabel() {
                    const bridge = desktopBridge();
                    return bridge?.adapterId || bridge?.mode || "browser-localStorage";
                },
            };
        }
        Persistence.createSaveRuntime = createSaveRuntime;
    })(Persistence = XiannongCore.Persistence || (XiannongCore.Persistence = {}));
})(XiannongCore || (XiannongCore = {}));
var XiannongCore;
(function (XiannongCore) {
    var Quests;
    (function (Quests) {
        function setHas(set, value) {
            return Boolean(value && set?.has(value));
        }
        function numberMapValue(map, key) {
            return Number(map?.[key] || 0);
        }
        function hasItem(state, itemId, count) {
            return numberMapValue(state.inventory, itemId) >= count;
        }
        function orderedSteps(map, questId) {
            return [...(map.get(questId) || [])].sort((a, b) => Number(a.step_index || 0) - Number(b.step_index || 0));
        }
        function createQuestRuntime(state, data, constants, hooks) {
            function questStepsFor(quest, side = false) {
                if (!quest?.quest_id)
                    return [];
                return orderedSteps(side ? data.sideQuestStepsByQuest : data.questStepsByQuest, quest.quest_id);
            }
            function stepProgress(step) {
                const target = step.target_id;
                const count = Number(step.target_count || 1);
                if (step.objective_type === "collect") {
                    if (target === "item_gold_generic")
                        return Math.min(count, Number(state.gold || 0));
                    const inventoryCount = numberMapValue(state.inventory, target);
                    const cumulativeCount = numberMapValue(state.harvestCounts, `collect_${target}`);
                    return Math.min(count, Math.max(inventoryCount, cumulativeCount));
                }
                if (step.objective_type === "harvest") {
                    const harvested = numberMapValue(state.harvestCounts, target);
                    const inventoryFallback = numberMapValue(state.inventory, target);
                    return Math.min(count, Math.max(harvested, inventoryFallback));
                }
                if (step.objective_type === "plant") {
                    const crop = data.cropsBySeed.get(target);
                    const planted = numberMapValue(state.harvestCounts, `plant_${target}`);
                    const livePlots = (state.plots || []).filter((plot) => plot.seedItemId === target || plot.cropId === crop?.crop_id).length;
                    const pantaoFlag = target === constants.chapter4PantaoSeedId && setHas(state.completed, constants.chapter4PantaoPlantedFlag)
                        ? count
                        : 0;
                    const firstPlantProxy = target !== constants.chapter4PantaoSeedId && setHas(state.completed, "plant") ? count : 0;
                    return Math.min(count, Math.max(planted, livePlots, pantaoFlag, firstPlantProxy));
                }
                if (step.objective_type === "sleep")
                    return Number(state.day || 0) > 1 ? count : 0;
                if (step.objective_type === "favor") {
                    return Math.min(count, hooks.favorLevel(numberMapValue(state.npcFavor, target)));
                }
                if (step.objective_type === "talk") {
                    if ((state.activeDialogue || []).some((line) => line.speaker === hooks.npcName(target)))
                        return count;
                    return (state.missionDone?.size || 0) > 0 || numberMapValue(state.npcFavor, target) > 0 ? count : 0;
                }
                if (step.objective_type === "enter_area") {
                    if (target === constants.chapter4DroughtFlag)
                        return hooks.chapter4DroughtActive() ? count : 0;
                    if (target === "area_town_main")
                        return (state.missionDone?.size || 0) > 0 || setHas(state.completed, "shop") ? count : 0;
                    if (setHas(state.completed, target))
                        return count;
                    if (target.includes("dungeon") || target.includes("mine"))
                        return setHas(state.completed, "dungeon_enter") ? count : 0;
                    return 0;
                }
                if (step.objective_type === "build")
                    return setHas(state.builtBuildings, target) ? count : 0;
                if (step.objective_type === "craft") {
                    if (numberMapValue(state.inventory, target))
                        return Math.min(count, numberMapValue(state.inventory, target));
                    return setHas(state.completed, "craft") ? count : 0;
                }
                if (step.objective_type === "sell") {
                    if (target.startsWith("order_"))
                        return setHas(state.completedOrders, target) ? count : 0;
                    if (target === "item_shop_category_3")
                        return Math.min(count, Number(state.shopStats?.soldCount || 0));
                    if (target === "item_shop_sales_total")
                        return Math.min(count, Number(state.shopStats?.sales || 0));
                    if (target.startsWith("item_shop_sales_total_"))
                        return Math.min(count, Number(state.shopStats?.sales || 0));
                    return Math.min(count, numberMapValue(state.shopStats?.itemSales, target));
                }
                if (step.objective_type === "defeat") {
                    if (target.startsWith("boss_"))
                        return setHas(state.defeatedBosses, target) ? count : 0;
                    return Math.min(count, (state.resolvedRisks?.size || 0) + (state.dungeonClears?.size || 0));
                }
                return 0;
            }
            function questProgress(quest, side = false) {
                const steps = questStepsFor(quest, side);
                const done = steps.filter((step) => stepProgress(step) >= Number(step.target_count || 1)).length;
                return { steps, done, total: steps.length };
            }
            function questDoneBySpecialCase(questId) {
                if (questId === constants.baizhiQuestId)
                    return hooks.baizhiChapterFinished();
                if (questId === constants.spiritManorQuestId) {
                    return setHas(state.builtBuildings, constants.spiritManorBuildingId) || setHas(state.completed, "spirit_manor_built");
                }
                if (questId === constants.factionOrderQuestId) {
                    return setHas(state.completed, "chapter_3_complete") || setHas(state.defeatedBosses, constants.fireRuinBossId);
                }
                if (questId === constants.chapter4DroughtQuestId) {
                    return setHas(state.completed, constants.chapter4DroughtReliefDoneFlag)
                        || setHas(state.completed, `${constants.chapter4DroughtOrderId}_delivered`)
                        || setHas(state.completedOrders, constants.chapter4DroughtOrderId);
                }
                if (questId === constants.chapter4LuTruthQuestId) {
                    return setHas(state.completed, constants.chapter4FinalNestUnlockFlag) || hasItem(state, constants.chapter4DinghaiItemId, 1);
                }
                if (questId === constants.chapter4PantaoQuestId) {
                    return hooks.year2Unlocked() || setHas(state.completed, "main_story_complete") || setHas(state.completed, "final_banquet_complete");
                }
                return false;
            }
            function mainStoryQuestDone(quest) {
                if (!quest?.quest_id)
                    return false;
                const progress = questProgress(quest);
                const allStepsDone = progress.total > 0 && progress.done >= progress.total;
                const demoMissionDone = (constants.demoMissionIds || []).includes(quest.quest_id)
                    && setHas(state.missionDone, quest.quest_id);
                return Boolean(setHas(state.claimedQuestRewards, quest.quest_id)
                    || setHas(state.completed, quest.quest_id)
                    || allStepsDone
                    || demoMissionDone
                    || questDoneBySpecialCase(quest.quest_id));
            }
            function mainStoryQuestStarted(quest) {
                if (!quest?.quest_id)
                    return false;
                const progress = questProgress(quest);
                return mainStoryQuestDone(quest)
                    || progress.done > 0
                    || setHas(state.missionDone, quest.quest_id)
                    || setHas(state.completed, `quest_unlock_${quest.quest_id}`)
                    || setHas(state.triggeredEvents, String(quest.quest_id || "").replace("quest_", "event_"));
            }
            function progressForQuest(questId, side = false) {
                const quest = side
                    ? data.sideQuests.find((entry) => entry.quest_id === questId)
                    : data.quests.find((entry) => entry.quest_id === questId);
                if (!quest)
                    return null;
                const progress = questProgress(quest, side);
                const done = progress.total > 0 && progress.done >= progress.total;
                const started = progress.done > 0
                    || setHas(state.missionDone, questId)
                    || setHas(state.completed, questId)
                    || setHas(state.completed, `quest_unlock_${questId}`)
                    || (side && setHas(state.activeSideQuests, questId));
                return { done, started, progress };
            }
            function questStateMatches(questId, expected) {
                const main = progressForQuest(questId);
                const side = progressForQuest(questId, true);
                const live = main || side;
                const completed = setHas(state.claimedQuestRewards, questId)
                    || setHas(state.completed, questId)
                    || Boolean(live?.done)
                    || questDoneBySpecialCase(questId);
                if (expected === "complete")
                    return completed;
                if (expected === "ready_submit") {
                    return completed || Boolean(live && live.progress.done >= Math.max(1, live.progress.total - 1));
                }
                if (expected === "active")
                    return completed || Boolean(live?.started) || hooks.hasCoreLoop();
                return false;
            }
            function questStepDone(stepId) {
                const step = [...data.questSteps, ...data.sideQuestSteps].find((entry) => entry.step_id === stepId);
                return Boolean(step && stepProgress(step) >= Number(step.target_count || 1));
            }
            function triggerParamMet(trigger) {
                const type = trigger.trigger_type;
                const param = trigger.trigger_param || "";
                if (type === "on_new_game")
                    return Number(state.day || 0) >= 1;
                if (type === "on_item_collected")
                    return hasItem(state, param, 1) || (param === "item_weed" && setHas(state.completed, "plant"));
                if (type === "on_crop_harvest") {
                    if (!param)
                        return setHas(state.completed, "harvest");
                    return numberMapValue(state.harvestCounts, param) > 0 || hasItem(state, param, 1);
                }
                if (type === "on_day_start") {
                    const dayMatch = param.match(/^day_(\d+)/);
                    return dayMatch ? Number(state.day || 0) >= Number(dayMatch[1] || 0) : true;
                }
                if (type === "on_day_end")
                    return true;
                if (type === "on_enter_area") {
                    if (param === "area_town_main")
                        return (state.missionDone?.size || 0) > 0 || setHas(state.completed, "shop") || Number(state.day || 0) >= 2;
                    return setHas(state.completed, param);
                }
                if (type === "on_build_complete")
                    return param ? setHas(state.builtBuildings, param) : setHas(state.completed, "build") || setHas(state.completed, "repair");
                if (type === "on_recipe_complete" || type === "on_craft_complete")
                    return hasItem(state, param, 1) || setHas(state.completed, "craft");
                if (type === "on_shop_sales_reach") {
                    const target = Number(param.match(/(\d+)/)?.[1] || 1);
                    const value = param.includes("total") ? state.shopStats?.sales : state.shopStats?.soldCount;
                    return Number(value || 0) >= target;
                }
                if (type === "on_shop_reputation_reach") {
                    const target = Number(param.match(/(\d+)/)?.[1] || 0);
                    return hooks.shopReputationScore() >= target;
                }
                if (type === "on_term_change")
                    return hooks.currentTermId() === param;
                if (type === "on_boss_defeat")
                    return setHas(state.defeatedBosses, param);
                if (type === "on_crop_spirit_birth")
                    return (state.spirits?.length || 0) > 0;
                if (type === "on_talk")
                    return numberMapValue(state.npcFavor, param) > 0 || (state.missionDone?.size || 0) > 0;
                if (type === "on_trade_complete") {
                    if (param.startsWith("order_"))
                        return setHas(state.completedOrders, param);
                    return setHas(state.completed, "trade_route_complete") || (state.completedOrders?.size || 0) > 0;
                }
                if (type === "on_npc_arrive")
                    return setHas(state.completed, "shop") || (state.missionDone?.size || 0) >= 2;
                if (type === "on_quest_accept")
                    return setHas(state.missionDone, param) || setHas(state.activeSideQuests, param);
                if (type === "on_world_state")
                    return setHas(state.completed, param) || setHas(state.triggeredEvents, param);
                return hooks.hasCoreLoop();
            }
            function configuredTriggerReady(trigger) {
                const condition = trigger.condition_group || "always_true";
                const paramReady = triggerParamMet(trigger);
                const conditionReady = hooks.conditionMet(condition);
                return {
                    param: paramReady,
                    condition: conditionReady,
                    ready: paramReady && conditionReady,
                };
            }
            function sideQuestAccepted(quest) {
                return Boolean(quest?.quest_id && (setHas(state.activeSideQuests, quest.quest_id) || quest.auto_accept === "true"));
            }
            function sideQuestVisible(quest) {
                if (!quest?.quest_id)
                    return false;
                const triggers = data.sideQuestTriggersByQuest.get(quest.quest_id) || [];
                if (setHas(state.activeSideQuests, quest.quest_id))
                    return true;
                if (quest.auto_accept === "true")
                    return true;
                if (Number(quest.chapter || 0) <= 1 && Number(state.fame || 0) >= 1)
                    return true;
                return triggers.some((trigger) => configuredTriggerReady(trigger).ready);
            }
            function currentSideQuestStep(quest) {
                if (!quest)
                    return null;
                const progress = questProgress(quest, true);
                return progress.steps.find((step) => stepProgress(step) < Number(step.target_count || 1)) || null;
            }
            function sideQuestStepAdvanceAmount(step) {
                if (!step)
                    return 0;
                const count = Number(step.target_count || 1);
                const current = stepProgress(step);
                if (current >= count)
                    return 0;
                if (step.objective_type === "collect")
                    return Math.max(1, Math.min(count - current, Math.ceil(count / 2)));
                if (step.objective_type === "defeat")
                    return Math.max(1, Math.min(count - current, 1));
                if (step.objective_type === "sell")
                    return Math.max(1, Math.min(count - current, 1));
                if (step.objective_type === "craft")
                    return Math.max(1, Math.min(count - current, 1));
                return count - current;
            }
            function sideQuestActionState(quest) {
                if (!quest)
                    return { kind: "missing", objectiveType: "", targetId: "" };
                if (questRewardReady(quest, true))
                    return { kind: "reward", objectiveType: "", targetId: "" };
                if (!sideQuestAccepted(quest))
                    return { kind: "accept", objectiveType: "", targetId: quest.issuer_id || "" };
                const step = currentSideQuestStep(quest);
                if (!step)
                    return { kind: "done", objectiveType: "", targetId: "" };
                return { kind: "step", objectiveType: step.objective_type || "", targetId: step.target_id || "" };
            }
            function sideQuestRouteActionState(quest) {
                if (!quest)
                    return { kind: "missing", objectiveType: "", targetId: "" };
                if (setHas(state.claimedQuestRewards, quest.quest_id))
                    return { kind: "claimed", objectiveType: "", targetId: "" };
                if (questRewardReady(quest, true))
                    return { kind: "reward", objectiveType: "", targetId: "" };
                if (!sideQuestAccepted(quest))
                    return { kind: "accept", objectiveType: "", targetId: quest.issuer_id || "" };
                const step = currentSideQuestStep(quest);
                if (!step)
                    return { kind: "done", objectiveType: "", targetId: "" };
                return { kind: "step", objectiveType: step.objective_type || "", targetId: step.target_id || "" };
            }
            function sideQuestResolveTiming(step) {
                const type = step?.objective_type || "";
                if (type === "talk")
                    return "after_talk";
                if (type === "build")
                    return "after_build";
                if (type === "craft")
                    return "after_complete";
                if (type === "sell")
                    return "after_sell";
                if (type === "defeat")
                    return "after_finish";
                if (type === "enter_area")
                    return "after_trigger";
                return "after_collect";
            }
            function sideQuestResolvePlan(quest) {
                const questId = quest?.quest_id || "";
                const base = {
                    questId,
                    issuerId: quest?.issuer_id || "",
                    step: null,
                    before: 0,
                    targetCount: 0,
                    amount: 0,
                    timing: "after_collect",
                };
                if (!quest)
                    return { ...base, kind: "missing" };
                if (!sideQuestVisible(quest))
                    return { ...base, kind: "hidden" };
                if (!sideQuestAccepted(quest))
                    return { ...base, kind: "accept" };
                if (questRewardReady(quest, true))
                    return { ...base, kind: "reward" };
                const step = currentSideQuestStep(quest);
                if (!step)
                    return { ...base, kind: "done" };
                const before = stepProgress(step);
                const targetCount = Number(step.target_count || 1);
                const amount = sideQuestStepAdvanceAmount(step);
                return {
                    ...base,
                    kind: "step",
                    step,
                    before,
                    targetCount,
                    amount,
                    timing: sideQuestResolveTiming(step),
                };
            }
            function sideQuestActionLabel(quest) {
                return hooks.formatSideQuestActionLabel(sideQuestActionState(quest));
            }
            function sideQuestRouteActionLabel(quest) {
                return hooks.formatSideQuestRouteActionLabel(sideQuestRouteActionState(quest));
            }
            function sideQuestRewardPreviewText(quest) {
                const rewardPoolId = quest?.complete_reward_group || "";
                const rewards = rewardPoolId
                    ? rewardPoolEntries(rewardPoolId)
                        .slice(0, 3)
                        .map((entry) => hooks.rewardEntryPreview(entry))
                        .filter(Boolean)
                    : [];
                return hooks.formatSideQuestRewardPreview(quest, rewardPoolId, rewards);
            }
            function sideQuestClueForNpc(npcId = "", questId = "") {
                const candidates = data.sideQuests
                    .filter((quest) => (!questId || quest.quest_id === questId) && quest.issuer_id === npcId && !setHas(state.claimedQuestRewards, quest.quest_id))
                    .map((quest) => {
                    const triggers = data.sideQuestTriggersByQuest.get(quest.quest_id) || [];
                    const trigger = triggers.find((entry) => entry.trigger_param === npcId) || triggers[0] || null;
                    const triggerStatus = trigger ? configuredTriggerReady(trigger) : { param: true, condition: true, ready: true };
                    const active = sideQuestAccepted(quest);
                    const visible = active || sideQuestVisible(quest);
                    const progress = questProgress(quest, true);
                    const currentStep = progress.steps.find((step) => stepProgress(step) < Number(step.target_count || 1)) || progress.steps[progress.steps.length - 1] || null;
                    const ready = Boolean(triggerStatus.ready || active || quest.auto_accept === "true");
                    const rewardReady = questRewardReady(quest, true);
                    const status = rewardReady
                        ? "reward"
                        : active
                            ? "active"
                            : ready
                                ? "ready"
                                : visible
                                    ? "visible"
                                    : "locked";
                    return {
                        quest,
                        trigger,
                        triggerStatus,
                        active,
                        visible,
                        ready,
                        rewardReady,
                        status,
                        progress,
                        currentStep,
                    };
                })
                    .filter((entry) => entry.visible || entry.ready || entry.active)
                    .sort((a, b) => {
                    const stateScore = { reward: 60, active: 50, ready: 40, visible: 20, locked: 0 };
                    return (stateScore[b.status] || 0) - (stateScore[a.status] || 0) || Number(b.quest.priority || 0) - Number(a.quest.priority || 0);
                });
                return candidates[0] || null;
            }
            function configuredEventReadyQueue() {
                const candidates = [];
                const events = [...data.eventTriggers, ...data.sideQuestTriggers]
                    .slice()
                    .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
                for (const event of events) {
                    if (event.repeatable !== "true" && setHas(state.triggeredEvents, event.event_id || ""))
                        continue;
                    if (event.quest_id && setHas(state.activeSideQuests, event.quest_id))
                        continue;
                    const status = configuredTriggerReady(event);
                    if (status.ready)
                        candidates.push({ event, status });
                }
                return candidates;
            }
            function configuredEventActionKind(event) {
                const executeGroup = event.execute_group || "";
                if (event.quest_id)
                    return "side_quest_accept";
                if (executeGroup.includes("start_quest_main_0301"))
                    return "start_spirit_manor_chapter";
                if (executeGroup.includes("start_quest_main_0302"))
                    return "start_faction_order_chapter";
                if (executeGroup.includes("start_quest_main_0402"))
                    return "start_chapter4_lu_truth";
                if (executeGroup.includes("start_quest_main"))
                    return "start_main_quest";
                if (executeGroup.includes("birth_first_spirit"))
                    return "birth_first_spirit";
                if (executeGroup.includes("cutscene"))
                    return "cutscene";
                if (executeGroup.includes("unlock_herb_valley"))
                    return "unlock_herb_valley";
                if (executeGroup.includes("finish_herb_valley_baizhi"))
                    return "finish_herb_valley_baizhi";
                if (executeGroup.includes("shop_tutorial_complete"))
                    return "shop_tutorial_complete";
                if (executeGroup.includes("spawn_hu_sihai"))
                    return "spawn_hu_sihai";
                if (executeGroup.includes("unlock_spirit_overview"))
                    return "unlock_spirit_overview";
                if (executeGroup.includes("unlock_ruin_fire"))
                    return "unlock_ruin_fire";
                if (executeGroup.includes("start_ruin_fire"))
                    return "start_ruin_fire";
                if (executeGroup.includes("finish_fire_ruin"))
                    return "finish_fire_ruin";
                if (executeGroup.includes("world_state_drought"))
                    return "world_state_drought";
                if (executeGroup.includes("unlock_final_nest"))
                    return "unlock_final_nest";
                if (executeGroup.includes("start_final_array_cutscene"))
                    return "start_final_array_cutscene";
                if (executeGroup.includes("unlock_final_planting"))
                    return "unlock_final_planting";
                if (executeGroup.includes("final_banquet"))
                    return "final_banquet";
                if (executeGroup.includes("unlock") || executeGroup.includes("spawn") || executeGroup.includes("open"))
                    return "generic_unlock";
                return "generic_event";
            }
            function dialogueGroupForExecuteGroup(executeGroup) {
                const raw = String(executeGroup || "");
                const questMatch = raw.match(/quest_(main|side)_\d+/);
                const sideMatch = raw.match(/side_\d+/);
                const prefix = questMatch ? questMatch[0].replace("quest_", "dialogue_") : sideMatch ? `dialogue_${sideMatch[0]}` : "";
                if (!prefix)
                    return "";
                return [...data.dialoguesByGroup.keys()].find((groupId) => groupId.startsWith(prefix)) || "";
            }
            function dialogueLinesForGroup(groupId) {
                return (data.dialoguesByGroup.get(groupId) || [])
                    .slice()
                    .sort((a, b) => Number(a.line_order || 0) - Number(b.line_order || 0))
                    .map((line) => ({
                    speakerId: line.speaker_id || "",
                    speaker: hooks.npcName(line.speaker_id || ""),
                    text: hooks.localize(line.content_key || "", line.content_key || ""),
                    groupId,
                    lineOrder: Number(line.line_order || 0),
                    contextType: line.context_type,
                }));
            }
            function normalizedQueue(queuedGroups) {
                return (queuedGroups || []).map((groupId) => String(groupId || "")).filter(Boolean);
            }
            function queueDialogueGroupPlan(groupId, context = {}) {
                const normalizedGroupId = String(groupId || "");
                const queuedGroups = normalizedQueue(context.queuedGroups);
                if (!normalizedGroupId) {
                    return {
                        accepted: false,
                        immediate: false,
                        enqueue: false,
                        duplicate: false,
                        groupId: "",
                        queuedGroups,
                    };
                }
                const immediate = !context.activeCutscene && Number(context.activeDialogueCount || 0) <= 0;
                const duplicate = queuedGroups.includes(normalizedGroupId);
                return {
                    accepted: true,
                    immediate,
                    enqueue: !immediate && !duplicate,
                    duplicate,
                    groupId: normalizedGroupId,
                    queuedGroups: !immediate && !duplicate ? [...queuedGroups, normalizedGroupId] : queuedGroups,
                };
            }
            function flushQueuedDialoguePlan(queuedGroups) {
                const normalized = normalizedQueue(queuedGroups);
                const nextGroupId = normalized[0] || "";
                return {
                    nextGroupId,
                    remainingGroups: normalized.slice(nextGroupId ? 1 : 0),
                    skippedGroups: [],
                };
            }
            function questForExecuteGroup(executeGroup, side = false) {
                const raw = String(executeGroup || "");
                const match = raw.match(side ? /side_\d+/ : /quest_main_\d+/);
                if (!match)
                    return null;
                const rows = side ? data.sideQuests : data.quests;
                return rows.find((quest) => quest.quest_id.startsWith(match[0])) || null;
            }
            function configuredEventExecutionPlan(event) {
                const executeGroup = event.execute_group || "";
                const sideQuest = event.quest_id
                    ? data.sideQuests.find((quest) => quest.quest_id === event.quest_id) || null
                    : questForExecuteGroup(executeGroup, true);
                return {
                    eventId: event.event_id || "",
                    eventNameKey: event.event_name_key || event.event_id || "",
                    executeGroup,
                    actionKind: configuredEventActionKind(event),
                    dialogueGroup: dialogueGroupForExecuteGroup(executeGroup),
                    questId: event.quest_id || "",
                    quest: questForExecuteGroup(executeGroup),
                    sideQuest,
                };
            }
            function rewardPoolEntries(poolId) {
                return data.rewardPools.filter((entry) => entry.reward_pool_id === poolId);
            }
            function questRewardReady(quest, side = false) {
                if (!quest?.complete_reward_group || setHas(state.claimedQuestRewards, quest.quest_id))
                    return false;
                if (side && !sideQuestVisible(quest))
                    return false;
                const progress = questProgress(quest, side);
                return progress.total > 0 && progress.done >= progress.total;
            }
            function claimQuestReward(quest, side = false) {
                const questId = quest?.quest_id || "";
                if (!questRewardReady(quest, side)) {
                    return {
                        claimed: false,
                        questId,
                        side,
                        rewards: [],
                        finalStep: null,
                        reason: "not_ready",
                    };
                }
                const rewards = rewardPoolEntries(quest?.complete_reward_group || "")
                    .filter((entry) => hooks.conditionMet(entry.condition_group || "always_true"))
                    .map((entry) => hooks.applyRewardEntry(entry));
                state.claimedQuestRewards?.add(questId);
                if (side)
                    state.activeSideQuests?.add(questId);
                else
                    state.missionDone?.add(questId);
                const steps = side ? questStepsFor(quest, true) : [];
                const finalStep = steps[steps.length - 1] || null;
                return {
                    claimed: true,
                    questId,
                    side,
                    rewards,
                    finalStep,
                    reason: "claimed",
                };
            }
            function checkQuestRewards() {
                const results = [];
                for (const quest of data.quests) {
                    const result = claimQuestReward(quest);
                    if (result.claimed)
                        results.push(result);
                }
                for (const quest of data.sideQuests) {
                    const result = claimQuestReward(quest, true);
                    if (result.claimed)
                        results.push(result);
                }
                return results;
            }
            return {
                questStepsFor,
                stepProgress,
                questProgress,
                mainStoryQuestDone,
                mainStoryQuestStarted,
                questStateMatches,
                questStepDone,
                questRewardReady,
                claimQuestReward,
                checkQuestRewards,
                triggerParamMet,
                configuredTriggerReady,
                currentSideQuestStep,
                sideQuestStepAdvanceAmount,
                sideQuestActionState,
                sideQuestRouteActionState,
                sideQuestResolvePlan,
                sideQuestActionLabel,
                sideQuestRouteActionLabel,
                sideQuestRewardPreviewText,
                sideQuestVisible,
                sideQuestClueForNpc,
                configuredEventReadyQueue,
                configuredEventActionKind,
                dialogueGroupForExecuteGroup,
                dialogueLinesForGroup,
                queueDialogueGroupPlan,
                flushQueuedDialoguePlan,
                questForExecuteGroup,
                configuredEventExecutionPlan,
            };
        }
        Quests.createQuestRuntime = createQuestRuntime;
    })(Quests = XiannongCore.Quests || (XiannongCore.Quests = {}));
})(XiannongCore || (XiannongCore = {}));
var XiannongCore;
(function (XiannongCore) {
    var Shop;
    (function (Shop) {
        function rowByKey(rows, key, value) {
            return rows.find((row) => row[key] === value) || null;
        }
        function customerArchetype(customer) {
            return customer?.archetype || customer?.archetype_id || "";
        }
        function compactJoin(values) {
            return values.filter(Boolean).join("|");
        }
        const semanticTagGroups = [
            ["festival", "festival_food", "festival_gift"],
            ["gift", "festival_gift", "flower_food"],
            ["premium", "premium_luxury", "luxury", "rare_goods"],
            ["portable_food", "portable_supply"],
            ["route_rare", "rare_goods"],
            ["drink", "cooling_drink"],
            ["cooling", "cooling_drink", "refreshing"],
            ["cheap", "low_price", "cheap_crop"],
            ["crop", "common_crop", "cheap_crop"],
            ["batch", "batch_standard"],
            ["water_food", "water"],
            ["recover_sp", "heal_sp"],
            ["recover_hp", "heal_hp"],
            ["dessert", "sweet_food", "festival_food", "flower_food", "fruit_food"],
            ["material", "workshop_supply"],
            ["medicine", "relief"],
            ["staple", "portable_supply"],
        ];
        const expressiveShopTags = new Set(["refreshing", "water_food", "food_cold", "clean_food", "cooling", "recover_sp"]);
        const shopTagPriorities = {
            ecology_product: 20,
            spirit_crafted: 19,
            route_rare: 18,
            refreshing: 18,
            water_food: 17,
            food_cold: 16,
            clean_food: 15,
            cooling: 14,
            recover_sp: 13,
            staple: 12,
            fresh_food: 11,
            medicine: 10,
            drink: 9,
            gift: 8,
            premium: 7,
            festival: 7,
            vegetable: 6,
            material: 5,
            cheap: 2,
            low_price: 2,
            food: 1,
        };
        function createShopRuntime(state, data) {
            function customerPriceRule(customer) {
                const archetype = customerArchetype(customer);
                return (archetype ? data.priceRulesByArchetype?.get(archetype) : null)
                    || rowByKey(data.shopPriceRules, "customer_archetype", archetype)
                    || data.shopPriceRules[0]
                    || null;
            }
            function customerProfile(customer) {
                const archetype = customerArchetype(customer);
                return (archetype ? data.customerProfilesBy?.get(archetype) : null)
                    || rowByKey(data.customerProfiles, "archetype_id", archetype)
                    || {};
            }
            function shopReputationScore() {
                return Number(state.fame || 0) * 100;
            }
            function customerViewFor(customer, segment = null) {
                const source = customer || {};
                const profile = customerProfile(source);
                return {
                    ...source,
                    preferred_tags: compactJoin([
                        source.preferred_tags,
                        profile.preferred_tags,
                        segment?.preferred_tags_extra,
                    ]),
                    disliked_tags: compactJoin([
                        profile.disliked_tags,
                        segment?.disliked_tags_extra,
                    ]),
                };
            }
            function customerBudget(customer, segment = null) {
                const profile = customerProfile(customer);
                const baseBudget = Number(profile.base_budget || 0);
                const csvBudget = Number(customer?.budget_max || customer?.budget_min || 0);
                const budgetRate = Number(segment?.budget_rate || 1);
                return Math.round(Math.max(baseBudget, csvBudget) * budgetRate);
            }
            function pricedGood(choice, customer, options = {}) {
                const item = choice?.item || {};
                const rule = customerPriceRule(customer);
                const basePrice = Number(item.sell_price_base || 0);
                const maxMarkup = Number(rule?.base_markup_max || 0.12);
                const shelfTheme = options.shelfTheme || null;
                const themeScore = Number(options.themeScore || 0);
                const themeBonus = themeScore >= Number(shelfTheme?.min_theme_ratio || 1) ? 0.05 : 0;
                const itemTags = compactJoin([item.tags]).split("|").filter(Boolean);
                const marketTags = compactJoin([options.term?.market_bonus_tags]).split("|").filter(Boolean);
                const termBonus = itemTags.some((tag) => marketTags.some((marketTag) => marketTag.includes(tag) || tag.includes(marketTag))) ? 0.06 : 0;
                const multiplier = Math.max(0.5, Number(state.shopPriceMultiplier || 0) + themeBonus + termBonus);
                const price = Math.max(1, Math.round(basePrice * multiplier));
                const overpriceLimit = 1 + Number(rule?.penalty_overprice_threshold || maxMarkup);
                return {
                    price,
                    multiplier,
                    overprice: multiplier > overpriceLimit,
                    rule,
                };
            }
            function sumValues(values = {}) {
                let total = 0;
                for (const value of Object.values(values))
                    total += Number(value || 0);
                return total;
            }
            function customerPurchaseDecision(input) {
                const priced = input.priced;
                const budgetBonus = sumValues(input.budgetBonuses);
                const effectiveBudget = Math.round(Number(input.budget || 0) * (1 + budgetBonus));
                const priceTolerance = Number(input.behavior?.price_tolerance || 0.7);
                const priceSensitive = Math.max(Number(input.customer?.price_sensitive || 0.5), 1 - priceTolerance);
                const stockPressure = Number(input.behavior?.stock_sensitivity || 0.7) > 0.8 && Number(input.choice?.count || 0) <= 1;
                const priceRelief = sumValues(input.priceReliefs);
                const rejectedByPrice = priced.overprice && priceSensitive > Math.max(0.35, 0.55 - priceRelief);
                const canBuy = Boolean(input.hasStock) && priced.price <= effectiveBudget && !rejectedByPrice && !stockPressure;
                return {
                    effectiveBudget,
                    priceTolerance,
                    priceSensitive,
                    stockPressure,
                    rejectedByPrice,
                    canBuy,
                    reason: canBuy ? "buy" : priced.price > effectiveBudget || rejectedByPrice ? "price" : stockPressure ? "stock" : "tag",
                };
            }
            function salePricePlan(input) {
                const priced = input.priced;
                const profitBuff = Number(input.profitBuff || 0);
                const dessertSaleBonus = input.dessertChoice ? Number(input.dessertSaleBonusRate || 0) : 0;
                const baseSalePrice = Math.max(1, Math.round(Number(priced.price || 0) * (1 + profitBuff)));
                const salePrice = Math.max(1, Math.round(Number(priced.price || 0) * (1 + profitBuff + dessertSaleBonus)));
                return {
                    baseSalePrice,
                    salePrice,
                    dessertSaleBonus,
                    dessertBonusGold: Math.max(0, salePrice - baseSalePrice),
                };
            }
            function splitTags(value) {
                return String(value || "").split("|").map((tag) => tag.trim()).filter(Boolean);
            }
            function themeMatchScore(goods = [], theme = null) {
                const safeGoods = Array.isArray(goods) ? goods : [];
                if (!theme || safeGoods.length === 0)
                    return 0;
                const required = splitTags(theme.required_item_tags);
                const matched = safeGoods.filter((good) => splitTags(good.item?.tags).some((tag) => required.includes(tag))).length;
                return matched / safeGoods.length;
            }
            function expandShopSemanticTags(tags = []) {
                const expanded = new Set((Array.isArray(tags) ? tags : []).filter(Boolean));
                let changed = true;
                while (changed) {
                    changed = false;
                    for (const group of semanticTagGroups) {
                        if (!group.some((tag) => expanded.has(tag)))
                            continue;
                        for (const tag of group) {
                            if (expanded.has(tag))
                                continue;
                            expanded.add(tag);
                            changed = true;
                        }
                    }
                }
                return [...expanded];
            }
            function shopTagsOverlap(leftTags = [], rightTags = []) {
                const left = Array.isArray(leftTags) ? leftTags : [];
                const right = Array.isArray(rightTags) ? rightTags : [];
                if (!left.length || !right.length)
                    return false;
                const expandedRight = new Set(expandShopSemanticTags(right));
                return expandShopSemanticTags(left).some((tag) => expandedRight.has(tag));
            }
            function isExpressiveShopTag(tag = "") {
                return expressiveShopTags.has(String(tag || ""));
            }
            function shopTagPriority(tag = "") {
                return shopTagPriorities[String(tag || "")] || 0;
            }
            function tagCount(counts, tag) {
                if (!counts)
                    return 0;
                if (counts instanceof Map)
                    return Number(counts.get(tag) || 0);
                return Number(counts[tag] || 0);
            }
            function prioritizeShopTag(tags = [], counts = null, fallback = "food") {
                const unique = [...new Set((Array.isArray(tags) ? tags : []).filter(Boolean))];
                if (!unique.length)
                    return fallback;
                return unique
                    .slice()
                    .sort((a, b) => (shopTagPriority(b) * 10 + tagCount(counts, b)) - (shopTagPriority(a) * 10 + tagCount(counts, a)))[0]
                    || fallback;
            }
            function shopHotTag(goods = [], theme = null, fallback = "food") {
                const safeGoods = Array.isArray(goods) ? goods : [];
                const required = splitTags(theme?.required_item_tags || "");
                const counts = new Map();
                for (const good of safeGoods) {
                    const tags = Array.isArray(good.tags) ? good.tags.filter(Boolean) : splitTags(good.item?.tags || "");
                    for (const tag of tags) {
                        counts.set(tag, Number(good.count || 1) + Number(counts.get(tag) || 0));
                    }
                }
                const available = [...counts.keys()];
                const featured = available.filter((tag) => required.includes(tag) || isExpressiveShopTag(tag) || ["ecology_product", "spirit_crafted", "route_rare"].includes(tag));
                return prioritizeShopTag(featured.length ? featured : available, counts, required[0] || fallback);
            }
            function shopFeedbackEntryMatchesTag(entry = null, tag = "") {
                if (!entry || !tag)
                    return true;
                const trigger = String(entry.trigger_condition || "");
                const hotTag = trigger.match(/hot_tag==([a-z_]+)/)?.[1] || "";
                if (hotTag)
                    return hotTag === tag;
                const tagMatches = [...trigger.matchAll(/tag_match==([a-z_]+)/g)].map((match) => match[1]);
                if (tagMatches.length)
                    return tagMatches.includes(tag);
                return true;
            }
            function shopFeedbackForSegment(type, customerSegment = "", tag = "") {
                if (!customerSegment)
                    return null;
                const exact = data.shopFeedback.filter((entry) => entry.feedback_type === type && entry.customer_segment === customerSegment);
                if (!exact.length)
                    return null;
                const matched = tag ? exact.filter((entry) => shopFeedbackEntryMatchesTag(entry, tag)) : exact;
                return matched[0] || null;
            }
            function shopWordOfMouthVisitBias(customer = null, segment = null, spec = null) {
                if (!customer || !spec)
                    return 0;
                let bonus = 0;
                if ((spec.preferredArchetypes || []).includes(customerArchetype(customer)))
                    bonus += Number(spec.visitBias || 0);
                if (spec.hotTag) {
                    const view = customerViewFor(customer, segment);
                    const tags = expandShopSemanticTags(splitTags(view.preferred_tags || ""));
                    if (shopTagsOverlap(tags, [spec.hotTag]))
                        bonus += Number(spec.tagVisitBias || 0);
                }
                return bonus;
            }
            function shopWordOfMouthBudgetBonus(customer = null, choiceTags = [], spec = null) {
                if (!customer || !Array.isArray(choiceTags) || !spec)
                    return 0;
                let bonus = 0;
                if ((spec.preferredArchetypes || []).includes(customerArchetype(customer)))
                    bonus += Number(spec.budgetBonus || 0);
                if (spec.hotTag && shopTagsOverlap(choiceTags, [spec.hotTag]))
                    bonus += Number(spec.tagBudgetBonus || 0);
                return bonus;
            }
            function shopCompendiumCustomerSupport(input = null) {
                const displays = Array.isArray(input?.displays) ? input.displays : [];
                if (!displays.length)
                    return { budgetBonus: 0, matched: [] };
                const customerArchetypeId = String(input?.customerArchetype || "");
                const preferredTags = Array.isArray(input?.preferredTags) ? input.preferredTags : [];
                const itemTags = Array.isArray(input?.itemTags) ? input.itemTags : [];
                const hotTag = String(input?.hotTag || "");
                const matched = displays.filter((display) => {
                    const archetypes = Array.isArray(display.archetypes) ? display.archetypes : [];
                    const tags = Array.isArray(display.tags) ? display.tags : [];
                    const archetypeMatched = Boolean(customerArchetypeId && archetypes.includes(customerArchetypeId));
                    return archetypeMatched || tags.some((tag) => shopTagsOverlap([tag], preferredTags) || shopTagsOverlap([tag], itemTags) || tag === hotTag);
                });
                return {
                    budgetBonus: Math.min(0.16, matched.reduce((sum, display) => sum + Number(display.budgetBonus || 0), 0)),
                    matched,
                };
            }
            function inactiveWeatherShelfPlan(itemId = "") {
                return {
                    active: false,
                    itemId,
                    isTopGood: false,
                    matchedTags: [],
                    labelTag: "",
                    budgetBonus: 0,
                    priceRelief: 0,
                };
            }
            function shopWeatherShelfChoiceSupport(input = null) {
                const itemId = String(input?.itemId || "");
                const shelf = input?.shelf || null;
                if (!itemId || !shelf?.active)
                    return inactiveWeatherShelfPlan(itemId);
                const itemTags = Array.isArray(input?.itemTags) ? input.itemTags : [];
                const topGoods = Array.isArray(shelf.topGoods) ? shelf.topGoods : [];
                const desiredTags = Array.isArray(shelf.desiredTags) ? shelf.desiredTags : [];
                const topGood = topGoods.find((good) => good.itemId === itemId) || null;
                const matchedTags = desiredTags.filter((tag) => shopTagsOverlap(itemTags, [tag]));
                if (!topGood && matchedTags.length === 0)
                    return inactiveWeatherShelfPlan(itemId);
                const weatherKindBonus = ["hot-wind", "drought", "frost", "snow", "storm-rain"].includes(String(shelf.kind || "")) ? 0.015 : 0;
                const topBonus = topGood ? 0.045 : 0;
                const tagBonus = Math.min(0.035, matchedTags.length * 0.018);
                const budgetBonus = Math.min(0.085, topBonus + tagBonus + weatherKindBonus);
                const topMatchedTags = Array.isArray(topGood?.matchedTags) ? topGood?.matchedTags || [] : [];
                return {
                    active: true,
                    itemId,
                    isTopGood: Boolean(topGood),
                    matchedTags,
                    labelTag: matchedTags[0] || topMatchedTags[0] || desiredTags[0] || "",
                    budgetBonus,
                    priceRelief: Math.min(0.06, budgetBonus * 0.7),
                };
            }
            function shopWeatherShelfChoiceWeight(input = null) {
                const support = input?.support || inactiveWeatherShelfPlan("");
                if (!support.active) {
                    return {
                        support,
                        score: 0,
                        preferredBridge: 0,
                        topWeight: 0,
                        budgetWeight: 0,
                        labelKind: "",
                    };
                }
                const itemTags = Array.isArray(input?.itemTags) ? input.itemTags : [];
                const preferredTags = Array.isArray(input?.preferredTags) ? input.preferredTags : [];
                const preferredBridge = shopTagsOverlap(itemTags, preferredTags) ? 12 : 0;
                const topWeight = support.isTopGood ? 34 : 18;
                const budgetWeight = Math.round(Number(support.budgetBonus || 0) * 180);
                return {
                    support,
                    score: topWeight + budgetWeight + preferredBridge,
                    preferredBridge,
                    topWeight,
                    budgetWeight,
                    labelKind: support.isTopGood ? "top" : "match",
                };
            }
            function scoreCustomerGoodCandidate(candidate) {
                const weatherWeightScore = Number(candidate.weatherWeightScore || 0);
                const stockWeight = Number(candidate.stockWeight || 0);
                const index = Number(candidate.index || 0);
                return {
                    ...candidate,
                    weatherWeightScore,
                    stockWeight,
                    index,
                    score: (candidate.preferredHit ? 80 : 0) + weatherWeightScore + stockWeight - index * 0.01,
                };
            }
            function topCustomerGoodCandidate(candidates) {
                return [...candidates].sort((a, b) => Number(b.score || 0) - Number(a.score || 0))[0] || null;
            }
            function matchCustomerGood(input = null) {
                const scoredCandidates = (Array.isArray(input?.candidates) ? input.candidates : []).map(scoreCustomerGoodCandidate);
                const candidates = scoredCandidates.filter((candidate) => !candidate.dislikedHit);
                const preferredCandidate = topCustomerGoodCandidate(candidates.filter((candidate) => candidate.preferredHit));
                if (preferredCandidate?.good)
                    return { good: preferredCandidate.good, candidate: preferredCandidate, reason: "preferred" };
                const weatherCandidate = topCustomerGoodCandidate(candidates.filter((candidate) => candidate.weatherWeightScore > 0));
                if (weatherCandidate?.good)
                    return { good: weatherCandidate.good, candidate: weatherCandidate, reason: "weather" };
                const scoredCandidate = topCustomerGoodCandidate(candidates);
                if (scoredCandidate?.good)
                    return { good: scoredCandidate.good, candidate: scoredCandidate, reason: "score" };
                return { good: input?.fallbackGood || null, candidate: null, reason: "fallback" };
            }
            function incrementShopStatsCount(counts, key) {
                const safeKey = String(key || "");
                if (!safeKey)
                    return;
                counts[safeKey] = Number(counts[safeKey] || 0) + 1;
            }
            function shopSalesStatsDelta(input = null) {
                const customers = Array.isArray(input?.customers) ? input.customers : [];
                const report = Array.isArray(input?.report) ? input.report : [];
                const boughtRows = report.filter((entry) => entry?.reason === "buy");
                const itemSales = {};
                const customerVisits = {};
                const customerBuys = {};
                const themeUsage = {};
                for (const customer of customers)
                    incrementShopStatsCount(customerVisits, customer?.archetype);
                for (const entry of boughtRows) {
                    incrementShopStatsCount(customerBuys, entry?.customerArchetype);
                    incrementShopStatsCount(itemSales, entry?.itemId);
                }
                incrementShopStatsCount(themeUsage, input?.shelfTheme);
                const lowStock = Number(input?.lowStockCount || 0) > 0;
                return {
                    sessions: 1,
                    visitors: customers.length,
                    buyers: Number(input?.sold || 0),
                    soldCount: Number(input?.sold || 0),
                    sales: Number(input?.sessionSales || 0),
                    positive: boughtRows.length,
                    themeTotal: Number(input?.themeScore || 0),
                    stockWarnings: lowStock ? 1 : 0,
                    stockSafeSessions: lowStock ? 0 : 1,
                    itemSales,
                    customerVisits,
                    customerBuys,
                    themeUsage,
                };
            }
            function addShopStatsCounts(counts, delta) {
                const next = {};
                for (const [key, value] of Object.entries(counts || {})) {
                    next[key] = Number(value || 0);
                }
                for (const [key, value] of Object.entries(delta || {})) {
                    next[key] = Number(next[key] || 0) + Number(value || 0);
                }
                return next;
            }
            function applyShopSalesStatsDelta(stats = null, delta = null) {
                if (!stats || !delta)
                    return stats;
                return {
                    ...stats,
                    sessions: Number(stats.sessions || 0) + Number(delta.sessions || 0),
                    visitors: Number(stats.visitors || 0) + Number(delta.visitors || 0),
                    buyers: Number(stats.buyers || 0) + Number(delta.buyers || 0),
                    soldCount: Number(stats.soldCount || 0) + Number(delta.soldCount || 0),
                    sales: Number(stats.sales || 0) + Number(delta.sales || 0),
                    positive: Number(stats.positive || 0) + Number(delta.positive || 0),
                    themeTotal: Number(stats.themeTotal || 0) + Number(delta.themeTotal || 0),
                    stockWarnings: Number(stats.stockWarnings || 0) + Number(delta.stockWarnings || 0),
                    stockSafeSessions: Number(stats.stockSafeSessions || 0) + Number(delta.stockSafeSessions || 0),
                    customerVisits: addShopStatsCounts(stats.customerVisits, delta.customerVisits),
                    customerBuys: addShopStatsCounts(stats.customerBuys, delta.customerBuys),
                    itemSales: addShopStatsCounts(stats.itemSales, delta.itemSales),
                    themeUsage: addShopStatsCounts(stats.themeUsage, delta.themeUsage),
                };
            }
            function shopSeasonCycleInfo(day = state.day || 1) {
                const seasons = Array.isArray(data.shopSeasons) ? data.shopSeasons : [];
                if (seasons.length === 0)
                    return { season: null, cycleIndex: 0, dayInSeason: 1, startDay: 1, cycleDays: 30 };
                const safeDay = Math.max(1, Number(day || 1));
                let remaining = safeDay - 1;
                let cycleIndex = 0;
                while (cycleIndex < 9999) {
                    const season = seasons[cycleIndex % seasons.length];
                    const cycleDays = Math.max(1, Number(season?.cycle_days || 30));
                    if (remaining < cycleDays) {
                        return {
                            season,
                            cycleIndex,
                            dayInSeason: remaining + 1,
                            startDay: safeDay - remaining,
                            cycleDays,
                        };
                    }
                    remaining -= cycleDays;
                    cycleIndex += 1;
                }
                const fallback = seasons[0];
                return { season: fallback, cycleIndex: 0, dayInSeason: 1, startDay: 1, cycleDays: Math.max(1, Number(fallback?.cycle_days || 30)) };
            }
            function shopSeasonCycleKey(input = null) {
                const info = shopSeasonCycleInfo(input?.day ?? state.day ?? 1);
                const season = input?.season || info.season;
                const seasonId = season?.season_id || info.season?.season_id || "season_shop_001";
                return `${seasonId}:${Number((input?.cycleIndex ?? info.cycleIndex) || 0)}`;
            }
            function shopSeasonRules(season = shopSeasonCycleInfo().season) {
                const seasonId = season?.season_id || "";
                return (Array.isArray(data.shopSettlementRules) ? data.shopSettlementRules : [])
                    .filter((rule) => rule.season_id === seasonId);
            }
            function shopSeasonLeadKey(counts = {}) {
                return Object.entries(counts || {})
                    .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))[0]?.[0] || "";
            }
            function shopSeasonMetricBuffValue(activeBuffs, buffId) {
                return Number(activeBuffs?.[buffId] || 0);
            }
            function shopSeasonMetricValue(part = "", input = null) {
                const stats = input?.stats || {};
                const sessions = Number(stats.sessions || 0);
                const visitors = Number(stats.visitors || 0);
                const avgTheme = sessions ? Number(stats.themeTotal || 0) / sessions : 0;
                const positiveRate = visitors ? Number(stats.positive || 0) / visitors : 0;
                const buyerRate = visitors ? Number(stats.buyers || 0) / visitors : 0;
                const guestVisits = Number(stats.customerVisits?.guest || 0) + Number(stats.customerVisits?.faction || 0);
                const guestBuys = Number(stats.customerBuys?.guest || 0) + Number(stats.customerBuys?.faction || 0);
                const guestRate = guestVisits ? guestBuys / guestVisits : buyerRate;
                const activeBuffs = input?.activeBuffs || {};
                const freshBuff = shopSeasonMetricBuffValue(activeBuffs, "buff_shop_fresh_bonus");
                const visitBuff = shopSeasonMetricBuffValue(activeBuffs, "buff_shop_visit_bonus");
                const profitBuff = shopSeasonMetricBuffValue(activeBuffs, "buff_term_profit_bonus");
                const machineBuff = shopSeasonMetricBuffValue(activeBuffs, "buff_machine_speed_year2");
                const guestBuff = shopSeasonMetricBuffValue(activeBuffs, "buff_guest_purchase_up");
                const masterBuff = shopSeasonMetricBuffValue(activeBuffs, "buff_shop_master_title");
                const values = {
                    freshness_score: Math.min(100, 56 + avgTheme * 44 + freshBuff * 100),
                    theme_score: Math.min(100, avgTheme * 100 + freshBuff * 30),
                    sales_score: Math.min(100, Number(stats.sales || 0) / 3.2 * (1 + profitBuff + masterBuff * 0.5)),
                    customer_score: positiveRate * 100,
                    term_match_score: Math.min(100, avgTheme * 70 + (input?.marketBonusTags ? 20 : 0) + profitBuff * 100),
                    quality_score: Math.min(100, 45 + Number(input?.workshopMultiplier || 0) * 25 + machineBuff * 100),
                    guest_score: Math.min(100, guestRate * 100 + guestBuff * 100),
                    material_score: Number(input?.builtBuildingsCount || 0) * 16,
                    machine_score: Math.min(100, Number(input?.unlockedMachinesCount || 0) * 28 + machineBuff * 120),
                    reputation_score: Math.min(100, Number(input?.fame || 0) * 8 + masterBuff * 100),
                    gift_score: String(input?.shopShelfTheme || "").includes("gift") ? 100 : avgTheme * 60,
                    premium_score: Math.min(100, Number(input?.fame || 0) * 10 + Number(stats.sales || 0) / 8 + guestBuff * 80),
                    story_score: Number(input?.missionDoneCount || 0) * 18,
                    festival_score: input?.currentTermId === "term_dongzhi" ? 100 : Number(input?.seasonDay || 0) % 6 * 12,
                    ritual_score: Number(input?.resolvedRisksCount || 0) * 20 + Number(input?.dungeonClearsCount || 0) * 30,
                    town_score: Math.min(100, Number(input?.builtBuildingsCount || 0) * 12 + Number(input?.fame || 0) * 6 + visitBuff * 50),
                };
                return Math.max(0, Math.min(100, values[String(part || "")] || 0));
            }
            function shopSeasonScoreFromRules(input = null) {
                const parts = (Array.isArray(input?.rules) ? input.rules : []).map((rule) => ({
                    rule,
                    raw: shopSeasonMetricValue(rule.score_part || "", input),
                }));
                return shopSeasonScorePlan({ parts, ledgerBonus: input?.ledgerBonus || 0 });
            }
            function shopSeasonScorePlan(input = null) {
                const parts = (Array.isArray(input?.parts) ? input.parts : []).map((part) => {
                    const raw = Math.max(0, Math.min(100, Number(part.raw || 0)));
                    return {
                        rule: part.rule,
                        raw,
                        weighted: raw * Number(part.rule?.weight || 0),
                    };
                });
                const baseScore = Math.round(parts.reduce((sum, part) => sum + part.weighted, 0) * 12);
                const ledgerBonus = Number(input?.ledgerBonus || 0);
                return {
                    score: Math.round(baseScore * (1 + ledgerBonus)),
                    baseScore,
                    ledgerBonus,
                    parts,
                };
            }
            function shopSeasonSettlementPlan(input = null) {
                const endedInfo = input?.endedInfo || null;
                const season = endedInfo?.season || null;
                const settlement = input?.settlement || null;
                const rank = input?.rank || null;
                if (!endedInfo || !season || !settlement || !rank) {
                    return {
                        pending: null,
                        weakPart: null,
                        bestSellerItemId: "",
                        topThemeId: "",
                        mainCustomer: "",
                    };
                }
                const stats = input?.stats || {};
                const weakPart = settlement.parts.slice().sort((a, b) => a.raw - b.raw)[0] || null;
                const bestSellerItemId = shopSeasonLeadKey(stats.itemSales);
                const topThemeId = shopSeasonLeadKey(stats.themeUsage);
                const mainCustomer = shopSeasonLeadKey(stats.customerVisits);
                const pending = {
                    seasonId: season.season_id || "",
                    seasonName: season.season_name || "",
                    cycleIndex: endedInfo.cycleIndex,
                    cycleStartDay: endedInfo.startDay,
                    cycleEndDay: Number(input?.endedDay || 0),
                    baseScore: settlement.baseScore || settlement.score,
                    ledgerBonus: settlement.ledgerBonus || 0,
                    score: settlement.score,
                    rankTier: String(rank.rank_tier || "c").toLowerCase(),
                    titleLine: String(input?.titleLine || ""),
                    focusTags: splitTags(season.score_focus_tags),
                    parts: settlement.parts.map((part) => ({
                        scorePart: part.rule.score_part || "",
                        displayName: part.rule.display_name || "",
                        raw: Math.round(part.raw),
                        weight: Number(part.rule.weight || 0),
                        note: part.rule.note,
                    })),
                    bestSellerItemId,
                    bestSellerCount: Number(stats.itemSales?.[bestSellerItemId] || 0),
                    topThemeId,
                    mainCustomer,
                    weakPart: weakPart?.rule?.display_name || "",
                    advice: String(input?.advice || ""),
                    stockWarnings: Number(stats.stockWarnings || 0),
                    stockSafeSessions: Number(stats.stockSafeSessions || 0),
                    memoryPageTitle: String(input?.memoryPageTitle || ""),
                    reward: { ...rank },
                    rewardClaimed: false,
                };
                return {
                    pending,
                    weakPart,
                    bestSellerItemId,
                    topThemeId,
                    mainCustomer,
                };
            }
            function shopSeasonRewards(season = shopSeasonCycleInfo().season) {
                const seasonId = season?.season_id || "";
                return (Array.isArray(data.shopRankRewards) ? data.shopRankRewards : [])
                    .filter((reward) => reward.season_id === seasonId)
                    .sort((a, b) => Number(b.score_min || 0) - Number(a.score_min || 0));
            }
            function shopSeasonRank(score = 0, season = shopSeasonCycleInfo().season) {
                return shopSeasonRewards(season).find((reward) => Number(score || 0) >= Number(reward.score_min || 0)) || {
                    rank_tier: "c",
                    score_min: "0",
                    reward_type: "preview",
                    reward_param: "continue_shop",
                    reward_count: "0",
                    bonus_buff: "none",
                    bonus_value: "0",
                };
            }
            function shopSeasonRewardClaimPlan(input = null) {
                const pending = input?.pending || null;
                const reward = pending?.reward || null;
                const preview = reward?.reward_type === "preview";
                const buffId = String(reward?.bonus_buff || "");
                const buffValue = Number(reward?.bonus_value || 0);
                const completionKey = pending ? `shop_season_reward_${pending.seasonId || ""}_${pending.cycleIndex || 0}` : "";
                const basePlan = {
                    pending,
                    reward,
                    preview,
                    rewardEntry: reward && !preview ? reward : null,
                    buffId,
                    buffValue,
                    completionKey,
                };
                if (!input?.year2Unlocked)
                    return { ...basePlan, canClaim: false, reason: "locked" };
                if (!pending)
                    return { ...basePlan, canClaim: false, reason: "missing" };
                if (pending.rewardClaimed)
                    return { ...basePlan, canClaim: false, reason: "claimed" };
                return { ...basePlan, canClaim: true, reason: "claim" };
            }
            return {
                customerPriceRule,
                customerProfile,
                shopReputationScore,
                customerViewFor,
                customerBudget,
                pricedGood,
                customerPurchaseDecision,
                salePricePlan,
                themeMatchScore,
                expandShopSemanticTags,
                shopTagsOverlap,
                isExpressiveShopTag,
                shopTagPriority,
                prioritizeShopTag,
                shopHotTag,
                shopFeedbackEntryMatchesTag,
                shopFeedbackForSegment,
                shopWordOfMouthVisitBias,
                shopWordOfMouthBudgetBonus,
                shopCompendiumCustomerSupport,
                shopWeatherShelfChoiceSupport,
                shopWeatherShelfChoiceWeight,
                matchCustomerGood,
                shopSalesStatsDelta,
                applyShopSalesStatsDelta,
                shopSeasonCycleInfo,
                shopSeasonCycleKey,
                shopSeasonRules,
                shopSeasonLeadKey,
                shopSeasonMetricValue,
                shopSeasonScoreFromRules,
                shopSeasonScorePlan,
                shopSeasonSettlementPlan,
                shopSeasonRewards,
                shopSeasonRank,
                shopSeasonRewardClaimPlan,
            };
        }
        Shop.createShopRuntime = createShopRuntime;
    })(Shop = XiannongCore.Shop || (XiannongCore.Shop = {}));
})(XiannongCore || (XiannongCore = {}));
