# SuperUI MCP 프로젝트 계획서

## 🎯 프로젝트 목표
기존 Magic MCP의 복잡한 구조를 단순화하여, `get_component` 도구 하나만으로 UI 컴포넌트를 가져오고 설치할 수 있는 MCP 서버를 구축합니다.

## 🏗️ 전체 아키텍처

### 🎯 **분리된 독립 프로젝트 구조**

```
# 프로젝트 A: MCP 서버 (superui-mcp)
/Users/yunhyeok/Desktop/recentproj/superclaude_test/magic-mcp/superui-mcp/
├── src/
│   ├── index.ts                # MCP 서버 메인
│   ├── tools/
│   │   └── get-component.ts   # get_component 도구
│   └── utils/
│       ├── base-tool.ts       # 기본 도구 클래스
│       ├── http-client.ts     # HTTP 클라이언트 (API 서버와 통신)
│       └── config.ts          # 설정 관리
├── package.json
├── tsconfig.json
└── README.md

# 프로젝트 B: API 서버 (superui-server) - 별도 위치
/Users/yunhyeok/Desktop/recentproj/superclaude_test/magic-mcp/superui-server/
├── src/
│   ├── index.ts                # Express 서버 메인
│   ├── routes/
│   │   └── component.ts        # /api/component 엔드포인트
│   ├── services/
│   │   └── component-service.ts # 컴포넌트 비즈니스 로직
│   └── utils/
│       └── component-finder.ts # 컴포넌트 검색 유틸
├── package.json
├── tsconfig.json
└── README.md
```

### 🌐 **HTTP 통신 구조**

```
┌─────────────────┐    HTTP Request     ┌─────────────────┐
│   MCP Server    │ ──────────────────► │   API Server    │
│  (superui-mcp)  │                     │ (superui-server)│
│                 │ ◄────────────────── │                 │
└─────────────────┘    HTTP Response    └─────────────────┘
        │                                       │
        │                                       │
   ┌─────────┐                             ┌─────────┐
   │  IDE    │                             │Component│
   │(Cursor) │                             │Library  │
   └─────────┘                             └─────────┘
```

## 🔧 MCP 서버 설계

### 1. 도구 구조
```typescript
// src/tools/get-component.ts
const TOOL_NAME = "get_component";
const TOOL_DESCRIPTION = `
"Use this tool when the user wants to get a UI component and install it in their project.
This tool will fetch component information and provide installation commands."
`;

export class GetComponentTool extends BaseTool {
  name = TOOL_NAME;
  description = TOOL_DESCRIPTION;
  
  schema = z.object({
    message: z.string().describe("Full user's message"),
    searchQuery: z.string().describe("Search query for the component (2-4 words max)"),
    absolutePathToCurrentFile: z.string().describe("Absolute path to current file"),
    absolutePathToProjectDirectory: z.string().describe("Absolute path to project root"),
    standaloneRequestQuery: z.string().describe("Complete request query with context")
  });

  async execute({ message, searchQuery, absolutePathToCurrentFile, absolutePathToProjectDirectory, standaloneRequestQuery }) {
    // API 서버로 요청 전송
    const response = await httpClient.post('/api/component', {
      message,
      searchQuery,
      absolutePathToCurrentFile,
      absolutePathToProjectDirectory,
      standaloneRequestQuery
    });
    
    return {
      content: [{
        type: "text" as const,
        text: response.data.result
      }]
    };
  }
}
```

### 2. HTTP 클라이언트 (API 서버와 통신)
```typescript
// src/utils/http-client.ts
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export const httpClient = {
  async post<T>(endpoint: string, data: any): Promise<{ data: T }> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API Server Error: ${response.status} ${response.statusText}`);
    }
    
    return { data: await response.json() };
  }
};
```

### 3. 메인 서버
```typescript
// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GetComponentTool } from "./tools/get-component.js";

const server = new McpServer({
  name: "superui-mcp",
  version: "1.0.0",
});

// 도구 등록
new GetComponentTool().register(server);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("SuperUI MCP Server started");
}

runServer().catch(console.error);
```

## 🌐 API 서버 설계 (별도 프로젝트)

### 1. Express 서버
```typescript
// superui-server/src/index.ts
import express from 'express';
import cors from 'cors';
import componentRoutes from './routes/component.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정 (MCP 서버에서 접근 허용)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // MCP 서버 주소들
  credentials: true
}));

app.use(express.json());

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api', componentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 SuperUI API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
```

### 2. 컴포넌트 라우트
```typescript
// superui-server/src/routes/component.ts
import express from 'express';
import { getComponent } from '../services/component-service.js';

const router = express.Router();

// POST /api/component - MCP 서버에서 호출
router.post('/component', async (req, res) => {
  try {
    console.log('📥 Received component request:', req.body);
    
    const {
      message,
      searchQuery,
      absolutePathToCurrentFile,
      absolutePathToProjectDirectory,
      standaloneRequestQuery
    } = req.body;

    const result = await getComponent({
      message,
      searchQuery,
      absolutePathToCurrentFile,
      absolutePathToProjectDirectory,
      standaloneRequestQuery
    });

    console.log('📤 Sending component response:', result);
    res.json({ result });
  } catch (error) {
    console.error('❌ Component request error:', error);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
```

### 3. 컴포넌트 서비스
```typescript
// superui-server/src/services/component-service.ts
interface ComponentRequest {
  message: string;
  searchQuery: string;
  absolutePathToCurrentFile: string;
  absolutePathToProjectDirectory: string;
  standaloneRequestQuery: string;
}

interface ComponentResult {
  componentName: string;
  packageName: string;
  installCommand: string;
  importStatement: string;
  usage: string;
}

export async function getComponent(request: ComponentRequest): Promise<string> {
  const { searchQuery, absolutePathToCurrentFile, absolutePathToProjectDirectory } = request;
  
  // 1. 검색 쿼리 기반으로 컴포넌트 찾기
  const componentInfo = await findComponent(searchQuery);
  
  // 2. 설치 명령어 생성
  const installCommand = `npx shadcn@latest add ${componentInfo.componentName}`;
  
  // 3. 파일 경로 기반으로 설치 위치 결정
  const installPath = determineInstallPath(absolutePathToCurrentFile, absolutePathToProjectDirectory);
  
  // 4. 응답 생성
  const result = `
# ${componentInfo.displayName}

## 설치 명령어
\`\`\`bash
cd ${absolutePathToProjectDirectory}
${installCommand}
\`\`\`

## 사용법
\`\`\`tsx
${componentInfo.importStatement}
\`\`\`

## 예시
\`\`\`tsx
${componentInfo.usage}
\`\`\`

## 설치 위치
컴포넌트가 설치될 위치: \`${installPath}\`
  `;
  
  return result;
}
```

### 4. 컴포넌트 찾기 유틸리티
```typescript
// superui-server/src/utils/component-finder.ts
interface ComponentInfo {
  componentName: string;
  displayName: string;
  packageName: string;
  importStatement: string;
  usage: string;
}

const COMPONENT_LIBRARY = {
  "button": {
    componentName: "button",
    displayName: "Button",
    packageName: "@radix-ui/react-button",
    importStatement: `import { Button } from "@/components/ui/button"`,
    usage: `<Button variant="default">Click me</Button>`
  },
  "input": {
    componentName: "input", 
    displayName: "Input",
    packageName: "@radix-ui/react-input",
    importStatement: `import { Input } from "@/components/ui/input"`,
    usage: `<Input placeholder="Enter text..." />`
  },
  "card": {
    componentName: "card",
    displayName: "Card", 
    packageName: "@radix-ui/react-card",
    importStatement: `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"`,
    usage: `<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent>Content</CardContent></Card>`
  }
  // ... 더 많은 컴포넌트들
};

export async function findComponent(searchQuery: string): Promise<ComponentInfo> {
  const normalizedQuery = searchQuery.toLowerCase().trim();
  
  // 직접 매칭
  if (COMPONENT_LIBRARY[normalizedQuery]) {
    return COMPONENT_LIBRARY[normalizedQuery];
  }
  
  // 유사도 검색
  const similarComponent = findSimilarComponent(normalizedQuery);
  if (similarComponent) {
    return COMPONENT_LIBRARY[similarComponent];
  }
  
  // 기본값
  return {
    componentName: "button",
    displayName: "Button",
    packageName: "@radix-ui/react-button", 
    importStatement: `import { Button } from "@/components/ui/button"`,
    usage: `<Button>Default Button</Button>`
  };
}

function findSimilarComponent(query: string): string | null {
  const keywords = {
    "btn": "button",
    "input": "input",
    "text": "input",
    "form": "input",
    "container": "card",
    "box": "card",
    "panel": "card"
  };
  
  return keywords[query] || null;
}
```

## 📦 패키지 설정

### MCP 서버 (superui-mcp/package.json)
```json
{
  "name": "superui-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.8.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
```

### API 서버 (superui-server/package.json)
```json
{
  "name": "superui-api-server",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
```

## 🚀 구현 단계

### Phase 1: 기본 구조 설정
1. ✅ 프로젝트 디렉토리 생성
2. ✅ MCP 서버 기본 구조 설정 (superui-mcp/)
3. ✅ API 서버 기본 구조 설정 (superui-server/)
4. ✅ TypeScript 설정

### Phase 2: MCP 서버 구현
1. ✅ BaseTool 클래스 구현
2. ✅ GetComponentTool 구현
3. ✅ HTTP 클라이언트 구현
4. ✅ 메인 서버 구현

### Phase 3: API 서버 구현
1. ✅ Express 서버 설정
2. ✅ 컴포넌트 라우트 구현
3. ✅ 컴포넌트 서비스 로직 구현
4. ✅ 컴포넌트 라이브러리 구축

### Phase 4: 통합 테스트
1. ✅ MCP 서버와 API 서버 연동 테스트
2. ✅ 실제 컴포넌트 요청 테스트
3. ✅ 설치 명령어 검증

## 🎯 핵심 차이점 (기존 Magic MCP 대비)

| 특징 | Magic MCP | SuperUI MCP |
|------|-----------|-------------|
| **도구 개수** | 4개 (create, fetch, logo, refine) | 1개 (get_component) |
| **복잡성** | 높음 (콜백 서버, 브라우저 연동) | 낮음 (단순 HTTP API) |
| **외부 의존성** | 21st.dev API, SVGL API | 내부 API 서버만 |
| **설치 방식** | 자동 파일 생성 | npx 명령어 제공 |
| **커스터마이징** | 제한적 | 완전 커스터마이징 가능 |

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- TypeScript
- MCP 호환 IDE (Cursor, Claude, etc.)

### 환경 변수

#### MCP 서버 (superui-mcp)
```bash
# .env 파일
API_BASE_URL=http://localhost:3001
NODE_ENV=development
```

#### API 서버 (superui-server)
```bash
# .env 파일
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 📋 테스트 시나리오

### 1. 기본 컴포넌트 요청
```bash
# 사용자 입력
"/ui get button component"

# 예상 응답
"npx shadcn@latest add button"
```

### 2. 복잡한 요청
```bash
# 사용자 입력  
"/ui I need a card component for my product display"

# 예상 응답
"npx shadcn@latest add card"
# + 사용법과 예시 코드
```

### 3. 프로젝트 경로 기반 설치
```bash
# 사용자 입력
"/ui add input component to my form"

# 예상 응답
"cd /Users/user/project && npx shadcn@latest add input"
# + 해당 파일 경로에 맞는 import 구문
```

## 🎉 완성 후 기대 효과

1. **완전 분리**: MCP 서버와 API 서버가 독립적으로 개발/배포 가능
2. **HTTP 통신**: 표준 HTTP API로 확장성과 호환성 확보
3. **단순성**: 하나의 도구로 모든 컴포넌트 요청 처리
4. **빠른 응답**: 복잡한 콜백 없이 즉시 응답
5. **커스터마이징**: 내부 컴포넌트 라이브러리 완전 제어
6. **확장성**: 새로운 컴포넌트 쉽게 추가 가능
7. **디버깅**: 단순한 구조로 문제 해결 용이
8. **재사용성**: API 서버를 다른 MCP 서버에서도 활용 가능

## 🚀 배포 전략

### MCP 서버 배포
- **로컬 개발**: `npm run dev`
- **패키지 배포**: `npm publish` (NPM 패키지로 배포)
- **IDE 통합**: Cursor, Claude 등에서 MCP 서버로 등록

### API 서버 배포
- **로컬 개발**: `npm run dev`
- **클라우드 배포**: Vercel, Railway, Heroku 등
- **독립 운영**: 별도 도메인으로 서비스

이 계획을 바탕으로 단계별로 구현을 진행하겠습니다!
