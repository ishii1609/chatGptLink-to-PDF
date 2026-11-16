// Apna error class: message ke saath HTTP status code bhi le jata hai
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
