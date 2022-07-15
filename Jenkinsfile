pipeline {
    agent any
    stages {
        stage('构建') {
            steps {
                nodejs('16') {
                    sh 'npm config set registry https://registry.npmmirror.com'
                    sh 'npm config set disturl https://npmmirror.com/dist --location=global'
                    sh 'npm i --location=global pnpm'
                    sh 'pnpm install'
                    sh 'pnpm build'
                }
            }
        }
        stage('部署') {
            steps {
                sh 'docker build -f Dockerfile.deploy -t ceea-frontend:latest .'
                sh 'docker container rm -f ceea-frontend'
                sh 'docker run -d --name ceea-frontend --restart=on-failure:3 -p 8080:80 ceea-frontend'
            }
        }
        stage('清理') {
            steps {
                sh 'docker image prune -f'
                sh 'docker volume prune -f'
            }
        }
    }
}