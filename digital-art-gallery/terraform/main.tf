terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  # Reads from environment variable CLOUDFLARE_API_TOKEN
  api_token = var.cloudflare_api_token
}

resource "cloudflare_r2_bucket" "art_gallery" {
  account_id = var.cloudflare_account_id
  name       = var.r2_bucket_name
  location   = var.r2_bucket_location
}
