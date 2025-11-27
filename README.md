# Task Manager App – DevOps Pipeline Documentation

## 📌 Project Overview

You built a **Task Manager Web App** using:

- **TypeScript + HTML** for frontend
- **MongoDB** as database
- **Docker** for containerization
- **GitHub Actions** for CI/CD
- **AWS EC2** for deployment using Docker Compose

Your goal was to create a small end-to-end DevOps pipeline with **3 environments**:

- `dev`
- `test`
- `main` (production)

---

## 📁 Branch Strategy

```
main  → Production
test  → Testing/Staging
dev   → Development branch
```

### ✔ dev
- Developers push code here
- CI workflow runs:
  - Install dependencies
  - Lint
  - Test
  - Build

### ✔ test
- PRs are created from `dev` → `test`
- This branch verifies the deployment workflow correctness before `main`

### ✔ main
- Final production branch
- Merges from `test` → `main`
- Triggers production deployment

---

## ⚙️ CI Workflow (GitHub Actions)

### Trigger

```yaml
on:
  push:
    branches: [ "dev" ]
```

### Steps

1. Checkout code
2. Install Node.js
3. Install dependencies
4. Run tests
5. Run lint
6. Build Docker image (optional)
7. Save artifacts (optional)

This workflow ensures your app is always in a working state before merging to `test`.

---

## 🚀 CD Workflow (GitHub Actions)

### Trigger

```yaml
on:
  push:
    branches: [ "test", "main" ]
```

### Steps

1. Build Docker image
2. Tag image (e.g. `username/task-manager:${GITHUB_SHA}`)
3. Push to Docker Hub
4. SSH into EC2 instance
5. Pull latest image
6. Restart containers using `docker-compose`

---

## 🐳 Docker Setup

### Dockerfile
- Produces small, secure image
- Used by both CI and CD workflows

### docker-compose.yml (on EC2)

```yaml
version: "3.8"

services:
  mongo:
    image: mongo:7
    restart: unless-stopped
    volumes:
      - mongo_data:/data/db

  app:
    image: devsujal/task-manager:${GITHUB_SHA}
    restart: unless-stopped
    ports:
      - "3000:3000"

volumes:
  mongo_data:
```

### How deployment works:
- GitHub Action sets `TAG` value
- EC2 pulls image with that TAG
- Containers start with new version

---

## 🖥️ Deployment Architecture

```
GitHub → GitHub Actions → Docker Hub → EC2 → Docker Compose → Task Manager App
```

---

## 🔄 Workflow Summary

**1️⃣ Developer pushes code to `dev`**  
↳ CI workflow runs

**2️⃣ PR created from `dev` → `test`**  
↳ GitHub checks CI + allows merge

**3️⃣ When merged into `test`**  
↳ CD workflow deploys to EC2 (staging)

**4️⃣ PR created from `test` → `main`**  
↳ Final merge triggers production deployment

---

## 🛠️ Tools Used

| Tool | Purpose |
|------|---------|
| GitHub Actions | CI/CD |
| Docker | Containerization |
| Docker Hub | Image registry |
| AWS EC2 | Deployment server |
| MongoDB | Database |
| Docker Compose | Multi-container setup |
| Linux (Ubuntu) | Environment |

---

## 📗 Key Learnings

- How to create multi-branch CI/CD workflows
- How to containerize apps
- How to push/pull images from Docker Hub
- How to deploy apps using EC2 + Docker Compose
- How to structure a real DevOps pipeline

---

## 🌐 High-Level Diagram

```
+---------------------+
|  GitHub Repository  |
+---------+-----------+
          |
          | Push to dev
          v
     +---------------+
     |  CI Workflow  |
     +-------+-------+
             |
             | PR dev → test
             v
+--------------------------+
| Merge into test Branch   |
+-------------+------------+
              |
              | CD Workflow
              v
+--------------------------+
| Deploy to EC2 (Staging)  |
+-------------+------------+
              |
              | PR test → main
              v
+-----------------------------------------+
| Merge into main → Production Deployment |
+-----------------------------------------+
```

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

