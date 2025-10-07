# SuperUI MCP - Simplified UI Component Tool for Claude Code

A streamlined MCP (Model Context Protocol) server that provides shadcn/ui component installation and usage instructions through a simple, natural language interface.

## 🎯 Overview

SuperUI MCP simplifies the process of adding shadcn/ui components to your React projects. Instead of searching documentation and copying installation commands, simply ask Claude Code for the components you need, and get instant installation instructions.

## 🏗️ Architecture

This project consists of two independent services:

### 1. **SuperUI MCP Server** (`superui-mcp/`)
- MCP server that connects to Claude Code
- Single tool: `get_component`
- Communicates with API server via HTTP

### 2. **SuperUI API Server** (`superui-server/`)
- Express.js backend
- Manages component library
- Provides installation guides

```
User (Claude Code) → MCP Server → API Server → Component Library
         ↑              ↓              ↓
   Installation Guide ← Response ← Component Search
```

## ✨ Features

- **Natural Language Interface**: Just describe what you need
- **23 Components**: Complete shadcn/ui component library
- **Smart Search**: Recognizes aliases and variations
- **Project-Aware**: Automatically detects your project structure
- **Installation Commands**: Ready-to-use npx commands
- **Usage Examples**: Import statements and code examples

## 📦 Supported Components

### Form Components (6)
button, input, textarea, select, checkbox, radio-group

### Layout Components (4)
card, sheet, dialog, popover

### Navigation Components (3)
tabs, accordion, breadcrumb

### Data Display Components (5)
table, badge, avatar, progress, skeleton

### Feedback Components (3)
alert, toast, separator

## 🚀 Installation & Setup

### Prerequisites

- **Node.js 18+**
- **VS Code** with **Claude Code extension** installed
- **React project** (Next.js, Vite, etc.)
- **Tailwind CSS** configured in your project

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd magic_to_super
```

### Step 2: Install & Build

#### Install API Server
```bash
cd superui-server
npm install
npm run build
```

#### Install MCP Server
```bash
cd ../superui-mcp
npm install
npm run build
```

### Step 3: Start API Server

```bash
cd superui-server
npm start
```

The API server will start on `http://localhost:3001`

**Verify it's running:**
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-07T10:50:10.128Z",
  "version": "1.0.0"
}
```

### Step 4: Configure Claude Code

#### Option A: Using Claude Code Settings

1. Open VS Code
2. Press **Cmd+Shift+P** (Mac) or **Ctrl+Shift+P** (Windows/Linux)
3. Type "Claude Code: Edit MCP Settings"
4. Add the SuperUI MCP configuration

#### Option B: Edit `.claude.json` Directly

The `.claude.json` file location varies by OS:

**macOS/Linux:**
```
~/.claude.json
```

**Windows:**
```
%USERPROFILE%\.claude.json
```

Add the following configuration:

```json
{
  "mcpServers": {
    "superui": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/absolute/path/to/magic_to_super/superui-mcp/dist/index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:3001"
      }
    }
  }
}
```

**Important:** Replace `/absolute/path/to/magic_to_super` with your actual project path.

**Example paths:**
- macOS: `/Users/username/projects/magic_to_super`
- Linux: `/home/username/projects/magic_to_super`
- Windows: `C:\\Users\\username\\projects\\magic_to_super`

If you already have other MCP servers configured:

```json
{
  "mcpServers": {
    "existing-server": {
      "type": "stdio",
      "command": "node",
      "args": ["..."]
    },
    "superui": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/absolute/path/to/magic_to_super/superui-mcp/dist/index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:3001"
      }
    }
  }
}
```

### Step 5: Restart VS Code

1. Close VS Code completely (**Cmd+Q** on Mac, or close all windows)
2. Restart VS Code
3. The MCP server will load automatically

### Step 6: Verify Connection

1. Open Claude Code chat in VS Code
2. Check that the MCP server is connected (look for a green indicator)
3. You're ready to use SuperUI!

## 🎯 Usage

### Basic Examples

#### Request a Button Component
```
I need a button component for my React app
```

#### Request Multiple Components
```
I'm building a login form, I need input fields and a submit button
```

#### Natural Language
```
Add a card component to display user profiles
```

```
Show me how to use the dialog component
```

### Response Example

When you ask for a component, Claude Code will provide:

```markdown
# Button

A versatile button component with multiple variants and sizes

## 📦 Installation
cd /path/to/your/project
npx shadcn@latest add button

## 🔧 Import Statement
import { Button } from "@/components/ui/button"

## 💡 Basic Usage
<Button variant="default">Click me</Button>

## 🏷️ Component Details
- **Name**: Button
- **Package**: @radix-ui/react-button
- **Category**: Form
- **Tags**: button, click, action, primary, secondary
```

### Component Aliases

The system recognizes common aliases:

- `btn` → `button`
- `text field` → `input`
- `dropdown` → `select`
- `modal` → `dialog`
- `popup` → `toast`
- And many more...

## 🔧 Configuration

### Environment Variables

#### API Server (`superui-server`)

Create a `.env` file in `superui-server/`:

```bash
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### MCP Server (`superui-mcp`)

Set in `.claude.json`:

```json
{
  "env": {
    "API_BASE_URL": "http://localhost:3001",
    "TIMEOUT": "30000"
  }
}
```

### Custom Port

If you need to use a different port:

1. Update `PORT` in API server `.env`
2. Update `API_BASE_URL` in `.claude.json`
3. Restart both servers

## 🐛 Troubleshooting

### MCP Server Not Working

**Symptoms:**
- Claude Code doesn't respond to component requests
- "Tool not available" errors

**Solutions:**

1. **Check VS Code Output:**
   - View → Output (Cmd+Shift+U)
   - Select "Claude Code" from dropdown
   - Look for error messages

2. **Verify `.claude.json`:**
   ```bash
   # Check JSON syntax
   cat ~/.claude.json | jq
   ```

3. **Check MCP server path:**
   ```bash
   # Verify file exists
   ls /path/to/magic_to_super/superui-mcp/dist/index.js
   ```

4. **Rebuild MCP server:**
   ```bash
   cd superui-mcp
   npm run build
   ```

5. **Restart VS Code completely**

### API Server Not Responding

**Symptoms:**
- "API Server Unavailable" messages
- Fallback installation instructions

**Solutions:**

1. **Check API server status:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Restart API server:**
   ```bash
   cd superui-server
   npm start
   ```

3. **Check if port 3001 is in use:**
   ```bash
   # macOS/Linux
   lsof -i :3001
   
   # Windows
   netstat -ano | findstr :3001
   ```

4. **Check API server logs** for errors

### Component Not Found

**Symptoms:**
- "Component not found" messages

**Solutions:**

1. **Check available components:**
   ```bash
   curl http://localhost:3001/api/component/list
   ```

2. **Search for component:**
   ```bash
   curl "http://localhost:3001/api/component/search?q=button"
   ```

3. **Try using exact component name** from the supported list

### Wrong Installation Path

**Solutions:**

1. Make sure you're in the correct project directory
2. Claude Code automatically detects your VS Code workspace path
3. Check the installation guide for the correct path

## 🌐 API Endpoints

### Health Check
```bash
GET http://localhost:3001/health
```

### Component Information
```bash
POST http://localhost:3001/api/component
Content-Type: application/json

{
  "searchQuery": "button",
  "message": "I need a button",
  "absolutePathToCurrentFile": "/path/to/file.tsx",
  "absolutePathToProjectDirectory": "/path/to/project",
  "standaloneRequestQuery": "I need a button component"
}
```

### Search Components
```bash
GET http://localhost:3001/api/component/search?q=button
```

### List All Components
```bash
GET http://localhost:3001/api/component/list
```

### Get Specific Component
```bash
GET http://localhost:3001/api/component/button
```

## 📁 Project Structure

```
magic_to_super/
├── superui-mcp/              # MCP Server
│   ├── src/
│   │   ├── index.ts          # Main server
│   │   ├── tools/
│   │   │   ├── get-component.ts
│   │   │   └── get-template.ts
│   │   └── utils/
│   │       ├── base-tool.ts
│   │       ├── config.ts
│   │       └── http-client.ts
│   ├── dist/                 # Built files
│   ├── package.json
│   └── tsconfig.json
│
└── superui-server/           # API Server
    ├── src/
    │   ├── index.ts          # Express server
    │   ├── routes/
    │   │   ├── component.ts
    │   │   └── template.ts
    │   ├── services/
    │   │   ├── component-service.ts
    │   │   └── template-service.ts
    │   └── utils/
    │       ├── component-finder.ts
    │       └── template-conversation.ts
    ├── dist/                 # Built files
    ├── package.json
    └── tsconfig.json
```

## 🔄 Development

### Running in Development Mode

#### API Server
```bash
cd superui-server
npm run dev
```

#### MCP Server
```bash
cd superui-mcp
npm run dev
```

### Adding New Components

1. Edit `superui-server/src/utils/component-finder.ts`
2. Add component to `COMPONENT_LIBRARY` object:
   ```typescript
   "new-component": {
     componentName: "new-component",
     displayName: "New Component",
     packageName: "@radix-ui/react-new-component",
     importStatement: `import { NewComponent } from "@/components/ui/new-component"`,
     usage: `<NewComponent />`,
     description: "Description of the component",
     category: "form",
     tags: ["tag1", "tag2", "tag3"]
   }
   ```
3. Rebuild and restart API server

### Testing

```bash
# Test API server health
curl http://localhost:3001/health

# Test component search
curl "http://localhost:3001/api/component/search?q=button"

# Test component retrieval
curl -X POST http://localhost:3001/api/component \
  -H "Content-Type: application/json" \
  -d '{"searchQuery": "button", "message": "I need a button"}'
```

## 🚀 Deployment

### Running API Server in Production

```bash
cd superui-server
npm run build
NODE_ENV=production npm start
```

### Using Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start API server
cd superui-server
pm2 start dist/index.js --name superui-api

# Start on boot
pm2 startup
pm2 save
```

### Docker Deployment

Create `Dockerfile` in `superui-server/`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t superui-api .
docker run -p 3001:3001 superui-api
```

## 📝 Key Differences from Magic MCP

| Feature | Magic MCP | SuperUI MCP |
|---------|-----------|-------------|
| **Tools** | 4 tools | 1 tool (`get_component`) |
| **Complexity** | High (callback server, browser) | Low (simple HTTP API) |
| **Dependencies** | External APIs (21st.dev, SVGL) | Self-contained API server |
| **Installation** | Auto file generation | npx command guidance |
| **Customization** | Limited | Full control over components |

## 🔗 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io)
- [Claude Code Extension](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code)

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 💬 Support

For issues and questions:
1. Check the API server logs
2. Check VS Code Output panel (Claude Code)
3. Verify MCP server build status
4. Check `.claude.json` syntax
5. Open an issue on GitHub

## 🎉 Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Claude Code extension installed in VS Code
- [ ] Repository cloned
- [ ] API server installed and built
- [ ] MCP server installed and built
- [ ] API server running on port 3001
- [ ] `.claude.json` configured with correct absolute path
- [ ] VS Code restarted
- [ ] Tested with "I need a button component"
- [ ] Received installation instructions

---

**Ready to go!** Ask Claude Code for UI components and get instant installation instructions! 🚀

