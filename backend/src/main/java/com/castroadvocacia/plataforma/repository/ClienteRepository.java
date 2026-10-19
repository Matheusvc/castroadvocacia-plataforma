package com.castroadvocacia.plataforma.repository;

import com.castroadvocacia.plataforma.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
}
