// DOM 요소들
const chatbox = document.getElementById('chatbox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loadingIndicator');

// 메시지 배열
let messages = [];

// API 엔드포인트 설정
const API_BASE_URL = 'http://localhost:8080';

// Markdown 설정 및 파서 초기화
function initializeMarkdownParser() {
    if (typeof marked !== 'undefined') {
        // Marked.js 설정
        marked.setOptions({
            breaks: true, // 줄바꿈을 <br>로 변환
            gfm: true, // GitHub Flavored Markdown 활성화
            sanitize: false, // HTML 태그 허용 (보안상 주의 필요)
            highlight: function(code, language) {
                // 코드 하이라이팅 설정
                if (typeof hljs !== 'undefined' && language && hljs.getLanguage(language)) {
                    try {
                        return hljs.highlight(code, {language: language}).value;
                    } catch (e) {
                        console.warn('Highlight.js error:', e);
                    }
                }
                return code;
            }
        });
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // Markdown 파서 초기화
    initializeMarkdownParser();
    
    // 스크롤 향상 기능 초기화
    initializeScrollEnhancements();
    
    // Focus 효과 초기화
    initializeFocusEffects();
    
    // Auto-resize 기능 초기화
    initializeAutoResize();
    
    messageInput.focus();
    
    // 이벤트 리스너 등록
    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift+Enter: 줄바꿈 허용 (기본 동작)
                return;
            } else {
                // Enter만: 메시지 전송
                e.preventDefault();
                handleSendMessage();
            }
        }
    });
});

// Focus 효과 초기화 및 향상
function initializeFocusEffects() {
    if (!messageInput) return;
    
    let focusTimeout;
    let isTyping = false;
    
    // Focus 이벤트 - 입력창이 활성화될 때
    messageInput.addEventListener('focus', function() {
        this.classList.add('input-focused');
        clearTimeout(focusTimeout);
        
        // 부드러운 커서 깜빡임 효과
        setTimeout(() => {
            this.style.caretColor = '#667eea';
        }, 100);
    });
    
    // Blur 이벤트 - 입력창이 비활성화될 때
    messageInput.addEventListener('blur', function() {
        this.classList.remove('input-focused');
        this.style.caretColor = 'auto';
        
        // 부드러운 페이드아웃 효과
        focusTimeout = setTimeout(() => {
            this.classList.remove('typing-active');
        }, 200);
    });
    
    // Input 이벤트 - 타이핑할 때
    messageInput.addEventListener('input', function() {
        isTyping = this.value.length > 0;
        
        if (isTyping) {
            this.classList.add('typing-active');
            clearTimeout(focusTimeout);
        } else {
            this.classList.remove('typing-active');
        }
        
        // 실시간 문자 수 피드백 (선택사항)
        updateCharacterCount(this.value.length);
    });
    
    // 키 입력 시 추가 효과
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Enter만 눌렀을 때 전송 시 살짝 펄스 효과
            this.classList.add('sending-pulse');
            setTimeout(() => {
                this.classList.remove('sending-pulse');
            }, 300);
        }
    });
}

// 문자 수 업데이트 함수 (선택사항)
function updateCharacterCount(count) {
    const maxLength = 500;
    const percentage = (count / maxLength) * 100;
    
    // 입력창의 border 색상을 문자 수에 따라 변경
    if (percentage > 90) {
        messageInput.style.borderColor = '#dc3545'; // 위험 (빨강)
    } else if (percentage > 75) {
        messageInput.style.borderColor = '#ffc107'; // 경고 (노랑)
    } else if (messageInput === document.activeElement) {
        messageInput.style.borderColor = '#667eea'; // 정상 (파랑)
    }
}

// messageInput 높이를 최소 크기로 리셋하는 함수
function resetMessageInputHeight() {
    const minHeight = 21; // CSS min-height와 동일
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.max(messageInput.scrollHeight, minHeight + 24) + 'px'; // 24px는 padding
    messageInput.style.overflowY = 'hidden';
}

// Auto-resize 기능 초기화
function initializeAutoResize() {
    if (!messageInput) return;
    
    // 초기 높이 설정
    messageInput.style.height = 'auto';
    const initialHeight = messageInput.scrollHeight;
    messageInput.style.height = initialHeight + 'px';
    
    // 자동 크기 조정 함수
    function autoResize() {
        // 높이를 초기화하여 정확한 scrollHeight 계산
        messageInput.style.height = 'auto';
        
        const scrollHeight = messageInput.scrollHeight;
        const maxHeight = 200; // CSS max-height와 동일
        const minHeight = 21; // CSS min-height와 동일 (실제로는 padding 포함하여 더 큼)
        
        // 높이 설정 (최대 높이 제한)
        if (scrollHeight <= maxHeight) {
            messageInput.style.height = Math.max(scrollHeight, minHeight + 24) + 'px'; // 24px는 padding
            messageInput.style.overflowY = 'hidden';
        } else {
            messageInput.style.height = maxHeight + 'px';
            messageInput.style.overflowY = 'auto';
        }
    }
    
    // 입력 이벤트에 auto-resize 연결
    messageInput.addEventListener('input', autoResize);
    
    // 키 이벤트에도 연결 (Enter, Backspace 등)
    messageInput.addEventListener('keydown', function(e) {
        // Enter 키 처리 (Shift+Enter는 줄바꿈, Enter만은 전송)
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift+Enter: 줄바꿈이므로 크기 조정
                setTimeout(autoResize, 10);
            } else {
                // Enter만: 메시지 전송 시 높이 초기화
                setTimeout(() => {
                    messageInput.style.height = 'auto';
                    messageInput.style.height = Math.max(messageInput.scrollHeight, minHeight + 24) + 'px';
                    messageInput.style.overflowY = 'hidden';
                }, 10);
            }
        } else {
            // 다른 키 입력 시 약간의 지연 후 크기 조정
            setTimeout(autoResize, 10);
        }
    });
    
    // paste 이벤트에도 연결
    messageInput.addEventListener('paste', function() {
        setTimeout(autoResize, 10);
    });
    
    // 초기 크기 설정
    autoResize();
}

// 메시지 전송 처리
async function handleSendMessage() {
    const message = messageInput.value.trim();
    
    if (message === '') {
        return;
    }
    
    if (message.length > 500) {
        showError('메시지가 너무 깁니다. 500자 이하로 입력해주세요.');
        return;
    }
    
    // UI 업데이트
    addMessage(message, 'user');
    messageInput.value = '';
    
    // messageInput 높이를 최소 크기로 즉시 변경
    resetMessageInputHeight();
    
    showLoading(true);
    
    try {
        // 스트리밍 상태 시작 - 스크롤바 표시
        isStreaming = true;
        chatbox.classList.add('streaming');
        chatbox.classList.remove('fade-out');
        
        // API 호출
        const response = await sendMessageToAPI(message);
        addMessage(response, 'ai');
        
        // 스트리밍 완료 후 처리
        isStreaming = false;
        chatbox.classList.remove('streaming');
        
        // 2초 후 스크롤바 fade out (사용자가 읽을 시간 제공)
        setTimeout(() => {
            if (!isHovering && !isScrolling) {
                chatbox.classList.add('fade-out');
            }
        }, 2000);
        
    } catch (error) {
        // 에러 발생 시 스트리밍 상태 종료
        isStreaming = false;
        chatbox.classList.remove('streaming');
        console.error('API 호출 오류:', error);
        addMessage('죄송합니다. 서버와의 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 'ai', 'error-message');
        
        // 에러 후에도 적절한 시간 후 fade out
        setTimeout(() => {
            if (!isHovering && !isScrolling) {
                chatbox.classList.add('fade-out');
            }
        }, 3000);
    } finally {
        showLoading(false);
    }
}

// API 호출 함수
async function sendMessageToAPI(message) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃
    
    try {
        const encodedMessage = encodeURIComponent(message);
        const response = await fetch(`${API_BASE_URL}/ai/chat/string?message=${encodedMessage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain',
                'Accept': 'text/plain'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('API 엔드포인트를 찾을 수 없습니다.');
            } else if (response.status === 500) {
                throw new Error('서버 내부 오류가 발생했습니다.');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }
        
        const responseData = await response.text();
        return responseData || '응답을 받지 못했습니다.';
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('요청 시간이 초과되었습니다.');
        } else if (error instanceof TypeError) {
            throw new Error('네트워크 연결을 확인해주세요.');
        } else {
            throw error;
        }
    }
}

// 마크다운을 HTML로 변환하는 함수
function parseMarkdown(text) {
    if (typeof marked !== 'undefined') {
        try {
            const html = marked.parse(text);
            return html;
        } catch (e) {
            console.warn('Markdown parsing error:', e);
            return text;
        }
    }
    // marked.js가 로드되지 않은 경우 기본 처리
    return text.replace(/\n/g, '<br>');
}

// 코드 하이라이팅을 적용하는 함수
function applyCodeHighlighting(element) {
    if (typeof hljs !== 'undefined') {
        const codeBlocks = element.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            hljs.highlightElement(block);
        });
    }
}

// 메시지 추가 함수 (마크다운 지원)
function addMessage(text, sender, className = '') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-container ${sender}`;
    
    // 아바타 이미지
    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.alt = `${sender} avatar`;
    
    if (sender === 'user') {
        avatar.src = 'images/user-icon.png';
    } else {
        avatar.src = 'images/ai-assistant.png';
    }
    
    // 메시지 버블
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender} ${className}`;
    
    // AI 메시지인 경우 마크다운 파싱, 사용자 메시지인 경우 텍스트 그대로
    if (sender === 'ai') {
        const htmlContent = parseMarkdown(text);
        messageDiv.innerHTML = htmlContent;
        
        // 코드 하이라이팅 적용
        applyCodeHighlighting(messageDiv);
    } else {
        // 사용자 메시지는 텍스트 그대로 (보안상 안전)
        // 작성자 아이콘 추가
        const authorIcon = document.createElement('img');
        authorIcon.className = 'author-icon';
        authorIcon.src = 'images/user-circle.png';
        authorIcon.alt = 'User';
        
        messageDiv.appendChild(authorIcon);
        
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        messageDiv.appendChild(textSpan);
    }
    
    // DOM에 추가
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageDiv);
    
    // 환영 메시지 이후에 추가
    const welcomeMessage = chatbox.querySelector('.welcome-message');
    if (welcomeMessage && messages.length === 0) {
        chatbox.insertBefore(messageContainer, welcomeMessage.nextSibling);
    } else {
        chatbox.appendChild(messageContainer);
    }
    
    // 메시지 배열에 저장
    messages.push({ text, sender, timestamp: new Date() });
    
    // Update scrollbar geometry and scroll to bottom
    setTimeout(() => {
        updateScrollbar();
        scrollToBottom();
    }, 50);
}

// 로딩 타이머 변수
let loadingStartTime = null;
let loadingTimer = null;

// 로딩 표시 함수
function showLoading(show) {
    if (show) {
        loadingIndicator.style.display = 'block';
        sendButton.disabled = true;
        messageInput.disabled = true;
        
        // 타이머 시작
        loadingStartTime = Date.now();
        updateLoadingTimer();
        loadingTimer = setInterval(updateLoadingTimer, 100); // 0.1초마다 업데이트
    } else {
        loadingIndicator.style.display = 'none';
        sendButton.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
        
        // 타이머 정리
        if (loadingTimer) {
            clearInterval(loadingTimer);
            loadingTimer = null;
        }
        loadingStartTime = null;
    }
}

// 로딩 시간 업데이트 함수
function updateLoadingTimer() {
    if (loadingStartTime) {
        const elapsed = (Date.now() - loadingStartTime) / 1000;
        const timerElement = document.getElementById('loadingTimer');
        if (timerElement) {
            timerElement.textContent = elapsed.toFixed(1);
        }
    }
}

// Fade 효과 스크롤바 기능 및 스크롤 향상
function initializeScrollEnhancements() {
    if (!chatbox) return;
    
    let scrollTimeout;
    let fadeTimeout;
    let isHovering = false;
    let isScrolling = false;
    
    // Fade in 효과 함수
    function fadeInScrollbar() {
        chatbox.classList.remove('fade-out');
        chatbox.classList.add('scrolling');
    }
    
    // Fade out 효과 함수
    function fadeOutScrollbar() {
        if (!isHovering && !isScrolling && !isStreaming) {
            chatbox.classList.remove('scrolling', 'streaming');
            chatbox.classList.add('fade-out');
        }
    }
    
    // 스트리밍 상태 변수
    let isStreaming = false;
    
    // 스크롤 시 fade in 및 자동 fade out
    chatbox.addEventListener('scroll', () => {
        isScrolling = true;
        fadeInScrollbar();
        
        // 기존 타이머 클리어
        clearTimeout(scrollTimeout);
        clearTimeout(fadeTimeout);
        
        // 스크롤이 멈춘 후 1.5초 뒤에 fade out
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            
            // fade out 전에 0.5초 대기
            fadeTimeout = setTimeout(() => {
                fadeOutScrollbar();
            }, 500);
        }, 1500);
    });
    
    // 마우스 진입 시 fade in
    chatbox.addEventListener('mouseenter', () => {
        isHovering = true;
        fadeInScrollbar();
        clearTimeout(fadeTimeout);
    });
    
    // 마우스 떠날 때 fade out (부드러운 딜레이)
    chatbox.addEventListener('mouseleave', () => {
        isHovering = false;
        
        // 스크롤 중이 아닐 때만 fade out
        if (!isScrolling) {
            fadeTimeout = setTimeout(() => {
                fadeOutScrollbar();
            }, 800); // 0.8초 후 fade out
        }
    });
    
    // 터치 디바이스 지원
    let touchScrolling = false;
    chatbox.addEventListener('touchstart', () => {
        touchScrolling = true;
        isScrolling = true;
        fadeInScrollbar();
    });
    
    chatbox.addEventListener('touchend', () => {
        if (touchScrolling) {
            setTimeout(() => {
                isScrolling = false;
                touchScrolling = false;
                
                fadeTimeout = setTimeout(() => {
                    fadeOutScrollbar();
                }, 1200);
            }, 1000);
        }
    });
    
    // 부드러운 마우스 휠 스크롤
    chatbox.addEventListener('wheel', (e) => {
        // 스크롤바 즉시 fade in
        isScrolling = true;
        fadeInScrollbar();
        clearTimeout(scrollTimeout);
        clearTimeout(fadeTimeout);
        
        // 작은 휠 움직임에 대해서만 부드럽게 처리
        if (Math.abs(e.deltaY) < 50) {
            e.preventDefault();
            const scrollSpeed = e.deltaY * 1.5;
            chatbox.scrollBy({
                top: scrollSpeed,
                behavior: 'smooth'
            });
        }
        
        // 휠 스크롤 완료 후 fade out
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            if (!isHovering) {
                fadeTimeout = setTimeout(() => {
                    fadeOutScrollbar();
                }, 600);
            }
        }, 1200);
    }, { passive: false });
    
    // 키보드 스크롤 지원
    chatbox.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
            isScrolling = true;
            fadeInScrollbar();
            clearTimeout(scrollTimeout);
            clearTimeout(fadeTimeout);
            
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                fadeTimeout = setTimeout(() => {
                    fadeOutScrollbar();
                }, 1000);
            }, 1000);
        }
    });
    
    // 초기 상태를 fade out으로 설정
    setTimeout(() => {
        chatbox.classList.add('fade-out');
    }, 100);
}

// 부드러운 스크롤 함수
function scrollToBottom() {
    setTimeout(() => {
        const targetScroll = chatbox.scrollHeight - chatbox.clientHeight;
        const currentScroll = chatbox.scrollTop;
        const distance = Math.abs(targetScroll - currentScroll);
        
        if (distance < 50) {
            // 짧은 거리는 즉시 스크롤
            chatbox.scrollTop = targetScroll;
        } else {
            // 긴 거리는 부드럽게 스크롤
            chatbox.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        }
        
        // 스크롤 중 표시
        chatbox.classList.add('scrolling');
        setTimeout(() => {
            chatbox.classList.remove('scrolling');
        }, 1000);
    }, 100);
}

// 스크롤바 업데이트 (호환성을 위해 유지)
function updateScrollbar() {
    // 네이티브 스크롤바는 자동으로 업데이트됨
    // 필요시 여기에 추가 로직 구현 가능
}

// 에러 메시지 표시
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid #f5c6cb;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease-in;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// 연결 상태 확인
async function checkConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/actuator/health`, {
            method: 'GET',
            timeout: 5000
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
    // 필요한 정리 작업이 있다면 여기에 추가
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);