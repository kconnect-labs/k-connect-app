import { Layout } from "@ui/Layout";
import { StatusBar } from "expo-status-bar";
import AuthContent from "features/auth/AuthContent";

export default function Login() {
 return (
  <Layout>
   <StatusBar style="auto" />
   <AuthContent />
  </Layout>
 );
}
