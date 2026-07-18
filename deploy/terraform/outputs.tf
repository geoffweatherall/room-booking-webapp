output "site_bucket_name" {
  description = "Name of the S3 bucket that holds the built webapp assets."
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution, used to create cache invalidations."
  value       = aws_cloudfront_distribution.site.id
}

output "site_url" {
  description = "Public URL of the deployed webapp, via its custom domain (see domain.tf)."
  value       = "https://${local.webapp_domain}"
}
