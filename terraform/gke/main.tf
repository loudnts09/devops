terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.63.0"
    }
  }
}

provider "google" {
  project     = var.project_id
  region      = var.region
  scopes      = ["https://www.googleapis.com/auth/cloud-platform"]
}

resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region
  enable_autopilot = true
  lifecycle {
    prevent_destroy = true
  }
}

output "kubernetes_cluster_name" {
  value = google_container_cluster.primary.name
}

output "kubernetes_endpoint" {
  value = google_container_cluster.primary.endpoint
}