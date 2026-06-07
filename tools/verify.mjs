import { readFileSync } from "node:fs";
import { existsSync, statSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "ARCHITECTURE_MIGRATION.md",
  "tsconfig.json",
  "src/game.js",
  "src/styles.css",
  "src/core/combat/dungeon-runtime.ts",
  "src/core/data/runtime-data.ts",
  "src/core/farming/farming-runtime.ts",
  "src/core/npc/npc-runtime.ts",
  "src/core/persistence/save-runtime.ts",
  "src/core/quests/quest-runtime.ts",
  "src/core/shop/shop-runtime.ts",
  "src/runtime/xiannong-core.js",
  "runtime-data/runtime-data.json",
  "tools/build-runtime-data.mjs",
  "tools/generate-assets.mjs",
  "tools/package-demo.mjs",
  "tools/package-standalone.mjs",
  "tools/package-desktop-shell.mjs",
  "tools/package-steam-rc.mjs",
  "tools/package-steam-depot.mjs",
  "tools/steam-release-config.mjs",
  "tools/windows-release-config.mjs",
  "tools/package-windows-staging.mjs",
  "tools/windows-preflight.mjs",
  "tools/generate-qa-evidence.mjs",
  "tools/generate-manual-qa-evidence.mjs",
  "tools/generate-final-capture-evidence.mjs",
  "tools/smoke-longrun.mjs",
  "tools/smoke-desktop-json-save.mjs",
  "tools/steam-preflight.mjs",
  "tools/generate-windows-icon.py",
  "desktop-shell/main.mjs",
  "desktop-shell/json-save-core.mjs",
  "desktop-shell/preload.cjs",
  "desktop-shell/package.template.json",
  "desktop-shell/README_DESKTOP_SHELL.md",
  "steam-release.config.example.json",
  "windows-release.config.example.json",
  "assets/asset-manifest.json",
  "assets/capsule-main.svg",
  "assets/spirit-luobo.svg",
  "assets/crop-bailuobo.svg",
  "assets/crop-baicai.svg",
  "assets/shop-sign.svg",
  "assets/customer-villager.svg",
  "assets/control-hints.svg",
  "assets/npc-xubo.svg",
  "assets/npc-zhang-tieshan.svg",
  "assets/npc-baizhi.svg",
  "assets/npc-lu-sanxiao.svg",
  "assets/npc-hu-sihai.svg",
  "assets/npc-atan.svg",
  "assets/npc-qinghe.svg",
  "assets/npc-shen-gudeng.svg",
  "assets/screenshot-farm.svg",
  "assets/screenshot-spirit.svg",
  "assets/screenshot-shop.svg",
  "assets/screenshot-term.svg",
  "assets/screenshot-ecology.svg",
  "assets/screenshot-dungeon.svg",
  "assets/screenshot-trade.svg",
  "assets/screenshot-final-support.svg",
  "assets/steam-ready/STEAM_ASSET_README.md",
  "assets/steam-ready/source-svg/store-header-capsule-920x430.svg",
  "assets/steam-ready/source-svg/store-small-capsule-462x174.svg",
  "assets/steam-ready/source-svg/store-main-capsule-1232x706.svg",
  "assets/steam-ready/source-svg/store-vertical-capsule-748x896.svg",
  "assets/steam-ready/source-svg/library-capsule-600x900.svg",
  "assets/steam-ready/source-svg/library-header-920x430.svg",
  "assets/steam-ready/source-svg/library-hero-3840x1240.svg",
  "assets/steam-ready/source-svg/screenshot-farm-1920x1080.svg",
  "assets/steam-ready/source-svg/screenshot-spirit-1920x1080.svg",
  "assets/steam-ready/source-svg/screenshot-shop-1920x1080.svg",
  "assets/steam-ready/source-svg/screenshot-term-1920x1080.svg",
  "assets/steam-ready/source-svg/screenshot-ecology-1920x1080.svg",
  "assets/steam-ready/source-svg/screenshot-dungeon-1920x1080.svg",
  "assets/steam-ready/source-svg/screenshot-trade-1920x1080.svg",
  "assets/steam-ready/source-svg/screenshot-final-support-1920x1080.svg",
  "assets/steam-ready/png/store-header-capsule-920x430.png",
  "assets/steam-ready/png/store-small-capsule-462x174.png",
  "assets/steam-ready/png/store-main-capsule-1232x706.png",
  "assets/steam-ready/png/store-vertical-capsule-748x896.png",
  "assets/steam-ready/png/library-capsule-600x900.png",
  "assets/steam-ready/png/library-header-920x430.png",
  "assets/steam-ready/png/library-hero-3840x1240.png",
  "assets/steam-ready/png/screenshot-farm-1920x1080.png",
  "assets/steam-ready/png/screenshot-spirit-1920x1080.png",
  "assets/steam-ready/png/screenshot-shop-1920x1080.png",
  "assets/steam-ready/png/screenshot-term-1920x1080.png",
  "assets/steam-ready/png/screenshot-ecology-1920x1080.png",
  "assets/steam-ready/png/screenshot-dungeon-1920x1080.png",
  "assets/steam-ready/png/screenshot-trade-1920x1080.png",
  "assets/steam-ready/png/screenshot-final-support-1920x1080.png",
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
  "csv/steam_asset_production_plan.csv",
  "csv/achievement_config.csv",
  "csv/demo_qa_checklist.csv",
  "csv/vertical_slice_acceptance.csv",
  "csv/release_readiness_gate.csv",
  "csv/save_schema_registry.csv",
  "csv/save_migration_plan.csv",
  "csv/localization_coverage_plan.csv",
  "csv/community_content_calendar.csv",
  "csv/condition_group.csv",
];

const requiredGameTerms = [
  "DATA_FILES",
  "SAVE_KEY",
  "SETTINGS_KEY",
  "ERROR_LOG_KEY",
  "BUILD_INFO",
  "CAPTURE_SCENES",
  "ASSET_SOURCES",
  "STEAM_READY_ASSETS",
  "XIANNONG_EMBEDDED_CSV",
  "XIANNONG_EMBEDDED_ASSETS",
  "embeddedCsvText",
  "assetSrc",
  "AUDIO_CUES",
  "STORY_BEATS",
  "DEMO_MISSIONS",
  "NPC_STORY_EVENTS",
  "npc_event_xubo_first_recognition",
  "npc_event_baizhi_clean_crop",
  "npc_event_zhang_tieshan_workshop_fire",
  "npcStoryEvents",
  "scanNpcStoryEvents",
  "seed_lingqi_bailuobo",
  "seed_qingya_baicai",
  "recipe_qingchao_baicai",
  "recipe_liangban_lingqin",
  "item_food_liangban_lingqin",
  "order_demo_0002",
  "first_lingqin_dish_crafted",
  "spirit_luobo_01",
  "spirit_lajiao_01",
  "second_spirit",
  "spiritAssist",
  "spiritAssistRunPlots",
  "createSpiritInstance",
  "unlockSecondSpirit",
  "chiliSpiritHearthWorldSpec",
  "drawChiliSpiritHearthWorld",
  "focusChiliSpiritHearthWorldFromCanvas",
  "灶火椒灵火候台",
  "spirit_event_lajiao_01",
  "lajiaoHearthTheaterWorldSpec",
  "drawLajiaoHearthTheaterWorld",
  "focusLajiaoHearthTheaterWorldFromCanvas",
  "data-spirit-event-row",
  "辣椒火灵看火小剧场",
  "firstTwoSpiritDuoWorldSpec",
  "drawFirstTwoSpiritDuoWorld",
  "focusFirstTwoSpiritDuoWorldFromCanvas",
  "萝卜精 x 辣椒火灵协作小景",
  "双精怪协作",
  "petSpirit",
  "feedSpirit",
  "warmthLine",
  "memoryLine",
  "掌心灵花",
  "第一次伙伴回应已写入记忆",
  "spiritById",
  "data-spirit-id",
  "addBondExp",
  "assignSpiritJob",
  "addJobExp",
  "jobEfficiency",
  "spiritConfigFor",
  "spiritMainJob",
  "spiritLineJobAffinity",
  "spiritJobSpecialtyBonus",
  "spiritJobSpecialtyLabel",
  "spiritJobPersonaSpec",
  "spiritAutomationPromenadeSpec",
  "spiritAutomationPromenadeMarkup",
  "focusAutomationJobLine",
  "data-automation-job-line",
  "精怪自动化巡演牌",
  "六线岗位",
  "不会自动切岗、派工、排产、开铺、发商队、处理风险、入夜或消耗资源",
  "spiritSeasonalWorkMomentSpec",
  "spirit-seasonal-work",
  "天气小动作",
  "挡雨大叶",
  "蒲叶小扇",
  "雾里小灯",
  "暖手小炉",
  "spiritJobWorkPower",
  "spendSpiritJobNeeds",
  "claimedSpiritJobGoals",
  "spiritJobGoalRows",
  "spiritJobProgress",
  "spiritJobGoalReady",
  "spiritJobGoalClaimed",
  "spiritJobGoalRewardText",
  "claimSpiritJobGoal",
  "data-spirit-job-goal",
  "spiritJobMilestones",
  "spiritJobMilestoneScene",
  "spiritJobMilestoneType",
  "applySpiritJobMilestone",
  "drawSpiritJobMilestones",
  "spirit_job_milestone",
  "completedSpiritJobTasks",
  "spiritJobTaskText",
  "spiritJobTaskReady",
  "spiritJobTaskRewardText",
  "completeSpiritJobTask",
  "data-spirit-job-task",
  "settleSpiritJobs",
  "settleFarmSpiritJob",
  "settleWorkshopSpiritJob",
  "settleShopSpiritJob",
  "settlePatrolSpiritJob",
  "settleExpeditionSpiritJob",
  "settleGardenSpiritJob",
  "lastSpiritJobReport",
  "lastSpiritJobSynergy",
  "spiritJobSynergyLine",
  "applySpiritJobSynergies",
  "spiritJobSynergyForSpirit",
  "spiritNightWorkFeedback",
  "spiritNightWorkFeedbackSpec",
  "triggerSpiritNightWorkFeedback",
  "activeSpiritNightWorkFeedback",
  "drawSpiritNightWorkFeedback",
  "精怪夜勤回声",
  "failureCodexState",
  "createInitialFailureCodexState",
  "normalizeFailureCodexState",
  "recordFailureCodexEntry",
  "failureCodexRows",
  "failureLearningTriptychSpec",
  "failureLearningTriptychMarkup",
  "失败学习三联牌",
  "为什么没稳住",
  "带回了什么",
  "下一步怎么补",
  "商队/远征",
  "不会自动领取托底、交付订单、开铺、处理风险、发商队、进入秘境或消耗资源",
  "failureCodexWorldBoardSpec",
  "failureCodexWorldBoardAtCanvasPoint",
  "focusFailureCodexWorldBoardFromCanvas",
  "drawFailureCodexWorldBoard",
  "failureRecoveryRouteWorldSpec",
  "failureRecoveryRouteWorldAtCanvasPoint",
  "focusFailureRecoveryRouteWorldFromCanvas",
  "drawFailureRecoveryRouteWorld",
  "failureMercyLanternWorldSpec",
  "failureMercyLanternWorldAtCanvasPoint",
  "focusFailureMercyLanternWorldFromCanvas",
  "drawFailureMercyLanternWorld",
  "failureMercyLanternWorldFocus",
  "失败托底路线图",
  "失败不白走灯",
  "先稳住",
  "再试路",
  "只安抚、解释和定位",
  "托底奖励",
  "看见问题",
  "学到线索",
  "readyOrderWorldBoardSpec",
  "readyOrderWorldBoardAtCanvasPoint",
  "focusReadyOrderWorldBoardFromCanvas",
  "drawReadyOrderWorldBoard",
  "主世界可交订单",
  "点选可交订单",
  "可交单 · 可点",
  "readyOrderSealWorldFocus",
  "readyOrderSealSafetyText",
  "readyOrderSealNodes",
  "readyOrderSealWorldSpec",
  "readyOrderSealWorldAtCanvasPoint",
  "focusReadyOrderSealWorldFromCanvas",
  "drawReadyOrderSealWorld",
  "drawReadyOrderSealWorld(ctx",
  "订单备齐封签小景",
  "备齐货物 -> 打包封签 -> 手动交付",
  "只定位订单卡和交付按钮",
  "不会自动交单、扣除物品、发放奖励、推进剧情、开铺、入夜或消耗资源",
  "orderDeliveryEchoWorldFocus",
  "orderDeliveryEchoSafetyText",
  "orderDeliveryEchoSpec",
  "recordOrderDeliveryEcho",
  "orderDeliveryEchoWorldSpec",
  "orderDeliveryEchoWorldAtCanvasPoint",
  "focusOrderDeliveryEchoWorldFromCanvas",
  "drawOrderDeliveryEchoWorld",
  "drawOrderDeliveryEchoWorld(ctx",
  "订单交付回响留签",
  "只回看订单结果和定位订单板",
  "不会再次交单、扣除物品、发放奖励、增加好感、推进剧情、开铺、入夜或消耗资源",
  "orderRewardNextUseWorldFocus",
  "orderRewardNextUseSafetyText",
  "orderRewardNextUseSeedCandidate",
  "orderRewardNextUseCandidate",
  "orderRewardNextUseWorldSpec",
  "orderRewardNextUseWorldAtCanvasPoint",
  "focusOrderRewardNextUseWorldFromCanvas",
  "drawOrderRewardNextUseWorld",
  "drawOrderRewardNextUseWorld(ctx",
  "回款下一步",
  "回款入账 -> 补下一步 -> 手动确认",
  "只定位下一步面板或选中种子/配方",
  "不会自动买种、播种、加工、交单、上架、开铺、扣钱、扣材料、发奖励、入夜或消耗资源",
  "orderRewardReinvestTrailWorldFocus",
  "orderRewardReinvestTrailSafetyText",
  "orderRewardReinvestTrailWorldSpec",
  "orderRewardReinvestTrailWorldAtCanvasPoint",
  "focusOrderRewardReinvestTrailWorldFromCanvas",
  "drawOrderRewardReinvestTrailWorld",
  "drawOrderRewardReinvestTrailWorld(ctx",
  "回款再投入账串",
  "回款入账 -> 再投入 -> 手动确认",
  "只定位订单板、旧铺、种子栏或配方栏",
  "seedRestockBagWorldFocus",
  "seedRestockBagSafetyText",
  "seedRestockBagFeedbackSpec",
  "recordSeedRestockFeedback",
  "seedRestockBagWorldSpec",
  "seedRestockBagWorldAtCanvasPoint",
  "focusSeedRestockBagWorldFromCanvas",
  "drawSeedRestockBagWorld",
  "drawSeedRestockBagWorld(ctx",
  "补种入袋去向签",
  "种子入袋 -> 点空田 -> 手动播种",
  "只定位种子栏、空田和播种按钮",
  "不会自动播种、买种、浇水、入夜、扣除种子、扣除体力或消耗资源",
  "plantingAftercareWorldFocus",
  "plantingAftercareSafetyText",
  "plantingAftercareFeedbackSpec",
  "recordPlantingAftercareFeedback",
  "plantingAftercareWorldSpec",
  "plantingAftercareWorldAtCanvasPoint",
  "focusPlantingAftercareWorldFromCanvas",
  "drawPlantingAftercareWorld",
  "drawPlantingAftercareWorld(ctx",
  "落土补水签",
  "种子落土 -> 补水 -> 入夜成长",
  "只定位已播田块、补水按钮或入夜按钮",
  "不会自动浇水、入夜、播种、扣除体力、推进天数或消耗资源",
  "manualWaterAfterglowWorldFocus",
  "manualWaterAfterglowSafetyText",
  "manualWaterAfterglowFeedbackSpec",
  "recordManualWaterAfterglowFeedback",
  "manualWaterAfterglowWorldSpec",
  "manualWaterAfterglowWorldAtCanvasPoint",
  "focusManualWaterAfterglowWorldFromCanvas",
  "drawManualWaterAfterglowWorld",
  "drawManualWaterAfterglowWorld(ctx",
  "补水润田入夜签",
  "水痕已稳 -> 手动入夜 -> 明晨长势",
  "只定位已润田块和入夜按钮",
  "不会自动入夜、浇水、收获、推进天数、扣除体力或消耗资源",
  "morningGrowthDewWorldFocus",
  "morningGrowthDewSafetyText",
  "morningGrowthDewWorldSpec",
  "morningGrowthDewWorldAtCanvasPoint",
  "focusMorningGrowthDewWorldFromCanvas",
  "drawMorningGrowthDewWorld",
  "drawMorningGrowthDewWorld(ctx",
  "晨露长势牌",
  "夜间成长 -> 成熟亮起 -> 手动收获",
  "夜间成长 -> 今日补水 -> 等待成熟",
  "只定位田块、收获按钮或补水按钮",
  "不会自动收获、浇水、入夜、播种、扣除体力、推进天数或消耗资源",
  "harvestStorageRouteWorldFocus",
  "harvestStorageRouteSafetyText",
  "harvestStorageRouteFeedbackSpec",
  "recordHarvestStorageRouteFeedback",
  "harvestStorageRouteWorldSpec",
  "harvestStorageRouteWorldAtCanvasPoint",
  "focusHarvestStorageRouteWorldFromCanvas",
  "drawHarvestStorageRouteWorld",
  "drawHarvestStorageRouteWorld(ctx",
  "收获入仓去向留签",
  "手动收获 -> 入仓清点 ->",
  "只定位背包、订单板、配方栏或旧铺货签",
  "不会自动交单、加工、上架、开铺、售卖、扣库存、发奖励、入夜或消耗资源",
  "orderCraftPrepWorldBoardSpec",
  "orderCraftPrepWorldBoardAtCanvasPoint",
  "focusOrderCraftPrepWorldBoardFromCanvas",
  "drawOrderCraftPrepWorldBoard",
  "主世界订单缺口可入锅",
  "点选订单缺口可入锅",
  "缺口可入锅 · 可点",
  "orderSeedPrepWorldBoardSpec",
  "orderSeedPrepWorldBoardAtCanvasPoint",
  "focusOrderSeedPrepWorldBoardFromCanvas",
  "drawOrderSeedPrepWorldBoard",
  "主世界订单缺口可播种",
  "点选订单缺口可下种",
  "缺口可下种 · 可点",
  "orderSeedRestockWorldBoardSpec",
  "orderSeedRestockWorldBoardAtCanvasPoint",
  "focusOrderSeedRestockWorldBoardFromCanvas",
  "drawOrderSeedRestockWorldBoard",
  "主世界订单缺口种子可补货",
  "点选订单缺口补种",
  "缺口先补种 · 可点",
  "orderMarketPrepWorldBoardSpec",
  "orderMarketPrepWorldBoardAtCanvasPoint",
  "focusOrderMarketPrepWorldBoardFromCanvas",
  "drawOrderMarketPrepWorldBoard",
  "主世界订单缺口市集备料",
  "点选订单市集备料",
  "市集备料 · 可点",
  "orderGapSupplyRouteWorldFocus",
  "orderGapSupplyRouteSafetyText",
  "orderGapSupplyRouteCandidate",
  "orderGapSupplyRouteWorldSpec",
  "orderGapSupplyRouteWorldAtCanvasPoint",
  "focusOrderGapSupplyRouteWorldFromCanvas",
  "drawOrderGapSupplyRouteWorld",
  "drawOrderGapSupplyRouteWorld(ctx",
  "订单缺口补料路线",
  "订单缺口",
  "补料入口",
  "回板确认",
  "只定位订单板、配方栏、种子栏、补种提示或建造面板",
  "不会自动补料、购买、播种、加工、建造、交单、开铺、入夜或消耗资源",
  "orderBuildPrepWorldBoardSpec",
  "orderBuildPrepWorldBoardAtCanvasPoint",
  "focusOrderBuildPrepWorldBoardFromCanvas",
  "drawOrderBuildPrepWorldBoard",
  "orderBuildPrepBlueprintTarget",
  "orderBuildPrepBlueprintAtCanvasPoint",
  "focusOrderBuildPrepBlueprintFromCanvas",
  "drawOrderBuildPrepBlueprint",
  "主世界订单缺口需建工坊",
  "点选订单工坊缺口",
  "点选订单工坊蓝图",
  "订单工坊蓝图",
  "先建工坊 · 可点",
  "workshopOrderQueueWorldBoardSpec",
  "workshopOrderQueueWorldBoardAtCanvasPoint",
  "focusWorkshopOrderQueueWorldBoardFromCanvas",
  "drawWorkshopOrderQueueWorldBoard",
  "主世界订单锅排产",
  "点选订单锅排产",
  "订单锅在烧 · 可点",
  "workshopReadyOrderDispatchWorldSpec",
  "workshopReadyOrderDispatchWorldAtCanvasPoint",
  "focusWorkshopReadyOrderDispatchWorldFromCanvas",
  "drawWorkshopReadyOrderDispatchWorld",
  "主世界出锅可交单",
  "点选出锅交单车",
  "出锅交单 · 可点",
  "workshopOutputRouteTriptychWorldSpec",
  "workshopOutputRouteTriptychWorldAtCanvasPoint",
  "focusWorkshopOutputRouteTriptychWorldFromCanvas",
  "drawWorkshopOutputRouteTriptychWorld",
  "出锅去向三联签 · 可点",
  "订单去向",
  "旧铺去向",
  "备货再排产",
  "不会自动交单、开铺或继续加工",
  "workshopOutputStorageRouteWorldFocus",
  "workshopOutputStorageRouteSafetyText",
  "workshopOutputStorageRouteFeedbackSpec",
  "recordWorkshopOutputStorageRouteFeedback",
  "workshopOutputStorageRouteWorldSpec",
  "workshopOutputStorageRouteWorldAtCanvasPoint",
  "focusWorkshopOutputStorageRouteWorldFromCanvas",
  "drawWorkshopOutputStorageRouteWorld",
  "成品入仓去向签 · 可点",
  "手动加工 -> 成品入仓 -> 订单可交",
  "夜间排产 -> 成品入仓",
  "只定位订单板、旧铺货签、配方栏或背包",
  "不会自动交单、开铺、上架、售卖、继续加工、排产、扣库存、发奖励、入夜或消耗资源",
  "shopShelfPrepWorldBoardSpec",
  "shopShelfPrepWorldBoardAtCanvasPoint",
  "focusShopShelfPrepWorldBoardFromCanvas",
  "drawShopShelfPrepWorldBoard",
  "主世界旧铺上架推荐",
  "点选旧铺上架推荐",
  "旧铺主推 · 可点",
  "shopWordOfMouthShelfPrepSpec",
  "主世界来帖头排推荐",
  "来帖头排 · 可点",
  "点选来帖头排推荐",
  "只定位旧铺市闻和来帖，不会自动开铺、接客、成交、改价、补货或消耗库存",
  "shopWordOfMouthMissingShelfSpec",
  "drawShopWordOfMouthMissingShelfWorldNote",
  "shop_word_of_mouth_missing_shelf_note",
  "来帖缺货签 · 可点",
  "市闻来客 -> 头排缺货 -> 先补路线",
  "只定位补货路线和市闻来帖，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存",
  "shopWordOfMouthReadyShelfEchoSpec",
  "drawShopWordOfMouthReadyShelfEchoWorldNote",
  "shop_word_of_mouth_ready_shelf_echo",
  "来帖头排备齐签 · 可点",
  "补货入仓 -> 头排备齐 -> 手动开铺",
  "只定位旧铺市闻、来帖和头排货签，不会自动开铺、接客、成交、改价、补货或消耗库存",
  "shopWordOfMouthSaleEchoWorldSpec",
  "shopWordOfMouthSaleEchoWorldAtCanvasPoint",
  "drawShopWordOfMouthSaleEchoWorld",
  "shop_word_of_mouth_sale_echo",
  "shopWordOfMouthSaleEchoWorldFocus",
  "来帖成交回响 · 可点",
  "市闻真的变成一笔买卖",
  "市闻传来",
  "来客认门",
  "头排接货",
  "成交入账",
  "点选来帖成交回响",
  "只回看旧铺报告和市闻来帖，不会自动开铺、接客、成交、改价、补货或消耗库存",
  "shopWordOfMouthSaleReasonWorldSpec",
  "shopWordOfMouthSaleReasonWorldAtCanvasPoint",
  "drawShopWordOfMouthSaleReasonWorld",
  "shop_word_of_mouth_sale_reason",
  "shopWordOfMouthSaleReasonWorldFocus",
  "来帖成交三因签 · 可点",
  "这单为什么能成",
  "话头命中",
  "头排有货",
  "买单成立",
  "点选来帖成交三因签",
  "只复盘成交原因和定位旧铺报告，不会自动开铺、接客、成交、改价、补货或消耗库存",
  "shopWordOfMouthFollowupRestockWorldSpec",
  "shopWordOfMouthFollowupRestockWorldAtCanvasPoint",
  "drawShopWordOfMouthFollowupRestockWorld",
  "shop_word_of_mouth_followup_restock",
  "shopWordOfMouthFollowupRestockWorldFocus",
  "来帖续货明日签 · 可点",
  "别让这股口碑断档",
  "今日卖出",
  "明日续货",
  "仍放头排",
  "点选来帖续货明日签",
  "只提示明日续货和定位旧铺报告，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存",
  "shopWordOfMouthMorningFollowupSpec",
  "shopWordOfMouthMorningFollowup",
  "shop_word_followup",
  "来帖续货清晨提醒",
  "昨天的口碑今天别断档",
  "清晨行动牌：来帖续货",
  "shopWordOfMouthMorningFollowupWorldSpec",
  "shopWordOfMouthMorningFollowupWorldAtCanvasPoint",
  "drawShopWordOfMouthMorningFollowupWorld",
  "shop_word_of_mouth_morning_followup",
  "shopWordOfMouthMorningFollowupWorldFocus",
  "来帖续货清晨灯 · 可点",
  "昨日卖出",
  "今晨续货",
  "点选来帖续货清晨灯",
  "只定位旧铺报告和来帖续货复盘，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存",
  "shop_customer_lesson",
  "旧铺明日改法",
  "清晨行动牌：旧铺明日改法",
  "看明日改法",
  "昨夜复盘 -> 今日先改 -> 手动开铺验证",
  "shopWordOfMouthRestockedMorningWorldSpec",
  "shopWordOfMouthRestockedMorningWorldAtCanvasPoint",
  "drawShopWordOfMouthRestockedMorningWorld",
  "shop_word_of_mouth_restocked_morning",
  "shopWordOfMouthRestockedMorningWorldFocus",
  "来帖续货备回签 · 可点",
  "货已经备回，口碑能接住",
  "已备回",
  "手动开铺",
  "点选来帖续货备回签",
  "只确认库存已备回并定位旧铺报告，不会自动上架、补货、开铺、接客、成交、改价或消耗库存",
  "shopWordOfMouthRestockCaughtWorldSpec",
  "shopWordOfMouthRestockCaughtWorldAtCanvasPoint",
  "drawShopWordOfMouthRestockCaughtWorld",
  "shop_word_of_mouth_restock_caught",
  "shopWordOfMouthRestockCaughtWorldFocus",
  "来帖续货接住签 · 可点",
  "昨天的口碑今天续上了",
  "备回上架",
  "来客再认",
  "续货成交",
  "点选来帖续货接住签",
  "只回看续货成交和定位旧铺报告，不会自动上架、开铺、接客、成交、改价、补货或消耗库存",
  "shopRestockRunnerWorldSpec",
  "shopRestockRunnerWorldAtCanvasPoint",
  "focusShopRestockRunnerWorldFromCanvas",
  "drawShopRestockRunnerWorld",
  "主世界旧铺补货跑腿",
  "点选旧铺补货跑腿",
  "补货跑腿 · 可点",
  "补货可完成 · 可点",
  "shopDiagnosisWorldBoardSpec",
  "shopDiagnosisWorldBoardAtCanvasPoint",
  "drawShopDiagnosisWorldBoard",
  "主世界旧铺诊断挂签",
  "诊断挂签 · 可点",
  "点选旧铺诊断挂签",
  "不会自动改价、补货或开铺",
  "失败见闻册",
  "失败见闻/补救小票",
  "点选失败见闻",
  "startSpiritExpedition",
  "ecologyComboActive",
  "activeEcologyShopAura",
  "ecologyShopAuraCustomerBias",
  "ecologyShopAuraBudgetBonus",
  "ecology_shop_aura",
  "庭院夜事余韵",
  "visitorBonus",
  "budgetBonus",
  "ecologyShopAura",
  "earlyRewardDone",
  "earlyRewardCompletedId",
  "earlyRewardFeedbackSpec",
  "triggerEarlyRewardFeedback",
  "earlyRewardPacingGuideSpec",
  "earlyRewardCadenceAuditSpec",
  "earlyRewardCadenceAuditMarkup",
  "focusEarlyRewardCadenceAudit",
  "early-reward-cadence-card",
  "data-early-cadence-focus",
  "前三小时奖励节奏诊断",
  "15 分钟检查",
  "桥接反馈",
  "newPlayerTutorWorldFocus",
  "guideScriptLine",
  "newPlayerTutorSafetyText",
  "newPlayerTutorWorldSpec",
  "newPlayerTutorWorldAtCanvasPoint",
  "focusNewPlayerTutorWorldFromCanvas",
  "drawNewPlayerTutorWorld",
  "drawNewPlayerTutorWorld(ctx",
  "新手三步口授牌",
  "清荒 -> 落种 -> 补水",
  "只口授前三步和定位当前入口，不会自动清理、播种、浇水、收获、入夜、扣体力、扣种子、推进任务或消耗资源",
  "prologueJourneyActionHint",
  "prologueJourneySpec",
  "firstOrderDeliveryDone",
  "commerceJourneyActionHint",
  "commerceJourneySpec",
  "earlyRewardWorldRoadsignTarget",
  "earlyRewardWorldRoadsignSpec",
  "drawEarlyRewardWorldRoadsign",
  "earlyRewardWorldRoadsignAtCanvasPoint",
  "focusEarlyRewardWorldRoadsignFromCanvas",
  "earlyRewardRhythmStripSpec",
  "drawEarlyRewardRhythmStrip",
  "earlyRewardRhythmStripAtCanvasPoint",
  "focusEarlyRewardRhythmStripFromCanvas",
  "earlyRewardKeepsakeWorldFocus",
  "earlyRewardKeepsakeSafetyText",
  "earlyRewardFeedbackKeepsakeSpec",
  "earlyRewardKeepsakeWorldAtCanvasPoint",
  "focusEarlyRewardKeepsakeWorldFromCanvas",
  "drawEarlyRewardKeepsakeWorld",
  "drawEarlyRewardKeepsakeWorld(ctx",
  "奖励落袋三拍签",
  "动作达成 -> 奖励落袋 -> 下一步亮起",
  "只回看前三小时正反馈和定位下一处爽点，不会自动播种、浇水、收获、加工、开铺、修复、发奖励、入夜或消耗资源",
  "INITIAL_DEBRIS_PLOT_KEYS",
  "restoredGrottoVeinPlots",
  "clearedDebris",
  "clearedDay",
  "firstSeedWorldPlot",
  "firstSeedWorldSpec",
  "firstSeedWorldAtCanvasPoint",
  "focusFirstSeedWorldFromCanvas",
  "drawFirstSeedWorld",
  "firstSeeded",
  "firstSeededSeedId",
  "grottoRevivalDirectorSpec",
  "grottoRevivalDirectorMarkup",
  "demoGuideRevival",
  "洞天复苏总览",
  "下一处修复感",
  "只展示复苏进度",
  "grottoVeinWorldChainSpec",
  "drawGrottoVeinWorldChain",
  "grottoVeinWorldChainAtCanvasPoint",
  "focusGrottoVeinWorldChainFromCanvas",
  "grottoRevivalAtmosphereSpec",
  "drawGrottoRevivalAtmosphereLayer",
  "drawGrottoRevivalAtmosphereLayer(ctx",
  "grotto_revival_atmosphere",
  "水气回流",
  "grottoClearEchoWorldFocus",
  "grottoClearEchoWorldSpec",
  "grottoClearEchoWorldAtCanvasPoint",
  "focusGrottoClearEchoWorldFromCanvas",
  "drawGrottoClearEchoWorld",
  "drawGrottoClearEchoWorld(ctx",
  "清荒露纹回响 · 可点",
  "第一口气回来了",
  "不会自动继续清理、播种、浇水、入夜或消耗体力",
  "firstRevivalTriptychWorldSpec",
  "firstRevivalTriptychWorldAtCanvasPoint",
  "focusFirstRevivalTriptychWorldFromCanvas",
  "drawFirstRevivalTriptychWorld",
  "第一处复苏三段景",
  "开场复苏三段景",
  "荒草退 -> 灵纹亮 -> 下一格可清",
  "点选开场复苏三段景",
  "不会自动继续清理、播种、浇水、入夜、扣体力或消耗资源",
  "洞天旧灵纹复苏链",
  "复苏灵纹",
  "第一口气回来了",
  "不会自动清理、播种或消耗体力",
  "第一籽入土留痕",
  "只定位种下的地块，不会自动播种或浇水",
  "不会自动播种、浇水或消耗体力",
  "清荒露纹",
  "灵渠复流",
  "点选奖励路标",
  "前三小时奖励路标",
  "前三小时节奏带",
  "前三小时奖励节奏诊断",
  "每15分钟一个反馈",
  "下一爽点",
  "renderDemoGuideProgress",
  "demo-guide-progress-line",
  "前三小时奖励链已跑通",
  "序章路标",
  "世界留痕",
  "经营路标",
  "经营留痕",
  "下一奖励：",
  "spiritJoinFeedback",
  "spiritJoinFeedbackSpec",
  "triggerSpiritJoinFeedback",
  "drawSpiritJoinFeedback",
  "triggerSpiritAssistFeedback",
  "firstSpiritAssistPrimerWorldSpec",
  "firstSpiritAssistPrimerWorldAtCanvasPoint",
  "focusFirstSpiritAssistPrimerWorldFromCanvas",
  "drawFirstSpiritAssistPrimerWorld",
  "spiritAssistTrailWorldSpec",
  "spiritAssistTrailWorldAtCanvasPoint",
  "focusSpiritAssistTrailWorldFromCanvas",
  "drawSpiritAssistTrailWorld",
  "spiritAssistTrailFeedback",
  "spiritAssistNineGridActionWorldFocus",
  "spiritAssistNineGridActionWorldSpec",
  "spiritAssistNineGridActionWorldAtCanvasPoint",
  "focusSpiritAssistNineGridActionWorldFromCanvas",
  "drawSpiritAssistNineGridActionWorld",
  "drawSpiritAssistNineGridActionWorld(ctx",
  "spiritAssistSavingsLedgerWorldFocus",
  "spiritAssistSavingsLedgerWorldSpec",
  "spiritAssistSavingsLedgerWorldAtCanvasPoint",
  "focusSpiritAssistSavingsLedgerWorldFromCanvas",
  "drawSpiritAssistSavingsLedgerWorld",
  "drawSpiritAssistSavingsLedgerWorld(ctx",
  "spiritAssistToWorkshopBridgeWorldSpec",
  "spiritAssistToWorkshopBridgeWorldAtCanvasPoint",
  "focusSpiritAssistToWorkshopBridgeWorldFromCanvas",
  "drawSpiritAssistToWorkshopBridgeWorld",
  "spiritAssistToWorkshopBridgeWorldFocus",
  "精怪省力去向桥",
  "省下体力 -> 转去入锅 -> 订单/旧铺备货",
  "不会自动加工、排产、出锅、交单、开铺、入夜或消耗材料",
  "spiritAssistRhythmWorldSpec",
  "spiritAssistRhythmWorldAtCanvasPoint",
  "focusSpiritAssistRhythmWorldFromCanvas",
  "drawSpiritAssistRhythmWorld",
  "spiritAssistRhythmWorldFocus",
  "伙伴上工节奏牌",
  "精怪省力账留签",
  "第一次省力账留签",
  "精怪代浇九宫格动作签",
  "第一次九宫格动作签",
  "起步 -> 九格走水 -> 省力入账",
  "不是瞬移，是跑完 1-9 格",
  "只定位九宫格动作",
  "九宫格动作签已经定位",
  "只定位省力账",
  "只定位田格和伙伴栏",
  "精怪代浇",
  "精怪代浇足迹",
  "伙伴栏亮起",
  "伙伴上工路标",
  "3x3 预览",
  "3x3 接管范围",
  "伙伴代劳预演",
  "这 9 格会被伙伴接手",
  "预计省下",
  "接管水脉",
  "协助预览，未执行",
  "不会自动协助浇水",
  "不会消耗体力",
  "不会再次触发精怪协助、不会自动浇水或消耗体力",
  "第一次接手农活",
  "runIndex",
  "3x3 自动浇水",
  "省下约",
  "不会再次触发精怪协助",
  "不会自动浇水",
  "workshopCraftFeedback",
  "workshopCraftFeedbackSpec",
  "triggerWorkshopCraftFeedback",
  "activeWorkshopCraftFeedback",
  "drawWorkshopCraftFeedback",
  "加工动画 · 香气特效",
  "第一张订单出现",
  "workshopLineFeedback",
  "workshopLineFeedbackSpec",
  "triggerWorkshopLineFeedback",
  "activeWorkshopLineFeedback",
  "drawWorkshopLineFeedback",
  "workshopProductionLineSpec",
  "workshopWorldProductionSceneSpec",
  "workshopLineOverviewWorldBoardSpec",
  "workshopLineOverviewWorldBoardAtCanvasPoint",
  "focusWorkshopLineOverviewWorldBoardFromCanvas",
  "drawWorkshopLineOverviewWorldBoard",
  "workshopStagePropWorldAtCanvasPoint",
  "focusWorkshopStagePropWorldFromCanvas",
  "workshopStagePropWorldFocus",
  "主世界工坊流水线总览",
  "主世界工坊待排产",
  "点选工坊流水线",
  "点选工坊工序",
  "工坊工序手感",
  "工坊产线 · 可点",
  "排产预览 · 可点",
  "automationHubWorldNoteSpec",
  "automationHubAtCanvasPoint",
  "focusAutomationHubFromCanvas",
  "drawAutomationHubWorldNote",
  "自动化中枢",
  "点选自动化",
  "spiritAutomationBenefitBoardSpec",
  "spiritAutomationBenefitRows",
  "drawSpiritAutomationBenefitBoard",
  "spiritAutomationBenefitBoardAtCanvasPoint",
  "focusSpiritAutomationBenefitBoardFromCanvas",
  "精怪今日省工",
  "点选省工看板",
  "spiritJobReadyWorldBoardSpec",
  "spiritJobReadyWorldBoardAtCanvasPoint",
  "focusSpiritJobReadyWorldBoardFromCanvas",
  "drawSpiritJobReadyWorldBoard",
  "主世界精怪岗位修行",
  "点选岗位修行牌",
  "岗位小事 · 可点",
  "修行奖励 · 可点",
  "spiritJobShiftTheaterWorldSpec",
  "spiritJobShiftTheaterWorldAtCanvasPoint",
  "focusSpiritJobShiftTheaterWorldFromCanvas",
  "drawSpiritJobShiftTheaterWorld",
  "主世界精怪岗位班次",
  "岗位班次小剧场",
  "点击只定位伙伴栏，不会自动切岗或派工",
  "dungeonMechanicWorldPreviewSpec",
  "dungeonMechanicWorldPreviewAtCanvasPoint",
  "focusDungeonMechanicWorldPreviewFromCanvas",
  "drawDungeonMechanicWorldPreview",
  "drawDungeonMechanicWorldGlyph",
  "dungeonMechanicWorldRouteSpec",
  "dungeonMechanicWorldRouteAtCanvasPoint",
  "focusDungeonMechanicWorldRouteFromCanvas",
  "drawDungeonMechanicWorldRoute",
  "秘境节气路线图",
  "只定位不进境",
  "dungeonEntranceSilhouetteSpec",
  "dungeonEntranceSilhouetteAtCanvasPoint",
  "focusDungeonEntranceSilhouetteFromCanvas",
  "drawDungeonEntranceSilhouetteWorld",
  "dungeonEntranceSilhouetteWorldFocus",
  "秘境入口剪影牌",
  "场规味道",
  "精怪解法",
  "带回变化",
  "点选秘境入口剪影",
  "不会自动进入秘境、探索、顺应节气、挑战 Boss 或消耗资源",
  "dungeonEntranceFieldPreviewWorldFocus",
  "dungeonEntranceFieldPreviewSafetyText",
  "dungeonEntranceFieldPreviewWorldSpec",
  "dungeonEntranceFieldPreviewWorldAtCanvasPoint",
  "focusDungeonEntranceFieldPreviewWorldFromCanvas",
  "drawDungeonEntranceFieldPreviewWorld",
  "drawDungeonEntranceFieldPreviewWorld(ctx",
  "秘境入口场规预演",
  "场规先动",
  "精怪应手",
  "带回洞天",
  "只解释入口场规并定位秘境面板",
  "不会自动进入秘境、探索、顺应节气、挑战 Boss、领取奖励或消耗资源",
  "dungeonSolarAtlasWorldSpec",
  "dungeonSolarAtlasWorldAtCanvasPoint",
  "focusDungeonSolarAtlasWorldFromCanvas",
  "drawDungeonSolarAtlasWorld",
  "秘境节气图谱",
  "八境节气机关",
  "不会自动进入秘境",
  "场规关键词",
  "failure_safeguard",
  "spirit_solution",
  "dungeonFirstMechanicTheaterSpec",
  "dungeonFirstMechanicTheaterAtCanvasPoint",
  "focusDungeonFirstMechanicTheaterFromCanvas",
  "dungeonFirstMechanicTheaterMarkup",
  "drawDungeonFirstMechanicTheater",
  "dungeonFirstMechanicTheaterFocus",
  "dungeon-first-mechanic-theater",
  "首次秘境机制小剧场",
  "dungeonMechanicSolutionTriptychSpec",
  "dungeonMechanicSolutionTriptychMarkup",
  "dungeon-solution-triptych",
  "秘境节气解法三联牌",
  "场规怎么变",
  "精怪怎么解",
  "赢了改哪里",
  "不会自动进入秘境、顺应节气、探索、挑战 Boss 或消耗资源",
  "节气机关读法",
  "不会自动探索",
  "不会自动顺应节气",
  "不会自动挑战 Boss",
  "dungeonStructureRouteSpec",
  "dungeonStructureRouteMarkup",
  "drawDungeonStructureRouteRibbon",
  "秘境五段结构",
  "field_rule",
  "resolution",
  "精怪解谜",
  "mainRewardText",
  "safeguardText",
  "秘境机制预告",
  "点选秘境机制",
  "失败保底：",
  "奖励焦点：",
  "drawWorkshopProductionStageProps",
  "workshopLineStageSpec",
  "workshopProductionLineMarkup",
  "工坊流水线",
  "备料",
  "投料",
  "稳火",
  "出锅",
  "入仓",
  "后厂五段产线",
  "备料案",
  "投料弧线",
  "稳火环",
  "出锅闪光",
  "入仓货签",
  "精怪搬运",
  "工坊产线回声",
  "工坊上灶",
  "后厂出锅",
  "订单接上线",
  "workshopOutputOrderMatchSpec",
  "workshopOrderMatchSafe",
  "workshop-order-match",
  "day-summary-workshop-order",
  "工坊接单",
  "订单板亮了",
  "这锅已让订单可交",
  "第一锅香气引来了订单",
  "join-live",
  "第一只精怪入队",
  "伙伴栏已开放",
  "shopSaleFeedback",
  "shopSaleFeedbackSpec",
  "triggerShopSaleFeedback",
  "drawShopSaleFeedback",
  "needBubbleText",
  "decisionPath",
  "returnPathSteps",
  "首单回头路径",
  "回头苗头",
  "returnChance",
  "想法泡泡：",
  "购买理由：",
  "顾客短评：",
  "shopCrowdHeatSpec",
  "drawShopCrowdHeat",
  "drawShopCrowdPerson",
  "shopCrowdHeatUiSpec",
  "shop-crowd-heat",
  "shop-crowd-memory",
  "crowdCount",
  "queueText",
  "排队",
  "围观",
  "热卖牌",
  "犹豫离店",
  "门口热度",
  "旧铺门口热度回看",
  "shopSaleExchangePalette",
  "drawShopSaleExchangeAnimation",
  "exchangeLabel",
  "exchangeTrail",
  "递货收钱",
  "灵石入账",
  "shopRestockFulfillmentFeedback",
  "shopRestockFulfillmentFeedbackSpec",
  "triggerShopRestockFulfillmentFeedback",
  "activeShopRestockFulfillmentFeedback",
  "drawShopRestockFulfillmentFeedback",
  "补货兑现演出",
  "货签刚兑现",
  "shopActionFeedback",
  "shopActionFeedbackSpec",
  "triggerShopActionFeedback",
  "activeShopActionFeedback",
  "drawShopActionFeedback",
  "价签已调",
  "货架换题",
  "补货已钉牌",
  "利润试探",
  "shopCustomerDecisionChains",
  "shopCustomerDecisionChainsMarkup",
  "shopLeaveRecoveryFeedback",
  "shopLeaveRecoveryRouteSteps",
  "shopLeaveRecoveryWorldSpec",
  "shopLeaveRecoveryMarkup",
  "drawShopLeaveRecoveryWorldNote",
  "离店补救路线",
  "温和改法",
  "明日改法",
  "learningLine",
  "gentleFix",
  "tomorrowAction",
  "data-shop-board=\"leave-recovery\"",
  "hualingWelcomeDanceSpec",
  "hualingWelcomeDanceAtCanvasPoint",
  "focusHualingWelcomeDanceFromCanvas",
  "drawHualingWelcomeDance",
  "花铃迎客铃舞",
  "店门摇铃撒花",
  "无声花市",
  "leizhuWindGuideSpec",
  "leizhuWindGuideAtCanvasPoint",
  "focusLeizhuWindGuideFromCanvas",
  "drawLeizhuWindGuide",
  "雷竹测风引路",
  "竹竿点地测风",
  "旧雷道押运旗",
  "yuelianMoonlitPondSpec",
  "yuelianMoonlitPondAtCanvasPoint",
  "focusYuelianMoonlitPondFromCanvas",
  "drawYuelianMoonlitPond",
  "月莲静池递露",
  "水边递莲叶水珠",
  "无月之月落在静池",
  "dengyingLanternPathSpec",
  "dengyingLanternPathAtCanvasPoint",
  "focusDengyingLanternPathFromCanvas",
  "drawDengyingLanternPath",
  "灯影长灯指路",
  "躲入玩家影子",
  "点亮今夜隐藏灯路",
  "shuqiLedgerDeskSpec",
  "shuqiLedgerDeskAtCanvasPoint",
  "focusShuqiLedgerDeskFromCanvas",
  "drawShuqiLedgerDesk",
  "书契账房批注",
  "夹朱砂账签标出缺货格",
  "誊金边旧账成册",
  "fengmiHoneyYardSpec",
  "fengmiHoneyYardAtCanvasPoint",
  "focusFengmiHoneyYardFromCanvas",
  "drawFengmiHoneyYard",
  "蜂蜜花田留蜜",
  "抱蜜罐走路",
  "挨锅沿试蜜定香",
  "摆蜜席请众精同席",
  "shopWeatherCustomerReactionSpec",
  "shopWeatherCustomerReactionMarkup",
  "shopWeatherShelfProfile",
  "shopWeatherShelfRestockPlan",
  "shopWeatherShelfRestockPlanMarkup",
  "shopWeatherShelfRecommendationSpec",
  "shopWeatherShelfRecommendationMarkup",
  "shopWeatherShelfCustomerVignetteMarkup",
  "shopWeatherShelfChoiceWeight",
  "shopWeatherShelfChoiceSupport",
  "inventoryWeatherShelfHintMarkup",
  "shopWeatherShelfAfterglowSpec",
  "shopWeatherShelfDaySummarySpec",
  "shopWeatherShelfCustomerVignetteSpec",
  "applyShopWeatherShelfRestock",
  "applyShopWeatherShelfAction",
  "focusShopWeatherShelfRoute",
  "focusShopWeatherShelfReview",
  "drawShopWeatherShelfGoodIcon",
  "drawShopWeatherShelfCustomerVignette",
  "drawShopWeatherShelfSign",
  "shopWeatherShelfActionEchoSpec",
  "drawShopWeatherShelfActionEcho",
  "shop_weather_shelf",
  "shop_weather_shelf_customer",
  "shop-weather-customer",
  "shop-weather-shelf",
  "shop-weather-shelf-customer",
  "shop-weather-shelf-plan",
  "item-weather-shelf-hint",
  "data-shop-weather-restock",
  "data-shop-weather-action",
  "data-shop-weather-review",
  "data-shop-weather-route",
  "data-inventory-weather-restock",
  "weather-customer",
  "weather-shelf",
  "顾客天气反应",
  "今日天气主推",
  "背包天气货签",
  "天气对口货",
  "可追踪天气补货",
  "天气主推货签",
  "天气缺货牌",
  "缺货箭头",
  "天气货签顾客小景",
  "被天气货签吸引",
  "空位让客人回头",
  "看见主推还在犹豫",
  "点选旧铺：天气货签顾客小景",
  "先补天气对口货，别让空位把客人劝走",
  "继续补厚头排库存",
  "shopTagsForItem(item || itemId)",
  "images.cropBailuobo",
  "images.cropBaicai",
  "缺少天气对口货",
  "天气主推货",
  "天气补货路线",
  "追踪这件补货",
  "天气货签",
  "source: \"weather_shelf\"",
  "天气货签余温",
  "天气货签动作回响",
  "价签轻压",
  "陈列复盘",
  "补货钉牌",
  "day-summary-shop-weather-shelf",
  "followupAction",
  "followupTone",
  "复盘天气货签",
  "顾客小景复盘",
  "复盘价格与陈列",
  "补厚头排库存",
  "轻压价签",
  "看陈列诊断",
  "天气货签复盘：看陈列诊断",
  "明天先复盘价格、陈列和库存厚度",
  "清晨行动牌：天气货签复盘",
  "日结复盘：天气货签",
  "天气货签接住了客人",
  "天气货签留住了脚步",
  "天气货签还缺一口货",
  "shop_weather",
  "补厚天气主推货",
  "先补天气对口货",
  "weather_shelf",
  "matchCustomerGood(goods, customerView, ecologyGarden, weatherShelf)",
  "促成",
  "待补货",
  "雨棚等伞客",
  "暑天讨凉饮",
  "霜天围炉问热食",
  "掌柜建议",
  "shopCustomerJourneySpec",
  "shopCustomerJourneyRows",
  "shopCustomerJourneyMarkup",
  "drawShopCustomerJourneyTrace",
  "drawShopCustomerJourneyBoard",
  "shopTrialTheaterWorldSpec",
  "shopTrialTheaterWorldAtCanvasPoint",
  "drawShopTrialTheaterWorld",
  "journey_board",
  "shop_trial_theater",
  "旧铺试营业预告",
  "顾客想法小剧场",
  "首单原因小剧场",
  "不会自动开铺",
  "不会自动开铺、改价或补货",
  "shopDoorstepCustomerVignetteSpec",
  "shopDoorstepCustomerVignetteFocus",
  "drawShopDoorstepCustomerVignette",
  "doorstep_vignette",
  "旧铺旅线总览",
  "旧铺门口顾客小景",
  "可点回看",
  "门口小景回看",
  "点选门口小景",
  "只定位旧铺旅线",
  "门口有人驻足",
  "试价犹豫",
  "熟客带新客",
  "shop-customer-journey",
  "shop-journey-path",
  "顾客旅线复盘",
  "看牌",
  "试价",
  "复购建议",
  "shop-decision-chain",
  "shop-decision-step",
  "顾客决策链",
  "进店：",
  "原因：",
  "第一位顾客买单了",
  "sale-live-hint",
  "sale-live",
  "activeOrderDeliveryMoment",
  "drawOrderDeliveryMoment",
  "第一张订单交付成功",
  "order-delivery-hint",
  "order-live",
  "orderRecoverySpec",
  "previewOrderRecovery",
  "order-recovery-hint",
  "补救小票",
  "storyVisitFeedback",
  "storyVisitFeedbackSpec",
  "triggerStoryVisitFeedback",
  "dialogue_baizhi_order_visit",
  "白芷来访",
  "石斛之求",
  "clearDebris",
  "grottoSpirit",
  "clearedDebris",
  "coreLoopStepDone",
  "clearButton",
  "清理荒草",
  "洞天灵息",
  "workshopAromaState",
  "createInitialWorkshopAromaState",
  "normalizeWorkshopAromaState",
  "syncWorkshopAromaState",
  "recordWorkshopAroma",
  "workshopAromaStoryWorldSpec",
  "workshopAromaStoryWorldAtCanvasPoint",
  "focusWorkshopAromaStoryWorldFromCanvas",
  "drawWorkshopAromaStoryWorld",
  "workshopOutputRouteTriptychWorldFocus",
  "workshopOutputRouteTriptychWorldSpec",
  "workshopOutputRouteTriptychWorldAtCanvasPoint",
  "focusWorkshopOutputRouteTriptychWorldFromCanvas",
  "drawWorkshopOutputRouteTriptychWorld",
  "drawWorkshopOutputRouteTriptychWorld(ctx",
  "出锅去向三联签",
  "订单去向",
  "旧铺去向",
  "备货再排产",
  "不会自动交单、开铺或继续加工",
  "workshopOutputStorageRouteWorldFocus",
  "workshopOutputStorageRouteSafetyText",
  "workshopOutputStorageRouteFeedbackSpec",
  "recordWorkshopOutputStorageRouteFeedback",
  "workshopOutputStorageRouteWorldSpec",
  "workshopOutputStorageRouteWorldAtCanvasPoint",
  "focusWorkshopOutputStorageRouteWorldFromCanvas",
  "drawWorkshopOutputStorageRouteWorld",
  "drawWorkshopOutputStorageRouteWorld(ctx",
  "成品入仓去向签",
  "手动加工 -> 成品入仓 -> 订单可交",
  "夜间排产 -> 成品入仓",
  "只定位订单板、旧铺货签、配方栏或背包",
  "不会自动交单、开铺、上架、售卖、继续加工、排产、扣库存、发奖励、入夜或消耗资源",
  "workshopValueLedgerWorldSpec",
  "workshopFirstOrderProfitWorldFocus",
  "workshopFirstOrderProfitWorldSpec",
  "workshopFirstOrderProfitWorldAtCanvasPoint",
  "focusWorkshopFirstOrderProfitWorldFromCanvas",
  "drawWorkshopFirstOrderProfitWorld",
  "workshopValueLedgerWorldAtCanvasPoint",
  "focusWorkshopValueLedgerWorldFromCanvas",
  "drawWorkshopValueLedgerWorld",
  "香气引单小剧场",
  "第一单利润对照签",
  "第一锅增值账签",
  "原料裸卖 -> 出锅增值 -> 订单回款",
  "订单回款",
  "订单收益高于裸卖",
  "加工订单收益链成立",
  "收益差条",
  "订单约",
  "多赚",
  "去订单板手动交付",
  "只定位订单板、配方栏和成品去向",
  "不会自动加工、交单、扣库存、发奖励或消耗材料",
  "只定位订单板，不会自动交单",
  "不会自动交单或自动排产",
  "workshopAromaOrderWorldSpec",
  "workshopAromaOrderAtCanvasPoint",
  "focusWorkshopAromaOrderFromCanvas",
  "workshopReadyOrderDispatchWorldSpec",
  "focusWorkshopReadyOrderDispatchWorldFromCanvas",
  "drawWorkshopReadyOrderDispatchWorld",
  "出锅交单车已装好",
  "交单路线",
  "订单板收款口",
  "确认后手动点交付",
  "不会自动交单或消耗库存",
  "workshopQueueFocusSpec",
  "updateWorkshopLiveFocus",
  "first_workshop_aroma",
  "香气引单",
  "灶香飘到旧铺",
  "香气接单",
  "shopOpeningState",
  "createInitialShopOpeningState",
  "normalizeShopOpeningState",
  "syncShopOpeningState",
  "shopLiveFocusSpec",
  "recordShopOpeningFeedback",
  "first_shop_opening",
  "first_shop_sale_summary",
  "shopFirstSaleReceiptWorldSpec",
  "drawShopFirstSaleReceipt",
  "首单成交小票",
  "首单成交 · 可点",
  "购买原因：",
  "shopFeedbackForSegment",
  "shopPurchaseReason",
  "旧铺试营业看板",
  "热卖标签预告",
  "第一次成交日结已解锁",
  "清口凉菜",
  "水系灵食",
  "凉润小食",
  "spiritInteractionState",
  "createInitialSpiritInteractionState",
  "normalizeSpiritInteractionState",
  "syncSpiritInteractionState",
  "recordSpiritInteraction",
  "spiritInteractionFeedback",
  "spiritInteractionFeedbackSpec",
  "triggerSpiritInteractionFeedback",
  "activeSpiritInteractionFeedback",
  "drawSpiritInteractionFeedback",
  "spiritInteractionWorldEchoSpec",
  "spiritInteractionEchoAtCanvasPoint",
  "drawSpiritInteractionWorldEcho",
  "spiritBondHeartlineWorldSpec",
  "spiritBondHeartlineWorldAtCanvasPoint",
  "focusSpiritBondHeartlineWorldFromCanvas",
  "drawSpiritBondHeartlineWorld",
  "spiritInteractionMemoryTriptychWorldSpec",
  "spiritInteractionMemoryTriptychWorldAtCanvasPoint",
  "focusSpiritInteractionMemoryTriptychWorldFromCanvas",
  "drawSpiritInteractionMemoryTriptychWorld",
  "伙伴记忆三拍签",
  "名字 -> 动作 -> 短台词",
  "复述提示：它叫",
  "访谈验收：玩家能说出精怪名字或行为",
  "点选伙伴记忆三拍签",
  "不会自动摸摸、喂食、派工、触发事件、领取回礼、增加羁绊或消耗食物/资源",
  "羁绊心线小剧场",
  "第一次羁绊心线",
  "不会自动摸摸或喂食",
  "伙伴回应签",
  "伙伴回应 · 可点",
  "点开伙伴回应签",
  "第一次伙伴回应",
  "摸摸回应",
  "喂食回应",
  "伙伴回应已写入精怪面板",
  "spiritMoodRepairProfile",
  "maybeTriggerSpiritMoodRepair",
  "completeSpiritMoodRepair",
  "moodRepairEvent",
  "spiritMoodRepairWorldSpec",
  "spiritMoodRepairWorldAtCanvasPoint",
  "focusSpiritMoodRepairWorldFromCanvas",
  "drawSpiritMoodRepairWorldScene",
  "点选低落小事",
  "主世界低落小事",
  "spiritCareNeedWorldBoardSpec",
  "spiritCareNeedWorldBoardAtCanvasPoint",
  "focusSpiritCareNeedWorldBoardFromCanvas",
  "drawSpiritCareNeedWorldBoard",
  "主世界精怪照料提醒",
  "点选照料提醒",
  "照料提醒 · 可点",
  "spirit-mood-repair-ticket",
  "data-spirit-mood-repair",
  "低落小事",
  "first_spirit_interaction",
  "spirit-interaction-card",
  "spiritCompanionCareSpec",
  "spiritCompanionCareMarkup",
  "spiritCanvasTargets",
  "spiritAtCanvasPoint",
  "focusSpiritFromCanvas",
  "spiritWorldLifeStatusSpec",
  "drawSpiritWorldLifeStatus",
  "今日状态",
  "有点饿",
  "需要安抚",
  "想歇一会",
  "还在认家",
  "从主世界叫住",
  "applySpiritFocusTarget",
  "canvasSpiritCareFocus",
  "canvasSpiritCareFocusSpec",
  "canvasSpiritCareFocusMarkup",
  "spirit-companion-care",
  "spirit-canvas-care",
  "spirit-focus-pulse",
  "data-spirit-id",
  "shopCanvasTargets",
  "shopAtCanvasPoint",
  "focusShopFromCanvas",
  "applyShopFocusTarget",
  "canvasShopCustomerFocus",
  "shopCustomerFocusReviewSpec",
  "shopCustomerFocusReviewMarkup",
  "shopCustomerFocusActions",
  "shopCustomerFocusActionsMarkup",
  "applyShopFocusAction",
  "shopRestockFocus",
  "shopRestockSummarySpec",
  "recordShopRestockItemProgress",
  "shopRestockProgressNoticeKey",
  "shopRestockFulfillmentEffect",
  "restockTarget",
  "restockHistory",
  "normalizeShopRestockTarget",
  "createShopRestockTarget",
  "completeShopRestockTarget",
  "cancelShopRestockTarget",
  "shopRestockRouteCandidates",
  "shopRestockRouteMarkup",
  "shopRestockTrackerMarkup",
  "drawShopRestockTargetSign",
  "focusShopRestockRoute",
  "focusDaySummaryShopRestock",
  "focusShopReportEntry",
  "shop-customer-focus",
  "shop-customer-focus-actions",
  "shop-customer-restock-mark",
  "shop-restock-routes",
  "shop-restock-route",
  "shop-restock-tracker",
  "data-shop-focus-report",
  "data-shop-focus-action",
  "data-shop-restock-route",
  "data-shop-restock-complete",
  "data-shop-restock-cancel",
  "data-day-summary-shop-restock",
  "data-inventory-shop-restock",
  "day-summary-shop-restock",
  "shop-restock-inventory-target",
  "item-shop-restock-target",
  "补货兑现",
  "旧铺补货牌",
  "补货可完成",
  "旧铺补货进度",
  "shopRestock.sourceLabel",
  "shop-focus-pulse",
  "data-shop-board",
  "data-shop-report-index",
  "点选旧铺",
  "伙伴回应",
  "今日陪伴",
  "上次回应",
  "下一次照料",
  "画面点选",
  "刚从主画面点到它",
  "点选精怪",
  "羁绊 +",
  "year2GoalUnlocked",
  "year2GoalProgress",
  "year2SolarTrials",
  "workshopQueue",
  "queueWorkshopRecipe",
  "settleWorkshopQueue",
  "recipeMachine",
  "workshop_queue_complete",
  "solarTrialName",
  "solarTrialUnlocked",
  "evaluateSolarTrialScore",
  "solarTrialRank",
  "startSolarTrial",
  "advanceSolarTrialAction",
  "solarTrialRunProgress",
  "solarTrialScoreBreakdown",
  "settleSolarTrial",
  "renderSolarTrialPanel",
  "freeplayGoalUnlocked",
  "metricProgress",
  "spiritSproutState",
  "createInitialSpiritSproutState",
  "normalizeSpiritSproutState",
  "syncSpiritSproutState",
  "firstSpiritPromiseSpec",
  "firstSpiritPromiseMarkup",
  "focusFirstSpiritPromise",
  "data-first-spirit-promise",
  "第一只精怪倒计时",
  "30 分钟核心卖点",
  "不会自动清理、播种、浇水、入夜、收获或触发成精",
  "maybeTriggerSpiritSproutPreview",
  "completeSpiritSproutBirth",
  "spiritSproutPreviewWorldSpec",
  "spiritSproutTimelineWorldSpec",
  "spiritSproutTimelineAtCanvasPoint",
  "focusSpiritSproutTimelineFromCanvas",
  "spiritSproutPreviewAtCanvasPoint",
  "focusSpiritSproutPreviewFromCanvas",
  "spiritSproutAnomalyWorldSpec",
  "spiritSproutAnomalyAtCanvasPoint",
  "focusSpiritSproutAnomalyFromCanvas",
  "drawSpiritSproutAnomalyWorld",
  "drawSpiritSproutPreview",
  "spiritSproutStageVignetteSpec",
  "drawSpiritSproutStageVignette",
  "drawSpiritSproutTimelineWorldCard",
  "spiritSproutFeedback",
  "spiritSproutFeedbackSpec",
  "triggerSpiritSproutFeedback",
  "activeSpiritSproutFeedback",
  "drawSpiritSproutFeedback",
  "spirit_sprout_preview",
  "spirit_sprout_peek",
  "spirit_sprout_birth",
  "萝卜苗轻颤",
  "土里探头",
  "靠近这株苗",
  "可点",
  "靠近异常萝卜苗",
  "萝卜苗异动",
  "问号气泡",
  "不会自动收获",
  "不会自动入夜",
  "不会触发成精",
  "成精三步线索",
  "成精苗圃小演出",
  "轻颤镜头",
  "探头镜头",
  "入队余韵",
  "只强化画面不自动收获",
  "点选成精线索",
  "成熟后收获",
  "harvestRouteWorldBoardSpec",
  "harvestRouteWorldBoardAtCanvasPoint",
  "focusHarvestRouteWorldBoardFromCanvas",
  "drawHarvestRouteWorldBoard",
  "今日收成去向",
  "点选收成去向牌",
  "matureHarvestBasketWorldFocus",
  "matureHarvestBasketSafetyText",
  "matureHarvestBasketRouteNodes",
  "matureHarvestBasketWorldSpec",
  "matureHarvestBasketWorldAtCanvasPoint",
  "focusMatureHarvestBasketWorldFromCanvas",
  "drawMatureHarvestBasketWorld",
  "drawMatureHarvestBasketWorld(ctx",
  "成熟入筐去向小景",
  "成熟发光 -> 竹筐接住",
  "只定位成熟田、订单板、配方栏或旧铺货签",
  "不会自动收获、加物品、交单、加工、上架、开铺、入夜或消耗资源",
  "rareSpiritLifeState",
  "rareSpiritEventReady",
  "createInitialRareSpiritLifeState",
  "normalizeRareSpiritLifeState",
  "syncRareSpiritLifeState",
  "rareSpiritLifeProfile",
  "rareSpiritDailyMomentForSpirit",
  "rareSpiritDailyStageRows",
  "rareSpiritDailyStageWorldSpec",
  "rareSpiritDailyStageWorldAtCanvasPoint",
  "focusRareSpiritDailyStageWorldFromCanvas",
  "drawRareSpiritDailyStageWorld",
  "rareSpiritInteractionGiftReady",
  "rareSpiritGiftStatusText",
  "rareSpiritWorldInvitationSpec",
  "rareSpiritWorldInvitationAtCanvasPoint",
  "focusRareSpiritWorldInvitationFromCanvas",
  "drawRareSpiritWorldInvitation",
  "rareSpiritClueRoadsignWorldSpec",
  "rareSpiritClueRoadsignWorldAtCanvasPoint",
  "focusRareSpiritClueRoadsignWorldFromCanvas",
  "drawRareSpiritClueRoadsignWorld",
  "rareSpiritClueRoadsignWorldFocus",
  "稀有精怪线索风铃",
  "rareSpiritIdentityPortraitCandidate",
  "rareSpiritIdentityPortraitWorldSpec",
  "rareSpiritIdentityPortraitWorldAtCanvasPoint",
  "focusRareSpiritIdentityPortraitFromCanvas",
  "drawRareSpiritIdentityPortraitWorld",
  "rareSpiritIdentityPortraitWorldFocus",
  "稀有精怪身份画片",
  "气质剪影",
  "专属动作",
  "回礼记忆",
  "点选稀有精怪身份画片",
  "只定位目标册或生活图鉴",
  "不会自动触发稀有精怪事件、领取回礼、增加羁绊、招募、派工或消耗资源",
  "只定位目标册",
  "不会自动触发稀有精怪事件",
  "主世界稀有精怪生活舞台",
  "点选稀有精怪生活舞台",
  "小剧场 · 可点",
  "回礼提示 · 可点",
  "点选稀有精怪",
  "可推进：",
  "triggerRareSpiritDailyMoments",
  "tryRareSpiritInteractionGift",
  "completedRareSpiritEvents",
  "rareSpiritGifts",
  "rareSpiritConfigForEvent",
  "rareSpiritOwned",
  "rareSpiritGiftItemId",
  "rareSpiritEventDone",
  "rareSpiritEventRewardText",
  "completeRareSpiritEvent",
  "data-rare-spirit-event",
  "rare_spirit_event_complete",
  "renderGoalBook",
  "lastDaySummary",
  "nextDayAdvice",
  "createDaySummary",
  "renderDaySummaryPanel",
  "pondLotusStageText",
  "settlePondEcology",
  "nightWaterCropCareDays",
  "demoGuideStep",
  "renderDemoGuide",
  "actionForGuideStep",
  "runDemoGuideAction",
  "controlIdForGuideAction",
  "newPlayerFirstStepsSpec",
  "newPlayerFirstStepsMarkup",
  "renderPanelTabs",
  "applyPanelGroup",
  "spiritVoice",
  "spiritVisualProfile",
  "spiritJobStation",
  "drawSpiritJobEffect",
  "drawSpiritJobPersonaBubble",
  "spiritJobShiftFeedback",
  "spiritJobShiftFeedbackSpec",
  "triggerSpiritJobShiftFeedback",
  "activeSpiritJobShiftFeedback",
  "drawSpiritJobShiftFeedback",
  "岗位调度回声",
  "drawSpiritColony",
  "spirit-glyph",
  "moodParamFor",
  "spiritEventReady",
  "completeSpiritEvent",
  "spiritMemoryBonus",
  "openShop",
  "pricedGood",
  "themeMatchScore",
  "shopDiagnosis",
  "currentShopSeason",
  "shopSeasonRules",
  "shopSeasonScore",
  "shopSeasonRank",
  "year2OrderPreview",
  "renderShopSeasonPanel",
  "activeCustomerSegments",
  "customerJourney",
  "customerDisplayName",
  "customerViewFor",
  "customerBudget",
  "customerProfile",
  "shopReputationScore",
  "barkFor",
  "applyShopControlsToUi",
  "updateShopControlsFromUi",
  "applyProductionControlsToUi",
  "updateProductionControlsFromUi",
  "availableRecipes",
  "buyPrice",
  "buySelectedSeeds",
  "seed_restock",
  "recipeName",
  "visibleOrders",
  "deliverOrder",
  "orderDeliveryFeedback",
  "orderDeliveryFeedbackSpec",
  "relationship-order-feedback",
  "order-touched",
  "renderOrders",
  "favorLevel",
  "addNpcFavor",
  "checkFavorRewards",
  "currentScheduleFor",
  "cohabById",
  "queueDialogueGroup",
  "flushQueuedDialogueGroup",
  "cohabStatusFor",
  "cohabRequirementText",
  "nextCohabEvent",
  "festivalEventFor",
  "normalizeCohabState",
  "cohabSharedBonusValue",
  "cohabBuffValue",
  "triggerCohabDailyScene",
  "triggerCohabWeeklyEvents",
  "triggerCohabFestivalEvents",
  "sideQuestFeedback",
  "sideQuestFeedbackSpec",
  "side-quest-feedback",
  "mission-live-clue",
  "relationship-side-feedback",
  "side-quest-presentation",
  "sideDialogueHintFor",
  "areaName",
  "renderRelationships",
  "repairCanal",
  "canalRestorationState",
  "createInitialCanalRestorationState",
  "normalizeCanalRestorationState",
  "syncCanalRestorationState",
  "expandCanalFields",
  "recordCanalRestoration",
  "canalRestorationFeedback",
  "canalRestorationFeedbackSpec",
  "triggerCanalRestorationFeedback",
  "activeCanalRestorationFeedback",
  "drawCanalRestorationFeedback",
  "canalRestorationCelebrationSpec",
  "canalRestorationCelebrationAtCanvasPoint",
  "focusCanalRestorationCelebrationFromCanvas",
  "drawCanalRestorationCelebrationWorldCard",
  "canalRestorationRouteWorldSpec",
  "canalRestorationRouteWorldAtCanvasPoint",
  "focusCanalRestorationRouteWorldFromCanvas",
  "drawCanalRestorationRouteWorld",
  "canalPermanentFlowWorldSpec",
  "canalPermanentFlowWorldAtCanvasPoint",
  "focusCanalPermanentFlowWorldFromCanvas",
  "drawCanalPermanentFlowWorld",
  "canalPermanentFlowWorldFocus",
  "canalExpandedFieldPlaqueSpec",
  "canalExpandedFieldPlaqueAtCanvasPoint",
  "focusCanalExpandedFieldPlaqueFromCanvas",
  "drawCanalExpandedFieldPlaqueWorld",
  "canalExpandedFieldPlaqueWorldFocus",
  "canalSeedRewardRouteWorldSpec",
  "canalSeedRewardRouteWorldAtCanvasPoint",
  "focusCanalSeedRewardRouteWorldFromCanvas",
  "drawCanalSeedRewardRouteWorld",
  "canalSeedRewardRouteWorldFocus",
  "luzhuQinHarvestRouteWorldSpec",
  "luzhuQinHarvestRouteWorldAtCanvasPoint",
  "focusLuzhuQinHarvestRouteWorldFromCanvas",
  "drawLuzhuQinHarvestRouteWorld",
  "luzhuQinHarvestRouteWorldFocus",
  "lingqinDishRouteWorldSpec",
  "lingqinDishRouteWorldAtCanvasPoint",
  "focusLingqinDishRouteWorldFromCanvas",
  "drawLingqinDishRouteWorld",
  "lingqinDishRouteWorldFocus",
  "qinghePondBridgeWorldSpec",
  "qinghePondBridgeWorldAtCanvasPoint",
  "focusQinghePondBridgeWorldFromCanvas",
  "drawQinghePondBridgeWorld",
  "qinghePondBridgeWorldFocus",
  "pondOvernightWorldSpec",
  "pondOvernightWorldAtCanvasPoint",
  "focusPondOvernightWorldFromCanvas",
  "drawPondOvernightWorld",
  "pondOvernightWorldFocus",
  "qingboIngredientTriadWorldSpec",
  "qingboIngredientTriadWorldAtCanvasPoint",
  "focusQingboIngredientTriadWorldFromCanvas",
  "drawQingboIngredientTriadWorld",
  "qingboIngredientTriadWorldFocus",
  "灵渠复流路线图",
  "常明水脉牌",
  "复流水田铭牌",
  "水种入袋去向签",
  "露珠芹入仓去向签",
  "凉拌灵芹上案去向签",
  "凉拌灵芹可交签",
  "清口单后水路桥签",
  "旧池塘动工桥签",
  "灵池养水过夜签",
  "灵池第一网晨签",
  "清波鱼脍备料三味签",
  "清波鱼脍三味齐签",
  "种子入袋",
  "目标水田",
  "料理去向",
  "工坊凉拌",
  "青禾清口单",
  "旧铺清润货",
  "成品入仓",
  "青禾可交",
  "清口单入账",
  "灵池浅塘",
  "养水过夜",
  "鱼影浮动",
  "灵鱼",
  "净水",
  "永久地图变化 · 水流恢复",
  "vsa_007 录屏证据",
  "玩家看到地图永久变化，并获得明日目标",
  "常明水脉同屏显示永久地图变化和明日目标",
  "复流水田铭牌证明地块扩张是永久写入地图",
  "玩家获得明确明日目标",
  "旧渠重新活成常驻水脉",
  "地图右侧永久新增",
  "mapChangeText",
  "tomorrowFirstStep",
  "这片地已永久接入灵渠",
  "地图边界向右扩出",
  "灵渠已经成为永久水脉",
  "永久地图变化：新水田已写入地图",
  "明天第一步：把露珠芹种子播进新水田",
  "只定位水田与灵田卡，不会自动播种或建造",
  "只定位种子栏与水田，不会自动播种或消耗种子",
  "只定位配方、订单或旧铺，不会自动加工、交单、开铺或消耗露珠芹",
  "只定位订单板或旧铺，不会自动交单、开铺或消耗凉拌灵芹",
  "只定位青禾支线或建造面板，不会自动承接支线、建造、领奖或消耗材料",
  "只定位灵池试网按钮，不会自动捞鱼、发奖励或推进支线",
  "只定位配方或缺料来源，不会自动加工、补料或消耗灵鱼",
  "只定位水田和相关面板",
  "只定位水田，不会自动播种或建造",
  "不会自动播种、不会自动建造",
  "不会自动播种、不会自动建造、不会自动加工",
  "canalTomorrowGoalSpec",
  "canalTomorrowGoalAtCanvasPoint",
  "focusCanalTomorrowGoalFromCanvas",
  "drawCanalTomorrowGoalSign",
  "灵渠复流庆祝",
  "点选复流庆祝",
  "复流水田",
  "新渠明日目标 · 可点",
  "只定位新水田与明日目标，不会自动播种或消耗种子",
  "水线明日目标",
  "ensureCanalYuelianClue",
  "yuelianCanalClueSpec",
  "yuelianCanalClueAtCanvasPoint",
  "focusYuelianCanalClueFromCanvas",
  "drawYuelianCanalClueSign",
  "月莲水痕 · 可点",
  "第二精怪线索",
  "soft: true",
  "灵渠复流",
  "夜间水田照料",
  "canalDaySummaryPlanSpec",
  "focusCanalDaySummaryPlan",
  "canalDaySummaryPlan",
  "day-summary-canal-plan",
  "data-day-summary-canal-plan",
  "新渠明日计划",
  "明早先种露珠芹",
  "waterCropPlantFeedback",
  "waterCropPlantFeedbackSpec",
  "triggerWaterCropPlantFeedback",
  "activeWaterCropPlantFeedback",
  "drawWaterCropPlantFeedback",
  "waterCropHarvestFeedback",
  "waterCropHarvestFeedbackSpec",
  "triggerWaterCropHarvestFeedback",
  "activeWaterCropHarvestFeedback",
  "drawWaterCropHarvestFeedback",
  "waterCropDishFeedback",
  "waterCropDishFeedbackSpec",
  "triggerWaterCropDishFeedback",
  "activeWaterCropDishFeedback",
  "drawWaterCropDishFeedback",
  "waterCropOrderFeedback",
  "waterCropOrderFeedbackSpec",
  "triggerWaterCropOrderFeedback",
  "activeWaterCropOrderFeedback",
  "drawWaterCropOrderFeedback",
  "qinghePondEntryFeedback",
  "qinghePondEntryFeedbackSpec",
  "triggerQinghePondEntryFeedback",
  "activeQinghePondEntryFeedback",
  "drawQinghePondEntryFeedback",
  "qingheWaterTasteNoteSpec",
  "drawQingheWaterTasteNote",
  "qinghe_water_taste_note",
  "青禾试水笺 · 可点",
  "pondFirstCatchNoteSpec",
  "drawPondFirstCatchNote",
  "pond_first_catch_note",
  "灵池第一网 · 可点",
  "qingboDishRouteNoteSpec",
  "drawQingboDishRouteNote",
  "qingbo_dish_route_note",
  "清波鱼脍上案笺 · 可点",
  "清波鱼脍上架笺 · 可点",
  "qingboFirstSaleRestockSeedWorldSpec",
  "drawQingboFirstSaleRestockSeedWorldNote",
  "qingbo_first_sale_restock_seed_note",
  "清波鱼脍首卖回头客种子签 · 可点",
  "水鲜首卖补货缘由 · 可点",
  "qingboWaterFreshRestockWorldNoteSpec",
  "drawQingboWaterFreshRestockWorldNote",
  "qingbo_water_fresh_restock_note",
  "水鲜补货签 · 可点",
  "水鲜回头客 · 可点",
  "lingchiWaterFreshMenuWorldNoteSpec",
  "drawLingchiWaterFreshMenuWorldNote",
  "lingchi_water_fresh_menu_note",
  "灵池三鲜羹上案笺 · 可点",
  "双水鲜小菜单 · 可点",
  "waterFreshRegularPledgeWorldNoteSpec",
  "drawWaterFreshRegularPledgeWorldNote",
  "water_fresh_regular_pledge_note",
  "水鲜熟客留单 · 可点",
  "水鲜熟客明日帖 · 可点",
  "waterFreshMenuRegularReasonWorldSpec",
  "drawWaterFreshMenuRegularReasonWorldNote",
  "water_fresh_menu_regular_reason_note",
  "双水鲜熟客缘由签 · 可点",
  "水鲜小菜单熟客缘由签 · 可点",
  "qingheWaterFreshReturnOrderWorldNoteSpec",
  "drawQingheWaterFreshReturnOrderWorldNote",
  "qinghe_water_fresh_return_order_note",
  "青禾水鲜回订单 · 可点",
  "回订单可交 · 可点",
  "qingheWaterwayPreludeWorldNoteSpec",
  "drawQingheWaterwayPreludeWorldNote",
  "qinghe_waterway_prelude_note",
  "水航备货牌 · 可点",
  "水航鲜货可交 · 可点",
  "青禾五心待稳 · 可点",
  "waterFreshReturnToWaterwayReasonWorldSpec",
  "drawWaterFreshReturnToWaterwayReasonWorldNote",
  "water_fresh_return_to_waterway_reason_note",
  "水鲜回订水航缘由签 · 可点",
  "水航鲜货缘由已齐 · 可点",
  "qingheLotusBasinTradeDispatchWorldNoteSpec",
  "drawQingheLotusBasinTradeDispatchWorldNote",
  "qinghe_lotus_basin_trade_dispatch_note",
  "莲泽水航可发队 · 可点",
  "莲泽商队在途 · 可点",
  "水航补给有缺 · 可点",
  "qingheLotusBasinFollowupOrderWorldNoteSpec",
  "drawQingheLotusBasinFollowupOrderWorldNote",
  "qinghe_lotus_basin_followup_order_note",
  "莲泽熟路续订单 · 可点",
  "莲泽续订可交 · 可点",
  "lotusBasinReturnFollowupReasonWorldSpec",
  "drawLotusBasinReturnFollowupReasonWorldNote",
  "lotus_basin_return_followup_reason_note",
  "莲泽返货续订缘由签 · 可点",
  "莲泽续订缘由已齐 · 可点",
  "qingheLotusBasinLongOrderWorldNoteSpec",
  "drawQingheLotusBasinLongOrderWorldNote",
  "qinghe_lotus_basin_long_order_note",
  "莲泽回订补货牌 · 可点",
  "莲泽长单账 · 可点",
  "莲泽长单已稳 · 可点",
  "qingheLotusBasinStandingOrderWorldNoteSpec",
  "drawQingheLotusBasinStandingOrderWorldNote",
  "qinghe_lotus_basin_standing_order_note",
  "莲泽常单缺口 · 可点",
  "莲泽常单可传话 · 可点",
  "莲泽常单不断档 · 可点",
  "qingheWaterwayAfterwordWorldNoteSpec",
  "drawQingheWaterwayAfterwordWorldNote",
  "qinghe_waterway_afterword_note",
  "青禾水路小簿 · 可点",
  "莲泽常单被镇上记住了",
  "qingheWaterwayTownRumorWorldNoteSpec",
  "drawQingheWaterwayTownRumorWorldNote",
  "qinghe_waterway_town_rumor_note",
  "镇上传话回访灯 · 可点",
  "青禾小簿 -> 镇上传话 -> 外来客认门",
  "shopWordOfMouthWorldNoteSpec",
  "drawShopWordOfMouthWorldNote",
  "shop_word_of_mouth_note",
  "铺前市闻来帖 · 可点",
  "谁传话 -> 谁来认门 -> 头排接货",
  "只定位旧铺市闻和来帖，不会自动开铺、接客、成交、改价、补货或消耗材料",
  "来帖缺货签 · 可点",
  "市闻来客 -> 头排缺货 -> 先补路线",
  "只定位补货路线和市闻来帖，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存",
  "来帖头排备齐签 · 可点",
  "补货入仓 -> 头排备齐 -> 手动开铺",
  "只定位旧铺市闻、来帖和头排货签，不会自动开铺、接客、成交、改价、补货或消耗库存",
  "createWaterwayStandingTownWordOfMouth",
  "recordWaterwayStandingTownWordOfMouth",
  "莲泽常单铺前市闻",
  "莲泽熟路水鲜",
  "明日铺前市闻",
  "qinghePondProgressFeedback",
  "qinghePondProgressFeedbackSpec",
  "triggerQinghePondProgressFeedback",
  "activeQinghePondProgressFeedback",
  "drawQinghePondProgressFeedback",
  "first_canal_restoration",
  "first_water_crop_plant",
  "first_luzhu_qin_harvest",
  "first_water_crop_order_delivery",
  "first_qingbo_yukuai_crafted",
  "first_qingbo_yukuai_sold",
  "qinghe_pond_entry_feedback",
  "qinghe_pond_quest_visible_after_order",
  "qinghe_pond_build_feedback",
  "qinghe_pond_catch_feedback",
  "qinghe_pond_recipe_feedback",
  "qinghe_pond_sale_feedback",
  "availableSeedCrops",
  "seed_luzhu_qin",
  "crop_luzhu_qin",
  "水流恢复",
  "地块扩张",
  "水系作物解锁",
  "露珠芹种子",
  "第一次水田播种",
  "露珠芹入水田",
  "第一次露珠芹初收",
  "水田初收",
  "工坊可直接开做",
  "青禾的清口尝鲜订单",
  "第一次凉拌灵芹出锅",
  "水系料理成品",
  "订单板亮起",
  "订单可交",
  "交付预览",
  "青禾清口单交付",
  "水系链路闭环",
  "新渠入账",
  "新渠第一盘口味卖成了",
  "修渠 -> 露珠芹 -> 凉拌灵芹 -> 青禾清口单",
  "青禾灵池线开启",
  "青禾一心 · 灵池支线浮现",
  "水路下一站是旧池塘",
  "清口单 -> 青禾一心 -> 建灵池浅塘 -> 第一尾灵鱼",
  "灵池浅塘建成",
  "第一网灵鱼",
  "清波鱼脍配方解锁",
  "灵池水鲜进度",
  "建灵池浅塘 -> 第一网灵鱼 -> 清波鱼脍",
  "第一盘清波鱼脍出案",
  "灵池水鲜成品 · 旧铺可上架",
  "旧铺水鲜首卖",
  "灵池水鲜第一次卖出去了",
  "灵池水鲜首卖",
  "水鲜递出 · 灵石入账",
  "清波鱼脍旧铺首卖",
  "灵池水鲜首卖 · 水鲜招牌成线",
  "水鲜招牌成线",
  "青禾听见旧铺真的卖出水鲜了",
  "清波鱼脍 -> 旧铺首卖 -> 水鲜招牌",
  "清波鱼脍首卖",
  "qingboFirstSale",
  "qingbo-live",
  "createQingboWaterFreshRestockTarget",
  "qinghe_pond_first_sale",
  "灵池水鲜补货签",
  "灵池水鲜补货追踪",
  "清波鱼脍 x",
  "水鲜回头客已经闻着路回来",
  "水鲜熟客留言墙",
  "水鲜熟客苗头板",
  "把灵池水鲜顺嘴带给了新脚步",
  "water-fresh",
  "qingbo_water_fresh_restock_done",
  "qinghe_pond_restock_feedback",
  "清波鱼脍补货完成",
  "灵池水鲜补货 · 招牌稳住",
  "水鲜补货兑现",
  "灵池水鲜补货兑现",
  "water-fresh-restock",
  "水鲜招牌",
  "maybeCompleteQingboWaterFreshSignatureLine",
  "qingboWaterFreshSignatureAura",
  "qingboWaterFreshSignatureAuraSnapshot",
  "qingboWaterFreshSignatureVisitBias",
  "qingboWaterFreshSignatureBudgetBonus",
  "qingboWaterFreshSignatureMarkup",
  "qingboSignatureAura",
  "qingbo_signature_aura",
  "灵池水鲜招牌常驻",
  "shop-signature-aura water-fresh",
  "drawQingboWaterFreshSignatureSign",
  "qingbo_water_fresh_signature_line",
  "qinghe_pond_signature_feedback",
  "灵池水鲜招牌成型",
  "水鲜招牌 · 稳定客群成线",
  "首卖 -> 补货 -> 回头成交 -> 水鲜招牌",
  "补货后再成交",
  "item_food_lingchi_sanxian_geng",
  "recipe_lingchi_sanxian_geng",
  "first_lingchi_sanxian_geng_crafted",
  "maybeCompleteLingchiWaterFreshMenuLine",
  "createLingchiWaterFreshRegularPledge",
  "water_fresh_regular_pledge_",
  "water_fresh_regular_pledge",
  "lingchi_water_fresh_menu_line",
  "maybeCompleteLingchiWaterFreshRegulars",
  "lingchi_water_fresh_regulars",
  "water_fresh_regulars",
  "水鲜熟客留单",
  "水鲜固定客群",
  "水鲜固定客群成型",
  "regularsActive",
  "qinghe_pond_menu_feedback",
  "order_qinghe_water_fresh_return_0001",
  "order_year2_water_0001",
  "order_year2_water_0002",
  "recipe_helu_tangshui_shuihang",
  "outputRecipesFor",
  "bestRecipeForOutput",
  "triggerQingheWaterFreshReturnOrderFeedback",
  "triggerQingheYear2WaterwayOrderFeedback",
  "triggerQingheLotusBasinTradeReturnFeedback",
  "triggerQingheLotusBasinFollowupOrderFeedback",
  "lotusBasinFamiliarRouteBonus",
  "markQingheYear2WaterwayPrelude",
  "qinghe_water_fresh_return_order_done",
  "qinghe_year2_waterway_prelude",
  "qinghe_year2_waterway_order_done",
  "qinghe_lotus_basin_trade_return",
  "qinghe_lotus_basin_return_dialogue",
  "qinghe_lotus_basin_followup_order_done",
  "dialogue_qinghe_lotus_basin_return",
  "addNpcFavor(\"npc_qinghe\", 3, \"莲泽水航返货\")",
  "queueDialogueGroup(\"dialogue_qinghe_lotus_basin_return\")",
  "qinghe_pond_return_order_feedback",
  "feedback.phase === \"return_order\"",
  "青禾水鲜回订单",
  "固定客群 -> 青禾回订",
  "waterway_fresh_route",
  "waterway_trade_boat",
  "lotus_basin_trade_return",
  "lotus_basin_followup_order",
  "水航鲜货路标",
  "水航鲜货",
  "莲泽水航开单",
  "莲泽水航商船",
  "莲泽水航返货",
  "莲泽熟路长单",
  "莲泽续订",
  "莲泽返货",
  "莲泽熟路",
  "莲泽熟路水鲜招牌",
  "水航水鲜成交预算",
  "item_drink_helu_tangshui",
  "lotusFollowupActive",
  "waterwayDrinkActive",
  "熟路加成：风险 -5%，回款 +6%，补给达标时额外返货 +1。",
  "familiarRoute.profitBonus",
  "familiarRoute.riskReduction",
  "familiarRoute.rareRewardBonus",
  "familiar?.active",
  "点选水航",
  "灵池三鲜羹",
  "灵池水鲜小菜单",
  "水鲜小菜单 · 第二道招牌",
  "activeVisitPledge",
  "visitPledgeBudgetBonus",
  "feedback.phase === \"menu\"",
  "feedback.phase === \"signature\"",
  "qinghe-pond-entry",
  "qinghe-pond-progress",
  "relationship-pond-feedback",
  "relationship-pond-progress-feedback",
  "凉拌灵芹",
  "青禾的尝鲜订单",
  "灵渠复流",
  "水润灵田",
  "showDialogue",
  "speakerId",
  "activeDialogueStageSpec",
  "dialogueSpeakerVisual",
  "drawDialogueSpeakerPortrait",
  "drawActiveDialogueStage",
  "dialogue-line stage-focus",
  "current-speaker",
  "cutsceneShots",
  "cutsceneCanvasSpec",
  "cutsceneFocusPoint",
  "cutsceneActionLabel",
  "cutsceneWorldSlateCandidate",
  "cutsceneWorldSlateSpec",
  "cutsceneWorldSlateAtCanvasPoint",
  "focusCutsceneWorldSlateFromCanvas",
  "drawCutsceneWorldSlate",
  "cutsceneWorldSlateFocus",
  "剧情场记牌",
  "镜头焦点",
  "情绪音频",
  "玩法钩子",
  "点选剧情场记牌",
  "只定位演出面板，不自动播放",
  "不会自动播放演出、推进镜头、跳过演出、触发支线或消耗资源",
  "drawActiveCutsceneOverlay",
  "画布镜头",
  "startCutscene",
  "advanceCutscene",
  "skipActiveCutscene",
  "renderCutscenePanel",
  "playedCutscenes",
  "finalSupportBundles",
  "finalSupportStages",
  "finalSupportReady",
  "unlockFinalSupport",
  "applyFinalSupportStage",
  "renderFinalSupportPanel",
  "unlockedFinalSupports",
  "appliedFinalSupportStages",
  "updateMissions",
  "renderMissions",
  "questStepsFor",
  "questProgress",
  "worldObjectiveGuideSpec",
  "worldGuideTargetPoint",
  "drawWorldObjectiveGuide",
  "worldPriorityTriageSpec",
  "worldPriorityTriageAtCanvasPoint",
  "focusWorldPriorityTriageFromCanvas",
  "drawWorldPriorityTriage",
  "uiPressureReliefSpec",
  "uiPressureReliefMarkup",
  "focusUiPressureRelief",
  "ui-pressure-relief-card",
  "data-ui-pressure-focus",
  "后期 UI 减压牌",
  "首屏强提示",
  "今日三件事",
  "醒来三步",
  "昨夜日终承接",
  "fromDaySummary",
  "summaryAdvice",
  "summaryDeltaText",
  "只显示最高优先 3 件",
  "只看重点",
  "不会自动收获",
  "不会自动执行明日动作",
  "drawEarlyRewardFeedback",
  "drawPrologueWorldMarks",
  "drawCommerceWorldMarks",
  "前三小时正反馈",
  "正反馈达成",
  "旧灵纹",
  "第一块田",
  "有灵在动",
  "第一个伙计",
  "后厂起香",
  "第一张委托",
  "旧铺开张",
  "第一笔钱签",
  "下一步 · 核心循环",
  "stepProgress",
  "stepLabel",
  "claimedQuestRewards",
  "questRewardReady",
  "claimQuestReward",
  "checkQuestRewards",
  "sideQuestVisible",
  "triggerReadable",
  "triggerParamMet",
  "configuredTriggerReady",
  "executeConfiguredEvent",
  "scanConfiguredEvents",
  "activeSideQuests",
  "renderDialogue",
  "spawnTermRisks",
  "patrolRiskGuardSpec",
  "resolveRisk",
  "settleUnresolvedRisks",
  "applyRiskPenalty",
  "riskFailureCompensationSpec",
  "applyRiskFailureCompensation",
  "triggerRiskCompensationFeedback",
  "activeRiskCompensationFeedback",
  "drawRiskCompensationFeedback",
  "renderRisks",
  "drawFieldRiskOverlay",
  "riskPanel",
  "startDungeon",
  "exploreDungeon",
  "challengeDungeonBoss",
  "bossSkillsFor",
  "bossSkillForTurn",
  "bossPhaseForPercent",
  "dungeonBossMaxHp",
  "bossHp",
  "bossFamiliarity",
  "bossBestPercent",
  "bossStrikeBonus",
  "dungeonBossFamiliarityMarkup",
  "dungeonWorldChanges",
  "rareSpiritClues",
  "dungeonWorldChangeKey",
  "dungeonWorldVisualType",
  "rareSpiritEventForMechanic",
  "rareSpiritClueForEvent",
  "applyDungeonWorldChange",
  "dungeonHazards",
  "dungeonHazardProfile",
  "dungeonHazardPressure",
  "enemyAiLabel",
  "enemyWeaknessText",
  "lootConditionMet",
  "skillImpact",
  "spiritCombatSkills",
  "spiritCombatBonus",
  "skillName",
  "leaveDungeon",
  "renderDungeonPanel",
  "tradeRoutes",
  "tradeRouteEvents",
  "tradeRouteRiskSupplies",
  "hiddenDungeonRotations",
  "routeSupplyStatus",
  "tradeRouteUnlocked",
  "routeRiskScore",
  "hiddenRotationForRoute",
  "routePreview",
  "probeTradeRoute",
  "tradeCargoCandidates",
  "tradeCargoPlan",
  "startTradeRoute",
  "settleTradeRun",
  "settleTradeRoutes",
  "tradeRuns",
  "renderTradeRoutes",
  "drawDungeonWorld",
  "drawDungeonTelegraph",
  "drawDungeonLootNodes",
  "drawDungeonSkillBadges",
  "drawDungeonEnemyShape",
  "dungeonMechanicStageSetSpec",
  "drawDungeonMechanicStageSet",
  "drawDungeonMechanicStageToken",
  "秘境机关舞台",
  "雷木机关舞台",
  "长灯影路舞台",
  "drawDungeonWorldChanges",
  "drawRareSpiritClueWisps",
  "drawRareSpiritCompanionMoments",
  "drawWorkshopAutomation",
  "drawTradeTraffic",
  "drawShopCourtyardActivity",
  "drawEcologyShopAuraAtShop",
  "ecologyShopAuraVisualPalette",
  "ecologyShopAuraVisualActive",
  "ecologyShopAuraVisitorRows",
  "drawEcologyShopAuraVisitors",
  "ecologyShopAuraVisitorBubble",
  "ecologyShopAuraVisitorColor",
  "shopCrowdHeatSpec",
  "drawShopCrowdHeat",
  "drawShopCrowdPerson",
  "shopCrowdHeatUiSpec",
  "shop-crowd-heat",
  "shop-crowd-memory",
  "热卖牌",
  "门口排队",
  "围观",
  "犹豫离店",
  "门口热度",
  "旧铺门口热度回看",
  "夜事余韵",
  "巡看照料已接上",
  "顺着余韵来",
  "灵息往铺里走",
  "drawShopCompendiumDisplayMotif",
  "drawCompendiumDisplayAudience",
  "drawCohabCourtyard",
  "drawLivingWorldSummary",
  "drawLayeredHills",
  "solarTermAtmosphereProfile",
  "solarTermMoodSceneSpec",
  "solarTermMoodSceneMarkup",
  "focusSolarTermMoodScene",
  "solarTermMoodWorldPlaqueSpec",
  "solarTermMoodWorldPlaqueAtCanvasPoint",
  "focusSolarTermMoodWorldPlaqueFromCanvas",
  "drawSolarTermMoodWorldPlaque",
  "solarTermMoodWorldRouteTargets",
  "solarTermMoodWorldRouteAtCanvasPoint",
  "focusSolarTermMoodWorldRouteFromCanvas",
  "drawSolarTermMoodWorldRoutes",
  "solarTermMoodTrail",
  "recordSolarTermMoodTrail",
  "solarTermMoodProgressSpec",
  "solarTermMoodDaySummaryInsight",
  "solarTermMoodCompletionSealSpec",
  "solarTermMoodCompletionSealAtCanvasPoint",
  "focusSolarTermMoodCompletionSealFromCanvas",
  "drawSolarTermMoodCompletionSeal",
  "focusDaySummarySolarTermMood",
  "solarTermMoodStampArchiveSpec",
  "solarTermMoodStampArchiveMarkup",
  "focusSolarTermMoodStampArchive",
  "focusSolarTermMoodStampArchiveRoute",
  "solarTermMoodShopDisplaySpec",
  "solarTermMoodShopDisplayCustomerEchoSpec",
  "solarTermMoodShopDisplayCustomerEchoMarkup",
  "solarTermMoodShopDisplayDaySummarySpec",
  "solarTermMoodShopDisplayDaySummaryMarkup",
  "focusDaySummarySolarMoodShopDisplay",
  "solarTermMoodShopDisplayMarkup",
  "focusSolarTermMoodShopDisplay",
  "solarTermMoodShopDisplayWorldAtCanvasPoint",
  "focusSolarTermMoodShopDisplayWorld",
  "drawSolarTermMoodShopDisplayWorld",
  "solarTermMoodStampArchiveWorldRelicSpec",
  "solarTermMoodStampArchiveWorldRelicAtCanvasPoint",
  "focusSolarTermMoodStampArchiveWorldRelic",
  "drawSolarTermMoodStampArchiveWorldRelic",
  "day-summary-solar-mood",
  "data-day-summary-solar-mood",
  "solar-term-mood-scene",
  "data-solar-term-mood-action",
  "data-solar-term-mood-route",
  "solar-mood-stamp-archive",
  "data-solar-mood-stamp",
  "data-solar-mood-stamp-route",
  "data-solar-mood-shop-display",
  "data-day-summary-solar-shop-display",
  "solar-mood-shop-display",
  "day-summary-solar-shop-display",
  "solar_mood_shop_display",
  "今日画境",
  "主世界今日画境",
  "点选今日画境地标",
  "今日画境回响",
  "今日画境合图印",
  "节气画境印记",
  "画境路线页",
  "画境印匣",
  "画境印记陈设架",
  "画境陈设来客回响",
  "旧铺画境陈设回响",
  "四路读懂",
  "已读懂",
  "cropSolarAffinity",
  "cropSolarYieldBonus",
  "seedSolarRecommendation",
  "solarFieldSeedCandidate",
  "solarFieldDecisionBoardSpec",
  "solarFieldDecisionBoardMarkup",
  "focusSolarFieldBoardPlot",
  "drawSolarFieldDecisionBadges",
  "selectedPlotDetailSpec",
  "renderSelectedPlotCard",
  "plantedCropSolarAffinitySummary",
  "drawSolarTermAtmosphere",
  "weatherWorldMoodSpec",
  "drawWeatherWorldMoodLayer",
  "weatherLifeVignetteSpec",
  "drawWeatherLifeVignettes",
  "weatherLifeVignetteTargets",
  "weatherLifeVignetteDaySummaryRows",
  "focusDaySummaryWeatherLife",
  "townLifeWeatherMomentSpec",
  "townLifeWeatherGreetingLine",
  "townLifeWeatherErrandTemplate",
  "townLifeErrandRouteSpec",
  "townLifeErrandRouteCueSpec",
  "townLifeErrandRouteCueAtCanvasPoint",
  "townLifeErrandPlaqueAtCanvasPoint",
  "townLifeErrandRouteWorldFocus",
  "townLifeErrandRouteWorldTargetPoint",
  "queueTownLifeErrandRouteWorldFocus",
  "townLifeErrandRouteWorldFocusAtCanvasPoint",
  "focusTownLifeErrandRouteWorldTarget",
  "townLifeErrandDeliverySafetyText",
  "focusTownLifeErrandDeliveryConfirm",
  "drawTownLifeErrandRouteCue",
  "drawTownLifeErrandRouteWorldFocus",
  "focusTownLifeErrandRoute",
  "这里只定位小托付交付入口，不会自动交付托付、扣除物品、发放回礼、增加好感或消耗资源。",
  "小托付交付留签",
  "townLifeErrandDeliveryKeepsakeWorldFocus",
  "townLifeErrandDeliveryKeepsakeNodes",
  "townLifeErrandDeliveryKeepsakeSpec",
  "townLifeErrandDeliveryKeepsakeAtCanvasPoint",
  "drawTownLifeErrandDeliveryKeepsakeWorld",
  "交给谁",
  "带什么",
  "确认入口",
  "小托付交付留签 · 可点",
  "只定位确认，不自动交付",
  "townLifeRouteWorldBoardSpec",
  "townLifeRouteWorldBoardAtCanvasPoint",
  "focusTownLifeRouteWorldBoardFromCanvas",
  "drawTownLifeRouteWorldBoard",
  "主世界镇民今日动线",
  "点选镇民动线牌",
  "镇民动线 · 可点",
  "旧铺后话在镇上",
  "townLifeShopMomentSafetyText",
  "focusTownLifeShopMomentFromCanvas",
  "这里只定位旧铺后话回看入口，不会自动打开后话页、播放对白、推进演出、写入完成标记或消耗资源。",
  "旧铺后话留签",
  "townLifeShopMomentKeepsakeWorldFocus",
  "townLifeShopMomentKeepsakeNodes",
  "townLifeShopMomentKeepsakeSpec",
  "townLifeShopMomentKeepsakeAtCanvasPoint",
  "drawTownLifeShopMomentKeepsakeWorld",
  "谁说起",
  "哪笔来往",
  "回看入口",
  "旧铺后话留签 · 可点",
  "只定位回看，不自动播放对白",
  "townLifePassalongSafetyText",
  "townLifePassalongCandidateForRow",
  "townLifePassalongRows",
  "townLifePassalongLanternWorldFocus",
  "townLifePassalongLanternSpec",
  "townLifePassalongLanternAtCanvasPoint",
  "townLifePassalongMarkerAtCanvasPoint",
  "focusTownLifePassalongLanternFromCanvas",
  "drawTownLifePassalongMarker",
  "drawTownLifePassalongLanternWorld",
  "镇民顺路捎话灯 · 可点",
  "谁捎来",
  "捎哪件事",
  "只定位来源，不自动推进",
  "townLifeErrandFeedback",
  "townLifeErrandFeedbackSpec",
  "activeTownLifeErrandFeedback",
  "drawTownLifeErrandFeedback",
  "recordTownLifeWeatherErrandEcho",
  "latestTownLifeWeatherErrand",
  "weatherErrandHistory",
  "drawTownLifeWeatherMoment",
  "drawTownLifeWeatherErrandEcho",
  "townLifeWeatherMomentDaySummaryRows",
  "focusDaySummaryTownWeather",
  "weather_life_vignette",
  "weatherLifeVignettes",
  "townLifeWeatherMoments",
  "townLifeWeatherErrands",
  "data-day-summary-weather-life",
  "data-day-summary-town-weather",
  "data-day-summary-town-weather-errand",
  "data-canvas-town-errand-route",
  "data-town-opportunity-errand-route",
  "data-town-life-errand-route",
  "day-summary-weather-life",
  "day-summary-town-weather",
  "day-summary-town-weather-errand",
  "weather_life",
  "town_weather",
  "昨日天气余温",
  "昨日镇上天气见闻",
  "action === \"weather_life\"",
  "action === \"town_weather\"",
  "drawSolarTermFieldAura",
  "主世界天象",
  "天气生活小景",
  "镇上天气见闻",
  "镇民天气小景",
  "天气缘由",
  "天气托付回响",
  "小托付回礼",
  "托付办妥",
  "天气托付备货",
  "备货路线 ·",
  "看备货路线",
  "备货牌",
  "交付牌",
  "点选备货牌",
  "点选小托付交付牌",
  "点选备货终点",
  "妥",
  "回看回响",
  "雨檐留净水",
  "热风补水",
  "雾灯热汤",
  "霜天暖汤",
  "回看镇民小景",
  "点选天气小景",
  "回看天气小景",
  "铺前雨棚",
  "避雨脚印",
  "旱天水缸",
  "霜天火盆",
  "雾天灯笼",
  "露水叶碗",
  "水洼",
  "旱纹",
  "霜边",
  "雾带",
  "露珠",
  "晴光",
  "田垄节气看板",
  "关键田块",
  "data-solar-field-plot",
  "term-field-board",
  "term-field-row",
  "fieldActionFeedbackSpec",
  "drawFieldActionFeedback",
  "triggerNightGrowthFeedback",
  "activeNightGrowthFeedback",
  "drawNightGrowthFeedback",
  "colorWithAlpha",
  "drawCanalAndTown",
  "drawBuiltStructures",
  "drawSpiritSprite",
  "drawNpcVisitors",
  "drawCustomerThoughtBubbles",
  "drawAmbientMotes",
  "dungeonPanel",
  "dungeonClears",
  "defeatedBosses",
  "buildStructure",
  "renderBuildPanel",
  "workshopMultiplier",
  "buildPanel",
  "builtBuildings",
  "unlockedMachines",
  "renderReleasePanel",
  "renderAchievementPanel",
  "renderAcceptancePanel",
  "renderAssetPanel",
  "steam-ready-showcase",
  "renderTermPanel",
  "applySolarTerm",
  "pickWeatherForTerm",
  "currentWeatherConfig",
  "applyWeatherForDay",
  "weatherById",
  "weatherLabel",
  "visual_fx_id",
  "crop_growth_modifier",
  "applyCaptureScene",
  "exportCurrentPng",
  "preloadImages",
  "startAnimationLoop",
  "startInputLoop",
  "bindKeyboardInput",
  "pollGamepadInput",
  "performAction",
  "primaryAction",
  "pulseAtSelected",
  "skipCutscene",
  "playCue",
  "ensureAudio",
  "audioMixBuses",
  "audioBusVolume",
  "gainForBus",
  "busForCue",
  "audioBusVolumes",
  "updateMasterGain",
  "recordError",
  "ACHIEVEMENT_KEY",
  "CLOUD_SAVE_KEY",
  "PLATFORM_STATE_KEY",
  "STEAMWORKS_BRIDGE",
  "steamworksAdapter",
  "hydratePlatformState",
  "renderPlatformPanel",
  "SAVE_SCHEMA_VERSION",
  "saveSchemaRegistry",
  "saveMigrationPlan",
  "saveSchemaCoverage",
  "validateSaveSchema",
  "migrateSavePayload",
  "renderSaveSchemaPanel",
  "localizationCoverage",
  "localizationCoverageFor",
  "localizationSummary",
  "renderLocalizationPanel",
  "communityContentCalendar",
  "communityAssetReady",
  "communityCalendarSummary",
  "renderCommunityPanel",
  "conditionGroups",
  "conditionGroupsById",
  "conditionExpressionFor",
  "evaluateConditionExpression",
  "conditionGroupStatus",
  "conditionQaSummary",
  "renderConditionPanel",
  "checkAchievements",
  "unlockAchievement",
  "syncSteamAchievement",
  "writeCloudMirror",
  "evaluateVerticalAcceptance",
  "evaluateQaCheck",
  "evaluateReleaseGate",
  "checklistSummary",
  "loadSettings",
  "saveSettings",
  "saveGame",
  "loadGame",
  "newGame",
  "serializeState",
  "render",
];

for (const file of requiredFiles) {
  readFileSync(file, "utf8");
}

const game = readFileSync("src/game.js", "utf8");
const styles = readFileSync("src/styles.css", "utf8");
const readme = readFileSync("README_GAME.md", "utf8");
if (!readme.includes("主世界点击处理已纳入 `npm run verify` 安全审计")) {
  throw new Error("README must document the world canvas click safety audit");
}
const worldClickStart = game.indexOf('refs.world.addEventListener("click", (event) => {');
const worldClickEnd = worldClickStart >= 0 ? game.indexOf('\n  });\n\n  refs.clearButton.addEventListener', worldClickStart) : -1;
if (worldClickStart < 0 || worldClickEnd < 0) {
  throw new Error("World canvas click handler not found for safety audit");
}
const worldClickBlock = game.slice(worldClickStart, worldClickEnd);
for (const { label, token } of [
  { label: "ecology inspection reward trigger", token: "triggerEcologyLandmarkInspection(" },
  { label: "side quest resolver", token: "resolveSideQuestStep(" },
  { label: "town-life errand completion", token: "completeTownLifeErrand(" },
  { label: "town shop afterword page open", token: "openTownLifeShopMomentPage(" },
  { label: "town memory page open", token: "openTownLifeMemoryPage(" },
  { label: "final support prep claim", token: "claimFinalSupportPrep(" },
  { label: "final support unlock", token: "unlockFinalSupport(" },
  { label: "final support stage apply", token: "applyFinalSupportStage(" },
  { label: "cutscene start", token: "startCutscene(" },
  { label: "cutscene advance", token: "advanceCutscene(" },
  { label: "cutscene skip", token: "skipActiveCutscene(" },
  { label: "sleep", token: "sleep(" },
  { label: "shop opening", token: "openShop(" },
  { label: "order delivery", token: "deliverOrder(" },
  { label: "dungeon entry", token: "enterDungeon(" },
  { label: "dungeon exploration", token: "exploreDungeon(" },
  { label: "solar term apply", token: "applySolarTerm(" },
  { label: "rare spirit event completion", token: "completeRareSpiritEvent(" },
  { label: "spirit event completion", token: "completeSpiritEvent(" },
  { label: "town-life greeting", token: "greetTownLifeNpc(" },
  { label: "town-life gift delivery", token: "giveRecommendedNpcGift(" },
  { label: "inventory mutation", token: "addItem(" },
]) {
  if (worldClickBlock.includes(token)) {
    throw new Error(`World canvas click safety violation: ${label} must use preview/focus or an explicit panel confirmation, not ${token}`);
  }
}
for (const { label, pattern } of [
  { label: "direct completion flag", pattern: /\bcomplete\s*\(/ },
  { label: "direct claim action", pattern: /\bclaim[A-Z]\w*\s*\(/ },
  { label: "direct resource mutation", pattern: /state\.(gold|fame|stamina)\s*[+\-*/]?=/ },
  { label: "direct dialogue injection", pattern: /state\.activeDialogue\s*=/ },
]) {
  if (pattern.test(worldClickBlock)) {
    throw new Error(`World canvas click safety violation: ${label} is not allowed inside the canvas click handler`);
  }
}
if (game.includes("addLog(\"点选交付牌\", `${npcName(npcId)}的小托付已经备齐，直接交付。`);")
  || game.includes("completeTownLifeErrand(npcId);\n      } else {\n        addLog(\"点选备货牌\"")) {
  throw new Error("Town-life errand canvas plaque must focus delivery confirmation only, not auto-complete the errand.");
}
for (const term of requiredGameTerms) {
  if (!game.includes(term)) throw new Error(`Missing game term: ${term}`);
}

const html = readFileSync("index.html", "utf8");
for (const id of [
  "world",
  "dayLabel",
  "termLabel",
  "weatherLabel",
  "saveButton",
  "loadButton",
  "newGameButton",
  "masterVolume",
  "audioBusControls",
  "reducedMotionToggle",
  "controllerHintsToggle",
  "seedSelect",
  "buySeedButton",
  "seedRestockHint",
  "recipeSelect",
  "shopPriceMultiplier",
  "shopShelfTheme",
  "captureStartButton",
  "captureSpiritButton",
  "captureShopButton",
  "captureTermButton",
  "exportPngButton",
  "demoGuidePanel",
  "demoGuideTitle",
  "demoGuideText",
  "demoGuideFirstSteps",
  "demoGuideProgress",
  "demoGuideActionButton",
  "panelGroupTabs",
  "clearButton",
  "plantButton",
  "waterButton",
  "harvestButton",
  "spiritButton",
  "craftButton",
  "shopButton",
  "repairButton",
  "sleepButton",
  "storyPanel",
  "missionPanel",
  "questList",
  "daySummaryPanel",
  "goalBookPanel",
  "orderPanel",
  "riskPanel",
  "dungeonPanel",
  "buildPanel",
  "dialoguePanel",
  "cutscenePanel",
  "relationshipPanel",
  "finalSupportPanel",
  "releasePanel",
  "platformPanel",
  "achievementPanel",
  "acceptancePanel",
  "saveSchemaPanel",
  "localizationPanel",
  "communityPanel",
  "conditionPanel",
  "assetPanel",
  "termPanel",
  "solarTrialPanel",
]) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing UI control: ${id}`);
}

for (const styleTerm of ["demo-guide-actions", "guide-focus", "guidePulse", "demo-guide-first-steps", "new-player-steps-card", "new-player-steps-track"]) {
  if (!styles.includes(styleTerm)) throw new Error(`Missing guide interaction style: ${styleTerm}`);
}

if (!game.includes('refs.demoGuideActionButton.addEventListener("click", runDemoGuideAction)')) {
  throw new Error("Demo guide CTA must execute runDemoGuideAction");
}

for (const newPlayerGuideTerm of ["newPlayerFirstStepsSpec", "newPlayerFirstStepsMarkup", "5分钟理解目标", "清理荒草", "播下萝卜", "入夜收获", "真正操作仍由右侧按钮执行", "demoGuideFirstSteps"]) {
  if (!game.includes(newPlayerGuideTerm) && !html.includes(newPlayerGuideTerm) && !styles.includes(newPlayerGuideTerm)) {
    throw new Error(`New player first-steps guide missing: ${newPlayerGuideTerm}`);
  }
}

const packageScript = readFileSync("tools/package-demo.mjs", "utf8");
const standaloneScript = readFileSync("tools/package-standalone.mjs", "utf8");
const desktopShellScript = readFileSync("tools/package-desktop-shell.mjs", "utf8");
const desktopShellMain = readFileSync("desktop-shell/main.mjs", "utf8");
const desktopJsonSaveCore = readFileSync("desktop-shell/json-save-core.mjs", "utf8");
const desktopShellPreload = readFileSync("desktop-shell/preload.cjs", "utf8");
const desktopShellTemplate = readFileSync("desktop-shell/package.template.json", "utf8");
const desktopSaveSmokeScript = readFileSync("tools/smoke-desktop-json-save.mjs", "utf8");
const runtimeDataScript = readFileSync("tools/build-runtime-data.mjs", "utf8");
const combatRuntimeTs = readFileSync("src/core/combat/dungeon-runtime.ts", "utf8");
const farmingRuntimeTs = readFileSync("src/core/farming/farming-runtime.ts", "utf8");
const npcRuntimeTs = readFileSync("src/core/npc/npc-runtime.ts", "utf8");
const questRuntimeTs = readFileSync("src/core/quests/quest-runtime.ts", "utf8");
const shopRuntimeTs = readFileSync("src/core/shop/shop-runtime.ts", "utf8");
const coreRuntimeJs = readFileSync("src/runtime/xiannong-core.js", "utf8");
const runtimeDataManifest = JSON.parse(readFileSync("runtime-data/runtime-data.json", "utf8"));
const packageJson = readFileSync("package.json", "utf8");
const steamRcScript = readFileSync("tools/package-steam-rc.mjs", "utf8");
const steamDepotScript = readFileSync("tools/package-steam-depot.mjs", "utf8");
const windowsStagingScript = readFileSync("tools/package-windows-staging.mjs", "utf8");
const windowsPreflightScript = readFileSync("tools/windows-preflight.mjs", "utf8");
const qaEvidenceScript = readFileSync("tools/generate-qa-evidence.mjs", "utf8");
const manualQaScript = readFileSync("tools/generate-manual-qa-evidence.mjs", "utf8");
const finalCaptureScript = readFileSync("tools/generate-final-capture-evidence.mjs", "utf8");
const smokeScript = readFileSync("tools/smoke-longrun.mjs", "utf8");
const assetScript = readFileSync("tools/generate-assets.mjs", "utf8");
const steamPreflightScript = readFileSync("tools/steam-preflight.mjs", "utf8");
const steamReleaseConfigScript = readFileSync("tools/steam-release-config.mjs", "utf8");
const steamReleaseConfigExample = readFileSync("steam-release.config.example.json", "utf8");
const windowsReleaseConfigScript = readFileSync("tools/windows-release-config.mjs", "utf8");
const windowsReleaseConfigExample = readFileSync("windows-release.config.example.json", "utf8");

for (const configTerm of ["readSteamReleaseConfig", "steam-release.config.json", "XIANNONG_STEAM_APP_ID", "XIANNONG_STEAM_DEPOT_ID", "XIANNONG_STEAM_BRANCH", "TBD_APP_ID", "TBD_DEPOT_ID"]) {
  if (!steamReleaseConfigScript.includes(configTerm) && !steamReleaseConfigExample.includes(configTerm)) {
    throw new Error(`Steam release config path missing: ${configTerm}`);
  }
}

for (const configTerm of ["readWindowsReleaseConfig", "windows-release.config.json", "XIANNONG_SIGNED_EXE_PATH", "XIANNONG_SIGNATURE_EVIDENCE_PATH", "XIANNONG_STEAMWORKS_EVIDENCE_PATH", "XIANNONG_STEAMWORKS_SDK_READY", "signed_exe_path", "steamworks_sdk_ready"]) {
  if (!windowsReleaseConfigScript.includes(configTerm) && !windowsReleaseConfigExample.includes(configTerm)) {
    throw new Error(`Windows release config path missing: ${configTerm}`);
  }
}

for (const migrationTerm of ["src/core/**/*.ts", "outFile", "src/runtime/xiannong-core.js", "strict"]) {
  if (!readFileSync("tsconfig.json", "utf8").includes(migrationTerm)) {
    throw new Error(`TypeScript migration config missing: ${migrationTerm}`);
  }
}

for (const packageTerm of ['"data:build": "node tools/build-runtime-data.mjs"', '"build:core": "npx --yes -p typescript@5.9.3 tsc -p tsconfig.json"', '"typecheck": "npx --yes -p typescript@5.9.3 tsc -p tsconfig.json --noEmit"', '"prestart": "npm run data:build && npm run build:core"', '"preverify": "npm run data:build && npm run build:core && npm run qa:desktop-save"', '"preqa:smoke": "npm run data:build && npm run build:core"', '"prepackage:desktop-shell": "npm run data:build && npm run build:core && npm run qa:desktop-save"']) {
  if (!packageJson.includes(packageTerm)) throw new Error(`TypeScript/runtime data package script missing: ${packageTerm}`);
}

for (const runtimeTerm of ["parseDataFiles", "parseCsv", "runtime-data", "runtime-data.json", "contentHash", "rowCount"]) {
  if (!runtimeDataScript.includes(runtimeTerm)) throw new Error(`Runtime data builder missing: ${runtimeTerm}`);
}

if (!runtimeDataManifest.contentHash || Object.keys(runtimeDataManifest.files || {}).length < 80) {
  throw new Error("Runtime JSON manifest must include a content hash and all gameplay CSV tables");
}

for (const coreTerm of ["XiannongCore.Data", "createRuntimeDataLoader", "XiannongCore.Persistence", "createSaveRuntime", "XiannongStorage", "XiannongCore.Quests", "createQuestRuntime", "XiannongCore.Shop", "createShopRuntime", "XiannongCore.Farming", "createFarmingRuntime", "XiannongCore.Combat", "createDungeonRuntime"]) {
  if (!coreRuntimeJs.includes(coreTerm) && !game.includes(coreTerm)) {
    throw new Error(`Generated core runtime or game bridge missing: ${coreTerm}`);
  }
}

if (!html.includes('src/runtime/xiannong-core.js') || html.indexOf('src/runtime/xiannong-core.js') > html.indexOf('src/game.js')) {
  throw new Error("index.html must load the TypeScript core runtime before src/game.js");
}

for (const gameBridgeTerm of ["runtimeDataLoader.loadTable", "SAVE_PROFILE_ID", "writeDesktopSaveProfile", "readDesktopSaveProfile", "saveRuntime.writeBrowserSlot", "lastLocalJsonSave", "Runtime Data"]) {
  if (!game.includes(gameBridgeTerm)) throw new Error(`Game runtime bridge missing: ${gameBridgeTerm}`);
}

for (const questRuntimeTerm of [
  "function questRuntime()",
  "globalThis.XiannongCore.Quests.createQuestRuntime",
  "runtime.stepProgress(step)",
  "runtime.questProgress(quest, side)",
  "runtime.mainStoryQuestDone(quest)",
  "runtime.mainStoryQuestStarted(quest)",
  "runtime.questStateMatches(questId, expected)",
  "runtime.questStepDone(stepId)",
  "runtime.questRewardReady(quest, side)",
  "runtime.claimQuestReward(quest, side)",
  "runtime.checkQuestRewards()",
  "runtime.triggerParamMet(trigger)",
  "runtime.configuredTriggerReady(trigger)",
  "runtime.currentSideQuestStep(quest)",
  "runtime.sideQuestActionLabel(quest)",
  "runtime.sideQuestRouteActionLabel(quest)",
  "runtime.sideQuestStepAdvanceAmount(step)",
  "questRuntime()?.sideQuestResolvePlan(quest)",
  "resolvePlan?.kind",
  "resolvePlan?.amount",
  "runtime.sideQuestRewardPreviewText(quest)",
  "runtime.sideQuestVisible(quest)",
  "runtime.sideQuestClueForNpc(npcId, questId)",
  "questRuntime()?.sideQuestAcceptPlan(npcId, questId)",
  "acceptPlan.kind",
  "acceptPlan.shouldPlayCue",
  "runtime.configuredEventReadyQueue()",
  "runtime.dialogueGroupForExecuteGroup(executeGroup)",
  "questRuntime()?.dialogueLinesForGroup(groupId)",
  "state.activeDialogue = lines",
  "questRuntime()?.queueDialogueGroupPlan(groupId",
  "queuePlan.queuedGroups",
  "questRuntime()?.clearQueuedDialoguePlan(queuedDialogueGroups)",
  "questRuntime()?.flushQueuedDialoguePlan(queuedDialogueGroups)",
  "questRuntime()?.applyDialogueFlushPlan(flushPlan)",
  "flushPlan.remainingGroups",
  "runtime.questForExecuteGroup(executeGroup, side)",
  "runtime.configuredEventExecutionPlan(event)",
  "finishClaimedQuestReward",
]) {
  if (!game.includes(questRuntimeTerm)) throw new Error(`Quest TypeScript runtime bridge missing: ${questRuntimeTerm}`);
}

for (const shopRuntimeTerm of [
  "function shopRuntime()",
  "globalThis.XiannongCore.Shop.createShopRuntime",
  "runtime.customerPriceRule(customer)",
  "runtime.customerProfile(customer)",
  "runtime.shopReputationScore()",
  "runtime.customerViewFor(customer, segment)",
  "runtime.customerBudget(customer, segment)",
  "runtime.pricedGood(choice, customer",
  "customerPurchaseDecision",
  "purchaseDecision.canBuy",
  "salePricePlan",
  "salePlan.dessertBonusGold",
  "runtime.themeMatchScore(goods, theme)",
  "runtime.expandShopSemanticTags(tags)",
  "runtime.shopTagsOverlap(leftTags, rightTags)",
  "runtime.isExpressiveShopTag(tag)",
  "runtime.shopTagPriority(tag)",
  "runtime.prioritizeShopTag(tags, counts, fallback)",
  "runtime.shopHotTag(taggedGoods, theme)",
  "shopFeedback: data.shopFeedback",
  "runtime.shopFeedbackEntryMatchesTag(entry, tag)",
  "runtime.shopFeedbackForSegment(type, customerSegment, tag)",
  "runtime.shopWordOfMouthVisitBias(customer, segment, spec)",
  "runtime.shopWordOfMouthBudgetBonus(customer, tags, spec)",
  "runtime.shopCompendiumCustomerSupport({",
  "budgetBonus: plan.budgetBonus",
  "matched: plan.matched",
  "runtime.shopWeatherShelfChoiceSupport({ itemId, itemTags: tags, shelf })",
  "priceRelief: Math.min(0.06",
  "Math.min(0.085",
  "runtime.shopWeatherShelfChoiceWeight({ support, itemTags: tags, preferredTags: preferred })",
  "plan.labelKind === \"top\"",
  "const runtimePlan = shopRuntime()?.matchCustomerGood({",
  "weatherWeightScore: weatherWeight.score",
  "fallbackGood: goods[0]",
  "score: (entry.preferredHit ? 80 : 0) + entry.weatherWeight.score + entry.stockWeight - entry.index * 0.01",
  "const shopStatsDelta = shopRuntime()?.shopSalesStatsDelta({",
  "lowStockCount: lowStockBeforeOpen.length",
  "shopRuntime()?.applyShopSalesStatsDelta(stats, delta)",
  "Object.assign(stats, runtimeStats)",
  "shopSeasons: data.shopSeasons",
  "runtime.shopSeasonCycleInfo(day)",
  "runtime.shopSeasonCycleKey({ season, cycleIndex })",
  "shopRankRewards: data.shopRankRewards",
  "runtime.shopSeasonRewards(season)",
  "runtime.shopSeasonRank(score, season)",
  "reward_param === \"continue_shop\"",
  "shopSettlementRules: data.shopSettlementRules",
  "runtime.shopSeasonRules(season)",
  "runtime.shopSeasonLeadKey(map)",
  "shopRuntime()?.shopSeasonMetricValue(part, metricContext)",
  "activeBuffs: state.shopStats.activeBuffs",
  "workshopMultiplier: workshopMultiplier()",
  "function shopSeasonMetricContext(",
  "shopRuntime()?.shopSeasonScoreFromRules({",
  "...shopSeasonMetricContext(stats, seasonDay)",
  "shopRuntime()?.shopSeasonScorePlan({ parts, ledgerBonus })",
  "parts: scoredParts",
  "shopRuntime()?.shopSeasonSettlementPlan({",
  "pending.advice = pending.advice || shopSeasonAdviceForPart(weakPart)",
  "state.shopStats.pendingSettlement = pending",
  "shopRuntime()?.shopSeasonRewardClaimPlan({",
  "claimPlan.reason === \"locked\"",
  "applyRewardEntry(claimPlan.rewardEntry)",
  "state.completed.add(claimPlan.completionKey)",
]) {
  if (!game.includes(shopRuntimeTerm)) throw new Error(`Shop TypeScript runtime bridge missing: ${shopRuntimeTerm}`);
}

for (const farmingRuntimeTerm of [
  "function farmingRuntime()",
  "globalThis.XiannongCore.Farming.createFarmingRuntime",
  "runtime.cropForHarvestTarget(targetId)",
  "runtime.cropSolarAffinity(crop, plot, term, weather)",
  "runtime.cropSolarYieldBonus(crop, plot, affinity)",
  "runtime.seedProjectedHarvestSpec(crop, plot)",
  "runtime.harvestQualitySpec(crop, plot, amount, affinity)",
  "runtime.cropWorldGrowthVisualSpec(crop, plot, plotIndex, state.day)",
  "farmingRuntime()?.nightWeatherGrowthPlan",
  "weatherGrowthPlan.growthModifier",
  "runtime.nightCropGrowthPlan",
  "growthPlan.matureAfter",
  "growthPlan.caredBySystem",
  "runtime?.nightCropStatePlan",
  "cropStatePlan.wateredAfter",
  "farmingRuntime()?.harvestYieldPlan",
  "yieldPlan.harvestBonus",
  "yieldPlan.solarYield",
  "farmingRuntime()?.harvestStatePlan",
  "Object.assign(plot, harvestStatePlan)",
  "farmingRuntime()?.harvestProgressPlan",
  "harvestProgressPlan.harvestReady",
  "harvestProgressPlan.qualityReady",
  "farmingRuntime()?.harvestQualityRewardPlan",
  "qualityRewardPlan.shouldReward",
  "qualityRewardPlan.qualityAfter",
  "farmingRuntime()?.harvestRouteAccountingPlan",
  "state.lastHarvestUseRoute = harvestRoutePlan.lastHarvestUseRoute",
  "farmingRuntime()?.harvestRouteSelectionPlan",
  "routeCandidates.find(Boolean)",
  "farmingRuntime()?.plantStatePlan",
  "plantPlan.firstSeededCropId",
  "farmingRuntime()?.waterStatePlan",
  "waterPlan.watered",
]) {
  if (!game.includes(farmingRuntimeTerm)) throw new Error(`Farming TypeScript runtime bridge missing: ${farmingRuntimeTerm}`);
}

for (const npcRuntimeTerm of [
  "function npcRuntime()",
  "globalThis.XiannongCore.Npc.createNpcRuntime",
  "npcRuntime()?.favorLevel",
  "runtimeLevel",
  "npcRuntime()?.claimableFavorRewards",
  "rewardPlan.rewards",
  "npcRuntime()?.nextRelationshipMemory",
  "npcRuntime()?.relationshipMemoryProgress",
  "runtimeProgress",
  "npcRuntime()?.claimableRelationshipMemories",
  "unlockPlan.memories",
  "npcRuntime()?.relationshipMemoryWritePlan",
  "writePlan?.entry",
  "writePlan?.focus",
  "writePlan?.dialogue",
  "npcRuntime()?.schedulePriority",
  "runtimePlan.score",
  "npcRuntime()?.scheduleMatchesNow",
  "runtimePlan.matches",
]) {
  if (!game.includes(npcRuntimeTerm)) throw new Error(`NPC TypeScript runtime bridge missing: ${npcRuntimeTerm}`);
}

for (const combatRuntimeTerm of [
  "function dungeonRuntime()",
  "globalThis.XiannongCore.Combat.createDungeonRuntime",
  "bosses: data.bosses",
  "bossSkills: data.bossSkills",
  "spiritSkills: data.spiritSkills",
  "bossSkillsByBoss: data.bossSkillsByBoss",
  "spiritSkillsBySpirit: data.spiritSkillsBySpirit",
  "runtime.bossSkillsFor(bossId)",
  "runtime.bossPhaseForPercent(bossId, hpPercent)",
  "runtime.bossSkillForTurn({ bossId, turn, hpPercent })",
  "runtime.spiritCombatSkills({ spirit, dungeonClearCount: state.dungeonClears.size })",
  "runtime.spiritCombatBonus({ spirit, dungeonClearCount: state.dungeonClears.size })",
  "runtime.skillImpact(skill)",
  "runtime.dungeonBossMaxHp({ bossId: dungeonBossId(dungeon, run), fallback: 1200 })",
  "runtime.bossHpPercent({ run, bossId: dungeonBossId(dungeon, run), bossMaxHp: run?.bossMaxHp })",
  "dungeonRuntime()?.dungeonMechanicEffects({",
  "mechanicId: mechanic.dungeon_id",
  "if (runtimeEffects) return runtimeEffects",
  "dungeonRuntime()?.dungeonMechanicAdvancePlan({",
  "const advancedValue = (key, fallback) => nextMechanicState?.[key] ?? fallback",
  "advancedValue(\"pillarsLit\"",
  "advancedValue(\"lanternChain\"",
  "dungeonRuntime()?.dungeonMechanicActionPlan({",
  "currentHp: run.hp",
  "actionPlan?.hpAfter",
  "actionValue(\"overflow\"",
  "actionValue(\"lanternChain\"",
  "dungeonRuntime()?.dungeonExplorePlan({",
  "const enemyPower = explorePlan.enemyPower",
  "const damage = explorePlan.damage",
  "dungeonRuntime()?.dungeonExploreStatePlan({",
  "lootCount: loot.length",
  "run.progress = Number(exploreStatePlan?.progressAfter",
  "dungeonRuntime()?.dungeonExploreOutcomePlan({",
  "state.stamina = Number(exploreOutcomePlan?.staminaAfter",
  "run.floor = Number(exploreOutcomePlan?.floorAfter",
  "dungeonRuntime()?.dungeonLootPlan({",
  "conditionResults",
  "for (const entry of lootPlan) addItem(entry.itemId, entry.count)",
  "dungeonRuntime()?.dungeonBossExchangePlan({",
  "const supportGuard = exchangePlan.supportGuard",
  "const absorbed = exchangePlan.absorbed",
  "const bossDamage = exchangePlan.bossDamage",
  "dungeonRuntime()?.dungeonBossExchangeStatePlan({",
  "bossShieldAfter: exchangePlan.bossShieldAfter",
  "run.combatMoment = exchangeStatePlan?.combatMoment",
  "run.bossShield = Number(exchangeStatePlan?.bossShieldAfter ?? exchangePlan.bossShieldAfter)",
  "dungeonRuntime()?.dungeonBossClearPlan({",
  "for (const entry of clearPlan?.guaranteedLoot || []) addItem(entry.itemId, entry.count)",
  "state.fame += Number(clearPlan?.fameDelta ?? 5)",
  "run.lastLoot = [...finalBossLoot, ...rotationRewardItems]",
  "dungeonRuntime()?.dungeonFailureRewardPlan({",
  "failurePlan?.failureReason",
  "failurePlan?.stampAmount",
  "failurePlan?.shouldRecord",
  "dungeonRuntime()?.dungeonFailureInsightPlan({",
  "insight.bossSkillNames",
  "insight.bossNextSkillName",
  "dungeonRuntime()?.dungeonFailureInsightApplyPlan({",
  "state.dungeonFailureInsights = applyPlan.nextInsights",
  "recordFailureCodexEntry(applyPlan.codexEntry)",
  "dungeonRuntime()?.dungeonPostBattleSideEffectPlan({",
  "function dungeonPostBattleSideEffectActions(plan",
  "function applyDungeonPostBattleSideEffectAction(action",
  "applyDungeonPostBattleSideEffectPlan(sideEffectPlan, dungeon, bossId)",
  "postBattleActions",
]) {
  if (!game.includes(combatRuntimeTerm)) throw new Error(`Combat TypeScript runtime bridge missing: ${combatRuntimeTerm}`);
}

for (const questCoreSourceTerm of [
  "export interface RewardPoolRow",
  "questRewardReady(",
  "claimQuestReward(",
  "checkQuestRewards()",
  "hooks.applyRewardEntry",
  "state.claimedQuestRewards?.add",
  "state.missionDone?.add",
  "state.activeSideQuests?.add",
  "export interface ConfiguredTriggerRow",
  "export interface TriggerReadyStatus",
  "triggerParamMet(trigger",
  "configuredTriggerReady(trigger",
  "hooks.currentTermId()",
  "hooks.shopReputationScore()",
  "export interface SideQuestActionState",
  "currentSideQuestStep(quest",
  "sideQuestStepAdvanceAmount(step",
  "sideQuestActionState(quest",
  "sideQuestRouteActionState(quest",
  "sideQuestResolvePlan(quest",
  "export interface SideQuestResolvePlan",
  "sideQuestResolveTiming(step",
  "sideQuestRewardPreviewText(quest",
  "sideQuestVisible(quest",
  "sideQuestClueForNpc(npcId",
  "export interface SideQuestClue",
  "export type SideQuestClueStatus",
  "export interface SideQuestAcceptPlan",
  "sideQuestAcceptPlan(npcId",
  "start_from_trigger",
  "start_direct",
  "export interface ConfiguredEventCandidate",
  "export type ConfiguredEventActionKind",
  "export interface ConfiguredEventExecutionPlan",
  "configuredEventReadyQueue()",
  "configuredEventActionKind(event",
  "dialogueGroupForExecuteGroup(executeGroup",
  "dialogueLinesForGroup(groupId",
  "export interface ActiveDialogueLine",
  "hooks.localize",
  "queueDialogueGroupPlan(groupId",
  "clearQueuedDialoguePlan(queuedGroups",
  "applyDialogueFlushPlan(plan",
  "flushQueuedDialoguePlan(queuedGroups",
  "export interface DialogueQueuePlan",
  "export interface DialogueQueueApplyPlan",
  "questForExecuteGroup(executeGroup",
  "configuredEventExecutionPlan(event",
  "actionKind: configuredEventActionKind(event)",
  "dialogueGroup: dialogueGroupForExecuteGroup(executeGroup)",
  "data.dialoguesByGroup",
  "start_spirit_manor_chapter",
  "finish_herb_valley_baizhi",
  "generic_unlock",
  "data.eventTriggers",
  "data.sideQuestTriggers",
  "data.sideQuestTriggersByQuest",
  "Number(state.fame || 0)",
  "hooks.rewardEntryPreview",
  "hooks.formatSideQuestActionLabel",
  "hooks.formatSideQuestRouteActionLabel",
  "hooks.formatSideQuestRewardPreview",
]) {
  if (!questRuntimeTs.includes(questCoreSourceTerm)) throw new Error(`Quest TypeScript source missing quest runtime term: ${questCoreSourceTerm}`);
}

for (const questCoreRuntimeTerm of [
  "function rewardPoolEntries",
  "function questRewardReady",
  "function claimQuestReward",
  "function checkQuestRewards",
  "hooks.applyRewardEntry",
  "state.claimedQuestRewards?.add",
  "state.missionDone?.add",
  "state.activeSideQuests?.add",
  "function triggerParamMet",
  "function configuredTriggerReady",
  "hooks.currentTermId()",
  "hooks.shopReputationScore()",
  "function currentSideQuestStep",
  "function sideQuestStepAdvanceAmount",
  "function sideQuestActionState",
  "function sideQuestRouteActionState",
  "function sideQuestResolvePlan",
  "function sideQuestResolveTiming",
  "function sideQuestRewardPreviewText",
  "function sideQuestVisible",
  "function sideQuestClueForNpc",
  "function sideQuestAcceptPlan",
  "start_from_trigger",
  "start_direct",
  "function configuredEventReadyQueue",
  "function configuredEventActionKind",
  "function dialogueGroupForExecuteGroup",
  "function dialogueLinesForGroup",
  "hooks.localize",
  "function queueDialogueGroupPlan",
  "function clearQueuedDialoguePlan",
  "function applyDialogueFlushPlan",
  "function flushQueuedDialoguePlan",
  "function questForExecuteGroup",
  "function configuredEventExecutionPlan",
  "actionKind: configuredEventActionKind(event)",
  "dialogueGroup: dialogueGroupForExecuteGroup(executeGroup)",
  "data.dialoguesByGroup",
  "start_spirit_manor_chapter",
  "finish_herb_valley_baizhi",
  "generic_unlock",
  "data.eventTriggers",
  "data.sideQuestTriggers",
  "data.sideQuestTriggersByQuest",
  "Number(state.fame || 0)",
  "hooks.rewardEntryPreview",
  "hooks.formatSideQuestActionLabel",
  "hooks.formatSideQuestRouteActionLabel",
  "hooks.formatSideQuestRewardPreview",
]) {
  if (!coreRuntimeJs.includes(questCoreRuntimeTerm)) throw new Error(`Generated quest runtime missing quest term: ${questCoreRuntimeTerm}`);
}

for (const shopCoreSourceTerm of [
  "namespace XiannongCore.Shop",
  "export interface ShopRuntime",
  "customerPriceRule(customer",
  "customerProfile(customer",
  "shopReputationScore()",
  "customerViewFor(customer",
  "customerBudget(customer",
  "pricedGood(choice",
  "themeBonus",
  "termBonus",
  "overpriceLimit",
  "export interface CustomerPurchaseDecision",
  "customerPurchaseDecision(input",
  "effectiveBudget",
  "stockPressure",
  "rejectedByPrice",
  "export interface SalePricePlan",
  "salePricePlan(input",
  "baseSalePrice",
  "dessertBonusGold",
  "themeMatchScore(goods",
  "semanticTagGroups",
  "expandShopSemanticTags(tags",
  "shopTagsOverlap(leftTags",
  "expressiveShopTags",
  "shopTagPriorities",
  "isExpressiveShopTag(tag",
  "shopTagPriority(tag",
  "prioritizeShopTag(tags",
  "shopHotTag(goods",
  "shopFeedback: ShopRow[]",
  "shopFeedbackEntryMatchesTag(entry",
  "shopFeedbackForSegment(type",
  "data.shopFeedback.filter",
  "trigger.match(/hot_tag==([a-z_]+)/)",
  "trigger.matchAll(/tag_match==([a-z_]+)/g)",
  "export interface ShopWordOfMouthSpec",
  "shopWordOfMouthVisitBias(customer",
  "shopWordOfMouthBudgetBonus(customer",
  "spec.preferredArchetypes",
  "Number(spec.tagVisitBias || 0)",
  "Number(spec.tagBudgetBonus || 0)",
  "export interface ShopCompendiumDisplay",
  "export interface ShopCompendiumCustomerSupportInput",
  "export interface ShopCompendiumCustomerSupportPlan",
  "shopCompendiumCustomerSupport(input",
  "customerArchetypeId",
  "Math.min(0.16",
  "matched.reduce",
  "export interface ShopWeatherShelfChoiceSupportInput",
  "export interface ShopWeatherShelfChoiceSupportPlan",
  "shopWeatherShelfChoiceSupport(input",
  "inactiveWeatherShelfPlan",
  "weatherKindBonus",
  "Math.min(0.085",
  "priceRelief: Math.min(0.06",
  "export interface ShopWeatherShelfChoiceWeightInput",
  "export interface ShopWeatherShelfChoiceWeightPlan",
  "shopWeatherShelfChoiceWeight(input",
  "preferredBridge = shopTagsOverlap",
  "support.isTopGood ? 34 : 18",
  "Math.round(Number(support.budgetBonus || 0) * 180)",
  "labelKind: support.isTopGood ? \"top\" : \"match\"",
  "export interface ShopCustomerGoodCandidate",
  "export interface ShopCustomerGoodMatchPlan",
  "scoreCustomerGoodCandidate(candidate",
  "score: (candidate.preferredHit ? 80 : 0) + weatherWeightScore + stockWeight - index * 0.01",
  "matchCustomerGood(input",
  "candidate.weatherWeightScore > 0",
  "input?.fallbackGood || null",
  "export interface ShopSalesStatsDeltaInput",
  "export interface ShopSalesStatsDelta",
  "export interface ShopSalesStatsSnapshot",
  "incrementShopStatsCount(counts",
  "shopSalesStatsDelta(input",
  "applyShopSalesStatsDelta(stats",
  "addShopStatsCounts(counts",
  "boughtRows = report.filter",
  "stockSafeSessions: lowStock ? 0 : 1",
  "shopSeasons?: ShopRow[]",
  "export interface ShopSeasonCycleInfo",
  "export interface ShopSeasonCycleKeyInput",
  "shopSeasonCycleInfo(day",
  "cycleIndex < 9999",
  "shopSeasonCycleKey(input",
  "shopRankRewards?: ShopRow[]",
  "shopSeasonRewards(season",
  "data.shopRankRewards",
  "shopSeasonRank(score",
  "reward_param: \"continue_shop\"",
  "shopSettlementRules?: ShopRow[]",
  "export type ShopNumericCounts",
  "shopSeasonRules(season",
  "data.shopSettlementRules",
  "shopSeasonLeadKey(counts",
  "export interface ShopSeasonMetricValueInput",
  "shopSeasonMetricValue(part",
  "freshness_score: Math.min(100, 56 + avgTheme * 44 + freshBuff * 100)",
  "festival_score: input?.currentTermId === \"term_dongzhi\"",
  "export interface ShopSeasonScoreFromRulesInput",
  "shopSeasonScoreFromRules(input",
  "raw: shopSeasonMetricValue(rule.score_part || \"\", input)",
  "export interface ShopSeasonScorePlanInput",
  "export interface ShopSeasonScorePlan",
  "shopSeasonScorePlan(input",
  "weighted: raw * Number(part.rule?.weight || 0)",
  "Math.round(parts.reduce",
  "score: Math.round(baseScore * (1 + ledgerBonus))",
  "export interface ShopSeasonSettlementPlanInput",
  "export interface ShopSeasonSettlementPlan",
  "shopSeasonSettlementPlan(input",
  "weakPart = settlement.parts.slice().sort",
  "bestSellerItemId = shopSeasonLeadKey(stats.itemSales)",
  "rewardClaimed: false",
  "export interface ShopSeasonRewardClaimPlanInput",
  "export type ShopSeasonRewardClaimReason",
  "shopSeasonRewardClaimPlan(input",
  "completionKey = pending ? `shop_season_reward_${pending.seasonId || \"\"}_${pending.cycleIndex || 0}` : \"\"",
  "reason: \"locked\"",
  "reason: \"missing\"",
  "reason: \"claimed\"",
  "reason: \"claim\"",
  "ecology_product: 20",
  "route_rare: 18",
  "recover_sp: 13",
  "festival_food",
  "portable_supply",
  "rare_goods",
  "required_item_tags",
  "data.priceRulesByArchetype?.get",
  "data.customerProfilesBy?.get",
  "preferred_tags: compactJoin",
  "Math.round(Math.max(baseBudget, csvBudget) * budgetRate)",
]) {
  if (!shopRuntimeTs.includes(shopCoreSourceTerm)) throw new Error(`Shop TypeScript source missing shop runtime term: ${shopCoreSourceTerm}`);
}

for (const shopCoreRuntimeTerm of [
  "XiannongCore.Shop",
  "function createShopRuntime",
  "function customerPriceRule",
  "function customerProfile",
  "function shopReputationScore",
  "function customerViewFor",
  "function customerBudget",
  "function pricedGood",
  "themeBonus",
  "termBonus",
  "overpriceLimit",
  "function customerPurchaseDecision",
  "effectiveBudget",
  "stockPressure",
  "rejectedByPrice",
  "function salePricePlan",
  "baseSalePrice",
  "dessertBonusGold",
  "function themeMatchScore",
  "semanticTagGroups",
  "function expandShopSemanticTags",
  "function shopTagsOverlap",
  "expressiveShopTags",
  "shopTagPriorities",
  "function isExpressiveShopTag",
  "function shopTagPriority",
  "function prioritizeShopTag",
  "function shopHotTag",
  "function shopFeedbackEntryMatchesTag",
  "function shopFeedbackForSegment",
  "data.shopFeedback.filter",
  "trigger.match(/hot_tag==([a-z_]+)/)",
  "trigger.matchAll(/tag_match==([a-z_]+)/g)",
  "function shopWordOfMouthVisitBias",
  "function shopWordOfMouthBudgetBonus",
  "Number(spec.tagVisitBias || 0)",
  "Number(spec.tagBudgetBonus || 0)",
  "function shopCompendiumCustomerSupport",
  "customerArchetypeId",
  "Math.min(0.16",
  "matched.reduce",
  "function shopWeatherShelfChoiceSupport",
  "function inactiveWeatherShelfPlan",
  "weatherKindBonus",
  "Math.min(0.085",
  "priceRelief: Math.min(0.06",
  "function shopWeatherShelfChoiceWeight",
  "preferredBridge = shopTagsOverlap",
  "support.isTopGood ? 34 : 18",
  "Math.round(Number(support.budgetBonus || 0) * 180)",
  "labelKind: support.isTopGood ? \"top\" : \"match\"",
  "function scoreCustomerGoodCandidate",
  "score: (candidate.preferredHit ? 80 : 0) + weatherWeightScore + stockWeight - index * 0.01",
  "function matchCustomerGood",
  "candidate.weatherWeightScore > 0",
  "input?.fallbackGood || null",
  "function incrementShopStatsCount",
  "function shopSalesStatsDelta",
  "function applyShopSalesStatsDelta",
  "function addShopStatsCounts",
  "boughtRows = report.filter",
  "stockSafeSessions: lowStock ? 0 : 1",
  "function shopSeasonCycleInfo",
  "cycleIndex < 9999",
  "function shopSeasonCycleKey",
  "season_shop_001",
  "function shopSeasonRewards",
  "data.shopRankRewards",
  "function shopSeasonRank",
  "reward_param: \"continue_shop\"",
  "function shopSeasonRules",
  "data.shopSettlementRules",
  "function shopSeasonLeadKey",
  "Object.entries(counts || {})",
  "function shopSeasonMetricValue",
  "freshness_score: Math.min(100, 56 + avgTheme * 44 + freshBuff * 100)",
  "festival_score: input?.currentTermId === \"term_dongzhi\"",
  "function shopSeasonScoreFromRules",
  "raw: shopSeasonMetricValue(rule.score_part || \"\", input)",
  "function shopSeasonScorePlan",
  "weighted: raw * Number(part.rule?.weight || 0)",
  "Math.round(parts.reduce",
  "score: Math.round(baseScore * (1 + ledgerBonus))",
  "function shopSeasonSettlementPlan",
  "weakPart = settlement.parts.slice().sort",
  "bestSellerItemId = shopSeasonLeadKey(stats.itemSales)",
  "rewardClaimed: false",
  "function shopSeasonRewardClaimPlan",
  "completionKey = pending ? `shop_season_reward_${pending.seasonId || \"\"}_${pending.cycleIndex || 0}` : \"\"",
  "reason: \"locked\"",
  "reason: \"missing\"",
  "reason: \"claimed\"",
  "reason: \"claim\"",
  "ecology_product: 20",
  "route_rare: 18",
  "recover_sp: 13",
  "festival_food",
  "portable_supply",
  "rare_goods",
  "required_item_tags",
  "data.priceRulesByArchetype?.get",
  "data.customerProfilesBy?.get",
  "preferred_tags: compactJoin",
  "Math.round(Math.max(baseBudget, csvBudget) * budgetRate)",
]) {
  if (!coreRuntimeJs.includes(shopCoreRuntimeTerm)) throw new Error(`Generated shop runtime missing shop term: ${shopCoreRuntimeTerm}`);
}

for (const farmingCoreSourceTerm of [
  "namespace XiannongCore.Farming",
  "export interface FarmingRuntime",
  "cropForHarvestTarget(targetId",
  "cropSolarAffinity(",
  "cropSolarYieldBonus(crop",
  "seedProjectedHarvestSpec(crop",
  "harvestQualitySpec(crop",
  "cropWorldGrowthVisualSpec(crop",
  "hooks.hasAnySpirit()",
  "hooks.qualityQuestItemIdForCrop",
  "spriteScale: plot.mature ? 0.76",
  "export interface NightWeatherGrowthPlan",
  "nightWeatherGrowthPlan(input",
  "weatherGrowthModifier",
  "growthModifier: weatherGrowthModifier + farmGrowthBonus",
  "export interface NightCropGrowthPlan",
  "nightCropGrowthPlan(input",
  "careSource",
  "adjustedGrowDays",
  "newlyMature",
  "export interface NightCropStatePlan",
  "nightCropStatePlan(input",
  "wateredAfter: false",
  "export interface HarvestYieldPlan",
  "harvestYieldPlan(input",
  "farmTaskLevel >= 5 ? 2",
  "baseYield + harvestBonus + cohabWaterBonus + pondCropBonus",
  "export interface HarvestStatePlan",
  "harvestStatePlan(input",
  "cropId: null",
  "seedItemId: null",
  "plantedDay: null",
  "export interface HarvestProgressPlan",
  "harvestProgressPlan(input",
  "harvestReady: harvestBefore < threshold && harvestAfter >= threshold",
  "qualityReady: qualityBefore < threshold && qualityAfter >= threshold",
  "export interface HarvestQualityRewardPlan",
  "harvestQualityRewardPlan(input",
  "shouldReward",
  "qualityAfter: qualityBefore + (shouldReward ? rewardCount : 0)",
  "export interface HarvestRouteAccountingPlan",
  "harvestRouteAccountingPlan(input",
  "lastHarvestUseRoute",
  "hasRoute: Boolean(itemId)",
  "export interface HarvestRouteSelectionPlan",
  "harvestRouteSelectionPlan(input",
  "candidateCount",
  "candidates[0] || input.fallbackRoute",
  "export interface PlantStatePlan",
  "plantStatePlan(input",
  "watered: false",
  "mature: false",
  "firstSeededCropId",
  "export interface WaterStatePlan",
  "waterStatePlan(input",
  "watered: true",
  "wasWatered",
  "wateredDay",
  "data.cropsById?.get",
  "data.cropsBySeed?.get",
  "hooks.unresolvedRisks()",
  "termBonuses.some",
  "yieldBonus: Math.min(2, boostCount)",
]) {
  if (!farmingRuntimeTs.includes(farmingCoreSourceTerm)) throw new Error(`Farming TypeScript source missing farming runtime term: ${farmingCoreSourceTerm}`);
}

for (const farmingCoreRuntimeTerm of [
  "XiannongCore.Farming",
  "function createFarmingRuntime",
  "function cropForHarvestTarget",
  "function cropSolarAffinity",
  "function cropSolarYieldBonus",
  "function seedProjectedHarvestSpec",
  "function harvestQualitySpec",
  "function cropWorldGrowthVisualSpec",
  "hooks.hasAnySpirit()",
  "hooks.qualityQuestItemIdForCrop",
  "spriteScale: plot.mature ? 0.76",
  "function nightWeatherGrowthPlan",
  "weatherGrowthModifier",
  "growthModifier: weatherGrowthModifier + farmGrowthBonus",
  "function nightCropGrowthPlan",
  "careSource",
  "adjustedGrowDays",
  "newlyMature",
  "function nightCropStatePlan",
  "wateredAfter: false",
  "function harvestYieldPlan",
  "farmTaskLevel >= 5 ? 2",
  "baseYield + harvestBonus + cohabWaterBonus + pondCropBonus",
  "function harvestStatePlan",
  "cropId: null",
  "seedItemId: null",
  "plantedDay: null",
  "function harvestProgressPlan",
  "harvestReady: harvestBefore < threshold && harvestAfter >= threshold",
  "qualityReady: qualityBefore < threshold && qualityAfter >= threshold",
  "function harvestQualityRewardPlan",
  "shouldReward",
  "qualityAfter: qualityBefore + (shouldReward ? rewardCount : 0)",
  "function harvestRouteAccountingPlan",
  "lastHarvestUseRoute",
  "hasRoute: Boolean(itemId)",
  "function harvestRouteSelectionPlan",
  "candidateCount",
  "candidates[0] || input.fallbackRoute",
  "function plantStatePlan",
  "watered: false",
  "mature: false",
  "firstSeededCropId",
  "function waterStatePlan",
  "watered: true",
  "wasWatered",
  "wateredDay",
  "data.cropsById?.get",
  "data.cropsBySeed?.get",
  "hooks.unresolvedRisks()",
  "termBonuses.some",
  "yieldBonus: Math.min(2, boostCount)",
]) {
  if (!coreRuntimeJs.includes(farmingCoreRuntimeTerm)) throw new Error(`Generated farming runtime missing farming term: ${farmingCoreRuntimeTerm}`);
}

for (const npcCoreSourceTerm of [
  "namespace XiannongCore.Npc",
  "export interface NpcRuntime",
  "favorLevel(value",
  "claimableFavorRewards(input",
  "rewardIds",
  "nextRelationshipMemory(input",
  "relationshipMemoryProgress(input",
  "claimableRelationshipMemories(input",
  "memoryIds",
  "relationshipMemoryWritePlan(input",
  "RelationshipMemoryWritePlan",
  "schedulePriority(schedule",
  "scheduleMatchesNow(schedule",
  "droughtMatch",
  "festival",
  "timeMatch",
]) {
  if (!npcRuntimeTs.includes(npcCoreSourceTerm)) throw new Error(`NPC TypeScript source missing NPC runtime term: ${npcCoreSourceTerm}`);
}

for (const npcCoreRuntimeTerm of [
  "XiannongCore.Npc",
  "function createNpcRuntime",
  "function favorLevel",
  "function claimableFavorRewards",
  "rewardIds",
  "function nextRelationshipMemory",
  "function relationshipMemoryProgress",
  "function claimableRelationshipMemories",
  "memoryIds",
  "function relationshipMemoryWritePlan",
  "memory_new_page",
  "function schedulePriority",
  "function scheduleMatchesNow",
  "droughtMatch",
  "festival",
  "timeMatch",
]) {
  if (!coreRuntimeJs.includes(npcCoreRuntimeTerm)) throw new Error(`Generated NPC runtime missing NPC term: ${npcCoreRuntimeTerm}`);
}

for (const combatCoreSourceTerm of [
  "namespace XiannongCore.Combat",
  "export interface CombatRuntime",
  "export function createDungeonRuntime",
  "bossSkillsFor(bossId",
  "bossPhaseForPercent(bossId",
  "bossSkillForTurn(input",
  "skillImpact(skill",
  "spiritCombatSkills(input",
  "spiritCombatBonus(input",
  "dungeonBossMaxHp(input",
  "bossHpPercent(input",
  "export interface DungeonMechanicEffectsInput",
  "dungeonMechanicEffects(input",
  "export interface DungeonMechanicAdvancePlan",
  "dungeonMechanicAdvancePlan(input",
  "changedKeys(input?.mechanicState || {}, nextState)",
  "nextState.resonanceTurn = !nextState.resonanceTurn",
  "nextState.waterLevel = (mechanicValue(nextState, \"waterLevel\", 1) + 1) % 3",
  "nextState.lanternChain = Math.min(7",
  "export interface DungeonMechanicActionPlan",
  "dungeonMechanicActionPlan(input",
  "hpDelta = 4 + support",
  "hpDelta = 3",
  "nextState.waterLevel = 1",
  "nextState.windShift = 0",
  "mechanicId",
  "resonanceTurn",
  "lootMultiplier: 1",
  "case \"dsm_004\"",
  "overflow * 0.12",
  "case \"dsm_008\"",
  "input?.phase === \"boss\"",
  "export interface DungeonExplorePlan",
  "dungeonExplorePlan(input",
  "enemyPower",
  "Math.round(enemyPower / 4)",
  "export interface DungeonExploreStatePlan",
  "dungeonExploreStatePlan(input",
  "combatMoment: damage >= 16 ? \"danger\" : lootCount > 0 ? \"loot\" : \"steady\"",
  "export interface DungeonExploreOutcomePlan",
  "dungeonExploreOutcomePlan(input",
  "outcome: \"boss_ready\"",
  "staminaAfter: Math.max(25",
  "export interface DungeonLootPlanInput",
  "export interface DungeonLootPlanEntry",
  "dungeonLootPlan(input",
  "lootConditionPass(entry, conditionResults)",
  "((day * 37) + (floor * 19) + (runSeed * 11) + turn) % totalWeight",
  "export interface DungeonBossExchangePlan",
  "dungeonBossExchangePlan(input",
  "bossPressure",
  "supportGuard",
  "baseStrike",
  "shieldAfterSkill",
  "absorbed",
  "bossShieldAfter",
  "bossDamage",
  "export interface DungeonBossExchangeStatePlan",
  "dungeonBossExchangeStatePlan(input",
  "bossHpAfter <= 0",
  "phaseBefore !== bossPhaseAfter",
  "export interface DungeonBossClearPlan",
  "dungeonBossClearPlan(input",
  "boss_shixiang_tengmu",
  "item_special_baicao_mulu",
  "fameDelta: 5",
  "export interface DungeonFailureRewardPlan",
  "dungeonFailureRewardPlan(input",
  "outcome === \"boss_failed\"",
  "overflowFailure ? \"overflow\" : \"retreat\"",
  "export interface DungeonFailureInsightPlan",
  "dungeonFailureInsightPlan(input",
  "bossFamiliarity",
  "overflowRelief",
  "bossStrikeBonus",
  "export interface DungeonFailureInsightApplyPlan",
  "dungeonFailureInsightApplyPlan(input",
  "nextInsights",
  "codexEntry",
  "export type DungeonPostBattleSideEffectAction",
  "export interface DungeonPostBattleSideEffectPlan",
  "actions: DungeonPostBattleSideEffectAction[]",
  "dungeonPostBattleSideEffectPlan(input",
  "kind: \"seasonal_goal\"",
  "kind: \"story_hook\"",
  "kind: \"completion\"",
  "kind: \"cohab_event\"",
  "lanternDungeonClears",
  "chapter4_pantao_finale",
  "phaseCount >= 3",
  "percent <= 0.35",
  "percent <= 0.7",
  "skill.effect_type === \"spawn_hazard\"",
  "skill.effect_type === \"shield\"",
  "data.spiritSkillsBySpirit?.get",
  "dungeonClearCount",
  "Number(spirit.jobLevels?.expedition || 0) * 3",
  "Math.max(300, Number(boss?.hp_total",
]) {
  if (!combatRuntimeTs.includes(combatCoreSourceTerm)) throw new Error(`Combat TypeScript source missing combat runtime term: ${combatCoreSourceTerm}`);
}

for (const combatCoreRuntimeTerm of [
  "XiannongCore.Combat",
  "function createDungeonRuntime",
  "function bossSkillsFor",
  "function bossPhaseForPercent",
  "function bossSkillForTurn",
  "function skillImpact",
  "function spiritCombatSkills",
  "function spiritCombatBonus",
  "function dungeonBossMaxHp",
  "function bossHpPercent",
  "function dungeonMechanicEffects",
  "function dungeonMechanicAdvancePlan",
  "function changedKeys",
  "nextState.resonanceTurn = !nextState.resonanceTurn",
  "nextState.waterLevel = (mechanicValue(nextState, \"waterLevel\", 1) + 1) % 3",
  "nextState.lanternChain = Math.min(7",
  "function dungeonMechanicActionPlan",
  "hpDelta = 4 + support",
  "hpDelta = 3",
  "nextState.waterLevel = 1",
  "nextState.windShift = 0",
  "mechanicId",
  "resonanceTurn",
  "lootMultiplier: 1",
  "case \"dsm_004\"",
  "overflow * 0.12",
  "case \"dsm_008\"",
  "input?.phase === \"boss\"",
  "function dungeonExplorePlan",
  "enemyPower",
  "Math.round(enemyPower / 4)",
  "function dungeonExploreStatePlan",
  "combatMoment: damage >= 16 ? \"danger\" : lootCount > 0 ? \"loot\" : \"steady\"",
  "function dungeonExploreOutcomePlan",
  "outcome: \"boss_ready\"",
  "staminaAfter: Math.max(25",
  "function dungeonLootPlan",
  "function lootConditionPass",
  "((day * 37) + (floor * 19) + (runSeed * 11) + turn) % totalWeight",
  "function dungeonBossExchangePlan",
  "bossPressure",
  "supportGuard",
  "baseStrike",
  "shieldAfterSkill",
  "absorbed",
  "bossShieldAfter",
  "bossDamage",
  "function dungeonBossExchangeStatePlan",
  "bossHpAfter <= 0",
  "phaseBefore !== bossPhaseAfter",
  "function dungeonBossClearPlan",
  "boss_shixiang_tengmu",
  "item_special_baicao_mulu",
  "fameDelta: 5",
  "function dungeonFailureRewardPlan",
  "outcome === \"boss_failed\"",
  "overflowFailure ? \"overflow\" : \"retreat\"",
  "function dungeonFailureInsightPlan",
  "bossFamiliarity",
  "overflowRelief",
  "bossStrikeBonus",
  "function dungeonFailureInsightApplyPlan",
  "nextInsights",
  "codexEntry",
  "function dungeonPostBattleSideEffectPlan",
  "const actions = [",
  "kind: \"seasonal_goal\"",
  "kind: \"story_hook\"",
  "kind: \"completion\"",
  "kind: \"cohab_event\"",
  "lanternDungeonClears",
  "chapter4_pantao_finale",
  "phaseCount >= 3",
  "percent <= 0.35",
  "percent <= 0.7",
  "skill.effect_type === \"spawn_hazard\"",
  "skill.effect_type === \"shield\"",
  "data.spiritSkillsBySpirit?.get",
  "Number(spirit.jobLevels?.expedition || 0) * 3",
  "Math.max(300, Number(boss?.hp_total",
]) {
  if (!coreRuntimeJs.includes(combatCoreRuntimeTerm)) throw new Error(`Generated combat runtime missing combat term: ${combatCoreRuntimeTerm}`);
}

for (const desktopSaveTerm of ["xiannong:save-json", "registerJsonSaveIpc", "SAVE_DIR_NAME", "savePathForProfile", "XiannongStorage", "writeProfile", "readProfile", "desktop-json-save-v1"]) {
  if (!desktopShellMain.includes(desktopSaveTerm) && !desktopShellPreload.includes(desktopSaveTerm) && !desktopJsonSaveCore.includes(desktopSaveTerm)) {
    throw new Error(`Desktop JSON save bridge missing: ${desktopSaveTerm}`);
  }
}

for (const desktopJsonSaveCoreTerm of ["DESKTOP_JSON_SAVE_ADAPTER", "readDesktopJsonProfile", "writeDesktopJsonProfile", "safeFileName", "saveDirForUserData", "startsWith(safeRoot)", "userData/saves/profile_1.json"]) {
  if (!desktopJsonSaveCore.includes(desktopJsonSaveCoreTerm) && !desktopSaveSmokeScript.includes(desktopJsonSaveCoreTerm)) {
    throw new Error(`Desktop JSON save executable core missing: ${desktopJsonSaveCoreTerm}`);
  }
}

for (const desktopSaveSmokeTerm of ["readDesktopJsonProfile(userData, \"profile_1\")", "writeDesktopJsonProfile(userData, \"profile_1\"", "savePathForProfile(userData, \"../profile escape?.json\")", "DESKTOP_JSON_SAVE_SMOKE.json"]) {
  if (!desktopSaveSmokeScript.includes(desktopSaveSmokeTerm)) {
    throw new Error(`Desktop JSON save smoke missing: ${desktopSaveSmokeTerm}`);
  }
}

for (const desktopSaveEvidenceTerm of ["desktopSaveSmokeReport", "desktop_json_save_smoke", "dist/xiannong-dongtian-desktop-save-smoke", "desktop-save-smoke"]) {
  if (!qaEvidenceScript.includes(desktopSaveEvidenceTerm)) {
    throw new Error(`QA evidence must include desktop JSON save smoke: ${desktopSaveEvidenceTerm}`);
  }
}

for (const packaged of ["solar_term_config.csv", "weather_config.csv", "localization_text.csv", "event_trigger.csv", "guide_script.csv", "quest_base.csv", "quest_step.csv", "side_quest_base.csv", "side_quest_step.csv", "side_quest_event_trigger.csv", "side_quest_dialogue_map.csv", "dungeon_area.csv", "enemy_config.csv", "loot_pool.csv", "boss_config.csv", "boss_skill.csv", "spirit_skill.csv", "dungeon_solar_mechanic.csv", "interrealm_trade_route.csv", "trade_route_event.csv", "trade_route_risk_supply.csv", "hidden_dungeon_rotation.csv", "building_config.csv", "machine_config.csv", "spirit_job_mastery.csv", "spirit_expedition.csv", "spirit_ecology_combo.csv", "early_reward_pacing.csv", "year2_goal_book_rule.csv", "year2_solar_trial.csv", "rare_spirit_event_action.csv", "freeplay_goal.csv", "reward_pool.csv", "customer_segment_rule.csv", "customer_behavior_param.csv", "customer_state_flow.csv", "customer_archetype_profile.csv", "npc_bark.csv", "demo_qa_checklist.csv", "steam_asset_production_plan.csv", "achievement_config.csv", "spirit_bond_level.csv", "spirit_mood_param.csv", "spirit_voice_bank.csv", "spirit_event.csv", "spirit_memory_flag.csv", "shop_price_rule.csv", "shop_shelf_theme_bonus.csv", "shop_customer_feedback_diagnosis.csv", "order_config.csv", "year2_order_config.csv", "year2_shop_season.csv", "year2_shop_settlement_rule.csv", "year2_shop_rank_reward.csv", "favor_reward.csv", "npc_schedule.csv", "cohab_epilogue.csv", "cohab_weekly_event.csv", "cohab_festival_event.csv", "cohab_dialogue_map.csv", "cutscene_timeline.csv", "cutscene_asset_manifest.csv", "side_quest_cutscene_beat.csv", "audio_asset_list.csv", "audio_mix_bus.csv", "final_support_bundle.csv", "final_support_stage.csv", "vertical_slice_acceptance.csv", "release_readiness_gate.csv", "save_schema_registry.csv", "save_migration_plan.csv", "localization_coverage_plan.csv", "community_content_calendar.csv", "condition_group.csv", "BUILD_MANIFEST.json"]) {
  if (!packageScript.includes(packaged)) throw new Error(`Package script does not mention: ${packaged}`);
}
if (!packageScript.includes('"assets"')) throw new Error("Package script does not include assets directory");

for (const standaloneTerm of ["xiannong-dongtian-standalone", "STANDALONE_README.md", "offline_html_staging", "XIANNONG_EMBEDDED_CSV", "XIANNONG_EMBEDDED_RUNTIME_DATA", "XIANNONG_EMBEDDED_ASSETS", "src/styles.css", "src/runtime/xiannong-core.js", "src/game.js", "assets/capsule-main.svg", "BUILD_MANIFEST.json"]) {
  if (!standaloneScript.includes(standaloneTerm)) throw new Error(`Standalone package path missing: ${standaloneTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"package:standalone": "node tools/package-standalone.mjs"')) {
  throw new Error("package.json must expose package:standalone");
}

for (const desktopShellTerm of ["xiannong-dongtian-desktop-shell", "DESKTOP_SHELL_README.md", "desktop_shell_staging", "standalone-offline", "desktop-shell/main.mjs", "desktop-shell/preload.cjs", "XiannongSteamworks", "sdk_ready", "readSteamReleaseConfig", "steam_release_config", "BUILD_MANIFEST.json"]) {
  if (!desktopShellScript.includes(desktopShellTerm)) throw new Error(`Desktop shell package path missing: ${desktopShellTerm}`);
}

for (const desktopShellRuntimeTerm of ["BrowserWindow", "preload.cjs", "standalone-offline", "setWindowOpenHandler", "contextIsolation: false", "ipcMain.handle", "app.getPath(\"userData\")", "steamworks-stub-evidence", "steamworks-stub-events.jsonl", "remote-storage", "xiannong:save-json", "XiannongStorage", "desktop-json-save-v1", "XiannongSteamworks", "bridgeReady: true", "sdkReady: false", "desktop-shell-steamworks-bridge-v1", "setAchievement", "writeCloud", "activateOverlay", "steam_appid.txt", "stagedAppId"]) {
  if (!desktopShellMain.includes(desktopShellRuntimeTerm) && !desktopShellPreload.includes(desktopShellRuntimeTerm)) {
    throw new Error(`Desktop shell runtime path missing: ${desktopShellRuntimeTerm}`);
  }
}

for (const desktopTemplateTerm of ["electron", "electron-builder", "package:win", "XiannongDongtian", "standalone-offline/**"]) {
  if (!desktopShellTemplate.includes(desktopTemplateTerm)) throw new Error(`Desktop shell template missing: ${desktopTemplateTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"package:desktop-shell": "node tools/package-desktop-shell.mjs"')) {
  throw new Error("package.json must expose package:desktop-shell");
}
if (!readFileSync("package.json", "utf8").includes('"qa:desktop-save": "node tools/smoke-desktop-json-save.mjs"')) {
  throw new Error("package.json must expose qa:desktop-save");
}

for (const steamRcTerm of ["xiannong-dongtian-steam-rc", "README_STEAM_RC.md", "STEAMWORKS_GAP_REPORT.md", "launch-demo.ps1", "launch-demo.cmd", "design-docs", "steam", "qa", "not_steam_final", "release_readiness_gate.csv", "steam_asset_production_plan.csv"]) {
  if (!steamRcScript.includes(steamRcTerm)) throw new Error(`Steam RC package path missing: ${steamRcTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"package:steam-rc": "node tools/package-steam-rc.mjs"')) {
  throw new Error("package.json must expose package:steam-rc");
}

for (const steamDepotTerm of ["xiannong-dongtian-steam-depot", "steam_appid.txt", "app_build_", "depot_build_", "README_STEAMPIPE.md", "STEAM_DEPOT_READINESS.md", "not_upload_ready", "readSteamReleaseConfig", "steam_release_config", "XIANNONG_STEAM_APP_ID", "XIANNONG_STEAM_DEPOT_ID", "SteamCMD", "launch-local.cmd", "xiannong-dongtian-windows-staging", "contentDir, \"bin\"", "windows-staging", "release-evidence", "launcher", "XiannongDongtian.exe"]) {
  if (!steamDepotScript.includes(steamDepotTerm)) throw new Error(`Steam depot staging path missing: ${steamDepotTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"package:steam-depot": "node tools/package-steam-depot.mjs"')) {
  throw new Error("package.json must expose package:steam-depot");
}

for (const steamPreflightTerm of ["xiannong-dongtian-steam-depot", "STEAM_PREFLIGHT_REPORT.json", "STEAM_PREFLIGHT_REPORT.md", "STEAM_FILE_MANIFEST.json", "blocked_not_upload_ready", "preview_ready", "sha1", "steamcmd_preview_command", "placeholder_steam_ids", "missing_windows_executable", "unsigned_launcher_executable", "launcherSelfCheck", "launcherIcon", "steam_ready_pngs", "signatureReady", "steamworksReady", "signature_evidence", "steamworks_evidence"]) {
  if (!steamPreflightScript.includes(steamPreflightTerm)) throw new Error(`Steam preflight path missing: ${steamPreflightTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"steam:preflight": "node tools/steam-preflight.mjs"')) {
  throw new Error("package.json must expose steam:preflight");
}

for (const windowsTerm of ["xiannong-dongtian-windows-staging", "WINDOWS_STAGING_README.md", "desktop-manifest.json", "unsigned_launcher_exe_staging", "XiannongDongtian.exe", "XiannongDongtian.ico", "launcher-self-check.json", "/platform:x64", "/win32icon", "XiannongSteamworks", "仙农洞天-启动Demo.cmd", "readWindowsReleaseConfig", "release-evidence", "signature_evidence_path", "steamworks_evidence_path"]) {
  if (!windowsStagingScript.includes(windowsTerm)) throw new Error(`Windows staging path missing: ${windowsTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"package:windows": "node tools/package-windows-staging.mjs"')) {
  throw new Error("package.json must expose package:windows");
}

for (const windowsPreflightTerm of ["xiannong-dongtian-windows-staging", "WINDOWS_PREFLIGHT_REPORT.json", "WINDOWS_PREFLIGHT_REPORT.md", "WINDOWS_FILE_MANIFEST.json", "staging_review_ready_final_blockers", "depot_mirror_checks", "unsigned_launcher_executable", "steamworks_sdk_not_linked", "XiannongDongtian.exe", "signature_release_evidence", "steamworks_release_evidence", "signatureReady", "steamworksReady"]) {
  if (!windowsPreflightScript.includes(windowsPreflightTerm)) throw new Error(`Windows preflight path missing: ${windowsPreflightTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"windows:preflight": "node tools/windows-preflight.mjs"')) {
  throw new Error("package.json must expose windows:preflight");
}

for (const qaEvidenceTerm of ["xiannong-dongtian-qa-evidence", "QA_EVIDENCE.md", "EVIDENCE_SUMMARY.json", "qa_evidence_partial", "manualEvidence", "automatedEvidence", "release_readiness_gate.csv", "demo_qa_checklist.csv", "windows_preflight", "manual_qa_template", "MANUAL_QA_SESSION_SIGNED.json", "manual-qa", "final_capture_template", "FINAL_CAPTURE_APPROVAL_SIGNED.json", "final-capture"]) {
  if (!qaEvidenceScript.includes(qaEvidenceTerm)) throw new Error(`QA evidence bundle path missing: ${qaEvidenceTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"evidence:qa": "node tools/generate-qa-evidence.mjs"')) {
  throw new Error("package.json must expose evidence:qa");
}

for (const manualQaTerm of ["xiannong-dongtian-manual-qa", "MANUAL_QA_RUNBOOK.md", "MANUAL_QA_CHECKLIST.csv", "MANUAL_QA_SESSION_TEMPLATE.json", "MANUAL_QA_SUMMARY.json", "rrg_007", "required_duration_minutes", "120", "needs_manual_run"]) {
  if (!manualQaScript.includes(manualQaTerm)) throw new Error(`Manual QA evidence path missing: ${manualQaTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"qa:manual-template": "node tools/generate-manual-qa-evidence.mjs"')) {
  throw new Error("package.json must expose qa:manual-template");
}

for (const finalCaptureTerm of ["xiannong-dongtian-final-capture", "FINAL_CAPTURE_RUNBOOK.md", "FINAL_CAPTURE_CHECKLIST.csv", "FINAL_CAPTURE_APPROVAL_TEMPLATE.json", "FINAL_CAPTURE_SUMMARY.json", "FINAL_CAPTURE_APPROVAL_SIGNED.json", "rrg_011", "needs_final_capture", "required_screenshots", "required_trailers"]) {
  if (!finalCaptureScript.includes(finalCaptureTerm)) throw new Error(`Final capture evidence path missing: ${finalCaptureTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"capture:final-template": "node tools/generate-final-capture-evidence.mjs"')) {
  throw new Error("package.json must expose capture:final-template");
}

for (const smokeTerm of ["xiannong-dongtian-smoke-report", "SMOKE_REPORT.json", "SMOKE_REPORT.md", "simulated_days", "trial_guyu_herb", "route_cloudmarket_01", "area_mine_qingyun", "buySeed", "itemBuyPrice", "seedPurchases", "seed_restock", "stability_evidence", "vsa_009 稳定性证据", "softlock_watchdogs", "frame_budget_note", "story_completion_evidence", "rrg_008 四章主线证据", "chapter_4_complete", "final_quest_done", "year2_unlocked", "post_mainline_goal_evidence", "rrg_009 主线后目标证据", "total_estimated_minutes", "coverage", "short_session", "emotional_retention"]) {
  if (!smokeScript.includes(smokeTerm)) throw new Error(`Long-run smoke path missing: ${smokeTerm}`);
}

if (!readFileSync("package.json", "utf8").includes('"qa:smoke": "node tools/smoke-longrun.mjs"')) {
  throw new Error("package.json must expose qa:smoke");
}

for (const asset of ["capsule-main.svg", "spirit-luobo.svg", "crop-baicai.svg", "customer-villager.svg", "control-hints.svg", "screenshot-term.svg", "screenshot-ecology.svg", "screenshot-dungeon.svg", "screenshot-trade.svg", "screenshot-final-support.svg"]) {
  if (!assetScript.includes(asset)) throw new Error(`Asset generator does not create: ${asset}`);
  if (!html.includes(asset) && !game.includes(asset)) throw new Error(`Generated asset is not referenced by UI: ${asset}`);
}

for (const steamReadyTerm of ["steam-ready", "source-svg", "png", "store-main-capsule-1232x706", "store-vertical-capsule-748x896", "library-hero-3840x1240", "screenshot-final-support-1920x1080", "sharp", "steam_ready"]) {
  if (!assetScript.includes(steamReadyTerm)) throw new Error(`Steam-ready asset generator path missing: ${steamReadyTerm}`);
}

const assetManifest = JSON.parse(readFileSync("assets/asset-manifest.json", "utf8"));
const steamReady = assetManifest.steam_ready;
if (!steamReady || steamReady.assets.length < 15) throw new Error("Steam-ready asset manifest must include at least 15 dimensioned assets");
const requiredSteamReady = new Map([
  ["store_header_capsule", [920, 430]],
  ["store_small_capsule", [462, 174]],
  ["store_main_capsule", [1232, 706]],
  ["store_vertical_capsule", [748, 896]],
  ["library_capsule", [600, 900]],
  ["library_header", [920, 430]],
  ["library_hero", [3840, 1240]],
  ["screenshot_farm", [1920, 1080]],
  ["screenshot_spirit", [1920, 1080]],
  ["screenshot_shop", [1920, 1080]],
  ["screenshot_term", [1920, 1080]],
  ["screenshot_ecology", [1920, 1080]],
  ["screenshot_dungeon", [1920, 1080]],
  ["screenshot_trade", [1920, 1080]],
  ["screenshot_final_support", [1920, 1080]],
]);
for (const [id, [width, height]] of requiredSteamReady) {
  const asset = steamReady.assets.find((entry) => entry.id === id);
  if (!asset) throw new Error(`Missing Steam-ready asset manifest entry: ${id}`);
  if (asset.width !== width || asset.height !== height) throw new Error(`Steam-ready asset ${id} has wrong size: ${asset.width}x${asset.height}`);
  if (!asset.source_svg || !existsSync(asset.source_svg)) throw new Error(`Steam-ready asset missing SVG source: ${id}`);
  if (!asset.png || !existsSync(asset.png) || statSync(asset.png).size <= 0) throw new Error(`Steam-ready asset missing rendered PNG: ${id}`);
  if (!game.includes(asset.png)) throw new Error(`Steam-ready PNG is not surfaced in runtime UI: ${asset.png}`);
}

for (const styleTerm of ["steam-ready-showcase", "steam-ready-card", "capsule-grid", "library-grid", "screenshot-grid"]) {
  if (!styles.includes(styleTerm)) throw new Error(`Steam-ready showcase style missing: ${styleTerm}`);
}

for (const storeAssetEvidenceTerm of ["storeAssetEvidenceSpec", "storeAssetEvidenceMarkup", "asset-evidence-card", "asset-evidence-shot", "asset-evidence-video-strip", "vsa_010 素材清单证据牌", "核心循环截图和短视频 · 素材清单", "至少6张截图能表达卖点", "短视频节奏：从荒田开局 -> 作物成精 -> 精怪代劳 -> 加工订单 -> 旧铺成交 -> 洞天修复/秘境/终章目标", "正式上架前必须由最终可执行文件捕获真实实机截图", "素材清单"]) {
  if (!game.includes(storeAssetEvidenceTerm) && !styles.includes(storeAssetEvidenceTerm) && !readme.includes(storeAssetEvidenceTerm)) throw new Error(`vsa_010 store asset evidence missing: ${storeAssetEvidenceTerm}`);
}

if (!standaloneScript.includes("withFileTypes") || !standaloneScript.includes("walk(\"assets\")")) {
  throw new Error("Standalone package must recursively embed nested Steam-ready assets");
}

for (const canvasAsset of ["images.cropBailuobo", "images.cropBaicai", "images.spirit", "images.customer", "images.controls", "weather_weight_group", "visual_fx_id", "disaster_tag", "requestAnimationFrame", "toDataURL(\"image/png\")"]) {
  if (!game.includes(canvasAsset)) throw new Error(`Canvas asset/export path missing: ${canvasAsset}`);
}

for (const audioTerm of ["AudioContext", "createOscillator", "masterGain.gain.value", "settings.masterVolume / 100", "busGains", "data.audioMixBuses", "data-audio-bus-volume", "\"灵渠复流\""]) {
  if (!game.includes(audioTerm)) throw new Error(`WebAudio cue path missing: ${audioTerm}`);
}

for (const inputTerm of ["navigator.getGamepads", "gamepadconnected", "KEY_ACTIONS", "KEY_MOVES", "GAMEPAD_ACTIONS", "ArrowUp", "Digit8"]) {
  if (!game.includes(inputTerm)) throw new Error(`Input mapping path missing: ${inputTerm}`);
}

for (const achievementTerm of ["data.achievements", "steam_api_name", "local-profile-awaiting-steamworks-sdk", "suggestedSteamCloudPath", "unlockedAchievements", "XiannongSteamworks", "data-platform-overlay", "platformState"]) {
  if (!game.includes(achievementTerm)) throw new Error(`Achievement/cloud path missing: ${achievementTerm}`);
}

for (const platformTerm of ["STEAMWORKS_BRIDGE", "steamworksAdapter", "requestSteamOverlay", "renderPlatformPanel", "platformPanel", "PLATFORM_STATE_KEY", "state.platformState?.sdkReady", "bridgeReady", "desktop_shell_cloud_evidence_queued", "desktop_shell_achievement_evidence_queued", "desktop_shell_overlay_evidence_queued", "Steamworks SDK"]) {
  if (!game.includes(platformTerm) && !html.includes(platformTerm) && !styles.includes(platformTerm)) {
    throw new Error(`Steamworks platform bridge missing: ${platformTerm}`);
  }
}

for (const gateTerm of ["data.verticalSlice", "data.demoQa", "data.releaseGates", "vertical_slice_acceptance.csv", "demo_qa_checklist.csv", "release_readiness_gate.csv"]) {
  if (!game.includes(gateTerm)) throw new Error(`Acceptance gate path missing: ${gateTerm}`);
}

for (const saveSchemaTerm of ["data.saveSchemaRegistry", "data.saveMigrationPlan", "save_schema_registry.csv", "save_migration_plan.csv", "SAVE_SCHEMA_VERSION", "schemaReport", "saveSchemaPanel", "save-schema-card", "save-migration-card", "saveVersion", "saveMigrationHistory"]) {
  if (!game.includes(saveSchemaTerm) && !html.includes(saveSchemaTerm) && !styles.includes(saveSchemaTerm)) {
    throw new Error(`Save schema/migration path missing: ${saveSchemaTerm}`);
  }
}

for (const localizationTerm of ["data.localizationCoverage", "localization_coverage_plan.csv", "patternMatchesKey", "collectLocalizationKeysForPlan", "localizationCoverageFor", "localizationSummary", "localizationPanel", "localization-card", "localization-summary"]) {
  if (!game.includes(localizationTerm) && !html.includes(localizationTerm) && !styles.includes(localizationTerm)) {
    throw new Error(`Localization coverage path missing: ${localizationTerm}`);
  }
}

for (const communityTerm of ["data.communityContentCalendar", "community_content_calendar.csv", "communityAssetReady", "communityCalendarSummary", "communityPanel", "community-card", "community-summary"]) {
  if (!game.includes(communityTerm) && !html.includes(communityTerm) && !styles.includes(communityTerm)) {
    throw new Error(`Community calendar path missing: ${communityTerm}`);
  }
}

for (const conditionTerm of ["data.conditionGroups", "conditionGroupsById", "condition_group.csv", "conditionExpressionFor", "evaluateConditionExpression", "conditionGroupStatus", "conditionQaSummary", "conditionPanel", "condition-card", "condition-summary"]) {
  if (!game.includes(conditionTerm) && !html.includes(conditionTerm) && !styles.includes(conditionTerm)) {
    throw new Error(`Condition group path missing: ${conditionTerm}`);
  }
}

for (const questTerm of ["data.quests", "data.questSteps", "data.sideQuests", "data.sideQuestSteps", "data.sideQuestTriggers", "quest_base.csv", "quest_step.csv", "side_quest_base.csv", "side_quest_step.csv", "side_quest_event_trigger.csv", "sideQuestVisible", "questProgress", "mainStoryCompassSpec", "mainStoryQuestDone", "mainStoryStepUnlockHint", "mainStoryChapterRoadmapSpec", "mainStoryChapterRoadmapMarkup", "mainStoryFullClearSpec", "mainStoryFullClearPass", "mainStoryFullClearMarkup", "focusMainStoryFullClearEvidence", "data-main-story-clear-focus", "四章主线通关证据", "新开档到终章可完整通关", "rrg_008: mainStoryFullClearPass()", "不会自动跳关、发奖励或完成任务", "runStoryCompassAction", "queueStoryCompassFocusTarget", "applyStoryCompassFocusTarget", "data-story-compass-action", "data-main-story-roadmap", "data-main-roadmap-chapter", "story-compass-focus-pulse", "data-main-quest-id", "data-dungeon-card-id", "mission-story-compass", "prologue-journey", "prologue-journey-track", "prologue-journey-step", "commerce-journey", "commerce-journey-track", "commerce-journey-step", "data-commerce-pace", "main-story-roadmap", "main-story-roadmap-row", "main-story-roadmap-visual", "main-story-clear-evidence", "main-story-clear-chapters", "main-story-clear-flags", "dailyIntentBoardSpec", "dailyIntentBoardMarkup", "dailyIntentWorldSpec", "dailyIntentWorldTargetPoint", "dailyIntentFeedbackTargetPoint", "dailyIntentFeedback", "triggerDailyIntentFeedback", "activeDailyIntentFeedback", "drawDailyIntentWorldGuide", "drawDailyIntentFeedback", "drawDailyIntentWorldEcho", "focusDailyIntentAction", "daily-intent-board", "daily-intent-grid", "daily-intent-card", "data-daily-intent", "data-daily-intent-action", "每日三选目标", "今日主轴", "主轴回响", "经营财气", "秘境风声", "镇上人情", "今天赚钱", "今天建设", "今天探索", "避免只浇水收菜", "主线进度", "当前焦点", "解锁预告"]) {
  if (!game.includes(questTerm) && !styles.includes(questTerm)) throw new Error(`Quest data path missing: ${questTerm}`);
}

for (const sideQuestActionTerm of ["currentSideQuestStep", "sideQuestActionLabel", "sideQuestRouteActionLabel", "runSideQuestRouteAction", "queueSideQuestTaskCardFocus", "focusSideQuestPersonTarget", "focusSideQuestAreaSource", "sideQuestStepAdvanceAmount", "resolveSideQuestStep", "sideQuestOriginTalismanWorldFocus", "sideQuestWorldClueSafetyText", "sideQuestRewardPreviewText", "sideQuestWorldClueSpecs", "sideQuestWorldClueSpecForQuest", "sideQuestWorldClueSpec", "sideQuestWorldClueAtCanvasPoint", "focusSideQuestWorldClueFromCanvas", "sideQuestWorldClueSpecs(width, height, 3)", "specs.slice().reverse()", "drawSideQuestWorldClue", "drawSideQuestWorldClue(ctx, width, height);", "activeSideQuestFeedback", "drawSideQuestFeedbackOverlay", "drawSideQuestFeedbackOverlay(ctx, width, height);", "townAreaWorldPoint", "data-side-quest-action", "data-side-quest-route", "data-side-quest-id", "data-npc-id", "data-risk-card-id", ".mission-card.side button[data-side-quest-action]", ".mission-card.side button[data-side-quest-route]", "定位玩法入口", "支线步骤完成", "支线行动", "支线缘起画签", "缘起条件", "当前一步", "回报去向", "点选支线缘起画签", "点击只定位", "不会自动承接支线、推进步骤、领取奖励、播放支线演出、赠礼、交托付或消耗资源", "演出接入"]) {
  if (!game.includes(sideQuestActionTerm) && !styles.includes(sideQuestActionTerm)) throw new Error(`Side quest action path missing: ${sideQuestActionTerm}`);
}

for (const worldBuildingTerm of ["builtStructureWorldTargets", "builtStructureAtCanvasPoint", "focusBuiltStructureFromCanvas", "主画面建筑", "点选建筑："]) {
  if (!game.includes(worldBuildingTerm) && !styles.includes(worldBuildingTerm)) throw new Error(`World building interaction missing: ${worldBuildingTerm}`);
}

for (const worldLandmarkTerm of ["worldLandmarkTargets", "worldLandmarkAtCanvasPoint", "focusWorldLandmarkFromCanvas", "点选景物：", "百怪大院蓝图", "灵池有鱼", "终阵碑"]) {
  if (!game.includes(worldLandmarkTerm) && !styles.includes(worldLandmarkTerm)) throw new Error(`World landmark interaction missing: ${worldLandmarkTerm}`);
}

for (const worldContentTerm of ["worldContentTargets", "worldContentAtCanvasPoint", "focusWorldContentFromCanvas", "点选陈设：", "点选天气小景：", "weatherLifeVignetteTargets", "weather_life_vignette", "年轮纪念碑", "名铺订单备货台", "post_mainline_goal_route", "post_mainline_route_station", "十小时年路灯牌", "年路小站", "点选年路：", "点选年路小站：", "data-shop-season-board", "data-year2-order-id"]) {
  if (!game.includes(worldContentTerm) && !styles.includes(worldContentTerm)) throw new Error(`World content interaction missing: ${worldContentTerm}`);
}

for (const grottoLifePulseTerm of ["grottoLifePulseWorldSpec", "grottoLifePulseWorldAtCanvasPoint", "focusGrottoLifePulseWorldFromCanvas", "drawGrottoLifePulseWorld", "grotto_life_pulse", "洞天生活脉搏", "今天哪里在动", "田垄", "旧铺", "工坊", "精怪", "镇民", "可点定位 · 不代劳", "点选洞天生活脉搏：", "只定位今日生活动静和对应面板，不会自动播种、浇水、收获、加工、交单、开铺、接客、派工、入夜、领奖或消耗资源"]) {
  if (!game.includes(grottoLifePulseTerm) && !readme.includes(grottoLifePulseTerm)) throw new Error(`Grotto life pulse world scene missing: ${grottoLifePulseTerm}`);
}

for (const worldChangeClickTerm of ["点选异象：", "雷竹路标", "月莲静池", "药谷藤门", "炽砂断门", "花蜜甜庭", "书契账房", "夜巡灯路", "火位核心", "主街枯井", "井边水棚", "终巢水门", "阵心守夜", "蟠桃大宴", "route_thunder_old_06", "dungeonRevealCard"]) {
  if (!game.includes(worldChangeClickTerm) && !styles.includes(worldChangeClickTerm)) throw new Error(`World change click path missing: ${worldChangeClickTerm}`);
}

for (const finalSupportWorldTerm of ["finalSupportWorldTargets", "drawFinalSupportWorldProps", "data-final-support-bundle", "点选支援：", "残碑推演案", "阵骨火台", "护阵药席", "引水灯尺", "阵台榫架", "许伯筹席案"]) {
  if (!game.includes(finalSupportWorldTerm) && !styles.includes(finalSupportWorldTerm)) throw new Error(`Final support world interaction missing: ${finalSupportWorldTerm}`);
}

for (const finalSupportOverviewTerm of ["finalSupportOverviewWorldFocus", "finalSupportOverviewSafetyText", "finalSupportOverviewStats", "finalSupportOverviewNodes", "finalSupportOverviewWorldSpec", "finalSupportOverviewWorldAtCanvasPoint", "focusFinalSupportOverviewWorldFromCanvas", "drawFinalSupportOverviewWorld", "drawFinalSupportOverviewWorld(ctx", "终阵进度总览牌 · 可点", "伏笔铺垫", "正式支援", "阶段入阵", "点选终阵进度总览牌", "只定位总览 · 不自动领取 / 激活 / 应用", "不会自动领取预备支援、激活支援、应用阶段效果、播放演出、写入完成标记或消耗资源"]) {
  if (!game.includes(finalSupportOverviewTerm) && !readme.includes(finalSupportOverviewTerm)) throw new Error(`Final support overview missing: ${finalSupportOverviewTerm}`);
}

for (const finalSupportPrepKeepsakeTerm of ["finalSupportPrepKeepsakeWorldFocus", "finalSupportPrepKeepsakeSafetyText", "finalSupportPrepKeepsakeCandidate", "finalSupportPrepKeepsakeNodes", "finalSupportPrepKeepsakeSpec", "finalSupportPrepKeepsakeAtCanvasPoint", "focusFinalSupportPrepKeepsakeFromCanvas", "drawFinalSupportPrepKeepsakeWorld", "drawFinalSupportPrepKeepsakeWorld(ctx", "终章伏笔亮签 · 可点", "伏笔达标", "预备效果", "确认入口", "点选终章伏笔亮签", "只定位领取入口 · 不自动领取", "不会自动领取预备支援、激活终章支援、应用阶段效果、播放演出、写入完成标记或消耗资源"]) {
  if (!game.includes(finalSupportPrepKeepsakeTerm) && !readme.includes(finalSupportPrepKeepsakeTerm)) throw new Error(`Final support prep keepsake missing: ${finalSupportPrepKeepsakeTerm}`);
}

for (const finalSupportStageKeepsakeTerm of ["finalSupportStageKeepsakeWorldFocus", "finalSupportStageKeepsakeSafetyText", "finalSupportStageKeepsakeCandidate", "finalSupportStageKeepsakeNodes", "finalSupportStageKeepsakeSpec", "finalSupportStageKeepsakeAtCanvasPoint", "focusFinalSupportStageKeepsakeFromCanvas", "drawFinalSupportStageKeepsakeWorld", "drawFinalSupportStageKeepsakeWorld(ctx", "终章阶段亮签 · 可点", "阶段就绪", "阶段效果", "应用入口", "点选终章阶段亮签", "只定位应用入口 · 不自动应用", "不会自动应用阶段效果、播放演出、写入完成标记或消耗资源"]) {
  if (!game.includes(finalSupportStageKeepsakeTerm) && !readme.includes(finalSupportStageKeepsakeTerm)) throw new Error(`Final support stage keepsake missing: ${finalSupportStageKeepsakeTerm}`);
}

for (const finalSupportStageAfterglowTerm of ["finalSupportStageAfterglowWorldFocus", "finalSupportStageAfterglowSafetyText", "finalSupportStageAfterglowCandidate", "finalSupportStageAfterglowNodes", "finalSupportStageAfterglowSpec", "finalSupportStageAfterglowAtCanvasPoint", "focusFinalSupportStageAfterglowFromCanvas", "drawFinalSupportStageAfterglowWorld", "drawFinalSupportStageAfterglowWorld(ctx", "终章阶段余辉签 · 可点", "阶段已写入", "演出余波", "回看入口", "点选终章阶段余辉签", "只定位回看入口 · 不重复应用", "不会再次应用阶段效果、重播演出、写入完成标记或消耗资源"]) {
  if (!game.includes(finalSupportStageAfterglowTerm) && !readme.includes(finalSupportStageAfterglowTerm)) throw new Error(`Final support stage afterglow missing: ${finalSupportStageAfterglowTerm}`);
}

for (const finalSupportPrepFeedbackTerm of ["finalSupportPrepFeedback: null", "triggerFinalSupportPrepFeedback", "activeFinalSupportPrepFeedback", "activeFinalSupportPrepFeedback(now)", "drawFinalSupportPrepFeedback", "drawFinalSupportPrepFeedback(ctx", "预备支援入阵回响", "来自关系记忆", "关系伏笔", "入阵", "triggerFinalSupportPrepFeedback(bundle, tier)"]) {
  if (!game.includes(finalSupportPrepFeedbackTerm) && !readme.includes(finalSupportPrepFeedbackTerm)) throw new Error(`Final support prep feedback missing: ${finalSupportPrepFeedbackTerm}`);
}

for (const finalSupportUnlockFeedbackTerm of ["finalSupportUnlockFeedback: null", "triggerFinalSupportUnlockFeedback", "activeFinalSupportUnlockFeedback", "activeFinalSupportUnlockFeedback(now)", "drawFinalSupportUnlockFeedback", "drawFinalSupportUnlockFeedback(ctx", "终章支援到位回响", "下一阶段", "到位", "triggerFinalSupportUnlockFeedback(bundle)"]) {
  if (!game.includes(finalSupportUnlockFeedbackTerm) && !readme.includes(finalSupportUnlockFeedbackTerm)) throw new Error(`Final support unlock feedback missing: ${finalSupportUnlockFeedbackTerm}`);
}

for (const year2LifeWorldTerm of ["year2LifePlazaState", "year2LifePlazaTargets", "drawYear2LifePlaza", "drawYear2LifePlaza(ctx, width, height, livingState);", "freeplayGoalId", "点选年册：", "点选后日谈：", "点选商旗：", "自由目标年册", "后日谈共桌", "远路商旗台"]) {
  if (!game.includes(year2LifeWorldTerm) && !styles.includes(year2LifeWorldTerm)) throw new Error(`Year-two life plaza interaction missing: ${year2LifeWorldTerm}`);
}

for (const questRewardTerm of ["claimedQuestRewards", "questRewardReady", "claimQuestReward", "checkQuestRewards", "complete_reward_group", "rewardPoolEntries(quest.complete_reward_group", "奖励池"]) {
  if (!game.includes(questRewardTerm)) throw new Error(`Quest reward runtime path missing: ${questRewardTerm}`);
}

for (const configuredEventTerm of ["triggerParamMet", "configuredTriggerReady", "configuredEventReadyQueue", "configuredEventExecutionPlan", "plan?.dialogueGroup", "plan?.quest", "dialogueGroupForExecuteGroup", "questForExecuteGroup", "actionKind === \"start_main_quest\"", "actionKind === \"generic_unlock\"", "executeConfiguredEvent", "scanConfiguredEvents", "activeSideQuests", "conditionMet(event.condition_group)", "state.activeSideQuests.add", "source !== \"term-risk\""]) {
  if (!game.includes(configuredEventTerm)) throw new Error(`Configured event runtime path missing: ${configuredEventTerm}`);
}

for (const riskTerm of ["data.eventTriggers", "data.guideScripts", "event_trigger.csv", "guide_script.csv", "risk_pest", "data-risk-id", "patrolRiskGuardSpec", "drawFieldRiskOverlay", "risk-patrol-hint", "巡夜可压下", "巡夜可削弱", "guardedByPatrol", "weakenedByPatrol", "riskFailureCompensationSpec", "applyRiskFailureCompensation", "riskCompensationFeedback", "drawRiskCompensationFeedback", "risk-compensation-hint", "failureCodexState", "recordFailureCodexEntry", "failureCodexRows", "failure-codex-card", "day-summary-failure-codex", "失败见闻册", "失败见闻", "下次处理"]) {
  if (!game.includes(riskTerm) && !styles.includes(riskTerm)) throw new Error(`Solar-term risk path missing: ${riskTerm}`);
}

for (const dungeonTerm of ["data.dungeons", "data.enemies", "data.lootPools", "data.bosses", "data.bossSkills", "data.spiritSkills", "data.dungeonSolarMechanics", "dungeon_area.csv", "enemy_config.csv", "loot_pool.csv", "boss_config.csv", "boss_skill.csv", "spirit_skill.csv", "dungeon_solar_mechanic.csv", "data-dungeon-action", "dungeon_clear", "skillLog", "bossHp", "bossMaxHp", "lastEnemyId", "lastLoot", "combatMoment", "dungeonWorldChanges", "dungeonFailureInsights", "dungeonFailureInsightKey", "recordDungeonFailureInsight", "dungeonFailureInsightSummary", "dungeonBossFamiliarityMarkup", "bossFamiliarity", "bossBestPercent", "bossStrikeBonus", "bossSkillNames", "failureInsightBossStrikeBonus", "dungeonCompendium", "activeDungeonMemoryPage", "dungeonStampLabel", "grantDungeonCompendiumProgress", "solarTrialCompendiumSupport", "dungeonMemorySceneText", "dungeonMemoryCaption", "dungeonMemoryPageSpec", "dungeonCompendiumMemoryPages", "openDungeonMemoryPage", "closeDungeonMemoryPage", "drawDungeonCompendiumMonument", "rareSpiritClues", "applyDungeonWorldChange", "drawDungeonWorldChanges", "drawRareSpiritClueWisps", "activeHiddenRotationForDungeon", "dungeonRotationEntryEffect", "resolveDungeonRewardPool", "rewardPoolPreviewText", "rotationRareDropPool", "rotationBossId", "dungeonSpiritSolutionSpec", "dungeonSpiritSolutionMarkup", "dungeonMechanicSolutionTriptychSpec", "dungeonMechanicSolutionTriptychMarkup", "秘境节气解法三联牌", "场规怎么变", "精怪怎么解", "赢了改哪里", "dungeonSpiritSolutionLogText", "dungeonSpiritSolutionProfile", "精怪解法卡", "雷竹稳雷场", "月莲稳倒影", "灯影照隐藏路", "花铃安抚虫鸣", "书契标路线", "蜂蜜引虫群", "探索压力 -8", "dungeonMechanicSupportLevel", "createInitialDungeonMechanicState", "dungeonMechanicStatus", "dungeonMechanicHudSpec", "dungeonMechanicHudMarkup", "dungeonMechanicAtmosphereSpec", "drawDungeonMechanicAtmosphere", "drawActiveDungeonMechanicOverlay", "drawDungeonMechanicWorldCard", "drawDungeonFeedbackOverlay", "dungeonFeedback", "triggerDungeonFeedback", "activeDungeonFeedbackState", "dungeonAnimationActive", "bossSkillTargetLabel", "bossSkillCounterMove", "bossSkillCounterWindow", "bossSkillCounterSpiritHint", "dungeonBossCounterMarkup", "drawDungeonBossCounterCard", "读招应对", "反击窗口", "精怪援护", "dungeonBossTelegraphSpec", "dungeonMechanicEffects", "advanceDungeonMechanicState", "dungeonMechanicActionSpec", "useDungeonMechanicAction", "attune", "节气场域", "雷声场域", "水位线", "灯路影链", "借雷点柱", "续起长灯", "雷木柱", "长灯链", "满溢值", "霜寒层数", "失利见闻", "Boss 熟悉度", "最低压到", "节气印记", "回忆页", "年轮纪念碑"]) {
  if (!game.includes(dungeonTerm)) throw new Error(`Dungeon exploration path missing: ${dungeonTerm}`);
}

for (const dungeonVisualTerm of ["dungeon-mechanic-card", "dungeon-mechanic-meter", "dungeon-mechanic-nodes", "dungeon-mechanic-tag", "dungeon-solution-triptych", "dungeon-solution-triptych-grid", "dungeon-solution-card", "dungeon-spirit-solution", "dungeon-spirit-solution-row", "dungeon-boss-skill", "dungeon-boss-counter", "dungeon-boss-counter-tags", "dungeon-boss-familiarity", "dungeon-failure-insight", "memory-page-card", "memory-page-tags", "memory-page-scene", "data-tone=\"thunder\"", "data-tone=\"lantern\""]) {
  if (!styles.includes(dungeonVisualTerm)) throw new Error(`Dungeon mechanic visual feedback missing: ${dungeonVisualTerm}`);
}

for (const dungeonSolutionVisualTerm of ["dungeonSpiritSolutionFeedbackFields", "dungeonSpiritSolutionVisualSpec", "drawDungeonSpiritSolutionTrace", "drawDungeonSpiritSolutionWorldCard", "drawDungeonSpiritSolutionMotif", "solutionKey", "solutionAbility", "solutionSpiritName", "精怪解法入场", "画面反馈：光轨正在把随行精怪接入节气机关"]) {
  if (!game.includes(dungeonSolutionVisualTerm)) throw new Error(`Dungeon spirit solution visual path missing: ${dungeonSolutionVisualTerm}`);
}

for (const tradeTerm of ["data.tradeRoutes", "data.tradeRouteEvents", "data.tradeRouteRiskSupplies", "data.hiddenDungeonRotations", "interrealm_trade_route.csv", "trade_route_event.csv", "trade_route_risk_supply.csv", "hidden_dungeon_rotation.csv", "tradeRoutesById", "tradeEventsByRoute", "tradeRisksByRoute", "hiddenRotationsByArea", "data-trade-route", "data-trade-start", "trade-route-card", "trade-route-actions", "trade_route_probe", "trade_route_start", "trade_route_complete", "buff_trade_risk_down_next", "routeRiskScore"]) {
  if (!game.includes(tradeTerm) && !styles.includes(tradeTerm)) throw new Error(`Cross-realm trade route path missing: ${tradeTerm}`);
}

for (const tradeChoiceTerm of ["tradeEventChoiceSpec", "eventChoiceLabel", "eventProfitBonus", "eventRareBonus", "data-trade-choice", "冒险发队", "稳妥发队", "trade_route_choice_risky", "trade_route_choice_safe", "路上选择"]) {
  if (!game.includes(tradeChoiceTerm) && !styles.includes(tradeChoiceTerm)) throw new Error(`Cross-realm trade choice missing: ${tradeChoiceTerm}`);
}

for (const tradeFailureTerm of ["failure_trade_", "type: \"trade\"", "商队险路见闻", "商队补给缺口", "商队险路"]) {
  if (!game.includes(tradeFailureTerm) && !styles.includes(tradeFailureTerm)) throw new Error(`Cross-realm trade learning feedback missing: ${tradeFailureTerm}`);
}

for (const buildTerm of ["data.buildings", "data.machines", "building_config.csv", "machine_config.csv", "data-build-id", "build_mill_001", "BUILT_STRUCTURE_WORLD_SLOTS", "recentlyBuiltStructureId", "recentlyBuiltStructureAt", "visibleBuildings", "workshopBuildings", "shopBuildings", "build_shop_lv1", "build_loom_001", "build_vat_001", "build_kitchen_001", "build_broken_bridge_repair", "建造", "建筑"]) {
  if (!game.includes(buildTerm)) throw new Error(`Building/workshop path missing: ${buildTerm}`);
}

for (const spiritJobTerm of ["data.spiritJobMastery", "data.spiritExpeditions", "data.spiritEcologyCombos", "spirit_job_mastery.csv", "spirit_expedition.csv", "spirit_ecology_combo.csv", "data-spirit-job", "data-spirit-expedition", "spirit_expedition"]) {
  if (!game.includes(spiritJobTerm)) throw new Error(`Spirit job/expedition path missing: ${spiritJobTerm}`);
}

for (const automationPromenadeTerm of ["spiritAutomationPromenadeRows", "spiritAutomationPromenadeSpec", "spiritAutomationPromenadeMarkup", "spirit-automation-promenade", "spirit-automation-grid", "spirit-automation-card", "data-automation-line", "data-automation-job-line"]) {
  if (!game.includes(automationPromenadeTerm) && !styles.includes(automationPromenadeTerm)) throw new Error(`Spirit automation promenade missing: ${automationPromenadeTerm}`);
}

for (const spiritAutomationRelayTerm of ["spiritAutomationRelaySpec", "spiritAutomationRelayAtCanvasPoint", "focusSpiritAutomationRelayFromCanvas", "drawSpiritAutomationRelayWorld", "spiritAutomationRelayWorldFocus", "精怪接力线", "田垄 -> 后厂 -> 旧铺", "接力节点", "省工接力", "点选精怪接力线", "不会自动切岗、派工、排产、开铺、发商队、处理风险、入夜或消耗资源"]) {
  if (!game.includes(spiritAutomationRelayTerm) && !readme.includes(spiritAutomationRelayTerm)) throw new Error(`Spirit automation relay missing: ${spiritAutomationRelayTerm}`);
}

for (const multiSpiritControlTerm of ["spiritById", "assignSpiritJob(job, spiritId", "petSpirit(spiritId", "feedSpirit(spiritId", "startSpiritExpedition(expeditionId", "data-spirit-id", "dataset.spiritId", "\"patrol\"", "\"garden\""]) {
  if (!game.includes(multiSpiritControlTerm)) throw new Error(`Multi-spirit control path missing: ${multiSpiritControlTerm}`);
}

for (const spiritSpecialtyTerm of ["spiritConfigFor", "spiritMainJob", "spiritLineJobAffinity", "spiritJobSpecialtyBonus", "spiritJobSpecialtyLabel", "main_role", "spirit_line_hualing", "spirit_line_leizhu", "spirit_line_yuelian", "spirit_line_dengying", "天赋契合", "副专长"]) {
  if (!game.includes(spiritSpecialtyTerm)) throw new Error(`Spirit job specialty path missing: ${spiritSpecialtyTerm}`);
}

for (const spiritSeasonalTrailTerm of ["spiritSeasonalWorkTrailSpec", "drawSpiritSeasonalWorkTrail", "节气岗位轨迹", "雨天撑叶", "热天扇风", "雾天点灯", "冷天护苗", "露天收露", "晴天挂牌"]) {
  if (!game.includes(spiritSeasonalTrailTerm)) throw new Error(`Spirit seasonal work trail missing: ${spiritSeasonalTrailTerm}`);
}

for (const spiritSeasonalClickTerm of ["spiritSeasonalWorkTrailTargets", "spiritSeasonalWorkAtCanvasPoint", "spirit_seasonal_work", "点选精怪节气小景", "节气岗位小景", "spirit-canvas-seasonal-ticket", "seasonalFocus"]) {
  if (!game.includes(spiritSeasonalClickTerm) && !styles.includes(spiritSeasonalClickTerm)) throw new Error(`Spirit seasonal work click path missing: ${spiritSeasonalClickTerm}`);
}

for (const spiritCropScoutTerm of ["spiritCropScoutWorldFocus", "spiritCropScoutToneCopy", "spiritCropScoutWorldSpec", "spiritCropScoutWorldAtCanvasPoint", "focusSpiritCropScoutWorldFromCanvas", "drawSpiritCropScoutWorld", "drawSpiritCropScoutWorld(ctx", "cropScoutScene", "精怪看苗小动作 · 可点", "点选精怪看苗小动作", "绕着旺苗转圈", "缺水苗", "风险苗", "成熟苗", "只定位伙伴栏和田块", "不会自动浇水、收获、播种、处理风险、入夜或消耗资源"]) {
  if (!game.includes(spiritCropScoutTerm) && !readme.includes(spiritCropScoutTerm)) throw new Error(`Spirit crop scout world scene missing: ${spiritCropScoutTerm}`);
}

for (const spiritSeasonalSummaryTerm of ["spiritSeasonalWorkSceneProfile", "spiritSeasonalWorkDaySummaryRows", "focusDaySummarySpiritSeasonalWork", "spiritSeasonalWork", "data-day-summary-spirit-seasonal", "day-summary-spirit-seasonal-work", "day-summary-spirit-seasonal-row", "精怪顺应天时", "回看小景"]) {
  if (!game.includes(spiritSeasonalSummaryTerm) && !styles.includes(spiritSeasonalSummaryTerm)) throw new Error(`Spirit seasonal work day-summary path missing: ${spiritSeasonalSummaryTerm}`);
}

for (const spiritSeasonalMorningTerm of ["seasonal_spirit", "昨日天时余温", "回看精怪小景", "data-morning-row=\"seasonal_spirit\"", "action === \"seasonal_spirit\"", "清晨行动牌"]) {
  if (!game.includes(spiritSeasonalMorningTerm) && !styles.includes(spiritSeasonalMorningTerm)) throw new Error(`Spirit seasonal work morning action path missing: ${spiritSeasonalMorningTerm}`);
}

for (const daySummaryTomorrowTerm of ["daySummaryTomorrowFirstStepMarkup", "day-summary-tomorrow-step", "data-day-summary-tomorrow-action", "明早第一步", "醒来三步", "昨夜日终承接", "fromDaySummary", "summaryAdvice", "不会自动执行明日动作", "focusMorningAction(tomorrowStepButton.dataset.daySummaryTomorrowAction"]) {
  if (!game.includes(daySummaryTomorrowTerm) && !styles.includes(daySummaryTomorrowTerm)) throw new Error(`Day-summary tomorrow first step missing: ${daySummaryTomorrowTerm}`);
}

for (const daySummaryP0Term of ["daySummaryP0SnapshotSpec", "daySummaryP0SnapshotMarkup", "focusDaySummaryP0Snapshot", "day-summary-p0-snapshot", "day-summary-p0-card", "data-day-summary-p0-focus", "日终 P0 摘要", "收入 · 成长 · 解锁 · 风险 · 明早第一步", "玩家结束时知道下一步做什么", "只定位总结和明日目标，不会自动入夜、领奖或执行动作"]) {
  if (!game.includes(daySummaryP0Term) && !styles.includes(daySummaryP0Term)) throw new Error(`Day-summary P0 snapshot missing: ${daySummaryP0Term}`);
}

for (const daySummaryVsa008Term of ["daySummaryVsa008EvidenceSpec", "daySummaryVsa008EvidenceMarkup", "focusDaySummaryVsa008Evidence", "day-summary-vsa008-evidence", "day-summary-vsa008-row", "data-day-summary-vsa008-focus", "vsa_008 截图证据", "收入成长解锁和明日建议", "UI截图", "明早第一步可截图", "玩家结束时知道下一步做什么", "只定位验收证据和明日目标", "不会自动执行明日动作、入夜、领奖或消耗资源"]) {
  if (!game.includes(daySummaryVsa008Term) && !styles.includes(daySummaryVsa008Term) && !readme.includes(daySummaryVsa008Term)) throw new Error(`Day-summary vsa_008 evidence card missing: ${daySummaryVsa008Term}`);
}

for (const daySummaryShopCustomerTerm of ["shopCustomerDayLessonSpec", "shopCustomerDayLessonMarkup", "focusDaySummaryShopCustomerLesson", "shopCustomerLesson", "day-summary-shop-customer-lesson", "data-day-summary-shop-customer-lesson", "旧铺顾客三因复盘", "为什么买", "为什么犹豫/离店", "明日怎么改", "回看购买理由", "回看犹豫原因", "回看明日改法", "只回看旧铺账页和顾客旅线", "不会自动开铺、调价、补货、交单或消耗资源"]) {
  if (!game.includes(daySummaryShopCustomerTerm) && !styles.includes(daySummaryShopCustomerTerm)) throw new Error(`Day-summary shop customer lesson missing: ${daySummaryShopCustomerTerm}`);
}

for (const dungeonDayEchoTerm of ["dungeonDayEchoSpec", "recordDungeonDayEcho", "dungeonDayEchoDaySummarySpec", "dungeonDayEchoDaySummaryMarkup", "focusDaySummaryDungeonEcho", "lastDungeonDayEcho", "dungeonDayEcho", "day-summary-dungeon-echo", "data-day-summary-dungeon-echo", "秘境节气余烬复盘", "场规怎么变", "精怪怎么解", "带回了什么", "明日怎么进", "只定位/回看", "不会自动进入秘境、探索、顺应节气或挑战 Boss"]) {
  if (!game.includes(dungeonDayEchoTerm) && !styles.includes(dungeonDayEchoTerm)) throw new Error(`Dungeon mechanic day-summary echo missing: ${dungeonDayEchoTerm}`);
}

for (const dungeonDayEchoWorldTerm of ["dungeonDayEchoWorldPlaqueSpec", "dungeonDayEchoWorldPlaqueAtCanvasPoint", "focusDungeonDayEchoWorldPlaqueFromCanvas", "drawDungeonDayEchoWorldPlaque", "dungeonDayEchoWorldFocus", "秘境余烬灯牌", "昨夜秘境余波", "不会自动进入秘境、探索、顺应节气或挑战 Boss，也不会消耗资源"]) {
  if (!game.includes(dungeonDayEchoWorldTerm) && !styles.includes(dungeonDayEchoWorldTerm) && !readme.includes(dungeonDayEchoWorldTerm)) throw new Error(`Dungeon day-summary world plaque missing: ${dungeonDayEchoWorldTerm}`);
}

for (const dungeonWorldChangeLandmarkTerm of ["dungeonWorldChangeLandmarkRows", "dungeonWorldChangeLandmarkAtCanvasPoint", "focusDungeonWorldChangeLandmarkFromCanvas", "drawDungeonWorldChangeLandmarks", "dungeonWorldChangeLandmarkLabel", "dungeonWorldChangeLandmarkAnchor", "秘境外部变化小景", "洞天改景签", "雷竹路", "灵渠水光", "月莲静池", "长灯路", "可点回看", "只定位和解释洞天改景", "不会自动进入秘境、探索、顺应节气、挑战 Boss 或消耗资源"]) {
  if (!game.includes(dungeonWorldChangeLandmarkTerm) && !styles.includes(dungeonWorldChangeLandmarkTerm) && !readme.includes(dungeonWorldChangeLandmarkTerm)) throw new Error(`Dungeon world-change landmark missing: ${dungeonWorldChangeLandmarkTerm}`);
}

for (const dungeonMorningEchoTerm of ["dungeon_echo", "昨夜秘境余烬", "回看秘境余烬", "秘境余烬回看", "data-morning-row=\"dungeon_echo\"", "action === \"dungeon_echo\"", "清晨行动牌", "醒来三步", "只定位回看，不会自动进入秘境或消耗资源"]) {
  if (!game.includes(dungeonMorningEchoTerm) && !styles.includes(dungeonMorningEchoTerm) && !readme.includes(dungeonMorningEchoTerm)) throw new Error(`Dungeon morning echo continuation missing: ${dungeonMorningEchoTerm}`);
}

for (const dungeonDayEchoArchiveTerm of ["dungeonDayEchoHistory", "dungeonDayEchoArchiveRows", "focusDungeonDayEchoArchiveEntry", "data-dungeon-echo-archive", "data-dungeon-echo-mode", "秘境余烬手账", "回看余烬", "定位三联牌", "第一条秘境余烬仍待落笔", "不会自动进入秘境、探索、顺应节气或挑战 Boss，也不会消耗资源", "goal-card dungeon-echo-archive", ".goal-card.dungeon-echo-archive"]) {
  if (!game.includes(dungeonDayEchoArchiveTerm) && !styles.includes(dungeonDayEchoArchiveTerm) && !readme.includes(dungeonDayEchoArchiveTerm)) throw new Error(`Dungeon day-summary echo archive missing: ${dungeonDayEchoArchiveTerm}`);
}

for (const dungeonDayEchoScrollTerm of ["dungeonDayEchoArchiveScrollSpec", "dungeonDayEchoArchiveScrollMarkup", "dungeonDayEchoArchiveRune", "data-dungeon-echo-scroll", "dungeon-echo-scroll-track", "dungeon-echo-scroll-node", "秘境余烬画卷", "场规", "精怪", "带回", "明日", "四枚可点击印记"]) {
  if (!game.includes(dungeonDayEchoScrollTerm) && !styles.includes(dungeonDayEchoScrollTerm) && !readme.includes(dungeonDayEchoScrollTerm)) throw new Error(`Dungeon day-summary echo scroll visual missing: ${dungeonDayEchoScrollTerm}`);
}

for (const daySummaryNextDelightTerm of ["earlyRewardNextDelightSpec", "earlyRewardNextDelightMarkup", "focusDaySummaryNextDelight", "earlyRewardNextDelight", "day-summary-next-delight", "data-day-summary-next-delight", "下一处爽点", "当前节点", "下一节点", "即时反馈", "延迟反馈", "成功指标", "每15分钟一个反馈", "只定位下一处爽点", "不会自动播种、浇水、收获、开铺、定价、补货、交单、派工、处理风险、入夜或消耗资源"]) {
  if (!game.includes(daySummaryNextDelightTerm) && !styles.includes(daySummaryNextDelightTerm)) throw new Error(`Day-summary next delight missing: ${daySummaryNextDelightTerm}`);
}

for (const stabilityTerm of ["createInitialStabilityState", "recordStabilityFrame", "stabilityQaStatus", "stabilityQaPass", "性能稳定哨兵", "运行时稳定性哨兵", "无崩溃无软锁", "目标帧稳定", "softlockWarnings", "vsa_009：前3小时无阻断问题", "stabilityQaPass() &&", "稳定性哨兵："]) {
  if (!game.includes(stabilityTerm) && !styles.includes(stabilityTerm)) throw new Error(`Performance stability sentinel missing: ${stabilityTerm}`);
}

for (const stabilityEvidenceTerm of ["stabilityQaEvidenceSpec", "stabilityQaEvidenceMarkup", "stability-qa-evidence", "stability-qa-row", "vsa_009 QA证据牌", "前3小时无阻断问题 · QA报告", "无崩溃", "无软锁", "目标帧稳定", "QA报告路径", "SMOKE_REPORT.md", "softlock_watchdogs", "frame_budget_note", "只显示运行时稳定性哨兵和 QA 报告路径", "不会自动执行任何玩法动作、推进时间、写完成标记或消耗资源"]) {
  if (!game.includes(stabilityEvidenceTerm) && !styles.includes(stabilityEvidenceTerm) && !readme.includes(stabilityEvidenceTerm) && !smokeScript.includes(stabilityEvidenceTerm)) throw new Error(`Performance stability evidence card missing: ${stabilityEvidenceTerm}`);
}

for (const spiritSettlementTerm of ["spiritJobWorkPower", "spendSpiritJobNeeds", "settleSpiritJobs", "settleFarmSpiritJob", "settleWorkshopSpiritJob", "settleShopSpiritJob", "settlePatrolSpiritJob", "settleExpeditionSpiritJob", "settleGardenSpiritJob", "lastSpiritJobReport", "lastSpiritJobSynergy", "spiritJobSynergyLine", "applySpiritJobSynergies", "spiritJobSynergyForSpirit", "spiritJobSynergyNetworkSpec", "spiritJobSynergyNetworkMarkup", "drawSpiritJobSynergyNetwork", "spiritNightWorkFeedback", "triggerSpiritNightWorkFeedback", "drawSpiritNightWorkFeedback", "精怪夜勤回声", "精怪协作链", "自动化协作链", "岗位协作网", "搭班光轨", "接力节点", "协作收益", "spirit_job_synergy", "day-summary-spirit-synergy", "spirit-job-synergy", "spirit-synergy-network", "focus", "advice", "spirit_job_settlement", "精怪夜勤", "关注"]) {
  if (!game.includes(spiritSettlementTerm)) throw new Error(`Spirit job settlement path missing: ${spiritSettlementTerm}`);
}

for (const goalTerm of ["data.earlyRewardPacing", "data.year2GoalBook", "data.rareSpiritEvents", "data.freeplayGoals", "early_reward_pacing.csv", "year2_goal_book_rule.csv", "rare_spirit_event_action.csv", "freeplay_goal.csv", "goalBookPanel", "goal-summary", "goal-card", "data-dungeon-memory-open"]) {
  if (!game.includes(goalTerm) && !html.includes(goalTerm) && !styles.includes(goalTerm)) {
    throw new Error(`Goal book/retention path missing: ${goalTerm}`);
  }
}

for (const earlyCadenceTerm of ["earlyRewardCadenceAuditSpec", "earlyRewardCadenceAuditMarkup", "focusEarlyRewardCadenceAudit", "early-reward-cadence-card", "early-reward-cadence-grid", "early-reward-cadence-window", "data-early-cadence-focus", "前三小时奖励节奏诊断", "15 分钟检查", "桥接反馈"]) {
  if (!game.includes(earlyCadenceTerm) && !styles.includes(earlyCadenceTerm)) throw new Error(`Early reward cadence audit missing: ${earlyCadenceTerm}`);
}

for (const uiPressureTerm of ["uiPressureReliefSpec", "uiPressureReliefMarkup", "focusUiPressureRelief", "ui-pressure-relief-card", "ui-pressure-relief-grid", "ui-pressure-relief-row", "data-ui-pressure-focus", "后期 UI 减压牌", "首屏强提示", "不会自动收获、浇水、播种、交付、处理风险、开铺、排产、发商队、入夜或消耗资源"]) {
  if (!game.includes(uiPressureTerm) && !styles.includes(uiPressureTerm)) throw new Error(`UI pressure relief card missing: ${uiPressureTerm}`);
}

for (const spiritJobGoalTerm of ["claimedSpiritJobGoals", "spiritJobGoalRows", "spiritJobProgress", "spiritJobGoalReady", "spiritJobGoalClaimed", "spiritJobGoalRewardText", "claimSpiritJobGoal", "data-spirit-job-goal", "spirit-job-goal", "spirit_job_goal_claim", "精怪岗位修行"]) {
  if (!game.includes(spiritJobGoalTerm) && !styles.includes(spiritJobGoalTerm)) {
    throw new Error(`Spirit job goal chain missing: ${spiritJobGoalTerm}`);
  }
}

for (const spiritJobMilestoneTerm of ["spiritJobMilestones", "spiritJobMilestoneScene", "spiritJobMilestoneType", "applySpiritJobMilestone", "drawSpiritJobMilestones", "spirit_job_milestone", "memory_job_", "田垄夜露", "迎客铃响", "巡夜灯痕"]) {
  if (!game.includes(spiritJobMilestoneTerm)) throw new Error(`Spirit job milestone event missing: ${spiritJobMilestoneTerm}`);
}

for (const spiritJobTaskTerm of ["completedSpiritJobTasks", "spiritJobTaskText", "spiritJobTaskReady", "spiritJobTaskRewardText", "spiritJobTaskEffectLevel", "spiritJobTaskPersistentEffectText", "completeSpiritJobTask", "data-spirit-job-task", "spirit-job-task", "岗位小事完成", "完成岗位小事", "持续影响："]) {
  if (!game.includes(spiritJobTaskTerm) && !styles.includes(spiritJobTaskTerm)) throw new Error(`Spirit job task chain missing: ${spiritJobTaskTerm}`);
}

for (const year2GoalTerm of ["goalBookState", "syncGoalBookState", "year2GoalClaimed", "year2GoalReady", "claimYear2Goal", "claimFreeplayGoal", "goalClaimFeedback", "goalClaimFeedbackSpec", "triggerGoalClaimFeedback", "activeGoalClaimFeedback", "drawGoalClaimFeedback", "year2GoalWorldBoardSpec", "year2GoalWorldBoardAtCanvasPoint", "focusYear2GoalWorldBoardFromCanvas", "drawYear2GoalWorldBoard", "postMainlineTenHourGoalEvidenceSpec", "postMainlineTenHourGoalPass", "postMainlineTenHourGoalMarkup", "postMainlineTenHourWorldRouteSpec", "postMainlineRouteStationSpecs", "postMainlineRouteStationFocusSpec", "drawPostMainlineTenHourRouteWorld", "drawPostMainlineRouteStations", "focusPostMainlineTenHourGoalEvidence", "data-post-mainline-goal-route", "主线后十小时路线", "主线后十小时年路", "晨课铃", "远征风旗", "名铺月榜", "庭院图钉", "试炼石盘", "羁绊茶盏", "通关后至少10小时有明确目标", "rrg_009: postMainlineTenHourGoalPass()", "不会自动跳关、不会自动领取奖励，也不会消耗资源", "data-year2-goal", "data-freeplay-goal", "收进年鉴", "领取自由奖励", "主世界第二年目标年鉴", "点选第二年目标年鉴", "年鉴目标 · 可点", "年鉴落页", "自由目标兑现", "岗位修行结印", "稀有记忆收录"]) {
  if (!game.includes(year2GoalTerm) && !styles.includes(year2GoalTerm)) {
    throw new Error(`Year-two goal book runtime missing: ${year2GoalTerm}`);
  }
}

for (const year2RecommendTerm of ["year2TodayRecommendationRows", "year2TodayRecommendationSpec", "year2TodayRecommendationMarkup", "focusYear2TodayRecommendation", "year2-today-recommend-card", "year2-today-recommend-grid", "data-year2-recommend-focus", "第二年今日推荐", "推荐 ${rows.length}/5", "只定位目标卡，不会自动领取奖励、推进时间、交付订单、派遣精怪、开铺、进入秘境或消耗资源"]) {
  if (!game.includes(year2RecommendTerm) && !styles.includes(year2RecommendTerm)) {
    throw new Error(`Year-two today recommendation missing: ${year2RecommendTerm}`);
  }
}

for (const yearOneRhythmTerm of ["yearOneRhythmStageSpec", "yearOneRhythmWorldBoardSpec", "yearOneRhythmWorldBoardAtCanvasPoint", "focusYearOneRhythmWorldBoardFromCanvas", "drawYearOneRhythmWorldBoard", "yearOneRhythmStampWorldSpec", "yearOneRhythmStampWorldAtCanvasPoint", "focusYearOneRhythmStampWorldFromCanvas", "drawYearOneRhythmStampWorld", "yearOneRhythmStampLandmarkCatalog", "yearOneRhythmStampLandmarkSpecs", "yearOneRhythmStampLandmarkAtCanvasPoint", "focusYearOneRhythmStampLandmarkFromCanvas", "drawYearOneRhythmStampLandmarks", "yearOneRhythmPanelSpec", "yearOneRhythmPanelMarkup", "yearOneRhythmGapFocusSpec", "yearOneRhythmRewardSpec", "yearOneRhythmRewardText", "applyYearOneRhythmReward", "claimYearOneRhythmCheckpoint", "focusYearOneRhythmPanelCheckpoint", "focusYearOneRhythmRequirementGap", "data-year-one-rhythm-focus", "data-year-one-rhythm-gap", "data-year-one-rhythm-claim", "year-one-rhythm-book", "year-one-rhythm-gap", "year-one-rhythm-reward", "首年72天阶段", "首年72天阶段验收簿", "首年阶段印记台", "点选首年年轮", "点选首年印记台", "点选阶段余辉", "首年阶段验收", "首年缺口定位", "首年阶段盖章", "盖章验收", "阶段印记", "查看印记", "起田结灵印", "开铺成线印", "系统爆发印", "终章合阵印", "起田结灵印余辉", "开铺成线印余辉", "系统爆发印余辉", "终章合阵印余辉", "阶段验收 · 可点", "第18天验收", "第36天验收", "第54天验收", "第72天验收"]) {
  if (!game.includes(yearOneRhythmTerm)) {
    throw new Error(`Year-one rhythm world board missing: ${yearOneRhythmTerm}`);
  }
}

for (const rareSpiritGoalTerm of ["completedRareSpiritEvents", "rareSpiritGifts", "rareSpiritConfigForEvent", "rareSpiritOwned", "rareSpiritGiftItemId", "rareSpiritEventDone", "rareSpiritEventRewardText", "completeRareSpiritEvent", "data-rare-spirit-event", "rare_spirit_event_complete", "item_gift_leizhu_bamboo_tag", "rare-spirit-event", ".goal-card button"]) {
  if (!game.includes(rareSpiritGoalTerm) && !styles.includes(rareSpiritGoalTerm)) {
    throw new Error(`Rare spirit goal event path missing: ${rareSpiritGoalTerm}`);
  }
}

for (const rareSpiritClueTrackerTerm of ["rareSpiritConditionHint", "rareSpiritClueSourceText", "rareSpiritStageLabel", "rareSpiritClueTrackerRows", "rare-clue-tracker", "rare-clue-tracker-grid", "rare-clue-tracker-row", "稀有精怪线索追踪", "下一步：", "线索板", "可触发", "动作/回礼"]) {
  if (!game.includes(rareSpiritClueTrackerTerm) && !styles.includes(rareSpiritClueTrackerTerm)) {
    throw new Error(`Rare spirit clue tracker missing: ${rareSpiritClueTrackerTerm}`);
  }
}

for (const daySummaryTerm of ["lastDaySummary", "nextDayAdvice", "createDaySummary", "renderDaySummaryPanel", "daySummaryPanel", "day-summary-card", "dailyCareChainSpec", "careChain", "careChainState", "createInitialCareChainState", "normalizeCareChainState", "recordCareChainStage", "careChainStageForStreak", "careChainStage", "careChainEcho", "careChainEchoSpec", "careChainEvent", "careChainRecentEvent", "feedback.careChainEvent", "careChainContinuationActionSpec", "careChainJournalRows", "focusCareChainRecentEvent", "data-care-chain-recent-event", "data-care-chain-journal-event", "care-chain-journal", "照应札记起笔", "洞天照应札记", "先续一条照应", "care_chain_recent_event", "care_chain", ".morning-action-row.care", "careChainStageEventSpec", "claimCareChainStageEvent", "claimedEventIds", "drawCareChainWorldBloom", "drawCareChainJournalStand", "care_chain_journal_stand", "care_chain_journal", "照应札记台", "点选札记", "drawCareChainSpiritEcho", "drawCareChainShopEcho", "day-summary-care-chain", "day-summary-care-chain-stage", "day-summary-care-chain-echo", "day-summary-care-chain-event", "洞天照应成线", "田里被照料", "精怪有动作", "铺前有回应", "连续照应", "今日照应起笔", "两日照应接上", "三日成线", "洞天生机有根", "凡仙镇也听见", "镇上也听见了", "洞天生机", "洞天照应事件", "照应阶段余温", "照应余温回看", "回看余温", "续上今日照应", "续昨日照应", "今日续线", "奖励入账", "生机传话", "生机回声", "精怪主动照应", "精怪开始主动", "三日照应成线", "凡仙镇听见了这条照应线", "洞天记住了这条照应线", "旧铺门前多了一条熟客踩亮的小路", "dailyIntentTrail", "dailyIntentMilestones", "dailyIntentMilestoneReward", "dailyIntentMilestoneLabel", "dailyIntentMilestoneTitle", "maybeClaimDailyIntentMilestone", "dailyIntentPrimaryForDay", "dailyIntentTrendSpec", "dailyIntentTrendReward", "maybeClaimDailyIntentTrendReward", "dailyIntentTrendMarkup", "dailyIntentMicroTaskCopy", "dailyIntentMicroTaskSpec", "dailyIntentMicroTaskMarkup", "dailyIntentMicroTaskReviewSpec", "dailyIntentMicroTaskMomentCopy", "maybeTriggerDailyIntentMicroTaskMoment", "focusDailyIntentMicroTask", "dailyIntentWorldSceneLabel", "dailyIntentWorldSceneTargets", "dailyIntentWorldSceneAtCanvasPoint", "focusDailyIntentWorldScene", "drawDailyIntentWorldScenes", "dailyIntentJournalRows", "dailyIntentActionForKey", "dailyIntentWeakestAction", "focusDailyIntentJournalAction", "recordDailyIntentProgress", "dailyIntentReviewSpec", "dailyIntentReviewMarkup", "dailyIntentReview", "day-summary-intent-review", "day-summary-intent-row", "day-summary-intent-trend", "day-summary-intent-micro-task", "daily-intent-journal", "daily-intent-trend", "daily-intent-trend-strip", "daily-intent-micro-task", "data-daily-intent-micro-task", "data-daily-intent-micro-action", "data-daily-intent-journal-action", "data-daily-intent-journal-key", "每日主轴手账", "今日主轴小事", "铺前小事", "工坊小事", "风灯小事", "红笺小事", "露痕小事", "铺前小事落笔", "工坊小事落笔", "风灯小事落笔", "红笺小事落笔", "露痕小事落笔", "连续主轴趋势", "主轴留痕小景", "铺前钱签", "工坊墨线", "秘境风灯", "镇上红笺", "田埂露痕", "连日主轴奖励", "昨日余温", "连日经营", "三日成线", "续走这条线", "换线补短板", "今日目标回顾", "今日主轴起势", "今日主轴连势", "今日主轴成势", "主轴阶段", "推进最明显", "换一条补短板", "今日足迹", "nightGrowthFeedback", "triggerNightGrowthFeedback", "drawNightGrowthFeedback", "nightGrowthRouteBadgeSpec", "drawNightGrowthRouteBadge", "activeMorningHarvestPlans", "drawMorningHarvestPlanFlags", "drawMorningHarvestPlanFlags(ctx, originX, originY, tile, gap);", "solarMorningSignTone", "solarMorningSignReading", "solarMorningSignSpec", "solarMorningSignMarkup", "focusSolarMorningSign", "drawSolarMorningSignBadge", "solarMorningSignAtCanvasPoint", "solarMorningSignSnapshot", "solarMorningSignSummaryText", "solarMorningSign: solarMorningSignSnapshot", "solar-morning-reading", "solar-morning-reading-row", "天时三读", "宜做", "忌犯", "转机", "day-summary-solar-morning", "今日天时复盘", "solar-morning-sign", "data-solar-morning-sign", "节气晨签", "已种适性", "morningActionBoardSpec", "morningActionBoardMarkup", "focusMorningAction", "drawMorningActionBoardCard", "morning-action-board", "data-morning-action", "清晨行动牌", "晨间排产", "订单可交", "定位补水", "sleepPrepChecklistSpec", "sleepPrepChecklistMarkup", "focusSleepPrepAction", "drawSleepPrepChecklistCard", "sleep-prep-checklist", "data-sleep-prep-action", "入夜前准备", "先收成熟作物", "处理节气风险", "旧铺可开张", "今日关系机会", "可以入夜", "useRoute", "workshopFocus", "completedWorkshopJobs", "harvestUseRoute", "maturedPlotActions", "focusDaySummaryMaturePlot", "data-day-summary-mature-plot", "day-summary-mature-list", "day-summary-mature-route", "定位收获", "明早先收", "day-summary-harvest-route", "收获去向", "工坊火候", "工坊出货", "夜间成长", "今夜新熟", "订单备货", "可入锅", "旧铺备货", "先入仓", "顾客短评", "回头客预告", "门口小景", "熟脸回门", "熟客带新客", "铺前市闻", "铺前来帖", "来帖小约", "镇上捎话", "day-summary-shop-town-errand", "data-shop-town-errand-action", "townLifeShopMoments", "data-town-shop-moment-id", "翻开这页后话", "旧铺后话", "熟客留言墙", "回头苗头", "旧铺日结", "雨水/灵池代顾", "daySummaryLanternWorldSpec", "daySummaryLanternWorldAtCanvasPoint", "focusDaySummaryLanternWorldFromCanvas", "drawDaySummaryLanternWorld", "日终灯笺", "只定位日终总结", "不会自动入夜", "明日建议"]) {
  if (!game.includes(daySummaryTerm) && !html.includes(daySummaryTerm) && !styles.includes(daySummaryTerm)) {
    throw new Error(`Day summary path missing: ${daySummaryTerm}`);
  }
}

for (const workshopTerm of ["workshopQueueFocusSpec", "updateWorkshopLiveFocus", "workshop-live-focus", "workshopProductionLineSpec", "workshopWorldProductionSceneSpec", "drawWorkshopProductionStageProps", "workshopStagePropWorldAtCanvasPoint", "focusWorkshopStagePropWorldFromCanvas", "workshopStagePropWorldFocus", "workshopLineStageSpec", "workshopProductionLineMarkup", "workshop-production-line", "workshop-line-stages", "workshop-line-stage", "工坊流水线", "备料", "投料", "稳火", "出锅", "入仓", "后厂五段产线", "五段工序手感", "工坊工序手感", "点选工坊工序", "备料 -> 投料 -> 稳火 -> 出锅 -> 入仓", "不会自动排产、加工、出锅、交单、入夜或消耗材料", "备料案", "投料弧线", "稳火环", "出锅闪光", "入仓货签", "精怪搬运", "automationHubWorldNoteSpec", "drawAutomationHubWorldNote", "自动化中枢 · 六线巡回", "田垄 -> 后厂 -> 旧铺 -> 巡灯 -> 远征 -> 庭院", "当前六线巡回", "不会自动派工、排产、入夜或消耗资源", "patrolHelperCount", "expeditionHelperCount", "gardenHelperCount", "workshopCraftFeedback", "activeWorkshopCraftFeedback", "drawWorkshopCraftFeedback", "加工动画 · 香气特效", "第一张订单出现", "workshopLineFeedback", "drawWorkshopLineFeedback", "工坊产线回声", "工坊上灶", "后厂出锅", "订单接上线", "workshopOutputOrderMatchSpec", "workshopOrderMatchSafe", "workshopOrderBoardRow", "workshopOrderBoardSpec", "workshopOrderBoardMarkup", "workshop-order-match", "workshop-order-board", "workshop-order-board-row", "day-summary-workshop-order", "order-card.live", "order-live-hint", "火候看板", "精怪帮工", "预计", "completedWorkshopJobs", "工坊接单", "工坊接单看板", "掌柜建议", "先做这一锅", "订单板亮了", "这锅已让订单可交", "工坊投料"]) {
  if (!game.includes(workshopTerm) && !styles.includes(workshopTerm)) throw new Error(`Workshop feedback path missing: ${workshopTerm}`);
}

for (const recipeCraftPreviewTerm of ["recipeCraftPreviewSpec", "recipeCraftPreviewMarkup", "updateRecipeCraftPreviewUi", "recipeCraftPreview", "recipe-craft-preview", "第一锅香气预告", "当前配方去向", "增值账", "原料裸卖", "香气去向", "不会自动加工或交单"]) {
  if (!game.includes(recipeCraftPreviewTerm) && !styles.includes(recipeCraftPreviewTerm) && !html.includes(recipeCraftPreviewTerm)) throw new Error(`Recipe craft preview path missing: ${recipeCraftPreviewTerm}`);
}

for (const workshopOpeningValueTerm of ["workshopOpeningValueWorldFocus", "workshopOpeningValueWorldSpec", "workshopOpeningValueWorldAtCanvasPoint", "focusWorkshopOpeningValueWorldFromCanvas", "drawWorkshopOpeningValueWorld", "drawWorkshopOpeningValueWorld(ctx", "工坊开锅价值牌", "为什么值得做", "原料裸卖", "出锅基价", "订单/旧铺去向", "只定位配方栏、订单板或旧铺货签", "不会自动加工、排产、出锅、交单、开铺、入夜或消耗材料"]) {
  if (!game.includes(workshopOpeningValueTerm) && !readme.includes(workshopOpeningValueTerm)) throw new Error(`Workshop opening value world card missing: ${workshopOpeningValueTerm}`);
}

for (const workshopIngredientReadyTerm of ["workshopIngredientReadyWorldFocus", "workshopIngredientReadySafetyText", "workshopIngredientReadyCandidate", "workshopIngredientReadyWorldSpec", "workshopIngredientReadyWorldAtCanvasPoint", "focusWorkshopIngredientReadyWorldFromCanvas", "drawWorkshopIngredientReadyWorld", "drawWorkshopIngredientReadyWorld(ctx", "原料齐火候签", "原料已齐 -> 手动加工 -> 出锅去向", "只定位配方栏、加工按钮、订单板或旧铺货签", "不会自动加工、排产、出锅、交单、上架、开铺、入夜、扣材料或消耗资源"]) {
  if (!game.includes(workshopIngredientReadyTerm) && !readme.includes(workshopIngredientReadyTerm)) throw new Error(`Workshop ingredient-ready world card missing: ${workshopIngredientReadyTerm}`);
}

for (const workshopOutputStorageRouteTerm of ["workshopOutputStorageRouteWorldFocus", "workshopOutputStorageRouteSafetyText", "workshopOutputStorageRouteFeedbackSpec", "recordWorkshopOutputStorageRouteFeedback", "workshopOutputStorageRouteWorldSpec", "workshopOutputStorageRouteWorldAtCanvasPoint", "focusWorkshopOutputStorageRouteWorldFromCanvas", "drawWorkshopOutputStorageRouteWorld", "drawWorkshopOutputStorageRouteWorld(ctx", "成品入仓去向签", "手动加工 -> 成品入仓 -> 订单可交", "手动加工 -> 成品入仓 -> 订单接线", "夜间排产 -> 成品入仓", "只定位订单板、旧铺货签、配方栏或背包", "不会自动交单、开铺、上架、售卖、继续加工、排产、扣库存、发奖励、入夜或消耗资源"]) {
  if (!game.includes(workshopOutputStorageRouteTerm) && !readme.includes(workshopOutputStorageRouteTerm)) throw new Error(`Workshop output storage route world card missing: ${workshopOutputStorageRouteTerm}`);
}

for (const workshopToShopStockBridgeTerm of ["workshopToShopStockBridgeWorldFocus", "workshopToShopStockBridgeSafetyText", "workshopToShopStockBridgeWorldSpec", "workshopToShopStockBridgeWorldAtCanvasPoint", "focusWorkshopToShopStockBridgeWorldFromCanvas", "drawWorkshopToShopStockBridgeWorld", "drawWorkshopToShopStockBridgeWorld(ctx", "工坊到旧铺备货桥", "出锅入仓 -> 擦亮货签 -> 门口会看见", "门口会看见", "擦亮货签", "点选工坊到旧铺备货桥", "只定位配方栏、背包、旧铺反馈或陈列诊断", "不会自动加工、上架、开铺、接客、成交、改价、补货、交单、扣库存或消耗资源"]) {
  if (!game.includes(workshopToShopStockBridgeTerm) && !readme.includes(workshopToShopStockBridgeTerm)) throw new Error(`Workshop-to-shop stock bridge world card missing: ${workshopToShopStockBridgeTerm}`);
}

for (const workshopSpiritAssistActionTerm of ["workshopSpiritAssistActionWorldFocus", "workshopSpiritAssistActionSafetyText", "workshopSpiritAssistActionCopy", "workshopSpiritAssistActionWorldSpec", "workshopSpiritAssistActionWorldAtCanvasPoint", "focusWorkshopSpiritAssistActionWorldFromCanvas", "drawWorkshopSpiritAssistActionWorld", "drawWorkshopSpiritAssistActionWorld(ctx", "精怪帮火小动作", "谁在帮", "递料", "投料", "压火", "盛盘", "贴签", "下一步看哪", "只定位伙伴栏、工坊队列或配方栏", "不会自动切岗、加工、排产、出锅、交单、开铺、入夜或消耗材料"]) {
  if (!game.includes(workshopSpiritAssistActionTerm) && !readme.includes(workshopSpiritAssistActionTerm)) throw new Error(`Workshop spirit assist action world card missing: ${workshopSpiritAssistActionTerm}`);
}

for (const shopJourneyTerm of ["shopCustomerJourneySpec", "shopCustomerJourneyRows", "shopCustomerJourneyMarkup", "shopCustomerReasonCardsSpec", "shopCustomerReasonCardsMarkup", "drawShopCustomerJourneyTrace", "shopWeatherCustomerReactionSpec", "shopWeatherCustomerReactionMarkup", "shopCustomerForecastWorldSpec", "shopCustomerForecastCanvasTarget", "drawShopCustomerForecastWorldBoard", "今日顾客风向", "点选顾客风向", "shop-weather-customer", "weather-customer", "顾客天气反应", "雨棚等伞客", "暑天讨凉饮", "霜天围炉问热食", "掌柜建议", "shop-customer-journey", "shop-journey-path", "shop-reason-cards", "shop-reason-card-grid", "顾客旅线复盘", "顾客买/不买三因牌", "为什么买", "为什么犹豫/离店", "明日怎么改", "只解释经营原因和建议路线", "不会自动开铺、调价、补货或消耗资源", "进店", "看牌", "试价", "成交/离店", "复购建议"]) {
  if (!game.includes(shopJourneyTerm) && !styles.includes(shopJourneyTerm)) throw new Error(`Shop customer journey path missing: ${shopJourneyTerm}`);
}

for (const shopThoughtChainTerm of ["shopThoughtBubbleChainSpec", "shopThoughtBubbleChainStatus", "shopThoughtBubbleChainAtCanvasPoint", "drawShopThoughtBubbleChainWorld", "shopThoughtBubbleChainWorldFocus", "thought_chain", "门口想法串", "顾客想法线", "谁想要什么", "谁犹豫", "谁买了", "明日改法", "点选门口想法串", "只定位旧铺旅线和经营报告", "不会自动开铺、调价、补货或消耗资源"]) {
  if (!game.includes(shopThoughtChainTerm) && !readme.includes(shopThoughtChainTerm)) throw new Error(`Shop thought-bubble chain missing: ${shopThoughtChainTerm}`);
}

for (const shopTrialPreviewTerm of ["shopTrialPreviewSpec", "shopTrialPreviewMarkup", "updateShopTrialPreviewUi", "shopTrialPreview", "shop-trial-preview", "旧铺试营业看板", "想法泡泡：", "热卖标签预告", "不会自动开铺、调价或补货"]) {
  if (!game.includes(shopTrialPreviewTerm) && !styles.includes(shopTrialPreviewTerm) && !html.includes(shopTrialPreviewTerm)) throw new Error(`Shop trial preview path missing: ${shopTrialPreviewTerm}`);
}

for (const shopFirstSalePreviewTerm of ["首单复盘看板", "为什么买：", "顾客短评：", "回头苗头：", "明日补货：", "不会自动开铺、补货或改价", "shop-trial-preview.first-sale", "shop-trial-preview-bubble.receipt"]) {
  if (!game.includes(shopFirstSalePreviewTerm) && !styles.includes(shopFirstSalePreviewTerm) && !html.includes(shopFirstSalePreviewTerm)) throw new Error(`Shop first-sale preview path missing: ${shopFirstSalePreviewTerm}`);
}

for (const orderFeedbackTerm of ["activeOrderDeliveryMoment", "drawOrderDeliveryMoment", "第一张订单交付成功", "order-card.delivered.live", "order-delivery-hint", "relationship-card.order-live", "relationship-order-feedback.live", "shopTownErrandFeedback", "activeShopTownErrandFeedback", "queueShopTownErrandDialogue", "relationship-card.shop-live", "relationship-shop-feedback.live"]) {
  if (!game.includes(orderFeedbackTerm) && !styles.includes(orderFeedbackTerm)) throw new Error(`Order delivery feedback path missing: ${orderFeedbackTerm}`);
}

for (const orderRewardReinvestTrailTerm of ["orderRewardReinvestTrailWorldFocus", "orderRewardReinvestTrailSafetyText", "orderRewardReinvestTrailWorldSpec", "orderRewardReinvestTrailWorldAtCanvasPoint", "focusOrderRewardReinvestTrailWorldFromCanvas", "drawOrderRewardReinvestTrailWorld", "drawOrderRewardReinvestTrailWorld(ctx", "回款再投入账串", "回款入账 -> 再投入 -> 手动确认", "只定位订单板、旧铺、种子栏或配方栏", "不会自动买种、播种、加工、交单、上架、开铺、扣钱、扣材料、发奖励、入夜或消耗资源"]) {
  if (!game.includes(orderRewardReinvestTrailTerm) && !readme.includes(orderRewardReinvestTrailTerm)) throw new Error(`Order reward reinvest trail missing: ${orderRewardReinvestTrailTerm}`);
}

for (const storyVisitTerm of ["storyVisitFeedback", "storyVisitFeedbackSpec", "triggerStoryVisitFeedback", "dialogue_baizhi_order_visit", "白芷来访", "石斛之求", "mission-card.story-live", "mission-card.story-visit-feedback", "relationship-card.story-touched", "relationship-story-feedback"]) {
  if (!game.includes(storyVisitTerm) && !styles.includes(storyVisitTerm)) throw new Error(`Story visit path missing: ${storyVisitTerm}`);
}

for (const solarTrialTerm of ["data.year2SolarTrials", "year2_solar_trial.csv", "solarTrialPanel", "solar-trial-card", "data-solar-trial", "solar_trial_start", "solar_trial_daily_action", "solar_trial_complete", "completedSolarTrials"]) {
  if (!game.includes(solarTrialTerm) && !html.includes(solarTrialTerm) && !styles.includes(solarTrialTerm)) {
    throw new Error(`Year-two solar trial path missing: ${solarTrialTerm}`);
  }
}

for (const solarTrialVisualTerm of ["recommendedSolarTrial", "drawYear2SolarTrialDial", "年轮试炼进行中", "年轮试炼预告", "印记共鸣", "预估", "drawYear2SolarTrialDial(ctx);", "solarTrialCompendiumSupport(trial)", "evaluateSolarTrialScore(trial)", "solarTrialRunProgress", "solarTrialActionCardsMarkup", "solarTrialBreakdownMarkup", "solar-trial-actions", "今日试炼推进", "手账加压"]) {
  if (!game.includes(solarTrialVisualTerm)) throw new Error(`Year-two solar trial world visual missing: ${solarTrialVisualTerm}`);
}

for (const cropAffinityTerm of ["solar_term_bonus_tags", "season_list", "disaster_weakness_tags", "yieldBonus", "节气适性", "预计增收", "预计收获", "cropWorldGrowthVisualSpec", "drawCropWorldGrowthVisual", "新芽", "抽叶", "将熟", "可收", "spriteScale", "needsWater", "cropGrowthMemoWorldRows", "cropGrowthMemoWorldSpec", "cropGrowthMemoWorldAtCanvasPoint", "focusCropGrowthMemoWorldFromCanvas", "drawCropGrowthMemoWorld", "cropGrowthMemoWorldFocus", "田垄今日长势小札", "已种田块", "今日长势", "只定位田块、节气或去向入口", "不会自动浇水、收获、播种、入夜或消耗资源", "seed-restock-hint", "selectedPlotCard", "selected-plot-card", "selected-plot-card-action", "selected-plot-seed-route", "selected-plot-growing-route", "selected-plot-route-actions", "data-selected-plot-action", "data-plot-route-order", "data-plot-route-recipe", "data-plot-route-seed", "data-plot-route-shop", "plotRouteFocusTarget", "applyPlotRouteFocusTarget", "focusPlotRouteOrder", "focusPlotRouteRecipe", "focusPlotRouteSeed", "focusPlotRouteShop", "plot-route-focus-pulse", "data-order-card-id", "看订单", "看配方", "看种子", "看旧铺", "去向入口", "田地去向", "actionId", "selectedPlotCard.addEventListener", "fieldActionFeedbackSpec", "drawFieldActionFeedback", "drawGrowingCropUseRouteBadge", "growingCropUseRouteSpec", "harvestUseRouteSpec", "harvestUseRouteSafe", "harvestFeedback", "harvestFeedbackSpec", "activeHarvestFeedback", "drawHarvestFeedback", "harvestQualityStars", "qualityStars", "qualityLabel", "harvestText", "第一次收获", "收获入仓", "品质星级", "seedUseRouteSpec", "seedUseRouteSafe", "seedProjectedHarvestSpec", "lastHarvestUseRoute", "item-use-route", "item-use-route-status", "inventoryRouteStatusMarkup", "订单缺口", "配方原料", "工坊可下锅", "旧铺货签", "item-use-route-actions", "inventoryRouteActionsMarkup", "inventoryList.addEventListener", "data-inventory-route-order", "data-inventory-route-recipe", "data-inventory-route-shop", "背包去向", "live-use-route", "可入锅", "订单差这味", "旧铺可卖", "成熟后", "种后去向", "长成去向", "收后去向", "收获去向", "清开灵田", "种子入土", "水纹润开", "灵光入篓", "建议：", "执行：", "推荐", "已种适性", "田间提示", "term-item affinity", "termLearningCardSpec", "termLearningCardMarkup", "term-learning-card", "term-learning-grid", "种什么", "怎么浇", "卖什么", "避什么", "今日第一判断", "不会自动播种、浇水、收获、开铺或处理风险"]) {
  if (!game.includes(cropAffinityTerm) && !styles.includes(cropAffinityTerm)) throw new Error(`Crop solar affinity path missing: ${cropAffinityTerm}`);
}

for (const clearedPlotMemoryTerm of ["plotClearedVeinMemory", "selected-plot-vein-memory", "复苏灵纹", "第一处灵纹已经可见", "洞天灵息从这里回流 +1"]) {
  if (!game.includes(clearedPlotMemoryTerm) && !styles.includes(clearedPlotMemoryTerm)) throw new Error(`Cleared plot vein memory missing: ${clearedPlotMemoryTerm}`);
}

for (const firstSeedPlotMemoryTerm of ["plotFirstSeedMemory", "selected-plot-first-seed-memory", "第一籽入土", "第一块田的生产循环由此开始", "first-seed"]) {
  if (!game.includes(firstSeedPlotMemoryTerm) && !styles.includes(firstSeedPlotMemoryTerm)) throw new Error(`First seed plot memory missing: ${firstSeedPlotMemoryTerm}`);
}

for (const sproutPlotMemoryTerm of ["plotSpiritSproutMemory", "selected-plot-sprout-memory", "成精预告", "叶尖冒出问号", "spiritSproutHeartbeatWorldSpec", "drawSpiritSproutHeartbeatWorld", "spiritSproutHeartbeatAtCanvasPoint", "focusSpiritSproutHeartbeatFromCanvas", "spiritSproutHeartbeatWorldFocus", "成精心跳灵纹", "心跳 1/3", "心跳 2/3", "心跳 3/3", "点选成精心跳", "不会自动收获或触发成精", "不会自动收获", "sproutMemory"]) {
  if (!game.includes(sproutPlotMemoryTerm) && !styles.includes(sproutPlotMemoryTerm)) throw new Error(`Spirit sprout plot memory missing: ${sproutPlotMemoryTerm}`);
}

for (const firstSpiritPromiseTerm of ["firstSpiritPromiseSpec", "firstSpiritPromiseMarkup", "first-spirit-promise-card", "first-spirit-promise-steps", "data-first-spirit-promise", "firstSpiritPromiseWorldSpec", "firstSpiritPromiseWorldAtCanvasPoint", "focusFirstSpiritPromiseWorldFromCanvas", "drawFirstSpiritPromiseWorld", "firstSpiritPromiseWorldFocus", "第一只精怪倒计时", "30 分钟核心卖点", "前30分钟成精承诺牌", "点选前30分钟成精承诺牌", "清田 -> 播种 -> 成精预告 -> 手动收获 -> 3x3 自动浇水", "30分钟内看到作物成精", "不会自动清理、播种、浇水、入夜、收获、触发成精、协助浇水或消耗体力"]) {
  if (!game.includes(firstSpiritPromiseTerm) && !styles.includes(firstSpiritPromiseTerm)) throw new Error(`First spirit promise card missing: ${firstSpiritPromiseTerm}`);
}

for (const spiritSproutForeshadowTerm of ["spiritSproutForeshadowTrailWorldSpec", "spiritSproutForeshadowTrailAtCanvasPoint", "focusSpiritSproutForeshadowTrailFromCanvas", "drawSpiritSproutForeshadowTrailWorld", "spiritSproutForeshadowTrailWorldFocus", "第一夜成精伏笔灯", "第1夜轻颤 -> 第2晨探头 -> 成熟后手动收获 -> 3x3 代劳", "点选第一夜成精伏笔灯", "只定位伏笔路线，不会自动播种、浇水、入夜、收获、触发成精、协助浇水或消耗体力"]) {
  if (!game.includes(spiritSproutForeshadowTerm) && !styles.includes(spiritSproutForeshadowTerm)) throw new Error(`Spirit sprout foreshadow trail missing: ${spiritSproutForeshadowTerm}`);
}

for (const firstSpiritJoinTriptychTerm of ["firstSpiritJoinTriptychWorldSpec", "firstSpiritJoinTriptychWorldAtCanvasPoint", "focusFirstSpiritJoinTriptychWorldFromCanvas", "drawFirstSpiritJoinTriptychWorld", "firstSpiritJoinTriptychWorldFocus", "第一伙伴入队三拍签", "作物转身 -> 伙伴栏亮 -> 3x3 代劳", "点选第一伙伴入队三拍签", "只定位田块、伙伴栏和精怪协助入口，不会自动收获、触发成精、协助浇水、派工、入夜或消耗体力"]) {
  if (!game.includes(firstSpiritJoinTriptychTerm) && !readme.includes(firstSpiritJoinTriptychTerm)) throw new Error(`First spirit join triptych world scene missing: ${firstSpiritJoinTriptychTerm}`);
}

for (const firstSpiritJoinPlotMemoryTerm of ["第一只精怪入队", "伙伴栏已经开放", "让精怪协助", "3x3 自动浇水", "不会自动协助或消耗体力", "spirit-born", "selected-plot-sprout-memory.joined"]) {
  if (!game.includes(firstSpiritJoinPlotMemoryTerm) && !styles.includes(firstSpiritJoinPlotMemoryTerm)) throw new Error(`First spirit join plot memory missing: ${firstSpiritJoinPlotMemoryTerm}`);
}

for (const shopTerm of ["shopPriceRules", "shopShelfThemes", "shopFeedback", "penalty_overprice_threshold", "min_theme_ratio", "shopFeedbackBy", "shopFeedbackForSegment", "shopOpeningState", "shopHotTag", "shopDisplayDiagnosisSpec", "shopDisplayDiagnosisMarkup", "drawShopDisplayDiagnosisSign", "shop-display-diagnosis", "shop-display-good", "货架陈列诊断", "主推货", "客群偏好", "主题匹配", "换陈列建议", "shopCompendiumDisplaySpec", "activeShopCompendiumDisplays", "shopCompendiumDisplayEffect", "shopCompendiumCustomerSupport", "shopCompendiumCustomerRemark", "customerNeedBubble", "shopPurchaseReason", "shopCustomerShortReview", "shopReturnVisitPreviewSpec", "shopReturningCustomerTargets", "shopReturningCompanionVisitCopy", "shopReturningCompanionVisitors", "introducedCustomers", "shopIntroducedCustomerDigestSpec", "shopIntroducedCustomerDigestMarkup", "shopIntroducedCustomerDigestSummaryText", "shopWordOfMouthBulletinSpec", "recordShopWordOfMouthBulletin", "activeShopWordOfMouthSpec", "shopWordOfMouthDisplaySpec", "shopWordOfMouthVisitLeadSpec", "shopWordOfMouthVisitSnapshot", "shopVisitPledgeSpec", "recordShopVisitPledge", "shopVisitPledgeDisplaySpec", "shopVisitPledgeRouteCandidates", "shopVisitPledgeMarkup", "shopVisitPledgeSummaryText", "resolveShopVisitPledge", "shopTownErrandSpec", "recordShopTownErrand", "shopTownErrandDisplaySpec", "shopTownErrandRouteCandidates", "shopTownErrandMarkup", "shopTownErrandSummaryText", "shopTownErrandFeedbackSpec", "shopTownErrandDialogueLine", "shopTownErrandNarrativeSpec", "focusShopTownErrandAction", "completeShopTownErrand", "shopTownErrand", "shopTownErrandMomentSpec", "shopMomentHistory", "lastShopMoment", "sceneTag", "followup", "值夜口粮", "药柜稳手", "外路试货", "shopWordOfMouthVisitBias", "shopWordOfMouthBudgetBonus", "shopWordOfMouthVisitMarkup", "shopWordOfMouthVisitSummaryText", "shopWordOfMouthMarkup", "shopWordOfMouthSummaryText", "wordOfMouthHistory", "visitPledge", "shopReturningVisitDigestSpec", "shopReturningVisitDigestMarkup", "shopReturningVisitDigestSummaryText", "shopDoorstepSceneCrowdBoost", "shopDoorstepSceneSpec", "shopDoorstepSceneMarkup", "shopDoorstepSceneSummaryText", "shopSeasonalDoorstepSceneSpec", "shopSeasonalDoorstepSceneMarkup", "shopSeasonalDoorstepSceneSummaryText", "shopSeasonalDoorstep", "shopRegularBoardSpec", "shopRegularBoardMarkup", "shopRegularBoardSummaryText", "shopLiveFocusSpec", "shopFailureRecoverySpec", "failureRecovery", "shopCustomerDecisionLedgerSpec", "customerDecisionLedger", "shopCustomerDecisionLedgerMarkup", "shopSaleReflectionSpec", "shopSaleReflectionMarkup", "shop-decision-ledger", "shop-ledger-metrics", "shop-ledger-chain", "顾客决策账页", "顾客短评", "回头客预告", "门口小景", "节气门口", "油纸雨棚", "遮阳竹帘", "雾灯货签", "暖炉小凳", "节气货签", "熟脸回门", "熟客带新客", "铺前市闻", "铺前来帖", "来帖小约", "镇上捎话", "旧铺捎话送到", "口碑起风", "熟客留言墙", "熟客苗头板", "回头苗头", "首单小日结", "shop-sale-reflection", "shop-sale-quote", "shop-return-preview", "shop-returning-digest", "shop-returning-row", "shop-introduced-digest", "shop-introduced-row", "shop-word-of-mouth", "shop-word-of-mouth-visit", "shop-visit-pledge", "shop-town-errand", "shop-town-errand-actions", "shop-doorstep-scene", "shop-seasonal-doorstep", "shop-doorstep-row", "shop-regular-board", "shop-regular-row", "明日建议", "shop-recovery-ticket", "sale-live-review", "sale-returning-note", "sale-introduced-note", "sale-row.visit_pledge", "sale-row.town_errand", "sale-row.recovery", "补救小票", "liveFocus", "shop-live-focus", "今日焦点", "掌柜建议", "shelfAdvice", "shopTagLabel", "data-shop-memory-page", "data-shop-town-errand-action", "节气印记陈设", "shop-opening-card", "sale-row.restock", "motif", "补货跑动", "货架接上"]) {
  if (!game.includes(shopTerm) && !styles.includes(shopTerm)) throw new Error(`Shop simulation path missing: ${shopTerm}`);
}

for (const shopFirstSaleLessonTerm of [
  "shopFirstSaleLessonWorldSpec",
  "shopFirstSaleLessonWorldAtCanvasPoint",
  "drawShopFirstSaleLessonWorld",
  "shopFirstSaleLessonWorldFocus",
  "shopFirstSaleLessonTarget",
  "first_sale_lesson",
  "firstSaleLesson",
  "首单原因续航牌",
  "为什么买单",
  "购买原因",
  "顾客短评",
  "回头苗头",
  "成交原因四格",
  "玩家能说出首单原因",
  "想法泡泡",
  "买了什么",
  "价签成立",
  "明日补货",
  "点选首单原因续航牌",
  "只定位旧铺报告",
  "只定位旧铺报告和顾客旅线",
  "不会自动补货或开铺",
  "不会自动开铺、接客、成交、改价、补货或消耗库存",
  "drawShopFirstSaleLessonWorld(ctx",
  "drawShopFirstSaleLessonWorld(ctx, shopFirstSaleLessonWorldSpec(",
]) {
  if (!game.includes(shopFirstSaleLessonTerm)) throw new Error(`Shop first-sale lesson path missing: ${shopFirstSaleLessonTerm}`);
}

for (const shopFirstSaleKeepsakeTerm of ["shopFirstSaleKeepsakeWorldSpec", "shopFirstSaleKeepsakeWorldAtCanvasPoint", "drawShopFirstSaleKeepsakeWorld", "shopFirstSaleKeepsakeWorldFocus", "first_sale_keepsake", "firstSaleKeepsake", "首单钱签余温", "第一笔成交刚挂上门口", "顾客脚印", "点选首单钱签余温", "只定位旧铺报告", "不会自动开铺、补货或改价", "drawShopFirstSaleKeepsakeWorld(ctx"]) {
  if (!game.includes(shopFirstSaleKeepsakeTerm)) throw new Error(`Shop first-sale keepsake path missing: ${shopFirstSaleKeepsakeTerm}`);
}

for (const shopFirstSaleActionTrailTerm of ["shopFirstSaleActionTrailWorldSpec", "shopFirstSaleActionTrailWorldAtCanvasPoint", "drawShopFirstSaleActionTrailWorld", "shopFirstSaleActionTrailWorldFocus", "first_sale_action_trail", "firstSaleActionTrail", "首单成交动作线", "想法泡泡", "伸手拿货", "价签成立", "灵石入账", "点选首单成交动作线", "只定位旧铺报告", "不会自动开铺、补货或改价", "drawShopFirstSaleActionTrailWorld(ctx"]) {
  if (!game.includes(shopFirstSaleActionTrailTerm)) throw new Error(`Shop first-sale action trail missing: ${shopFirstSaleActionTrailTerm}`);
}

for (const shopFirstCustomerThresholdTerm of ["shopFirstCustomerThresholdWorldFocus", "shopFirstCustomerThresholdSafetyText", "shopFirstCustomerThresholdWorldSpec", "shopFirstCustomerThresholdWorldAtCanvasPoint", "drawShopFirstCustomerThresholdWorld", "drawShopFirstCustomerThresholdWorld(ctx", "first_customer_threshold", "firstCustomerThreshold", "首客过门三步桥", "跨过门槛", "先看货签", "买单成立", "犹豫离店", "点选首客过门三步桥", "只回看旧铺报告和顾客旅线", "不会自动开铺、上架、接客、成交、改价、补货、交单、扣库存或消耗资源"]) {
  if (!game.includes(shopFirstCustomerThresholdTerm) && !readme.includes(shopFirstCustomerThresholdTerm)) throw new Error(`Shop first-customer threshold bridge missing: ${shopFirstCustomerThresholdTerm}`);
}

for (const shopCustomerLessonMorningFollowupTerm of ["shopCustomerLessonMorningFollowupWorldFocus", "shopCustomerLessonMorningFollowupSafetyText", "shopCustomerLessonMorningFollowupSpec", "shopCustomerLessonMorningFollowupWorldSpec", "shopCustomerLessonMorningFollowupWorldAtCanvasPoint", "focusShopCustomerLessonMorningFollowupWorldFromCanvas", "drawShopCustomerLessonMorningFollowupWorld", "drawShopCustomerLessonMorningFollowupWorld(ctx", "shop_customer_lesson_morning_followup", "shop_customer_lesson", "旧铺明日改法灯", "旧铺明日改法灯 · 可点", "昨夜复盘", "今日先改", "手动开铺验证", "昨夜复盘 -> 今日先改 -> 手动开铺验证", "点选旧铺明日改法灯", "清晨行动牌：旧铺明日改法", "只定位旧铺复盘、顾客旅线和明日改法", "不会自动开铺、调价、补货、接客、成交、交单、扣库存或消耗资源"]) {
  if (!game.includes(shopCustomerLessonMorningFollowupTerm) && !readme.includes(shopCustomerLessonMorningFollowupTerm)) throw new Error(`Shop customer lesson morning followup missing: ${shopCustomerLessonMorningFollowupTerm}`);
}

for (const shopCustomerLessonVerificationEchoTerm of ["shopCustomerLessonVerificationEchoWorldFocus", "shopCustomerLessonVerificationEchoSafetyText", "shopCustomerLessonVerificationEchoWorldSpec", "shopCustomerLessonVerificationEchoWorldAtCanvasPoint", "focusShopCustomerLessonVerificationEchoWorldFromCanvas", "drawShopCustomerLessonVerificationEchoWorld", "drawShopCustomerLessonVerificationEchoWorld(ctx", "shop_customer_lesson_verification_echo", "旧铺改法验证回响", "旧铺改法验证回响 · 可点", "昨夜改法", "今日开铺", "结果回响", "昨夜改法 -> 今日开铺 -> 结果回响", "点选旧铺改法验证回响", "只回看旧铺改法验证、顾客旅线和经营报告", "不会自动开铺、调价、补货、接客、成交、交单、扣库存或消耗资源"]) {
  if (!game.includes(shopCustomerLessonVerificationEchoTerm) && !readme.includes(shopCustomerLessonVerificationEchoTerm)) throw new Error(`Shop customer lesson verification echo missing: ${shopCustomerLessonVerificationEchoTerm}`);
}

for (const shopReturningTrailTerm of ["shopReturningTrailWorldSpec", "shopReturningTrailWorldAtCanvasPoint", "drawShopReturningTrailWorld", "shopReturningTrailWorldFocus", "returning_trail", "returningTrail", "熟脸回门路牌", "明日熟脸路牌", "点选熟脸回门路牌", "回头路", "不会自动开铺、补货或改价", "drawShopReturningTrailWorld(ctx"]) {
  if (!game.includes(shopReturningTrailTerm)) throw new Error(`Shop returning trail path missing: ${shopReturningTrailTerm}`);
}

for (const shopDailyGoodsEyeTerm of ["shopDailyGoodsEyeWorldFocus", "shopDailyGoodsEyeReasonCopy", "shopDailyGoodsEyeWorldSpec", "shopDailyGoodsEyeWorldAtCanvasPoint", "focusShopDailyGoodsEyeWorldFromCanvas", "drawShopDailyGoodsEyeWorld", "drawShopDailyGoodsEyeWorld(ctx", "旧铺今日货眼小景", "为什么值得摆出来", "货签", "客眼", "理由", "只定位旧铺反馈", "不会自动上架、开铺、改价、成交、补货或消耗库存"]) {
  if (!game.includes(shopDailyGoodsEyeTerm) && !readme.includes(shopDailyGoodsEyeTerm)) throw new Error(`Shop daily goods eye world path missing: ${shopDailyGoodsEyeTerm}`);
}

for (const shopCustomerPickShadowTerm of ["shopCustomerPickShadowWorldFocus", "shopCustomerPickShadowSafetyText", "shopCustomerPickShadowRows", "shopCustomerPickShadowWorldSpec", "shopCustomerPickShadowWorldAtCanvasPoint", "focusShopCustomerPickShadowWorldFromCanvas", "drawShopCustomerPickShadowWorld", "drawShopCustomerPickShadowWorld(ctx", "旧铺挑货影子", "谁会停步", "看上哪件货", "为什么可能犹豫", "下一步看哪", "只定位旧铺试营业看板、顾客风向或陈列诊断", "不会自动上架、开铺、接客、成交、改价、补货或消耗库存"]) {
  if (!game.includes(shopCustomerPickShadowTerm) && !readme.includes(shopCustomerPickShadowTerm)) throw new Error(`Shop customer pick shadow world path missing: ${shopCustomerPickShadowTerm}`);
}

for (const shopSpiritGreeterTerm of ["shopSpiritGreeterWorldFocus", "shopSpiritGreeterSafetyText", "shopSpiritGreeterActionCopy", "shopSpiritGreeterWorldSpec", "shopSpiritGreeterWorldAtCanvasPoint", "focusShopSpiritGreeterWorldFromCanvas", "drawShopSpiritGreeterWorld", "drawShopSpiritGreeterWorld(ctx", "旧铺精怪迎客小动作", "谁迎客", "擦招牌", "指头排", "引路过客", "递货签", "看哪块牌", "点击只定位伙伴栏、旧铺反馈、顾客风向或陈列诊断", "不会自动切岗、开铺、接客、成交、改价、补货、上架或消耗库存"]) {
  if (!game.includes(shopSpiritGreeterTerm) && !readme.includes(shopSpiritGreeterTerm)) throw new Error(`Shop spirit greeter world action missing: ${shopSpiritGreeterTerm}`);
}

for (const shopReputationTerm of ["shopReputationStageSpec", "shopReputationStageMarkup", "shopReputationStageSummaryText", "shopReputationTownBarkSpec", "drawShopReputationStageSign", "shopReputationStage", "shopReputationBark", "shop-reputation-stage", "shop-reputation-stage-meter", "shop-reputation-stage-chips", "canvas-town-life-reputation", "data-shop-reputation-stage", "day-summary-shop-reputation", "旧铺名声", "旧铺名声招牌", "旧铺传话", "镇上传话", "名声证据", "开门有人认", "熟脸开始回头", "话头能传出去", "镇上有人肯托付", "旧铺真成了一条线"]) {
  if (!game.includes(shopReputationTerm) && !styles.includes(shopReputationTerm)) throw new Error(`Shop reputation stage path missing: ${shopReputationTerm}`);
}

for (const shopSeasonTerm of ["data.year2Orders", "data.shopSeasons", "data.shopSettlementRules", "data.shopRankRewards", "year2_order_config.csv", "year2_shop_season.csv", "year2_shop_settlement_rule.csv", "year2_shop_rank_reward.csv", "shopStats", "shopSeasonCycleInfo", "shopSeasonRewardText", "settleShopSeasonCycle", "claimShopSeasonReward", "data-shop-season-claim", "pendingSettlement", "activeBuffs", "shop-season-card", "shop-display-actions", "sale-row.compendium"]) {
  if (!game.includes(shopSeasonTerm) && !styles.includes(shopSeasonTerm)) throw new Error(`Shop season path missing: ${shopSeasonTerm}`);
}

for (const customerTerm of ["data.customerSegments", "data.customerBehavior", "data.customerStateFlow", "data.customerProfiles", "data.npcBarks", "customer_segment_rule.csv", "customer_behavior_param.csv", "customer_state_flow.csv", "customer_archetype_profile.csv", "npc_bark.csv", "preferred_tags_extra", "disliked_tags_extra", "reputation_min", "base_budget", "price_tolerance", "stock_sensitivity", "compendiumRemark", "unlock_condition_group"]) {
  if (!game.includes(customerTerm)) throw new Error(`Customer behavior path missing: ${customerTerm}`);
}

for (const orderTerm of ["data.orders", "completedOrders", "order_demo_0001", "order_demo_0002", "need_item_ids", "reward_gold", "data-order-id"]) {
  if (!game.includes(orderTerm)) throw new Error(`Order board path missing: ${orderTerm}`);
}

for (const orderSourceTerm of ["orderProductionPlan", "orderItemSourceSpec", "recipeMachineHint", "seedAvailabilityHint", "orderProductionPlanMarkup", "orderSourceActionMarkup", "orderRecoverySpec", "orderRecoverySupportSpec", "previewOrderRecovery", "applyOrderRecoverySupport", "data-order-recovery", "order-recovery-hint", "order-recovery-button", "focusOrderSourceRecipe", "focusOrderSourceSeed", "data-order-source-recipe", "data-order-source-seed", "order-source-list", "order-source-title", "order-source-actions", "生产路线", "下一步：", "查看补救并领托底"]) {
  if (!game.includes(orderSourceTerm) && !styles.includes(orderSourceTerm)) throw new Error(`Order production guidance missing: ${orderSourceTerm}`);
}

for (const year2OrderVisualTerm of ["drawYear2OrderPrepTable", "名铺订单备货台", "名铺订单已备齐", "备货", "可交付", "drawShopCourtyardActivity(ctx, livingState);", "drawYear2OrderPrepTable(ctx, livingState);"]) {
  if (!game.includes(year2OrderVisualTerm)) throw new Error(`Year-two order world visual missing: ${year2OrderVisualTerm}`);
}

for (const year2ShopSeasonVisualTerm of ["drawYear2ShopSeasonBillboard", "月评出炉", "月评待领", "短板", "总分", "drawYear2ShopSeasonBillboard(ctx);", "shopSeasonScore(season", "shopSeasonAdviceForPart"]) {
  if (!game.includes(year2ShopSeasonVisualTerm)) throw new Error(`Year-two shop season world visual missing: ${year2ShopSeasonVisualTerm}`);
}

for (const favorTerm of ["favorRewards", "npcFavor", "claimedFavorRewards", "reward_favor_npc", "favor_level"]) {
  if (!game.includes(favorTerm)) throw new Error(`NPC favor path missing: ${favorTerm}`);
}

for (const npcLifeTerm of ["data.npcSchedules", "data.cohabEpilogues", "data.cohabWeeklyEvents", "data.cohabFestivalEvents", "data.cohabDialogueMaps", "data.sideQuestDialogueMaps", "npc_schedule.csv", "npc_bark.csv", "cohab_epilogue.csv", "cohab_weekly_event.csv", "cohab_festival_event.csv", "cohab_dialogue_map.csv", "side_quest_dialogue_map.csv", "gift_like_tags", "gift_dislike_tags", "shopCompendiumNpcRemark", "activeNpcCompendiumRemark", "npcPortraitSrc", "npcPortraitImage", "drawImage(portrait", "assets/npc-xubo.svg", "assets/npc-shen-gudeng.svg", "relationship-card-hero", "town-memory-page-hero", "townLifeInteractionState", "normalizeTownLifeInteractionState", "syncTownLifeInteractionState", "normalizeTownLifeShopMoment", "latestTownLifeShopMoment", "recentTownLifeShopMoments", "recordTownLifeShopMoment", "townLifeShopMomentEntry", "activeTownLifeShopMomentEntry", "townLifeShopMomentArchiveEntries", "openTownLifeShopMomentPage", "closeTownLifeShopMomentPage", "activeTownLifeShopMomentPage", "TOWN_LIFE_MEMORY_BOOK", "recordTownLifeInteraction", "scanTownLifeRelationshipMemories", "latestTownLifeMemory", "townLifeMemoryProgressText", "townLifeMemoryEntry", "activeTownLifeMemoryEntry", "openTownLifeMemoryPage", "closeTownLifeMemoryPage", "drawTownLifeMemoryOverlay", "activeTownLifeMemoryPage", "memoryByNpc", "memoryHistory", "shopMomentHistory", "lastMemory", "lastShopMoment", "canvasTownLifeFocus", "canvasTownLifeFocusSpec", "canvasTownLifeFocusMarkup", "focusTownLifeNpcFromCanvas", "townLifeNextMemoryPreview", "townLifeOpportunityRows", "townLifeOpportunityBoardMarkup", "townLifeOpportunityActionMarkup", "townLifeRelationshipWorldBoardSpec", "drawTownLifeRelationshipWorldBoard", "townLifeRelationshipWorldBoardAtCanvasPoint", "focusTownLifeRelationshipWorldBoardFromCanvas", "townLifeRelationshipWorldBoardFocus", "data-town-opportunity-board", "data-town-opportunity-greet", "data-town-opportunity-errand", "data-town-opportunity-errand-route", "data-town-opportunity-gift", "data-town-opportunity-side-quest", "data-town-opportunity-memory-id", "town-life-opportunity-board", "town-life-opportunity-list", "town-life-opportunity", "今日关系机会", "点选关系路标", "关系记忆临门", "sideQuestClueForNpc", "sideQuestClueStatusText", "acceptTownLifeSideQuest", "data-canvas-town-focus", "data-canvas-town-greet", "data-canvas-town-errand", "data-canvas-town-errand-route", "data-canvas-town-gift", "data-canvas-town-side-quest", "data-canvas-town-side-npc", "data-canvas-town-memory-id", "data-canvas-town-shop-id", "data-canvas-town-close", "canvas-town-life-focus", "canvas-town-life-shop", "canvas-town-life-side", "canvas-town-life-errand-route", "canvas-town-life-actions", "支线线索", "承接支线", "主画面遇见", "townLifeRows", "npcTownLifeBark", "scheduleMatchesNow", "townLifeWorldPoint", "townLifeNpcAtCanvasPoint", "townLifeErrandForRow", "townLifeErrandStatus", "townLifeErrandRouteSpec", "townLifeErrandRouteCueSpec", "drawTownLifeErrandRouteCue", "focusTownLifeErrandRoute", "completeTownLifeErrand", "recommendedNpcGift", "giveRecommendedNpcGift", "data-town-life-greet", "data-town-life-errand", "data-town-life-errand-route", "data-npc-gift", "data-town-shop-moment-id", "data-town-shop-moment-close", "data-town-memory-id", "data-town-memory-close", "镇上见闻", "镇民托付", "今日赠礼", "旧铺后话", "翻看旧铺后话", "翻开旧铺后话", "关系记忆", "关系册空白", "关系册", "旧铺来往册", "drawTownLifeBoard", "drawTownLifeVisitors", "drawTownLifeVisitors(ctx);", "凡仙镇今日动线", "今日镇民动线", "今日小托付", "天气托付备货", "备货牌", "看备货路线", "旧铺捎话送到", "relationship-card.shop-touched", "relationship-shop-feedback", "relationship-shop-moment", "relationship-shop-archive", "town-shop-page", "town-life-board", "town-life-row", "town-life-row.greeted", "town-life-errand", "town-life-errand-route", "town-life-shop-moment", "relationship-gift-hint", "relationship-memory", "relationship-memory-archive", "relationship-memory-progress", "town-memory-page", "印记点评", "relationship-compendium"]) {
  if (!game.includes(npcLifeTerm) && !styles.includes(npcLifeTerm)) throw new Error(`NPC life/relationship path missing: ${npcLifeTerm}`);
}

for (const townLifeKeepsakeTerm of ["townLifeMemoryKeepsakeWorldFocus", "townLifeMemoryKeepsakePalette", "townLifeMemoryKeepsakeCandidate", "townLifeMemoryKeepsakeSpec", "townLifeMemoryKeepsakeAtCanvasPoint", "focusTownLifeMemoryKeepsakeFromCanvas", "drawTownLifeMemoryKeepsakeWorld", "drawTownLifeMemoryKeepsakeWorld(ctx", "镇民关系心签", "最近记忆", "下一段记忆", "终章伏笔", "点选镇民关系心签", "这里只翻看/定位关系册，不会自动打招呼、送礼、接支线、交托付、播放同居事件或消耗资源"]) {
  if (!game.includes(townLifeKeepsakeTerm) && !readme.includes(townLifeKeepsakeTerm)) throw new Error(`Town life memory keepsake missing: ${townLifeKeepsakeTerm}`);
}

for (const townLifeMemoryNewPageTerm of ["townLifeMemoryNewPageWorldFocus", "townLifeMemoryNewPageSafetyText", "townLifeMemoryNewPageNodes", "townLifeMemoryNewPageSpec", "townLifeMemoryNewPageAtCanvasPoint", "focusTownLifeMemoryNewPageFromCanvas", "drawTownLifeMemoryNewPageWorld", "drawTownLifeMemoryNewPageWorld(ctx", "关系记忆新页 · 可点", "谁写下", "记了什么", "回看入口", "点选关系记忆新页", "只定位回看入口 · 不自动播放", "不会自动打开记忆页、播放对白、推进剧情、写入完成标记或消耗资源"]) {
  if (!game.includes(townLifeMemoryNewPageTerm) && !readme.includes(townLifeMemoryNewPageTerm)) throw new Error(`Town life memory new-page keepsake missing: ${townLifeMemoryNewPageTerm}`);
}

for (const townLifeMemoryThresholdTerm of ["townLifeMemoryThresholdKeepsakeWorldFocus", "townLifeMemoryThresholdSafetyText", "townLifeMemoryThresholdCandidate", "townLifeMemoryThresholdKeepsakeNodes", "townLifeMemoryThresholdKeepsakeSpec", "townLifeMemoryThresholdKeepsakeAtCanvasPoint", "focusTownLifeMemoryThresholdKeepsakeFromCanvas", "drawTownLifeMemoryThresholdKeepsakeWorld", "drawTownLifeMemoryThresholdKeepsakeWorld(ctx", "关系记忆临门签 · 可点", "当前来往", "下一段记忆", "推进入口", "点选关系记忆临门签", "只定位推进，不自动解锁记忆", "不会自动寒暄、赠礼、交托付、解锁记忆或播放对白"]) {
  if (!game.includes(townLifeMemoryThresholdTerm) && !readme.includes(townLifeMemoryThresholdTerm)) throw new Error(`Town life memory threshold keepsake missing: ${townLifeMemoryThresholdTerm}`);
}

for (const townLifeGreetingKeepsakeTerm of ["townLifeGreetingKeepsakeWorldFocus", "townLifeGreetingSafetyText", "townLifeGreetingKeepsakeNodes", "townLifeGreetingKeepsakeSpec", "townLifeGreetingKeepsakeAtCanvasPoint", "focusTownLifeGreetingKeepsakeFromCanvas", "drawTownLifeGreetingKeepsakeWorld", "drawTownLifeGreetingKeepsakeWorld(ctx", "今日寒暄留签 · 可点", "在哪遇见", "会聊什么", "确认入口", "点选今日寒暄留签", "只定位确认，不自动寒暄", "不会自动寒暄、写入来往记录、增加好感、承接小托付或触发关系记忆"]) {
  if (!game.includes(townLifeGreetingKeepsakeTerm) && !readme.includes(townLifeGreetingKeepsakeTerm)) throw new Error(`Town life greeting keepsake missing: ${townLifeGreetingKeepsakeTerm}`);
}

for (const townLifeGiftKeepsakeTerm of ["townLifeGiftKeepsakeWorldFocus", "townLifeGiftSafetyText", "townLifeGiftKeepsakeNodes", "townLifeGiftKeepsakeSpec", "townLifeGiftKeepsakeAtCanvasPoint", "focusTownLifeGiftKeepsakeFromCanvas", "drawTownLifeGiftKeepsakeWorld", "drawTownLifeGiftKeepsakeWorld(ctx", "今日赠礼留签 · 可点", "送给谁", "送什么", "确认入口", "点选今日赠礼留签", "只定位确认，不自动赠礼", "不会自动赠礼、扣除物品、增加好感或写入赠礼记录"]) {
  if (!game.includes(townLifeGiftKeepsakeTerm) && !readme.includes(townLifeGiftKeepsakeTerm)) throw new Error(`Town life gift keepsake missing: ${townLifeGiftKeepsakeTerm}`);
}

for (const townLifePassalongTerm of ["townLifePassalongLanternWorldFocus", "townLifePassalongSafetyText", "townLifePassalongCandidateForRow", "townLifePassalongRows", "townLifePassalongLanternSpec", "townLifePassalongLanternAtCanvasPoint", "townLifePassalongMarkerAtCanvasPoint", "focusTownLifePassalongLanternFromCanvas", "drawTownLifePassalongMarker", "drawTownLifePassalongLanternWorld", "drawTownLifePassalongLanternWorld(ctx", "镇民顺路捎话灯 · 可点", "谁捎来", "捎哪件事", "回看入口", "点选镇民顺路捎话灯", "只定位来源，不自动推进", "不会自动寒暄、赠礼、接支线、交托付、交单、开铺、领奖、播放对白或消耗资源", "清荒、首单、旧铺名声、连续照应或灵渠复流"]) {
  if (!game.includes(townLifePassalongTerm) && !readme.includes(townLifePassalongTerm)) throw new Error(`Town life passalong lantern missing: ${townLifePassalongTerm}`);
}

if (!game.includes("focusTownLifePassalongLanternFromCanvas(townLifePassalongLanternTarget")
  || !game.includes("focusTownLifePassalongLanternFromCanvas(townLifePassalongMarker")
  || !game.includes("drawTownLifePassalongMarker(ctx, row, point, index, motion)")
  || !game.includes("drawTownLifePassalongLanternWorld(ctx, rows, motion)")) {
  throw new Error("Town life passalong lantern must be drawn and clickable from both marker and expanded keepsake.");
}

for (const earlyNpcRoadmapTerm of ["EARLY_NPC_ROADMAP_LINES", "earlyNpcRoadmapSpec", "earlyNpcRoadmapMarkup", "earlyNpcRoadmapStageDone", "focusEarlyNpcRoadmapNpc", "earlyNpcWorldRoadsignFocus", "earlyNpcWorldRoadsignSpec", "earlyNpcWorldRoadsignAtCanvasPoint", "focusEarlyNpcWorldRoadsignFromCanvas", "drawEarlyNpcWorldRoadsign", "drawEarlyNpcWorldRoadsign(ctx", "data-early-npc-roadmap", "data-early-npc-card", "early-npc-roadmap", "early-npc-roadmap-grid", "early-npc-card", "凡仙镇三位早期路标", "三位早期镇民路标", "许伯：镇务 / 旧铺 / 修复归属", "张铁山：工具 / 工坊 / 火候", "白芷：医馆 / 灵植 / 药线", "镇务信任线", "工坊火候线", "灵植药线", "点选三位镇民路标", "点选只定位", "只定位关系卡，不会自动寒暄、赠礼、交付托付或推进剧情"]) {
  if (!game.includes(earlyNpcRoadmapTerm) && !styles.includes(earlyNpcRoadmapTerm)) throw new Error(`Early NPC roadmap path missing: ${earlyNpcRoadmapTerm}`);
}

for (const cohabVisualTerm of ["cohabLifeSummary", "drawCohabLifeNote", "同住生活", "下一件小事", "余韵", "cohabLife: cohabLifeSummary(cohabRoutes)", "drawCohabLifeNote(ctx, livingState);", "cohabAfterglowWindowWorldFocus", "cohabAfterglowWindowPalette", "cohabAfterglowWindowSpec", "cohabAfterglowWindowAtCanvasPoint", "focusCohabAfterglowWindowFromCanvas", "同住后日谈窗灯", "最近小事", "余韵加成", "点选同住后日谈窗灯", "不会自动播放同住日常、推进周常、触发节庆事件、赠礼、接支线、交托付或消耗资源"]) {
  if (!game.includes(cohabVisualTerm) && !readme.includes(cohabVisualTerm)) throw new Error(`Cohab life world visual missing: ${cohabVisualTerm}`);
}

for (const cohabInteractionTerm of ["playCohabDailyScene", "playCohabWeeklyEvent", "playCohabFestivalEvent", "data-cohab-daily", "data-cohab-weekly", "data-cohab-festival", "relationship-cohab-actions", "看同住日常", "推进周常", "节气小事", "cohab_daily_manual"]) {
  if (!game.includes(cohabInteractionTerm) && !styles.includes(cohabInteractionTerm)) throw new Error(`Cohab life interaction missing: ${cohabInteractionTerm}`);
}

for (const ecologyCourtyardVisualTerm of ["ecologyCourtyardSummary", "drawRareSpiritEcologyYard", "drawEcologyComboMotif", "drawEcologyMemoryResonanceMarks", "ecologyLandmarkVisualSpec", "drawEcologyLandmarkFoundation", "drawEcologyLandmarkNameplate", "drawEcologyCourtyardLeylines", "ecologyLandmarkSpiritActionSpec", "ecologyLandmarkCaretakerSpirit", "drawEcologyLandmarkSpiritMicroAction", "ecologyLandmarkInspectionAura", "drawEcologyLandmarkInspectionAura", "activeEcologyInspectionCombos", "ecologyInspectionPointAt", "ecologyLandmarkInspectionSpec", "triggerEcologyLandmarkInspection", "activeEcologyInspectionFeedback", "drawEcologyInspectionFeedback", "ecology_landmark_inspection", "inspectionDay", "inspectedCombos", "inspectionHistory", "caretakerName", "rewardMood", "今日巡看", "今日已巡", "巡看留痕", "drawEcologyCourtyardLandmarks", "ecologyCourtyardTier", "ecologyCourtyardScoreBreakdown", "生态庭院", "生态共鸣", "庭院评分", "甲等庭院", "稀有精怪日常", "庭院余脉", "雨药圃", "灶火席", "夜灯路", "云仓道", "花客院", "月息池", "蜜树角", "账页屋", "照看药圃", "巡灯探路", "核账留签", "拢月静养", "采蜜绕花", "activeEcologyCombos()", "ecologyGarden: ecologyCourtyardSummary()", "drawRareSpiritEcologyYard(ctx, livingState);", "drawEcologyCourtyardLandmarks(ctx, livingState);", "drawEcologyInspectionFeedback(ctx, width, height);"]) {
  if (!game.includes(ecologyCourtyardVisualTerm)) throw new Error(`Rare spirit ecology courtyard visual missing: ${ecologyCourtyardVisualTerm}`);
}

for (const ecologyInspectionSafetyTerm of ["ecologyInspectionKeepsakeWorldFocus", "ecologyInspectionKeepsakeSafetyText", "ecologyInspectionRewardPreviewText", "ecologyInspectionKeepsakeNodes", "focusEcologyInspectionKeepsakeFromCanvas", "drawEcologyInspectionKeepsakeFocus", "ecologyInspectionConfirmRows", "生态巡看留签", "今日生态巡看确认", "确认今日巡看", "照料动作", "巡看回报", "夜事余韵", "data-ecology-inspection-confirm", "triggerEcologyLandmarkInspection(ecologyInspectionConfirmButton.dataset.ecologyInspectionConfirm)", "这里只预览/定位生态庭院巡看，不会自动记录巡看、发放灵石、提升精怪心情、影响当晚庭院夜事或消耗资源。", "previewOnly", "只预览定位 · 不记录巡看 / 不发奖励"]) {
  if (!game.includes(ecologyInspectionSafetyTerm)) throw new Error(`Ecology inspection safe preview missing: ${ecologyInspectionSafetyTerm}`);
}
for (const ecologyInspectionStyleTerm of ["ecology-inspection-confirm-card", "ecology-inspection-confirm-list", "ecology-inspection-confirm-row", "确认巡看"]) {
  if (!game.includes(ecologyInspectionStyleTerm) && !styles.includes(ecologyInspectionStyleTerm)) throw new Error(`Ecology inspection confirm style missing: ${ecologyInspectionStyleTerm}`);
}
if (game.includes("triggerEcologyLandmarkInspection(ecologyInspection.combo.comboId)")) {
  throw new Error("Ecology inspection canvas click must preview/focus only, not trigger rewards or night-care state.");
}

for (const ecologyGoalTerm of ["ecologyClaims", "ecologyComboRequirementRows", "ecologyCourtyardGoalRows", "ecologyCourtyardGoalRewardText", "claimEcologyCourtyardGoal", "生态庭院造景", "收进生态庭院", "ecology_courtyard_goal_claim", "data-ecology-goal", "goal-card ecology-goal", "ecology-requirements", "readyGoalCount", "claimedGoalCount", "goal-card ecology-score-card", "ecology-score-breakdown", "themeConsistency", "functionClosure", "spiritComfort", "rareDecor", "lifeEvents"]) {
  if (!game.includes(ecologyGoalTerm) && !styles.includes(ecologyGoalTerm)) throw new Error(`Ecology courtyard goal path missing: ${ecologyGoalTerm}`);
}

for (const ecologyGameplayTerm of ["shopTagsForItem", "ecologyCustomerVisitBias", "ecologyVisitorMixSummary", "orderEcologyAffinity", "orderEcologyHint", "orderBoardEcologySummary", "ecologyOrderFeedbackSpec", "triggerEcologyOrderFeedback", "activeEcologyOrderFeedback", "drawEcologyOrderFeedback", "ecology_order_feedback", "生态契合", "订单风向", "订单回响", "洞天生态产物", "精怪手作", "商路稀货", "order-ecology-hint", ".shop-season-row.order.ecology-match"]) {
  if (!game.includes(ecologyGameplayTerm) && !styles.includes(ecologyGameplayTerm)) throw new Error(`Ecology gameplay bridge missing: ${ecologyGameplayTerm}`);
}

for (const ecologyDailyTerm of ["ecologyDailyState", "ecologyDailyEventSpec", "settleEcologyDailyEvent", "activeEcologyDailyFeedback", "ecologyInspectionFeedback", "drawEcologyDailyFeedback", "drawEcologyDailyVisualAccent", "ecologyInspectionNightCareBonus", "inspectionCare", "preferredComboId", "sourceDay", "巡看照料", "影响当晚庭院夜事", "ecologyDailyMemoryRows", "ecologyInspectionMemoryRows", "ecologyDailyMemoryRewardText", "ecologyDailyMemoryStats", "ecologyDailyMemoryResonance", "ecologyDailyMemoryResonanceSnapshot", "ecologyDailyMemoryResonanceText", "memoryResonance", "memoryResonance.tier", "lifeScoreBonus", "庭院夜事与巡看回看", "ecology-inspection-list", "余韵", "院声初熟", "夜札成册", "百息成院", "已记", "ecology-memory-card", "ecology-memory-list", "ecology-memory-resonance", "day-summary-ecology-memory", "field_totem", "warm_hearth", "lantern_road", "thunder_route", "flower_honey", "moon_pond", "old_relic", "ecology_daily_event", "生态庭院夜事", "day-summary-ecology"]) {
  if (!game.includes(ecologyDailyTerm) && !styles.includes(ecologyDailyTerm)) throw new Error(`Ecology daily event path missing: ${ecologyDailyTerm}`);
}

for (const cutsceneTerm of ["data.cutsceneTimeline", "data.cutsceneAssets", "data.sideQuestCutsceneBeats", "data.audioAssets", "cutscene_timeline.csv", "cutscene_asset_manifest.csv", "side_quest_cutscene_beat.csv", "audio_asset_list.csv", "cutscenePanel", "cutscene-card", "memory-page", "town-shop-page", "data-cutscene-id", "data-side-cutscene", "data-cutscene-next", "data-dungeon-memory-close", "data-town-shop-moment-close", "cutscene_complete"]) {
  if (!game.includes(cutsceneTerm) && !html.includes(cutsceneTerm) && !styles.includes(cutsceneTerm)) {
    throw new Error(`Cutscene/audio playback path missing: ${cutsceneTerm}`);
  }
}

for (const finalSupportTerm of ["data.finalSupportBundles", "data.finalSupportStages", "final_support_bundle.csv", "final_support_stage.csv", "finalSupportPanel", "final-support-card", "data-final-support", "data-final-support-stage", "final_support_unlock", "final_support_stage_", "unlockedFinalSupports", "appliedFinalSupportStages", "finalSupportForeshadow", "townLifeUnlockedMemoryEntries", "finalSupportPrepClaims", "finalSupportPrepTiers", "claimFinalSupportPrep", "data-final-support-prep", "final-support-prep-list", "final-support-prep", "final_support_prep_", "预备支援", "final-support-foreshadow", "foreshadow-ready", "支援伏笔", "--support-progress"]) {
  if (!game.includes(finalSupportTerm) && !html.includes(finalSupportTerm) && !styles.includes(finalSupportTerm)) {
    throw new Error(`Final support path missing: ${finalSupportTerm}`);
  }
}

for (const spiritTerm of ["spiritBondLevels", "spiritMoodParams", "spiritVoices", "bondExp", "bondLevel", "data-spirit-action", "favorite_food_bonus", "spiritInteractionState", "recordSpiritInteraction", "spiritInteractionFeedback", "spiritInteractionFeedbackSpec", "triggerSpiritInteractionFeedback", "activeSpiritInteractionFeedback", "drawSpiritInteractionFeedback", "第一次伙伴回应", "摸摸回应", "喂食回应", "伙伴回应已写入精怪面板", "spiritInteractionMemoryTriptychWorldSpec", "spiritInteractionMemoryTriptychWorldAtCanvasPoint", "focusSpiritInteractionMemoryTriptychWorldFromCanvas", "drawSpiritInteractionMemoryTriptychWorld", "伙伴记忆三拍签", "名字 -> 动作 -> 短台词", "复述提示：它叫", "访谈验收：玩家能说出精怪名字或行为", "点选伙伴记忆三拍签", "不会自动摸摸、喂食、派工、触发事件、领取回礼、增加羁绊或消耗食物/资源", "spiritMoodRepairProfile", "createSpiritMoodRepairEvent", "maybeTriggerSpiritMoodRepair", "completeSpiritMoodRepair", "moodRepairEvent", "moodRepairHistory", "spiritDailyChoreSpec", "spiritDailyChoreMarkup", "spiritBondMilestoneSpec", "spiritBondMilestoneMarkup", "spiritIdentityMemorySpec", "spiritIdentityMemoryMarkup", "spiritIdentityMemoryNameplateSpec", "spiritIdentityMemoryNameplateAtCanvasPoint", "focusSpiritIdentityMemoryNameplateFromCanvas", "drawSpiritIdentityMemoryNameplate", "伙伴名牌", "场景伙伴名牌", "名字行为浮签", "点选伙伴名牌", "今日行为记忆", "记住名字", "记住动作", "记住短台词", "记住它三件事", "记忆三拍", "spirit-memory-recall", "只定位伙伴栏，不会自动摸摸、喂食、派工或消耗食物", "伙伴牵挂便笺", "下阶羁绊", "下一份牵挂", "不会自动摸摸、喂食、派工或消耗食物", "spirit-identity-memory", "spirit-identity-memory-tags", "spirit-bond-milestone", "spirit-bond-meter", "drawSpiritDailyChoreProp", "data-spirit-mood-repair", "spirit-mood-repair-ticket", "spirit-daily-chore", "岗位小动作", "露珠小瓢", "灶边木勺", "迎客货签", "低落小事", "安抚小事", "心情修复", "first_spirit_interaction", "spirit-interaction-card"]) {
  if (!game.includes(spiritTerm) && !styles.includes(spiritTerm)) throw new Error(`Spirit interaction path missing: ${spiritTerm}`);
}

for (const rareSpiritTheaterTerm of ["playRareSpiritTheater", "data-rare-spirit-theater", "看今日小剧场", "小剧场待触发", "rare_spirit_theater", "recordRareSpiritLifeHistory(\"theater\"", "interaction.type === \"theater\"", "spiritInteractionActionText(type, spirit)", "drawRareSpiritTheaterMoment", "drawRareSpiritTheaterGlyph", "drawRareSpiritTheaterMoment(ctx, interaction, spirit, station)", "今日小剧场互动"]) {
  if (!game.includes(rareSpiritTheaterTerm) && !styles.includes(rareSpiritTheaterTerm)) throw new Error(`Rare spirit theater interaction missing: ${rareSpiritTheaterTerm}`);
}

for (const rareSpiritTheaterArchiveTerm of ["rareSpiritTheaterArchiveEntries", "replayRareSpiritTheaterArchive", "稀有小剧场回看", "回看小剧场", "data-rare-theater-replay", "rare_spirit_theater_replay", "goal-card rare-theater-archive", "rare-theater-archive::after"]) {
  if (!game.includes(rareSpiritTheaterArchiveTerm) && !styles.includes(rareSpiritTheaterArchiveTerm)) throw new Error(`Rare spirit theater archive missing: ${rareSpiritTheaterArchiveTerm}`);
}

for (const rareSpiritDaySummaryTheaterTerm of ["rareSpiritTheaterSummaryKey", "rareSpiritTheaterDaySummaryRows", "rareSpiritTheaterDaySummaryMarkup", "replayRareSpiritTheaterFromSummary", "rareSpiritTheaterRows", "day-summary-rare-theater", "data-day-summary-rare-theater", "稀有小剧场余韵", "角色记忆", "回看这段小剧场", "回看只播放已收录小剧场", "不会自动触发新事件、领取回礼、增加羁绊或消耗资源"]) {
  if (!game.includes(rareSpiritDaySummaryTheaterTerm) && !styles.includes(rareSpiritDaySummaryTheaterTerm)) throw new Error(`Rare spirit day-summary theater echo missing: ${rareSpiritDaySummaryTheaterTerm}`);
}

for (const rareSpiritLifeCodexTerm of ["rareSpiritLifeCodexRows", "rareSpiritActionPromenadeRows", "rareSpiritActionPromenadeSpec", "rareSpiritActionPromenadeMarkup", "精怪生活图鉴", "生活进度", "稀有精怪专属动作巡演牌", "摇铃撒花", "测风引路", "递来月露", "影灯指路", "账页盖章", "抱罐巡锅", "只定位精怪、事件或回看入口", "不会自动触发事件、播放小剧场、领取回礼或消耗资源", "rare-life-codex", "rare-life-codex-tags", "rare-action-promenade", "rare-action-promenade-grid", "data-rare-action-line", "最近小剧场", "最近回礼", "生态共鸣", "事件可推", "focusLifeCodexTarget", "data-life-codex-focus", "data-life-codex-line", "data-life-codex-filter", "data-spirit-line", "data-rare-event-line", "data-theater-line", "scrollIntoView", "codex-focus-pulse", "定位精怪", "定位事件", "可推进优先", "待收录小剧场", "生态待养", "lifeCodexFilterMatches", "rare-life-codex-filter-bar"]) {
  if (!game.includes(rareSpiritLifeCodexTerm) && !styles.includes(rareSpiritLifeCodexTerm)) throw new Error(`Rare spirit life codex missing: ${rareSpiritLifeCodexTerm}`);
}

for (const spiritVisualTerm of ["spiritVisualProfile", "spiritJobStation", "spiritJobPersonaSpec", "drawSpiritJobEffect", "drawSpiritJobPersonaBubble", "spiritAutomationTrailSpec", "drawSpiritAutomationTrail", "drawSpiritAutomationTrail(ctx, spirit, station, index)", "spiritAutomationGroundTraceSpec", "spiritAutomationGroundTraceAnchor", "spiritAutomationGroundTraceAtCanvasPoint", "focusSpiritAutomationGroundTraceFromCanvas", "drawSpiritAutomationGroundTrace", "drawSpiritAutomationGroundTrace(ctx", "自动化收益留痕", "点选自动化收益留痕", "田水、灶火、货签、巡灯、旗路和庭院花息", "不会自动切岗、派工、排产、开铺、发商队、处理风险、入夜或消耗资源", "spiritStageNumber", "spiritWorkRangeSpec", "drawSpiritWorkRangeAura", "spiritEvolutionFeedback", "spiritEvolutionFeedbackSpec", "triggerSpiritEvolutionFeedback", "activeSpiritEvolutionFeedback", "drawSpiritEvolutionFeedback", "spiritFinaleFeedback", "spiritFinaleCompanionSpec", "spiritFinaleEffectSummary", "spiritFinaleEffectRows", "spiritFinaleEffectSnapshot", "spiritFinaleEffects", "farmGrowthBonus", "waterCareBonus", "workshopSpeedBonus", "patrolGuardBonus", "shopBudgetBonus", "festivalThemeBonus", "triggerSpiritFinaleFeedback", "replaySpiritFinaleFeedback", "data-spirit-finale-replay", "spirit-canvas-finale-ticket", "回看终章落定", "activeSpiritFinaleFeedback", "drawSpiritFinaleFeedback", "drawSpiritFinaleCompanionAnchor", "终章陪伴落定", "终章常驻", "终章伙伴常驻", "spirit-finale-memory-ticket", "spirit-finale-effect-card", "day-summary-spirit-finale", "shop-finale-boost", "workshop-finale-boost", "spirit_finale", "岗位进化回响", "进化完成", "spirit-work-range", "范围扩大", "工作范围已扩大", "二阶进化", "下一阶预览", "workRangeX", "workRangeY", "spiritCompanionCanvasSpec", "drawSpiritCompanionCareHint", "drawSpiritColony", "drawRareSpiritTheaterGlyph(ctx, lineId", "spirit-job-persona", "浇水灵珠", "灶火星屑", "招客话牌", "自动浇水轨迹", "工坊投料", "补货跑动", "巡灯扫线", "远征旗路", "庭院安抚波", "巡逻灯域", "庭院花息", "今日小剧场", "想吃东西", "陪伴稳定", "喂食会开心", "spirit_line_hualing", "spirit_line_leizhu", "spirit_line_yuelian", "spirit_line_dengying", "spirit_line_shuqi", "spirit_line_fengmi", "spirit-glyph", "视觉定位"]) {
  if (!game.includes(spiritVisualTerm) && !styles.includes(spiritVisualTerm)) throw new Error(`Spirit visual colony path missing: ${spiritVisualTerm}`);
}

for (const spiritEventTerm of ["data.spiritEvents", "data.spiritMemoryFlags", "spirit_event.csv", "spirit_memory_flag.csv", "completedSpiritEvents", "spiritMemoryFlags", "spiritEventsByLine", "spiritMemoryByEvent", "spiritEventStageLabel", "spiritEventOwnedSpirit", "spiritEventUpgradeConfig", "upgradeSpiritToConfig", "completeSpiritEvent", "spiritEventTriggerHint", "spiritEventSceneReady", "playSpiritEventScene", "spiritEventGoalRows", "初见", "进化", "终章陪伴", "伙伴记忆线", "回看进化演出", "工作范围 ", "data-spirit-event", "data-spirit-event-scene", "spirit-event-row", "spirit-line-event"]) {
  if (!game.includes(spiritEventTerm) && !styles.includes(spiritEventTerm)) throw new Error(`Spirit event/memory path missing: ${spiritEventTerm}`);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const [headers, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
}

const items = parseCsv(readFileSync("csv/item_base.csv", "utf8"));
const crops = parseCsv(readFileSync("csv/crop_config.csv", "utf8"));
const recipes = parseCsv(readFileSync("csv/recipe_config.csv", "utf8"));
const buildings = parseCsv(readFileSync("csv/building_config.csv", "utf8"));
const machines = parseCsv(readFileSync("csv/machine_config.csv", "utf8"));
const spirits = parseCsv(readFileSync("csv/spirit_base.csv", "utf8"));
const spiritBondLevels = parseCsv(readFileSync("csv/spirit_bond_level.csv", "utf8"));
const spiritMoodParams = parseCsv(readFileSync("csv/spirit_mood_param.csv", "utf8"));
const spiritVoices = parseCsv(readFileSync("csv/spirit_voice_bank.csv", "utf8"));
const spiritEvents = parseCsv(readFileSync("csv/spirit_event.csv", "utf8"));
const spiritMemoryFlags = parseCsv(readFileSync("csv/spirit_memory_flag.csv", "utf8"));
const spiritJobMastery = parseCsv(readFileSync("csv/spirit_job_mastery.csv", "utf8"));
const spiritExpeditions = parseCsv(readFileSync("csv/spirit_expedition.csv", "utf8"));
const spiritEcologyCombos = parseCsv(readFileSync("csv/spirit_ecology_combo.csv", "utf8"));
const earlyRewardPacing = parseCsv(readFileSync("csv/early_reward_pacing.csv", "utf8"));
const year2GoalBook = parseCsv(readFileSync("csv/year2_goal_book_rule.csv", "utf8"));
const year2SolarTrials = parseCsv(readFileSync("csv/year2_solar_trial.csv", "utf8"));
const rareSpiritEvents = parseCsv(readFileSync("csv/rare_spirit_event_action.csv", "utf8"));
const freeplayGoals = parseCsv(readFileSync("csv/freeplay_goal.csv", "utf8"));
const customers = parseCsv(readFileSync("csv/shop_customer.csv", "utf8"));
const customerSegments = parseCsv(readFileSync("csv/customer_segment_rule.csv", "utf8"));
const customerBehavior = parseCsv(readFileSync("csv/customer_behavior_param.csv", "utf8"));
const customerStateFlow = parseCsv(readFileSync("csv/customer_state_flow.csv", "utf8"));
const customerProfiles = parseCsv(readFileSync("csv/customer_archetype_profile.csv", "utf8"));
const npcBarks = parseCsv(readFileSync("csv/npc_bark.csv", "utf8"));
const localization = parseCsv(readFileSync("csv/localization_text.csv", "utf8"));
const priceRules = parseCsv(readFileSync("csv/shop_price_rule.csv", "utf8"));
const shelfThemes = parseCsv(readFileSync("csv/shop_shelf_theme_bonus.csv", "utf8"));
const shopDiagnostics = parseCsv(readFileSync("csv/shop_customer_feedback_diagnosis.csv", "utf8"));
const orders = parseCsv(readFileSync("csv/order_config.csv", "utf8"));
const year2Orders = parseCsv(readFileSync("csv/year2_order_config.csv", "utf8"));
const shopSeasons = parseCsv(readFileSync("csv/year2_shop_season.csv", "utf8"));
const shopSettlementRules = parseCsv(readFileSync("csv/year2_shop_settlement_rule.csv", "utf8"));
const shopRankRewards = parseCsv(readFileSync("csv/year2_shop_rank_reward.csv", "utf8"));
const rewardPools = parseCsv(readFileSync("csv/reward_pool.csv", "utf8"));
const favorRewards = parseCsv(readFileSync("csv/favor_reward.csv", "utf8"));
const npcs = parseCsv(readFileSync("csv/npc_base.csv", "utf8"));
const npcSchedules = parseCsv(readFileSync("csv/npc_schedule.csv", "utf8"));
const cohabEpilogues = parseCsv(readFileSync("csv/cohab_epilogue.csv", "utf8"));
const cohabWeeklyEvents = parseCsv(readFileSync("csv/cohab_weekly_event.csv", "utf8"));
const cohabFestivalEvents = parseCsv(readFileSync("csv/cohab_festival_event.csv", "utf8"));
const cohabDialogueMaps = parseCsv(readFileSync("csv/cohab_dialogue_map.csv", "utf8"));
const cutsceneTimeline = parseCsv(readFileSync("csv/cutscene_timeline.csv", "utf8"));
const cutsceneAssets = parseCsv(readFileSync("csv/cutscene_asset_manifest.csv", "utf8"));
const sideQuestCutsceneBeats = parseCsv(readFileSync("csv/side_quest_cutscene_beat.csv", "utf8"));
const audioAssets = parseCsv(readFileSync("csv/audio_asset_list.csv", "utf8"));
const audioMixBuses = parseCsv(readFileSync("csv/audio_mix_bus.csv", "utf8"));
const finalSupportBundles = parseCsv(readFileSync("csv/final_support_bundle.csv", "utf8"));
const finalSupportStages = parseCsv(readFileSync("csv/final_support_stage.csv", "utf8"));
const sideQuestDialogueMaps = parseCsv(readFileSync("csv/side_quest_dialogue_map.csv", "utf8"));
const dialogues = parseCsv(readFileSync("csv/dialogue_group.csv", "utf8"));
const quests = parseCsv(readFileSync("csv/quest_base.csv", "utf8"));
const questSteps = parseCsv(readFileSync("csv/quest_step.csv", "utf8"));
const sideQuests = parseCsv(readFileSync("csv/side_quest_base.csv", "utf8"));
const sideQuestSteps = parseCsv(readFileSync("csv/side_quest_step.csv", "utf8"));
const sideQuestTriggers = parseCsv(readFileSync("csv/side_quest_event_trigger.csv", "utf8"));
const dungeons = parseCsv(readFileSync("csv/dungeon_area.csv", "utf8"));
const enemies = parseCsv(readFileSync("csv/enemy_config.csv", "utf8"));
const lootPools = parseCsv(readFileSync("csv/loot_pool.csv", "utf8"));
const bosses = parseCsv(readFileSync("csv/boss_config.csv", "utf8"));
const bossSkills = parseCsv(readFileSync("csv/boss_skill.csv", "utf8"));
const spiritSkills = parseCsv(readFileSync("csv/spirit_skill.csv", "utf8"));
const dungeonSolarMechanics = parseCsv(readFileSync("csv/dungeon_solar_mechanic.csv", "utf8"));
const tradeRoutes = parseCsv(readFileSync("csv/interrealm_trade_route.csv", "utf8"));
const tradeRouteEvents = parseCsv(readFileSync("csv/trade_route_event.csv", "utf8"));
const tradeRouteRiskSupplies = parseCsv(readFileSync("csv/trade_route_risk_supply.csv", "utf8"));
const hiddenDungeonRotations = parseCsv(readFileSync("csv/hidden_dungeon_rotation.csv", "utf8"));
const eventTriggers = parseCsv(readFileSync("csv/event_trigger.csv", "utf8"));
const guideScripts = parseCsv(readFileSync("csv/guide_script.csv", "utf8"));
const solarTerms = parseCsv(readFileSync("csv/solar_term_config.csv", "utf8"));
const weather = parseCsv(readFileSync("csv/weather_config.csv", "utf8"));
const steamAssets = parseCsv(readFileSync("csv/steam_asset_production_plan.csv", "utf8"));
const achievements = parseCsv(readFileSync("csv/achievement_config.csv", "utf8"));
const demoQa = parseCsv(readFileSync("csv/demo_qa_checklist.csv", "utf8"));
const verticalSlice = parseCsv(readFileSync("csv/vertical_slice_acceptance.csv", "utf8"));
const releaseGates = parseCsv(readFileSync("csv/release_readiness_gate.csv", "utf8"));
const saveSchemaRegistry = parseCsv(readFileSync("csv/save_schema_registry.csv", "utf8"));
const saveMigrationPlan = parseCsv(readFileSync("csv/save_migration_plan.csv", "utf8"));
const localizationCoveragePlan = parseCsv(readFileSync("csv/localization_coverage_plan.csv", "utf8"));
const communityContentCalendar = parseCsv(readFileSync("csv/community_content_calendar.csv", "utf8"));
const conditionGroups = parseCsv(readFileSync("csv/condition_group.csv", "utf8"));

const itemIds = new Set(items.map((item) => item.item_id));
const crop = crops.find((entry) => entry.crop_id === "crop_lingqi_bailuobo");
const cabbageCrop = crops.find((entry) => entry.crop_id === "crop_qingya_baicai");
const canalCrop = crops.find((entry) => entry.crop_id === "crop_luzhu_qin");
const canalSeed = items.find((entry) => entry.item_id === "seed_luzhu_qin");
const canalCropItem = items.find((entry) => entry.item_id === "crop_luzhu_qin");
const demoStorage = buildings.find((entry) => entry.building_id === "build_storage_001");
const demoMill = buildings.find((entry) => entry.building_id === "build_mill_001");
const demoWell = buildings.find((entry) => entry.building_id === "build_lingjing_001");
const millMachine = machines.find((entry) => entry.building_unlock_id === "build_mill_001");
const spirit = spirits.find((entry) => entry.spirit_id === "spirit_luobo_01");
const recipe = recipes.find((entry) => entry.output_item_id === "item_food_bailuobo_tang");
const cabbageRecipe = recipes.find((entry) => entry.recipe_id === "recipe_qingchao_baicai");
const villager = customers.find((entry) => entry.customer_id === "customer_villager");
const waterwayCustomer = customers.find((entry) => entry.customer_id === "customer_waterway_broker");
const xubo = npcs.find((entry) => entry.npc_id === "npc_xubo");
const xuboSchedule = npcSchedules.find((entry) => entry.npc_id === "npc_xubo" && entry.area_id === "area_town_hall");
const baizhiCohab = cohabEpilogues.find((entry) => entry.npc_id === "npc_baizhi");
const baizhiWeekly = cohabWeeklyEvents.find((entry) => entry.epilogue_id === baizhiCohab?.epilogue_id);
const baizhiFestival = cohabFestivalEvents.find((entry) => entry.epilogue_id === baizhiCohab?.epilogue_id);
const baizhiCohabDialogue = cohabDialogueMaps.find((entry) => entry.epilogue_id === baizhiCohab?.epilogue_id);
const bossIntroShots = cutsceneTimeline.filter((entry) => entry.cutscene_id === "cutscene_boss_mingmu_intro");
const finalArrayAssets = cutsceneAssets.filter((entry) => entry.cutscene_id === "cutscene_final_array_build");
const sideBridgeBeats = sideQuestCutsceneBeats.filter((entry) => entry.map_id === "side_map_0101_01");
const spiritEvolutionSceneEvents = spiritEvents.filter((entry) => entry.reward_type === "scene" && entry.event_stage === "evolve");
const spiritEvolutionCutsceneIds = [...new Set(spiritEvolutionSceneEvents.map((entry) => entry.reward_param).filter(Boolean))];
const spiritEvolutionShots = spiritEvolutionCutsceneIds.map((cutsceneId) => ({
  cutsceneId,
  shots: cutsceneTimeline.filter((entry) => entry.cutscene_id === cutsceneId),
  assets: cutsceneAssets.filter((entry) => entry.cutscene_id === cutsceneId),
}));
const bossRevealAudio = audioAssets.find((entry) => entry.audio_id === "audio_boss_mingmu_reveal");
const masterBus = audioMixBuses.find((entry) => entry.bus_id === "bus_master");
const bgmBus = audioMixBuses.find((entry) => entry.bus_id === "bus_bgm");
const dialogueBus = audioMixBuses.find((entry) => entry.bus_id === "bus_dialogue");
const xuboFinalSupport = finalSupportBundles.find((entry) => entry.bundle_id === "support_bundle_xubo_final");
const fullFinalSupport = finalSupportBundles.find((entry) => entry.bundle_id === "support_bundle_full_resonance");
const xuboSupportStages = finalSupportStages.filter((entry) => entry.bundle_id === "support_bundle_xubo_final");
const battleSupportStages = finalSupportStages.filter((entry) => entry.stage_phase === "battle");
const shopOpening = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_shop_opening");
const mainQuest0001 = quests.find((entry) => entry.quest_id === "quest_main_0001_luojiao_zhidi");
const mainQuestSteps0001 = questSteps.filter((entry) => entry.quest_id === "quest_main_0001_luojiao_zhidi");
const sideQuest0101 = sideQuests.find((entry) => entry.quest_id === "quest_side_0101_xubo_bridge_old");
const sideQuestSteps0101 = sideQuestSteps.filter((entry) => entry.quest_id === "quest_side_0101_xubo_bridge_old");
const sideQuestTrigger0101 = sideQuestTriggers.find((entry) => entry.quest_id === "quest_side_0101_xubo_bridge_old");
const sideQuestDialogue0101 = sideQuestDialogueMaps.find((entry) => entry.quest_id === "quest_side_0101_xubo_bridge_old");
const sideQuest0205 = sideQuests.find((entry) => entry.quest_id === "quest_side_0205_qinghe_pond");
const sideQuestTrigger0205 = sideQuestTriggers.find((entry) => entry.quest_id === "quest_side_0205_qinghe_pond");
const sideQuestDialogue0205 = sideQuestDialogueMaps.find((entry) => entry.map_id === "side_map_0205_02");
const mainQuest0001Rewards = rewardPools.filter((entry) => entry.reward_pool_id === mainQuest0001?.complete_reward_group);
const mainQuest0101 = quests.find((entry) => entry.quest_id === "quest_main_0101_lingjing_huisheng");
const mainQuest0101Rewards = rewardPools.filter((entry) => entry.reward_pool_id === mainQuest0101?.complete_reward_group);
const mainQuest0102 = quests.find((entry) => entry.quest_id === "quest_main_0102_tonghuo_chuming");
const mainQuestSteps0102 = questSteps.filter((entry) => entry.quest_id === "quest_main_0102_tonghuo_chuming");
const copperHoeRecipe = recipes.find((entry) => entry.recipe_id === "recipe_tool_copper_set");
const mainQuest0103 = quests.find((entry) => entry.quest_id === "quest_main_0103_duanqiao_jiumu");
const mainQuestSteps0103 = questSteps.filter((entry) => entry.quest_id === "quest_main_0103_duanqiao_jiumu");
const mainQuest0103Rewards = rewardPools.filter((entry) => entry.reward_pool_id === mainQuest0103?.complete_reward_group);
const bridgeRepairBuilding = buildings.find((entry) => entry.building_id === "build_broken_bridge_repair");
const mainQuest0201 = quests.find((entry) => entry.quest_id === "quest_main_0201_jiupu_kaimen");
const mainQuestSteps0201 = questSteps.filter((entry) => entry.quest_id === "quest_main_0201_jiupu_kaimen");
const mainQuest0201Rewards = rewardPools.filter((entry) => entry.reward_pool_id === mainQuest0201?.complete_reward_group);
const oldShopBuilding = buildings.find((entry) => entry.building_id === "build_shop_lv1");
const eventMain0202 = eventTriggers.find((entry) => entry.event_id === "event_main_0202");
const eventMain0203 = eventTriggers.find((entry) => entry.event_id === "event_main_0203");
const mainQuest0201Step2Condition = conditionGroups.find((entry) => entry.condition_group_id === "quest_main_0201_step_2_done");
const mainQuest0202 = quests.find((entry) => entry.quest_id === "quest_main_0202_baizhi_zhiqiu");
const mainQuestSteps0202 = questSteps.filter((entry) => entry.quest_id === "quest_main_0202_baizhi_zhiqiu");
const mainQuest0202Rewards = rewardPools.filter((entry) => entry.reward_pool_id === mainQuest0202?.complete_reward_group);
const herbValleyDungeon = dungeons.find((entry) => entry.area_id === "area_herb_valley");
const herbValleyBoss = bosses.find((entry) => entry.boss_id === "boss_shixiang_tengmu");
const eventMain0205 = eventTriggers.find((entry) => entry.event_id === "event_main_0205");
const eventMain0207 = eventTriggers.find((entry) => entry.event_id === "event_main_0207");
const eventMain0301 = eventTriggers.find((entry) => entry.event_id === "event_main_0301");
const mainQuest0202Condition = conditionGroups.find((entry) => entry.condition_group_id === "quest_main_0202_active");
const chapter3EntryCondition = conditionGroups.find((entry) => entry.condition_group_id === "chapter_3_entry_ready");
const baizhiFavor2Reward = favorRewards.find((entry) => entry.reward_id === "favor_reward_baizhi_2");
const mainQuest0301 = quests.find((entry) => entry.quest_id === "quest_main_0301_baiguai_youyuan");
const mainQuestSteps0301 = questSteps.filter((entry) => entry.quest_id === "quest_main_0301_baiguai_youyuan");
const spiritManorBuilding = buildings.find((entry) => entry.building_id === "build_spirit_manor");
const eventMain0302 = eventTriggers.find((entry) => entry.event_id === "event_main_0302");
const eventMain0303 = eventTriggers.find((entry) => entry.event_id === "event_main_0303");
const mainQuest0301Condition = conditionGroups.find((entry) => entry.condition_group_id === "quest_main_0301_active");
const spiritManorOverviewCondition = conditionGroups.find((entry) => entry.condition_group_id === "spirit_manor_overview_unlocked");
const mainQuest0302 = quests.find((entry) => entry.quest_id === "quest_main_0302_shanghui_laike");
const mainQuestSteps0302 = questSteps.filter((entry) => entry.quest_id === "quest_main_0302_shanghui_laike");
const factionOrder = orders.find((entry) => entry.order_id === "order_faction_0001");
const eventMain0305 = eventTriggers.find((entry) => entry.event_id === "event_main_0305");
const eventMain0306 = eventTriggers.find((entry) => entry.event_id === "event_main_0306");
const eventMain0307 = eventTriggers.find((entry) => entry.event_id === "event_main_0307");
const chapter3TradeCondition = conditionGroups.find((entry) => entry.condition_group_id === "chapter_3_trade_started");
const factionOrderDoneCondition = conditionGroups.find((entry) => entry.condition_group_id === "faction_order_first_delivered");
const fireRuinCondition = conditionGroups.find((entry) => entry.condition_group_id === "fire_ruin_unlocked");
const mainQuest0302Condition = conditionGroups.find((entry) => entry.condition_group_id === "quest_main_0302_active");
const fireRuinDungeon = dungeons.find((entry) => entry.area_id === "area_ruin_fire");
const fireRuinBoss = bosses.find((entry) => entry.boss_id === "boss_chiyan_xiehou");
const mainQuest0401 = quests.find((entry) => entry.quest_id === "quest_main_0401_jiuyao_dahan");
const mainQuestSteps0401 = questSteps.filter((entry) => entry.quest_id === "quest_main_0401_jiuyao_dahan");
const mainQuest0402 = quests.find((entry) => entry.quest_id === "quest_main_0402_ershisi_shu");
const mainQuestSteps0402 = questSteps.filter((entry) => entry.quest_id === "quest_main_0402_ershisi_shu");
const mainQuest0403 = quests.find((entry) => entry.quest_id === "quest_main_0403_pantao_dayan");
const mainQuestSteps0403 = questSteps.filter((entry) => entry.quest_id === "quest_main_0403_pantao_dayan");
const disasterOrder = orders.find((entry) => entry.order_id === "order_disaster_0001");
const disasterRewards = rewardPools.filter((entry) => entry.reward_pool_id === "pool_disaster_relief");
const eventMain0401 = eventTriggers.find((entry) => entry.event_id === "event_main_0401");
const eventMain0402 = eventTriggers.find((entry) => entry.event_id === "event_main_0402");
const eventMain0404 = eventTriggers.find((entry) => entry.event_id === "event_main_0404");
const eventMain0405 = eventTriggers.find((entry) => entry.event_id === "event_main_0405");
const eventMain0406 = eventTriggers.find((entry) => entry.event_id === "event_main_0406");
const eventMain0407 = eventTriggers.find((entry) => entry.event_id === "event_main_0407");
const worldStateDroughtCondition = conditionGroups.find((entry) => entry.condition_group_id === "world_state_drought");
const droughtReliefDoneCondition = conditionGroups.find((entry) => entry.condition_group_id === "drought_relief_order_delivered");
const mainQuest0402Condition = conditionGroups.find((entry) => entry.condition_group_id === "quest_main_0402_active");
const mainQuest0403Condition = conditionGroups.find((entry) => entry.condition_group_id === "quest_main_0403_active");
const mainQuest0403Step1Condition = conditionGroups.find((entry) => entry.condition_group_id === "quest_main_0403_step_1_done");
const finalNestDungeon = dungeons.find((entry) => entry.area_id === "area_final_nest");
const finalBoss = bosses.find((entry) => entry.boss_id === "boss_shiling_mingmu");
const finalArrayBuilding = buildings.find((entry) => entry.building_id === "build_solar_array_final");
const sideQuest0101Rewards = rewardPools.filter((entry) => entry.reward_pool_id === sideQuest0101?.complete_reward_group);
const reliefSideQuest = sideQuests.find((entry) => entry.quest_id === "quest_side_0401_relief_supply");
const reliefSideRewards = rewardPools.filter((entry) => entry.reward_pool_id === reliefSideQuest?.complete_reward_group);
const newGameEvent = eventTriggers.find((entry) => entry.event_id === "event_main_0001");
const firstSpiritEvent = eventTriggers.find((entry) => entry.event_id === "event_main_0005");
const jingzheSideTrigger = sideQuestTriggers.find((entry) => entry.event_id === "event_side_0104_start");
const qingyunMine = dungeons.find((entry) => entry.area_id === "area_mine_qingyun");
const mineEnemies = enemies.filter((entry) => entry.enemy_id.startsWith("enemy_mine"));
const mineLoot = lootPools.filter((entry) => entry.pool_id === "loot_pool_mine_common");
const muweiBoss = bosses.find((entry) => entry.boss_id === "boss_liejia_muwei");
const muweiSkills = bossSkills.filter((entry) => entry.boss_id === "boss_liejia_muwei");
const suanCombatSkill = spiritSkills.find((entry) => entry.effect_type === "combat" && entry.trigger_type === "on_battle");
const dungeonMechanic = dungeonSolarMechanics[0];
const cloudRoute = tradeRoutes.find((entry) => entry.route_id === "route_cloudmarket_01");
const cloudRouteEvent = tradeRouteEvents.find((entry) => entry.trade_event_id === "trade_event_cloud_01");
const cloudRouteRisk = tradeRouteRiskSupplies.find((entry) => entry.risk_supply_id === "trade_risk_cloud_01");
const lotusBasinRoute = tradeRoutes.find((entry) => entry.route_id === "route_lotus_basin_03");
const lotusBasinRouteEvent = tradeRouteEvents.find((entry) => entry.trade_event_id === "trade_event_lotus_01");
const lotusBasinRouteRisk = tradeRouteRiskSupplies.find((entry) => entry.risk_supply_id === "trade_risk_lotus_01");
const thunderOldRoute = tradeRoutes.find((entry) => entry.route_id === "route_thunder_old_06");
const thunderOldRouteEvent = tradeRouteEvents.find((entry) => entry.trade_event_id === "trade_event_thunder_01");
const thunderOldRouteRisks = tradeRouteRiskSupplies.filter((entry) => entry.route_id === "route_thunder_old_06");
const waterHiddenRotation = hiddenDungeonRotations.find((entry) => entry.rotation_id === "hidden_rot_water_01");
const mineHiddenRotation = hiddenDungeonRotations.find((entry) => entry.rotation_id === "hidden_rot_mine_01");
const thunderHiddenRotation = hiddenDungeonRotations.find((entry) => entry.rotation_id === "hidden_rot_thunder_01");
const fireHiddenRotation = hiddenDungeonRotations.find((entry) => entry.rotation_id === "hidden_rot_fire_01");
const stelaHiddenRotation = hiddenDungeonRotations.find((entry) => entry.rotation_id === "hidden_rot_stela_01");
const waterHiddenRewards = rewardPools.filter((entry) => entry.reward_pool_id === "pool_reward_year2_dungeon");
const mineHiddenRewards = rewardPools.filter((entry) => entry.reward_pool_id === "pool_reward_year2_build");
const thunderHiddenRewards = rewardPools.filter((entry) => entry.reward_pool_id === "pool_reward_exp_stormbamboo");
const lichun = solarTerms.find((entry) => entry.term_id === "term_lichun");
const jingzhe = solarTerms.find((entry) => entry.term_id === "term_jingzhe");
const jingzheRisk = eventTriggers.find((entry) => entry.event_id === "event_term_jingzhe_01");
const jingzheGuide = guideScripts.find((entry) => entry.trigger_param === "term_jingzhe" && entry.ui_target_id === "ui_pest_alert");
const clearWeather = weather.find((entry) => entry.weather_id === "weather_clear");
const rainWeather = weather.find((entry) => entry.weather_id === "weather_light_rain");
const dryHeatWeather = weather.find((entry) => entry.weather_id === "weather_dry_heat");
const p0SteamAssets = steamAssets.filter((entry) => entry.priority === "P0");
const p0Achievements = achievements.filter((entry) => entry.priority === "P0");
const demoFoundation = achievements.find((entry) => entry.achievement_id === "ach_demo_foundation");
const p0Qa = demoQa.filter((entry) => entry.priority === "P0");
const p0Vertical = verticalSlice.filter((entry) => entry.priority === "P0");
const daySummaryAcceptance = verticalSlice.find((entry) => entry.accept_id === "vsa_008");
const p0ReleaseGates = releaseGates.filter((entry) => entry.priority === "P0");
const p0SaveFields = saveSchemaRegistry.filter((entry) => entry.qa_priority === "P0");
const migrationToV2 = saveMigrationPlan.filter((entry) => entry.to_version === "2");
const p0LocalizationCoverage = localizationCoveragePlan.filter((entry) => entry.priority === "P0");
const locMainDialogue = localizationCoveragePlan.find((entry) => entry.coverage_id === "loc_main_dialogue");
const locFinalSupport = localizationCoveragePlan.find((entry) => entry.coverage_id === "loc_final_support");
const locSteamStore = localizationCoveragePlan.find((entry) => entry.coverage_id === "loc_steam_store");
const launchBeat = communityContentCalendar.find((entry) => entry.phase === "launch" && entry.cta === "buy_now");
const demoBeats = communityContentCalendar.filter((entry) => entry.cta === "download_demo");
const steamCommunityBeats = communityContentCalendar.filter((entry) => entry.target_channel.includes("steam"));
const alwaysTrueCondition = conditionGroups.find((entry) => entry.condition_group_id === "always_true");
const firstHarvestCondition = conditionGroups.find((entry) => entry.condition_group_id === "has_first_harvest");
const finalNestReadyCondition = conditionGroups.find((entry) => entry.condition_group_id === "quest_main_0402_ready");
const xuboFavorCondition = conditionGroups.find((entry) => entry.condition_group_id === "npc_xubo_favor_5");
const finalQuestCondition = conditionGroups.find((entry) => entry.condition_group_id === "quest_main_0403_active");
const jingzheCondition = conditionGroups.find((entry) => entry.condition_group_id === "current_term_jingzhe");
const bossCondition = conditionGroups.find((entry) => entry.condition_group_id === "boss_chiyan_xiehou_defeated");
const thunderRouteReadyCondition = conditionGroups.find((entry) => entry.condition_group_id === "rare_spirit_thunder_route_ready");
const thunderRouteOpenCondition = conditionGroups.find((entry) => entry.condition_group_id === "rare_spirit_thunder_route_open");
const qingheLotusBasinRouteCondition = conditionGroups.find((entry) => entry.condition_group_id === "qinghe_lotus_basin_route_ready");
const qingheLotusBasinReturnCondition = conditionGroups.find((entry) => entry.condition_group_id === "qinghe_lotus_basin_trade_return");
const qingheLotusBasinReturnDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_qinghe_lotus_basin_return");
const qingheLotusBasinReturnLine001 = localization.find((entry) => entry.text_key === "dialogue_qinghe_lotus_basin_return_001");
const qingheLotusBasinReturnLine002 = localization.find((entry) => entry.text_key === "dialogue_qinghe_lotus_basin_return_002");
const qingheLotusBasinReturnLine003 = localization.find((entry) => entry.text_key === "dialogue_qinghe_lotus_basin_return_003");
const villagerPriceRule = priceRules.find((entry) => entry.customer_archetype === "villager");
const springSeason = shopSeasons.find((entry) => entry.season_id === "season_shop_001");
const springSeasonRules = shopSettlementRules.filter((entry) => entry.season_id === "season_shop_001");
const springSeasonSReward = shopRankRewards.find((entry) => entry.season_id === "season_shop_001" && entry.rank_tier === "s");
const year2GiftOrder = year2Orders.find((entry) => entry.order_id === "order_year2_shop_0001");
const year2TownOrder = year2Orders.find((entry) => entry.order_id === "order_year2_town_0001");
const year2WaterOrder = year2Orders.find((entry) => entry.order_id === "order_year2_water_0001");
const year2WaterFollowupOrder = year2Orders.find((entry) => entry.order_id === "order_year2_water_0002");
const year2QingheWaterwayReadyCondition = conditionGroups.find((entry) => entry.condition_group_id === "year2_qinghe_waterway_ready");
const qingheLotusBasinFollowupOrderCondition = conditionGroups.find((entry) => entry.condition_group_id === "qinghe_lotus_basin_followup_order_ready");
const qingheLotusBasinFollowupDoneCondition = conditionGroups.find((entry) => entry.condition_group_id === "qinghe_lotus_basin_followup_order_done");
const year2GuardOrder = year2Orders.find((entry) => entry.order_id === "order_year2_guard_0001");
const year2FestivalOrder = year2Orders.find((entry) => entry.order_id === "order_year2_festival_0001");
const villagerSegment = customerSegments.find((entry) => entry.segment_rule_id === "segment_villager_spring");
const villagerBehavior = customerBehavior.find((entry) => entry.customer_archetype === "villager" && entry.state_name === "evaluate_price");
const villagerFlow = customerStateFlow.filter((entry) => entry.customer_archetype === "villager");
const villagerProfile = customerProfiles.find((entry) => entry.archetype_id === "villager");
const villagerBark = npcBarks.find((entry) => entry.speaker_group === "villager" && entry.context_type === "shop_buy");
const villagerBarkText = localization.find((entry) => entry.text_key === villagerBark?.text_key);
const villagerFlowHints = villagerFlow.map((entry) => localization.find((text) => text.text_key === entry.ui_hint_key)).filter(Boolean);
const waterwayProfile = customerProfiles.find((entry) => entry.archetype_id === "waterway_broker");
const waterwaySegment = customerSegments.find((entry) => entry.segment_rule_id === "segment_waterway_lianze");
const waterwayBehavior = customerBehavior.find((entry) => entry.customer_archetype === "waterway_broker" && entry.state_name === "browse_waterway");
const waterwayFlow = customerStateFlow.filter((entry) => entry.customer_archetype === "waterway_broker");
const waterwayFlowHints = waterwayFlow.map((entry) => localization.find((text) => text.text_key === entry.ui_hint_key)).filter(Boolean);
const waterwayBark = npcBarks.find((entry) => entry.speaker_group === "waterway_broker" && entry.context_type === "shop_buy");
const waterwayBarkText = localization.find((entry) => entry.text_key === waterwayBark?.text_key);
const waterwayNeedHint = shopDiagnostics.find((entry) => entry.customer_segment === "水航客" && entry.feedback_type === "need_hint");
const waterwayPurchaseReason = shopDiagnostics.find((entry) => entry.customer_segment === "水航客" && entry.feedback_type === "purchase_reason");
const freshTheme = shelfThemes.find((entry) => entry.theme_tag === "fresh_market");
const priceDiagnosis = shopDiagnostics.find((entry) => entry.localization_key === "shop_diag_price_high");
const villagerRefreshHints = shopDiagnostics.filter((entry) => entry.feedback_type === "need_hint" && entry.customer_segment === "镇民");
const healerRefreshHints = shopDiagnostics.filter((entry) => entry.feedback_type === "need_hint" && entry.customer_segment === "医修");
const crafterRefreshHints = shopDiagnostics.filter((entry) => entry.feedback_type === "need_hint" && entry.customer_segment === "匠师");
const hasShopHint = (entries, triggerNeedle, textNeedle) => entries.some((entry) => String(entry.trigger_condition || "").includes(triggerNeedle) && String(entry.bubble_text || "").includes(textNeedle));
const demoOrder = orders.find((entry) => entry.order_id === "order_demo_0001");
const canalDish = items.find((entry) => entry.item_id === "item_food_liangban_lingqin");
const canalDishRecipe = recipes.find((entry) => entry.recipe_id === "recipe_liangban_lingqin");
const canalDemoOrder = orders.find((entry) => entry.order_id === "order_demo_0002");
const firstBailuoboTangCondition = conditionGroups.find((entry) => entry.condition_group_id === "first_bailuobo_tang_crafted");
const firstLingqinDishCondition = conditionGroups.find((entry) => entry.condition_group_id === "first_lingqin_dish_crafted");
const xuboFavorReward = favorRewards.find((entry) => entry.npc_id === "npc_xubo" && entry.favor_level === "1");
const qingheFavorReward = favorRewards.find((entry) => entry.npc_id === "npc_qinghe" && entry.favor_level === "1");
const qingheFavorDialogue = dialogues.find((entry) => entry.dialogue_group_id === "dialogue_qinghe_favor_1");
const qingheFavorLine = localization.find((entry) => entry.text_key === "dialogue_qinghe_favor_1_001");
const qingheFishingNet = items.find((entry) => entry.item_id === "item_tool_fishing_net");
const qingheFavor1Condition = conditionGroups.find((entry) => entry.condition_group_id === "npc_qinghe_favor_1");
const qingheFavor3Reward = favorRewards.find((entry) => entry.npc_id === "npc_qinghe" && entry.favor_level === "3");
const qingheFavor3Dialogue = dialogues.find((entry) => entry.dialogue_group_id === "dialogue_qinghe_favor_3");
const qingheFavor3Line = localization.find((entry) => entry.text_key === "dialogue_qinghe_favor_3_001");
const qingheFavor3Condition = conditionGroups.find((entry) => entry.condition_group_id === "npc_qinghe_favor_3");
const fishpondBuilding = buildings.find((entry) => entry.building_id === "build_fishpond_lv1");
const spiritlingFish = items.find((entry) => entry.item_id === "item_fish_spiritling");
const plainRation = items.find((entry) => entry.item_id === "item_food_plain_ration");
const waterLotusSeedItem = items.find((entry) => entry.item_id === "seed_shuihang_lianshi");
const waterLotusCrop = crops.find((entry) => entry.crop_id === "crop_water_lotus_seed");
const waterwayHeluRecipe = recipes.find((entry) => entry.recipe_id === "recipe_helu_tangshui_shuihang");
const plainRationRecipe = recipes.find((entry) => entry.recipe_id === "recipe_plain_ration");
const tradeCloudBoxRecipe = recipes.find((entry) => entry.recipe_id === "recipe_trade_cloud_box");
const buildBeamRecipe = recipes.find((entry) => entry.recipe_id === "recipe_build_beam_hardwood");
const patrolRationRecipe = recipes.find((entry) => entry.recipe_id === "recipe_patrol_ration");
const signalFlareRecipe = recipes.find((entry) => entry.recipe_id === "recipe_signal_flare");
const teaStoryBlendRecipe = recipes.find((entry) => entry.recipe_id === "recipe_tea_story_blend");
const festivalMooncakeRecipe = recipes.find((entry) => entry.recipe_id === "recipe_festival_mooncake");
const archiveScrollRecipe = recipes.find((entry) => entry.recipe_id === "recipe_archive_scroll");
const ritualFireCoreRecipe = recipes.find((entry) => entry.recipe_id === "recipe_ritual_fire_core");
const festivalSummerMarket = conditionGroups.find((entry) => entry.condition_group_id === "festival_summer_market");
const festivalWinterRitual = conditionGroups.find((entry) => entry.condition_group_id === "festival_winter_ritual");
const chapter4RecipeUnlock = conditionGroups.find((entry) => entry.condition_group_id === "chapter_4");
const waterCropIntroRecipe = recipes.find((entry) => entry.recipe_id === "recipe_water_crop_intro");
const waterCropIntroDish = items.find((entry) => entry.item_id === "item_food_qingbo_yukuai");
const lingchiSanxianRecipe = recipes.find((entry) => entry.recipe_id === "recipe_lingchi_sanxian_geng");
const lingchiSanxianDish = items.find((entry) => entry.item_id === "item_food_lingchi_sanxian_geng");
const qingboSignatureCondition = conditionGroups.find((entry) => entry.condition_group_id === "qingbo_water_fresh_signature_line");
const lingchiRegularsCondition = conditionGroups.find((entry) => entry.condition_group_id === "lingchi_water_fresh_regulars");
const qingheWaterFreshReturnDoneCondition = conditionGroups.find((entry) => entry.condition_group_id === "qinghe_water_fresh_return_order_done");
const qingheWaterFreshReturnOrder = orders.find((entry) => entry.order_id === "order_qinghe_water_fresh_return_0001");
const qingheWaterFreshReturnOrderName = localization.find((entry) => entry.text_key === "order_name_qinghe_water_fresh_return_0001");
const qinghePondPayoffDialogue = dialogues.find((entry) => entry.dialogue_group_id === "dialogue_qinghe_quest_0205");
const qinghePondPayoffLine = localization.find((entry) => entry.text_key === "dialogue_qinghe_quest_0205_001");
const luoboBond = spiritBondLevels.find((entry) => entry.spirit_line_id === "spirit_line_luobo" && entry.bond_level === "1");
const luoboMood = spiritMoodParams.find((entry) => entry.scope_target === "spirit_line_luobo");
const luoboVoice = spiritVoices.find((entry) => entry.spirit_id === "spirit_luobo_01" && entry.voice_type === "work");
const luoboFirstEvent = spiritEvents.find((entry) => entry.spirit_event_id === "spirit_event_luobo_01");
const luoboFirstMemory = spiritMemoryFlags.find((entry) => entry.memory_flag_id === "memory_luobo_first_gift");
const farmMastery = spiritJobMastery.find((entry) => entry.job_type === "farm" && entry.level === "1");
const expeditionMastery = spiritJobMastery.find((entry) => entry.job_type === "expedition" && entry.level === "1");
const shortExpedition = spiritExpeditions.find((entry) => entry.expedition_id === "exp_short_market_001");
const shortExpeditionReward = rewardPools.find((entry) => entry.reward_pool_id === shortExpedition?.reward_pool_id);
const ecologyCombo = spiritEcologyCombos.find((entry) => entry.combo_id === "eco_cloud_warehouse");
const firstSpiritReward = earlyRewardPacing.find((entry) => entry.pace_id === "erp_004");
const shopPacing = earlyRewardPacing.find((entry) => entry.system_unlock === "shop_open");
const repairPacing = earlyRewardPacing.find((entry) => entry.pace_id === "erp_009");
const daySummaryPacing = earlyRewardPacing.find((entry) => entry.pace_id === "erp_010");
const p0Year2Goals = year2GoalBook.filter((entry) => entry.priority === "P0");
const dailyYear2Goal = year2GoalBook.find((entry) => entry.goal_id === "ygb_001");
const guyuTrial = year2SolarTrials.find((entry) => entry.trial_id === "trial_guyu_herb");
const dashuTrial = year2SolarTrials.find((entry) => entry.trial_id === "trial_dashu_fire");
const hualingEvent = rareSpiritEvents.find((entry) => entry.spirit_id === "spirit_hualing" && entry.event_stage === "first_meet");
const hualingEvolutionEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_002");
const hualingBondFinalEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_012");
const shuqiFirstMeetEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_009");
const shuqiEvolutionEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_013");
const shuqiBondFinalEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_014");
const fengmiEvolutionEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_015");
const fengmiBondFinalEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_016");
const leizhuEvolutionEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_011");
const leizhuBondFinalEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_004");
const yuelianEvent = rareSpiritEvents.find((entry) => entry.spirit_id === "spirit_yuelian" && entry.event_stage === "first_meet");
const yuelianEvolutionEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_017");
const yuelianBondFinalEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_006");
const dengyingEvolutionEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_008");
const dengyingBondFinalEvent = rareSpiritEvents.find((entry) => entry.entry_id === "rsea_018");
const hualingEvolutionDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_hualing_evolution");
const hualingEvolutionLine001 = localization.find((entry) => entry.text_key === "dialogue_hualing_evolution_001");
const hualingEvolutionLine002 = localization.find((entry) => entry.text_key === "dialogue_hualing_evolution_002");
const hualingEvolutionLine003 = localization.find((entry) => entry.text_key === "dialogue_hualing_evolution_003");
const hualingEvolutionLine004 = localization.find((entry) => entry.text_key === "dialogue_hualing_evolution_004");
const hualingBondFinalDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_hualing_bond_final");
const hualingBondFinalLine001 = localization.find((entry) => entry.text_key === "dialogue_hualing_bond_final_001");
const hualingBondFinalLine002 = localization.find((entry) => entry.text_key === "dialogue_hualing_bond_final_002");
const hualingBondFinalLine003 = localization.find((entry) => entry.text_key === "dialogue_hualing_bond_final_003");
const hualingBondFinalLine004 = localization.find((entry) => entry.text_key === "dialogue_hualing_bond_final_004");
const shuqiFirstMeetDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_shuqi_first_meet");
const shuqiFirstMeetLine001 = localization.find((entry) => entry.text_key === "dialogue_shuqi_first_meet_001");
const shuqiFirstMeetLine002 = localization.find((entry) => entry.text_key === "dialogue_shuqi_first_meet_002");
const shuqiFirstMeetLine003 = localization.find((entry) => entry.text_key === "dialogue_shuqi_first_meet_003");
const shuqiFirstMeetLine004 = localization.find((entry) => entry.text_key === "dialogue_shuqi_first_meet_004");
const shuqiEvolutionDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_shuqi_evolution");
const shuqiEvolutionLine001 = localization.find((entry) => entry.text_key === "dialogue_shuqi_evolution_001");
const shuqiEvolutionLine002 = localization.find((entry) => entry.text_key === "dialogue_shuqi_evolution_002");
const shuqiEvolutionLine003 = localization.find((entry) => entry.text_key === "dialogue_shuqi_evolution_003");
const shuqiEvolutionLine004 = localization.find((entry) => entry.text_key === "dialogue_shuqi_evolution_004");
const shuqiBondFinalDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_shuqi_bond_final");
const shuqiBondFinalLine001 = localization.find((entry) => entry.text_key === "dialogue_shuqi_bond_final_001");
const shuqiBondFinalLine002 = localization.find((entry) => entry.text_key === "dialogue_shuqi_bond_final_002");
const shuqiBondFinalLine003 = localization.find((entry) => entry.text_key === "dialogue_shuqi_bond_final_003");
const shuqiBondFinalLine004 = localization.find((entry) => entry.text_key === "dialogue_shuqi_bond_final_004");
const fengmiEvolutionDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_fengmi_evolution");
const fengmiEvolutionLine001 = localization.find((entry) => entry.text_key === "dialogue_fengmi_evolution_001");
const fengmiEvolutionLine002 = localization.find((entry) => entry.text_key === "dialogue_fengmi_evolution_002");
const fengmiEvolutionLine003 = localization.find((entry) => entry.text_key === "dialogue_fengmi_evolution_003");
const fengmiEvolutionLine004 = localization.find((entry) => entry.text_key === "dialogue_fengmi_evolution_004");
const fengmiBondFinalDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_fengmi_bond_final");
const fengmiBondFinalLine001 = localization.find((entry) => entry.text_key === "dialogue_fengmi_bond_final_001");
const fengmiBondFinalLine002 = localization.find((entry) => entry.text_key === "dialogue_fengmi_bond_final_002");
const fengmiBondFinalLine003 = localization.find((entry) => entry.text_key === "dialogue_fengmi_bond_final_003");
const fengmiBondFinalLine004 = localization.find((entry) => entry.text_key === "dialogue_fengmi_bond_final_004");
const leizhuEvolutionDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_leizhu_evolution");
const leizhuEvolutionLine001 = localization.find((entry) => entry.text_key === "dialogue_leizhu_evolution_001");
const leizhuEvolutionLine002 = localization.find((entry) => entry.text_key === "dialogue_leizhu_evolution_002");
const leizhuEvolutionLine003 = localization.find((entry) => entry.text_key === "dialogue_leizhu_evolution_003");
const leizhuEvolutionLine004 = localization.find((entry) => entry.text_key === "dialogue_leizhu_evolution_004");
const leizhuBondFinalDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_leizhu_bond_final");
const leizhuBondFinalLine001 = localization.find((entry) => entry.text_key === "dialogue_leizhu_bond_final_001");
const leizhuBondFinalLine002 = localization.find((entry) => entry.text_key === "dialogue_leizhu_bond_final_002");
const leizhuBondFinalLine003 = localization.find((entry) => entry.text_key === "dialogue_leizhu_bond_final_003");
const leizhuBondFinalLine004 = localization.find((entry) => entry.text_key === "dialogue_leizhu_bond_final_004");
const yuelianFirstMeetDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_yuelian_first_meet");
const yuelianFirstMeetLine001 = localization.find((entry) => entry.text_key === "dialogue_yuelian_first_meet_001");
const yuelianFirstMeetLine002 = localization.find((entry) => entry.text_key === "dialogue_yuelian_first_meet_002");
const yuelianFirstMeetLine003 = localization.find((entry) => entry.text_key === "dialogue_yuelian_first_meet_003");
const yuelianFirstMeetLine004 = localization.find((entry) => entry.text_key === "dialogue_yuelian_first_meet_004");
const yuelianEvolutionDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_yuelian_evolution");
const yuelianEvolutionLine001 = localization.find((entry) => entry.text_key === "dialogue_yuelian_evolution_001");
const yuelianEvolutionLine002 = localization.find((entry) => entry.text_key === "dialogue_yuelian_evolution_002");
const yuelianEvolutionLine003 = localization.find((entry) => entry.text_key === "dialogue_yuelian_evolution_003");
const yuelianEvolutionLine004 = localization.find((entry) => entry.text_key === "dialogue_yuelian_evolution_004");
const yuelianBondFinalDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_yuelian_bond_final");
const yuelianBondFinalLine001 = localization.find((entry) => entry.text_key === "dialogue_yuelian_bond_final_001");
const yuelianBondFinalLine002 = localization.find((entry) => entry.text_key === "dialogue_yuelian_bond_final_002");
const yuelianBondFinalLine003 = localization.find((entry) => entry.text_key === "dialogue_yuelian_bond_final_003");
const yuelianBondFinalLine004 = localization.find((entry) => entry.text_key === "dialogue_yuelian_bond_final_004");
const dengyingEvolutionDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_dengying_evolution");
const dengyingEvolutionLine001 = localization.find((entry) => entry.text_key === "dialogue_dengying_evolution_001");
const dengyingEvolutionLine002 = localization.find((entry) => entry.text_key === "dialogue_dengying_evolution_002");
const dengyingEvolutionLine003 = localization.find((entry) => entry.text_key === "dialogue_dengying_evolution_003");
const dengyingEvolutionLine004 = localization.find((entry) => entry.text_key === "dialogue_dengying_evolution_004");
const dengyingBondFinalDialogue = dialogues.filter((entry) => entry.dialogue_group_id === "dialogue_dengying_bond_final");
const dengyingBondFinalLine001 = localization.find((entry) => entry.text_key === "dialogue_dengying_bond_final_001");
const dengyingBondFinalLine002 = localization.find((entry) => entry.text_key === "dialogue_dengying_bond_final_002");
const dengyingBondFinalLine003 = localization.find((entry) => entry.text_key === "dialogue_dengying_bond_final_003");
const dengyingBondFinalLine004 = localization.find((entry) => entry.text_key === "dialogue_dengying_bond_final_004");
const rareCollectGoal = freeplayGoals.find((entry) => entry.goal_id === "goal_rare_spirit_collect");

if (!crop) throw new Error("Missing P0 crop: crop_lingqi_bailuobo");
if (!itemIds.has(crop.seed_item_id)) throw new Error("P0 crop seed item is missing");
if (!itemIds.has(crop.crop_id)) throw new Error("P0 crop item is missing");
if (!cabbageCrop || !itemIds.has(cabbageCrop.seed_item_id) || !itemIds.has(cabbageCrop.crop_id)) {
  throw new Error("Missing second demo crop: crop_qingya_baicai");
}
if (!canalCrop || canalCrop.element_type !== "water" || !canalSeed || Number(canalSeed.buy_price_base) <= 0 || !canalCropItem) {
  throw new Error("Missing first canal-restoration water crop chain: crop_luzhu_qin / seed_luzhu_qin");
}
if (!demoStorage || !demoMill || !demoWell) throw new Error("Missing demo building configs");
if (!millMachine || Number(millMachine.speed_base_multiplier) <= 0) throw new Error("Missing mill machine unlock config");
if (!spirit) throw new Error("Missing P0 spirit: spirit_luobo_01");
if (Number(spirit.work_range_x) < 3 || Number(spirit.work_range_y) < 3) {
  throw new Error("P0 spirit cannot cover 3x3 watering");
}
if (!recipe) throw new Error("Missing P0 recipe: item_food_bailuobo_tang");
if (!itemIds.has(recipe.output_item_id)) throw new Error("P0 recipe output item is missing");
if (!cabbageRecipe || !itemIds.has(cabbageRecipe.output_item_id)) {
  throw new Error("Missing second demo recipe: recipe_qingchao_baicai");
}
if (!canalDish || Number(canalDish.sell_price_base) <= Number(canalCropItem.sell_price_base || 0)) {
  throw new Error("Canal dish item must exist and outvalue raw luzhu qin");
}
if (!canalDishRecipe || canalDishRecipe.output_item_id !== "item_food_liangban_lingqin" || canalDishRecipe.unlock_type !== "repair" || !canalDishRecipe.input_item_ids.includes("crop_luzhu_qin")) {
  throw new Error("Missing first canal dish recipe: recipe_liangban_lingqin");
}
if (!hualingEvolutionEvent || !String(hualingEvolutionEvent.trigger_condition || "").includes("flower_shop_score>=1200") || !String(hualingEvolutionEvent.gift_reward || "").includes("花铃迎客架")) {
  throw new Error("Flower-bell evolution must remain tied to the flower shop showcase and reward the welcome shelf");
}
if (!hualingBondFinalEvent || !String(hualingBondFinalEvent.trigger_condition || "").includes("hualing_silent_market_ready") || !String(hualingBondFinalEvent.gift_reward || "").includes("无声花市幡")) {
  throw new Error("Flower-bell bond finale must require the silent market showcase and reward the market banner");
}
if (!shuqiFirstMeetEvent || !String(shuqiFirstMeetEvent.trigger_condition || "").includes("completed_order_count>=5") || !String(shuqiFirstMeetEvent.gift_reward || "").includes("账页书签")) {
  throw new Error("Ledger-sprite first meet must require five completed orders and reward the bookmark");
}
if (!shuqiEvolutionEvent || !String(shuqiEvolutionEvent.trigger_condition || "").includes("shuqi_stock_review_ready") || !String(shuqiEvolutionEvent.gift_reward || "").includes("账房缺货签")) {
  throw new Error("Ledger-sprite evolution must require the stock-review helper and reward the shortage slips");
}
if (!shuqiBondFinalEvent || !String(shuqiBondFinalEvent.trigger_condition || "").includes("shuqi_legacy_ledger_ready") || !String(shuqiBondFinalEvent.gift_reward || "").includes("洞天旧账新编")) {
  throw new Error("Ledger-sprite bond finale must require the legacy-ledger helper and reward the rebuilt archive");
}
if (!fengmiEvolutionEvent || !String(fengmiEvolutionEvent.trigger_condition || "").includes("fengmi_dessert_chain_ready") || !String(fengmiEvolutionEvent.gift_reward || "").includes("花蜜调匙")) {
  throw new Error("Honey-sprite evolution must require the dessert-chain helper and reward the honey spoon");
}
if (!fengmiBondFinalEvent || !String(fengmiBondFinalEvent.trigger_condition || "").includes("fengmi_honey_feast_ready") || !String(fengmiBondFinalEvent.gift_reward || "").includes("百花蜜罐")) {
  throw new Error("Honey-sprite bond finale must require the honey-feast helper and reward the honey jar");
}
if (!leizhuEvolutionEvent || !String(leizhuEvolutionEvent.trigger_condition || "").includes("protected_midrisk_trade>=1") || !String(leizhuEvolutionEvent.gift_reward || "").includes("护货竹绳")) {
  throw new Error("Thunder-bamboo evolution must require a protected mid-risk trade and reward the cargo rope");
}
if (!leizhuBondFinalEvent || !String(leizhuBondFinalEvent.trigger_condition || "").includes("leizhu_bond>=10") || !String(leizhuBondFinalEvent.gift_reward || "").includes("雷竹路标")) {
  throw new Error("Thunder-bamboo bond finale must require bond level 10 and reward the route marker");
}
if (!yuelianEvent || !String(yuelianEvent.trigger_condition || "").includes("night_water_crop_care>=3") || !String(yuelianEvent.scene_summary || "").includes("发光莲花") || String(yuelianEvent.related_system || "") !== "mood") {
  throw new Error("Moon-lotus rare spirit first meet must come from three nights of water-crop care and reward a mood-line reveal");
}
if (!yuelianEvolutionEvent || !String(yuelianEvolutionEvent.trigger_condition || "").includes("yuelian_rest_respite_ready==true") || !String(yuelianEvolutionEvent.scene_summary || "").includes("精怪疲劳") || !String(yuelianEvolutionEvent.gift_reward || "").includes("凝露莲席") || String(yuelianEvolutionEvent.related_system || "") !== "mood") {
  throw new Error("Moon-lotus evolution must require remembered rest respite, center fatigued-spirit care, and reward the dew-lotus rest mat");
}
if (!yuelianBondFinalEvent || !String(yuelianBondFinalEvent.trigger_condition || "").includes("yuelian_bond>=10") || !String(yuelianBondFinalEvent.gift_reward || "").includes("月莲静池")) {
  throw new Error("Moon-lotus bond finale must require bond level 10 and reward the moon-pond landscape");
}
if (!dengyingEvolutionEvent || !String(dengyingEvolutionEvent.trigger_condition || "").includes("hidden_light_puzzle_clear>=1") || !String(dengyingEvolutionEvent.gift_reward || "").includes("灯影长明盏")) {
  throw new Error("Lamp-shadow evolution must require the hidden-light puzzle and reward the lasting lantern");
}
if (!dengyingBondFinalEvent || !String(dengyingBondFinalEvent.trigger_condition || "").includes("dengying_winter_lantern_ready==true") || !String(dengyingBondFinalEvent.gift_reward || "").includes("灯影长明盏")) {
  throw new Error("Lamp-shadow bond finale must require the winter lantern route gate and reward the lasting lantern");
}
if (!game.includes("dialogue_hualing_evolution") || !game.includes("rsea_002") || !game.includes("hualingThemeShowcaseReady") || !game.includes("hualingGuestCharmActive") || !game.includes("customer_stay_bonus") || !game.includes("flower_honey")) {
  throw new Error("Flower-bell evolution runtime must queue its dedicated dialogue, validate flower-theme shop showcases, and light the guest-yard feedback");
}
if (!game.includes("dialogue_hualing_bond_final") || !game.includes("rsea_012") || !game.includes("hualingSilentMarketReady") || !game.includes("hualingSilentMarketActive") || !game.includes("season_shop_001") || !game.includes("mainCustomer")) {
  throw new Error("Flower-bell bond finale runtime must queue its dedicated dialogue and tie the silent market to spring rankings, customer mix, and theme history");
}
if (!game.includes("dialogue_shuqi_first_meet") || !game.includes("rsea_009") || !game.includes("shuqiLedgerInsightActive") || !game.includes("completed_order_count") || !game.includes("year2OrderPreview") || !game.includes("书契账页批注")) {
  throw new Error("Ledger-sprite runtime must queue its dedicated dialogue, respect the five-order trigger, and surface bookkeeping insights in the shop flow");
}
if (!game.includes('recipe.unlock_type === "default"') || !game.includes('recipe.unlock_type === "festival"') || !game.includes('recipe.unlock_type === "chapter"') || !game.includes('recipe.unlock_type === "completed"') || !game.includes("conditionMet(recipe.unlock_param)") || !game.includes("maybeGrantWaterLotusSeeds") || !game.includes("year2_water_lotus_seed_unlocked")) {
  throw new Error("Recipe runtime must support default, completed, festival, and chapter unlocks, and it must surface the year-two water-lotus seed payoff");
}
if (!game.includes("dialogue_shuqi_evolution") || !game.includes("rsea_013") || !game.includes("shuqiStockReviewReady") || !game.includes("shuqiStockWarningActive") || !game.includes("stock_warning") || !game.includes("low_stock_items") || !game.includes("书契缺货签")) {
  throw new Error("Ledger-sprite evolution runtime must queue its dedicated dialogue, validate the stock review gate, and surface low-stock warnings in the shop flow");
}
if (!game.includes("dialogue_shuqi_bond_final") || !game.includes("rsea_014") || !game.includes("shuqiLegacyLedgerReady") || !game.includes("shuqiLegacyLedgerActive") || !game.includes("season_score_bonus") || !game.includes("洞天旧账新编") || !game.includes("data-shuqi-ledger-page")) {
  throw new Error("Ledger-sprite bond finale runtime must queue its dedicated dialogue, validate the legacy-ledger gate, and surface manual season-score memory pages");
}
if (!game.includes("dialogue_fengmi_evolution") || !game.includes("rsea_015") || !game.includes("fengmiDessertChainReady") || !game.includes("fengmiDessertQualityActive") || !game.includes("dessert_quality") || !game.includes("花蜜调和")) {
  throw new Error("Honey-sprite evolution runtime must queue its dedicated dialogue, validate the dessert-chain gate, and surface honey-blended dessert payoffs");
}
if (!game.includes("dialogue_fengmi_bond_final") || !game.includes("rsea_016") || !game.includes("fengmiHoneyFeastReady") || !game.includes("fengmiHoneyFeastActive") || !game.includes("customer_satisfaction") || !game.includes("data-fengmi-honey-feast") || !game.includes("百花茶会")) {
  throw new Error("Honey-sprite bond finale runtime must queue its dedicated dialogue, validate the tea-feast gate, and surface the manual dessert-customer tea party");
}
if (!game.includes("dialogue_leizhu_evolution") || !game.includes("rsea_011") || !game.includes("stormEscortActive") || !game.includes("protected_midrisk_trade")) {
  throw new Error("Thunder-bamboo evolution runtime must queue its dedicated dialogue and remember protected mid-risk trades");
}
if (!game.includes("dialogue_leizhu_bond_final") || !game.includes("rsea_004") || !game.includes("thunderOldRouteReady") || !game.includes("thunderOldRouteUnlocked") || !game.includes("thunder_old_route_open") || !game.includes("route_thunder_old_06")) {
  throw new Error("Thunder-bamboo bond finale runtime must queue its dedicated dialogue and unlock the hidden thunder route");
}
if (hualingEvolutionDialogue.length !== 4 || !hualingEvolutionDialogue.some((entry) => entry.speaker_id === "player") || !hualingEvolutionDialogue.some((entry) => entry.speaker_id === "spirit_hualing_02")) {
  throw new Error("Flower-bell evolution must ship a four-line player and second-form spirit dialogue exchange");
}
if (!hualingEvolutionLine001?.zh_cn.includes("不一样") || !hualingEvolutionLine002?.zh_cn.includes("脚步") || !hualingEvolutionLine003?.zh_cn.includes("花香") || !hualingEvolutionLine004?.zh_cn.includes("礼品客")) {
  throw new Error("Flower-bell evolution localization must explain tailoring greetings to footsteps, scents, and guest types");
}
if (hualingBondFinalDialogue.length !== 4 || !hualingBondFinalDialogue.some((entry) => entry.speaker_id === "player") || !hualingBondFinalDialogue.some((entry) => entry.speaker_id === "spirit_hualing_03")) {
  throw new Error("Flower-bell bond finale must ship a four-line player and third-form spirit dialogue exchange");
}
if (!hualingBondFinalLine001?.zh_cn.includes("无声花市") || !hualingBondFinalLine002?.zh_cn.includes("春市") || !hualingBondFinalLine002?.zh_cn.includes("熟客") || !hualingBondFinalLine003?.zh_cn.includes("不必吆喝") || !hualingBondFinalLine004?.zh_cn.includes("鲜货") || !hualingBondFinalLine004?.zh_cn.includes("礼盒")) {
  throw new Error("Flower-bell bond finale localization must explain the silent market, spring guests, and stronger fresh-and-gift draw");
}
if (shuqiFirstMeetDialogue.length !== 4 || !shuqiFirstMeetDialogue.some((entry) => entry.speaker_id === "player") || !shuqiFirstMeetDialogue.some((entry) => entry.speaker_id === "spirit_shuqi_01")) {
  throw new Error("Ledger-sprite first meet must ship a four-line player and first-form spirit dialogue exchange");
}
if (!shuqiFirstMeetLine001?.zh_cn.includes("十七枚铜钱") || !shuqiFirstMeetLine002?.zh_cn.includes("货架摆散") || !shuqiFirstMeetLine003?.zh_cn.includes("挑毛病") || !shuqiFirstMeetLine004?.zh_cn.includes("每页账本")) {
  throw new Error("Ledger-sprite first meet localization must explain the missed margin, shelf issue, and bookkeeping payoff");
}
if (shuqiEvolutionDialogue.length !== 4 || !shuqiEvolutionDialogue.some((entry) => entry.speaker_id === "player") || !shuqiEvolutionDialogue.some((entry) => entry.speaker_id === "spirit_shuqi_02")) {
  throw new Error("Ledger-sprite evolution must ship a four-line player and second-form spirit dialogue exchange");
}
if (!shuqiEvolutionLine001?.zh_cn.includes("经营头脑") || !shuqiEvolutionLine002?.zh_cn.includes("缺货") || !shuqiEvolutionLine003?.zh_cn.includes("客人") || !shuqiEvolutionLine004?.zh_cn.includes("最后一件")) {
  throw new Error("Ledger-sprite evolution localization must explain shelf rework, low-stock warnings, and the stronger business payoff");
}
if (shuqiBondFinalDialogue.length !== 4 || !shuqiBondFinalDialogue.some((entry) => entry.speaker_id === "player") || !shuqiBondFinalDialogue.some((entry) => entry.speaker_id === "spirit_shuqi_03")) {
  throw new Error("Ledger-sprite bond finale must ship a four-line player and third-form spirit dialogue exchange");
}
if (!shuqiBondFinalLine001?.zh_cn.includes("招牌") || !shuqiBondFinalLine002?.zh_cn.includes("洞天旧账新编") || !shuqiBondFinalLine003?.zh_cn.includes("名铺") || !shuqiBondFinalLine004?.zh_cn.includes("万簿司命")) {
  throw new Error("Ledger-sprite bond finale localization must explain the rebuilt ledger, memory pages, and season-settlement payoff");
}
if (fengmiEvolutionDialogue.length !== 4 || !fengmiEvolutionDialogue.some((entry) => entry.speaker_id === "player") || !fengmiEvolutionDialogue.some((entry) => entry.speaker_id === "spirit_fengmi_02")) {
  throw new Error("Honey-sprite evolution must ship a four-line player and second-form spirit dialogue exchange");
}
if (!fengmiEvolutionLine001?.zh_cn.includes("两罐花蜜") || !fengmiEvolutionLine002?.zh_cn.includes("春花的甜") || !fengmiEvolutionLine003?.zh_cn.includes("甜品") || !fengmiEvolutionLine004?.zh_cn.includes("回头")) {
  throw new Error("Honey-sprite evolution localization must explain flower-honey blending, dessert tuning, and the repeat-customer payoff");
}
if (fengmiBondFinalDialogue.length !== 4 || !fengmiBondFinalDialogue.some((entry) => entry.speaker_id === "player") || !fengmiBondFinalDialogue.some((entry) => entry.speaker_id === "spirit_fengmi_03")) {
  throw new Error("Honey-sprite bond finale must ship a four-line player and third-form spirit dialogue exchange");
}
if (!fengmiBondFinalLine001?.zh_cn.includes("蜜罐") || !fengmiBondFinalLine002?.zh_cn.includes("记住怎么回来") || !fengmiBondFinalLine003?.zh_cn.includes("香气") || !fengmiBondFinalLine004?.zh_cn.includes("百花茶会")) {
  throw new Error("Honey-sprite bond finale localization must explain the honey jars, return-customer atmosphere, and the blossom tea party payoff");
}
if (leizhuEvolutionDialogue.length !== 4 || !leizhuEvolutionDialogue.some((entry) => entry.speaker_id === "player") || !leizhuEvolutionDialogue.some((entry) => entry.speaker_id === "spirit_leizhu_02")) {
  throw new Error("Thunder-bamboo evolution must ship a four-line player and second-form spirit dialogue exchange");
}
if (!leizhuEvolutionLine001?.zh_cn.includes("货角") || !leizhuEvolutionLine002?.zh_cn.includes("先护货") || !leizhuEvolutionLine002?.zh_cn.includes("少赚一点") || !leizhuEvolutionLine003?.zh_cn.includes("平安回来") || !leizhuEvolutionLine004?.zh_cn.includes("补给带齐")) {
  throw new Error("Thunder-bamboo evolution localization must explain protecting cargo first, accepting lower profit, and stabilizing the route");
}
if (!game.includes("dialogue_yuelian_first_meet") || !game.includes("dialogue_yuelian_evolution") || !game.includes("dialogue_yuelian_bond_final") || !game.includes("rsea_005") || !game.includes("rsea_017") || !game.includes("rsea_006")) {
  throw new Error("Moon-lotus rare spirit runtime must special-case first meet, evolution, and bond finale dialogues");
}
if (!game.includes("yuelianRestRespiteReady") || !game.includes("yuelianRestRespiteActive") || !game.includes("recordYuelianRestRespite") || !game.includes("restRespiteNights") || !game.includes("hunger_reduce") || !game.includes("garden_spirits") || !game.includes("凝露莲席")) {
  throw new Error("Moon-lotus evolution runtime must remember rest respite nights and apply the garden-spirit hunger reduction skill");
}
if (!game.includes("moonPondComboActive") || !game.includes("upgradeRareSpiritToConfig") || !game.includes("bondLevelFor(spirit, spirit.bondExp)")) {
  throw new Error("Moon-lotus follow-up runtime must upgrade rare spirits, use per-line bond thresholds, and expose moon-pond combo activation");
}
if (!game.includes("dialogue_dengying_evolution") || !game.includes("rsea_008") || !game.includes("nightLampComboActive") || !game.includes("upsertWorldChange")) {
  throw new Error("Lamp-shadow evolution runtime must queue its dedicated dialogue, activate night-lamp ecology, and light a world change");
}
if (!game.includes("dialogue_dengying_bond_final") || !game.includes("rsea_018") || !game.includes("dengyingWinterLanternReady") || !game.includes("dengyingFestivalWarmthActive") || !game.includes("dengyingHiddenRevealSkill") || !game.includes("data-dengying-hidden-reveal") || !game.includes("hidden_reveal") || !game.includes("night_hidden_entry") || !game.includes("festival_customer_up") || !game.includes("season_shop_005")) {
  throw new Error("Lamp-shadow bond finale runtime must queue its dedicated dialogue, validate the winter lantern gate, and surface both the winter-shop and hidden-entry payoffs");
}
if (leizhuBondFinalDialogue.length !== 4 || !leizhuBondFinalDialogue.some((entry) => entry.speaker_id === "player") || !leizhuBondFinalDialogue.some((entry) => entry.speaker_id === "spirit_leizhu_03")) {
  throw new Error("Thunder-bamboo bond finale must ship a four-line player and third-form spirit dialogue exchange");
}
if (!leizhuBondFinalLine001?.zh_cn.includes("雷会落在哪里") || !leizhuBondFinalLine002?.zh_cn.includes("旧木桩") || !leizhuBondFinalLine002?.zh_cn.includes("货不会翻") || !leizhuBondFinalLine003?.zh_cn.includes("平安回来") || !leizhuBondFinalLine004?.zh_cn.includes("归我们领")) {
  throw new Error("Thunder-bamboo bond finale localization must explain the lightning path, old stakes, safe return, and route claim");
}
if (yuelianFirstMeetDialogue.length !== 4 || !yuelianFirstMeetDialogue.some((entry) => entry.speaker_id === "player") || !yuelianFirstMeetDialogue.some((entry) => entry.speaker_id === "spirit_yuelian_01")) {
  throw new Error("Moon-lotus first meet must ship a four-line player and spirit dialogue exchange");
}
if (!yuelianFirstMeetLine001?.zh_cn.includes("没有月亮") || !yuelianFirstMeetLine002?.zh_cn.includes("三夜") || !yuelianFirstMeetLine003?.zh_cn.includes("月露") || !yuelianFirstMeetLine004?.zh_cn.includes("平水")) {
  throw new Error("Moon-lotus first meet localization must explain the moonless glow, three-night care, dew gift, and steady-water promise");
}
if (yuelianEvolutionDialogue.length !== 4 || !yuelianEvolutionDialogue.some((entry) => entry.speaker_id === "player") || !yuelianEvolutionDialogue.some((entry) => entry.speaker_id === "spirit_yuelian_02")) {
  throw new Error("Moon-lotus evolution must ship a four-line player and second-form spirit dialogue exchange");
}
if (!yuelianEvolutionLine001?.zh_cn.includes("休息") || !yuelianEvolutionLine002?.zh_cn.includes("留白") || !yuelianEvolutionLine003?.zh_cn.includes("逼得太累") || !yuelianEvolutionLine004?.zh_cn.includes("少饿一点") || !yuelianEvolutionLine004?.zh_cn.includes("温柔")) {
  throw new Error("Moon-lotus evolution localization must explain rest, blank space, not overworking partners, and the dew-rest payoff");
}
if (yuelianBondFinalDialogue.length !== 4 || !yuelianBondFinalDialogue.some((entry) => entry.speaker_id === "player") || !yuelianBondFinalDialogue.some((entry) => entry.speaker_id === "spirit_yuelian_03")) {
  throw new Error("Moon-lotus bond finale must ship a four-line player and third-form spirit dialogue exchange");
}
if (!yuelianBondFinalLine001?.zh_cn.includes("没有月亮") || !yuelianBondFinalLine002?.zh_cn.includes("无月之月") || !yuelianBondFinalLine003?.zh_cn.includes("夜路") || !yuelianBondFinalLine004?.zh_cn.includes("留住夜色")) {
  throw new Error("Moon-lotus bond finale localization must explain the moonless reflection, the memory of water, and the settled night-pool promise");
}
if (dengyingEvolutionDialogue.length !== 4 || !dengyingEvolutionDialogue.some((entry) => entry.speaker_id === "player") || !dengyingEvolutionDialogue.some((entry) => entry.speaker_id === "spirit_dengying_02")) {
  throw new Error("Lamp-shadow evolution must ship a four-line player and second-form spirit dialogue exchange");
}
if (!dengyingEvolutionLine001?.zh_cn.includes("灯座") || !dengyingEvolutionLine002?.zh_cn.includes("黑一点") || !dengyingEvolutionLine003?.zh_cn.includes("点起来") || !dengyingEvolutionLine004?.zh_cn.includes("先看见")) {
  throw new Error("Lamp-shadow evolution localization must explain leaving the lamp seat, entering darker ground, lighting the route, and seeing danger first");
}
if (dengyingBondFinalDialogue.length !== 4 || !dengyingBondFinalDialogue.some((entry) => entry.speaker_id === "player") || !dengyingBondFinalDialogue.some((entry) => entry.speaker_id === "spirit_dengying_03")) {
  throw new Error("Lamp-shadow bond finale must ship a four-line player and third-form spirit dialogue exchange");
}
if (!dengyingBondFinalLine001?.zh_cn.includes("冬至") || !dengyingBondFinalLine001?.zh_cn.includes("长灯路") || !dengyingBondFinalLine002?.zh_cn.includes("黑里") || !dengyingBondFinalLine003?.zh_cn.includes("隐藏入口") || !dengyingBondFinalLine004?.zh_cn.includes("夜里") || !dengyingBondFinalLine004?.zh_cn.includes("认回")) {
  throw new Error("Lamp-shadow bond finale localization must explain the winter lantern route, not leaving anyone in the dark, and revealing the hidden entry homeward");
}
if (!villager) throw new Error("Missing P0 customer: customer_villager");
if (!villagerSegment || !villagerSegment.preferred_tags_extra || Number(villagerSegment.visit_rate) <= 1) {
  throw new Error("Villager spring customer segment must tune preferred tags and visit rate");
}
if (Number(villagerSegment.reputation_min || 0) !== 0 || Number(villagerSegment.fame_min || 0) !== 0) {
  throw new Error("Villager spring segment must be available in the opening shop loop");
}
if (!villagerBehavior || Number(villagerBehavior.price_tolerance) <= 0 || Number(villagerBehavior.stock_sensitivity) <= 0) {
  throw new Error("Villager evaluate_price behavior must define price tolerance and stock sensitivity");
}
if (villagerFlow.length < 4 || villagerFlowHints.length < 4) {
  throw new Error("Villager customer state flow must have localized enter/browse/price/queue hints");
}
if (!villagerProfile || Number(villagerProfile.base_budget) <= 0 || !villagerProfile.preferred_tags.includes("fresh_food")) {
  throw new Error("Villager customer profile must define budget and preferred tags");
}
if (!villagerBark || !villagerBarkText?.zh_cn) {
  throw new Error("Villager shop-buy bark must resolve through localization text");
}
if (!waterwayCustomer || !String(waterwayCustomer.preferred_tags || "").includes("water_food") || !String(waterwayCustomer.preferred_tags || "").includes("route_rare")) {
  throw new Error("Lianze waterway customer must exist and prefer water-fresh route goods");
}
if (!waterwayProfile || waterwayProfile.unlock_condition_group !== "qinghe_lotus_basin_followup_order_done" || !String(waterwayProfile.preferred_tags || "").includes("drink")) {
  throw new Error("Lianze waterway customer profile must unlock from the completed follow-up order and prefer drinks");
}
if (!waterwaySegment || Number(waterwaySegment.visit_rate || 0) <= 1 || Number(waterwaySegment.budget_rate || 0) <= 1 || !String(waterwaySegment.preferred_tags_extra || "").includes("water_food")) {
  throw new Error("Lianze waterway customer segment must raise visit and budget rates for water-fresh goods");
}
if (!waterwayBehavior || Number(waterwayBehavior.price_tolerance || 0) <= 0.5 || Number(waterwayBehavior.quality_tolerance || 0) <= 0.7) {
  throw new Error("Lianze waterway customer behavior must tolerate familiar-route value and quality checks");
}
if (waterwayFlow.length < 3 || waterwayFlowHints.length < 3 || !waterwayFlowHints.some((entry) => String(entry.zh_cn || "").includes("熟路"))) {
  throw new Error("Lianze waterway customer state flow must have localized familiar-route hints");
}
if (!waterwayBark || waterwayBark.condition_group !== "qinghe_lotus_basin_followup_order_done" || !waterwayBarkText?.zh_cn.includes("熟路味")) {
  throw new Error("Lianze waterway shop-buy bark must unlock from the follow-up order and resolve through localization");
}
if (!waterwayNeedHint || !String(waterwayNeedHint.bubble_text || "").includes("莲泽熟路") || !waterwayPurchaseReason?.result_text.includes("回单味")) {
  throw new Error("Lianze waterway shop diagnosis must explain water-fresh demand and purchase reasons");
}
if (!game.includes("customerProfile(customer).unlock_condition_group") || !game.includes("conditionMet(unlockCondition)")) {
  throw new Error("Shop customer pool must respect customer profile unlock conditions");
}
if (!xubo) throw new Error("Missing demo NPC: npc_xubo");
if (!xuboSchedule || Number(xuboSchedule.time_start) <= 0) {
  throw new Error("NPC schedule must place Xubo in town with a valid time range");
}
if (!baizhiCohab || !baizhiWeekly || !baizhiFestival || !baizhiCohabDialogue) {
  throw new Error("Cohabitation data must connect Baizhi epilogue, weekly, festival, and dialogue rows");
}
if (bossIntroShots.length < 5 || !bossIntroShots.some((entry) => entry.audio_key === "audio_boss_mingmu_reveal")) {
  throw new Error("Boss intro cutscene must have a multi-shot timeline with reveal audio");
}
if (finalArrayAssets.length < 2 || !finalArrayAssets.some((entry) => entry.audio_key === "audio_array_incantation")) {
  throw new Error("Final array cutscene assets must include model/vfx rows and audio keys");
}
if (sideBridgeBeats.length < 2 || !sideBridgeBeats.every((entry) => entry.skip_allowed === "true")) {
  throw new Error("Side quest bridge cutscene beats must be skippable and multi-beat");
}
if (!bossRevealAudio || bossRevealAudio.trigger_ref !== "cutscene_boss_mingmu_intro") {
  throw new Error("Boss reveal audio asset must connect to the boss intro cutscene");
}
if (spiritEvolutionSceneEvents.length < 6) {
  throw new Error("Normal spirit evolution events must define replayable scene rewards");
}
if (spiritEvolutionShots.some((entry) => entry.shots.length < 3 || !entry.shots.some((shot) => shot.subtitle_key && shot.subtitle_key.startsWith("spirit_event_")))) {
  throw new Error("Normal spirit evolution cutscenes must have at least 3 shots and a localized spirit subtitle");
}
if (spiritEvolutionShots.some((entry) => entry.assets.length < 1)) {
  throw new Error("Normal spirit evolution cutscenes must reserve asset manifest rows");
}
if (!masterBus || masterBus.default_volume !== "1.00" || !masterBus.qa_check_key) {
  throw new Error("Audio mix bus table must define a master bus with QA key");
}
if (!bgmBus || bgmBus.ducking_rule !== "duck_on_dialogue" || bgmBus.sidechain_target !== "bus_dialogue") {
  throw new Error("Audio mix bus table must define BGM ducking against dialogue");
}
if (!dialogueBus || !dialogueBus.sidechain_target.includes("bus_bgm")) {
  throw new Error("Audio mix bus table must define dialogue priority sidechain targets");
}
for (const asset of audioAssets) {
  if (!audioMixBuses.find((bus) => bus.bus_id === asset.bus_id)) {
    throw new Error(`Audio asset references missing mix bus: ${asset.audio_id} -> ${asset.bus_id}`);
  }
}
if (!xuboFinalSupport || xuboFinalSupport.require_condition_group !== "npc_xubo_favor_5" || !xuboFinalSupport.unlock_flag) {
  throw new Error("Final support bundle must include Xubo's Lv.5 support unlock flag");
}
if (!fullFinalSupport || fullFinalSupport.require_condition_group !== "quest_main_0403_active" || fullFinalSupport.support_type !== "team_resonance") {
  throw new Error("Final support bundle must include the quest-gated full team resonance");
}
if (xuboSupportStages.length < 2 || !xuboSupportStages.some((entry) => entry.cutscene_id === "cutscene_final_banquet")) {
  throw new Error("Xubo final support must include prep and ending stages with finale cutscenes");
}
if (battleSupportStages.length < 4 || !battleSupportStages.every((entry) => entry.cutscene_id === "cutscene_boss_mingmu_intro")) {
  throw new Error("Final battle support stages must connect to the Mingmu boss intro cutscene");
}
for (const stage of finalSupportStages) {
  if (!finalSupportBundles.find((entry) => entry.bundle_id === stage.bundle_id)) {
    throw new Error(`Final support stage references missing bundle: ${stage.bundle_id}`);
  }
  if (!cutsceneTimeline.find((entry) => entry.cutscene_id === stage.cutscene_id)) {
    throw new Error(`Final support stage references missing cutscene: ${stage.cutscene_id}`);
  }
}
if (shopOpening.length === 0) throw new Error("Missing demo dialogue group: dialogue_shop_opening");
if (!mainQuest0001 || mainQuestSteps0001.length < 3) {
  throw new Error("Main quest 0001 must have data-driven base and step rows");
}
if (!mainQuestSteps0001.some((step) => step.objective_type === "plant" && step.target_id === "seed_lingqi_bailuobo")) {
  throw new Error("Main quest 0001 must include the opening planting objective");
}
if (mainQuest0001Rewards.length < 2 || !mainQuest0001Rewards.some((entry) => entry.reward_type === "item" && entry.reward_param === "item_gold_generic")) {
  throw new Error("Main quest 0001 must reward starter items and gold through reward_pool.csv");
}
if (!mainQuest0101 || !mainQuest0101Rewards.some((entry) => entry.reward_type === "building" && entry.reward_param === "build_lingjing_001")) {
  throw new Error("Main quest 0101 must unlock Lingjing building through quest reward runtime");
}
if (!mainQuest0102 || !mainQuestSteps0102.some((step) => step.objective_type === "craft" && step.target_id === "item_tool_copper_hoe")) {
  throw new Error("Main quest 0102 must include the copper hoe crafting objective");
}
if (!copperHoeRecipe || copperHoeRecipe.output_item_id !== "item_tool_copper_hoe" || copperHoeRecipe.machine_type !== "furnace") {
  throw new Error("Copper hoe recipe must exist and output the chapter-one tool through the furnace");
}
if (copperHoeRecipe.unlock_type !== "chapter" || copperHoeRecipe.unlock_param !== "quest_main_0102_step_1_done") {
  throw new Error("Copper hoe recipe must unlock from the Jingzhe pest step and must not be self-locked behind quest completion");
}
if (!game.includes("function storyRecipeForTarget") || !game.includes('item_tool_copper_hoe: "recipe_tool_copper_set"')) {
  throw new Error("Story compass must route the copper hoe objective to its crafting recipe");
}
if (!mainQuest0103 || !mainQuestSteps0103.some((step) => step.objective_type === "collect" && step.target_id === "item_ore_iron_raw") || !mainQuestSteps0103.some((step) => step.objective_type === "build" && step.target_id === "build_broken_bridge_repair")) {
  throw new Error("Main quest 0103 must collect early raw iron and build the broken bridge repair");
}
if (!bridgeRepairBuilding || Number(bridgeRepairBuilding.cost_wood || 0) < 50 || Number(bridgeRepairBuilding.cost_metal || 0) < 10 || bridgeRepairBuilding.unlock_param !== "quest_main_0103_duanqiao_jiumu") {
  throw new Error("Broken bridge repair must remain a chapter-one quest building with wood and metal costs");
}
if (!mainQuest0103Rewards.some((entry) => entry.reward_type === "item" && entry.reward_param === "item_special_lingmai_shuishi_1")) {
  throw new Error("Main quest 0103 must reward the first Lingmai pivot stone");
}
if (!game.includes("completeCanalRepairFromBridge") || !game.includes('grantMainQuestReward("quest_main_0103_duanqiao_jiumu")')) {
  throw new Error("Broken bridge repair must grant quest reward and reuse the canal restoration runtime");
}
if (!mainQuest0201 || mainQuest0201.chapter !== "2" || mainQuestSteps0201.length < 3) {
  throw new Error("Main quest 0201 must exist as a chapter-two shop-opening quest with data-driven steps");
}
if (!oldShopBuilding || oldShopBuilding.unlock_type !== "completed" || oldShopBuilding.unlock_param !== "chapter_1_bridge_repaired") {
  throw new Error("Old shop lv1 must unlock after the chapter-one bridge repair, not behind its own shop-opening quest");
}
if (!mainQuestSteps0201.some((step) => step.objective_type === "build" && step.target_id === "build_shop_lv1")
  || !mainQuestSteps0201.some((step) => step.objective_type === "sell" && step.target_id === "item_shop_category_3" && step.target_count === "3")
  || !mainQuestSteps0201.some((step) => step.objective_type === "sell" && step.target_id === "item_shop_sales_total" && step.target_count === "800")) {
  throw new Error("Main quest 0201 must build the old shop, then require real category sales and total shop revenue");
}
if (mainQuest0201Rewards.some((entry) => entry.reward_type === "building" && entry.reward_param === "build_shop_lv1")
  || !mainQuest0201Rewards.some((entry) => entry.reward_type === "recipe" && entry.reward_param === "recipe_liuyun_niang")) {
  throw new Error("Main quest 0201 reward must be a follow-up recipe and must not re-award the already-built shop");
}
if (!eventMain0202 || eventMain0202.trigger_type !== "on_shop_sales_reach" || eventMain0202.trigger_param !== "sales_category_3" || eventMain0202.execute_group !== "exec_shop_tutorial_complete") {
  throw new Error("Shop tutorial completion event must trigger from real three-item shop sales");
}
if (!eventMain0203 || eventMain0203.trigger_type !== "on_shop_sales_reach" || eventMain0203.trigger_param !== "sales_total_800" || eventMain0203.condition_group !== "quest_main_0201_step_2_done" || eventMain0203.execute_group !== "exec_spawn_hu_sihai") {
  throw new Error("Hu Sihai arrival event must trigger from real 800 total shop sales after the shop tutorial step");
}
if (!mainQuest0201Step2Condition || !String(mainQuest0201Step2Condition.expression || "").includes("quest_step_done(step_main_0201_02)")) {
  throw new Error("Hu Sihai gate must depend on the real completion of quest step 0201-02");
}
if (!game.includes('if (building.unlock_type === "completed") return state.completed.has(building.unlock_param);')
  || !game.includes('target === "item_shop_category_3"')
  || !game.includes("state.shopStats?.soldCount")
  || !game.includes('target === "item_shop_sales_total"')
  || !game.includes("state.shopStats?.sales")
  || !game.includes('scanConfiguredEvents("shop:sales")')) {
  throw new Error("Shop-opening runtime must unlock completed-gated buildings and advance sell steps from real shop stats");
}
if (!game.includes('executeGroup.includes("shop_tutorial_complete")')
  || !game.includes('state.completed.add("quest_main_0201_step_2_done")')
  || !game.includes('executeGroup.includes("spawn_hu_sihai")')
  || !game.includes('state.completed.add("npc_hu_sihai_arrived")')
  || !game.includes('queueDialogueGroup("dialogue_hu_default")')) {
  throw new Error("Shop sales events must complete the tutorial step and spawn Hu Sihai through configured runtime handlers");
}
if (!baizhiFavor2Reward || baizhiFavor2Reward.reward_type !== "quest" || baizhiFavor2Reward.reward_param !== "quest_main_0202_baizhi_zhiqiu") {
  throw new Error("Baizhi favor level 2 must unlock the chapter-two herb request main quest");
}
if (!mainQuest0202 || mainQuest0202.chapter !== "2" || mainQuestSteps0202.length < 4) {
  throw new Error("Main quest 0202 must exist as a chapter-two Baizhi herb request with data-driven steps");
}
if (!mainQuestSteps0202.some((step) => step.objective_type === "harvest" && step.target_id === "crop_tiepi_shihu" && step.target_count === "5")
  || !mainQuestSteps0202.some((step) => step.objective_type === "favor" && step.target_id === "npc_baizhi" && step.target_count === "2")
  || !mainQuestSteps0202.some((step) => step.objective_type === "collect" && step.target_id === "item_crop_quality_2plus_shihu" && step.target_count === "5")
  || !mainQuestSteps0202.some((step) => step.objective_type === "defeat" && step.target_id === "boss_shixiang_tengmu")) {
  throw new Error("Main quest 0202 must require Shihu harvest, Baizhi favor, quality Shihu, and Herb Valley boss defeat");
}
if (!mainQuest0202Rewards.some((entry) => entry.reward_type === "recipe" && entry.reward_param === "recipe_garden_herb_advanced")) {
  throw new Error("Main quest 0202 must reward the advanced herb garden recipe after the Herb Valley closure");
}
if (!mainQuest0202Condition || mainQuest0202Condition.expression !== "quest_state(quest_main_0202_baizhi_zhiqiu)==active") {
  throw new Error("Baizhi herb request condition group must watch quest_main_0202 active state");
}
if (!eventMain0205 || eventMain0205.trigger_type !== "on_item_collected" || eventMain0205.trigger_param !== "item_crop_quality_2plus_shihu" || eventMain0205.condition_group !== "quest_main_0202_active" || eventMain0205.execute_group !== "exec_unlock_herb_valley") {
  throw new Error("Quality Shihu collection must unlock Herb Valley through configured event_main_0205");
}
if (!herbValleyDungeon || herbValleyDungeon.boss_id !== "boss_shixiang_tengmu" || herbValleyDungeon.unlock_condition_group !== "quest_main_0202_complete") {
  throw new Error("Herb Valley dungeon must remain connected to the Baizhi quest and Shixiang Tengmu boss data");
}
if (!herbValleyBoss || herbValleyBoss.defeat_event_id !== "event_main_0207") {
  throw new Error("Shixiang Tengmu boss must resolve through event_main_0207");
}
if (!eventMain0207 || eventMain0207.trigger_type !== "on_boss_defeat" || eventMain0207.trigger_param !== "boss_shixiang_tengmu" || eventMain0207.condition_group !== "quest_main_0202_active" || eventMain0207.execute_group !== "exec_finish_herb_valley_baizhi") {
  throw new Error("Herb Valley boss defeat must finish the Baizhi chapter-two line through configured event_main_0207");
}
if (!chapter3EntryCondition || chapter3EntryCondition.expression !== "flag(baizhi_chapter_2_finish)==true") {
  throw new Error("Chapter three entry condition must depend on Baizhi chapter-two finish flag");
}
if (!eventMain0301 || eventMain0301.trigger_type !== "on_world_state" || eventMain0301.trigger_param !== "baizhi_chapter_2_finish" || eventMain0301.condition_group !== "chapter_3_entry_ready" || eventMain0301.execute_group !== "exec_start_quest_main_0301") {
  throw new Error("Chapter three spirit manor quest must start from the Baizhi chapter-two finish event chain");
}
if (!game.includes("state.completed.has(`quest_unlock_${questId}`)")
  || !game.includes('const BAIZHI_QUALITY_ITEM_ID = "item_crop_quality_2plus_shihu"')
  || !game.includes('function harvestQualitySpec')
  || !game.includes('executeGroup.includes("unlock_herb_valley")')
  || !game.includes('function finishHerbValleyBaizhiLine')
  || !game.includes('startSpiritManorChapter(localize("event_name_main_0301"')) {
  throw new Error("Runtime must treat favor-unlocked main quests as active and connect Baizhi quality crop, Herb Valley, and chapter-three start handlers");
}
if (!mainQuest0301 || mainQuest0301.chapter !== "3" || mainQuestSteps0301.length < 4) {
  throw new Error("Main quest 0301 must exist as the chapter-three Spirit Manor build quest");
}
if (!mainQuestSteps0301.some((step) => step.objective_type === "collect" && step.target_id === "item_metal_xuantie" && step.target_count === "20")
  || !mainQuestSteps0301.some((step) => step.objective_type === "collect" && step.target_id === "item_cloth_liuyunsi" && step.target_count === "30")
  || !mainQuestSteps0301.some((step) => step.objective_type === "build" && step.target_id === "build_spirit_manor")) {
  throw new Error("Spirit Manor quest must ask for rare metal, Liuyunsi cloth, and the actual manor build");
}
if (!spiritManorBuilding || spiritManorBuilding.unlock_type !== "quest" || spiritManorBuilding.unlock_param !== "quest_main_0301_baiguai_youyuan" || spiritManorBuilding.cost_special_item !== "item_cloth_liuyunsi") {
  throw new Error("Spirit Manor building must remain a quest-gated chapter-three build that consumes Liuyunsi cloth");
}
if (!mainQuest0301Condition || mainQuest0301Condition.expression !== "quest_state(quest_main_0301_baiguai_youyuan)==active") {
  throw new Error("Spirit Manor build event must watch quest_main_0301 active state");
}
if (!eventMain0303 || eventMain0303.trigger_type !== "on_build_complete" || eventMain0303.trigger_param !== "build_spirit_manor" || eventMain0303.condition_group !== "quest_main_0301_active" || eventMain0303.execute_group !== "exec_unlock_spirit_overview") {
  throw new Error("Building Spirit Manor must unlock the spirit overview through configured event_main_0303");
}
if (!spiritManorOverviewCondition || spiritManorOverviewCondition.expression !== "flag(spirit_manor_overview_unlocked)==true") {
  throw new Error("Faction order entry must depend on the real Spirit Manor overview unlock flag");
}
if (!eventMain0302 || eventMain0302.trigger_type !== "on_world_state" || eventMain0302.trigger_param !== "spirit_manor_overview_unlocked" || eventMain0302.condition_group !== "spirit_manor_overview_unlocked" || eventMain0302.execute_group !== "exec_start_quest_main_0302") {
  throw new Error("Faction order chapter must start from the Spirit Manor overview event chain");
}
if (!mainQuest0302 || mainQuest0302.chapter !== "3" || mainQuestSteps0302.length < 3) {
  throw new Error("Main quest 0302 must exist as the faction order and Fire Ruin chapter-three quest");
}
if (!mainQuestSteps0302.some((step) => step.objective_type === "sell" && step.target_id === "order_faction_0001")
  || !mainQuestSteps0302.some((step) => step.objective_type === "enter_area" && step.target_id === "area_ruin_fire")
  || !mainQuestSteps0302.some((step) => step.objective_type === "defeat" && step.target_id === "boss_chiyan_xiehou")) {
  throw new Error("Faction order quest must require the faction order, Fire Ruin entry, and Chiyan Xiehou boss defeat");
}
if (!factionOrder || factionOrder.appear_condition_group !== "chapter_3_trade_started" || !String(factionOrder.need_item_ids || "").includes("item_drink_xuanxiang_lingniang") || !String(factionOrder.need_item_ids || "").includes("item_gift_yunjin_lijuan")) {
  throw new Error("First faction order must appear from chapter_3_trade_started and require the designed premium drink/gift bundle");
}
if (!chapter3TradeCondition || chapter3TradeCondition.expression !== "flag(chapter_3_trade_started)==true") {
  throw new Error("Faction order visibility must depend on the chapter_3_trade_started flag");
}
if (!factionOrderDoneCondition || factionOrderDoneCondition.expression !== "flag(order_faction_0001_delivered)==true") {
  throw new Error("Fire Ruin unlock must depend on the delivered faction order flag");
}
if (!eventMain0305 || eventMain0305.trigger_type !== "on_trade_complete" || eventMain0305.trigger_param !== "order_faction_0001" || eventMain0305.condition_group !== "faction_order_first_delivered" || eventMain0305.execute_group !== "exec_unlock_ruin_fire") {
  throw new Error("Delivering the first faction order must unlock Fire Ruin through event_main_0305");
}
if (!fireRuinCondition || fireRuinCondition.expression !== "flag(fire_ruin_unlocked)==true") {
  throw new Error("Fire Ruin dungeon condition must depend on the fire_ruin_unlocked flag");
}
if (!fireRuinDungeon || fireRuinDungeon.unlock_condition_group !== "fire_ruin_unlocked" || fireRuinDungeon.boss_id !== "boss_chiyan_xiehou") {
  throw new Error("Fire Ruin dungeon must be gated by fire_ruin_unlocked and connect to Chiyan Xiehou");
}
if (!mainQuest0302Condition || mainQuest0302Condition.expression !== "quest_state(quest_main_0302_shanghui_laike)==active") {
  throw new Error("Fire Ruin entry event must watch quest_main_0302 active state");
}
if (!eventMain0306 || eventMain0306.trigger_type !== "on_enter_area" || eventMain0306.trigger_param !== "area_ruin_fire" || eventMain0306.condition_group !== "fire_ruin_unlocked" || eventMain0306.execute_group !== "exec_start_ruin_fire") {
  throw new Error("Entering Fire Ruin must trigger configured event_main_0306");
}
if (!fireRuinBoss || fireRuinBoss.defeat_event_id !== "event_main_0307") {
  throw new Error("Chiyan Xiehou boss must resolve through event_main_0307");
}
if (!eventMain0307 || eventMain0307.trigger_type !== "on_boss_defeat" || eventMain0307.trigger_param !== "boss_chiyan_xiehou" || eventMain0307.condition_group !== "quest_main_0302_active" || eventMain0307.execute_group !== "exec_finish_fire_ruin") {
  throw new Error("Fire Ruin boss defeat must finish chapter three through configured event_main_0307");
}
if (game.includes("state.missionDone.add(SPIRIT_MANOR_QUEST_ID);\n  if (firstStart)")
  || game.includes("state.missionDone.add(FACTION_ORDER_QUEST_ID);\n  if (firstStart)")) {
  throw new Error("Chapter-three quest start handlers must not mark their quests done before the build/order/boss objectives complete");
}
if (!game.includes("state.completed.add(`quest_unlock_${SPIRIT_MANOR_QUEST_ID}`)")
  || !game.includes("state.completed.add(`quest_unlock_${FACTION_ORDER_QUEST_ID}`)")
  || !game.includes("state.completed.add(FIRE_RUIN_AREA_ID)")
  || !game.includes("state.triggeredEvents.add(FIRE_RUIN_ENTRY_EVENT_ID)")
  || !game.includes('function finishFireRuinLine')) {
  throw new Error("Chapter-three runtime must unlock quests without false completion and record Fire Ruin entry/finish states");
}
if (!mainQuest0401 || mainQuest0401.chapter !== "4" || mainQuestSteps0401.length < 2) {
  throw new Error("Main quest 0401 must exist as the chapter-four drought relief quest");
}
if (!mainQuestSteps0401.some((step) => step.objective_type === "enter_area" && step.target_id === "world_state_drought")
  || !mainQuestSteps0401.some((step) => step.objective_type === "collect" && step.target_id === "item_water_supply_relief" && step.target_count === "10")) {
  throw new Error("Drought quest must require entering the drought world state and collecting 10 relief water bundles");
}
if (!eventMain0401 || eventMain0401.trigger_type !== "on_day_start" || eventMain0401.trigger_param !== "day_67" || eventMain0401.condition_group !== "chapter_3_complete" || eventMain0401.execute_group !== "exec_world_state_drought") {
  throw new Error("Chapter four drought must start after chapter three completion through event_main_0401");
}
if (!worldStateDroughtCondition || worldStateDroughtCondition.expression !== "flag(world_state_drought)==true") {
  throw new Error("Drought order visibility must depend on the world_state_drought flag");
}
if (!disasterOrder || disasterOrder.appear_condition_group !== "world_state_drought" || disasterOrder.reward_item_group !== "pool_disaster_relief") {
  throw new Error("Drought relief order must appear during drought and use the disaster relief reward pool");
}
if (5 + disasterRewards
  .filter((entry) => entry.reward_type === "item" && entry.reward_param === "item_water_supply_relief")
  .reduce((sum, entry) => sum + Number(entry.reward_count || 0), 0) < 10) {
  throw new Error("Drought start kit plus disaster order rewards must satisfy the 10 relief water objective");
}
if (!droughtReliefDoneCondition || droughtReliefDoneCondition.expression !== "flag(order_disaster_0001_delivered)==true") {
  throw new Error("Lu truth quest must wait for the delivered disaster order flag");
}
if (!eventMain0402 || eventMain0402.trigger_type !== "on_trade_complete" || eventMain0402.trigger_param !== "order_disaster_0001" || eventMain0402.condition_group !== "drought_relief_order_delivered" || eventMain0402.execute_group !== "exec_start_quest_main_0402") {
  throw new Error("Delivering the drought relief order must start Lu Sanxiao's chapter-four truth quest");
}
if (!mainQuest0402 || mainQuest0402.chapter !== "4" || mainQuestSteps0402.length < 3) {
  throw new Error("Main quest 0402 must exist as the chapter-four pivot/final-nest quest");
}
if (!mainQuestSteps0402.some((step) => step.objective_type === "collect" && step.target_id === "item_spirit_core_4" && step.target_count === "4")
  || !mainQuestSteps0402.some((step) => step.objective_type === "collect" && step.target_id === "item_special_huojing")
  || !mainQuestSteps0402.some((step) => step.objective_type === "collect" && step.target_id === "item_special_dinghai_shenzhu")) {
  throw new Error("Lu truth quest must require four spirit cores, Huojing, and Dinghai Shenzhu");
}
if (!mainQuest0402Condition || mainQuest0402Condition.expression !== "quest_state(quest_main_0402_ershisi_shu)==active") {
  throw new Error("Final nest unlock event must watch quest_main_0402 active state");
}
if (!eventMain0404 || eventMain0404.trigger_type !== "on_item_collected" || eventMain0404.trigger_param !== "item_special_dinghai_shenzhu" || eventMain0404.condition_group !== "quest_main_0402_active" || eventMain0404.execute_group !== "exec_unlock_final_nest") {
  throw new Error("Collecting Dinghai Shenzhu must unlock the final nest through event_main_0404");
}
if (!finalNestReadyCondition.expression.includes("all_of(quest_main_0402_active") || !finalNestReadyCondition.expression.includes("has_item(item_special_huojing,1)") || !finalNestReadyCondition.expression.includes("has_item(item_special_dinghai_shenzhu,1)")) {
  throw new Error("Final nest condition must require the active Lu truth quest, Huojing, and Dinghai Shenzhu");
}
if (!finalNestDungeon || finalNestDungeon.unlock_condition_group !== "quest_main_0402_ready" || finalNestDungeon.boss_id !== "boss_shiling_mingmu") {
  throw new Error("Final nest dungeon must be gated by quest_main_0402_ready and connect to Shiling Mingmu");
}
if (!mainQuest0403 || mainQuest0403.chapter !== "4" || mainQuestSteps0403.length < 4) {
  throw new Error("Main quest 0403 must exist as the Pantao finale quest");
}
if (!mainQuestSteps0403.some((step) => step.objective_type === "defeat" && step.target_id === "boss_shiling_mingmu")
  || !mainQuestSteps0403.some((step) => step.objective_type === "build" && step.target_id === "build_solar_array_final")
  || !mainQuestSteps0403.some((step) => step.objective_type === "plant" && step.target_id === "item_seed_wannian_pantao")
  || !mainQuestSteps0403.some((step) => step.objective_type === "harvest" && step.target_id === "item_crop_wannian_pantao")) {
  throw new Error("Pantao finale must require final boss defeat, final array build, Pantao planting, and Pantao harvest");
}
if (!finalBoss || finalBoss.defeat_event_id !== "event_main_0405") {
  throw new Error("Shiling Mingmu boss must resolve through event_main_0405");
}
if (!eventMain0405 || eventMain0405.trigger_type !== "on_boss_defeat" || eventMain0405.trigger_param !== "boss_shiling_mingmu" || eventMain0405.condition_group !== "quest_main_0403_active" || eventMain0405.execute_group !== "exec_start_final_array_cutscene") {
  throw new Error("Final boss defeat must start the final array cutscene through event_main_0405");
}
if (!finalArrayBuilding || finalArrayBuilding.unlock_type !== "quest" || finalArrayBuilding.unlock_param !== "quest_main_0403_pantao_dayan" || finalArrayBuilding.cost_special_item !== "item_special_dinghai_shenzhu") {
  throw new Error("Final solar array building must be quest-gated and consume Dinghai Shenzhu");
}
if (!mainQuest0403Step1Condition || mainQuest0403Step1Condition.expression !== "quest_step_done(step_main_0403_01)") {
  throw new Error("Final planting unlock must depend on the real final boss step");
}
if (!eventMain0406 || eventMain0406.trigger_type !== "on_build_complete" || eventMain0406.trigger_param !== "build_solar_array_final" || eventMain0406.condition_group !== "quest_main_0403_step_1_done" || eventMain0406.execute_group !== "exec_unlock_final_planting") {
  throw new Error("Building the final array must unlock final planting through event_main_0406");
}
if (!mainQuest0403Condition || mainQuest0403Condition.expression !== "quest_state(quest_main_0403_pantao_dayan)==active") {
  throw new Error("Pantao harvest finale event must watch quest_main_0403 active state");
}
if (!eventMain0407 || eventMain0407.trigger_type !== "on_crop_harvest" || eventMain0407.trigger_param !== "item_crop_wannian_pantao" || eventMain0407.condition_group !== "quest_main_0403_active" || eventMain0407.execute_group !== "exec_final_banquet") {
  throw new Error("Pantao harvest must finish the final banquet through event_main_0407");
}
if (game.includes("state.missionDone.add(CHAPTER_4_DROUGHT_QUEST_ID)")
  || game.includes("state.missionDone.add(CHAPTER_4_LU_TRUTH_QUEST_ID)")) {
  throw new Error("Chapter-four quest start handlers must use quest_unlock flags instead of false missionDone completion");
}
if (!game.includes("state.completed.add(`quest_unlock_${CHAPTER_4_DROUGHT_QUEST_ID}`)")
  || !game.includes("state.completed.add(`quest_unlock_${CHAPTER_4_LU_TRUTH_QUEST_ID}`)")
  || !game.includes('function finishChapter4DroughtRelief')
  || !game.includes('function unlockFinalNest')
  || !game.includes('function finishFinalBanquet')) {
  throw new Error("Chapter-four runtime must unlock quests separately from drought relief, final nest, and final banquet completion");
}
if (!sideQuest0101 || sideQuestSteps0101.length < 2 || !sideQuestTrigger0101) {
  throw new Error("Side quest 0101 must include base, steps, and trigger rows");
}
if (sideQuestTrigger0101.trigger_type !== "on_talk" || sideQuestTrigger0101.trigger_param !== "npc_xubo") {
  throw new Error("Side quest 0101 trigger must connect to Xubo talk");
}
if (!sideQuestDialogue0101 || sideQuestDialogue0101.dialogue_group_id !== "dialogue_xubo_quest_0002") {
  throw new Error("Side quest 0101 must connect to a dialogue map entry");
}
if (!sideQuest0101Rewards.some((entry) => entry.reward_type === "favor" && entry.reward_param === "npc_xubo")) {
  throw new Error("Side quest 0101 must grant Xubo favor through reward_pool.csv");
}
if (!reliefSideQuest || !reliefSideRewards.some((entry) => entry.reward_type === "reputation")) {
  throw new Error("Relief side quest must exercise reputation rewards");
}
if (!newGameEvent || newGameEvent.trigger_type !== "on_new_game" || newGameEvent.condition_group !== "always_true") {
  throw new Error("Configured event runtime must include a new-game main quest trigger");
}
if (!firstSpiritEvent || firstSpiritEvent.execute_group !== "exec_birth_first_spirit" || firstSpiritEvent.condition_group !== "has_first_harvest") {
  throw new Error("Configured event runtime must include first spirit birth trigger gated by first harvest");
}
if (!jingzheSideTrigger || jingzheSideTrigger.trigger_type !== "on_term_change" || jingzheSideTrigger.condition_group !== "quest_main_0102_active") {
  throw new Error("Configured side quest runtime must include Jingzhe term condition trigger");
}
if (!qingyunMine || qingyunMine.boss_id !== "boss_liejia_muwei") throw new Error("Missing first dungeon: area_mine_qingyun");
if (qingyunMine.unlock_condition_group !== "quest_main_0102_step_1_done") {
  throw new Error("Qingyun mine must unlock after the copper-hoe/pest step, not after bridge completion");
}
if (mineEnemies.length < 3) throw new Error("Insufficient mine enemy entries");
if (mineLoot.length < 3) throw new Error("Insufficient mine loot pool entries");
if (!mineLoot.some((loot) => loot.item_id === "item_ore_iron_raw" && loot.condition_group === "always_true")) {
  throw new Error("Mine loot must provide raw iron before the bridge is complete");
}
for (const loot of mineLoot) {
  if (!itemIds.has(loot.item_id)) throw new Error(`Mine loot references missing item: ${loot.item_id}`);
}
if (!muweiBoss || Number(muweiBoss.hp_total) <= 0) throw new Error("Missing first dungeon boss config");
if (muweiSkills.length < 4 || !muweiSkills.some((skill) => skill.effect_type === "shield")) {
  throw new Error("First dungeon boss must have a multi-phase skill table with shield phase");
}
if (!suanCombatSkill || Number(suanCombatSkill.effect_param_1) <= 1) {
  throw new Error("Spirit skill config must include a battle combat multiplier skill");
}
if (!dungeonMechanic || !dungeonMechanic.field_rule || !dungeonMechanic.puzzle_core) throw new Error("Missing dungeon solar mechanic content");
if (!cloudRoute || Number(cloudRoute.profit_rate) <= 1 || !cloudRoute.preferred_goods_tags.includes("drink")) {
  throw new Error("Cloud market trade route must define profit rate and preferred goods tags");
}
if (!cloudRouteEvent || cloudRouteEvent.route_id !== cloudRoute.route_id || Number(cloudRouteEvent.risk_delta) <= 0) {
  throw new Error("Cloud market trade route event must connect to route and add risk choice data");
}
if (!cloudRouteRisk || cloudRouteRisk.route_id !== cloudRoute.route_id || Number(cloudRouteRisk.min_supply_count) < 1) {
  throw new Error("Cloud market trade route risk must connect required supply counts");
}
if (!lotusBasinRoute || lotusBasinRoute.unlock_condition_group !== "qinghe_lotus_basin_route_ready" || !String(lotusBasinRoute.preferred_goods_tags || "").includes("water_crop") || !String(lotusBasinRoute.required_supply_tag || "").includes("cooling_drink")) {
  throw new Error("Lotus Basin trade route must unlock from Qinghe's completed waterway order and prefer water-fresh goods");
}
if (!qingheLotusBasinRouteCondition || qingheLotusBasinRouteCondition.usage_hint !== "route_lotus_basin_03" || !String(qingheLotusBasinRouteCondition.expression || "").includes("npc_qinghe_favor_5") || !String(qingheLotusBasinRouteCondition.expression || "").includes("qinghe_year2_waterway_order_done")) {
  throw new Error("Lotus Basin route condition must require Qinghe favor 5 and year-two waterway order delivery");
}
if (!lotusBasinRouteEvent || lotusBasinRouteEvent.route_id !== "route_lotus_basin_03" || lotusBasinRouteEvent.condition_group !== "qinghe_lotus_basin_route_ready" || !String(lotusBasinRouteEvent.event_name || "").includes("涨潮")) {
  throw new Error("Lotus Basin trade event must connect to the waterway-ready condition and keep its tide story beat");
}
if (!lotusBasinRouteRisk || lotusBasinRouteRisk.route_id !== "route_lotus_basin_03" || lotusBasinRouteRisk.required_supply_tag !== "trade_pack" || Number(lotusBasinRouteRisk.min_supply_count || 0) < 2) {
  throw new Error("Lotus Basin trade risk must require trade-pack preparation for flood detours");
}
if (!qingheLotusBasinReturnCondition || qingheLotusBasinReturnCondition.usage_hint !== "dialogue_qinghe_lotus_basin_return" || !String(qingheLotusBasinReturnCondition.expression || "").includes("qinghe_lotus_basin_trade_return")) {
  throw new Error("Qinghe lotus-basin return condition must bridge the first waterway return flag into the dialogue group");
}
if (qingheLotusBasinReturnDialogue.length < 3 || !qingheLotusBasinReturnDialogue.some((entry) => entry.speaker_id === "npc_qinghe") || !qingheLotusBasinReturnDialogue.some((entry) => entry.speaker_id === "player") || !qingheLotusBasinReturnDialogue.every((entry) => entry.condition_group === "qinghe_lotus_basin_trade_return")) {
  throw new Error("Qinghe lotus-basin return dialogue must include a three-line Qinghe/player exchange gated by the first return flag");
}
const qingheLotusReturnText = [qingheLotusBasinReturnLine001, qingheLotusBasinReturnLine002, qingheLotusBasinReturnLine003].map((entry) => entry?.zh_cn || "").join("");
if (!qingheLotusBasinReturnLine001 || !qingheLotusBasinReturnLine002 || !qingheLotusBasinReturnLine003 || !qingheLotusReturnText.includes("莲泽水航") || !qingheLotusReturnText.includes("旧铺") || !qingheLotusReturnText.includes("熟路")) {
  throw new Error("Qinghe lotus-basin return dialogue localization must mention Lianze waterway, old shop payoff, and familiar-route memory");
}
if (!mineHiddenRotation || mineHiddenRotation.area_id !== "area_mine_qingyun" || !dungeons.find((entry) => entry.area_id === mineHiddenRotation.area_id)) {
  throw new Error("Hidden dungeon rotation must connect to the Qingyun mine area");
}
if (!waterHiddenRotation || waterHiddenRotation.area_id !== "area_herb_valley" || waterHiddenRotation.rare_drop_pool !== "pool_reward_year2_dungeon") {
  throw new Error("Hidden water rotation must connect to Herb Valley and point at the year-two dungeon reward pool");
}
if (!hiddenDungeonRotations.some((entry) => entry.season_window === "term_guyu" && entry.reward_focus.includes("ore"))) {
  throw new Error("Hidden dungeon rotation must include a Guyu ore-focused mine rotation");
}
if (!thunderHiddenRotation || thunderHiddenRotation.area_id !== "area_mine_qingyun" || thunderHiddenRotation.unlock_condition_group !== "rare_spirit_thunder_route_open" || thunderHiddenRotation.rare_drop_pool !== "pool_reward_exp_stormbamboo") {
  throw new Error("Thunder hidden rotation must reuse the Qingyun mine and unlock from the old thunder route");
}
if (!fireHiddenRotation || fireHiddenRotation.area_id !== "area_ruin_fire" || fireHiddenRotation.entry_modifier !== "heat_core_active") {
  throw new Error("Hidden fire rotation must connect to the fire ruins and use the heat-core entry modifier");
}
if (!stelaHiddenRotation || stelaHiddenRotation.area_id !== "area_final_nest" || stelaHiddenRotation.rare_drop_pool !== "pool_reward_trade_archive") {
  throw new Error("Winter stela rotation must connect to the final nest and point at the archive reward pool");
}
if (waterHiddenRewards.length < 2 || !waterHiddenRewards.some((entry) => entry.reward_param === "seed_luzhu_qin") || !waterHiddenRewards.some((entry) => entry.reward_param === "item_special_dinghai_shenzhu_fragment")) {
  throw new Error("Hidden water rotation reward pool must grant both canal fragments and water-crop seeds");
}
if (mineHiddenRewards.length < 2 || !mineHiddenRewards.some((entry) => entry.reward_param === "item_metal_xuantie") || !mineHiddenRewards.some((entry) => entry.reward_param === "item_stone_spirit_shard")) {
  throw new Error("Hidden mine rotation reward pool must grant ore and build-material support");
}
if (thunderHiddenRewards.length < 2 || !thunderHiddenRewards.some((entry) => entry.reward_type === "buff" && entry.reward_param === "buff_trade_risk_down_next")) {
  throw new Error("Thunder hidden rotation reward pool must include the next-trade risk reduction buff");
}
if (!thunderOldRoute || thunderOldRoute.unlock_condition_group !== "rare_spirit_thunder_route_open" || thunderOldRoute.rare_reward_pool !== "pool_reward_trade_thunder" || !String(thunderOldRoute.preferred_goods_tags || "").includes("metal")) {
  throw new Error("Hidden thunder route must be data-driven, route-locked by Leizhu, and prefer metal cargo");
}
if (!thunderOldRouteEvent || thunderOldRouteEvent.route_id !== "route_thunder_old_06" || Number(thunderOldRouteEvent.risk_delta) >= 0) {
  throw new Error("Hidden thunder route must ship a dedicated event that slightly lowers risk when following the old markers");
}
if (thunderOldRouteRisks.length < 2 || !thunderOldRouteRisks.some((entry) => entry.required_supply_tag === "medicine") || !thunderOldRouteRisks.some((entry) => entry.required_supply_tag === "trade_pack")) {
  throw new Error("Hidden thunder route must require both medicine and trade-pack preparation");
}
for (const route of tradeRoutes) {
  if (!rewardPools.find((entry) => entry.reward_pool_id === route.rare_reward_pool)) {
    throw new Error(`Trade route reward pool is missing: ${route.rare_reward_pool}`);
  }
}
if (!lichun) throw new Error("Missing solar term: term_lichun");
if (!jingzhe) throw new Error("Missing solar term: term_jingzhe");
if (!jingzheRisk || jingzheRisk.trigger_type !== "on_term_change" || !jingzheRisk.execute_group.includes("warn")) {
  throw new Error("Missing Jingzhe solar-term risk trigger");
}
if (!jingzheGuide) throw new Error("Missing Jingzhe pest alert guide script");
if (!clearWeather || !rainWeather || !dryHeatWeather) {
  throw new Error("Weather config must include clear, light rain, and dry heat demo weather");
}
for (const entry of [clearWeather, rainWeather, dryHeatWeather]) {
  for (const field of ["water_bonus", "crop_growth_modifier", "mood_modifier", "visual_fx_id", "disaster_tag"]) {
    if (!(field in entry) || entry[field] === "") throw new Error(`Weather config missing ${field} for ${entry.weather_id}`);
  }
}
if (Number(rainWeather.water_bonus) <= 0 || Number(dryHeatWeather.water_bonus) >= 0) {
  throw new Error("Weather water bonuses must distinguish rain from dry heat");
}
if (Number(rainWeather.crop_growth_modifier) <= 1 || Number(dryHeatWeather.crop_growth_modifier) >= 1) {
  throw new Error("Weather growth modifiers must distinguish rain growth from dry heat slowdown");
}
if (p0SteamAssets.length < 8) throw new Error("Insufficient P0 Steam asset plan entries");
if (steamAssets.filter((entry) => entry.asset_type === "screenshot" && entry.priority === "P0").length < 8) {
  throw new Error("Steam store asset plan must include at least 8 P0 screenshots");
}
if (p0Achievements.length < 6) throw new Error("Insufficient P0 achievement entries");
if (!demoFoundation || !demoFoundation.steam_api_name) throw new Error("Missing demo foundation Steam achievement mapping");
if (!p0Achievements.every((entry) => entry.steam_api_name.startsWith("ACH_"))) {
  throw new Error("Achievement config must provide Steam-style API names");
}
if (p0Qa.length < 5) throw new Error("Insufficient P0 Demo QA checklist entries");
if (p0Vertical.length < 7) throw new Error("Insufficient P0 vertical-slice acceptance entries");
if (!daySummaryAcceptance || daySummaryAcceptance.priority !== "P0" || !daySummaryAcceptance.required_content.includes("明日建议") || !daySummaryAcceptance.acceptance_criteria.includes("下一步")) {
  throw new Error("Vertical slice vsa_008 must require a P0 day-end summary with next-day advice");
}
if (!game.includes("vsa_008: state.day > 1 && Boolean(state.lastDaySummary?.advice)")) {
  throw new Error("Vertical slice vsa_008 must be evaluated from persisted day summary advice");
}
if (p0ReleaseGates.length < 8) throw new Error("Insufficient P0 release readiness gate entries");
if (!releaseGates.find((entry) => entry.gate_id === "rrg_012")) {
  throw new Error("Release gate rrg_012 for platform/legal confirmation is missing");
}
if (!releaseGates.find((entry) => entry.gate_id === "rrg_009" && entry.evidence_source.includes("year2_goal_book_rule.csv") && entry.evidence_source.includes("freeplay_goal.csv") && entry.evidence_source.includes("rare_spirit_event_action.csv"))) {
  throw new Error("Release gate rrg_009 must track post-mainline goal book readiness");
}
if (p0SaveFields.length < 7 || !p0SaveFields.some((entry) => entry.field_id === "save_spirit_bond" && entry.migration_required === "true")) {
  throw new Error("Save schema registry must cover P0 fields and migrated spirit bond data");
}
if (!saveSchemaRegistry.every((entry) => entry.field_id && entry.module_path && entry.field_name && entry.data_type)) {
  throw new Error("Save schema registry rows must define field id, module path, field name, and type");
}
if (migrationToV2.length < 3 || !migrationToV2.some((entry) => entry.operation === "add_bond_and_mastery_maps")) {
  throw new Error("Save migration plan must include multiple v2 migrations including spirit long-term progression");
}
if (!saveMigrationPlan.some((entry) => entry.from_version === "0" && entry.to_version === "1")) {
  throw new Error("Save migration plan must include legacy v0 to v1 initialization");
}
if (p0LocalizationCoverage.length < 6 || !locMainDialogue || !locFinalSupport || !locSteamStore) {
  throw new Error("Localization coverage plan must include P0 main dialogue, final support, and Steam store coverage");
}
if (!localization.find((entry) => entry.text_key === "dialogue_main_0001_001")) {
  throw new Error("Localization text must include opening main dialogue");
}
if (!localizationCoveragePlan.every((entry) => entry.coverage_id && entry.key_pattern && entry.coverage_target && entry.qa_method)) {
  throw new Error("Localization coverage rows must define id, key pattern, target, and QA method");
}
if (communityContentCalendar.length < 8 || !launchBeat || demoBeats.length < 3 || steamCommunityBeats.length < 4) {
  throw new Error("Community content calendar must cover demo ramp, launch, Steam beats, and buy/download CTAs");
}
if (!communityContentCalendar.every((entry) => entry.calendar_id && entry.week_offset !== "" && entry.primary_asset && entry.target_channel && entry.cta)) {
  throw new Error("Community content calendar rows must define id, week offset, asset, channel, and CTA");
}
if (!communityContentCalendar.some((entry) => Number(entry.week_offset) < 0) || !communityContentCalendar.some((entry) => Number(entry.week_offset) >= 0)) {
  throw new Error("Community content calendar must include both pre-launch and launch/post-launch beats");
}
if (conditionGroups.length < 40 || !alwaysTrueCondition || !firstHarvestCondition || !finalNestReadyCondition || !xuboFavorCondition || !finalQuestCondition || !jingzheCondition || !bossCondition) {
  throw new Error("Condition group table must include core always, NPC favor, quest, term, and boss gates");
}
if (!conditionGroups.every((entry) => entry.condition_group_id && entry.expression && entry.usage_hint && entry.priority !== "")) {
  throw new Error("Condition group rows must define id, expression, usage hint, and priority");
}
if (!conditionGroups.every((entry) => Number.isFinite(Number(entry.priority)))) {
  throw new Error("Condition group priorities must parse as numbers; check for unquoted commas in expressions");
}
if (!thunderRouteReadyCondition || !String(thunderRouteReadyCondition.expression || "").includes("dungeon_clear(area_mine_qingyun)") || !String(thunderRouteReadyCondition.expression || "").includes("flag(trade_route_complete)==true")) {
  throw new Error("Thunder route ready condition must require both a Qingyun mine clear and a completed trade return");
}
if (!thunderRouteOpenCondition || thunderRouteOpenCondition.expression !== "flag(thunder_old_route_open)==true") {
  throw new Error("Thunder route unlock condition must resolve through the old-route world flag");
}
if (alwaysTrueCondition.expression !== "true") throw new Error("always_true condition must remain a true expression");
if (firstHarvestCondition.expression !== "has_item(item_crop_lingqi_bailuobo,1)") {
  throw new Error("First harvest condition must preserve the full has_item expression with quoted CSV commas");
}
if (!finalNestReadyCondition.expression.includes("all_of(quest_main_0402_active") || !finalNestReadyCondition.expression.includes("has_item(item_special_huojing,1)") || !finalNestReadyCondition.expression.includes("has_item(item_special_dinghai_shenzhu,1)")) {
  throw new Error("Final nest ready condition must preserve nested all_of and has_item expressions");
}
if (!xuboFavorCondition.expression.includes("npc_favor_level(npc_xubo)>=5")) {
  throw new Error("Xubo final favor condition must use npc_favor_level expression");
}
if (!finalQuestCondition.expression.includes("quest_state(quest_main_0403_pantao_dayan)==active")) {
  throw new Error("Final quest condition must use quest_state active expression");
}
if (jingzheCondition.expression !== "current_term==term_jingzhe") {
  throw new Error("Jingzhe condition must map to current term expression");
}
if (!bossCondition.expression.includes("boss_defeated(boss_chiyan_xiehou)")) {
  throw new Error("Boss condition must use boss_defeated expression");
}
if (!villagerPriceRule) throw new Error("Missing villager shop price rule");
if (!springSeason || !springSeason.score_focus_tags.includes("fresh_market")) {
  throw new Error("Year-two spring shop season must define fresh-market focus tags");
}
if (springSeasonRules.length < 4 || !springSeasonRules.some((entry) => entry.score_part === "sales_score")) {
  throw new Error("Year-two spring shop settlement must include weighted sales scoring");
}
if (!springSeasonSReward || Number(springSeasonSReward.score_min) < 900) {
  throw new Error("Year-two shop rank rewards must include a high-tier spring reward");
}
if (!year2GiftOrder || Number(year2GiftOrder.reward_gold) < 2000 || !year2GiftOrder.need_item_ids.includes("|")) {
  throw new Error("Year-two advanced shop order must include multi-item high-value requirements");
}
if (!freshTheme) throw new Error("Missing fresh_market shelf theme");
if (!priceDiagnosis) throw new Error("Missing price-high shop diagnosis");
if (!String(canalDish?.tags || "").includes("refreshing") || !String(canalDish?.tags || "").includes("water_food") || !String(canalDish?.tags || "").includes("clean_food") || !String(canalDish?.tags || "").includes("cooling")) {
  throw new Error("Canal dish tags must advertise refreshing, water-food, clean-food, and cooling feedback");
}
if (!hasShopHint(villagerRefreshHints, "hot_tag==refreshing", "清口凉菜") || !hasShopHint(healerRefreshHints, "hot_tag==refreshing", "清润") || !hasShopHint(crafterRefreshHints, "hot_tag==refreshing", "凉润")) {
  throw new Error("Shop feedback csv must include canal-dish thought bubbles for villager, healer, and crafter");
}
if (!demoOrder) throw new Error("Missing demo order: order_demo_0001");
if (demoOrder.appear_condition_group !== "first_bailuobo_tang_crafted" || !firstBailuoboTangCondition || !firstBailuoboTangCondition.expression.includes("item_food_bailuobo_tang")) {
  throw new Error("Demo order must unlock from the first bailuobo soup craft condition");
}
if (!canalDemoOrder || canalDemoOrder.issuer_id !== "npc_qinghe" || canalDemoOrder.need_item_ids !== "item_food_liangban_lingqin" || !firstLingqinDishCondition || !firstLingqinDishCondition.expression.includes("first_lingqin_dish_crafted")) {
  throw new Error("Canal follow-up demo order must unlock from the first liangban lingqin craft");
}
if (!year2GiftOrder || year2GiftOrder.need_item_ids !== "item_gift_yunjin_lijuan|item_food_bazhen_lingshan|item_drink_xuanxiang_lingniang") {
  throw new Error("Year-two starter order must consume the banquet gift trio");
}
if (year2GiftOrder.need_item_counts !== "1|1|1" || year2GiftOrder.appear_condition_group !== "quest_main_0403_complete") {
  throw new Error("Year-two starter order must unlock right after the final banquet and ask for one copy of each starter item");
}
if (demoOrder.need_item_ids !== "item_food_bailuobo_tang") {
  throw new Error("Demo order must consume the first processed bailuobo soup");
}
for (const itemId of demoOrder.need_item_ids.split("|")) {
  if (!itemIds.has(itemId)) throw new Error(`Demo order needs missing item: ${itemId}`);
}
for (const itemId of canalDemoOrder.need_item_ids.split("|")) {
  if (!itemIds.has(itemId)) throw new Error(`Canal demo order needs missing item: ${itemId}`);
}
for (const itemId of year2GiftOrder.need_item_ids.split("|")) {
  if (!itemIds.has(itemId)) throw new Error(`Year-two starter order needs missing item: ${itemId}`);
}
if (Number(demoOrder.reward_gold) <= 0 || Number(demoOrder.reward_fame) <= 0) {
  throw new Error("Demo order must reward gold and fame");
}
if (Number(canalDemoOrder.reward_gold) <= Number(canalDish.sell_price_base || 0) || Number(canalDemoOrder.reward_favor_value) <= 0) {
  throw new Error("Canal follow-up demo order must visibly reward the first repair dish");
}
if (Number(year2GiftOrder.reward_gold) <= 0 || Number(year2GiftOrder.reward_fame) <= 0 || year2GiftOrder.reward_item_group !== "pool_reward_year2_shop") {
  throw new Error("Year-two starter order must pay out visible gold, fame, and the year-two shop reward pool");
}
if (!demoOrder.reward_favor_npc || !npcs.find((entry) => entry.npc_id === demoOrder.reward_favor_npc)) {
  throw new Error("Demo order must reward a valid NPC favor target");
}
if (!conditionGroups.find((entry) => entry.condition_group_id === year2GiftOrder.appear_condition_group)) {
  throw new Error("Year-two starter order must reference a valid unlock condition group");
}
if (!rewardPools.some((entry) => entry.reward_pool_id === year2GiftOrder.reward_item_group)) {
  throw new Error("Year-two starter order reward pool is missing from reward_pool.csv");
}
if (!localization.find((entry) => entry.text_key === year2GiftOrder.order_name_key)) {
  throw new Error("Year-two starter order name must resolve through localization_text.csv");
}
if (!plainRation || !String(plainRation.tags || "").includes("portable_food")) {
  throw new Error("Plain ration item must exist as a portable-food staple for town and patrol loops");
}
if (!waterLotusSeedItem || !String(waterLotusSeedItem.tags || "").includes("year2")) {
  throw new Error("Year-two water-lotus seed item must exist in item_base.csv");
}
if (!waterLotusCrop || waterLotusCrop.seed_item_id !== "seed_shuihang_lianshi") {
  throw new Error("Water-lotus crop must map to the dedicated year-two pond seed");
}
const year2RecipeSpecs = [
  ["recipe_plain_ration", plainRationRecipe, "item_food_plain_ration", "default"],
  ["recipe_trade_cloud_box", tradeCloudBoxRecipe, "item_trade_cloud_box", "npc_favor"],
  ["recipe_build_beam_hardwood", buildBeamRecipe, "item_build_beam_hardwood", "quest"],
  ["recipe_patrol_ration", patrolRationRecipe, "item_patrol_ration", "npc_favor"],
  ["recipe_signal_flare", signalFlareRecipe, "item_tool_signal_flare", "npc_favor"],
  ["recipe_tea_story_blend", teaStoryBlendRecipe, "item_tea_story_blend", "npc_favor"],
  ["recipe_festival_mooncake", festivalMooncakeRecipe, "item_food_festival_mooncake", "npc_favor"],
  ["recipe_archive_scroll", archiveScrollRecipe, "item_gift_archive_scroll", "npc_favor"],
  ["recipe_ritual_fire_core", ritualFireCoreRecipe, "item_ritual_fire_core", "npc_favor"],
  ["recipe_helu_tangshui_shuihang", waterwayHeluRecipe, "item_drink_helu_tangshui", "chapter"],
];
for (const [recipeId, recipe, outputItemId, unlockType] of year2RecipeSpecs) {
  if (!recipe || recipe.output_item_id !== outputItemId || recipe.unlock_type !== unlockType) {
    throw new Error(`Missing or malformed year-two production recipe: ${recipeId}`);
  }
  if (!itemIds.has(recipe.output_item_id)) throw new Error(`Year-two recipe output is missing item data: ${recipe.output_item_id}`);
  for (const itemId of String(recipe.input_item_ids || "").split("|").filter(Boolean)) {
    if (!itemIds.has(itemId)) throw new Error(`Year-two recipe input is missing item data: ${recipeId} -> ${itemId}`);
  }
}
if (!waterwayHeluRecipe || waterwayHeluRecipe.unlock_param !== "year2_qinghe_waterway_ready" || !String(waterwayHeluRecipe.input_item_ids || "").includes("crop_water_lotus_seed") || !String(waterwayHeluRecipe.input_item_ids || "").includes("crop_luzhu_qin") || !String(waterwayHeluRecipe.input_item_ids || "").includes("item_material_clean_water")) {
  throw new Error("Waterway Helu Tangshui recipe must turn water-lotus, luzhu qin, and clean water into the drink required by Qinghe's year-two waterway order");
}
if (!localization.find((entry) => entry.text_key === "recipe_name_helu_tangshui_shuihang" && String(entry.zh_cn || "").includes("水航荷露糖水"))) {
  throw new Error("Waterway Helu Tangshui recipe must have Chinese localization");
}
if (!festivalSummerMarket || !festivalSummerMarket.expression.includes("quest_side_0205_qinghe_pond")) {
  throw new Error("Festival summer market unlock must anchor to Qinghe's pond line rather than a missing seasonal runtime");
}
if (!festivalWinterRitual || !festivalWinterRitual.expression.includes("quest_main_0403_pantao_dayan")) {
  throw new Error("Festival winter ritual unlock must anchor to the final banquet completion");
}
if (!chapter4RecipeUnlock || !chapter4RecipeUnlock.expression.includes("world_state_drought")) {
  throw new Error("Chapter-four recipe unlock must anchor to the drought chapter state");
}
for (const order of year2Orders) {
  if (!localization.find((entry) => entry.text_key === order.order_name_key)) throw new Error(`Year-two order is missing localization: ${order.order_id}`);
  if (!rewardPools.some((entry) => entry.reward_pool_id === order.reward_item_group)) throw new Error(`Year-two order reward pool is missing: ${order.order_id}`);
  if (!conditionGroups.find((entry) => entry.condition_group_id === order.appear_condition_group)) throw new Error(`Year-two order unlock condition is missing: ${order.order_id}`);
  for (const itemId of String(order.need_item_ids || "").split("|").filter(Boolean)) {
    if (!itemIds.has(itemId)) throw new Error(`Year-two order needs missing item: ${order.order_id} -> ${itemId}`);
  }
}
if (!year2TownOrder || !String(year2TownOrder.need_item_ids || "").includes("item_food_plain_ration")) {
  throw new Error("Town rebuilding order must consume the newly craftable plain ration staple");
}
if (!year2WaterOrder || year2WaterOrder.appear_condition_group !== "year2_qinghe_waterway_ready" || !String(year2WaterOrder.need_item_ids || "").includes("crop_water_lotus_seed")) {
  throw new Error("Year-two water order must consume the pond-grown water-lotus harvest and unlock from the Qinghe waterway bridge");
}
if (!String(year2WaterOrder.need_item_ids || "").includes("item_fish_spiritling") || !String(year2WaterOrder.need_item_ids || "").includes("item_drink_helu_tangshui")) {
  throw new Error("Year-two water order must combine lotus, pond fish, and waterway drink supplies");
}
if (!year2QingheWaterwayReadyCondition || year2QingheWaterwayReadyCondition.usage_hint !== "order_year2_water_0001" || !String(year2QingheWaterwayReadyCondition.expression || "").includes("npc_qinghe_favor_5") || !String(year2QingheWaterwayReadyCondition.expression || "").includes("qinghe_water_fresh_return_order_done")) {
  throw new Error("Year-two Qinghe waterway order must require both Qinghe favor 5 and the water-fresh return order payoff");
}
if (!year2WaterFollowupOrder || year2WaterFollowupOrder.appear_condition_group !== "qinghe_lotus_basin_followup_order_ready" || Number(year2WaterFollowupOrder.reward_gold || 0) <= Number(year2WaterOrder.reward_gold || 0)) {
  throw new Error("Qinghe lotus-basin follow-up order must unlock after the familiar-route return and pay more than the first waterway order");
}
for (const itemId of ["item_drink_helu_tangshui", "item_food_lingchi_sanxian_geng", "crop_water_lotus_seed"]) {
  if (!String(year2WaterFollowupOrder.need_item_ids || "").includes(itemId)) {
    throw new Error(`Qinghe lotus-basin follow-up order must continue the waterway menu chain with ${itemId}`);
  }
}
if (!qingheLotusBasinFollowupOrderCondition || qingheLotusBasinFollowupOrderCondition.usage_hint !== "order_year2_water_0002" || !String(qingheLotusBasinFollowupOrderCondition.expression || "").includes("qinghe_lotus_basin_trade_return")) {
  throw new Error("Qinghe lotus-basin follow-up order condition must unlock from the first Lianze return flag");
}
if (!qingheLotusBasinFollowupDoneCondition || qingheLotusBasinFollowupDoneCondition.usage_hint !== "customer_waterway_broker" || !String(qingheLotusBasinFollowupDoneCondition.expression || "").includes("qinghe_lotus_basin_followup_order_done")) {
  throw new Error("Completed Qinghe lotus-basin follow-up order must unlock Lianze waterway shop customers");
}
if (!localization.find((entry) => entry.text_key === "order_name_year2_water_0002" && String(entry.zh_cn || "").includes("莲泽熟路"))) {
  throw new Error("Qinghe lotus-basin follow-up order must have a localized Lianze familiar-route name");
}
if (!game.includes("visualType: \"lotus_basin_followup_order\"") || !game.includes("worldChangeByType.has(\"lotus_basin_followup_order\")") || !game.includes("莲泽熟路长单")) {
  throw new Error("Qinghe lotus-basin follow-up order must have a dedicated world visual state and clickable route target");
}
if (!game.includes("莲泽熟路水鲜招牌") || !game.includes("水航水鲜成交预算") || !game.includes("[\"item_drink_helu_tangshui\", \"crop_water_lotus_seed\"].includes(choiceItemId)")) {
  throw new Error("Qinghe lotus-basin follow-up order must upgrade the shop water-fresh aura and include Helu Tangshui in waterway purchase bonuses");
}
if (!game.includes("shopWaterwayBrokerSceneSpec") || !game.includes("shopWaterwayBrokerSceneMarkup") || !game.includes("drawShopWaterwayBrokerScene") || !game.includes("data-shop-board=\"waterway-broker\"") || !game.includes("莲泽客船到店") || !styles.includes("shop-waterway-broker-scene") || !styles.includes("waterway-broker-live")) {
  throw new Error("Qinghe lotus-basin follow-up must surface Lianze waterway customers through shop UI and canvas visuals");
}
if (!game.includes("shopWaterwayShelfSpotlightSpec") || !game.includes("shopWaterwayShelfSpotlightMarkup") || !game.includes("drawShopWaterwayShelfSpotlight") || !game.includes("data-shop-board=\"waterway-shelf\"") || !game.includes("水航水鲜货架") || !styles.includes("shop-waterway-shelf-spotlight") || !styles.includes("waterway-shelf-live")) {
  throw new Error("Qinghe lotus-basin follow-up must highlight waterway shelf goods for Lianze customers");
}
if (!game.includes("shopWaterwayCustomerBrowseSpec") || !game.includes("shopWaterwayCustomerBrowseMarkup") || !game.includes("drawShopWaterwayCustomerBrowse") || !game.includes("data-shop-board=\"waterway-browse\"") || !game.includes("水航客挑货") || !game.includes("entry.reason === \"waterway_browse\"") || !styles.includes("shop-waterway-browse-scene")) {
  throw new Error("Qinghe lotus-basin follow-up must show Lianze waterway customer browsing bubbles and shelf-picking actions");
}
if (!game.includes("createWaterwayBrokerRestockTarget") || !game.includes("shopRestockTargetIsWaterFresh") || !game.includes("lianze_waterway_reorder") || !game.includes("莲泽水航回订补货") || !game.includes("莲泽水航回订追踪") || !styles.includes("sale-row.waterway_reorder")) {
  throw new Error("Qinghe lotus-basin follow-up must convert Lianze waterway browsing into a water-fresh reorder restock target");
}
if (!game.includes("waterwayReorderFollowupSpec") || !game.includes("waterwayReorderFollowupCustomerSupport") || !game.includes("waterway_reorder_followup") || !game.includes("莲泽熟路回访")) {
  throw new Error("Lianze waterway reorder completion must create a visible follow-up visit and long-order shop bonus");
}
if (!game.includes("shopWaterwayReorderFollowupSceneSpec") || !game.includes("shopWaterwayReorderFollowupMarkup") || !game.includes("drawShopWaterwayReorderFollowupScene") || !game.includes("data-shop-board=\"waterway-reorder-followup\"") || !game.includes("水航回订") || !styles.includes("shop-waterway-reorder-followup") || !styles.includes("waterway-reorder-live")) {
  throw new Error("Lianze waterway reorder follow-up must be visible in shop board, canvas, and focused visual feedback");
}
if (!game.includes("waterwayLongOrderLedgerSpec") || !game.includes("maybeRecordWaterwayLongOrderMilestone") || !game.includes("waterwayLongOrderLedgerMarkup") || !game.includes("lianze_waterway_long_order_started") || !game.includes("lianze_waterway_long_order_stable") || !game.includes("莲泽水航长单账") || !styles.includes("shop-waterway-long-order-ledger") || !styles.includes("waterway-long-order-live")) {
  throw new Error("Lianze waterway reorder follow-up must accumulate into a visible long-order ledger and milestone rewards");
}
if (!game.includes("waterwayStandingOrderSupplySpec") || !game.includes("waterwayStandingOrderCustomerSupport") || !game.includes("waterwayStandingOrderSupplyMarkup") || !game.includes("waterwayStandingOrderSupplySummaryText") || !game.includes("drawShopWaterwayStandingOrderSupplyScene") || !game.includes("data-shop-board=\"waterway-standing-order\"") || !game.includes("waterway_standing_order") || !game.includes("莲泽常单备货") || !styles.includes("shop-waterway-standing-order") || !styles.includes("waterway-standing-order-live")) {
  throw new Error("Stable Lianze waterway long orders must expose a standing-order restock board with gameplay support");
}
if (!game.includes("waterwayStandingOrderDaySummarySpec") || !game.includes("focusDaySummaryWaterwayStandingOrder") || !game.includes("data-day-summary-waterway-standing") || !game.includes("明早莲泽常单") || !styles.includes("day-summary-waterway-standing")) {
  throw new Error("Stable Lianze standing orders must appear in day-end planning with actionable restock routes");
}
if (!game.includes("maybeRecordWaterwayStandingOrderTownEcho") || !game.includes("lianze_waterway_standing_order_town_echo_done") || !game.includes("waterway_standing_town_echo") || !game.includes("莲泽常单镇上传话") || !game.includes("recordTownLifeShopMoment") || !game.includes("npc_qinghe")) {
  throw new Error("Stable Lianze standing orders must echo into Qinghe town-life shop moments");
}
if (!game.includes("createWaterwayStandingTownWordOfMouth") || !game.includes("recordWaterwayStandingTownWordOfMouth") || !game.includes("sourceType: \"waterway_standing\"") || !game.includes("preferredArchetypes: [\"waterway_broker\", \"trader\", \"guest\"]") || !game.includes("莲泽常单铺前市闻") || !game.includes("莲泽熟路水鲜") || !game.includes("明日铺前市闻")) {
  throw new Error("Stable Lianze standing-order town echo must become a next-day shop word-of-mouth visit hook");
}
if (!game.includes("shopWordOfMouthWorldNoteSpec") || !game.includes("type: \"shop_word_of_mouth_note\"") || !game.includes("drawShopWordOfMouthWorldNote(ctx)") || !game.includes("target.type === \"shop_word_of_mouth_note\"") || !game.includes("shopWordOfMouthDisplaySpec(day)") || !game.includes("shopWordOfMouthVisitLeadSpec(wordSpec)") || !game.includes(".shop-word-of-mouth-visit") || !game.includes(".shop-word-of-mouth") || !game.includes("铺前市闻来帖 · 可点") || !game.includes("铺前来帖认门 · 可点") || !game.includes("谁传话 -> 谁来认门 -> 头排接货") || !game.includes("只定位旧铺市闻和来帖，不会自动开铺、接客、成交、改价、补货或消耗材料")) {
  throw new Error("Shop word-of-mouth must leave a clickable world note that safely focuses the shop rumor/visit cards without opening the shop or mutating state");
}
if (!game.includes("shopWordOfMouthShelfPrepSpec") || !game.includes("const wordShelf = shopWordOfMouthShelfPrepSpec(goods, shopWordOfMouthDisplaySpec(state.day), ecologyGarden)") || !game.includes("topGood = wordShelf?.topGood") || !game.includes("wordShelf?.selector") || !game.includes("wordOfMouthFocus: Boolean(wordShelf)") || !game.includes("主世界来帖头排推荐") || !game.includes("来帖头排 · 可点") || !game.includes("点选来帖头排推荐") || !game.includes("只定位旧铺市闻和来帖，不会自动开铺、接客、成交、改价、补货或消耗库存")) {
  throw new Error("Shop shelf prep must prioritize word-of-mouth lead goods and safely focus the rumor/visit cards without opening the shop or consuming stock");
}
if (!game.includes("shopWordOfMouthMissingShelfSpec")
  || !game.includes("drawShopWordOfMouthMissingShelfWorldNote(ctx)")
  || !game.includes("type: \"shop_word_of_mouth_missing_shelf_note\"")
  || !game.includes("target.type === \"shop_word_of_mouth_missing_shelf_note\"")
  || !game.includes("shopWordOfMouthLeadItemId")
  || !game.includes("shopWordOfMouthTagRestockItem")
  || !game.includes("waterwayStandingOrderSupplySpec(goods)")
  || !game.includes("shopRestockRouteCandidates({")
  || !game.includes("focusShopRestockRoute(spec.routeAction")
  || !game.includes("来帖缺货签 · 可点")
  || !game.includes("来帖到了，头排还空着")
  || !game.includes("市闻来客 -> 头排缺货 -> 先补路线")
  || !game.includes("缺货先补 · 可点")
  || !game.includes("点选来帖缺货签")
  || !game.includes("只定位补货路线和市闻来帖，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存")) {
  throw new Error("Shop word-of-mouth missing shelf must render a safe world restock note that only focuses recipe/seed/shop routes and never auto-restocks or opens the shop");
}
if (!game.includes("shopWordOfMouthReadyShelfEchoSpec")
  || !game.includes("drawShopWordOfMouthReadyShelfEchoWorldNote(ctx)")
  || !game.includes("type: \"shop_word_of_mouth_ready_shelf_echo\"")
  || !game.includes("target.type === \"shop_word_of_mouth_ready_shelf_echo\"")
  || !game.includes("shopWordOfMouthShelfPrepSpec(goods, wordSpec, ecologyGarden)")
  || !game.includes("if (!wordShelf?.ready) return null")
  || !game.includes("shopShelfPrepWorldBoardFocus = { key: spec.key, day: state.day, itemId: spec.itemId }")
  || !game.includes("queueStoryCompassFocusTarget({")
  || !game.includes("来帖头排备齐签 · 可点")
  || !game.includes("对口货已经回到头排")
  || !game.includes("补货入仓 -> 头排备齐 -> 手动开铺")
  || !game.includes("手动开铺接帖 · 可点")
  || !game.includes("点选来帖头排备齐签")
  || !game.includes("只定位旧铺市闻、来帖和头排货签，不会自动开铺、接客、成交、改价、补货或消耗库存")) {
  throw new Error("Shop word-of-mouth ready shelf must leave a safe completion echo that focuses the rumor and shelf prep without opening the shop or spending inventory");
}
if (!game.includes("shopWordOfMouthSaleEchoWorldSpec")
  || !game.includes("shopWordOfMouthSaleEchoWorldAtCanvasPoint")
  || !game.includes("drawShopWordOfMouthSaleEchoWorld")
  || !game.includes("shopWordOfMouthSaleEchoWorldFocus")
  || !game.includes("type: \"shop_word_of_mouth_sale_echo\"")
  || !game.includes("target?.type === \"shop_word_of_mouth_sale_echo\"")
  || !game.includes("shopWordOfMouthSaleEchoWorldAtCanvasPoint(px, py)")
  || !game.includes("drawShopWordOfMouthSaleEchoWorld(ctx, shopWordOfMouthSaleEchoWorldSpec()")
  || !game.includes("visit?.bought")
  || !game.includes("wordOfMouthLead && entry.reason === \"buy\"")
  || !game.includes("shopWordOfMouthSaleEcho: wordOfMouthSaleEcho")
  || !game.includes("点选来帖成交回响")
  || !game.includes("来帖成交回响 · 可点")
  || !game.includes("市闻真的变成一笔买卖")
  || !game.includes("市闻传来")
  || !game.includes("来客认门")
  || !game.includes("头排接货")
  || !game.includes("成交入账")
  || !game.includes("只回看旧铺报告和市闻来帖，不会自动开铺、接客、成交、改价、补货或消耗库存")) {
  throw new Error("Shop word-of-mouth sale echo must render a safe post-sale recall card that only focuses shop report and rumor cards after a real bought visit");
}
if (!game.includes("shopWordOfMouthSaleReasonWorldSpec")
  || !game.includes("shopWordOfMouthSaleReasonWorldAtCanvasPoint")
  || !game.includes("drawShopWordOfMouthSaleReasonWorld")
  || !game.includes("shopWordOfMouthSaleReasonWorldFocus")
  || !game.includes("type: \"shop_word_of_mouth_sale_reason\"")
  || !game.includes("target?.type === \"shop_word_of_mouth_sale_reason\"")
  || !game.includes("shopWordOfMouthSaleReasonWorldAtCanvasPoint(px, py)")
  || !game.includes("drawShopWordOfMouthSaleReasonWorld(ctx, shopWordOfMouthSaleReasonWorldSpec()")
  || !game.includes("const echo = shopWordOfMouthSaleEchoWorldSpec(opening)")
  || !game.includes("if (!echo) return null")
  || !game.includes("shopWordOfMouthSaleReason: wordOfMouthSaleReason")
  || !game.includes("点选来帖成交三因签")
  || !game.includes("来帖成交三因签 · 可点")
  || !game.includes("这单为什么能成")
  || !game.includes("话头命中")
  || !game.includes("头排有货")
  || !game.includes("买单成立")
  || !game.includes("明日复用")
  || !game.includes("只复盘成交原因和定位旧铺报告，不会自动开铺、接客、成交、改价、补货或消耗库存")) {
  throw new Error("Shop word-of-mouth sale reason card must safely explain why the rumor converted without opening the shop, selling again, restocking, or spending stock");
}
if (!game.includes("shopWordOfMouthFollowupRestockWorldSpec")
  || !game.includes("shopWordOfMouthFollowupRestockWorldAtCanvasPoint")
  || !game.includes("drawShopWordOfMouthFollowupRestockWorld")
  || !game.includes("shopWordOfMouthFollowupRestockWorldFocus")
  || !game.includes("type: \"shop_word_of_mouth_followup_restock\"")
  || !game.includes("target?.type === \"shop_word_of_mouth_followup_restock\"")
  || !game.includes("shopWordOfMouthFollowupRestockWorldAtCanvasPoint(px, py)")
  || !game.includes("drawShopWordOfMouthFollowupRestockWorld(ctx, shopWordOfMouthFollowupRestockWorldSpec()")
  || !game.includes("const reason = shopWordOfMouthSaleReasonWorldSpec(opening)")
  || !game.includes("if (!reason) return null")
  || !game.includes("shopWordOfMouthFollowupRestock: wordOfMouthFollowupRestock")
  || !game.includes("点选来帖续货明日签")
  || !game.includes("来帖续货明日签 · 可点")
  || !game.includes("别让这股口碑断档")
  || !game.includes("今日卖出")
  || !game.includes("明日续货")
  || !game.includes("仍放头排")
  || !game.includes("只提示明日续货和定位旧铺报告，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存")) {
  throw new Error("Shop word-of-mouth follow-up restock sign must safely suggest tomorrow's restock without creating restock targets, opening the shop, or spending stock");
}
if (!game.includes("shopWordOfMouthMorningFollowupSpec")
  || !game.includes("const followup = shopWordOfMouthFollowupRestockWorldSpec(opening)")
  || !game.includes("const sourceDay = Math.max(1, Number(state.day || 1) - 1)")
  || !game.includes("nextDay: state.day")
  || !game.includes("shopWordOfMouthMorningFollowup")
  || !game.includes("state.lastDaySummary?.shopWordOfMouthMorningFollowup")
  || !game.includes("key: \"shop_word_followup\"")
  || !game.includes("action: \"shop_word_followup\"")
  || !game.includes("if (action === \"shop_word_followup\")")
  || !game.includes("shopWordOfMouthMorningFollowupWorldSpec")
  || !game.includes("shopWordOfMouthMorningFollowupWorldAtCanvasPoint")
  || !game.includes("drawShopWordOfMouthMorningFollowupWorld")
  || !game.includes("shopWordOfMouthMorningFollowupWorldFocus")
  || !game.includes("type: \"shop_word_of_mouth_morning_followup\"")
  || !game.includes("target?.type === \"shop_word_of_mouth_morning_followup\"")
  || !game.includes("shopWordOfMouthMorningFollowupWorldAtCanvasPoint(px, py)")
  || !game.includes("drawShopWordOfMouthMorningFollowupWorld(ctx, shopWordOfMouthMorningFollowupWorldSpec()")
  || !game.includes("shopWordOfMouthMorningFollowup: wordOfMouthMorningFollowup")
  || !game.includes("itemId: followup.itemId || \"\"")
  || !game.includes("itemId: summary.itemId || \"\"")
  || !game.includes("shopWordOfMouthRestockedMorningWorldSpec")
  || !game.includes("shopWordOfMouthRestockedMorningWorldAtCanvasPoint")
  || !game.includes("drawShopWordOfMouthRestockedMorningWorld")
  || !game.includes("shopWordOfMouthRestockedMorningWorldFocus")
  || !game.includes("type: \"shop_word_of_mouth_restocked_morning\"")
  || !game.includes("target?.type === \"shop_word_of_mouth_restocked_morning\"")
  || !game.includes("const have = Number(state.inventory[morning.itemId] || 0)")
  || !game.includes("if (have < targetCount) return null")
  || !game.includes("shopWordOfMouthRestockedMorningWorldAtCanvasPoint(px, py)")
  || !game.includes("drawShopWordOfMouthRestockedMorningWorld(ctx, shopWordOfMouthRestockedMorningWorldSpec()")
  || !game.includes("shopWordOfMouthRestockedMorning: wordOfMouthRestockedMorning")
  || !game.includes("shopWordOfMouthRestockCaughtWorldSpec")
  || !game.includes("shopWordOfMouthRestockCaughtWorldAtCanvasPoint")
  || !game.includes("drawShopWordOfMouthRestockCaughtWorld")
  || !game.includes("shopWordOfMouthRestockCaughtWorldFocus")
  || !game.includes("type: \"shop_word_of_mouth_restock_caught\"")
  || !game.includes("target?.type === \"shop_word_of_mouth_restock_caught\"")
  || !game.includes("entry.reason === \"buy\"")
  || !game.includes("&& entry.wordOfMouthLead")
  || !game.includes("&& entry.itemId === morning.itemId")
  || !game.includes("shopWordOfMouthRestockCaughtWorldAtCanvasPoint(px, py)")
  || !game.includes("drawShopWordOfMouthRestockCaughtWorld(ctx, shopWordOfMouthRestockCaughtWorldSpec()")
  || !game.includes("shopWordOfMouthRestockCaught: wordOfMouthRestockCaught")
  || !game.includes("来帖续货清晨提醒")
  || !game.includes("来帖续货清晨灯 · 可点")
  || !game.includes("来帖续货备回签 · 可点")
  || !game.includes("来帖续货接住签 · 可点")
  || !game.includes("昨天的口碑今天别断档")
  || !game.includes("货已经备回，口碑能接住")
  || !game.includes("昨天的口碑今天续上了")
  || !game.includes("昨日卖出")
  || !game.includes("今晨续货")
  || !game.includes("已备回")
  || !game.includes("手动开铺")
  || !game.includes("备回上架")
  || !game.includes("来客再认")
  || !game.includes("续货成交")
  || !game.includes("清晨行动牌：来帖续货")
  || !game.includes("点选来帖续货清晨灯")
  || !game.includes("点选来帖续货备回签")
  || !game.includes("点选来帖续货接住签")
  || !game.includes("只确认库存已备回并定位旧铺报告，不会自动上架、补货、开铺、接客、成交、改价或消耗库存")
  || !game.includes("只回看续货成交和定位旧铺报告，不会自动上架、开铺、接客、成交、改价、补货或消耗库存")
  || !game.includes("只定位旧铺报告和来帖续货复盘，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存")) {
  throw new Error("Shop word-of-mouth follow-up must carry into the next morning action board, world lamp, inventory-gated restocked sign, and same-item caught sale sign without auto-opening or spending stock");
}
if (!game.includes("firstShopSaleTownEchoNpcSpec") || !game.includes("maybeRecordFirstShopSaleTownEcho") || !game.includes("first_shop_sale_town_echo_done") || !game.includes("first_sale_town_echo") || !game.includes("旧铺首单镇上传话") || !game.includes("旧铺第一笔账") || !game.includes("npc_xubo") || !game.includes("npc_zhang_tieshan") || !game.includes("npc_baizhi") || !game.includes("npc_qinghe")) {
  throw new Error("The first shop sale must echo into town-life afterwords with NPC-specific recognition");
}
if (!game.includes("townLifeErrandDeliveryKeepsakeWorldFocus")
  || !game.includes("townLifeErrandDeliveryKeepsakeNodes")
  || !game.includes("townLifeErrandDeliveryKeepsakeSpec")
  || !game.includes("townLifeErrandDeliveryKeepsakeAtCanvasPoint")
  || !game.includes("drawTownLifeErrandDeliveryKeepsakeWorld")
  || !game.includes("focusTownLifeErrandDeliveryConfirm(townLifeErrandDeliveryKeepsakeTarget")
  || !game.includes("交给谁")
  || !game.includes("带什么")
  || !game.includes("确认入口")
  || !game.includes("小托付交付留签 · 可点")
  || !game.includes("只定位确认，不自动交付")) {
  throw new Error("Ready town-life errands must render a visible safe delivery keepsake card with recipient, item, confirmation, and no-auto-delivery safety nodes.");
}
if (!game.includes("townLifeShopMomentBarkSpec") || !game.includes("shopMomentBark: townLifeShopMomentBarkSpec") || !game.includes("rows.find((row) => row.shopMomentBark)") || !game.includes("旧铺后话 ·")) {
  throw new Error("Fresh town-life shop moments must surface as prioritized town canvas speech bubbles");
}
if (!game.includes("townLifeFeaturedBubbleSpec") || !game.includes("townLifeShopMomentBubbleAtCanvasPoint") || !game.includes("ctx.fillText(\"可翻\"") || !game.includes("focusTownLifeShopMomentFromCanvas(townLifeShopMomentBubble") || !game.includes("点选旧铺后话留签")) {
  throw new Error("Fresh town-life shop moment bubbles must be clickable and focus their afterword replay entry safely from the canvas");
}
if (!game.includes("townLifeShopMomentMarkerRect") || !game.includes("townLifeShopMomentMarkerAtCanvasPoint") || !game.includes("drawTownLifeShopMomentMarker") || !game.includes("ctx.fillText(\"旧铺\"") || !game.includes("focusTownLifeShopMomentFromCanvas(townLifeShopMomentMarker") || !game.includes("点选旧铺后话签")) {
  throw new Error("Fresh town-life shop moments must leave safe clickable afterword markers on their NPCs");
}
if (!game.includes("townLifeShopMomentKeepsakeWorldFocus")
  || !game.includes("townLifeShopMomentKeepsakeNodes")
  || !game.includes("townLifeShopMomentKeepsakeSpec")
  || !game.includes("townLifeShopMomentKeepsakeAtCanvasPoint")
  || !game.includes("drawTownLifeShopMomentKeepsakeWorld")
  || !game.includes("focusTownLifeShopMomentFromCanvas(townLifeShopMomentKeepsakeTarget")
  || !game.includes("谁说起")
  || !game.includes("哪笔来往")
  || !game.includes("回看入口")
  || !game.includes("旧铺后话留签 · 可点")
  || !game.includes("只定位回看，不自动播放对白")) {
  throw new Error("Safe town-life shop moment afterwords must render a visible clickable keepsake card with speaker, trade, replay, and safety preview nodes.");
}
if (game.includes("openTownLifeShopMomentPage(townLifeShopMomentBubble.moment.npcId")
  || game.includes("openTownLifeShopMomentPage(townLifeShopMomentMarker.moment.npcId")
  || game.includes("openTownLifeShopMomentPage(spec.npcId, spec.momentId)")) {
  throw new Error("Town-life shop moment canvas/world notes must focus replay entries only, not open pages or inject dialogue directly.");
}
if (!year2GuardOrder || !String(year2GuardOrder.need_item_ids || "").includes("item_tool_signal_flare")) {
  throw new Error("Year-two guard order must consume the patrol flare tool");
}
if (!year2FestivalOrder || !String(year2FestivalOrder.need_item_ids || "").includes("item_gift_archive_scroll")) {
  throw new Error("Year-two festival order must consume the archive scroll gift line");
}
if (!xuboFavorReward) throw new Error("Missing Xubo favor reward level 1");
if (!qingheFavorReward || qingheFavorReward.reward_type !== "scene" || qingheFavorReward.reward_param !== "dialogue_qinghe_favor_1") {
  throw new Error("Qinghe favor level 1 must unlock the pond-teaching scene");
}
if (!qingheFavorDialogue || qingheFavorDialogue.content_key !== "dialogue_qinghe_favor_1_001" || !qingheFavorLine?.zh_cn.includes("池塘")) {
  throw new Error("Qinghe favor level 1 dialogue must be present and mention the pond guidance");
}
if (!qingheFishingNet || !String(qingheFishingNet.tags || "").includes("fishing") || !String(qingheFishingNet.tags || "").includes("water")) {
  throw new Error("Qinghe favor level 2 must have a fishing-net tool item ready");
}
if (!qingheFavor1Condition || !qingheFavor1Condition.expression.includes("npc_favor_level(npc_qinghe)>=1")) {
  throw new Error("Qinghe favor level 1 condition group must exist for the pond-line gate");
}
if (!qingheFavor3Reward || qingheFavor3Reward.reward_type !== "scene" || qingheFavor3Reward.reward_param !== "dialogue_qinghe_favor_3") {
  throw new Error("Qinghe favor level 3 must unlock the pond water-mastery scene");
}
if (!qingheFavor3Dialogue || qingheFavor3Dialogue.content_key !== "dialogue_qinghe_favor_3_001" || !qingheFavor3Line?.zh_cn.includes("水位高一寸低一寸")) {
  throw new Error("Qinghe favor level 3 dialogue must teach pond water-level control");
}
if (!qingheFavor3Condition || !qingheFavor3Condition.expression.includes("npc_favor_level(npc_qinghe)>=3")) {
  throw new Error("Qinghe favor level 3 condition group must exist for the water-control lesson");
}
if (!sideQuest0205 || !sideQuestTrigger0205 || sideQuestTrigger0205.condition_group !== "npc_qinghe_favor_1") {
  throw new Error("Qinghe pond side quest must trigger from the first Qinghe favor gate");
}
if (!fishpondBuilding || fishpondBuilding.unlock_type !== "quest" || fishpondBuilding.unlock_param !== "quest_side_0205_qinghe_pond" || !String(fishpondBuilding.function_tags || "").includes("pond")) {
  throw new Error("Fishpond building must exist and be gated by the Qinghe pond quest");
}
if (!game.includes("qingheWaterTasteNoteSpec") || !game.includes("type: \"qinghe_water_taste_note\"") || !game.includes("drawQingheWaterTasteNote(ctx)") || !game.includes("target.type === \"qinghe_water_taste_note\"") || !game.includes("青禾试水笺 · 可点") || !game.includes("建灵池浅塘")) {
  throw new Error("Qinghe water-taste order payoff must leave a clickable world note that routes into the pond quest and fishpond build");
}
if (!game.includes("pondFirstCatchNoteSpec") || !game.includes("type: \"pond_first_catch_note\"") || !game.includes("drawPondFirstCatchNote(ctx)") || !game.includes("target.type === \"pond_first_catch_note\"") || !game.includes("灵池第一网 · 可点") || !game.includes("试第一网 -> 清波鱼脍配方 -> 水鲜上架")) {
  throw new Error("Built fishpond must leave a clickable first-catch world note that routes into pond catching and the Qingbo dish chain");
}
if (!game.includes("qingboDishRouteNoteSpec") || !game.includes("type: \"qingbo_dish_route_note\"") || !game.includes("drawQingboDishRouteNote(ctx)") || !game.includes("target.type === \"qingbo_dish_route_note\"") || !game.includes("清波鱼脍上案笺 · 可点") || !game.includes("清波鱼脍上架笺 · 可点") || !game.includes("灵鱼 -> 清波鱼脍 -> 旧铺水鲜")) {
  throw new Error("First pond catch must leave a clickable Qingbo Yukuai route note that bridges quest reward, workshop craft, and old-shop sale");
}
if (!game.includes("qingboFirstSaleRestockSeedWorldSpec") || !game.includes("type: \"qingbo_first_sale_restock_seed_note\"") || !game.includes("drawQingboFirstSaleRestockSeedWorldNote(ctx)") || !game.includes("target.type === \"qingbo_first_sale_restock_seed_note\"") || !game.includes("清波鱼脍首卖回头客种子签 · 可点") || !game.includes("水鲜首卖补货缘由 · 可点") || !game.includes("首卖成交 -> 顾客记住 -> 补两份接回头客")) {
  throw new Error("Qingbo first sale must explain why the old shop asks for two restock dishes before returning-customer validation");
}
if (!game.includes("qingboWaterFreshRestockWorldNoteSpec") || !game.includes("type: \"qingbo_water_fresh_restock_note\"") || !game.includes("drawQingboWaterFreshRestockWorldNote(ctx)") || !game.includes("target.type === \"qingbo_water_fresh_restock_note\"") || !game.includes("水鲜补货签 · 可点") || !game.includes("水鲜回头客 · 可点") || !game.includes("补货完成 -> 回头成交 -> 水鲜招牌成型")) {
  throw new Error("Qingbo first sale must leave clickable world follow-up notes for water-fresh restock and returning-customer signature validation");
}
if (!game.includes("lingchiWaterFreshMenuWorldNoteSpec") || !game.includes("type: \"lingchi_water_fresh_menu_note\"") || !game.includes("drawLingchiWaterFreshMenuWorldNote(ctx)") || !game.includes("target.type === \"lingchi_water_fresh_menu_note\"") || !game.includes("灵池三鲜羹上案笺 · 可点") || !game.includes("双水鲜小菜单 · 可点") || !game.includes("清波鱼脍 -> 灵池三鲜羹 -> 双水鲜小菜单")) {
  throw new Error("Qingbo water-fresh signature must leave a clickable Lingchi Sanxian follow-up note that routes into the double water-fresh menu");
}
if (!game.includes("waterFreshRegularPledgeWorldNoteSpec") || !game.includes("type: \"water_fresh_regular_pledge_note\"") || !game.includes("drawWaterFreshRegularPledgeWorldNote(ctx)") || !game.includes("target.type === \"water_fresh_regular_pledge_note\"") || !game.includes("水鲜熟客留单 · 可点") || !game.includes("水鲜熟客明日帖 · 可点") || !game.includes("water_fresh_regular_pledge_")) {
  throw new Error("Lingchi water-fresh menu must leave a clickable regular-customer pledge note that routes into fixed-customer validation");
}
if (!game.includes("waterFreshMenuRegularReasonWorldSpec") || !game.includes("type: \"water_fresh_menu_regular_reason_note\"") || !game.includes("drawWaterFreshMenuRegularReasonWorldNote(ctx)") || !game.includes("target.type === \"water_fresh_menu_regular_reason_note\"") || !game.includes("双水鲜熟客缘由签 · 可点") || !game.includes("水鲜小菜单熟客缘由签 · 可点") || !game.includes("双水鲜同桌 -> 熟客留话 -> 明日回门")) {
  throw new Error("Lingchi water-fresh menu must explain why double water-fresh dishes turn a pledge into a regular-customer route");
}
if (!game.includes("qingheWaterFreshReturnOrderWorldNoteSpec") || !game.includes("type: \"qinghe_water_fresh_return_order_note\"") || !game.includes("drawQingheWaterFreshReturnOrderWorldNote(ctx)") || !game.includes("target.type === \"qinghe_water_fresh_return_order_note\"") || !game.includes("青禾水鲜回订单 · 可点") || !game.includes("回订单可交 · 可点") || !game.includes("order_qinghe_water_fresh_return_0001") || !game.includes("固定熟客 -> 青禾回订 -> 水航鲜货")) {
  throw new Error("Fixed water-fresh regulars must leave a clickable Qinghe return-order note that routes into the order board and year-two waterway prelude");
}
if (!game.includes("qingheWaterwayPreludeWorldNoteSpec") || !game.includes("type: \"qinghe_waterway_prelude_note\"") || !game.includes("drawQingheWaterwayPreludeWorldNote(ctx)") || !game.includes("target.type === \"qinghe_waterway_prelude_note\"") || !game.includes("水航备货牌 · 可点") || !game.includes("水航鲜货可交 · 可点") || !game.includes("青禾五心待稳 · 可点") || !game.includes("order_year2_water_0001") || !game.includes("回订单 -> 青禾五心 -> 水航莲实 -> 灵池水航鲜货单")) {
  throw new Error("Qinghe return-order payoff must leave a clickable waterway prelude note that clarifies year-two, favor, stocking, and delivery states");
}
if (!game.includes("waterFreshReturnToWaterwayReasonWorldSpec") || !game.includes("type: \"water_fresh_return_to_waterway_reason_note\"") || !game.includes("drawWaterFreshReturnToWaterwayReasonWorldNote(ctx)") || !game.includes("target.type === \"water_fresh_return_to_waterway_reason_note\"") || !game.includes("水鲜回订水航缘由签 · 可点") || !game.includes("水航鲜货缘由已齐 · 可点") || !game.includes("旧铺回订 -> 青禾小簿 -> 第二年水航鲜货")) {
  throw new Error("Qinghe return-order payoff must explain why fixed water-fresh demand becomes the year-two waterway route");
}
if (!game.includes("qingheLotusBasinTradeDispatchWorldNoteSpec") || !game.includes("type: \"qinghe_lotus_basin_trade_dispatch_note\"") || !game.includes("drawQingheLotusBasinTradeDispatchWorldNote(ctx)") || !game.includes("target.type === \"qinghe_lotus_basin_trade_dispatch_note\"") || !game.includes("莲泽水航可发队 · 可点") || !game.includes("莲泽商队在途 · 可点") || !game.includes("水航补给有缺 · 可点") || !game.includes("route_lotus_basin_03") || !game.includes("水航鲜货单 -> 莲泽探路 -> 发商队 -> 首次返货")) {
  throw new Error("Qinghe year-two waterway order delivery must leave a clickable Lotus Basin dispatch note that routes into trade preparation, dispatch, and first-return tracking");
}
if (!game.includes("qingheLotusBasinFollowupOrderWorldNoteSpec") || !game.includes("type: \"qinghe_lotus_basin_followup_order_note\"") || !game.includes("drawQingheLotusBasinFollowupOrderWorldNote(ctx)") || !game.includes("target.type === \"qinghe_lotus_basin_followup_order_note\"") || !game.includes("莲泽熟路续订单 · 可点") || !game.includes("莲泽续订可交 · 可点") || !game.includes("order_year2_water_0002") || !game.includes("首次返货 -> 熟路续订 -> 旧铺回订 -> 长单账页")) {
  throw new Error("First Lotus Basin return must leave a clickable follow-up order note that routes into Qinghe's long-route reorder and ledger chain");
}
if (!game.includes("lotusBasinReturnFollowupReasonWorldSpec") || !game.includes("type: \"lotus_basin_return_followup_reason_note\"") || !game.includes("drawLotusBasinReturnFollowupReasonWorldNote(ctx)") || !game.includes("target.type === \"lotus_basin_return_followup_reason_note\"") || !game.includes("莲泽返货续订缘由签 · 可点") || !game.includes("莲泽续订缘由已齐 · 可点") || !game.includes("首次返货 -> 莲泽有人等 -> 熟路续订单")) {
  throw new Error("First Lotus Basin return must explain why a successful return becomes a follow-up reorder");
}
if (!game.includes("qingheLotusBasinLongOrderWorldNoteSpec") || !game.includes("type: \"qinghe_lotus_basin_long_order_note\"") || !game.includes("drawQingheLotusBasinLongOrderWorldNote(ctx)") || !game.includes("target.type === \"qinghe_lotus_basin_long_order_note\"") || !game.includes("莲泽回订补货牌 · 可点") || !game.includes("莲泽长单账 · 可点") || !game.includes("莲泽长单已稳 · 可点") || !game.includes("lianze_waterway_reorder_restock_done") || !game.includes("lianze_waterway_long_order_stable") || !game.includes("续订单 -> 回订补货 -> 水航复访 -> 长单账")) {
  throw new Error("Qinghe Lotus Basin follow-up order must leave a clickable long-order ledger note that routes into reorder restock, revisit, and stable standing-order play");
}
if (!game.includes("qingheLotusBasinStandingOrderWorldNoteSpec") || !game.includes("type: \"qinghe_lotus_basin_standing_order_note\"") || !game.includes("drawQingheLotusBasinStandingOrderWorldNote(ctx)") || !game.includes("target.type === \"qinghe_lotus_basin_standing_order_note\"") || !game.includes("莲泽常单缺口 · 可点") || !game.includes("莲泽常单可传话 · 可点") || !game.includes("莲泽常单不断档 · 可点") || !game.includes("waterwayStandingOrderSupplySpec") || !game.includes("lianze_waterway_standing_order_town_echo_done") || !game.includes("长单稳定 -> 常单备货 -> 青禾传话 -> 镇上后话")) {
  throw new Error("Stable Lianze long orders must leave a clickable standing-order world note that routes into daily supply upkeep and Qinghe town echo");
}
if (!game.includes("qingheWaterwayAfterwordWorldNoteSpec") || !game.includes("type: \"qinghe_waterway_afterword_note\"") || !game.includes("drawQingheWaterwayAfterwordWorldNote(ctx)") || !game.includes("target.type === \"qinghe_waterway_afterword_note\"") || !game.includes("青禾水路小簿 · 可点") || !game.includes("莲泽常单被镇上记住了") || !game.includes("townLifeShopMomentArchiveEntries(\"npc_qinghe\"") || !game.includes("focusTownLifeShopMomentFromCanvas({ npcId: spec.npcId, momentId: spec.momentId }, { source: \"waterway\" })") || !game.includes("常单备货 -> 青禾传话 -> 旧铺后话 -> 关系册")) {
  throw new Error("Qinghe standing-order town echo must leave a clickable waterway afterword note that safely focuses the relationship afterword replay entry");
}
if (!game.includes("qingheWaterwayTownRumorWorldNoteSpec") || !game.includes("type: \"qinghe_waterway_town_rumor_note\"") || !game.includes("drawQingheWaterwayTownRumorWorldNote(ctx)") || !game.includes("target.type === \"qinghe_waterway_town_rumor_note\"") || !game.includes("镇上传话回访灯 · 可点") || !game.includes("镇上传话待续灯 · 可点") || !game.includes("青禾小簿 -> 镇上传话 -> 外来客认门") || !game.includes("只定位青禾关系后话、旧铺回看或常单牌，不会自动寒暄、开铺、领奖、赠礼、交单或消耗材料")) {
  throw new Error("Qinghe waterway town echo must surface a clickable town-rumor lamp that explains how standing orders become shop reputation without mutating state");
}
if (!spiritlingFish || !String(spiritlingFish.tags || "").includes("fish") || !String(spiritlingFish.tags || "").includes("pond")) {
  throw new Error("First pond catch item must exist as a fish-tagged pond material");
}
if (!waterCropIntroRecipe || waterCropIntroRecipe.output_item_id !== "item_food_qingbo_yukuai" || !waterCropIntroRecipe.input_item_ids.includes("item_fish_spiritling") || !waterCropIntroRecipe.input_item_ids.includes("crop_luzhu_qin")) {
  throw new Error("Qinghe pond reward recipe must combine spiritling fish with luzhu qin");
}
if (!waterCropIntroDish || Number(waterCropIntroDish.sell_price_base) <= Number(spiritlingFish?.sell_price_base || 0) || !String(waterCropIntroDish.tags || "").includes("fish")) {
  throw new Error("Qinghe pond reward dish must exist and outvalue the raw spiritling fish");
}
if (!qingboSignatureCondition || !String(qingboSignatureCondition.expression || "").includes("qingbo_water_fresh_signature_line")) {
  throw new Error("Qingbo water-fresh signature condition must exist for the second pond menu recipe");
}
if (!lingchiSanxianRecipe || lingchiSanxianRecipe.output_item_id !== "item_food_lingchi_sanxian_geng" || lingchiSanxianRecipe.unlock_type !== "completed" || lingchiSanxianRecipe.unlock_param !== "qingbo_water_fresh_signature_line" || !lingchiSanxianRecipe.input_item_ids.includes("item_fish_spiritling") || !lingchiSanxianRecipe.input_item_ids.includes("crop_luzhu_qin") || !lingchiSanxianRecipe.input_item_ids.includes("crop_yuewen_huanggua")) {
  throw new Error("Lingchi Sanxian Geng must unlock after the Qingbo water-fresh signature and combine fish, luzhu qin, and yuewen cucumber");
}
if (!lingchiSanxianDish || Number(lingchiSanxianDish.sell_price_base) <= Number(waterCropIntroDish?.sell_price_base || 0) || !String(lingchiSanxianDish.tags || "").includes("water_food") || !String(lingchiSanxianDish.tags || "").includes("fish")) {
  throw new Error("Lingchi Sanxian Geng item must exist as a higher-value fish-tagged water-fresh dish");
}
if (!lingchiRegularsCondition || !String(lingchiRegularsCondition.expression || "").includes("lingchi_water_fresh_regulars") || lingchiRegularsCondition.usage_hint !== "order_qinghe_water_fresh_return_0001") {
  throw new Error("Lingchi water-fresh regulars condition must unlock Qinghe's water-fresh return order");
}
if (!qingheWaterFreshReturnDoneCondition || !String(qingheWaterFreshReturnDoneCondition.expression || "").includes("qinghe_water_fresh_return_order_done") || qingheWaterFreshReturnDoneCondition.usage_hint !== "year2_qinghe_waterway_ready") {
  throw new Error("Qinghe water-fresh return completion flag must bridge into the year-two waterway condition");
}
if (!qingheWaterFreshReturnOrder || qingheWaterFreshReturnOrder.issuer_id !== "npc_qinghe" || qingheWaterFreshReturnOrder.appear_condition_group !== "lingchi_water_fresh_regulars") {
  throw new Error("Qinghe water-fresh return order must be issued by Qinghe after fixed water-fresh regulars form");
}
if (!String(qingheWaterFreshReturnOrder.need_item_ids || "").includes("item_food_qingbo_yukuai") || !String(qingheWaterFreshReturnOrder.need_item_ids || "").includes("item_food_lingchi_sanxian_geng") || !String(qingheWaterFreshReturnOrder.need_item_counts || "").includes("2|1")) {
  throw new Error("Qinghe water-fresh return order must require Qingbo Yukuai x2 and Lingchi Sanxian Geng x1");
}
if (Number(qingheWaterFreshReturnOrder.reward_gold || 0) < 720 || qingheWaterFreshReturnOrder.reward_favor_npc !== "npc_qinghe" || Number(qingheWaterFreshReturnOrder.reward_favor_value || 0) < 8 || Number(qingheWaterFreshReturnOrder.reward_fame || 0) < 5) {
  throw new Error("Qinghe water-fresh return order rewards must make the fixed regulars payoff feel substantial");
}
if (!qingheWaterFreshReturnOrderName || !String(qingheWaterFreshReturnOrderName.zh_cn || "").includes("青禾水鲜回订单")) {
  throw new Error("Qinghe water-fresh return order must have Chinese localization");
}
if (!sideQuestDialogue0205 || sideQuestDialogue0205.dialogue_group_id !== "dialogue_qinghe_quest_0205" || !qinghePondPayoffDialogue || !qinghePondPayoffLine?.zh_cn.includes("一尾")) {
  throw new Error("Qinghe pond first-catch dialogue must resolve through the side quest dialogue map and localization");
}
if (!luoboBond) throw new Error("Missing luobo bond level config");
if (!luoboMood) throw new Error("Missing luobo mood param config");
if (!luoboVoice) throw new Error("Missing luobo work voice config");
if (!luoboFirstEvent || luoboFirstEvent.trigger_condition !== "first_spirit_birth" || luoboFirstEvent.reward_type !== "item") {
  throw new Error("Luobo first spirit event must trigger on first birth and grant an item");
}
if (!luoboFirstMemory || luoboFirstMemory.set_condition !== "spirit_event_luobo_01_complete" || luoboFirstMemory.effect_scope !== "dialogue") {
  throw new Error("Luobo first memory flag must connect to the first spirit event");
}
for (const memory of spiritMemoryFlags) {
  const eventId = memory.set_condition.replace("_complete", "");
  if (!spiritEvents.find((entry) => entry.spirit_event_id === eventId)) throw new Error(`Spirit memory references missing event: ${eventId}`);
}
if (!farmMastery || !expeditionMastery) throw new Error("Missing spirit job mastery configs");
if (!shortExpedition || !shortExpeditionReward) throw new Error("Missing spirit expedition and reward-pool link");
if (!ecologyCombo) throw new Error("Missing spirit ecology combo config");
if (!firstSpiritReward || firstSpiritReward.system_unlock !== "spirit_panel") {
  throw new Error("Early reward pacing must include first-spirit panel unlock");
}
if (!shopPacing || !shopPacing.instant_feedback.includes("顾客")) {
  throw new Error("Early reward pacing must include readable shop-open feedback");
}
if (!repairPacing || !repairPacing.instant_feedback.includes("水流恢复") || !repairPacing.delayed_feedback.includes("水系作物解锁")) {
  throw new Error("Early reward pacing must include visible canal restoration and water-crop unlock feedback");
}
if (!daySummaryPacing || !daySummaryPacing.system_unlock.includes("day_summary")) {
  throw new Error("Early reward pacing must include the day summary hook");
}
if (p0Year2Goals.length < 2 || !dailyYear2Goal || Number(dailyYear2Goal.recommend_weight) < 90) {
  throw new Error("Year-two goal book must include high-priority recommended daily goals");
}
if (!guyuTrial || guyuTrial.term_id !== "term_guyu" || !guyuTrial.score_formula.includes("quality_score")) {
  throw new Error("Year-two solar trial must include the Guyu herb scoring challenge");
}
if (!dashuTrial || !dashuTrial.required_loop_tags.includes("risk_control")) {
  throw new Error("Year-two solar trial must include a Dashu fire risk-control challenge");
}
for (const trial of year2SolarTrials) {
  if (!solarTerms.find((entry) => entry.term_id === trial.term_id)) throw new Error(`Solar trial references missing term: ${trial.term_id}`);
  if (!rewardPools.find((entry) => entry.reward_pool_id === trial.reward_pool_id)) throw new Error(`Solar trial reward pool is missing: ${trial.reward_pool_id}`);
}
if (!hualingEvent || hualingEvent.related_system !== "shop" || !hualingEvent.exclusive_action) {
  throw new Error("Rare spirit event data must connect Hualing first meet to shop actions");
}
if (!hualingEvolutionEvent || hualingEvolutionEvent.related_system !== "shop" || !String(hualingEvolutionEvent.scene_summary || "").includes("按顾客标签")) {
  throw new Error("Rare spirit event data must connect Hualing evolution to customer-tag greeting payoffs");
}
if (!hualingBondFinalEvent || hualingBondFinalEvent.related_system !== "shop_season" || !String(hualingBondFinalEvent.scene_summary || "").includes("无声花市")) {
  throw new Error("Rare spirit event data must connect Hualing bond finale to the silent spring market payoff");
}
if (!shuqiFirstMeetEvent || shuqiFirstMeetEvent.related_system !== "shop_summary" || !String(shuqiFirstMeetEvent.scene_summary || "").includes("少赚")) {
  throw new Error("Ledger-sprite first meet data must connect bookkeeping misses to the shop summary loop");
}
if (!shuqiEvolutionEvent || shuqiEvolutionEvent.related_system !== "shop_season" || !String(shuqiEvolutionEvent.scene_summary || "").includes("评分")) {
  throw new Error("Ledger-sprite evolution data must connect shelf fixes, stronger scoring, and the stock-warning loop");
}
if (!shuqiBondFinalEvent || shuqiBondFinalEvent.related_system !== "shop_settlement" || !String(shuqiBondFinalEvent.scene_summary || "").includes("回忆页")) {
  throw new Error("Ledger-sprite bond finale data must connect the rebuilt ledger, memory pages, and the shop-settlement loop");
}
if (!fengmiEvolutionEvent || fengmiEvolutionEvent.related_system !== "processing" || !String(fengmiEvolutionEvent.scene_summary || "").includes("花蜜")) {
  throw new Error("Honey-sprite evolution data must connect workshop honey blending to the dessert-processing loop");
}
if (!fengmiBondFinalEvent || fengmiBondFinalEvent.related_system !== "shop_season" || !String(fengmiBondFinalEvent.scene_summary || "").includes("百花茶会")) {
  throw new Error("Honey-sprite bond finale data must connect the blossom tea party to the long-run shop-season payoff");
}
if (!rewardPools.some((entry) => entry.reward_pool_id === "pool_reward_trade_thunder" && entry.reward_param === "item_route_rare_material") || !rewardPools.some((entry) => entry.reward_pool_id === "pool_reward_trade_thunder" && entry.reward_param === "item_metal_xuantie")) {
  throw new Error("Hidden thunder route reward pool must include rare caravan salvage and black metal");
}
if (!rareCollectGoal || rareCollectGoal.target_metric !== "rare_spirit_line_count") {
  throw new Error("Freeplay goals must include rare spirit collection metric");
}

const sim = {
  day: 1,
  gold: 80,
  stamina: 100,
  inventory: {
    seed_lingqi_bailuobo: 9,
    crop_lingqi_bailuobo: 0,
    item_food_bailuobo_tang: 0,
  },
  planted: false,
  mature: false,
  spiritUnlocked: false,
  canalRepaired: false,
};

sim.inventory.seed_lingqi_bailuobo -= 3;
sim.planted = true;
sim.stamina -= 18;
sim.day += Number(crop.grow_days);
sim.mature = true;
sim.inventory.crop_lingqi_bailuobo += 3;
sim.spiritUnlocked = true;
sim.stamina -= 12;
sim.inventory.crop_lingqi_bailuobo -= 2;
sim.inventory.item_food_bailuobo_tang += 1;
sim.gold += Number(items.find((item) => item.item_id === "item_food_bailuobo_tang").sell_price_base);
sim.gold += Number(items.find((item) => item.item_id === "crop_lingqi_bailuobo").sell_price_base);
if (sim.gold >= 120) {
  sim.gold -= 120;
  sim.canalRepaired = true;
}

if (!sim.planted || !sim.mature || !sim.spiritUnlocked || !sim.canalRepaired) {
  throw new Error("P0 simulated loop failed");
}

const savePayload = {
  day: 3,
  saveVersion: 2,
  saveMigratedFrom: 1,
  saveMigrationHistory: [{ id: "migration_002_spirit_longterm", from: 1, to: 2, module: "spirits", operation: "add_bond_and_mastery_maps" }],
  saveSchemaReport: { version: 2, required: 15, covered: 15, missing: [] },
  gold: 128,
  stamina: 92,
  fame: 2,
  selected: { x: 2, y: 2 },
  plots: [
    { x: 2, y: 2, cropId: "crop_lingqi_bailuobo", mature: true },
    { x: 6, y: 0, tilled: true, watered: true, cropId: null, seedItemId: null, plantedDay: null, mature: false, debris: "", waterSoil: true, newlyExpanded: true },
  ],
  inventory: { crop_lingqi_bailuobo: 2, seed_luzhu_qin: 4 },
  ecologyDailyState: {
    lastEventDay: 2,
    last: null,
    history: [{ day: 2, comboId: "eco_rain_herb_garden", title: "药圃夜露" }],
    inspectionDay: 3,
    inspectedCombos: ["eco_rain_herb_garden"],
    inspectionHistory: [{ day: 3, comboId: "eco_rain_herb_garden", landmarkLabel: "雨药圃", actionText: "照看药圃", rewardGold: 5, rewardMood: 2 }],
  },
  shopStats: {
    sales: 120,
    soldCount: 4,
    visitors: 6,
    buyers: 4,
    positive: 4,
    themeTotal: 1.5,
    sessions: 2,
    currentSeasonId: "season_shop_001",
    currentCycleStartDay: 1,
    season: {
      sales: 88,
      soldCount: 3,
      visitors: 5,
      buyers: 3,
      positive: 3,
      themeTotal: 1.1,
      sessions: 2,
      itemSales: { item_food_bailuobo_tang: 2 },
      customerVisits: { guest: 2, villager: 3 },
      customerBuys: { guest: 1, villager: 2 },
      themeUsage: { fresh_market: 2 },
      diagnosisCounts: { "今天多位顾客觉得偏贵。": 1 },
    },
    history: [{
      seasonId: "season_shop_001",
      seasonName: "春市新芽榜",
      cycleIndex: 0,
      cycleStartDay: 1,
      cycleEndDay: 30,
      score: 908,
      rankTier: "a",
      weakPart: "顾客评价",
      advice: "多看顾客离店理由，优先修正贵和缺货这两类问题。",
      rewardClaimed: true,
    }],
    pendingSettlement: {
      seasonId: "season_shop_002",
      seasonName: "谷雨灵膳榜",
      cycleIndex: 1,
      cycleStartDay: 31,
      cycleEndDay: 60,
      score: 972,
      rankTier: "s",
      titleLine: "这间店，已经不是凡仙镇的普通铺子了。",
      weakPart: "贵客成交",
      advice: "准备贵客和门派采办偏好的高价值商品，别让他们白跑。",
      rewardClaimed: false,
      reward: { reward_type: "recipe", reward_param: "recipe_guyu_feast_set", reward_count: 1, bonus_buff: "buff_term_profit_bonus", bonus_value: 0.12 },
      parts: [{ displayName: "节气匹配", raw: 96 }],
    },
    activeBuffs: { buff_shop_visit_bonus: 0.06 },
  },
  goalBookState: {
    year2Claims: { ygb_001: "day:3" },
    freeplayClaims: { goal_daily_spirit_care: "day:3" },
    daily: { cycleKey: "day:3", spiritCareCount: 3, ordersDelivered: 1, expeditionsSent: 1 },
    weekly: { cycleKey: "week:0", expeditionComplete: 2 },
    seasonal: { cycleKey: "term:term_jingzhe", flowerThemeCount: 1, lanternDungeonClears: 0 },
    lifetime: { expeditionComplete: 2, solarTrialRankACount: 1 },
  },
  rareSpiritLifeState: {
    cycleKey: "day:3",
    momentsBySpirit: {
      spirit_leizhu_01: {
        spiritId: "spirit_leizhu_01",
        spiritName: "雷竹精",
        lineId: "spirit_line_leizhu",
        focus: "商路旗旁",
        action: "用竹竿点地测风",
        actionShort: "测风引路",
        quote: "这条路我先探。",
        giftItemId: "item_gift_leizhu_bamboo_tag",
        giftName: "雷纹竹签",
        interactionHint: "陪它看风向，偶尔会收到雷纹竹签。",
        giftVerb: "把竹签塞进你掌心，要你别走错路",
        day: 3,
      },
    },
    claimedGiftDays: { spirit_leizhu_01: 3 },
    history: [{
      type: "day_start",
      day: 3,
      spiritId: "spirit_leizhu_01",
      spiritName: "雷竹精",
      lineId: "spirit_line_leizhu",
      focus: "商路旗旁",
      action: "用竹竿点地测风",
      quote: "这条路我先探。",
      detail: "",
    }],
  },
  spiritSproutState: {
    stage: "peek",
    firstSignalDay: 1,
    peekDay: 2,
    birthDay: 0,
    lastPlot: { x: 2, y: 2, cropId: "crop_lingqi_bailuobo" },
    history: [{
      stage: "peek",
      day: 2,
      title: "土里探头",
      detail: "清晨露水还没散，那株萝卜苗忽然露出一点圆脑袋，又飞快缩回土里。",
    }, {
      stage: "tremble",
      day: 1,
      title: "萝卜苗轻颤",
      detail: "田垄里有一株白萝卜苗抖了一下，叶尖冒出小小问号。",
    }],
  },
  workshopAromaState: {
    recipeId: "recipe_bailuobo_tang",
    itemId: "item_food_bailuobo_tang",
    itemName: "白萝卜汤",
    day: 3,
    orderUnlocked: true,
    history: [{
      day: 3,
      recipeId: "recipe_bailuobo_tang",
      itemId: "item_food_bailuobo_tang",
      itemName: "白萝卜汤",
      outputCount: 1,
      firstAroma: true,
    }],
  },
  shopOpeningState: {
    opened: true,
    firstOpenDay: 3,
    firstSaleDay: 3,
    summaryUnlocked: true,
    hotTag: "recover_sp",
    hotTagLabel: "恢复灵食",
    needBubbles: [{
      name: "镇民",
      customerArchetype: "villager",
      tag: "staple",
      text: "想找家常主食",
      detail: "偏好：家常主食 / 热食 / 平价货",
    }],
    firstSale: {
      day: 3,
      name: "镇民",
      itemId: "item_food_bailuobo_tang",
      itemName: "白萝卜汤",
      price: 30,
      reasonText: "进店 → 浏览 → 成交：恢复灵食合口味。",
    },
    lastSession: {
      day: 3,
      visitors: 4,
      buyers: 2,
      sales: 60,
      themeTag: "fresh_market",
      themeName: "早市鲜货陈列",
      themeScore: 78,
      hotTag: "recover_sp",
      hotTagLabel: "恢复灵食",
      compendiumDisplaySummary: "惊蛰雷印 / 谷雨水印 正在镇店",
      compendiumDisplayDetail: "行商 / 镇民 / 医修 会更容易被 恢复灵食 / 水系灵食 / 清净食 的陈列留住。主题映照 +8% · 来客 +1。",
      compendiumDisplays: [{
        key: "area_mine_qingyun:dsm_001",
        title: "惊蛰雷印 陈设",
        shortTitle: "惊蛰雷印",
        customerText: "行商 / 匠师 / 门派采办",
        tagText: "商路稀货 / 金石材料 / 路粮",
      }],
      customerDecisionLedger: {
        day: 3,
        title: "顾客决策账页",
        headline: "白萝卜汤开始被看懂",
        mainCustomer: "镇民",
        mainCustomerArchetype: "villager",
        hotTag: "recover_sp",
        hotTagLabel: "恢复灵食",
        visitors: 4,
        buyers: 2,
        leavers: 1,
        sales: 60,
        conversion: 50,
        themeName: "早市鲜货陈列",
        themeScore: 78,
        summaryLines: ["镇民今天最常进门，热点落在“恢复灵食”。"],
        chains: [{
          name: "镇民",
          need: "想找家常主食",
          result: "成交：买走 白萝卜汤，成交 30 灵石。",
          reason: "恢复灵食合口味",
          advice: "延续 家常主食，明天补一件同标签货。",
          tone: "good",
        }],
        blockers: [{
          reason: "price",
          label: "价签偏高",
          count: 1,
          detail: "顾客不是讨厌这件货，而是觉得今天这个价还需要更多理由。",
          nextAction: "明天先压低 5% 到 10% 价签，等熟客留下再试探利润。",
        }],
        nextAction: "沿着“恢复灵食”补一件同标签加工品。",
        mood: "门口热度稳住了，顾客愿意把理由说出口。",
        evidence: "早市鲜货陈列 · 主题 78% · 收入 60 灵石",
      },
    },
    history: [{
      day: 3,
      visitors: 4,
      buyers: 2,
      sales: 60,
      hotTag: "recover_sp",
      hotTagLabel: "恢复灵食",
      compendiumDisplaySummary: "惊蛰雷印 / 谷雨水印 正在镇店",
      compendiumDisplays: [{
        key: "area_mine_qingyun:dsm_001",
        title: "惊蛰雷印 陈设",
        shortTitle: "惊蛰雷印",
        customerText: "行商 / 匠师 / 门派采办",
        tagText: "商路稀货 / 金石材料 / 路粮",
      }],
      customerDecisionLedger: {
        day: 3,
        title: "顾客决策账页",
        headline: "白萝卜汤开始被看懂",
        mainCustomer: "镇民",
        mainCustomerArchetype: "villager",
        hotTag: "recover_sp",
        hotTagLabel: "恢复灵食",
        visitors: 4,
        buyers: 2,
        leavers: 1,
        sales: 60,
        conversion: 50,
        themeName: "早市鲜货陈列",
        themeScore: 78,
        summaryLines: ["镇民今天最常进门，热点落在“恢复灵食”。"],
        chains: [{
          name: "镇民",
          need: "想找家常主食",
          result: "成交：买走 白萝卜汤，成交 30 灵石。",
          reason: "恢复灵食合口味",
          advice: "延续 家常主食，明天补一件同标签货。",
          tone: "good",
        }],
        blockers: [{
          reason: "price",
          label: "价签偏高",
          count: 1,
          detail: "顾客不是讨厌这件货，而是觉得今天这个价还需要更多理由。",
          nextAction: "明天先压低 5% 到 10% 价签，等熟客留下再试探利润。",
        }],
        nextAction: "沿着“恢复灵食”补一件同标签加工品。",
        mood: "门口热度稳住了，顾客愿意把理由说出口。",
        evidence: "早市鲜货陈列 · 主题 78% · 收入 60 灵石",
      },
      firstOpen: true,
      firstSale: true,
    }],
    restockTarget: {
      id: "shop_restock_item_food_bailuobo_tang_3_1",
      itemId: "item_food_bailuobo_tang",
      itemName: "白萝卜汤",
      desiredCount: 2,
      createdDay: 3,
      dueDay: 5,
      source: "customer_focus",
      reason: "货架太薄",
      note: "从成熟田、工坊或背包去向里接下一步",
      status: "active",
    },
    restockHistory: [{
      id: "shop_restock_item_crop_lingqi_bailuobo_2_1",
      itemId: "item_crop_lingqi_bailuobo",
      itemName: "灵气白萝卜",
      desiredCount: 3,
      createdDay: 2,
      dueDay: 4,
      source: "customer_focus",
      reason: "平价鲜货卖得快",
      note: "从田地补一批鲜货",
      status: "done",
      completedDay: 3,
    }],
  },
  spiritInteractionState: {
    unlocked: true,
    firstDay: 3,
    floatingText: "羁绊 +6",
    last: {
      day: 3,
      spiritId: "spirit_luobo_01",
      spiritName: "大胖萝卜精",
      type: "pet",
      actionText: "大胖萝卜精 往你掌心蹭了蹭，头顶冒出小小灵花",
      quote: "咕。",
      bondGain: 6,
      bondExp: 86,
      bondLevel: 1,
      mood: 100,
      hunger: 88,
      extraText: "",
      firstInteraction: true,
    },
    history: [{
      day: 3,
      spiritId: "spirit_luobo_01",
      spiritName: "大胖萝卜精",
      type: "pet",
      actionText: "大胖萝卜精 往你掌心蹭了蹭，头顶冒出小小灵花",
      quote: "咕。",
      bondGain: 6,
      bondExp: 86,
      bondLevel: 1,
      mood: 100,
      hunger: 88,
      extraText: "",
      firstInteraction: true,
    }],
  },
  canalRestorationState: {
    restored: true,
    day: 3,
    expandedPlots: 12,
    unlockedSeedId: "seed_luzhu_qin",
    unlockedSeedName: "露珠芹种子",
    seedGiftCount: 4,
    waterCropUnlocked: true,
    last: {
      day: 3,
      expandedPlots: 12,
      unlockedSeedId: "seed_luzhu_qin",
      unlockedSeedName: "露珠芹种子",
      seedGiftCount: 4,
      title: "灵渠复流",
      detail: "水声穿过旧渠，右侧新开 12 格水润灵田，露珠芹种子 已可播种。",
    },
    history: [{
      day: 3,
      expandedPlots: 12,
      unlockedSeedId: "seed_luzhu_qin",
      unlockedSeedName: "露珠芹种子",
      seedGiftCount: 4,
      title: "灵渠复流",
      detail: "水声穿过旧渠，右侧新开 12 格水润灵田，露珠芹种子 已可播种。",
    }],
  },
  cohabState: {
    dailySeen: { "cohab_baizhi_01:on_day_start": 3 },
    weeklyClaims: { cohab_weekly_baizhi_01: "week:0" },
    festivalClaims: { cohab_festival_baizhi_01: "festival:term_dongzhi" },
    activeBuffs: {
      buff_trade_margin_up: { value: 0.08, expiresDay: 10, route: "cohab_hu_01" },
    },
    history: [{
      type: "daily",
      epilogueId: "cohab_baizhi_01",
      routeName: "药庐同住",
      eventName: "scene_cohab_baizhi_morning",
      rewardText: "日常对话",
      day: 3,
    }],
  },
  townLifeInteractionState: {
    greetedByDay: { "3:npc_xubo": true },
    giftsByDay: {
      "3:npc_xubo": {
        day: 3,
        npcId: "npc_xubo",
        npcName: "许伯",
        itemId: "item_food_plain_ration",
        itemName: "干粮包",
        favorGain: 5,
        tone: "liked",
        reason: "合 许伯 的 staple / practical 偏好",
      },
    },
    errandsByDay: {
      "3:npc_xubo": {
        day: 3,
        npcId: "npc_xubo",
        npcName: "许伯",
        itemId: "crop_lingqi_bailuobo",
        itemName: "灵气白萝卜",
        count: 2,
        title: "镇公所添菜",
        rewardGold: 24,
        rewardFame: 1,
        rewardFavor: 2,
        completed: true,
        completedDay: 3,
      },
    },
    history: [{
      day: 3,
      npcId: "npc_xubo",
      npcName: "许伯",
      area: "镇公所",
      action: "翻镇务簿",
      status: "work",
      statusLabel: "当值",
      line: "许伯在镇公所跟你寒暄了几句。",
      favorGain: 1,
    }],
    errandHistory: [{
      day: 3,
      npcId: "npc_xubo",
      npcName: "许伯",
      itemId: "crop_lingqi_bailuobo",
      itemName: "灵气白萝卜",
      count: 2,
      title: "镇公所添菜",
      rewardGold: 24,
      rewardFame: 1,
      rewardFavor: 2,
      completed: true,
      completedDay: 3,
    }],
    giftHistory: [{
      day: 3,
      npcId: "npc_xubo",
      npcName: "许伯",
      itemId: "item_food_plain_ration",
      itemName: "干粮包",
      favorGain: 5,
      tone: "liked",
      reason: "合 许伯 的 staple / practical 偏好",
    }],
    interactionCounts: {
      npc_xubo: {
        greet: 1,
        errand: 1,
        gift: 1,
        total: 3,
      },
    },
    memoryByNpc: {
      npc_xubo: {
        xubo_01_trial_stay: {
          day: 3,
          npcId: "npc_xubo",
          npcName: "许伯",
          memoryId: "xubo_01_trial_stay",
          level: 1,
          title: "试住机会",
          summary: "许伯开始把你当成能留下做事的人。",
          line: "三天后你还在，我再当你是自己人。",
          interactions: 3,
        },
      },
    },
    memoryHistory: [{
      day: 3,
      npcId: "npc_xubo",
      npcName: "许伯",
      memoryId: "xubo_01_trial_stay",
      level: 1,
      title: "试住机会",
      summary: "许伯开始把你当成能留下做事的人。",
      line: "三天后你还在，我再当你是自己人。",
      interactions: 3,
    }],
    shopMomentHistory: [{
      id: "npc_xubo|3|item_food_plain_ration|旧铺后话|镇公所",
      day: 3,
      npcId: "npc_xubo",
      npcName: "许伯",
      itemId: "item_food_plain_ration",
      itemName: "干粮包",
      count: 1,
      title: "旧铺后话",
      summary: "许伯把你顺手送到镇公所的干粮包记下了，说夜里值更也算有了旧铺照应。",
      detail: "许伯在镇公所门口收下干粮包，说这口热乎劲比账上记一笔更顶用。",
      line: "有你这口顺手粮，夜里就稳当多了。",
      area: "镇公所",
      rewardText: "18 灵石 · 声望 +1 · 好感 +3",
      memoryTitle: "试住机会",
      sceneTag: "值夜口粮",
      followup: "许伯在意的从来不只是这一口货，而是镇上人夜里还能不能安稳撑住。",
      favorAfter: 16,
      fresh: true,
    }],
    last: {
      day: 3,
      npcId: "npc_xubo",
      npcName: "许伯",
      area: "镇公所",
      action: "翻镇务簿",
      status: "work",
      statusLabel: "当值",
      line: "许伯在镇公所跟你寒暄了几句。",
      favorGain: 1,
    },
    lastMemory: {
      day: 3,
      npcId: "npc_xubo",
      npcName: "许伯",
      memoryId: "xubo_01_trial_stay",
      level: 1,
      title: "试住机会",
      summary: "许伯开始把你当成能留下做事的人。",
      line: "三天后你还在，我再当你是自己人。",
      interactions: 3,
    },
    lastShopMoment: {
      id: "npc_xubo|3|item_food_plain_ration|旧铺后话|镇公所",
      day: 3,
      npcId: "npc_xubo",
      npcName: "许伯",
      itemId: "item_food_plain_ration",
      itemName: "干粮包",
      count: 1,
      title: "旧铺后话",
      summary: "许伯把你顺手送到镇公所的干粮包记下了，说夜里值更也算有了旧铺照应。",
      detail: "许伯在镇公所门口收下干粮包，说这口热乎劲比账上记一笔更顶用。",
      line: "有你这口顺手粮，夜里就稳当多了。",
      area: "镇公所",
      rewardText: "18 灵石 · 声望 +1 · 好感 +3",
      memoryTitle: "试住机会",
      sceneTag: "值夜口粮",
      followup: "许伯在意的从来不只是这一口货，而是镇上人夜里还能不能安稳撑住。",
      favorAfter: 16,
      fresh: true,
    },
  },
  spirits: [{
    id: "spirit_luobo_01",
    name: "大胖萝卜精",
    assignments: 1,
    job: "expedition",
    bondExp: 86,
    bondLevel: 1,
    mood: 100,
    hunger: 88,
    jobExp: { farm: 6, workshop: 2, shop: 1, expedition: 5 },
    jobLevels: { farm: 1, workshop: 0, shop: 0, expedition: 1 },
  }],
  log: [],
  shopReport: [],
  failureCodexState: {
    total: 3,
    byType: { order: 1, risk: 1, dungeon: 1 },
    last: {
      id: "failure_dungeon_area_mine_qingyun:dsm_001",
      type: "dungeon",
      day: 3,
      title: "Boss 失利见闻",
      headline: "青云矿洞 的路感被记住了",
      problem: "裂甲木卫 把你逼退",
      insight: "裂甲木卫 的 P2 起手已经记住了，下次更早能看懂前摇。",
      nextAction: "记住前 3 层 · 路压 -2 · Boss P2",
      support: "下次路压 -2",
      rewardText: "下次路压 -2",
      sourceId: "area_mine_qingyun:dsm_001",
      tone: "boss",
      icon: "魇",
    },
    entries: [{
      id: "failure_dungeon_area_mine_qingyun:dsm_001",
      type: "dungeon",
      day: 3,
      title: "Boss 失利见闻",
      headline: "青云矿洞 的路感被记住了",
      problem: "裂甲木卫 把你逼退",
      insight: "裂甲木卫 的 P2 起手已经记住了，下次更早能看懂前摇。",
      nextAction: "记住前 3 层 · 路压 -2 · Boss P2",
      support: "下次路压 -2",
      rewardText: "下次路压 -2",
      sourceId: "area_mine_qingyun:dsm_001",
      tone: "boss",
      icon: "魇",
    }, {
      id: "failure_risk_event_term_jingzhe_01_7",
      type: "risk",
      day: 3,
      title: "虫路见闻",
      headline: "惊蛰虫害留下了处理线索",
      problem: "惊蛰虫害",
      insight: "虫害退去后，田埂边留下了一串虫路。",
      nextAction: "下次处理：安排巡逻岗或入夜前巡田驱虫。",
      support: "净水 x1",
      rewardText: "净水 x1",
      sourceId: "event_term_jingzhe_01_7",
      tone: "learn",
      icon: "虫",
    }, {
      id: "failure_order_order_demo_0002",
      type: "order",
      day: 3,
      title: "订单补救小票",
      headline: "青禾的清口单 的缺口已写到账页",
      problem: "凉拌灵芹缺 1",
      insight: "先查看生产路线，补齐第一项缺口。",
      nextAction: "先点“看配方”，再回到订单板。",
      support: "净水 x1 已入账 · 添一瓶净水压火候，先把这锅的原料链接起来。",
      rewardText: "净水 x1 已入账 · 添一瓶净水压火候，先把这锅的原料链接起来。",
      sourceId: "order_demo_0002",
      tone: "support",
      icon: "单",
    }],
  },
  completed: ["plant", "harvest", "spirit", "craft", "first_workshop_aroma", "first_shop_opening", "first_shop_sale_summary", "shop", "bond", "first_spirit_interaction", "repair", "first_canal_restoration", "day_summary"],
  completedOrders: ["order_demo_0002"],
  claimedSpiritJobGoals: ["mastery_farm_01"],
  activeRisks: [{ id: "event_term_jingzhe_01_7", eventId: "event_term_jingzhe_01", kind: "pest", resolved: true }],
  resolvedRisks: ["event_term_jingzhe_01"],
  triggeredEvents: ["event_term_jingzhe_01"],
  builtBuildings: ["build_house_start", "build_mill_001"],
  unlockedMachines: ["machine_mill_001"],
  dungeon: {
    areaId: "area_mine_qingyun",
    floor: 3,
    maxFloor: 3,
    hp: 76,
    bossHp: 1120,
    bossMaxHp: 1800,
    bossPhase: 1,
    bossShield: 0,
    turn: 2,
    skillLog: ["裂甲木卫 使用 地裂重锤"],
    loot: [],
    lastLoot: [{ itemId: "item_ore_copper", count: 2 }],
    lastEnemyId: "enemy_mine_rock_bug",
    hazards: [{ id: "dsm_001", label: "雷声震柱", severity: 3 }],
    combatMoment: "boss_exchange",
  },
  dungeonClears: ["area_mine_qingyun"],
  defeatedBosses: ["boss_liejia_muwei"],
  dungeonWorldChanges: [{
    key: "area_mine_qingyun:dsm_001",
    dungeonId: "area_mine_qingyun",
    mechanicId: "dsm_001",
    title: "解锁雷竹商路短线",
    detail: "同一次雷声后激活3根雷木柱",
    rewardHint: "雷纹竹材|雷竹线索",
    visualType: "thunder_route",
    unlockedDay: 3,
  }],
  dungeonFailureInsights: {
    "area_mine_qingyun:dsm_001": {
      key: "area_mine_qingyun:dsm_001",
      dungeonId: "area_mine_qingyun",
      mechanicId: "dsm_001",
      failures: 2,
      lastReason: "boss",
      unlockedDay: 3,
      revealedFloor: 3,
      pathBonus: 2,
      bossPhaseSeen: 2,
      bossGuard: 2,
      overflowRelief: 0,
      note: "裂甲木卫 的 P2 起手已经记住了，下次更早能看懂前摇。",
    },
  },
  dungeonCompendium: {
    "area_mine_qingyun:dsm_001": {
      key: "area_mine_qingyun:dsm_001",
      dungeonId: "area_mine_qingyun",
      mechanicId: "dsm_001",
      dungeonLabel: "青云矿洞",
      termId: "term_jingzhe",
      termLabel: "惊蛰",
      stampLabel: "惊蛰雷印",
      rewardHint: "雷纹竹材|雷竹线索",
      externalChange: "解锁雷竹商路短线",
      puzzleHint: "同一次雷声后激活3根雷木柱",
      shardCount: 3,
      unlocked: true,
      cleared: true,
      clearCount: 1,
      bestFloor: 3,
      bossSeen: true,
      bossPhaseSeen: 2,
      firstShardDay: 3,
      firstUnlockDay: 3,
      firstClearDay: 3,
      lastUpdateDay: 3,
      note: "惊蛰雷印 已真正镇住，可为年轮试炼提供稳定共鸣。",
    },
  },
  rareSpiritClues: [{
    clueId: "clue_rsea_003",
    entryId: "rsea_003",
    spiritId: "spirit_leizhu",
    spiritName: "雷竹精",
    sourceDungeonId: "area_mine_qingyun",
    sourceMechanicId: "dsm_001",
    sceneSummary: "断竹林雷声回响雷竹精跳出",
    exclusiveAction: "竹竿点地测风",
    giftReward: "雷纹竹签",
    unlockedDay: 3,
  }],
  lastSpiritJobReport: [{
    spirit: "大胖萝卜精",
    job: "farm",
    text: "夜里补水 2 块灵田",
    impact: 2,
  }],
  lastSpiritJobSynergy: [{
    id: "farm_workshop",
    jobs: ["farm", "workshop"],
    spirits: ["大胖萝卜精", "小辣椒精"],
    label: "清晨备料链",
    title: "田垄把露水递进灶口",
    rewardText: "净水 x1 · 工坊工时 -6",
    detail: "大胖萝卜精 + 小辣椒精把夜里补下的水和新鲜边料接进工坊。",
    focus: "农田 -> 工坊",
    impact: 2,
    day: 3,
  }],
  spiritJobMilestones: [{
    masteryId: "mastery_farm_03",
    job: "farm",
    level: 3,
    title: "田垄夜露",
    detail: "精怪把水纹压进田埂，第二天泥土会自己发亮。",
    spiritName: "大胖萝卜精",
    visualType: "field_totem",
    unlockedDay: 3,
  }],
  tradeRuns: [{ id: "route_cloudmarket_01_3_1", routeId: "route_cloudmarket_01", startDay: 3, returnDay: 6, cargoValue: 120, risk: 0.16, status: "traveling" }],
  workshopQueue: [{ id: "workshop_recipe_bailuobo_tang_3_1", recipeId: "recipe_bailuobo_tang", outputItemId: "item_food_bailuobo_tang", outputCount: 1, remainingWork: 24, totalWork: 45, machineType: "kitchen" }],
  activeSolarTrial: {
    trialId: "trial_guyu_herb",
    startDay: 3,
    endDay: 6,
    prepDays: 1,
    challengeDays: 3,
    dailyActions: { "day:3": "晒谷雨药簿" },
    metricBoosts: { quality_score: 10, spirit_score: 4 },
    actionLog: [{ day: 3, actionId: "prepare", label: "晒谷雨药簿", phase: "prep", phaseMatched: true, metrics: { quality_score: 10, spirit_score: 4 } }],
  },
  completedSolarTrials: ["trial_dashu_fire"],
  activeDungeonMemoryPage: null,
  activeTownLifeMemoryPage: null,
  activeTownLifeShopMomentPage: null,
  activeCutscene: { id: "cutscene_boss_mingmu_intro", kind: "main", index: 2, startedDay: 3 },
  playedCutscenes: ["scene_side_0101_xubo_bridge_old"],
  completedSpiritEvents: ["spirit_event_luobo_01"],
  completedRareSpiritEvents: ["rsea_003"],
  completedSpiritJobTasks: ["mastery_farm_03"],
  rareSpiritGifts: [{
    entryId: "rsea_003",
    spiritId: "spirit_leizhu",
    spiritName: "雷竹精",
    itemId: "item_gift_leizhu_bamboo_tag",
    giftReward: "雷纹竹签",
    eventStage: "first_meet",
    claimedDay: 3,
  }],
  spiritMemoryFlags: ["memory_luobo_first_gift"],
  unlockedFinalSupports: ["support_bundle_xubo_final"],
  appliedFinalSupportStages: ["stage_xubo_prep"],
  finalSupportPrepClaims: ["support_bundle_xubo_final:intent"],
  finalSupportEffects: { town_worker_capacity: 12 },
  storySeen: ["intro", "plant", "spirit"],
  missionDone: ["quest_main_0001_luojiao_zhidi"],
  activeDialogue: [{ speaker: "许伯", text: "桥通了，人也慢慢多起来了。" }],
  spiritGuaranteed: true,
  canalRepaired: true,
  platformState: {
    adapter: "local-mock",
    sdkReady: false,
    lastAchievementSync: { apiName: "ACH_FIRST_SEED", status: "queued_local_profile" },
    lastCloudSync: { path: "steam_cloud/xiannong_dongtian_profile.json", status: "mirrored_to_local_storage" },
  },
  lastSavedAt: "2026-06-02T00:00:00.000Z",
};

const restored = JSON.parse(JSON.stringify(savePayload));
if (!restored.completed.includes("spirit") || !restored.storySeen.includes("spirit")) {
  throw new Error("Save payload cannot preserve quest or story state");
}
if (restored.saveVersion !== 2 || restored.saveMigratedFrom !== 1 || restored.saveMigrationHistory.length === 0) {
  throw new Error("Save payload cannot preserve schema version or migration history");
}
if (restored.saveSchemaReport.covered !== restored.saveSchemaReport.required || restored.saveSchemaReport.missing.length !== 0) {
  throw new Error("Save payload cannot preserve save schema coverage report");
}
if (restored.platformState.adapter !== "local-mock" || restored.platformState.sdkReady !== false || restored.platformState.lastCloudSync.status !== "mirrored_to_local_storage") {
  throw new Error("Save payload cannot preserve Steamworks platform bridge status");
}
if (restored.shopStats.sales !== 120 || restored.shopStats.sessions !== 2) {
  throw new Error("Save payload cannot preserve shop season statistics");
}
if (restored.shopStats.season.itemSales.item_food_bailuobo_tang !== 2 || restored.shopStats.history[0].rankTier !== "a") {
  throw new Error("Save payload cannot preserve seasonal shop history state");
}
if (restored.shopStats.pendingSettlement.reward.reward_param !== "recipe_guyu_feast_set" || restored.shopStats.activeBuffs.buff_shop_visit_bonus !== 0.06) {
  throw new Error("Save payload cannot preserve pending shop season reward state");
}
if (restored.goalBookState.year2Claims.ygb_001 !== "day:3" || restored.goalBookState.daily.spiritCareCount !== 3) {
  throw new Error("Save payload cannot preserve goal book daily claim state");
}
if (restored.goalBookState.freeplayClaims.goal_daily_spirit_care !== "day:3" || restored.goalBookState.lifetime.solarTrialRankACount !== 1) {
  throw new Error("Save payload cannot preserve goal book long-term progress state");
}
if (restored.rareSpiritLifeState.momentsBySpirit.spirit_leizhu_01.actionShort !== "测风引路" || restored.rareSpiritLifeState.claimedGiftDays.spirit_leizhu_01 !== 3) {
  throw new Error("Save payload cannot preserve rare spirit daily life state");
}
if (restored.spiritSproutState.stage !== "peek" || restored.spiritSproutState.lastPlot.x !== 2 || restored.spiritSproutState.history[0].title !== "土里探头") {
  throw new Error("Save payload cannot preserve first crop spirit sprout foreshadow state");
}
if (!restored.completed.includes("first_workshop_aroma") || restored.workshopAromaState.orderUnlocked !== true || restored.workshopAromaState.itemId !== "item_food_bailuobo_tang" || restored.workshopAromaState.history[0].firstAroma !== true) {
  throw new Error("Save payload cannot preserve first workshop aroma and order unlock state");
}
if (restored.failureCodexState.total !== 3 || restored.failureCodexState.last.type !== "dungeon" || restored.failureCodexState.entries[1].title !== "虫路见闻" || restored.failureCodexState.byType.order !== 1) {
  throw new Error("Save payload cannot preserve failure codex learning state");
}
if (!restored.completed.includes("first_shop_opening") || !restored.completed.includes("first_shop_sale_summary") || restored.shopOpeningState.opened !== true || restored.shopOpeningState.summaryUnlocked !== true || restored.shopOpeningState.firstSale.itemId !== "item_food_bailuobo_tang" || restored.shopOpeningState.needBubbles[0].text !== "想找家常主食" || restored.shopOpeningState.lastSession.compendiumDisplays[0].shortTitle !== "惊蛰雷印" || restored.shopOpeningState.restockTarget.itemId !== "item_food_bailuobo_tang" || restored.shopOpeningState.restockTarget.desiredCount !== 2 || restored.shopOpeningState.restockHistory[0].status !== "done") {
  throw new Error("Save payload cannot preserve first shop opening, need bubbles, first sale summary, and restock tracking state");
}
if (restored.shopOpeningState.lastSession.customerDecisionLedger.mainCustomer !== "镇民" || restored.shopOpeningState.lastSession.customerDecisionLedger.chains[0].tone !== "good" || restored.shopOpeningState.history[0].customerDecisionLedger.blockers[0].label !== "价签偏高") {
  throw new Error("Save payload cannot preserve shop customer decision ledger state");
}
if (!restored.completed.includes("bond") || !restored.completed.includes("first_spirit_interaction") || restored.spiritInteractionState.unlocked !== true || restored.spiritInteractionState.last.bondGain !== 6 || restored.spiritInteractionState.floatingText !== "羁绊 +6") {
  throw new Error("Save payload cannot preserve first spirit interaction and bond feedback state");
}
if (!restored.completed.includes("repair") || !restored.completed.includes("first_canal_restoration") || !restored.completed.includes("day_summary") || restored.canalRepaired !== true || restored.canalRestorationState.expandedPlots !== 12 || restored.canalRestorationState.unlockedSeedId !== "seed_luzhu_qin" || restored.inventory.seed_luzhu_qin !== 4 || restored.plots[1].waterSoil !== true) {
  throw new Error("Save payload cannot preserve first canal restoration, expanded plots, and water-crop unlock state");
}
if (!restored.completedOrders.includes("order_demo_0002")) {
  throw new Error("Save payload cannot preserve the first canal follow-up order completion");
}
if (restored.cohabState.activeBuffs.buff_trade_margin_up.route !== "cohab_hu_01" || restored.cohabState.history[0].routeName !== "药庐同住") {
  throw new Error("Save payload cannot preserve cohab runtime state");
}
if (
  restored.townLifeInteractionState.greetedByDay["3:npc_xubo"] !== true
  || restored.townLifeInteractionState.last.npcId !== "npc_xubo"
  || restored.townLifeInteractionState.errandsByDay["3:npc_xubo"].completed !== true
  || restored.townLifeInteractionState.errandHistory[0].title !== "镇公所添菜"
  || restored.townLifeInteractionState.giftsByDay["3:npc_xubo"].itemId !== "item_food_plain_ration"
  || restored.townLifeInteractionState.giftHistory[0].tone !== "liked"
  || restored.townLifeInteractionState.giftHistory[0].favorGain !== 5
  || restored.townLifeInteractionState.interactionCounts.npc_xubo.total !== 3
  || restored.townLifeInteractionState.memoryByNpc.npc_xubo.xubo_01_trial_stay.title !== "试住机会"
  || restored.townLifeInteractionState.memoryHistory[0].memoryId !== "xubo_01_trial_stay"
  || restored.townLifeInteractionState.lastMemory.title !== "试住机会"
  || restored.townLifeInteractionState.shopMomentHistory[0].area !== "镇公所"
  || restored.townLifeInteractionState.shopMomentHistory[0].rewardText !== "18 灵石 · 声望 +1 · 好感 +3"
  || restored.townLifeInteractionState.shopMomentHistory[0].sceneTag !== "值夜口粮"
  || !restored.townLifeInteractionState.shopMomentHistory[0].followup.includes("夜里")
  || restored.townLifeInteractionState.lastShopMoment.itemName !== "干粮包"
) {
  throw new Error("Save payload cannot preserve town life relationship memory and shop-afterword state");
}
if (!restored.missionDone.includes("quest_main_0001_luojiao_zhidi") || restored.activeDialogue.length === 0) {
  throw new Error("Save payload cannot preserve mission or dialogue state");
}
if (!restored.resolvedRisks.includes("event_term_jingzhe_01") || restored.activeRisks.length === 0) {
  throw new Error("Save payload cannot preserve solar-term risk state");
}
if (!restored.dungeonClears.includes("area_mine_qingyun") || !restored.defeatedBosses.includes("boss_liejia_muwei")) {
  throw new Error("Save payload cannot preserve dungeon clear state");
}
if (restored.dungeon.turn !== 2 || restored.dungeon.skillLog.length === 0) {
  throw new Error("Save payload cannot preserve dungeon skill combat state");
}
if (restored.dungeon.bossHp !== 1120 || restored.dungeon.hazards[0].label !== "雷声震柱" || restored.dungeon.lastEnemyId !== "enemy_mine_rock_bug") {
  throw new Error("Save payload cannot preserve enriched dungeon runtime state");
}
if (restored.dungeonWorldChanges[0].visualType !== "thunder_route" || restored.rareSpiritClues[0].spiritName !== "雷竹精") {
  throw new Error("Save payload cannot preserve dungeon world changes and rare spirit clues");
}
if (restored.dungeonFailureInsights["area_mine_qingyun:dsm_001"].bossPhaseSeen !== 2 || restored.dungeonFailureInsights["area_mine_qingyun:dsm_001"].pathBonus !== 2) {
  throw new Error("Save payload cannot preserve dungeon failure insight memory state");
}
if (restored.dungeonCompendium["area_mine_qingyun:dsm_001"].stampLabel !== "惊蛰雷印" || restored.dungeonCompendium["area_mine_qingyun:dsm_001"].cleared !== true) {
  throw new Error("Save payload cannot preserve dungeon compendium and stamp progression state");
}
if (!restored.tradeRuns?.length || restored.tradeRuns[0].routeId !== "route_cloudmarket_01" || restored.tradeRuns[0].status !== "traveling") {
  throw new Error("Save payload cannot preserve cross-realm trade route state");
}
if (!restored.workshopQueue?.length || restored.workshopQueue[0].recipeId !== "recipe_bailuobo_tang" || restored.workshopQueue[0].remainingWork !== 24) {
  throw new Error("Save payload cannot preserve workshop production queue state");
}
if (
  restored.activeSolarTrial?.trialId !== "trial_guyu_herb"
  || restored.activeSolarTrial.dailyActions["day:3"] !== "晒谷雨药簿"
  || restored.activeSolarTrial.metricBoosts.quality_score !== 10
  || restored.activeSolarTrial.actionLog[0].actionId !== "prepare"
  || !restored.completedSolarTrials.includes("trial_dashu_fire")
) {
  throw new Error("Save payload cannot preserve year-two solar trial state");
}
if (restored.activeDungeonMemoryPage !== null || restored.activeTownLifeMemoryPage !== null || restored.activeTownLifeShopMomentPage !== null) {
  throw new Error("Save payload must clear transient memory page UI state");
}
if (restored.activeCutscene?.id !== "cutscene_boss_mingmu_intro" || !restored.playedCutscenes.includes("scene_side_0101_xubo_bridge_old")) {
  throw new Error("Save payload cannot preserve cutscene playback state");
}
if (!restored.completedSpiritEvents.includes("spirit_event_luobo_01") || !restored.spiritMemoryFlags.includes("memory_luobo_first_gift")) {
  throw new Error("Save payload cannot preserve spirit event and memory state");
}
if (!restored.claimedSpiritJobGoals.includes("mastery_farm_01")) {
  throw new Error("Save payload cannot preserve claimed spirit job goals");
}
if (restored.lastSpiritJobReport[0].job !== "farm" || restored.lastSpiritJobReport[0].impact !== 2) {
  throw new Error("Save payload cannot preserve spirit job settlement report");
}
if (restored.lastSpiritJobSynergy[0].id !== "farm_workshop" || restored.lastSpiritJobSynergy[0].label !== "清晨备料链") {
  throw new Error("Save payload cannot preserve spirit job synergy chain state");
}
if (restored.spiritJobMilestones[0].visualType !== "field_totem" || restored.spiritJobMilestones[0].title !== "田垄夜露") {
  throw new Error("Save payload cannot preserve spirit job milestone scene state");
}
if (!restored.completedSpiritJobTasks.includes("mastery_farm_03")) {
  throw new Error("Save payload cannot preserve completed spirit job tasks");
}
if (!restored.completedRareSpiritEvents.includes("rsea_003") || restored.rareSpiritGifts[0].itemId !== "item_gift_leizhu_bamboo_tag") {
  throw new Error("Save payload cannot preserve rare spirit event gifts");
}
if (restored.ecologyDailyState.inspectionDay !== 3 || restored.ecologyDailyState.inspectedCombos[0] !== "eco_rain_herb_garden" || restored.ecologyDailyState.inspectionHistory[0].landmarkLabel !== "雨药圃") {
  throw new Error("Save payload cannot preserve ecology landmark inspection state");
}
if (!restored.unlockedFinalSupports.includes("support_bundle_xubo_final") || !restored.appliedFinalSupportStages.includes("stage_xubo_prep") || !restored.finalSupportPrepClaims.includes("support_bundle_xubo_final:intent")) {
  throw new Error("Save payload cannot preserve final support unlock and stage state");
}
if (Number(restored.finalSupportEffects.town_worker_capacity) !== 12) {
  throw new Error("Save payload cannot preserve final support effect totals");
}
if (!restored.builtBuildings.includes("build_mill_001") || !restored.unlockedMachines.includes("machine_mill_001")) {
  throw new Error("Save payload cannot preserve building and machine state");
}
if (restored.spirits[0].job !== "expedition" || restored.spirits[0].jobLevels.expedition !== 1) {
  throw new Error("Save payload cannot preserve spirit job mastery state");
}

console.log("Playable slice verification passed.");
console.log("P0 loop verified: plant -> mature -> harvest -> spirit -> craft -> sell -> repair.");
console.log("Persistence verified: save payload preserves day, inventory, spirits, quests, and story beats.");
console.log("Demo flow verified: mission and NPC dialogue data are present and connected.");
