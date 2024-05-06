import { AuthPage } from "../auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        defaultValues: { email: "executive@beg1c.dev", password: "sawmill-manager" },
      }}
    />
  );
};
