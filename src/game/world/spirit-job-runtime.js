export function spiritJobReportByJobRuntime(report = []) {
  return report.reduce((map, entry) => {
    const job = entry.job || "farm";
    if (!map.has(job)) map.set(job, []);
    map.get(job).push(entry);
    return map;
  }, new Map());
}
