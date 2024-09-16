import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

function usePostComment() {
    const queryClient = useQueryClient();

    const { mutateAsync: postComment, isPending: isCommenting } = useMutation({
		mutationFn: async({ post, comment }) => {
            toast.dismiss();
			
			try {
				const response = await axios.post(`/api/posts/comment/${post._id}`, {text: comment});
				const data = response.data;

				post.comments.push(data);

				queryClient.setQueryData(['posts'], (oldData) => {
					return oldData.map((p) => {
						if (p._id == post._id) {
							return post;
						}
						else
							return p;
					})
				})
				toast.success("Comment added");
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

    return { postComment, isCommenting };
}


export default usePostComment