import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

function useLikePost() {
    const queryClient = useQueryClient();

    const { mutateAsync: likePost, isPending: isLiking } = useMutation({
		mutationFn: async({ post }) => {
			try {
				const response = await axios.post(`/api/posts/like/${post._id}`);
				const data = response.data;
				
				queryClient.setQueryData(['posts'], (oldData) => {
					return oldData.map((p) => {
						if (p._id == post._id) {
							return { ...p, likes: data };
						}
						else
							return p;
					})
				})
			}
			catch(err) {
				toast.dismiss();
				if (err.response) {
					toast.error(err.response.data.error);
				}
				else
					toast.error(err.message);
			}
		}
	})

    return { likePost, isLiking };
}


export default useLikePost