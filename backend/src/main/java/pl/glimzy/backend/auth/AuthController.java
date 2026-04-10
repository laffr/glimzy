package pl.glimzy.backend.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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

        String url = "https://steamcommunity.com/openid/login" +
                "?openid.ns=http://specs.openid.net/auth/2.0" +
                "&openid.mode=checkid_setup" +
                "&openid.return_to=http://localhost:8080/auth/steam/callback" +
                "&openid.realm=http://localhost:8080/" +
                "&openid.identity=http://specs.openid.net/auth/2.0/identifier_select" +
                "&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select";

        response.sendRedirect(url);
    }

    @GetMapping("/steam/callback")
    public void steamCallback(
            HttpServletResponse response,
            @RequestParam Map<String, String> params
    ) throws IOException {

        String claimedId = params.get("openid.claimed_id");
        String steamId = claimedId.substring(claimedId.lastIndexOf("/") + 1);

        User user = userService.findOrCreate(steamId);

        String token = jwtService.generateToken(user.getSteamId());

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(15 * 60);
        cookie.setAttribute("SameSite", "Lax");

        response.addCookie(cookie);

        response.sendRedirect("http://localhost:5173/");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {

        var auth = SecurityContextHolder.getContext().getAuthentication();

        // ❌ brak auth → 401
        if (auth == null || auth.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }

        String steamId = auth.getPrincipal().toString();

        // ❌ anonimowy user → 401
        if (steamId == null || steamId.isBlank() || steamId.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        try {
            User user = userService.getBySteamId(steamId);

            // ❌ user nie istnieje → 401 (nie 500)
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 log do terminala
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Lax");

        response.addCookie(cookie);
    }
}