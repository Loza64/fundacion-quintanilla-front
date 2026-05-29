import AbstractService, {
  ApiServiceParams,
  CreateParams,
  DeleteParams,
  FindAllParams,
  FindByIdParams,
  FindBy,
  UpdateParams,
} from '@/models/api/core/AbstractService'
import BaseEntity from '@/models/api/core/_BaseEntity'
import { type AxiosInstance } from 'axios'
import { axiosInstance } from '../utils/axiosInstance'
import PaginationResponse from '@/models/api/core/PaginationResponse'
import { BaseResponse } from '@/models/api/core/BaseResponse'
import { appSettings } from '@/AppSettings'

export default class Service<
  Entity extends BaseEntity,
> implements AbstractService<Entity> {
  protected readonly axios: AxiosInstance
  protected readonly endpoint: string

  constructor({
    origin = appSettings.apiService,
    initPath = 'api',
    endpoint = '',
    onUnauthorized,
  }: ApiServiceParams) {
    if (!origin) throw new Error('Origin is required for ApiService instance')
    this.endpoint = endpoint
    this.axios = axiosInstance({ origin, initPath, onUnauthorized })
  }

  private getUrl(endpoint?: string, idOrPath?: string | number): string {
    const base = endpoint || this.endpoint
    if (idOrPath == null) return base

    const normalized = String(idOrPath).replace(/^\/+/, '')
    return `${base}/${normalized}`
  }

  async findAll({ endpoint, config }: FindAllParams = {}): Promise<
    PaginationResponse<Entity>
  > {
    const response = await this.axios.get<PaginationResponse<Entity>>(
      this.getUrl(endpoint),
      config
    )
    return response.data
  }

  async findById({
    id,
    endpoint,
    config,
  }: FindByIdParams): Promise<BaseResponse<Entity>> {
    const response = await this.axios.get<BaseResponse<Entity>>(
      this.getUrl(endpoint, id),
      config
    )
    return response.data
  }

  async findBy({
    endpoint,
    path,
    config,
  }: FindBy): Promise<BaseResponse<Entity>> {
    const response = await this.axios.get<BaseResponse<Entity>>(
      this.getUrl(endpoint, path),
      config
    )
    return response.data
  }

  async create({
    payload,
    endpoint,
    config,
  }: CreateParams<Entity>): Promise<BaseResponse<Entity>> {
    const response = await this.axios.post<BaseResponse<Entity>>(
      this.getUrl(endpoint),
      payload,
      config
    )
    return response.data
  }

  async update({
    id,
    payload,
    endpoint,
    config,
  }: UpdateParams<Entity>): Promise<BaseResponse<Entity>> {
    const response = await this.axios.put<BaseResponse<Entity>>(
      this.getUrl(endpoint, id),
      payload,
      config
    )
    return response.data
  }

  async delete({ id, endpoint, config }: DeleteParams): Promise<void> {
    await this.axios.delete(this.getUrl(endpoint, id), config)
  }
}
