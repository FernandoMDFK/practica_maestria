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
                // Vaciamos las variables directamente en la línea de ejecución
                sh 'DOCKER_HOST="" DOCKER_TLS_VERIFY="" DOCKER_CERT_PATH="" docker compose config'
            }
        }

        stage('Docker - Build') {
            steps {
                // Obligamos a Docker a buscar el socket nativo de Linux (/var/run/docker.sock)
                sh 'DOCKER_HOST="" DOCKER_TLS_VERIFY="" DOCKER_CERT_PATH="" docker compose build'
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