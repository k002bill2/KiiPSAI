# 🚀 HTML 챗봇 사용 가이드

## 빠른 시작

### 1️⃣ 환경 설정
```bash
# .env 파일 편집
nano .env

# OPENAI_API_KEY를 실제 키로 변경
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 2️⃣ 실행
```bash
# 간편 실행
./start-html-chatbot.sh

# 또는 직접 실행
docker-compose -f docker-compose-html.yaml up --build
```

### 3️⃣ 접속
- **웹 UI**: http://localhost:3000
- **API**: http://localhost:8080

## 📱 사용법

1. **웹 브라우저 접속**: http://localhost:3000
2. **메시지 입력**: 하단 입력창에 질문 또는 메시지 입력
3. **전송**: Enter 키 또는 전송 버튼 클릭
4. **AI 응답 확인**: AI가 생성한 답변 확인

## 🔧 관리 명령어

```bash
# 서비스 중지
docker-compose -f docker-compose-html.yaml down

# 로그 확인
docker-compose -f docker-compose-html.yaml logs

# 특정 서비스 로그
docker-compose -f docker-compose-html.yaml logs springboot-app
docker-compose -f docker-compose-html.yaml logs html-chatbot-ui

# 재시작
docker-compose -f docker-compose-html.yaml restart

# 완전 정리 (이미지까지 삭제)
docker-compose -f docker-compose-html.yaml down --rmi all
```

## 🎨 커스터마이징

### UI 스타일 변경
```bash
# CSS 파일 편집
nano html-chatbot-ui/styles.css

# 변경 후 재빌드
docker-compose -f docker-compose-html.yaml up --build html-chatbot-ui
```

### API 설정 변경
```bash
# Spring Boot 설정 편집
nano spring-boot-ai-chatbot/src/main/resources/application.yaml

# 변경 후 재빌드
docker-compose -f docker-compose-html.yaml up --build springboot-app
```

## 🐛 문제 해결

### API 키 오류
```bash
# .env 파일 확인
cat .env

# 올바른 API 키로 수정
nano .env
```

### 포트 충돌
```bash
# 다른 포트 사용
docker-compose -f docker-compose-html.yaml up --build -p 3001:80 html-chatbot-ui
```

### Docker 문제
```bash
# Docker 상태 확인
docker ps
docker images

# 시스템 정리
docker system prune -a
```

## 📊 모니터링

### 헬스 체크
```bash
# 백엔드 상태 확인
curl http://localhost:8080/actuator/health

# 프론트엔드 상태 확인
curl http://localhost:3000
```

### 리소스 사용량
```bash
# 컨테이너 리소스 확인
docker stats

# 특정 컨테이너 확인
docker stats springboot-react-docker-chatbot-main-springboot-app-1
```

## 🔒 보안

- API 키를 절대 코드에 하드코딩하지 마세요
- .env 파일을 git에 커밋하지 마세요
- 프로덕션 환경에서는 HTTPS 사용을 권장합니다

## 🆘 지원

문제가 발생하면:
1. 로그 확인: `docker-compose -f docker-compose-html.yaml logs`
2. 설정 검증: `./verify-setup.sh`
3. 이슈 리포트 생성

---
**즐거운 AI 채팅 되세요! 🤖💬**