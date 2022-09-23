import { BackButton } from "./buttons/backButton";
import { HomeButton } from "./buttons/homeButton";

export const Header = ({ pageTitle, includeArrow = true }) => {
  return (
    <>
      <div className="row mx-1">
        <div className="col col-12 mt-2">
          <BackButton></BackButton>
          {includeArrow === true ? <HomeButton></HomeButton> : <></>}
        </div>
      </div>
      <div className="row mx-1">
        <div className="col col-12 page-title">
          <h1>{pageTitle}</h1>
        </div>
      </div>
    </>
  );
};
