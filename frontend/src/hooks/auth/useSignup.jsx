import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

function useSignup() {
    const queryClient = useQueryClient();

    const { mutateAsync: signup, isPending } = useMutation({
		mutationFn: async(formData) => {
			try {
				const response = await axios.post('/api/auth/signup', formData);
				const data = response.data;
				console.log(data);
				toast.success("Your account is created");
				
				queryClient.invalidateQueries({ queryKey: ['authUser'] });
			}
			catch(err) {
				console.log(err);
				if (err.response) {
					toast.error(err.response.data.error);
				}
				else
					toast.error(err.message);
			}
		}
	})

    return { signup, isPending };
}


export default useSignup