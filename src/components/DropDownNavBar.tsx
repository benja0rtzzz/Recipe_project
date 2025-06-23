import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignJustify, CircleUser, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function DropDownNavBar() {
  const { user } = useAuth();
  return (
    <div className="w-full flex flex-row items-center gap-4 ">
      <Link to="/search" className="flex flex-row gap-2 items-center">
        <Search className="text-white h-7 w-7" />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AlignJustify className="text-white h-9 w-9" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {!user ? (
              <Link to="/login" className="flex flex-row items-center gap-2">
                <CircleUser className="w-4 h-4" />
                Login
              </Link>
            ) : (
              <Link to="/profile" className="flex flex-row items-center gap-2">
                <CircleUser className="w-4 h-4" />
                My Account
              </Link>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/dashboard"> My Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
