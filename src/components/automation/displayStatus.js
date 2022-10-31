import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../css/sass_css/styles.scss";

export const DisplayStatus = (props) => {
  const state = useSelector((state) => state);

  return (
    <div className="display-status container-fluid">
      <div className="row">
        <div className="col col-12 mt-1"></div>
      </div>
    </div>
  );
};
