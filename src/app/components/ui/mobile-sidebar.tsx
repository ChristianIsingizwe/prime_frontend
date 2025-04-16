"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Users,
  BarChart2,
  FileText,
  Calendar,
  LogOut,
  House,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface MobileSidebarProps {
  onLogout: () => void;
}

export function MobileSidebar({ onLogout }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getLinkClassName = (path: string) => {
    return cn(
      "flex items-center space-x-2 px-3 py-4 w-full",
      isActive(path)
        ? "bg-gradient-to-b from-[#0f2a43] to-[#051525] text-white"
        : "text-white hover:bg-gradient-to-b hover:from-[#0f2a43] hover:to-[#051525]"
    );
  };

  // Handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle route changes
  useEffect(() => {
    closeSidebar();
  }, [pathname]);

  // Handle main content blur effect
  useEffect(() => {
    if (!mainContentRef.current) {
      mainContentRef.current = document.querySelector("main");
    }

    if (mainContentRef.current) {
      if (isOpen) {
        mainContentRef.current.classList.add(
          "blur-[2px]",
          "opacity-60",
          "transition-all",
          "duration-300",
          "pointer-events-none"
        );
      } else {
        mainContentRef.current.classList.remove(
          "blur-[2px]",
          "opacity-60",
          "transition-all",
          "duration-300",
          "pointer-events-none"
        );
      }
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#093753] text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] bg-black/30 z-40"
          onClick={closeSidebar}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-[#093753] text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 mt-8 mb-4 ml-4">
          <Image
            src="/logo.svg"
            alt="The prime insurance logo"
            width={170}
            height={62}
            priority
          />
        </div>

        <nav className="flex-1 p-4 mt-6">
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
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
