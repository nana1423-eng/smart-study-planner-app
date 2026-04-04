package com.smartstudy.planner.goal;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class GoalProgressDTO {
    private Long id;
    private String type;
    private String period;
    private Integer targetValue;
    private Integer currentValue;
    private Integer completionPercentage;
    private Long subjectId;
}
