import { useSession } from '@/hooks/useSession'
import { queryKeys } from '@/lib/queryClient'
import type User from '@/models/api/entities/User'
import { userService } from '@/services/api'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Card, Form, Input } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function ProfileView() {
  const { profile } = useSession()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)

  const onFinish = async (values: Record<string, unknown>) => {
    const payload: Partial<User> = {
      username: values.username as string,
      name: values.name as string,
      surname: values.surname as string,
      email: values.email as string,
    }
    if (values.password) payload.password = values.password as string

    setSaving(true)
    try {
      const updated = await userService.updateProfile(payload)
      queryClient.setQueryData(queryKeys.session, updated)
      toast.success('Perfil actualizado')
    } catch {
      toast.error('No se pudo actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card title="Mi perfil" className="max-w-xl">
      <Form
        layout="vertical"
        initialValues={{
          username: profile?.username,
          name: profile?.name,
          surname: profile?.surname,
          email: profile?.email,
        }}
        onFinish={onFinish}
      >
        <Form.Item name="username" label="Usuario" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Nombres" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Apellidos"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Correo"
          rules={[{ required: true }, { type: 'email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Nueva contraseña (opcional)"
          rules={[{ min: 6, message: 'Mínimo 6 caracteres' }]}
        >
          <Input.Password placeholder="Dejar vacío para no cambiarla" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>
          Guardar
        </Button>
      </Form>
    </Card>
  )
}
