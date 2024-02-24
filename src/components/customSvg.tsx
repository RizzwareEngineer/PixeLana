import React from "react";

interface SvgIconProps {
  pathData: string;
  width?: string;
  height?: string;
  viewBox?: string;
  className?: string;
  pathClass?: React.SVGProps<SVGPathElement>;
}

export const SvgIcon: React.FC<SvgIconProps> = ({
  pathData,
  width = "24", // Default width
  height = "24", // Default height
  viewBox = "0 0 24 24", // Default viewBox
  className,
  pathClass,
}) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={pathData} {...pathClass} fill="black"/>
  </svg>
);

export default SvgIcon;
