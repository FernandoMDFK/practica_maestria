pipeline {

    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    options {
        timestamps()
        skipDefaultCheckout(true)
    }

    environment {
        LOCAL_BACKEND_IMAGE = 'proyecto-integrador-u3-backend'
        LOCAL_FRONTEND_IMAGE = 'proyecto-integrador-u3-frontend'

        REMOTE_BACKEND_IMAGE = 'proyecto-integrador-backend'
        REMOTE_FRONTEND_IMAGE = 'proyecto-integrador-frontend'
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
                sh '''
                    export DOCKER_CONFIG=/tmp
                    export DOCKER_HOST="tcp://host.docker.internal:2375"
                    export DOCKER_TLS_VERIFY=""
                    export DOCKER_CERT_PATH=""
                    
                    docker compose -p proyecto-integrador-u3 config --quiet
                '''
            }
        }

        stage('Docker - Build') {
            steps {
                sh '''
                    export DOCKER_CONFIG=/tmp
                    export DOCKER_HOST="tcp://host.docker.internal:2375"
                    export DOCKER_TLS_VERIFY=""
                    export DOCKER_CERT_PATH=""
                    
                    docker compose -p proyecto-integrador-u3 build
                '''
            }
        }

        stage('Docker - Verify Images') {
            steps {
                sh '''
                    export DOCKER_CONFIG=/tmp
                    export DOCKER_HOST="tcp://host.docker.internal:2375"
                    export DOCKER_TLS_VERIFY=""
                    export DOCKER_CERT_PATH=""

                    docker image inspect ${LOCAL_BACKEND_IMAGE} > /dev/null
                    docker image inspect ${LOCAL_FRONTEND_IMAGE} > /dev/null
                '''
            }
        }

        stage('Docker - Publish') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'Jenkins-TokenHub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        export DOCKER_CONFIG=/tmp
                        export DOCKER_HOST="tcp://host.docker.internal:2375"
                        export DOCKER_TLS_VERIFY=""
                        export DOCKER_CERT_PATH=""

                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        # Etiquetar con el número de compilación
                        docker tag ${LOCAL_BACKEND_IMAGE}:latest $DOCKER_USER/${REMOTE_BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker tag ${LOCAL_FRONTEND_IMAGE}:latest $DOCKER_USER/${REMOTE_FRONTEND_IMAGE}:${BUILD_NUMBER}

                        # Etiquetar también como 'latest'
                        docker tag ${LOCAL_BACKEND_IMAGE}:latest $DOCKER_USER/${REMOTE_BACKEND_IMAGE}:latest
                        docker tag ${LOCAL_FRONTEND_IMAGE}:latest $DOCKER_USER/${REMOTE_FRONTEND_IMAGE}:latest

                        # Subir las imágenes con el número de compilación
                        docker push $DOCKER_USER/${REMOTE_BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push $DOCKER_USER/${REMOTE_FRONTEND_IMAGE}:${BUILD_NUMBER}

                        # Subir las imágenes con la etiqueta 'latest'
                        docker push $DOCKER_USER/${REMOTE_BACKEND_IMAGE}:latest
                        docker push $DOCKER_USER/${REMOTE_FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline satisfactorio'
            echo 'Imágenes publicadas correctamente en Docker Hub'
        }

        failure {
            echo 'Revisar la primera etapa fallida y sus logs'
        }

        always {
            sh '''
                export DOCKER_CONFIG=/tmp
                export DOCKER_HOST="tcp://host.docker.internal:2375"
                export DOCKER_TLS_VERIFY=""
                export DOCKER_CERT_PATH=""
                
                docker logout || true
            '''
        }
    }
}