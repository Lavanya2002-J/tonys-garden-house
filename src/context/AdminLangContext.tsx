import { createContext, useContext, useState, type ReactNode } from "react";
import { adminText, type AdminText, type Lang } from "@/i18n/admin";

const KEY = "tgh.adminLang";

function initialLang(): Lang {
  try {
    return localStorage.getItem(KEY) === "ta" ? "ta" : "en";
  } catch {
    return "en";
  }
}

interface Ctx {
  lang: Lang;
  t: AdminText;
  setLang: (l: Lang) => void;
}

const AdminLangContext = createContext<Ctx | null>(null);

export function AdminLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  };
  return <AdminLangContext.Provider value={{ lang, t: adminText[lang], setLang }}>{children}</AdminLangContext.Provider>;
}

export function useAdminLang(): Ctx {
  const ctx = useContext(AdminLangContext);
  if (!ctx) throw new Error("useAdminLang must be used inside AdminLangProvider");
  return ctx;
}
