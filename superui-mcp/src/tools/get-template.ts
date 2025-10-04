import { z } from "zod";
import { BaseTool } from "../utils/base-tool.js";
import { httpClient } from "../utils/http-client.js";

const TOOL_NAME = "get_template";
const TOOL_DESCRIPTION = `
"Use this tool when the user wants to create a landing page template through conversation.
This tool will guide the user through a series of questions to understand their needs and generate a customized template.

When to use this tool:
1. When user types "/template" or "/ui template" command
2. When user asks to create a landing page
3. When user wants to build a marketing website
4. When user needs a complete page template

The tool will:
- Ask targeted questions about the landing page purpose
- Understand target audience and goals
- Generate appropriate section combinations
- Provide Tailark component recommendations
- Create a complete template structure

Example usage:
- "/template create a landing page"
- "I need a SaaS landing page"
- "Build me a marketing template"
- "Create a landing page for my mobile app"
`;

interface GetTemplateResponse {
  result: string;
  conversationState?: {
    currentStep: number;
    totalSteps: number;
    answers: Record<string, string>;
    nextQuestion?: string;
  };
}

export class GetTemplateTool extends BaseTool {
  name = TOOL_NAME;
  description = TOOL_DESCRIPTION;

  schema = z.object({
    message: z.string().describe("Full user's message requesting the template"),
    conversationState: z.object({
      currentStep: z.number().describe("Current step in the conversation (0-4)"),
      totalSteps: z.number().describe("Total number of steps (4)"),
      answers: z.record(z.string()).describe("Previous answers from the user"),
      nextQuestion: z.string().optional().describe("Next question to ask the user")
    }).optional().describe("Current state of the conversation"),
    absolutePathToCurrentFile: z
      .string()
      .describe("Absolute path to the current file where the template will be used"),
    absolutePathToProjectDirectory: z
      .string()
      .describe("Absolute path to the project root directory"),
    standaloneRequestQuery: z
      .string()
      .describe("Complete request query with context for template generation")
  });

  async execute({
    message,
    conversationState,
    absolutePathToCurrentFile,
    absolutePathToProjectDirectory,
    standaloneRequestQuery,
  }: z.infer<typeof this.schema>) {
    try {
      console.log(`🎨 GetTemplateTool executing for: ${message}`);
      console.log(`📁 Project: ${absolutePathToProjectDirectory}`);
      console.log(`📄 Current file: ${absolutePathToCurrentFile}`);

      // Call the API server for template generation
      const { data } = await httpClient.post<GetTemplateResponse>(
        "/api/template",
        {
          message,
          conversationState,
          absolutePathToCurrentFile,
          absolutePathToProjectDirectory,
          standaloneRequestQuery,
        }
      );

      console.log(`✅ Template information retrieved successfully`);

      return {
        content: [
          {
            type: "text" as const,
            text: data.result,
          },
        ],
      };
    } catch (error) {
      console.error("❌ Error executing GetTemplateTool:", error);
      
      // Provide fallback response if API server is not available
      const fallbackResponse = `
# Template Generation Guide

## Template Request: ${message}

⚠️ **API Server Unavailable**

The SuperUI API server is not responding. Here's a manual template creation guide:

### Manual Template Creation
\`\`\`bash
cd ${absolutePathToProjectDirectory}
npx shadcn@latest add @tailark/hero
npx shadcn@latest add @tailark/features
npx shadcn@latest add @tailark/pricing
\`\`\`

### Available Tailark Components
- Hero sections
- Features sections  
- Pricing tables
- Testimonials
- Call-to-action sections
- Footer components

### Next Steps
1. Make sure the SuperUI API server is running
2. Check the API server configuration
3. Try the request again

**Error Details:** ${error instanceof Error ? error.message : 'Unknown error'}
      `;

      return {
        content: [
          {
            type: "text" as const,
            text: fallbackResponse,
          },
        ],
      };
    }
  }
}
