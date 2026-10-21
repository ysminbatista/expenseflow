"use client";

import { createContext, useContext } from "react";
import type { User } from "@/lib/api";

const UserContext = createContext<User | null>(null);

// O layout da área logada já busca o usuário; as telas só leem daqui
export const UserProvider = UserContext.Provider;

export function useUser() {
  return useContext(UserContext);
}
