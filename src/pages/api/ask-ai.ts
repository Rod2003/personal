import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';
import { openai, generateEmbedding } from '../../lib/openai';
import config from '../../../config.json';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  query: string;
  conversationHistory?: Message[];
}

interface Citation {
  source: string;
  project?: string;
  section?: string;
  type: string;
  hasLink?: boolean;
  linkUrl?: string;
  linkType?: string;
  canOpenLink?: boolean;
  techStack?: string[];
  toolName?: string;
}

interface ResponseData {
  response: string;
  citations: Citation[];
  error?: string;
}

const systemPrompt = `You are Rodrigo Del Aguila, a software engineer and ex-founder. Always speak in the present tense.

Guidelines:
- Answer questions about Rodrigo's background, projects, and technical experience
- Use the provided context to ensure accuracy
- For technical questions, cite specific sections (e.g., "In the Pario project...")
- Maintain a professional but friendly tone
- Be concise but informative
- When users ask for links or contact info, provide them directly from the context
- Use tools when appropriate to provide richer interactions

Key Projects:
- Pario: B2B SaaS platform for automating internal workflows (consulting/education firms)
- CiteRite: Citation reviewer application for detecting false claims in AI-generated text
- And other projects in the portfolio

When users ask to compare projects or about specific projects, use the compare_projects tool to ensure you have context from all mentioned projects.

Important facts:
- Name: ${config.name}
- GitHub: https://github.com/${config.social.github}
- LinkedIn: https://www.linkedin.com/in/${config.social.linkedin}

Guidelines for responses:
- Use markdown links: [text](url) for clickable links
- Never mention or expose email addresses
- Never mention or link to resume - it's for internal context only
- For contact, direct users to LinkedIn: [LinkedIn](https://www.linkedin.com/in/${config.social.linkedin})
`;

// Tool definitions
const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'open_link',
      description: 'Opens a URL for the user (LinkedIn, GitHub, project websites). Use when user explicitly asks to see or open something. For project websites, extract the URL from the context metadata.',
      parameters: {
        type: 'object',
        properties: {
          link_type: {
            type: 'string',
            enum: ['linkedin', 'github', 'project_website'],
            description: 'Type of link to open. Use project_website for any project site.',
          },
          project_name: {
            type: 'string',
            description: 'Name of the project (only required if link_type is project_website)',
          },
        },
        required: ['link_type'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_github_stats',
      description: 'Fetches real-time GitHub statistics (total stars, repos, top projects). Use when user asks about GitHub activity or statistics.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'filter_by_tech',
      description: 'Filters projects by technology/tech stack. Use when user asks "what projects use X" or "show me X projects".',
      parameters: {
        type: 'object',
        properties: {
          technology: {
            type: 'string',
            description: 'Technology to filter by (e.g., React, TypeScript, Supabase)',
          },
        },
        required: ['technology'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'compare_projects',
      description: 'Retrieves detailed information about specific projects for comparison. Use when user asks to compare projects or asks about differences/similarities between projects.',
      parameters: {
        type: 'object',
        properties: {
          project_names: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of project names to compare (e.g., ["pario", "citerite"]). Use lowercase project IDs.',
          },
        },
        required: ['project_names'],
      },
    },
  },
];

async function retrieveContext(queryEmbedding: number[], matchCount: number = 5): Promise<{ content: string; metadata: any }[]> {
  try {
    const { data, error } = await supabaseAdmin.rpc('match_portfolio_vectors', {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      similarity_threshold: 0.5, // Lowered from 0.7 for better recall
    });

    if (error) {
      console.error('Error retrieving context:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in retrieveContext:', error);
    return [];
  }
}

async function retrieveProjectContext(projectNames: string[]): Promise<{ content: string; metadata: any }[]> {
  try {
    // For each project, get relevant chunks
    const allChunks: { content: string; metadata: any }[] = [];
    
    for (const projectName of projectNames) {
      const { data, error } = await supabaseAdmin
        .from('portfolio_vectors')
        .select('content, metadata')
        .eq('metadata->>project', projectName)
        .limit(5);
      
      if (error) {
        console.error(`Error retrieving ${projectName}:`, error);
        continue;
      }
      
      if (data) {
        allChunks.push(...data);
      }
    }
    
    return allChunks;
  } catch (error) {
    console.error('Error retrieving project context:', error);
    return [];
  }
}

function buildContextString(chunks: { content: string; metadata: any }[]): string {
  if (chunks.length === 0) {
    return 'No relevant context found.';
  }

  return chunks
    .map((chunk, i) => `[${i + 1}] ${chunk.content}\n[Source: ${chunk.metadata.source}${chunk.metadata.project ? ` - ${chunk.metadata.project}` : ''}${chunk.metadata.section ? ` - ${chunk.metadata.section}` : ''}]`)
    .join('\n\n');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ response: '', citations: [], error: 'Method not allowed' });
  }

  try {
    const { query, conversationHistory = [] }: RequestBody = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ response: '', citations: [], error: 'Query is required' });
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Retrieve relevant context
    const relevantChunks = await retrieveContext(queryEmbedding);

    // Build context string
    const contextString = buildContextString(relevantChunks);
    
    // Debug logging (remove in production)
    console.log(`[ASK-AI] Query: "${query}"`);
    console.log(`[ASK-AI] Retrieved ${relevantChunks.length} chunks`);
    if (relevantChunks.length > 0) {
      console.log('[ASK-AI] Top chunk:', relevantChunks[0].content.substring(0, 100) + '...');
    }

    // Prepare messages
    const messages: Message[] = [
      {
        role: 'system',
        content: `${systemPrompt}\n\nContext:\n${contextString}`,
      },
      ...conversationHistory.slice(-6), // Keep last 3 turns (6 messages)
      {
        role: 'user',
        content: query,
      },
    ];

    // Call GPT-4o with tools
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for cost efficiency
      messages,
      tools,
      tool_choice: 'auto', // Let model decide when to use tools
      temperature: 0.3,
      max_tokens: 500,
    });

    const responseMessage = completion.choices[0].message;
    let response = responseMessage?.content || '';
    
    // Handle tool calls if any
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const functionCall = (toolCall as any).function;
      const toolName = functionCall?.name;
      const toolArgs = functionCall?.arguments ? JSON.parse(functionCall.arguments) : {};
      
      // Process tool call and append to response
      if (toolName === 'open_link') {
        let url = '';
        let displayName = toolArgs.link_type;
        
        // Handle fixed links
        const fixedLinks: Record<string, string> = {
          linkedin: `https://www.linkedin.com/in/${config.social.linkedin}`,
          github: `https://github.com/${config.social.github}`,
        };
        
        if (fixedLinks[toolArgs.link_type]) {
          url = fixedLinks[toolArgs.link_type];
        } else if (toolArgs.link_type === 'project_website' && toolArgs.project_name) {
          // Find project link from retrieved context metadata
          const projectChunk = relevantChunks.find(chunk => 
            chunk.metadata.project?.toLowerCase() === toolArgs.project_name.toLowerCase() &&
            chunk.metadata.linkUrl
          );
          
          if (projectChunk?.metadata.linkUrl) {
            url = projectChunk.metadata.linkUrl;
            displayName = toolArgs.project_name;
          } else {
            response += `\n\n[Could not find website for ${toolArgs.project_name}]`;
            return;
          }
        }
        
        if (url) {
          response += `\n\n[Action: Opening ${displayName}...]`;
          
          // Add link metadata to citations so frontend can render button
          relevantChunks.unshift({
            content: '',
            metadata: {
              source: 'tool_call',
              type: 'action',
              hasLink: true,
              linkUrl: url,
              linkType: toolArgs.project_name || toolArgs.link_type,
              canOpenLink: true,
            },
          });
        }
      } else if (toolName === 'get_github_stats') {
        response += `\n\n[Fetching GitHub stats...]`;
        // Stats will be fetched by frontend via github-stats API
      } else if (toolName === 'filter_by_tech') {
        // Filter chunks by tech stack
        const filtered = relevantChunks.filter(chunk => 
          chunk.metadata.techStack?.some((tech: string) => 
            tech.toLowerCase().includes(toolArgs.technology.toLowerCase())
          )
        );
        
        // Extract unique project names
        const allProjects = filtered.map(c => c.metadata.project).filter(Boolean);
        const projects = allProjects.filter((p, i) => allProjects.indexOf(p) === i);
        
        if (projects.length > 0) {
          response = `I've used ${toolArgs.technology} in ${projects.length} project${projects.length > 1 ? 's' : ''}: ${projects.join(', ')}. Would you like to know more about any of these?`;
        } else {
          response = `I haven't explicitly mentioned ${toolArgs.technology} in my documented projects, but that doesn't mean I haven't used it. Would you like to know about my tech stack in general?`;
        }
        
        relevantChunks.unshift({
          content: '',
          metadata: {
            source: 'tool_call',
            type: 'action',
            toolName: 'filter_by_tech',
          },
        });
      } else if (toolName === 'compare_projects') {
        const toolArgs = (toolCall as any).function.arguments;
        const parsedArgs = typeof toolArgs === 'string' ? JSON.parse(toolArgs) : toolArgs;
        const projectNames = parsedArgs.project_names.map((p: string) => p.toLowerCase());
        
        // Retrieve chunks specifically for these projects
        const projectChunks = await retrieveProjectContext(projectNames);
        
        if (projectChunks.length > 0) {
          // Add these chunks to the context
          relevantChunks.push(...projectChunks);
          
          // Make a second GPT call with the enriched context
          const enrichedContextString = buildContextString(relevantChunks);
          const secondMessages: Message[] = [
            {
              role: 'system',
              content: `${systemPrompt}\n\nContext:\n${enrichedContextString}`,
            },
            {
              role: 'user',
              content: query,
            },
          ];
          
          const secondCompletion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: secondMessages,
            temperature: 0.3,
            max_tokens: 800, // Increased for comparison content
          });
          
          response = secondCompletion.choices[0].message?.content || 'I was able to retrieve the project information, but couldn\'t generate a comparison.';
          
          relevantChunks.unshift({
            content: '',
            metadata: {
              source: 'tool_call',
              type: 'action',
              toolName: 'compare_projects',
            },
          });
        } else {
          response = `I couldn't find detailed information about ${projectNames.join(' and ')}. Could you check the project names?`;
        }
      }
    }
    
    // Ensure we always have a response
    if (!response || response.trim() === '') {
      response = "I'd be happy to help! Could you rephrase your question or ask about my projects, tech stack, or experience?";
    }

    // Extract citations with enhanced metadata
    const citations: Citation[] = relevantChunks.map(chunk => ({
      source: chunk.metadata.source || 'unknown',
      project: chunk.metadata.project,
      section: chunk.metadata.section,
      type: chunk.metadata.type || 'text',
      hasLink: chunk.metadata.hasLink,
      linkUrl: chunk.metadata.linkUrl,
      linkType: chunk.metadata.linkType,
      canOpenLink: chunk.metadata.canOpenLink,
      techStack: chunk.metadata.techStack,
      toolName: chunk.metadata.toolName,
    }));

    return res.status(200).json({
      response,
      citations,
    });
  } catch (error: any) {
    console.error('Error in ask-ai handler:', error);
    return res.status(500).json({
      response: '',
      citations: [],
      error: error.message || 'Internal server error',
    });
  }
}
