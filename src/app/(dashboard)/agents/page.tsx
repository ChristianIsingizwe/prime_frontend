"use client";

import { useState, useEffect } from "react";
import { Users, Edit, Trash2 } from "lucide-react";
import { ResponsiveTable, Column } from "../../components/ui/responsive-table";
import AgentFormModal from "../../components/agent-modal";
import AgentDetailsModal from "../../components/agent-details-modal";
import { DashboardHeader } from "../../components/ui/dashboard-header";
import { Container } from "../../components/ui/container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface Agent {
  id: string;
  workId: string;
  name: string;
  department: string;
  avatar: string;
  email?: string;
  dateOfBirth?: string;
  location?: string;
  nationalId?: string;
}

interface AgentFormData {
  name: string;
  workId: string;
  email: string;
  dateOfBirth: string;
  location: string;
  nationalId: string;
}

const agents: Agent[] = [
  {
    id: "1",
    workId: "EMP00123",
    name: "Lindsey Stroud",
    department: "Technology Department",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "lindsey.stroud@example.com",
    dateOfBirth: "15/05/1990",
    location: "New York",
    nationalId: "123-45-6789",
  },
  {
    id: "2",
    workId: "EMP09876",
    name: "Sarah Brown",
    department: "Technology Department",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "sarah.brown@example.com",
    dateOfBirth: "22/07/1988",
    location: "San Francisco",
    nationalId: "234-56-7890",
  },
  {
    id: "3",
    workId: "WRK45782",
    name: "Michael Owen",
    department: "Technology Department",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "michael.owen@example.com",
    dateOfBirth: "10/03/1992",
    location: "Chicago",
    nationalId: "345-67-8901",
  },
  {
    id: "4",
    workId: "STAFF00567",
    name: "Mary Jane",
    department: "Technology Department",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "mary.jane@example.com",
    dateOfBirth: "05/11/1995",
    location: "Boston",
    nationalId: "456-78-9012",
  },
  {
    id: "5",
    workId: "HR202301",
    name: "Peter Dodle",
    department: "Technology Department",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "peter.dodle@example.com",
    dateOfBirth: "18/09/1987",
    location: "Seattle",
    nationalId: "567-89-0123",
  },
];

export default function AgentsPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleOpenFormModal = (): void => {
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = (): void => {
    setIsFormModalOpen(false);
  };

  const handleFormSubmit = (formData: AgentFormData): void => {
    console.log("Form submitted:", formData);
    setIsFormModalOpen(false);
  };

  const handleOpenDetailsModal = (agent: Agent): void => {
    setSelectedAgent(agent);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = (): void => {
    setIsDetailsModalOpen(false);
    setSelectedAgent(null);
  };

  const mainContentRef = (node: HTMLDivElement) => {
    if (node !== null) {
      setContentRef(node);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Filter agents based on search query
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.workId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (contentRef) {
      const isAnyModalOpen = isFormModalOpen || isDetailsModalOpen;

      if (isAnyModalOpen) {
        contentRef.classList.add(
          "blur-[2px]",
          "opacity-60",
          "transition-all",
          "duration-300",
          "pointer-events-none"
        );
      } else {
        contentRef.classList.remove(
          "blur-[2px]",
          "opacity-60",
          "transition-all",
          "duration-300",
          "pointer-events-none"
        );
      }
    }
  }, [isFormModalOpen, isDetailsModalOpen, contentRef]);

  const agentColumns: Column<Agent>[] = [
    {
      header: "Work ID",
      key: "workId",
      accessor: "workId",
    },
    {
      header: "Agent Name",
      key: "agentName",
      render: (agent: Agent) => (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600"
          onClick={() => handleOpenDetailsModal(agent)}
        >
          <img
            src={agent.avatar || "/placeholder.svg"}
            alt={agent.name}
            className="h-6 w-6 rounded-full mr-2"
          />
          {agent.name}
        </div>
      ),
    },
    {
      header: "Performance",
      key: "department",
      accessor: "department",
      hideOnMobile: true,
    },
    {
      header: "Action",
      key: "action",
      render: (agent: Agent) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">
            <Edit className="h-4 w-4" />
          </button>
          <button className="text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        title="Manage Agents"
        icon={<Users className="h-5 w-5" />}
        onSearchChange={handleSearch}
      />

      <div ref={mainContentRef} className="transition-all duration-300">
        <Container className="py-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <CardTitle>All Agents</CardTitle>
              <Button onClick={handleOpenFormModal}>Add New Agent</Button>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                data={filteredAgents}
                columns={agentColumns}
                enableRowSelection={true}
                defaultRowsPerPage={10}
              />
            </CardContent>
          </Card>
        </Container>

        {isFormModalOpen && (
          <AgentFormModal
            isOpen={isFormModalOpen}
            onClose={handleCloseFormModal}
            onSubmit={handleFormSubmit}
          />
        )}

        {isDetailsModalOpen && selectedAgent && (
          <AgentDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={handleCloseDetailsModal}
            agent={selectedAgent}
          />
        )}
      </div>
    </div>
  );
}
