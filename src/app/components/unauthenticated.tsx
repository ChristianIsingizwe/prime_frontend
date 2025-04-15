import { useRouter } from "next/navigation";

export default function Unauthenticated() {
  const router = useRouter();
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-4xl font-bold text-yellow-600 mb-4">
            401 Unauthenticated
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            You must be logged in to access this resource.
          </p>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => router.replace("/login")}
          >
            Go to Login
          </button>
        </div>
      </body>
    </html>
  );
}
