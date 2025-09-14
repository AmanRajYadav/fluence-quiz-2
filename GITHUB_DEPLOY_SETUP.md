# 🚀 GitHub Deployment Setup for Fluence Quiz App

This guide explains how to deploy the Fluence Quiz App to GitHub Pages with automatic deployment when JSON quiz files are updated.

## 📋 Prerequisites

1. **GitHub Repository**: Push this code to a GitHub repository
2. **GitHub Pages**: Enable GitHub Pages in repository settings
3. **Node.js 18+**: For building the React application

## 🔧 Setup Instructions

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### Step 2: Configure Deployment

The `deploy.yml` workflow file is already created in `.github/workflows/` and will:

- ✅ **Auto-deploy** when you push to main/master branch
- ✅ **Validate JSON** files before deployment  
- ✅ **Build React app** and deploy to GitHub Pages
- ✅ **Trigger on quiz updates** when JSON files in `public/data/` are modified

### Step 3: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Fluence Quiz App v2 with GitHub deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/your-username/your-repository-name.git

# Push to main branch
git push -u origin main
```

## 🎯 Automatic Deployment Features

### When Deployment Triggers

The app will automatically redeploy when:

1. **Code Changes**: Any changes to `src/` or `public/` directories
2. **Quiz Content Updates**: Changes to JSON files in `public/data/classes/`
3. **Manual Trigger**: You can manually trigger deployment from GitHub Actions tab

### What Happens During Deployment

1. **📝 JSON Validation**: Checks all quiz JSON files for syntax errors
2. **🏗️ Build Process**: Compiles React app for production
3. **📚 Content Validation**: Verifies quiz structure (chapterInfo, questions, etc.)
4. **🚀 Deployment**: Publishes to GitHub Pages
5. **📱 Live Update**: Students can immediately access updated content

## 📊 Editing Quiz Content Directly on GitHub

### For JSON Quiz Files:

1. Navigate to your repository on GitHub
2. Go to `public/data/classes/class6/[subject]/[chapter].json`
3. Click **Edit this file** (pencil icon)
4. Make your changes to questions, options, or explanations
5. Scroll down and click **Commit changes**
6. The app will automatically redeploy with your updates!

### Example: Updating Mathematics Quiz

```json
{
  "chapterInfo": {
    "class": 6,
    "subject": "mathematics", 
    "chapterName": "Lines and Angles",
    "totalQuestions": 30,
    "difficulty": "easy"
  },
  "questions": [
    {
      "id": 1,
      "question": "A tiny dot that determines a precise location is called a:",
      "options": ["Line", "Point", "Ray", "Plane"],
      "correct": 1,
      "explanation": "A point determines a precise location but has no dimensions.",
      "topic": "Point"
    }
  ]
}
```

## 🔍 Monitoring Deployments

### Check Deployment Status:

1. Go to **Actions** tab in your GitHub repository
2. See real-time deployment progress
3. View logs for any errors or warnings
4. Confirm successful deployment

### Deployment URL:

After first successful deployment, your app will be available at:
```
https://your-username.github.io/your-repository-name/
```

## 📱 Student Access

Once deployed, students can:

- ✅ Access the quiz app from any device
- ✅ See updated content immediately after you edit JSON files
- ✅ Use all features: course progress, quizzes, leaderboards
- ✅ Data persists in browser localStorage

## 🛠️ Advanced Configuration

### Custom Domain (Optional):

1. Add a `CNAME` file to `public/` directory
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings

### Environment Variables:

Add secrets in **Settings** → **Secrets and variables** → **Actions** for:
- API keys
- Custom configuration
- Third-party service tokens

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**: Check package.json dependencies
2. **JSON Errors**: Validate JSON syntax before committing
3. **404 Errors**: Ensure GitHub Pages is enabled
4. **Slow Loading**: Check if all assets are in public/ directory

### Debug Steps:

1. Check **Actions** tab for build logs
2. Verify JSON files with online validators
3. Test locally with `npm run build`
4. Check browser console for JavaScript errors

## 📈 Best Practices

### For Quiz Content:

- ✅ Always validate JSON before committing
- ✅ Use consistent question numbering
- ✅ Include explanations for all answers
- ✅ Test questions locally first

### For Deployment:

- ✅ Use descriptive commit messages
- ✅ Test changes in development first
- ✅ Monitor deployment status
- ✅ Keep backup of important quiz data

## 🎓 Quick Start Checklist

- [ ] Repository created on GitHub
- [ ] GitHub Pages enabled
- [ ] Code pushed to main branch
- [ ] First deployment successful
- [ ] App URL accessible
- [ ] JSON editing tested
- [ ] Students can access app

---

**🎯 Ready to deploy!** Your Fluence Quiz App will automatically update whenever you edit quiz questions directly on GitHub!