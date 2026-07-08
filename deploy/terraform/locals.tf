locals {
  # Every AWS resource name derives from this instead of project_name directly,
  # so multiple environments can coexist in the same AWS account without
  # colliding (e.g. test-room-booking-webapp-site vs production-room-booking-webapp-site).
  resource_prefix = "${var.environment}-${var.project_name}"
}
