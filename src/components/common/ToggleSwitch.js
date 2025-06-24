import React, { useId } from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ label, isToggled, onToggle }) => {
  const switchId = useId();

  return (
    <div className="toggle-switch-container">
      {label && <label htmlFor={switchId} className="toggle-label">{label}</label>}
      <button
        role="switch"
        aria-checked={isToggled}
        aria-labelledby={label ? switchId : undefined}
        onClick={onToggle}
        id={switchId}
        className={`toggle-switch ${isToggled ? 'on' : 'off'}`}
      >
        <span className="toggle-slider" />
      </button>
    </div>
  );
};

export default ToggleSwitch;
