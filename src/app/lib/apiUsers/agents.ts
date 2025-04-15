import apiClient from "../apiClient";
import { toast } from "react-hot-toast";

export interface Agent {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  workId: string;
  leader: boolean;
}

export interface CreateAgentData {
  firstName: string;
  lastName: string;
  email: string;
  workId: string;
  nationalId: string;
  phoneNumber: string;
}

export interface AgentsResponse {
  agents: Agent[];
}

export const getAgents = async (): Promise<Agent[]> => {
  try {
    const response = await apiClient.get<AgentsResponse>("/manager/agents");
    return response.data.agents;
  } catch (error) {
    toast.error("Failed to fetch agents");
    throw error;
  }
};

export const createAgent = async (data: CreateAgentData): Promise<Agent> => {
  try {
    const response = await apiClient.post<Agent>("/manager/agents", data);
    toast.success("Agent created successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to create agent");
    throw error;
  }
};

export const deleteAgent = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/manager/agents/${id}`);
    toast.success("Agent deleted successfully");
  } catch (error) {
    toast.error("Failed to delete agent");
    throw error;
  }
};
