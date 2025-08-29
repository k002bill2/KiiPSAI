# Multi-stage build for Spring Boot
FROM amazoncorretto:17-alpine AS builder

# Install Maven
RUN apk add --no-cache curl tar bash
RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz | tar xzf - -C /opt
RUN ln -s /opt/apache-maven-3.8.6/bin/mvn /usr/local/bin/mvn

# Set the working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:17-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the jar file from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port on which the Spring Boot application will run
EXPOSE 8080

# Command to run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
