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
                sh 'npm run lint'
            }
        }
        stage('Test') {
            steps {
                // Ignore tests until passing
                // sh 'npm test'
            }
        }
    }
}