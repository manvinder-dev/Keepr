import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure({
  ...awsconfig,
  Storage: {
    AWSS3: {
      bucket: awsconfig.aws_user_files_s3_bucket,
      region: awsconfig.aws_user_files_s3_bucket_region,
    }
  }
});