import { AuthBindings, useApiUrl } from "@refinedev/core";

export const TOKEN_KEY = "bearer-token";

import axios from "axios";
import { IEmployee } from "../interfaces/interfaces";
const apiUrl = "http://127.0.0.1:8000/api/";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("bearer-token");
        if (token && config?.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

let employee: IEmployee;

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const response = await fetch(
      apiUrl + "login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      },
    );

    const data = await response.json();

    if (response.status == 200) {
      localStorage.setItem(TOKEN_KEY, data.data.bearer_token);
      return { success: true };
    }

    return { 
      success: false,
      error: {
        name: "Authentication failed",
        message: "Invalid credentials",
      },
     };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  forgotPassword: async ({ email }) => {
    const response = await fetch(
      apiUrl + "forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      },
    );

    if (response.status == 200) {
      return { 
        success: true,
        successNotification: {
          message: "Email with instructions sent."
        },
        redirectTo: "/login"
      };
    }

    return { 
      success: false,
      error: {
        name: "Please enter a valid, existing email address.",
        message: "Email not found",
      },
     };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    if (employee) {
      return employee.role.role_name;
    }
    else {
      const response = await fetch(apiUrl + "users/me", 
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem(TOKEN_KEY),
          },
        }
      );

      if (response.status < 200 || response.status > 299) {
        return null;
      }

      const data = await response.json();

      employee = data.data;

      return employee.role.role_name;
    }
  },
  getIdentity: async () => {
    const response = await fetch(apiUrl + "users/me", 
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem(TOKEN_KEY),
        },
      }
    );

    if (response.status < 200 || response.status > 299) {
      return null;
    }

    const data = await response.json();

    employee = data.data;

    return data.data;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
