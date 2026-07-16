# Installation & Deployment Guide

This is a **single-page portfolio application** built with React and deployed on GitHub Pages. This guide covers local setup, building, and deployment.

## Prerequisites

- **Node.js** (v18+ recommended)
- **Yarn** (v1.22+) - This project uses Yarn as the package manager
- **Git** with GitHub CLI (`gh`) configured
- A GitHub account with push access to this repository

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Akshad628/Akshad_Mishra.git
cd Akshad_Mishra
```

### 2. Navigate to Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

Using Yarn:

```bash
yarn install
```

Or using npm (if you prefer):

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables (optional):

```env
# Contact Form Backend
REACT_APP_BACKEND_URL=http://localhost:3001

# Social Links (defaults provided if not set)
REACT_APP_SOCIAL_GITHUB=https://github.com/Akshad628
REACT_APP_SOCIAL_LINKEDIN=https://www.linkedin.com/in/akshadmishra

# Resume URL (set to your own resume/CV)
REACT_APP_RESUME_URL=https://your-resume-url.com/resume.pdf

# Contact Information
REACT_APP_CONTACT_EMAIL=akshadmishra628@gmail.com
REACT_APP_CONTACT_PHONE=+91 74164 47332

# Health Check (optional)
ENABLE_HEALTH_CHECK=false
```

**Note:** If environment variables are not set, sensible defaults are provided in the components.

### 5. Start Development Server

```bash
yarn start
```

This will start the development server at `http://localhost:3000` with hot-reload enabled.

### 6. Build for Production

```bash
yarn build
```

This creates an optimized production build in the `build/` directory.

## Project Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML file (entry point)
│   └── ...
├── src/
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   └── wr/             # Portfolio-specific components
│   ├── pages/
│   │   └── Landing.jsx     # Main landing page
│   ├── App.js              # Main App component
│   ├── index.js            # React entry point
│   └── ...
├── package.json            # Dependencies and scripts
├── craco.config.js         # Create React App config (aliases, webpack)
├── tailwind.config.js      # Tailwind CSS configuration
└── ...
```

## Available Scripts

```bash
# Start development server
yarn start

# Build for production
yarn build

# Run tests
yarn test

# Run linting
yarn lint
```

## Technologies Used

- **React 19.0.0** - UI framework
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **GSAP** - Advanced animation
- **Lucide React** - Icon library
- **React Router DOM** - Client-side routing
- **Sonner** - Toast notifications
- **Recharts** - Data visualization
- **Zod** - Schema validation

## GitHub Pages Deployment

This portfolio is designed to be deployed on GitHub Pages as a single-page application.

### Prerequisites for Deployment

1. Ensure your repository is public or you have GitHub Pages enabled
2. Commit all changes to the main branch

### Deployment Steps

#### Option 1: Manual Deployment

1. **Build the production version:**

```bash
cd frontend
yarn build
```

2. **Deploy the build folder to GitHub Pages:**

```bash
# Install GitHub Pages deployment tool
npm install --save-dev gh-pages
```

3. **Update package.json with homepage (if not already set):**

Add to `frontend/package.json`:

```json
"homepage": "https://Akshad628.github.io/Akshad_Mishra"
```

4. **Add deployment scripts to package.json:**

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  ...
}
```

5. **Run deployment:**

```bash
npm run deploy
```

#### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./frontend
        run: yarn install

      - name: Build
        working-directory: ./frontend
        run: yarn build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/build
          cname: your-custom-domain.com  # Optional: Add your custom domain
```

### Verify Deployment

After deployment:

1. Navigate to `https://Akshad628.github.io/Akshad_Mishra`
2. Your portfolio should be live and fully functional
3. Check browser console for any errors using DevTools (F12)

## Troubleshooting

### Issue: Dependencies installation fails

**Solution:** Clear npm/yarn cache and reinstall:

```bash
yarn cache clean
rm -rf node_modules
yarn install
```

### Issue: Port 3000 already in use

**Solution:** Specify a different port:

```bash
PORT=3001 yarn start
```

### Issue: Build fails

**Solution:** Check for TypeScript or linting errors:

```bash
yarn build 2>&1 | tail -50
```

### Issue: Page shows 404 after deployment

**Solution:** Ensure `homepage` is set correctly in `package.json` to match your GitHub Pages URL.

### Issue: Styling issues after deployment

**Solution:** Clear browser cache or use incognito mode. Rebuild and redeploy:

```bash
rm -rf build/
yarn build
yarn deploy
```

## Custom Domain (Optional)

To use a custom domain with GitHub Pages:

1. Add a `CNAME` file to the `public/` folder with your domain name
2. Configure DNS records with your registrar
3. Enable custom domain in GitHub repository settings

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_BACKEND_URL` | `http://localhost:3001` | Backend API endpoint |
| `REACT_APP_SOCIAL_GITHUB` | `https://github.com/Akshad628` | GitHub profile URL |
| `REACT_APP_SOCIAL_LINKEDIN` | `https://www.linkedin.com/in/akshadmishra` | LinkedIn profile URL |
| `REACT_APP_CONTACT_EMAIL` | `akshadmishra628@gmail.com` | Contact email |
| `REACT_APP_CONTACT_PHONE` | `+91 74164 47332` | Contact phone |
| `REACT_APP_RESUME_URL` | N/A | Resume/CV download URL |
| `ENABLE_HEALTH_CHECK` | `false` | Enable health check endpoints |

## Performance Tips

- **Code splitting:** Routes are automatically code-split by React Router
- **Image optimization:** Use optimized images and consider lazy loading
- **CSS:** Tailwind CSS is purged in production builds
- **Bundle analysis:** Monitor build size with webpack plugins

## Support & Contributing

For issues or contributions, please:

1. Check existing GitHub issues
2. Create a new issue with details
3. Submit pull requests for improvements

## License

This project is personal work. All rights reserved.

---

**Last Updated:** 2026-07-16  
**Maintained by:** Akshad Mishra
