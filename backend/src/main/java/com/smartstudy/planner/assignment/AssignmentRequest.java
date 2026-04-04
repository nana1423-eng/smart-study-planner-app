package com.smartstudy.planner.assignment;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AssignmentRequest {
    private Long subjectId;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private String priority;
    private Integer difficulty;
    private String weight;
}
