package pl.glimzy.backend.skins.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.glimzy.backend.skins.model.Skin;

public interface SkinRepository extends JpaRepository<Skin, Long>
{
}