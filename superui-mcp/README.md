# SuperUI MCP Server

A simple and powerful MCP (Model Context Protocol) server that provides UI component installation and usage instructions for React projects using shadcn/ui.

## 🎯 Features

- **Single Tool**: One `get_component` tool for all UI component needs
- **Simple HTTP Communication**: Communicates with SuperUI API server via HTTP
- **Fallback Support**: Provides manual installation instructions when API is unavailable
- **TypeScript**: Fully typed for better development experience
- **Error Handling**: Robust error handling with detailed logging

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

```bash
# API Server URL (default: http://localhost:3001)
API_BASE_URL=http://localhost:3001

# Request timeout in milliseconds (default: 30000)
TIMEOUT=30000
```

### Command Line Arguments

```bash
# Set API base URL
node dist/index.js API_BASE_URL=http://api.example.com

# Set timeout
node dist/index.js TIMEOUT=60000
```

## 🛠️ Available Tools

### `get_component`

Fetches UI component information and provides installation instructions.

**Parameters:**
- `message`: Full user's message requesting the component
- `searchQuery`: Component name (2-4 words max)
- `absolutePathToCurrentFile`: Path to the current file
- `absolutePathToProjectDirectory`: Project root directory path
- `standaloneRequestQuery`: Complete request with context

**Example Usage:**
```
/ui get button component
I need a card component
Add an input field to my form
```

**Response:**
- npx installation command
- Import statements
- Usage examples
- Installation path information

## 🌐 API Communication

The MCP server communicates with the SuperUI API server via HTTP:

```
MCP Server → POST /api/component → API Server
MCP Server ← JSON Response ← API Server
```

**Request Format:**
```json
{
  "message": "user's request",
  "searchQuery": "component name",
  "absolutePathToCurrentFile": "/path/to/file.tsx",
  "absolutePathToProjectDirectory": "/path/to/project",
  "standaloneRequestQuery": "complete request with context"
}
```

**Response Format:**
```json
{
  "result": "formatted installation guide and usage instructions"
}
```

## 🛡️ Error Handling

### API Server Unavailable

When the API server is not available, the tool provides a fallback response with:
- Manual installation instructions
- Basic usage examples
- Error details
- Troubleshooting steps

### Network Errors

- Timeout handling (configurable)
- Connection error detection
- Detailed error logging
- Graceful degradation

## 📝 Development

### Project Structure

```
src/
├── index.ts              # Main MCP server
├── tools/
│   └── get-component.ts  # get_component tool
└── utils/
    ├── base-tool.ts      # Base tool class
    ├── config.ts         # Configuration management
    └── http-client.ts    # HTTP client for API communication
```

### Adding New Tools

1. Create a new tool class extending `BaseTool`
2. Implement the required abstract methods
3. Register the tool in `index.ts`

### Testing

```bash
# Test the MCP server
npm run dev

# Test with MCP inspector (if available)
npx @modelcontextprotocol/inspector node dist/index.js
```

## 🔗 Integration

### Cursor IDE

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "superui-mcp": {
      "command": "node",
      "args": ["/path/to/superui-mcp/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3001"
      }
    }
  }
}
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "superui-mcp": {
      "command": "node",
      "args": ["/path/to/superui-mcp/dist/index.js"]
    }
  }
}
```

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For issues and questions:
1. Check the logs for error details
2. Verify API server connectivity
3. Check configuration settings
4. Open an issue on GitHub
