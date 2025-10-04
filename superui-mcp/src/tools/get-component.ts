import { z } from "zod";
import { BaseTool } from "../utils/base-tool.js";
import { httpClient } from "../utils/http-client.js";

const TOOL_NAME = "get_component";
const TOOL_DESCRIPTION = `
"Use this tool when the user wants to get a UI component and install it in their project.
This tool will fetch component information and provide installation commands for shadcn/ui components.

When to use this tool:
1. When user types "/ui get [component]" command
2. When user asks for a specific UI component (button, input, card, etc.)
3. When user wants to add a component to their React project
4. When user needs installation instructions for a component

The tool will return:
- npx installation command
- Import statements
- Usage examples
- Installation path information

Example usage:
- "/ui get button" -> Provides button component installation
- "I need a card component" -> Provides card component installation
- "Add an input field" -> Provides input component installation"
`;

interface GetComponentResponse {
  result: string;
}

export class GetComponentTool extends BaseTool {
  name = TOOL_NAME;
  description = TOOL_DESCRIPTION;

  schema = z.object({
    message: z.string().describe("Full user's message requesting the component"),
    searchQuery: z
      .string()
      .describe(
        "Search query for the component (2-4 words max). Extract the component name from the user's message."
      ),
    absolutePathToCurrentFile: z
      .string()
      .describe(
        "Absolute path to the current file where the component will be used"
      ),
    absolutePathToProjectDirectory: z
      .string()
      .describe("Absolute path to the project root directory"),
    standaloneRequestQuery: z
      .string()
      .describe(
        "Complete request query with context. Combine the user's message with project context to create a comprehensive request for the API server."
      ),
  });

  async execute({
    message,
    searchQuery,
    absolutePathToCurrentFile,
    absolutePathToProjectDirectory,
    standaloneRequestQuery,
  }: z.infer<typeof this.schema>) {
    try {
      console.log(`🔧 GetComponentTool executing for: ${searchQuery}`);
      console.log(`📁 Project: ${absolutePathToProjectDirectory}`);
      console.log(`📄 Current file: ${absolutePathToCurrentFile}`);

      // Call the API server
      const { data } = await httpClient.post<GetComponentResponse>(
        "/api/component",
        {
          message,
          searchQuery,
          absolutePathToCurrentFile,
          absolutePathToProjectDirectory,
          standaloneRequestQuery,
        }
      );

      console.log(`✅ Component information retrieved successfully`);

      return {
        content: [
          {
            type: "text" as const,
            text: data.result,
          },
        ],
      };
    } catch (error) {
      console.error("❌ Error executing GetComponentTool:", error);
      
      // Provide fallback response if API server is not available
      const fallbackResponse = `
# Component Installation Guide

## Component: ${searchQuery}

⚠️ **API Server Unavailable**

The SuperUI API server is not responding. Here's a basic installation guide:

### Manual Installation
\`\`\`bash
cd ${absolutePathToProjectDirectory}
npx shadcn@latest add ${searchQuery.toLowerCase()}
\`\`\`

### Basic Usage
\`\`\`tsx
import { ${this.capitalizeFirst(searchQuery)} } from "@/components/ui/${searchQuery.toLowerCase()}";

// Use the component in your JSX
<${this.capitalizeFirst(searchQuery)} />
\`\`\`

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

  /**
   * Capitalize the first letter of a string
   * @param str - String to capitalize
   * @returns Capitalized string
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
