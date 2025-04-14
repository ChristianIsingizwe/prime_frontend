"use client";

import { useRef, useEffect } from "react";

interface AgentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    name: string;
    nationalId?: string;
    email?: string;
    dateOfBirth?: string;
    location?: string;
  } | null;
}

const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({
  isOpen,
  onClose,
  agent,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !agent) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">More agent details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Names:</span>
            <span>{agent.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">National ID:</span>
            <span>{agent.nationalId || "Not provided"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Email:</span>
            <span>{agent.email || "Not provided"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Date of Birth:</span>
            <span>{agent.dateOfBirth || "Not provided"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Location:</span>
            <span>{agent.location || "Not provided"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsModal;
