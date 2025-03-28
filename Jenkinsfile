pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "localhost:5000"
        BACKEND_IMAGE = "eventbookingsystem-backend"
        FRONTEND_IMAGE = "eventbookingsystem-frontend"
        KUBECONFIG = "/home/jenkins/.kube/config"
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
                    sh "docker info"
                    
                    sh "docker tag $DOCKER_REGISTRY/$BACKEND_IMAGE:latest $DOCKER_REGISTRY/$BACKEND_IMAGE:latest"
                    sh "docker push $DOCKER_REGISTRY/$BACKEND_IMAGE:latest"

                    sh "docker tag $DOCKER_REGISTRY/$FRONTEND_IMAGE:latest $DOCKER_REGISTRY/$FRONTEND_IMAGE:latest"
                    sh "docker push $DOCKER_REGISTRY/$FRONTEND_IMAGE:latest"
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
