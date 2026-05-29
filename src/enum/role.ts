export const roles = {
  admin: 'ADMIN',
  all: '*',
} as const

export type RoleName = (typeof roles)[keyof typeof roles]
