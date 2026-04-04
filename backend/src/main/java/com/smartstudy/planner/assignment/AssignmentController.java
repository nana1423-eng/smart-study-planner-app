package com.smartstudy.planner.assignment;

import com.smartstudy.planner.subject.Subject;
import com.smartstudy.planner.subject.SubjectRepository;
import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    private final AssignmentRepository assignmentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public AssignmentController(AssignmentRepository assignmentRepository, SubjectRepository subjectRepository, UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName()).orElseThrow();
    }

    @GetMapping
    public List<Assignment> getAssignments(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return assignmentRepository.findByUserId(user.getId());
    }

    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody AssignmentRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Long subjectId = request.getSubjectId();
        if (subjectId == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Subject ID is required");
        }

        Subject subject = subjectRepository.findById(subjectId)
                .filter(s -> s.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Subject not found or access denied"));

        Assignment assignment = new Assignment();
        assignment.setUser(user);
        assignment.setSubject(subject);
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDeadline(request.getDeadline());
        assignment.setPriority(request.getPriority());
        assignment.setDifficulty(request.getDifficulty());
        assignment.setWeight(request.getWeight());
        assignment.setStatus("PENDING");

        assignmentRepository.save(assignment);
        return ResponseEntity.ok(assignment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (id == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Assignment ID is required");
        }
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Assignment not found"));
        if (!assignment.getUser().getId().equals(user.getId())) {
             throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access denied");
        }
        assignmentRepository.delete(assignment);
        return ResponseEntity.noContent().build();
    }
 
    @PutMapping("/{id}/complete")
    public ResponseEntity<Assignment> completeAssignment(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (id == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Assignment ID is required");
        }
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Assignment not found"));
        if (!assignment.getUser().getId().equals(user.getId())) {
             throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access denied");
        }
        assignment.setStatus("COMPLETED");
        Assignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.ok(saved);
    }
}
