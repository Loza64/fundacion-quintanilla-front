import AbstractService, {
  ApiServiceParams,
  CreateParams,
  DeleteParams,
  ExportExcelParams,
  FindAllParams,
  FindByIdParams,
  FindBy,
  UpdateParams,
  ServiceConfig,
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
  }: ApiServiceParams) {
    if (!origin) throw new Error('Origin is required for ApiService instance')
    this.endpoint = endpoint
    this.axios = axiosInstance({ origin, initPath })
  }

  private getUrl(endpoint?: string, idOrPath?: string | number): string {
    const base = endpoint || this.endpoint
    if (idOrPath == null) return base
    const normalized = String(idOrPath).replace(/^\/+/, '')
    return `${base}/${normalized}`
  }

  private withMeta(config?: ServiceConfig) {
    return {
      ...config,
      onUnauthorized: config?.onUnauthorized,
      onForbidden: config?.onForbidden,
    }
  }

  async findAll(params: FindAllParams): Promise<PaginationResponse<Entity>> {
    const res = await this.axios.get(
      this.getUrl(params.endpoint),
      this.withMeta(params.config)
    )
    return res.data
  }

  async findById(params: FindByIdParams): Promise<BaseResponse<Entity>> {
    const res = await this.axios.get(
      this.getUrl(params.endpoint, params.id),
      this.withMeta(params.config)
    )
    return res.data
  }

  async findBy(params: FindBy): Promise<BaseResponse<Entity>> {
    const response = await this.axios.get<BaseResponse<Entity>>(
      this.getUrl(params.endpoint, params.path),
      this.withMeta(params.config)
    )
    return response.data
  }

  async create(params: CreateParams<Entity>): Promise<BaseResponse<Entity>> {
    const res = await this.axios.post(
      this.getUrl(params.endpoint),
      params.payload,
      this.withMeta(params.config)
    )
    return res.data
  }

  async update(params: UpdateParams<Entity>): Promise<BaseResponse<Entity>> {
    const res = await this.axios.put(
      this.getUrl(params.endpoint, params.id),
      params.payload,
      this.withMeta(params.config)
    )
    return res.data
  }

  async delete(params: DeleteParams): Promise<void> {
    await this.axios.delete(
      this.getUrl(params.endpoint, params.id),
      this.withMeta(params.config)
    )
  }

  async softDelete(params: DeleteParams): Promise<BaseResponse<Entity>> {
    const res = await this.axios.patch(
      this.getUrl(params.endpoint, `${params.id}/soft-delete`),
      undefined,
      this.withMeta(params.config)
    )
    return res.data
  }

  async restore(params: DeleteParams): Promise<BaseResponse<Entity>> {
    const res = await this.axios.patch(
      this.getUrl(params.endpoint, `${params.id}/restore`),
      undefined,
      this.withMeta(params.config)
    )
    return res.data
  }

  async exportExcel(params?: ExportExcelParams): Promise<void> {
    const res = await this.axios.get(
      this.getUrl(params?.endpoint, 'excel/generate'),
      { ...this.withMeta(params?.config), responseType: 'blob' }
    )

    const contentType =
      (res.headers['content-type'] as string | undefined) ??
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const blob = new Blob([res.data as BlobPart], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download =
      params?.filename ?? `${params?.endpoint ?? this.endpoint}.xlsx`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.URL.revokeObjectURL(url)
  }
}
