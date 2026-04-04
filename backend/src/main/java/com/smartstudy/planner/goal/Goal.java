package com.smartstudy.planner.goal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartstudy.planner.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // DAILY_HOURS, WEEKLY_HOURS, SUBJECT_HOURS

    @Column(nullable = false)
    private String period; // DAILY, WEEKLY

    @Column(nullable = false)
    private Integer targetValue; // In minutes

    @Column(name = "subject_id")
    private Long subjectId; // Optional, for SUBJECT_HOURS type goals

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
