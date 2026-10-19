package com.castroadvocacia.plataforma.controller;

import com.castroadvocacia.plataforma.dto.ClienteRequestDTO;
import com.castroadvocacia.plataforma.dto.ClienteResponseDTO;
import com.castroadvocacia.plataforma.exception.ResourceNotFoundException;
import com.castroadvocacia.plataforma.service.ClienteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ClienteController.class)
@WithMockUser
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClienteService clienteService;

    private ClienteResponseDTO clienteResponse;

    @BeforeEach
    void setUp() {
        clienteResponse = ClienteResponseDTO.builder()
                .id(UUID.randomUUID())
                .nome("André Costa")
                .cpf("123.456.789-00")
                .numeroProcesso("0001234-56.2025.8.26.0100")
                .criadoEm(LocalDateTime.now())
                .atualizadoEm(LocalDateTime.now())
                .build();
    }

    @Test
    void listar_deveRetornar200ComListaDeClientes() throws Exception {
        when(clienteService.buscar(isNull())).thenReturn(List.of(clienteResponse));

        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("André Costa"));
    }

    @Test
    void listar_comQuery_deveFiltrar() throws Exception {
        when(clienteService.buscar(eq("André"))).thenReturn(List.of(clienteResponse));

        mockMvc.perform(get("/api/clientes").param("q", "André"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void buscarPorId_quandoExiste_deveRetornar200() throws Exception {
        when(clienteService.buscarPorId(clienteResponse.getId())).thenReturn(clienteResponse);

        mockMvc.perform(get("/api/clientes/{id}", clienteResponse.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cpf").value("123.456.789-00"));
    }

    @Test
    void buscarPorId_quandoNaoExiste_deveRetornar404() throws Exception {
        UUID id = UUID.randomUUID();
        when(clienteService.buscarPorId(id))
                .thenThrow(new ResourceNotFoundException("Cliente não encontrado: " + id));

        mockMvc.perform(get("/api/clientes/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void criar_comDadosValidos_deveRetornar201() throws Exception {
        ClienteRequestDTO dto = new ClienteRequestDTO("André Costa", "123.456.789-00", null);
        when(clienteService.criar(any(ClienteRequestDTO.class))).thenReturn(clienteResponse);

        mockMvc.perform(post("/api/clientes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.nome").value("André Costa"));
    }

    @Test
    void criar_semNome_deveRetornar400() throws Exception {
        ClienteRequestDTO dto = new ClienteRequestDTO("", null, null);

        mockMvc.perform(post("/api/clientes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void criar_comCpfForaDoFormato_deveRetornar400() throws Exception {
        ClienteRequestDTO dto = new ClienteRequestDTO("Nome Válido", "12345678900", null);

        mockMvc.perform(post("/api/clientes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void criar_comCpfDuplicado_deveRetornar409() throws Exception {
        ClienteRequestDTO dto = new ClienteRequestDTO("André Costa", "123.456.789-00", null);
        when(clienteService.criar(any(ClienteRequestDTO.class)))
                .thenThrow(new DataIntegrityViolationException("CPF já cadastrado"));

        mockMvc.perform(post("/api/clientes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict());
    }

    @Test
    void atualizar_comDadosValidos_deveRetornar200() throws Exception {
        ClienteRequestDTO dto = new ClienteRequestDTO("André Costa Atualizado", "123.456.789-00", null);
        when(clienteService.atualizar(eq(clienteResponse.getId()), any(ClienteRequestDTO.class)))
                .thenReturn(clienteResponse);

        mockMvc.perform(put("/api/clientes/{id}", clienteResponse.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void atualizar_quandoClienteNaoExiste_deveRetornar404() throws Exception {
        UUID id = UUID.randomUUID();
        ClienteRequestDTO dto = new ClienteRequestDTO("Nome", null, null);
        when(clienteService.atualizar(eq(id), any(ClienteRequestDTO.class)))
                .thenThrow(new ResourceNotFoundException("Cliente não encontrado: " + id));

        mockMvc.perform(put("/api/clientes/{id}", id)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void excluir_deveRetornar204() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/clientes/{id}", id).with(csrf()))
                .andExpect(status().isNoContent());
    }
}
