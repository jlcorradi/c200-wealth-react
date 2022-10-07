pipeline {
  agent any
  
  environment {
    AWS_ACCOUNT_ID = '989073812644'
    AWS_REGION = 'us-east-1'
    CONTAINER_NAME = 'c200-wealth-react'
    ECR_PREFIX = '989073812644.dkr.ecr.us-east-1.amazonaws.com'
  }

  stages {
    stage("Git Clone") {
      steps {
        script {
          git credentialsId: 'git', url: 'git@github.com:jlcorradi/c200-wealth-react.git', branch: 'main'
        }
      }
    }

    stage("Build") {
      steps{
        nodejs('jodejs18') {
          sh "npm install --no-audit"
          sh "DISABLE_ESLINT_PLUGIN=true npm run build"
        }
      }
    }

    stage("Deploy") {
      steps{
        script {
          withCredentials([usernamePassword(
          credentialsId: 'AWSC200',
          passwordVariable: 'AWS_SECRET_ACCESS_KEY',
          usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
            docker.withRegistry('https://$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com') {
              sh'''
              aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com;
              docker build -t $ECR_PREFIX/$CONTAINER_NAME:latest .
              docker push $ECR_PREFIX/$CONTAINER_NAME:latest
              '''
            }
          }
        }
      }
    }

    stage('Run in prod') {
      steps{
        script{
          withCredentials([sshUserPrivateKey(credentialsId: "acf-demo-key", keyFileVariable: 'keyfile')]) {
              sh'''
              ssh -i $keyfile -o StrictHostKeyChecking=no ubuntu@ec2-44-192-42-246.compute-1.amazonaws.com "sh ./c200/run-frontend.sh"
              '''
          }
        }
      }
    }

  }
}