import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Base class for all MCP tools
 * Provides common functionality for tool registration and execution
 */
export abstract class BaseTool {
  abstract name: string;
  abstract description: string;
  abstract schema: z.ZodObject<any>;

  /**
   * Register this tool with the MCP server
   * @param server - The MCP server instance
   */
  register(server: McpServer) {
    server.tool(
      this.name,
      this.description,
      this.schema.shape,
      this.execute.bind(this)
    );
  }

  /**
   * Execute the tool with the provided arguments
   * @param args - Validated arguments based on the schema
   * @returns Promise resolving to tool execution result
   */
  abstract execute(args: z.infer<typeof this.schema>): Promise<{
    content: Array<{ type: "text"; text: string }>;
  }>;
}
