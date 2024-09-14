/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function EditProfileModal({ authUser })
{
	const queryClient = useQueryClient();
	
	const [formData, setFormData] = useState({
		fullName: authUser.fullName,
		username: authUser.username,
		email: authUser.email,
		bio: authUser.bio,
		link: authUser.link,
		newPassword: "",
		currentPassword: "",
	});

	const { mutate: updateProfile, isPending: isUpdating } = useMutation({
		mutationFn: async() => {
			try {
				await axios.post('/api/users/update', formData);
				
				Promise.all([
					queryClient.invalidateQueries({ queryKey: ['authUser'] }),
					queryClient.invalidateQueries({ queryKey: ['userProfile'] })
				])
				
				setFormData({});
				document.getElementById("edit_profile_modal").close();
				
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

	function handleInputChange(e)
    {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile();
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<input
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						{
							!isUpdating && <button className='btn btn-primary rounded-full btn-sm text-white'>Update</button>
						}
						{
							isUpdating && <div className="flex items-center justify-center"><LoadingSpinner/></div>
						}
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	)
}


export default EditProfileModal