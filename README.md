# Expense Manager

## Reactjs Web App

### Tech Used

- Reactjs
  - Axios
- Nodejs
  - Express.js
  - cors
  - mongoose
  - passport.js
  - bcrypt
  - days
  - jsonwebtoken
  - passport-jwt
- concurrency

## CI/CD Setup

This project uses GitHub Actions for continuous integration and deployment.

### Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on push/PR to `main` and `dev` branches
   - Installs dependencies for client and server
   - Runs linting and TypeScript checks for frontend
   - Runs backend tests
   - Builds frontend production bundle
   - Tests Docker image build and startup

2. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
   - Triggers on push to `main` branch
   - Builds and pushes the backend Docker image to AWS ECR
   - Triggers AWS Amplify to deploy the frontend
   - Optionally forces ECS service redeployment

3. **Security Scan** (`.github/workflows/security.yml`)
   - Runs security audits on dependencies
   - Performs CodeQL analysis for security vulnerabilities
   - Runs weekly and on pushes to main/dev

### Local Development

```bash
# Install all dependencies
yarn install

# Install client dependencies
cd client && yarn install

# Install server dependencies
cd ../server && yarn install

# Start development servers
cd .. && yarn start
```

### Testing

```bash
# Run server tests
cd server && yarn test

# Run server tests with coverage
cd server && yarn test:coverage

# Run client linting
cd client && yarn lint

# Build client for production
cd client && yarn build
```

### Environment Variables

This project uses environment-specific files for the backend. Place these files in the `server/` directory:

- `.env.local` for local development
- `.env.development` for development environment
- `.env.test` for tests
- `.env.production` for production

The backend loads the correct file automatically based on `NODE_ENV`.

For example, copy `server/.env.local.example` to `server/.env.local` and update values.

**Server example values:**
```
NODE_ENV=development
PORT=3001
JWT_SECRET_KEY=your_secret_key
JWT_REFRESH_SECRET_KEY=your_refresh_secret_key
JWT_ACCESS_TOKEN_EXPIRATION=1d
JWT_REFRESH_TOKEN_EXPIRATION=1d
JWT_LOGOUT_TOKEN_EXPIRATION=1s
DATABASE_URL=mongodb://localhost:27017/expense_manager_development
```

**Client example values:**
```
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

**Client environment files:**
- `client/.env.local` for local development
- `client/.env.development` for development environment
- `client/.env.test` for tests
- `client/.env.production` for production

Copy the example files and update the `VITE_API_BASE_URL` for each environment.

### AWS deployment setup

This project deploys the frontend to AWS Amplify Hosting and the backend Docker image to AWS ECR. Add these GitHub repository secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_ACCOUNT_ID`
- `AMPLIFY_APP_ID`
- `AWS_ECR_REPOSITORY` (optional, defaults to `expense-manager/backend`)
- `AWS_ECS_CLUSTER` (optional)
- `AWS_ECS_SERVICE` (optional)

The deploy workflow will only run on `main` and will:
- build the backend image and push it to ECR
- build the frontend and deploy it to AWS Amplify Hosting
- automatically handle HTTPS, caching, and CDN

See [AWS_SETUP.md](AWS_SETUP.md) for detailed step-by-step instructions on setting up all AWS resources and connecting them to GitHub Actions.

© Aman Kumar
All Rights Reserved

**Privacy Policy**

Aman Kumar operates the https://amankriet.com website (the "Service").

This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.

**Analytics**

We may use third-party service providers, such as Google Analytics, to monitor and analyze the use of our Service. These services may collect information such as your IP address, browser type, pages visited, and time spent on those pages. This information is used to improve the user experience and optimize the performance of our website.

**Cookies**

Our website may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are files with small amount of data that may include an anonymous unique identifier. You have the option to accept or refuse these cookies and to know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service.

**Social Media Plugins**

Our website may include social media plugins, such as Facebook, Twitter, and LinkedIn buttons. These plugins may collect your IP address, which page you are visiting on our site, and may set a cookie to enable the plugin to function properly. Your interactions with these plugins are governed by the privacy policies of the companies providing them.

**Links to Other Sites**

Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the privacy policy of every site you visit.

**Changes to This Privacy Policy**

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

**Contact Us**

If you have any questions about this Privacy Policy, please contact us at - amankriet@gmail.com.
