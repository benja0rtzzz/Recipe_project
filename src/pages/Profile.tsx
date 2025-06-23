import { CircleUser } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/authService";
import { deleteUserAccount } from "@/services/userService";
import { useNavigate } from "react-router-dom";
import { getUserInformation } from "@/services/userService";
import { useEffect, useState } from "react";
import type { StoreUser } from "@/types/User";
import SpinningLoader from "@/components/ui/loading";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<StoreUser>();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popUpError, setPopUpError] = useState("");
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
    navigate("/");
  };

  const handleDeleteProfile = async () => {
    if (!password) {
      setPopUpError("Password is required to delete the account.");
      return;
    }
    if (user) {
      try {
        await deleteUserAccount(user.email!, password);
        navigate("/");
      } catch (error) {
        console.error("Error deleting user account:", error);
      }
    }
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchUserInformation = async () => {
      if (user) {
        try {
          const userInfo = await getUserInformation(user.uid);
          if (userInfo) {
            setUserInfo(userInfo);
          }
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      }
      setIsLoading(false);
    };

    fetchUserInformation();
  }, [user]);
  return (
    <div className="flex flex-col w-full h-full text-gray-600 items-center justify-start text-2xl gap-8 ">
      {isLoading ? (
        <div className="w-1/2 h-1/2 ">
          <SpinningLoader />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-start gap-6 pt-10">
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-20">
              <div className="bg-white p-6 rounded-lg w-11/12 lg:w-1/3">
                <h2 className="text-2xl font-semibold mb-4">Delete Profile</h2>
                {popUpError && (
                  <p className="text-red-500 mb-4">{popUpError}</p>
                )}
                <p className="mb-4">
                  Please provide your password to confirm the deletion of your
                  profile. This action cannot be undone.
                </p>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-end gap-4 text-lg">
                  <button
                    className="px-4 py-2 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400 transition"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    onClick={handleDeleteProfile}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          <CircleUser className="w-1/2 h-1/3 lg:w-1/4 lg:h-1/4" />
          <p className="text-5xl">Your profile!</p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Full Name:</p>
              {userInfo?.firstName} {userInfo?.lastName}
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Username:</p>
              <p>{userInfo?.userName}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Email:</p>
              <p>{userInfo?.email}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Bio:</p>
              <p>{userInfo?.bio}</p>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <button
              className="px-4 py-2 bg-gray-300 text-white rounded-lg font-semibold hover:bg-red-200 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              onClick={() => setIsPopupOpen(true)}
            >
              Delete Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
