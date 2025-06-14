import { Link } from "react-router-dom";

interface LogoProps {
  title: string;
}

const Logo = ({ title }: LogoProps) => {
  return (
    <div className="flex items-center space-x-3">
            <Link to="/">        
                <img src="/download.png" alt="YC Icon" className="w-10 h-10 mr-2" />
            </Link>
        <span className="font-semibold text-gray-900">{title}</span>
    </div>
  )
}

export default Logo;