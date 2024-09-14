import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

function useFollow()
{
    const queryClient = useQueryClient();
    
    const { mutate: follow, isPending } = useMutation({
        mutationFn: async(userId) => {
            try {
                const response = await axios.post(`/api/users/follow/${userId}`);
                const data = response.data;
                
                Promise.all([
                    queryClient.invalidateQueries({queryKey: ['suggestions']}),
                    queryClient.setQueryData(['authUser'], (oldData) => {
                        return { ...oldData, following: data.followingList };
                    })
                ])

                toast.dismiss();
                toast.success(data.message);
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

    return { follow, isPending };
}


export default useFollow