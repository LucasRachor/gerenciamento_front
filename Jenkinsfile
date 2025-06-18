pipeline {
  agent any

  environment {
    COMPOSE_PROJECT_NAME = "meu_projeto_teste"
  }

  stages {
    stage('Clonar Repositório') {
      steps {
        git 'https://github.com/LucasRachor/gerenciamento_front.git'
      }
    }

    stage('Subir com Docker Compose') {
      steps {
        script {
          sh 'docker-compose down'
          sh 'docker-compose up --build -d'
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline finalizado.'
    }
  }
}
