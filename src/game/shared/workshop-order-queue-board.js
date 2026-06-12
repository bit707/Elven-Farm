export function workshopOrderQueueWorldBoardSpecData({
  day = 1,
  lineSpec = null,
  stagePoint = null,
  copyForOrder = () => null,
  specFromRuntime = null,
} = {}) {
  const activeJob = lineSpec?.activeJob || null;
  const orderMatch = activeJob?.orderMatch || null;
  if (typeof specFromRuntime !== "function") return null;
  return specFromRuntime({
    day,
    activeJob,
    orderMatch,
    stagePoint,
    copy: copyForOrder(activeJob, orderMatch),
  });
}

export function workshopOrderQueueWorldBoardAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function workshopOrderQueueWorldBoardFocusData(spec = null, day = 1) {
  if (!spec?.orderMatch?.orderId) return null;
  return {
    focus: {
      key: spec.key,
      day,
      orderId: spec.orderMatch.orderId,
      recipeId: spec.activeJob?.id || "",
    },
    logTitle: "点选订单锅排产",
    logMessage: `${spec.activeJob.recipeName} 正在烧 ${spec.activeJob.outputItemName} x${spec.activeJob.outputCount}，会接到「${spec.orderMatch.orderTitle}」。${spec.orderMatch.ready ? "这锅完成后订单就能交付。" : `完成后仍需补 ${spec.orderMatch.missingText || "余料"}。`}已帮你定位订单板。`,
    orderId: spec.orderMatch.orderId,
  };
}
