package pl.glimzy.backend.cases.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.glimzy.backend.cases.model.Case;

public interface CaseRepository extends JpaRepository<Case, Long> {
}
