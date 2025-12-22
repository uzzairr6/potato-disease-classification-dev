import { useNavigate } from 'react-router-dom';
import { authService } from '../../lib/auth';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <header className="w-full max-w-7xl flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-4 sm:px-6 py-4">
      <div className="flex items-center gap-4 text-white cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
            local_florist
          </span>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Potato Guard</h2>
      </div>
      <nav className="hidden md:flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">History</a>
          <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">About</a>
          {authService.isAuthenticated() ? (
            <button
              onClick={handleLogout}
              className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors"
            >
              Sign Up / Login
            </button>
          )}
        </div>
      </nav>
      <button className="md:hidden text-white">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
};