import React, { useState } from "react";
import classNames from "classnames";
import { SectionProps } from "../../utils/SectionProps";
import ButtonGroup from "../elements/ButtonGroup";
import Button from "../elements/Button";
import Input from "../elements/Input";
import FeaturesTiles from "./FeaturesTiles";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const propTypes = {
  ...SectionProps.types,
};

const defaultProps = {
  ...SectionProps.defaults,
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formElement = document.querySelector("form");
  const request = new XMLHttpRequest();
  const formData = new FormData();
  const formElements = formElement.elements;
  const data = {};

  for (let i = 0; i < formElements.length; i++) {
    const currentElement = formElements[i];
    if (currentElement.type === "file") {
      for (let i = 0; i < currentElement.files.length; i++) {
        const file = currentElement.files[i];
        // this MUST have the (files.), the element name MUST be (originalFile)
        formData.append(`files.${currentElement.name}`, file, file.name);
      }
    }
  }

  formData.append("data", JSON.stringify(data));

  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/documents`,
    {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("jwt")
          ? "Bearer " + localStorage.getItem("jwt")
          : undefined,
      },
      body: formData,
    }
  );

  const res = (await response.json()).data.attributes;

  console.log(res);
  window.open(res.pdfFile.url);
};

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {
  const outerClasses = classNames(
    "hero section center-content",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "hero-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  return (
    <section {...props} className={outerClasses}>
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1
              className="mt-0 mb-16 reveal-from-bottom"
              data-reveal-delay="200"
            >
              Document <span className="text-color-primary">Converter</span>
            </h1>
            <div className="container-xs">
              <p
                className="m-0 mb-32 reveal-from-bottom"
                data-reveal-delay="400"
              >
                Convert any Office documents to PDF files, and sign in to have a
                full history of them!
              </p>

              {/* Stylize this form */}
              <form onSubmit={handleSubmit}>
                <input type="file" name="originalFile" />
                <input type="submit" value="Convert" />
              </form>
            </div>
          </div>
        </div>

        <FeaturesTiles />
      </div>
    </section>
  );
};

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
