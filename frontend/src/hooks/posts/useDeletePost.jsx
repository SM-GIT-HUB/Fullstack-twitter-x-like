import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

function useDeletePost() {
    const queryClient = useQueryClient();

    const { mutateAsync: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async({ post }) => {
			toast.dismiss();

			try {
				await axios.delete(`/api/posts/${post._id}`);

				toast.success("Post deleted successfully");

				queryClient.setQueryData(['posts'], (oldData) => {
					return oldData.filter((p) => {
						return (p._id != post._id);
					})
				})
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

    return { deletePost, isDeleting };
}


export default useDeletePost