"use client";

import React from 'react';
import { Claim } from '@/types/claim';
import { TextSegment } from '@/types/text';
import { segmentText } from '@/utils/segment-text';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface DocumentViewerProps {
  originalText: string;
  claims: Record<string, Claim>;
  selectedClaimId: string | null;
  onClaimClick: (claimId: string) => void;
  onClaimHover: (claimId: string | null) => void;
  hoveredClaimId: string | null;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  originalText,
  claims,
  selectedClaimId,
  onClaimClick,
  onClaimHover,
  hoveredClaimId,
}) => {
  const segments = segmentText(originalText, claims);

  const getClaimStyle = (claimId: string) => {
    const isSelected = selectedClaimId === claimId;
    const isHovered = hoveredClaimId === claimId;

    return {
      backgroundColor: isSelected || isHovered ? 'var(--primary)' : 'color-mix(in oklch, var(--primary), transparent 85%)',
      color: isSelected || isHovered ? 'var(--primary-foreground)' : 'inherit',
      borderBottom: '2px solid var(--primary)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderRadius: '2px',
      padding: '1px 2px',
      position: 'relative' as const,
      boxShadow: isSelected ? '0 0 0 2px var(--ring)' : 'none',
    };
  };

  const renderSegment = (segment: TextSegment, index: number) => {
    if (!segment.claimId) {
      return (
        <span key={index} className="text-foreground">
          {segment.text}
        </span>
      );
    }

    const claim = claims[segment.claimId];
    const citations = claim?.relevant_citations || [];
    const citationIds = citations.map(c => c.citation_id).join(',');
    const tooltipText = citations.length > 0 
      ? `Click to view ${citations.length} citation${citations.length !== 1 ? 's' : ''}`
      : 'Click to view claim details (no citations)';

    return (
      <Tooltip key={index}>
        <TooltipTrigger asChild>
          <span
            style={getClaimStyle(segment.claimId)}
            onClick={() => onClaimClick(segment.claimId!)}
            onMouseEnter={() => onClaimHover(segment.claimId)}
            onMouseLeave={() => onClaimHover(null)}
            className="claim-highlight inline"
          >
            {segment.text}
            {citations.length > 0 && (
              <sup className="ml-0.5 text-xs font-semibold text-primary">
                [{citationIds}]
              </sup>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="document-viewer">
      <div className="document-text text-base leading-relaxed whitespace-pre-wrap font-serif">
        {segments.map(renderSegment)}
      </div>
    </div>
  );
};

export default DocumentViewer;
