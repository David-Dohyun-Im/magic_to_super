# SuperUI MCP 테스트 가이드 (Claude Code 전용)

## ✅ 설정 완료!

모든 설정이 완료되었습니다. 아래 단계에 따라 Claude Code(VS Code 확장)에서 테스트해보세요.

## 🚀 실행 상태

### 1. API 서버 (포트 3001)
- ✅ **실행 중** - `http://localhost:3001`
- 헬스 체크: `curl http://localhost:3001/health`

### 2. MCP 서버
- ✅ **Claude Code에 이미 등록됨** - `.claude.json` 파일에 설정 완료
- 서버 이름: `superui`
- 경로: `/Users/yunhyeok/Desktop/recentproj/magic_to_super/superui-mcp/dist/index.js`

## 📝 Claude Code (.claude.json) 설정 확인

`.claude.json` 파일 위치:
```
/Users/yunhyeok/.claude.json
```

**현재 설정 (이미 등록되어 있음):**
```json
{
  "mcpServers": {
    "superui": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/Users/yunhyeok/Desktop/recentproj/magic_to_super/superui-mcp/dist/index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:3001"
      }
    }
  }
}
```

✅ **이미 설정되어 있으므로 추가 작업 불필요!**

## 🧪 Claude Code(VS Code)에서 테스트하기

### Step 1: VS Code 재시작

1. VS Code를 완전히 종료합니다 (**Cmd+Q**)
2. VS Code를 다시 시작합니다
3. Claude Code 확장이 MCP 서버를 자동으로 로드합니다

### Step 2: Claude Code 채팅 열기

- **Cmd+Shift+P** → "Claude Code: Open Chat" 선택
- 또는 사이드바의 Claude 아이콘 클릭

### Step 3: 컴포넌트 요청 테스트

채팅창에서 다음과 같이 입력해보세요:

#### 테스트 1: Button 컴포넌트
```
I need a button component for my React project
```

또는

```
Get me the button component
```

예상 응답:
```markdown
# Button

A versatile button component with multiple variants and sizes

## 📦 Installation
cd /Users/yunhyeok/Desktop/recentproj/magic_to_super
npx shadcn@latest add button

## 🔧 Import Statement
import { Button } from "@/components/ui/button"

## 💡 Basic Usage
<Button variant="default">Click me</Button>
```

#### 테스트 2: Card 컴포넌트
```
Add a card component to display user information
```

#### 테스트 3: Input 컴포넌트
```
I want to add an input field to my login form
```

#### 테스트 4: 여러 컴포넌트
```
I need input, button, and card components for my form
```

#### 테스트 5: 검색으로 테스트
```
Show me how to use the dialog component
```

## 📦 지원되는 컴포넌트 (23개)

### Form Components (6개)
- **button** - 버튼 컴포넌트
- **input** - 텍스트 입력 컴포넌트
- **textarea** - 여러 줄 텍스트 입력
- **select** - 드롭다운 선택 컴포넌트
- **checkbox** - 체크박스 입력
- **radio-group** - 라디오 버튼 그룹

### Layout Components (4개)
- **card** - 콘텐츠 컨테이너
- **sheet** - 슬라이드 아웃 패널
- **dialog** - 모달 대화상자
- **popover** - 플로팅 패널

### Navigation Components (3개)
- **tabs** - 탭 인터페이스
- **accordion** - 접을 수 있는 콘텐츠
- **breadcrumb** - 탐색 경로

### Data Display Components (5개)
- **table** - 데이터 테이블
- **badge** - 상태 표시기
- **avatar** - 프로필 이미지
- **progress** - 진행률 바
- **skeleton** - 로딩 플레이스홀더

### Feedback Components (3개)
- **alert** - 알림 메시지
- **toast** - 토스트 알림
- **separator** - 구분선

## 🎯 사용 예시

### 예시 1: 단순 컴포넌트 요청
**입력**: 
```
Get me a button component
```

**Claude Code의 응답**:
```markdown
# Button

A versatile button component with multiple variants and sizes

## 📦 Installation
cd /Users/yunhyeok/Desktop/recentproj/magic_to_super
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

### 예시 2: 자연어 요청
**입력**: 
```
I'm building a user profile page and need a card component to display user information
```

**Claude Code의 응답**: 
- Card 컴포넌트 설치 가이드
- 사용법 예시와 import 문
- 프로젝트 경로에 맞는 설치 경로

### 예시 3: 컴포넌트 별칭 사용
**입력**: 
```
I need a text field for user input
```

**Claude Code의 응답**: 
- Input 컴포넌트로 자동 매칭
- 설치 가이드 제공

## 🔍 디버깅

### API 서버 로그 확인
```bash
# API 서버가 실행 중인지 확인
curl http://localhost:3001/health

# 컴포넌트 목록 확인
curl http://localhost:3001/api/component/list | jq

# 특정 컴포넌트 검색
curl "http://localhost:3001/api/component/search?q=button" | jq
```

### MCP 서버 로그 확인

VS Code의 Output 패널에서:
1. **View** → **Output** (Cmd+Shift+U)
2. 드롭다운에서 **Claude Code** 선택
3. MCP 서버 연결 및 실행 로그 확인

### 문제 해결

#### 1. API 서버가 응답하지 않는 경우
```bash
# API 서버 상태 확인
curl http://localhost:3001/health

# API 서버가 중단되었다면 재시작
cd /Users/yunhyeok/Desktop/recentproj/magic_to_super/superui-server
npm start &
```

#### 2. MCP 서버가 작동하지 않는 경우

**해결 방법:**
1. VS Code 완전 종료 (**Cmd+Q**)
2. `.claude.json` 파일 확인:
   ```bash
   cat ~/.claude.json | jq '.mcpServers.superui'
   ```
3. MCP 서버 경로 확인:
   ```bash
   ls /Users/yunhyeok/Desktop/recentproj/magic_to_super/superui-mcp/dist/index.js
   ```
4. MCP 서버 빌드 확인:
   ```bash
   cd /Users/yunhyeok/Desktop/recentproj/magic_to_super/superui-mcp
   npm run build
   ```
5. VS Code 재시작

#### 3. 컴포넌트를 찾을 수 없는 경우
```bash
# 사용 가능한 컴포넌트 목록 확인
curl http://localhost:3001/api/component/list | jq '.components[] | .componentName'
```

**출력 예시:**
```
"button"
"input"
"textarea"
"select"
"checkbox"
"radio"
"card"
...
```

#### 4. Claude Code가 MCP 도구를 인식하지 못하는 경우

1. VS Code Output 패널에서 Claude Code 로그 확인
2. `.claude.json` 파일 JSON 문법 오류 확인
3. 서버 경로가 올바른지 확인
4. VS Code 완전 재시작 (종료 후 재실행)

#### 5. "API Server Unavailable" 메시지가 나오는 경우

API 서버가 실행 중이 아닙니다:
```bash
# API 서버 시작
cd /Users/yunhyeok/Desktop/recentproj/magic_to_super/superui-server
npm start &

# 또는 백그라운드로
nohup npm start > /dev/null 2>&1 &
```

## 🌐 API 엔드포인트

### 1. Health Check
```bash
GET http://localhost:3001/health
```

**응답:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-07T10:50:10.128Z",
  "version": "1.0.0",
  "uptime": 6.846754625
}
```

### 2. Component Information (MCP에서 사용)
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

### 3. Search Components
```bash
GET http://localhost:3001/api/component/search?q=button
```

**응답:**
```json
{
  "query": "button",
  "results": [
    {
      "componentName": "button",
      "displayName": "Button",
      "description": "A versatile button component",
      "category": "form",
      "tags": ["button", "click", "action"]
    }
  ],
  "count": 1
}
```

### 4. List All Components
```bash
GET http://localhost:3001/api/component/list
```

### 5. Get Specific Component
```bash
GET http://localhost:3001/api/component/button
```

## 💡 Claude Code 사용 팁

### 1. 자연어로 편하게 요청하세요
```
I need a button → ✅ Button 컴포넌트
Show me card → ✅ Card 컴포넌트
Add input field → ✅ Input 컴포넌트
```

### 2. 별칭도 인식합니다
```
btn → button
text field → input
dropdown → select
modal → dialog
popup → toast
```

### 3. 컨텍스트를 포함하면 더 좋습니다
```
I'm building a login form and need an input component for the email field
```

### 4. 여러 컴포넌트를 한번에 요청할 수 있습니다
```
I need button, input, and card components for my dashboard
```

### 5. 현재 파일 컨텍스트 활용
- Claude Code는 현재 열린 파일의 경로를 자동으로 전달합니다
- 프로젝트 루트를 자동으로 인식합니다
- 설치 경로가 프로젝트 구조에 맞게 조정됩니다

## 📝 중요 참고 사항

### 1. API 서버는 계속 실행 중이어야 합니다
- 현재 백그라운드에서 실행 중입니다
- 종료하려면: `pkill -f "node.*superui-server"`
- 재시작: 
  ```bash
  cd /Users/yunhyeok/Desktop/recentproj/magic_to_super/superui-server
  npm start &
  ```

### 2. VS Code 재시작 필요 시점
- `.claude.json` 설정 변경 후
- MCP 서버 코드 변경 및 빌드 후
- 이상 동작 시

### 3. 프로젝트 경로 인식
- Claude Code는 현재 VS Code 워크스페이스의 경로를 자동으로 전달
- 설치 경로가 자동으로 프로젝트에 맞게 조정
- `src/components/ui`, `app/components/ui` 등 구조에 맞춰 안내

### 4. shadcn/ui 설치 전제조건
- **React** 프로젝트 (Next.js, Vite, CRA 등)
- **Tailwind CSS** 설치 및 설정
- **TypeScript** 권장 (선택사항)

### 5. 설치 후 할 일
1. 제공된 `npx shadcn@latest add [component]` 명령어 실행
2. Import 구문을 파일에 추가
3. 컴포넌트 사용

## 🎉 성공 지표

다음과 같은 응답을 받으면 성공입니다:
- ✅ 컴포넌트 이름이 정확히 식별됨
- ✅ `npx shadcn@latest add [component]` 명령어 제공
- ✅ Import 구문 제공
- ✅ 사용 예시 코드 제공
- ✅ 프로젝트 경로가 정확히 표시됨
- ✅ 컴포넌트 세부 정보 (카테고리, 태그) 제공

## 🚀 빠른 시작 체크리스트

- [x] API 서버 실행 중 확인 (`curl http://localhost:3001/health`)
- [x] `.claude.json`에 SuperUI MCP 등록 완료
- [ ] VS Code 재시작 (Cmd+Q 후 재실행)
- [ ] Claude Code 확장 활성화 확인
- [ ] "I need a button component" 테스트
- [ ] 응답에서 설치 명령어 확인
- [ ] 프로젝트에서 명령어 실행

## 🔗 추가 리소스

- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Radix UI 문서](https://www.radix-ui.com)
- [Tailwind CSS 문서](https://tailwindcss.com)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io)
- [Claude Code VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code)

## 📞 지원

문제가 발생하면:
1. API 서버 로그 확인
2. VS Code Output 패널에서 Claude Code 로그 확인
3. MCP 서버 빌드 상태 확인
4. `.claude.json` 파일 JSON 문법 확인

---

**준비 완료!** 이제 VS Code를 재시작하고 Claude Code에서 위의 테스트를 진행해보세요! 🚀

## 🎬 데모 시나리오

### 시나리오 1: 로그인 폼 만들기
```
You: I'm building a login form and need input fields for email and password, plus a submit button

Claude Code: [SuperUI MCP 도구 사용]
- Input 컴포넌트 설치 가이드
- Button 컴포넌트 설치 가이드
- 사용 예시 코드
```

### 시나리오 2: 대시보드 UI 구성
```
You: I need components for a dashboard: cards for metrics, a data table, and a progress bar

Claude Code: [SuperUI MCP 도구 사용]
- Card 컴포넌트 설치 가이드
- Table 컴포넌트 설치 가이드
- Progress 컴포넌트 설치 가이드
```

### 시나리오 3: 알림 시스템
```
You: Add toast and alert components for user notifications

Claude Code: [SuperUI MCP 도구 사용]
- Toast 컴포넌트 설치 가이드
- Alert 컴포넌트 설치 가이드
```

## 🔄 서버 관리 명령어

### API 서버 시작
```bash
cd /Users/yunhyeok/Desktop/recentproj/magic_to_super/superui-server
npm start &
```

### API 서버 중지
```bash
pkill -f "node.*superui-server"
```

### API 서버 상태 확인
```bash
curl http://localhost:3001/health
```

### MCP 서버 재빌드
```bash
cd /Users/yunhyeok/Desktop/recentproj/magic_to_super/superui-mcp
npm run build
```

### 로그 확인
```bash
# API 서버 프로세스 확인
ps aux | grep "superui-server"

# 포트 3001 사용 확인
lsof -i :3001
```

이제 Claude Code(VS Code 확장)에서 자연스럽게 UI 컴포넌트를 요청하고 설치할 수 있습니다! 🎨
