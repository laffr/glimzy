package pl.glimzy.backend.config.data;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.glimzy.backend.skins.model.Skin;
import pl.glimzy.backend.skins.repository.SkinRepository;

@Configuration
@RequiredArgsConstructor
public class SkinDataInitializer {

    private final SkinRepository skinRepository;

    @Bean
    CommandLineRunner init() {
        return args -> {
            if (skinRepository.count() == 0) {

                skinRepository.save(Skin.builder()
                        .name("Fade")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/fade.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Grafiti")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/grafiti.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Ice Coaled")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/icecoaled.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Lightning")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/lightning.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Lore")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/lore.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Pop")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/pop.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Silk Tiger")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/silktiger.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Vice")
                        .weapon("GLOVES")
                        .imageUrl("/images/skins/gloves/vice.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Karambit Emerald")
                        .weapon("KNIFE")
                        .imageUrl("/images/skins/knife/karambitemerald.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Skeleton Ruby")
                        .weapon("KNIFE")
                        .imageUrl("/images/skins/knife/skeletonruby.png")
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Howl")
                        .weapon("M4A4")
                        .imageUrl("/images/skins/m4a4/howl.png")
                        .build());
            }
        };
    }
}