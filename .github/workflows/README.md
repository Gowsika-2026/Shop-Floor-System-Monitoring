# GitHub Actions Workflows

This directory contains automated workflows for the Shop-floor Resource Allocation System.

## 📋 Available Workflows

### 1. CI/CD Pipeline (`ci.yml`)
**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual trigger via workflow_dispatch

**Jobs:**
- ✅ **Lint & Code Quality** - ESLint and Prettier checks
- 🏗️ **Build Backend** - TypeScript compilation and artifact upload
- 🎨 **Build Frontend** - Vite production build and artifact upload
- 🔒 **Security Audit** - npm audit for vulnerabilities
- 📝 **Type Check** - TypeScript type validation
- 📊 **Deployment Summary** - Status summary and PR comments

**Usage:**
```bash
# Automatically runs on every push/PR
git push origin main

# Manual trigger
# Go to Actions → CI/CD Pipeline → Run workflow
```

---

### 2. Deploy to Production (`deploy.yml`)
**Triggers:**
- Push to `main` branch
- Version tags (e.g., `v1.0.0`)
- Manual trigger with environment selection

**Jobs:**
- 🎯 **Prepare** - Determine version and environment
- 🏗️ **Build** - Build backend and frontend, create deployment package
- 🚀 **Deploy** - Deploy to staging/production environment
- ✅ **Verify** - Post-deployment smoke tests

**Environments:**
- `staging` - Automatic deployment on main branch push
- `production` - Deployment on version tags or manual trigger

**Usage:**
```bash
# Deploy to production via tag
git tag v1.0.0
git push origin v1.0.0

# Manual deployment
# Go to Actions → Deploy to Production → Run workflow → Select environment
```

**Configuration Required:**
Add these secrets in GitHub Settings → Secrets:
- `VITE_API_URL` - Frontend API URL

---

### 3. Code Quality & Maintenance (`code-quality.yml`)
**Triggers:**
- Push to `main` branch
- Pull requests to `main`
- Scheduled: Every Monday at 9 AM UTC
- Manual trigger

**Jobs:**
- 🔍 **Code Quality Analysis** - ESLint with JSON reports
- 🔒 **Dependency Audit** - Security vulnerability scanning
- 📦 **Dependency Check** - Check for outdated packages
- 📊 **Bundle Analysis** - Frontend bundle size analysis (PR only)
- 📈 **Code Metrics** - Lines of code and file counts
- 📋 **Quality Report** - Comprehensive summary

**Usage:**
```bash
# Automatically runs on schedule
# Or manually trigger:
# Go to Actions → Code Quality & Maintenance → Run workflow
```

---

## 🚀 Setting Up Workflows

### Step 1: Enable GitHub Actions
1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Select "Allow all actions and reusable workflows"
4. Click **Save**

### Step 2: Configure Secrets (Optional)
For deployment workflows, add these secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - `VITE_API_URL` - Your API endpoint URL
   - Any cloud provider credentials (AWS, Azure, GCP)
   - SSH keys for server deployment

### Step 3: Configure Environments (Optional)
For protected deployments:

1. Go to **Settings** → **Environments**
2. Create `staging` and `production` environments
3. Add protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches

### Step 4: Commit Workflow Files
```bash
git add .github/workflows/
git commit -m "Add GitHub Actions workflows"
git push origin main
```

---

## 📊 Workflow Status Badges

Add these badges to your README.md:

```markdown
![CI/CD Pipeline](https://github.com/Gowsika-2026/Shop-Floor-System-Monitoring/actions/workflows/ci.yml/badge.svg)
![Deployment](https://github.com/Gowsika-2026/Shop-Floor-System-Monitoring/actions/workflows/deploy.yml/badge.svg)
![Code Quality](https://github.com/Gowsika-2026/Shop-Floor-System-Monitoring/actions/workflows/code-quality.yml/badge.svg)
```

---

## 🔧 Customization

### Modify Triggers
Edit the `on:` section in any workflow:

```yaml
on:
  push:
    branches: [main, develop, feature/*]
  pull_request:
    types: [opened, synchronize, reopened]
```

### Add New Jobs
Add jobs to existing workflows:

```yaml
jobs:
  my-custom-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Custom step
        run: echo "Hello World"
```

### Modify Node Version
Change the Node.js version:

```yaml
env:
  NODE_VERSION: '20.x'  # Update to desired version
```

---

## 📝 Best Practices

### 1. Branch Protection
Configure branch protection for `main`:
- Require status checks to pass
- Require pull request reviews
- Require up-to-date branches

### 2. Caching Dependencies
Workflows use npm caching:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

### 3. Artifact Retention
Artifacts are kept for 7-30 days:
```yaml
- uses: actions/upload-artifact@v4
  with:
    retention-days: 7
```

### 4. Security
- Never commit secrets to workflows
- Use GitHub Secrets for sensitive data
- Enable secret scanning in repository settings

---

## 🐛 Troubleshooting

### Workflow Fails on npm ci
**Issue:** Package-lock.json out of sync

**Solution:**
```bash
cd backend && npm install
cd ../frontend && npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

### Build Fails
**Issue:** Missing environment variables

**Solution:**
Add required secrets in GitHub Settings → Secrets

### Permission Denied
**Issue:** Workflow can't push/create releases

**Solution:**
1. Go to Settings → Actions → General
2. Under "Workflow permissions", select:
   - "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Reusable Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────┐
│  Push to main / PR / Schedule / Manual      │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │   CI Pipeline  │
         └────────┬───────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
    ┌─────┐  ┌──────┐  ┌──────┐
    │Lint │  │Build │  │Audit │
    └─────┘  └──────┘  └──────┘
        │         │         │
        └─────────┼─────────┘
                  │
                  ▼
            ┌──────────┐
            │  Deploy  │
            └────┬─────┘
                  │
                  ▼
            ┌──────────┐
            │  Verify  │
            └──────────┘
```

---

**Last Updated:** May 26, 2026  
**Maintained by:** Shop-floor Resource Allocation Team
