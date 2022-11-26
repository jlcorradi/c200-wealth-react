#!/bin/bash
echo "Docker Login"
aws ecr get-login-password --region us-east-1 |
  docker login --username AWS --password-stdin 989073812644.dkr.ecr.us-east-1.amazonaws.com
echo "Building image..."
docker build --platform linux/amd64 -t c200-wealth-react .
docker tag c200-wealth-react:latest 989073812644.dkr.ecr.us-east-1.amazonaws.com/c200-wealth-react:latest
echo "Pushing image..."
docker push 989073812644.dkr.ecr.us-east-1.amazonaws.com/c200-wealth-react:latest
echo "Done."

ssh -i /Users/jorgecorradimbp16/Workspace/c200/aws/acf-demo-key.pem ubuntu@ec2-44-192-42-246.compute-1.amazonaws.com "sh ./c200/run-frontend.sh"
