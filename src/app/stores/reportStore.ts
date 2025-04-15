import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AgentReport, ReportPeriod } from "../lib/api/reports";

interface ReportState {
  reports: AgentReport[];
  period: ReportPeriod;
  setReports: (reports: AgentReport[]) => void;
  setPeriod: (period: ReportPeriod) => void;
}

export const useReportStore = create<ReportState>()(
  devtools(
    (set) => ({
      reports: [],
      period: "DAILY",
      setReports: (reports) => set({ reports }),
      setPeriod: (period) => set({ period }),
    }),
    { name: "report-store" }
  )
);
