import React, { useState, useEffect } from "react";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import Panel from "rc-color-picker/lib/Panel";
import "antd/dist/antd.css";
import "./styles.css";

export default function InputColor({ color, onChange, isEditing }) {
  const [internalColor, setInternalColor] = useState(color);

  const handleChangePanel = (color) => {
    setInternalColor(color.color);

    if (onChange) {
      onChange(color);
    }
  };

  useEffect(() => {
    setInternalColor(color);
  }, [color]);

  const handleChangeInput = (e) => {
    setInternalColor(e.target.value);

    if (onChange) {
      onChange(e.target.value);
    }
  };

  const overlay = (
    <div>
      <Panel
        color={internalColor}
        enableAlpha={false}
        onChange={handleChangePanel}
      />
    </div>
  );

  return (
    <>
      <Input
        disabled
        value={internalColor || ""}
        onChange={handleChangeInput}
        suffix={
          <Dropdown disabled={isEditing} trigger={["click"]} overlay={overlay}>
            <Button style={{ background: internalColor }}> </Button>
          </Dropdown>
        }
      />
    </>
  );
}
