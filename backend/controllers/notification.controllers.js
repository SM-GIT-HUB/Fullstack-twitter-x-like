import notificationModel from "../models/notification.model.js"
import userModel from "../models/user.model.js"

async function getNotifications(req, res)
{
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let notifications = await notificationModel.find({ to: user._id }).populate([
            { path: "from", select: "username dp" }
        ]).sort("-createdAt")

        for (let i = 0; i < notifications.length; i++)
        {
            notifications[i].read = true;
            await notifications[i].save();
        }

        res.status(200).json( notifications );
    }
    catch(err) {
        console.log(`error in getNotifications ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function deleteNotifications(req, res)
{
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await notificationModel.deleteMany({ to: user._id });
        
        res.status(200).json({ message: "Notifications deleted successfully" });
    }
    catch(err) {
        console.log(`error in deleteNotifications ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function deleteNotification(req, res)
{
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const { id } = req.params;
        const notification = await notificationModel.findById(id);

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        if (notification.to.toString() != user._id) {
            return res.status(403).json({ error: "You cannot delete this notification" });
        }

        await notificationModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Notification deleted" });
    }
    catch(err) {
        console.log(`error in deleteNotification ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


export { getNotifications, deleteNotifications, deleteNotification }