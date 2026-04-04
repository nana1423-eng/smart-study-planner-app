package com.smartstudy.planner.subject;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartstudy.planner.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String color;
    
    // Low, Medium, High
    private String difficulty; 
    
    // Performance metric (0.0 to 100.0)
    private Double overallPerformance = 0.0;
}
