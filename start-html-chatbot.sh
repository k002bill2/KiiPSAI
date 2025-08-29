#!/bin/bash

# HTML 기반 챗봇 실행 스크립트
echo "🤖 HTML 기반 Spring AI 챗봇을 시작합니다..."

# 환경 변수 확인
if [ -f .env ]; then
    echo "📋 환경 변수 파일(.env)을 로드합니다..."
    export $(cat .env | xargs)
else
    echo "⚠️  .env 파일이 없습니다. 기본값을 사용합니다."
fi

# OpenAI API 키 확인
if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
    echo "❌ OPENAI_API_KEY가 설정되지 않았습니다."
    echo "   .env 파일에서 실제 OpenAI API 키를 설정해주세요."
    echo ""
    echo "   1. .env 파일을 열어주세요"
    echo "   2. OPENAI_API_KEY=your_actual_key_here 로 변경해주세요"
    echo "   3. 다시 실행해주세요"
    exit 1
fi

# Docker와 Docker Compose 확인
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되지 않았습니다. Docker를 먼저 설치해주세요."
    echo "   https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose가 설치되지 않았습니다. Docker Compose를 먼저 설치해주세요."
    exit 1
fi

# Docker가 실행 중인지 확인
if ! docker info &> /dev/null; then
    echo "❌ Docker가 실행되지 않았습니다. Docker를 시작해주세요."
    exit 1
fi

echo "🐳 Docker 컨테이너를 빌드하고 실행합니다..."
echo "   이 과정은 처음 실행 시 몇 분이 걸릴 수 있습니다."

# 기존 컨테이너 정리
echo "🧹 기존 컨테이너를 정리합니다..."
docker-compose -f docker-compose-html.yaml down --remove-orphans

# 컨테이너 빌드 및 실행
if docker-compose -f docker-compose-html.yaml up --build; then
    echo ""
    echo "✅ 챗봇이 성공적으로 시작되었습니다!"
    echo ""
    echo "🌐 웹 브라우저에서 다음 주소로 접속하세요:"
    echo "   http://localhost:3000"
    echo ""
    echo "🔧 백엔드 API는 다음 주소에서 실행됩니다:"
    echo "   http://localhost:8080"
    echo ""
    echo "⏹️  중지하려면 Ctrl+C를 누르세요"
else
    echo ""
    echo "❌ 챗봇 실행 중 오류가 발생했습니다."
    echo "   로그를 확인하여 문제를 해결하세요."
    exit 1
fi