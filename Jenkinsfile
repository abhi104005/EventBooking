pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "localhost:5000"
        BACKEND_IMAGE = "localhost:5000/eventbookingsystem-backend"
        FRONTEND_IMAGE = "localhost:5000/eventbookingsystem-frontend"
    }

    stages {
        stage('Build Backend') {
            steps {
                script {
                    sh "docker build -t $DOCKER_REGISTRY/$BACKEND_IMAGE -f backend/Dockerfile ./backend"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    sh "docker build -t $DOCKER_REGISTRY/$FRONTEND_IMAGE -f frontend/Dockerfile ./frontend"
                }
            }
        }

        stage('Push Images to Local Registry') {
            steps {
                script {
                    sh "docker push $DOCKER_REGISTRY/$BACKEND_IMAGE"
                    sh "docker push $DOCKER_REGISTRY/$FRONTEND_IMAGE"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh "kubectl apply -f k8s/backend-deployment.yaml"
                    sh "kubectl apply -f k8s/frontend-deployment.yaml"
                }
            }
        }
    }
}
