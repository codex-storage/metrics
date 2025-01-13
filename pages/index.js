"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { format, isToday, isYesterday } from "date-fns";
import Image from "next/image";
import {
  Activity,
  Users,
  Network,
  Database,
  Clock,
  AlertTriangle,
  RotateCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Globe,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Head from "next/head";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Add error handling for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables for Supabase');
}

const ITEMS_PER_PAGE = 5;

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [activeNodes, setActiveNodes] = useState([]);
  const [timeframe, setTimeframe] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componentLoading, setComponentLoading] = useState({
    metrics: true,
    nodes: true,
    versions: true,
    peers: true,
  });

  // Pagination and Search states
  const [versionPage, setVersionPage] = useState(1);
  const [peerPage, setPeerPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const results = activeNodeIds.filter(nodeId =>
        nodeId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setPeerPage(1);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setComponentLoading({
      metrics: true,
      nodes: true,
      versions: true,
      peers: true,
    });

    try {
      // Calculate date range based on timeframe
      const now = new Date();
      const startDate = new Date();
      if (timeframe === "7d") {
        startDate.setDate(now.getDate() - 7);
      } else if (timeframe === "30d") {
        startDate.setDate(now.getDate() - 30);
      } else if (timeframe === "1y") {
        startDate.setDate(now.getDate() - 365);
      }

      // Fetch metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from("metrics")
        .select("*")
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', now.toISOString().split('T')[0])
        .order("date", { ascending: true });

      if (metricsError) throw metricsError;
      setMetrics(metricsData || []);
      setComponentLoading(prev => ({ ...prev, metrics: false }));

      // Fetch nodes
      const { data: nodesData, error: nodesError } = await supabase
        .from("node_records")
        .select("*")
        .order("timestamp", { ascending: false });

      if (nodesError) throw nodesError;
      setActiveNodes(nodesData || []);
      setComponentLoading(prev => ({ ...prev, nodes: false, versions: false, peers: false }));

      if (!metricsData?.length && !nodesData?.length) {
        throw new Error("No data available");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination helpers
  const getPaginatedData = (data, page, itemsPerPage = ITEMS_PER_PAGE) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getPageCount = (totalItems, itemsPerPage = ITEMS_PER_PAGE) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const PaginationControls = ({ currentPage, totalPages, onPageChange, className = "" }) => (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-1 text-neutral-400 hover:text-[#7afbaf] disabled:text-neutral-600
          hover:bg-neutral-800/50 rounded transition-colors disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm text-neutral-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-1 text-neutral-400 hover:text-[#7afbaf] disabled:text-neutral-600
          hover:bg-neutral-800/50 rounded transition-colors disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  // Component loading skeleton
  const ComponentSkeleton = ({ className = "" }) => (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="h-6 bg-neutral-800/50 rounded-lg w-1/3" />
      <div className="space-y-3">
        <div className="h-10 bg-neutral-800/50 rounded-lg" />
        <div className="h-10 bg-neutral-800/50 rounded-lg" />
        <div className="h-10 bg-neutral-800/50 rounded-lg" />
      </div>
    </div>
  );

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const time = format(date, "HH:mm");
    let dateText;

    if (isToday(date)) {
      dateText = "Today";
    } else if (isYesterday(date)) {
      dateText = "Yesterday";
    } else {
      dateText = format(date, "dd.MM.yyyy");
    }

    return { time, dateText };
  };

  // Calculate statistics
  const totalUniqueNodes = [...new Set(activeNodes.map(node => node.node_id))].length;
  const averagePeerCount = activeNodes.length
    ? (activeNodes.reduce((acc, node) => acc + node.peer_count, 0) / activeNodes.length).toFixed(1)
    : 0;
  const activePeerIds = [...new Set(activeNodes.map((node) => node.peer_id))];

  // Calculate today's active nodes
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayActiveNodes = [...new Set(
    activeNodes
      .filter(node => new Date(node.timestamp) >= todayStart)
      .map(node => node.node_id)
  )].length;

  const versionDistribution = activeNodes.reduce((acc, node) => {
    acc[node.version] = (acc[node.version] || 0) + 1;
    return acc;
  }, {});
  const lastUpdated = formatLastUpdated(activeNodes[0]?.timestamp);

  // Get paginated data
  const versionEntries = Object.entries(versionDistribution);
  const paginatedVersions = getPaginatedData(versionEntries, versionPage);
  const displayPeerIds = searchQuery ? searchResults : activePeerIds;
  const paginatedPeerIds = getPaginatedData(displayPeerIds, peerPage);

  // Calculate total pages
  const totalVersionPages = getPageCount(versionEntries.length);
  const totalPeerPages = getPageCount(displayPeerIds.length);

  // Prepare chart data
  const chartData = metrics.map((day) => ({
    date: new Date(day.date),
    "Active Nodes": day.active_nodes_count
  }));

  // Get unique node IDs and their latest records
  const nodeRecords = activeNodes.reduce((acc, node) => {
    if (!acc[node.node_id] || new Date(acc[node.node_id].timestamp) < new Date(node.timestamp)) {
      acc[node.node_id] = node;
    }
    return acc;
  }, {});

  const activeNodeIds = Object.keys(nodeRecords);
  const displayNodeIds = searchQuery ? searchResults : activeNodeIds;
  const paginatedNodeIds = getPaginatedData(displayNodeIds, peerPage);
  const totalNodePages = getPageCount(displayNodeIds.length);

  // Node details dialog state
  const [selectedNode, setSelectedNode] = useState(null);

  // Format timestamp for node details
  const formatNodeTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    if (isToday(date)) {
      return `Today at ${format(date, "HH:mm")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "HH:mm")}`;
    }
    return format(date, "MMM d, yyyy 'at' HH:mm");
  };

  return (
    <>
      <Head>
        <title>Codex Metrics</title>
        <meta name="description" content="Real-time metrics dashboard for Codex testnet nodes, displaying network statistics, version distribution, and geographic data." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://metrics.codex.storage" />
        <meta property="og:title" content="Codex Metrics" />
        <meta property="og:description" content="Real-time metrics dashboard for Codex testnet nodes, displaying network statistics, version distribution, and geographic data." />
        <meta property="og:image" content="https://metrics.codex.storage/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://metrics.codex.storage" />
        <meta name="twitter:title" content="Codex Metrics" />
        <meta name="twitter:description" content="Real-time metrics dashboard for Codex testnet nodes, displaying network statistics, version distribution, and geographic data." />
        <meta name="twitter:image" content="https://metrics.codex.storage/og-image.png" />

        {/* Additional SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="keywords" content="Codex, blockchain, storage, testnet, metrics, dashboard, nodes, network statistics" />
        <link rel="canonical" href="https://metrics.codex.storage" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <div className="min-h-screen bg-gradient-to-bl from-black to-[#222222] text-white overflow-x-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-neutral-800"
        >
          <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Codex" className="w-8 h-8 sm:w-10 sm:h-10" />
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold">Metrics</h1>
                <span className="text-xs text-[#7afbaf] font-bold border border-[#7afbaf] rounded-full px-2 py-0.5">Testnet</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="flex-1 sm:flex-none min-w-[120px] bg-neutral-900 border border-neutral-800 rounded-lg px-2 sm:px-3 py-2 text-sm font-medium
                  hover:border-neutral-700 focus:border-[#7afbaf] focus:ring-1 focus:ring-[#7afbaf] 
                  transition-colors cursor-pointer outline-none"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="1y">Last Year</option>
              </select>
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 text-neutral-400 hover:text-[#7afbaf] disabled:text-neutral-600 
                  bg-neutral-900 border border-neutral-800 rounded-lg
                  hover:border-neutral-700 disabled:border-neutral-800 disabled:hover:border-neutral-800
                  focus:border-[#7afbaf] focus:ring-1 focus:ring-[#7afbaf] 
                  transition-colors cursor-pointer disabled:cursor-not-allowed outline-none"
              >
                <RotateCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh data</span>
              </button>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="p-2 text-neutral-400 hover:text-[#7afbaf]
                      bg-neutral-900 border border-neutral-800 rounded-lg
                      hover:border-neutral-700 focus:border-[#7afbaf] focus:ring-1 
                      focus:ring-[#7afbaf] transition-colors cursor-pointer outline-none"
                  >
                    <Info className="w-5 h-5" />
                    <span className="sr-only">Dashboard information</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl mb-4 sm:mb-6">Testnet Metrics</DialogTitle>
                    {/* Image dimensions: 1200x630 (2:1.05 aspect ratio - optimal for social sharing) */}
                    <img src="testnet.png" alt="Testnet Metrics" className="w-full aspect-[2/1.05] rounded-lg mb-4 sm:mb-6" />
                    <DialogDescription className="text-sm sm:text-base pt-2 sm:pt-3 space-y-4">
                      <p>
                        The data displayed in this dashboard is collected from Codex nodes that use the{' '}
                        <a
                          href="https://github.com/codex-storage/cli"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7afbaf] hover:underline"
                        >
                          Codex CLI
                        </a>
                        {' '}for running a Codex alturistic node in the testnet.
                      </p>
                      <p>
                        Users agree to a privacy disclaimer before using the Codex CLI and the data collected will be used to
                        understand the testnet statistics and help troubleshooting users who face
                        difficulty in getting onboarded to Codex.
                      </p>
                    </DialogDescription>
                    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6  pt-4 sm:pt-6">
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 border-t border-neutral-800 pt-4 sm:pt-6">Don't wish to provide data?</h4>
                        <p className="text-sm text-neutral-400">
                          You can still run a Codex node without providing any data. To do this, please follow the steps mentioned in the{' '}
                          <a
                            href="https://docs.codex.storage/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7afbaf] hover:underline"
                          >
                            Codex documentation
                          </a>
                          {' '}which does not use the Codex CLI.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Is there an incentive to run a Codex node?</h4>
                        <p className="text-sm text-neutral-400">
                          Codex is currently in testnet and it is not incentivized. However, in the future, Codex may be incentivized as per the roadmap. But please bear in mind that no incentives are promised for testnet node operators.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">I have a question or suggestion</h4>
                        <p className="text-sm text-neutral-400">
                          The best way to get in touch with us is to join the{' '}
                          <a
                            href="https://discord.gg/codex-storage"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7afbaf] hover:underline"
                          >
                            Codex discord
                          </a>
                          {' '}and ask your question in the #support channel.
                        </p>
                      </div>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.header>

        <main className="max-w-[2000px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {error ? (
            <ErrorState message={error} />
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Top Section: Stats + Graph */}
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Left Column - Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-4 gap-4 lg:h-[450px]">
                  {[
                    {
                      title: "Total Unique Nodes",
                      value: totalUniqueNodes,
                      Icon: Users,
                      delay: 0,
                      isLoading: componentLoading.nodes,
                    },
                    {
                      title: "Average Peer Count",
                      value: averagePeerCount,
                      Icon: Network,
                      delay: 0.1,
                      isLoading: componentLoading.nodes,
                    },
                    {
                      title: "Active Today",
                      value: todayActiveNodes,
                      Icon: Database,
                      delay: 0.2,
                      isLoading: componentLoading.nodes,
                    },
                    {
                      title: "Last Updated",
                      value: lastUpdated,
                      Icon: Clock,
                      delay: 0.3,
                      isLoading: componentLoading.nodes,
                    },
                  ].map((stat) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: stat.delay }}
                      className="bg-neutral-900 p-4 sm:p-5 rounded-xl hover:bg-neutral-900/80 
                        transition-colors border border-neutral-800 hover:border-neutral-700
                        flex flex-col justify-between h-full"
                    >
                      <h3 className="text-neutral-400 text-sm font-medium flex items-center gap-2 mb-3">
                        <stat.Icon className="w-4 h-4 opacity-60" />
                        {stat.title}
                      </h3>
                      <div className="mt-auto">
                        {stat.isLoading ? (
                          <div className="h-8 bg-neutral-800/50 rounded animate-pulse" />
                        ) : stat.title === "Last Updated" ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#7afbaf] tracking-tight">
                              {lastUpdated.time}
                            </span>
                            <span className="text-sm font-medium text-[#7afbaf] opacity-70">
                              {lastUpdated.dateText}
                            </span>
                          </div>
                        ) : (
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#7afbaf] tracking-tight">
                            {stat.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Right Column - Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-neutral-900 p-4 sm:p-6 rounded-xl h-[350px] lg:h-[450px] border border-neutral-800 
                    hover:border-neutral-700 transition-colors"
                >
                  <Tabs defaultValue="nodes" className="h-full flex flex-col">
                    <div className="flex items-center justify-center mb-6">
                      <TabsList className="bg-neutral-800 border border-neutral-700">
                        <TabsTrigger value="nodes" className="data-[state=active]:bg-neutral-900">
                          <Activity className="w-4 h-4 mr-2" />
                          Active Nodes
                        </TabsTrigger>
                        <TabsTrigger value="geo" className="data-[state=active]:bg-neutral-900">
                          <Globe className="w-4 h-4 mr-2" />
                          Geographic Distribution
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="nodes" className="flex-1 mt-0">
                      {componentLoading.metrics ? (
                        <div className="h-full flex items-center justify-center">
                          <ComponentSkeleton />
                        </div>
                      ) : metrics.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-neutral-400">No data available for the selected timeframe</p>
                        </div>
                      ) : (
                        <div className="h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#333"
                                vertical={false}
                              />
                              <XAxis
                                dataKey="date"
                                stroke="#666"
                                tickFormatter={(date) => format(new Date(date), "MMM d")}
                                fontSize={12}
                                tickMargin={10}
                              />
                              <YAxis
                                stroke="#666"
                                fontSize={12}
                                tickMargin={10}
                                axisLine={false}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#1a1a1a",
                                  border: "1px solid #333",
                                  borderRadius: "8px",
                                  fontFamily: "var(--font-inter)",
                                  fontSize: "12px",
                                  padding: "12px",
                                }}
                                cursor={{ stroke: "#666" }}
                                formatter={(value) => [`${value} nodes`, 'Active Nodes']}
                                labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                              />
                              <Line
                                type="monotone"
                                dataKey="Active Nodes"
                                stroke="#7afbaf"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6, fill: "#7afbaf" }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="geo" className="flex-1 mt-0">
                      <div className="h-full flex items-center justify-center">
                        <p className="text-neutral-400">Geographic distribution view coming soon</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              </div>

              {/* Bottom Section: Version Distribution + Active Peers */}
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Version Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-neutral-900 p-4 sm:p-6 rounded-xl border border-neutral-800 
                    hover:border-neutral-700 transition-colors h-[300px] lg:h-[350px] flex flex-col"
                >
                  <h3 className="text-neutral-400 mb-4 sm:mb-6 font-medium flex items-center gap-2">
                    <Database className="w-5 h-5 opacity-60" />
                    Version Distribution
                  </h3>
                  {componentLoading.versions ? (
                    <ComponentSkeleton />
                  ) : Object.keys(versionDistribution).length === 0 ? (
                    <div className="flex items-center justify-center flex-1">
                      <p className="text-neutral-400">No version data available</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin 
                        scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
                        {paginatedVersions.map(([version, count]) => (
                          <div key={version}>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium text-sm sm:text-base">{version}</span>
                              <span className="font-medium text-sm sm:text-base text-[#7afbaf]">
                                {count}
                              </span>
                            </div>
                            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / totalUniqueNodes) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="bg-[#7afbaf] h-2 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <PaginationControls
                        currentPage={versionPage}
                        totalPages={totalVersionPages}
                        onPageChange={setVersionPage}
                        className="mt-4 pt-4 border-t border-neutral-800"
                      />
                    </>
                  )}
                </motion.div>

                {/* Active Node IDs List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-neutral-900 p-4 sm:p-6 rounded-xl border border-neutral-800 
                    hover:border-neutral-700 transition-colors h-[300px] lg:h-[350px] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                      <Database className="w-4 h-4 opacity-60" />
                      Active Node IDs
                    </h3>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search node IDs..."
                        className="pl-9 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm
                          placeholder:text-neutral-500 focus:border-[#7afbaf] focus:ring-1 focus:ring-[#7afbaf]
                          transition-colors outline-none w-[200px]"
                      />
                    </div>
                  </div>
                  {componentLoading.nodes ? (
                    <ComponentSkeleton />
                  ) : paginatedNodeIds.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-neutral-400">
                        {searchQuery ? "No matching node IDs found" : "No active node IDs"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 overflow-y-auto flex-1 pr-2 scrollbar-thin 
                        scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
                        {paginatedNodeIds.map((nodeId) => {
                          const node = nodeRecords[nodeId];
                          return (
                            <Dialog key={nodeId}>
                              <DialogTrigger asChild>
                                <button
                                  className="w-full p-3 bg-neutral-800/50 hover:bg-neutral-800 
                                    rounded-lg transition-colors text-left text-sm flex items-center 
                                    justify-between group"
                                >
                                  <span className="truncate flex-1">{nodeId}</span>
                                  <span className="text-[#7afbaf] opacity-0 group-hover:opacity-100 
                                    transition-opacity text-xs">View Details</span>
                                </button>
                              </DialogTrigger>
                              <DialogContent className="p-4 sm:p-6">
                                <DialogHeader>
                                  <div className="flex items-center gap-3 mb-4">
                                    <img src="/logo.svg" alt="Codex" className="w-8 h-8 sm:w-10 sm:h-10" />
                                    <div className="flex items-center gap-2">
                                      <h1 className="text-lg sm:text-xl font-bold text-white">Codex</h1>
                                      <span className="text-xs text-[#7afbaf] font-bold border border-[#7afbaf] rounded-full px-2 py-0.5">Testnet</span>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm text-neutral-400 mb-1">NODE ID</h4>
                                      <p className="text-sm sm:text-base font-medium break-all text-[#7afbaf]">{nodeId}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm text-neutral-400 mb-1">VERSION</h4>
                                      <p className="text-sm sm:text-base font-medium text-[#7afbaf]">{node.version}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm text-neutral-400 mb-1">LAST ONLINE</h4>
                                      <p className="text-sm sm:text-base font-medium text-[#7afbaf]">
                                        {formatNodeTimestamp(node.timestamp)}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm text-neutral-400 mb-1">CONNECTED DHT PEERS</h4>
                                      <p className="text-sm sm:text-base font-medium text-[#7afbaf]">{node.peer_count}</p>
                                    </div>
                                  </div>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          );
                        })}
                      </div>
                      <PaginationControls
                        currentPage={peerPage}
                        totalPages={totalNodePages}
                        onPageChange={setPeerPage}
                        className="mt-4 pt-4 border-t border-neutral-800"
                      />
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
