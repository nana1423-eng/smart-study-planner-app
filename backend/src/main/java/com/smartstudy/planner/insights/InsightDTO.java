package com.smartstudy.planner.insights;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InsightDTO {
    private String title;
    private String description;
    private String type;     // POSITIVE, WARNING, NEUTRAL, INFO
    private String iconType; // TREND_UP, TREND_DOWN, TIME, CALENDAR, ALERT
}
