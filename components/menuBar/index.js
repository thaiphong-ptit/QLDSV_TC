import React, { useEffect, useState } from "react";

export default function MainMenu(props) {
  const isSV = JSON.parse(localStorage.getItem("isSV"));
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const [currentMenuValue, setCurrentMenuValue] = useState(
    JSON.parse(localStorage.getItem("menu"))
  );
  const [refreshMenu, setRefreshMenu] = useState(false);

  const onMenuClick = (value) => {
    let newMenuValue = currentMenuValue;
    if (props.keyMenu === "level1") {
      if (value === "admin") {
        newMenuValue.parentMenu = value;
        newMenuValue.secondMenu = isSV
          ? "registerClassTC"
          : userLogin.ROLENAME === "PGV"
          ? "class"
          : "tuition";
      } else if (value === "report") {
        newMenuValue.parentMenu = value;
        newMenuValue.secondMenu = isSV
          ? "scoreCard"
          : userLogin.ROLENAME === "PGV"
          ? "listStudent"
          : "listFeePayment";
      } else {
        newMenuValue.parentMenu = value;
        newMenuValue.secondMenu = "";
      }
    } else newMenuValue.secondMenu = value;

    localStorage.setItem("menu", JSON.stringify(newMenuValue));
    props.setCurrentMenu(value);

    setRefreshMenu(!refreshMenu);
  };

  useEffect(() => {
    setCurrentMenuValue(JSON.parse(localStorage.getItem("menu")));
    console.log(
      "JSON.parse(localStorage.getItem))",
      JSON.parse(localStorage.getItem("menu"))
    );
  }, [refreshMenu]);

  return (
    <div key={refreshMenu}>
      <ul className={`customList ${props.levelMenu}`}>
        {props?.listMenu.map((x) => (
          <li
            className={
              props?.keyMenu === "level1"
                ? currentMenuValue?.parentMenu == x.value
                  ? props.activeClass
                  : props.itemLevel
                : currentMenuValue?.secondMenu == x.value
                ? props.activeClass
                : props.itemLevel
            }
            key={x.value}
            onClick={() => onMenuClick(x.value)}
          >
            {x.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
