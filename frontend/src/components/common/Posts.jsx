/* eslint-disable react/prop-types */
import Post from "./Post"
import PostSkeleton from "../skeletons/PostSkeleton"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useEffect } from "react"

function Posts({ feedType })
{
	function getPostEndPoint()
	{
		if (feedType == "forYou") {
			return '/api/posts/all';
		}
		else if (feedType == "following") {
			return '/api/posts/following'
		}
		else
			return '/api/posts/all'
	}

	const post_endpoint = getPostEndPoint();

	const {data: posts, isPending, refetch, isRefetching} = useQuery({
		queryKey: ["posts"],
		queryFn: async() => {
			try {
				const response = await axios.get(post_endpoint);
				const data = response.data;

				return data;
			}
			catch {
				return "";
			}
		}
	})

	useEffect(() => {
		refetch();
	}, [feedType, refetch])

	return (
		<>
			{(isPending || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isPending && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isPending && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	)
}


export default Posts