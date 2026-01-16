"use client";

import React, { useState } from 'react';
import { ExternalLink, X, Link2 } from 'lucide-react';
import { Claim } from '@/types/claim';
import { Citation } from '@/types/citation';
import { CitationReference } from '@/types/citation';
import { TagBadge } from '@/components/tag-badge';
import { SUMMARY_CHAR_LIMIT } from '@/constants/ui-constants';

interface CitationPanelProps {
  claim: Claim | null;
  citations: Record<string, Citation>;
  onClose: () => void;
}

const CitationCard: React.FC<{
  citation: Citation;
  citationRef: CitationReference;
  index: number;
}> = ({ citation, citationRef, index }) => {
  const [isExpanded, setIsExpanded] = useState(true); // default to expanded
  const displayText = citation.summary.length > SUMMARY_CHAR_LIMIT && !isExpanded 
    ? citation.summary.slice(0, SUMMARY_CHAR_LIMIT) + '...' 
    : citation.summary;

  return (
    <div className="citation-card bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-mono text-muted-foreground">Citation #{index + 1}</span>
        <div className="flex flex-wrap gap-1">
          {citation.tags.map((tag, i) => (
            <TagBadge key={i} tag={tag} />
          ))}
        </div>
      </div>
      
      <p className="text-sm text-foreground/80 mb-3 leading-relaxed italic border-l-2 border-primary/50 pl-3">
        "{citationRef.snippet}"
      </p>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {displayText}
        </p>
        {citation.summary.length > SUMMARY_CHAR_LIMIT && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary hover:text-primary/80 mt-1 font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      
      <a
        href={citation.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        View source
      </a>
    </div>
  );
};

export const CitationPanel: React.FC<CitationPanelProps> = ({
  claim,
  citations,
  onClose,
}) => {
  if (!claim) return null;

  const relevantCitations = claim.relevant_citations || [];
  const hasCitations = relevantCitations.length > 0;

  return (
    <div className="citation-panel h-full flex flex-col">
      <div className="panel-header h-14 px-4 border-b border-border flex items-center justify-between bg-card">
        <h3 className="font-semibold text-foreground">Citation Details</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="citations-section">
          <h4 className="text-sm font-medium text-foreground/80 mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            {hasCitations 
              ? `${relevantCitations.length} Citation${relevantCitations.length !== 1 ? 's' : ''}` 
              : 'No Citations. Consider reviewing the claim.'}
          </h4>

          {hasCitations && (
            <div className="space-y-3">
              {relevantCitations.map((ref, index) => {
                const citation = citations[ref.citation_id];
                if (!citation) return null;
                return (
                  <CitationCard
                    key={ref.citation_id}
                    citation={citation}
                    citationRef={ref}
                    index={index}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CitationPanel;
