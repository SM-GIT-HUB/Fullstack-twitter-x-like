import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"
import LoadingSpinner from "../../components/common/LoadingSpinner"

function Search() {
    const [text, setText] = useState("");

    const {data: users, isPending, refetch, isRefetching } = useQuery({
        queryKey: ['searchUsers'],
        queryFn: async() => {
            if (text.length == 0) {
                return [];
            }
            try {
                const response = await axios.get('/api/users/search', { params: { text } });
                const data = response.data;

                return data;
            }
            catch(err) {
                toast.dismiss();
                if(err.response) {
                    toast.error(err.response.data.error);
                }
                else
                    toast.error(err.message);

                return [];
            }
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    async function handleSubmit(e)
    {
        e.preventDefault();
        if (text.length == 0) {
            return;
        }
        refetch();
    }

  return (
    <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit} className="flex w-[95%] items-center m-[10px] gap-[18px] border-[1.2px] border-white rounded-[4px] overflow-hidden hover:border-blue-500 transition-all">
            <input type="text" value={text} onChange={(e) => {setText(e.target.value)}} placeholder="search" className="w-[90%] p-[10px] outline-none bg-black" />
            <div className="flex items-center justify-center">
                <FaSearch className="w-6 h-6" onClick={handleSubmit} cursor="pointer"/>
            </div>
        </form>
        <div className="m-[10px] w-[90%]">
            {
                isPending || isRefetching? <div className="flex justify-center"><LoadingSpinner/></div> :
                users?.map((user) => (
                    <div key={user._id} className="w-full flex mb-[10px] items-center bg-[#0d0d0d] p-[5px] rounded-[10px]">
                        <div className="flex items-center gap-[10px] w-full">
                            <div className="rounded-full overflow-hidden w-12 h-12">
                                <img src={user.dp}/>
                            </div>
                            <div>
                                <h1>{user.fullName}</h1>
                                <h1 className="text-gray-700">@{user.username}</h1>    
                            </div>
                        </div>
                        <Link to={`/profile/${user.username}`}>
                            <div className="btn btn-sm btn-primary rounded-full px-[15px]">Visit</div>
                        </Link>
                    </div>
                ))
            }
            {
                !isPending && !isRefetching && users?.length == 0? <div className="flex items-center justify-center">No users found</div> : ""
            }
            </div>
    </div>
  )
}


export default Search