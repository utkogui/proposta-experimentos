"use client";

import { useEffect } from "react";

/**
 * Scripts de animação da proposta:
 *  - fade-in via IntersectionObserver
 *
 * Tudo em um único client component para limitar a hidratação.
 */
export function PropostaScripts() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.body;
    body.classList.remove("is-ready");
    body.classList.add("is-loading");

    const loader = document.getElementById("proposal-loader");
    let loaderLockTimeout: ReturnType<typeof setTimeout> | null = null;
    let loaderHoldTimeout: ReturnType<typeof setTimeout> | null = null;
    let loaderGreetingTimeout: ReturnType<typeof setTimeout> | null = null;
    let loaderExitTimeout: ReturnType<typeof setTimeout> | null = null;
    const LOADER_BUILD_MS = 3500;
    const LOADER_HOLD_MS = 4000;
    const LOADER_GREETING_AFTER_MS = 2500;
    const LOADER_EXIT_DURATION = 1200;

    const finishLoader = () => {
      if (!loader) {
        body.classList.remove("is-loading");
        body.classList.add("is-ready");
        return;
      }
      loader.classList.add("is-exiting");
      loaderExitTimeout = setTimeout(() => {
        /* Não usar remove(): o loader é nó gerenciado pelo React; removê-lo
         * aqui quebra o commit na navegação client-side (removeChild NotFoundError). */
        loader.classList.add("proposal-loader--dismissed");
        loader.setAttribute("aria-hidden", "true");
        body.classList.remove("is-loading");
        body.classList.add("is-ready");
      }, LOADER_EXIT_DURATION);
    };

    const enterLocked = () => {
      if (!loader) return;
      loader.classList.add("is-built", "is-locked");
      loaderGreetingTimeout = setTimeout(() => {
        const statusText = loader.querySelector<HTMLElement>(
          "#proposal-loader-status"
        );
        if (statusText) statusText.textContent = "Bem-vindo";
        loader.classList.add("is-greeting");
      }, LOADER_GREETING_AFTER_MS);
      loaderHoldTimeout = setTimeout(finishLoader, LOADER_HOLD_MS);
    };

    if (loader) {
      if (reduced) {
        enterLocked();
      } else {
        loaderLockTimeout = setTimeout(enterLocked, LOADER_BUILD_MS);
      }
    } else {
      body.classList.remove("is-loading");
      body.classList.add("is-ready");
    }

    // Fade-in
    const els = document.querySelectorAll(".fade-in");
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("visible");
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => io?.observe(el));
    } else {
      els.forEach((el) => el.classList.add("visible"));
    }

    return () => {
      if (loaderLockTimeout) clearTimeout(loaderLockTimeout);
      if (loaderHoldTimeout) clearTimeout(loaderHoldTimeout);
      if (loaderGreetingTimeout) clearTimeout(loaderGreetingTimeout);
      if (loaderExitTimeout) clearTimeout(loaderExitTimeout);
      body.classList.remove("is-loading");
      io?.disconnect();
    };
  }, []);

  return null;
}
