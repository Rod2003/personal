import { ProjectMetadata } from '../types/project';

const parioWebHomepage = '/assets/projects/pario-web-homepage.png';
const parioWebProgram = '/assets/projects/pario-web-program.png';
const parioWebCapacity = '/assets/projects/pario-web-capacity.png';
const parioWebValence = '/assets/projects/pario-web-valence.png';
const citeRiteDemo = '/assets/projects/cite-rite-demo.mp4';

export const projectsMetadata: Record<string, ProjectMetadata> = {
  'pario': {
    name: 'Pario',
    description: 'A B2B SaaS platform that helps automate internal workflows for consulting & education firms.',
    timeline: {
      start: '2023',
      end: 'May 2025',
      duration: 'Started as student-tutor matching in 2023, rebranded to Pario January 2025.',
    },
    links: {
      website: 'https://pario.so',
    },
    techStack: {
      frontend: ['React', 'Next.js', 'Tanstack Query', 'Shadcn UI'],
      backend: ['Node.js', 'Flask', 'Python'],
      database: ['Supabase (PostgreSQL)', 'Pinecone'],
      infrastructure: ['Vercel', 'Render'],
      tools: ['OpenAI (embeddings)'],
    },
    sections: [
      {
        title: 'Overview',
        content: [
          { type: 'image', image: parioWebHomepage, caption: 'Pario landing page (https://pario.so)' },
          { type: 'text', content: 'Pario is a B2B SaaS platform that automates internal workflows for consulting and education firms, with a focus on program management and capacity tracking. What started as a student-tutor matching service in 2023 evolved into a fully customizable platform that allows organizations to design their own intake forms and matching workflows.' },
        ],
      },
      {
        title: 'Background',
        content: [
          { type: 'text', content: 'Pario began as a student-tutor matching service in 2023, designed with our first client in mind. The initial architecture used deterministic matching based on learning style, availability, and subject—extremely limiting since it was tailored to a single use case. This put us on the same level as other matching platforms like simplify.jobs, where the use case for matching was limited to one function.' },
          { type: 'text', content: 'After recognizing this limitation, I designed and deployed a fully customizable interface that abstracted domain-specific questions and instead allowed our clients to design their own intake forms and matching workflows. This architectural shift transformed Pario from a rigid, single-purpose tool into a flexible platform capable of handling diverse matching scenarios across different industries.' },
          { type: 'text', content: 'Throughout this evolution, one principle remained constant: speed matters more than empty promises. When a client asked for something, we would ship a fix within 48 hours at most. This philosophy taught me that a client will always stay if they feel truly valued, and this commitment to rapid iteration became a core part of Pario\'s DNA.' },
        ],
      },
      {
        title: 'Architecture',
        content: [
          { type: 'text', content: 'Pario uses a serverless architecture optimized for fast iteration and scalability. The frontend is built with Next.js, deployed on Vercel, and uses Tanstack Query for server state management and Shadcn UI for components. The backend consists of Next.js API routes that communicate with Supabase (database, auth, real-time features) and a Flask service hosted on Render that handles the matching algorithm.' },
          { type: 'text', content: 'For vector operations, we use OpenAI embeddings stored in Supabase and Pinecone for efficient similarity matching. The RAG chat interface is real-time, with responses guaranteed to be up-to-date within 5 seconds during live matching periods. This lightweight, scalable stack allows us to experiment with new architectures and push code at an insanely fast rate while keeping our clients happy.' },
          { type: 'heading', level: 3, text: 'Tech Stack' },
          { type: 'list', style: 'bulleted', items: [
            'Frontend: React, Next.js, Tanstack Query, Shadcn UI',
            'Backend: Node.js, Flask, Python',
            'Database: Supabase (PostgreSQL with JSONB, vector search)',
            'Vector DB: Pinecone',
            'Infrastructure: Vercel (frontend), Render (backend services)',
            'AI: OpenAI (embeddings)',
          ]},
        ],
      },
      {
        title: 'Matching Architecture Evolution',
        content: [
          { type: 'text', content: 'The core innovation in Pario is the customizable matching system. Instead of hardcoding matching logic, clients can configure their own matching workflows through a form builder interface. This system uses three types of fields, each with distinct matching behaviors:' },
          { type: 'heading', level: 3, text: 'Field Types' },
          { type: 'list', style: 'bulleted', items: [
            'Profile fields: Display-only information not used in matching (e.g., firstName, lastName)',
            'Direct matches: Exact matching between student and tutor with configurable weights (e.g., subject, location)',
            'Semantic matches: AI-powered fuzzy matching using embeddings for nuanced similarity (e.g., interests, goals)',
          ]},
          { type: 'text', content: 'Each field can be configured with a matchType, matchWeight (0-1.0), and a matchingField that references the corresponding field in the counterpart form. This abstraction allows clients to design matching workflows that fit their specific needs, whether they\'re matching students to tutors, mentors to mentees, or any other relationship type.' },
          { type: 'code', language: 'typescript', code: `interface FormField {
  id: string;
  label: string;
  fieldName: string;
  fieldType: "text" | "textarea" | "dropdown";
  matchType: "profile" | "direct" | "semantic";
  matchWeight: number; // 0-1.0
  matchingField?: string; // ID of corresponding field
  required: boolean;
  showForUserType: ("student" | "tutor")[];
  options?: string[];
  placeholder?: string;
}` },
        ],
      },
      {
        title: 'Matching Algorithm',
        content: [
          { type: 'text', content: 'The matching algorithm combines semantic similarity with weighted direct matching to create bias-free, traceable matches. Here\'s how it works:' },
          { type: 'heading', level: 3, text: 'Process' },
          { type: 'list', style: 'bulleted', items: [
            'Extract semantic and direct match parameters from form configuration',
            'Generate embeddings for semantic responses using OpenAI text-embedding-3-small',
            'Perform vector search via Supabase RPC (match_user_vectors) to find similar candidates',
            'Calculate direct match scores with weighted matching (required matches must match exactly)',
            'Combine semantic similarity scores with direct match scores for final ranking',
          ]},
          { type: 'code', language: 'typescript', code: `// Generate embedding for user's semantic responses
let userEmbedding: number[] | null = null;
if (semanticResponses.length > 0) {
  const combinedQuery = combineSemanticResponses(semanticResponses);
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: combinedQuery,
  });
  userEmbedding = embeddingResponse.data[0].embedding;
}

// Use Supabase vector search for efficient similarity matching
const { data: vectorMatches } = await supabase.rpc('match_user_vectors', {
  query_embedding: userEmbedding,
  match_count: menteeMatches * 10,
  institution_id: institutionId,
  table_name: candidateTable,
});

// Calculate direct match score based on matchWeights
let directMatchScore = 0;
let totalDirectWeight = 0;
let hasRequiredDirectMatch = true;

for (const matchParam of matchParameters) {
  const candidateResponse = candidate.form_responses.find(
    (resp: FormResponse) => resp.fieldId === matchParam.matching_field_id
  );
  
  if (candidateResponse) {
    const matches = candidateValue === matchValue;
    
    // If matchWeight is 1.0, it's required - candidate must match
    if (matchParam.match_weight >= 1.0) {
      if (!matches) {
        hasRequiredDirectMatch = false;
        break;
      }
      directMatchScore += matchParam.match_weight;
    } else {
      // For preference matches (0.1-0.9), add weighted score
      directMatchScore += matches ? matchParam.match_weight : 0;
    }
  }
}` },
          { type: 'text', content: 'This approach ensures that required matches (matchWeight = 1.0) are strictly enforced, while preference matches contribute to a weighted score. The semantic matching provides flexibility for nuanced matching scenarios, and the entire process is fully traceable for transparency and bias mitigation.' },
        ],
      },
      {
        title: 'JSONB + TypeScript Type Safety',
        content: [
          { type: 'text', content: 'One of the biggest challenges in building a customizable platform is storing variable form responses in a type-safe way. Pario solves this by using Supabase\'s JSONB columns combined with strict TypeScript typing, allowing for flexibility while maintaining type safety across 40,000+ lines of code.' },
          { type: 'code', language: 'typescript', code: `export interface FormResponse {
  fieldId: string;
  response: string | boolean | number | { [key: string]: any } | null;
  matchWeight?: number;
  matchType?: string;
  matchingField?: string;
  // Extensibility
  [key: string]: any;
}` },
          { type: 'text', content: 'The FormResponse interface uses an index signature for extensibility while maintaining type safety for known properties. When parsing form responses, we use utilities that handle custom columns and normalize field names:' },
          { type: 'code', language: 'typescript', code: `const parseFormResponses = (formResponses: any, customColumns: string[]): { [key: string]: any } => {
  const parsedResponses: { [key: string]: any } = {};
  
  // Create a mapping of normalized column names to their original form
  const columnMapping = customColumns.reduce((acc, column) => {
    acc[column.toLowerCase().replace(/\\s+/g, '')] = column;
    return acc;
  }, {} as { [key: string]: string });
  
  // Process each form response (stored as JSONB in database)
  formResponses.forEach((response: FormResponse) => {
    const fieldId = response.fieldId?.toLowerCase();
    
    // Check if this fieldId corresponds to any of our custom columns
    for (const [normalizedColumn, originalColumn] of Object.entries(columnMapping)) {
      if (fieldId === normalizedColumn.toLowerCase()) {
        parsedResponses[originalColumn.toLowerCase().replace(/\\s+/g, '')] = response.response;
        break;
      }
    }
  });
  
  return parsedResponses;
};` },
          { type: 'text', content: 'This approach allows us to store completely customizable form data in JSONB while maintaining strict typing throughout the codebase. The abstraction layer handles the complexity of variable schemas, making it easy to work with client-specific data structures without sacrificing type safety.' },
        ],
      },
      {
        title: 'RAG-Powered Chat Interface',
        content: [
          { type: 'text', content: 'Pario includes a RAG-powered chat interface that helps clients navigate documents and get answers without manually sifting through spreadsheets and documentation. The system is designed to be real-time, with responses guaranteed to be up-to-date within 5 seconds during live matching periods.' },
          { type: 'heading', level: 3, text: 'Implementation' },
          { type: 'list', style: 'bulleted', items: [
            'Generate embeddings for user queries using OpenAI text-embedding-3-large',
            'Query Supabase for top similar vectors using match_vectors RPC (fetch 15, then dedupe)',
            'Deduplicate by document (keep first chunk per document, limit to top 5 unique docs)',
            'Inject context into GPT-4o system prompt with citations',
            'Return answer with document references',
          ]},
          { type: 'code', language: 'typescript', code: `// 1. Generate embedding for the prompt
const embeddingResponse = await openai.embeddings.create({
  model: 'text-embedding-3-large',
  input: prompt,
});
const [{ embedding }] = embeddingResponse.data;

// 2. Query Supabase for top similar vectors (grab more, then dedupe by document)
const { data: rawVectors } = await supabase.rpc('match_vectors', {
  query_embedding: embedding,
  match_count: 15, // fetch more to allow dedup
  institution_id: institutionId,
});

// Keep only the first chunk per document (maintaining order)
const seen = new Set<string>();
const vectors = rawVectors.filter((v: any) => {
  if (seen.has(v.document_id)) return false;
  seen.add(v.document_id);
  return true;
}).slice(0, 5); // limit to top 5 unique docs

// 3. Concatenate context with citations
const context = vectors.map((v: any, i: number) => 
  \`(\${i+1}) \${v.content}\\n[\${v.document_name}]\`
).join('\\n\\n');

const systemPrompt = \`You are an expert AI assistant for Pario...
Use the following context to answer the user's question.
Context:
\${context}\`;

// 4. Call GPT-4 with context and prompt
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt },
  ],
  max_tokens: 512,
  temperature: 0.2,
});

const answer = completion.choices[0].message?.content || '';` },
          { type: 'text', content: 'The deduplication strategy ensures we get diverse context from multiple documents rather than multiple chunks from the same document. Citations are included in the response, allowing users to verify sources. The 5-second update guarantee means that during active matching periods, the knowledge base is continuously refreshed to reflect the latest program data.' },
        ],
      },
      {
        title: 'Performance Optimizations',
        content: [
          { type: 'text', content: 'Synchronization and concurrency were major challenges as Pario scaled to 15+ organizations with 20-200 users each. I solved this by implementing a custom caching layer with TTL and request deduplication, preventing duplicate concurrent requests and reducing API calls significantly.' },
          { type: 'code', language: 'typescript', code: `export const DataContextProvider: React.FC<DataContextProviderProps> = ({
  children,
  cacheTTL = 5 * 60 * 1000, // 5 minutes default
}) => {
  const cache = useRef<Map<string, CachedData<any>>>(new Map());
  const pendingRequests = useRef<Map<string, PendingRequest>>(new Map());
  
  const isExpired = (timestamp: number): boolean => {
    return Date.now() - timestamp > cacheTTL;
  };
  
  const getCachedData = <T,>(key: string): T | null => {
    const cached = cache.current.get(key);
    if (!cached || isExpired(cached.timestamp)) {
      cache.current.delete(key);
      return null;
    }
    return cached.data as T;
  };
  
  const executeRequest = async <T,>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    // Check if there's already a pending request for this key (deduplication)
    const pending = pendingRequests.current.get(key);
    if (pending && !isExpired(pending.timestamp)) {
      return pending.promise as Promise<T>;
    }
    
    // Create new request
    const promise = requestFn();
    pendingRequests.current.set(key, {
      promise,
      timestamp: Date.now(),
    });
    
    try {
      const result = await promise;
      setCachedData(key, result);
      pendingRequests.current.delete(key);
      return result;
    } catch (error) {
      pendingRequests.current.delete(key);
      throw error;
    }
  };
  
  const fetchWithCache = async <T,>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    // Try to get from cache first
    const cached = getCachedData<T>(key);
    if (cached !== null) {
      return cached;
    }
    
    // Execute request with deduplication
    return executeRequest(key, requestFn);
  };
};` },
          { type: 'text', content: 'This caching system handles synchronization issues by ensuring that multiple components requesting the same data simultaneously share a single request. The TTL-based expiration keeps data fresh while reducing unnecessary API calls. This was crucial for handling the scale of concurrent users across multiple organizations.' },
        ],
      },
      {
        title: 'Features',
        content: [
          { type: 'image', image: parioWebProgram, caption: 'Program management interface' },
          { type: 'image', image: parioWebCapacity, caption: 'Capacity planning view' },
          { type: 'image', image: parioWebValence, caption: 'Valence analysis dashboard' },
          { type: 'list', style: 'bulleted', items: [
            'Customizable form builder with matching configuration (profile/direct/semantic fields)',
            'AI-powered matching algorithm with vector similarity and weighted direct matching',
            'Real-time RAG chat interface with 5-second update guarantee',
            'Program management and capacity tracking dashboards',
            'Valence analysis for relationship quality insights',
            'Complete traceability and bias-free matching',
          ]},
        ],
      },
      {
        title: 'Frontend Architecture',
        content: [
          { type: 'text', content: 'The frontend is built with React and Next.js, using Tanstack Query for server state management and Shadcn UI for components. The UI philosophy centers on beautiful, detail-oriented design with weekly updates. I used my previous experience building software from Figma mockups and design courses to ensure every detail meets a high standard.' },
          { type: 'text', content: 'Performance and product features always come first, but I believe nobody will listen to you if your product does not look the part. This attention to detail has been crucial for client trust and satisfaction. The frontend architecture supports fast iteration, with the ability to push new features and UI improvements weekly while maintaining a seamless user experience.' },
        ],
      },
      {
        title: 'Deployment & Infrastructure',
        content: [
          { type: 'text', content: 'Pario uses a lightweight, scalable stack optimized for fast iteration. The static web app is hosted on Vercel, while backend services (Flask matching service and Node.js APIs) run on Render. This serverless architecture allows us to experiment with new architectures and push code at an insanely fast rate while keeping infrastructure costs manageable.' },
          { type: 'text', content: 'The database is Supabase (PostgreSQL with JSONB support and vector search capabilities), and embeddings are stored in Pinecone for efficient similarity matching. This setup handles the scale of 15+ organizations with 20-200 users each, with synchronization and concurrency challenges addressed through the custom caching layer and async function patterns.' },
        ],
      },
    ],
  },
  'citerite': {
    name: 'CiteRite',
    description: 'A citation reviewer that analyzes text for claims and displays relevant citations to help detect false claims in AI-generated text.',
    techStack: {
      frontend: ['React', 'Next.js', 'TypeScript'],
      tools: ['Shadcn UI', 'Lucide Icons'],
    },
    sections: [
      {
        title: 'Overview',
        content: [
          { type: 'video', video: citeRiteDemo, caption: 'CiteRite demo - analyzing text for claims and citations' },
          { type: 'text', content: 'CiteRite is a citation reviewer application that takes input text, extracts claims, and displays relevant citations for each claim. The tool helps detect false claims in AI-generated text by providing a visual interface to review which claims are supported by citations and which are not.' },
          { type: 'text', content: 'The application provides two main views: a document view that highlights claims directly in the original text, and a hierarchical view that shows the parent-child relationships between claims. Users can click on any claim to view its associated citations in a side panel, making it easy to verify the accuracy of statements in a document.' },
        ],
      },
      {
        title: 'Architecture',
        content: [
          { type: 'text', content: 'CiteRite is built with React and Next.js, using a component-based architecture that separates concerns between text processing, UI rendering, and state management. The application receives scan results from an API that includes claims, citations, and their relationships.' },
          { type: 'heading', level: 3, text: 'Component Structure' },
          { type: 'list', style: 'bulleted', items: [
            'DocumentViewer: Renders the original text with interactive claim highlighting',
            'CitationPanel: Side panel showing citation details for selected claims',
            'ClaimTree: Hierarchical accordion view of claims organized by parent-child relationships',
            'Main Page: Orchestrates state management and coordinates between components',
          ]},
          { type: 'text', content: 'The core data flow involves segmenting the original text based on claim positions, mapping citations to claims, and rendering interactive UI elements that allow users to explore the relationship between text and its supporting evidence.' },
        ],
      },
      {
        title: 'Text Segmentation',
        content: [
          { type: 'text', content: 'The text segmentation utility maps claims to their positions in the original text, creating segments that alternate between plain text and claim regions. This enables precise highlighting and interaction.' },
          { type: 'code', language: 'typescript', code: `export function segmentText(
  originalText: string,
  claims: Record<string, Claim>
): TextSegment[] {
  const segments: TextSegment[] = [];
  const sortedClaims = Object.entries(claims)
    .map(([id, claim]) => ({ id, ...claim }))
    .sort((a, b) => a.start_index - b.start_index);

  let currentIndex = 0;

  for (const claim of sortedClaims) {
    // Add non-claim text before this claim
    if (claim.start_index > currentIndex) {
      segments.push({
        text: originalText.slice(currentIndex, claim.start_index),
        claimId: null,
        startIndex: currentIndex,
        endIndex: claim.start_index,
      });
    }

    // Add the claim segment
    segments.push({
      text: originalText.slice(claim.start_index, claim.end_index),
      claimId: claim.id,
      startIndex: claim.start_index,
      endIndex: claim.end_index,
    });

    currentIndex = claim.end_index;
  }

  // Add remaining text after last claim
  if (currentIndex < originalText.length) {
    segments.push({
      text: originalText.slice(currentIndex),
      claimId: null,
      startIndex: currentIndex,
      endIndex: originalText.length,
    });
  }

  return segments;
}` },
        ],
      },
      {
        title: 'Claim Highlighting Logic',
        content: [
          { type: 'text', content: 'The highlighting system uses dynamic styling based on selection and hover states. Claims are visually distinguished with background colors, and citation counts are displayed as superscripts.' },
          { type: 'code', language: 'typescript', code: `const getClaimStyle = (claimId: string) => {
  const isSelected = selectedClaimId === claimId;
  const isHovered = hoveredClaimId === claimId;

  return {
    backgroundColor: isSelected || isHovered 
      ? 'var(--primary)' 
      : 'color-mix(in oklch, var(--primary), transparent 85%)',
    color: isSelected || isHovered ? 'var(--primary-foreground)' : 'inherit',
    borderBottom: '2px solid var(--primary)',
    cursor: 'pointer',
    boxShadow: isSelected ? '0 0 0 2px var(--ring)' : 'none',
  };
};

const renderSegment = (segment: TextSegment) => {
  if (!segment.claimId) {
    return segment.text; // Plain text
  }

  const claim = claims[segment.claimId];
  const citations = claim?.relevant_citations || [];
  const citationIds = citations.map(c => c.citation_id).join(',');
  
  // Render claim with highlighting and citation indicators
  return {
    text: segment.text,
    style: getClaimStyle(segment.claimId),
    citationCount: citations.length,
    citationIds,
  };
};` },
        ],
      },
      {
        title: 'Citation Display Logic',
        content: [
          { type: 'text', content: 'Citations are displayed with expandable summaries and mapped to their associated claims. The logic handles text truncation and citation filtering.' },
          { type: 'code', language: 'typescript', code: `// Expandable summary logic
const [isExpanded, setIsExpanded] = useState(true);
const displayText = citation.summary.length > SUMMARY_CHAR_LIMIT && !isExpanded 
  ? citation.summary.slice(0, SUMMARY_CHAR_LIMIT) + '...' 
  : citation.summary;

// Map citations to selected claim
const relevantCitations = claim.relevant_citations || [];
const hasCitations = relevantCitations.length > 0;

// Render citation cards with data
relevantCitations.map((ref, index) => {
  const citation = citations[ref.citation_id];
  if (!citation) return null;
  
  return {
    snippet: ref.snippet,
    summary: displayText,
    tags: citation.tags,
    link: citation.link,
    index,
  };
});` },
        ],
      },
      {
        title: 'Claim Hierarchy Logic',
        content: [
          { type: 'text', content: 'The hierarchy system identifies root claims and builds a tree structure from parent-child relationships. It also handles orphan claims that aren\'t referenced as children.' },
          { type: 'code', language: 'typescript', code: `// Get root claims (no parents)
export function getRootClaims(claims: Record<string, Claim>): string[] {
  return Object.entries(claims)
    .filter(([_, claim]) => claim.parent_claim_ids.length === 0)
    .map(([id]) => id);
}

// Build complete tree including orphan claims
const rootClaims = getRootClaims(claims);
const allClaimIds = Object.keys(claims);
const referencedAsChildren = new Set(
  Object.values(claims).flatMap(c => c.children_claim_ids)
);
const orphanClaims = allClaimIds.filter(
  id => !rootClaims.includes(id) && !referencedAsChildren.has(id)
);

const allRootIds = [...rootClaims, ...orphanClaims];

// Recursive tree rendering logic
const renderClaimNode = (claimId: string, depth: number) => {
  const claim = claims[claimId];
  const hasChildren = claim.children_claim_ids.length > 0;
  const hasCitations = claim.relevant_citations.length > 0;
  
  if (!hasChildren) {
    return { claimId, claimText: claim.claim_text, hasCitations };
  }
  
  return {
    claimId,
    claimText: claim.claim_text,
    hasCitations,
    children: claim.children_claim_ids.map(childId => 
      renderClaimNode(childId, depth + 1)
    ),
  };
};` },
        ],
      },
      {
        title: 'State Management & Data Processing',
        content: [
          { type: 'text', content: 'The core logic handles API integration, claim index remapping, and state coordination. Key functions process scan results and ensure claims are correctly positioned in the original text.' },
          { type: 'code', language: 'typescript', code: `// Remap claim indices to match actual positions in original text
const remapClaimIndices = (response: ScanResponse, originalText: string): ScanResponse => {
  const remappedClaims: Record<string, Claim> = {};
  
  for (const [id, claim] of Object.entries(response.document.claims)) {
    if (!claim.claim_text) {
      remappedClaims[id] = claim;
      continue;
    }
    
    // Find actual position of claim_text in original text
    const actualIndex = originalText.indexOf(claim.claim_text);
    
    if (actualIndex !== -1) {
      remappedClaims[id] = {
        ...claim,
        start_index: actualIndex,
        end_index: actualIndex + claim.claim_text.length,
      };
    } else {
      remappedClaims[id] = claim;
    }
  }
  
  return {
    ...response,
    document: { ...response.document, claims: remappedClaims },
  };
};

// API integration and error handling
const handleClickGo = async () => {
  try {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }
    
    setIsLoading(true);
    const result = await postSourceScan(text);
    const parsedResult = JSON.parse(result) as ScanResponse;
    const remappedResult = remapClaimIndices(parsedResult, text);
    setScanResult(remappedResult);
  } catch (err) {
    setError("Failed to analyze text. Please try again.");
  } finally {
    setIsLoading(false);
  }
};` },
        ],
      },
    ],
  },
};
