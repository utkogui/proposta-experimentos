"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type BlobSpec = {
  className?: string;
  style: CSSProperties;
  px: number;
  py: number;
};

type GlyphSpec = {
  file: string;
  className?: string;
  style: CSSProperties;
  gradient: string;
  px: number;
  py: number;
  rotate?: number;
};

function brandGlyphUrl(file: string) {
  return `/brand-elements/${encodeURIComponent(file)}`;
}

/** Formas do kit de marca com gradiente Matilha — opacidade baixa via CSS (.proposta-ambient__glyph). */
const GLYPHS: GlyphSpec[] = [
  {
    file: "Dawn.svg",
    style: {
      width: "min(26vmin, 210px)",
      height: "min(26vmin, 210px)",
      left: "-3%",
      top: "12%",
    },
    gradient: "linear-gradient(148deg, #BC83F3 0%, #3CA8FB 100%)",
    px: 0.019,
    py: 0.071,
    rotate: -14,
  },
  {
    file: "Waves.svg",
    style: {
      width: "min(34vmin, 280px)",
      height: "min(34vmin, 280px)",
      right: "-6%",
      top: "8%",
    },
    gradient: "linear-gradient(168deg, #A5E6BA 0%, #FBD951 100%)",
    px: -0.024,
    py: 0.088,
    rotate: 9,
  },
  {
    file: "Asterisk.svg",
    className: "proposta-ambient__glyph--hide-sm",
    style: {
      width: "min(22vmin, 180px)",
      height: "min(22vmin, 180px)",
      right: "6%",
      top: "38%",
    },
    gradient: "linear-gradient(135deg, #FEA0FB 0%, #FD9C27 100%)",
    px: -0.026,
    py: 0.052,
    rotate: 21,
  },
  {
    file: "Portal.svg",
    style: {
      width: "min(28vmin, 220px)",
      height: "min(28vmin, 220px)",
      left: "-4%",
      bottom: "6%",
    },
    gradient: "linear-gradient(142deg, #3CA8FB 0%, #BC83F3 100%)",
    px: 0.032,
    py: 0.079,
    rotate: -11,
  },
  {
    file: "Spiral 1.svg",
    className: "proposta-ambient__glyph--hide-sm",
    style: {
      width: "min(30vmin, 240px)",
      height: "min(30vmin, 240px)",
      left: "14%",
      top: "52%",
    },
    gradient: "linear-gradient(156deg, #FBD951 0%, #BC83F3 100%)",
    px: 0.027,
    py: 0.105,
    rotate: 7,
  },
  {
    file: "Soft Star.svg",
    className: "proposta-ambient__glyph--hide-sm",
    style: {
      width: "min(20vmin, 160px)",
      height: "min(20vmin, 160px)",
      left: "42%",
      top: "4%",
    },
    gradient: "linear-gradient(125deg, #FBD951 0%, #EB6239 100%)",
    px: 0.011,
    py: 0.038,
    rotate: -19,
  },
  {
    file: "Zig Zag.svg",
    style: {
      width: "min(24vmin, 200px)",
      height: "min(24vmin, 200px)",
      right: "10%",
      bottom: "14%",
    },
    gradient: "linear-gradient(172deg, #A5E6BA 0%, #3CA8FB 100%)",
    px: -0.03,
    py: 0.092,
    rotate: 14,
  },
];

const BLOBS: BlobSpec[] = [
  {
    style: {
      width: "min(72vmin, 620px)",
      height: "min(72vmin, 620px)",
      left: "-14%",
      top: "-12%",
      background:
        "radial-gradient(circle at 38% 42%, rgba(188,131,243,0.5) 0%, transparent 68%)",
    },
    px: 0.038,
    py: 0.099,
  },
  {
    style: {
      width: "min(64vmin, 520px)",
      height: "min(64vmin, 520px)",
      right: "-10%",
      top: "12%",
      background:
        "radial-gradient(circle at 55% 48%, rgba(60,168,251,0.42) 0%, transparent 65%)",
    },
    px: -0.05,
    py: 0.143,
  },
  {
    style: {
      width: "min(58vmin, 480px)",
      height: "min(58vmin, 480px)",
      left: "8%",
      top: "42%",
      background:
        "radial-gradient(circle at 45% 55%, rgba(165,230,186,0.38) 0%, transparent 62%)",
    },
    px: 0.03,
    py: 0.077,
  },
  {
    style: {
      width: "min(68vmin, 560px)",
      height: "min(68vmin, 560px)",
      right: "4%",
      top: "58%",
      background:
        "radial-gradient(circle at 40% 38%, rgba(254,160,251,0.36) 0%, transparent 64%)",
    },
    px: -0.033,
    py: 0.113,
  },
  {
    style: {
      width: "min(52vmin, 440px)",
      height: "min(52vmin, 440px)",
      left: "-6%",
      bottom: "8%",
      background:
        "radial-gradient(circle at 60% 35%, rgba(251,217,81,0.34) 0%, transparent 60%)",
    },
    px: 0.047,
    py: 0.124,
  },
  {
    style: {
      width: "min(60vmin, 500px)",
      height: "min(60vmin, 500px)",
      right: "-8%",
      bottom: "-6%",
      background:
        "radial-gradient(circle at 48% 52%, rgba(253,156,39,0.34) 0%, transparent 62%)",
    },
    px: -0.041,
    py: 0.091,
  },
  {
    style: {
      width: "min(48vmin, 400px)",
      height: "min(48vmin, 400px)",
      left: "38%",
      top: "72%",
      background:
        "radial-gradient(circle at 50% 50%, rgba(235,98,57,0.3) 0%, transparent 58%)",
    },
    px: 0.025,
    py: 0.16,
  },
];

export function PropostaAmbientBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const blobEls = [...root.querySelectorAll<HTMLElement>("[data-parallax-blob]")];
    const glyphEls = [...root.querySelectorAll<HTMLElement>("[data-parallax-glyph]")];
    const mesh = root.querySelector<HTMLElement>("[data-parallax-mesh]");
    const wash = root.querySelector<HTMLElement>("[data-parallax-wash]");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;

      if (reduced) {
        blobEls.forEach((el) => {
          el.style.transform = "";
        });
        glyphEls.forEach((el) => {
          el.style.transform = "";
        });
        if (mesh) mesh.style.transform = "";
        if (wash) wash.style.transform = "";
        return;
      }

      blobEls.forEach((el) => {
        const px = Number(el.dataset.parallaxX ?? "0");
        const py = Number(el.dataset.parallaxY ?? "0");
        el.style.transform = `translate3d(${y * px}px, ${y * py}px, 0)`;
      });

      glyphEls.forEach((el) => {
        const px = Number(el.dataset.parallaxX ?? "0");
        const py = Number(el.dataset.parallaxY ?? "0");
        const rot = el.dataset.glyphRotate ?? "0";
        el.style.transform = `translate3d(${y * px}px, ${y * py}px, 0) rotate(${rot}deg)`;
      });

      if (mesh) {
        mesh.style.transform = `translate3d(${y * 0.024}px, ${y * 0.058}px, 0)`;
      }
      if (wash) {
        wash.style.transform = `translate3d(${y * -0.014}px, ${y * 0.034}px, 0)`;
      }
    };

    const onScroll = () => {
      if (reduced) return;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="proposta-ambient" aria-hidden="true">
      <div className="proposta-ambient__wash" data-parallax-wash />

      <div className="proposta-ambient__glyphs">
        {GLYPHS.map((g, i) => {
          const maskUrl = brandGlyphUrl(g.file);
          return (
            <div
              key={`${g.file}-${i}`}
              className={`proposta-ambient__glyph ${g.className ?? ""}`}
              style={{
                ...g.style,
                background: g.gradient,
                maskImage: `url("${maskUrl}")`,
                WebkitMaskImage: `url("${maskUrl}")`,
              }}
              data-parallax-glyph
              data-parallax-x={String(g.px)}
              data-parallax-y={String(g.py)}
              data-glyph-rotate={String(g.rotate ?? 0)}
            />
          );
        })}
      </div>

      <div className="proposta-ambient__mesh-wrap" data-parallax-mesh>
        <svg
          className="proposta-ambient__mesh"
          viewBox="0 0 1600 2400"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pa-line-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FBD951" stopOpacity="0.62" />
              <stop offset="100%" stopColor="#BC83F3" stopOpacity="0.48" />
            </linearGradient>
            <linearGradient id="pa-line-b" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3CA8FB" stopOpacity="0.58" />
              <stop offset="100%" stopColor="#FEA0FB" stopOpacity="0.42" />
            </linearGradient>
          </defs>
          <g
            strokeWidth="1.15"
            strokeLinecap="round"
            fill="none"
            opacity="0.78"
          >
            <path d="M-80 200 L1680 2800" stroke="url(#pa-line-a)" />
            <path d="M200 -120 L1900 2600" stroke="url(#pa-line-b)" />
            <path d="M400 -200 L2100 2400" stroke="#A5E6BA" strokeOpacity="0.48" />
            <path d="M-120 900 L1500 -100" stroke="#FD9C27" strokeOpacity="0.4" />
            <path d="M100 1400 L1700 400" stroke="#EB6239" strokeOpacity="0.34" />
          </g>
          <g fillOpacity="0.14">
            <circle cx="280" cy="520" r="3" fill="#FBD951" />
            <circle cx="1320" cy="680" r="2.5" fill="#BC83F3" />
            <circle cx="980" cy="1200" r="2" fill="#3CA8FB" />
            <circle cx="420" cy="1680" r="2.5" fill="#FEA0FB" />
            <circle cx="1180" cy="1980" r="2" fill="#A5E6BA" />
            <circle cx="620" cy="920" r="2" fill="#FD9C27" />
            <circle cx="1450" cy="1520" r="2" fill="#EB6239" />
          </g>
        </svg>
      </div>

      <div className="proposta-ambient__blobs">
        {BLOBS.map((b, i) => (
          <div
            key={i}
            className={`proposta-ambient__blob ${b.className ?? ""}`}
            style={b.style}
            data-parallax-blob
            data-parallax-x={String(b.px)}
            data-parallax-y={String(b.py)}
          />
        ))}
      </div>
    </div>
  );
}
