// @ts-nocheck
export const config = {
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  emailFrom: process.env.EMAIL_FROM || 'rfp@test.local'
};

