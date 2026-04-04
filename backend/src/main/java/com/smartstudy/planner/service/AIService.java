package com.smartstudy.planner.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.Duration;

@Service
public class AIService {

    @Value("${ai.api.key:YOUR_GROQ_API_KEY_HERE}")
    private String apiKey;

    // We default to Groq for lightning-fast, free inferences. 
    // You can swap this to "https://api.openai.com/v1/chat/completions" if you prefer OpenAI.
    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";
    // For Groq: "llama3-8b-8192" or "mixtral-8x7b-32768". For OpenAI: "gpt-4o-mini"
    private static final String MODEL_ID = "llama3-8b-8192";

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public AIService() {
        System.setProperty("java.net.preferIPv4Stack", "true");
        System.setProperty("https.protocols", "TLSv1.2,TLSv1.3");
        this.httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(30))
            .build();
        this.objectMapper = new ObjectMapper();
    }

    private String callAI(String prompt) {
        if (apiKey == null || apiKey.equals("YOUR_GROQ_API_KEY_HERE") || apiKey.isEmpty()) {
             return "[MOCK] You need to add ai.api.key=YOUR_KEY to application.properties to use real AI! Prompt was: " + prompt;
        }

        try {
            Map<String, Object> requestBody = Map.of(
                "model", MODEL_ID,
                "messages", List.of(
                    Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7
            );

            String jsonPayload = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .header("User-Agent", "SmartStudyPlanner/1.0")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();
            
            HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            String responseString = response.body();

            System.out.println("Groq HTTP Status: " + response.statusCode());
            
            if (responseString == null || responseString.trim().isEmpty()) {
                return "API Rejection: Groq returned an empty response. Status Code: " + response.statusCode();
            }

            JsonNode root = objectMapper.readTree(responseString);
            
            if (root == null) {
                return "API Rejection: Groq returned an empty JSON tree. Status Code: " + response.statusCode();
            }
            
            if (root.has("error")) {
                String errorMsg = root.path("error").path("message").asText();
                System.err.println("API Provider returned an error (" + response.statusCode() + "): " + errorMsg);
                return "API Rejection: " + errorMsg;
            }
            
            return root.path("choices").get(0).path("message").path("content").asText();
            
        } catch (Exception e) {
            System.err.println("CRITICAL AI Core Error: " + e.getMessage());
            e.printStackTrace();
            return "Error: Unable to connect to Atlas Intelligence Core. Exception: " + e.getMessage();
        }
    }

    public Map<String, Object> generatePersonalizedSchedule(String studentId, List<Map<String, Object>> courseProgress) {
        if (apiKey == null || apiKey.equals("YOUR_GROQ_API_KEY_HERE")) {
            return mockGeneratePersonalizedSchedule();
        }
        
        String prompt = "You are an expert study planner. Given the following course progress: " + courseProgress + ", generate a highly optimized weekly study schedule. Format the output clearly.";
        String aiResponse = callAI(prompt);
        
        return Map.of(
            "status", "success",
            "message", "Generated AI schedule successfully.",
            "rawText", aiResponse,
            "schedule", Arrays.asList(
                Map.of("day", "AI Optimized Plan", "task", aiResponse.substring(0, Math.min(200, aiResponse.length())) + "...", "duration_mins", 120)
            )
        );
    }

    private Map<String, Object> mockGeneratePersonalizedSchedule() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Generated mock schedule (Missing API Key).");
        response.put("schedule", Arrays.asList(
            Map.of("day", "Monday", "task", "Review recent lecture notes", "duration_mins", 45),
            Map.of("day", "Tuesday", "task", "Draft thesis outline", "duration_mins", 60),
            Map.of("day", "Wednesday", "task", "Complete practice quiz", "duration_mins", 30)
        ));
        return response;
    }

    public Map<String, Object> generateLessonSummary(String topic) {
        if (apiKey == null || apiKey.equals("YOUR_GROQ_API_KEY_HERE")) {
            return mockGenerateLessonSummary(topic);
        }

        String prompt = "You are a master educator. Provide a highly detailed but concise summary of the topic: '" + topic + "'. Provide the response in 3-5 clear bullet points.";
        String aiResponse = callAI(prompt);

        return Map.of(
            "topic", topic,
            "summary", "Atlas AI Summary for: " + topic,
            "bullets", Arrays.asList(aiResponse.split("\n"))
        );
    }

    private Map<String, Object> mockGenerateLessonSummary(String topic) {
        Map<String, Object> response = new HashMap<>();
        response.put("topic", topic);
        response.put("summary", "This is an AI-generated summary for " + topic + ". It breaks down the core concepts into easily digestible bullet points to save you hours of reading.");
        response.put("bullets", Arrays.asList(
            "First key concept of " + topic,
            "Major historical or mathematical foundation",
            "Common pitfalls to avoid on exams"
        ));
        return response;
    }

    public Map<String, Object> answerQuestion(String question, String context) {
        if (apiKey == null || apiKey.equals("YOUR_GROQ_API_KEY_HERE")) {
            return Map.of(
                "question", question,
                "answer", "Based on the context provided, here is your answer: The underlying principle behind your question is highly reliant on consistent study habits. (This is a mock AI response while API keys are pending)."
            );
        }

        String prompt = "You are an intelligent tutor. The student is asking: '" + question + "'. The current context is: '" + context + "'. Answer clearly and accurately.";
        String aiResponse = callAI(prompt);

        return Map.of(
            "question", question,
            "answer", aiResponse
        );
    }

    public List<String> generateSubtasks(String title, String description) {
        if (apiKey == null || apiKey.equals("YOUR_GROQ_API_KEY_HERE")) {
            return Arrays.asList("Research topic material", "Create outline structure", "Write initial draft", "Review and finalize");
        }
        String prompt = "You are an expert tutor. Please break down the following assignment into 3-5 distinct subtasks. The assignment title is: '" + title + "'. The description is: '" + description + "'. Provide ONLY the subtask titles as a simple newline-separated list without bullets, numbering, or empty lines.";
        String res = callAI(prompt);
        return Arrays.stream(res.split("\n"))
                     .map(String::trim)
                     .filter(s -> !s.isEmpty())
                     .map(s -> s.replaceFirst("^[-*]\\s*", "").replaceFirst("^\\d+\\.\\s*", "").trim())
                     .collect(java.util.stream.Collectors.toList());
    }
}
