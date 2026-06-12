export function readyOrderSealWorldSpecData({
  width = 960,
  height = 640,
  board = null,
  day = 1,
  selectorDataValue = (value) => String(value ?? ""),
  specWorld = null,
} = {}) {
  if (typeof specWorld !== "function") return null;
  return specWorld({
    width,
    height,
    board,
    day,
    selectorDataValue,
  });
}

export function readyOrderSealWorldAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function readyOrderSealWorldFocusData(spec = null, day = 1) {
  if (!spec?.orderId) return null;
  return {
    focus: { key: spec.key, day, orderId: spec.orderId },
    log: {
      title: "点选订单备齐封签",
      message: `${spec.orderTitle} 已备齐：${spec.routeText}。已定位订单卡，真正交付仍需手动点击订单板按钮；${spec.safety}。`,
    },
    orderId: spec.orderId,
  };
}
