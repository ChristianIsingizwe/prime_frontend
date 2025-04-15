import apiClient from "../apiClient";
import { toast } from "react-hot-toast";

export interface DashboardData {
  totalAgents: number;
  activeAgents: number;
  performanceMetrics: {
    totalClients: number;
    averageEngagement: number;
    successRate: number;
  };
  weeklyData: {
    day: string;
    clients: number;
  }[];
  performanceData: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get<DashboardData>("/manager/dashboard");
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch dashboard data");
    throw error;
  }
};
