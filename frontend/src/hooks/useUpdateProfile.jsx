import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

export function useUpdateProfile()
{
    const queryClient = useQueryClient();

    const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
		mutationFn: async(formData) => {
			try {
				await axios.post('/api/users/update', formData);
				
				Promise.all([
					queryClient.invalidateQueries({ queryKey: ['authUser'] }),
					queryClient.invalidateQueries({ queryKey: ['userProfile'] })
				])
				
                toast.dismiss();
				toast.success("Profile updated");
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

    return { updateProfile, isUpdating };
}