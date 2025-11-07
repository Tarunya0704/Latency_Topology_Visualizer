"use client"
import dynamic from "next/dynamic"
import { Globe, Activity, Loader2, Info } from "lucide-react"
import { useStore } from "./store/useStore"
import { EXCHANGES } from "./lib/exchanges"
import { CLOUD_REGIONS } from "./lib/cloudRegions"
import { useLatencyData } from "./hooks/useLatencyData"
import ControlPanel from "./components/ControlPanel"
import StatsPanel from "./components/StatsPanel"
import HistoricalChart from "./components/HistoricalChart"

const Globe3D = dynamic(() => import("./components/Globe3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black rounded-lg">
      <Loader2 className="w-12 md:w-16 h-12 md:h-16 text-blue-500 animate-spin mb-4" />
      <p className="text-gray-300 text-base md:text-lg font-medium px-4 text-center">Loading 3D Globe...</p>
    </div>
  ),
})

export default function Home() {
  const { darkMode, showHistorical, selectedExchange, searchTerm } = useStore()
  const { latencyData, isLoading, useRealAPI, toggleAPIMode } = useLatencyData(EXCHANGES)

  return (
    <main className={`min-h-screen ${darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <header
        className={`${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border-b sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 shadow-lg relative`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 md:py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
            <div className="flex items-center gap-2 md:gap-4 w-full lg:w-auto">
              <div className="relative flex-shrink-0">
                <Globe className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-pulse" />
                <div
                  className={`absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse ${
                    useRealAPI ? "bg-green-500" : "bg-blue-500"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent truncate">
                  Latency Topology Visualizer
                </h1>
                <p
                  className={`text-xs md:text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-600"} hidden sm:block truncate`}
                >
                  Real-time cryptocurrency exchange network monitoring
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <div
                className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border flex-shrink-0 ${
                  useRealAPI ? "bg-green-500/10 border-green-500/20" : "bg-blue-500/10 border-blue-500/20"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${
                    useRealAPI ? "bg-green-500" : "bg-blue-500"
                  }`}
                />
                <span
                  className={`text-xs md:text-sm font-medium whitespace-nowrap ${
                    useRealAPI ? "text-green-500" : "text-blue-500"
                  }`}
                >
                  {useRealAPI ? "Real API" : "Simulation"}
                </span>
              </div>

              <div
                className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"} border ${darkMode ? "border-gray-700" : "border-gray-300"} flex-shrink-0`}
              >
                <div className="text-[10px] md:text-xs text-gray-400 mb-0.5">Exchanges</div>
                <div className="text-sm md:text-lg font-bold">{EXCHANGES.length}</div>
              </div>

              <div
                className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"} border ${darkMode ? "border-gray-700" : "border-gray-300"} flex-shrink-0`}
              >
                <div className="text-[10px] md:text-xs text-gray-400 mb-0.5">Connections</div>
                <div className="text-sm md:text-lg font-bold">{latencyData.length}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {!selectedExchange && !searchTerm && (
        <div
          className={`${darkMode ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"} border-b relative z-40`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 md:py-3">
            <div className="flex items-start gap-2 md:gap-3">
              <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className={`text-xs md:text-sm ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                <strong className="hidden sm:inline">Quick Start:</strong> Click markers to view latency connections.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-0 max-w-7xl mx-auto px-3 sm:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-3">
            <ControlPanel useRealAPI={useRealAPI} toggleAPIMode={toggleAPIMode} />
          </div>

          <div className="lg:col-span-6">
            <div
              className={`${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} rounded-lg shadow-xl border overflow-hidden relative z-0`}
            >
              <div
                className={`p-3 md:p-4 border-b ${darkMode ? "border-gray-800 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-base md:text-lg flex items-center gap-2">
                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
                      <span className="truncate">3D Network Topology</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {selectedExchange ? `Showing ${selectedExchange.name}` : "Click any marker"}
                    </p>
                  </div>
                  {isLoading && (
                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-400 flex-shrink-0">
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                      <span className="hidden sm:inline">{useRealAPI ? "APIs..." : "Loading..."}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] relative overflow-hidden">
                {isLoading && latencyData.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="text-center px-4">
                      <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-blue-500 animate-spin mx-auto mb-3" />
                      <p className="text-white font-medium text-sm md:text-base">
                        {useRealAPI ? "Pinging APIs..." : "Loading..."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Globe3D exchanges={EXCHANGES} latencyData={latencyData} cloudRegions={CLOUD_REGIONS} />
                )}
              </div>

              <div className={`p-2 md:p-3 border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <div className="flex items-center gap-2 md:gap-4">
                    <span className={darkMode ? "text-gray-400" : "text-gray-600"}>🖱️ Drag</span>
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} hidden sm:inline`}>
                      🔍 Scroll
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    <span>5s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <StatsPanel exchanges={EXCHANGES} latencyData={latencyData} />
          </div>
        </div>

        {showHistorical && (
          <div className="mt-4 md:mt-6">
            <HistoricalChart exchanges={EXCHANGES} latencyData={latencyData} />
          </div>
        )}
      </div>

      <footer
        className={`${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border-t mt-12 relative z-0`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div
              className={`text-xs md:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} text-center md:text-left`}
            >
              <p className="font-semibold">© 2025 Latency Topology Visualizer</p>
              <p className="text-xs mt-1">Built with Next.js, Three.js & TypeScript</p>
            </div>
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${useRealAPI ? "bg-green-500" : "bg-blue-500"}`} />
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {useRealAPI ? "Real API" : "Simulation"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
