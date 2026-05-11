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
                        .price(4000)
                        .rare("red")
                        .chance(0.82f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Grafiti")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/grafiti.png")
                        .price(900)
                        .rare("purple")
                        .chance(3.65f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Ice Coaled")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/icecoaled.png")
                        .price(150)
                        .rare("blue")
                        .chance(21.90f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Lightning")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/lightning.png")
                        .price(1100)
                        .rare("red")
                        .chance(2.99f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Lore")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/lore.png")
                        .price(40000)
                        .rare("yellow")
                        .chance(0.08f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Pop")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/pop.png")
                        .price(50)
                        .rare("gray")
                        .chance(65.70f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Silk Tiger")
                        .weapon("AWP")
                        .imageUrl("/images/skins/awp/silktiger.png")
                        .price(1000)
                        .rare("pink")
                        .chance(3.28f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Vice")
                        .weapon("GLOVES")
                        .imageUrl("/images/skins/gloves/vice.png")
                        .price(3000)
                        .rare("red")
                        .chance(1.09f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Karambit Emerald")
                        .weapon("KNIFE")
                        .imageUrl("/images/skins/knife/karambitemerald.png")
                        .price(20000)
                        .rare("yellow")
                        .chance(0.16f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Skeleton Ruby")
                        .weapon("KNIFE")
                        .imageUrl("/images/skins/knife/skeletonruby.png")
                        .price(14000)
                        .rare("red")
                        .chance(0.23f)
                        .build());

                skinRepository.save(Skin.builder()
                        .name("Howl")
                        .weapon("M4A4")
                        .imageUrl("/images/skins/m4a4/howl.png")
                        .price(30000)
                        .rare("yellow")
                        .chance(0.11f)
                        .build());
            }
        };
    }
}