// // Unity Nivo Backend API Client
// // Connected to Render Backend: https://unity-nivo-backend-nodejs.onrender.com

// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://unity-nivo-backend-nodejs.onrender.com';
// export const API_DOCS_URL = import.meta.env.VITE_API_DOCS_URL || 'https://unity-nivo-backend-nodejs.onrender.com/api-docs/';

// // Helper for making HTTP requests
// async function request(endpoint, options = {}) {
//   const url = `${API_BASE_URL}${endpoint}`;

// const headers = {
//   Accept: "application/json",
//   ...options.headers,
// };

// if (
//   options.body !== undefined &&
//   !(options.body instanceof FormData)
// ) {
//   headers["Content-Type"] = "application/json";
// }

//   // Add auth token if present
//   const token = localStorage.getItem('unity_nivo_token');
//   if (token && !headers['Authorization']) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const config = {
//     ...options,
//     headers,
//   };

//   if (options.body && typeof options.body === 'object') {
//     config.body = JSON.stringify(options.body);
//   }

//   try {
//     const response = await fetch(url, config);

//     // Handle non-JSON responses gracefully
//     const contentType = response.headers.get('content-type');
//     let data = null;
//     if (contentType && contentType.includes('application/json')) {
//       data = await response.json();
//     } else {
//       const text = await response.text();
//       data = { message: text };
//     }

//     if (!response.ok) {
//       const errorMsg = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
//       throw new Error(errorMsg);
//     }

//     return { success: true, status: response.status, data };
//   } catch (error) {
//     console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
//     return { success: false, error: error.message };
//   }
// }

// export const api = {
//   baseUrl: API_BASE_URL,
//   docsUrl: API_DOCS_URL,

//   // Health Check
//   checkHealth: async () => {
//     return await request('/api/health/test');
//   },

//   // User Auth APIs
//   user: {
//     register: async (userData) => {
//       // Endpoint documented as /api/user/auth/register or /api/user/deposit/register
//       const res = await request('/api/user/auth/register', {
//         method: 'POST',
//         body: userData,
//       });
//       if (!res.success) {
//         // Fallback endpoint in swagger
//         return await request('/api/user/deposit/register', {
//           method: 'POST',
//           body: userData,
//         });
//       }
//       return res;
//     },

//     login: async (credentials) => {
//       const res = await request('/api/user/auth/login', {
//         method: 'POST',
//         body: credentials,
//       });
//       if (!res.success) {
//         return await request('/api/user/deposit/login', {
//           method: 'POST',
//           body: credentials,
//         });
//       }
//       if (res.data?.token) {
//         localStorage.setItem('unity_nivo_token', res.data.token);
//       }
//       return res;
//     },

//     getDepositInfo: async (token) => {
//       const authToken = token || localStorage.getItem('unity_nivo_token');
//       const res = await request('/api/user/deposit/deposit-info', {
//         headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
//       });
//       if (!res.success) {
//         return await request('/api/user/auth/deposit-info', {
//           headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
//         });
//       }
//       return res;
//     },

//     createDeposit: async (depositData, token) => {
//       return await request('/api/user/auth/', {
//         method: 'POST',
//         body: depositData,
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//     },

//     getMyDeposits: async (token) => {
//       return await request('/api/user/auth/my', {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//     },
//   },

//   // Admin APIs
//   admin: {
//     register: async (adminData) => {
//       return await request('/api/admin/auth/create', {
//         method: 'POST',
//         body: adminData,
//       });
//     },

//     login: async (credentials) => {
//       const res = await request('/api/admin/auth/login', {
//         method: 'POST',
//         body: credentials,
//       });
//       if (res.data?.token) {
//         localStorage.setItem('unity_nivo_admin_token', res.data.token);
//       }
//       return res;
//     },

//     getDashboard: async (token) => {
//       const adminToken = token || localStorage.getItem('unity_nivo_admin_token');
//       return await request('/api/admin/auth/dashboard', {
//         headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
//       });
//     },

//     getAllDeposits: async (status = '', token) => {
//       const adminToken = token || localStorage.getItem('unity_nivo_admin_token');
//       const query = status ? `?status=${encodeURIComponent(status)}` : '';
//       return await request(`/api/admin/auth/get_all${query}`, {
//         headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
//       });
//     },

//     getUserById: async (userId, token) => {
//       const adminToken = token || localStorage.getItem('unity_nivo_admin_token');
//       return await request(`/api/admin/auth/users/${userId}`, {
//         headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
//       });
//     },

//     approveDeposit: async (depositId, token) => {
//       const adminToken = token || localStorage.getItem('unity_nivo_admin_token');
//       return await request(`/api/admin/auth/${depositId}/approve`, {
//         method: 'PATCH',
//         headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
//       });
//     },

//     rejectDeposit: async (depositId, remark = '', token) => {
//       const adminToken = token || localStorage.getItem('unity_nivo_admin_token');
//       return await request(`/api/admin/auth/${depositId}/reject`, {
//         method: 'PATCH',
//         body: { remark },
//         headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
//       });
//     },
//   },
// };

// export default api;

// // Unity Nivo Backend API Client
// // Connected to Render Backend

// // export const API_BASE_URL =
// //   import.meta.env.VITE_API_BASE_URL ||
// //   "https://unity-nivo-backend-nodejs.onrender.com";

// // export const API_DOCS_URL =
// //   import.meta.env.VITE_API_DOCS_URL ||
// //   "https://unity-nivo-backend-nodejs.onrender.com/api-docs/";

// // // ─────────────────────────────────────────────────────────────────────────────
// // // Helper for making HTTP requests
// // // ─────────────────────────────────────────────────────────────────────────────

// // async function request(endpoint, options = {}) {
// //   const url = `${API_BASE_URL}${endpoint}`;

// //   const token = localStorage.getItem("unity_nivo_token");

// //   const isFormData = options.body instanceof FormData;

// //   const headers = {
// //     Accept: "application/json",
// //     ...(options.headers || {}),
// //   };

// //   // Add auth token automatically
// //   if (token && !headers.Authorization) {
// //     headers.Authorization = `Bearer ${token}`;
// //   }

// //   // IMPORTANT:
// //   // Don't set Content-Type for FormData.
// //   // Browser will automatically set:
// //   // multipart/form-data; boundary=...
// //   if (!isFormData && options.body !== undefined) {
// //     headers["Content-Type"] = "application/json";
// //   }

// //   const config = {
// //     ...options,
// //     headers,
// //   };

// //   // Convert normal JS objects to JSON
// //   // But NEVER stringify FormData
// //   if (
// //     options.body !== undefined &&
// //     !isFormData &&
// //     typeof options.body === "object"
// //   ) {
// //     config.body = JSON.stringify(options.body);
// //   }

// //   try {
// //     console.log(
// //       `[API Request] ${config.method || "GET"} ${url}`
// //     );

// //     const response = await fetch(url, config);

// //     const contentType = response.headers.get("content-type");

// //     let data;

// //     if (contentType && contentType.includes("application/json")) {
// //       data = await response.json();
// //     } else {
// //       const text = await response.text();
// //       data = {
// //         message: text,
// //       };
// //     }

// //     if (!response.ok) {
// //       const errorMsg =
// //         data?.message ||
// //         data?.error ||
// //         `HTTP ${response.status}: ${response.statusText}`;

// //       throw new Error(errorMsg);
// //     }

// //     return {
// //       success: true,
// //       status: response.status,
// //       ...data,
// //     };
// //   } catch (error) {
// //     console.error(
// //       `[API Error] ${config.method || "GET"} ${endpoint}:`,
// //       error.message
// //     );

// //     return {
// //       success: false,
// //       error: error.message,
// //       message: error.message,
// //     };
// //   }
// // }

// // // ─────────────────────────────────────────────────────────────────────────────
// // // API
// // // ─────────────────────────────────────────────────────────────────────────────

// // export const api = {
// //   baseUrl: API_BASE_URL,
// //   docsUrl: API_DOCS_URL,

// //   // ─────────────────────────────────────────────────────────────────────────
// //   // Health
// //   // ─────────────────────────────────────────────────────────────────────────

// //   checkHealth: async () => {
// //     return await request("/api/health/test");
// //   },

// //   // ─────────────────────────────────────────────────────────────────────────
// //   // User APIs
// //   // ─────────────────────────────────────────────────────────────────────────

// //   user: {
// //     // Register
// //     register: async (userData) => {
// //       return await request("/api/user/auth/register", {
// //         method: "POST",
// //         body: userData,
// //       });
// //     },

// //     // Login
// //     login: async (credentials) => {
// //       const res = await request("/api/user/auth/login", {
// //         method: "POST",
// //         body: credentials,
// //       });

// //       if (res.success && res.token) {
// //         localStorage.setItem(
// //           "unity_nivo_token",
// //           res.token
// //         );
// //       }

// //       return res;
// //     },

// //     // Deposit info
// //     getDepositInfo: async (token) => {
// //       const authToken =
// //         token ||
// //         localStorage.getItem("unity_nivo_token");

// //       return await request(
// //         "/api/user/deposit/deposit-info",
// //         {
// //           method: "GET",
// //           headers: authToken
// //             ? {
// //                 Authorization: `Bearer ${authToken}`,
// //               }
// //             : {},
// //         }
// //       );
// //     },

// //     // Create deposit
// //     createDeposit: async (depositData, token) => {
// //       const authToken =
// //         token ||
// //         localStorage.getItem("unity_nivo_token");

// //       return await request(
// //         "/api/user/deposit",
// //         {
// //           method: "POST",
// //           body: depositData,
// //           headers: authToken
// //             ? {
// //                 Authorization: `Bearer ${authToken}`,
// //               }
// //             : {},
// //         }
// //       );
// //     },

// //     // My deposits
// //     getMyDeposits: async (token) => {
// //       const authToken =
// //         token ||
// //         localStorage.getItem("unity_nivo_token");

// //       return await request(
// //         "/api/user/deposit/my",
// //         {
// //           method: "GET",
// //           headers: authToken
// //             ? {
// //                 Authorization: `Bearer ${authToken}`,
// //               }
// //             : {},
// //         }
// //       );
// //     },
// //   },

// //   // ─────────────────────────────────────────────────────────────────────────
// //   // Admin APIs
// //   // ─────────────────────────────────────────────────────────────────────────

// //   admin: {
// //     register: async (adminData) => {
// //       return await request("/api/admin/auth/create", {
// //         method: "POST",
// //         body: adminData,
// //       });
// //     },

// //     login: async (credentials) => {
// //       const res = await request("/api/admin/auth/login", {
// //         method: "POST",
// //         body: credentials,
// //       });

// //       if (res.success && res.token) {
// //         localStorage.setItem(
// //           "unity_nivo_admin_token",
// //           res.token
// //         );
// //       }

// //       return res;
// //     },

// //     getDashboard: async (token) => {
// //       const adminToken =
// //         token ||
// //         localStorage.getItem(
// //           "unity_nivo_admin_token"
// //         );

// //       return await request(
// //         "/api/admin/auth/dashboard",
// //         {
// //           method: "GET",
// //           headers: adminToken
// //             ? {
// //                 Authorization: `Bearer ${adminToken}`,
// //               }
// //             : {},
// //         }
// //       );
// //     },

// //     getAllDeposits: async (
// //       status = "",
// //       token
// //     ) => {
// //       const adminToken =
// //         token ||
// //         localStorage.getItem(
// //           "unity_nivo_admin_token"
// //         );

// //       const query = status
// //         ? `?status=${encodeURIComponent(status)}`
// //         : "";

// //       return await request(
// //         `/api/admin/auth/get_all${query}`,
// //         {
// //           method: "GET",
// //           headers: adminToken
// //             ? {
// //                 Authorization: `Bearer ${adminToken}`,
// //               }
// //             : {},
// //         }
// //       );
// //     },

// //     getUserById: async (userId, token) => {
// //       const adminToken =
// //         token ||
// //         localStorage.getItem(
// //           "unity_nivo_admin_token"
// //         );

// //       return await request(
// //         `/api/admin/auth/users/${userId}`,
// //         {
// //           method: "GET",
// //           headers: adminToken
// //             ? {
// //                 Authorization: `Bearer ${adminToken}`,
// //               }
// //             : {},
// //         }
// //       );
// //     },

// //     approveDeposit: async (
// //       depositId,
// //       token
// //     ) => {
// //       const adminToken =
// //         token ||
// //         localStorage.getItem(
// //           "unity_nivo_admin_token"
// //         );

// //       return await request(
// //         `/api/admin/auth/${depositId}/approve`,
// //         {
// //           method: "PATCH",
// //           headers: adminToken
// //             ? {
// //                 Authorization: `Bearer ${adminToken}`,
// //               }
// //             : {},
// //         }
// //       );
// //     },

// //     rejectDeposit: async (
// //       depositId,
// //       remark = "",
// //       token
// //     ) => {
// //       const adminToken =
// //         token ||
// //         localStorage.getItem(
// //           "unity_nivo_admin_token"
// //         );

// //       return await request(
// //         `/api/admin/auth/${depositId}/reject`,
// //         {
// //           method: "PATCH",
// //           body: {
// //             remark,
// //           },
// //           headers: adminToken
// //             ? {
// //                 Authorization: `Bearer ${adminToken}`,
// //               }
// //             : {},
// //         }
// //       );
// //     },
// //   },
// // };

// // export default api;

// Unity Nivo Backend API Client
// Connected to Render Backend: https://unity-nivo-backend-nodejs.onrender.com

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://unity-nivo-backend-nodejs.onrender.com";
export const API_DOCS_URL =
  import.meta.env.VITE_API_DOCS_URL ||
  "https://unity-nivo-backend-nodejs.onrender.com/api-docs/";

// Helper for making HTTP requests
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add auth token if present
  const token = localStorage.getItem("unity_nivo_token");
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    config.body = JSON.stringify(options.body);
  }

  // Abort request if backend takes too long (Render free tier cold start can take 30-50s)
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || 20000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  config.signal = controller.signal;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type");
    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.error ||
        `HTTP ${response.status}: ${response.statusText}`;
      // Log the actual status so we can tell a real 500 apart from a network/CORS failure
      console.error(
        `[API Error] ${options.method || "GET"} ${endpoint} -> ${response.status}: ${errorMsg}`,
      );
      return { success: false, status: response.status, error: errorMsg };
    }

    return { success: true, status: response.status, data };
  } catch (error) {
    clearTimeout(timeoutId);

    // A TypeError "Failed to fetch" here almost always means the server
    // never sent a response at all (crashed, CORS-rejected, or unreachable),
    // as opposed to a JSON body reporting an application error.
    const isAbort = error.name === "AbortError";
    const message = isAbort
      ? `Request timed out after ${timeoutMs}ms (backend may be waking up on Render's free tier)`
      : error.message;

    console.error(
      `[API Network Error] ${options.method || "GET"} ${endpoint}:`,
      message,
    );
    return { success: false, status: 0, error: message };
  }
}

// Retry wrapper: useful for the health check specifically, since Render
// free-tier services "sleep" and the first request can 500/timeout while waking up.
async function requestWithRetry(
  endpoint,
  options = {},
  retries = 2,
  delayMs = 3000,
) {
  let lastResult;
  for (let attempt = 0; attempt <= retries; attempt++) {
    lastResult = await request(endpoint, options);
    if (lastResult.success) return lastResult;
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return lastResult;
}

export const api = {
  baseUrl: API_BASE_URL,
  docsUrl: API_DOCS_URL,

  // Health Check — retried, since Render free tier cold-starts can cause
  // the first request to fail even when the backend is otherwise fine.
  checkHealth: async () => {
    return await requestWithRetry("/api/health/test", {}, 2, 3000);
  },

  // User Auth APIs
  user: {
    register: async (userData) => {
      const res = await request("/api/user/auth/register", {
        method: "POST",
        body: userData,
      });
      if (!res.success) {
        return await request("/api/user/deposit/register", {
          method: "POST",
          body: userData,
        });
      }
      return res;
    },

    // login: async (credentials) => {
    //   const res = await request("/api/user/auth/login", {
    //     method: "POST",
    //     body: credentials,
    //   });
    //   if (!res.success) {
    //     const fallback = await request("/api/user/deposit/login", {
    //       method: "POST",
    //       body: credentials,
    //     });
    //     if (fallback.success && fallback.data?.token) {
    //       localStorage.setItem("unity_nivo_token", fallback.data.token);
    //     }
    //     return fallback;
    //   }
    //   if (res.data?.token) {
    //     localStorage.setItem("unity_nivo_token", res.data.token);
    //   }
    //   return res;
    // },

    login: async (credentials) => {
      const res = await request("/api/user/auth/login", {
        method: "POST",
        body: credentials,
      });

      if (res.success && res.data?.token) {
        localStorage.setItem("unity_nivo_token", res.data.token);

        localStorage.removeItem("unity_nivo_admin_token");
      }

      return res;
    },

    getDepositInfo: async (token) => {
      const authToken = token || localStorage.getItem("unity_nivo_token");
      const res = await request("/api/user/deposit/deposit-info", {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (!res.success) {
        return await request("/api/user/auth/deposit-info", {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });
      }
      return res;
    },

    createDeposit: async (depositData, token) => {
      const authToken = token || localStorage.getItem("unity_nivo_token");
      return await request("/api/user/auth/", {
        method: "POST",
        body: depositData,
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
    },

    getMyDeposits: async (token) => {
      const authToken = token || localStorage.getItem("unity_nivo_token");
      return await request("/api/user/auth/my", {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
    },
  },

  // Admin APIs
  admin: {
    register: async (adminData) => {
      return await request("/api/admin/auth/create", {
        method: "POST",
        body: adminData,
      });
    },

    // login: async (credentials) => {
    //   const res = await request('/api/admin/auth/login', {
    //     method: 'POST',
    //     body: credentials,
    //   });
    //   if (res.success && res.data?.token) {
    //     localStorage.setItem('unity_nivo_admin_token', res.data.token);
    //   }
    //   return res;
    // },

    login: async (credentials) => {
      const res = await request("/api/admin/auth/login", {
        method: "POST",
        body: credentials,
      });

      if (res.success && res.data?.token) {
        localStorage.setItem("unity_nivo_admin_token", res.data.token);

        localStorage.removeItem("unity_nivo_token");
      }

      return res;
    },
    getDashboard: async (token) => {
      const adminToken =
        token || localStorage.getItem("unity_nivo_admin_token");
      return await request("/api/admin/auth/dashboard", {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
    },

    getAllDeposits: async (status = "", token) => {
      const adminToken =
        token || localStorage.getItem("unity_nivo_admin_token");
      const query = status ? `?status=${encodeURIComponent(status)}` : "";
      return await request(`/api/admin/auth/get_all${query}`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
    },

    getUserById: async (userId, token) => {
      const adminToken =
        token || localStorage.getItem("unity_nivo_admin_token");
      return await request(`/api/admin/auth/users/${userId}`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
    },

    approveDeposit: async (depositId, token) => {
      const adminToken =
        token || localStorage.getItem("unity_nivo_admin_token");
      return await request(`/api/admin/auth/${depositId}/approve`, {
        method: "PATCH",
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
    },

    rejectDeposit: async (depositId, remark = "", token) => {
      const adminToken =
        token || localStorage.getItem("unity_nivo_admin_token");
      return await request(`/api/admin/auth/${depositId}/reject`, {
        method: "PATCH",
        body: { remark },
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
    },
  },
};

export default api;
