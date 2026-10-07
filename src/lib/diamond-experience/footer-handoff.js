import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Measure on refresh; paint transforms only. Native scrolling carries the footer information. */
export function createFooterHandoff({ root, diamond, brandAnchor, footerSlot, wordmark }) {
  const stage = diamond.querySelector(".diamond-experience-stage");
  const visual = diamond.querySelector(".diamond-experience-visual");
  const ease = gsap.parseEase("sine.inOut");
  const clamp = gsap.utils.clamp(0, 1);
  let geometry;

  // The same SVG stays in the footer DOM. Fixed positioning lets it hold while the scene leaves.
  // Once it reaches its reserved slot, its transform follows that slot's native document position.
  gsap.set(wordmark, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    x: 0,
    y: 0,
    scale: 1,
    transformOrigin: "0 0",
    zIndex: 6,
    willChange: "transform",
  });
  gsap.set(visual, { y: 0 });
  const moveX = gsap.quickSetter(wordmark, "x", "px");
  const moveY = gsap.quickSetter(wordmark, "y", "px");
  const scaleX = gsap.quickSetter(wordmark, "scaleX");
  const scaleY = gsap.quickSetter(wordmark, "scaleY");
  const liftScene = gsap.quickSetter(visual, "y", "px");

  function measure() {
    const scroll = window.scrollY;
    const sectionBox = diamond.getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();
    const source = brandAnchor.getBoundingClientRect();
    const target = footerSlot.getBoundingClientRect();
    const sourceY = source.top - stageBox.top;
    const targetTop = target.top + scroll;
    const exitStart = sectionBox.top + scroll + sectionBox.height - stageBox.height;
    const dockAt = Math.min(
      targetTop - (sourceY + Math.min(window.innerHeight * 0.055, 48)),
      ScrollTrigger.maxScroll(window),
    );
    geometry = {
      sectionTop: sectionBox.top + scroll,
      sourceX: source.left,
      sourceY,
      sourceWidth: source.width,
      targetX: target.left,
      targetWidth: target.width,
      targetTop,
      exitStart,
      dockAt,
      dockY: targetTop - dockAt,
      exitLength: Math.max(1, dockAt - exitStart),
      lift: window.innerHeight * 0.16,
    };
    wordmark.style.width = `${source.width}px`;
  }

  function paint(scroll) {
    if (!geometry) return;
    const g = geometry;
    const exit = clamp((scroll - g.exitStart) / g.exitLength);
    // Hold the lettering until the sculptures have begun to leave, then settle gently downward.
    const settle = ease(clamp((exit - 0.38) / 0.62));
    const docked = scroll >= g.dockAt;
    moveX(docked ? g.targetX : gsap.utils.interpolate(g.sourceX, g.targetX, settle));
    moveY(
      docked
        ? g.targetTop - scroll
        : Math.max(0, g.sectionTop - scroll) + gsap.utils.interpolate(g.sourceY, g.dockY, settle),
    );
    const size = gsap.utils.interpolate(1, g.targetWidth / g.sourceWidth, docked ? 1 : settle);
    scaleX(size);
    scaleY(size);
    liftScene(-g.lift * exit);
    stage.inert = exit >= 0.95;
    root.dataset.footerBrand = docked ? "docked" : exit > 0.38 ? "settling" : "floating";
    root.dataset.footerProgress = exit.toFixed(4);
    root.style.setProperty("--footer-exit", exit);
  }

  measure();
  const driver = ScrollTrigger.create({
    id: "house-footer-handoff",
    trigger: diamond,
    start: "top bottom",
    end: "max",
    onUpdate: (self) => paint(self.scroll()),
    onRefresh: (self) => {
      measure();
      paint(self.scroll());
    },
    onLeaveBack: (self) => paint(self.scroll()),
  });
  paint(window.scrollY);
  return () => {
    driver.kill();
    stage.inert = false;
    delete root.dataset.footerBrand;
    delete root.dataset.footerProgress;
    root.style.removeProperty("--footer-exit");
  };
}
