package com.example.tankbattle;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class TankBattleApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void includesGameShellResource() {
        assertNotNull(getClass().getResource("/static/index.html"));
    }
}
