//@flow

import * as React from "react";
import classNames from "classnames";

import "./NavDots.scss";

const NavDots = props => {
  const { numberOfDots, activeIndex, onClick, wrapperClass } = props;

  return (
    <div className={classNames("NavDots", wrapperClass)}>
      {Array(numberOfDots)
        .fill()
        .map((_, index) => (
          <NavDot
            key={index}
            id={index}
            active={index === activeIndex}
            onClick={onClick}
          />
        ))}
    </div>
  );
};

const NavDot = ({ id, active, onClick }) => {
  const handleClick = () => onClick && onClick(id);

  return (
    <div
      className={classNames("NavDot", {
        "NavDot--clickable": onClick
      })}
      onClick={handleClick}
    >
      <div
        className={classNames("NavDot__inner", {
          "NavDot__inner--active": active
        })}
      />
    </div>
  );
};

export default NavDots;
