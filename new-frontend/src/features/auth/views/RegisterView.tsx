import { useRegister } from "../query/useRegister";
import { RegisterFormUI } from "../components-ui/RegisterFormUi";
import { RegisterRequest } from "../types/RegisterRequest";

export const RegisterView = () => {
  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (data: RegisterRequest) => {
    register(data);
  };

  return (
    <RegisterFormUI
      onSubmit={handleSubmit}
      isLoading={isPending}
      error={error}
    />
  );
};
