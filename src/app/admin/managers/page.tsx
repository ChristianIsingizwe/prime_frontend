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
import ManagerFormModal from "../../components/manager-modal";
import { DeleteConfirmationModal } from "../../components/delete-confirmation-modal";
import {
  getManagers,
  createManager,
  deleteManager,
  type Manager,
} from "../../lib/apiUsers/managers";
import { useManagerStore } from "../../stores/managerStore";
import React from "react";

export default function ManagersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const queryClient = useQueryClient();
  const { setManagers, removeManager } = useManagerStore();

  const { data: managers = [], isLoading } = useQuery<Manager[]>({
    queryKey: ["managers"],
    queryFn: getManagers,
  });

  // Update store when data is fetched
  React.useEffect(() => {
    if (managers.length > 0) {
      setManagers(managers);
    }
  }, [managers, setManagers]);

  const createManagerMutation = useMutation({
    mutationFn: createManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      setIsFormModalOpen(false);
    },
  });

  const deleteManagerMutation = useMutation({
    mutationFn: deleteManager,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["managers"] });

      // Snapshot the previous value
      const previousManagers = queryClient.getQueryData<Manager[]>([
        "managers",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<Manager[]>(
        ["managers"],
        (old) => old?.filter((manager) => manager.id !== id) ?? []
      );

      // Also update the store
      removeManager(id);

      return { previousManagers };
    },
    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousManagers) {
        queryClient.setQueryData(["managers"], context.previousManagers);
        // Also update the store with the previous data
        setManagers(context.previousManagers);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      setIsDeleteModalOpen(false);
      setSelectedManager(null);
    },
  });

  const filteredManagers = managers.filter(
    (manager) =>
      `${manager.firstName} ${manager.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      manager.workId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<Manager>[] = [
    {
      header: "Work ID",
      key: "workId",
      accessor: "workId",
    },
    {
      header: "Manager Name",
      key: "name",
      render: (manager) => (
        <div className="flex items-center gap-2">
          <span>{`${manager.firstName} ${manager.lastName}`}</span>
        </div>
      ),
    },
    {
      header: "Email",
      key: "email",
      accessor: "email",
    },
    {
      header: "Action",
      key: "action",
      render: (manager) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleEdit(manager)}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDelete(manager)}
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

  const handleEdit = (manager: Manager) => {
    // Implement edit functionality
    console.log("Edit manager:", manager);
  };

  const handleDelete = (manager: Manager) => {
    setSelectedManager(manager);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedManager) {
      deleteManagerMutation.mutate(selectedManager.id);
    }
  };

  const handleOpenFormModal = () => {
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleFormSubmit = (data: any) => {
    createManagerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        title="Prime insurance managers"
        icon={<Users className="h-5 w-5" />}
        onSearchChange={handleSearch}
      />

      <Container className="py-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <CardTitle>All Managers</CardTitle>
            <Button onClick={handleOpenFormModal}>Add Manager</Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : (
              <ResponsiveTable
                data={filteredManagers}
                columns={columns}
                enableRowSelection={true}
                defaultRowsPerPage={5}
              />
            )}
          </CardContent>
        </Card>
      </Container>

      <ManagerFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedManager(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Manager"
        message={`Are you sure you want to delete ${selectedManager?.firstName} ${selectedManager?.lastName}? This action cannot be undone.`}
      />
    </div>
  );
}
