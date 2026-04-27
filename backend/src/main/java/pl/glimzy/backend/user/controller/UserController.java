package pl.glimzy.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.glimzy.backend.user.service.UserService;
import pl.glimzy.backend.user.model.User;

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