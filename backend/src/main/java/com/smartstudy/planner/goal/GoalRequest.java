package com.smartstudy.planner.goal;

import lombok.Data;

@Data
public class GoalRequest {
    private String type;
    private String period;
    private Integer targetValue; // minutes
    private Long subjectId;
}
