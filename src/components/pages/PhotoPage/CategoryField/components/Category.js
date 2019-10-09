import React, { useState, useEffect, useCallback } from "react";

import RemoveIcon from "@material-ui/icons/RemoveCircleOutline";

import { FieldLabelWithInput } from "./CategoryDropdown/FieldLabel";

import { validateString, validateIsPositiveNumber } from "./validation";
import CategoryDropdown from "./CategoryDropdown";

import "./Category.scss";

const CategoryField = ({ handleClickRemove, handleChange }) => {
  const [numberOfPieces, setNumberOfPieces] = useState("");
  const [brand, setBrand] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const handleChangeCallback = useCallback(value => handleChange(value), [
    handleChange
  ]);

  //TODO: come up with a nicer way of doing this with the whole tree
  useEffect(() => {
    const validBrand = validateString(brand);
    const validCategory =
      validBrand &&
      validateIsPositiveNumber(numberOfPieces) &&
      validateIsPositiveNumber(selectedOption && selectedOption.key);

    handleChangeCallback({
      leafKey: selectedOption && selectedOption.key,
      number: numberOfPieces,
      brand: validBrand && brand.trim(),
      error: !validCategory
    });
  }, [numberOfPieces, brand, selectedOption]);

  return (
    <div className={"CategoryField__container"}>
      <div className="CategoryField__dropdownContainer">
        <CategoryDropdown
          label="Type of rubbish"
          placeholder={"e.g. plastic bottle"}
          value={selectedOption}
          setValue={setSelectedOption}
        />
        <RemoveIcon onClick={handleClickRemove} />
      </div>

      {selectedOption && (
        <>
          <FieldLabelWithInput
            label={`Brand of ${selectedOption.label}`}
            placeholder={'e.g. coca cola or "none"'}
            value={brand}
            setValue={setBrand}
            validationFn={validateString}
            required
          />

          <FieldLabelWithInput
            label="Number of pieces"
            placeholder={"e.g. 1"}
            validationFn={validateIsPositiveNumber}
            value={numberOfPieces}
            setValue={setNumberOfPieces}
            required
          />
        </>
      )}
    </div>
  );
};

export default CategoryField;
