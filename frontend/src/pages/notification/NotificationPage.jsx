import { Link } from "react-router-dom"
import LoadingSpinner from "../../components/common/LoadingSpinner"

import { IoTrashOutline } from "react-icons/io5"
import { FaComment, FaUser } from "react-icons/fa"
import { FaHeart } from "react-icons/fa6"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import axios from "axios"

function NotificationPage()
{
	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ['notifications'],
		queryFn: async() => {
			try {
				const response = await axios.get('/api/notifications');
				const data = response.data;

				return data;
			}
			catch(err) {
				toast.dismiss();
				if (err.response) {
					toast.error(err.response.data.error);
				}
				else
					toast.error(err.message);
				return "";
			}
		}
	})

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

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<IoTrashOutline size={20} className="cursor-pointer transition-all hover:text-red-700" onClick={deleteNotifications}/>
					
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex jus gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							{notification.type === "comment" && <FaComment className='w-7 h-7 text-white' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.dp || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you." : notification.type == "like"? "liked your post." : "commented on your post."}
								</div>
							</Link>
							<IoTrashOutline size={20} className="cursor-pointer transition-all hover:text-red-700 ml-auto" onClick={() => deleteNotification(notification._id)}/>
						</div>
					</div>
				))}
			</div>
		</>
	)
}


export default NotificationPage