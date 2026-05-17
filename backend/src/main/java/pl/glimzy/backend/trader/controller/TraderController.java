package pl.glimzy.backend.trader.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.glimzy.backend.inventory.model.Inventory;
import pl.glimzy.backend.inventory.service.InventoryService;
import pl.glimzy.backend.user.model.User;
import pl.glimzy.backend.user.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/trader")
@RequiredArgsConstructor
public class TraderController {

    private final UserRepository userRepository;
    private final InventoryService inventoryService;

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/inventory/{userId}")
    public List<Inventory> getInventory(@PathVariable Long userId) {
        return inventoryService.getInventory(userId);
    }
}