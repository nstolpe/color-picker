// src/components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  text: '',
  onClick: () => {},
};

export default Button;
