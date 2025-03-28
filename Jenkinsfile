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
                    
                    sh "docker tag $DOCKER_REGISTRY/$BACKEND_IMAGE $DOCKER_REGISTRY/$BACKEND_IMAGE"
                    sh "docker push $DOCKER_REGISTRY/$BACKEND_IMAGE"

                    sh "docker tag $DOCKER_REGISTRY/$FRONTEND_IMAGE $DOCKER_REGISTRY/$FRONTEND_IMAGE"
                    sh "docker push $DOCKER_REGISTRY/$FRONTEND_IMAGE"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh "kubectl apply -f KubernetesUser/backend-deployment.yaml"
                    sh "kubectl apply -f KubernetesUser/frontend-deployment.yaml"
                }
            }
        }
    }
}
