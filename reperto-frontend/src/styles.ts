export const Colors = {
  // Primary colors
  primary: "#7C4DFF",
  primaryDark: "#6B3FE0",
  background: "#FFFFFF",
  
  // Secondary colors
  lightPurple: "#F3E8FF",
  lightGray: "#F5F5F5",
  
  // Text colors
  text: "#2E2E2E",
  textSecondary: "#666666",
  textLight: "#999999",
  textWhite: "#FFFFFF",
  
  // Borders & dividers
  border: "#E8E8E8",
  divider: "#F0F0F0",
  
  // Status colors
  success: "#4CAF50",
  warning: "#FF9800",
  danger: "#F44336",
  info: "#2196F3",
  
  // Badge colors
  greenBadge: "#E8F5E9",
  greenText: "#2E7D32",
  orangeBadge: "#FFF3E0",
  orangeText: "#E65100",
  yellowBadge: "#FFFDE7",
  yellowText: "#F57F17",
  purpleBadge: "#F3E5F5",
  purpleText: "#6A1B9A",
  
  // Shadows
  shadowColor: "#000000",
};

export const Shadows = {
  small: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
};
