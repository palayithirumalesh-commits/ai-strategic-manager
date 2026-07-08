import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  darkMode: boolean;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  darkMode: false,
  sidebarCollapsed: false,
  mobileNavOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    openMobileNav: (state) => {
      state.mobileNavOpen = true;
    },
    closeMobileNav: (state) => {
      state.mobileNavOpen = false;
    },
    toggleMobileNav: (state) => {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
  },
});

export const { toggleDarkMode, toggleSidebar, openMobileNav, closeMobileNav, toggleMobileNav } = uiSlice.actions;
export default uiSlice.reducer;
