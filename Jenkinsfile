sao agent lại là none
pipeline {
    agent none

    environment {
        NODE_VERSION = '24'
        DEPLOY_PATH = '/projects/shopfe/'
    }

    stages {

        stage('Build on Node builder') {
            agent { label 'builder' }

            steps {
                checkout scm

                // Nếu node đã có nodejs thì bỏ đoạn này
                sh '''
                    node -v || true
                    npm -v || true
                '''

                sh 'npm install'
                sh 'npm run build'

                // Debug ENV giống GitHub Actions
                sh '''
                    echo "===== ENV VARIABLES ====="
                    printenv | sort
                    echo "========================="
                '''

                // Lưu artifact (dist giống GitHub)
                stash includes: 'dist/**', name: 'react-build'
            }
        }

        stage('Deploy on Node shop') {
          agent { label 'shop' }

          steps {
              unstash 'react-build'

              sh '''
                  echo "Deploying to server path..."
                  sudo mkdir -p ${DEPLOY_PATH}
                  sudo cp -r dist/* ${DEPLOY_PATH}
              '''

              sh '''
                  echo "Deployed files:"
                  sudo ls -la ${DEPLOY_PATH}
              '''
          }
      }
    }
}