package com.revolte.catalog.controller;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean OpenAPI catalogApi() { return new OpenAPI().info(new Info().title("Fieldwork Catalog API").version("v1").description("Product browsing and admin catalog management API.")); }
}
