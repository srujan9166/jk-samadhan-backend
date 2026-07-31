package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "states", schema = "jks_3nf")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "lgd_code")
    private Integer lgdCode;
}
