declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '@hugeicons/core-free-icons' {
  export type IconSvgObject = [string, Record<string, string | number>][];

  export const ArrowUp02Icon: IconSvgObject;
  const icons: Record<string, IconSvgObject>;
  export default icons;
}
