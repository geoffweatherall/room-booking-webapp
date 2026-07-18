# Custom domain for the webapp's CloudFront distribution. "production"
# deploys to www.mootmaker.com; every other environment gets
# www.<environment>.mootmaker.com. A single wildcard certificate can't cover
# the latter for an arbitrary environment name (ACM/CloudFront wildcards
# only match one subdomain level), so this environment provisions and
# DNS-validates its own certificate for exactly its own hostname - see
# mootmaker-domain's README for the full reasoning. Requires mootmaker-domain
# to already be deployed, and its nameservers configured at the registrar
# with delegation propagated (DNS validation below queries mootmaker.com's
# authoritative nameservers).
locals {
  webapp_domain = var.environment == "production" ? "www.mootmaker.com" : "www.${var.environment}.mootmaker.com"

  # CloudFront's own hosted zone id for ALIAS records - a fixed constant,
  # the same for every CloudFront distribution globally, not looked up.
  cloudfront_hosted_zone_id = "Z2FDTNDATAQYW2"
}

data "aws_route53_zone" "this" {
  name = "mootmaker.com."
}

resource "aws_acm_certificate" "webapp" {
  provider          = aws.us_east_1
  domain_name       = local.webapp_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "webapp_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.webapp.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = data.aws_route53_zone.this.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "webapp" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.webapp.arn
  validation_record_fqdns = [for record in aws_route53_record.webapp_cert_validation : record.fqdn]
}

resource "aws_route53_record" "webapp_a" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = local.webapp_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = local.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "webapp_aaaa" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = local.webapp_domain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = local.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}
