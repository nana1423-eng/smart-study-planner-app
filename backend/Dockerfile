# Stage 1: Build the JAR
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
# Pre-download dependencies separately for better Docker layer caching
RUN MAVEN_OPTS="-Xmx512m" mvn dependency:go-offline -B
COPY src ./src
RUN MAVEN_OPTS="-Xmx512m" mvn clean package -DskipTests -B

# Stage 2: Final Runtime Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=build /app/target/planner-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
