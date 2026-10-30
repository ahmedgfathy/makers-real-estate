"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  whatsappLink,
  type Contact,
  type Content,
  type Lang,
  type TileId,
} from "@/data/content";
import Header from "./Header";
import Hero from "./Hero";
import Collection from "./Collection";
import Footer from "./Footer";
import Panel from "./Panel";

const TILE_IDS: TileId[] = ["lakes", "phase08m", "sodic-east", "amenities", "collection", "payment"];
const isTileId = (v: string): v is TileId => (TILE_IDS as string[]).includes(v);

export default function Landing({
  content,
  contact,
}: {
  content: Record<Lang, Content>;
  contact: Contact;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [active, setActive] = useState<TileId | null>(null);
  const lastFocus = useRef<HTMLButtonElement | null>(null);
  const pushed = useRef(false);
  const wasOpen = useRef(false);

  const c = content[lang];
  const whatsapp = whatsappLink(contact, lang);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("makers.lang");
      if (stored === "ar" || stored === "en") setLang(stored);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem("makers.lang", lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  const open = useCallback((id: TileId, el?: HTMLButtonElement) => {
    if (el) lastFocus.current = el;
    setActive(id);
    // Push (not replace) so the browser's Back button closes the brief.
    window.history.pushState({ tile: id }, "", "#tile-" + id);
    pushed.current = true;
  }, []);

  const close = useCallback(() => {
    // Unwind the entry pushed by open() so closing does not leave a dead hash behind.
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
      return;
    }
    setActive(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace("#", "");
      const id = hash.startsWith("tile-") ? hash.slice(5) : "";
      if (isTileId(id)) {
        setActive(id);
        return;
      }
      pushed.current = false;
      setActive(null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // Return focus to the tile that opened the brief once it closes (Back or Esc).
  useEffect(() => {
    if (active) {
      wasOpen.current = true;
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      lastFocus.current?.focus({ preventScroll: true });
    }
  }, [active]);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Header c={c} lang={lang} onLang={setLang} whatsapp={whatsapp} phoneHref={contact.phoneHref} />

      <main>
        <Hero c={c} lang={lang} whatsapp={whatsapp} phoneHref={contact.phoneHref} />
        <Collection c={c} lang={lang} onOpen={open} />
      </main>

      <Footer
        c={c}
        contact={contact}
        lang={lang}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
        onOpen={(id) => open(id)}
      />

      {active ? (
        <Panel
          key={active}
          id={active}
          c={c}
          contact={contact}
          lang={lang}
          whatsapp={whatsapp}
          onClose={close}
        />
      ) : null}
    </>
  );
}
