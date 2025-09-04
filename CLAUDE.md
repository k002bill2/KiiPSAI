# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

다음으로 구성된 한국어 AI 챗봇 애플리케이션입니다:
- **Spring Boot 백엔드** - Spring AI와 OpenAI 통합
- **HTML/CSS/JavaScript 프론트엔드** - 한국어 사용자 인터페이스
- **Docker 컨테이너화** - 두 서비스 모두

## 주요 명령어

### 개발 환경 설정
```bash
# OpenAI API 키 설정 (필수)
# spring-boot-ai-chatbot/ 디렉토리에 .env 파일 생성:
echo "OPENAI_API_KEY=your_openai_api_key_here" > spring-boot-ai-chatbot/.env

# 설정 확인
./verify-setup.sh
```

### Docker 개발 (권장)
```bash
# HTML + Spring Boot 서비스 시작
docker-compose up --build

# 대안으로 HTML 전용 구성 사용
docker-compose -f docker-compose-html.yaml up --build
# 또는 편의 스크립트 사용:
./start-html-chatbot.sh

# 로그 확인
docker-compose logs
docker-compose logs springboot-app
docker-compose logs html-chatbot-ui

# 서비스 중지
docker-compose down
```

### 로컬 개발

#### 백엔드 (Spring Boot)
```bash
cd spring-boot-ai-chatbot/
./mvnw clean install spring-boot:run

# 테스트 실행
./mvnw test

# 빌드만
./mvnw clean package
```

#### 프론트엔드 (HTML)
```bash
cd html-chatbot-ui/
# 정적 파일이므로 별도의 빌드 과정 불필요
# 웹 서버나 Docker를 통해 서빙
```

### 상태 확인
```bash
# 백엔드 상태 엔드포인트
curl http://localhost:8080/actuator/health

# 프론트엔드 접근성
curl http://localhost:3000
```

## 아키텍처

### 백엔드 아키텍처 (Spring Boot)
- **메인 애플리케이션**: `SpringBootChatBotApplication.java` - 표준 Spring Boot 진입점
- **REST 컨트롤러**: `ChatController.java` - AI 채팅 엔드포인트 처리
  - `/ai/chat` - OpenAI 통합을 통한 스트리밍 ChatResponse
  - `/ai/chat/string` - 한국어 컨텍스트가 포함된 문자열 응답
- **설정**: `WebConfig.java` - 프론트엔드 접근을 위한 CORS 설정
- **속성**: `application.yaml` - OpenAI 모델 설정 (gpt-3.5-turbo, temperature: 0.7) 및 한국어 인코딩

### 프론트엔드 아키텍처 (HTML/CSS/JavaScript)
- **메인 페이지**: `index.html` - KIIPS AI 챗봇 인터페이스
- **스타일링**: `styles.css` - 반응형 한국어 UI 스타일
- **스크립트**: `script.js` - 핵심 채팅 기능:
  - 메시지 상태 관리
  - Fetch API를 통한 백엔드 통신
  - 로딩 상태 및 에러 처리
  - 실시간 메시징 UI
  - **마크다운 렌더링**: AI 응답의 마크다운을 HTML로 변환하여 표시
  - **코드 하이라이팅**: Highlight.js를 사용한 코드 블록 문법 강조

### 프로젝트 구조
```
├── spring-boot-ai-chatbot/          # 백엔드 서비스
│   ├── src/main/java/in/vikasrajput/ai/chatbot/
│   │   ├── SpringBootChatBotApplication.java
│   │   ├── controller/ChatController.java
│   │   └── config/WebConfig.java
│   ├── src/main/resources/application.yaml
│   └── pom.xml                      # Maven 의존성
├── html-chatbot-ui/                 # HTML 프론트엔드
│   ├── index.html                   # 메인 HTML 파일
│   ├── styles.css                   # CSS 스타일
│   ├── script.js                    # JavaScript 로직
│   ├── nginx.conf                   # Nginx 설정
│   ├── Dockerfile                   # Docker 빌드 파일
│   └── images/                      # 이미지 자원
└── docker-compose.yaml             # 서비스 오케스트레이션
```

### 통신 흐름
1. 사용자가 HTML 프론트엔드에서 메시지 입력
2. 프론트엔드가 `http://localhost:8080/ai/chat/string?message={input}`로 GET 요청 전송
3. Spring Boot 컨트롤러가 OpenAI ChatModel을 통해 한국어 컨텍스트로 요청 처리
4. AI 응답이 프론트엔드로 스트리밍됨
5. 프론트엔드가 사용자/AI 메시지를 구분하여 표시

### 주요 의존성
- **백엔드**: Spring Boot 3.3.3, Spring AI 1.0.0-M1, OpenAI 통합
- **프론트엔드**: Vanilla HTML/CSS/JavaScript, Font Awesome 6.0.0, Marked.js 9.1.6 (마크다운 파싱), Highlight.js 11.9.0 (코드 하이라이팅)
- **빌드 도구**: Maven (백엔드), Nginx (프론트엔드 서빙)

### 설정 참고사항
- **CORS**: 백엔드가 `http://localhost:3000`에서의 요청 허용 설정
- **OpenAI**: 기본 모델 gpt-3.5-turbo, temperature 0.7, max-tokens 1000
- **한국어 지원**: UTF-8 인코딩 강제 설정 및 한국어 프롬프트 컨텍스트
- **상태 모니터링**: Docker 헬스체크를 위한 관리 엔드포인트 활성화
- **API 키**: 환경 변수 `OPENAI_API_KEY`를 통해 제공 필수

### 마크다운 렌더링 기능
AI 응답에서 마크다운 콘텐츠를 HTML로 렌더링하여 표시하는 기능이 구현되었습니다:

#### 지원 기능
- **텍스트 서식**: 굵게, 기울임, 인라인 코드
- **제목**: H1-H6 제목 태그
- **리스트**: 순서 있는/없는 리스트, 중첩 리스트
- **코드 블록**: 문법 하이라이팅 지원 (JavaScript, Python, Java 등)
- **인용구**: 블록 인용문
- **테이블**: 표 형식 데이터
- **링크**: 외부 링크
- **수평선**: 구분선

#### 테스트
마크다운 렌더링 테스트는 `html-chatbot-ui/test-markdown.html`에서 확인 가능합니다.

### 현재 개발 상태
`/ai/chat/string` 엔드포인트가 한국어 AI 어시스턴트로 작동하도록 완전히 구현되었습니다. 한국어 프롬프트 컨텍스트와 에러 처리가 포함되어 있으며, OpenAI API와 완전 통합되어 있습니다. AI 응답의 마크다운 콘텐츠는 자동으로 HTML로 변환되어 사용자에게 표시됩니다.