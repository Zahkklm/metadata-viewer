@echo off
:: Set environment variables
set GCLOUD_PROJECT=juniordev-433112
set REPO=metadata-viewer-app
set REGION=me-west1
set IMAGE=bar-project-image

:: Create the image tag
set IMAGE_TAG=%REGION%-docker.pkg.dev/%GCLOUD_PROJECT%/%REPO%/%IMAGE%

:: Build the image using Docker
docker build -t %IMAGE_TAG% -f C:\Users\ZagorT\Documents\fullstackapp\Dockerfile --platform linux/x86_64 .

:: Push the image to Artifact Registry
docker push %IMAGE_TAG%

pause