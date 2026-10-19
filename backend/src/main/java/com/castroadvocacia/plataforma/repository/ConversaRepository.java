package com.castroadvocacia.plataforma.repository;

import com.castroadvocacia.plataforma.model.Conversa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConversaRepository extends JpaRepository<Conversa, UUID> {
}
