# `src/game.js` 拆分规划

## 背景

`src/game.js` 当前约 10.8 万行、4.9MB，承担了数据加载、全局状态、核心玩法、面板渲染、Canvas 绘制、点击命中、存档、平台桥接和大量剧情/后期内容。它已经超过单文件可维护边界。

项目已有一条低风险迁移路线：把纯规则逐步迁入 `src/core/**/*.ts`，由 `tsconfig.json` 输出到 `src/runtime/xiannong-core.js`，再让 `src/game.js` 作为浏览器壳层调用。后续拆分应继续沿用这条路线，避免一次性重写。

## 拆分目标

- 降低单文件体积，把 `src/game.js` 从“所有系统混在一起”拆成可定位的功能板块。
- 保持当前 Web Canvas + Electron/Tauri 桌面壳路线，不改变技术栈。
- 保持 CSV 驱动和现有 `npm run verify` 门禁。
- 每次迁移都能独立验证，不为了拆文件牺牲可玩性或稳定性。

## 推荐目录结构

```text
src/
  game/
    main.js                 # 新入口：初始化、启动循环、绑定模块
    context.js              # state/data/settings/refs/actions 的统一上下文
    data-files.js           # DATA_FILES、资源清单、CSV 加载 glue
    state/
      defaults.js           # 初始 state/settings/default factories
      normalize.js          # normalize/createInitial* 迁移区
      save-adapter.js       # serialize/hydrate/save/load 与桌面桥接 glue
    shared/
      format.js             # itemName/localize/percentText/signedPercent 等
      selectors.js          # selectorDataValue、focus queue 公共工具
      canvas.js             # drawCanvasCard、通用图形、命中矩形工具
      safety.js             # world click 安全审计辅助常量
    systems/
      farming.js            # 种植、作物成长、田块交互 glue
      spirits.js            # 精怪、岗位、羁绊、精怪事件 glue
      workshop.js           # 工坊队列、流水线、加工反馈 glue
      shop.js               # 店铺经营、顾客反馈、赛季面板 glue
      quests.js             # 主线/支线 UI glue，核心规则继续在 src/core/quests
      dungeon.js            # 秘境运行 UI glue，核心规则继续在 src/core/combat
      npc.js                # 关系、同住、镇民生活 glue
      year2.js              # 第二年目标册、十日谱、自由游玩 glue
      platform.js           # 成就、Steamworks、云存档状态 glue
    ui/
      render-inventory.js
      render-spirits.js
      render-goal-book.js
      render-missions.js
      render-shop.js
      render-build.js
      render-panels.js       # 统一 render 调度
    world/
      draw-world.js          # drawWorld 主调度
      click-dispatch.js      # Canvas 点击命中顺序
      layers/
        farming-layer.js
        spirit-layer.js
        workshop-layer.js
        shop-layer.js
        dungeon-layer.js
        year2-layer.js
    input/
      controls.js            # 键盘/手柄/按钮事件绑定
```

## 模块边界

### 1. `context`

`context` 是拆分安全的关键。不要让每个模块互相 import 大量函数。推荐由 `main.js` 创建并传入：

```js
const ctx = {
  state,
  data,
  settings,
  refs,
  images,
  actions,
  services,
};
```

各模块导出 `registerX(ctx)` 或 `renderX(ctx)`，减少循环依赖。

### 2. `systems`

`systems` 放“玩法壳层”：读取 `state/data`、调用 `src/core` 规则、触发日志、反馈和渲染标记。纯计算规则优先继续迁入 `src/core/**/*.ts`。

### 3. `ui`

`ui` 只负责 DOM 面板渲染和按钮 data 属性。不要在 `render*` 中直接执行消耗资源、领奖、推进时间等副作用，按钮仍交给事件处理器确认。

### 4. `world`

`world` 分两层：

- `draw-world.js` 保留主世界绘制顺序。
- `layers/*.js` 放某一系统的 `spec / draw / atCanvasPoint / focusFromCanvas`。

Canvas 点击分发统一放 `world/click-dispatch.js`，继续保留“只定位/预览，不自动消耗”的安全约束。

### 5. `shared`

只放无业务状态或弱业务状态工具。不要把大系统塞进 `shared`，否则会变成第二个巨型文件。

## 迁移顺序

### 阶段 0：冻结行为基线

- 继续使用现有 `src/game.js` 作为入口。
- 每次迁移前后运行 `node --check src/game.js` 与 `npm run verify`。
- 不在同一批次同时做大规模重构和玩法新增。

### 阶段 1：抽常量和通用工具

优先迁移风险最低的内容：

- `DATA_FILES` 到 `src/game/data-files.js`
- `assetSrc / embeddedCsvText / selectorDataValue`
- 通用格式化函数
- 通用 Canvas 函数，如 `drawCanvasCard`

目标：先让 `game.js` 减少约 1,000 到 3,000 行，同时验证模块加载方式。

### 阶段 2：抽渲染面板

从文件尾部开始拆，因为依赖最集中、入口清晰：

- `renderInventory`
- `renderSpirits`
- `renderGoalBook`
- `renderOrders`
- `renderBuildPanel`
- `renderShop`
- `renderDungeonPanel`

目标：每次只迁移 1 到 2 个 `render*`，迁移后保持 UI 行为一致。

### 阶段 3：抽 Canvas 世界层

按系统拆 `spec / draw / hit / focus` 四件套：

- 精怪自动化与岗位层
- 工坊流水线层
- 店铺顾客反馈层
- 秘境与战斗层
- 第二年目标层

目标：`drawWorld()` 最终只保留调度顺序，不再包含具体绘制实现。

### 阶段 4：抽输入和事件分发

最后迁移：

- `bindControls`
- `bindKeyboardInput`
- `pollGamepadInput`
- `world click dispatch`
- DOM panel click handlers

原因：事件分发最容易引入行为回归，应在渲染和系统边界稳定后再拆。

### 阶段 5：继续 TypeScript 核心迁移

对于纯规则，优先迁到 `src/core/**/*.ts`：

- 剩余任务副作用规划
- 精怪岗位结算规则
- 工坊队列结算规则
- 第二年目标推荐规则
- Canvas 安全命中数据结构类型

`src/game/**` 保持为壳层，`src/core/**` 保持为可测试规则层。

## 不建议的拆法

- 不建议一次性把 `game.js` 按行数切成 `part1.js/part2.js`，这只会把问题搬家。
- 不建议马上引入大型框架重写 UI，当前风险高于收益。
- 不建议先拆事件处理器，因为它依赖几乎所有系统。
- 不建议在拆分过程中改 CSV schema、玩法数值和视觉表现，除非该迁移必须。

## 每批迁移门禁

每批拆分至少满足：

```powershell
node --check src/game.js
npm run verify
```

如果新增模块：

- 模块必须通过浏览器 `type="module"` 路径加载。
- 不能破坏 `src/runtime/xiannong-core.js` 先于游戏入口加载。
- 不能把 Canvas 点击变成自动领取、自动交单、自动消耗资源。
- 不能删除现有 CSV 驱动路径和桌面存档桥接。

## 推荐第一批实际拆分

第一批建议只做低风险入口验证：

1. 新建 `src/game/shared/selectors.js`，迁移 `selectorDataValue`。
2. 新建 `src/game/shared/canvas.js`，迁移 `drawCanvasCard` 和矩形命中工具。
3. 新建 `src/game/data-files.js`，迁移 `DATA_FILES`。
4. 修改 `src/game.js` 顶部 import 这些模块。
5. 跑 `node --check src/game.js` 和 `npm run verify`。

这批能证明 ESM 拆分路径可行，同时不会碰复杂业务。

### 第一批落地状态

- 已完成：`selectorDataValue` 拆到 `src/game/shared/selectors.js`。
- 已完成：`drawCanvasCard` 拆到 `src/game/shared/canvas.js`。
- 已完成：`DATA_FILES` 拆到 `src/game/data-files.js`。
- 已完成：`CAPTURE_SCENES`、`ASSET_SOURCES`、`STEAM_READY_ASSETS`、`assetSrc` 和 `embeddedCsvText` 拆到 `src/game/assets.js`。
- 已完成：`SAVE_KEY`、`SAVE_PROFILE_ID`、`SETTINGS_KEY`、`BUILD_INFO`、`STEAMWORKS_BRIDGE` 等运行配置拆到 `src/game/config.js`。
- 已完成：通用 DOM 焦点高亮与面板列显示 helper 拆到 `src/game/shared/focus.js`，各业务函数仍负责设置/清空自己的 focus target、写日志和触发渲染。
- 已完成：`renderStory`、`renderQuests`、`renderLogs` 的纯 DOM 构建拆到 `src/game/ui/basic-panels.js`，`src/game.js` 保留同名包装函数以兼容现有调用点。
- 已完成：`renderAcceptancePanel`、`renderSaveSchemaPanel`、`renderLocalizationPanel`、`renderCommunityPanel`、`renderConditionPanel` 的 QA/计划展示 DOM 构建拆到 `src/game/ui/qa-panels.js`，继续通过参数注入数据和 helper，避免循环依赖。
- 已完成：`renderReleasePanel`、`renderAchievementPanel`、`renderPlatformPanel` 的发行/平台展示 DOM 构建拆到 `src/game/ui/platform-panels.js`，平台按钮事件仍保留在原绑定逻辑中。
- 已完成：`renderAssetPanel` 的素材证据与 Steam-ready 展示 DOM 构建拆到 `src/game/ui/asset-panel.js`，继续通过参数注入素材配置和证据 helper。
- 已完成：`renderTermPanel` 的节气/天气/田间提示 DOM 构建拆到 `src/game/ui/term-panel.js`，节气规则和按钮事件仍保留在原系统逻辑中。
- 已完成：`renderSolarTrialPanel` 的第二年节气试炼展示 DOM 构建拆到 `src/game/ui/solar-trial-panel.js`，试炼开启与行动按钮事件仍保留在原绑定逻辑中。
- 已完成：`renderOrders`、`renderRisks` 的订单/节气风险 DOM 构建拆到 `src/game/ui/order-risk-panels.js`，订单交付、补救、配方定位和风险处理事件仍保留在原绑定逻辑中。
- 已完成：`renderInventory` 的背包/收获去向/旧铺补货提示 DOM 构建拆到 `src/game/ui/inventory-panel.js`，背包按钮事件仍保留在原绑定逻辑中。
- 已完成：`renderBuildPanel` 的工坊、建设总览、灵池和百怪大院 DOM 构建拆到 `src/game/ui/build-panel.js`，排产、建造、补料定位和调水事件仍保留在原绑定逻辑中。
- 已完成：`renderDungeonPanel` 的秘境进行中、隐藏入口、章节提示和可进入秘境 DOM 构建拆到 `src/game/ui/dungeon-panel.js`，进入、探索、调谐、Boss 和撤离事件仍保留在原绑定逻辑中。
- 已完成：`renderShopSeasonPanel` 的第二年名铺赛季、节气陈设、灯影/书契/蜂蜜精扩展和第二年订单预览 DOM 构建拆到 `src/game/ui/shop-season-panel.js`，赛季奖励、回忆页、灯路、账页和茶会事件仍保留在原绑定逻辑中。
- 已完成：`renderDialogue`、`renderCutscenePanel` 的对白舞台、演出管线、镇民记忆、旧铺后话和秘境回忆页 DOM 构建拆到 `src/game/ui/narrative-panels.js`，跳过对白、播放演出、下一镜头、关闭记忆页等事件仍保留在原绑定逻辑中。
- 已完成：`renderFinalSupportPanel` 的终阵准备、NPC 支援、阶段应用和预备支援 DOM 构建拆到 `src/game/ui/final-support-panel.js`，激活支援、阶段写入和预备支援领取事件仍保留在原绑定逻辑中。
- 已完成：`renderRelationships` 的凡仙镇今日动线、NPC 关系卡、同住状态、记忆册、旧铺后话、赠礼和支线反馈 DOM 构建拆到 `src/game/ui/relationship-panel.js`，寒暄、托付、赠礼、同住事件、记忆页和旧铺后话事件仍保留在原绑定逻辑中。
- 已完成：`renderShop` 的旧铺试营业看板、成交流水、口碑来客、水路常单、天气货架和顾客反馈 DOM 构建拆到 `src/game/ui/shop-panel.js`，开店、补货、陈列定位和成交相关事件仍保留在原绑定逻辑中。
- 已完成：`renderTradeRoutes` 的跨界商路、补给预览、路上事件、隐藏秘境轮换和发队按钮 DOM 构建拆到 `src/game/ui/trade-route-panel.js`，探路、发商队和分支选择事件仍保留在原绑定逻辑中。
- 已完成：`renderSpirits` 的精怪队列、岗位按钮、伙伴回应、岗位熟练、生态共鸣、精怪事件入口和商路附加渲染拆到 `src/game/ui/spirit-panel.js`，摸摸、喂食、切岗、派遣、精怪事件和商队事件仍保留在原绑定逻辑中。
- 已完成：`renderMissions` 的主线任务书、主线罗盘、序章/经营路标、每日意图、旧铺来帖、章节提示、支线线索和青禾灵池提示拆到 `src/game/ui/mission-panel.js`，主线导航、任务图鉴、支线领取与路线按钮事件仍保留在原绑定逻辑中。
- 已完成：`renderDaySummaryPanel` 的入夜日结、明日建议、成熟地块去向、旧铺补货、天气货架、水路常单、伙伴夜勤、镇民小景和主线后日回响拆到 `src/game/ui/day-summary-panel.js`，日结回看、定位、补货、天气、常单和小景按钮事件仍保留在原绑定逻辑中。
- 已完成：`renderGoalBook` 的每日主轴、照应札记、第二年目标、自由目标、失败见闻、生态庭院、秘境图鉴、任务作物图鉴、稀有精怪图鉴、精怪事件和岗位修行 DOM 构建拆到 `src/game/ui/goal-book-panel.js`，目标领取、图鉴过滤、事件定位、修行奖励和回看按钮事件仍保留在原绑定逻辑中。
- 已完成：`renderDemoGuideProgress`、`renderDemoGuide`、`renderPanelTabs` 和 `renderSelectedPlotCard` 的新手引导进度、引导卡片、面板分组标签与选中地块卡片 DOM 构建拆到 `src/game/ui/shell-panels.js`，引导行动、面板切换和地块操作事件仍保留在原绑定逻辑中。
- 已完成：`selectedPlotDetailSpec`、`selectedPlotRouteActionsMarkup`、`inventoryRouteActionsMarkup` 和 `inventoryRouteStatusMarkup` 的地块详情、种后/作物去向与背包去向提示拆到 `src/game/ui/selected-plot-panel.js`，清理、播种、浇水、收获、订单、配方和旧铺定位事件仍保留在原绑定/玩法逻辑中。
- 已完成：`plotClearedVeinMemory`、`plotFirstSeedMemory` 和 `plotSpiritSproutMemory` 的地块记忆展示计算拆到 `src/game/ui/plot-memory.js`，`src/game.js` 保留同名包装函数注入 `state`、`itemName` 和成精状态 helper，不触碰清理、播种、浇水、收获或精怪协助事件。
- 已完成：`seedSolarRecommendation`、`solarFieldSeedCandidate`、`cropGrowthMemoToneSpec`、`cropGrowthMemoReason` 和 `cropGrowthMemoActionForRow` 的节气推荐、田垄候选种子评分、田垄长势样式、说明文案与定位入口计算拆到 `src/game/ui/crop-guidance.js`，Canvas 命中、日志、聚焦、播种、浇水、收获、库存消耗和时间推进仍保留在原系统逻辑中。
- 已完成：`solarFieldDecisionBoardSpec`、`solarFieldDecisionBoardMarkup` 和 `drawSolarFieldDecisionBadges` 的“田垄节气看板”rows/spec、按钮 markup 与 Canvas 徽章绘制拆到 `src/game/ui/crop-guidance.js`，`focusSolarFieldBoardPlot` 仍留在 `src/game.js` 负责聚焦、选中地块、脉冲和视觉调度。
- 已完成：`cropGrowthMemoWorldRows`、`cropGrowthMemoWorldSpec` 和 `cropGrowthMemoWorldAtCanvasPoint` 的田垄长势小札 rows/spec/命中计算拆到 `src/game/world/crop-growth-memo.js`，绘制、点击聚焦、日志、选中地块和脉冲反馈仍留在 `src/game.js` 的原系统逻辑中。
- 已完成：`drawCropGrowthMemoWorld` 的田垄长势小札 Canvas 绘制实现拆到 `src/game/world/crop-growth-memo.js`，`src/game.js` 只保留同名包装并注入 `settings`、`state`、`cropGrowthMemoWorldFocus`、`cropGrowthMemoToneSpec` 和 `drawCanvasCard`；点击聚焦、日志、选中地块和 pulse 反馈仍未迁移。
- 已完成：`cropWorldGrowthVisualSpec` 的 runtime fallback 与 `drawCropWorldGrowthVisual` 的作物长势 Canvas 绘制实现拆到 `src/game/world/crop-growth-visual.js`，`src/game.js` 继续保留 runtime 优先逻辑和同名包装函数；作物生长结算、浇水、收获、点击命中和世界绘制调度均未迁移。
- 已完成：`termLearningTagText`、`weatherWaterLearningText`、`termLearningCardSpec` 和 `termLearningCardMarkup` 的节气学习卡说明与 markup 构建拆到 `src/game/ui/term-panel.js`，`src/game.js` 保留同名包装以供节气面板与“今日画境”复用；不会自动播种、浇水、收获、开铺、处理风险或推进时间。
- 已完成：`solarTermMoodSceneSpec` 和 `solarTermMoodSceneMarkup` 的“今日画境”说明卡与按钮 markup 构建拆到 `src/game/ui/term-panel.js`，`focusSolarTermMoodScene` 仍留在 `src/game.js` 处理实际定位与日志；不会自动播种、浇水、收获、开铺、派工、处理风险、入夜或消耗资源。
- 已完成：`solarTermMoodPalette`、`solarTermMoodWorldPlaqueSpec`、`solarTermMoodWorldPlaqueAtCanvasPoint` 和 `drawSolarTermMoodWorldPlaque` 的“今日画境”主世界小牌 palette/spec/命中/绘制实现拆到 `src/game/world/solar-term-mood-plaque.js`，`focusSolarTermMoodWorldPlaqueFromCanvas` 仍留在 `src/game.js` 记录 trail、写日志并打开节气面板。
- 已完成：`solarTermMoodClamp`、`solarTermMoodRouteGlyph`、`solarTermMoodRouteAnchor`、`solarTermMoodRouteRect`、`solarTermMoodWorldRouteTargets` 和 `solarTermMoodWorldRouteAtCanvasPoint` 的“今日画境”四路地标 target/rect/命中计算拆到 `src/game/world/solar-term-mood-plaque.js`，`focusSolarTermMoodWorldRouteFromCanvas` 与 `drawSolarTermMoodWorldRoutes` 仍留在 `src/game.js`。
- 已完成：`drawSolarTermMoodWorldRoutes` 的“今日画境”四路地标 Canvas 绘制实现拆到 `src/game/world/solar-term-mood-plaque.js`，`focusSolarTermMoodWorldRouteFromCanvas` 仍留在 `src/game.js` 记录 trail、写日志并定位对应面板。
- 已完成：`normalizeSolarTermMoodTrailEntry`、`solarTermMoodTrailForDay` 和 `recordSolarTermMoodTrail` 内部的 next-list 合并/去重纯计算拆到 `src/game/world/solar-term-mood-plaque.js`，`recordSolarTermMoodTrail` 仍留在 `src/game.js` 负责实际 state 写入与印记归档同步。
- 已完成：`solarTermMoodRouteKeyFromTrail`、`solarTermMoodProgressSpec`、`solarTermMoodStampArchiveEntryForDay` 和 `normalizeSolarTermMoodStampArchiveEntry` 的“今日画境”四路进度与印记归档纯计算拆到 `src/game/world/solar-term-mood-plaque.js`，`recordSolarTermMoodTrail` 与 `syncSolarTermMoodStampArchiveForDay` 仍留在 `src/game.js` 处理实际 state 写入。
- 已完成：`solarTermMoodStampArchiveRows`、`solarTermMoodStampArchiveSpec` 和 `solarTermMoodStampArchiveMarkup` 的目标册“节气画境印记”展示行、汇总 spec 与按钮 markup 拆到 `src/game/world/solar-term-mood-plaque.js`，`focusSolarTermMoodStampArchive` 与 `focusSolarTermMoodStampArchiveRoute` 仍留在 `src/game.js` 处理日志和定位。
- 已完成：`solarTermMoodShopDisplaySpec`、`solarTermMoodShopDisplayCustomerEchoSpec`、`solarTermMoodShopDisplayCustomerEchoMarkup`、`solarTermMoodShopDisplayDaySummarySpec`、`solarTermMoodShopDisplayDaySummaryMarkup` 和 `solarTermMoodShopDisplayMarkup` 的旧铺“画境印记陈设架”、来客回响与日终回响展示计算/markup 拆到 `src/game/world/solar-term-mood-plaque.js`，`focusSolarTermMoodShopDisplay`、`focusDaySummarySolarMoodShopDisplay` 和所有日志/定位副作用仍留在 `src/game.js`。
- 已完成：`solarTermMoodShopDisplayWorldSpec`、`solarTermMoodShopDisplayWorldAtCanvasPoint` 和 `drawSolarTermMoodShopDisplayWorld` 的旧铺“画境印记陈设架”Canvas spec、命中与绘制实现拆到 `src/game/world/solar-term-mood-plaque.js`，`focusSolarTermMoodShopDisplayWorld` 仍留在 `src/game.js` 负责写日志并定位目标册印记。
- 已完成：`solarTermMoodStampArchiveWorldRelicSpec`、`solarTermMoodStampArchiveWorldRelicAtCanvasPoint` 和 `drawSolarTermMoodStampArchiveWorldRelic` 的主世界“画境印匣”Canvas spec、命中与绘制实现拆到 `src/game/world/solar-term-mood-plaque.js`，`focusSolarTermMoodStampArchiveWorldRelic` 仍留在 `src/game.js` 负责 focus 状态、日志和目标册/今日画境定位。
- 已完成：`solarTermMoodCompletionSealSpec`、`solarTermMoodCompletionSealAtCanvasPoint` 和 `drawSolarTermMoodCompletionSeal` 的主世界“今日画境合图印”Canvas spec、命中与绘制实现拆到 `src/game/world/solar-term-mood-plaque.js`，`focusSolarTermMoodCompletionSealFromCanvas` 仍留在 `src/game.js` 负责 focus 状态、日志和今日画境定位。
- 已完成：`solarTermMoodDaySummaryInsight` 的日终“今日画境回响”汇总文案与 progress 合并计算拆到 `src/game/world/solar-term-mood-plaque.js`，`focusDaySummarySolarTermMood` 仍留在 `src/game.js` 负责日终日志和今日画境定位。
- 已完成：`failureCodexWorldTone`、`failureCodexWorldPalette`、`failureCodexWorldTargetSpec`、`failureLearningTriptychSpec`、`failureLearningTriptychMarkup`、`failureCodexWorldBoardSpec`、`failureCodexWorldBoardAtCanvasPoint`、`failureRecoveryRouteWorldRect`、`failureRecoveryRouteWorldSpec`、`failureRecoveryRouteWorldAtCanvasPoint`、`failureMercyLanternWorldSpec`、`failureMercyLanternWorldAtCanvasPoint`、`drawFailureCodexWorldBoard`、`drawFailureRecoveryRouteWorld` 和 `drawFailureMercyLanternWorld` 的失败见闻/补救路线/不白走灯展示计算、Canvas 命中与绘制实现拆到 `src/game/world/failure-codex.js`，`recordFailureCodexEntry`、focus 状态写入、日志和面板定位仍留在 `src/game.js`。
- 已完成：`readyOrderWorldRows`、`readyOrderWorldBoardSpec`、`readyOrderWorldBoardAtCanvasPoint`、`readyOrderSealSafetyText`、`readyOrderSealNodes`、`readyOrderSealWorldSpec`、`readyOrderSealWorldAtCanvasPoint`、`drawReadyOrderWorldBoard` 和 `drawReadyOrderSealWorld` 的主世界可交订单与“订单备齐封签小景”rows/spec、安全文案、节点、Canvas 命中与绘制实现拆到 `src/game/world/ready-order-world.js`，`focusReadyOrderWorldBoardFromCanvas`、`focusReadyOrderSealWorldFromCanvas`、日志和订单板定位仍留在 `src/game.js`。
- 已完成：`orderDeliveryEchoSafetyText`、`orderDeliveryEchoSpec`、`orderDeliveryEchoWorldSpec`、`orderDeliveryEchoWorldAtCanvasPoint` 和 `drawOrderDeliveryEchoWorld` 的“订单交付回响留签”安全文案、spec、Canvas 命中与绘制实现拆到 `src/game/world/ready-order-world.js`，`recordOrderDeliveryEcho`、`focusOrderDeliveryEchoWorldFromCanvas`、state 写入、日志和订单板定位仍留在 `src/game.js`。
- 已完成：`orderRewardNextUseSafetyText`、`orderRewardNextUseWorldSpec`、`orderRewardNextUseWorldAtCanvasPoint` 和 `drawOrderRewardNextUseWorld` 的“回款下一步”安全文案、world spec、Canvas 命中与绘制实现拆到 `src/game/world/ready-order-world.js`，`orderRewardNextUseSeedCandidate`、`orderRewardNextUseCandidate`、`focusOrderRewardNextUseWorldFromCanvas`、日志、选中种子/配方和面板定位仍留在 `src/game.js`。
- 已完成：`orderRewardReinvestTrailSafetyText`、`orderRewardReinvestTrailWorldSpec`、`orderRewardReinvestTrailWorldAtCanvasPoint` 和 `drawOrderRewardReinvestTrailWorld` 的“回款再投入账串”安全文案、world spec、Canvas 命中与绘制实现拆到 `src/game/world/ready-order-world.js`，`orderRewardNextUseCandidate`、`focusOrderRewardReinvestTrailWorldFromCanvas`、日志和下一步定位仍留在 `src/game.js`。
- 已完成：`seedRestockBagSafetyText`、`seedRestockBagFeedbackSpec`、`seedRestockBagWorldSpec`、`seedRestockBagWorldAtCanvasPoint` 和 `drawSeedRestockBagWorld` 的“补种入袋去向签”安全文案、feedback spec、Canvas 命中与绘制实现拆到 `src/game/world/field-action-feedback.js`，`recordSeedRestockFeedback`、`focusSeedRestockBagWorldFromCanvas`、state 写入、选中空田、脉冲、日志和播种入口定位仍留在 `src/game.js`。
- 已完成：`plantingAftercareSafetyText`、`plantingAftercareFeedbackSpec`、`plantingAftercareWorldSpec`、`plantingAftercareWorldAtCanvasPoint` 和 `drawPlantingAftercareWorld` 的“落土补水签”安全文案、feedback spec、Canvas 命中与绘制实现拆到 `src/game/world/field-action-feedback.js`，`recordPlantingAftercareFeedback`、`focusPlantingAftercareWorldFromCanvas`、state 写入、选中田块、脉冲、日志和补水/入夜入口定位仍留在 `src/game.js`。
- 已完成：`manualWaterAfterglowSafetyText`、`manualWaterAfterglowFeedbackSpec`、`manualWaterAfterglowWorldSpec`、`manualWaterAfterglowWorldAtCanvasPoint` 和 `drawManualWaterAfterglowWorld` 的“补水润田入夜签”安全文案、feedback spec、Canvas 命中与绘制实现拆到 `src/game/world/field-action-feedback.js`，`recordManualWaterAfterglowFeedback`、`focusManualWaterAfterglowWorldFromCanvas`、state 写入、选中田块、脉冲、日志和入夜/收获入口定位仍留在 `src/game.js`。
- 已完成：`morningGrowthDewSafetyText`、`morningGrowthDewWorldSpec`、`morningGrowthDewWorldAtCanvasPoint` 和 `drawMorningGrowthDewWorld` 的“晨露长势牌”安全文案、world spec、Canvas 命中与绘制实现拆到 `src/game/world/field-action-feedback.js`，`morningGrowthDewGrowingPlot`、成熟收获计划、路线徽章计算、`focusMorningGrowthDewWorldFromCanvas`、state 写入、选中田块、脉冲、日志和收获/补水入口定位仍留在 `src/game.js`。
- 已完成：`harvestStorageRouteSafetyText`、`harvestStorageRouteFeedbackSpec`、`harvestStorageRouteWorldSpec`、`harvestStorageRouteWorldAtCanvasPoint` 和 `drawHarvestStorageRouteWorld` 的“收获入仓去向留签”安全文案、feedback spec、Canvas 命中与绘制实现拆到 `src/game/world/field-action-feedback.js`，`recordHarvestStorageRouteFeedback`、库存与路线读取、`focusHarvestStorageRouteWorldFromCanvas`、state 写入、选中田块、脉冲、日志和背包/订单/配方/旧铺入口定位仍留在 `src/game.js`。
- 已完成：`matureHarvestBasketSafetyText`、`matureHarvestBasketRouteNodes`、`matureHarvestBasketWorldSpec`、`matureHarvestBasketWorldAtCanvasPoint` 和 `drawMatureHarvestBasketWorld` 的“成熟入筐去向小景”安全文案、路线节点、world spec、Canvas 命中与绘制实现拆到 `src/game/world/field-action-feedback.js`，`harvestRouteWorldRows`、路线徽章计算、`focusMatureHarvestBasketWorldFromCanvas`、state 写入、选中田块、脉冲、日志和订单/配方/旧铺入口定位仍留在 `src/game.js`。
- 已完成：`harvestRouteWorldBoardSpec`、`harvestRouteWorldBoardAtCanvasPoint` 和 `drawHarvestRouteWorldBoard` 的“今日收成去向牌”world spec、Canvas 命中与绘制实现拆到 `src/game/world/field-action-feedback.js`，`harvestRouteWorldRows`、优先级排序、路线徽章计算、`focusHarvestRouteWorldBoardFromCanvas`、state 写入、选中田块、脉冲、日志和订单/配方/旧铺入口定位仍留在 `src/game.js`。
- 已完成：`drawNightGrowthRouteBadge` 的“夜间生长路线徽章”Canvas 绘制实现拆到 `src/game/world/field-action-feedback.js`，`src/game.js` 仅保留包装函数，负责注入 `settings.reducedMotion` 与 `nightGrowthRouteBadgeSpec`。
- 已完成：`drawMorningHarvestPlanFlags` 的“清晨收获计划小旗”Canvas 绘制实现拆到 `src/game/world/field-action-feedback.js`，`activeMorningHarvestPlans`、路线规整、路线徽章计算和动效时间读取仍留在 `src/game.js`。
- 已完成：`drawSleepPrepChecklistCard` 的“入夜前准备卡”Canvas 绘制实现拆到新模块 `src/game/world/daily-action-cards.js`，`sleepPrepChecklistSpec`、当天日终摘要抑制判断、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawMorningActionBoardCard` 的“清晨行动牌”Canvas 绘制实现拆到 `src/game/world/daily-action-cards.js`，`morningActionBoardSpec`、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSolarMorningSignBadge` 的“节气晨签徽章”Canvas 绘制实现拆到 `src/game/world/daily-action-cards.js`，`solarMorningSignSpec`、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawDailyIntentWorldGuide` 的“今日主轴世界引导牌”Canvas 绘制实现拆到新模块 `src/game/world/daily-intent-world.js`，`dailyIntentWorldSpec`、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`，`tools/verify.mjs` 已把新模块纳入静态审计。
- 已完成：`drawDailyIntentFeedback` 的“今日主轴回响卡”Canvas 绘制实现拆到 `src/game/world/daily-intent-world.js`，`activeDailyIntentFeedback` 的生命周期/过期清理、palette fallback、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawDailyIntentWorldEcho` 的“今日主轴世界回响”Canvas 绘制实现拆到 `src/game/world/daily-intent-world.js`，`activeDailyIntentFeedback`、目标点计算、palette fallback、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawDailyIntentWorldScenes` 的“今日主轴留痕小景”Canvas 绘制实现拆到 `src/game/world/daily-intent-world.js`，`dailyIntentWorldSceneTargets`、trend/命中/聚焦逻辑、palette 函数、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawNewPlayerTutorWorld` 的“新手三步口授牌”Canvas 绘制实现拆到新模块 `src/game/world/new-player-tutor-world.js`，`newPlayerTutorWorldSpec`、Canvas 命中、聚焦、state 写入、按钮定位、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`，`tools/verify.mjs` 已把新模块纳入静态审计。
- 已完成：`fieldActionFeedbackSpec` 和 `colorWithAlpha` 的“田块动作反馈配置/颜色工具”实现拆到 `src/game/world/field-action-feedback.js`，`src/game.js` 保留同名包装函数以兼容现有绘制与 verify 审计。
- 已完成：`drawTownLifeErrandRouteWorldFocus` 的“城镇生活委托备货路线聚焦”Canvas 绘制实现拆到新模块 `src/game/world/town-life-world.js`，`townLifeErrandRouteWorldFocus` 的生命周期、过期清理、命中与实际定位副作用仍留在 `src/game.js`，`tools/verify.mjs` 已把新模块纳入静态审计。
- 已完成：`drawLayeredHills` 和 `drawCanalAndTown` 的主世界背景山丘、雾带、水渠与镇口建筑 Canvas 绘制实现拆到新模块 `src/game/world/background-world.js`，节气气氛、`state.canalRepaired`、动效开关和世界绘制顺序仍留在 `src/game.js`，`tools/verify.mjs` 已把新模块纳入静态审计。
- 已完成：`drawSpiritAura` 和 `drawSpiritCropScoutWorld` 的精怪随行光环与作物巡视提示卡 Canvas 绘制实现拆到新模块 `src/game/world/spirit-world.js`，`spiritCropScoutWorldSpec`、命中、聚焦、state 写入、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`，`tools/verify.mjs` 已把新模块纳入静态审计。
- 已完成：`drawSpiritJobShiftTheaterWorld` 的“主世界精怪岗位班次/岗位小剧场”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritJobShiftTheaterWorldSpec`、命中、聚焦、state 写入、伙伴栏定位、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritJobEffect` 的“精怪岗位视觉特效”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，岗位读取、巡逻风险判断、动效开关、精怪世界调度与 `spiritVisualProfile` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritWorkRangeAura` 的“精怪工作范围光环/进化范围标签”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritWorkRangeSpec`、阶段/范围计算、`spiritVisualProfile`、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritJobPersonaBubble` 的“精怪岗位短句气泡”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritJobPersonaSpec`、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritWorldLifeStatus` 的“精怪今日状态浮签”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritWorldLifeStatusSpec`、心情/饱腹/体力状态计算、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritDailyChoreProp` 的“精怪岗位小动作道具卡”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritDailyChoreSpec`、岗位/节气/协作状态计算与动效开关注入仍留在 `src/game.js`。
- 已完成：`drawSpiritCompanionCareHint` 的“精怪陪伴照料提示/喂食小徽章”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritCompanionCanvasSpec`、陪伴状态计算、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritIdentityMemoryNameplate` 的“场景伙伴名牌/名字行为浮签”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritIdentityMemoryNameplateSpec`、Canvas 命中、伙伴栏聚焦、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritFinaleCompanionAnchor` 的“精怪终章陪伴锚点/终章标签”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritFinaleCompanionSpec`、终章事件状态判断、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritMoodRepairWorldScene` 的“精怪心情安抚小事世界提示卡”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritMoodRepairWorldSpec`、Canvas 命中、聚焦状态、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritCareNeedWorldBoard` 的“精怪照料需求提示板/下一步照料卡”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritCareNeedWorldBoardSpec`、Canvas 命中、聚焦状态、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritJobShiftFeedback` 的“精怪岗位调度反馈飞行动画/回声卡”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`activeSpiritJobShiftFeedback`、过场对白抑制、起终点/ease 计算、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritNightWorkFeedback` 的“精怪夜勤回声/协作链结算反馈”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`activeSpiritNightWorkFeedback`、过场对白抑制、age/progress/wave 计算、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritSprite` 的“精怪本体形态/名字牌”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritVisualProfile`、精怪图片资源、bob 动效计算与同名兼容包装函数仍留在 `src/game.js`。
- 已完成：`drawSpiritInteractionWorldEcho` 的“伙伴回应世界回响卡/摸摸喂食反馈”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritInteractionWorldEchoTarget`、spec 构造、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritBondHeartlineWorld` 的“精怪互动羁绊心线/三步进度卡”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritBondHeartlineWorldSpec`、Canvas 命中、聚焦状态、动效开关与 `drawCanvasCard` 注入仍留在 `src/game.js`。
- 已完成：`drawSpiritInteractionMemoryTriptychWorld` 的“精怪互动记忆三联画/生活图鉴提示卡”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritInteractionMemoryTriptychWorldSpec`、Canvas 命中、聚焦状态、伙伴栏/生活图鉴定位和动效开关注入仍留在 `src/game.js`。
- 已完成：`drawFirstTwoSpiritDuoWorld` 的“萝卜精 x 辣椒火灵双精怪协作小景”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`firstTwoSpiritDuoWorldSpec`、Canvas 命中、聚焦状态、伙伴栏定位、工坊队列/任务状态读取和动效开关注入仍留在 `src/game.js`。
- 已完成：`drawRareSpiritTheaterGlyph` 和 `drawRareSpiritTheaterMoment` 的“稀有精怪小剧场图标/互动卡”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`spiritVisualProfile`、`spiritLine`、互动目标判断、过场返回、稀有精怪状态同步和其它稀有精怪卡片调度仍留在 `src/game.js`。
- 已完成：`drawRareSpiritDailyStageWorld` 的“主世界稀有精怪生活舞台”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`rareSpiritDailyStageWorldSpec`、Canvas 命中、聚焦定位、`spiritVisualProfile` 行颜色计算、稀有精怪状态读取和动效开关注入仍留在 `src/game.js`。
- 已完成：`drawRareSpiritWorldInvitation` 的“稀有精怪事件可触发邀请卡”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`rareSpiritWorldInvitationSpec`、事件筛选、Canvas 命中、目标册定位、palette/motion/glyph 注入仍留在 `src/game.js`。
- 已完成：`drawRareSpiritClueRoadsignWorld` 的“稀有精怪线索风铃路牌”Canvas 绘制实现继续拆到 `src/game/world/spirit-world.js`，`rareSpiritClueRoadsignWorldSpec`、线索筛选、Canvas 命中、目标册定位、聚焦状态、palette/motion/glyph 注入仍留在 `src/game.js`。
- 已完成：`tools/build-runtime-data.mjs` 已适配新数据清单模块，并保留旧 `src/game.js` 内联清单 fallback。
- 已完成：`tools/package-standalone.mjs` 已内联 `src/game/**` 本地模块，避免离线单文件包被 ESM import 破坏。
- 已完成：`tools/verify.mjs` 已把拆分模块纳入静态审计，避免门禁继续假设所有内容必须留在 `src/game.js`。
- 已验证：`node --check` 覆盖入口、拆分模块和受影响工具脚本；`npm run verify` 与 `npm run package:standalone` 通过。

下一批建议继续拆 `renderDaySummaryPanel` 或 `renderGoalBook` 这种仍在 `src/game.js` 中的大型结算/目标展示，每批只迁移 1 个，仍保留 `src/game.js` 同名包装函数。

## 中期目标

当阶段 1 到 3 完成后，`src/game.js` 应缩到 10,000 到 20,000 行以内，主要职责变成：

- 创建上下文。
- 初始化数据和存档。
- 注册系统模块。
- 调用 `render()` 与 `drawWorld()` 调度。
- 维护少量跨系统 glue。

真正的玩法规则、UI 渲染、Canvas 层和输入处理应分散到对应目录。
