"use client";

import { HomeIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ResponsiveTable,
  type Column,
} from "../../components/ui/responsive-table";
import { DashboardHeader } from "../../components/ui/dashboard-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Grid, GridItem } from "../../components/ui/grid";

interface Agent {
  id: string;
  workId: string;
  name: string;
  avatar: string;
  sector: string;
  status: "Started" | "Not Started";
}

export default function DashboardPage() {
  const weeklyData = [
    { day: "M", clients: 0 },
    { day: "T", clients: 0 },
    { day: "W", clients: 0 },
    { day: "T", clients: 3 },
    { day: "F", clients: 0 },
    { day: "S", clients: 0 },
    { day: "S", clients: 0 },
  ];

  const performanceData = [
    { name: "Active", value: 0, color: "#4CAF50" },
    { name: "Not Started", value: 100, color: "#F44336" },
    { name: "Started but no clients", value: 0, color: "#FFC107" },
  ];

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
      name: "Sarah Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      status: "Not Started",
    },
    {
      id: "3",
      workId: "WRK45782",
      name: "Michael Owen",
      avatar: "/placeholder.svg?height=32&width=32",
      sector: "Technology Department",
      status: "Started",
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
      hideOnMobile: true,
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

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        title="Dashboard"
        icon={<HomeIcon className="h-5 w-5" />}
        userName="Ange Kevine Uwayo"
        userAvatar="/placeholder.svg?height=40&width=40"
      />

      <Container className="py-6">
        <Grid cols={1} lgCols={3} gap="lg" className="mb-6">
          <GridItem lgColSpan={2}>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Weekly Overview</CardTitle>
                <CardDescription className="text-center">
                  Apr 10 - Apr 17
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="clients"
                        stroke="#2A5470"
                        strokeWidth={2}
                        dot={{ r: 6, fill: "#2A5470" }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-center">
                  Agents Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <Grid cols={3} gap="sm" className="mt-4">
                  {performanceData.map((data, index) => (
                    <GridItem
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className="w-4 h-4 rounded-full mb-1"
                        style={{ backgroundColor: data.color }}
                      ></div>
                      <span className="text-xs">{data.name}</span>
                      <span className="font-semibold text-sm">
                        {data.value}%
                      </span>
                    </GridItem>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </GridItem>
        </Grid>

        <Card>
          <CardHeader>
            <CardTitle>Agents Overview</CardTitle>
            <CardDescription>
              Here's a quick view of your agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveTable
              data={agents}
              columns={columns}
              defaultRowsPerPage={5}
            />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
