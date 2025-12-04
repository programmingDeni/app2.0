import { useNavigate } from "react-router-dom";

export const BackButton = ({ label = "Zurück" }: { label?: string }) => {
  const navigate = useNavigate();
  return (
    <button   onClick={() => {
    // Verhindere Navigation zu Login/Register wenn eingeloggt
    const previousPath = document.referrer;
    if ((previousPath.includes('/login') || previousPath.includes('/register'))) {
      navigate('/home');
    } else {
      navigate(-1);
    }
  }} className="btn btn--secondary">
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      {label}
    </button>
  );
};