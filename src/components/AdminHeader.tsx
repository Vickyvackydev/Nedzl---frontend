// import { useState } from "react";
// import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectUser } from "../state/slices/authReducer";
// import { useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AVATAR, NOTIFICATIONS } from "../assets";

function AdminHeader({
  setSideNavVisible,
}: {
  setSideNavVisible: (value: boolean) => void;
}) {
  const user = useSelector(selectUser);
  // const location = useLocation();
  // const [isOpen, setIsOpen] = useState(false);
  // const { pathname } = location;
  // const locationName = pathname.split("/").pop();
  // const dispatch = useDispatch();

  // const [notificationType, setNotificationType] = useState<"all" | "unread">(
  //   "all"
  // );

  return (
    <div className="flex justify-between items-center px-5 py-3  w-full border border-borderColor">
      {/* Breadcrumb Navigation */}
      <div>Admin</div>

      <div className="lg:hidden flex items-center gap-x-4">
        {/* <button
          type="button"
          onClick={() => {
            setDropdowns({ ...dropdowns, notification: true });
          }}
          className="lg:hidden flex relative"
        >
          <img
            src={NOTIFICATIONS}
            className="w-[40px] h-[40px] hover:scale-95 transition-all duration-200"
            alt=""
          />
          {unreadNotifications?.length > 0 && (
            <div className="w-[20px] absolute h-[20px] -right-1 -top-2 text-white text-[10px] rounded-full bg-red-600 flex items-center justify-center">
              {unreadNotifications?.length}
            </div>
          )}
        </button> */}

        <button onClick={() => setSideNavVisible(true)}>
          {/* <img src={TOGGLER_ICON} className="w-[25px] h-[25px]" alt="" /> */}
          <FaBars size={25} />
        </button>
      </div>

      <div className="lg:flex hidden items-center justify-end gap-x-3">
        <button
          type="button"
          //   onClick={() => {
          //     setDropdowns({ ...dropdowns, notification: true });
          //   }}
          className="lg:flex hidden relative"
        >
          <img
            src={NOTIFICATIONS}
            className="w-[40px] h-[40px] hover:scale-95 transition-all duration-200"
            alt=""
          />
          {/* {unreadNotifications?.length > 0 && (
            <div className="w-[20px] absolute h-[20px] -right-1 -top-2 text-white text-[10px] rounded-full bg-red-600 flex items-center justify-center">
              {unreadNotifications?.length}
            </div>
          )} */}
        </button>
        <div className="lg:flex hidden items-center gap-x-2  border-[#E5E5E5] border-l pl-2">
          <img
            src={AVATAR}
            className="w-[40px] h-[40px] rounded-full object-cover"
            alt=""
          />
          <div className="flex items-end">
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">{user?.user_name}</span>
              <span className="text-xs font-normal text-[#72777A]">
                {user?.email && user?.email.length > 15
                  ? `${user?.email?.slice(0, 15)}...`
                  : user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <NotificationBox
        showPopUp={dropdowns.notification}
        notificationBoxRef={dropdownRef.notification}
        notifications={renderNotifications}
        loadingNotifications={notifcationLoading}
        unreadNotifications={unreadNotifications}
        setNotificationType={setNotificationType}
        notificationType={notificationType}
        refetch={refetch}
        refetchUnread={refetchUnread}
      /> */}

      {/* <CopyPopUp
        // @ts-ignore
        showPopup={isCopied}
      /> */}
    </div>
  );
}

export default AdminHeader;
