#!/bin/bash

# ===========================================
# KT K-Intelligence Hackathon Project
# Installation Script
# ===========================================

set -e  # Exit on any error

echo "🚀 KT K-Intelligence Hackathon Project 설치를 시작합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 사전 요구사항 확인
check_requirements() {
    print_step "사전 요구사항 확인 중..."
    
    # Docker 확인
    if command -v docker &> /dev/null; then
        print_success "Docker가 설치되어 있습니다."
    else
        print_error "Docker가 설치되어 있지 않습니다. https://docs.docker.com/get-docker/ 에서 설치하세요."
        exit 1
    fi
    
    # Docker Compose 확인
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose가 설치되어 있습니다."
    else
        print_error "Docker Compose가 설치되어 있지 않습니다."
        exit 1
    fi
    
    # Git 확인
    if command -v git &> /dev/null; then
        print_success "Git이 설치되어 있습니다."
    else
        print_error "Git이 설치되어 있지 않습니다."
        exit 1
    fi
    
    # Make 확인
    if command -v make &> /dev/null; then
        print_success "Make가 설치되어 있습니다."
    else
        print_warning "Make가 설치되어 있지 않습니다. Docker 명령어를 직접 사용하세요."
    fi
}

# 환경 설정 파일 생성
setup_environment() {
    print_step "환경 설정 파일 생성 중..."
    
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            print_success ".env 파일이 생성되었습니다."
            print_warning ".env 파일을 편집하여 필요한 API 키를 설정하세요."
        else
            print_error "env.example 파일을 찾을 수 없습니다."
            exit 1
        fi
    else
        print_warning ".env 파일이 이미 존재합니다."
    fi
}

# Docker 이미지 빌드
build_images() {
    print_step "Docker 이미지 빌드 중..."
    
    if command -v make &> /dev/null; then
        make build
    else
        docker-compose build
    fi
    
    print_success "Docker 이미지 빌드가 완료되었습니다."
}

# 서비스 시작
start_services() {
    print_step "서비스 시작 중..."
    
    if command -v make &> /dev/null; then
        make start
    else
        docker-compose up -d
    fi
    
    print_success "서비스가 시작되었습니다."
}

# 서비스 상태 확인
check_services() {
    print_step "서비스 상태 확인 중..."
    
    sleep 10  # 서비스 시작 대기
    
    if command -v make &> /dev/null; then
        make status
    else
        docker-compose ps
    fi
    
    # 헬스체크
    print_step "서비스 헬스체크 중..."
    
    # Backend 헬스체크
    if curl -f http://localhost:8080/actuator/health &> /dev/null; then
        print_success "Backend 서비스가 정상 동작 중입니다."
    else
        print_warning "Backend 서비스가 아직 준비되지 않았습니다."
    fi
    
    # Frontend 헬스체크
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Frontend 서비스가 정상 동작 중입니다."
    else
        print_warning "Frontend 서비스가 아직 준비되지 않았습니다."
    fi
    
    # LLM Service 헬스체크
    if curl -f http://localhost:8000/health &> /dev/null; then
        print_success "LLM 서비스가 정상 동작 중입니다."
    else
        print_warning "LLM 서비스가 아직 준비되지 않았습니다."
    fi
}

# 설치 완료 메시지
show_completion_message() {
    echo ""
    echo "🎉 설치가 완료되었습니다!"
    echo ""
    echo "📱 접속 URL:"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Backend API: http://localhost:8080"
    echo "  • LLM Service: http://localhost:8000"
    echo "  • API 문서: http://localhost:8080/swagger-ui.html"
    echo ""
    echo "🛠️  유용한 명령어:"
    echo "  • 서비스 상태 확인: make status (또는 docker-compose ps)"
    echo "  • 로그 확인: make logs (또는 docker-compose logs -f)"
    echo "  • 서비스 중지: make stop (또는 docker-compose down)"
    echo "  • 전체 정리: make clean (또는 docker-compose down -v)"
    echo ""
    print_warning "중요: .env 파일에서 OPENAI_API_KEY를 설정하세요!"
    echo ""
}

# 메인 실행
main() {
    echo "=============================================="
    echo "  KT K-Intelligence Hackathon Project"
    echo "=============================================="
    echo ""
    
    check_requirements
    setup_environment
    build_images
    start_services
    check_services
    show_completion_message
}

# 스크립트 실행
main "$@"
