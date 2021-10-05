import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import AuthLayout from "../../layouts/Auth";

import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import { Row, Title, Label } from "../../components/Auth";
import Link from "../../components/Link";


import useApi from "../../hooks/useApi";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingSignUp, setLoadingSignUp] = useState(false);

  const history = useHistory();

  const api = useApi();
  

  function submit(event) {
    event.preventDefault();
    setLoadingSignUp(true);

    if (password !== confirmPassword) {
      toast("As senhas devem ser iguais!");
    } else {
      api.user.signUp(email, password).then(response => {
        toast("Inscrito com sucesso! Por favor, faça login.");
        history.push("/sign-in");
      }).catch(error => {
        if (error.response) {
          for (const detail of error.response.data.details) {
            toast(detail);
          }
        } else {
          toast("Não foi possível conectar ao servidor!");
        }
      }).then(() => {
        setLoadingSignUp(false);
      });
    }
  }

  return (
    <AuthLayout >
      <Row>
        <Title>Cadastro </Title>
      </Row>
      <Row>
        <Label>Inscrição</Label>
        <form onSubmit={submit}>
          <Input label="E-mail" type="text" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Senha" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} />
          <Input label="Repita sua senha" type="password" fullWidth value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <Button type="submit" color="primary" fullWidth disabled={loadingSignUp}>Inscrever</Button>
        </form>
      </Row>
      <Row>
        <Link to="/sign-in">Já está inscrito? Faça login</Link>
      </Row>
    </AuthLayout>
  );
}
