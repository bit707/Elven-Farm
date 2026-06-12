const DUNGEON_NAME_ALIASES = {
  dungeon_name_qingyun_mine: "青云矿洞",
  dungeon_name_herb_valley: "雾隐药谷",
  dungeon_name_fire_ruin: "炽砂遗迹",
  dungeon_name_final_nest: "噬灵螟巢",
};

const ENEMY_NAME_ALIASES = {
  enemy_name_mine_rock_bug: "岩甲虫",
  enemy_name_mine_moss_slime: "苔石泥灵",
  enemy_name_mine_bat: "回声蝠",
  enemy_name_herb_pollen_moth: "药粉蛾",
  enemy_name_herb_spore_beast: "孢囊兽",
  enemy_name_fire_sand_lizard: "炽砂蜥",
  enemy_name_fire_ember_wisp: "余烬游魂",
  enemy_name_final_parasite_drone: "噬灵寄蜂",
  enemy_name_final_shell_guard: "螟壳卫",
};

const BUILDING_NAME_ALIASES = {
  building_name_house_start: "草庐",
  building_name_storage_001: "小仓房",
  building_name_lingjing_001: "灵井",
  building_name_mill_001: "磨坊",
  building_name_alchemy_001: "药炉",
  building_name_furnace_001: "熔炉",
  building_name_bridge_repair: "断桥修复",
  building_name_spirit_manor: "百怪大院",
  building_name_solar_array_final: "二十四节气大阵",
  build_workshop_signboard: "工坊招牌",
  build_shop_title_plaque: "名铺匾额",
};

const MACHINE_NAME_ALIASES = {
  machine_name_kitchen_handmade: "临时灶台",
  machine_name_mill_001: "石磨机",
  machine_name_alchemy_001: "小药炉",
  machine_name_furnace_001: "铜火熔炉",
  machine_name_kitchen_001: "灶房",
};

const RECIPE_NAME_ALIASES = {
  recipe_qingchao_baicai: "清炒白菜",
};

const AREA_NAME_ALIASES = {
  area_town_hall: "镇公所",
  area_town_main: "凡仙镇街",
  area_town_well: "古井旁",
  area_blacksmith: "铁匠铺",
  area_clinic: "医馆",
  area_teahouse: "茶寮",
  area_festival_ground: "节庆广场",
  area_market_guest: "客商市集",
  area_town_gate: "镇门",
  area_carpenter: "木作棚",
  area_farm_mid: "灵田中段",
  area_riverbank: "清河岸",
  area_old_canal: "旧灵渠",
  area_guest_inn: "客栈静室",
  area_training_slope: "练剑坡",
  area_herb_valley: "雾隐药谷",
  area_ruin_fire: "炽砂遗迹",
  area_none: "外出未归",
};

function fallbackLocalize(key, fallback = key) {
  return fallback;
}

function resolveLocalize(localize) {
  return typeof localize === "function" ? localize : fallbackLocalize;
}

export function dungeonNameData(dungeon, localize) {
  const text = resolveLocalize(localize);
  return DUNGEON_NAME_ALIASES[dungeon?.area_name_key] || text(dungeon?.area_name_key, dungeon?.area_id || "未知秘境");
}

export function enemyNameData(enemy, localize) {
  const text = resolveLocalize(localize);
  return ENEMY_NAME_ALIASES[enemy?.enemy_name_key] || text(enemy?.enemy_name_key, enemy?.enemy_id || "未知敌人");
}

export function bossNameData(bossId, options = {}) {
  const text = resolveLocalize(options.localize);
  const boss = options.bossesById?.get?.(bossId);
  return boss ? text(boss.boss_name_key, boss.boss_id) : bossId;
}

export function skillNameData(skill, localize) {
  const text = resolveLocalize(localize);
  return text(skill?.skill_name_key, skill?.boss_skill_id || skill?.skill_id || "未知技能");
}

export function buildingNameData(building, localize) {
  const text = resolveLocalize(localize);
  if (typeof building === "string") return BUILDING_NAME_ALIASES[building] || building;
  return BUILDING_NAME_ALIASES[building?.building_name_key] ||
    BUILDING_NAME_ALIASES[building?.building_id] ||
    text(building?.building_name_key, building?.building_id || "未知建筑");
}

export function machineNameData(machine, localize) {
  const text = resolveLocalize(localize);
  return MACHINE_NAME_ALIASES[machine?.machine_name_key] || text(machine?.machine_name_key, machine?.machine_id || "未装设备");
}

export function recipeNameData(recipe, localize) {
  const text = resolveLocalize(localize);
  return RECIPE_NAME_ALIASES[recipe.recipe_id] || text(recipe.recipe_name_key, recipe.recipe_id);
}

export function areaNameData(areaId) {
  return AREA_NAME_ALIASES[areaId] || areaId;
}
