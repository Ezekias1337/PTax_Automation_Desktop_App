import "../css/vanilla_css/styles.css";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";

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
