package com.smartstudy.planner.analytics;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class SubjectStatsDTO {
    private String subjectName;
    private double studyHours;
}
