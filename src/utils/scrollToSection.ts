import { NavigateFunction } from "react-router-dom";

/**
 * Scrolls to a section by ID with smooth behavior
 */
export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

/**
 * Handles navigation to contact section
 * Works from any page - navigates to home if needed, then scrolls
 * @param currentPath - The current location pathname
 * @param navigate - React Router navigate function
 * @param onComplete - Optional callback to execute after navigation (e.g., close menu)
 */
export const handleContactNavigation = (
  currentPath: string,
  navigate: NavigateFunction,
  onComplete?: () => void
) => {
  // Close menu first if callback provided
  onComplete?.();

  if (currentPath === "/home") {
    // Already on home page, just scroll
    setTimeout(
      () => {
        scrollToSection("contactus");
      },
      onComplete ? 300 : 0
    ); // Wait for menu close animation if provided
  } else {
    // Navigate to home first, then scroll
    navigate("/home");
    setTimeout(
      () => {
        scrollToSection("contactus");
      },
      onComplete ? 400 : 100
    ); // Wait for navigation + menu close
  }
};

/**
 * Check if URL has a hash and scroll to it
 */
export const scrollToHashSection = (hash: string) => {
  if (hash.startsWith("#")) {
    const sectionId = hash.substring(1);
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 100);
  }
};
