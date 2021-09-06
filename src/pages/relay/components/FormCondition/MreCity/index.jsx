/**
 * 城市选择
 */
import React, { useEffect, useState } from "react";
import TextBlock from "../Text";
import CitySelect from "./CitySelect";
import "../index.scss";

export default ({ value, placeholder, disabled, onSubmit }) => {
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setData(value);
  }, [value]);

  return (
    <>
      <TextBlock
        value={data}
        placeholder={placeholder}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setShow(true);
        }}
      ></TextBlock>
      <CitySelect
        value={index}
        show={show}
        onClose={setShow}
        onSubmit={(val) => {
          const { data, text } = val;
          console.log(data);
          setIndex(val);
          setData(text.join(""));
          onSubmit(data);
        }}
      ></CitySelect>
    </>
  );
};
