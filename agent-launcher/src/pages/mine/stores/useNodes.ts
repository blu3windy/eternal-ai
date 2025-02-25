import { type EarningsNode } from "../../../types/data";
import { create } from "zustand";

type UseNodesState = {
  items: EarningsNode[];
  selectedItem: EarningsNode | null;
}

type UseNodesActions = {
  setItems: (nodes: EarningsNode[]) => void;
  setSelectedItem: (node: EarningsNode | null) => void;
}

export const useNodes = create<UseNodesState & UseNodesActions>((set) => ({
  items: [],
  setItems: (nodes) => set({ items: nodes, selectedItem: nodes[0] }),

  selectedItem: null,
  setSelectedItem: (node) => set({ selectedItem: node }),
}))
