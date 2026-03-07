# ============================================================
# Anemonet Brand Design — GCP / Firebase インフラ構成
# ============================================================
# 運用前提:
#   - Firebase Spark プラン（無料枠）
#   - Terraform state はローカル管理（GCS 不使用）
#   - カスタムドメイン: anemone.dev
# ============================================================

terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    google-beta = {
      # Firebase Hosting リソースは google-beta provider が必要
      source  = "hashicorp/google-beta"
      version = "~> 6.0"
    }
  }

  # Terraform state はローカル管理（デフォルト: terraform.tfstate）
  backend "local" {}
}

# ============================================================
# Provider 設定
# ============================================================

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# ============================================================
# GCP プロジェクト作成
# ============================================================

resource "google_project" "main" {
  name       = var.project_id
  project_id = var.project_id

  # 個人アカウントの場合は org_id を空にする
  # org_id が空の場合はトップレベルプロジェクトとして作成される
  org_id = var.org_id != "" ? var.org_id : null

  # billing_account が指定されている場合のみ紐付け
  billing_account = var.billing_account != "" ? var.billing_account : null

  # Spark プランではプロジェクト削除保護を無効にしておく（開発用途）
  deletion_policy = "DELETE"
}

# ============================================================
# Firebase プロジェクトの有効化
# ============================================================

resource "google_firebase_project" "main" {
  provider = google-beta
  project  = google_project.main.project_id

  depends_on = [google_project.main]
}

# ============================================================
# Firebase Hosting サイト作成
# ============================================================

resource "google_firebase_hosting_site" "main" {
  provider = google-beta
  project  = google_project.main.project_id

  # site_id はデフォルトで project_id と同じになる
  # 明示的に指定することで変更に強くする
  site_id = var.project_id

  depends_on = [google_firebase_project.main]
}

# ============================================================
# カスタムドメイン設定（anemone.dev）
# ============================================================

resource "google_firebase_hosting_custom_domain" "main" {
  provider = google-beta
  project  = google_project.main.project_id
  site_id  = google_firebase_hosting_site.main.site_id

  # カスタムドメイン（DNS の TXT / A / AAAA レコード設定が別途必要）
  custom_domain = var.custom_domain

  # ドメイン所有権の検証が完了するまで待機
  wait_dns_verification = false

  depends_on = [google_firebase_hosting_site.main]
}
