import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TitleBarButton = ({ buttonIcon }) => {
  return (
    <button className="btn">
      <FontAwesomeIcon icon={buttonIcon} />
    </button>
  );
};
