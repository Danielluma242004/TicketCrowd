import axios from "axios";

const loginApi = axios.create({
  baseURL: "http://localhost:8000/auth/",
});

export const userRegister = async (
  username: string,
  password: string,
  email: string,
  first_name: string,
  last_name: string
) => {
  try {
    const res = await loginApi.post("/register/", {
      username,
      password,
      email,
      first_name,
      last_name,
    });
    return res;
  } catch (error: any) {
    throw {
      message: error.response.data.message,
      errorType: error.response.data.errorType,
    };
  }
};

export const userLogin = async (username: string, password: string) => {
  try {
    const res = await loginApi.post("login/", {
      username,
      password,
    });
    return res;
  } catch (error: any) {
    throw new Error(`Login failed: ${error.response.data.message}`);
  }
};

export const userLogout = async () => {
  try {
    const res = await loginApi.post("/logout/");
    return res;
  } catch (error: any) {
    throw new Error(`Logout failed: ${error.response.data.message}`);
  }
};
