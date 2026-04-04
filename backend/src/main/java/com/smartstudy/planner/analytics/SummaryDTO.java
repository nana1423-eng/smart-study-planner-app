package com.smartstudy.planner.analytics;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class SummaryDTO {
    private double totalHours;
    private int totalSessions;
    private int completionRate; // percentage
    private int points;
    private int streak;
}
