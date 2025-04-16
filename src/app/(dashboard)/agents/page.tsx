"use client";

import { useState } from "react";
import { Users, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ResponsiveTable,
  type Column,
} from "../../components/ui/responsive-table";
import { DashboardHeader } from "../../components/ui/dashboard-header";
import { Container } from "../../components/ui/container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import AgentFormModal from "../../components/agent-modal";
import { DeleteConfirmationModal } from "../../components/delete-confirmation-modal";
import {
  getAgents,
  createAgent,
  deleteAgent,
  type Agent,
} from "../../lib/apiUsers/agents";
import { useAgentStore } from "../../stores/agentStore";
import React from "react";

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const queryClient = useQueryClient();
  const { setAgents, removeAgent } = useAgentStore();

  const { data: agents = [], isLoading } = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: getAgents,
  });

  React.useEffect(() => {
    if (agents.length > 0) {
      setAgents(agents);
    }
  }, [agents, setAgents]);

  const createAgentMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      setIsFormModalOpen(false);
    },
  });

  const deleteAgentMutation = useMutation({
    mutationFn: deleteAgent,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["agents"] });

      // Snapshot the previous value
      const previousAgents = queryClient.getQueryData<Agent[]>(["agents"]);

      // Optimistically update to the new value
      queryClient.setQueryData<Agent[]>(
        ["agents"],
        (old) => old?.filter((agent) => agent.id !== id) ?? []
      );

      // Also update the store
      removeAgent(id);

      return { previousAgents };
    },
    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAgents) {
        queryClient.setQueryData(["agents"], context.previousAgents);
        // Also update the store with the previous data
        setAgents(context.previousAgents);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      setIsDeleteModalOpen(false);
      setSelectedAgent(null);
    },
  });

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.workId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<Agent>[] = [
    {
      header: "Work ID",
      key: "workId",
      accessor: "workId",
    },
    {
      header: "Agent Name",
      key: "name",
      accessor: "name",
    },
    {
      header: "Email",
      key: "email",
      accessor: "email",
    },
    {
      header: "Action",
      key: "action",
      render: (agent) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleEdit(agent)}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDelete(agent)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleEdit = (agent: Agent) => {
    // I will implement edit functionality later
    console.log("Edit agent:", agent);
  };

  const handleDelete = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAgent) {
      deleteAgentMutation.mutate(selectedAgent.id);
    }
  };

  const handleOpenFormModal = () => {
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleFormSubmit = (data: any) => {
    createAgentMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        title="Prime insurance agents"
        icon={<Users className="h-5 w-5" />}
        onSearchChange={handleSearch}
      />

      <Container className="py-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <CardTitle>All Agents</CardTitle>
            <Button onClick={handleOpenFormModal}>Add Agent</Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : (
              <ResponsiveTable
                data={filteredAgents}
                columns={columns}
                enableRowSelection={true}
                defaultRowsPerPage={5}
              />
            )}
          </CardContent>
        </Card>
      </Container>

      <AgentFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAgent(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Agent"
        message={`Are you sure you want to delete ${selectedAgent?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
