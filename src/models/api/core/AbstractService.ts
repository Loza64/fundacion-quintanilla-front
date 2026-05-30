import type { AxiosRequestConfig } from 'axios'
import PaginationResponse from './PaginationResponse'
import { BaseResponse } from './BaseResponse'

interface RequestMeta {
  onUnauthorized?: () => void
  onForbidden?: () => void
}

export type ServiceConfig = AxiosRequestConfig & RequestMeta

export interface ApiServiceParams {
  endpoint?: string
  initPath?: string
  origin?: string
}
export interface FindAllParams {
  endpoint?: string
  config?: ServiceConfig
}

export interface FindByIdParams {
  id?: number
  endpoint?: string
  config?: ServiceConfig
}

export interface FindBy {
  endpoint?: string
  path: string
  config?: ServiceConfig
}

export interface CreateParams<Entity> {
  payload: Entity | FormData
  endpoint?: string
  config?: ServiceConfig
}

export interface UpdateParams<Entity> {
  id: string
  payload: Partial<Entity> | FormData
  endpoint?: string
  config?: ServiceConfig
}

export interface DeleteParams {
  id: string
  endpoint?: string
  config?: ServiceConfig
}

export default abstract class AbstractService<Entity> {
  abstract findAll(params?: FindAllParams): Promise<PaginationResponse<Entity>>
  abstract findById(params: FindByIdParams): Promise<BaseResponse<Entity>>
  abstract findBy(params: FindBy): Promise<BaseResponse<Entity>>
  abstract create(params: CreateParams<Entity>): Promise<BaseResponse<Entity>>
  abstract update(params: UpdateParams<Entity>): Promise<BaseResponse<Entity>>
  abstract delete(params: DeleteParams): Promise<void>
}
