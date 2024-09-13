import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

function useFollow()
{
    const queryClient = useQueryClient();
    
    const { mutate: follow, isPending } = useMutation({
        mutationFn: async(userId) => {
            try {
                await axios.post(`/api/users/follow/${userId}`);
                
                Promise.all([
                    queryClient.invalidateQueries(['authUser']),
                    queryClient.invalidateQueries(['suggestions'])
                ])
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