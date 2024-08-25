# devops-api

Este projeto é um exemplo de servidor Node.js usando Express, com uma rota dedicada para calcular o número de colisoes de partículas em um acelerador de partículas fictício. Projeto criado com o intuito de implementar práticas de Devops no contexto da disciplina de Práticas de Devops do IMD/UFRN.

## Estrutura do Projeto

```
devops-api/
├── src/
│   ├── collisions/
│   │   ├── collision.route.js
│   │   ├── collisions.service.js
│   │   └── collisions.test.js
│   └── server.js
├── .gitignore
├── README.md
├── api.http
├── package.json
└── yarn.lock
```

## Requisitos

- Node.js
- Yarn

## Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd devops-api
   ```

2. Instale as dependências:
   ```bash
   yarn install
   ```

## Executando o Servidor

Para iniciar o servidor, use o seguinte comando:
```bash
yarn start
```

Para executar em modo de desenvolvimento, você pode utilizar:
```bash
yarn dev
```


O servidor estará rodando na porta 3000. Você pode acessar a rota principal em `http://localhost:3000/` e a rota de cálculo de colisoes em `http://localhost:3000/collisions?energy=10000&particles=200`.

## Estrutura de Pastas

- `src/collisions/collision.route.js`: Configura a rota `/collisions`.
- `src/collisions/collisions.service.js`: Contém a função para calcular o número de colisoes de partículas.
- `src/collisions/collisions.test.js`: Contém os testes para a função de cálculo de colisoes.
- `src/server.js`: Configura o servidor e importa as rotas.

## Testes

Este projeto utiliza Jest para testes. Os testes estão localizados em `src/collisions/collisions.test.js`.

Para rodar os testes, use o seguinte comando:
```bash
yarn test
```

## Exemplo de Uso

### Rota Principal

A rota principal retorna informações sobre o servidor, incluindo a data e hora de início e a versão do projeto conforme definido no `package.json`.

Exemplo:
```bash
curl http://localhost:3000/
```
Resposta:
```json
{
  "message": "Server Information",
  "startTime": "2024-07-09T10:00:00.000Z",
  "version": "1.0.0"
}
```

### Rota de Colisoes de Partículas

A rota `/collisions` calcula o número de colisoes de partículas com base na energia e no número de partículas fornecidos como parâmetros de consulta.

Exemplo:
```bash
curl "http://localhost:3000/collisions?energy=10000&particles=200"
```
Resposta:
```json
{
  "energy": 10000,
  "particles": 200,
  "collisions": 400000
}
```
## CI/CD Pipeline e Infraestrutura na Nuvem

Este projeto configura e gerencia a infraestrutura na nuvem e a implantação de aplicações utilizando Terraform, Kubernetes e Docker. O pipeline CI/CD foi configurado para automatizar o processo de build, teste, empacotamento e push de imagens Docker, bem como a implantação em ambientes gerenciados pelo Google Cloud. Além disso, o pipeline automatiza a criação e o gerenciamento da infraestrutura, incluindo clusters do Google Kubernetes Engine (GKE) e serviços no Google Cloud Run, garantindo uma integração contínua e entrega contínua (CI/CD) eficiente e escalável.

## Estrutura do Projeto

- `.gitlab-ci.yml`: Automatiza o fluxo de trabalho de desenvolvimento e implantação.
- `/k8s/`: Orquestra os contêineres Docker e configura o serviço e o Ingress.
- `Dockerfile`: Empacota a aplicação em imagens e as envia para o registro.
- `gke`: Gerencia a infraestrutura na nuvem, incluindo clusters Kubernetes.

## Variáveis de Ambiente

- `GCP_PROJECT_ID`: ID do projeto no Google Cloud.
- `GCP_DOCKER_REPO`: Nome do repositório no Google Artifact Registry.
- `GCLOUD_SERVICE_KEY`: Chave de autenticação do serviço, codificada em base64.
- `GKE_ZONE`: Zona onde o cluster GKE está localizado.
- `GKE_CLUSTER_NAME`: Nome do cluster GKE.
- `DEPLOYMENT_NAME`: Nome do deployment no Kubernetes.
- `SERVICE_NAME`: Nome do serviço no Google Cloud Run.
- `GOOGLE_REGION`: Região onde o serviço será implantado no Google Cloud Run.

### 1. Build (build-job)

Esta etapa instala as dependências do projeto utilizando yarn.

```yaml
build-job:
  stage: build  #define a etapa do pipeline em que este job será executado.
  script:
    - yarn install  #instala todas as dependências do projeto listadas no arquivo package.json.
  cache:
    paths:
      - node_modules/  #cacheia o diretório de dependências para acelerar a instalação em builds futuros.
      - .yarn/cache    #cacheia o cache do Yarn para melhorar a performance da instalação das dependências.

```
## 2. Testes (test-job)

Nesta etapa, os testes automatizados do projeto são executados para garantir a qualidade do código.

```yaml
test-job:
  stage: test  #define a etapa do pipeline em que este job será executado.
  script:
    - yarn install  #instala todas as dependências necessárias do projeto.
    - yarn test     #executa os testes automatizados definidos no projeto.
  cache:
    paths:
      - node_modules/  #cacheia o diretório de dependências para acelerar builds futuros.
      - .yarn/cache    #ccheia o cache do Yarn para melhorar a performance de instalação.
```

## 3. Empacotamento da Imagem Docker (package-docker)

A imagem Docker da aplicação é construída e salva como um artefato.

```yaml
package-docker:
  image: docker:24.0.0  #define a imagem Docker que será usada para este job, que fornece o ambiente para executar comandos Docker.
  stage: package  #especifica a etapa do pipeline em que este job será executado. A etapa `package` é usada para empacotar a aplicação.
  services:
    - docker:24.0.0-dind  #adiciona o serviço Docker-in-Docker (dind) para permitir a execução de comandos Docker dentro do job.
  script:
    - docker build -t $CI_PROJECT_NAME:${CI_COMMIT_REF_NAME//\//-} .  #constrói a imagem Docker e a marca com o nome do projeto e a referência do commit.
    - docker save -o docker_image.tar $CI_PROJECT_NAME:${CI_COMMIT_REF_NAME//\//-}  #salva a imagem Docker construída em um arquivo tar para uso posterior.
  artifacts:
    paths:
      - docker_image.tar  #define o caminho para o artefato que será salvo e disponibilizado para outros jobs no pipeline.
    expire_in: 1 hour  #define o tempo de expiração para o artefato. Após 1 hora, o artefato será removido.

```
## 4. Push da Imagem para o GitLab Registry (push-gitlab)

A imagem Docker empacotada é enviada para o GitLab Container Registry.

```yaml
push-gitlab:
  image: docker:24.0.0  #fefine a imagem Docker usada para este job, proporcionando o ambiente para executar comandos Docker.
  stage: push-image  #especifica que este job faz parte da etapa de push de imagem no pipeline.
  needs:
    - job: package-docker  #indica que este job depende da conclusão do job `package-docker` antes de ser executado.
  services:
    - docker:24.0.0-dind  #adiciona o serviço Docker-in-Docker (dind) para permitir a execução de comandos Docker dentro do job.
  script:
    - docker load -i docker_image.tar  #carrega a imagem Docker do arquivo tar criado na etapa de empacotamento.
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY  #faz login no registro Docker do GitLab usando credenciais fornecidas.
    - docker tag $CI_PROJECT_NAME:${CI_COMMIT_REF_NAME//\//-} $CI_REGISTRY_IMAGE:${CI_COMMIT_REF_NAME//\//-}  #marca a imagem Docker com o nome do registro GitLab e a referência do commit.
    - docker push $CI_REGISTRY_IMAGE:${CI_COMMIT_REF_NAME//\//-}  #envia a imagem Docker para o registro GitLab.
```

## 5. Push da Imagem para o Google Artifact Registry (push-gcloud)

A imagem Docker é empacotada e enviada para o Google Artifact Registry para ser utilizada no processo de deployment. Este estágio é responsável por carregar a imagem Docker, configurá-la para o Google Artifact Registry e, finalmente, empurrá-la para o registro.

```yaml
push-gcloud:
  image: google/cloud-sdk:latest
  stage: push-image
  variables:
    DOCKER_HOST: "tcp://docker:2375"
  services:
    - docker:24.0.0-dind
  needs:
    - job: package-docker
  before_script:
    # Autenticação no Google Cloud
    - echo $GCLOUD_SERVICE_KEY | base64 -d > ${HOME}/gcloud-service-key.json
    - gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
    - gcloud config set project $GCP_PROJECT_ID
  script:
    - docker load -i docker_image.tar
    - gcloud auth configure-docker us-central1-docker.pkg.dev
    - docker tag $CI_PROJECT_NAME:${CI_COMMIT_REF_NAME//\//-} us-central1-docker.pkg.dev/$GCP_PROJECT_ID/$GCP_DOCKER_REPO/$CI_PROJECT_NAME:${CI_COMMIT_REF_NAME//\//-}
    - docker tag $CI_PROJECT_NAME:${CI_COMMIT_REF_NAME//\//-} us-central1-docker.pkg.dev/$GCP_PROJECT_ID/$GCP_DOCKER_REPO/$CI_PROJECT_NAME:latest
    - docker push us-central1-docker.pkg.dev/$GCP_PROJECT_ID/$GCP_DOCKER_REPO/$CI_PROJECT_NAME:${CI_COMMIT_REF_NAME//\//-}
    - docker push us-central1-docker.pkg.dev/$GCP_PROJECT_ID/$GCP_DOCKER_REPO/$CI_PROJECT_NAME:latest
```

## 6. Configuração da Infraestrutura com Terraform (prepare-infra)

O estágio prepare-infra configura a infraestrutura na nuvem utilizando o Terraform. Este estágio é responsável por inicializar o Terraform, importar o estado do cluster Kubernetes, gerar um plano de execução e aplicar as mudanças necessárias na infraestrutura.

```yaml
prepare-infra:
  stage: prepare-to-deploy
  image:
    name: hashicorp/terraform:1.9.5
    entrypoint:
      - '/usr/bin/env'
      - 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
  needs: []
  variables:
    TF_ROOT: "./terraform/gke"  # Caminho para a configuração do Terraform
    TF_VAR_project_id: "devops-lourrayni-2024"  # ID do projeto no Google Cloud
    TF_VAR_region: "us-central1"  # Região para o cluster GKE
    TF_VAR_cluster_name: "autopilot-cluster-2"  # Nome do cluster GKE
  before_script:
    # Autenticação no Google Cloud
    - echo "$GCLOUD_SERVICE_KEY" | base64 -d > /tmp/account.json
    - export GOOGLE_APPLICATION_CREDENTIALS=/tmp/account.json
    - echo $GOOGLE_APPLICATION_CREDENTIALS
  script:
    - terraform --version  # Exibe a versão do Terraform para confirmação
    - cd $TF_ROOT
    - terraform init        # Inicializa o Terraform com a configuração fornecida
    - terraform import google_container_cluster.primary projects/$GCP_PROJECT_ID/locations/$GKE_ZONE/clusters/$GKE_CLUSTER_NAME || true
      # Importa o estado do cluster GKE existente para o Terraform
    - terraform plan -out=tfplan  # Gera um plano de execução com as mudanças propostas
    - terraform apply -auto-approve tfplan  # Aplica as mudanças no Terraform automaticamente
  environment:
    name: production
    url: https://console.cloud.google.com/kubernetes/list
```

## 7. Deploy no Google Cloud Run (deploy-to-gcp)

Este estágio realiza o deployment da imagem Docker no Google Cloud Run, um serviço gerenciado de contêineres. Ele faz o deploy da imagem empurrada para o Google Artifact Registry, configurando o serviço para rodar na plataforma do Google Cloud Run.

```yaml
deploy-to-gcp:
  image: google/cloud-sdk:latest
  stage: deploy
  needs:
    - job: push-gcloud
  variables:
    SERVICE_NAME: devops-api
    GOOGLE_REGION: us-central1
    IMAGE_NAME: us-central1-docker.pkg.dev/devops-lourrayni-2024/devops-registry/devops-api:latest
  before_script:
    - echo $GCLOUD_SERVICE_KEY | base64 -d > ${HOME}/gcloud-service-key.json
    - gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
    - gcloud config set project $GCP_PROJECT_ID
  script:
    - gcloud run deploy $SERVICE_NAME --port 3000 --image $IMAGE_NAME --region $GOOGLE_REGION --platform managed --allow-unauthenticated
```

## 8. Deploy no Google Kubernetes Engine (GKE) (deploy-to-gke)

Este job realiza o deploy da aplicação no Google Kubernetes Engine (GKE).

```yaml
deploy-to-gke:
  image: google/cloud-sdk:latest
  stage: deploy
  needs:
    - job: push-gcloud
  variables:
    GKE_ZONE: us-central1
    GKE_CLUSTER_NAME: autopilot-cluster-2
    DEPLOYMENT_NAME: devops-api-deployment
  before_script:
    - echo $GCLOUD_SERVICE_KEY | base64 -d > ${HOME}/gcloud-service-key.json
    - gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
    - gcloud config set project $GCP_PROJECT_ID
    - gcloud config set compute/zone $GKE_ZONE
    - gcloud container clusters get-credentials $GKE_CLUSTER_NAME
  script:
    - kubectl apply -f ./k8s
    - kubectl rollout restart deployment $DEPLOYMENT_NAME
```

## Como o Pipeline Funciona

- **Build:** As dependências são instaladas, e a aplicação é preparada para ser testada.
- **Testes:** Os testes automatizados são executados para garantir a integridade do código.
- **Empacotamento:** A aplicação é empacotada em uma imagem Docker, que é salva como artefato.
- **Push da Imagem:** A imagem Docker é enviada tanto para o GitLab Container Registry quanto para o Google Artifact Registry.
- **Prepare Infraestrutura:** O Terraform é utilizado para provisionar e gerenciar a infraestrutura na nuvem. Este estágio configura os recursos necessários no Google Cloud Platform, como clusters Kubernetes no GKE, para garantir que a infraestrutura esteja pronta para suportar a aplicação. O Terraform automatiza o processo de criação e configuração dos recursos, assegurando que estejam alinhados com as especificações definidas no código.
- **Deploy:** A aplicação é implantada no Google Cloud Run ou no Google Kubernetes Engine (GKE), dependendo do ambiente de destino.

## Probes

No projeto, os probes são utilizados para monitorar a saúde e a prontidão dos pods em um deployment Kubernetes. Eles garantem que as instâncias da aplicação estejam funcionando corretamente e prontas para receber tráfego.

## Acessando a Aplicação

Após a conclusão do processo de deployment, a aplicação estará acessível através do endereço DNS configurado. Pode acessar a aplicação utilizando o seguinte link:

URL de Acesso: http://34.49.254.255.nip.io/

Este link é fornecido pelo serviço de DNS dinâmico nip.io, que mapeia o IP externo do serviço para um nome de domínio acessível.
