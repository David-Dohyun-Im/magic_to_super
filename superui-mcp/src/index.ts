#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { GetComponentTool } from "./tools/get-component.js";
import { config, logConfig } from "./utils/config.js";

const VERSION = "1.0.0";
const server = new McpServer({
  name: "superui-mcp",
  version: VERSION,
});

// Register tools
new GetComponentTool().register(server);

async function runServer() {
  const transport = new StdioServerTransport();
  
  // Log configuration on startup
  logConfig();
  console.log(`🚀 Starting SuperUI MCP Server v${VERSION} (PID: ${process.pid})`);

  let isShuttingDown = false;

  const cleanup = () => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`🛑 Shutting down SuperUI MCP Server (PID: ${process.pid})...`);
    try {
      transport.close();
    } catch (error) {
      console.error(`❌ Error closing transport (PID: ${process.pid}):`, error);
    }
    console.log(`✅ SuperUI MCP Server closed (PID: ${process.pid})`);
    process.exit(0);
  };

  // Handle transport errors
  transport.onerror = (error: Error) => {
    console.error(`❌ Transport error (PID: ${process.pid}):`, error);
    cleanup();
  };

  transport.onclose = () => {
    console.log(`🔌 Transport closed unexpectedly (PID: ${process.pid})`);
    cleanup();
  };

  // Handle process signals
  process.on("SIGTERM", () => {
    console.log(`📡 Received SIGTERM (PID: ${process.pid})`);
    cleanup();
  });

  process.on("SIGINT", () => {
    console.log(`📡 Received SIGINT (PID: ${process.pid})`);
    cleanup();
  });

  process.on("beforeExit", () => {
    console.log(`📡 Received beforeExit (PID: ${process.pid})`);
    cleanup();
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error(`💥 Uncaught exception (PID: ${process.pid}):`, error);
    cleanup();
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error(`💥 Unhandled rejection (PID: ${process.pid}):`, reason);
    cleanup();
  });

  try {
    await server.connect(transport);
    console.log(`✅ SuperUI MCP Server started successfully (PID: ${process.pid})`);
    console.log(`🔧 Available tools: get_component`);
  } catch (error) {
    console.error(`💥 Fatal error starting server (PID: ${process.pid}):`, error);
    process.exit(1);
  }
}

runServer().catch((error) => {
  console.error(`💥 Fatal error running server (PID: ${process.pid}):`, error);
  if (!process.exitCode) {
    process.exit(1);
  }
});
