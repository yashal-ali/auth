declare module "next-auth-package" {
  export function isWDS(str: string): boolean;
  export function registerUser(): void;
  export function forgotPassword(): void;
  export function verifyUser(): void;
  export function resetPassword(): void;
  export const authOptions: any;
  export function dbConnect(): void;
  export const UserModel: any;
    export function registerUser(params: {
      firstName: string;
      lastName: string;
      userName: string;
      email: string;
      password: string;
      domain: string;
      EmailComponent: React.ElementType;
    }): Promise<{ success: boolean; message: string }>;
}
