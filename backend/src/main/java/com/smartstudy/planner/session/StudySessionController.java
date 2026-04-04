package com.smartstudy.planner.session;

import com.smartstudy.planner.assignment.Assignment;
import com.smartstudy.planner.assignment.AssignmentRepository;
import com.smartstudy.planner.subject.Subject;
import com.smartstudy.planner.subject.SubjectRepository;
import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class StudySessionController {
    private final StudySessionRepository studySessionRepository;
    private final SubjectRepository subjectRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public StudySessionController(StudySessionRepository studySessionRepository, SubjectRepository subjectRepository, AssignmentRepository assignmentRepository, UserRepository userRepository) {
        this.studySessionRepository = studySessionRepository;
        this.subjectRepository = subjectRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @PostMapping("/start")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<StudySession> startSession(@RequestBody StudySessionRequest req, Authentication auth) {
        User user = getUser(auth);
        
        Subject subject = null;
        Long subjectId = req.getSubjectId();
        if (subjectId != null) {
            subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Subject not found"));
            if (!subject.getUser().getId().equals(user.getId())) {
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access denied to subject");
            }
        }
                
        Assignment assignment = null;
        Long assignmentId = req.getAssignmentId();
        if (assignmentId != null) {
            assignment = assignmentRepository.findById(assignmentId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Assignment not found"));
            if (!assignment.getUser().getId().equals(user.getId())) {
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access denied to assignment");
            }
        }

        StudySession session = new StudySession();
        session.setUser(user);
        session.setSubject(subject);
        session.setAssignment(assignment);
        
        session.setStartTime(req.getStartTime() != null ? req.getStartTime() : java.time.LocalDateTime.now());
        session.setType(req.getType() != null ? req.getType() : "STUDY");
        session.setStatus("IN_PROGRESS");

        StudySession saved = studySessionRepository.save(session);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/end")
    public ResponseEntity<StudySession> endSession(@RequestBody StudySessionRequest req, Authentication auth) {
        Long sessionId = req.getSessionId();
        if (sessionId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        StudySession session = studySessionRepository.findById(sessionId).orElseThrow();
        
        // Verify ownership
        if (!session.getUser().getId().equals(getUser(auth).getId())) {
            return ResponseEntity.status(403).build();
        }

        session.setEndTime(req.getEndTime() != null ? req.getEndTime() : java.time.LocalDateTime.now());
        session.setDurationMinutes(req.getDurationMinutes());
        session.setStatus("COMPLETED");

        studySessionRepository.save(session);
        
        // Reward points
        if ("STUDY".equalsIgnoreCase(session.getType()) && session.getDurationMinutes() != null && session.getDurationMinutes() > 0) {
            User user = session.getUser();
            user.setPoints(user.getPoints() + (session.getDurationMinutes() / 5));
            userRepository.save(user);
        }

        return ResponseEntity.ok(session);
    }

    @GetMapping("/history")
    public ResponseEntity<List<StudySession>> getHistory(Authentication auth) {
        User user = getUser(auth);
        List<StudySession> history = studySessionRepository.findByUserIdAndStatusOrderByStartTimeDesc(user.getId(), "COMPLETED");
        return ResponseEntity.ok(history);
    }
}
