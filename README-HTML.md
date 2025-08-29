# 🤖 HTML 기반 Spring AI 챗봇

Spring Boot + HTML/CSS/JavaScript 기반의 AI 챗봇 애플리케이션입니다. OpenAI API를 사용하여 지능형 대화를 제공합니다.

## 🌟 특징

- **순수 HTML/CSS/JavaScript**: React 없이 구현된 가벼운 프론트엔드
- **Spring Boot 백엔드**: Spring AI를 활용한 강력한 서버
- **Docker 지원**: 간편한 배포와 실행
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **한국어 인터페이스**: 직관적인 사용자 경험

## 📋 사전 요구사항

다음 소프트웨어가 설치되어 있어야 합니다:

- [Docker](https://www.docker.com/products/docker-desktop) (최신 버전)
- [Docker Compose](https://docs.docker.com/compose/install/)
- OpenAI API 키 ([OpenAI 웹사이트](https://platform.openai.com/)에서 발급)

## 🚀 빠른 시작

### 1단계: 프로젝트 클론

```bash
git clone <repository-url>
cd springboot-react-docker-chatbot-main
```

### 2단계: 환경 설정

`.env` 파일을 열어 OpenAI API 키를 설정하세요:

```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
SPRING_PORT=8080
FRONTEND_PORT=3000
LOG_LEVEL=INFO
```

### 3단계: 애플리케이션 실행

```bash
# 실행 스크립트 사용 (권장)
./start-html-chatbot.sh

# 또는 직접 Docker Compose 실행
docker-compose -f docker-compose-html.yaml up --build
```

### 4단계: 웹 브라우저에서 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080

## 📁 프로젝트 구조

```
├── html-chatbot-ui/          # HTML 기반 프론트엔드
│   ├── index.html           # 메인 HTML 파일
│   ├── styles.css           # CSS 스타일시트
│   ├── script.js            # JavaScript 로직
│   ├── images/              # 이미지 파일들
│   ├── nginx.conf           # Nginx 설정
│   └── Dockerfile           # 프론트엔드 Docker 설정
├── spring-boot-ai-chatbot/   # Spring Boot 백엔드
│   ├── src/                 # Java 소스 코드
│   ├── pom.xml              # Maven 설정
│   └── Dockerfile           # 백엔드 Docker 설정
├── docker-compose-html.yaml # HTML 버전 Docker Compose
├── start-html-chatbot.sh    # 실행 스크립트
├── .env                     # 환경 변수
└── README-HTML.md           # 이 파일
```

## 🔧 API 엔드포인트

### GET `/ai/chat/string`

쿼리 파라미터로 메시지를 전송하여 AI 응답을 받습니다.

```http
GET http://localhost:8080/ai/chat/string?message=안녕하세요
```

### POST `/ai/chat`

JSON 형태로 메시지를 전송하여 AI 응답을 받습니다.

```http
POST http://localhost:8080/ai/chat
Content-Type: application/json

{
  "message": "Spring AI에 대해 설명해주세요"
}
```

## 🎨 커스터마이징

### 프론트엔드 수정

- `html-chatbot-ui/styles.css`: 디자인과 레이아웃 수정
- `html-chatbot-ui/script.js`: JavaScript 기능 수정
- `html-chatbot-ui/index.html`: HTML 구조 수정

### 백엔드 수정

- `src/main/java/`: Java 코드 수정
- `src/main/resources/application.yaml`: Spring Boot 설정

## 🐳 Docker 명령어

### 개별 서비스 실행

```bash
# 백엔드만 실행
docker-compose -f docker-compose-html.yaml up springboot-app

# 프론트엔드만 실행
docker-compose -f docker-compose-html.yaml up html-chatbot-ui
```

### 컨테이너 관리

```bash
# 모든 서비스 중지
docker-compose -f docker-compose-html.yaml down

# 이미지까지 삭제
docker-compose -f docker-compose-html.yaml down --rmi all

# 볼륨까지 삭제
docker-compose -f docker-compose-html.yaml down -v
```

## 🔍 트러블슈팅

### 1. CORS 오류가 발생하는 경우

Spring Boot의 `WebConfig.java`에서 CORS 설정을 확인하세요:

```java
.allowedOrigins("http://localhost:3000")
```

### 2. API 연결 오류가 발생하는 경우

1. 백엔드 서비스가 실행 중인지 확인: http://localhost:8080/actuator/health
2. 환경 변수 `OPENAI_API_KEY`가 올바르게 설정되었는지 확인
3. 네트워크 연결 상태 확인

### 3. Docker 빌드 오류가 발생하는 경우

```bash
# Docker 시스템 정리
docker system prune -a

# 다시 빌드
docker-compose -f docker-compose-html.yaml up --build --force-recreate
```

### 4. 포트 충돌이 발생하는 경우

`.env` 파일에서 포트 번호를 변경하세요:

```env
SPRING_PORT=8081
FRONTEND_PORT=3001
```

## 📱 모바일 지원

이 애플리케이션은 반응형 디자인을 지원합니다:

- 모바일 최적화된 UI
- 터치 인터페이스 지원
- 다양한 화면 크기 대응

## 🔒 보안

- CORS 설정으로 안전한 API 통신
- Nginx 보안 헤더 적용
- 입력 검증 및 제한 (500자)

## 📝 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.

## 🤝 기여

1. 이 저장소를 포크하세요
2. 새 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📞 문의

프로젝트에 대한 질문이나 제안이 있으시면 이슈를 생성해주세요.

---

**즐거운 채팅하세요! 🎉**