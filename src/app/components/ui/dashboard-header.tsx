"use client";

import { BellIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Input } from "./input";

interface DashboardHeaderProps {
  title: string;
  icon?: React.ReactNode;
  userName?: string;
  userAvatar?: string;
  onSearchChange?: (value: string) => void;
}

export function DashboardHeader({
  title,
  icon,
  userName = "User",
  userAvatar = "/placeholder.svg?height=40&width=40",
  onSearchChange,
}: DashboardHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="bg-white p-4 shadow-sm flex flex-wrap justify-between items-center">
      <div className="flex items-center gap-2">
        {icon}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      {/* Search bar - hidden on mobile unless expanded */}
      <div
        className={cn(
          "w-full order-3 mt-4 md:order-2 md:mt-0 md:w-auto md:flex-1 md:max-w-md md:mx-4",
          isSearchOpen ? "block" : "hidden md:block"
        )}
      >
        <Input
          type="text"
          placeholder="Search"
          icon={<SearchIcon className="h-5 w-5" />}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Mobile search toggle */}
      <button
        className="order-2 md:hidden p-2"
        onClick={toggleSearch}
        aria-label="Toggle search"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-4 order-2 md:order-3">
        <button className="relative p-2" aria-label="Notifications">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <Link href="/settings" className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Image
              src={userAvatar}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full hover:opacity-80 transition-opacity"
            />
          </div>
          <span className="hidden sm:block font-medium">{userName}</span>
          <div className="sm:hidden">
            <Image
              src={userAvatar}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full hover:opacity-80 transition-opacity"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
