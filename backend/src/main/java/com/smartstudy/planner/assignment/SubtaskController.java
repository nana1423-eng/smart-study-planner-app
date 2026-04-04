package com.smartstudy.planner.assignment;

import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assignments/{assignmentId}/subtasks")
public class SubtaskController {
    private final SubtaskRepository subtaskRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final com.smartstudy.planner.service.AIService aiService;

    public SubtaskController(SubtaskRepository subtaskRepository, AssignmentRepository assignmentRepository, UserRepository userRepository, com.smartstudy.planner.service.AIService aiService) {
        this.subtaskRepository = subtaskRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
    }

    private Assignment getAssignmentIfOwner(Long assignmentId, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "User not found"));
        if (assignmentId == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Assignment ID is required");
        }
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Assignment not found"));
        if (!assignment.getUser().getId().equals(user.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access denied");
        }
        return assignment;
    }

    @GetMapping
    public List<Subtask> getSubtasks(@PathVariable Long assignmentId, Authentication authentication) {
        getAssignmentIfOwner(assignmentId, authentication);
        return subtaskRepository.findByAssignmentIdOrderByOrderIndexAsc(assignmentId);
    }

    @PostMapping("/generate")
    public List<Subtask> generateSubtasks(@PathVariable Long assignmentId, Authentication authentication) {
        Assignment assignment = getAssignmentIfOwner(assignmentId, authentication);
        
        List<Subtask> existing = subtaskRepository.findByAssignmentIdOrderByOrderIndexAsc(assignmentId);
        if(!existing.isEmpty()) return existing; // Only generate if empty
        
        List<String> aiTasks = aiService.generateSubtasks(assignment.getTitle(), assignment.getDescription());
        for (int i=0; i<aiTasks.size(); i++) {
            Subtask st = new Subtask();
            st.setAssignment(assignment);
            st.setTitle(aiTasks.get(i));
            st.setOrderIndex(i);
            subtaskRepository.save(st);
        }
        return subtaskRepository.findByAssignmentIdOrderByOrderIndexAsc(assignmentId);
    }

    @PutMapping("/{subtaskId}/toggle")
    public Subtask toggleSubtask(@PathVariable Long assignmentId, @PathVariable Long subtaskId, Authentication authentication) {
        getAssignmentIfOwner(assignmentId, authentication);
        if (subtaskId == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Subtask ID is required");
        }
        Subtask st = subtaskRepository.findById(subtaskId).orElseThrow();
        st.setStatus("COMPLETED".equals(st.getStatus()) ? "PENDING" : "COMPLETED");
        return subtaskRepository.save(st);
    }
}
