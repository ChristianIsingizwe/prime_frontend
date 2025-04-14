"use client";

import { useState } from "react";
import { Search, Bell, BarChart2 } from "lucide-react";
import { GenericTable, type Column } from "../../components/agents-table";
import Image from "next/image";

interface Agent {
  id: string;
  workId: string;
  name: string;
  avatar: string;
  sector: string;
  totalClients: number;
}

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily"
  );
  const [filterValue, setFilterValue] = useState("");

  const agents: Agent[] = [
    {
      id: "1",
      workId: "EMP00123",
      name: "Lindsey Stroud",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      totalClients: 120,
    },
    {
      id: "2",
      workId: "EMP05876",
      name: "Sarah brown",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      totalClients: 152,
    },
    {
      id: "3",
      workId: "WRK45782",
      name: "Michael Owen",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      totalClients: 32,
    },
    {
      id: "4",
      workId: "STAFF00567",
      name: "Mary Jane",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      totalClients: 210,
    },
    {
      id: "5",
      workId: "HR202301",
      name: "Peter dodle",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      totalClients: 230,
    },
  ];

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.workId.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.sector.toLowerCase().includes(filterValue.toLowerCase())
  );

  const columns: Column<Agent>[] = [
    {
      header: "Work ID",
      key: "workId",
      accessor: "workId",
    },
    {
      header: "Agent name",
      key: "name",
      render: (row) => (
        <div className="flex items-center">
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      header: "Sector",
      key: "sector",
      accessor: "sector",
    },
    {
      header: "Total Clients",
      key: "totalClients",
      render: (row) => <span>{row.totalClients} clients</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-[#000000] font-bold text-xl flex items-center">
            <BarChart2 size={18} />
            Performance
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2A5470] focus:border-transparent w-64"
            />
          </div>
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="User profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-medium">Ange Kevine Uwayo</span>
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
                onClick={() =>
                  setActiveTab(tab as "Daily" | "Weekly" | "Monthly")
                }
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
          <GenericTable
            data={filteredAgents}
            columns={columns}
            enableRowSelection={true}
            defaultRowsPerPage={5}
          />
        </div>
      </main>
    </div>
  );
}
