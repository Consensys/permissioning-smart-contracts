pipeline {
    agent {
        docker { image 'node:10-alpine' }
    }
    environment {
        CI = 'true'
    }

    stages {
        stage('Contracts: Setup') {
            steps {
                sh 'apk add git python make g++'
            }
        }
        stage('Contracts: Build') {
            steps {
                sh 'npm install'
                sh 'npm run build:contracts'
            }
        }
        stage('Contracts: Lint') {
            steps {
                sh 'npm run lint:contracts'
            }
        }
        stage('Contracts: Test') {
            steps {
                sh 'npm run test:contracts'
            }
        }
        stage('Contracts: Coverage') {
            steps {
                sh 'npm run coverage:contracts'
                sh './node_modules/.bin/istanbul report cobertura --root .'
            }
        }
        stage('Dapp: Build') {
            steps {
                sh 'npm run build:app'
            }
        }
        stage('Dapp: Test') {
            steps {
                sh 'npm run test:app:ci'
            }
        }
    }
    post {
        always {
            junit 'test-results/**/*.xml'
            junit 'junit.xml'
            publishCoverage adapters: [
                istanbulCoberturaAdapter(
                    path: 'coverage/cobertura-coverage.xml',
                    thresholds: [[failUnhealthy: true, thresholdTarget: 'Function', unhealthyThreshold: 80.0, unstableThreshold: 85.0]])]
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: false,
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report (HTML)',
                reportTitles: ''])
        }
      }
}
