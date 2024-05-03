import { AuthPage } from "../auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        defaultValues: { email: "javonte55@majmun.com", password: "12345678" },
      }}
    />
  );
};
