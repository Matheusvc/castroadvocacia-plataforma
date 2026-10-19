package com.castroadvocacia.plataforma.service;

import com.castroadvocacia.plataforma.dto.ClienteRequestDTO;
import com.castroadvocacia.plataforma.dto.ClienteResponseDTO;
import com.castroadvocacia.plataforma.exception.ResourceNotFoundException;
import com.castroadvocacia.plataforma.model.Cliente;
import com.castroadvocacia.plataforma.repository.ClienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    private Cliente cliente;

    @BeforeEach
    void setUp() {
        cliente = new Cliente();
        cliente.setId(UUID.randomUUID());
        cliente.setNome("André Costa");
        cliente.setCpf("123.456.789-00");
        cliente.setNumeroProcesso("0001234-56.2025.8.26.0100");
    }

    @Test
    void listarTodos_deveRetornarListaDeClientes() {
        when(clienteRepository.findAll()).thenReturn(List.of(cliente));

        List<ClienteResponseDTO> resultado = clienteService.listarTodos();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getNome()).isEqualTo("André Costa");
    }

    @Test
    void buscarPorId_quandoExiste_deveRetornarCliente() {
        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.of(cliente));

        ClienteResponseDTO resultado = clienteService.buscarPorId(cliente.getId());

        assertThat(resultado.getId()).isEqualTo(cliente.getId());
        assertThat(resultado.getCpf()).isEqualTo(cliente.getCpf());
    }

    @Test
    void buscarPorId_quandoNaoExiste_deveLancarExcecao() {
        UUID idInexistente = UUID.randomUUID();
        when(clienteRepository.findById(idInexistente)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> clienteService.buscarPorId(idInexistente))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void buscar_comTermo_deveFiltrarPorNomeCpfOuProcesso() {
        when(clienteRepository.buscarPorTermo("André")).thenReturn(List.of(cliente));

        List<ClienteResponseDTO> resultado = clienteService.buscar("André");

        assertThat(resultado).hasSize(1);
        verify(clienteRepository).buscarPorTermo("André");
    }

    @Test
    void buscar_semTermo_deveListarTodos() {
        when(clienteRepository.findAll()).thenReturn(List.of(cliente));

        List<ClienteResponseDTO> resultado = clienteService.buscar("   ");

        assertThat(resultado).hasSize(1);
        verify(clienteRepository, never()).buscarPorTermo(anyString());
    }

    @Test
    void criar_comCpfNovo_deveSalvarCliente() {
        ClienteRequestDTO dto = new ClienteRequestDTO("Nova Pessoa", "987.654.321-00", null);
        when(clienteRepository.findByCpf(dto.getCpf())).thenReturn(Optional.empty());
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(inv -> inv.getArgument(0));

        ClienteResponseDTO resultado = clienteService.criar(dto);

        assertThat(resultado.getNome()).isEqualTo("Nova Pessoa");
        ArgumentCaptor<Cliente> captor = ArgumentCaptor.forClass(Cliente.class);
        verify(clienteRepository).save(captor.capture());
        assertThat(captor.getValue().getCpf()).isEqualTo("987.654.321-00");
    }

    @Test
    void criar_comCpfJaCadastrado_deveLancarExcecao() {
        ClienteRequestDTO dto = new ClienteRequestDTO("Outra Pessoa", cliente.getCpf(), null);
        when(clienteRepository.findByCpf(cliente.getCpf())).thenReturn(Optional.of(cliente));

        assertThatThrownBy(() -> clienteService.criar(dto))
                .isInstanceOf(DataIntegrityViolationException.class);

        verify(clienteRepository, never()).save(any());
    }

    @Test
    void atualizar_quandoClienteExiste_deveAtualizarDados() {
        ClienteRequestDTO dto = new ClienteRequestDTO("Nome Atualizado", cliente.getCpf(), "novo-processo");
        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.of(cliente));
        when(clienteRepository.findByCpf(cliente.getCpf())).thenReturn(Optional.of(cliente));
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(inv -> inv.getArgument(0));

        ClienteResponseDTO resultado = clienteService.atualizar(cliente.getId(), dto);

        assertThat(resultado.getNome()).isEqualTo("Nome Atualizado");
        assertThat(resultado.getNumeroProcesso()).isEqualTo("novo-processo");
    }

    @Test
    void atualizar_comCpfDeOutroCliente_deveLancarExcecao() {
        Cliente outro = new Cliente();
        outro.setId(UUID.randomUUID());
        outro.setNome("Outro Cliente");
        outro.setCpf("999.999.999-99");

        ClienteRequestDTO dto = new ClienteRequestDTO("Nome Atualizado", outro.getCpf(), null);
        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.of(cliente));
        when(clienteRepository.findByCpf(outro.getCpf())).thenReturn(Optional.of(outro));

        assertThatThrownBy(() -> clienteService.atualizar(cliente.getId(), dto))
                .isInstanceOf(DataIntegrityViolationException.class);

        verify(clienteRepository, never()).save(any());
    }

    @Test
    void atualizar_quandoClienteNaoExiste_deveLancarExcecao() {
        UUID idInexistente = UUID.randomUUID();
        when(clienteRepository.findById(idInexistente)).thenReturn(Optional.empty());

        ClienteRequestDTO dto = new ClienteRequestDTO("Nome", null, null);

        assertThatThrownBy(() -> clienteService.atualizar(idInexistente, dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void excluir_quandoClienteExiste_deveRemover() {
        when(clienteRepository.findById(cliente.getId())).thenReturn(Optional.of(cliente));

        clienteService.excluir(cliente.getId());

        verify(clienteRepository).delete(cliente);
    }

    @Test
    void excluir_quandoClienteNaoExiste_deveLancarExcecao() {
        UUID idInexistente = UUID.randomUUID();
        when(clienteRepository.findById(idInexistente)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> clienteService.excluir(idInexistente))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(clienteRepository, never()).delete(any());
    }
}
