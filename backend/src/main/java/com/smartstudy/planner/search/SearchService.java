package com.smartstudy.planner.search;

import com.smartstudy.planner.assignment.Assignment;
import com.smartstudy.planner.assignment.AssignmentRepository;
import com.smartstudy.planner.assignment.Subtask;
import com.smartstudy.planner.assignment.SubtaskRepository;
import com.smartstudy.planner.subject.Subject;
import com.smartstudy.planner.subject.SubjectRepository;
import com.smartstudy.planner.user.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    private final SubjectRepository subjectRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubtaskRepository subtaskRepository;

    public SearchService(SubjectRepository subjectRepository, 
                         AssignmentRepository assignmentRepository, 
                         SubtaskRepository subtaskRepository) {
        this.subjectRepository = subjectRepository;
        this.assignmentRepository = assignmentRepository;
        this.subtaskRepository = subtaskRepository;
    }

    public List<SearchResultDTO> globalSearch(String query, User user) {
        List<SearchResultDTO> results = new ArrayList<>();
        if (query == null || query.trim().isEmpty()) {
            return results;
        }

        String safeQuery = query.trim();

        // 1. Search Subjects
        List<Subject> subjects = subjectRepository.searchByQueryAndUserId(safeQuery, user.getId());
        for (Subject s : subjects) {
            results.add(new SearchResultDTO(
                String.valueOf(s.getId()),
                "SUBJECT",
                s.getName(),
                s.getColor(), // Use description to hold color visual fallback
                "/subjects"
            ));
        }

        // 2. Search Assignments
        List<Assignment> assignments = assignmentRepository.searchByQueryAndUserId(safeQuery, user.getId());
        for (Assignment a : assignments) {
            String desc = a.getSubject() != null ? "Assignment • " + a.getSubject().getName() : "Assignment";
            results.add(new SearchResultDTO(
                String.valueOf(a.getId()),
                "ASSIGNMENT",
                a.getTitle(),
                desc,
                "/assignments"
            ));
        }

        // 3. Search Subtasks
        List<Subtask> subtasks = subtaskRepository.searchByQueryAndUserId(safeQuery, user.getId());
        for (Subtask st : subtasks) {
            results.add(new SearchResultDTO(
                String.valueOf(st.getId()),
                "SUBTASK",
                st.getTitle(),
                "Subtask • " + st.getAssignment().getTitle(),
                "/assignments"
            ));
        }

        // Return up to 15 results
        return results.size() > 15 ? results.subList(0, 15) : results;
    }
}
