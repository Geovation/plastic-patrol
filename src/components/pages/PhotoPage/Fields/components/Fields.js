import React, { useState, useCallback } from "react";
import classnames from "classnames";
import Button from "@material-ui/core/Button";

import useOnOutsideClick from "hooks/useOnOutsideClick";

import CategoryField from "../../CategoryField";

import "./Fields.scss";

const INITIAL_CATEGORY_VALUES = [{ keyIndex: 0, values: { error: true } }];

const Fields = ({ imgSrc, handleChange }) => {
  const [categoryValues, setCategoryValues] = useState(INITIAL_CATEGORY_VALUES);
  const [childIndex, setNextChildIndex] = useState(categoryValues.length);
  const [totalCount, setTotalCount] = useState(0);
  const [anyCategoryErrors, setAnyCategoryErrors] = useState(false);
  const [photoEnlarged, setPhotoEnlarged] = useState(false);

  const handleClickAdd = categoryValues => {
    categoryValues.push({ keyIndex: childIndex, values: {} });
    setNextChildIndex(childIndex + 1);
    setCategoryValues(categoryValues);
    setAnyCategoryErrors(true);
    handleChange(true, categoryValues);
  };

  const handleCategoryChange = index => newValue => {
    let error = false;
    let count = 0;
    const updatedCategoryValues = categoryValues.map(categoryValue => {
      const { keyIndex, values } = categoryValue;

      if (newValue.error) error = true;

      if (index === keyIndex) {
        if (!isNaN(newValue.number)) count += Number(newValue.number);

        return { keyIndex, values: newValue };
      }

      if (!isNaN(values.number)) count += Number(values.number);

      return categoryValue;
    });

    setAnyCategoryErrors(error);
    handleChange(error, updatedCategoryValues);
    setCategoryValues(updatedCategoryValues);
    setTotalCount(count);
  };

  const handleClickRemove = useCallback(
    index => e => {
      if (categoryValues.length <= 1) return;

      const filteredCategoryValues = categoryValues.filter(
        ({ keyIndex }) => index !== keyIndex
      );

      let anyErrors = false;
      filteredCategoryValues.forEach(({ values: { error } }) => {
        if (error) anyErrors = true;
      });

      setCategoryValues(filteredCategoryValues);
      setAnyCategoryErrors(anyErrors);
      handleChange(anyErrors, filteredCategoryValues);
    },
    [categoryValues, handleChange]
  );

  const imgRef = useOnOutsideClick(() => setPhotoEnlarged(false));

  return (
    <>
      <div className="Fields__container">
        <div className="Fields__pictureThumbnailContainer">
          <img
            src={imgSrc}
            alt={""}
            className={classnames("Fields__pictureThumbnail", {
              Fields__pictureThumbnailEnlarged: photoEnlarged
            })}
            ref={imgRef}
            onClick={() => setPhotoEnlarged(!photoEnlarged)}
          />
        </div>
        <div className="Fields__numberOfPieces">
          Total number of pieces in photo: {totalCount}
        </div>
      </div>
      <div className="Fields__instruction">
        Identify each piece of rubbish in the photo
      </div>
      {categoryValues.map(({ keyIndex }) => {
        return (
          <div key={keyIndex} className="Fields__category">
            <CategoryField
              handleClickRemove={handleClickRemove(keyIndex)}
              handleChange={handleCategoryChange(keyIndex)}
            />
          </div>
        );
      })}
      <div className="Fields__button">
        <Button
          disabled={anyCategoryErrors}
          fullWidth
          variant="outlined"
          onClick={() => handleClickAdd(categoryValues)}
        >
          add another category
        </Button>
      </div>
    </>
  );
};

export default Fields;
