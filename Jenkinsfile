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
                // Forzamos las variables correctas para conectarnos al contenedor DinD
                withEnv(['DOCKER_HOST=tcp://docker:2376', 'DOCKER_CERT_PATH=/certs/client', 'DOCKER_TLS_VERIFY=1']) {
                    sh 'docker compose config'
                }
            }
        }

        stage('Docker - Build') {
            steps {
                // Volvemos a forzarlas para asegurar la construcción de las imágenes
                withEnv(['DOCKER_HOST=tcp://docker:2376', 'DOCKER_CERT_PATH=/certs/client', 'DOCKER_TLS_VERIFY=1']) {
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