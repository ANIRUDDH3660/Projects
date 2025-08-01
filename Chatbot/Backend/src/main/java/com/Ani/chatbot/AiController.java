package com.Ani.chatbot;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/qna")
public class AiController {

    private final QnAService qnAService;

    @PostMapping("/ask")
    public ResponseEntity<String> askQuestions(@RequestBody Map<String,String> payload){
        String que=payload.get("question");
        String ans=qnAService.getAnswer(que);
        return ResponseEntity.ok(ans);
    }
}
