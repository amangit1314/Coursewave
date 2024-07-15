import { create } from "zustand";
import { persist } from "zustand/middleware";

type CategoriesState = {};

type CategoriesActions = {};

const useCategoriesStore = create<CategoriesState & CategoriesActions>()(
  persist((set, get) => ({}), {
    name: "Coursewave-Categories-Store",
    getStorage: () => localStorage,
  })
);
