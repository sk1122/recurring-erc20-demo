import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const Header = () => {
    return (
      <div className="absolute top-0 left-0 px-20 py-6 h-1/6 w-full flex justify-center items-center">
        <div className="w-full h-full text-cal text-3xl">ERC20 Recurring</div>
        <div className="w-full h-full text-matter flex justify-end space-x-3">
            <Link href="/allowance" className="text-matter text-lg font-bold">
              Allowances
            </Link>
          <span>
            <ConnectButton />
          </span>
        </div>
      </div>
    );
}

export default Header