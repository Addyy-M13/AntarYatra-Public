import { AuthPage } from "@/components/ui/auth-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your AntarYatra account",
};

export default function LoginPage() {
  return <AuthPage />;
}
