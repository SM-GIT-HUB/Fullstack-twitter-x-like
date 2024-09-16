import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

function useDeleteNotifications() {
    const queryClient = useQueryClient();

    const { mutate: deleteNotifications } = useMutation({
		mutationFn: async() => {
			try {
				await axios.delete('/api/notifications');
				queryClient.setQueryData(['notifications'], () => []);

				toast.dismiss();
				toast.success("All notifications deleted");
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
	
	const { mutate: deleteNotification } = useMutation({
		mutationFn: async(notiId) => {
			try {
				await axios.delete(`/api/notifications/${notiId}`);

				queryClient.setQueryData(['notifications'], (oldData) => {
					return oldData.filter((noti) => {
						return (noti._id != notiId);
					})
				})

				toast.dismiss();
				toast.success("Notification deleted");
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

    return { deleteNotifications, deleteNotification }
}


export default useDeleteNotifications