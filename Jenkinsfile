pipeline {
    agent {
        docker { image 'node:10-alpine' }
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
                sh 'npm test'
            }
        }
        stage('Coverage') {
            steps {
                sh 'npm coverage'
            }
        }
    }
}
