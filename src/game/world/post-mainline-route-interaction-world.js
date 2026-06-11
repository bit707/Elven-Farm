export function postMainlineRouteWorldTargets({
  routeSpec = null,
  todayRouteSpec = null,
  stationSpecs = [],
} = {}) {
  const targets = [];

  if (routeSpec?.rect) {
    targets.push({
      id: "post_mainline_goal_route",
      type: "post_mainline_goal_route",
      todayRouteType: "post_mainline_today_route",
      label: routeSpec.label,
      todayRouteLabel: "主线后今日路线",
      focusKey: routeSpec.focusRow?.key || "",
      rect: routeSpec.rect,
    });
  }

  if (todayRouteSpec?.rect) {
    targets.push({
      id: "post_mainline_today_route",
      type: "post_mainline_today_route",
      label: todayRouteSpec.title,
      routeKey: todayRouteSpec.routeKey,
      selector: todayRouteSpec.selector,
      fallbackSelector: todayRouteSpec.fallbackSelector,
      postMainlineTodayRoute: todayRouteSpec,
      rect: todayRouteSpec.rect,
    });
  }

  targets.push(...postMainlineRouteStationTargetsWorld({ stationSpecs }));
  return targets;
}

export function postMainlineRouteStationTargetsWorld({ stationSpecs = [] } = {}) {
  return (stationSpecs || []).map((station) => ({
    id: `post_mainline_route_station_${station.routeKey}`,
    type: "post_mainline_route_station",
    routeKey: station.routeKey,
    label: station.label,
    rect: station.rect,
  }));
}

export function postMainlineGoalRouteLogSpecsWorld({
  routeSpec = null,
  evidence = null,
} = {}) {
  const focusTitle = routeSpec?.focusRow?.title || "主线后目标路线";
  const totalMinutes = evidence?.totalMinutes || 0;
  const targetMinutes = evidence?.targetMinutes || 0;
  const coverage = evidence?.coverage || [];
  const coverageDone = coverage.filter((entry) => entry.pass).length;
  return [
    {
      title: "点选年路：十小时年路灯牌",
      log: `${focusTitle} 已接到目标册。当前通关后目标 ${totalMinutes}/${targetMinutes} 分钟，覆盖 ${coverageDone}/${coverage.length} 类留存意图；这里只定位下一步，不会自动跳关、不会自动领取奖励，也不会消耗资源。`,
    },
    {
      title: "点选主线后今日路线：主线后今日路线",
      log: `${focusTitle || "主线后今日路线"} 只做今日路线定位，不会自动跳关、不会自动领取奖励，也不会消耗资源。`,
    },
  ];
}

export function postMainlineTodayRouteFocusTargetWorld({
  spec = null,
  focus = null,
} = {}) {
  if (!spec?.rowNode || !focus) return null;
  return {
    selector: focus.selector,
    fallbackSelector: focus.fallbackSelector,
    label: "点选主线后今日路线",
    log: `${spec.rowNode.title} 已接到「${focus.targetLabel}」。今天就有可落袋的事。${focus.advice} ${focus.safety}`,
    panelGroup: focus.panelGroup || "core",
    missingTitle: "点选主线后今日路线",
    missingLog: `主线后今日路线已经亮起，但当前没有找到对应入口。${focus.safety}`,
  };
}

export function postMainlineTodayRouteLogSpecWorld({
  spec = null,
  focus = null,
} = {}) {
  if (!spec?.rowNode || !focus) return null;
  return {
    title: "点选主线后今日路线：主线后今日路线",
    log: `${spec.rowNode.title} 今天就有可落袋的事。${focus.advice} ${focus.safety}`,
  };
}

export function postMainlineRouteStationFocusTargetWorld({
  target = null,
  station = null,
  focus = null,
  evidence = null,
} = {}) {
  if (!target || !focus) return null;
  const label = station?.label || target.label || "通关后目标";
  const title = station?.title || target.label || "主线后路线";
  const coverage = evidence?.coverage || [];
  const coverageDone = coverage.filter((entry) => entry.pass).length;
  return {
    selector: focus.selector,
    fallbackSelector: focus.fallbackSelector || "#goalBookPanel",
    label: `点选年路小站：${label}`,
    log: `${title} 已接到「${focus.targetLabel}」。${focus.advice} 当前十小时证据 ${evidence?.totalMinutes || 0}/${evidence?.targetMinutes || 0} 分钟，覆盖 ${coverageDone}/${coverage.length} 类；这里只定位下一步，不会自动跳关、不会自动领取奖励，也不会消耗资源。`,
    panelGroup: focus.panelGroup || "core",
    missingTitle: `点选年路小站：${label}`,
    missingLog: "对应的目标卡暂时没有找到，先查看目标册顶部的主线后十小时路线和后主线自由目标。",
  };
}
