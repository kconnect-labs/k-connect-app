import { create } from "zustand";
import AuthService from "../services/authService";
import { User } from "types/profile";

interface AuthState {
 user: User;
 loading: boolean;
 error: string | null;
 needsProfileSetup: boolean;

 checkAuthStatus: () => Promise<void>;
 login: (
  usernameOrEmail: string,
  password: string
 ) => Promise<{ success: boolean; needsProfileSetup: boolean }>;
 register: (
  username: string,
  email: string,
  password: string
 ) => Promise<{ success: boolean; message: string }>;
 setupProfile: (profileData: any) => Promise<{ success: boolean; user: any }>;
 logout: () => Promise<void>;
 isAuthenticated: () => boolean;
}

const useAuthStore = create<AuthState>((set, get) => ({
 user: null,
 loading: true,
 error: null,
 needsProfileSetup: false,

 checkAuthStatus: async () => {
  try {
   set({ loading: true, error: null });

   const userData = await AuthService.getCurrentUser();
   if (userData) {
    set({ user: userData });
   }

   const needsSetup = await AuthService.needsProfileSetup();
   set({ needsProfileSetup: needsSetup });

   const authResponse = await AuthService.checkAuth();

   if (authResponse.isAuthenticated && authResponse.user) {
    set({ user: authResponse.user, needsProfileSetup: false });
   } else if (authResponse.needsProfileSetup) {
    set({ user: null, needsProfileSetup: true });
   } else {
    set({ user: null, needsProfileSetup: false });
   }
  } catch (err) {
   console.error("Auth check failed:", err);
   set({ error: err.message || "Authentication check failed", user: null });
  } finally {
   set({ loading: false });
  }
 },

 login: async (usernameOrEmail, password) => {
  try {
   set({ loading: true, error: null });

   const response = await AuthService.login(usernameOrEmail, password);

   if (response.success) {
    if (response.needsProfileSetup) {
     set({ user: null, needsProfileSetup: true });
    } else if (response.user) {
     set({ user: response.user, needsProfileSetup: false });
    }
    return { success: true, needsProfileSetup: response.needsProfileSetup };
   } else {
    throw new Error(response.error || "Login failed");
   }
  } catch (err) {
   console.error("Login error:", err);
   set({
    error: err.response?.data?.error || err.message || "Login failed",
   });
   throw err;
  } finally {
   set({ loading: false });
  }
 },

 register: async (username, email, password) => {
  try {
   set({ loading: true, error: null });

   const response = await AuthService.register(username, email, password);
   if (response.success) {
    return { success: true, message: response.message };
   } else {
    throw new Error(response.error || "Registration failed");
   }
  } catch (err) {
   console.error("Registration error:", err);
   set({
    error: err.response?.data?.error || err.message || "Registration failed",
   });
   throw err;
  } finally {
   set({ loading: false });
  }
 },

 setupProfile: async (profileData) => {
  try {
   set({ loading: true, error: null });

   const response = await AuthService.setupProfile(profileData);
   if (response.success && response.user) {
    set({ user: response.user, needsProfileSetup: false });
    return { success: true, user: response.user };
   } else {
    throw new Error(response.error || "Profile setup failed");
   }
  } catch (err) {
   console.error("Profile setup error:", err);
   set({
    error: err.response?.data?.error || err.message || "Profile setup failed",
   });
   throw err;
  } finally {
   set({ loading: false });
  }
 },

 logout: async () => {
  try {
   set({ loading: true, error: null });
   await AuthService.logout();
  } catch (err) {
   console.error("Logout error:", err);
   set({ error: err.message || "Logout failed" });
  } finally {
   set({ user: null, needsProfileSetup: false, loading: false });
  }
 },

 isAuthenticated: () => !!get().user,
}));

export default useAuthStore;
