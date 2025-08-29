package in.vikasrajput.ai.chatbot.controller;

import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class ChatController {

    private final OpenAiChatModel chatModel;

    @Autowired
    public ChatController(OpenAiChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping("/ai/chat")
    public Flux<ChatResponse> generateStream(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
        Prompt prompt = new Prompt(new UserMessage(message));


        return chatModel.stream(prompt);
    }

    @GetMapping("/ai/chat/string")
    public Flux<String> generateString(@RequestParam(value = "message", defaultValue = "농담을 해주세요") String message) {
        // Spring AI를 통한 한국어 대화 처리
        try {
            // 한국어 컨텍스트를 포함한 프롬프트 생성
            String koreanPrompt = "당신은 친근하고 도움이 되는 한국어 AI 어시스턴트입니다. " +
                                "사용자의 질문에 정확하고 유용한 답변을 한국어로 제공해주세요. " +
                                "질문: " + message;
            
            Prompt prompt = new Prompt(new UserMessage(koreanPrompt));
            return chatModel.stream(prompt)
                    .map(response -> {
                        if (response.getResult() != null && response.getResult().getOutput() != null) {
                            return response.getResult().getOutput().getContent();
                        }
                        return "죄송합니다. 응답을 생성하는데 문제가 발생했습니다.";
                    })
                    .onErrorReturn("죄송합니다. AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } catch (Exception e) {
            // 예외 발생 시 한국어 오류 메시지 반환
            return Flux.just("죄송합니다. 현재 AI 서비스를 사용할 수 없습니다. 관리자에게 문의해주세요.");
        }
    }
}