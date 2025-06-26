package com.Ani.chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Objects;

@Service
public class QnAService {

    //Access to APIKey and Url[Gemini]
    @Value("${gemini.api.url}")
    private String geminiApi;

    @Value("${gemini.api.key}")
    private String geminiKey;


    private  final WebClient webClient;

    public QnAService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    //construct the request payload
        public String getAnswer(String question) {
            // Construct the request payload
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[] {
                            Map.of("parts", new Object[] {
                                    Map.of("text", question)
                            } )
                    }
            );

//        {
//            "contents": [{
//            "parts":[{"text": "what is computer?"}]
//        }]
//        }

        // make API CAll
String response =webClient.post()
        .uri(geminiApi+geminiKey)
        .header("Content-Type","application/json")
        .bodyValue(requestBody)
        .retrieve()
        .bodyToMono(String.class)
        .block();

        // Return Response

        return response;
    }
}
