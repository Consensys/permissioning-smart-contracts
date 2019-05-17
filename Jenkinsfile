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
                sh 'npm run build'
            }
        }
        stage('Contracts: Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        stage('Contracts: Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Contracts: Coverage') {
            steps {
                sh 'npm run coverage'
                sh './node_modules/.bin/istanbul report cobertura --root .'
            }
        }
        stage('Dapp: Build') {
            steps {
                dir('app') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Dapp: Test') {
            steps {
                dir('app') {
                    sh 'npm run test:ci'
                }
            }
        }
    }
    post {
        always {
            junit 'test-results/**/*.xml'
            junit 'app/junit.xml'
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
