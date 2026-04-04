package test;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
class JwtResponse {
    private String token;
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String role;
    private boolean isEmailVerified;
}

public class Main {
    public static void main(String[] args) throws Exception {
        JwtResponse res = new JwtResponse("token", 1L, "user", "Full", "email", "ROLE", true);
        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writeValueAsString(res));
    }
}
