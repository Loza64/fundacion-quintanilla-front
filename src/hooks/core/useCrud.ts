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
  onUnauthorized?: () => void
  onForbidden?: () => void
}

export default function useCrud<Entity extends BaseEntity>({
  onForbidden,
  onUnauthorized,
  service,
  queryKey = 'list',
}: UseCrudOptions<Entity>) {
  const queryClient = useQueryClient()

  const normalizedQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey]

  const createMutation = useMutation({
    mutationFn: (
      params: CreateParams<Entity> & {
        onUnauthorized?: () => void
        onForbidden?: () => void
      }
    ) =>
      service.create({
        ...params,
        config: {
          ...params.config,
          onForbidden: onForbidden ?? params.onForbidden,
          onUnauthorized: onUnauthorized ?? params.onUnauthorized,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const updateMutation = useMutation({
    mutationFn: (
      params: UpdateParams<Entity> & {
        onUnauthorized?: () => void
        onForbidden?: () => void
      }
    ) =>
      service.update({
        ...params,
        config: {
          ...params.config,
          onForbidden: onForbidden ?? params.onForbidden,
          onUnauthorized: onUnauthorized ?? params.onUnauthorized,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const removeMutation = useMutation({
    mutationFn: (
      params: DeleteParams & {
        onUnauthorized?: () => void
        onForbidden?: () => void
      }
    ) =>
      service.delete({
        ...params,
        config: {
          ...params.config,
          onForbidden: onForbidden ?? params.onForbidden,
          onUnauthorized: onUnauthorized ?? params.onUnauthorized,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
  })

  const useFindById = (
    params: FindByIdParams & {
      onUnauthorized?: () => void
      onForbidden?: () => void
    }
  ) => {
    return useQuery({
      queryKey: [queryKey, params.id],
      queryFn: () =>
        service.findById({
          ...params,
          config: {
            ...params.config,
            onForbidden: onForbidden ?? params.onForbidden,
            onUnauthorized: onUnauthorized ?? params.onUnauthorized,
          },
        }),
      enabled: !!params.id,
    })
  }

  const useFindBy = (
    params: FindBy & { onUnauthorized?: () => void; onForbidden?: () => void }
  ) => {
    return useQuery({
      queryKey: [queryKey, params],
      queryFn: () =>
        service.findBy({
          ...params,
          config: {
            ...params.config,
            onForbidden: onForbidden ?? params.onForbidden,
            onUnauthorized: onUnauthorized ?? params.onUnauthorized,
          },
        }),
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
