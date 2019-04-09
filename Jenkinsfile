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
        // Ignore tests until passing
        /*
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        */
    }
}