FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/catalog-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 4173
ENV SERVER_ADDRESS=0.0.0.0
ENTRYPOINT ["java", "-jar", "app.jar"]
