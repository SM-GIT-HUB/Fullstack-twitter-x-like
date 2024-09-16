import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

function useLogin() {
    const queryClient = useQueryClient();

    const { mutateAsync: login, isPending } = useMutation({
		mutationFn: async(formData) => {
            toast.dismiss();
            
			try {
				await axios.post('/api/auth/login', formData);
                
				toast.success("Login successful");
				
				queryClient.invalidateQueries({ queryKey: ['authUser'] });
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

    return { login, isPending };
}


export default useLogin