# SuperUI API Server

A comprehensive API server for UI component management, providing installation instructions and component information for React projects using shadcn/ui.

## 🎯 Features

- **Component Library**: Comprehensive database of shadcn/ui components
- **Smart Search**: Intelligent component search with aliases and tags
- **Installation Guides**: Detailed installation and usage instructions
- **Multiple Endpoints**: RESTful API with various endpoints
- **Error Handling**: Robust error handling with detailed responses
- **CORS Support**: Configurable CORS for cross-origin requests
- **Health Monitoring**: Health check and system monitoring endpoints

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 📚 API Endpoints

### Health Check

```http
GET /health
```

Returns server health status and system information.

### API Information

```http
GET /
```

Returns API documentation and available endpoints.

### Component Endpoints

#### Get Component Information

```http
POST /api/component
```

**Request Body:**
```json
{
  "message": "I need a button component",
  "searchQuery": "button",
  "absolutePathToCurrentFile": "/path/to/file.tsx",
  "absolutePathToProjectDirectory": "/path/to/project",
  "standaloneRequestQuery": "Create a button component for my React app"
}
```

**Response:**
```json
{
  "result": "# Button\n\nA versatile button component...\n\n## Installation\n\n```bash\ncd /path/to/project\nnpx shadcn@latest add button\n```\n\n...",
  "metadata": {
    "searchQuery": "button",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

#### Search Components

```http
GET /api/component/search?q=button
```

Returns components matching the search query.

#### List All Components

```http
GET /api/component/list
```

Returns all available components.

#### List Components by Category

```http
GET /api/component/list?category=form
```

Returns components in a specific category.

#### Get Specific Component

```http
GET /api/component/button
```

Returns detailed information about a specific component.

## 🏗️ Component Categories

### Form Components
- `button` - Button component
- `input` - Text input component
- `textarea` - Multi-line text input
- `select` - Dropdown select component
- `checkbox` - Checkbox input
- `radio-group` - Radio button group

### Layout Components
- `card` - Content container
- `sheet` - Slide-out panel
- `dialog` - Modal dialog
- `popover` - Floating panel

### Navigation Components
- `tabs` - Tabbed interface
- `accordion` - Collapsible content
- `breadcrumb` - Navigation breadcrumb

### Data Display Components
- `table` - Data table
- `badge` - Status indicator
- `avatar` - Profile image
- `progress` - Progress bar
- `skeleton` - Loading placeholder

### Feedback Components
- `alert` - Alert notification
- `toast` - Toast notification
- `separator` - Visual separator

## 🔍 Search Features

### Direct Matching
Search for exact component names: `button`, `input`, `card`

### Alias Matching
Use common aliases: `btn` → `button`, `dropdown` → `select`

### Tag-based Search
Search by functionality: `form`, `navigation`, `data`, `feedback`

### Partial Matching
Partial name matching: `but` → `button`, `tab` → `tabs`

## 🛡️ Error Handling

### 400 Bad Request
- Missing required fields
- Invalid query parameters

### 404 Not Found
- Component not found
- Invalid endpoint

### 500 Internal Server Error
- Server-side errors
- Database connection issues

## 📝 Development

### Project Structure

```
src/
├── index.ts              # Main Express server
├── routes/
│   └── component.ts      # Component API routes
├── services/
│   └── component-service.ts # Component business logic
└── utils/
    └── component-finder.ts  # Component search utilities
```

### Adding New Components

1. Add component information to `COMPONENT_LIBRARY` in `component-finder.ts`
2. Include all required fields: `componentName`, `displayName`, `packageName`, etc.
3. Add appropriate tags for search functionality
4. Test the component with search and installation endpoints

### Testing

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test component search
curl "http://localhost:3001/api/component/search?q=button"

# Test component information
curl -X POST http://localhost:3001/api/component \
  -H "Content-Type: application/json" \
  -d '{"searchQuery": "button", "message": "I need a button"}'
```

## 🚀 Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables for Production

```bash
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
```

## 🔗 Integration

### MCP Server Integration

The API server is designed to work with the SuperUI MCP server:

```typescript
// MCP Server HTTP Client
const response = await fetch('http://localhost:3001/api/component', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    searchQuery: 'button',
    message: 'I need a button component',
    absolutePathToCurrentFile: '/path/to/file.tsx',
    absolutePathToProjectDirectory: '/path/to/project',
    standaloneRequestQuery: 'Create a button component'
  })
});
```

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your component or feature
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For issues and questions:
1. Check the server logs
2. Verify endpoint URLs and request formats
3. Check CORS configuration
4. Open an issue on GitHub
