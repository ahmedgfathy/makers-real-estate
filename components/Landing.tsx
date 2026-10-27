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
    window.history.replaceState(null, "", "#tile-" + id);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    lastFocus.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash.startsWith("tile-")) {
        const id = hash.slice(5);
        if (isTileId(id)) setActive(id);
        return;
      }
      setActive(null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

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
