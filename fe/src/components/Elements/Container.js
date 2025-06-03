import PropTypes from "prop-types";
import { cn } from "@/utils/helpers/cn";

export function Container({ children, className }) {
  return <div className={cn("relative backdrop-blur-xl", className)}>{children}</div>;
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
