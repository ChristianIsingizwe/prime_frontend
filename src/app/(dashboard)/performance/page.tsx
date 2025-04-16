"use client";

import { useState, useEffect } from "react";
import { Search, Bell, BarChart2 } from "lucide-react";
import {
  ResponsiveTable,
  type Column,
} from "../../components/ui/responsive-table";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Agent {
  workId: string;
  agentName: string;
  sectorsWorkedIn: string[];
  totalClientsEngaged: number;
}

interface ApiResponse {
  agentReports: {
    workId: string;
    agentName: string;
    sectorsWorkedIn: string[];
    totalClientsEngaged: number;
    [key: string]: any;
  }[];
}

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily"
  );
  const [filterValue, setFilterValue] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAgentData = async (period: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/manager/reports?period=${period}`);
      if (!response.ok) {
        throw new Error("Failed to fetch agent data");
      }
      const data: ApiResponse = await response.json();

      const mappedAgents: Agent[] = data.agentReports.map((agent) => ({
        workId: agent.workId || "",
        agentName: agent.agentName,
        sectorsWorkedIn: agent.sectorsWorkedIn,
        totalClientsEngaged: agent.totalClientsEngaged,
      }));

      setAgents(mappedAgents);
      setTotalPages(Math.ceil(mappedAgents.length / 5));
    } catch (error) {
      console.error("Error fetching agent data:", error);
      toast.error("Failed to load agent data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const period = activeTab.toUpperCase();
    fetchAgentData(period);
  }, [activeTab]);

  const filteredAgents = agents.filter(
    (agent) =>
      agent.agentName.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.workId.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.sectorsWorkedIn.some((sector) =>
        sector.toLowerCase().includes(filterValue.toLowerCase())
      )
  );

  const columns: Column<Agent>[] = [
    {
      header: "Work ID",
      key: "workId",
      accessor: "workId",
    },
    {
      header: "Agent name",
      key: "agentName",
      render: (row) => (
        <div className="flex items-center">
          <span>{row.agentName}</span>
        </div>
      ),
    },
    {
      header: "Sector",
      key: "sectorsWorkedIn",
      render: (row) => (
        <span>{row.sectorsWorkedIn.join(", ") || "No sectors"}</span>
      ),
    },
    {
      header: "Total Clients",
      key: "totalClientsEngaged",
      render: (row) => <span>{row.totalClientsEngaged} clients</span>,
    },
  ];

  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-[#000000] font-bold text-xl flex items-center">
            <BarChart2 size={18} />
            <i className="ml-3"></i>
            Performance
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-4">
          <div className="bg-gray-200 rounded-full inline-flex">
            {["Daily", "Weekly", "Monthly"].map((tab) => (
              <button
                key={tab}
                className={`px-8 py-2 rounded-full text-sm font-medium ${
                  activeTab === tab
                    ? "bg-white text-[#2A5470]"
                    : "text-gray-600"
                }`}
                onClick={() => {
                  setActiveTab(tab as "Daily" | "Weekly" | "Monthly");
                  setCurrentPage(1);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Filter agents......"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5470] focus:border-transparent"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-md shadow">
          <ResponsiveTable
            data={paginatedAgents}
            columns={columns}
            enableRowSelection={true}
            defaultRowsPerPage={5}
            uniqueKey="workId"
          />
        </div>
      </main>
    </div>
  );
}
