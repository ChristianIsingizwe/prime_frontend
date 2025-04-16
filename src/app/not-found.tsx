"use client";

import { Container } from "./components/ui/container";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container className="max-w-md">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-[#093753] mb-2">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
      </Container>
    </div>
  );
}
