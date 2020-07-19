import React from "react";

export const Breadcrumb = ({ children }) => {
  return (
    <div className="has-background-grey-lighter">
      <nav
        className="breadcrumb is-medium is-centered is-hidden-tablet has-arrow-separator"
        aria-label="breadcrumbs"
      >
        {children}
      </nav>
      <nav
        className="breadcrumb is-small is-hidden-mobile has-arrow-separator"
        aria-label="breadcrumbs"
      >
        {children}
      </nav>
    </div>
  );
};
