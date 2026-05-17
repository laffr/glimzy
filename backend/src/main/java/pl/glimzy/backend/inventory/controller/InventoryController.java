package pl.glimzy.backend.inventory.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.glimzy.backend.inventory.dto.AddSkinRequest;
import pl.glimzy.backend.inventory.model.Inventory;
import pl.glimzy.backend.inventory.service.InventoryService;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping("/add")
    public void addSkin(@RequestBody AddSkinRequest request) {
        inventoryService.addSkin(request.getUserId(), request.getSkinId());
    }

    @GetMapping("/{userId}")
    public List<Inventory> getInventory(@PathVariable Long userId) {
        return inventoryService.getInventory(userId);
    }
}
