package com.smartstudy.planner.user;
import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String fullName;
    private String email;
    private String password;
}
