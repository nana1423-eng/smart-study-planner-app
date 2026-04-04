package com.smartstudy.planner.analytics;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class WeeklyTrendDTO {
    private String date;
    private double studyHours;
}
