import PropTypes from "prop-types";

export function loader({ src, width }) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH}${src}?imwidth=${width}`;
}

loader.PropTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};

export default loader;
