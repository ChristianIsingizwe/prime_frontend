"use client";

import { ReactNode } from "react";

export interface DashboardHeaderProps {
  title: string;
  icon?: ReactNode;
}

export function DashboardHeader({ title, icon }: DashboardHeaderProps) {
  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="flex items-center justify-center md:justify-start gap-2">
        {icon}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
    </header>
  );
}
