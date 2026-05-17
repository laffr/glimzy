package pl.glimzy.backend.inventory.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.glimzy.backend.inventory.model.Inventory;
import pl.glimzy.backend.inventory.repository.InventoryRepository;
import pl.glimzy.backend.skins.model.Skin;
import pl.glimzy.backend.skins.repository.SkinRepository;
import pl.glimzy.backend.user.model.User;
import pl.glimzy.backend.user.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final SkinRepository skinRepository;

    public void addSkin(Long userId, Long skinId) {

        User user = userRepository.findById(userId)
                .orElseThrow();
        Skin skin = skinRepository.findById(skinId)
                .orElseThrow();

        Inventory inventory = Inventory.builder()
                .user(user)
                .skin(skin)
                .build();
        inventoryRepository.save(inventory);
    }
    public List<Inventory> getInventory(Long userId) {
        return inventoryRepository.findByUserId(userId);
    }
}
