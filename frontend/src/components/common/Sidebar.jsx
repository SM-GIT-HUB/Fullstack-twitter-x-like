import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md"
import { IoNotifications } from "react-icons/io5"
import { FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { BiLogOut } from "react-icons/bi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import axios from "axios"

function Sidebar()
{
	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({ queryKey: ['authUser'] });

	const { mutate: logout, isPending } = useMutation({
		mutationFn: async() => {
			try {
				await axios.post('/api/auth/logout');
				toast.dismiss();
				toast.success("Logged out successfully");
				
				queryClient.invalidateQueries({ queryKey: ['authUser'] });
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
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<div className='mt-auto mb-10 flex gap-2 items-center justify-center transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full' >
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<Link to={`/profile/${authUser.username}`}>
								<img src={authUser?.profileImg || "https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} />
								</Link>
							</div>
						</div>
						<div className='hidden md:flex justify-between flex-1'>
							<div>
								<Link to={`/profile/${authUser.username}`}>
								<p className='text-white font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
								<p className='text-slate-500 text-sm'>@{authUser?.username}</p>
								</Link>
							</div>
						</div>
						{
							isPending? <div className="loading loading-spinner"></div> :
							<BiLogOut className='w-5 h-full cursor-pointer' onClick={(e) => {
								e.preventDefault();
								logout();
							}}/>
						}
					</div>
				)}
			</div>
		</div>
	)
}


export default Sidebar;