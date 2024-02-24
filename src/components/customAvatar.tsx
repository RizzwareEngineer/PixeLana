import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { avatars } from "@/lib/avatars"
import {SvgIcon} from "@/components/customSvg"

const leftPath = "M168 48v160a8 8 0 0 1-13.66 5.66l-80-80a8 8 0 0 1 0-11.32l80-80A8 8 0 0 1 168 48"

export function AvatarPicker() {
  const size = "48";
  return (
    <div className="flex items-center justify-center ">
      <SvgIcon pathData={leftPath} width={size} height={size} />
    </div>
  )
}