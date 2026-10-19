package com.castroadvocacia.plataforma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponseDTO {

    private UUID id;
    private String nome;
    private String cpf;
    private String numeroProcesso;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
