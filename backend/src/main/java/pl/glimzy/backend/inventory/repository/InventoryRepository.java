package pl.glimzy.backend.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.glimzy.backend.inventory.model.Inventory;

import java.util.List;

public interface InventoryRepository
        extends JpaRepository<Inventory, Long> {
    List<Inventory> findByUserId(Long userId);
}
