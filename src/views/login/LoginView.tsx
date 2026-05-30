import { useSession } from '@/hooks/useSession'
import { Button, Form, Input, message, Tabs } from 'antd'
import logo from '@/assets/img/logo.png'

interface LoginProps {
  username: string
  password: string
}

export default function AuthView() {
  const { login, saveSession, loading } = useSession()

  const [loginForm] = Form.useForm<LoginProps>()

  const handleLogin = async (values: LoginProps) => {
    try {
      const response = await login({
        username: values.username.trim(),
        password: values.password,
        onUnauthorized() {
          message.warning('Usuario o contraseña incorrectos')
        },
      })

      loginForm.resetFields()
      saveSession(response)
    } catch (error: unknown) {
      console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="mx-5 flex min-h-[60dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-lg md:flex-row">
        <div className="flex w-full flex-col justify-center p-6 md:w-1/2">
          <Tabs defaultActiveKey="login" centered>
            <Tabs.TabPane tab="Iniciar sesión" key="login">
              <Form<LoginProps>
                form={loginForm}
                layout="vertical"
                onFinish={handleLogin}
                className="w-full"
              >
                <Form.Item
                  label="Usuario"
                  name="username"
                  rules={[{ required: true, message: 'Ingresa tu usuario' }]}
                >
                  <Input placeholder="Usuario" />
                </Form.Item>

                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
                >
                  <Input.Password placeholder="Contraseña" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading.login}
                    className="w-full font-bold!"
                  >
                    Iniciar sesión
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </div>

        <div className="hidden md:block md:w-1/2">
          <img src={logo} alt="Login" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  )
}
