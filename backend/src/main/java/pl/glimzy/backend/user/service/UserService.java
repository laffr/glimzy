package pl.glimzy.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.glimzy.backend.user.model.User;
import pl.glimzy.backend.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getBySteamId(String steamId) {
        return userRepository.findBySteamId(steamId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findOrCreate(String steamId) {
        return userRepository.findBySteamId(steamId)
                .orElseGet(() ->
                        userRepository.save(
                              User.builder()
                                      .steamId(steamId)
                                      .build()
                        )
                );
    }
}