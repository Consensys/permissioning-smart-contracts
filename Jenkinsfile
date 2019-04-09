pipeline {
    agent {
        docker { image 'node:8-alpine' }
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Lint') {
            steps {
                sh 'npm lint'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}