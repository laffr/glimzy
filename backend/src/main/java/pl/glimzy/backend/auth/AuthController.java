package pl.glimzy.backend.auth;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.glimzy.backend.common.security.JwtService;
import pl.glimzy.backend.user.User;
import pl.glimzy.backend.user.UserService;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/steam/login")
    public void steamLogin(HttpServletResponse response) throws IOException {
        String redirectUrl = "https://steamcommunity.com/openid/login" +
                "?openid.ns=http://specs.openid.net/auth/2.0" +
                "&openid.mode=checkid_setup" +
                "&openid.return_to=http://localhost:8080/auth/steam/callback" +
                "&openid.realm=http://localhost:8080/" +
                "&openid.identity=http://specs.openid.net/auth/2.0/identifier_select" +
                "&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select";

        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/steam/callback")
    public void steamCallback(HttpServletResponse response,
                              @RequestParam Map<String, String> params) throws IOException {

        String claimedId = params.get("openid.claimed_id");

        if (claimedId == null) {
            throw new RuntimeException("Brak claimed_id");
        }

        String steamId = extractSteamId(claimedId);

        User user = userService.findOrCreate(steamId);

        String token = jwtService.generateToken(user.getSteamId());

        response.sendRedirect("http://localhost:5173/?token=" + token + "&steamId=" + user.getSteamId());
    }

    @GetMapping("/me")
    public User me(@org.springframework.security.core.annotation.AuthenticationPrincipal String steamId) {
        return userService.getBySteamId(steamId);
    }

    private String extractSteamId(String claimedId) {
        return claimedId.substring(claimedId.lastIndexOf("/") + 1);
    }
}