# ============================================================
# 変数定義
# ============================================================
# 機密情報はここに直接書かず terraform.tfvars に記載すること
# terraform.tfvars は .gitignore で除外済み
# ============================================================

variable "project_id" {
  description = "GCP プロジェクト ID（グローバルで一意である必要がある）"
  type        = string
}

variable "billing_account" {
  description = "GCP 請求アカウント ID（Spark プランでも将来的に必要になる場合がある。不要な場合は空文字列を指定）"
  type        = string
  default     = ""
}

variable "org_id" {
  description = "GCP 組織 ID（個人アカウントの場合は空文字列を指定）"
  type        = string
  default     = ""
}

variable "region" {
  description = "GCP リージョン"
  type        = string
  default     = "asia-northeast1"
}

variable "custom_domain" {
  description = "Firebase Hosting に設定するカスタムドメイン"
  type        = string
  default     = "anemone.dev"
}
