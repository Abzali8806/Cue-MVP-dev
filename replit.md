# Cue MVP Frontend - Architecture Guide

## Overview

Cue is a standalone React frontend for an AI-powered workflow automation platform that converts natural language descriptions into deployable Python code. This application is designed to integrate with a separate FastAPI backend for authentication, workflow generation, and data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Redux Toolkit with RTK Query for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
- **Build Tool**: Vite for fast development and optimized production builds
- **Authentication**: Session-based authentication via FastAPI OAuth integration

### Backend Integration Strategy
The frontend is architected as a standalone application that communicates with a FastAPI backend through REST API calls. All business logic, authentication, and data persistence is handled by the external FastAPI service.

## Key Components

### 1. Authentication System
- **OAuth Integration**: Google and GitHub OAuth through FastAPI endpoints
- **Session Management**: Cookie-based sessions handled by FastAPI backend
- **User Profile**: Complete user onboarding and profile management
- **Access Control**: Graceful handling of authenticated and unauthenticated states

### 2. Workflow Builder
- **Natural Language Input**: Text and speech-to-text input for workflow descriptions
- **Visual Editor**: React Flow-based node editor for workflow visualization
- **Code Generation**: AI-powered code generation via FastAPI backend
- **Real-time Validation**: Credential and workflow validation with visual feedback

### 3. Credential Management
- **Service Integration**: Support for multiple third-party service credentials
- **Validation System**: Real-time credential validation through backend API
- **Security**: Credentials stored and validated securely via backend services

### 4. Code Preview & Deployment
- **Code Highlighting**: Syntax-highlighted Python code preview
- **File Downloads**: Generated code, requirements.txt, and SAM templates
- **Deployment Instructions**: Step-by-step AWS Lambda deployment guidance

## Data Flow

1. **User Input**: Natural language workflow description entered via UI
2. **API Request**: Description sent to FastAPI backend for processing
3. **AI Processing**: Backend generates workflow nodes, edges, and Python code
4. **State Update**: Frontend updates Redux store with generated workflow data
5. **Visualization**: React Flow renders interactive workflow diagram
6. **Validation**: Credentials and workflow components validated via backend APIs
7. **Code Generation**: Final Python code and deployment templates generated
8. **Download/Deploy**: User downloads files or follows deployment instructions

## External Dependencies

### Runtime Dependencies
- **@tanstack/react-query**: Server state management and API caching
- **@reduxjs/toolkit**: Client state management
- **react-flow**: Visual workflow editor
- **wouter**: Lightweight routing
- **@radix-ui**: Accessible UI primitives
- **framer-motion**: Animation library

### Backend API Dependencies
- **FastAPI Backend**: Required for all core functionality
- **Authentication Service**: OAuth providers (Google, GitHub)
- **AI/ML Service**: Workflow generation capabilities
- **Validation Services**: Credential and workflow validation

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and development experience
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundling

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server on port 5173, Express proxy on port 5000
- **Docker Development**: Containerized development with volume mounts for hot reload
- **Environment Configuration**: `.env` file for FastAPI backend URL configuration

### Production Deployment
- **Static Hosting**: Nginx-served static files from multi-stage Docker build
- **Container Orchestration**: Docker Compose for production deployment
- **Health Checks**: Built-in health monitoring for container management
- **Environment Variables**: Runtime configuration for different deployment environments

### Integration Requirements
- **FastAPI Backend**: Must be running and accessible at configured URL
- **CORS Configuration**: Backend must allow requests from frontend domain
- **Session Management**: Backend must handle session middleware for authentication
- **API Endpoints**: Complete set of required endpoints must be implemented

## Changelog
- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.