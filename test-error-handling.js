// Test file to verify error handling works correctly
import { handleError, getErrorMessages } from "../src/utils/errorHandling";

// Test cases
const testCases = [
  // Server error with success: false and messages array
  {
    name: "Server error with messages array",
    error: {
      response: {
        data: {
          success: false,
          messages: ["national_id already exists", "Phone number is invalid"],
        },
      },
    },
  },

  // Validation error with message array (old format)
  {
    name: "Validation error (old format)",
    error: {
      response: {
        data: {
          message: ["Field is required", "Invalid format"],
          data: { errors: {} },
        },
      },
    },
  },

  // Single message error
  {
    name: "Single message error",
    error: {
      response: {
        data: {
          message: "User not found",
        },
      },
    },
  },

  // 401 Unauthorized
  {
    name: "401 Unauthorized",
    error: {
      response: {
        status: 401,
        data: {},
      },
    },
  },

  // Network error
  {
    name: "Network error",
    error: new Error("Network connection failed"),
  },
];

console.log("Testing error handling...\n");

testCases.forEach((testCase) => {
  console.log(`\n--- ${testCase.name} ---`);

  try {
    const messages = getErrorMessages(testCase.error);
    console.log("Extracted messages:", messages);
  } catch (e) {
    console.error("Error extracting messages:", e);
  }
});

console.log("\nDone testing!");
