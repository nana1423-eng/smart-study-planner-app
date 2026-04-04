package com.smartstudy.planner.session;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudySessionRequest {
    private Long subjectId;
    private Long assignmentId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private Long sessionId;
    private String type;
    private String status;
}
