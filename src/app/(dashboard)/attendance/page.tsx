"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ResponsiveTable,
  type Column,
} from "../../components/ui/responsive-table";
import { BellIcon, SearchIcon, Calendar } from "lucide-react";

interface Agent {
  id: string;
  workId: string;
  name: string;
  avatar: string;
  sector: string;
  status: "Started" | "Not Started";
}

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const agents: Agent[] = [
    {
      id: "1",
      workId: "EMP00123",
      name: "Lindsey Stroud",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      status: "Started",
    },
    {
      id: "2",
      workId: "EMP09876",
      name: "Sarah brown",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      status: "Not Started",
    },
    {
      id: "3",
      workId: "WRK45782",
      name: "Micheal Owen",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      status: "Not Started",
    },
    {
      id: "4",
      workId: "STAFF00567",
      name: "Mary Jane",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      status: "Not Started",
    },
    {
      id: "5",
      workId: "HR202301",
      name: "Peter dodie",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      status: "Not Started",
    },
  ];

  const columns: Column<Agent>[] = [
    {
      header: "Work ID",
      key: "workId",
      accessor: "workId",
    },
    {
      header: "Agent name",
      key: "name",
      render: (agent) => (
        <div className="flex items-center gap-2">
          <span>{agent.name}</span>
        </div>
      ),
    },
    {
      header: "Sector",
      key: "sector",
      accessor: "sector",
    },
    {
      header: "Status",
      key: "status",
      render: (agent) => (
        <div className="flex items-center">
          <div
            className={`w-4 h-4 rounded-sm mr-2 ${
              agent.status === "Started" ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span>{agent.status}</span>
        </div>
      ),
    },
  ];

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.workId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar size={18} />
          <h1 className="text-xl font-bold">Attendance</h1>
        </div>

      </header>

      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Daily agents' attendance</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Filter agents......."
            className="w-64 p-2 border border-gray-300 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ResponsiveTable
          data={filteredAgents}
          columns={columns}
          enableRowSelection={true}
          defaultRowsPerPage={5}
          uniqueKey="id"
        />
      </main>
    </div>
  );
}
