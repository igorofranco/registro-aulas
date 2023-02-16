import React, { useState } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import UserApi from '../Api/UserApi';
import { useRouter } from 'next/router';
import userStore from '../store/userStore';
import { userSlice } from '../features/user/userSlice';

type SingupFormFieldName = 'name' | 'email' | 'password' | 'passwordConfirm';

interface FormField {
  value: string;
  visited?: boolean;
}

interface LoginFormType {
  email: FormField;
  password: FormField;
}

interface SignupFormType extends LoginFormType{
  name?: FormField;
  passwordConfirm?: FormField;
}

interface AuthFormType extends SignupFormType {}

interface AuthFormProps {
  type: 'login' | 'signup';
}

function createLoginForm (): LoginFormType {
  return {
    email: { value: '' },
    password: { value: '' }
  };
}

function createSignupForm (): SignupFormType {
  return {
    ...createLoginForm(),
    name: { value: '' },
    passwordConfirm: { value: '' }
  };
}

const AuthForm = (props: AuthFormProps) => {
  const [form, setForm] = useState<AuthFormType>(isLogin() ? createLoginForm() : createSignupForm());
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = userSlice.actions;

  const inputsVariant = 'standard';

  function isSignup (): boolean { return props.type === 'signup'; }
  function isLogin (): boolean { return !isSignup(); }

  function handleChangeFormField (e: React.ChangeEvent, fieldName: SingupFormFieldName): void {
    const value = (e.target as HTMLInputElement).value;
    if (fieldName === 'name' && value.match(/\d+/)) {
      (e.target as HTMLInputElement).value = form?.name?.value || '';
      return;
    }
    setForm(form => ({
      ...form,
      [fieldName]: { ...form[fieldName], value }
    }));
  }

  function handleBlurFormField (e: React.FocusEvent, fieldName: SingupFormFieldName): void {
    if (fieldName === 'name') {
      const value = sanitize.name((e.target as HTMLInputElement).value);
      (e.target as HTMLInputElement).value = value;
      setForm(form => ({
        ...form,
        name: { value, visited: true }
      }));
    }
    setForm(form => ({
      ...form,
      [fieldName]: { ...form[fieldName], visited: true }
    }));
  }

  function login (): void {
    if (!validate.form()) { return; }
    setLoading(true);
    UserApi.attemptLogin({
      email: form.email.value,
      password: form.password.value
    })
      .then(async (token) => {
        userStore.dispatch(setUser({
          name: form.name?.value,
          email: form.email.value,
          token
        }));
        await router.push('/');
        setLoading(false);
      })
      .catch(() => {
        alert('erro no login');
        setLoading(false);
      });
  }
  function signup (): void {
    if (!validate.form() || !form.name) { return; }
    setLoading(true);
    UserApi.create({
      name: form.name.value,
      email: form.email.value,
      password: form.password.value
    })
      .then(() => login())
      .catch(() => {
        alert('erro no cadastro');
        setLoading(false);
      });
  }

  const validate = {
    name (): boolean {
      return !!form?.name?.value.match(/\w{4,}/i);
    },
    email (): boolean {
      return !!form.email.value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);
    },
    password (): boolean {
      return !!form.password.value.match(/.{6,}/);
    },
    passwordConfirm (): boolean {
      return this.password() && form.password.value === form?.passwordConfirm?.value;
    },
    loginForm (): boolean {
      return this.password() &&
        this.email();
    },
    signupForm (): boolean {
      return this.loginForm() &&
        this.passwordConfirm() &&
        this.name();
    },
    form (): boolean {
      return isSignup() ? this.signupForm() : this.loginForm();
    }
  };

  const sanitize = {
    name (name: string): string {
      return !name
        ? ''
        : name
          .replaceAll(/\d+|\./gi, ' ')
          .trim()
          .toLowerCase()
          .split(/\s+/g)
          .map(w => w[0].toUpperCase() + w.substring(1))
          .map(w => w.length > 1 ? w : w + '.')
          .join(' ');
    }
  };

  return (
    <main>
      <h1 className='mb-8 text-center font-bold text-3xl'>
        {isLogin() ? 'Login' : 'Cadastro'}
      </h1>
      <form className="w-full flex flex-col gap-7">
        {isLogin()
          ? null
          : <TextField
          type="text"
          label="Nome Completo"
          autoComplete="name"
          variant={inputsVariant}
          disabled={isLoading}
          fullWidth
          error={form?.name?.visited && !validate.name()}
          onChange={(e) => handleChangeFormField(e, 'name')}
          onBlur={(e) => handleBlurFormField(e, 'name')}
          InputProps={{
            startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon={faUser} /></InputAdornment>
          }}
        />}
        <TextField
          type="email"
          label="Email"
          autoComplete="email"
          variant={inputsVariant}
          fullWidth
          disabled={isLoading}
          error={form.email.visited && !validate.email()}
          onChange={(e) => handleChangeFormField(e, 'email')}
          onBlur={(e) => handleBlurFormField(e, 'email')}
          InputProps={{
            startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon={faEnvelope} /></InputAdornment>
          }}
        />
        <TextField
          type="password"
          label="Senha"
          autoComplete={isLogin() ? 'password' : 'new-password'}
          variant={inputsVariant}
          fullWidth
          disabled={isLoading}
          error={form.password.visited && !validate.password()}
          onChange={(e) => handleChangeFormField(e, 'password')}
          onBlur={(e) => handleBlurFormField(e, 'password')}
          InputProps={{
            startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon={faLock} /></InputAdornment>
          }}
        />

        {isLogin()
          ? null
          : <TextField
          type="password"
          label="Confirme a senha"
          autoComplete={isLogin() ? 'password' : 'new-password'}
          variant={inputsVariant}
          fullWidth
          disabled={isLoading}
          error={form?.passwordConfirm?.visited && !validate.passwordConfirm()}
          onChange={(e) => handleChangeFormField(e, 'passwordConfirm')}
          onBlur={(e) => handleBlurFormField(e, 'passwordConfirm')}
          InputProps={{
            startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon={faLock} /></InputAdornment>
          }}
        />}

        <Button
          variant="contained"
          size='large'
          fullWidth
          disabled={!validate.form() || isLoading}
          onClick={() => isLogin() ? login() : signup()}
          endIcon={<FontAwesomeIcon icon={faUser} />}
        >
          {isLogin() ? 'Login' : 'Cadastrar'}
        </Button>
      </form>
      <div className='mt-2 text-center'>
        <span>
          {isSignup() ? 'Já possui cadastro? ' : 'Ainda não se cadastrou? '}
        </span>
        <Link
          className='text-blue-600 hover:underline'
          href={isSignup() ? '/login' : '/cadastro'}
        >
          {isSignup() ? 'Fazer Login' : 'Cadastrar-se'}
        </Link>
      </div>
    </main>
  );
};

export const LoginForm = () => <AuthForm type='login' />;
export const SignupForm = () => <AuthForm type='signup' />;
