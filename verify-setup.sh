#!/bin/bash

echo "🔍 HTML 기반 챗봇 설정을 검증합니다..."

# 필수 파일 확인
echo "📁 필수 파일 확인 중..."

required_files=(
    "html-chatbot-ui/index.html"
    "html-chatbot-ui/styles.css"
    "html-chatbot-ui/script.js"
    "html-chatbot-ui/Dockerfile"
    "html-chatbot-ui/nginx.conf"
    "spring-boot-ai-chatbot/Dockerfile"
    "docker-compose-html.yaml"
    ".env"
    "start-html-chatbot.sh"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ 다음 필수 파일이 없습니다:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
else
    echo "✅ 모든 필수 파일이 존재합니다."
fi

# 이미지 파일 확인
echo "🖼️  이미지 파일 확인 중..."
if [ -d "html-chatbot-ui/images" ] && [ "$(ls -A html-chatbot-ui/images)" ]; then
    echo "✅ 이미지 파일들이 준비되었습니다."
else
    echo "⚠️  이미지 파일이 없을 수 있습니다. 필요하다면 chatbot-ui/public/에서 복사하세요."
fi

# Docker 확인
echo "🐳 Docker 환경 확인 중..."
if command -v docker &> /dev/null; then
    echo "✅ Docker가 설치되어 있습니다: $(docker --version)"
else
    echo "❌ Docker가 설치되지 않았습니다."
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose가 설치되어 있습니다: $(docker-compose --version)"
else
    echo "❌ Docker Compose가 설치되지 않았습니다."
    exit 1
fi

# Docker Compose 파일 검증
echo "📋 Docker Compose 설정 검증 중..."
if docker-compose -f docker-compose-html.yaml config --quiet; then
    echo "✅ Docker Compose 설정이 유효합니다."
else
    echo "❌ Docker Compose 설정에 오류가 있습니다."
    exit 1
fi

# 환경 변수 확인
echo "🔧 환경 변수 확인 중..."
if [ -f .env ]; then
    source .env
    if [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
        echo "⚠️  OPENAI_API_KEY가 기본값으로 설정되어 있습니다."
        echo "   실제 OpenAI API 키를 .env 파일에 설정해주세요."
    else
        echo "✅ OPENAI_API_KEY가 설정되어 있습니다."
    fi
else
    echo "❌ .env 파일이 없습니다."
    exit 1
fi

echo ""
echo "🎉 설정 검증이 완료되었습니다!"
echo ""
echo "📝 다음 단계:"
echo "   1. .env 파일에서 OPENAI_API_KEY를 실제 키로 변경하세요"
echo "   2. ./start-html-chatbot.sh 를 실행하여 챗봇을 시작하세요"
echo "   3. 브라우저에서 http://localhost:3000 으로 접속하세요"
echo ""
echo "🔗 유용한 명령어:"
echo "   - 실행: ./start-html-chatbot.sh"
echo "   - 중지: docker-compose -f docker-compose-html.yaml down"
echo "   - 로그 확인: docker-compose -f docker-compose-html.yaml logs"