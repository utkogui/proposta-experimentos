"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

const SVG_URL = "/umsonaofaz.svg";

export function UmSonAoFazBand() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let io: IntersectionObserver | null = null;
    let gsapCtx: gsap.Context | null = null;

    fetch(SVG_URL)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((text) => {
        if (cancelled || !rootRef.current) return;
        rootRef.current.innerHTML = text;
        const svg = rootRef.current.querySelector("svg");
        if (!svg) return;

        gsapCtx = gsap.context(() => {
          const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;

          const shape = svg.querySelector<SVGPathElement>(
            'path[data-draw="shape"]',
          );
          const lines = gsap.utils.toArray<SVGPathElement>(
            svg.querySelectorAll('path[data-draw="line"]'),
          );

          const clearDashStyle = (el: SVGPathElement) => {
            el.style.strokeDasharray = "";
            el.style.strokeDashoffset = "";
          };

          const showFinalStatic = () => {
            if (shape) {
              gsap.set(shape, { strokeDashoffset: 0, fillOpacity: 1 });
              clearDashStyle(shape);
            }
            lines.forEach((line) => {
              gsap.set(line, { strokeDashoffset: 0 });
              clearDashStyle(line);
            });
          };

          const armDrawing = () => {
            if (shape) {
              const len = shape.getTotalLength();
              gsap.set(shape, {
                strokeDasharray: len,
                strokeDashoffset: len,
                fillOpacity: 0,
              });
            }
            lines.forEach((line) => {
              const len = line.getTotalLength();
              if (len > 0) {
                gsap.set(line, {
                  strokeDasharray: len,
                  strokeDashoffset: len,
                });
              }
            });
          };

          const play = () => {
            if (prefersReduced) {
              showFinalStatic();
              return;
            }

            armDrawing();

            const tl = gsap.timeline();

            const shapeLen = shape?.getTotalLength() ?? 0;

            if (shape && shapeLen > 0) {
              tl.to(shape, {
                strokeDashoffset: 0,
                duration: 1.72,
                ease: "power2.inOut",
              });

              tl.to(
                shape,
                {
                  fillOpacity: 1,
                  duration: 0.72,
                  ease: "power1.out",
                },
                "-=0.5",
              );
            } else if (shape) {
              gsap.set(shape, { fillOpacity: 1 });
            }

            const drawableLines = lines.filter((l) => l.getTotalLength() > 0);
            if (drawableLines.length) {
              tl.to(
                drawableLines,
                {
                  strokeDashoffset: 0,
                  duration: 1.05,
                  ease: "power3.out",
                  stagger: {
                    each: 0.14,
                    from: "start",
                  },
                },
                shapeLen > 0 ? "-=0.95" : 0,
              );
            }
          };

          io = new IntersectionObserver(
            (entries) => {
              if (!entries.some((e) => e.isIntersecting)) return;
              io?.disconnect();
              io = null;
              play();
            },
            { threshold: 0.12, rootMargin: "0px 0px -6%" },
          );
          io.observe(rootRef.current!);
        }, root);
      })
      .catch(() => {
        /* SVG opcional */
      });

    return () => {
      cancelled = true;
      io?.disconnect();
      gsapCtx?.revert();
    };
  }, []);

  return (
    <section className="um-son-a-faz" aria-hidden="true">
      <div ref={rootRef} className="um-son-a-faz__inner" />
    </section>
  );
}
