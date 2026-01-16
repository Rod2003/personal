// utility function to segment text by citation
import { TextSegment } from "@/types/text";
import { Claim } from "@/types/claim";

// return list of text segments with response data to render
export function segmentText(
  originalText: string,
  claims: Record<string, Claim>
): TextSegment[] {
  const segments: TextSegment[] = [];

  // convert claims to array and sort by start_index
  const sortedClaims = Object.entries(claims)
    .map(([id, claim]) => ({ id, ...claim }))
    .sort((a, b) => a.start_index - b.start_index);

  let currentIndex = 0;

  for (const claim of sortedClaims) {
    // add non-claim text before this claim
    if (claim.start_index > currentIndex) {
      segments.push({
        text: originalText.slice(currentIndex, claim.start_index),
        claimId: null,
        startIndex: currentIndex,
        endIndex: claim.start_index,
      });
    }

    // add the claim segment
    segments.push({
      text: originalText.slice(claim.start_index, claim.end_index),
      claimId: claim.id,
      startIndex: claim.start_index,
      endIndex: claim.end_index,
    });

    currentIndex = claim.end_index;
  }

  // add any remaining text after the last claim
  if (currentIndex < originalText.length) {
    segments.push({
      text: originalText.slice(currentIndex),
      claimId: null,
      startIndex: currentIndex,
      endIndex: originalText.length,
    });
  }

  return segments;
}

// gets the claim tree structure starting from root claims
export function getRootClaims(claims: Record<string, Claim>): string[] {
  return Object.entries(claims)
    // filter out claims with parent_claim_ids, we only want root claims
    .filter(([_, claim]) => claim.parent_claim_ids.length === 0)
    .map(([id]) => id);
}

// calculates depth of a claim in the hierarchy recursively
export function getClaimDepth(
  claimId: string,
  claims: Record<string, Claim>,
  visited: Set<string> = new Set()
): number {
  if (visited.has(claimId)) return 0; // prevent cycles
  visited.add(claimId);

  const claim = claims[claimId];
  if (!claim || claim.parent_claim_ids.length === 0) return 0;

  const parentDepths = claim.parent_claim_ids.map((parentId) =>
    getClaimDepth(parentId, claims, visited)
  );

  return Math.max(...parentDepths) + 1;
}
