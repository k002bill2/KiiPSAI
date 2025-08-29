# HTML 기반 챗봇 UI를 위한 Nginx 설정
FROM nginx:alpine

# 작업 디렉토리 생성
WORKDIR /usr/share/nginx/html

# 기본 nginx 파일 제거
RUN rm -rf /usr/share/nginx/html/*

# HTML, CSS, JS, 이미지 파일 복사
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx 실행 (포트 80)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]