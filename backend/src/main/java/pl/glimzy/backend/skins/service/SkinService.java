package pl.glimzy.backend.skins.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.glimzy.backend.common.exception.CustomException;
import pl.glimzy.backend.skins.model.Skin;
import pl.glimzy.backend.skins.repository.SkinRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkinService {
    private final SkinRepository repository;

    public List<Skin> getAll() {
        return repository.findAll();
    }
    public Skin getById(Long id) {
        return repository.findById(id)
                .orElseThrow( ()->
                        new CustomException("Nie znaleziono skina", HttpStatus.NOT_FOUND));
    }
}