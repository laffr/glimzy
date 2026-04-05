package pl.glimzy.backend.common.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET = "gF7$9d!pQx2@vL8rZ4^uT1wS6&bN0kY3";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String steamId) {
        return Jwts.builder()
                .setSubject(steamId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractSteamId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}