package com.castroadvocacia.plataforma.service;

import com.castroadvocacia.plataforma.dto.ClienteRequestDTO;
import com.castroadvocacia.plataforma.dto.ClienteResponseDTO;
import com.castroadvocacia.plataforma.exception.ResourceNotFoundException;
import com.castroadvocacia.plataforma.model.Cliente;
import com.castroadvocacia.plataforma.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO buscarPorId(UUID id) {
        return toResponseDTO(buscarEntidadePorId(id));
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> buscar(String query) {
        if (query == null || query.isBlank()) {
            return listarTodos();
        }
        return clienteRepository.buscarPorTermo(query.trim()).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public ClienteResponseDTO criar(ClienteRequestDTO dto) {
        validarCpfDuplicado(dto.getCpf(), null);

        Cliente cliente = new Cliente();
        cliente.setNome(dto.getNome().trim());
        cliente.setCpf(normalizarVazio(dto.getCpf()));
        cliente.setNumeroProcesso(normalizarVazio(dto.getNumeroProcesso()));

        return toResponseDTO(clienteRepository.save(cliente));
    }

    public ClienteResponseDTO atualizar(UUID id, ClienteRequestDTO dto) {
        Cliente cliente = buscarEntidadePorId(id);
        validarCpfDuplicado(dto.getCpf(), id);

        cliente.setNome(dto.getNome().trim());
        cliente.setCpf(normalizarVazio(dto.getCpf()));
        cliente.setNumeroProcesso(normalizarVazio(dto.getNumeroProcesso()));

        return toResponseDTO(clienteRepository.save(cliente));
    }

    public void excluir(UUID id) {
        Cliente cliente = buscarEntidadePorId(id);
        clienteRepository.delete(cliente);
    }

    private Cliente buscarEntidadePorId(UUID id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + id));
    }

    /** Garante que o CPF, quando informado, não pertença a outro cliente. */
    private void validarCpfDuplicado(String cpf, UUID idAtual) {
        if (cpf == null || cpf.isBlank()) return;

        clienteRepository.findByCpf(cpf)
                .filter(existente -> !existente.getId().equals(idAtual))
                .ifPresent(existente -> {
                    throw new DataIntegrityViolationException("CPF já cadastrado: " + cpf);
                });
    }

    private String normalizarVazio(String valor) {
        return (valor == null || valor.isBlank()) ? null : valor.trim();
    }

    private ClienteResponseDTO toResponseDTO(Cliente cliente) {
        return ClienteResponseDTO.builder()
                .id(cliente.getId())
                .nome(cliente.getNome())
                .cpf(cliente.getCpf())
                .numeroProcesso(cliente.getNumeroProcesso())
                .criadoEm(cliente.getCriadoEm())
                .atualizadoEm(cliente.getAtualizadoEm())
                .build();
    }
}
