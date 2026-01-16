"use client";

import React from 'react';
import { Claim } from '@/types/claim';
import { getRootClaims } from '@/utils/segment-text';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';

interface ClaimTreeProps {
  claims: Record<string, Claim>;
  selectedClaimId: string | null;
  onClaimSelect: (claimId: string) => void;
}

interface ClaimNodeProps {
  claimId: string;
  claims: Record<string, Claim>;
  depth: number;
  selectedClaimId: string | null;
  onClaimSelect: (claimId: string) => void;
}

const ClaimNode: React.FC<ClaimNodeProps> = ({
  claimId,
  claims,
  depth,
  selectedClaimId,
  onClaimSelect,
}) => {
  const claim = claims[claimId];
  if (!claim) return null;

  const hasChildren = claim.children_claim_ids.length > 0;
  const isSelected = selectedClaimId === claimId;
  const hasCitations = claim.relevant_citations.length > 0;

  const claimContent = (
    <>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-muted-foreground">#{claimId}</span>
        {hasCitations && (
          <span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded">
            {claim.relevant_citations.length} {claim.relevant_citations.length === 1 ? 'citation' : 'citations'}
          </span>
        )}
      </div>
      <p className="text-sm text-foreground/80 line-clamp-2 text-left">
        {claim.claim_text}
      </p>
    </>
  );

  if (!hasChildren) {
    return (
      <div 
        className={`p-3 rounded-lg transition-all cursor-pointer border border-border border-l-2 ${isSelected ? 'bg-blue-500/10 border-blue-400 border-blue-400/50' : 'border-l-primary hover:bg-muted hover:border-primary/30'}`}
        onClick={() => onClaimSelect(claimId)}
      >
        {claimContent}
      </div>
    );
  }

  return (
    <AccordionItem value={claimId} className="border-none">
      <AccordionTrigger 
        className={`w-full p-3 rounded-lg transition-all hover:no-underline border border-border border-l-2 ${isSelected ? 'bg-blue-500/10 border-blue-400 border-blue-400/50' : 'border-l-primary hover:bg-muted hover:border-primary/30'}`}
        onClick={() => onClaimSelect(claimId)}
      >
        <div className="flex-1 min-w-0 text-left">
          {claimContent}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4 border-l border-border ml-2 pt-2">
        <Accordion type="multiple" defaultValue={claim.children_claim_ids} className="space-y-1">
          {claim.children_claim_ids.map(childId => (
            <ClaimNode
              key={childId}
              claimId={childId}
              claims={claims}
              depth={depth + 1}
              selectedClaimId={selectedClaimId}
              onClaimSelect={onClaimSelect}
            />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
};

export const ClaimTree: React.FC<ClaimTreeProps> = ({
  claims,
  selectedClaimId,
  onClaimSelect,
}) => {
  const rootClaims = getRootClaims(claims);

  // include claims without parents that also aren't referenced as children
  const allClaimIds = Object.keys(claims);
  const referencedAsChildren = new Set(
    Object.values(claims).flatMap(c => c.children_claim_ids)
  );
  const orphanClaims = allClaimIds.filter(
    id => !rootClaims.includes(id) && !referencedAsChildren.has(id)
  );

  const allRootIds = [...rootClaims, ...orphanClaims];

  return (
    <div className="claim-tree">
      <Accordion type="multiple" defaultValue={allRootIds} className="space-y-1">
        {allRootIds.map(claimId => (
          <ClaimNode
            key={claimId}
            claimId={claimId}
            claims={claims}
            depth={0}
            selectedClaimId={selectedClaimId}
            onClaimSelect={onClaimSelect}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ClaimTree;
