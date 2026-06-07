# CSV Import Notes

This folder contains the current production-facing configuration package for the first-release scope.

## Included tables
- `item_base.csv`
- `crop_config.csv`
- `recipe_config.csv`
- `spirit_base.csv`
- `spirit_skill.csv`
- `building_config.csv`
- `machine_config.csv`
- `shop_customer.csv`
- `order_config.csv`
- `reward_pool.csv`
- `npc_base.csv`
- `npc_schedule.csv`
- `solar_term_config.csv`
- `weather_config.csv`
- `event_trigger.csv`
- `quest_base.csv`
- `quest_step.csv`
- `dialogue_group.csv`
- `favor_reward.csv`
- `guide_script.csv`
- `dungeon_area.csv`
- `enemy_config.csv`
- `boss_config.csv`
- `boss_skill.csv`
- `loot_pool.csv`
- `condition_group.csv`
- `localization_text.csv`
- `npc_bark.csv`
- `shop_feedback.csv`
- `customer_state_flow.csv`
- `side_quest_base.csv`
- `side_quest_step.csv`
- `side_quest_dialogue_map.csv`
- `side_quest_event_trigger.csv`
- `spirit_event.csv`
- `spirit_voice_bank.csv`
- `spirit_memory_flag.csv`
- `spirit_mood_param.csv`
- `customer_behavior_param.csv`
- `event_template.csv`
- `final_support_bundle.csv`
- `cutscene_timeline.csv`
- `customer_segment_rule.csv`
- `shop_price_rule.csv`
- `shop_shelf_theme_bonus.csv`
- `year2_content_plan.csv`
- `cohab_epilogue.csv`
- `interrealm_trade_route.csv`
- `year2_order_config.csv`
- `trade_route_risk_supply.csv`
- `cohab_dialogue_map.csv`
- `year2_shop_season.csv`
- `year2_shop_rank_reward.csv`
- `cohab_weekly_event.csv`
- `year2_shop_settlement_rule.csv`
- `trade_route_event.csv`
- `hidden_dungeon_rotation.csv`
- `spirit_bond_level.csv`
- `spirit_job_mastery.csv`
- `spirit_ecology_combo.csv`
- `spirit_expedition.csv`
- `year2_solar_trial.csv`
- `freeplay_goal.csv`
- `customer_tag_taxonomy.csv`
- `customer_archetype_profile.csv`
- `side_quest_cutscene_beat.csv`
- `final_support_stage.csv`
- `cutscene_asset_manifest.csv`
- `localization_coverage_plan.csv`
- `save_schema_registry.csv`
- `save_migration_plan.csv`
- `audio_asset_list.csv`
- `audio_mix_bus.csv`
- `community_content_calendar.csv`
- `demo_qa_checklist.csv`
- `steam_asset_production_plan.csv`
- `design_improvement_backlog.csv`

## Rules
- Column names use `snake_case`
- Runtime display text should prefer `*_key`
- Multi-value fields use `|`
- Condition expressions stay as strings until the condition parser is implemented
- IDs should stay stable once referenced by quests, events, or save data

## Suggested import order
1. `item_base.csv`
2. `crop_config.csv`
3. `recipe_config.csv`
4. `spirit_base.csv`
5. `spirit_skill.csv`
6. `building_config.csv`
7. `machine_config.csv`
8. `npc_base.csv`
9. `npc_schedule.csv`
10. `shop_customer.csv`
11. `solar_term_config.csv`
12. `weather_config.csv`
13. `order_config.csv`
14. `reward_pool.csv`
15. `quest_base.csv`
16. `quest_step.csv`
17. `favor_reward.csv`
18. `dialogue_group.csv`
19. `guide_script.csv`
20. `dungeon_area.csv`
21. `enemy_config.csv`
22. `boss_config.csv`
23. `boss_skill.csv`
24. `loot_pool.csv`
25. `condition_group.csv`
26. `localization_text.csv`
27. `npc_bark.csv`
28. `shop_feedback.csv`
29. `customer_state_flow.csv`
30. `side_quest_base.csv`
31. `side_quest_step.csv`
32. `side_quest_dialogue_map.csv`
33. `side_quest_event_trigger.csv`
34. `spirit_event.csv`
35. `spirit_voice_bank.csv`
36. `spirit_memory_flag.csv`
37. `spirit_mood_param.csv`
38. `customer_behavior_param.csv`
39. `event_template.csv`
40. `final_support_bundle.csv`
41. `cutscene_timeline.csv`
42. `customer_segment_rule.csv`
43. `shop_price_rule.csv`
44. `shop_shelf_theme_bonus.csv`
45. `year2_content_plan.csv`
46. `cohab_epilogue.csv`
47. `interrealm_trade_route.csv`
48. `year2_order_config.csv`
49. `trade_route_risk_supply.csv`
50. `cohab_dialogue_map.csv`
51. `year2_shop_season.csv`
52. `year2_shop_rank_reward.csv`
53. `cohab_weekly_event.csv`
54. `year2_shop_settlement_rule.csv`
55. `trade_route_event.csv`
56. `hidden_dungeon_rotation.csv`
57. `spirit_bond_level.csv`
58. `spirit_job_mastery.csv`
59. `spirit_ecology_combo.csv`
60. `spirit_expedition.csv`
61. `year2_solar_trial.csv`
62. `freeplay_goal.csv`
63. `customer_tag_taxonomy.csv`
64. `customer_archetype_profile.csv`
65. `side_quest_cutscene_beat.csv`
66. `final_support_stage.csv`
67. `cutscene_asset_manifest.csv`
68. `localization_coverage_plan.csv`
69. `save_schema_registry.csv`
70. `save_migration_plan.csv`
71. `audio_mix_bus.csv`
72. `audio_asset_list.csv`
73. `community_content_calendar.csv`
74. `demo_qa_checklist.csv`
75. `steam_asset_production_plan.csv`
76. `design_improvement_backlog.csv`
77. `event_trigger.csv`

## Latest package additions
- `event_template.csv`
- `spirit_mood_param.csv`
- `side_quest_event_trigger.csv`
- `final_support_bundle.csv`
- `cutscene_timeline.csv`
- `customer_segment_rule.csv`
- `shop_price_rule.csv`
- `shop_shelf_theme_bonus.csv`
- `year2_content_plan.csv`
- `cohab_epilogue.csv`
- `interrealm_trade_route.csv`
- `year2_order_config.csv`
- `trade_route_risk_supply.csv`
- `cohab_dialogue_map.csv`
- `year2_shop_season.csv`
- `year2_shop_rank_reward.csv`
- `cohab_weekly_event.csv`
- `year2_shop_settlement_rule.csv`
- `trade_route_event.csv`
- `hidden_dungeon_rotation.csv`
- `spirit_bond_level.csv`
- `spirit_job_mastery.csv`
- `spirit_ecology_combo.csv`
- `spirit_expedition.csv`
- `year2_solar_trial.csv`
- `freeplay_goal.csv`
- `customer_tag_taxonomy.csv`
- `customer_archetype_profile.csv`
- `side_quest_cutscene_beat.csv`
- `final_support_stage.csv`
- `cutscene_asset_manifest.csv`
- `localization_coverage_plan.csv`
- `save_schema_registry.csv`
- `save_migration_plan.csv`
- `audio_asset_list.csv`
- `audio_mix_bus.csv`
- `community_content_calendar.csv`
- `demo_qa_checklist.csv`
- `steam_asset_production_plan.csv`
- `design_improvement_backlog.csv`

These tables move the package from "design complete" closer to "runtime ready":
- `event_template.csv` gives reusable trigger and execution blueprints for main story, side quests, and ending content.
- `spirit_mood_param.csv` centralizes spirit hunger, mood, strike, and recovery tuning.
- `side_quest_event_trigger.csv` provides entry hooks for side content instead of relying only on static quest docs.
- `final_support_bundle.csv` connects final-chapter NPC relationship payoffs to actual gameplay effects.
- `cutscene_timeline.csv` translates major scripted scenes into shot-by-shot runtime hooks.
- `customer_segment_rule.csv`, `shop_price_rule.csv`, and `shop_shelf_theme_bonus.csv` deepen the shop simulation into a more production-grade economy layer.
- `year2_content_plan.csv`, `cohab_epilogue.csv`, and `interrealm_trade_route.csv` extend the package beyond first-year completion into long-term retention and post-ending gameplay.
- `year2_order_config.csv`, `trade_route_risk_supply.csv`, and `cohab_dialogue_map.csv` push Year 2 content from concept level down to implementation-facing live tables.
- `year2_shop_season.csv`, `year2_shop_rank_reward.csv`, and `cohab_weekly_event.csv` add the recurring ranking loop and weekly relationship content needed for longer-term retention.
- `year2_shop_settlement_rule.csv`, `trade_route_event.csv`, and `hidden_dungeon_rotation.csv` extend Year 2 into clearer settlement feedback and long-term exploration rotation.
- `spirit_bond_level.csv`, `spirit_job_mastery.csv`, and `spirit_ecology_combo.csv` turn spirits into long-term post-story progression instead of one-time automation helpers.
- `spirit_expedition.csv`, `year2_solar_trial.csv`, and `freeplay_goal.csv` add post-main-story repeatable goals across expeditions, solar-term challenges, and completionist play.
- `customer_tag_taxonomy.csv` and `customer_archetype_profile.csv` deepen shop customers into tag-driven demand groups.
- `side_quest_cutscene_beat.csv`, `final_support_stage.csv`, and `cutscene_asset_manifest.csv` move side quests and the finale closer to production-ready staging.
- `localization_coverage_plan.csv` makes key coverage trackable across UI, systems, narrative, and marketing.
- `save_schema_registry.csv` and `save_migration_plan.csv` add save compatibility planning for long-term systems.
- `audio_asset_list.csv` and `audio_mix_bus.csv` give audio production a concrete starting asset list and mix structure.
- `community_content_calendar.csv`, `demo_qa_checklist.csv`, and `steam_asset_production_plan.csv` connect the GDD to Demo, community, and Steam launch execution.
- `design_improvement_backlog.csv` turns the latest gameplay richness and reward-feedback audit into actionable production tasks.

## 2026-06-02 publishing-readiness additions
- `early_reward_pacing.csv`
- `year2_goal_book_rule.csv`
- `rare_spirit_event_action.csv`
- `shop_customer_feedback_diagnosis.csv`
- `dungeon_solar_mechanic.csv`

These tables address the five highest-priority production gaps from the latest audit:
- `early_reward_pacing.csv` turns the first three hours into testable reward beats for Demo retention.
- `year2_goal_book_rule.csv` makes post-story free play readable through the Year 2 goal book.
- `rare_spirit_event_action.csv` gives rare spirits event stages, actions, gifts, and production ownership.
- `shop_customer_feedback_diagnosis.csv` makes customer tags, pricing, shelf themes, and shop results explainable to players.
- `dungeon_solar_mechanic.csv` differentiates dungeons through solar-term rules, spirit puzzle roles, rewards, and world changes.

## Development and release gate additions
- `release_readiness_gate.csv`
- `vertical_slice_acceptance.csv`
- `achievement_config.csv`

These tables make the package executable by production:
- `release_readiness_gate.csv` defines stage gates from project approval to Release.
- `vertical_slice_acceptance.csv` defines concrete acceptance criteria for the first three playable hours.
- `achievement_config.csv` maps demo milestones to Steam achievement API names and local unlock triggers.
