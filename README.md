# Steelbound — Tank Battle

A browser-playable 2D top-down tank battle game built with Java 21 and Spring Boot 4.0.7. Spring Boot serves the static Canvas game; gameplay state is intentionally local to the browser for this single-player MVP.

## Run

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=4173"
```

Open `http://localhost:4173` in a browser.

## Controls

- `WASD` or arrow keys: move and aim
- `Space`: fire
- `P`: pause/resume
- Use the on-screen buttons for restart and pause

## MVP gameplay

Protect the base, destroy every hostile in each sector, and collect shield, speed, rapid-fire, and extra-life power-ups. Breakable walls can be destroyed; steel walls stop both tanks and bullets. Four sectors increase enemy count and speed.
