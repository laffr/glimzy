package pl.glimzy.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{steamId}")
    public User getUser(@PathVariable String steamId) {
        return userService.findOrCreate(steamId);
    }
}