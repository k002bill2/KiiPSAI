// DOM 요소들
const chatbox = document.getElementById('chatbox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loadingIndicator');

// 메시지 배열
let messages = [];

// API 엔드포인트 설정
const API_BASE_URL = 'http://localhost:8080';

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    messageInput.focus();
    
    // 이벤트 리스너 등록
    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
});

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
    showLoading(true);
    
    try {
        // API 호출
        const response = await sendMessageToAPI(message);
        addMessage(response, 'ai');
    } catch (error) {
        console.error('API 호출 오류:', error);
        addMessage('죄송합니다. 서버와의 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 'ai', 'error-message');
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
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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

// 메시지 추가 함수
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
    messageDiv.textContent = text;
    
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
    
    // 스크롤을 맨 아래로
    scrollToBottom();
}

// 로딩 표시 함수
function showLoading(show) {
    if (show) {
        loadingIndicator.style.display = 'block';
        sendButton.disabled = true;
        messageInput.disabled = true;
        scrollToBottom();
    } else {
        loadingIndicator.style.display = 'none';
        sendButton.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}

// 스크롤을 맨 아래로 이동
function scrollToBottom() {
    setTimeout(() => {
        chatbox.scrollTop = chatbox.scrollHeight;
    }, 100);
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