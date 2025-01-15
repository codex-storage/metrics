"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Info, Activity, Terminal, AlertTriangle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function RunPage() {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    // Check if user has previously agreed
    const agreed = localStorage.getItem('codex-disclaimer-agreed');
    if (agreed === 'true') {
      setHasAgreed(true);
      setShowDisclaimer(false);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('codex-disclaimer-agreed', 'true');
    setHasAgreed(true);
    setShowDisclaimer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-black to-[#222222] text-white overflow-x-hidden">
      <Head>
        <title>Run a Node | Codex</title>
        <meta name="description" content="Learn how to run a Codex node and join the network." />
        <meta property="og:title" content="Run a Node | Codex" />
        <meta property="og:description" content="Learn how to run a Codex node and join the network." />
        <meta property="og:image" content="/testnet.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Run a Node | Codex" />
        <meta name="twitter:description" content="Learn how to run a Codex node and join the network." />
        <meta name="twitter:image" content="/testnet.png" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      {/* Disclaimer Dialog */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl mb-4">Privacy Disclaimer</DialogTitle>
            <DialogDescription className="text-sm sm:text-base space-y-4">
              <p>
                Codex is currently in testnet and to make your testnet experience better, we are currently
                tracking some of your node and network information such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Node ID</li>
                <li>Peer ID</li>
                <li>Public IP address</li>
                <li>Codex node version</li>
                <li>Number of connected peers</li>
                <li>Discovery and listening ports</li>
              </ul>
              <p>
                These information will be used for calculating various metrics that can eventually make the
                Codex experience better.
              </p>
              <Alert variant="destructive" className="mt-4 bg-yellow-500/10 border-yellow-500/20">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="text-yellow-500">Alternative Option</AlertTitle>
                <AlertDescription className="text-neutral-400">
                  If you don't wish to provide this data, you can use the manual setup instructions at{' '}
                  <a 
                    href="https://docs.codex.storage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7afbaf] hover:underline"
                  >
                    docs.codex.storage
                  </a>
                </AlertDescription>
              </Alert>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <a 
              href="https://docs.codex.storage"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-neutral-400 
                bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Use Manual Setup
            </a>
            <Button
              onClick={handleAgree}
              className="bg-[#7afbaf] text-black hover:bg-[#7afbaf]/90 transition-colors"
            >
              I Agree & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-neutral-800"
      >
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Codex" className="w-8 h-8 sm:w-10 sm:h-10" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold">Run a Node</h1>
              <span className="text-xs text-[#7afbaf] font-bold border border-[#7afbaf] rounded-full px-2 py-0.5">Testnet</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="p-2 text-neutral-400 hover:text-[#7afbaf]
                    bg-neutral-900 border border-neutral-800 rounded-lg
                    hover:border-neutral-700 focus:border-[#7afbaf] focus:ring-1 
                    focus:ring-[#7afbaf] transition-colors cursor-pointer outline-none"
                >
                  <Info className="w-5 h-5" />
                  <span className="sr-only">Information</span>
                </button>
              </DialogTrigger>
              <DialogContent className="p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl mb-4 sm:mb-6">Run a Codex Node</DialogTitle>
                  <img src="/testnet.png" alt="Testnet" className="w-full aspect-[2/1.05] rounded-lg mb-4 sm:mb-6" />
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
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#7afbaf] 
                bg-[#7afbaf]/10 border border-[#7afbaf] rounded-lg
                hover:bg-[#7afbaf]/20 focus:ring-1 focus:ring-[#7afbaf] 
                transition-colors cursor-pointer outline-none"
            >
              <Activity className="hidden sm:block w-4 h-4" />
              <span className="hidden sm:block">View Metrics</span>
              <Activity className="sm:hidden w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
          Run a Codex Node
        </h1>
        
        {hasAgreed ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Tutorial Section */}
            <div className="bg-black/50 rounded-lg p-4 sm:p-6 border border-neutral-800">
              {/* Step 1: Port Forwarding */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#7afbaf]/10 rounded-lg flex items-center justify-center border border-[#7afbaf]/20">
                    <span className="text-[#7afbaf] font-bold">1</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Port Forwarding</h2>
                    <p className="text-sm text-neutral-400">Configure your network to allow Codex connections</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-neutral-900 text-neutral-400 rounded-full">Required</span>
              </div>
              <div className="prose prose-invert max-w-none space-y-4">
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">Required Ports</h3>
                  <ul className="list-none space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#7afbaf]/10 rounded-lg flex items-center justify-center">
                        <span className="text-[#7afbaf] font-mono">UDP</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Port 8090/UDP</p>
                        <p className="text-sm text-neutral-400">Required for node discovery</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#7afbaf]/10 rounded-lg flex items-center justify-center">
                        <span className="text-[#7afbaf] font-mono">TCP</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Port 8070/TCP</p>
                        <p className="text-sm text-neutral-400">Required for data exchange</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">Need Help?</h3>
                  <p className="text-neutral-400 mb-4">
                    If you're new to port forwarding, we recommend watching this helpful tutorial:
                  </p>
                  <a 
                    href="https://www.youtube.com/watch?v=jfSLxs40sIw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#7afbaf] hover:underline"
                  >
                    <span>Watch Port Forwarding Tutorial</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Step 2: Install Codex */}
            <div className="bg-black/50 rounded-lg p-4 sm:p-6 border border-neutral-800">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#7afbaf]/10 rounded-lg flex items-center justify-center border border-[#7afbaf]/20">
                    <span className="text-[#7afbaf] font-bold">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Install Codex</h2>
                    <p className="text-sm text-neutral-400">Download and install the Codex Storage CLI</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-neutral-900 text-neutral-400 rounded-full">Required</span>
              </div>
              <div className="prose prose-invert max-w-none space-y-4">
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">Prerequisites</h3>
                  <p className="text-neutral-400 mb-4">
                    Before you begin, ensure you have Node.js installed on your machine. The Codex CLI requires Node.js to run.
                  </p>
                </div>
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">Installation Steps</h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="text-neutral-400">
                      Open your terminal
                    </li>
                    <li className="text-neutral-400">
                      Run the following command:
                      <div className="mt-2 relative">
                        <pre className="bg-black rounded-lg p-3 font-mono text-sm text-[#7afbaf]">npx codexstorage</pre>
                        <button 
                          className="absolute right-2 top-2 p-2 text-neutral-400 hover:text-[#7afbaf] transition-colors"
                          onClick={() => navigator.clipboard.writeText('npx codexstorage')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </li>
                    <li className="text-neutral-400">
                      Select option 1: "Download and install Codex" from the menu
                    </li>
                    <li className="text-neutral-400">
                      Follow the prompts to complete the installation
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Step 3: Run Your Node */}
            <div className="bg-black/50 rounded-lg p-4 sm:p-6 border border-neutral-800">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#7afbaf]/10 rounded-lg flex items-center justify-center border border-[#7afbaf]/20">
                    <span className="text-[#7afbaf] font-bold">3</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Run Your Node</h2>
                    <p className="text-sm text-neutral-400">Start your Codex node and verify its status</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-neutral-900 text-neutral-400 rounded-full">Required</span>
              </div>
              <div className="prose prose-invert max-w-none space-y-4">
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">Starting Your Node</h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="text-neutral-400">
                      Select option 2: "Run Codex node" from the main menu
                    </li>
                    <li className="text-neutral-400">
                      Press Enter to use default ports (or enter custom ports if needed)
                    </li>
                    <li className="text-neutral-400">
                      Keep this terminal window open to keep your node running
                    </li>
                  </ol>
                  <Alert className="mt-4 bg-[#7afbaf]/10 border-[#7afbaf]/20">
                    <Terminal className="h-4 w-4 text-[#7afbaf]" />
                    <AlertTitle className="text-[#7afbaf]">Keep Terminal Active</AlertTitle>
                    <AlertDescription className="text-neutral-400">
                      The node stops running once you close this terminal. Keep it open to maintain node operation.
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">Verify Node Status</h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="text-neutral-400">
                      Open a new terminal window
                    </li>
                    <li className="text-neutral-400">
                      Run <code className="text-[#7afbaf]">npx codexstorage</code> again
                    </li>
                    <li className="text-neutral-400">
                      Select option 3: "Check node status"
                    </li>
                    <li className="text-neutral-400">
                      Choose "View Node Information" to see your unique Node ID
                    </li>
                  </ol>
                  <Alert variant="destructive" className="mt-4 bg-yellow-500/10 border-yellow-500/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle className="text-yellow-500">Important</AlertTitle>
                    <AlertDescription className="text-neutral-400">
                      Make sure to save your Node ID as you'll need it for the verification step.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>

            {/* Step 4: Test Your Node */}
            <div className="bg-black/50 rounded-lg p-4 sm:p-6 border border-neutral-800">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#7afbaf]/10 rounded-lg flex items-center justify-center border border-[#7afbaf]/20">
                    <span className="text-[#7afbaf] font-bold">4</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Test Your Node</h2>
                    <p className="text-sm text-neutral-400">Upload and download files to test your setup</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-neutral-900 text-neutral-400 rounded-full">Optional</span>
              </div>
              <div className="prose prose-invert max-w-none space-y-4">
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">Upload a File</h3>
                  <p className="text-neutral-400 mb-4">
                    You can upload a file using either of these methods:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li className="text-neutral-400">
                      Select option 4: "Upload a file" from the main menu
                    </li>
                    <li className="text-neutral-400">
                      Or use the command:
                      <div className="mt-2 relative">
                        <pre className="bg-black rounded-lg p-3 font-mono text-sm text-[#7afbaf]">npx codexstorage --upload &lt;PATH-TO-THE-FILE&gt;</pre>
                        <button 
                          className="absolute right-2 top-2 p-2 text-neutral-400 hover:text-[#7afbaf] transition-colors"
                          onClick={() => navigator.clipboard.writeText('npx codexstorage --upload')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">Download a File</h3>
                  <p className="text-neutral-400 mb-4">
                    To download a file from the network:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li className="text-neutral-400">
                      Select option 5: "Download a file" from the main menu
                    </li>
                    <li className="text-neutral-400">
                      Or use the command:
                      <div className="mt-2 relative">
                        <pre className="bg-black rounded-lg p-3 font-mono text-sm text-[#7afbaf]">npx codexstorage --download &lt;CID&gt;</pre>
                        <button 
                          className="absolute right-2 top-2 p-2 text-neutral-400 hover:text-[#7afbaf] transition-colors"
                          onClick={() => navigator.clipboard.writeText('npx codexstorage --download')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  </ul>
                  <Alert variant="destructive" className="mt-4 bg-yellow-500/10 border-yellow-500/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle className="text-yellow-500">File Persistence</AlertTitle>
                    <AlertDescription className="text-neutral-400">
                      Testnet files are not persistent and are cleared within 48 hours.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>

            {/* Step 5: Verify & Get Role */}
            <div className="bg-black/50 rounded-lg p-4 sm:p-6 border border-neutral-800">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#7afbaf]/10 rounded-lg flex items-center justify-center border border-[#7afbaf]/20">
                    <span className="text-[#7afbaf] font-bold">5</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Verify Your Node</h2>
                    <p className="text-sm text-neutral-400">Get your Altruistic Mode role on Discord</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-neutral-900 text-neutral-400 rounded-full">Required</span>
              </div>
              <div className="prose prose-invert max-w-none space-y-4">
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">Discord Verification</h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="text-neutral-400">
                      Join the{' '}
                      <a 
                        href="https://discord.gg/codex-storage" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#7afbaf] hover:underline"
                      >
                        Codex Discord
                      </a>
                    </li>
                    <li className="text-neutral-400">
                      Go to the #bot channel
                    </li>
                    <li className="text-neutral-400">
                      Run the command:
                      <div className="mt-2 relative">
                        <pre className="bg-black rounded-lg p-3 font-mono text-sm text-[#7afbaf]">/node &lt;YOUR-NODE-ID&gt;</pre>
                      </div>
                    </li>
                  </ol>
                  <Alert className="mt-4 bg-[#7afbaf]/10 border-[#7afbaf]/20">
                    <Info className="h-4 w-4 text-[#7afbaf]" />
                    <AlertTitle className="text-[#7afbaf]">Success</AlertTitle>
                    <AlertDescription className="text-neutral-400">
                      Upon successful verification, you'll receive the @Altruistic Mode role! 🎉
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-lg font-medium text-white mb-3">What can I do next?</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li className="text-neutral-400">Try using the Codex GUI app</li>
                    <li className="text-neutral-400">
                      <a 
                        href="https://docs.codex.storage" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#7afbaf] hover:underline"
                      >
                        Explore the API documentation
                      </a>
                    </li>
                    <li className="text-neutral-400">Run a node with Marketplace support</li>
                    <li className="text-neutral-400">Become a storage provider</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
              <h2 className="text-xl sm:text-2xl font-semibold text-white">Privacy Agreement Required</h2>
              <p className="text-neutral-400 max-w-md mx-auto">
                Please agree to the privacy disclaimer to view the node setup instructions.
              </p>
              <Button
                onClick={() => setShowDisclaimer(true)}
                className="mt-4 bg-[#7afbaf] text-black hover:bg-[#7afbaf]/90 transition-colors"
              >
                View Disclaimer
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
