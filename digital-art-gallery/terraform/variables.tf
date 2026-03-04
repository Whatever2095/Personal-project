# Cloudflare API token from environment variable
variable "cloudflare_api_token" {
  description = "API token for Cloudflare, set via environment variable CLOUDFLARE_API_TOKEN"
  type        = string
  sensitive   = true
  default     = "" # empty default, will be overridden by env variable
}

# Cloudflare account ID
variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

# R2 bucket name
variable "r2_bucket_name" {
  description = "Name of the R2 bucket"
  type        = string
}

# R2 bucket location
variable "r2_bucket_location" {
  description = "Region/location of the R2 bucket"
  type        = string
  default     = "EEUR"
}
