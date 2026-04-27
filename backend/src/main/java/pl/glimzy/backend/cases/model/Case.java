package pl.glimzy.backend.cases.model;

import jakarta.persistence.*;
import lombok.*;
import pl.glimzy.backend.skins.model.Skin;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
        name = "case_skins",
        joinColumns = @JoinColumn(name = "case_id"),
        inverseJoinColumns = @JoinColumn(name = "skin_id")
    )
    private Set<Skin> skins;
}
