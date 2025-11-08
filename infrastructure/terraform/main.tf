# Terraform Configuration for Production Infrastructure
# Phase 8.3 - Production Deployment

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "bambisleep-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "bambisleep-chat"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  default     = "production"
}

variable "app_name" {
  description = "Application name"
  default     = "bambisleep-chat"
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  cidr_block = "10.0.0.0/16"
  azs        = ["us-east-1a", "us-east-1b", "us-east-1c"]
  
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  
  enable_nat_gateway = true
  single_nat_gateway = false
  
  tags = {
    Name = "${var.app_name}-vpc"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier = "${var.app_name}-db"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.medium"
  
  allocated_storage     = 100
  max_allocated_storage = 500
  storage_encrypted     = true
  
  db_name  = "bambisleep_prod"
  username = var.db_username
  password = var.db_password
  
  multi_az               = true
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  skip_final_snapshot = false
  final_snapshot_identifier = "${var.app_name}-final-snapshot"
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id      = "${var.app_name}-cache"
  engine          = "redis"
  engine_version  = "7.0"
  node_type       = "cache.t3.medium"
  num_cache_nodes = 1
  port            = 6379
  
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.cache.id]
  
  snapshot_retention_limit = 5
  snapshot_window         = "03:00-05:00"
}

# S3 Bucket for Assets
resource "aws_s3_bucket" "assets" {
  bucket = "${var.app_name}-prod-assets"
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "cdn" {
  enabled = true
  
  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.assets.id}"
  }
  
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.assets.id}"
    viewer_protocol_policy = "redirect-to-https"
    
    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.app_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnet_ids
  
  enable_deletion_protection = true
}

# Outputs
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "redis_endpoint" {
  value = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "cdn_domain" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}
