package pl.glimzy.backend.skins.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.glimzy.backend.skins.service.SkinService;
import pl.glimzy.backend.skins.model.Skin;

import java.util.List;

@RestController
@RequestMapping("/api/skins")
@RequiredArgsConstructor
public class SkinController
{
    private final SkinService skinService;


    @GetMapping
    public List<Skin> getAll() {
        return skinService.getAll();
    }
    @GetMapping("/{id}")
    public Skin getById(@PathVariable Long id) {
        return skinService.getById(id);
    }
}