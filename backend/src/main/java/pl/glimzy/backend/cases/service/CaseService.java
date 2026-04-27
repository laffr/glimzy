package pl.glimzy.backend.cases.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.glimzy.backend.cases.model.Case;
import pl.glimzy.backend.cases.repository.CaseRepository;
import pl.glimzy.backend.common.exception.CustomException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaseService {
    private final CaseRepository caseRepository;

    public List<Case> getAll() {
        return caseRepository.findAll();
    }

    public Case getById(Long id) {
        return caseRepository.findById(id)
                .orElseThrow(() -> new CustomException("Nie znaleziono skrzynki" , HttpStatus.NOT_FOUND));
    }
    public Case save(Case c) {
        return caseRepository.save(c);
    }
}
