class CustomError extends Error {
  name = 'CustomError';
  reason: string;
  hints: string[];
  constructor (message: string, reason?: string, ...hints: string[]) {
    super(message);
    this.name = CustomError.name;
    this.message = message;
    this.reason = reason;
    this.hints = hints || [];
  }
}

enum IacFormat {
  tf = 'tf',
  awsCdk = 'aws-cdk'
}

interface SmokeTestOptions {
  format?: IacFormat
}

export {
  CustomError,
  IacFormat,
  SmokeTestOptions
};