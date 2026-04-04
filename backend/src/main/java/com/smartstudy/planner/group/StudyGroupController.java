package com.smartstudy.planner.group;

import com.smartstudy.planner.user.User;
import com.smartstudy.planner.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class StudyGroupController {
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;

    public StudyGroupController(StudyGroupRepository gr, UserRepository ur) {
        this.studyGroupRepository = gr;
        this.userRepository = ur;
    }

    @GetMapping
    public List<StudyGroup> getGroups(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        return studyGroupRepository.findByMembersId(user.getId());
    }

    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody StudyGroup req, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        req.setCreatedBy(user);
        req.getMembers().add(user);
        studyGroupRepository.save(req);
        return ResponseEntity.ok(req);
    }
}
