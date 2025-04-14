import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Agent } from "../lib/api/agents";

interface AgentState {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  removeAgent: (id: string) => void;
}

export const useAgentStore = create<AgentState>()(
  devtools(
    (set) => ({
      agents: [],
      setAgents: (agents) => set({ agents }),
      addAgent: (agent) =>
        set((state) => ({ agents: [...state.agents, agent] })),
      removeAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((agent) => agent.id !== id),
        })),
    }),
    { name: "agent-store" }
  )
);
