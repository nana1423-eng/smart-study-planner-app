package com.smartstudy.planner.user;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String role;
    private boolean emailVerified;
}
