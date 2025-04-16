import SvgInset from "@components/SvgInset";

export function TxtIcon({ size = 48 }: { size?: number }) {
   return (
      <SvgInset size={size} svgUrl="icons/ic-file.svg" />
   )
}


export function DownloadIcon() {
   return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M9.375 11.4071V1.66602L10.625 1.66602V11.4072L13.7501 8.28214L14.634 9.16602L10.0001 13.7999L5.36621 9.16602L6.25009 8.28214L9.375 11.4071Z" fill="black"/>
         <path fill-rule="evenodd" clip-rule="evenodd" d="M2.91699 12.916V15.8327C2.91699 16.5231 3.47664 17.0827 4.16699 17.0827H15.8337C16.524 17.0827 17.0837 16.5231 17.0837 15.8327V12.916H18.3337V15.8327C18.3337 17.2134 17.2144 18.3327 15.8337 18.3327H4.16699C2.78628 18.3327 1.66699 17.2134 1.66699 15.8327V12.916H2.91699Z" fill="black"/>
      </svg>
   )
}

export function CollapseIcon() {
   return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M16.6663 2.5H3.33301C1.95467 2.5 0.833008 3.62167 0.833008 5V15C0.833008 16.3783 1.95467 17.5 3.33301 17.5H16.6663C18.0447 17.5 19.1663 16.3783 19.1663 15V5C19.1663 3.62167 18.0447 2.5 16.6663 2.5ZM2.49967 15V5C2.49967 4.54083 2.87384 4.16667 3.33301 4.16667H12.4997V15.8333H3.33301C2.87384 15.8333 2.49967 15.4592 2.49967 15Z" fill="black"/>
      </svg>
   )
}