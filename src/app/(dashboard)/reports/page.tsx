"use client";

import { useState, useRef, useEffect } from "react";
import { GenericTable, type Column } from "../../components/agents-table";
import { Document, Page, pdfjs } from "react-pdf";
import { Search, Bell, FileText, FileArchive } from "lucide-react";
import Image from "next/image";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Report {
  id: string;
  workId: string;
  agent: {
    name: string;
    avatar: string;
  };
  report: {
    filename: string;
    url: string;
  };
  comment: string;
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (selectedPdf) {
        contentRef.current.classList.add(
          "blur-[2px]",
          "opacity-60",
          "transition-all",
          "duration-300",
          "pointer-events-none"
        );
      } else {
        contentRef.current.classList.remove(
          "blur-[2px]",
          "opacity-60",
          "transition-all",
          "duration-300",
          "pointer-events-none"
        );
      }
    }
  }, [selectedPdf]);

  const reportsData: Report[] = [
    {
      id: "1",
      workId: "EMP00123",
      agent: {
        name: "Lindsey Stroud",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      report: {
        filename: "07/05/2025Client Report.pdf",
        url: "/sample.pdf",
      },
      comment: "Today was not good",
    },
    {
      id: "2",
      workId: "EMP00876",
      agent: {
        name: "Sarah Brown",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      report: {
        filename: "08/05/2025Client Report.pdf",
        url: "/sample.pdf",
      },
      comment: "Today was not good",
    },
    {
      id: "3",
      workId: "WRK45782",
      agent: {
        name: "Michael Owen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      report: {
        filename: "09/05/2025Client Report.pdf",
        url: "/sample.pdf",
      },
      comment: "Today was not good",
    },
    {
      id: "4",
      workId: "STAFF00567",
      agent: {
        name: "Mary Jane",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      report: {
        filename: "10/05/2025Client Report.pdf",
        url: "/sample.pdf",
      },
      comment: "Today was not good",
    },
    {
      id: "5",
      workId: "HR202301",
      agent: {
        name: "Peter Dodle",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      report: {
        filename: "11/05/2025Client Report.pdf",
        url: "/sample.pdf",
      },
      comment: "Today was not good",
    },
    ...Array.from({ length: 35 }, (_, i) => ({
      id: `${i + 6}`,
      workId: `EMP${(10000 + i).toString()}`,
      agent: {
        name: `Agent ${i + 6}`,
        avatar: "/placeholder.svg?height=32&width=32",
      },
      report: {
        filename: `${i + 12}/05/2025Client Report.pdf`,
        url: "/sample.pdf",
      },
      comment: "Today was not good",
    })),
  ];

  const filteredData = reportsData.filter(
    (report) =>
      report.workId.toLowerCase().includes(filterTerm.toLowerCase()) ||
      report.agent.name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const columns: Column<Report>[] = [
    {
      header: "Work ID",
      key: "workId",
      accessor: "workId",
    },
    {
      header: "Agent name",
      key: "agentName",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.agent.name}</span>
        </div>
      ),
    },
    {
      header: "Report",
      key: "report",
      render: (row) => (
        <div
          className="flex items-center gap-2 text-black cursor-pointer"
          onClick={() => setSelectedPdf(row.report.url)}
        >
          <div className="bg-red-600 text-white p-1 rounded">
            <FileArchive />
          </div>
          <span>{row.report.filename}</span>
        </div>
      ),
    },
    {
      header: "Daily comment",
      key: "comment",
      accessor: "comment",
    },
  ];

  const handleDownloadPdf = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "download.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* All content that should blur is wrapped here */}
      <div ref={contentRef}>
        <header className="bg-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <h1 className="text-lg font-bold">Reports</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            <div className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-medium">Ange Kevine Uwayo</span>
            </div>
          </div>
        </header>

        <main className="p-6 transition-all duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">
              Prime Insurance Agent Reports
            </h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Filter agents..."
                className="p-2 border border-gray-300 rounded w-60"
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-md overflow-hidden">
              <GenericTable
                data={filteredData}
                columns={columns}
                enableRowSelection={true}
                defaultRowsPerPage={5}
              />
            </div>
          </div>
        </main>
      </div>

      {/* PDF Modal - Changed this part */}
      {selectedPdf && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setSelectedPdf(null)}
        >
          <div 
            className="bg-white p-4 rounded-lg w-3/4 h-3/4 flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">PDF Viewer</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadPdf(selectedPdf)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Download
                </button>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto border">
              <Document
                file={selectedPdf}
                onLoadError={(error) =>
                  console.error("Error loading PDF:", error)
                }
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}