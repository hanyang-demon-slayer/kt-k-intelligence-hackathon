# KT K-Intelligence Hackathon Project Makefile

.PHONY: help install build start stop clean test lint format

# Default target
help:
	@echo "KT K-Intelligence Hackathon Project"
	@echo ""
	@echo "Available commands:"
	@echo "  install     - Install all dependencies"
	@echo "  build       - Build all services"
	@echo "  start       - Start all services with Docker Compose"
	@echo "  stop        - Stop all services"
	@echo "  restart     - Restart all services"
	@echo "  clean       - Clean up containers and volumes"
	@echo "  test        - Run all tests"
	@echo "  lint        - Run linting for all services"
	@echo "  format      - Format code for all services"
	@echo "  logs        - Show logs for all services"
	@echo "  status      - Show status of all services"

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd backend && ./gradlew build --refresh-dependencies
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing LLM dependencies..."
	cd llm && pip install -r requirements.txt

# Build all services
build:
	@echo "Building all services..."
	docker-compose build

# Start all services
start:
	@echo "Starting all services..."
	docker-compose up -d
	@echo "Services started. Check status with 'make status'"

# Stop all services
stop:
	@echo "Stopping all services..."
	docker-compose down

# Restart all services
restart: stop start

# Clean up
clean:
	@echo "Cleaning up containers and volumes..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# Run tests
test:
	@echo "Running backend tests..."
	cd backend && ./gradlew test
	@echo "Running frontend tests..."
	cd frontend && npm run test
	@echo "Running LLM tests..."
	cd llm && python -m pytest tests/

# Run linting
lint:
	@echo "Linting backend..."
	cd backend && ./gradlew checkstyleMain
	@echo "Linting frontend..."
	cd frontend && npm run lint
	@echo "Linting LLM..."
	cd llm && flake8 . --max-line-length=100

# Format code
format:
	@echo "Formatting backend..."
	cd backend && ./gradlew spotlessApply
	@echo "Formatting frontend..."
	cd frontend && npm run format
	@echo "Formatting LLM..."
	cd llm && black . && isort .

# Show logs
logs:
	docker-compose logs -f

# Show status
status:
	docker-compose ps

# Development commands
dev-backend:
	cd backend && ./gradlew bootRun

dev-frontend:
	cd frontend && npm run dev

dev-llm:
	cd llm && python main.py

# Database commands
db-migrate:
	cd backend && ./gradlew flywayMigrate

db-reset:
	cd backend && ./gradlew flywayClean flywayMigrate

# Security scanning
security-scan:
	@echo "Running security scan for backend..."
	cd backend && ./gradlew dependencyCheckAnalyze
	@echo "Running security scan for frontend..."
	cd frontend && npm audit
	@echo "Running security scan for LLM..."
	cd llm && safety check

# Generate documentation
docs:
	@echo "Generating API documentation..."
	cd backend && ./gradlew generateSwaggerDocs
	@echo "Documentation generated in backend/build/docs/"

# Backup database
backup-db:
	@echo "Creating database backup..."
	docker-compose exec postgres pg_dump -U hackathon_user kt_hackathon > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Restore database
restore-db:
	@echo "Restoring database from backup..."
	@read -p "Enter backup file name: " backup_file; \
	docker-compose exec -T postgres psql -U hackathon_user -d kt_hackathon < $$backup_file

# Setup development environment
setup-dev:
	@echo "Setting up development environment..."
	@echo "Creating necessary directories..."
	mkdir -p backend/uploads
	mkdir -p nginx/ssl
	@echo "Copying environment files..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Please edit .env file with your configuration"; \
	fi
	@echo "Development environment setup complete!"

# Production deployment
deploy-prod:
	@echo "Deploying to production..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
	@echo "Production deployment complete!"

# Health check
health:
	@echo "Checking service health..."
	@curl -f http://localhost:8080/actuator/health || echo "Backend: DOWN"
	@curl -f http://localhost:3000 || echo "Frontend: DOWN"
	@curl -f http://localhost:8000/health || echo "LLM: DOWN"

# Show resource usage
stats:
	@echo "Resource usage:"
	docker stats --no-stream
