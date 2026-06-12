export function workshopReadyOrderDispatchWorldSpecData({
  day = 1,
  aromaSpec = null,
  orders = [],
  canDeliverOrder = () => false,
  orderMatchSpec = () => null,
  rewardTextForOrder = () => "订单奖励",
  copyForRuntime = () => null,
  specFromRuntime = null,
} = {}) {
  if (typeof specFromRuntime !== "function") return null;
  const safeOrders = Array.isArray(orders) ? orders : [];
  const order = aromaSpec?.orderId
    ? safeOrders.find((entry) => entry.order_id === aromaSpec.orderId)
    : null;
  const orderMatch = aromaSpec
    ? aromaSpec.orderMatch || orderMatchSpec(aromaSpec.aroma?.itemId || "", aromaSpec.aroma?.outputCount || 1)
    : null;
  const rewardText = rewardTextForOrder(order, "订单奖励");
  return specFromRuntime({
    day,
    aromaSpec,
    order,
    deliverable: order ? canDeliverOrder(order) : false,
    orderMatch,
    rewardText,
    copy: copyForRuntime(aromaSpec, rewardText),
  });
}

export function workshopReadyOrderDispatchWorldAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function workshopReadyOrderDispatchWorldFocusData(spec = null, day = 1) {
  if (!spec?.orderId) return null;
  return {
    focus: { key: spec.key, day, orderId: spec.orderId },
    log: {
      title: "点选出锅交单车",
      message: `${spec.outputLabel} 已装上交单车，「${spec.orderTitle}」库存已齐。交单路线已定位到订单板收款口，确认后手动点交付即可收取 ${spec.rewardText}；这里只定位，不会自动交单或消耗库存。`,
    },
    orderId: spec.orderId,
  };
}
