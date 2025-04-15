import apiClient from "../apiClient";
import { toast } from "react-hot-toast";

export type ReportPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export interface DailyClientsCount {
  [key: string]: number;
}

export interface DailySectors {
  [key: string]: string[];
}

export interface WorkStatus {
  [key: string]: string;
}

export interface AgentReport {
  agentId: string;
  agentName: string;
  workId: string;
  totalClientsEngaged: number;
  sectorsWorkedIn: string[];
  daysWorked: number;
  dailyComment: string;
  dailyClientsCount: DailyClientsCount;
  dailySectors: DailySectors;
  workStatus: WorkStatus;
}

export interface ReportsResponse {
  agentReports: AgentReport[];
}

export const getReports = async (
  period: ReportPeriod
): Promise<AgentReport[]> => {
  try {
    const response = await apiClient.get<ReportsResponse>("/manager/reports", {
      params: { period },
    });
    return response.data.agentReports;
  } catch (error) {
    toast.error("Failed to fetch reports");
    throw error;
  }
};
