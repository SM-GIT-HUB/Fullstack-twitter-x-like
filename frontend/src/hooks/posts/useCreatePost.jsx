import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

function useCreatePost() {
    const queryClient = useQueryClient();

    const { mutateAsync: createPost, isPending } = useMutation({
		mutationFn: async({ text, img }) => {
			toast.dismiss();

			try {
				const response = await axios.post('/api/posts/create', { text, img });
				const data = response.data;

				toast.success("Post created");
				
				queryClient.setQueryData(['posts'], (oldData) => [data, ...oldData]);
			}
			catch(err) {
				if (err.response) {
					toast.error(err.response.data.error);
				}
				else
					toast.error(err.message);
			}
		}
	})

    return { createPost, isPending };
}


export default useCreatePost