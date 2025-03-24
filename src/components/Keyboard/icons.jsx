export const iconMap = {
    backspace: <span className="material-icons">backspace</span>,
    caps: <span className="material-icons">keyboard_capslock</span>,
    enter: <span className="material-icons">keyboard_return</span>,
    space: <span className="material-icons">space_bar</span>,
    done: <span className="material-icons">check_circle</span>,
    theme: (isDarkMode) => (isDarkMode ? (
      <span className="material-icons">wb_sunny</span>
    ) : (
      <span className="material-icons">brightness_3</span>
    )),
  };