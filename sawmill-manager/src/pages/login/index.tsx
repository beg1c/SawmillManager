import { AuthPage } from "../auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        defaultValues: { email: "schulist.deshawn@example.org", password: "password" },
      }}
    />
  );
};
