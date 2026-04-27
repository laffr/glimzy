package pl.glimzy.backend.steam.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SteamApiService {

    @Value("${steam.api.key}")
    private String apiKey;

    @Value("${steam.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public Map<String, Object> getPlayerSummaries(String steamId) {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl(apiUrl + "/ISteamUser/GetPlayerSummaries/v2/")
                    .queryParam("key", apiKey)
                    .queryParam("steamids", steamId)
                    .toUriString();

            log.info("Calling Steam API for steamId={}", steamId);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );

            return response.getBody();

        } catch (Exception e) {
            log.error("Error calling Steam API for steamId={}", steamId, e);
            throw new RuntimeException("Steam API error", e);
        }
    }
}