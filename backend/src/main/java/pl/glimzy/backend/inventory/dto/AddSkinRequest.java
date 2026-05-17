package pl.glimzy.backend.inventory.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddSkinRequest {
    private Long userId;
    private Long skinId;
}
