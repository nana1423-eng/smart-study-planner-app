package com.smartstudy.planner.scheduler;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartstudy.planner.assignment.Assignment;
import com.smartstudy.planner.subject.Subject;
import com.smartstudy.planner.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "scheduled_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    @Column
    private java.time.LocalTime startTime;

    @Column
    private java.time.LocalTime endTime;

    // PENDING, COMPLETED, MISSED
    @Column(nullable = false)
    private String status = "PENDING";
}
