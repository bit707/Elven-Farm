import { cpSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const outDir = join("dist", "xiannong-dongtian-demo");
const copied = [];

const include = [
  "index.html",
  "package.json",
  "README_GAME.md",
  "PROJECT_CONTEXT.md",
  "ARCHITECTURE_MIGRATION.md",
  "assets",
  "runtime-data",
  "src",
  "tools/dev-server.mjs",
  "csv/item_base.csv",
  "csv/crop_config.csv",
  "csv/recipe_config.csv",
  "csv/building_config.csv",
  "csv/machine_config.csv",
  "csv/spirit_base.csv",
  "csv/spirit_bond_level.csv",
  "csv/spirit_mood_param.csv",
  "csv/spirit_voice_bank.csv",
  "csv/spirit_event.csv",
  "csv/spirit_memory_flag.csv",
  "csv/spirit_job_mastery.csv",
  "csv/spirit_expedition.csv",
  "csv/spirit_ecology_combo.csv",
  "csv/early_reward_pacing.csv",
  "csv/year2_goal_book_rule.csv",
  "csv/year2_solar_trial.csv",
  "csv/rare_spirit_event_action.csv",
  "csv/freeplay_goal.csv",
  "csv/shop_customer.csv",
  "csv/customer_segment_rule.csv",
  "csv/customer_behavior_param.csv",
  "csv/customer_state_flow.csv",
  "csv/customer_archetype_profile.csv",
  "csv/npc_bark.csv",
  "csv/shop_price_rule.csv",
  "csv/shop_shelf_theme_bonus.csv",
  "csv/shop_customer_feedback_diagnosis.csv",
  "csv/order_config.csv",
  "csv/year2_order_config.csv",
  "csv/year2_shop_season.csv",
  "csv/year2_shop_settlement_rule.csv",
  "csv/year2_shop_rank_reward.csv",
  "csv/reward_pool.csv",
  "csv/favor_reward.csv",
  "csv/npc_base.csv",
  "csv/npc_schedule.csv",
  "csv/cohab_epilogue.csv",
  "csv/cohab_weekly_event.csv",
  "csv/cohab_festival_event.csv",
  "csv/cohab_dialogue_map.csv",
  "csv/cutscene_timeline.csv",
  "csv/cutscene_asset_manifest.csv",
  "csv/side_quest_cutscene_beat.csv",
  "csv/audio_asset_list.csv",
  "csv/audio_mix_bus.csv",
  "csv/final_support_bundle.csv",
  "csv/final_support_stage.csv",
  "csv/side_quest_dialogue_map.csv",
  "csv/dialogue_group.csv",
  "csv/quest_base.csv",
  "csv/quest_step.csv",
  "csv/side_quest_base.csv",
  "csv/side_quest_step.csv",
  "csv/side_quest_event_trigger.csv",
  "csv/dungeon_area.csv",
  "csv/enemy_config.csv",
  "csv/loot_pool.csv",
  "csv/boss_config.csv",
  "csv/boss_skill.csv",
  "csv/spirit_skill.csv",
  "csv/dungeon_solar_mechanic.csv",
  "csv/interrealm_trade_route.csv",
  "csv/trade_route_event.csv",
  "csv/trade_route_risk_supply.csv",
  "csv/hidden_dungeon_rotation.csv",
  "csv/event_trigger.csv",
  "csv/guide_script.csv",
  "csv/solar_term_config.csv",
  "csv/weather_config.csv",
  "csv/localization_text.csv",
  "csv/demo_qa_checklist.csv",
  "csv/steam_asset_production_plan.csv",
  "csv/achievement_config.csv",
  "csv/vertical_slice_acceptance.csv",
  "csv/release_readiness_gate.csv",
  "csv/save_schema_registry.csv",
  "csv/save_migration_plan.csv",
  "csv/localization_coverage_plan.csv",
  "csv/community_content_calendar.csv",
  "csv/condition_group.csv",
];

function copyEntry(source) {
  if (!existsSync(source)) throw new Error(`Missing package source: ${source}`);
  const target = join(outDir, source);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
  copied.push(source);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const entry of include) copyEntry(entry);

const manifest = {
  name: "仙农洞天：精怪工坊 Demo",
  version: "0.2.0-demo",
  phase: "P0/P1 Demo Foundation",
  generated_at: new Date().toISOString(),
  launch: "node tools/dev-server.mjs",
  url: "http://127.0.0.1:4173",
  files: copied.map((file) => {
    const path = join(outDir, file);
    return {
      path: file,
      kind: statSync(path).isDirectory() ? "directory" : "file",
      name: basename(file),
    };
  }),
  release_gates: [
    "P0 core loop playable",
    "Local save/load available",
    "Demo mission and NPC dialogue connected",
    "Shop pricing, shelf theme, and customer diagnosis data connected",
    "Customer segmentation, behavior state flow, and bark data connected",
    "Year-two shop season settlement, rank rewards, and advanced orders connected",
    "Order board and delivery rewards connected",
    "NPC favor and relationship rewards connected",
    "NPC schedules, side-quest dialogue hints, cohabitation, and festival event previews connected",
    "CSV-driven cutscene timeline, side cutscene beats, audio asset keys, and skippable playback connected",
    "CSV-driven audio mix buses, per-bus settings, and WebAudio bus routing connected",
    "Final support bundles, finale stages, NPC favor gates, and ending cutscene hooks connected",
    "CSV-driven main quest steps and side quest triggers connected",
    "Spirit mood, feeding, petting, bond, and voice data connected",
    "Spirit individual events, memory flags, event rewards, and memory bonuses connected",
    "Spirit job mastery, expedition, and ecology combo data connected",
    "Early reward pacing, year-two goal book, freeplay goals, and rare spirit events connected",
    "Year-two solar trial scoring, challenge duration, rank reward, and save state connected",
    "Solar term weather effects and Steam capture presets connected",
    "Solar term risk events and mitigation UI connected",
    "Dungeon exploration, enemy, loot, boss skill, and spirit combat skill data connected",
    "Cross-realm trade route, supply risk, route event, and hidden dungeon rotation data connected",
    "Building construction and workshop machine data connected",
    "Local achievement profile and Steam Cloud mirror prepared",
    "Versioned save schema registry, migration plan, and cloud payload schema report connected",
    "Localization coverage plan, key scanning, and in-game localization QA panel connected",
    "Community content calendar, channel CTA cadence, and asset readiness checks connected",
    "CSV-driven condition groups and in-game condition QA panel connected",
    "QA and Steam asset planning files included",
  ],
};

writeFileSync(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifest, null, 2), "utf8");

console.log(`Demo package created: ${outDir}`);
console.log(`Included ${copied.length} entries.`);
