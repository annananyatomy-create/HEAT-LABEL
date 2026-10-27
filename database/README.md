# HEAT LABEL — MySQL Database Setup Guide

This guide provides step-by-step instructions for provisioning, configuring, and verifying the `heat_label_db` database for the **HEAT LABEL Sustainable Heat Treatment Management System**.

---

## 1. Prerequisites
- **MySQL Server 8.0+** or **MariaDB 10.5+**
- **MySQL Workbench**, **DBeaver**, or MySQL Command Line Client (`mysql`)
- Optional: **Docker** (for instant zero-install setup)

---

## 2. Option A: Fast Local MySQL Setup (CLI / Workbench)

### Step 1: Log in to MySQL as Root
```bash
mysql -u root -p
```

### Step 2: Create Application User (Security Best Practice)
Never run desktop production or student evaluation apps with the `root` account. Run:
```sql
CREATE DATABASE IF NOT EXISTS heat_label_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'heat_user'@'localhost' IDENTIFIED BY 'HeatSecret#2026';
GRANT ALL PRIVILEGES ON heat_label_db.* TO 'heat_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 3: Run the Schema and Seed Scripts
From your terminal in the project root:
```bash
# Execute DDL schema creation
mysql -u heat_user -p heat_label_db < database/schema.sql

# Execute realistic industrial seed data
mysql -u heat_user -p heat_label_db < database/seed_data.sql
```

*Or inside MySQL Workbench: open `database/schema.sql`, execute it (Ctrl+Shift+Enter), then open `database/seed_data.sql` and execute.*

---

## 3. Option B: Instant Setup with Docker

If you have Docker installed, you can launch a dedicated MySQL 8.0 instance preloaded with data in one command:

```bash
docker run -d \
  --name heat-label-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=heat_label_db \
  -e MYSQL_USER=heat_user \
  -e MYSQL_PASSWORD=HeatSecret#2026 \
  mysql:8.0

# Wait 5 seconds, then import schema and seeds:
docker exec -i heat-label-mysql mysql -uheat_user -pHeatSecret#2026 heat_label_db < database/schema.sql
docker exec -i heat-label-mysql mysql -uheat_user -pHeatSecret#2026 heat_label_db < database/seed_data.sql
```

---

## 4. Verification Queries

Run the following SQL queries to verify your database is properly seeded:

```sql
USE heat_label_db;

-- 1. Verify table counts
SELECT 'users' AS tbl, COUNT(*) AS count FROM users
UNION ALL
SELECT 'materials', COUNT(*) FROM materials
UNION ALL
SELECT 'treatment_batches', COUNT(*) FROM treatment_batches
UNION ALL
SELECT 'energy_records', COUNT(*) FROM energy_records
UNION ALL
SELECT 'waste_records', COUNT(*) FROM waste_records
UNION ALL
SELECT 'emission_factors', COUNT(*) FROM emission_factors;

-- 2. Inspect the Sustainability Summary View
SELECT batch_code, treatment_type, material_grade, total_energy_kwh, 
       total_emissions_kg_co2e, energy_kwh_per_kg, waste_rejection_percentage
FROM v_batch_sustainability_summary;
```

---

## 5. Default User Credentials

| Username | Default Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| `admin` | `Admin@123` | `ADMIN` | Full CRUD, user management, emission factor configuration |
| `operator1` | `Operator@123` | `OPERATOR` | Create/edit batches, log energy meter readings, record scrap |
| `auditor` | `Operator@123` | `SUSTAINABILITY_AUDITOR` | View SDG dashboards, run emissions audits, export reports |

*Note: All passwords stored in `users.password_hash` are secured with standard **BCrypt salted hashing**.*
