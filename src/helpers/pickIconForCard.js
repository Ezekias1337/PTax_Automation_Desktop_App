import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTriangleExclamation,
  faWifi,
  faFileImport,
  faFileInvoiceDollar,
  faListCheck,
  faAddressCard,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

export const pickIconForCard = (iconName) => {
  switch (iconName) {
    case "faPlus":
      return <FontAwesomeIcon icon={faPlus} />;
    case "faTriangleExclamation":
      return <FontAwesomeIcon icon={faTriangleExclamation} />;
    case "faWifi":
      return <FontAwesomeIcon icon={faWifi} />;
    case "faFileImport":
      return <FontAwesomeIcon icon={faFileImport} />;
    case "faFileInvoiceDollar":
      return <FontAwesomeIcon icon={faFileInvoiceDollar} />;
    case "faListCheck":
      return <FontAwesomeIcon icon={faListCheck} />;
    case "faAddressCard":
      return <FontAwesomeIcon icon={faAddressCard} />;
    case "faPencil":
      return <FontAwesomeIcon icon={faPencil} />;
    default:
      return null;
  }
};
