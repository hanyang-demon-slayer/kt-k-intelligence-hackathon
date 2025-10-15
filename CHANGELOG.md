# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Spring Boot backend
- React + TypeScript frontend with Vite
- Python FastAPI LLM service
- Docker Compose configuration
- Comprehensive .gitignore file
- Project documentation (README files)
- Makefile for development automation

### Changed
- Domain entities refactored with bidirectional relationships
- Evaluation data consolidated into EvaluationResult entity
- Removed duplicate evaluation fields from Application and Answer entities

### Fixed
- Builder annotation warnings in domain entities
- Data consistency issues in bidirectional relationships

## [0.1.0] - 2024-01-XX

### Added
- Core domain entities (Company, JobPosting, Application, etc.)
- Basic CRUD operations for all entities
- Evaluation criteria management
- File upload functionality
- AI-powered evaluation system

### Technical Details
- Spring Boot 3.x with Java 17
- React 18 with TypeScript
- FastAPI with Python 3.11
- PostgreSQL database with Flyway migrations
- Docker containerization

### Security
- Input validation with Bean Validation
- CORS configuration
- Environment-based configuration

### Documentation
- API documentation with Swagger/OpenAPI
- Comprehensive README files for each service
- Development setup instructions

## [0.0.1] - 2024-01-XX

### Added
- Initial project structure
- Basic entity relationships
- Development environment setup
