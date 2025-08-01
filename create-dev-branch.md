# Development Branch Setup

## Quick Setup Commands

Run these commands in PowerShell to create a development branch:

```powershell
# Create and switch to development branch
git checkout -b develop

# Push the new branch to GitHub
git push -u origin develop

# Switch back to master
git checkout master

# Verify branches
git branch -a
```

## Continuous Deployment Workflow

### Branches:
- **`master`** - Production branch (auto-deploys to main site)
- **`develop`** - Development branch (for testing features)

### Workflow:
1. **Work on features** in `develop` branch
2. **Test changes** locally with `npm run dev`
3. **Push to develop** for staging deployment
4. **Merge to master** when ready for production

### GitHub Secrets Setup:
To enable the GitHub Actions workflow, add these secrets in your GitHub repository:

1. Go to GitHub → Your Repository → Settings → Secrets and Variables → Actions
2. Add these secrets:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NETLIFY_AUTH_TOKEN`: Get from Netlify → User Settings → Personal Access Tokens
   - `NETLIFY_SITE_ID`: Get from Netlify → Site Settings → Site Details

### Benefits:
- ✅ Automatic builds on every push
- ✅ Separate staging and production environments
- ✅ Pull request previews
- ✅ Build status checks
- ✅ Rollback capabilities

## **Why This Happens:**
- Git commands like `git branch -a`, `git log`, `git diff` automatically use a pager when output is long
- The pager shows `(END)` and waits for you to press keys like:
  - `q` to quit
  - `Enter` to scroll down
  - `Space` to page down

## **How to Fix It:**

**Option 1: Disable Git Pager Globally**
```powershell
<code_block_to_apply_changes_from>
```

**Option 2: Use `--no-pager` Flag**
```powershell
git --no-pager status
git --no-pager branch -a
git --no-pager log --oneline
```

**Option 3: Set Git to Use `cat` Instead**
```powershell
git config --global core.pager cat
```

## **Quick Fix for Your Current Session:**
Try running this command to disable the pager:
```powershell
git config --global core.pager ""
```

Then git commands won't get stuck waiting for input anymore!

**Pro Tip:** This is why I created the `push-to-repo.bat` file - it avoids these pager issues entirely by running simple git commands that don't trigger the pager.

## Git Pager Fix Script

Create this batch file to fix git pager issues:

**File: `fix-git-pager.bat`**
```bat
@echo off
echo Fixing Git pager settings to prevent terminal getting stuck...
echo.

echo Setting core.pager to empty (disables pager)...
git config --global core.pager ""

echo Setting pager.branch to false...
git config --global pager.branch false

echo Setting pager.status to false...
git config --global pager.status false

echo Setting pager.log to false...
git config --global pager.log false

echo Setting pager.diff to false...
git config --global pager.diff false

echo.
echo ✅ Git pager settings fixed!
echo Now git commands won't get stuck in pagers anymore.
echo.
pause
```

**Or run these commands manually:**
```powershell
git config --global core.pager ""
git config --global pager.branch false
git config --global pager.status false
git config --global pager.log false
git config --global pager.diff false
```

**After running the fix, test with:**
```powershell
git status
git branch -a
git add .
git commit -m "Add continuous deployment setup"
git push
```

✅ **No more terminal freezing!**