import type Upload from '@/models/api/entities/Upload'
import { appSettings } from '@/AppSettings'
import Service from '@/services/core/Service'

export default class UploadService extends Service<Upload> {
  constructor() {
    super({
      origin: appSettings.apiService,
      endpoint: '/uploads',
    })
  }

  public async upload(file: File): Promise<Upload> {
    const form = new FormData()
    form.append('file', file)
    const res = await this.axios.post<Upload>('/uploads', form)
    return res.data
  }
}
