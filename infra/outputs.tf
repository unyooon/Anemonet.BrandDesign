# ============================================================
# 出力値
# ============================================================

output "project_id" {
  description = "作成された GCP プロジェクト ID"
  value       = google_project.main.project_id
}

output "project_number" {
  description = "作成された GCP プロジェクト番号"
  value       = google_project.main.number
}

output "firebase_hosting_default_url" {
  description = "Firebase Hosting のデフォルト URL（カスタムドメイン設定前に使用）"
  value       = "https://${google_firebase_hosting_site.main.site_id}.web.app"
}

output "firebase_hosting_site_id" {
  description = "Firebase Hosting サイト ID"
  value       = google_firebase_hosting_site.main.site_id
}

output "custom_domain" {
  description = "設定したカスタムドメイン"
  value       = google_firebase_hosting_custom_domain.main.custom_domain
}

output "custom_domain_dns_records" {
  description = "カスタムドメインの DNS 設定に必要なレコード情報"
  value       = google_firebase_hosting_custom_domain.main.required_dns_updates
}
