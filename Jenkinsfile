pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Install') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Backend - Prisma') {
            steps {
                dir('backend') {
                    sh 'npx prisma generate'
                }
            }
        }

        stage('Backend - Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Frontend - Install') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend - Lint') {
            steps {
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker - Validate') {
            steps {
                // Apuntamos al Docker Desktop de tu Windows sin usar certificados TLS
                withEnv(['DOCKER_HOST=tcp://host.docker.internal:2375', 'DOCKER_TLS_VERIFY=', 'DOCKER_CERT_PATH=']) {
                    sh 'docker compose config'
                }
            }
        }

        stage('Docker - Build') {
            steps {
                // Mismas variables para la construcción de las imágenes
                withEnv(['DOCKER_HOST=tcp://host.docker.internal:2375', 'DOCKER_TLS_VERIFY=', 'DOCKER_CERT_PATH=']) {
                    sh 'docker compose build'
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline satisfactorio'
        }

        failure {
            echo 'Revisar la primera etapa fallida y sus logs'
        }
    }
}