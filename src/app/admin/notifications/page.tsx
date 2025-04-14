"use client";

import { useState } from "react";
import { Bell, Check, X } from "lucide-react";
import Image from "next/image";
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

interface Notification {
  id: string;
  workId: string;
  email: string;
  issue: string;
}

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample notifications data - replace with actual data from your backend
  const notifications: Notification[] = []; // Empty array to demonstrate no notifications state

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.workId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.issue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (notification: Notification) => {
    // Implement approve functionality
    console.log("Approve notification:", notification);
  };

  const handleReject = (notification: Notification) => {
    // Implement reject functionality
    console.log("Reject notification:", notification);
  };

  const columns: Column<Notification>[] = [
    {
      header: "Work ID",
      key: "workId",
      accessor: "workId",
    },
    {
      header: "Email",
      key: "email",
      accessor: "email",
    },
    {
      header: "Issue",
      key: "issue",
      accessor: "issue",
    },
    {
      header: "Action",
      key: "action",
      render: (notification) => (
        <div className="flex space-x-2">
          <button
            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100"
            onClick={() => handleApprove(notification)}
            title="Approve"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
            onClick={() => handleReject(notification)}
            title="Reject"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Notifications"
        icon={<Bell className="h-5 w-5" />}
        userName="Kagabo Irene Lucky"
        onSearchChange={handleSearch}
      />

      <Container className="py-6">
        {notifications.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your unread notifications!</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                data={filteredNotifications}
                columns={columns}
                enableRowSelection={true}
                defaultRowsPerPage={5}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <h2 className="text-xl font-semibold mb-8">
              No new notifications yet!
            </h2>
            <div className="relative w-[400px] h-[400px] animate-float">
              <Image
                src="/notifications-notfound.jpg"
                alt="No notifications illustration"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
