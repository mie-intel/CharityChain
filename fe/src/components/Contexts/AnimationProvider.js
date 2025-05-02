"use client";

import { useEffect } from "react";
import PropTypes from "prop-types";
import LocomotiveScroll from "locomotive-scroll";
import AOS from "aos";
import "aos/dist/aos.css";

const AnimationProvider = ({ children }) => {
  useEffect(() => {
    new LocomotiveScroll({ smooth: true, smoothMobile: true });
    AOS.init();
  }, []);
  return <>{children}</>;
};

export default AnimationProvider;

AnimationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
