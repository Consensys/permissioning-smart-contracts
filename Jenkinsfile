pipeline {
    agent {
        docker { image 'node:10-alpine' }
    }

    stages {
        stage('Setup') {
            steps {
                sh 'apk add git python make g++'
            }
        }
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
                sh 'npm run coverage'
                sh './node_modules/.bin/istanbul report cobertura --root .'
            }
        }
    }
    post {
        always {
            junit 'test-results/**/*.xml'
            publishCoverage adapters: [
                istanbulCoberturaAdapter(
                    path: 'coverage/cobertura-coverage.xml', 
                    thresholds: [[failUnhealthy: true, thresholdTarget: 'File', unhealthyThreshold: 80.0, unstableThreshold: 86.0]])]
        }
      }
}
