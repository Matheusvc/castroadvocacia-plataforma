package com.castroadvocacia.plataforma.repository;

import com.castroadvocacia.plataforma.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    Optional<Cliente> findByCpf(String cpf);

    boolean existsByCpf(String cpf);

    @Query("""
            SELECT c FROM Cliente c
            WHERE LOWER(c.nome) LIKE LOWER(CONCAT('%', :termo, '%'))
               OR LOWER(c.cpf) LIKE LOWER(CONCAT('%', :termo, '%'))
               OR LOWER(c.numeroProcesso) LIKE LOWER(CONCAT('%', :termo, '%'))
            """)
    List<Cliente> buscarPorTermo(@Param("termo") String termo);
}
