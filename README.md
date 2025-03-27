**🚀 Event Booking System**
**📌 Overview**
The Event Booking System is a full-stack web application that allows users to create, read, update, and delete events. The system includes authentication, validation, and an intuitive user interface for managing events.

**🛠️ Tech Stack**
**Backend (Node.js)**
CRUD operations for events (Create, Read, Update, Delete)

Event properties: Name, Date, Location, Description, Available Seats

Validation: Ensuring required fields and future dates

Authentication: JWT-based login/signup

**Frontend (React)**
User-friendly interface to manage events

List of upcoming events with a search feature

Form validation with error handling

**📦 Deployment**
Docker
Dockerized both frontend and backend

Includes Docker Compose for easy setup

**Kubernetes**
Configured to run locally using Kubernetes

Kubernetes manifests for pods and services

**🔍 Continuous Integration & Code Quality**

**SonarQube Integration**

Static code analysis with SonarQube to ensure code quality

Detects bugs, vulnerabilities, and code smells

Automatically runs as part of GitHub Actions workflow

**GitHub Actions**

Automated workflow to build, test, and analyze the application

Runs SonarQube analysis on each commit

Ensures that all tests pass before deployment

**🌟 Features**
✅ User Authentication (JWT)
✅ Secure API with validation
✅ Event CRUD functionality
✅ Search & Filter Events
✅ Dockerized setup
✅ Kubernetes support for local deployment
✅ SonarQube Integration for Code Quality
✅ CI/CD with GitHub Actions

**🤝 Contributing**
Feel free to submit a pull request or open an issue for suggestions!
