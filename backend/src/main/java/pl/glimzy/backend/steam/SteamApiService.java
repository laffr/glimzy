package pl.glimzy.backend.steam;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class SteamApiService {

    @Value("${steam.api.key}")
    private String apiKey;

    @Value("${steam.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getPlayerSummaries(String steamId) {
        String url = UriComponentsBuilder
                .fromHttpUrl(apiUrl + "/ISteamUser/GetPlayerSummaries/v2/")
                .queryParam("key", apiKey)
                .queryParam("steamids", steamId)
                .toUriString();

        return restTemplate.getForObject(url, Map.class);
    }
}