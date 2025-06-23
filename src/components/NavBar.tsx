import { CircleUser, Search } from "lucide-react";
import potOfFood from "/pot-of-food.svg";
import { Link } from "react-router-dom";
import DropDownNavBar from "@/components/DropDownNavBar";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user } = useAuth();
  return (
    <div className="flex flex-row w-full h-22 px-4 py-2 bg-mainYellow">
      <div className="flex flex-row items-center w-full gap-12">
        <Link
          to="/"
          className="flex items-center justify-center 
             bg-white rounded-full 
             h-13 w-18 sm:h-14 sm:w-15"
        >
          <img
            src={potOfFood}
            alt="Pot of Food"
            className="h-9/10 w-9/10 pb-2"
          />
        </Link>

        <div className="flex flex-row items-center justify-end w-full pr-2 lg:pr-10">
          {/* Desktop View */}
          <div className="hidden sm:flex flex-row items-center gap-10 text-white w-1/3 justify-between">
            <Link
              to="/search"
              className="text-xl flex flex-row gap-2 items-center"
            >
              Search
              <Search />
            </Link>
            <Link to="/dashboard" className="text-xl">
              My Dashboard
            </Link>
            {/* Login logic if user logout if not login */}
            {user ? (
              <div className="text-xl">
                <Link to="/profile">
                  <CircleUser className="w-10 h-10" />
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <span className="text-xl">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile View (Dropdown placeholder) */}
          <div className="flex sm:hidden">
            {/* Replace this div with your actual dropdown later */}
            <DropDownNavBar />
          </div>
        </div>
      </div>
    </div>
  );
}
