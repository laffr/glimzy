package pl.glimzy.backend.cases.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.glimzy.backend.cases.service.CaseService;
import pl.glimzy.backend.cases.model.Case;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {
    private final CaseService caseService;

    @GetMapping
    public List<Case> getAll() {
        return caseService.getAll();
    }

    @GetMapping("/{id}")
    public Case getById(@PathVariable Long id) {
        return caseService.getById(id);
    }

    @PostMapping
    public Case create(@RequestBody Case c) {
        return caseService.save(c);
    }
}
