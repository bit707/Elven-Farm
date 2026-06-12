export function activeTimedFeedback(feedback = null, now = 0, {
  duration = 6000,
  fadeStart = null,
  fadeDuration = null,
  freshUntil = null,
  createdAtFallback = 0,
  useFeedbackDuration = false,
} = {}) {
  if (!feedback) return null;
  const resolvedDuration = Math.max(1, Number(useFeedbackDuration ? (feedback.duration || duration) : duration));
  const age = now - Number(feedback.createdAt || createdAtFallback);
  if (age > resolvedDuration) return null;
  const resolvedFadeStart = Math.max(1, Number(
    fadeStart ?? (fadeDuration == null ? resolvedDuration - 1200 : resolvedDuration - Number(fadeDuration || 0)),
  ));
  const fadeSpan = Math.max(1, resolvedDuration - resolvedFadeStart);
  const liveFeedback = {
    ...feedback,
    age,
    fade: age < resolvedFadeStart ? 1 : Math.max(0, 1 - (age - resolvedFadeStart) / fadeSpan),
  };
  if (freshUntil != null) liveFeedback.fresh = age < Number(freshUntil);
  return liveFeedback;
}
