import { AuthPage } from "../auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        defaultValues: { email: "dgorczany@example.net", password: "123456" },
      }}
    />
  );
};
