import { useMutation, useQuery } from "@tanstack/react-query";
import {FindService} from "./FindService"
import axios from "@/services/axios";


class CrudService<TDto, CreateDTO> extends FindService<TDto> {
  
  // GET /
  useFindAll(eager = true) {
    return useQuery<TDto[]>({
      queryKey: [this.baseUrl, { eager }],
      queryFn: () => axios.get(`${this.baseUrl}`, { params: { eager } }).then(r => r.data)
    });
  }

  // POST /
  // davor war Omit<TDto, "id"> was vermiutlich besser ist aber ?
  useCreate() {
    return useMutation<TDto, Error,  CreateDTO>({
      mutationFn: (data) => axios.post(`${this.baseUrl}`, data).then(r => r.data),
      onSuccess: () => this.queryClient.invalidateQueries({ queryKey: [this.baseUrl] })
    });
  }

  // PUT /{id}
  useUpdate(id: number) {
    return useMutation<TDto, Error, Partial<TDto>>({
      mutationFn: (data) => axios.put(`${this.baseUrl}/${id}`, data).then(r => r.data),
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: [this.baseUrl] });
        this.queryClient.invalidateQueries({ queryKey: [this.baseUrl, id] });
      }
    });
  }

  // DELETE /{id}
  useDelete() {
    return useMutation<void, Error, number>({
      mutationFn: (id) => axios.delete(`${this.baseUrl}/${id}`),
      onSuccess: () => this.queryClient.invalidateQueries({ queryKey: [this.baseUrl] })
    });
  }
}

export {CrudService};