"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/components/event-tracker";
import { TourScreens, type TourScreen } from "@/components/project-tour-screens";
import { useMessages } from "@/lib/i18n/provider";

type Area = [number, number, number, number];

const stops: { id: "agent" | "ai" | "formatting" | "templates" | "library" | "extraction" | "release"; screen: TourScreen; soon?: boolean }[] = [
  { id: "agent", screen: "agent", soon: true },
  { id: "ai", screen: "ai" },
  { id: "formatting", screen: "formatting", soon: true },
  { id: "templates", screen: "templates" },
  { id: "library", screen: "library" },
  { id: "extraction", screen: "extraction" },
  { id: "release", screen: "release" },
];

const STOP_MS = 7000;

// Screens are laid out at this size and only scaled down, so text never gets stretched.
const DESIGN_W = 1800;
const DESIGN_H = 1000;
const FALLBACK_AREA: Area = [0.1, 0.1, 0.8, 0.8];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Pans and zooms the canvas so the area sits in the middle without showing empty edges.
function framing([x, y, w, h]: Area) {
  const zoom = clamp(Math.min(0.86 / w, 0.86 / h), 1, 2.3);
  return {
    zoom,
    panX: clamp(0.5 - (x + w / 2) * zoom, 1 - zoom, 0),
    panY: clamp(0.5 - (y + h / 2) * zoom, 1 - zoom, 0),
  };
}

// Where a marked element sits on its screen. Layout offsets ignore the canvas transform.
function measure(canvas: HTMLElement): Partial<Record<TourScreen, Area>> {
  const areas: Partial<Record<TourScreen, Area>> = {};
  canvas.querySelectorAll<HTMLElement>("[data-screen]").forEach((screen) => {
    const spot = screen.querySelector<HTMLElement>("[data-spot]");
    if (!spot) return;
    let left = 0;
    let top = 0;
    let node: HTMLElement | null = spot;
    while (node && node !== screen) {
      left += node.offsetLeft;
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    areas[screen.dataset.screen as TourScreen] = [
      left / DESIGN_W,
      top / DESIGN_H,
      spot.offsetWidth / DESIGN_W,
      spot.offsetHeight / DESIGN_H,
    ];
  });
  return areas;
}

export function ProjectTour() {
  const t = useMessages().mainProject.tour;
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [frameWidth, setFrameWidth] = useState(750);
  const [areas, setAreas] = useState<Partial<Record<TourScreen, Area>>>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!root || !frame || !canvas) return;

    const view = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    view.observe(root);
    const size = new ResizeObserver(([entry]) => setFrameWidth(entry.contentRect.width));
    size.observe(frame);

    setAreas(measure(canvas));
    void document.fonts?.ready.then(() => setAreas(measure(canvas)));

    return () => {
      view.disconnect();
      size.disconnect();
    };
  }, []);

  const current = stops[active];
  const area = areas[current.screen] ?? FALLBACK_AREA;
  const { zoom, panX, panY } = framing(area);
  const [x, y, w, h] = area;
  const scale = (frameWidth / DESIGN_W) * zoom;
  const frameHeight = (frameWidth * DESIGN_H) / DESIGN_W;
  const paused = stopped || hovered || focused || !inView;

  function pick(index: number) {
    setActive(index);
    setStopped(true);
    trackEvent("project_tour_stop", { stop: stops[index].id });
  }

  return (
    <div
      ref={rootRef}
      className="tour"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      <div className="surf tour-stage">
        <div className="panel-header tour-bar">
          <span className="mono tour-bar-label">{t.stops[current.id].screen}</span>
          <span className="chip">{t.synthetic}</span>
          <button
            type="button"
            className="btn sm tour-toggle"
            aria-pressed={stopped}
            onClick={() => setStopped((value) => !value)}
          >
            {stopped ? t.play : t.pause}
          </button>
        </div>
        <div ref={frameRef} className="tour-frame" role="img" aria-label={t.stops[current.id].screen}>
          <div
            ref={canvasRef}
            className="tour-canvas"
            aria-hidden="true"
            style={{
              width: DESIGN_W,
              height: DESIGN_H,
              transform: `translate(${panX * frameWidth}px, ${panY * frameHeight}px) scale(${scale})`,
              ["--tour-zoom" as string]: scale,
            }}
          >
            <TourScreens order={stops.map((stop) => stop.screen)} active={current.screen} />
            <span
              className="tour-spot"
              style={{ left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` }}
            />
          </div>
          {stopped ? null : (
            <span
              key={active}
              className="tour-progress"
              style={{ animationDuration: `${STOP_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
              onAnimationEnd={() => setActive((value) => (value + 1) % stops.length)}
            />
          )}
        </div>
      </div>

      <ol className="tour-rail">
        {stops.map((stop, index) => (
          <li key={stop.id} className={index === active ? "is-active" : ""}>
            <button
              type="button"
              aria-expanded={index === active}
              onMouseEnter={() => setActive(index)}
              onClick={() => pick(index)}
            >
              <span className="mono tour-rail-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="tour-rail-text">
                <span className="tour-rail-title">{t.stops[stop.id].title}</span>
                {index === active ? (
                  <span className="tour-rail-body">
                    {t.stops[stop.id].body}
                    {stop.soon ? <span className="mono tour-rail-soon">{t.soon}</span> : null}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* Phones show one caption under the numbers. All stay in one grid cell, so cycling never moves the page. */}
      <div className="tour-caption" aria-hidden="true">
        {stops.map((stop, index) => (
          <div key={stop.id} className={index === active ? "is-active" : ""}>
            <strong>{t.stops[stop.id].title}</strong>
            <p>{t.stops[stop.id].body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
