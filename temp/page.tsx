"use client";

import React, { useState, ChangeEvent, useEffect, useMemo } from "react";
import { postSourceScan } from "../api/sourceScan";
import mockInputs from "../constants/mockInputs";

import { Sun, Moon, FileText, Loader2 } from "lucide-react";

import { Claim } from "@/types/claim";
import { ScanResponse } from "@/types/api";
import { Citation } from "@/types/citation";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TagBadge } from "@/components/tag-badge";
import { InfoBadge } from "@/components/info-badge";
import { Kbd } from "@/components/ui/kbd";

import { DocumentViewer } from "@/components/document-viewer";
import { ClaimTree } from "@/components/claim-tree";
import { CitationPanel } from "@/components/citation-panel";
import { MOCK_API_DELAY } from "@/constants/ui-constants";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [sampleTextInput, setSampleTextInput] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [hoveredClaimId, setHoveredClaimId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("document");

  useEffect(() => {
    // check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // handle escape key to clear text input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && text && !scanResult) {
        setText("");
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [text, scanResult]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newValue;
    });
  };

  // remap claim indices to match actual positions in the original text
  const remapClaimIndices = (response: ScanResponse, originalText: string): ScanResponse => {
    const remappedClaims: Record<string, Claim> = {};
    
    for (const [id, claim] of Object.entries(response.document.claims)) {
      // skip claims without claim_text
      if (!claim.claim_text) {
        remappedClaims[id] = claim;
        continue;
      }
      
      // find the actual position of claim_text in the original text
      const actualIndex = originalText.indexOf(claim.claim_text);
      
      if (actualIndex !== -1) {
        remappedClaims[id] = {
          ...claim,
          start_index: actualIndex,
          end_index: actualIndex + claim.claim_text.length,
        };
      } else {
        // fallback to original indices if text not found
        remappedClaims[id] = claim;
      }
    }
    
    return {
      ...response,
      document: {
        ...response.document,
        claims: remappedClaims,
      },
    };
  };

  const handleClickGo = async () => {
    try {
      setError(null);
      if (!text.trim()) {
        setError("Please enter some text to analyze");
        return;
      }
      setIsLoading(true);
      setScanResult(null);
      setSelectedClaimId(null);
      
      const result = await postSourceScan(text);
      // mocking api call await duration to show loading state working
      await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
      
      // remap claim indices to match original text positions
      const parsedResult = JSON.parse(result) as ScanResponse;
      const remappedResult = remapClaimIndices(parsedResult, text);
      setScanResult(remappedResult);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickSampleText = () => {
    setText(mockInputs[sampleTextInput]);
    setSampleTextInput((sampleTextInput + 1) % mockInputs.length);
    setScanResult(null);
    setSelectedClaimId(null);
  };

  const handleClaimClick = (claimId: string) => {
    setSelectedClaimId(claimId);
  };

  const handleClaimHover = (claimId: string | null) => {
    setHoveredClaimId(claimId);
  };

  const handleClosePanel = () => {
    setSelectedClaimId(null);
  };

  const handleClearResults = () => {
    setText("");
    setScanResult(null);
    setSelectedClaimId(null);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const selectedClaim: Claim | null = scanResult && selectedClaimId 
    ? scanResult.document.claims[selectedClaimId] 
    : null;

  const claims: Record<string, Claim> = scanResult?.document.claims || {};
  const citations: Record<string, Citation> = scanResult?.document.citations || {};

  // memoize to avoid unnecessary re-rendering when values don't change
  const totalClaims = useMemo(() => Object.keys(claims).length, [claims]);
  const totalCitations = useMemo(() => Object.keys(citations).length, [citations]);
  const totalClaimsWithCitations = useMemo(() => Object.values(claims).filter(claimId => claimId.relevant_citations.length > 0).length, [claims]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground relative">
      {/* top right controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {scanResult && (
          <Button
            onClick={handleClearResults}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            New Analysis
          </Button>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleTheme}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground w-9 h-9 p-0"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" align="center">
            <div>
              Toggle {isDarkMode ? 'light' : 'dark'} mode
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* text input */}
      <main className="flex-1 bg-background overflow-hidden">
        {!scanResult ? (
          <div className="max-w-4xl w-full mx-auto px-6 py-12 h-full overflow-y-auto flex flex-col items-center justify-center gap-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] dark:drop-shadow-none"><span className="bg-blue-500/15 border-b-2 border-blue-400 rounded-sm px-1">Fact-check</span> any <span className="relative">text<sup className="absolute -top-3 -right-5 text-sm font-semibold text-blue-700 dark:text-blue-400">[1]</sup></span>.</h1>
              <p className="text-lg text-muted-foreground drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] dark:drop-shadow-none">Start typing or paste your content below.</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border shadow-xl w-full">
              <div className="mb-4 flex items-center justify-between">
                <Button
                  onClick={handleClickSampleText}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  <FileText className="w-4 h-4" />
                  Load Sample Text
                </Button>
                {text && (
                  <button
                    onClick={() => setText("")}
                    className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
                  >
                    Clear <Kbd>Esc</Kbd>
                  </button>
                )}
              </div>

              <textarea
                className="w-full h-[250px] p-4 bg-muted text-foreground rounded-xl border border-border hover:border-blue-400/50 hover:bg-blue-500/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-500 resize-none placeholder:text-muted-foreground"
                placeholder="Paste your text here to analyze claims and find citations..."
                value={text}
                onChange={handleChange}
              />

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm flex items-center gap-2">
                  {error}
                </div>
              )}

              <div className={`flex justify-center transition-all duration-200 ease-in overflow-hidden ${text.trim() ? 'mt-4 max-h-20 opacity-100' : 'mt-0 max-h-0 opacity-0'}`}>
                <Button
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  onClick={handleClickGo}
                  disabled={isLoading || !text.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Scan Document
                    </>
                  )}
                </Button>
              </div>
            </div>

          </div>
        ): (
          <div className="flex flex-col h-full">
            {/* results header */}
            <header className="flex-shrink-0 w-full bg-card py-4 px-6 border-b border-border">
              <h1 className="font-semibold text-2xl">Scan Results</h1>
            </header>

            <div className="flex flex-1 overflow-hidden">
            { /* tabs to toggle between text view and hierarchy view */ }
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden border-border border-r">
              <div className="px-4 border-b border-border bg-card">
                <div className="flex items-center justify-between w-full py-3">
                  <div className="flex flex-col gap-2">
                    <TabsList>
                      <TabsTrigger value="document">Document</TabsTrigger>
                      <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
                    </TabsList>

                    {activeTab === "hierarchy" && (
                      <InfoBadge text="Claims are organized by parent-child relationships." />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <TagBadge tag="Claims" value={totalClaims} />
                    <TagBadge tag="Citations" value={totalCitations} />
                    <TagBadge tag="Claims with Citations" value={totalClaimsWithCitations} />
                  </div>

                </div>
              </div>
                
              <TabsContent value="document" className="flex-1 overflow-y-auto p-6">
                <DocumentViewer
                  originalText={text}
                  claims={claims}
                  selectedClaimId={selectedClaimId}
                  onClaimClick={handleClaimClick}
                  onClaimHover={handleClaimHover}
                  hoveredClaimId={hoveredClaimId}
                />
              </TabsContent>
              <TabsContent value="hierarchy" className="flex-1 overflow-y-auto p-6">
                <ClaimTree
                  claims={claims}
                  selectedClaimId={selectedClaimId}
                  onClaimSelect={handleClaimClick}
                />
              </TabsContent>
            </Tabs>

            {selectedClaimId && (
              <div className="w-1/3 flex-shrink-0 bg-card/50 overflow-hidden"> 
                <CitationPanel 
                    claim={selectedClaim}
                    citations={citations}
                    onClose={handleClosePanel}
                  />
              </div>
            )}
            </div>
          </div>
        )}
      </main>

      {!scanResult && (
        <div className="flex flex-col w-[350px] mx-auto items-center justify-center text-center border-t border-l border-r border-blue-400/50 bg-blue-500/5 py-3 px-6 rounded-md -mb-2">
          <h2 className="font-semibold text-lg text-foreground"><span className="relative"><sup className="absolute top-0 -left-3 text-[10px] font-semibold text-blue-700 dark:text-blue-400">[1]</sup>C</span>ite Rite</h2>
          <p className="text-xs text-muted-foreground">The most advanced way to find citations that back up a document&apos;s claims.</p>
        </div>
      )}
    </div>
  );
}

