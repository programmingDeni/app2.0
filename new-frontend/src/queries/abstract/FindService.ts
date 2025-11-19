import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/services/axios";

class FindService<TDto> {
  constructor(
    protected baseUrl: string,
    protected queryClient: QueryClient
  ) {}

  // GET /{id}
  useEagerFindById(id: number, eager = true) {
    return useQuery<TDto>({
      queryKey: [this.baseUrl, id, { eager }],
      queryFn: () => axios.get(`${this.baseUrl}/${id}`).then(r => r.data),
      enabled: !!id
    });
  }
  // GET /{id}/lazy
  useLazyFindById(id: number, eager = true) {
    return useQuery<TDto>({
      queryKey: [this.baseUrl, id, { eager }],
      queryFn: () => axios.get(`${this.baseUrl}/${id}/lazy`).then(r => r.data),
      enabled: !!id
    });
  }
}

export {FindService};