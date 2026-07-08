import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types";
import { setStoredToken, setStoredRefreshToken, getStoredToken } from "@/api/api";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: Boolean(getStoredToken()),
  token: getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
      setStoredToken(action.payload.accessToken);
      setStoredRefreshToken(action.payload.refreshToken);
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      setStoredToken(null);
      setStoredRefreshToken(null);
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
