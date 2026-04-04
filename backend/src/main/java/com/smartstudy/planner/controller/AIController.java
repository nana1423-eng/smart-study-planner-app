package com.smartstudy.planner.controller;

import com.smartstudy.planner.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/schedule")
    public ResponseEntity<?> generateSchedule(@RequestBody Map<String, Object> payload) {
        String studentId = (String) payload.get("studentId");
        List<Map<String, Object>> courseProgress = (List<Map<String, Object>>) payload.get("courseProgress");
        return ResponseEntity.ok(aiService.generatePersonalizedSchedule(studentId, courseProgress));
    }

    @PostMapping("/summary")
    public ResponseEntity<?> generateSummary(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(aiService.generateLessonSummary(payload.get("topic")));
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(aiService.answerQuestion(payload.get("question"), payload.get("context")));
    }
}
