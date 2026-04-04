package com.smartstudy.planner.subject;

import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.smartstudy.planner.assignment.AssignmentRepository;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;

    public SubjectController(SubjectRepository subjectRepository, UserRepository userRepository, AssignmentRepository assignmentRepository) {
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName()).orElseThrow();
    }

    @GetMapping
    public List<Subject> getSubjects(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return subjectRepository.findByUserId(user.getId());
    }

    @PostMapping
    public ResponseEntity<?> createSubject(@RequestBody SubjectRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Subject subject = new Subject();
        subject.setUser(user);
        subject.setName(request.getName());
        subject.setColor(request.getColor());
        subject.setDifficulty(request.getDifficulty());
        subjectRepository.save(subject);
        return ResponseEntity.ok(subject);
    }

    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (id == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Subject ID is required");
        }
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Subject not found"));
        
        if (!subject.getUser().getId().equals(user.getId())) {
             throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access denied");
        }
        
        assignmentRepository.deleteBySubjectId(id);
        subjectRepository.delete(subject);
        return ResponseEntity.noContent().build();
    }
}
