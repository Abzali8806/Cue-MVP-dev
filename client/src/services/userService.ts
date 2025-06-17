import { apiRequest } from "@/lib/api";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  industry: string;
  role: string;
  usagePurpose: string;
  profileImageUrl?: string;
}

export interface OnboardingData {
  firstName: string;
  lastName: string;
  companyName: string;
  industry: string;
  role: string;
  usagePurpose: string;
}

class UserService {
  async getCurrentUser(): Promise<UserProfile> {
    return await apiRequest("/auth/users/me");
  }

  async getCurrentUserAPI(): Promise<UserProfile> {
    return await apiRequest("/auth/users/api/me");
  }

  async completeOnboarding(onboardingData: OnboardingData): Promise<UserProfile> {
    return await apiRequest("/auth/users/complete-onboarding", {
      method: "POST",
      body: JSON.stringify(onboardingData),
    });
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return await apiRequest("/auth/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async validateToken(): Promise<{ valid: boolean; user?: UserProfile }> {
    try {
      const response = await apiRequest("/auth/validate-token", {
        method: "POST",
      });
      return response;
    } catch (error) {
      return { valid: false };
    }
  }

  async logout(): Promise<void> {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  }

  async logoutAPI(): Promise<void> {
    await apiRequest("/auth/logout/api", {
      method: "POST",
    });
  }
}

export const userService = new UserService();