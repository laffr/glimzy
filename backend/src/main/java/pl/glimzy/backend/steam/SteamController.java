package pl.glimzy.backend.steam;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class SteamController {

    private final SteamApiService steamApiService;

    public SteamController(SteamApiService steamApiService) {
        this.steamApiService = steamApiService;
    }

    @GetMapping("/api/steam/player")
    public Map<String, Object> getPlayer(@RequestParam String steamId) {
        return steamApiService.getPlayerSummaries(steamId);
    }
}