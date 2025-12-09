import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/services/axios";

class FindService<TDto> {
  constructor(protected baseUrl: string, protected queryClient: QueryClient) {}

  // GET /{id}
  useEagerFindById(id: number) {
    return useQuery<TDto>({
      queryKey: [this.baseUrl, id],
      queryFn: () =>
        axios
          .get(`${this.baseUrl}/${id}`)
          .then(({ data }: { data: TDto }) => data),
      enabled: !!id,
    });
  }
  // GET /{id}/lazy
  useLazyFindById(id: number) {
    return useQuery<TDto>({
      queryKey: [this.baseUrl, id],
      queryFn: () =>
        axios
          .get(`${this.baseUrl}/${id}/lazy`)
          .then(({ data }: { data: TDto }) => data),
      enabled: !!id,
    });
  }
}

export { FindService };
