"use client";

import React from "react";
import { Container } from "./components/ui/container";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Container className="max-w-md">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-t-4 border-gray-200 border-t-[#093753] rounded-full animate-spin"></div>
          <p className="mt-4 text-[#093753] font-medium">Loading...</p>
        </div>
      </Container>
    </div>
  );
}
