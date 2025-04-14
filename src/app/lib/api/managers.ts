import apiClient from "../apiClient";
import { toast } from "react-hot-toast";

export interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
  phoneNumber: string;
  workId: string;
}

export interface CreateManagerData {
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
  phoneNumber: string;
  workId: string;
}

export const getManagers = async (): Promise<Manager[]> => {
  try {
    const response = await apiClient.get<Manager[]>("/admin/managers");
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch managers");
    throw error;
  }
};

export const createManager = async (
  data: CreateManagerData
): Promise<Manager> => {
  try {
    const response = await apiClient.post<Manager>("/admin/managers", data);
    toast.success("Manager created successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to create manager");
    throw error;
  }
};

export const deleteManager = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/managers/${id}`);
    toast.success("Manager deleted successfully");
  } catch (error) {
    toast.error("Failed to delete manager");
    throw error;
  }
};
