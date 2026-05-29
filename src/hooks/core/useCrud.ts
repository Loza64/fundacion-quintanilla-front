import BaseEntity from '@/models/api/core/_BaseEntity'
import AbstractService, {
  CreateParams,
  DeleteParams,
  FindByIdParams,
  FindBy,
  UpdateParams,
} from '@/models/api/core/AbstractService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface UseCrudOptions<Entity extends BaseEntity> {
  service: AbstractService<Entity>
  queryKey: string | string[]
}

export default function useCrud<Entity extends BaseEntity>({
  service,
  queryKey = 'list',
}: UseCrudOptions<Entity>) {
  const queryClient = useQueryClient()

  const normalizedQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey]

  const createMutation = useMutation({
    mutationFn: (params: CreateParams<Entity>) => service.create(params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const updateMutation = useMutation({
    mutationFn: (params: UpdateParams<Entity>) => service.update(params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const removeMutation = useMutation({
    mutationFn: (params: DeleteParams) => service.delete(params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const useFindById = (params: FindByIdParams) => {
    return useQuery({
      queryKey: [queryKey, params.id],
      queryFn: () => service.findById(params),
      enabled: !!params.id,
    })
  }

  const useFindBy = (params: FindBy) => {
    return useQuery({
      queryKey: [queryKey, params],
      queryFn: () => service.findBy(params),
      enabled: !!params,
    })
  }

  return {
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: removeMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: removeMutation.isPending,

    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: removeMutation.error,

    useFindById,
    useFindByPath: useFindBy,
  }
}
