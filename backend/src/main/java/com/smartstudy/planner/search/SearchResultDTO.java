package com.smartstudy.planner.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDTO {
    private String id;
    private String type; // "SUBJECT", "ASSIGNMENT", "SUBTASK"
    private String title;
    private String description;
    private String url;
}
