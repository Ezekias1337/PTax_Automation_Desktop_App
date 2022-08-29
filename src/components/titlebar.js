import {
  faWindowMinimize,
  faWindowMaximize,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { TitleBarButton } from "./buttons/titleBarButton";
import "../css/vanilla_css/title-bar.css";

export const TitleBar = () => {
  return (
    <div id="titleBar">
      <div className="row">
        <div className="col col-9"></div>
        <div id="titleBarButtonContainer" className="col col-3">
          <TitleBarButton buttonIcon={faWindowMinimize} />
          <TitleBarButton buttonIcon={faWindowMaximize} />
          <TitleBarButton buttonIcon={faWindowClose} />
        </div>
      </div>
    </div>
  );
};
