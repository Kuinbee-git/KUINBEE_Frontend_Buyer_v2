/**
 * User profile types
 */

export interface PersonalInfo {
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  profileImage: string | null;
}

export interface ProfileUser {
  id: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
}

export interface Profile {
  user: ProfileUser;
  personalInfo: PersonalInfo | null;
}

export interface ProfileResponse {
  profile: Profile;
}

export interface UpdateProfileRequest {
  phone?: string | null;
  personalInfo?: {
    firstName?: string | null;
    lastName?: string | null;
    profileImage?: string | null;
  };
}
