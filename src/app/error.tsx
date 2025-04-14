"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "./components/ui/button";
import { Container } from "./components/ui/container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container className="max-w-md">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || "An unexpected error occurred"}
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <Button variant="primary" onClick={reset}>
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/home">Go back home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
