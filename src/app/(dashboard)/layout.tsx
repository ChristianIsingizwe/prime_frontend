"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  BarChart2,
  FileText,
  Calendar,
  LogOut,
  House,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import LogoutModal from "../components/logout-modal";
import { MobileSidebar } from "../components/ui/mobile-sidebar";
import { cn } from "../lib/utils";
import AuthGuard from "../components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getLinkClassName = (path: string) => {
    return cn(
      "flex items-center space-x-2 px-3 py-2 rounded",
      isActive(path)
        ? "bg-gradient-to-b from-[#0f2a43] to-[#051525]"
        : "hover:bg-gradient-to-b hover:from-[#0f2a43] hover:to-[#051525]"
    );
  };

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  const mainContentRef = (node: HTMLDivElement) => {
    if (node !== null) {
      setContentRef(node);
    }
  };

  useEffect(() => {
    if (contentRef) {
      if (isLogoutModalOpen) {
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
  }, [isLogoutModalOpen, contentRef]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MobileSidebar onLogout={handleOpenLogoutModal} />

      <aside className="hidden md:flex md:w-64 bg-[#093753] text-white flex-col">
        <div className="flex h-16 mt-8 mb-4 ml-4">
          <Image
            src="/logo.svg"
            alt="The prime insurance logo"
            width={170}
            height={62}
          />
        </div>

        <nav className="flex-1 px-4 mt-6">
          <ul className="space-y-3">
            <li>
              <Link href="/home" className={getLinkClassName("/home")}>
                <House size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/agents" className={getLinkClassName("/agents")}>
                <Users size={18} />
                <span>Manage agents</span>
              </Link>
            </li>
            <li>
              <Link
                href="/performance"
                className={getLinkClassName("/performance")}
              >
                <BarChart2 size={18} />
                <span>Performance</span>
              </Link>
            </li>
            <li>
              <Link href="/reports" className={getLinkClassName("/reports")}>
                <FileText size={18} />
                <span>Reports</span>
              </Link>
            </li>
            <li>
              <Link
                href="/attendance"
                className={getLinkClassName("/attendance")}
              >
                <Calendar size={18} />
                <span>Attendance</span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className={getLinkClassName("/settings")}>
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4">
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gradient-to-b hover:from-[#0f2a43] hover:to-[#051525] w-full"
            onClick={handleOpenLogoutModal}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main
        className="flex-1 overflow-x-hidden transition-all duration-300"
        ref={mainContentRef}
      >
        <AuthGuard requiredRole="manager">{children}</AuthGuard>
      </main>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
