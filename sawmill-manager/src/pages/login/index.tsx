import { AuthPage } from "../auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        defaultValues: { email: "godfrey69@example.org", password: "password" },
      }}
    />
  );
};
