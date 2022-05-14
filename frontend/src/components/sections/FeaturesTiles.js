import React, { useState } from "react";
import classNames from "classnames";
import { SectionTilesProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import Image from "../elements/Image";
import Button from "../elements/Button";

const propTypes = {
  ...SectionTilesProps.types,
};

const defaultProps = {
  ...SectionTilesProps.defaults,
};
const FeaturesTiles = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {
  const [items, setItems] = useState([]);

  const outerClasses = classNames(
    "features-tiles section",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "features-tiles-inner section-inner pt-0",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  const tilesClasses = classNames(
    "tiles-wrap center-content",
    pushLeft && "push-left"
  );

  const sectionHeader = {
    title: "History",
    paragraph: `Below you can find the history of all your conversions. ${
      localStorage.getItem("jwt")
        ? "Click the button to fetch it!"
        : "Sign in to see it!"
    }`,
  };

  const getHistory = async (e) => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/documents`,
      {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("jwt")
            ? "Bearer " + localStorage.getItem("jwt")
            : undefined,
        },
      }
    );

    const res = await response.json();
    console.log(res);

    setItems(res);
  };

  const list = items?.map((item) => (
    <div key={item.id} className="tiles-item">
      <div className="tiles-item-inner">
        <div className="features-tiles-item-header">
          <div className="features-tiles-item-image mb-16">
            <Image
              src={require("./../../assets/images/feature-tile-icon-02.svg")}
              alt="Features tile icon 01"
              width={64}
              height={64}
            />
          </div>
        </div>

        <div className="features-tiles-item-content">
          <h4 className="mt-0 mb-8">{item.originalFile.name}</h4>
          <p>Took: {item.duration} Seconds.</p>
          <h6 className="m-0 p-0">Original Document</h6>
          <Button
            className="m-4"
            tag="a"
            target="_blank"
            color="primary"
            wideMobile
            href={item.originalFile.url}
          >
            Click Here
          </Button>
          <h6 className="m-0 p-0">PDF Document</h6>
          <Button
            className="m-4"
            tag="a"
            target="_blank"
            color="primary"
            wideMobile
            href={item.pdfFile.url}
          >
            Click Here
          </Button>
        </div>
      </div>
    </div>
  ));

  let buttons;
  const HistoryButton = (props) => (
    <Button onClick={props.onClick} color="primary" wideMobile>
      Get History!
    </Button>
  );

  if (localStorage.getItem("jwt")) {
    buttons = <HistoryButton onClick={getHistory} />;
  } else {
    buttons = undefined;
  }

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          {buttons}
          <div className={tilesClasses}>
            {/* ITEMS */}
            {list}
          </div>
        </div>
      </div>
    </section>
  );
};

FeaturesTiles.propTypes = propTypes;
FeaturesTiles.defaultProps = defaultProps;

export default FeaturesTiles;
