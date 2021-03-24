export default abstract class CustomError extends Error {
   public abstract status: number;

   constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, CustomError.prototype)
   }

   public abstract serializeErrors(): string[]
}