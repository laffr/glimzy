package pl.glimzy.backend.auth.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pl.glimzy.backend.auth.service.JwtService;
import pl.glimzy.backend.user.model.User;
import pl.glimzy.backend.user.service.UserService;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/steam/login")
    public void steamLogin(
            HttpServletResponse response,
            @RequestParam(required = false) String returnUrl
    ) throws IOException {

        String callback =
                "http://localhost:8080/auth/steam/callback";

        String finalCallback = callback;

        if (returnUrl != null && !returnUrl.isBlank()) {

            finalCallback +=
                    "?returnUrl=" +
                            URLEncoder.encode(
                                    returnUrl,
                                    StandardCharsets.UTF_8
                            );
        }

        String encodedReturnTo =
                URLEncoder.encode(
                        finalCallback,
                        StandardCharsets.UTF_8
                );

        String url =
                "https://steamcommunity.com/openid/login" +
                        "?openid.ns=http://specs.openid.net/auth/2.0" +
                        "&openid.mode=checkid_setup" +
                        "&openid.return_to=" + encodedReturnTo +
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

        System.out.println("STEAM CALLBACK PARAMS:");
        System.out.println(params);

        String claimedId = params.get("openid.claimed_id");

        if (claimedId == null || claimedId.isBlank()) {
            response.sendError(400, "No claimed_id");
            return;
        }

        String steamId =
                claimedId.substring(
                        claimedId.lastIndexOf("/") + 1
                );

        User user = userService.findOrCreate(steamId);

        String token =
                jwtService.generateToken(user.getSteamId());

        Cookie cookie = new Cookie("token", token);

        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(15 * 60);
        cookie.setAttribute("SameSite", "Lax");

        response.addCookie(cookie);

        String returnUrl = params.get("returnUrl");

        if (returnUrl == null || returnUrl.isBlank()) {
            returnUrl = "http://localhost:5173/";
        }

        response.sendRedirect(returnUrl);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {

        var auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }

        String steamId = auth.getPrincipal().toString();

        if (
                steamId.equals("anonymousUser") ||
                        steamId.isBlank()
        ) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.getBySteamId(steamId);

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(user);
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