# AWS Deployment Setup Guide

This guide will walk you through setting up AWS resources for deploying your Expense Manager application using GitHub Actions.

## Prerequisites

- AWS account with billing enabled
- GitHub repository with the Expense Manager project
- Basic familiarity with AWS console

## Step 1: Create IAM User for GitHub Actions

### 1.1 Create IAM User
1. Go to AWS Console → IAM → Users → Create user
2. User name: `expense-manager-github-actions`
3. Access type: `Programmatic access`
4. Click `Next: Permissions`

### 1.2 Attach Policies
Attach these managed policies:
- `AmazonEC2ContainerRegistryFullAccess` (for ECR)
- `AmazonS3FullAccess` (for S3, optional if you still use S3)
- `AWSAmplifyFullAccess` (for Amplify deployments)
- `AmazonECS_FullAccess` (for ECS, if using)

Or create a custom policy with these permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name/*",
                "arn:aws:s3:::your-bucket-name"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "amplify:StartJob"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecs:UpdateService",
                "ecs:DescribeServices"
            ],
            "Resource": "*"
        }
    ]
}
```

### 1.3 Get Access Keys
1. After creating the user, download the CSV file with access keys
2. Save `Access key ID` and `Secret access key` - you'll need these for GitHub secrets

## Step 2: Create ECR Repository

### 2.1 Create Repository
1. Go to AWS Console → ECR → Create repository
2. Repository name: `expense-manager/backend`
3. Repository type: `Private`
4. Click `Create`

### 2.2 Note the URI
Your ECR repository URI will be:
```
123456789012.dkr.ecr.us-east-1.amazonaws.com/expense-manager/backend
```

Where:
- `123456789012` is your AWS account ID
- `us-east-1` is your AWS region

## Step 3: Connect to AWS Amplify Hosting

### 3.1 Create Amplify App
1. Go to AWS Console → Amplify → Create app
2. Choose `Connect repository`
3. Select GitHub and authorize access if needed
4. Select your repository and choose the `main` branch
5. Set the base directory to `expense-manager-ui`

### 3.2 Configure Build Settings
1. Build settings should auto-detect your frontend framework
2. Set the build command to: `yarn build`
3. Set the start command to: `yarn preview` or leave blank
4. Set the output directory to: `dist`
5. Click `Save and deploy`

### 3.3 App Branch Setup
1. In Amplify, ensure the `main` branch is connected and deployed
2. This is the branch the GitHub Actions workflow will trigger

### 3.4 Get App ID
1. After deployment, go to App settings → General
2. Copy the `App ID` (e.g., `d1a2b3c4d5e6f`)
3. Save this as `AMPLIFY_APP_ID` GitHub secret

### 3.5 Configure Environment Variables (if needed)
1. Go to App settings → Environment variables
2. Add environment variables for your frontend:
   - `VITE_API_BASE_URL`: Your backend API URL
3. Click `Save`

## Step 4: (Optional) Connect Custom Domain

### 4.1 Add Custom Domain
1. Go to your Amplify app → Domain management
2. Click `Add domain`
3. Enter your custom domain name
4. Update your domain registrar's DNS records as shown in Amplify

### 4.2 SSL Certificate
- Amplify automatically provisions SSL certificates for custom domains
- HTTPS is enabled by default

## Step 5: Setup ECS (Optional, for Backend Deployment)

### 5.1 Create ECS Cluster
1. Go to AWS Console → ECS → Clusters → Create cluster
2. Cluster name: `expense-manager-cluster`
3. Infrastructure: `AWS Fargate` (serverless)
4. Click `Create`

### 5.2 Create Task Definition
1. Go to Task Definitions → Create new task definition
2. Launch type: `Fargate`
3. Task definition name: `expense-manager-backend`
4. Task role: Create new role or use existing
5. Network mode: `awsvpc`
6. Add container:
   - Name: `expense-manager-backend`
   - Image: `123456789012.dkr.ecr.us-east-1.amazonaws.com/expense-manager/backend:latest`
   - Port mappings: `3001` (or your backend port)
   - Environment variables: Add your production env vars
7. Click `Create`

### 5.3 Create Service
1. Go to your cluster → Services → Create
2. Launch type: `Fargate`
3. Task definition: Select your task definition
4. Service name: `expense-manager-backend-service`
5. Number of tasks: `1`
6. Networking: Configure VPC, subnets, and security groups
7. Load balancer: Select `Application Load Balancer`
   - Create or use an existing target group
   - Target group protocol: `HTTP`
   - Target group port: `3001`
   - Health check path: `/`
   - Forward listener to the target group on port `3001`
8. Set the service to use the ALB and the target group
9. Click `Create`

### 5.4 Notes for API URL
- After service creation, note the ALB DNS name in the Load Balancer console
- Your backend API base URL will be:
  `https://<your-alb-dns-name>/v1`
- Use that value for `VITE_API_BASE_URL` in your frontend environment variables

## Step 6: Configure GitHub Secrets

### 6.1 Go to GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these repository secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AWS_ACCESS_KEY_ID` | Your IAM access key | From step 1.3 |
| `AWS_SECRET_ACCESS_KEY` | Your IAM secret key | From step 1.3 |
| `AWS_REGION` | `us-east-1` | Your AWS region |
| `AWS_ACCOUNT_ID` | `123456789012` | Your AWS account ID |
| `AMPLIFY_APP_ID` | `d1a2b3c4d5e6f` | From step 3.3 |
| `AWS_ECR_REPOSITORY` | `expense-manager/backend` | From step 2.1 |
| `AWS_ECS_CLUSTER` | `expense-manager-cluster` | From step 5.1 (optional) |
| `AWS_ECS_SERVICE` | `expense-manager-backend-service` | From step 5.3 (optional) |

### 6.2 How to Add Secrets
1. Click `New repository secret`
2. Name: Enter the secret name
3. Value: Enter the value
4. Click `Add secret`

## Step 7: Test Your Deployment

### 7.1 Push to Main Branch
1. Make sure your code is ready for production
2. Push to the `main` branch
3. Go to GitHub Actions tab to see the deployment workflow run

### 7.2 Check Resources
1. **ECR**: Check if image was pushed
2. **Amplify**: Check if frontend was deployed and shows green checkmark
3. **ECS**: Check if service was updated (if configured)
4. **ALB**: Check the load balancer DNS and target group health

### 7.3 Access Your Application
- **Frontend**: Use your Amplify domain (e.g., `https://main.d1a2b3c4d5e6f.amplifyapp.com`)
- **Backend**: Use your ALB DNS name plus `/v1` (for example `https://my-alb-123456.us-east-1.elb.amazonaws.com/v1`)

## Troubleshooting

### Common Issues

1. **ECR Login Fails**
   - Check AWS credentials are correct
   - Verify IAM user has ECR permissions
   - Check AWS region matches

2. **Amplify Deploy Fails**
   - Check App ID is correct in secrets
   - Verify build command in Amplify settings
   - Check frontend directory structure is correct
   - Review Amplify logs in AWS Console

3. **ECS Update Fails**
   - Check cluster and service names are correct
   - Verify ECS service exists
   - Check IAM permissions for ECS

4. **ALB or Target Group Issues**
   - Verify the ALB listener is forwarding to the correct target group
   - Confirm target group health checks are passing on port `3001`
   - Ensure service security groups allow traffic from the ALB

### Debug Steps

1. Check GitHub Actions logs for detailed error messages
2. Test AWS credentials locally using AWS CLI
3. Verify all resource names and IDs match your secrets
4. Check AWS service quotas and limits

## Cost Optimization

- **Amplify Hosting**: $0.15 per GB served (includes CDN), free tier includes 15GB/month
- **ECR**: Free for first 500MB/month, then $0.10/GB
- **ECS Fargate**: Pay per vCPU and memory usage
- **IAM**: Free

## Security Best Practices

1. Use least-privilege IAM policies
2. Rotate access keys regularly
3. Amplify provides automatic HTTPS and caching
4. Use environment variables for sensitive data in Amplify
5. Use environment-specific secrets in GitHub
6. Monitor AWS costs and usage
7. Enable branch protection on `main` branch in GitHub

## Next Steps

1. Set up monitoring with CloudWatch
2. Configure custom domain with Route 53 (or add custom domain in Amplify)
3. Set up backup strategies for data
4. Configure auto-scaling for ECS services

---

This setup provides a production-ready deployment pipeline for your Expense Manager application. The GitHub Actions workflow will automatically deploy both frontend and backend whenever you push to the main branch.