import bcrypt from 'bcryptjs';

export default class Password {
   public static async hash(password: string) {
      return await bcrypt.hash(password, 10)
   }

   public static async compare(candidate: string, encrypted: string) {
      return await bcrypt.compare(candidate, encrypted)
   }
}