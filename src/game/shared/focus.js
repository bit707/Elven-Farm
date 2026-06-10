export function pulseFocusElement({
  selector,
  fallbackSelector = "",
  pulseClass,
  reducedMotion = false,
  onMissing,
}) {
  const element = document.querySelector(selector)
    || (fallbackSelector ? document.querySelector(fallbackSelector) : null);
  if (!element) {
    onMissing?.();
    return false;
  }

  const hadTabIndex = element.hasAttribute("tabindex");
  const previousTabIndex = element.getAttribute("tabindex");
  element.classList.add(pulseClass);
  element.setAttribute("tabindex", "-1");
  element.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "center",
    inline: "nearest",
  });
  try {
    element.focus({ preventScroll: true });
  } catch (error) {
    element.focus();
  }
  window.setTimeout(() => {
    element.classList.remove(pulseClass);
    if (hadTabIndex) element.setAttribute("tabindex", previousTabIndex);
    else element.removeAttribute("tabindex");
  }, reducedMotion ? 1200 : 2600);
  return true;
}

export function applyVisiblePanelColumns({
  rootSelector,
  columns,
}) {
  const visibleColumns = new Set(columns);
  document.querySelectorAll(rootSelector).forEach((panel) => {
    const visible = [...visibleColumns].some((className) => panel.classList.contains(className));
    panel.hidden = !visible;
  });
}
