#!/usr/bin/env bash
# Builds the React webapp and deploys it to AWS (S3 + CloudFront) via Terraform.
# NOTE: `terraform apply -auto-approve` creates real AWS resources in whatever
# account/credentials are active. Run this deliberately, not from automation.
set -euo pipefail
cd "$(dirname "$0")"

api_dir="../room-booking-api"
if [[ ! -f "${api_dir}/authenticate.sh" ]]; then
  echo "Expected to find the room-booking-api checkout at ${api_dir} (as a sibling of this directory)." >&2
  exit 1
fi

# Populates GRAPHQL_API_URL and GRAPHQL_API_KEY from the deployed API's Terraform outputs.
source "${api_dir}/authenticate.sh"

terraform -chdir=deploy/terraform init
terraform -chdir=deploy/terraform apply -auto-approve

site_bucket="$(terraform -chdir=deploy/terraform output -raw site_bucket_name)"
distribution_id="$(terraform -chdir=deploy/terraform output -raw cloudfront_distribution_id)"
site_url="$(terraform -chdir=deploy/terraform output -raw site_url)"

cat > webapp/.env.production <<EOF
VITE_GRAPHQL_API_URL=${GRAPHQL_API_URL}
VITE_GRAPHQL_API_KEY=${GRAPHQL_API_KEY}
EOF

npm --prefix webapp install
npm --prefix webapp run build

aws s3 sync webapp/dist "s3://${site_bucket}" --delete
aws cloudfront create-invalidation --distribution-id "${distribution_id}" --paths "/*" >/dev/null

echo "Deployed: ${site_url}"
