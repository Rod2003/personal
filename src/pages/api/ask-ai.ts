import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from "../../helpers/supabase";
import { openai, generateEmbedding } from "../../helpers/openai";
import { checkRateLimit, rateLimitResponse } from "../../helpers/rate-limit";
import config from "../../config/site.json";

interface Message {
  role: "user" | "assistant" | "system";
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

const tools = [
  {
    type: "function" as const,
    function: {
      name: "open_link",
      description:
        "Opens a URL for the user (LinkedIn, GitHub, project websites). Use when user explicitly asks to see or open something. For project websites, extract the URL from the context metadata.",
      parameters: {
        type: "object",
        properties: {
          link_type: {
            type: "string",
            enum: ["linkedin", "github", "project_website"],
            description:
              "Type of link to open. Use project_website for any project site.",
          },
          project_name: {
            type: "string",
            description:
              "Name of the project (only required if link_type is project_website)",
          },
        },
        required: ["link_type"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_github_stats",
      description:
        "Fetches real-time GitHub statistics (total stars, repos, top projects). Use when user asks about GitHub activity or statistics.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "filter_by_tech",
      description:
        'Filters projects by technology/tech stack. Use when user asks "what projects use X" or "show me X projects".',
      parameters: {
        type: "object",
        properties: {
          technology: {
            type: "string",
            description:
              "Technology to filter by (e.g., React, TypeScript, Supabase)",
          },
        },
        required: ["technology"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "compare_projects",
      description:
        "Retrieves detailed information about specific projects for comparison. Use when user asks to compare projects or asks about differences/similarities between projects.",
      parameters: {
        type: "object",
        properties: {
          project_names: {
            type: "array",
            items: { type: "string" },
            description:
              'Array of project names to compare (e.g., ["pario", "citerite"]). Use lowercase project IDs.',
          },
        },
        required: ["project_names"],
      },
    },
  },
];

async function retrieveContext(
  queryEmbedding: number[],
  matchCount: number = 5
): Promise<{ content: string; metadata: any }[]> {
  try {
    const { data, error } = await getSupabaseAdmin().rpc("match_portfolio_vectors", {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      similarity_threshold: 0.5,
    });

    if (error) {
      console.error("Error retrieving context:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in retrieveContext:", error);
    return [];
  }
}

async function retrieveProjectContext(
  projectNames: string[]
): Promise<{ content: string; metadata: any }[]> {
  try {
    const results = await Promise.all(
      projectNames.map(async (projectName) => {
        const { data, error } = await getSupabaseAdmin()
          .from("portfolio_vectors")
          .select("content, metadata")
          .eq("metadata->>project", projectName)
          .limit(5);

        if (error) {
          console.error(`Error retrieving ${projectName}:`, error);
          return [];
        }

        return data ?? [];
      })
    );

    return results.flat();
  } catch (error) {
    console.error("Error retrieving project context:", error);
    return [];
  }
}

function buildContextString(
  chunks: { content: string; metadata: any }[]
): string {
  if (chunks.length === 0) {
    return "No relevant context found.";
  }

  return chunks
    .map(
      (chunk, i) =>
        `[${i + 1}] ${chunk.content}\n[Source: ${chunk.metadata.source}${
          chunk.metadata.project ? ` - ${chunk.metadata.project}` : ""
        }${chunk.metadata.section ? ` - ${chunk.metadata.section}` : ""}]`
    )
    .join("\n\n");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ response: "", citations: [], error: "Method not allowed" });
  }

  const isAllowed = checkRateLimit(req, res, {
    maxRequests: 50,
    windowMs: 60 * 60 * 1000,
  });

  if (!isAllowed) {
    const resetTime = Date.now() + 60 * 60 * 1000;
    return rateLimitResponse(res, resetTime);
  }

  try {
    const { query, conversationHistory = [] }: RequestBody = req.body;

    if (!query || typeof query !== "string") {
      return res
        .status(400)
        .json({ response: "", citations: [], error: "Query is required" });
    }

    const queryEmbedding = await generateEmbedding(query);

    const relevantChunks = await retrieveContext(queryEmbedding);

    const contextString = buildContextString(relevantChunks);

    const messages: Message[] = [
      {
        role: "system",
        content: `${systemPrompt}\n\nContext:\n${contextString}`,
      },
      ...conversationHistory.slice(-6),
      {
        role: "user",
        content: query,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools,
      tool_choice: "auto",
      temperature: 0.3,
      max_tokens: 500,
    });

    const responseMessage = completion.choices[0].message;
    let response = responseMessage?.content || "";

    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const functionCall = (toolCall as any).function;
      const toolName = functionCall?.name;
      const toolArgs = functionCall?.arguments
        ? JSON.parse(functionCall.arguments)
        : {};

      if (toolName === "open_link") {
        let url = "";
        let displayName = toolArgs.link_type;

        const fixedLinks: Record<string, string> = {
          linkedin: `https://www.linkedin.com/in/${config.social.linkedin}`,
          github: `https://github.com/${config.social.github}`,
        };

        if (fixedLinks[toolArgs.link_type]) {
          url = fixedLinks[toolArgs.link_type];
        } else if (
          toolArgs.link_type === "project_website" &&
          toolArgs.project_name
        ) {
          const projectChunk = relevantChunks.find(
            (chunk) =>
              chunk.metadata.project?.toLowerCase() ===
                toolArgs.project_name.toLowerCase() && chunk.metadata.linkUrl
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

          relevantChunks.unshift({
            content: "",
            metadata: {
              source: "tool_call",
              type: "action",
              hasLink: true,
              linkUrl: url,
              linkType: toolArgs.project_name || toolArgs.link_type,
              canOpenLink: true,
            },
          });
        }
      } else if (toolName === "get_github_stats") {
        response += `\n\n[Fetching GitHub stats...]`;
      } else if (toolName === "filter_by_tech") {
        const filtered = relevantChunks.filter((chunk) =>
          chunk.metadata.techStack?.some((tech: string) =>
            tech.toLowerCase().includes(toolArgs.technology.toLowerCase())
          )
        );

        const projects = Array.from(
          new Set(
            filtered.flatMap((c) =>
              c.metadata.project ? [c.metadata.project] : []
            )
          )
        );

        if (projects.length > 0) {
          response = `I've used ${toolArgs.technology} in ${
            projects.length
          } project${projects.length > 1 ? "s" : ""}: ${projects.join(
            ", "
          )}. Would you like to know more about any of these?`;
        } else {
          response = `I haven't explicitly mentioned ${toolArgs.technology} in my documented projects, but that doesn't mean I haven't used it. Would you like to know about my tech stack in general?`;
        }

        relevantChunks.unshift({
          content: "",
          metadata: {
            source: "tool_call",
            type: "action",
            toolName: "filter_by_tech",
          },
        });
      } else if (toolName === "compare_projects") {
        const toolArgs = (toolCall as any).function.arguments;
        const parsedArgs =
          typeof toolArgs === "string" ? JSON.parse(toolArgs) : toolArgs;
        const projectNames = parsedArgs.project_names.map((p: string) =>
          p.toLowerCase()
        );

        const projectChunks = await retrieveProjectContext(projectNames);

        if (projectChunks.length > 0) {
          relevantChunks.push(...projectChunks);

          const enrichedContextString = buildContextString(relevantChunks);
          const secondMessages: Message[] = [
            {
              role: "system",
              content: `${systemPrompt}\n\nContext:\n${enrichedContextString}`,
            },
            {
              role: "user",
              content: query,
            },
          ];

          const secondCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: secondMessages,
            temperature: 0.3,
            max_tokens: 800,
          });

          response =
            secondCompletion.choices[0].message?.content ||
            "I was able to retrieve the project information, but couldn't generate a comparison.";

          relevantChunks.unshift({
            content: "",
            metadata: {
              source: "tool_call",
              type: "action",
              toolName: "compare_projects",
            },
          });
        } else {
          response = `I couldn't find detailed information about ${projectNames.join(
            " and "
          )}. Could you check the project names?`;
        }
      }
    }

    if (!response || response.trim() === "") {
      response =
        "I'd be happy to help! Could you rephrase your question or ask about my projects, tech stack, or experience?";
    }

    const citations: Citation[] = relevantChunks.map((chunk) => ({
      source: chunk.metadata.source || "unknown",
      project: chunk.metadata.project,
      section: chunk.metadata.section,
      type: chunk.metadata.type || "text",
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
    console.error("Error in ask-ai handler:", error);
    return res.status(500).json({
      response: "",
      citations: [],
      error: error.message || "Internal server error",
    });
  }
}
