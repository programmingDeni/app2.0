import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/services/axios";

class NestedCrudService<TDto, TCreateDto = Omit<TDto, 'id'>> {
  protected getBaseUrl: (parentId: number) => string;
  protected queryClient: QueryClient;

  constructor(
    getBaseUrl: (parentId: number) => string,
    queryClient: QueryClient
  ) {
    this.getBaseUrl = getBaseUrl,
    this.queryClient = queryClient
  }

  // GET /machines/{machineId}/attributes
  useFindAllByParentId(parentId: number) {
    return useQuery<TDto[]>({
      queryKey: [this.getBaseUrl(parentId)],
      queryFn: () => axios.get(this.getBaseUrl(parentId)).then(r => r.data),
      enabled: !!parentId
    });
  }

  useEagerFindById(parentId: number, id: number, eager = true) {
    return useQuery<TDto>({
      queryKey: [this.getBaseUrl(parentId), id, { eager }],
      queryFn: () => axios.get(`${this.getBaseUrl(parentId)}/${id}`).then(r => r.data),
      enabled: !!(parentId && id)
    });
  }

  useLazyFindById(parentId: number, id: number, eager = true) {
    return useQuery<TDto>({
      queryKey: [this.getBaseUrl(parentId), id, { eager }],
      queryFn: () => axios.get(`${this.getBaseUrl(parentId)}/${id}/lazy`).then(r => r.data),
      enabled: !!(parentId && id)
    });
  }

  // POST /machines/{machineId}/attributes
  useCreate(parentId: number) {
    return useMutation<TDto, Error, TCreateDto>({
      mutationFn: (data) => axios.post(this.getBaseUrl(parentId), data).then(r => r.data),
      onSuccess: () => this.queryClient.invalidateQueries({ queryKey: [this.getBaseUrl(parentId)] })
    });
  }

  // PUT /machines/{machineId}/attributes/{id}
  useUpdate(parentId: number, id: number) {
    return useMutation<TDto, Error, Partial<TDto>>({
      mutationFn: (data) => axios.patch(`${this.getBaseUrl(parentId)}/${id}`, data).then(r => r.data),
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: [this.getBaseUrl(parentId)] });
        this.queryClient.invalidateQueries({ queryKey: [this.getBaseUrl(parentId), id] });
      }
    });
  }

  // DELETE /machines/{machineId}/attributes/{id}
  useDelete(parentId: number) {
    return useMutation<void, Error, number>({
      mutationFn: (id) => axios.delete(`${this.getBaseUrl(parentId)}/${id}`),
      onSuccess: () => this.queryClient.invalidateQueries({ queryKey: [this.getBaseUrl(parentId)] })
    });
  }
}

export {NestedCrudService};